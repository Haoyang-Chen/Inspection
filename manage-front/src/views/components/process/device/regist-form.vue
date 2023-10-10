<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入设备名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编码：" prop="number">
            <el-input v-model="form.number" placeholder="请输入设备编码" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格型号：" prop="model">
            <el-input v-model="form.model" placeholder="请输入规格型号" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型：" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择设备类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用日期：" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              :disabled="!editable"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择启用日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="耐用年限：" prop="deadDate">
            <el-date-picker
              v-model="form.deadDate"
              :disabled="!editable"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择耐用年限"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产厂商：" prop="createCompany">
            <el-input v-model="form.createCompany" placeholder="请输入生产厂商" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安装及变动情况：" prop="detail">
            <el-input v-model="form.detail" placeholder="请输入安装及变动情况" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次检测日期：" prop="nextCheckDate">
            <!-- 当前日期早于下次检测日期，显示红色字体，作为报警提示。 -->
            <el-date-picker
              v-model="form.nextCheckDate"
              :disabled="!editable"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择下次检测日期"
              style="width: 100%"
              :class="getCurrentDate() >= form.nextCheckDate ? 'tipsFont' : ''"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="memo">
            <el-input v-model="form.memo" placeholder="请输入备注" type="textarea" :rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCurrentDate } from '@/views/modules/ins/utils';
import { addDevice, updateDevice } from "@/api/modules/process/device";

export default {
  name: "RegistForm",
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
      getCurrentDate,
      rules: {
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '设备编码不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '设备类型不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 设备类型数据字典 */
    typeOptions() {
      return this.$store.state.common.deviceClass;
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
          opFunc = this.form.id ? updateDevice : addDevice;
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
        name: undefined,
        number: undefined,
        model: undefined,
        type: undefined,
        startDate: undefined,
        deadDate: undefined,
        createCompany: undefined,
        detail: undefined,
        nextCheckDate: undefined,
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