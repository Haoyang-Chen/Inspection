<template>
  <div>
    <el-dialog
      :title="editable ? '销警处理' : '查看记录'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      append-to-body
      >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-form">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="报警原因：" prop="operReason">
              <el-input v-model="form.operReason" :disabled="!editable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理结果说明：" prop="operResult">
              <el-input v-model="form.operResult" type="textarea" rows="3" :disabled="!editable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理后图片：" prop="operFileList">
              <uploader
                ref="uploader"
                :editable="editable"
                @uploadCompletion="handleUploadCompletion"
              ></uploader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { operAlarm } from "@/api/modules/video/alarm";
import Uploader from "@/components/Uploader";

export default {
  components: {
    Uploader
  },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示弹出层
      visible: false,
      // 表单参数
      form: this.initFormData(),
      rules: {
        operReason: [
          { required: true, message: '处理原因不能为空', trigger: 'blur' }
        ],
        operResult: [
          { required: true, message: '处理结果不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    setup(data) {
      this.reset();
      this.form = data;
      this.setupUploader(this.form.operFileList);
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.operFileList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          operAlarm(this.form).then(res => {
            this.visible = false;
            this.msgSuccess("处理成功");
            this.$emit("submitSuccess");
          })
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
      this.form = this.initFormData();
      this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    },
    initFormData() {
      return {
        id: undefined,
        operReason: undefined,
        operResult: undefined,
        operFileList: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
