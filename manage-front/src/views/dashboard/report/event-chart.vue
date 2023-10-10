<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>事件类型占比</span>
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
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "EventChart",
  mixins: [resize],
  props: {
    loading: {
      type: Boolean,
      default: true
    },
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
    setup(data) {
      if (!data || !data.length) {
        chartLoading(this.chart, true);
        return;
      }
      const legendData = [];
      const seriesData = [];
      let total = 0;
      data.forEach(item => {
        legendData.push(item.type);
        seriesData.push({
          value: item.problemCount,
          name: item.type
        });
        total += item.problemCount;
      });
      chartLoading(this.chart, false);
      this.resetOption(legendData, seriesData, total);
    },
    resetOption(legendData, seriesData, total) {
      this.chart.setOption({
        title: {
          text: "共计事件数" + total + "个",
          textStyle: {
            fontSize: 15,
            color: "#333"
          },
          top: 50,
          right: "7%"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: "2%",
          top: 90,
          bottom: 20,
          data: legendData,
          formatter: function(name) {
            let target;
            seriesData.forEach(item => {
              if (item.name == name) {
                target = item.value;
                return;
              }
            });
            const rate =
              total == 0 ? "0.00" : ((target / total) * 100).toFixed(2);
            return name + "     " + target + "个     " + rate + "%";
          }
        },
        series: [
          {
            name: "事件",
            type: "pie",
            center: ["30%", "50%"],
            data: seriesData,
            label: {
              formatter: "{b|{b}}\n {c|{c}个} {per|{d}%} ",
              rich: {
                b: {
                  lineHeight: 20,
                  align: "center"
                }
              }
            },
            animationEasing: "cubicInOut",
            animationDuration
          }
        ]
      });
    }
  }
};
</script>
