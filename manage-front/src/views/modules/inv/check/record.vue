<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="检查表名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入检查表名称"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计划检查日期">
            <el-date-picker
              v-model="queryParams.planCheckDateStart"
              type="date"
              placeholder="开始日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.planCheckDateEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检查日期" prop="checkDate">
            <el-date-picker
              v-model="queryParams.checkDate"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="请选择检查日期"
              size="small"
              style="width: 165px"
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
            <span class="table-title">记录查询列表</span>
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
          :data="recordList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="检查日期"
            align="center"
            prop="checkDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检查表名称"
            align="center"
            prop="formName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检查人"
            align="center"
            prop="checkUserNames"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="发布人"
            align="center"
            prop="createUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="计划检查日期"
            align="center"
            prop="planCheckDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检查状态"
            align="center"
            :show-overflow-tooltip="true"
          >
            已完成
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
                icon="el-icon-view"
                @click="handleView(scope.row)"
                >查看</el-button
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

    <!-- 检查对话框 -->
    <checking-dialog
      ref="checkingDialog"
      v-model="open"
      :editable="false"
    ></checking-dialog>
  </div>
</template>

<script>
import { listCheck, exportCheck } from "@/api/modules/investigate/check";
import CheckingDialog from "@/views/components/trouble/check/checking-dialog";

export default {
  name: "RecordQuery",
  components: { CheckingDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 记录查询表格数据
      recordList: null,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        status: 2,
        formName: undefined,
        checkDate: undefined,
        planCheckDateStart: undefined,
        planCheckDateEnd: undefined
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
      listCheck(this.queryParams).then(response => {
        const result = response.result;
        this.recordList = result.list;
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
      this.clearDateRange(
        this.queryParams,
        'planCheckDateStart',
        'planCheckDateEnd'
      );
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.checkingDialog.setup(row);
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportCheck,
        this.queryParams,
        "记录查询列表记录",
        "记录查询列表"
      );
    }
  }
};
</script>
