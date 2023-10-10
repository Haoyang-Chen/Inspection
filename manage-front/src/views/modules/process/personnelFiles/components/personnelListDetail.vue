<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="700px"
    :before-close="handleCancel"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="160px"
      size="small"
      :disabled="islock"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="人员类型" prop="personType">
            <el-select
              v-model="ruleForm.personType"
              placeholder="请选择人员类型"
            >
              <el-option
                v-for="item in personTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="personName">
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
          <el-form-item label="岗位" prop="stationId">
            <el-select v-model="ruleForm.stationId" placeholder="请选择">
              <el-option
                v-for="item in positionName"
                :key="item.id"
                :label="item.stationName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工号" prop="jobNumber">
            <el-input v-model="ruleForm.jobNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="departId">
            <Treeselect
              v-model="ruleForm.departId"
              :options="deptOptions"
              :normalizer="deptNormalizer"
              :show-count="true"
              :disabled="islock"
              :disable-branch-nodes="false"
              :clearable="false"
              :searchable="true"
              noResultsText="未找到结果..."
              placeholder="请选择部门"
              clearAllText="清除"
              @change="deptSelect"
            ></Treeselect>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证" prop="idNo">
            <el-input v-model="ruleForm.idNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-select v-model="ruleForm.state" placeholder="请选择">
              <el-option
                v-for="item in whetherJob"
                :key="item.value"
                :label="item.label"
                :value="String(item.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="ruleForm.phoneNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职称" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务" prop="duty">
            <el-input v-model="ruleForm.duty"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高学历" prop="highestEducation">
            <el-select
              v-model="ruleForm.highestEducation"
              placeholder="请选择最高学历"
            >
              <el-option
                v-for="item in highestEducationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否为特种作业人员" prop="isSpecialOperators">
            <el-select
              v-model="ruleForm.isSpecialOperators"
              placeholder="是否为特种作业人员"
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
          <el-form-item label="籍贯" prop="nativePlace">
            <el-input v-model="ruleForm.nativePlace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="民族" prop="nation">
            <el-input v-model="ruleForm.nation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="户籍所在地" prop="registeredResidence">
            <el-input v-model="ruleForm.registeredResidence"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="从业所在地" prop="employmentLocation">
            <el-input v-model="ruleForm.employmentLocation"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生年月日" prop="birthDate">
            <el-date-picker
              v-model="ruleForm.birthDate"
              type="date"
              placeholder="请选择出生年月日"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最后毕业学校" prop="finalGraduationCollege">
            <el-input v-model="ruleForm.finalGraduationCollege"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业" prop="major">
            <el-input v-model="ruleForm.major"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公电话" prop="officeTelephone">
            <el-input v-model="ruleForm.officeTelephone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="健康状况" prop="health">
            <el-input v-model="ruleForm.health"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="参加工作时间" prop="workingDate">
            <el-date-picker
              v-model="ruleForm.workingDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作年限" prop="workingYears2">
            <el-input-number
              v-model="ruleForm.workingYears2"
              :min="0"
              :max="100"
              :precision="0"
              label="工作年限"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="进入本单位日期" prop="enterCompanyDate">
            <el-date-picker
              v-model="ruleForm.enterCompanyDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工龄" prop="workYears">
            <el-input-number
              v-model="ruleForm.workYears"
              :min="0"
              :max="100"
              :precision="0"
              label="工作年限"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="工作职责" prop="operateDuty">
            <el-input type="textarea" v-model="ruleForm.operateDuty"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作经历" prop="workExperience">
            <el-input
              type="textarea"
              v-model="ruleForm.workExperience"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训情况" prop="trainingSituation">
            <el-input
              type="textarea"
              v-model="ruleForm.trainingSituation"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训记录" prop="trainingRecords">
            <el-input
              type="textarea"
              v-model="ruleForm.trainingRecords"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" v-model="ruleForm.memo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="照片" prop="photoList">
            <Uploader
              :class="{ uploaderIsdisabled: islock }"
              ref="photoList"
              :multiple="false"
              :limit="5"
              :size="size"
              @uploadCompletion="handlePhotoList"
            ></Uploader>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button type="primary" v-if="!islock" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { deptTree } from "@/api/modules";
import { listTeam } from "@/api/modules/sys/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapGetters } from "vuex";
import { save_API, update_API } from "@/api/modules/process/webdepartperson";
import Uploader from "@/components/Uploader";

export default {
  name: "personnelListDetail",
  computed: {
    ...mapGetters([
      "positionName",
      "personSexList",
      "personTypeList",
      "highestEducationList",
      "trueFalseList",
      "whetherJob",
    ]),
  },
  components: { Uploader, Treeselect },
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
      ruleForm: {
        personType: undefined,
        personName: undefined,
        personSex: undefined,
        stationId: undefined,
        jobNumber: undefined,
        departId: undefined,
        idNo: undefined,
        state: undefined,
        phoneNumber: undefined,
        title: undefined,
        duty: undefined,
        highestEducation: undefined,
        isSpecialOperators: undefined,
        nativePlace: undefined,
        nation: undefined,
        registeredResidence: undefined,
        employmentLocation: undefined,
        birthDate: undefined,
        finalGraduationCollege: undefined,
        major: undefined,
        officeTelephone: undefined,
        email: undefined,
        health: undefined,
        workingDate: undefined,
        workingYears2: undefined,
        enterCompanyDate: undefined,
        workYears: undefined,
        operateDuty: undefined,
        workExperience: undefined,
        trainingSituation: undefined,
        trainingRecords: undefined,
        memo: undefined,
        photoList: [],
      },
      // 部门数据字典
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children,
        };
      },
      rules: {
        personType: [
          { required: true, message: "请选择人员类型", trigger: "change" },
        ],
        personName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        personSex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        stationId: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ],
        jobNumber: [{ required: true, message: "请输入工号", trigger: "blur" }],
        departId: [{ required: true, message: "请输入部门", trigger: "blur" }],
        idNo: [
          { required: true, message: "请输入身份证", trigger: "blur" },
          {
            min: 15,
            max: 18,
            message: "长度在 15 到 18 个字符",
            trigger: "blur",
          },
        ],
        phoneNumber: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入电话",
            trigger: "blur",
          },
        ],
        highestEducation: [
          { required: true, message: "请选择最高学历", trigger: "change" },
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        isSpecialOperators: [
          { required: true, message: "是否为特种作业人员", trigger: "change" },
        ],
        isSafetyEngineerCertificate: [
          {
            required: true,
            message: "是否注册安全工程师证书",
            trigger: "change",
          },
        ],
        workingDate: [
          { required: true, message: "参加工作时间", trigger: "change" },
        ],
        enterCompanyDate: [
          { required: true, message: "进入本单位日期", trigger: "change" },
        ],
        operateDuty: [{ required: true, message: "工作职责", trigger: "blur" }],
        workExperience: [
          { required: true, message: "工作经历", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入职称", trigger: "blur" }],
        duty: [{ required: true, message: "请输入职务", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getDeptTree();
  },
  methods: {
    /** 查询当前用户部门树 */
    getDeptTree() {
      deptTree().then((response) => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 查询班组列表 */
    getTeamList(deptId, isDeptChange = false) {
      if (deptId != undefined) {
        listTeam(deptId).then((response) => {
          const result = response.result.map((item) => {
            return { teamId: item.deptId, name: item.name };
          });
          this.teamOptions = result;
          if (isDeptChange) {
            this.form.teamId = undefined;
          }
        });
      } else {
        this.teamOptions = [];
      }
    },
    /** 部门选择 */
    deptSelect(node, instanceId) {
      if (this.form.deptId !== node.deptId) {
        this.form.deptId = node.deptId;
        this.getTeamList(node.deptId, true);
      }
    },
    handleCancel() {
      this.reset();
      this.visible = false;
    },
    reset() {
      this.ruleForm.id = undefined;
      this.ruleForm.photoList = [];
      this.resetForm("ruleForm");
      this.$refs["photoList"].setup();
    },
    editTemp(params) {
      this.ruleForm = { ...params };
      this.$nextTick(() => {
        this.$refs["photoList"].setup(this.ruleForm.photoList);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, update_API, this.ruleForm).then((_) => {
            this.saveSuccess();
          });
        }
      });
    },
    saveSuccess() {
      this.reset();
      this.visible = false;
      this.$emit("closeView");
    },
    //文件上传回调
    handlePhotoList(fileList) {
      this.ruleForm.photoList = fileList;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 170px;
}

/deep/ .uploaderIsdisabled .el-upload-list__item-delete:nth-child(3) {
  display: none !important;
}
</style>