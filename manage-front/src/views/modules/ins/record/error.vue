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
          <el-form-item label="任务类型" prop="taskType">
            <el-select
              v-model="queryParams.taskType"
              placeholder="请选择任务类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态" prop="processStatus">
            <el-select
              v-model="queryParams.processStatus"
              placeholder="请选择处理状态"
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
          <el-form-item label="提交日期" prop="createTime">
            <el-date-picker
              v-model="queryParams.createTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
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

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">异常记录处理列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                :disabled="total <= 0"
                @click="handleExport"
                >导出到Excel</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="errorList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
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
            label="检点名称"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="巡检内容"
            align="center"
            prop="patrolContent"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="标准值" align="center">
            <template slot-scope="scope">{{
              value(scope.row, false)
            }}</template>
          </el-table-column>
          <el-table-column label="实际值" align="center">
            <template slot-scope="scope">{{ value(scope.row, true) }}</template>
          </el-table-column>
          <el-table-column
            label="巡检人"
            align="center"
            prop="createUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="提交时间"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="处理状态" align="center">
            <template slot-scope="scope">
              <span v-bind:class="{ active: !scope.row.processStatus }">{{
                statusName(scope.row.processStatus)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="处理人"
            align="center"
            prop="processUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="处理时间"
            align="center"
            prop="processTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.processStatus"
                size="mini"
                type="text"
                icon="el-icon-reading"
                @click="handleRecordQuery(scope.row)"
                >记录查询</el-button
              >
            </template>
          </el-table-column>
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
import { listError, errorExport } from "@/api/modules/inspect/error";

export default {
  name: "ExceptionQuery",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 问题表格数据
      errorList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        taskName: undefined,
        taskType: undefined,
        processStatus: undefined,
        createTime: undefined
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
    /** 处理状态 */
    statusOptions() {
      return this.$store.state.common.problemStatus;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listError(this.queryParams).then(response => {
        const result = response.result;
        this.errorList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取任务类型label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
    },
    // 根据状态value获取处理状态label
    statusName(val) {
      return this.statusOptions.find(item => item.value === val).label;
    },
    // 根据行数据获取标准值/实时值
    value(row, isReal) {
      if (isReal) {
        return row.value ? row.value + (row.unit || "") : "";
      } else {
        return row.stdValue ? row.stdValue + (row.unit || "") : "";
      }
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
    },
    /** 记录查询按钮操作 */
    handleRecordQuery(row) {
      this.$alert(row.processResult, "处理结果", {
        dangerouslyUseHTMLString: true
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        errorExport,
        this.queryParams,
        "异常记录处理列表",
        "异常记录处理"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  color: red;
}
</style>
