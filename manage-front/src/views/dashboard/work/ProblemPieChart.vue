<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>各类问题占比</span>
    </div>
    <el-row>
      <!--搜索数据-->
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="queryParams.createTimeStart"
              type="datetime"
              placeholder="开始日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width:170px"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.createTimeEnd"
              type="datetime"
              placeholder="结束日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width:170px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <div
          ref="chart"
          :class="className"
          :style="{ height: height, width: width }"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { chartProblem } from "@/api/modules/ptw/analysis";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "ProblemPieChart",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    }
  },
  data() {
    return {
      queryParams: {
        createTimeStart: undefined,
        createTimeEnd: undefined
      },
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      this.getData();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    /** 初始化图表 */
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons");
    },
    /** 查询数据 */
    getData() {
      chartProblem(this.queryParams).then(response => {
        this.setup(response.result);
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.clearDateRange(
        this.queryParams,
        'createTimeStart',
        'createTimeEnd'
      );
      this.handleQuery();
    },
    /** 重置相关值 */
    setup(data) {
      if (!data || !data.length) {
        chartLoading(this.chart, true);
        return;
      }
      const seriesData = [];
      data.forEach(item => {
        seriesData.push({
          value: item.count,
          name: item.problem
        });
      });
      chartLoading(this.chart, false);
      this.resetOption(seriesData);
    },
    resetOption(seriesData) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "占比",
            type: "pie",
            data: seriesData,
            radius: ["0", "55%"],
            label: {
              formatter: "{b|{b}}\n {c|{c}个} {per|{d}%} ",
              rich: {
                b: {
                  lineHeight: 20,
                  align: "center"
                }
              }
            },
            animationEasing: "cubicInOut",
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
