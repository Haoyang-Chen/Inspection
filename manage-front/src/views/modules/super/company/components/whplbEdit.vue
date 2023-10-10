<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="356px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      :size="size"
      :disabled="!editable"
    >
      <el-form-item label="危化品类别" prop="riskNo">
        <el-select v-model="ruleForm.riskNo" placeholder="请选择">
          <el-option
            v-for="item in dangerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="危险系数" prop="riskFactor">
        <el-input v-model="ruleForm.riskFactor"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="editable">
      <el-button :size="size" @click="handleCancel()">取消</el-button>
      <el-button :size="size" type="primary" @click="submitForm()"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
import {
  save_API,
  update_API,
  info_API,
} from "@/api/modules/wxyjc/wxyjcriskfactorcategory";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "编辑",
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.getAlltypeList();
      }
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      // 是否显示弹出层
      visible: this.value,
      size: "small",
      dangerList: [],
      ruleForm: {
        riskFactor: undefined, //危险系数
        riskNo: undefined, //危化品编码
      },
      rules: {
        riskFactor: [{ required: true, message: "危险系数", trigger: "blur" }],
        riskNo: [{ required: true, message: "危化品编码", trigger: "blur" }],
      },
    };
  },
  methods: {
    getAlltypeList() {
      wxyjcdictindex_API("wxhxpfl").then((res) => {
        this.dangerList = res.result;
      });
    },
    //取消
    handleCancel() {
      this.visible = false;
      this.handleReset();
    },
    handleReset() {
      this.resetForm("ruleForm");
      this.ruleForm.id = undefined;
    },
    editTemp(id) {
      if (id) {
        info_API(id).then((res) => {
          this.ruleForm = res.result;
        });
      }
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, update_API, this.ruleForm).then((_) => {
            this.$emit("closeView");
            this.handleCancel();
          });
        }
      });
    },
  },
};
</script>

<style>
</style>