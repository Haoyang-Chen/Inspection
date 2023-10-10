<template>
  <!-- 页面名称 -->
  <div class="box-bg">
    <div ref="chart" :style="{ height: height, width: width }"></div>
  </div>
</template>
<script>
import echarts from "echarts";
/*
  int ljxjrw = insTaskReportService.ljxjrwCount(companyId);//巡检任务总数
  int ljycxjjl = insTaskReportService.ljycxjjlCount(companyId);//发现异常数
  int ljljdw = insTaskReportService.ljljdwCount(companyId);//漏检点数
  int xjdsl = insTaskReportService.ljlxjdslCount(companyId);//巡检点数量
*/
export default {
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "180px",
    },
  },
  methods: {
    init(obj = {}, rotate = 0) {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: 30,
          left: 10,
          right: 10,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: "log",
          axisLabel: {
            show: false,
            textStyle: {
              color: "#ffffff",
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(13,151,235,0.1)",
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "rgba(13,151,235,0.1)",
            },
          },
        },
        yAxis: {
          type: "category",
          data: ["巡检任务总数", "巡检点数量", "异常检点数", "漏检检点数"],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#38B2E6",
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "rgba(13,151,235,0.1)",
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "rgba(13,151,235,0.1)",
            },
          },
        },
        series: [
          {
            // name: "2022年",
            type: "bar",
            barWidth: 20,
            label: {
              show: true,
              position: "insideRight",
            },
            itemStyle: {
              normal: {
                barBorderRadius: [0, 10, 10, 0],
                color: function (params) {
                  let colorList = [
                    ["#228DFF", "rgba(13,151,235,0.1)"],
                    ["#FFC261", "rgba(13,151,235,0.1)"],
                    ["#6AFFE8", "rgba(13,151,235,0.1)"],
                    ["#EFFF6A", "rgba(13,151,235,0.1)"],
                  ];
                  let index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }
                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: colorList[index][1],
                    },
                    {
                      offset: 1,
                      color: colorList[index][0],
                    },
                  ]);
                },
              },
            },
            data: [obj.ljxjrw, obj.xjdsl, obj.ljycxjjl, obj.ljljdw],
          },
        ],
      };
      let echart = echarts.init(this.$refs.chart, "macarons");
      echart.setOption(option, true);
    },
  },
};
</script>
<style scoped lang="scss">
.box-bg {
  // position: relative;
  // z-index: 1;
}
</style>
