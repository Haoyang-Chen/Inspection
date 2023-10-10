<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="600px"
    :before-close="handleCancel"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      size="small"
      :disabled="!editable"
    >
      <el-form-item label="岗位名称" prop="stationName">
        <el-input v-model="ruleForm.stationName"></el-input>
      </el-form-item>
      <el-form-item label="岗位职责" prop="stationPosition">
        <el-input type="textarea" v-model="ruleForm.stationPosition"></el-input>
      </el-form-item>
      <el-form-item label="岗位职责-附件">
        <Uploader
          ref="stationFileList"
          listType="text"
          :multiple="false"
          :limit="5"
          :size="size"
          @uploadCompletion="handleStationFileList"
        ></Uploader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button v-if="editable" type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {
  save_API,
  update_API,
  info_API,
} from "@/api/modules/process/webcompanystation";
import Uploader from "@/components/Uploader";
export default {
  name: "jobInformationDetail",
  components: { Uploader },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "新增",
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
      }
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      size: "small",
      // 是否显示弹出层
      visible: this.value,
      ruleForm: this.initFormData(),
      rules: {
        stationName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
        ],
        stationPosition: [
          { required: true, message: "请输入岗位职责", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    //表单重置操作
    reset() {
      this.ruleForm = this.initFormData();
      this.resetForm("ruleForm");
      this.$nextTick(() => {
        this.$refs["stationFileList"].setup();
      });
    },
    editTemp(obj) {
      info_API(obj.id).then((res) => {
        this.ruleForm = res.result;
        if (this.ruleForm.stationFileList) {
          this.$refs["stationFileList"].setup(this.ruleForm.stationFileList);
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, update_API, this.ruleForm).then((_) => {
            this.visible = false;
            this.$emit("closeView");
            //获取 岗位信息 by-zhujunjie-2021-09-09
            this.$store.dispatch("GetPositionName");
          });
        }
      });
    },
    //文件上传回调
    handleStationFileList(fileList) {
      this.ruleForm.stationFileList = fileList;
    },
    initFormData() {
      return {
        id: undefined,
        stationName: undefined,
        stationPosition: undefined,
        stationFileList: null,
      };
    },
  },
};
</script>
