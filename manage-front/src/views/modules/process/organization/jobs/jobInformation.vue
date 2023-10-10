<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="small">
      <el-form-item label="岗位名称" prop="stationName">
        <el-input v-model="queryParams.stationName"></el-input>
      </el-form-item>
      <el-form-item label="岗位职责" prop="stationPosition">
        <el-input v-model="queryParams.stationPosition"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="resetQuery()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <div class="header-button flex justify-between items-center mb8">
      <span class="title">岗位信息</span>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="add()"
          >新增</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="small"
          @click="handleImport()"
          >从Excel导入</el-button
        >
        <el-button
          type="success"
          @click="handleExport()"
          icon="el-icon-s-finance"
          size="small"
          >批量导出</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </div>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :max-height="tableHeight"
    >
      <el-table-column
        type="selection"
        width="44"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        header-align="center"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="stationName"
        label="岗位名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="stationPosition"
        label="岗位职责"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleEdit(scope.row, true)"
            type="text"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            slot="reference"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            type="text"
            icon="el-icon-view"
            @click="handleEdit(scope.row, false)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <JobInformationDetail
      ref="JobInformationDetail"
      :dialogTitle="dialogTitle"
      :editable="editable"
      v-model="dialogVisible"
      @closeView="getList"
    ></JobInformationDetail>
    <!-- 导入对话框 -->
     <UploadDialog
      v-model="uploading"
      actionUri="/webcompanystation/import"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></UploadDialog>
  </div>
</template>

<script>
import {
  list_API,
  delete_API,
  export_API,
  template_API,
} from "@/api/modules/process/webcompanystation";
import JobInformationDetail from "./components/jobInformationDetail";
import UploadDialog from "@/components/UploadDialog";
export default {
  name: "jobInformation",
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    JobInformationDetail,
    UploadDialog,
  },
  data() {
    return {
      // 表单是否可编辑
      editable: true,
      dialogTitle: undefined,
      dialogVisible: false,
      // 是否显示上传弹出层
      uploading: false,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        stationName: undefined,
        stationPosition: undefined,
      },
      tableData: [],
      total: 0,
      ids: [],
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template_API, "岗位信息导入模板");
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    // 文件上传完成处理
    handleUploadCompletion(response) {
      this.getList();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(export_API, this.queryParams, "岗位信息", "岗位信息");
    },
    //查询
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    //重置搜索
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //获取数据
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    //删除
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.ids;
      this.rowsOpRequest(delete_API, ids, "岗位信息").then((_) => {
        this.ids = null;
        this.getList();
      });
    },
    //新增弹窗
    add() {
      this.editable = true;
      this.dialogTitle = "新增";
      this.dialogVisible = true;
    },
    //修改弹窗
    handleEdit(row, editable) {
      this.editable = editable;
      if (this.editable) {
        this.dialogTitle = "编辑";
      } else {
        this.dialogTitle = "查看";
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["JobInformationDetail"].editTemp(row);
      });
    },
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      this.multiple = !val.length;
    },
  },
};
</script>

