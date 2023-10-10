<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="装置名称编号" prop="deviceNo">
        <el-input v-model="queryParams.deviceNo"></el-input>
      </el-form-item>
      <el-form-item label="所属工艺种类" prop="processCategory">
        <el-select v-model="queryParams.processCategory" placeholder="请选择">
          <el-option
            v-for="item in processCategoryList"
            :key="item.id"
            :label="item.processName"
            :value="item.processCode"
          ></el-option>
        </el-select>
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
      <div class="title"><i class="el-icon-s-operation"></i> 装置信息列表</div>
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
        label="装置名称编号"
        align="center"
        prop="deviceNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属工艺大类"
        align="center"
        prop="processCategoryName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属工艺细类"
        align="center"
        prop="processCategorySubName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="安全仪表系统投用状态位号"
        align="center"
        prop="statusTagNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="安全仪表连锁回路总数"
        align="center"
        prop="circuitsTotal"
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

    <Zzxx v-model="dialogVisible" @closeView="handleQuery()" ref="Zzxx" />
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
import { wxyjcdicttechnology_API } from "@/api/common/wxyjcdicttechnology";
import {
  list_API,
  delete_API,
  template_API,
} from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import Zzxx from "@/views/components/wxyjc/zzxx/zzxx";
import UploadDialog from "@/components/UploadDialog";
export default {
  components: {
    Zzxx,
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
      UploadDialogActionUri: "/wxyjcdangerousapparatus/import",
      templateFunc: () => {
        this.templateRequest(template_API, {}, "装置信息导入模板");
      },
      queryParams: {
        page: 1,
        limit: 10,
        deviceNo: undefined,
        processCategory: undefined,
      },
      processCategoryList: [],
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
    wxyjcdicttechnology_API(0).then((res) => {
      this.processCategoryList = res.result;
    });
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
    //新增
    handleEdit(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Zzxx"].editTemp(id);
      });
    },
    //删除
    handleDelete(id) {
      const itemIds = id != undefined ? [id] : this.ids;
      this.rowsOpRequest(delete_API, itemIds, "装置信息").then((_) => {
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