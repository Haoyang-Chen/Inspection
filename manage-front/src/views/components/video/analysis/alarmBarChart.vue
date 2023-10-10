<template>
  <el-card shadow="never">
    <div slot="header" style="font-weight:bold;">
      <span>近10日报警数量</span>
    </div>
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "@/utils/chartLoading";
import { recentquantity } from "@/api/modules/video/alarm";

const animationDuration = 3000;

export default {
  name: "AreaBarChart",
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
      recentquantity().then(response => {
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
      const notProcessedData = [];
      data.forEach(item => {
        xData.push(item.day);
        totalData.push(item.number);
        notProcessedData.push(item.notProcessed);
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, totalData, notProcessedData);
    },
    resetOption(xData, totalData, notProcessedData) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["报警数量", "未销警"],
          left: "right",
          itemWidth: 14,
          itemHeight: 14,
          icon: 'circle'
        },
        grid: {
          top: 40,
          left: 30,
          right: 0,
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
            type: "category",
            data: xData
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: "报警数量",
            type: "bar",
            barWidth: '30%',
            color: ["#d97b7f"],
            data: totalData,
            animationDuration
          },
          {
            name: "未销警",
            type: "bar",
            barWidth: '30%',
            color: ["#29cac8"],
            data: notProcessedData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
