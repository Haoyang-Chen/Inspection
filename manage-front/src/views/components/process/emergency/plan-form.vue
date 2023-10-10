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
              format="yyyy-MM-dd"
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
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预案名称：" prop="planName">
            <el-input v-model="form.planName" placeholder="请输入预案名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适用部门：" prop="useDept">
            <el-input v-model="form.useDept" placeholder="请输入适用部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预案类型：" prop="planType">
            <el-input v-model="form.planType" placeholder="请输入预案类型" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危险源关联：" prop="hazard">
            <el-input v-model="form.hazard" placeholder="请输入危险源关联" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预案级别：" prop="planLevel">
            <el-select
              v-model="form.planLevel"
              placeholder="请选择预案级别"
              clearable
              :disabled="!editable"
              style="width: 100%"
            >
              <el-option
                v-for="dict in planLevelOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="风险编号：" prop="riskNumber">
            <el-input v-model="form.riskNumber" placeholder="请输入风险编号" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编写日期：" prop="writeDate">
            <el-date-picker
              v-model="form.writeDate"
              :disabled="!editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="预案附件：" prop="fileList">
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
      <el-button @click="cancel">{{ editable ? '取 消' : '关 闭' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Uploader from "@/components/Uploader";
import { addPlan, updatePlan, planDetail } from "@/api/modules/process/emergency/plan";
import { getCurrentDate } from "@/views/modules/ins/utils";

export default {
  name: "PlanForm",
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
      rules: {
        maker: [
          { required: true, message: '制订人不能为空', trigger: 'blur' }
        ],
        makeDept: [
          { required: true, message: '制订部门不能为空', trigger: 'blur' }
        ],
        makeDate: [
          { required: true, message: '制订时间不能为空', trigger: 'blur' }
        ],
        editDate: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' }
        ],
        planName: [
          { required: true, message: '预案名称不能为空', trigger: 'blur' }
        ],
        useDept: [
          { required: true, message: '适用部门不能为空', trigger: 'blur' }
        ],
        planType: [
          { required: true, message: '预案类型不能为空', trigger: 'blur' }
        ],
        hazard: [
          { required: true, message: '危险源关联不能为空', trigger: 'blur' }
        ],
        planLevel: [
          { required: true, message: '预案级别不能为空', trigger: 'blur' }
        ],
        riskNumber: [
          { required: true, message: '风险编号不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 预案级别数据字典 */
    planLevelOptions() {
      return this.$store.state.common.planLevels;
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
      planDetail(id).then(res => {
        this.form = res.result;
        this.setupUploader(this.form.fileList);
      }) 
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
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
          opFunc = this.form.id ? updatePlan : addPlan;
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
        planName: undefined,
        useDept: undefined,
        planType: undefined,
        hazard: undefined,
        planLevel: undefined,
        riskNumber: undefined,
        writeDate: undefined,
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