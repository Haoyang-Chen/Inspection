<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>线路异常详情</span>
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
      :style="{ height: height, width: width }"
    >
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="线路名称"
        align="center"
        prop="lineName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="检点名称"
        align="center"
        prop="deviceName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="异常总数"
        align="center"
        prop="allCount"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="未处理"
        align="center"
        prop="unProcessCount"
        :show-overflow-tooltip="true"
      />
    </el-table>
  </el-card>
</template>

<script>
import { exportDetail } from "@/api/modules/report/task";

export default {
  name: "LineAbnTable",
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
      default: "700px"
    }
  },
  data() {
    return {
      detailList: [],
      queryParams: undefined
    };
  },
  methods: {
    /** 重置相关值 */
    setup(startDate, endDate, data) {
      this.queryParams = { startDate, endDate };
      this.detailList = data;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportDetail,
        this.queryParams,
        "线路异常详情记录",
        "线路异常详情"
      );
    }
  }
};
</script>
