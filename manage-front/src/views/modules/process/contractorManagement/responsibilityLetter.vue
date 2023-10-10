<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          size="small"
        >
          <el-form-item label="承包商名称" prop="contractorName">
            <el-input v-model="queryParams.contractorName"></el-input>
          </el-form-item>
          <el-form-item label="承包商负责人" prop="contractorPrincipal">
            <el-input v-model="queryParams.contractorPrincipal"></el-input>
          </el-form-item>
          <el-form-item label="安全负责人" prop="safetyDirector">
            <el-input v-model="queryParams.safetyDirector"></el-input>
          </el-form-item>
          <el-form-item label="责任书到期时间" prop="responsibyExpiryDate">
            <el-date-picker
              v-model="queryParams.responsibyExpiryDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleQuery()"
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
      </el-col>
      <el-col :span="24" :xs="24">
        <div class="header-button flex justify-between items-center">
          <span class="title">责任书列表</span>
          <div>
            <el-button
              type="success"
              icon="el-icon-s-finance"
              size="small"
              @click="handleExport()"
              >批量导出</el-button
            >
          </div>
        </div>
      </el-col>

      <el-col :span="24" :xs="24">
        <el-table
          :data="tableData"
          style="width: 100%"
          :max-height="tableHeight"
        >
          <el-table-column
            type="index"
            label="序号"
            header-align="center"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="contractorName"
            label="承包商名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="businessScope"
            label="经营范围"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="责任书附件"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span
                @click="handleFileDownLoad(scope.row.fileUploadList)"
                v-if="
                  scope.row.fileUploadList &&
                  scope.row.fileUploadList.length > 0
                "
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="点击下载附件"
                  placement="top-start"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-files"
                    plain
                    size="mini"
                    >{{ scope.row.fileUploadList.length }}</el-button
                  >
                </el-tooltip>
              </span>
              <span v-else></span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { allLoad } from "@/utils/fileListDownload";
import { list_API, export_API } from "@/api/modules/process/webcontractor";
export default {
  name:"responsibilityLetter",
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  data() {
    return {
      dialogVisible: false,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        contractorName:undefined,
        safetyContactPhone:undefined,
        contractorPrincipal:undefined,
        safetyDirector:undefined,
        responsibyExpiryDate:undefined,
      },
      tableData: [],
      total: 0,
      dialogTitle: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //导出
    handleExport() {
      this.exportRequest(export_API, this.queryParams, "责任书", "责任书");
    },
    //查询
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    //重置搜索
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
    //文件批量下载
    handleFileDownLoad(arr) {
      allLoad(arr);
    },
  },
};
</script>

<style lang="scss" scoped>
.header-button {
  border-top: 1px solid #dcdfe6;
  padding-top: 18px;
  margin-bottom: 8px;
}
</style>