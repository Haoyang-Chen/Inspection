<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="24">
      <el-col :span="12">
        <approve-bar-chart :height="barChartHeight"></approve-bar-chart>
      </el-col>
      <el-col :span="12">
        <problem-pie-chart :height="pieChartHeight"></problem-pie-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApproveBarChart from "@/views/dashboard/work/ApproveBarChart";
import ProblemPieChart from "@/views/dashboard/work/ProblemPieChart";

export default {
  name: "WorkDashboard",
  components: {
    ApproveBarChart,
    ProblemPieChart
  },
  data() {
    return {
      // 图表高度
      barChartHeight: document.documentElement.scrollHeight - 335 + "px",
      pieChartHeight: document.documentElement.scrollHeight - 275 + "px"
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
