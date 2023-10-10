<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="compName">
        <el-input v-model="queryParams.compName"></el-input>
      </el-form-item>
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
        label="重大危险源/区域编号"
        align="center"
        prop="hazardNo"
        :show-overflow-tooltip="true"
      />
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { list_API, excel_API } from "@/api/modules/wxyjc/wxyjcdangeroushazard";
export default {
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  data() {
    return {
      dialogVisible: false,
      queryParams: {
        page: 1,
        limit: 10,
        compName: undefined,
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
        "危险源信息",
        "危险源信息"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>