<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="任务名称" prop="taskName">
            <el-input
              v-model="queryParams.taskName"
              placeholder="请输入任务名称"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="巡检人员" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入巡检人员"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="巡检状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择巡检状态"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">当日巡检任务进度列表</span>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="progressList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="巡检日期"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.taskStartDateTime, "{y}-{m}-{d}") }}
            </template>
          </el-table-column>
          <el-table-column
            label="任务名称"
            align="center"
            prop="taskName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="任务类型" align="center">
            <template slot-scope="scope">{{
              typeName(scope.row.taskType)
            }}</template>
          </el-table-column>
          <el-table-column
            label="巡检班组"
            align="center"
            prop="teamName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="巡检频次" align="center">
            <template slot-scope="scope">{{ rateName(scope.row) }}</template>
          </el-table-column>
          <el-table-column
            label="巡检人"
            align="center"
            prop="taskUserNames"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="巡检时间段" align="center">
            <template slot-scope="scope">{{ period(scope.row) }}</template>
          </el-table-column>
          <el-table-column
            label="巡检状态"
            align="center"
            prop="statusName"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listProgress } from "@/api/modules/inspect/task";
import { getPeriod } from "../utils";

export default {
  name: "ProgressTracking",
  data() {
    return {
      // 总条数
      total: 0,
      // 进度表格数据
      progressList: null,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        taskName: undefined,
        userName: undefined,
        status: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 任务类型 */
    typeOptions() {
      return this.$store.state.common.taskTypes;
    },
    /** 发布状态 */
    statusOptions() {
      return this.$store.state.common.inspectStatus;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listProgress(this.queryParams).then(response => {
        const result = response.result;
        this.progressList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取任务类型label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
    },
    // 根据行数据获取巡检频次
    rateName(row) {
      if (row.taskType === 1) {
        return row.inspectRate + "时/次";
      }
      return row.inspectRate + "次";
    },
    // 根据行数据获取巡检时间段
    period(row) {
      return getPeriod(row);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
