<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="演练名称：" prop="drillPlanName">
            <el-autocomplete
              v-model="form.drillPlanName"
              :fetch-suggestions="querySearch"
              placeholder="请选择演练名称"
              @select="handlePlanSelect"
              clearable
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="演练地点：" prop="place">
            <el-input v-model="form.place" placeholder="请输入演练地点" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="演练方式：" prop="mode">
            <el-select
              v-model="form.mode"
              placeholder="请选择演练方式"
              clearable
              :disabled="!editable"
              style="width:100%"
              >
              <el-option v-for="(item, index) in drillModeOptions" :key="index" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="演练级别：" prop="level">
            <el-select
              v-model="form.level"
              placeholder="请选择演练级别"
              clearable
              style="width: 100%"
              :disabled="!editable"
            >
              <el-option
                v-for="dict in drillLevelOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应急预案：" prop="emergencyPlan">
            <el-select
              v-model="form.emergencyPlan"
              placeholder="请选择应急预案"
              clearable
              style="width: 100%"
              :disabled="!editable"
            >
              <el-option
                v-for="(item, index) in emergencyPlanOptions"
                :key="index"
                :label="item.planName"
                :value="item.planName"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划演练日期：" prop="planDate">
            <el-date-picker
              v-model="form.planDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主办单位：" prop="organizer">
            <el-input v-model="form.organizer" placeholder="请输入主办单位" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际演练日期：" prop="realDate">
            <el-date-picker
              v-model="form.realDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="演练负责人：" prop="respUser">
            <el-input v-model="form.respUser" placeholder="请输入演练负责人" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主要参演人员：" prop="joinUser">
            <el-input v-model="form.joinUser" placeholder="请输入演练地点" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="评估人员：" prop="assessor">
            <el-input v-model="form.assessor" placeholder="请输入评估人员" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="其他参演部门：" prop="otherDept">
            <el-input v-model="form.otherDept" :placeholder="editable ? '请输入其他参演部门': ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="演练内容：" prop="content">
            <el-input v-model="form.content" placeholder="请输入演练内容" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="演练目的：" prop="purpose">
            <el-input v-model="form.purpose" placeholder="请输入演练目的" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="演练过程：" prop="process">
            <el-input v-model="form.process" :placeholder="editable ? '请输入演练过程':''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="预案评审：" prop="review">
            <el-input v-model="form.review" placeholder="请输入预案评审" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="人员到位情况：" prop="userInPlace">
            <el-input v-model="form.userInPlace" placeholder="请输入人员到位情况" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="物资到位情况：" prop="materialInPlace">
            <el-input v-model="form.materialInPlace" placeholder="请输入人物资位情况" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="协调组织情况：" prop="harmonize">
            <el-input v-model="form.harmonize" placeholder="请输入协调组织情况" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="实战效果评价：" prop="effect">
            <el-input v-model="form.effect" placeholder="请输入实战效果评价" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="支援部门和协作有效性：" prop="cooperation">
            <el-input v-model="form.cooperation" placeholder="请输入实战效果评价" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="存在问题和改进措施：" prop="ifProblem">
            <el-select
              v-model="form.ifProblem"
              placeholder="请选择存在问题和改进措施"
              :disabled="!editable"
              clearable
              >
              <el-option v-for="item in ifProblemOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否需要修改应急预案：" prop="ifImprove">
            <el-select
              v-model="form.ifImprove"
              placeholder="请选择是否需要修改应急预案"
              :disabled="!editable"
              clearable
              >
              <el-option v-for="item in ifImproveOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件列表：" prop="fileList">
            <Uploader
              ref="uploader"
              listType="text"
              accept="*"
              :multiple="false"
              :limit="9"
              :editable="editable"
              @uploadCompletion="handleUploadCompletion"
            ></Uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="rowTitle">评价意见</div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="部门领导审核：" prop="examState">
            <el-input v-model="form.examState" placeholder="请输入部门领导审核" type="textarea" :rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">{{ editable ? '取 消' : '关 闭' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDrillOper, updateDrillOper, drillOperDetail } from "@/api/modules/process/emergency/oper";
import { drillPlanList } from "@/api/modules/process/emergency/drillPlan";
import { planList } from "@/api/modules/process/emergency/plan";
import Uploader from "@/components/Uploader";
import { OPER_RULES } from "./utils"

export default {
  name: "DrillOperForm",
  components: { Uploader },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "800px"
    },
    // 弹出层标题
    title: {
      type: String,
      default: "添加"
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: this.initForm(),
      // 演练计划列表
      drillPlanOptions: [],
      // 应急预案列表
      emergencyPlanOptions: [],
      // 存在问题和改进措施
      ifProblemOptions: [
        { label: '有', value: 1 },
        { label: '无', value: 0 },
      ],
      // 是否需要修改应急预案
      ifImproveOptions: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
      // 表单校验
      rules: { ...OPER_RULES },
      curDrillPlanId: undefined
    };
  },
  computed: {
    /** 演练级别数据字典 */
    drillLevelOptions() {
      return this.$store.state.common.drillLevels
    },
    /** 演练方式数据字典 */
    drillModeOptions() {
      return this.$store.state.common.drillModes
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
        this.getDrillPlanList();
        this.getEmergencyPlanList();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 重置 */
    setup(id) {
      drillOperDetail(id).then(response => {
        this.form = response.result;
        this.setupUploader(this.form.fileList);
      })
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 查询演练计划列表 */
    getDrillPlanList() {
      drillPlanList({ page: 1, limit: 1000000, status: '待演练' }).then(response =>{
        const result = response.result;
        this.drillPlanOptions= result.list.map((item) => {
          return {
            value: item.name,
            name: item.id,
            level: item.level,
            drillDate: item.drillDate,
            place: item.place,
            mode: item.mode,
            dept: item.dept,
            planName: item.planName,
            planId: item.planId
          };
        });
      })
    },
    /** 选择演练计划 */
    handlePlanSelect(item) {
      this.form.drillPlanId = item.name;
      this.form.place = item.place;
      this.form.level = item.level;
      this.form.mode = item.mode;
      this.form.planDate = item.drillDate;
      this.form.emergencyPlan = item.planName;
    },
    querySearch(queryString, cb) {
      var restaurants = this.drillPlanOptions;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (queryString === restaurant.id);
      };
    },
    /** 查询应急预案列表 */
    getEmergencyPlanList() {
      planList({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result;
        this.emergencyPlanOptions = result.list;
      })
    },
    /** 文件上传回调 */
    handleUploadCompletion(fileList) {
      this.form.fileList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateDrillOper : addDrillOper;
          opFunc(this.form).then(response => {
            this.msgSuccess(this.form.id ? "修改成功" : "新增成功");
            this.visible = false;
            this.$emit("submitSuccess");
          })
        } else {
          return false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.visible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = this.initForm();
      this.resetForm("form");
      this.setupUploader();
    },
    initForm() {
      return {
        id: undefined,
        drillPlanId: undefined,
        drillPlanName: undefined,
        place: undefined,
        mode: undefined,
        level: undefined,
        emergencyPlan: undefined,
        planDate: undefined,
        realDate: undefined,
        organizer: undefined,
        dept: undefined,
        respUser: undefined,
        joinUser: undefined,
        assessor: undefined,
        otherDept: undefined,
        content: undefined,
        purpose: undefined,
        process: undefined,
        review: undefined,
        userInPlace: undefined,
        materialInPlace: undefined,
        harmonize: undefined,
        effect: undefined,
        cooperation: undefined,
        ifProblem: undefined,
        ifImprove: undefined,
        examState: undefined,
        fileList: []
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .tipsFont .el-input__inner{
  color:red
}
</style>