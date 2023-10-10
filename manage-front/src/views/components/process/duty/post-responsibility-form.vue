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
          <el-form-item label="岗位：" prop="post">
            <el-input v-model="form.post" placeholder="请输入岗位" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位职责：" prop="postResp">
            <el-input v-model="form.postResp" placeholder="请输入岗位职责" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="目标责任书：" prop="targetResp">
            <el-input v-model="form.targetResp" placeholder="请输入目标责任书" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="序号：" prop="number">
            <el-input v-model="form.number" placeholder="请输入序号" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="目标责任：" prop="memo">
            <el-input v-model="form.memo" placeholder="请输入目标责任" type="textarea" :rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件：" prop="fileList">
            <Uploader
              ref="uploader"
              listType="text"
              :multiple="false"
              accept="*"
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
import { addResp, updateResp } from "@/api/modules/process/duty/postResponsibility";

export default {
  name: "PostResponsibilityForm",
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
        post: [
          { required: true, message: '岗位不能为空', trigger: 'blur' }
        ],
        postResp: [
          { required: true, message: '岗位职责不能为空', trigger: 'blur' }
        ],
        targetResp: [
          { required: true, message: '目标责任书不能为空', trigger: 'blur' }
        ],
        memo: [
          { required: true, message: '目标责任不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 目标类型数据字典 */
    targetTypeOptions() {
      return this.$store.state.common.targetTypes;
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
          opFunc = this.form.id ? updateResp : addResp;
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
      this.setupUploader()
    },
    initForm() {
      return {
        id: undefined,
        post: undefined,
        postResp: undefined,
        targetResp: undefined,
        number: undefined,
        fileList: [],
        memo: undefined
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