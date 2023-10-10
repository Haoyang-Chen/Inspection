<template>
  <div>
    <div class="sign-widget">
      <el-button
        type="primary"
        :disabled="editable ? signs.length >= 6 : true"
        @click="open = true"
        >选择标识</el-button
      >
      <sign-display
        v-model="signs"
        :editable="editable"
        :dividerable="false"
        style="margin-left:-12px"
      />
    </div>

    <!-- 警示标识对话框 -->
    <sign-dialog
      v-model="open"
      :selects="signs"
      @change="handleSignChange"
    ></sign-dialog>
  </div>
</template>

<script>
import SignDisplay from "../risk-card-dialog/sign-display";
import SignDialog from "../risk-card-dialog/sign-dialog";

export default {
  name: "RiskSignWidget",
  components: { SignDisplay, SignDialog },
  props: {
    value: {
      type: Array,
      default: true
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 警示标志
      signs: []
    };
  },
  computed: {},
  watch: {
    value: {
      handler(val) {
        if (!val || !val.length) this.signs = [];
        else this.signs = val;
      },
      immediate: true
    }
    // signs(val) {
    //   const data = val || [];
    //   // this.$emit("input", data);
    // }
  },
  created() {},
  methods: {
    /** 选择警示标识回调 */
    handleSignChange(value) {
      const signs = value || [];
      this.signs = signs;
      this.$emit("getWarnSignList", this.signs);
    }
  }
};
</script>

<style lang="scss">
.sign-widget {
  margin-left: -40px;
  .sign-display {
    margin: 0;
  }
}
</style>
