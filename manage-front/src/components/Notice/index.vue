<template>
  <el-dropdown trigger="hover">
    <div class="notice" style="color:white;">
      <i v-if="unreadMessage.total <= 0" class="el-icon-bell"></i>
      <el-badge v-else :value="unreadMessage.total" style="z-index:9999">
        <i class="el-icon-bell"></i>
      </el-badge>
    </div>
    <el-dropdown-menu style="width:180px" slot="dropdown">
      <div class="notice-title">
        {{ unreadMessage.total > 0 ? "消息中心" : "暂无消息" }}
      </div>
      <router-link
        v-for="(type, index) in unreadMessage.types"
        :key="index"
        to="/sys/msg/list"
      >
        <el-dropdown-item>
          <div class="notice-message">
            <div>{{ type.name }}</div>
            <div>
              <span>(</span>
              <span style="color:#ff4949">{{ type.count }}</span>
              <span>)</span>
            </div>
          </div>
        </el-dropdown-item>
      </router-link>
    </el-dropdown-menu>
  </el-dropdown>

  <!-- <el-popover placement="bottom" width="200" trigger="hover">
    <div>
      <div class="title">消息中心</div>
    </div>
    <div class="notice" style="color:white;" slot="reference">
      <el-badge :value="count">
        <i class="el-icon-bell"></i>
      </el-badge>
    </div>
  </el-popover>-->
</template>

<script>
export default {
  name: "Notice",
  data() {
    return {
      count: 5
    };
  },
  computed: {
    /** 消息类型 */
    unreadMessage() {
      return this.$store.state.common.unreadMessage;
    }
  },
  created() {
    this.$store.dispatch("GetUnreadMessage");
  },
  methods: {}
};
</script>

<style scoped>
.notice-title {
  padding: 0;
  text-align: center;
  color: #a3a3a3;
  height: 24px;
  font-size: 14px;
  line-height: 24px;
}
.notice-message {
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
}
</style>

<style>
.notice .el-badge__content {
  border-width: 0;
}
.notice sup {
  top: 16px !important;
}
</style>
