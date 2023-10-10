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
          <el-form-item label="法律法规名称：" prop="title">
            <el-input v-model="form.title" placeholder="请输入法律法规名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制定机关：" prop="formulateDepartment">
            <el-input v-model="form.formulateDepartment" placeholder="请输入制定机关" :disabled="!editable"></el-input>
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
import { addMSDS, updateMSDS, infoMSDS } from "@/api/modules/knowledge/msds";

export default {
  name: "MsdsDialog",
  components: {},
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
        title: [
          { required: true, message: '法律法规名称不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '法律效力位阶不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '时效性不能为空', trigger: 'blur' }
        ],
        filesList: [
          { required: true, message: '文件附件不能为空', trigger: 'blur' }
        ]
      }
    };
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
      infoMSDS(id).then(response => {
        this.form = response.result;
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateMSDS : addMSDS;
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
    },
    initForm() {
      return {
        id: undefined,
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