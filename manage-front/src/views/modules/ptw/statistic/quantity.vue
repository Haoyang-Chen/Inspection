<template>
  <div class="dashboard-editor-container">
    <el-card style="margin-bottom:32px;">
      <div slot="header" style="font-weight:bold;">
        <span>作业票统计</span>
      </div>
      <quantity-pie-chart
        width="38%"
        :height="chartHeight"
      ></quantity-pie-chart>
      <quantity-line-chart
        width="61%"
        :height="chartHeight"
      ></quantity-line-chart>
    </el-card>

    <el-row :gutter="24">
      <el-col :span="16">
        <area-bar-chart :height="chartHeight"></area-bar-chart>
      </el-col>
      <el-col :span="8">
        <type-pie-chart :height="chartHeight"></type-pie-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import QuantityPieChart from "@/views/dashboard/work/QuantityPieChart";
import QuantityLineChart from "@/views/dashboard/work/QuantityLineChart";
import AreaBarChart from "@/views/dashboard/work/AreaBarChart";
import TypePieChart from "@/views/dashboard/work/TypePieChart";

export default {
  name: "WorkDashboard",
  components: {
    QuantityPieChart,
    QuantityLineChart,
    AreaBarChart,
    TypePieChart
  },
  data() {
    return {
      // 图表高度
      chartHeight: (document.documentElement.scrollHeight - 290) / 2 - 20 + "px"
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
