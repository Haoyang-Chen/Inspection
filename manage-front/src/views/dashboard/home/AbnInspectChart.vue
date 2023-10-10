<template>
  <div
    ref="chart"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>

<script>
import { chartAbnomal } from "@/api/home";
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
    getData(query) {
      chartAbnomal(query).then(response => {
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
      const totalData = []; // 异常总数
      const unhandledData = []; // 未处理数
      data.forEach(item => {
        xData.push(item.date);
        totalData.push(item.xjzs);
        unhandledData.push(item.ljs);
      }); 
      chartLoading(this.chart, false);
      this.resetOption(xData, totalData, unhandledData);
    },
    resetOption(xData, totalData, unhandledData) {
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
          left: 15,
          right: 15,
          bottom: 0,
          containLabel: true
        },
        legend: {
          data: ["异常总数", "未处理"],
          right: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: "#9BC6D9",
          }
        },
        // dataZoom: [
        //   {
        //     type: "slider"
        //   },
        //   {
        //     type: "inside"
        //   }
        // ],
        xAxis: [
          {
            name: "月份",
            type: "category",
            data: xData,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#183C76'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#BAEAFD"
              },
              // interval: 0,
              rotate: 20,
              margin: 30,
              align: 'center'
            }
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
            // name: "异常巡检数(个)",
            nameTextStyle: {
              padding: [0, 0, 0, 80]
            },
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
            name: "异常总数",
            type: "line",
            smooth: false,
            showAllSymbol: true, //显示所有图形。
            symbol: "circle", //标记的图形为实心圆
            itemStyle: {
              normal: {
                color:'#00A2FF',
                lineStyle: {
                  color: "#00A2FF",
                  width: 1
                },
                areaStyle: { 
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(0,162,255,0)'
                  }, {
                    offset: 1,
                    color: 'rgba(0,162,255,0.7)'
                  }]),
                }
              }
            },
            data: totalData,
            animationDuration
          },
          {
            name: "未处理",
            type: "line",
            smooth: false,
            showAllSymbol: true, //显示所有图形。
            symbol: "circle", //标记的图形为实心圆
            itemStyle: {
              normal: {
                color:'#00CC50',
                lineStyle: {
                  color: "#00CC50",
                  width: 1
                },
                areaStyle: { 
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: 'rgba(0,204,81,0)'
                  }, {
                    offset: 1,
                    color: 'rgba(0,204,81,0.7)'
                  }]),
                }
              }
            },
            data: unhandledData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
