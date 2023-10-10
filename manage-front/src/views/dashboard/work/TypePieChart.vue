<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>各类作业票占比</span>
    </div>
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import { chartAmount } from "@/api/modules/ptw/analysis";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "TypePieChart",
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
  computed: {
    /** 作业票种类 */
    typeOptions() {
      return this.$store.state.common.workTypes;
    }
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
      chartAmount("type").then(response => {
        this.setup(response.result);
      });
    },
    /** 重置相关值 */
    setup(data) {
      if (!data || !data.length) {
        chartLoading(this.chart, true);
        return;
      }
      const seriesData = data.map(item => {
        const type = this.typeOptions.find(f => f.value === item.type);
        return { name: type.label, value: item.count };
      });
      chartLoading(this.chart, false);
      this.resetOption(seriesData);
    },
    resetOption(seriesData) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "占比",
            type: "pie",
            data: seriesData,
            radius: ["40%", "75%"],
            label: {
              formatter: "{b|{b}}\n {c|{c}项} {per|{d}%} ",
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
