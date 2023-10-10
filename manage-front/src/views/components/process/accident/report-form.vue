<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="140px">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="rowTitle">发起</div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发起人：" prop="startUser">
            <el-input v-model="form.startUser" placeholder="请输入发起人" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发起时间：" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              :disabled="!editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入事故名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故部门：" prop="dept">
            <el-input v-model="form.dept" placeholder="请输入事故部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生地点：" prop="place">
            <el-input v-model="form.place" placeholder="请输入发生地点" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生时间：" prop="happenDate">
            <el-date-picker
              v-model="form.happenDate"
              :disabled="!editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="rowTitle">调查</div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生等级：" prop="level">
            <el-select v-model="form.level" placeholder="请选择发生等级" :disabled="!editable" style="width:100%">
              <el-option v-for="item in accidentLevelOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故类别：" prop="type">
            <el-select v-model="form.type" placeholder="请选择事故类别" :disabled="!editable" style="width:100%">
              <el-option v-for="item in accidentTypeOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故原因：" prop="reason">
            <el-select v-model="form.reason" placeholder="请选择事故原因" filterable :disabled="!editable" style="width:100%">
              <el-option v-for="item in accidentCauseOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人员伤亡情况：" prop="casualty">
            <el-input v-model="form.casualty" placeholder="请输入人员伤亡情况" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="火灾损失影响：" prop="fireDamage">
            <el-input v-model="form.fireDamage" :placeholder="editable ? '请输入火灾损失影响' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危化品泄漏影响：" prop="chemicalsDamage">
            <el-input v-model="form.chemicalsDamage" :placeholder="editable ? '请输入危化品泄漏影响' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备事故影响：" prop="deviceDamage">
            <el-input v-model="form.deviceDamage" :placeholder="editable ? '请输入设备事故影响' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工艺事故影响：" prop="technologyDamage">
            <el-input v-model="form.technologyDamage" :placeholder="editable ? '请输入工艺事故影响' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故描述：" prop="description">
            <el-input v-model="form.description" :placeholder="editable ? '请输入事故描述' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故发现项：" prop="findItem">
            <el-input v-model="form.findItem" :placeholder="editable ? '请输入事故发现项' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="整改防范措施：" prop="rectPrevent">
            <el-input v-model="form.rectPrevent" :placeholder="editable ? '请输入整改防范措施' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整改责任人：" prop="respUser">
            <el-input v-model="form.respUser" :placeholder="editable ? '请输入整改责任人' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建议完成期限：" prop="completeDate">
            <el-date-picker
              v-model="form.completeDate"
              :disabled="!editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择建议完成期限"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故证据链：" prop="evidence">
            <el-input v-model="form.evidence" :placeholder="editable ? '请输入事故证据链' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事故树分析表：" prop="analysis">
            <el-input v-model="form.analysis" :placeholder="editable ? '请输入事故树分析表' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="最终调查报告：" prop="lastReport">
            <el-input v-model="form.lastReport" :placeholder="editable ? '请输入最终调查报告' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" :disabled="!editable" style="width:100%">
              <el-option label="已处理" :value="1"></el-option>
              <el-option label="未处理" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="rowTitle">审核</div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审批意见：" prop="examIdea">
            <el-input v-model="form.examIdea" :placeholder="editable ? '请输入审批意见' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">{{ editable ? "取 消" : "关 闭" }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addReport, updateReport, reportDetail } from "@/api/modules/process/accident/report";
import Uploader from "@/components/Uploader";

export default {
  name: "ChangeForm",
  components: { Uploader },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "900px"
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
      rules: {
        startUser: [
          { required: true, message: '发起人不能为空', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '发起时间不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '事故名称不能为空', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '事故部门不能为空', trigger: 'blur' }
        ],
        place: [
          { required: true, message: '发生地点不能为空', trigger: 'blur' }
        ],
        happenDate: [
          { required: true, message: '发生时间不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '发生等级不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '事故类别不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '事故原因不能为空', trigger: 'blur' }
        ],
        casualty: [
          { required: true, message: '人员伤亡情况不能为空', trigger: 'blur' }
        ],
        rectPrevent: [
          { required: true, message: '整改防范措施不能为空', trigger: 'blur' }
        ],
        respUser: [
          { required: true, message: '整改责任人不能为空', trigger: 'blur' }
        ],
        completeDate: [
          { required: true, message: '建议完成期限不能为空', trigger: 'blur' }
        ],
        examIdea: [
          { required: true, message: '审批意见不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 发生等级数据字典 */
    accidentLevelOptions() {
      return this.$store.state.common.accidentLevels;
    },
    /** 事故类别数据字典 */
    accidentTypeOptions() {
      return this.$store.state.common.accidentTypes;
    },
    /** 事故原因数据字典 */
    accidentCauseOptions() {
      return this.$store.state.common.accidentCause;
    }
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
    }
  },
  created() {},
  methods: {
    /** 重置 */
    setup(id) {
      reportDetail(id).then(res => {
        this.form = res.result;
        this.setupUploader(this.form.fileList);
      })
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    //文件上传回调
    handleUploadCompletion(fileList) {
      this.form.fileList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateReport : addReport;
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
        startUser: undefined,
        startDate: undefined,
        name: undefined,
        dept: undefined,
        place: undefined,
        happenDate: undefined,
        level: undefined,
        type: undefined,
        reason: undefined,
        casualty: undefined,
        fireDamage: undefined,
        chemicalsDamage: undefined,
        deviceDamage: undefined,
        technologyDamage: undefined,
        description: undefined,
        findItem: undefined,
        rectPrevent: undefined,
        respUser: undefined,
        completeDate: undefined,
        evidence: undefined,
        analysis: undefined,
        lastReport: undefined,
        examIdea: undefined
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