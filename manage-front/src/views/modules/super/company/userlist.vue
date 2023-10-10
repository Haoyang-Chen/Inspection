<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="公司名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入公司名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="版本选择" prop="version">
            <el-select
              v-model="queryParams.version"
              placeholder="请选择平台版本"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in versionOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">企业用户列表</span>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="企业名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="登录账号"
            align="center"
            prop="workNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="企业联系人"
            align="center"
            prop="userName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="联系电话"
            align="center"
            prop="mobile"
            width="120"
          />
          <el-table-column label="版本选择" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.version">
                {{ versionName(scope.row.version) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-bind:class="{ active: !scope.row.status }">{{
                !scope.row.status ? "禁用" : "启用"
              }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
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
import { listUser } from "@/api/modules/super/enterprise";

export default {
  name: "User",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        version: undefined,
      },
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 版本数据字典 */
    versionOptions() {
      return this.$store.state.common.systemVersions;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        const result = response.result;
        this.userList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取版本label
    versionName(val) {
      return this.versionOptions.find((item) => item.value === val).label;
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
  },
};
</script>

<style lang="scss" scoped>
.active {
  color: red;
}
</style>
