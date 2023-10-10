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
          <el-form-item label="资质证书到期时间" prop="validUntil">
            <el-date-picker
              v-model="queryParams.validUntil"
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
          <span class="title">资质证书</span>
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
            prop="contractorPrincipal"
            label="承包商负责人"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="safetyDirector"
            label="安全负责人"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="certificateCode"
            label="资质证书编号"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="validUntil"
            label="资质证书到期时间"
            header-align="center"
            align="center"
          >
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
import {
  certificates_list_API,
  certificatesExport_API,
} from "@/api/modules/process/webcontractor";
export default {
  name:"certificateOfQualification",
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
        validUntil:undefined
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
      this.exportRequest(certificatesExport_API, this.queryParams, "资质证书", "资质证书");
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
      certificates_list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
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