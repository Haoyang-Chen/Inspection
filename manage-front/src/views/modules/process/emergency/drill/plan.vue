<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="演练名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入演练名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="演练地点" prop="place">
        <el-input
          v-model="queryParams.place"
          placeholder="请输入演练地点"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主办部门" prop="dept">
        <el-input
          v-model="queryParams.dept"
          placeholder="请输入主办部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="演练级别" prop="level">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入演练级别"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划演练日期" prop="drillDate">
        <el-date-picker
          v-model="queryParams.drillDate"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择日期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          >
          <el-option v-for="item in drillStatusOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="mb8">
      <el-col class="table-title-panel">
        <span class="table-title">演练计划列表</span>
        <div style="float:right;">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="ids.length <= 0"
            @click="handleDelete"
          >批量删除</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :max-height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="演练名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="演练地点" align="center" prop="place" :show-overflow-tooltip="true" />
      <el-table-column label="主办部门" align="center" prop="dept" :show-overflow-tooltip="true" />
      <el-table-column label="演练级别" align="center" prop="level" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true" />
      <el-table-column label="计划演练日期" align="center" prop="drillDate" :show-overflow-tooltip="true" />
      <el-table-column
        label="操作"
        align="center"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === '待演练'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row, true)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleEdit(scope.row, false)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <plan-form ref="planForm" v-model="open" :editable="editable" :title="title" @submitSuccess="getList"></plan-form>
  </div>
</template>

<script>
import { drillPlanList, delDrillPlan } from "@/api/modules/process/emergency/drillPlan";
import PlanForm from "@/views/components/process/emergency/drill/plan-form";

export default {
  components: {
    PlanForm
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 表格数据
      tableData: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '添加',
      // 是否可编辑
      editable: true,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        place: undefined,
        dept: undefined,
        level: undefined,
        drillDate: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 目标类型数据字典 */
    targetTypeOptions() {
      return this.$store.state.common.targetTypes;
    },
    /** 演练状态数据字典 */
    drillStatusOptions() {
      return this.$store.state.common.drillStatus;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      drillPlanList(this.queryParams).then(response => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.editable = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delDrillPlan, idList, "演练计划").then(_ => {
        this.getList();
      });
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
    /** 编辑按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.editable = editable;
      this.title = editable ? '编辑' : '查看';
      this.$nextTick(() => {
        this.$refs.planForm.setup(row.id);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.right-title span {
  padding-left: 20px;
  font-size: 14px;
}
</style>