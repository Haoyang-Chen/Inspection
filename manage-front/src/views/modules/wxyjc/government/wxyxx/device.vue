<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="compName">
        <el-input v-model="queryParams.compName"></el-input>
      </el-form-item>
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
        <el-button icon="el-icon-download" size="mini" @click="handleExport()"
          >批量导出</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      :max-height="tableHeight"
    >
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

    <Zzxx v-model="dialogVisible" @closeView="handleQuery()" ref="Zzxx" :editable="editable" />
  </div>
</template>

<script>
import { wxyjcdicttechnology_API } from "@/api/common/wxyjcdicttechnology";
import {
  list_API,excel_API
} from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import Zzxx from "@/views/components/wxyjc/zzxx/zzxx";
export default {
  components: {
    Zzxx
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
    //查看
    handleEdit(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Zzxx"].editTemp(id);
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
        "装置信息",
        "装置信息"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>