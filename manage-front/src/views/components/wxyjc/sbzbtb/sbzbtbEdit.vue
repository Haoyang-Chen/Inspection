<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="600px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      :size="size"
      :disabled="!editable"
    >
      <el-row>
        <el-col :span="12"
          ><el-form-item label="指标类型" prop="targetType">
            <el-input
              v-model="ruleForm.targetType"
              disabled
            ></el-input> </el-form-item
        ></el-col>
        <!-- <el-col :span="12"
          ><el-form-item label="指标位号" prop="targetCode">
            <el-input
              v-model="ruleForm.targetCode"
              disabled
            ></el-input> </el-form-item
        ></el-col> -->
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unit">
            <el-input v-model="ruleForm.unit"></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="低低报" prop="minReport">
            <el-input
              type="number"
              :min="0"
              v-model="ruleForm.minReport"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="低报" prop="lowReport">
            <el-input
              type="number"
              :min="0"
              v-model="ruleForm.lowReport"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="高报" prop="highReport">
            <el-input
              type="number"
              :min="0"
              v-model="ruleForm.highReport"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="高高报" prop="maxReport">
            <el-input
              type="number"
              :min="0"
              v-model="ruleForm.maxReport"
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="editable">
      <el-button :size="size" @click="handleCancel()">取消</el-button>
      <el-button :size="size" type="primary" @click="submitForm()"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { update_API } from "@/api/modules/wxyjc/wxyjctargetcode";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "查看",
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      // 是否显示弹出层
      visible: this.value,
      size: "small",
      ruleForm: {
        targetType: undefined, //指标类型
        // targetCode: undefined, //指标编码
        unit: undefined, //计量单位
        minReport: undefined, //低低报
        lowReport: undefined, //低报
        maxReport: undefined, //高报
        highReport: undefined, //高高报
      },
      rules: {
        unit: [{ required: true, message: "计量单位", trigger: "blur" }],
        highReport: [{ required: true, message: "高报", trigger: "blur" }],
      },
    };
  },
  methods: {
    //取消
    handleCancel() {
      this.visible = false;
      this.resetForm("ruleForm");
    },
    editTemp(row) {
      if (row) {
        this.ruleForm = { ...row };
        console.log(this.ruleForm);
        if (
          this.ruleForm.targetType == "液位" &&
          this.ruleForm.unit == undefined
        ) {
          this.ruleForm.unit = "mm";
        } else if (
          this.ruleForm.targetType == "压力" &&
          this.ruleForm.unit == undefined
        ) {
          this.ruleForm.unit = "Kpa";
        } else if (
          this.ruleForm.targetType == "温度" &&
          this.ruleForm.unit == undefined
        ) {
          this.ruleForm.unit = "℃";
        } else {
        }
      }
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          update_API(this.ruleForm).then(() => {
            this.$emit("closeView");
            this.handleCancel();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>