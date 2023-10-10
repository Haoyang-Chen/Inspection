<template>
  <div
    ref="chart"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>

<script>
import { troubleReport } from "@/api/home";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "./utils";

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
      troubleReport().then(response => {
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
      const yzgData = []; // 已整改
      const wzgData = []; // 未整改
      data.forEach(item => {
        xData.push(item.m);
        yzgData.push(item.yzg);
        wzgData.push(item.wzg);
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, yzgData, wzgData);
    },
    resetOption(xData, yzgData, wzgData) {
      var color1 = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        type: 'linear',
        global: false,
        colorStops: [
          {
            //第一节下面
            offset: 0,
            color: '#205DDB',
          },
          {
            offset: 1,
            color: 'rgba(18,81,210,0.5)',
          },
        ],
      };
      var color2 = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        type: 'linear',
        global: false,
        colorStops: [
          {
            //第一节下面
            offset: 0,
            color: '#299B92',
          },
          {
            offset: 1,
            color: 'rgba(41,155,146,0.5)',
          },
        ],
      };
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
          left: 0,
          right: 0,
          bottom: 15,
          containLabel: true
        },
        legend: {
          data: ["已整改", "未整改"],
          right: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: "#9BC6D9",
          },
          selectedMode: false
        },
        // dataZoom: [
        //   {
        //     type: "slider",
        //     height: 15
        //   },
        //   {
        //     type: "inside"
        //   }
        // ],
        xAxis: [
          {
            type: "category",
            data: xData,
            axisLabel: {
              textStyle: {
                color: "#fff",
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#183C76'
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#183C76'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#9BC6D9"
              }
            },
            splitLine: {
              show: false
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "已整改",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              normal: {
                color: color1,
                barBorderRadius: 6
              }
            },
            data: yzgData,
            animationDuration
          },
          {
            name: "未整改",
            type: "bar",
            barWidth: 12,
            itemStyle: {
              normal: {
                color:color2,
                barBorderRadius: 6
              }
            },
            data: wzgData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
