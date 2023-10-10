<template>
  <div
    ref="chart"
    :class="className"
    :style="{ height: height, width: width, display: 'inline-block' }"
  />
</template>

<script>
import { chartAmount } from "@/api/modules/ptw/analysis";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "QuantityPieChart",
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
      chartAmount().then(response => {
        this.setup(response);
      });
    },
    /** 重置相关值 */
    setup(data) {
      if (!data) {
        chartLoading(this.chart, true);
        return;
      }
      const total = data.allCount || 0;
      const close = data.closeCount || 0;
      const nomal = Number(total) - Number(close);
      const seriesData = [
        {
          value: close,
          name: "取消作业票"
        },
        {
          value: nomal,
          name: "正常作业票"
        }
      ];
      chartLoading(this.chart, false);
      this.resetOption(seriesData, total);
    },
    resetOption(seriesData, total) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        title: {
          text: total,
          left: "center",
          top: "37%",
          textStyle: {
            color: "#000",
            fontSize: 24,
            align: "center"
          }
        },
        graphic: {
          type: "text",
          left: "center",
          top: "53%",
          style: {
            text: "作业票总数",
            textAlign: "center",
            fill: "#333"
          }
        },
        series: [
          {
            name: "数量",
            type: "pie",
            radius: ["45%", "80%"],
            color: ["#54dbba", "#3ca1f8"],
            data: seriesData,
            label: {
              formatter: "{b|{b}}\n {c|{c}张} {per|{d}%} ",
              rich: {
                b: {
                  lineHeight: 20,
                  align: "center"
                }
              }
            },
            itemStyle: {
              borderWidth: 5,
              borderColor: "white"
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
