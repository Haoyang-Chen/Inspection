<template>
  <el-card shadow="hover" :body-style="{ padding: '15px 15px' }">
    <div slot="header" class="chart-header clearfix">
      <span>已推送巡检任务统计</span>
    </div>
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import { insCountByMonth_API } from "@/api/modules/super/index"
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";

const animationDuration = 3000;

export default {
  name: "ytsxjrwtj",
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
      default: "266px",
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
    init() {},
    /** 初始化图表 */
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons");
    },
    /** 查询数据 */
    getData() {
      insCountByMonth_API().then(res=>{
        let arr = res.result;
        this.setup(arr);
      })
    },
    /** 重置相关值 */
    setup(arr) {
      const xData = [];
      const allData = [];
      arr.forEach(item => {
        xData.push(item.first);
        allData.push(item.second);
      });
      this.resetOption(xData, allData);
    },
    resetOption(xData, allData) {
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
          left: 15,
          right: 15,
          bottom: 15,
          containLabel: true,
        },
        legend: {
          orient: "horizontal",
          data: ["巡检任务"],
          right: 12,
        },
        xAxis: [
          {
            nameTextStyle: {
              color: "#666",
            },
            type: "category",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#666",
              },
            },
            axisLine: {
              lineStyle: {
                color: "#999",
              },
            },
            data: xData,
          },
        ],
        yAxis: [
          {
            name: "数量",
            nameTextStyle: {
              color: "#666",
            },
            type: "value",
            minInterval: 1,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#666",
              },
            },
            axisLine: {
              lineStyle: {
                color: "#999",
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "巡检任务",
            type: "line",
            color: ["#3da2f8"],
            smooth: false,
            data: allData,
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-card__header {
  border-bottom: 0;
}
</style>
