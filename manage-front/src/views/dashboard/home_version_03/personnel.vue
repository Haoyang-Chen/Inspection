<template>
  <div
    ref="chart"
    :class="className"
    :style="{ height: height, width: width, display: 'inline-block' }"
  />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "./utils";
import { riskLevelCount_API } from "@/api/home";

const animationDuration = 3000;

export default {
  name: "EventProblemChart",
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
      riskLevelCount_API().then((response) => {
        this.setup(response.result);
      });
    },
    /** 重置相关值 */
    setup(data) {
      if (!data || !data.length) {
        chartLoading(this.chart, true);
        return;
      }
      const seriesData = [];
      data.forEach((item) => {
        if (item.level == 1) {
          seriesData.push({
            value: item.count,
            name: '低风险',
          });
        }
        if (item.level == 2) {
          seriesData.push({
            value: item.count,
            name: '一般风险',
          });
        }
        if (item.level == 3) {
          seriesData.push({
            value: item.count,
            name: '较大风险',
          });
        }
        if (item.level == 4) {
          seriesData.push({
            value: item.count,
            name: '重大风险',
          });
        }
      });
      chartLoading(this.chart, false);
      this.resetOption(seriesData);
    },
    resetOption(seriesData) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
          {
            name: "风险辨识",
            type: "pie",
            radius: ["15%", "75%"],
            center: ["50%", "50%"],
            roseType: "area",
            data: seriesData,
            color: [
              "#38CAFB",
              "#4CAFF9",
              "#4ADFCB",
              "#2AAEFA",
              "#0271F4",
              "#488CF7",
            ],
            label: {
              formatter: "{b|{b}}\n{c|{c}个} {per|{d}%} ",
              padding: [0, -20, 0, -20],
              rich: {
                b: {
                  lineHeight: 20,
                  align: "center",
                },
              },
            },
            animationEasing: "cubicInOut",
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>
