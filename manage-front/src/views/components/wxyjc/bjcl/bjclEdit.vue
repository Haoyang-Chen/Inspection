<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="800px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      :size="size"
    >
      <el-form-item label="报警原因" prop="causeAlarm">
        <el-input type="textarea" v-model="ruleForm.causeAlarm"></el-input>
      </el-form-item>
      <el-form-item label="报警处理" prop="alarmDeal">
        <el-input type="textarea" v-model="ruleForm.alarmDeal"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :size="size" @click="handleCancel()">取消</el-button>
      <el-button :size="size" type="primary" @click="submitForm()"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { update_API } from "@/api/modules/wxyjc/wxyjcwarninginformopt";
export default {
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "查看",
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
        id: undefined,
        causeAlarm: undefined,
        alarmDeal: undefined,
      },
      rules: {
        causeAlarm: [{ required: true, message: "报警原因", trigger: "blur" }],
        alarmDeal: [{ required: true, message: "报警处理", trigger: "blur" }],
      },
    };
  },
  methods: {
    //取消
    handleCancel() {
      this.visible = false;
      this.handleReset();
    },
    //重置
    handleReset() {
      this.resetForm("ruleForm");
      this.ruleForm.id = undefined;
    },
    editTemp(id) {
      console.log(id)
      this.ruleForm.id = id;
    },
    submitForm() {
      console.log(this.ruleForm)
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          update_API(this.ruleForm).then((res) => {
            this.$emit("closeView");
            this.handleCancel();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>