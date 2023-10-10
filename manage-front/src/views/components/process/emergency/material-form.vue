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
          <el-form-item label="物资名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入物资名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物资编号：" prop="number">
            <el-input v-model="form.number" :placeholder="editable ? '请输入物资编号' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物资用途：" prop="purpose">
            <el-input v-model="form.purpose" :placeholder="editable ? '请输入物资用途' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物资型号：" prop="mode">
            <el-input v-model="form.mode" :placeholder="editable ? '请输入物资型号' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责部门：" prop="dept">
            <el-input v-model="form.dept" placeholder="请输入负责部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物资分类：" prop="type">
            <el-input v-model="form.type" placeholder="请输入物资分类" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存放位置：" prop="place">
            <el-input v-model="form.place" :placeholder="editable ? '请输入存放位置' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储数量：" prop="amount">
            <el-input v-model="form.amount" :placeholder="editable ? '请输入存储数量' : ''" :disabled="!editable" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生命周期：" prop="lifeStatus">
            <el-select
              v-model="form.lifeStatus"
              :placeholder="editable ? '请选择生命周期' : ''"
              clearable
              :disabled="!editable"
              style="width:100%"
              >
              <el-option
                v-for="dict in lifeStatusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
            />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投用日期：" prop="useDate">
            <el-date-picker
              v-model="form.useDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="editable ? '请选择日期' : ''"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产日期：" prop="productDate">
            <el-date-picker
              v-model="form.productDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="editable ? '请选择日期' : ''"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用期限：" prop="lifespan">
            <el-input v-model="form.lifespan" :placeholder="editable ? '请输入使用期限' : ''" :disabled="!editable" style="width:200px" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input>
            <span style="padding-left:10px">月</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上次检查日期：" prop="lastCheckDate">
            <el-date-picker
              v-model="form.lastCheckDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="editable ? '请选择日期' : ''"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下次检查日期：" prop="nextCheckDate">
            <el-date-picker
              v-model="form.nextCheckDate"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="editable ? '请选择日期' : ''"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物资状态：" prop="status">
            <el-select
              v-model="form.status"
              :placeholder="editable ? '请选择物资状态' : ''"
              :disabled="!editable"
              clearable
              >
              <el-option label="完好" value="完好"></el-option>
              <el-option label="维修" value="维修"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用说明：" prop="useDesc">
            <el-input v-model="form.useDesc" :placeholder="editable ? '请输入使用说明' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">{{ editable ? '取 消' : '关 闭'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addMaterial, updateMaterial, materialDetail } from "@/api/modules/process/emergency/material";

export default {
  name: "MaterialForm",
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
        name: [
          { required: true, message: '物资名称不能为空', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '负责部门不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '物资分类不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    // 生命周期数据字典
    lifeStatusOptions() {
      return this.$store.state.common.lifeStatus;
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
      materialDetail(id).then(res => {
        this.form = res.result;
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateMaterial : addMaterial;
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
        purpose: undefined,
        mode: undefined,
        dept: undefined,
        type: undefined,
        place: undefined,
        amount: undefined,
        lifeStatus: undefined,
        useDate: undefined,
        productDate: undefined,
        lifespan: undefined,
        lastCheckDate: undefined,
        lastCheckDate: undefined,
        status: undefined,
        useDesc: undefined
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .tipsFont .el-input__inner{
  color:red
}
.el-icon-circle-plus {
  color: #1890ff;
  font-size: 26px;
  margin-right: 5px;
}
.el-icon-remove {
  color: #ff4949;
  font-size: 26px;
}
</style>