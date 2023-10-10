<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="720px"
    :before-close="handleCancel"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      size="small"
      :disabled="islock"
    >
      <el-form-item label="标题公告" prop="titleNotice">
        <el-input v-model="ruleForm.titleNotice"></el-input>
      </el-form-item>

      <el-form-item label="附件" prop="filesList">
        <Uploader
          ref="filesList"
          listType="text"
          :accept="accept"
          :multiple="false"
          :limit="5"
          :size="size"
          @uploadCompletion="handleFilesList"
        ></Uploader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button v-if="!islock" type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { save_API, update_API } from "@/api/modules/process/webfilenotice";
import Uploader from "@/components/Uploader";
export default {
  name:"documentsNoticeDetail",
  components: { Uploader },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "",
    },
    islock: {
      type: Boolean,
      default: false,
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
      accept:"*",
      size: "small",
      visible: this.value,
      ruleForm: {
        titleNotice:undefined,
        filesList:[]
      },
      rules: {
        titleNotice: [{ required: true, message: "请输入标题公告", trigger: "blur" }],
        filesList: [{ required: true, message: "请上传附件", trigger: "change" }],
      },
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    //表单重置操作
    reset() {
      this.ruleForm.id = undefined;
      this.ruleForm.filesList = [];
      this.resetForm("ruleForm");
      this.$refs["filesList"].setup();
    },
    editTemp(params) {
      this.ruleForm = { ...params };
      this.$refs["filesList"].setup(this.ruleForm.filesList);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, update_API, this.ruleForm).then(_ => {
            this.saveSuccess();
          });
        } 
      });
    },
    saveSuccess() {
      this.visible = false;
      this.$emit("closeView");
      this.reset();
    },
    handleFilesList(fileList) {
      this.ruleForm.filesList = fileList;
    },
  },
};
</script>

<style>
</style>