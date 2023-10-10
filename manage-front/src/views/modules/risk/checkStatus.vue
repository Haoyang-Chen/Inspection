<template>
  <div class="app-container">
    <!--搜索数据-->
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="风险名称" prop="hazardName">
        <el-input
          v-model="queryParams.hazardName"
          placeholder="请输入风险名称"
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
      <el-form-item label="逾期情况" prop="ifOverdue">
        <el-select
          v-model="queryParams.ifOverdue"
          placeholder="请选择逾期情况"
          clearable
          size="small"
          style="width: 180px"
        >
          <el-option label="已逾期" value="1"></el-option>
          <el-option label="未逾期" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="mb8">
      <el-col class="table-title-panel">
        <span class="table-title">风险任务查询列表</span>
        <div style="float:right;" class="right-title">
          <!-- <span>检查任务总数：0</span>
          <span>正常检查完成数量：0</span>
          <span>逾期未检查数量：0</span> -->
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
        label="类型"
        align="center"
        prop="checkDate"
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
      <el-table-column label="责任部门" align="center" prop="respDeptName" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="checkStatus" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.checkStatus === 1 ? '已检查' : '未检查' }}
        </template>
      </el-table-column>
      <el-table-column label="检查频率" align="center" prop="rate" :show-overflow-tooltip="true" />
      <el-table-column label="逾期情况" align="center" prop="ifOverdue" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.ifOverdue === 1 ? '已逾期' : '未逾期' }}
        </template>
      </el-table-column>
      <el-table-column label="最近检查日期" align="center" prop="lastCheckDate" :show-overflow-tooltip="true" />
      <el-table-column label="截止检查日期" align="center" prop="deadCheckDate" :show-overflow-tooltip="true" />
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

    <!-- 查看检查详情对话框 -->
    <classification-dialog ref="classification" v-model="open" :editable="editable" title="查看"></classification-dialog>
  </div>
</template>

<script>
import { checkStatusList } from "@/api/modules/risk/checkStatus";
import { levelName } from "@/views/components/risk/utils";
import ClassificationDialog from "@/views/components/risk/classification";

export default {
  components: {
    ClassificationDialog
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
      // 是否可编辑
      editable: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        hazardName: undefined,
        level: undefined,
        ifOverdue: undefined
      },
      levelName
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
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
      checkStatusList(this.queryParams).then(response => {
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
    /** 查看按钮操作 */
    handleClick(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.classification.setup(row.id);
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