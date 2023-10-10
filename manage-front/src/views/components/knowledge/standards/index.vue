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
          <el-form-item label="标准编号：" prop="no">
            <el-input v-model="form.no" placeholder="请输入标准编号" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准名称：" prop="title">
            <el-input v-model="form.title" placeholder="请输入标准名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="正文：" style="height:420px;">
            <Editor v-model="form.content" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布部门：" prop="formulateDepartment">
            <el-input v-model="form.formulateDepartment" placeholder="请输入发布部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施行日期：" prop="applyTime">
            <el-date-picker
              v-model="form.applyTime"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="施行日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择状态"
              clearable
              :disabled="!editable"
              style="width:100%"
              >
              <el-option v-for="item in standardStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文件附件：" prop="filesList">
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
import { addStandard, updateStandard, infoStandard } from "@/api/modules/knowledge/standards";
import Editor from '@/components/Editor';

export default {
  name: "StandardsDialog",
  components: { Uploader, Editor },
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
      default: "新增"
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
      // 表单校验
      rules: {
        no: [
          { required: true, message: '标准编号不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标准名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        filesList: [
          { required: true, message: '文件附件不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 状态数据字典 */
    standardStatusOptions() {
      return this.$store.state.common.standardStatus;
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
      infoStandard(id).then(response => {
        this.form = response.result;
        this.setupUploader(this.form.filesList);
      })
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 文件上传回调 */
    handleUploadCompletion(fileList) {
      this.form.filesList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateStandard : addStandard;
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
        no: undefined,
        title: undefined,
        content: undefined,
        type: undefined,
        applyTime: undefined,
        formulateDepartment: undefined,
        status: undefined,
        filesList: undefined
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