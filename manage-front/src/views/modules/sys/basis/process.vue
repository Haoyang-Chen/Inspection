<template>
  <div class="app-container">
    <el-tabs
      v-model="current"
      :stretch="true"
      class="process-tab"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="(item, index) in typeOptions"
        :key="index"
        :label="item.label"
        :name="String(item.value)"
      ></el-tab-pane>
    </el-tabs>
    <work-process ref="workProcess"></work-process>
  </div>
</template>

<script>
import WorkProcess from "@/views/components/ptw/process";

export default {
  name: "ProcessSetting",
  components: { WorkProcess },
  data() {
    return {
      current: "1"
    };
  },
  computed: {
    /** 作业票种类 */
    typeOptions() {
      return this.$store.state.common.workTypes;
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.workProcess.setup(1, 1);
    });
  },
  methods: {
    handleTabClick(tab, event) {
      const type = Number(tab.name);
      const level = [1, 3, 4].includes(type) ? 1 : undefined;
      this.$refs.workProcess.setup(type, level);
    }
  }
};
</script>

<style lang="scss">
.process-tab {
  .el-tabs__item {
    color: #666;
  }
  .el-tabs__item.is-active {
    color: #3399ff;
  }
  .el-tabs__active-bar {
    background-color: #3399ff;
  }
}
</style>
