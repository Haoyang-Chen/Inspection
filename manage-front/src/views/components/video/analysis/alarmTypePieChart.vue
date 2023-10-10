<template>
  <el-card shadow="never">
    <div slot="header" style="font-weight:bold;">
      <span>当日报警种类数量</span>
    </div>
    <div
      ref="chart"
      :class="className"
      :style="{ height: height, width: width }"
    />
  </el-card>
</template>

<script>
import { alarmtypes } from "@/api/modules/video/alarm";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "@/utils/chartLoading";

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
  computed: {},
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
      alarmtypes().then(response => {
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
        return { name: item.alarmType, value: item.quantity };
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
        legend: {
          orient: 'vertical',
          top: 'center',
          left: 0,
          itemWidth: 14,
          itemHeight: 14,
          icon: 'circle',
          textStyle: {
            align: 'left',
            verticalAlign: 'middle',
            rich: {
              name: {
                fontSize: 13,
              },
              value: {
                fontSize: 13,
              }
            }
          },
          formatter: (name) => {
            if (seriesData.length) {
              const item = seriesData.filter((item) => item.name === name)[0];
              return `{name|${name}：}{value| ${item.value}}`;
            }
          }
        },
        series: [
          {
            name: "占比",
            type: "pie",
            data: seriesData,
            radius: ["40%", "65%"],
            center: ["65%", "50%"],
            label: {
              show: false,
              formatter: "{b|{b}}\n {c|{c}项} {per|{d}%} ",
              rich: {
                b: {
                  lineHeight: 20,
                  align: "center"
                }
              }
            },
            itemStyle: {
              show: false,
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
