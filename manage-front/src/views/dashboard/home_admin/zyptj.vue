<template>
  <el-card shadow="hover" :body-style="{ padding: '15px 15px' }">
    <div slot="header" class="chart-header clearfix">
      <span>作业票统计</span>
    </div>
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import { ticketCountByMonth_API } from "@/api/modules/super/index"
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";

const animationDuration = 3000;

export default {
  name: "zyptj",
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
      ticketCountByMonth_API().then(res=>{
        let arr = res.result;
        this.setup(arr);
      })
    },
    /** 重置相关值 */
    setup(arr) {
      const xData = [];
      const allData = [];
      const qxData = [];
      arr.forEach(item => {
        xData.push(item.month);
        allData.push(item.allCount);
        qxData.push(item.closeCount);
      });
      this.resetOption(xData, allData, qxData);
    },
    resetOption(xData, allData, qxData) {
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
          data: ["作业票总数", "取消作业票数量"],
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
            name: "作业票总数",
            type: "bar",
            color: ["#409EFF"],
            barGap: "-100%", //重叠效果(可放在任意一个组中)
            barWidth: 24, //柱图宽度
            data: allData,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#606266",
                    fontSize: 14,
                  },
                },
              },
            },
            animationDuration,
          },
          {
            name: "取消作业票数量",
            type: "bar",
            color: ["#E6A23C"],
            barWidth: 24, //柱图宽度
            data: qxData,
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#ffffff",
                    fontSize: 12,
                  },
                },
              },
            },
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
