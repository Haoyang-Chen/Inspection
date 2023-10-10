<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="800px"
  >
    <el-row class="table-list">
      <el-col class="item" :span="8">
        <div class="box">
          <span>物质：氧气</span>
          <span>LEL：20.9%</span>
          <b>位号：V101氧气</b>
        </div>
      </el-col>
      <el-col class="item" :span="8">
        <div class="box">
          <span>物质：氧气</span>
          <span>LEL：20.9%</span>
          <b>位号：V101氧气</b>
        </div>
      </el-col>
      <el-col class="item" :span="8">
        <div class="box">
          <span>物质：氧气</span>
          <span>LEL：20.9%</span>
          <b>位号：V101氧气</b>
        </div>
      </el-col>
      
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
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
    //取消
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-list {
  .item {
    color: #606266;
    padding: 4px;

    .box {
      transition: all 300ms ease-in-out;
      border: 1px solid #c0c4cc;
      padding: 20px;
      border-radius: 4px;
      background: url("../../../../assets/image/monitor01.png") no-repeat right
        20px center;

      background-size: 50px;
      span {
        display: block;
        padding: 4px 0;
      }
      b {
        margin-top: 10px;
        display: block;
        color: #303133;
      }
    }
    .box:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
  }
}
</style>