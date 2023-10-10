<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          size="small"
          style="width: 180px"
        >
          <el-option
            v-for="dict in hazardSourceType"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="风险点名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入风险点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所在区域" prop="areaName">
        <el-select
          v-model="queryParams.areaName"
          placeholder="请选择所在区域"
          clearable
          size="small"
          style="width: 180px"
        >
          <el-option
            v-for="dict in areaList"
            :key="dict.id"
            :label="dict.area"
            :value="dict.area"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="mb8">
      <el-col>
        <span class="table-title">危险源数据列表</span>
        <div style="float:right;">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="small"
            @click="handleImport"
            >批量导入</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :disabled="total <= 0"
            @click="handleExport"
          >导出危险源清单</el-button>
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
      <el-table-column
        label="类型"
        align="center"
        prop="type"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.type === 1 ? '设备实施' : '作业活动'}}
        </template>
      </el-table-column>
      <el-table-column label="风险点名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="所在区域" align="center" prop="areaName" :show-overflow-tooltip="true" />
      <el-table-column label="责任部门" align="center" prop="respDeptName" :show-overflow-tooltip="true" />
      <el-table-column label="可能造成的事故类型" align="center" prop="accidentList" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.accidentList ? scope.row.accidentList.join(",") : '' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
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
    <hazard-source-dialog ref="hazardSourceDialog" v-model="open" :editable="editable" :title="title" @submitSuccess="getList"></hazard-source-dialog>
    <upload-dialog
      v-model="uploading"
      actionUri="/risk/hazardSource/import"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></upload-dialog>
  </div>
</template>

<script>
import { listHazardSource, del, hazardSourceExport, template } from "@/api/modules/risk/hazardSource";
import { listArea } from "@/api/modules/risk/area";
import HazardSourceDialog from "@/views/components/risk/hazardSource";
import UploadDialog from "@/components/UploadDialog";

export default {
  components: {
    HazardSourceDialog,
    UploadDialog
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
      tableData: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单是否可编辑
      editable: true,
      // 是否显示上传弹出层
      uploading: false,
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template, "危险源导入模板");
      },
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        type: undefined,
        name: undefined,
        areaName: undefined
      },
      // 区域列表
      areaList: []
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 风险源类型 */
    hazardSourceType() {
      return this.$store.state.common.hazardSourceType;
    }
  },
  created() {
    this.getList();
    this.getAreaList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listHazardSource(this.queryParams).then(response => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 查询区域列表 */
    getAreaList() {
      var params = { page: 1,limit: 1000000 };
      listArea(params).then(response => {
        const result = response.result;
        this.areaList = result.list ? result.list : [];
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "添加危险源";
    },
    /** 编辑按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.editable = editable;
      this.title = "修改危险源";
      this.$nextTick(() => {
        this.$refs.hazardSourceDialog.setup({ ...row });
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(del, ids, "危险源").then(_ => {
        this.getList();
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        hazardSourceExport,
        this.queryParams,
        "危险源清单",
        "危险源列表"
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    /** 文件上传完成处理 */
    handleUploadCompletion(response) {
      this.getList();
    }
  }
}
</script>