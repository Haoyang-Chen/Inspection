<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>巡检考勤详情</span>
      <el-button
        type="primary"
        icon="el-icon-download"
        size="mini"
        style="float:right;margin-top:-5px;"
        :disabled="detailList.length <= 0"
        @click="handleExport"
        >导出到Excel</el-button
      >
    </div>

    <el-table
      v-loading="loading"
      :data="detailList"
      :height="height"
      :style="{ width: width }"
    >
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="班组"
        align="center"
        prop="teamName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="巡检人员"
        align="center"
        prop="executor"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="完成任务数"
        align="center"
        prop="taskCount"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="未签到检点"
        align="center"
        prop="unSignCount"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="平均巡检用时"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">{{
          scope.row.averageMinutes ? scope.row.averageMinutes + "分钟" : ""
        }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import {
  chartStaffDetail,
  exportDetail
} from "@/api/modules/report/attendance";

export default {
  name: "InspectAttTable",
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
      default: "700px"
    }
  },
  data() {
    return {
      loading: true,
      detailList: [],
      queryParams: undefined
    };
  },
  methods: {
    /** 重置相关值 */
    setup(startDate, endDate) {
      this.loading = true;
      this.queryParams = { startDate, endDate };
      chartStaffDetail(startDate, endDate).then(response => {
        const result = response.result;
        this.detailList = result;
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportDetail,
        this.queryParams,
        "巡检考勤详情记录",
        "巡检考勤详情"
      );
    }
  }
};
</script>
