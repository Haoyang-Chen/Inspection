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
          <el-form-item label="线路类型" prop="lineType">
            <el-select
              v-model="queryParams.lineType"
              placeholder="请选择线路类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in lineTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检时间">
            <el-date-picker
              v-model="queryParams.startDate"
              type="date"
              placeholder="开始时间"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.endDate"
              type="date"
              placeholder="结束时间"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="巡检班组" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入巡检班组"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="巡检结果" prop="result">
            <el-select
              v-model="queryParams.result"
              placeholder="请选择巡检结果"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in resultOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
            <span class="table-title">任务查询列表</span>
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
          :data="queryList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="巡检时间"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.execStartDate, "{y}-{m}-{d}") }}
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
              taskTypeName(scope.row.taskType)
            }}</template>
          </el-table-column>
          <el-table-column
            label="线路名称"
            align="center"
            prop="lineName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="线路类型" align="center">
            <template slot-scope="scope">{{
              lineTypeName(scope.row.lineType)
            }}</template>
          </el-table-column>
          <el-table-column label="巡检时间段" align="center">
            <template slot-scope="scope">{{ period(scope.row) }}</template>
          </el-table-column>
          <el-table-column
            label="巡检班组"
            align="center"
            prop="teamName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="巡检人员"
            align="center"
            prop="taskUserNames"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="巡检结果"
            align="center"
            prop="result"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="有无未签到" align="center">
            <template slot-scope="scope">
              <span v-bind:class="{ active: scope.row.notSignCount > 0 }">{{
                scope.row.notSignCount > 0 ? scope.row.notSignCount : "无"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
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
    <table-dialog ref="tableDialog" v-model="open"></table-dialog>
  </div>
</template>

<script>
import { listQuery, exportQuery } from "@/api/modules/inspect/task";
import TableDialog from "@/views/components/inspect/table-dialog";
import { getPeriod } from "../utils";

export default {
  name: "TaskQuery",
  components: { TableDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 任务查询表格数据
      queryList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        taskName: undefined,
        lineType: undefined,
        startDate: undefined,
        endDate: undefined,
        name: undefined,
        result: undefined,
        taskType: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 线路类型 */
    lineTypeOptions() {
      return this.$store.state.common.lineTypes;
    },
    /** 任务类型 */
    typeOptions() {
      return this.$store.state.common.taskTypes;
    },
    /** 巡检结果 */
    resultOptions() {
      return [
        {
          label: "已完成",
          value: 2
        },
        {
          label: "未完成",
          value: 4
        },
        {
          label: "巡检中",
          value: 1
        }
      ]
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listQuery(this.queryParams).then(response => {
        const result = response.result;
        this.queryList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取线路类型label
    lineTypeName(val) {
      return this.lineTypeOptions.find(item => item.value === val).label;
    },
    // 根据版本value获取任务类型label
    taskTypeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
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
      this.clearDateRange(
        this.queryParams,
        'startDate',
        'endDate'
      );
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(exportQuery, this.queryParams, "任务查询记录", "任务查询");
    },
    /** 记录查询按钮操作 */
    handleRecordQuery(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.tableDialog.setup(row.id);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  color: red;
}
</style>
