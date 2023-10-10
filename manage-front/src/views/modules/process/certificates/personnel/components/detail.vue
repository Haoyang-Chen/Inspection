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
      <el-form-item label="人员姓名" prop="personnelName">
        <el-input v-model="ruleForm.personnelName"></el-input>
      </el-form-item>
      <el-form-item label="所属岗位" prop="stationId">
        <el-select
          v-model="ruleForm.stationId"
          placeholder="请选择"
          :clearable="true"
          :filterable="true"
        >
          <el-option
            v-for="item in positionName"
            :key="item.id"
            :label="item.stationName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证书名称" prop="certificateName">
        <el-input v-model="ruleForm.certificateName"></el-input>
      </el-form-item>
      <el-form-item label="证书编号" prop="certificateNo">
        <el-input v-model="ruleForm.certificateNo"></el-input>
      </el-form-item>
      <el-form-item label="发证日期" prop="issueDate">
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
      <el-form-item label="是否长期有效" prop="isLongRange">
        <el-select
          v-model="ruleForm.isLongRange"
          placeholder="请选择是否长期有效"
          @change="changeIsLongRange"
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
      <el-form-item label="有效期至" prop="expiryDate" v-if="ruleForm.isLongRange !=1">
        <el-date-picker
          v-model="ruleForm.expiryDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :editable="false"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发证机关" prop="issuingAuthority">
        <el-input v-model="ruleForm.issuingAuthority"></el-input>
      </el-form-item>
      <el-form-item label="证书扫描件">
        <Uploader
          ref="certificatePhotoList"
          listType="text"
          :multiple="false"
          :limit="5"
          :size="size"
          @uploadCompletion="getCertificatePhotoList"
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
  renewal_API,//换证
} from "@/api/modules/process/webcertificateperson";
import Uploader from "@/components/Uploader";
export default {
  name:"personnelDetail",
  computed: {
    ...mapGetters(["positionName","trueFalseList"]),
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
      console.log(val);
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    let that = this;
    return {
      size: "small",
      // 是否显示弹出层
      visible: this.value,
      ruleForm: {
        personnelName:undefined,
        stationId:undefined,
        certificateName:undefined,
        certificateNo:undefined,
        issueDate:undefined,
        isLongRange:undefined,
        expiryDate:undefined,
        issuingAuthority:undefined,
        certificatePhotoList:null,
        memo:undefined,
        yellowWarnDays: 90,
        redWarnDays: 30
      },
      rules: {
        personnelName: [
          { required: true, message: "请输入人员姓名", trigger: "blur" },
        ],
        stationId: [
          { required: true, message: "所属岗位", trigger: "change" },
        ],
        certificateName: [
          { required: true, message: "证书名称", trigger: "blur" },
        ],
        certificateNo: [
          { required: true, message: "证书编号", trigger: "blur" },
        ],
        issueDate: [
          { required: true, message: "发证日期", trigger: "change" },
        ],
        isLongRange: [
          { required: true, message: "是否长期有效", trigger: "change" },
        ],
        expiryDate: [
          { required: true, message: "有效期至", trigger: "change" },
        ],
        yellowWarnDays: [
          { required: true, message: "黄色预警标准", trigger: "change" },
        ],
        redWarnDays: [
          { required: true, message: "红色预警标准", trigger: "change" },
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          let delay = that.ruleForm.issueDate;//发证日期
          return time.getTime() < new Date(delay).getTime();
        },
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
      this.resetForm("ruleForm");
      this.$refs["certificatePhotoList"].setup(); //证书扫描件
    },
    //编辑
    editTemp(params) {
      this.ruleForm = { ...params };
      this.$refs["certificatePhotoList"].setup(
        this.ruleForm.certificatePhotoList
      );
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, renewal_API, this.ruleForm).then(() => {
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
    getCertificatePhotoList(fileList) {
      this.ruleForm.certificatePhotoList = fileList;
    },
    changeIsLongRange(val){
      if(val){
        this.ruleForm.expiryDate = undefined
      }
    }
  },
};
</script>

<style>
</style>