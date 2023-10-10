<template>
  <el-dialog
    title="查看"
    :visible.sync="visible"
    width="60%"
    @close="handleClose"
    append-to-body>
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
            <span class="table-title">任务查询列表</span>
            <div style="float:right;"></div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="queryList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            prop="name"
            label="巡检日期"
            width="120"
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
          <el-table-column label="巡检时间段" align="center" width="120">
            <template slot-scope="scope">{{ period(scope.row) }}</template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            prop="statusName"
            width="120"
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listProgress } from "@/api/modules/inspect/task";
import { getPeriod } from "@/views/modules/ins/utils";
import { pickerValue, verifyInterval } from "@/views/modules/rep/utils";

export default {
  name: "TaskQuery",
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    }
  },
  components: { },
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
      // 巡检时间日期范围
      execDate: pickerValue(3),
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        onlyDay: 1,
        taskName: undefined,
        status: undefined
      },
      visible: false
    };
  },
  watch: {
    value(val) {
      this.visible = val
      if (val) {
        this.getList()
      }
    },
    visible(val) {
      this.$emit('input', val)
    }
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 发布状态 */
    statusOptions() {
      return this.$store.state.common.inspectStatus;
    }
  },
  created() {},
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listProgress(this.addDateRange(
          this.queryParams,
          this.execDate,
          "startDate",
          "endDate"
        )).then(response => {
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
      return this.taskTypeOptions.find(item => item.value === val).label;
    },
    // 根据行数据获取巡检时间段
    period(row) {
      return getPeriod(row);
    },
    /** 搜索按钮操作 */
    handleQuery() {
       if (!this.execDate) {
        this.$message.error("请选择巡检时间");
        return;
      }
      if (!verifyInterval(this.execDate[0], this.execDate[1], 3)) {
        this.$message.error("时间范围不能超过3天,请重新选择");
        return;
      }
      this.queryParams.pa
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.execDate = pickerValue(3);
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 关闭弹框 */
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
