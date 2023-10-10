<template>
  <span>
    <el-popover v-model="visible" placement="right" width="162">
      <div style="text-align:center">
        <div v-if="type != 3" class="popover-item">
          <el-button
            type="primary"
            icon="el-icon-user"
            class="item-button"
            circle
            @click="handleUser"
          ></el-button>
          <div class="item-text">设置人员</div>
        </div>
        <div v-if="type != 2" class="popover-item">
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="item-button"
            circle
            @click="handleDel"
          ></el-button>
          <div class="item-text">删除节点</div>
        </div>
      </div>
      <i slot="reference" class="el-icon-setting popover-slot"></i>
    </el-popover>
    <user-picker-dialog
      ref="userPickerDialog"
      v-model="open"
      :multipleApv="multipleApv"
      @pickSuccess="handleUserPick"
    ></user-picker-dialog>
  </span>
</template>

<script>
import UserPickerDialog from "./user-picker-dialog";

export default {
  name: "SettingPopover",
  components: { UserPickerDialog },
  props: {
    nodeProp: {
      type: String,
      required: true
    },
    // 节点数据
    nodeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 是否显示popover弹出层
      visible: false,
      // 是否显示dialog弹出层
      open: false
    };
  },
  computed: {
    // popover类型1-全部显示，2-仅显示设置人员，3-仅显示删除节点
    type() {
      return this.nodeData.setting;
    },
    // 是否允许多个审批节点
    multipleApv() {
      return this.nodeData.multipleApv;
    }
  },
  watch: {},
  created() {},
  methods: {
    handleUser() {
      this.visible = false;
      this.open = true;
      const parseData = JSON.parse(JSON.stringify(this.nodeData));
      this.$nextTick(() => {
        this.$refs.userPickerDialog.setup(parseData);
      });
    },
    handleUserPick(users) {
      const parseData = JSON.parse(JSON.stringify(users));
      this.$emit("approveChange", this.nodeProp, parseData);
    },
    handleDel() {
      this.$emit("deleteSuccess", this.nodeProp);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.popover-item {
  display: inline-block;
  text-align: center;
  margin: 0 5px;
  .item-button {
    width: 40px;
    height: 40px;
  }
  .item-text {
    margin-top: 5px;
  }
}
.popover-slot {
  float: right;
  margin-top: 2px;
}
</style>
