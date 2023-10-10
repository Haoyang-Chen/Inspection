<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
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
          <el-form-item label="风险点名称" prop="hazardName">
            <el-input
              v-model="queryParams.hazardName"
              placeholder="请输入风险点名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所在区域" prop="area">
            <el-input
              v-model="queryParams.area"
              placeholder="请输入所在区域"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="风险等级" prop="level">
            <el-select
              v-model="queryParams.level"
              placeholder="请选择风险等级"
              clearable
              size="small"
              style="width: 180px"
            >
              <el-option
                v-for="dict in riskLevelsOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="管控层级" prop="controlLevel">
            <el-select
              v-model="queryParams.controlLevel"
              placeholder="请选择管控层级"
              clearable
              size="small"
              style="width: 180px"
            >
              <el-option
                v-for="dict in controlLevels"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
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
            <span class="table-title">风险数据列表</span>
            <div style="float:right;">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="ids.length <= 0"
                @click="handleDelete"
              >批量删除</el-button>
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                :disabled="total.length <= 0"
                @click="handleExport"
              >导出风险管控清单</el-button>
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
              {{ scope.row.type === 1 ? '设备设施' : '作业活动' }}
            </template>
          </el-table-column>
          <el-table-column label="风险点名称" align="center" prop="hazardName" :show-overflow-tooltip="true" />
          <el-table-column label="所在区域" align="center" prop="area" :show-overflow-tooltip="true" />
          <el-table-column label="风险等级" align="center" prop="level" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ levelName(scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column label="管控层级" align="center" prop="controlLevel" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ controlLevelName(scope.row.controlLevel) }}
            </template>
          </el-table-column>
          <el-table-column label="责任部门" align="center" prop="respDeptName" :show-overflow-tooltip="true" />
          <el-table-column label="可能造成的事故类型" align="center" prop="accidentList" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.accidentList ? scope.row.accidentList.join(",") : '' }}
            </template>
          </el-table-column>
          <el-table-column label="最新辨识时间" align="center" prop="updateTime" :show-overflow-tooltip="true" />
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
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleCard(scope.row)"
              >风险告知卡</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <classification-dialog ref="classification" v-model="open" :editable="editable" :title="title" @submitSuccess="getList"></classification-dialog>
    <!-- 风险告知卡对话框 -->
    <risk-card-dialog
      v-model="carding"
      :riskData="selectRow"
    ></risk-card-dialog>
  </div>
</template>

<script>
import ClassificationDialog from "@/views/components/risk/classification";
import RiskCardDialog from "@/views/components/risk/risk-card-dialog";
import { listClassification, del, detail, classificationExport } from "@/api/modules/risk/classification";
import { levelName, controlLevelName } from "@/views/components/risk/utils";

export default {
  components: {
    ClassificationDialog,
    RiskCardDialog
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单是否可编辑
      editable: true,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        area: undefined,
        hazardName: undefined,
        type: undefined,
        level: undefined,
        controlLevel: undefined
      },
      levelName,
      controlLevelName,
      // 是否显示风险告知卡弹出层
      carding: false,
      selectRow: {},
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
    },
    /** 风险等级数据字典 */
    riskLevelsOptions() {
      return this.$store.state.common.riskLevels;
    },
    /** 管控层级 */
    controlLevels() {
      return this.$store.state.common.controlLevels;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listClassification(this.queryParams).then(response => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
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
      this.title = "添加";
    },
    /** 编辑按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.editable = editable;
      this.title = "编辑";
      this.setupDialog(row.id);
    },
    setupDialog(data = undefined) {
      this.$nextTick(() => {
        this.$refs.classification.setup(data);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(del, ids, "风险数据").then(_ => {
        this.getList();
      });
    },
    /** 风险告知卡按钮操作 */
    handleCard(row) {
      detail(row.id).then(res => {
        var rowData = res.result;
        this.carding = true;
        this.selectRow = rowData;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        classificationExport,
        this.queryParams,
        "风险管控清单",
        "风险数据列表"
      );
    }
  }
};
</script>
