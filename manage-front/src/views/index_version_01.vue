<template>
  <div class="dashboard-container" :style="{ height: pageHeight }">
    <Header />
    <div class="mainCon" :style="{ height: bodyHeight }">
      <el-row :gutter="12">
        <el-col :span="7">
          <div class="frameDiv" :style="{ height: chartConHeight + 'px' }">
            <div class="frame">
              <div class="title">
                <img src="@/assets/image/dashboard/icon.png" /><span
                  >漏检点统计</span
                >
              </div>
              <div class="chartBg">
                <missed-bar-chart
                  width="99%"
                  ref="missedChart"
                  :height="chartHeight"
                ></missed-bar-chart>
              </div>
            </div>
          </div>
          <div class="frameDiv" :style="{ height: chartConHeight + 'px' }">
            <div class="frame">
              <div class="title">
                <img src="@/assets/image/dashboard/icon.png" /><span
                  >异常巡检点数统计</span
                >
              </div>
              <abn-inspect-chart
                ref="abnInspectChart"
                :height="chartHeight"
              ></abn-inspect-chart>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div
            class="centerCon"
            :style="{ height: chartConHeight * 2 * 0.65 + 'px' }"
          >
            <el-row type="flex" justify="center">
              <el-col :span="8" class="card-panel" :offset="1">
                <div class="card-panel-text">当日巡检点数</div>
                <count-to
                  :start-val="0"
                  :end-val="drxjds"
                  :duration="2600"
                  class="card-panel-num"
                />
              </el-col>
              <el-col :span="8" class="card-panel" :offset="1">
                <div class="card-panel-text">当日隐患总数</div>
                <count-to
                  :start-val="0"
                  :end-val="dryhzs"
                  :duration="2600"
                  class="card-panel-num"
                />
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" style="padding-top: 2%">
              <el-col :span="12" class="card-panel">
                <div class="card-panel-text">当日未完成检点数</div>
                <count-to
                  :start-val="0"
                  :end-val="drwwcjds"
                  :duration="2600"
                  class="card-panel-num"
                />
              </el-col>
              <el-col :span="12" class="card-panel" :offset="5">
                <div class="card-panel-text">当日已整改数</div>
                <count-to
                  :start-val="0"
                  :end-val="dryzgs"
                  :duration="2600"
                  class="card-panel-num"
                />
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="8" class="card-panel" :offset="1">
                <div class="card-panel-text">当日异常检点数</div>
                <count-to
                  :start-val="0"
                  :end-val="drycjds"
                  :duration="2600"
                  class="card-panel-num"
                />
              </el-col>
              <el-col :span="8" class="card-panel" :offset="1">
                <div class="card-panel-text">当日现场问题记录</div>
                <count-to
                  :start-val="0"
                  :end-val="drxcwts"
                  :duration="2600"
                  class="card-panel-num"
                />
              </el-col>
            </el-row>
          </div>
          <div
            class="frameDiv"
            :style="{ height: chartConHeight * 2 * 0.35 + 'px' }"
          >
            <div class="frame">
              <div class="title flex">
                <div class="flex">
                  <img src="@/assets/image/dashboard/icon.png" /><span
                    >当日日常巡检任务</span
                  >
                </div>
                <div @click="handleQuery" v-if="total > 5">More</div>
              </div>
              <div class="index-tabel">
                <task-table
                  ref="taskTable"
                  :tableData="progressList"
                  :height="chartConHeight * 2 * 0.35 - 40 + 'px'"
                ></task-table>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="frameDiv" :style="{ height: chartConHeight + 'px' }">
            <div class="frame">
              <div class="title">
                <img src="@/assets/image/dashboard/icon.png" /><span
                  >事件类型占比</span
                >
              </div>
              <div class="chartBg">
                <event-problem-chart
                  ref="eventProblemChart"
                  :height="chartHeight"
                ></event-problem-chart>
              </div>
            </div>
          </div>
          <div class="frameDiv" :style="{ height: chartConHeight + 'px' }">
            <div class="frame">
              <div class="title">
                <img src="@/assets/image/dashboard/icon.png" /><span
                  >隐患统计</span
                >
              </div>
              <div class="chartBg">
                <trouble-bar-chart
                  ref="troubleChart"
                  :height="chartHeight"
                ></trouble-bar-chart>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 累计巡检任务二级页面 -->
    <task-dialog ref="taskDialog" v-model="taskDialogVisible"></task-dialog>
  </div>
</template>

<script>
import Header from "@/views/dashboard/home/Header";
import MissedBarChart from "./dashboard/home/MissedBarChart";
import AbnInspectChart from "./dashboard/home/AbnInspectChart";
import EventProblemChart from "./dashboard/home/EventProblemChart";
import TroubleBarChart from "@/views/dashboard/home/troubleBarChart";
import TaskTable from "@/views/dashboard/home/taskTable";
import CountTo from "vue-count-to";
import TaskDialog from "@/views/dashboard/home/taskDialog";
import {
  drxjds_API,
  drycjds_API,
  drywcjds_API,
  drxcwts_API,
  dryh_API,
} from "@/api/home";
import { listProgress } from "@/api/modules/inspect/task";
import { mapState } from "vuex";

export default {
  name: "index_version_01",
  components: {
    Header,
    MissedBarChart,
    AbnInspectChart,
    EventProblemChart,
    TroubleBarChart,
    CountTo,
    TaskTable,
    TaskDialog,
  },
  data() {
    return {
      pageHeight: document.documentElement.clientHeight - 84 + "px",
      bodyHeight: document.documentElement.clientHeight - 184 + "px",
      chartConHeight: (document.documentElement.clientHeight - 229) / 2,
      chartHeight: (document.documentElement.clientHeight - 299) / 2 + "px",
      taskDialogVisible: false,
      drxjds: 0, //当日巡检点数量
      dryhzs: 0, //隐患总数
      dryzgs: 0, //隐患已整改
      drycjds: 0, //当日异常检点数
      drywcjds: 0, //当日已完成检点数量
      drxcwts: 0, //当日现场问题数
      total: 0,
      // 当日日常巡检任务列表
      progressList: [],
    };
  },
  computed: {
    ...mapState({
      screenfull: (state) => state.common.screenfull,
    }),
    //当日未完成检点数
    drwwcjds() {
      return this.drxjds - this.drywcjds;
    },
  },
  watch: {
    screenfull: {
      handler(val) {
        this.calcHeight();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {
    const that = this;
    window.onresize = function temp() {
      that.calcHeight();
    };
    this.getData();
  },
  methods: {
    getData() {
      //当日巡检点数量
      drxjds_API().then((res) => {
        this.drxjds = res.result;
      });
      //隐患总数+已整改
      dryh_API().then((res) => {
        this.dryhzs = res.dryhzs;
        this.dryzgs = res.dryzgs;
      });
      //当日异常检点数
      drycjds_API().then((res) => {
        this.drycjds = res.result;
      });
      //当日已完成检点数量
      drywcjds_API().then((res) => {
        this.drywcjds = res.result;
      });
      //当日现场问题数
      drxcwts_API().then((res) => {
        this.drxcwts = res.result;
      });
      var param = { limit: 5, page: 1, onlyDay: 1 };
      listProgress(param).then((response) => {
        const result = response.result;
        this.progressList = result.list;
        this.total = result.totalCount;
      });
    },
    // 巡检任务
    handleQuery() {
      this.taskDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.taskDialog.getList();
      });
    },
    // 计算高度
    calcHeight() {
      var that = this;
      var topHeight = this.screenfull ? 0 : 84;
      var height = document.documentElement.clientHeight - topHeight;
      that.pageHeight = height + "px";
      that.bodyHeight = height - 100 + "px";
      that.chartConHeight = (height - 145) / 2;
      that.chartHeight = (height - 215) / 2 + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  // height: calc(100vh - 84px);
  color: #fff;
  background: url("~@/assets/image/dashboard/homebg.png") repeat,
    linear-gradient(to top, #091c90, #06155c);
  .mainCon {
    font-size: 14px;
    padding: 15px 15px 0 15px;
    .title {
      display: flex;
      align-items: center;
      span {
        padding-left: 10px;
        color: #84a0ce;
      }
    }
    .centerCon {
      background: url("~@/assets/image/dashboard/centerbg.png") no-repeat center;
      background-size: 100% 100%;
      margin-bottom: 15px;
      padding-top: 2%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .card-panel {
        text-align: center;
        .card-panel-text {
          padding-bottom: 3%;
        }
        .card-panel-num {
          font-size: 2vh;
        }
      }
    }
  }
}
.index-tabel {
  /deep/.el-table--medium th {
    padding: 4px 0;
  }
  /deep/.el-table--medium td {
    padding: 4px 0;
  }
  /deep/.el-table .el-table__header-wrapper th,
  /deep/.el-table .el-table__fixed-header-wrapper th {
    background-color: transparent;
    color: #0e9eed;
    height: 40px;
    font-size: 12px;
  }
  /deep/.el-table {
    background: none;
    color: #fff;
    font-size: 13px;
  }
  /deep/.el-table th.is-leaf {
    border-bottom: none;
  }
  /deep/.el-table td {
    border-bottom: none;
  }
  /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
    background: none;
  }
  /deep/.el-table tr {
    background: transparent;
  }
  /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgba(65, 160, 235, 0.2);
  }
  /deep/.el-table--group::after,
  .el-table--border::after,
  .el-table::before {
    background: none;
  }
  // 滚动条的宽度
  /deep/.el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
    height: 6px; // 纵向滚动条 必写
  }
  // 滚动条的滑块
  /deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: rgba(23, 89, 199, 0.9);
    border-radius: 3px;
  }
}

.frameDiv {
  position: relative;
  margin-bottom: 15px;
  .frame {
    position: absolute;
    width: 100%;
    height: 100%;
    border: #253f6e solid 1px;
    // box-shadow:0px 0px 8px 0px rgba(37,63,110,1) inset;
    background: linear-gradient(to left, #4c80dd, #4c80dd) left top no-repeat,
      linear-gradient(to bottom, #4c80dd, #4c80dd) left top no-repeat,
      linear-gradient(to left, #4c80dd, #4c80dd) right top no-repeat,
      linear-gradient(to bottom, #4c80dd, #4c80dd) right top no-repeat,
      linear-gradient(to left, #4c80dd, #4c80dd) left bottom no-repeat,
      linear-gradient(to bottom, #4c80dd, #4c80dd) left bottom no-repeat,
      linear-gradient(to left, #4c80dd, #4c80dd) right bottom no-repeat,
      linear-gradient(to left, #4c80dd, #4c80dd) right bottom no-repeat;
    background-size: 3px 15px, 15px 3px, 3px 15px, 15px 3px;
    padding: 15px;
    .chartBg {
      background: url("~@/assets/image/dashboard/chartBg.png") repeat center;
    }
  }
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #84a0ce;
  cursor: pointer;
}
</style>
