<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="法律法规名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入法律法规名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时效性" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择时效性"
          clearable
          >
          <el-option v-for="item in lawStatusOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="mb8">
      <el-col class="table-title-panel">
        <span class="table-title">法律法规列表</span>
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
      <el-table-column label="法律法规名称" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="法律效力位阶" align="center" prop="type" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ typeName(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column label="制定机关" align="center" prop="formulateDepartment" :show-overflow-tooltip="true" />
      <el-table-column label="时效性" align="center" prop="status" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ statusName(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="施行日期" align="center" prop="applyTime" :show-overflow-tooltip="true" />
      <el-table-column label="文件附件" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.filesList.length > 0">
            {{ scope.row.filesList.length }}
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column label="符合性评价" align="center" prop="commentCount" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.commentCount > 0">
            <el-button
              size="mini"
              type="text"
              @click="handleComment(scope.row)"
            >{{ scope.row.commentCount }}</el-button>
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- 1是，0否，具有操作权限 -->
          <template v-if="scope.row.allowOperate === 1">
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
          </template>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleEdit(scope.row, false)"
          >查看</el-button>
          <el-button
            v-if="$store.state.user.ifAdmin === 1"
            size="mini"
            type="text"
            icon="el-icon-s-comment"
            @click="handleEva(scope.row, true)"
          >符合性评价</el-button>
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
    <laws-dialog ref="lawsDialog" v-model="open" :editable="editable" @submitSuccess="getList"></laws-dialog>
    <!-- 符合性评价 -->
    <evaluation-dialog ref="evaluationDialog" v-model="evaluateVisible" :editable="editable" :type="type" @submitSuccess="getList"></evaluation-dialog>
    <!-- 符合性评价列表 -->
    <evaluation-list ref="evaluationList" v-model="evaluateListVisible" :type="type"></evaluation-list>
  </div>
</template>

<script>
import { listLaw, delLaw } from "@/api/modules/knowledge/laws";
import LawsDialog from "@/views/components/knowledge/laws";
import EvaluationDialog from "@/views/components/knowledge/evaluation/evaluationDialog";
import EvaluationList from "@/views/components/knowledge/evaluation/list";

export default {
  components: {
    LawsDialog,
    EvaluationDialog,
    EvaluationList
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
      // 是否显示符合性评价弹出层
      evaluateVisible: false,
      // 是否显示符合性评价列表弹出层
      evaluateListVisible: false,
      // 是否可编辑
      editable: true,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        title: undefined,
        status: undefined
      },
      // 安全知识库 0法律法规，1标准规范，2安全文件
      type: 0
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 法律效力位阶数据字典 */
    lawsTypeOptions() {
      return this.$store.state.common.lawTypes;
    },
    /** 时效性数据字典 */
    lawStatusOptions() {
      return this.$store.state.common.lawStatus;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listLaw(this.queryParams).then(response => {
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
    /** 根据法律效力位阶value获取label */
    typeName(val) {
      return this.lawsTypeOptions.find(item => item.value === val).label;
    },
    /** 根据时效性value获取label */
    statusName(val) {
      return this.lawStatusOptions.find(item => item.value === val).label;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.editable = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delLaw, idList, "法律法规").then(_ => {
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
      this.$nextTick(() => {
        this.$refs.lawsDialog.setup(row.id);
      })
    },
    /** 符合性评价 */
    handleEva(row, editable) {
      this.evaluateVisible = true;
      this.editable = editable;
      this.$nextTick(() => {
        this.$refs.evaluationDialog.setup({...row});
      })
    },
    /** 符合性评价列表 */
    handleComment(row) {
      this.evaluateListVisible = true;
      this.$nextTick(() => {
        this.$refs.evaluationList.setup(row.id)
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