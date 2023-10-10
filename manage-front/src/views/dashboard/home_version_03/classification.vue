<template>
  <div class="box-bg">
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width, display: 'inline-block' }"
    />
  </div>
</template>

<script>
import { troubleReport_API } from "@/api/modules/home/index";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "./utils";

const animationDuration = 3000;

export default {
  name: "MissedBarChart",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
  },
  data() {
    return {
      chart: null,
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
      troubleReport_API().then((response) => {
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
      const totalData = []; // 隐患总数
      const missedData = []; // 未整改数
      data.forEach((item) => {
        xData.push(item.m);
        totalData.push(item.yzg + item.wzg);
        missedData.push(item.wzg);
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, totalData, missedData);
    },
    resetOption(xData, totalData, missedData) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top: 30,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        legend: {
          data: ["隐患总数", "未整改数"],
          right: 0,
          textStyle: {
            color: "#9BC6D9",
          },
        },
        xAxis: [
          {
            name: "月份",
            type: "category",
            data: xData,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#183C76",
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#BAEAFD",
              },
              rotate: 0,
              align: "center",
              fontSize: 12,
            },
          },
        ],
        yAxis: [
          {
            name: "隐患统计",
            nameTextStyle: {
              padding: [0, 0, 0, 20],
              color: "#ffffff",
            },
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#183C76",
              },
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#9BC6D9",
              },
            },
            splitLine: {
              show: false,
            },
            splitArea: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "隐患总数",
            type: "bar",
            barWidth: 15,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#1251D2",
                  },
                  {
                    offset: 1,
                    color: "#1BDFFC",
                  },
                ]),
              },
            },
            data: totalData,
            animationDuration,
          },
          {
            name: "未整改数",
            type: "bar",
            barWidth: 15,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#46CBB9",
                  },
                  {
                    offset: 1,
                    color: "#1BDFFC",
                  },
                ]),
              },
            },
            data: missedData,
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>
<style scoped lang="scss">
.box-bg {
  background-color: rgba(11, 35, 78, 0.5);
  padding: 20px;
  border-radius: 10px;
  margin-top: 15px;
}
</style>
