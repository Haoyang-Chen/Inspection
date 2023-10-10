<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>隐患细分类别统计</span>
    </div>
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import { chartCategory } from "@/api/modules/investigate/analysis";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "MissedBarChart",
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
      chartCategory().then(response => {
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
      data.forEach(item => {
        xData.push(item.subClass);
        totalData.push(item.count);
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, totalData);
    },
    resetOption(xData, totalData) {
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
            name: "分类",
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
            name: "数量",
            type: "bar",
            barWidth: 35,
            color: ["#98cdf0"],
            data: totalData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
