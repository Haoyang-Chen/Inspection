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
          <el-form-item label="制定人：" prop="maker">
            <el-input v-model="form.maker" placeholder="请输入制定人" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制定部门：" prop="makeDept">
            <el-input v-model="form.makeDept" placeholder="请输入制定部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制定时间：" prop="makeDate">
            <el-date-picker
              v-model="form.makeDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="制定时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改时间：" prop="editDate">
            <el-date-picker
              v-model="form.editDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="修改时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="演练名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入演练名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="演练地点：" prop="place">
            <el-input v-model="form.place" placeholder="请输入演练地点" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主办部门：" prop="dept">
            <el-input v-model="form.dept" placeholder="请输入主办部门" :disabled="!editable"></el-input>
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
          <el-form-item label="应急预案：" prop="planId" >
            <el-select
              v-model="form.planId"
              placeholder="请选择应急预案"
              clearable
              style="width: 100%"
              :disabled="!editable"
              @change="changePlan"
            >
              <el-option
                v-for="item in planOptions"
                :key="item.id"
                :label="item.planName"
                :value="item.id"
              />
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
          <el-form-item label="计划制定日期：" prop="planDate">
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
        <el-col :span="12">
          <el-form-item label="计划演练日期：" prop="drillDate">
             <el-date-picker
              v-model="form.drillDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：" prop="memo">
            <el-input v-model="form.memo" placeholder="请输入备注" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择状态"
              :disabled="!editable"
              clearable
              style="width:100%"
              >
              <el-option v-for="item in drillStatusOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
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
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">{{ editable ? '取 消':'关 闭' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Uploader from "@/components/Uploader";
import { addDrillPlan, updateDrillPlan, drillPlanDetail } from "@/api/modules/process/emergency/drillPlan";
import { planList } from "@/api/modules/process/emergency/plan";
import { PLAN_RULES } from "./utils";
import { getCurrentDate } from "@/views/modules/ins/utils";

export default {
  name: "DrillPlanForm",
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
      // 应急预案列表
      planOptions: [],
      // 表单校验
      rules: { ...PLAN_RULES }
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
    },
    /** 演练状态数据字典 */
    drillStatusOptions() {
      return this.$store.state.common.drillStatus
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
        this.getPlanList();
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
      drillPlanDetail(id).then(response => {
        this.form = response.result;
        this.setupUploader(this.form.fileList);
      })
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 查询应急预案列表 */
    getPlanList() {
      planList({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result;
        this.planOptions = result.list;
      })
    },
    /** 选择应急预案 */
    changePlan(val) {
      this.form.planName = this.planOptions.find(item => item.id === val).planName;
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
          opFunc = this.form.id ? updateDrillPlan : addDrillPlan;
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
        maker: undefined,
        makeDept: undefined,
        makeDate: getCurrentDate(),
        editDate: undefined,
        name: undefined,
        place: undefined,
        dept: undefined,
        mode: undefined,
        planId: undefined,
        planName: undefined,
        level: undefined,
        planDate: undefined,
        drillDate: undefined,
        memo: undefined,
        status: undefined,
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