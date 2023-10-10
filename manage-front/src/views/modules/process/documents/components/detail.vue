<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="ruleForm.fileName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件编号" prop="fileNo">
            <el-input
              v-model="ruleForm.fileNo"
              :disabled="state == 2"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本" prop="fileVersion">
            <el-input v-model="ruleForm.fileVersion"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改次数" prop="modifyTimes">
            <el-input v-model="ruleForm.modifyTimes"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="印数" prop="printing">
            <el-input v-model="ruleForm.printing"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="发布日期" prop="issueDate">
            <el-date-picker
              v-model="ruleForm.issueDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="实施日期" prop="carryDate">
            <el-date-picker
              v-model="ruleForm.carryDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件类型" prop="manualLevel">
            <el-select
              v-model="ruleForm.manualLevel"
              placeholder="请选择文件类型"
            >
              <el-option label="手册" value="手册"></el-option>
              <el-option label="程序级别" value="程序级别"></el-option>
              <el-option label="规章制度" value="规章制度"></el-option>
              <el-option label="操作规程" value="操作规程"></el-option>
              <el-option label="记录表单" value="记录表单"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="depart">
            <el-input v-model="ruleForm.depart"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发放范围" prop="distributionScope">
            <el-input v-model="ruleForm.distributionScope"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="ruleForm.memo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="正文" prop="fileText">
            <el-input type="textarea" v-model="ruleForm.fileText"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="enclosureList">
            <Uploader
              ref="enclosureList"
              listType="text"
              :multiple="false"
              :limit="5"
              :size="size"
              @uploadCompletion="handleEnclosureList"
            ></Uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="评审人员" prop="assessor">
            <el-input type="textarea" v-model="ruleForm.assessor"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="编制意见" prop="preparationComments">
            <el-input
              type="textarea"
              v-model="ruleForm.preparationComments"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="审核意见" prop="reviewComments">
            <el-input
              type="textarea"
              v-model="ruleForm.reviewComments"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="审批意见" prop="approvalComments">
            <el-input
              type="textarea"
              v-model="ruleForm.approvalComments"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button
        v-if="!islock"
        type="primary"
        @click="submitForm('ruleForm', 2)"
        >已评审</el-button
      >
      <el-button
        v-if="!islock"
        type="primary"
        @click="submitForm('ruleForm', 1)"
        >草稿</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {
  save_API,
  update_API,
  versionChange_API,
  info_API,
} from "@/api/modules/process/webfilelist";
import Uploader from "@/components/Uploader";
export default {
  name: "documentsDetial",
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
      state: 0, //state = 1 为换版， 2为修改 0为新增
      visible: this.value,
      size: "small",
      ruleForm: this.initFormData(),
      rules: {
        fileName: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        fileNo: [
          { required: true, message: "请输入文件编号", trigger: "blur" },
        ],
        fileVersion: [{ required: true, message: "版本", trigger: "blur" }],
        modifyTimes: [
          {
            required: true,
            pattern: /(^[1-9]\d*$)/,
            message: "修改次数",
            trigger: "blur",
          },
        ],
        issueDate: [{ required: true, message: "发布日期", trigger: "change" }],
        carryDate: [{ required: true, message: "实施日期", trigger: "change" }],
        manualLevel: [
          { required: true, message: "文件类型", trigger: "change" },
        ],
        assessor: [{ required: true, message: "评审人员", trigger: "blur" }],
        preparationComments: [
          { required: true, message: "编制意见", trigger: "blur" },
        ],
        reviewComments: [
          { required: true, message: "审核意见", trigger: "blur" },
        ],
        approvalComments: [
          { required: true, message: "审批意见", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    init(val) {
      this.state = val;
      //换版的情况--文件编号、发布日期、实施日期、附件设为空
      if (this.state == 1) {
        this.ruleForm.fileNo = undefined;
        this.ruleForm.issueDate = undefined;
        this.ruleForm.carryDate = undefined;
        this.ruleForm.enclosureList = null;
      }
    },
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    //表单重置操作
    reset() {
      this.ruleForm = this.initFormData();
      this.resetForm("ruleForm");
      this.$refs["enclosureList"].setup();
    },
    //state 为换版
    editTemp(params, state = 0) {
      this.ruleForm = { ...params };
      if (state == 1) {
        this.$refs["enclosureList"].setup();
      } else {
        if (
          this.ruleForm.enclosureList &&
          this.ruleForm.enclosureList.length > 0
        ) {
          this.$refs["enclosureList"].setup(this.ruleForm.enclosureList);
        } else {
          this.$refs["enclosureList"].setup();
        }
      }
    },
    submitForm(formName, state) {
      this.$refs[formName].validate((valid) => {
        this.ruleForm.state = state;
        if (valid) {
          //this.state : 1 为换版， 2为修改 0为新增
          //换版
          if (this.state == 1) {
            versionChange_API(this.ruleForm).then((res) => {
              this.saveSuccess();
            });
          } else {
            this.formRequest(save_API, update_API, this.ruleForm).then(
              (res) => {
                this.saveSuccess();
              }
            );
          }
        }
      });
    },
    saveSuccess() {
      this.visible = false;
      this.$emit("closeView");
      this.reset();
    },
    //文件上传回调
    handleEnclosureList(fileList) {
      this.ruleForm.enclosureList = fileList;
    },
    initFormData() {
      return {
        id:undefined,
        fileName: undefined,
        fileNo: undefined,
        fileVersion: undefined,
        modifyTimes: undefined,
        printing: undefined,
        issueDate: undefined,
        carryDate: undefined,
        manualLevel: undefined,
        depart: undefined,
        distributionScope: undefined,
        memo: undefined,
        fileText: undefined,
        enclosureList: null,
        assessor: undefined,
        preparationComments: undefined,
        reviewComments: undefined,
        approvalComments: undefined,
      };
    },
  },
};
</script>

<style>
</style>