<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="目标内容：" prop="content">
            <el-input v-model="form.content" placeholder="请输入目标内容" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型：" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择类型"
              clearable
              :disabled="!editable"
              style="width: 100%"
            >
              <el-option
                v-for="dict in targetTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="年份：" prop="year">
            <el-date-picker
              v-model="form.year"
              :disabled="!editable"
              value-format="yyyy"
              type="year"
              placeholder="请选择年份"
            ></el-date-picker>
            <span style="padding-left:10px">年</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述信息：" prop="description">
            <el-input v-model="form.description" placeholder="请输入描述信息" type="textarea" :rows="3" :disabled="!editable"></el-input>
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
import { addTargetSet, updateTargetSet } from "@/api/modules/process/duty/targetSetting";

export default {
  name: "TargetSettingForm",
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
        content: [
          { required: true, message: '目标内容不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        year: [
          { required: true, message: '年份不能为空', trigger: 'blur' }
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
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateTargetSet : addTargetSet;
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
        content: undefined,
        type: undefined,
        year: undefined,
        description: undefined
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