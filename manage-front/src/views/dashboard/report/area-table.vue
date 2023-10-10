<template>
  <el-card>
    <div slot="header" style="font-weight:bold;">
      <span>区域事件详情</span>
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
        label="区域"
        align="center"
        prop="areaName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="事件总数"
        align="center"
        prop="problemCount"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="主要事件"
        align="center"
        prop="mostType"
        :show-overflow-tooltip="true"
      />
    </el-table>
  </el-card>
</template>

<script>
import { exportDetail } from "@/api/modules/report/problem";

export default {
  name: "AreaTable",
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
        "区域事件详情记录",
        "区域事件详情"
      );
    }
  }
};
</script>
