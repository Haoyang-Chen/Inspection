<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!--搜索数据-->
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="queryParams.startDate"
              type="date"
              placeholder="开始日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width:160px;"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.endDate"
              type="date"
              placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width:160px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="24">
          <el-col :span="24" style="padding-bottom:20px;">
            <staff-att-chart ref="staffAttChart" :height="chartHeight"></staff-att-chart>
          </el-col>
          <el-col :span="24">
            <team-leak-chart ref="teamLeakChart" :height="chartHeight"></team-leak-chart>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <inspect-att-table ref="inspectAttTable" :height="tableHeight"></inspect-att-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pickerOptions, pickerValue, formatDate, verifyInterval } from "./utils";
import StaffAttChart from "@/views/dashboard/report/staff-att-chart";
import TeamLeakChart from "@/views/dashboard/report/team-leak-chart";
import InspectAttTable from "@/views/dashboard/report/inspect-att-table";

export default {
  name: "StaffAttendance",
  components: { StaffAttChart, TeamLeakChart, InspectAttTable },
  data() {
    return {
      // 不可选日期
      searchOptions: pickerOptions,
      // 查询条件
      queryParams: {
        startDate: pickerValue()[0],
        endDate: pickerValue()[1]
      },
      // 图表高度
      chartHeight:
        (document.documentElement.scrollHeight - 310) / 2 - 20 + "px",
      // 列表高度
      tableHeight:
        ((document.documentElement.scrollHeight - 310) / 2 - 20) * 2 + 97 + "px"
    };
  },
  created() {
    this.handleQuery();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      if (!this.queryParams.startDate || !this.queryParams.endDate) {
        this.$message.error("请选择时间");
        return;
      }
      if (!verifyInterval(this.queryParams.startDate, this.queryParams.endDate, 10)) {
        this.$message.error("时间范围不能超过10天,请重新选择");
        return;
      }
      this.resetReports();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        startDate: pickerValue()[0],
        endDate: pickerValue()[1]
      };
      this.handleQuery();
    },
    resetReports() {
      const startDate = formatDate(this.queryParams.startDate, true);
      const endDate = formatDate(this.queryParams.endDate, false);
      this.$nextTick(() => {
        this.$refs.staffAttChart.setup(startDate, endDate);
        this.$refs.teamLeakChart.setup(startDate, endDate);
        this.$refs.inspectAttTable.setup(startDate, endDate);
      });
    }
  }
};
</script>
