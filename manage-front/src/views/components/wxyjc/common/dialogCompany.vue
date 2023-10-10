<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="1000px"
  >
    <Qyjbxx ref="Qyjbxx" :disabled="true" />
  </el-dialog>
</template>

<script>
import Qyjbxx from "@/views/components/wxyjc/qyjbxx/qyjbxx";
export default {
  components: {
    Qyjbxx,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "查看",
    },
  },
  watch: {
    value(val) {
      this.visible = val;
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
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    editTemp(companyId) {
      console.log(companyId);
      this.$nextTick(() => {
        this.$refs["Qyjbxx"].init(companyId);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding: 0 20px 20px 20px;
}
</style>