<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" :size="size">
          <el-form-item label="检查表名称" prop="formName">
            <el-input
              v-model="queryParams.formName"
              placeholder="请输入检查表名称"
              clearable
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
              style="width:160px;"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.planCheckDateEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              style="width:160px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检查状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择检查状态"
              clearable
              style="width: 160px"
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
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">检查计划列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                :size="size"
                @click="handleAdd"
                >发布检查计划</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="planList"
          :max-height="tableHeight"
          :size="size"
        >
          <el-table-column label="序号" align="center" type="index" />
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
            label="计划检查日期"
            align="center"
            prop="planCheckDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="发布日期"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}
            </template>
          </el-table-column>
          <el-table-column
            label="检查状态"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ statusName(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.status == 0">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  icon="el-icon-refresh-left"
                  @click="handleRevoke(scope.row)"
                  >撤销</el-button
                >
              </template>
              <el-button
                v-else-if="scope.row.status == 1"
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

    <!-- 添加或修改参数配置对话框 -->
    <planing-dialog
      ref="planingDialog"
      v-model="open"
      @planSuccess="getList"
    ></planing-dialog>

    <!-- 检查对话框 -->
    <checking-dialog
      ref="checkingDialog"
      v-model="checking"
      :editable="false"
    ></checking-dialog>
  </div>
</template>

<script>
import { listCheck, revokeCheck } from "@/api/modules/investigate/check";
import PlaningDialog from "@/views/components/trouble/check/planing-dialog";
import CheckingDialog from "@/views/components/trouble/check/checking-dialog";

export default {
  name: "RecordQuery",
  components: { PlaningDialog, CheckingDialog },
  data() {
    return {
      size:'small',
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 检查计划表格数据
      planList: null,
      // 是否显示弹出层
      open: false,
      // 是否显示查看弹出层
      checking: false,
      // 检查状态数据字典
      statusOptions: [
        {
          label: "未检查",
          value: 0
        },
        {
          label: "检查中",
          value: 1
        }
      ],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        create: 1,
        formName: undefined,
        status: undefined,
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
        this.planList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据检查状态value获取label
    statusName(val) {
      return this.statusOptions.find(item => item.value === val).label;
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
    /** 新增按钮操作 */
    handleAdd() {
      this.setupAddDialog();
      this.open = true;
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.setupAddDialog(row);
      this.open = true;
    },
    setupAddDialog(params = {}) {
      this.$nextTick(() => {
        this.$refs.planingDialog.setup(params);
      });
    },
    /** 撤销按钮操作 */
    handleRevoke(row) {
      this.rowsOpRequest(revokeCheck, row.id, "检查计划", 1).then(_ => {
        this.getList();
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.checking = true;
      this.$nextTick(() => {
        this.$refs.checkingDialog.setup(row);
      });
    }
  }
};
</script>
