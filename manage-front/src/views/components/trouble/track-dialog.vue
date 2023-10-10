<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <track-form
      ref="trackForm"
      v-model="form"
      :visible="visible"
      @disabledChange="handleDisabledChange"
    ></track-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="!submitable" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { trackTrouble } from "@/api/modules/investigate/trouble";
import TrackForm from "./track-form";

export default {
  name: "TroubleTrackDialog",
  components: { TrackForm },
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
      title: "检查跟进",
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: undefined,
      // 是否允许提交
      submitable: true
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
        this.$refs.trackForm.setup(params);
      });
    },
    /** 是否允许提交的状态回调 */
    handleDisabledChange(disabled) {
      this.submitable = !disabled;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs.trackForm
        .validate()
        .then(_ => {
          trackTrouble(this.form).then(response => {
            this.$emit("submitSuccess", { ...this.form });
            this.msgSuccess("跟进成功");
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
