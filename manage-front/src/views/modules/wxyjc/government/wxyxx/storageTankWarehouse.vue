<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="compName">
        <el-input v-model="queryParams.compName"></el-input>
      </el-form-item>
      <el-form-item label="设备名称编号" prop="deviceNo">
        <el-input v-model="queryParams.deviceNo"></el-input>
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
      <div class="title"><i class="el-icon-s-operation"></i> 储罐仓库列表</div>
      <div class="buttons">
        <el-button icon="el-icon-download" size="mini" @click="handleExport()"
          >批量导出</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" :max-height="tableHeight">
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column
        label="企业名称"
        align="center"
        prop="compName"
        :show-overflow-tooltip="true"
      />
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
        label="设备内介质"
        align="center"
        prop="deviceMedia"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="罐类型"
        align="center"
        prop="tankType"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="罐压力类型"
        align="center"
        prop="tankPressureType"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="罐温度类型"
        align="center"
        prop="tankTempType"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="投用日期"
        align="center"
        prop="useDate"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="最近检维修日期"
        align="center"
        prop="lastMaintenanceDate"
        :show-overflow-tooltip="true"
      />
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)"
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

    <Cgckxx
      v-model="dialogVisible"
      @closeView="handleQuery()"
      ref="Cgckxx"
      :editable="editable"
    />
    <!-- 导入对话框 -->
  </div>
</template>

<script>
import { list_API, excel_API } from "@/api/modules/wxyjc/wxyjcdangeroustank";
import Cgckxx from "@/views/components/wxyjc/cgckxx/cgckxx";
export default {
  components: {
    Cgckxx,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  data() {
    return {
      editable: false,
      dialogVisible: false,
      queryParams: {
        page: 1,
        limit: 10,
        compName: undefined,
        deviceNo: undefined,
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
        this.$refs["Cgckxx"].editTemp(id);
      });
    },
    //获取数据
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        excel_API,
        this.queryParams,
        "储罐仓库信息",
        "储罐仓库信息"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>