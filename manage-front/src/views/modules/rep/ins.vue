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
            <point-abn-chart ref="pointAbnChart" :loading="loading" :height="chartHeight"></point-abn-chart>
          </el-col>
          <el-col :span="24">
            <line-abn-chart ref="lineAbnChart" :loading="loading" :height="chartHeight"></line-abn-chart>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <line-abn-table ref="lineAbnTable" :loading="loading" :height="tableHeight"></line-abn-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { chartTasks } from "@/api/modules/report/task";
import { pickerOptions, pickerValue, formatDate, verifyInterval } from "./utils";
import PointAbnChart from "@/views/dashboard/report/point-abn-chart";
import LineAbnChart from "@/views/dashboard/report/line-abn-chart";
import LineAbnTable from "@/views/dashboard/report/line-abn-table";

export default {
  name: "InspectTask",
  components: { PointAbnChart, LineAbnChart, LineAbnTable },
  data() {
    return {
      // 遮罩层
      loading: true,
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
      this.loading = true;
      chartTasks(startDate, endDate).then(response => {
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.pointAbnChart.setup(response.jdyctj);
          this.$refs.lineAbnChart.setup(response.lxyczb);
          this.$refs.lineAbnTable.setup(startDate, endDate, response.lxycxq);
        });
      });
    }
  }
};
</script>
