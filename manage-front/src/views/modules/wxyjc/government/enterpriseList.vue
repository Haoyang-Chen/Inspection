<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="compName">
        <el-input v-model="queryParams.compName"></el-input>
      </el-form-item>
      <el-form-item label="企业规模" prop="scaleSituation">
        <el-select
          v-model="queryParams.scaleSituation"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in scaleSituationList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安全风险等级" prop="safetyRiskLevel">
        <el-select
          v-model="queryParams.safetyRiskLevel"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in safetyStandardLevelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安全标准化等级" prop="safetyStandardLevel">
        <el-select
          v-model="queryParams.safetyStandardLevel"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in safetyRiskLevelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行政区域" style="margin-bottom: 0">
        <AreaPicker :labelTitle="labelTitle" v-model="queryParams" :editable="false"></AreaPicker>
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
      <div class="title"><i class="el-icon-s-operation"></i> 企业列表</div>
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
        label="实际生产经营地址"
        align="center"
        prop="proAddress"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="企业规模"
        align="center"
        prop="scaleSituation"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="重大危险源等级"
        align="center"
        prop="isHazardGrade"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="企业风险等级"
        align="center"
        prop="safetyRiskLevel"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="安全标准化等级"
        align="center"
        prop="safetyStandardLevel"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="主要负责人"
        align="center"
        prop="corporationName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="主要负责人联系电话"
        align="center"
        prop="corporationMobile"
        :show-overflow-tooltip="true"
      />

      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.companyId)"
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

    <DialogCompany v-model="dialogVisible" ref="DialogCompany" />
  </div>
</template>

<script>
import { ORG_AREA } from "@/views/components/common/utils";
import AreaPicker from "@/views/components/common/area-picker01";
import DialogCompany from "@/views/components/wxyjc/common/dialogCompany";
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
import { list_API, excel_API } from "@/api/modules/wxyjc/wxyjcenterpriseinfo";
export default {
  components: {
    AreaPicker,
    DialogCompany,
  },
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
        limit: 1000,
        compName: undefined,
        ...ORG_AREA
      },
      labelTitle: "",
      scaleSituationList: [], //企业规模
      safetyStandardLevelList: [], //安全风险等级
      safetyRiskLevelList: [], //安全标准化等级
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
    this.getAllTypeList();
  },
  // mounted() {
  //   this.queryParams = { ...ORG_AREA, ...this.queryParams };
  // },
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
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.page.list;
        this.total = res.page.totalCount;
      });
    },
    handleEdit(companyId) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["DialogCompany"].editTemp(companyId);
      });
    },
    getAllTypeList() {
      wxyjcdictindex_API("scale").then((res) => {
        this.scaleSituationList = res.result;
      });
      wxyjcdictindex_API("safety_risk_level").then((res) => {
        this.safetyStandardLevelList = res.result;
      });
      wxyjcdictindex_API("bzhdj").then((res) => {
        this.safetyRiskLevelList = res.result;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(excel_API, this.queryParams, "企业信息", "企业信息");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>