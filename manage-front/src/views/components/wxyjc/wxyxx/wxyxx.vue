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
      label-width="165px"
      :size="size"
      :disabled="!editable"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="重大危险源名称" prop="hazardName">
            <el-input
              v-model="ruleForm.hazardName"
              @blur="hazardNameChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="重大危险源/区域编号" prop="hazardNo">
            <el-input v-model="ruleForm.hazardNo"></el-input>
          </el-form-item>
        </el-col>
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
import {
  check_edit_API,
  check_API,
  save_API,
  update_API,
  info_API,
} from "@/api/modules/wxyjc/wxyjcdangeroushazard";

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
        id: undefined,
        hazardName: undefined,
        hazardNo: undefined,
      },
      rules: {
        hazardName: [
          { required: true, message: "重大危险源名称", trigger: "blur" },
        ],
        hazardNo: [
          { required: true, message: "重大危险源/区域编号", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //取消
    handleCancel() {
      this.visible = false;
      this.handleReset();
    },
    //编辑
    editTemp(id) {
      if (id) {
        info_API(id).then((res) => {
          this.ruleForm = res.result;
        });
      }
    },
    //重置
    handleReset() {
      this.resetForm("ruleForm");
      this.ruleForm.id = undefined;
    },
    //保存
    submitForm() {
      console.log(this.ruleForm);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$refs["ruleForm"].validate((valid) => {
            if (valid) {
              this.formRequest(save_API, update_API, this.ruleForm).then(
                (_) => {
                  this.$emit("closeView");
                  this.handleCancel();
                }
              );
            }
          });
        }
      });
    },
    hazardNameChange() {
      if(this.ruleForm.hazardName == undefined || this.ruleForm.hazardName == ''){
        return false;
      }
      if (this.ruleForm.id) {
        check_edit_API(
          this.ruleForm.hazardName,
          this.ruleForm.id
        ).then((res) => {
          if (!res.data) {
            this.ruleForm.hazardName = undefined;
            this.$message({
              message: "该重大危险源名称已存在请重新输入",
              type: "warning",
            });
            return false;
          }
        });
      } else {
        check_API(this.ruleForm.hazardName,).then((res) => {
          if (!res.data) {
            this.ruleForm.hazardName = undefined;
            this.$message({
              message: "该重大危险源名称已存在请重新输入",
              type: "warning",
            });
            return false;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>