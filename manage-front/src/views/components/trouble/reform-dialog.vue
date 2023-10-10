<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <reform-form ref="reformForm" v-model="form" :visible="visible"></reform-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { reformTrouble } from "@/api/modules/investigate/trouble";
import ReformForm from "./reform-form";

export default {
  name: "TroubleReformDialog",
  components: { ReformForm },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "720px"
    }
  },
  data() {
    return {
      // 标题
      title: "隐患整改",
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: undefined
    };
  },
  computed: {},
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
    setup(params = undefined) {
      this.$nextTick(() => {
        this.$refs.reformForm.setup(params);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs.reformForm
        .validate()
        .then(_ => {
          reformTrouble(this.form).then(response => {
            this.$emit("submitSuccess", { ...this.form });
            this.msgSuccess("整改成功");
            this.visible = false;
          });
        })
        .catch(function() {});
    },
    // 取消按钮
    cancel() {
      this.$emit("submitCancel");
      this.visible = false;
    }
  }
};
</script>
