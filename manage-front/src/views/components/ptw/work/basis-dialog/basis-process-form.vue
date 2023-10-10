<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item label="审批流程:" :required="processable">
          <el-form
            v-if="!form.process || !form.process.length"
            ref="tempForm"
            :model="form"
            label-width="0"
          >
            <el-form-item
              prop="process"
              :rules="[
                {
                  required: processable,
                  validator: validateTask,
                  trigger: 'blur'
                }
              ]"
            >
              暂未配置审批流程
            </el-form-item>
          </el-form>
          <el-steps
            v-else
            :active="form.active"
            direction="vertical"
            process-status="wait"
            class="process-step"
          >
            <el-step
              v-for="(task, tIndex) in form.process"
              :key="tIndex"
              :title="task.nodeName"
            >
              <template slot="description">
                <el-row
                  v-for="(aprov, aIndex) in task.approveTaskList"
                  :key="aIndex"
                  class="process-aprov"
                >
                  <el-col :span="4">{{ aprov.taskName }}</el-col>
                  <el-col :span="20">
                    <el-form-item
                      label="审批人:"
                      label-width="100px"
                      :prop="
                        'process.' +
                          tIndex +
                          '.approveTaskList.' +
                          aIndex +
                          '.value'
                      "
                      :rules="[
                        {
                          required: true,
                          message: '审批人不能为空',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <span
                        v-if="
                          !!form.active &&
                            !tIndex &&
                            aprov.realCommitUserName &&
                            aprov.realCommitUserName.length
                        "
                      >
                        {{ aprov.realCommitUserName }}
                      </span>
                      <treeselect
                        v-else
                        v-model="aprov.value"
                        :options="userOptions"
                        :normalizer="userNormalizer"
                        :disabled="
                          !!form.active &&
                            !tIndex &&
                            (!aprov.realCommitUserName ||
                              !aprov.realCommitUserName.length)
                        "
                        :show-count="true"
                        :disable-branch-nodes="false"
                        :clearable="true"
                        :searchable="false"
                        :multiple="true"
                        valueFormat="object"
                        value-consists-of="LEAF_PRIORITY"
                        noResultsText="未找到结果..."
                        placeholder="请选择人员"
                        clearAllText="清除"
                        @input="handleChange(tIndex, aIndex, $event)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </el-step>
          </el-steps>
        </el-form-item>
      </el-col>
      <el-col v-if="gasable && SGinProcess" :span="24">
        <el-form-item label="气体检测频率:" prop="gasRate">
          <el-select
            v-model="form.gasRate"
            :disabled="!editable"
            clearable
            placeholder="请选择气体检测频率"
          >
            <el-option
              v-for="item in rateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { treeUser } from "@/api/modules/sys/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "BasisProcessForm",
  components: { Treeselect },
  props: {
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 弹出层类型1、2-作业票申请,3-作业票评估审批,4-作业票延期申请
    type: {
      type: Number,
      default: 1
    },
    // 是否主票
    isParent: {
      type: Boolean,
      default: true
    },
    // 流程是否必须
    processable: {
      type: Boolean,
      default: true
    },
    // 气体检测频率是否可用
    gasable: {
      type: Boolean,
      default: false
    },
    // 是否可见
    visible: {
      type: Boolean,
      default: false
    },
    // 表单标题宽度
    labelWidth: {
      type: String,
      default: "125px"
    }
  },
  data() {
    return {
      // 人员数据
      userOptions: [],
      // 自定义人员树节点key
      userNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      // 表单参数
      form: {
        startIdx: undefined,
        endIdx: undefined,
        process: [],
        active: 0,
        taskNodeModelList: [],
        gasRate: undefined
      },
      // 表单验证
      rules: {
        gasRate: [
          { required: true, message: "气体检测频率不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    // 气体检测频率
    rateOptions() {
      return this.$store.state.common.gasCheckRates;
    },
    // 流程中是否现场气体检测
    SGinProcess() {
      return Boolean(
        this.form.taskNodeModelList.find(
          item => item.nodeName === "现场气体检测"
        )
      );
    }
  },
  watch: {
    visible(val) {
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(data) {
      this.reset();
      this.getUserTree();
      if (data) {
        const parseData = JSON.parse(JSON.stringify(data));
        const tasks = parseData.taskNodeModelList || [];
        if (tasks.length) {
          tasks.forEach(task => {
            if (task.approveTaskList && task.approveTaskList.length) {
              task.approveTaskList.forEach(item => {
                item.value = item.userIds.map((id, index) => {
                  return {
                    deptId: id,
                    name: item.userNames[index]
                  };
                });
              });
            }
          });
        }
        this.form.taskNodeModelList = tasks;
        this.generateDisplayData(tasks);
        this.form.gasRate = parseData.gasRate || undefined;
      }
    },
    /** 根据类型生成需要调整的流程节点 */
    generateDisplayData(tasks) {
      if (tasks && tasks.length) {
        if ([1, 2, 3].includes(this.type)) {
          this.form.startIdx = 0;
          this.form.endIdx = this.SGinProcess ? 3 : 2;
        } else if (this.type === 4) {
          const idx = tasks.findIndex(f => f.nodeName === "延期签发");
          this.form.startIdx = idx;
          this.form.endIdx = idx;
        } else if (this.type === 5) {
          const idx = tasks.findIndex(f => f.nodeName === "完工审批");
          this.form.startIdx = idx;
          this.form.endIdx = idx;
        }
        this.form.process = tasks.slice(
          this.form.startIdx,
          this.form.endIdx + 1
        );
        if (this.type === 3) this.form.active = 1;
      }
    },
    /** 查询人员树 */
    getUserTree() {
      treeUser().then(response => {
        this.userOptions = this.formatTree(response.result);
      });
    },
    /** 节点名称、人员更改 */
    handleChange(tIdx, aIdx, value, instanceId) {
      this.form.process[tIdx].approveTaskList[aIdx].userIds = [];
      this.form.process[tIdx].approveTaskList[aIdx].userNames = [];
      if (value && value.length)
        value.forEach(item => {
          this.form.process[tIdx].approveTaskList[aIdx].userIds.push(
            item.deptId
          );
          this.form.process[tIdx].approveTaskList[aIdx].userNames.push(
            item.name
          );
        });
    },
    /** 验证表单 */
    validateTask(rule, value, callback) {
      if (this.processable && (!value || !value.length))
        return callback(new Error("审批流程不能为空"));
      callback();
    },
    validate() {
      let submitForm;
      if (this.processable && (!this.form.process || !this.form.process.length))
        submitForm = this.$refs.tempForm;
      else submitForm = this.$refs.form;
      return new Promise((resolve, reject) => {
        submitForm.validate(valid => {
          if (valid) {
            for (let i = this.form.startIdx; i < this.form.endIdx; i++) {
              this.form.taskNodeModelList[i] = this.form.process[
                i - this.form.startIdx
              ];
            }
            const parseData = JSON.parse(JSON.stringify(this.form));
            resolve({
              taskNodeModelList: parseData.taskNodeModelList,
              gasRate: parseData.gasRate
            });
          } else {
            reject();
          }
        });
      });
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        startIdx: undefined,
        endIdx: undefined,
        process: [],
        active: 0,
        taskNodeModelList: [],
        gasRate: undefined
      };
      // this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      if (!this.form.process || !this.form.process.length)
        this.$refs["tempForm"].clearValidate();
      else this.$refs["form"].clearValidate();
    }
  }
};
</script>

<style lang="scss">
.process-step {
  .el-step.is-vertical {
    margin-bottom: -6px;
  }
  .el-step__main {
    margin-top: 6px;
  }
  .el-step.is-vertical .el-step__line {
    top: 6px;
  }
  .el-step__title.is-wait {
    color: #606266;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.process-aprov {
  font-size: 14px;
  line-height: 40px;
  color: #606266;
}
</style>
