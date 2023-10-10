<template>
  <div class="dashboard-editor-container">
    <panel-group ref="panelGroup" />

    <el-row :gutter="24" style="margin-bottom:32px;">
      <el-col :span="12">
        <amount-line-chart :height="chartHeight"></amount-line-chart>
      </el-col>
      <el-col :span="12">
        <source-pie-chart :height="chartHeight"></source-pie-chart>
      </el-col>
    </el-row>

    <category-bar-chart :height="chartHeight"></category-bar-chart>
  </div>
</template>

<script>
import PanelGroup from "@/views/dashboard/trouble/PanelGroup";
import AmountLineChart from "@/views/dashboard/trouble/AmountLineChart";
import SourcePieChart from "@/views/dashboard/trouble/SourcePieChart";
import CategoryBarChart from "@/views/dashboard/trouble/CategoryBarChart";

export default {
  name: "TroubleDashboard",
  components: {
    PanelGroup,
    AmountLineChart,
    SourcePieChart,
    CategoryBarChart
  },
  data() {
    return {
      // 图表高度
      chartHeight: (document.documentElement.scrollHeight - 260) / 2 - 20 + "px"
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
</style>
