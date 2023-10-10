<template>
  <el-table
    :data="tableData"
    :height="height"
    style="width:100%"
    stripe>
    <el-table-column
      prop="name"
      label="巡检日期"
      width="100"
      :show-overflow-tooltip="true">
      <template slot-scope="scope">
        {{ parseTime(scope.row.taskStartDateTime, "{y}-{m}-{d}") }}
      </template>
    </el-table-column>
    <el-table-column
      prop="taskName"
      label="任务名称"
      :show-overflow-tooltip="true">
    </el-table-column>
    <el-table-column
      prop="teamName"
      label="巡检班组"
      align="center"
      :show-overflow-tooltip="true">
    </el-table-column>
    <el-table-column label="巡检时间段" align="center" width="90">
      <template slot-scope="scope">{{ period(scope.row) }}</template>
    </el-table-column>
    <el-table-column
      label="状态"
      align="center"
      prop="statusName"
      width="90"
      :show-overflow-tooltip="true"
    ></el-table-column>
  </el-table>
</template>
 
<script>
import { getPeriod } from "@/views/modules/ins/utils";

export default {
  props: {
    height: {
      type: String,
      default: '100px'
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // 根据行数据获取巡检时间段
    period(row) {
      return getPeriod(row);
    }
  }
}
</script>