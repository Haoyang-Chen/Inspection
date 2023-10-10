<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="检查日期:">
        <el-date-picker
          v-model="queryParams.checkDateStart"
          placeholder="开始日期"
          type="date"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          size="small"
          style="width:160px;"
        ></el-date-picker>
        -
        <el-date-picker
          v-model="queryParams.checkDateEnd"
          placeholder="结束日期"
          type="date"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          size="small"
          style="width:160px;"
        ></el-date-picker>
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
      <el-form-item label="检查结果" prop="result">
        <el-select
          v-model="queryParams.result"
          placeholder="请选择检查结果"
          clearable
          size="small"
          style="width: 180px"
        >
          <el-option label="正常" value="1"></el-option>
          <el-option label="异常" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="mb8">
      <el-col>
        <span class="table-title">检查记录列表</span>
        <div style="float:right;">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :disabled="total <= 0"
            @click="handleExport"
          >导出</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      :max-height="tableHeight"
    >
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="检查日期"
        align="center"
        prop="checkDate"
        :show-overflow-tooltip="true"
      />
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
      <el-table-column label="检查人" align="center" prop="checkUser" :show-overflow-tooltip="true" />
      <el-table-column label="检查结果" align="center" prop="result" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.result === 1 ? '正常' : '异常' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleClick(scope.row)"
          >查看检查详情</el-button>
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

    <!-- 查看检查详情对话框 -->
    <detail-dialog v-model="open" ref="detailDialog"></detail-dialog>
  </div>
</template>

<script>
import { checkList, checkListExport } from "@/api/modules/risk/checkHistory";
import DetailDialog from "@/views/components/risk/checkHistory/detail-dialog";
import { levelName, controlLevelName } from "@/views/components/risk/utils";

export default {
  components: {
    DetailDialog
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
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        result: undefined,
        checkDateStart: undefined,
        checkDateEnd: undefined,
        level: undefined
      },
      levelName,
      controlLevelName
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
    /** 所在区域 */
    hazardSourceArea() {
      return this.$store.state.common.hazardSourceArea;
    },
    /** 风险等级数据字典 */
    riskLevelsOptions() {
      return this.$store.state.common.riskLevels;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      checkList(this.queryParams).then(response => {
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
      this.queryParams.checkDateStart = undefined;
      this.queryParams.checkDateEnd = undefined;
      this.handleQuery();
    },
    /** 查看按钮操作 */
    handleClick(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.detailDialog.setup({...row});
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        checkListExport,
        this.queryParams,
        "检查记录",
        "检查记录列表"
      );
    }
  }
}
</script>