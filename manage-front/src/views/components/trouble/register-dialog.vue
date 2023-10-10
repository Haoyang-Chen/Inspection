<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <register-form
      ref="registerForm"
      v-model="form"
      :fromRisk="fromRisk"
      :editable="editable"
      :visible="visible"
    ></register-form>
    <div slot="footer" class="dialog-footer">
      <template v-if="editable">
        <el-button type="primary" @click="submitForm(0)">保 存</el-button>
        <el-button type="primary" @click="submitForm(1)">保存并提交</el-button>
      </template>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addTrouble,
  updateTrouble,
  approveTrouble
} from "@/api/modules/investigate/trouble";
import RegisterForm from "./register-form";

export default {
  name: "TroubleRegisterDialog",
  components: { RegisterForm },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 调用入口 false-隐患排查/检查管理,true-隐患排查/隐患管理
    fromRisk: {
      type: Boolean,
      default: false
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: "720px"
    }
  },
  data() {
    return {
      // 标题
      title: "隐患",
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: undefined
    };
  },
  computed: {
    /** 弹出层标题 */
    dialogTitle() {
      return !this.editable ? "隐患详情" : this.title;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(troubleId = undefined, temporary = undefined) {
      this.$nextTick(() => {
        this.$refs.registerForm.setup(troubleId, temporary);
      });
      if (troubleId) {
        this.title = "编辑隐患";
      } else {
        if (temporary) {
          this.title = "修改隐患";
        } else {
          this.title = "添加隐患";
        }
      }
    },
    /** 提交按钮 */
    submitForm: function(val) {
      this.form.examStatus = val;
      if (val === 1) {
        this.$refs.registerForm
          .validate()
          .then(_ => {
            this.submit();
          })
          .catch(function() {});
      } else {
        this.submit();
      }
    },
    submit() {
      if (this.fromRisk) {
        this.formRequest(addTrouble, approveTrouble, this.form).then(_ => {
          this.submitSuccess(false);
        });
      } else {
        this.submitSuccess();
      }
    },
    // 取消按钮
    cancel() {
      this.$emit("submitCancel");
      this.visible = false;
    },
    submitSuccess(showMsg = true) {
      this.$emit("submitSuccess", { ...this.form });
      if (showMsg) this.msgSuccess(this.title.replace("隐患", "成功"));
      this.visible = false;
    }
  }
};
</script>
