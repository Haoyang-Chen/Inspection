<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="760px"
    :before-close="handleCancel"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      size="small"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="人员姓名" prop="personName">
            <el-input v-model="ruleForm.personName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="personSex">
            <el-select v-model="ruleForm.personSex" placeholder="请选择性别">
              <el-option
                v-for="item in personSexList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证" prop="personNo">
            <el-input v-model="ruleForm.personNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承包商名称" prop="contractorId">
            <el-select v-model="ruleForm.contractorId">
              <el-option
                v-for="item in webcontractorOption"
                :key="item.id"
                :label="item.contractorName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否通过培训" prop="isPassTrain">
            <el-select
              v-model="ruleForm.isPassTrain"
              @change="isPassTrainChange"
            >
              <el-option
                v-for="item in trueFalseList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-select v-model="ruleForm.state">
              <el-option
                v-for="item in userStatus01"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="ruleForm.isPassTrain != 0">
          <el-form-item label="培训日期" prop="trainDate">
            <el-date-picker
              v-model="ruleForm.trainDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="ruleForm.isPassTrain != 0">
          <el-form-item label="下次培训日期" prop="nextTrainDate">
            <el-date-picker
              v-model="ruleForm.nextTrainDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="ruleForm.isPassTrain != 0">
          <el-form-item label="培训附件" prop="trainFileList">
            <Uploader
              ref="trainFileList"
              listType="text"
              :multiple="false"
              :limit="5"
              :size="size"
              @uploadCompletion="handleTrainFileList"
            ></Uploader>
          </el-form-item>
        </el-col>

        <el-col>
          <Certifications
            ref="Certifications"
            :ruleForm="ruleForm"
          ></Certifications>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { list_API } from "@/api/modules/process/webcontractor";
import { save_API, update_API } from "@/api/modules/process/webcontratorperson";
import Uploader from "@/components/Uploader";
import Certifications from "./Certifications.vue";

export default {
  name: "contractorStaffDetail",
  computed: {
    ...mapGetters(["personSexList", "trueFalseList"]),
    ...mapState({
      userStatus01: (state) => state.common.userStatus01,
    }),
  },
  components: { Uploader, Certifications },
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
      size: "small",
      // 是否显示弹出层
      visible: this.value,
      ruleForm: this.initFormData(),
      rules: {
        personName: [
          { required: true, message: "请输入人员姓名", trigger: "blur" },
        ],
        trainFileList: [
          { required: true, message: "附件必须上传", trigger: "change" },
        ],
        personSex: [{ required: true, message: "性别", trigger: "change" }],
        contractorId: [
          { required: true, message: "承包商名称", trigger: "change" },
        ],
        personNo: [
          { required: true, message: "请输入身份证", trigger: "blur" },
        ],
        isPassTrain: [
          { required: true, message: "是否通过培训", trigger: "change" },
        ],
        state: [{ required: true, message: "状态", trigger: "change" }],
      },
      webcontractorOption: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    initFormData() {
      return {
        personName: undefined, //人员姓名
        personSex: undefined,
        personNo: undefined,
        contractorId: undefined,
        isPassTrain: undefined,
        state: undefined,
        trainFileList: null,
        specialCertificates: [
          {
            specialOperationType: undefined,
            validUntil: undefined,
            certificateCode: undefined,
            fileUploadList: undefined,
          },
        ],
      };
    },
    //获取数据
    getList() {
      let params = {
        page: 1,
        limit: 100,
        state: 1,
      };
      list_API(params).then((res) => {
        this.webcontractorOption = res.result.list;
      });
    },
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    //表单重置操作
    reset() {
      //先执行子组件的 reset
      this.ruleForm = this.initFormData();
      this.resetForm("ruleForm");
      this.$nextTick(() => {
        this.$refs["trainFileList"].setup();
        this.$refs["Certifications"].reset(this.ruleForm.specialCertificates);
      });
    },
    editTemp(params) {
      this.ruleForm = { ...params };
      if (this.ruleForm.trainFileList?.length > 0) {
        this.$refs["trainFileList"].setup(this.ruleForm.trainFileList);
      }
      if (this.ruleForm.specialCertificates?.length == 0) {
        this.ruleForm.specialCertificates = [
          {
            specialOperationType: undefined,
            validUntil: undefined,
            certificateCode: undefined,
            fileUploadList: undefined,
          },
        ];
      } else {
        this.$nextTick(() => {
          this.$refs["Certifications"].init(this.ruleForm.specialCertificates);
        });
      }
    },
    submitForm(formName) {
      let params = { ...this.ruleForm };
      if (JSON.stringify(params.specialCertificates[0]) === "{}") {
        params.specialCertificates = null;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, update_API, params).then((_) => {
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
    //文件上传回调
    handleTrainFileList(fileList) {
      this.ruleForm.trainFileList = fileList;
    },
    isPassTrainChange(val) {
      if (val == 0) {
        this.ruleForm.trainDate = undefined;
        this.ruleForm.nextTrainDate = undefined;
        this.ruleForm.trainFileList = null;
      }
    },
  },
};
</script>

