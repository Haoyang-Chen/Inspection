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
          <el-form-item label="姓名" prop="personName">
            <el-input v-model="queryParams.personName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="personSex">
            <el-select
              v-model="queryParams.personSex"
              placeholder="请选择性别"
              clearable
            >
              <el-option
                v-for="item in personSexList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证" prop="personNo">
            <el-input v-model="queryParams.personNo"></el-input>
          </el-form-item>
          <el-form-item label="承包商名称" prop="contractorName">
            <el-input v-model="queryParams.contractorName"></el-input>
          </el-form-item>
          <el-form-item label="上次培训日期">
            <el-date-picker
              v-model="queryParams.trainDateStart"
              type="date"
              placeholder="开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.trainDateEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="下次培训日期">
            <el-date-picker
              v-model="queryParams.nextTrainDateStart"
              type="date"
              placeholder="开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.nextTrainDateEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px"
            ></el-date-picker>
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
          <span class="title">培训提醒</span>
          <!-- <div>
            <el-button type="success" icon="el-icon-s-finance" size="small"
              >批量导出</el-button
            >
          </div> -->
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
            prop="personName"
            label="姓名"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="personSex"
            label="性别"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.personSex | personSexFilter }}
            </template>
          </el-table-column>
          <el-table-column
            prop="personNo"
            label="身份证"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="contractorName"
            label="承包商名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="trainDate"
            label="上次培训日期"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="nextTrainDate"
            label="下次培训日期"
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
import { mapGetters } from "vuex";

import {
  train_list_API,
  export_API,
} from "@/api/modules/process/webcontratorperson";

export default {
  name:"trainingReminder",
  computed: {
    ...mapGetters(["personSexList"]),
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  filters: {
    personSexFilter(val) {
      if (val == 0) {
        return "女";
      } else if (val == 1) {
        return "男";
      } else {
        return "未知";
      }
    },
  },
  data() {
    return {
      dialogVisible: false,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        personName: undefined,
        personSex: undefined,
        personNo: undefined,
        contractorName: undefined,
        trainDateStart: undefined,
        trainDateEnd: undefined,
        nextTrainDateStart: undefined,
        nextTrainDateEnd: undefined
      },
      tableData: [],
      total: 0,
      dialogTitle: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(export_API, this.queryParams, "培训提醒", "培训提醒");
    },
    //查询
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    //重置搜索
    resetQuery() {
      this.clearDateRange(
        this.queryParams,
        'trainDateStart',
        'trainDateEnd'
      );
      this.clearDateRange(
        this.queryParams,
        'nextTrainDateStart',
        'nextTrainDateEnd'
      );
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //获取数据
    getList() {
      train_list_API(this.queryParams).then((res) => {
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