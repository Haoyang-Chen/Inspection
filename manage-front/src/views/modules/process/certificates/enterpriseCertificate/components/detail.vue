<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="600px"
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
      <el-form-item label="证书名称" prop="certificateName">
        <el-input v-model="ruleForm.certificateName"></el-input>
      </el-form-item>
      <el-form-item label="证书类型" prop="certificateType">
        <el-select
          v-model="ruleForm.certificateType"
          placeholder="请选择证书类型"
        >
          <el-option
            v-for="item in certificateTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证书编号" prop="certificateNo">
        <el-input v-model="ruleForm.certificateNo"></el-input>
      </el-form-item>
      <el-form-item label="是否长期有效" prop="isLongRange">
        <el-select v-model="ruleForm.isLongRange" placeholder="请选择证书类型" @change="changeIsLongRange">
          <el-option
            v-for="item in trueFalseList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="有效期至"
        prop="expiryDate"
        v-if="ruleForm.isLongRange != 1"
      >
        <el-date-picker
          v-model="ruleForm.expiryDate"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :editable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发证机关" prop="issuingAuthority">
        <el-input v-model="ruleForm.issuingAuthority"></el-input>
      </el-form-item>
      <el-form-item label="证书扫描件">
        <Uploader
          ref="certificatePhotoList"
          :multiple="false"
          :limit="5"
          :size="size"
          @uploadCompletion="getCertificatePhotoList"
        ></Uploader>
      </el-form-item>
      <el-form-item label="其他附件">
        <Uploader
          ref="otherPhotoList"
          listType="text"
          :multiple="false"
          :limit="5"
          :accept="accept"
          :size="size"
          @uploadCompletion="getOtherPhotoList"
        ></Uploader>
      </el-form-item>
      <el-form-item label="黄色预警标准" prop="yellowWarnDays">
        <el-select
          v-model="ruleForm.yellowWarnDays"
          placeholder="请选择黄色预警标准"
        >
          <el-option
            v-for="item in yellowStdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="红色预警标准" prop="redWarnDays">
        <el-select
          v-model="ruleForm.redWarnDays"
          placeholder="请选择红色预警标准"
        >
          <el-option
            v-for="item in redStdOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="ruleForm.memo"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button v-if="!islock" type="primary" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>


<script>
import { mapGetters } from "vuex";
import {
  save_API,
  renewal_API, //换证
} from "@/api/modules/process/webcertificatedepart";
import Uploader from "@/components/Uploader";
export default {
  name:"enterpriseCertificateDetail",
  computed: {
    ...mapGetters(["trueFalseList", "certificateTypeList"]),
    /** 黄色预警标准 */
    yellowStdOptions() {
      return this.$store.state.common.stdWarnTimes.filter(item => {
        if (!this.ruleForm.redWarnDays) return item.value !== 30;
        else return item.value > this.ruleForm.redWarnDays;
      });
    },
    /** 红色预警标准 */
    redStdOptions() {
      return this.$store.state.common.stdWarnTimes.filter(
        item => item.value < this.ruleForm.yellowWarnDays
      );
    }
  },
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
      size: "small",
      accept: "*",
      // 是否显示弹出层
      visible: this.value,
      ruleForm: {
        certificateType:"安全生产",//certificateType
        isLongRange:0,
        certificateName:undefined,//证书名称
        certificateNo:undefined,//证书编号
        expiryDate:undefined,//有效期至
        issuingAuthority:undefined,//发证机关
        certificatePhotoList:null,//证书扫描件
        otherPhotoList:null,//其他附件
        memo:undefined,//memo
        yellowWarnDays: 90,
        redWarnDays: 30
      },
      rules: {
        certificateName: [
          { required: true, message: "请输入证书名称", trigger: "blur" },
        ],
        certificateType: [
          { required: true, message: "证书类型", trigger: "chnage" },
        ],
        certificateNo: [
          { required: true, message: "证书编号", trigger: "blur" },
        ],
        isLongRange: [
          { required: true, message: "是否长期有效", trigger: "chnage" },
        ],
        expiryDate: [
          { required: true, message: "有效期至", trigger: "chnage" },
        ],
        issuingAuthority: [
          { required: true, message: "发证机关", trigger: "blur" },
        ],
        yellowWarnDays: [
          { required: true, message: "黄色预警标准", trigger: "change" },
        ],
        redWarnDays: [
          { required: true, message: "红色预警标准", trigger: "change" },
        ]
      },
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    reset() {
      this.ruleForm.id = undefined;
      this.ruleForm.certificatePhotoList = null;
      this.ruleForm.otherPhotoList = null;
      this.resetForm("ruleForm");
      this.$refs["certificatePhotoList"].setup(); //证书扫描件
      this.$refs["otherPhotoList"].setup(); //证书扫描件
    },
    //编辑
    editTemp(params, islock) {
      this.ruleForm = { ...params };
      //如果是查看状态，可以显示
      if (islock) {
        this.$refs["certificatePhotoList"].setup(
          this.ruleForm.certificatePhotoList
        );
        this.$refs["otherPhotoList"].setup(this.ruleForm.otherPhotoList);
      }else{
        this.ruleForm.expiryDate = undefined;
        this.ruleForm.certificatePhotoList = null;
        this.ruleForm.otherPhotoList = null;
        this.$refs["certificatePhotoList"].setup(); //证书扫描件
        this.$refs["otherPhotoList"].setup(); //证书扫描件
      }
    },
    //证书扫描件-回调
    getCertificatePhotoList(fileList) {
      this.ruleForm.certificatePhotoList = fileList;
    },
    //其他附件-回调
    getOtherPhotoList(fileList) {
      this.ruleForm.otherPhotoList = fileList;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, renewal_API, this.ruleForm).then((_) => {
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
    changeIsLongRange(val){
      if(val){
        this.ruleForm.expiryDate = undefined
      }
    }
  },
};
</script>
