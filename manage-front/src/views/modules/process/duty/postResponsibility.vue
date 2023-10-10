<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="岗位" prop="post">
        <el-input
          v-model="queryParams.post"
          placeholder="请输入岗位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="岗位责任" prop="postResp">
        <el-input
          v-model="queryParams.postResp"
          placeholder="请输入岗位责任"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="目标责任书" prop="targetResp">
        <el-input
          v-model="queryParams.targetResp"
          placeholder="请输入目标责任书"
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
        <span class="table-title">岗位责任书列表</span>
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
      <el-table-column label="岗位" align="center" prop="post" :show-overflow-tooltip="true" />
      <el-table-column label="岗位职责" align="center" prop="postResp" :show-overflow-tooltip="true" />
      <el-table-column label="目标责任书" align="center" prop="targetResp" :show-overflow-tooltip="true" />
      <el-table-column label="目标责任" align="center" prop="memo" :show-overflow-tooltip="true" />
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
    <post-responsibility-form ref="postResponsibilityForm" v-model="open" :editable="editable" :title="title" @submitSuccess="getList"></post-responsibility-form>
  </div>
</template>

<script>
import { respList, delResp } from "@/api/modules/process/duty/postResponsibility";
import PostResponsibilityForm from "@/views/components/process/duty/post-responsibility-form";

export default {
  components: {
    PostResponsibilityForm
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
        post: undefined,
        postResp: undefined,
        targetResp: undefined
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
      respList(this.queryParams).then(response => {
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
      this.rowsOpRequest(delResp, idList, "岗位责任书").then(_ => {
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
        this.$refs.postResponsibilityForm.setup({...row});
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