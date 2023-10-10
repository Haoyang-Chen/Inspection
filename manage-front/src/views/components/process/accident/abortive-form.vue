<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="130px">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="事件名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入事件名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="事件部门：" prop="dept">
            <el-input v-model="form.dept" placeholder="请输入事件部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事件类别：" prop="type">
            <el-input v-model="form.type" placeholder="请输入事件类别" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事件发生时间：" prop="happenDate">
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
        <el-col :span="12">
          <el-form-item label="事件原因：" prop="reason">
            <el-input v-model="form.reason" :placeholder="editable ? '请输入事件原因' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事件发生地点：" prop="place">
            <el-input v-model="form.place" :placeholder="editable ? '请输入事件发生地点' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事件经过：" prop="detail">
            <el-input v-model="form.detail" type="textarea" :rows="3" :placeholder="editable ? '请输入事件经过' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="memo">
            <el-input v-model="form.memo" :placeholder="editable ? '请输入备注' : ''" type="textarea" :rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="照片：" prop="photoList">
            <Uploader
              ref="uploader"
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
      <el-button @click="cancel">{{ editable ? "取 消" : "关 闭" }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addAbortive, updateAbortive } from "@/api/modules/process/accident/abortive";
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
        name: [
          { required: true, message: '事件名称不能为空', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '事件部门不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '事件类别不能为空', trigger: 'blur' }
        ],
        happenDate: [
          { required: true, message: '事件发生时间不能为空', trigger: 'blur' }
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
      this.setupUploader(this.form.photoList);
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    //文件上传回调
    handleUploadCompletion(fileList) {
      this.form.photoList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateAbortive : addAbortive;
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
        name: undefined,
        dept: undefined,
        type: undefined,
        happenDate: undefined,
        reason: undefined,
        place: undefined,
        detail: undefined,
        memo: undefined,
        photoList: []
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