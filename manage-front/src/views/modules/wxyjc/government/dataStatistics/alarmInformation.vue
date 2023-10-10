<template>
  <div class="alarmInformationBox">
    <div class="app-container mb10" style="padding: 0">
      <div class="alarmInformationBox-top">
        报警数量统计 TOP15
        <span style="color: #999; font-size: 12px">(鼠标滚动可缩放)</span>
      </div>
      <div class="alarmInformationBox-body">
        <div class="mt20" style="height: 400px; width: 100%">
          <chart ref="dangerChartRefTop" v-if="cahartType"></chart>
        </div>
      </div>
    </div>
    <div class="app-container" style="padding: 0">
      <div class="alarmInformationBox-top">
        报警趋势统计
        <span style="color: #999; font-size: 12px">(鼠标滚动可缩放)</span>
      </div>
      <div class="alarmInformationBox-body">
        <div class="mt20" style="height: 400px; width: 100%">
          <chart ref="dangerChartRefBottom" v-if="cahartType"></chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HistoricalTrendChart_API } from "@/api/modules/wxyjc/wxyjcwarninginformopt";
import Chart from "@/views/components/wxyjc/chart/chart";
export default {
  components: {
    Chart,
  },
  data() {
    return {
      cahartType: false,
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.cahartType = true;
    this.initTop();
    this.initBottom();
  },
  methods: {
    initTop() {
      let shebeiData = [];
      HistoricalTrendChart_API({ flag: 0 }).then((res) => {
        shebeiData = res.result;
        if (shebeiData.length > 0) {
          let options = {
            tooltip: {
              trigger: "axis",
            },
            dataZoom: [
              {
                // 在内部可以横向拖动
                type: "inside",
                start: 0,
                end: 100,
                xAxisIndex: [0],
              },
            ],
            grid: {
              left: "5%",
              right: "10%",
              bottom: "8%",
              containLabel: true,
            },
            legend: {
              orient: "vertical",
              right: 10,
              data: ["报警总数", "未处理数"],
            },
            color: ["#CC0000", "#FFE599"],
            xAxis: {
              name: "企业",
              type: "category",
              data: shebeiData.map((item) => item.name),
            },
            yAxis: {
              name: "数量",
              type: "value",
            },
            series: [
              {
                name: "报警总数",
                type: "bar",
                data: shebeiData.map((item) => item.alarmNum),
              },
              {
                name: "未处理数",
                type: "bar",
                data: shebeiData.map((item) => item.dealalarmNum),
              },
            ],
          };
          this.$nextTick(() => {
            this.$refs.dangerChartRefTop.init(options);
          });
        }
      });
    },
    initBottom() {
      let shebeiData = [];
      HistoricalTrendChart_API({ flag: 1 }).then((res) => {
        shebeiData = res.result;
        let monthList = [];
        let num1List = [];
        let num2List = [];
        let num3List = [];
        let num4List = [];
        shebeiData.map((item) => {
          monthList.push(item.month);
          num1List.push(item.cgnum);
          num2List.push(item.qtnum);
          num3List.push(item.zznum);
          num4List.push(item.bjnum);
        });
        if (shebeiData.length > 0) {
          let options = {
            tooltip: {
              trigger: "axis",
            },
            dataZoom: [
              {
                // 在内部可以横向拖动
                type: "inside",
                start: 0,
                end: 100,
                xAxisIndex: [0],
              },
            ],
            grid: {
              left: "5%",
              right: "10%",
              bottom: "8%",
              containLabel: true,
            },
            legend: {
              x: "center",
              y: "top",
              data: [
                "重大危险源报警",
                "可燃有毒气体报警",
                "危险工艺报警",
                "报警总数",
              ],
            },
            color: ["#3695EE", "#FF9900", "#FF9999", "#CC0000"],
            xAxis: {
              name: "日期",
              type: "category",
              data: monthList,
            },
            yAxis: {
              name: "数量",
              type: "value",
            },
            series: [
              {
                name: "重大危险源报警",
                type: "line",
                data: num1List,
              },
              {
                name: "可燃有毒气体报警",
                type: "line",
                data: num2List,
              },
              {
                name: "危险工艺报警",
                type: "line",
                data: num3List,
              },
              {
                name: "报警总数",
                type: "line",
                data: num4List,
              },
            ],
          };
          this.$nextTick(() => {
            this.$refs.dangerChartRefBottom.init(options);
          });
        }
      });
    },
  },
  destroyed() {},
};
</script>

<style  lang='scss' scoped>
.alarmInformationBox {
  &-top {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #dfe4ed;
  }
  &-body {
    padding: 10px;
  }
}
</style>
