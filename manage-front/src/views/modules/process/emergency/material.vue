<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="物资名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入物资名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责部门" prop="dept">
        <el-input
          v-model="queryParams.dept"
          placeholder="请输入负责部门"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物资分类" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入物资分类"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="mb8">
      <el-col class="table-title-panel">
        <span class="table-title">物资信息列表</span>
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
      <el-table-column label="物资名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="编号" align="center" prop="number" :show-overflow-tooltip="true" />
      <el-table-column label="负责部门" align="center" prop="dept" :show-overflow-tooltip="true" />
      <el-table-column label="物资分类" align="center" prop="type" :show-overflow-tooltip="true" />
      <el-table-column label="数量" align="center" prop="amount" :show-overflow-tooltip="true" />
      <el-table-column
        label="操作"
        align="center"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
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
    <material-form ref="materialForm" v-model="open" :editable="editable" :title="title" @submitSuccess="getList"></material-form>
  </div>
</template>

<script>
import { materialList, delMaterial } from "@/api/modules/process/emergency/material";
import MaterialForm from "@/views/components/process/emergency/material-form";

export default {
  components: {
    MaterialForm
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
      title: '',
      // 是否可编辑
      editable: true,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        number: undefined,
        dept: undefined,
        type: undefined
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
      materialList(this.queryParams).then(response => {
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
      this.rowsOpRequest(delMaterial, idList, "物资信息").then(_ => {
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
        this.$refs.materialForm.setup(row.id);
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