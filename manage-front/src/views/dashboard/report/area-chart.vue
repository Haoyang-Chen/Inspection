<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>区域现场问题统计</span>
    </div>
    <div
      ref="chart"
      v-loading="loading"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "AreaChart",
  mixins: [resize],
  props: {
    loading: {
      type: Boolean,
      default: true
    },
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
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
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
    /** 重置相关值 */
    setup(data) {
      if (!data || !data.length) {
        chartLoading(this.chart, true);
        return;
      }
      const xData = [];
      const problemData = [];
      data.forEach(item => {
        xData.push(item.areaName);
        problemData.push(item.problemCount);
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, problemData);
    },
    resetOption(xData, problemData) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 30,
          left: "2%",
          right: 100,
          bottom: 45,
          containLabel: true
        },
        legend: {
          orient: "vertical",
          data: ["现场问题"],
          right: 0
        },
        dataZoom: [
          {
            type: "slider"
          },
          {
            type: "inside"
          }
        ],
        xAxis: [
          {
            name: "区域",
            type: "category",
            data: xData
            // axisTick: {
            //   alignWithLabel: true
            // },
            // axisLabel: {
            //   interval: 0,
            //   rotate: 35
            // }
          }
        ],
        yAxis: [
          {
            name: "现场问题数(个)",
            nameTextStyle: {
              padding: [0, 0, 0, 80]
            },
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "现场问题",
            type: "bar",
            color: ["#98cdef"],
            barWidth: 45,
            data: problemData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
