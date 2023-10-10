<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="重大危险源名称" prop="hazardName">
        <el-input v-model="queryParams.hazardName"></el-input>
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
    <div class="header-title-buttons flex justify-between items-center">
      <div class="title"><i class="el-icon-s-operation"></i> 危险源列表</div>
      <div class="buttons">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd()"
          >新增</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete()"
          >批量删除</el-button
        >
        <el-button icon="el-icon-upload" size="mini" @click="handleImort()"
          >批量导入</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      :max-height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column
        label="重大危险源名称"
        align="center"
        prop="hazardName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="重大危险源/区域编号"
        align="center"
        prop="hazardNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="text" @click="handleDelete(scope.row.id)"
            >删除</el-button
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

    <Wxyxx v-model="dialogVisible" @closeView="handleQuery()" ref="Wxyxx" />
    <!-- 导入对话框 -->
    <UploadDialog
      v-model="uploading"
      :actionUri="UploadDialogActionUri"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    />
  </div>
</template>

<script>
import {
  list_API,
  delete_API,
  template_API,
} from "@/api/modules/wxyjc/wxyjcdangeroushazard";
import Wxyxx from "@/views/components/wxyjc/wxyxx/wxyxx";
import UploadDialog from "@/components/UploadDialog";
export default {
  components: {
    Wxyxx,
    UploadDialog,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  data() {
    return {
      multiple: true,
      ids: [],
      dialogVisible: false,
      uploading: false,
      UploadDialogActionUri: "/wxyjcdangeroushazard/import",
      templateFunc: () => {
        this.templateRequest(template_API, {}, "危险源信息导入模板");
      },
      queryParams: {
        page: 1,
        limit: 10,
        hazardName: undefined,
      },
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //搜索
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    //重置
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //新增
    handleAdd() {
      this.dialogVisible = true;
    },
    handleEdit(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Wxyxx"].editTemp(id);
      });
    },
    //删除
    handleDelete(id) {
      const itemIds = id != undefined ? [id] : this.ids;
      this.rowsOpRequest(delete_API, itemIds, "危险源").then((_) => {
        this.getList();
      });
    },
    //批量导入
    handleImort() {
      this.uploading = true;
    },
    //获取数据
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    // 文件上传完成处理
    handleUploadCompletion() {
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>