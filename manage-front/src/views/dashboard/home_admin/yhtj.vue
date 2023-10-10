<template>
  <el-card shadow="hover" :body-style="{ padding: '15px 15px' }">
    <div slot="header" class="chart-header clearfix">
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
import { troubleCountByMonth_API } from "@/api/modules/super/index"
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";

const animationDuration = 3000;

export default {
  name: "yhtj",
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
      troubleCountByMonth_API().then(res=>{
        let arr = res.result;
        this.setup(arr);
      })
    },
    /** 重置相关值 */
    setup(arr) {
      const xData = [];
      const allData = [];
      const zdData = [];
      arr.forEach(item => {
        xData.push(item.month);
        allData.push(item.total);
        zdData.push(item.zdCount);
      });
      this.resetOption(xData, allData, zdData);
    },
    resetOption(xData, allData, zdData) {
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
          data: ["隐患总数", "重大隐患数"],
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
            name: "隐患总数",
            type: "line",
            color: ["#3da2f8"],
            smooth: false,
            data: allData,
            animationDuration,
          },
          {
            name: "重大隐患数",
            type: "line",
            color: ["#4ccb7e"],
            smooth: false,
            data: zdData,
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
