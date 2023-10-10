<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>人员考勤统计</span>
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
import { chartStaff } from "@/api/modules/report/attendance";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "StaffAttChart",
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
      loading: true,
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
    setup(startDate, endDate) {
      this.loading = true;
      chartStaff(startDate, endDate).then(response => {
        const result = response.result;
        const xData = [];
        const taskCountData = [];
        const inspectTimeData = [];
        const averageData = [];
        if (!result) {
          chartLoading(this.chart, true);
        } else {
          result.forEach(item => {
            xData.push(item.executor);
            taskCountData.push(item.taskCount);
            inspectTimeData.push(item.minutes);
            averageData.push(response.average);
          });
          chartLoading(this.chart, false);
        }
        this.resetOption(xData, taskCountData, inspectTimeData, averageData);
        this.loading = false;
      });
    },
    resetOption(xData, taskCountData, inspectTimeData, averageData) {
      const markLineData =
        averageData && averageData.length ? averageData[0] : 0;
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
          right: 130,
          bottom: 45,
          containLabel: true
        },
        legend: {
          orient: "vertical",
          data: ["完成任务数", "巡检用时"],
          // data: ["完成任务数", "巡检用时", "平均巡检用时"],
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
            name: " 巡检人员",
            type: "category",
            data: xData
            // axisTick: {
            //   alignWithLabel: true
            // }
          }
        ],
        yAxis: [
          {
            name: "完成任务数(个)",
            nameTextStyle: {
              padding: [0, 0, 0, 80]
            },
            type: "value",
            axisTick: {
              show: false
            }
          },
          {
            name: "巡检用时(分钟)",
            nameTextStyle: {
              padding: [0, 80, 0, 0]
            },
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "完成任务数",
            type: "bar",
            color: ["#98cdef"],
            barWidth: 45,
            data: taskCountData,
            animationDuration
          },
          {
            name: "巡检用时",
            type: "line",
            color: ["#ff6428"],
            smooth: false,
            yAxisIndex: 1,
            data: inspectTimeData,
            animationDuration,
            markLine: {
              itemStyle: {
                normal: {
                  color: "#00cc50"
                }
              },
              label: {
                formatter: "平均巡检用时: " + markLineData
              },
              data: [
                {
                  yAxis: markLineData
                }
              ]
            }
          }
          // {
          //   name: "平均巡检用时",
          //   type: "line",
          //   color: ["#00cc50"],
          //   symbol: "none",
          //   itemStyle: {
          //     normal: {
          //       lineStyle: {
          //         type: "dotted"
          //       }
          //     }
          //   },
          //   yAxisIndex: 1,
          //   data: averageData,
          //   animationDuration
          // }
        ]
      });
    }
  }
};
</script>
