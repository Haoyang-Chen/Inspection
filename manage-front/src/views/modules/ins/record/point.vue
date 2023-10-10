<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="巡检时间">
            <el-date-picker
              v-model="queryParams.createTimeStart"
              type="date"
              placeholder="开始日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.createTimeEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检点名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入检点名称"
              clearable
              size="small"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="异常情况" prop="hasError">
            <el-select
              v-model="queryParams.hasError"
              placeholder="有无异常情况"
              clearable
              size="small"
              style="width: 130px"
            >
              <el-option label="有" :value="1" />
              <el-option label="无" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="有无未签到" prop="signStatus">
            <el-select
              v-model="queryParams.signStatus"
              placeholder="有无未签到"
              clearable
              size="small"
              style="width: 120px"
            >
              <el-option label="有" :value="0" />
              <el-option label="无" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索
            </el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置
            </el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">巡检点检查完成列表</span>
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
          :data="pointList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="巡检时间"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}
            </template>
          </el-table-column>
          <el-table-column
            label="检点名称"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检点类型"
            align="center"
            prop="pointTypeName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="任务名称"
            align="center"
            prop="taskName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="巡检人"
            align="center"
            prop="createUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="签到时间"
            align="center"
            prop="signTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.signTime && scope.row.signTime.length">{{
                scope.row.signTime
              }}</span>
              <span v-else style="color:red">未签到</span>
            </template>
          </el-table-column>
          <el-table-column
            label="异常情况"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.errorCount !== 0" style="color:red">{{ scope.row.errorCount }}</span>
              <span v-else>无异常</span>
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
                >记录查询
              </el-button>
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

    <!-- 记录查询对话框 -->
    <table-dialog
      ref="tableDialog"
      v-model="open"
      :searchable="false"
      :isExport="false"
    ></table-dialog>
  </div>
</template>

<script>
import { pointList, pointExport } from "@/api/modules/inspect/task";
import TableDialog from "@/views/components/inspect/table-dialog";
import { getCurrentDate } from "@/views/modules/ins/utils";
import { getBeforeDate } from "@/utils";

export default {
  name: "PointQuery",
  components: { TableDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      pointList: null,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        deviceName: undefined,
        hasError: undefined,
        signStatus: undefined,
        createTimeStart: this.setDefaultDate()[0],
        createTimeEnd: this.setDefaultDate()[1]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      pointList(this.queryParams).then(response => {
        const result = response.result;
        this.pointList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.createTimeStart = this.setDefaultDate()[0];
      this.queryParams.createTimeEnd = this.setDefaultDate()[1];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 记录查询按钮操作 */
    handleRecordQuery(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.tableDialog.setup(row.taskStepId, row.pointId);
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      if (!this.queryParams.createTimeStart || !this.queryParams.createTimeEnd) {
        this.$message.error('请先选择巡检时间');
        return
      }
      var dateBegin = new Date(this.queryParams.createTimeStart);
      var dateEnd = new Date(this.queryParams.createTimeEnd);
      var dateDiff = dateEnd.getTime() - dateBegin.getTime(); // 时间差的毫秒数
      var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      // console.log(dayDiff);
      if (dayDiff > 6) {
        this.$message.error('巡检时间要小于一周');
        return
      }
      this.exportRequest(
        pointExport,
        this.queryParams,
        "检点查询列表",
        "检点查询列表"
      );
    },
    /** 设置默认近30日数据 */
    setDefaultDate () {
      // 获取当前日期
      var lastDate = getBeforeDate(getCurrentDate(), 30);
      return [lastDate, getCurrentDate()]
    }
  }
};
</script>
