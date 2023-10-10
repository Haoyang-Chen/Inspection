<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>检点异常统计</span>
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
  name: "PointAbnChart",
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
      const totalData = [];
      const untreatedData = [];
      data.forEach(item => {
        xData.push(item.deviceName);
        totalData.push(item.allCount);
        untreatedData.push(item.unProcessCount);
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, totalData, untreatedData);
    },
    resetOption(xData, totalData, untreatedData) {
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
          right: 90,
          bottom: 45,
          containLabel: true
        },
        legend: {
          orient: "vertical",
          data: ["异常总数", "未处理"],
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
            name: "检点",
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
            name: "异常数(个)",
            nameTextStyle: {
              padding: [0, 0, 0, 60]
            },
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "异常总数",
            type: "bar",
            barGap: 0,
            barWidth: 45,
            color: ["#98cdef"],
            data: totalData,
            animationDuration
          },
          {
            name: "未处理",
            type: "bar",
            barWidth: 45,
            color: ["#00cc50"],
            data: untreatedData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
