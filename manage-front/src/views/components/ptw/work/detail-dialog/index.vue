<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-collapse :value="['basis', 'risk', 'confirm', 'delay', 'finish']">
      <el-collapse-item title="基本信息" name="basis">
        <basis-form
          ref="basisForm"
          :editable="false"
          :eliminate="true"
          :labelWidth="labelWidth"
          :visible="visible"
          @loadSuccess="handleBasisLoad"
        ></basis-form>
      </el-collapse-item>
      <el-collapse-item title="风险辨识" name="risk">
        <el-row>
          <el-col :span="24">
            <fixed-form
              ref="fixedForm"
              :editable="false"
              :labelWidth="adjRiskLabelWidth"
              :visible="visible"
            ></fixed-form>
          </el-col>
          <el-col :span="24">
            <risk-form
              ref="riskForm"
              :formatRequired="true"
              :editable="false"
              :labelWidth="adjRiskLabelWidth"
              :visible="visible"
            ></risk-form>
          </el-col>
          <el-col :span="24">
            <harm-form
              ref="harmForm"
              :editable="false"
              :labelWidth="adjRiskLabelWidth"
              :visible="visible"
            ></harm-form>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item title="现场确认及气体检测" name="confirm">
        <remote-form
          ref="remoteForm"
          :editable="false"
          :eliminate="true"
          :labelWidth="labelWidth"
          :visible="visible"
        ></remote-form>
      </el-collapse-item>
      <el-collapse-item title="延期申请及签发" name="delay">
        <delay-form
          ref="delayForm"
          :type="3"
          :editable="false"
          :eliminate="true"
          :labelWidth="labelWidth"
          :visible="visible"
        ></delay-form>
      </el-collapse-item>
      <el-collapse-item title="完工申请及审批" name="finish">
        <finish-form
          ref="finishForm"
          :type="3"
          :editable="false"
          :eliminate="true"
          :labelWidth="labelWidth"
          :visible="visible"
        ></finish-form>
      </el-collapse-item>
    </el-collapse>
    <el-form
      v-if="type === 2"
      ref="form"
      :model="form"
      :label-width="labelWidth"
    >
      <el-row style="margin-top:20px">
        <el-col :span="24">
          <el-form-item label="审批结果:" prop="result">
            <el-radio-group
              v-model="form.result"
              @change="
                form.problems = [
                  {
                    ticketId: form.ticketId,
                    problem: undefined,
                    deptId: undefined,
                    dept: undefined
                  }
                ]
              "
            >
              <el-radio :label="1">未发现问题</el-radio>
              <el-radio :label="0">发现问题</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!form.result" :span="24">
          <el-row v-for="(item, index) in form.problems" :key="index">
            <el-col :span="21">
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    :prop="'problems.' + index + '.problem'"
                    label="问题归类"
                    :rules="[
                      {
                        required: true,
                        message: '问题归类不能为空',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-select
                      v-model="item.problem"
                      placeholder="请选择问题归类"
                    >
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :prop="'problems.' + index + '.deptId'"
                    label="问题相关方:"
                    :rules="[
                      {
                        required: true,
                        message: '问题相关方不能为空',
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <treeselect
                      v-model="item.deptId"
                      :options="deptOptions"
                      :normalizer="deptNormalizer"
                      :show-count="true"
                      :disable-branch-nodes="false"
                      :clearable="false"
                      :searchable="false"
                      noResultsText="未找到结果..."
                      placeholder="请选择部门"
                      clearAllText="清除"
                      @select="handleDeptSelect(index, $event)"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                circle
                @click="handleAdd(index)"
                style="margin-top:5px;margin-left:15px"
              ></el-button>
              <el-button
                v-if="form.problems.length > 1"
                type="danger"
                icon="el-icon-minus"
                size="mini"
                circle
                @click="handleDelete(index)"
              ></el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { examWork } from "@/api/modules/ptw/work";
import { deptTree } from "@/api/modules";
import BasisForm from "../basis-dialog/basis-form";
import RiskForm from "@/views/components/trouble/standard/risk-form";
import FixedForm from "../basis-dialog/basis-risk-dialog/fixed-form";
import HarmForm from "../basis-dialog/basis-risk-dialog/harm-form";
import RemoteForm from "../remote-dialog/remote-form";
import DelayForm from "../delay-dialog/delay-form";
import FinishForm from "../finish-dialog/finish-form";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "RemoteDialog",
  components: {
    BasisForm,
    RiskForm,
    FixedForm,
    HarmForm,
    RemoteForm,
    DelayForm,
    FinishForm,
    Treeselect
  },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 弹出层类型1-普通详情,2-详情+审核功能
    type: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: "900px"
    },
    labelWidth: {
      type: String,
      default: "165px"
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
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
      // 表单参数
      form: {
        ticketId: undefined,
        result: 1,
        problems: [
          {
            ticketId: undefined,
            problem: undefined,
            deptId: undefined,
            dept: undefined
          }
        ]
      }
    };
  },
  computed: {
    // 标题
    title() {
      return this.type === 2 ? "作业票审核" : "作业票详情";
    },
    // 风险label宽度调整
    adjRiskLabelWidth() {
      const basis = Number(this.labelWidth.replace("px", ""));
      return basis - 32 + "px";
    },
    /** 问题归类 */
    typeOptions() {
      return this.$store.state.common.workProblems;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
      if (!val && this.type === 2) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(workId) {
      this.reset();
      if (this.type === 2) this.getDeptTree();
      this.form.ticketId = workId;
      this.form.problems.forEach(item => {
        item.ticketId = workId;
      });
      this.$nextTick(() => {
        this.$refs.basisForm.setup(workId);
        this.$refs.remoteForm.setup(workId);
        this.$refs.delayForm.setup(workId);
        this.$refs.finishForm.setup(workId);
      });
    },
    /** 基本信息加载完成回调 */
    handleBasisLoad(data) {
      this.$nextTick(() => {
        this.$refs.fixedForm.setup(data.ticketRisk.fixedItemList);
        this.$refs.riskForm.setup(data.ticketRisk.factorList);
        this.$refs.harmForm.setup(data.ticketRisk.harmList);
      });
    },
    /** 查询当前用户部门树 */
    getDeptTree() {
      deptTree().then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 部门选择 */
    handleDeptSelect(index, node, instanceId) {
      this.form.problems[index].dept = node.name;
    },
    // 新增审核结果
    handleAdd(index) {
      this.form.problems.splice(index + 1, 0, {
        ticketId: this.form.ticketId,
        problem: undefined,
        deptId: undefined,
        dept: undefined
      });
    },
    // 删除审核结果
    handleDelete(index) {
      this.$confirm("是否确认删除所选审核结果？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.form.problems.splice(index, 1);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.type === 2) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            examWork(this.form.problems).then(_ => {
              this.msgSuccess("审核成功");
              this.$emit("submitSuccess");
              this.visible = false;
            });
          }
        });
      } else this.visible = false;
    },
    // 取消按钮
    cancel() {
      this.$emit("submitCancel");
      this.visible = false;
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        ticketId: undefined,
        result: 1,
        problems: [
          {
            ticketId: undefined,
            problem: undefined,
            deptId: undefined,
            dept: undefined
          }
        ]
      };
      this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>
