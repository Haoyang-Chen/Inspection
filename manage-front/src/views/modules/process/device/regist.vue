<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择设备类型"
          clearable
          size="small"
          style="width: 180px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="mb8">
      <el-col class="table-title-panel">
        <span class="table-title">设备数据列表</span>
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
      <el-table-column label="设备名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="设备编号" align="center" prop="number" :show-overflow-tooltip="true" />
      <el-table-column label="规格型号" align="center" prop="model" :show-overflow-tooltip="true" />
      <el-table-column label="设备类型" align="center" prop="type" :show-overflow-tooltip="true" />
      <el-table-column label="启用日期" align="center" prop="startDate" :show-overflow-tooltip="true" />
      <el-table-column label="下次检测日期" align="center" prop="nextCheckDate" :show-overflow-tooltip="true" />
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
            @click="handleClick(scope.row)"
          >生成二维码</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
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
    <regist-form ref="registForm" v-model="open" :editable="editable" :title="title" @submitSuccess="getList"></regist-form>
    <el-dialog :visible.sync="dialogVisible"
      title="二维码"
      width="400px">
      <div style="text-align:center"><img :src="codeUrl" style="width:150px" /></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCode">保存到本地</el-button>
      </span>
    </el-dialog>

    <upload-dialog
      v-model="uploading"
      actionUri="/company/device/import"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></upload-dialog>
  </div>
</template>

<script>
import { deviceList, delDevice, qrCode, template } from "@/api/modules/process/device";
import RegistForm from "@/views/components/process/device/regist-form";
import { downloadImage } from "@/utils/base64Download";
import UploadDialog from "@/components/UploadDialog";

export default {
  components: {
    RegistForm,
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
      tableData: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '添加',
      // 是否可编辑
      editable: true,
      // 二维码图片
      codeUrl: '',
      // 二维码弹框
      dialogVisible: false,
      // 是否显示上传弹出层
      uploading: false,
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template, "设备导入模板");
      },
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        hazardName: undefined,
        level: undefined,
        ifOverdue: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 设备类型数据字典 */
    typeOptions() {
      return this.$store.state.common.deviceClass;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      deviceList(this.queryParams).then(response => {
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
      this.rowsOpRequest(delDevice, idList, "设备").then(_ => {
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
    handleEdit(row) {
      this.open = true;
      this.editable = true;
      this.title = '编辑';
      this.$nextTick(() => {
        this.$refs.registForm.setup({...row});
      })
    },
    /** 生成二维码操作 */
    handleClick(row) {
      this.dialogVisible = true;
      qrCode(row.id).then(res => {
        this.codeUrl = res.result;
      })
    },
    /** 保存二维码 */
    saveCode() {
      downloadImage(this.codeUrl, '二维码');
    },
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    // 文件上传完成处理
    handleUploadCompletion(response) {
      this.getList();
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