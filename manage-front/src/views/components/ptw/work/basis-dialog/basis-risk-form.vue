<template>
  <el-form ref="form" :model="form" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item
          label="风险辨识:"
          prop="ticketRisk"
          :rules="[
            {
              required: true,
              validator: validateRisk,
              trigger: 'blur'
            }
          ]"
        >
          <el-button type="primary" @click="handleRiskClick"
            >风险辨识</el-button
          >
        </el-form-item>
      </el-col>
    </el-row>
    <basis-risk-dialog
      ref="basisRiskDialog"
      v-model="open"
      @submitSuccess="handleRiskChange"
    ></basis-risk-dialog>
  </el-form>
</template>

<script>
import BasisRiskDialog from "./basis-risk-dialog";

export default {
  name: "BasisRiskForm",
  components: { BasisRiskDialog },
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
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        ticketRisk: {}
      }
    };
  },
  computed: {},
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
      if (data) {
        const parseData = JSON.parse(JSON.stringify(data));
        this.form.ticketRisk = parseData.ticketRisk || {};
      }
    },
    /** 风险辨识按钮 */
    handleRiskClick() {
      this.open = true;
      this.$nextTick(() => {
        const fixeds = this.form.ticketRisk.fixedItemList || [];
        const risks = this.form.ticketRisk.factorList || [];
        const harms = this.form.ticketRisk.harmList || [];
        this.$refs.basisRiskDialog.setup(fixeds, risks, harms);
      });
    },
    handleRiskChange(data) {
      this.form.ticketRisk = data;
    },
    /** 验证表单 */
    validateRisk(rule, value, callback) {
      const risks = value.factorList;
      if (!risks || !risks.length)
        return callback(new Error("风险辨识不能为空"));
      else {
        risks.forEach(item => {
          if (!item.factor || !item.factor.length)
            return callback(new Error("风险辨识不能为空"));
        });
      }
      callback();
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const parseData = JSON.parse(JSON.stringify(this.form));
            resolve(parseData);
          } else {
            reject();
          }
        });
      });
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        ticketRisk: {}
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
