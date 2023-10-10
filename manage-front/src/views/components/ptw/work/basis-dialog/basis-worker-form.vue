<template>
  <el-form ref="form" :model="form" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item
          :label="blindable ? '施工人员-抽:' : '施工人员:'"
          class="worker-container"
          required
        >
          <el-row v-for="(item, index) in form.workerList" :key="index">
            <el-col :span="21">
              <el-row>
                <el-col :span="7">
                  <el-form-item :prop="'workerList.' + index + '.deptId'">
                    <treeselect
                      v-model="item.deptId"
                      :options="deptOptions"
                      :normalizer="deptNormalizer"
                      :disabled="!editable"
                      :show-count="true"
                      :disable-branch-nodes="false"
                      :clearable="true"
                      :searchable="true"
                      :placeholder="editable ? '请选择部门' : ''"
                      noResultsText="未找到结果..."
                      clearAllText="清除"
                      @select="handleDeptSelect(index, 1, $event)"
                      @input="handleDeptChange(index, 1, $event)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item :prop="'workerList.' + index + '.team'">
                    <el-select
                      v-model="item.team"
                      :disabled="!editable"
                      :placeholder="editable ? '请选择班组' : ''"
                      filterable
                      clearable
                      @click.native="getTeamList(item.deptId)"
                      @change="handleTATChange(index, 1, $event)"
                    >
                      <el-option
                        v-for="dict in teamOptions"
                        :key="dict.label"
                        :label="dict.label"
                        :value="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item
                    :prop="'workerList.' + index + '.certificateType'"
                  >
                    <el-select
                      v-model="item.certificateType"
                      :disabled="!editable"
                      :placeholder="editable ? '请选择证书种类' : ''"
                      filterable
                      clearable
                      style="width:200px"
                      @change="handleTATChange(index, 1, $event)"
                    >
                      <el-option
                        v-for="dict in typeOptions"
                        :key="dict.label"
                        :label="dict.label"
                        :value="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <el-form-item
                    :prop="'workerList.' + index + '.userName'"
                    :rules="[
                      {
                        required: true,
                        message: '人员不能为空',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-select
                      v-model="item.userName"
                      :disabled="!editable"
                      placeholder="请选择人员"
                      filterable
                      clearable
                      @click.native="
                        getUserList(item.dept, item.team, item.certificateType)
                      "
                      @change="handleUserChange(index, 1, $event)"
                    >
                      <el-option
                        v-for="dict in userOptions"
                        :key="dict.name"
                        :label="dict.name"
                        :value="dict.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                  <el-form-item
                    :prop="'workerList.' + index + '.certificateNumber'"
                  >
                    <el-input
                      v-model="item.certificateNumber"
                      :disabled="!editable"
                      :placeholder="editable ? '请输入证书编号' : ''"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col v-if="editable" :span="3">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                circle
                @click="handleAdd(index, 1)"
              ></el-button>
              <el-button
                v-if="form.workerList.length > 1"
                type="danger"
                icon="el-icon-minus"
                size="mini"
                circle
                @click="handleDelete(index, 1)"
              ></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col v-if="blindable" :span="24">
        <el-form-item label="施工人员-堵:" class="worker-container" required>
          <el-row v-for="(item, index) in form.workerDuList" :key="index">
            <el-col :span="21">
              <el-row>
                <el-col :span="7">
                  <el-form-item :prop="'workerDuList.' + index + '.deptId'">
                    <treeselect
                      v-model="item.deptId"
                      :options="deptOptions"
                      :normalizer="deptNormalizer"
                      :disabled="!editable"
                      :show-count="true"
                      :disable-branch-nodes="false"
                      :clearable="true"
                      :searchable="false"
                      :placeholder="editable ? '请选择部门' : ''"
                      noResultsText="未找到结果..."
                      clearAllText="清除"
                      @select="handleDeptSelect(index, 2, $event)"
                      @input="handleDeptChange(index, 2, $event)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6" :offset="1">
                  <el-form-item :prop="'workerDuList.' + index + '.team'">
                    <el-select
                      v-model="item.team"
                      :disabled="!editable"
                      :placeholder="editable ? '请选择班组' : ''"
                      clearable
                      @click.native="getTeamList(item.deptId)"
                      @change="handleTATChange(index, 2, $event)"
                    >
                      <el-option
                        v-for="dict in teamOptions"
                        :key="dict.label"
                        :label="dict.label"
                        :value="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item
                    :prop="'workerDuList.' + index + '.certificateType'"
                  >
                    <el-select
                      v-model="item.certificateType"
                      :disabled="!editable"
                      :placeholder="editable ? '请选择证书种类' : ''"
                      clearable
                      style="width:200px"
                      @change="handleTATChange(index, 2, $event)"
                    >
                      <el-option
                        v-for="dict in typeOptions"
                        :key="dict.label"
                        :label="dict.label"
                        :value="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <el-form-item
                    :prop="'workerDuList.' + index + '.userName'"
                    :rules="[
                      {
                        required: true,
                        message: '人员不能为空',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-select
                      v-model="item.userName"
                      :disabled="!editable"
                      placeholder="请选择人员"
                      clearable
                      @click.native="
                        getUserList(item.dept, item.team, item.certificateType)
                      "
                      @change="handleUserChange(index, 2, $event)"
                    >
                      <el-option
                        v-for="dict in userOptions"
                        :key="dict.name"
                        :label="dict.name"
                        :value="dict.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                  <el-form-item
                    :prop="'workerDuList.' + index + '.certificateNumber'"
                  >
                    <el-input
                      v-model="item.certificateNumber"
                      :disabled="!editable"
                      :placeholder="editable ? '请输入证书编号' : ''"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col v-if="editable" :span="3">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                circle
                @click="handleAdd(index, 2)"
              ></el-button>
              <el-button
                v-if="form.workerDuList.length > 1"
                type="danger"
                icon="el-icon-minus"
                size="mini"
                circle
                @click="handleDelete(index, 2)"
              ></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="施工使用工具:" prop="tool">
          <el-input
            v-model="form.tool"
            :disabled="!editable"
            :placeholder="editable ? '请输入施工使用工具' : ''"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { deptTree } from "@/api/modules";
import { listTeam } from "@/api/modules/sys/dept";
import { listWorker } from "@/api/modules/sys/worker";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "BasisWorkerForm",
  components: { Treeselect },
  props: {
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
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
    },
    // 是否是盲板抽堵作业
    blindable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 部门数据字典
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      // 班组数据字典
      teamOptions: [],
      // 人员数据字典
      userOptions: [],
      // 表单参数
      form: {
        tool: "",
        workerList: [
          {
            deptId: undefined,
            dept: "",
            team: "",
            certificateType: "",
            userName: "",
            certificateNumber: ""
          }
        ],
        workerDuList: [
          {
            deptId: undefined,
            dept: "",
            team: "",
            certificateType: "",
            userName: "",
            certificateNumber: ""
          }
        ]
      }
    };
  },
  computed: {
    /** 证书种类 */
    typeOptions() {
      return this.$store.state.common.specialWorkTypes;
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
      this.getDeptTree();
      if (data) {
        const parseData = JSON.parse(JSON.stringify(data));
        this.form.tool = parseData.tool;
        this.form.workerList = parseData.workerList || [
          {
            deptId: undefined,
            dept: "",
            team: "",
            certificateType: "",
            userName: "",
            certificateNumber: ""
          }
        ];
        this.form.workerDuList = parseData.workerDuList || [
          {
            deptId: undefined,
            dept: "",
            team: "",
            certificateType: "",
            userName: "",
            certificateNumber: ""
          }
        ];
      }
    },
    /** 查询当前用户部门树 */
    getDeptTree() {
      deptTree().then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 查询班组列表 */
    getTeamList(deptId) {
      if (deptId != undefined) {
        listTeam(deptId).then(response => {
          const result = response.result.map(item => {
            return { value: item.deptId, label: item.name };
          });
          this.teamOptions = result;
        });
      } else {
        this.teamOptions = [];
      }
    },
    /** 查询人员列表 */
    getUserList(dept, team, certificateType) {
      listWorker({ dept, team, certificateType, page: 1, limit: 1000000 }).then(
        response => {
          const result = response.result;
          this.userOptions = result.list;
        }
      );
    },
    /** 部门选择 */
    handleDeptSelect(index, type, node, instanceId) {
      if (type === 1) {
        this.form.workerList[index].dept = node.name;
        this.form.workerList[index].userName = "";
        this.form.workerList[index].certificateNumber = "";
      } else {
        this.form.workerDuList[index].dept = node.name;
        this.form.workerDuList[index].userName = "";
        this.form.workerDuList[index].certificateNumber = "";
      }
    },
    handleDeptChange(index, type, value, instanceId) {
      if (!value) {
        if (type === 1) {
          this.form.workerList[index].dept = "";
          this.form.workerList[index].userName = "";
          this.form.workerList[index].certificateNumber = "";
        } else {
          this.form.workerDuList[index].dept = "";
          this.form.workerDuList[index].userName = "";
          this.form.workerDuList[index].certificateNumber = "";
        }
      }
    },
    /** 班组、证书种类选择 */
    handleTATChange(index, type, value) {
      if (type === 1) {
        this.form.workerList[index].userName = "";
        this.form.workerList[index].certificateNumber = "";
      } else {
        this.form.workerDuList[index].userName = "";
        this.form.workerDuList[index].certificateNumber = "";
      }
    },
    /** 人员选择 */
    handleUserChange(index, type, value) {
      const selectData = this.userOptions.find(item => item.name === value);
      let number;
      if (selectData) number = selectData.certificateNumber || "";
      else number = "";
      if (type === 1) {
        this.form.workerList[index].certificateNumber = number;
      } else {
        this.form.workerDuList[index].certificateNumber = number;
      }
    },
    // 新增施工人员
    handleAdd(index, type) {
      if (type === 1)
        this.form.workerList.splice(index + 1, 0, {
          deptId: undefined,
          dept: "",
          team: "",
          certificateType: "",
          userName: "",
          certificateNumber: ""
        });
      else
        this.form.workerDuList.splice(index + 1, 0, {
          deptId: undefined,
          dept: "",
          team: "",
          certificateType: "",
          userName: "",
          certificateNumber: ""
        });
    },
    // 删除施工人员
    handleDelete(index, type) {
      this.$confirm("是否确认删除所选施工人员？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type === 1) this.form.workerList.splice(index, 1);
        else this.form.workerDuList.splice(index, 1);
      });
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const parseData = JSON.parse(JSON.stringify(this.form));
            let data = {
              tool: parseData.tool,
              workerList: parseData.workerList
            };
            if (this.blindable) data.workerDuList = parseData.workerDuList;
            resolve(data);
          } else {
            reject();
          }
        });
      });
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        tool: "",
        workerList: [
          {
            deptId: undefined,
            dept: "",
            team: "",
            certificateType: "",
            userName: "",
            certificateNumber: ""
          }
        ],
        workerDuList: [
          {
            deptId: undefined,
            dept: "",
            team: "",
            certificateType: "",
            userName: "",
            certificateNumber: ""
          }
        ]
      };
      // this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>

<style lang="scss">
.worker-container {
  .el-row {
    margin-bottom: 22px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .vue-treeselect__single-value {
    color: #606266;
  }
  .vue-treeselect--disabled .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
