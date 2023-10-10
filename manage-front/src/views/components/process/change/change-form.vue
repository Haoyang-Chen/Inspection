<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="130px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="申请人：" prop="applyUser">
            <el-input v-model="form.applyUser" placeholder="请输入申请人" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请日期：" prop="applyDate">
            <el-date-picker
              v-model="form.applyDate"
              :disabled="!editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请部门：" prop="applyDept">
            <el-input v-model="form.applyDept" placeholder="请输入部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变更类型：" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择变更类型"
              clearable
              :disabled="!editable"
              style="width: 100%"
            >
              <el-option
                v-for="dict in chagneTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变更所属区域：" prop="area">
            <el-input v-model="form.area" placeholder="请输入变更所属区域" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="风险编号：" prop="riskNumber">
            <el-input v-model="form.riskNumber" placeholder="请输入风险编号" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="title">起草</div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="变更前：" prop="changeBefore">
            <el-input v-model="form.changeBefore" placeholder="请输入变更前" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="变更后：" prop="changeAfter">
            <el-input v-model="form.changeAfter" placeholder="请输入变更后" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="原因：" prop="reason">
            <el-input v-model="form.reason" placeholder="请输入原因" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="安全措施：" prop="safetyMeasure">
            <el-input v-model="form.safetyMeasure" placeholder="请输入安全措施" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件：" prop="fileList">
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
          <div class="title">起草人结办</div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="变更完成情况：" prop="completeState">
            <el-input v-model="form.completeState" placeholder="请输入完成情况" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="title">审批意见</div>
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
      <el-button @click="cancel">{{ editable ? "取 消" : "关 闭" }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, update } from "@/api/modules/process/change/list";
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
        area: [
          { required: true, message: '变更所属区域不能为空', trigger: 'blur' }
        ],
        riskNumber: [
          { required: true, message: '风险编号不能为空', trigger: 'blur' }
        ],
        changeBefore: [
          { required: true, message: '变更前不能为空', trigger: 'blur' }
        ],
        changeAfter: [
          { required: true, message: '变更后不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '原因不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 变更类型数据字典 */
    chagneTypeOptions() {
      return this.$store.state.common.chagenTypes;
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
    setup(params) {
      this.form = JSON.parse(JSON.stringify(params));
      this.setupUploader(this.form.fileList);
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
          opFunc = this.form.id ? update : add;
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
        applyUser: undefined,
        applyDate: undefined,
        applyDept: undefined,
        type: undefined,
        area: undefined,
        riskNumber: undefined,
        changeBefore: undefined,
        changeAfter: undefined,
        reason: undefined,
        safetyMeasure: undefined,
        fileList: [],
        completeState: undefined,
        examState: undefined
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .tipsFont .el-input__inner{
  color:red
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}
</style>