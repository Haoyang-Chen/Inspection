<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="800px"
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
          <el-form-item label="单位名称" prop="contractorName">
            <el-input v-model="ruleForm.contractorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位性质" prop="contractorNature">
            <el-input v-model="ruleForm.contractorNature"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承包商类别" prop="contractorCategory">
            <el-input v-model="ruleForm.contractorCategory"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承包商类型" prop="contractorType">
            <el-input v-model="ruleForm.contractorType"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任书签订日期" prop="responsibySignDate">
            <el-date-picker
              v-model="ruleForm.responsibySignDate"
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
          <el-form-item label="责任书到期日期" prop="responsibyExpiryDate">
            <el-date-picker
              v-model="ruleForm.responsibyExpiryDate"
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
          <el-form-item label="进厂日期" prop="approachDate">
            <el-date-picker
              v-model="ruleForm.approachDate"
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
          <el-form-item label="状态" prop="state">
            <el-select v-model="ruleForm.state" placeholder="请选择状态">
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
        <el-col :span="24">
          <el-form-item label="经营范围" prop="businessScope">
            <el-input
              type="textarea"
              v-model="ruleForm.businessScope"
              placeholder="经营范围"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="fileUploadList">
            <Uploader
              ref="fileUploadList"
              listType="text"
              :multiple="false"
              :limit="5"
              :size="size"
              @uploadCompletion="handleFileUploadList"
            ></Uploader>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="承包商负责人" prop="contractorPrincipal">
            <el-input v-model="ruleForm.contractorPrincipal"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式" prop="contactPhone">
            <el-input v-model="ruleForm.contactPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="身份证" prop="idCard">
            <el-input v-model="ruleForm.idCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="安全负责人" prop="safetyDirector">
            <el-input v-model="ruleForm.safetyDirector"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系方式" prop="safetyContactPhone">
            <el-input v-model="ruleForm.safetyContactPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="身份证" prop="safetyIdCard">
            <el-input v-model="ruleForm.safetyIdCard"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="营业等级" prop="businessLevel">
            <el-input
              v-model="ruleForm.businessLevel"
              placeholder="承包商营业等级"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="社会信用代码" prop="creditCode">
            <el-input v-model="ruleForm.creditCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认可证" prop="approveSpecialEquipment">
            <el-input
              v-model="ruleForm.approveSpecialEquipment"
              placeholder="安装特殊设备认可证（省级）字号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="承包商简介" prop="contractorProfile">
            <el-input
              type="textarea"
              v-model="ruleForm.contractorProfile"
              placeholder="承包商简介"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <CertificationsCBS
            ref="CertificationsCBS"
            :ruleForm="ruleForm"
          ></CertificationsCBS>
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
import { save_API, update_API } from "@/api/modules/process/webcontractor";
import Uploader from "@/components/Uploader";
import CertificationsCBS from "./CertificationsCBS.vue";
export default {
  name: "inPlantContractorsDetail",
  computed: {
    ...mapGetters(["trueFalseList"]),
    ...mapState({
      userStatus01: (state) => state.common.userStatus01,
    }),
  },
  components: { Uploader, CertificationsCBS },
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
      labelTitle: "资质证书",
      size: "small",
      // 是否显示弹出层
      visible: this.value,
      ruleForm: this.initFormData(),
      rules: {
        contractorName: [
          { required: true, message: "请输入单位名称", trigger: "blur" },
        ],
        fileUploadList: [
          { required: true, message: "附件必须上传", trigger: "change" },
        ],
        state: [{ required: true, message: "状态必选", trigger: "change" }],
        responsibySignDate: [
          { required: true, message: "责任书签订日期", trigger: "change" },
        ],
        responsibyExpiryDate: [
          { required: true, message: "责任书到期日期", trigger: "change" },
        ],
        approachDate: [
          { required: true, message: "请选择进厂日期", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    initFormData() {
      return {
        contractorName: undefined, //单位名称
        contractorNature: undefined, //单位性质
        contractorCategory: undefined, //承包商类别
        contractorType: undefined, //承包商类型
        responsibySignDate: undefined, //责任书签订日期
        responsibyExpiryDate: undefined, //责任书到期日期
        approachDate: undefined, //进厂日期
        state: undefined, //状态
        fileUploadList: null, //附件
        contractorPrincipal: undefined, //承包商负责人
        contactPhone: undefined, //联系方式
        idCard: undefined, //身份证
        safetyDirector: undefined, //安全负责人
        safetyContactPhone: undefined, //联系方式
        safetyIdCard: undefined, //身份证
        businessLevel: undefined, //营业等级
        creditCode: undefined, //社会信用代码
        approveSpecialEquipment: undefined, //认可证
        contractorProfile: undefined, //承包商简介
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
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    reset() {
      //现在执行子组件reset
      this.ruleForm = this.initFormData();
      this.resetForm("ruleForm");
      this.$nextTick(()=>{
        this.$refs["fileUploadList"].setup();
        this.$refs["CertificationsCBS"].reset(this.ruleForm.specialCertificates);
      })
    },
    editTemp(params) {
      this.ruleForm = { ...params };
      if (this.ruleForm.fileUploadList?.length > 0) {
        this.$refs["fileUploadList"].setup(this.ruleForm.fileUploadList);
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
          this.$refs["CertificationsCBS"].init(
            this.ruleForm.specialCertificates
          );
        });
      }
    },
    submitForm(formName) {
      let params = { ...this.ruleForm };
      if (JSON.stringify(params.specialCertificates[0]) === '{}') {
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
    handleFileUploadList(fileList) {
      this.ruleForm.fileUploadList = fileList;
      this.$forceUpdate();
    },
  },
};
</script>
