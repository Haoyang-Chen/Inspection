<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>审核数统计</span>
    </div>
    <el-row>
      <!--搜索数据-->
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item>
            <el-date-picker
              v-model="queryParams.createTimeStart"
              type="datetime"
              placeholder="开始日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width:170px"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.createTimeEnd"
              type="datetime"
              placeholder="结束日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="small"
              style="width:170px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="approve-count">
              <span>审核总数</span>
              <span class="total">{{ totalCount }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="approve-count">
              <span>发现问题数</span>
              <span class="problem">{{ problemCount }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="approve-count">
              <span>未发现数</span>
              <span class="nomal">{{ nomalCount }}</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24" style="margin-top:5px">
        <div
          ref="chart"
          :class="className"
          :style="{ height: height, width: width }"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { chartApprove } from "@/api/modules/ptw/analysis";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/utils/resize";
import { chartLoading } from "../utils";

const animationDuration = 3000;

export default {
  name: "ApproveBarChart",
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
      totalCount: 0,
      problemCount: 0,
      nomalCount: 0,
      chart: null,
      queryParams: {
        createTimeStart: undefined,
        createTimeEnd: undefined
      }
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
      chartApprove(this.queryParams).then(response => {
        this.setup(response.result);
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.clearDateRange(
        this.queryParams,
        'createTimeStart',
        'createTimeEnd'
      );
      this.handleQuery();
    },
    /** 重置相关值 */
    setup(data) {
      this.totalCount = 0;
      this.problemCount = 0;
      this.nomalCount = 0;
      if (!data || !data.length) {
        chartLoading(this.chart, true);
        return;
      }
      const xData = [];
      const problemData = [];
      const noProblemData = [];
      data.forEach(item => {
        const type = this.typeOptions.find(f => f.value === item.type);
        xData.push(type.label);
        problemData.push(item.problemCount);
        noProblemData.push(item.noProblemCount);
        this.totalCount += item.all;
        this.problemCount += item.problemCount;
        this.nomalCount += item.noProblemCount;
      });
      chartLoading(this.chart, false);
      this.resetOption(xData, problemData, noProblemData);
    },
    resetOption(xData, problemData, noProblemData) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 45,
          left: "2%",
          right: 60,
          bottom: "2%",
          containLabel: true
        },
        dataZoom: [
          {
            type: "slider",
            yAxisIndex: [0]
          },
          {
            type: "inside",
            yAxisIndex: [0]
          }
        ],
        xAxis: [
          {
            name: "数量(个)",
            nameTextStyle: {
              padding: [45, 0, 0, 0]
            },
            type: "value",
            axisTick: {
              show: false
            },
            minInterval: 1
          }
        ],
        yAxis: [
          {
            name: "作业票种类",
            nameTextStyle: {
              padding: [0, 0, -10, 60]
            },
            type: "category",
            data: xData
          }
        ],
        series: [
          {
            name: "发现问题数",
            type: "bar",
            stack: "总数",
            color: ["#dcd7fa"],
            barWidth: 20,
            data: problemData,
            animationDuration
          },
          {
            name: "未发现数",
            type: "bar",
            stack: "总数",
            color: ["#3ca1f8"],
            barWidth: 20,
            data: noProblemData,
            animationDuration
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.approve-count {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 55px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(153, 153, 153, 0.35);
  .total {
    color: #3ca1f8;
  }
  .problem {
    color: #ffcb46;
  }
  .nomal {
    color: #00cc50;
  }
}
</style>
