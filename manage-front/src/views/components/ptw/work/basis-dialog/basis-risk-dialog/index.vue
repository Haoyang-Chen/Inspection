<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-row>
      <el-col :span="24">
        <fixed-form
          ref="fixedForm"
          :visible="visible"
          :labelWidth="labelWidth"
        ></fixed-form>
      </el-col>
      <el-col :span="24">
        <risk-form
          ref="riskForm"
          :formatRequired="true"
          :visible="visible"
          :labelWidth="labelWidth"
        ></risk-form>
      </el-col>
      <el-col :span="24">
        <harm-form
          ref="harmForm"
          :visible="visible"
          :labelWidth="labelWidth"
        ></harm-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FixedForm from "./fixed-form";
import RiskForm from "@/views/components/trouble/standard/risk-form";
import HarmForm from "./harm-form";

export default {
  name: "BasisRiskDialog",
  components: { FixedForm, RiskForm, HarmForm },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "720px"
    },
    // 表单标题宽度
    labelWidth: {
      type: String,
      default: "135px"
    }
  },
  data() {
    return {
      // 标题
      title: "添加风险辨识",
      // 是否显示弹出层-内部
      visible: this.value
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(fixeds, risks, harms) {
      this.$nextTick(() => {
        this.$refs.fixedForm.setup(fixeds);
        this.$refs.riskForm.setup(risks);
        this.$refs.harmForm.setup(harms);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      const validList = [];
      const fixedValid = this.$refs.fixedForm.validate();
      validList.push(fixedValid);
      const riskValid = this.$refs.riskForm.validate();
      validList.push(riskValid);
      const harmValid = this.$refs.harmForm.validate();
      validList.push(harmValid);
      Promise.all(validList)
        .then(([fixeds, risks, harms]) => {
          const data = {
            fixedItemList: fixeds,
            factorList: risks,
            harmList: harms
          };
          this.$emit("submitSuccess", data);
          this.msgSuccess("添加成功");
          this.visible = false;
        })
        .catch(_ => {});
    },
    // 取消按钮
    cancel() {
      this.$emit("submitCancel");
      this.visible = false;
    }
  }
};
</script>
