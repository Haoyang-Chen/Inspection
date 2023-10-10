<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>班组漏检占比</span>
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
import { chartTeam } from "@/api/modules/report/attendance";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "TeamLeakChart",
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
      chartTeam(startDate, endDate).then(response => {
        const result = response.result;
        const legendData = [];
        const seriesData = [];
        let total = 0;
        if (!result || !Object.keys(result).length) {
          chartLoading(this.chart, true);
        } else {
          for (let [key, value] of Object.entries(result)) {
            legendData.push(key);
            seriesData.push({
              value,
              name: key
            });
            total += value;
          }
          chartLoading(this.chart, false);
        }
        this.resetOption(legendData, seriesData, total);
        this.loading = false;
      });
    },
    resetOption(legendData, seriesData, total) {
      this.chart.setOption({
        title: {
          text: "共计漏检" + total + "个",
          textStyle: {
            fontSize: 15,
            color: "#333"
          },
          top: 50,
          right: "10%"
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
            name: "漏检",
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
