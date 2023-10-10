<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>隐患统计</span>
    </div>
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import { chartAmount } from "@/api/modules/investigate/analysis";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "AbnInspectChart",
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
      chartAmount().then(response => {
        this.setup(response.result);
      });
    },
    /** 重置相关值 */
    setup(data) {
      if (!data || !data.length) {
        chartLoading(this.chart, true);
        return;
      }
      const xData = [];
      const totalData = [];
      const majorData = [];
      data.forEach(item => {
        xData.push(item.month);
        totalData.push(item.total);
        majorData.push(item.zdCount);
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, totalData, majorData);
    },
    resetOption(xData, totalData, majorData) {
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
          left: 30,
          right: 90,
          bottom: 45,
          containLabel: true
        },
        legend: {
          orient: "vertical",
          data: ["隐患总数", "重大隐患数"],
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
            name: "月份",
            type: "category",
            data: xData
          }
        ],
        yAxis: [
          {
            name: "数量(个)",
            nameTextStyle: {
              padding: [0, 0, 0, 45]
            },
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "隐患总数",
            type: "line",
            color: ["#3ca1f8"],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#3ca1f8"
                },
                {
                  offset: 1,
                  color: "#fff"
                }
              ])
            },
            smooth: false,
            data: totalData,
            animationDuration
          },
          {
            name: "重大隐患数",
            type: "line",
            color: ["#00cc50"],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#00cc50"
                },
                {
                  offset: 1,
                  color: "#fff"
                }
              ])
            },
            smooth: false,
            data: majorData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
