<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="设备名称编号" prop="deviceNo">
        <el-input v-model="queryParams.deviceNo"></el-input>
      </el-form-item>
      <el-form-item label="设备类别" prop="deviceCategory">
        <el-select v-model="queryParams.deviceCategory" placeholder="请选择">
          <el-option
            v-for="item in equipmentCategoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
      <div class="title">
        <i class="el-icon-s-operation"></i> 气体泄漏检测点列表
      </div>
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
        label="设备名称编号"
        align="center"
        prop="deviceNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备类别"
        align="center"
        prop="deviceCategory"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="检测气体"
        align="center"
        prop="gasDetection"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备描述"
        align="center"
        prop="deviceDes"
        :show-overflow-tooltip="true"
      />
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="text" @click="handleDelete(scope.row)"
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

    <Qtxljcdxx
      v-model="dialogVisible"
      @closeView="handleQuery()"
      ref="Qtxljcdxx"
    />
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
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
import {
  list_API,
  delete_API,
  template_API,
} from "@/api/modules/wxyjc/wxyjcdangerousgaspoint";
import Qtxljcdxx from "@/views/components/wxyjc/qtxljcdxx/qtxljcdxx";
import UploadDialog from "@/components/UploadDialog";

export default {
  components: {
    Qtxljcdxx,
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
      UploadDialogActionUri: "/wxyjcdangerousgaspoint/import",
      templateFunc: () => {
        this.templateRequest(template_API, {}, "合同创建导入模板");
      },
      queryParams: {
        page: 1,
        limit: 10,
        deviceNo: undefined,
        deviceCategory:undefined,
      },
      tableData: [],
      total: 0,
      equipmentCategoryList: [],
    };
  },
  created() {
    this.getList();
    wxyjcdictindex_API("device_category_sub").then((res) => {
      this.equipmentCategoryList = res.result;
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
    handleEdit(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Qtxljcdxx"].editTemp(id);
      });
    },
    //删除
    handleDelete(row) {
      const itemIds = row && row.id != undefined ? [row.id] : this.ids;
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