<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入用户名"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门" prop="deptName">
            <el-input
              v-model="queryParams.deptName"
              placeholder="请输入部门"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="queryParams.roleId"
              placeholder="请选择角色"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in roleOptions"
                :key="dict.roleId"
                :label="dict.name"
                :value="dict.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="登录时间" prop="loginDate">
            <el-date-picker
              v-model="queryParams.loginDate"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="请选择登录时间"
              size="small"
              style="width: 165px"
            ></el-date-picker>
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
            <span class="table-title">APP登录信息列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                :disabled="total <= 0"
                @click="handleExport"
                >导出到Excel</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="logList" :max-height="tableHeight">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="用户名"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            prop="deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="班组"
            align="center"
            prop="teamName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="角色"
            align="center"
            prop="roleName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="登录时间"
            align="center"
            prop="loginDate"
            :show-overflow-tooltip="true"
          />
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
import { listLog, exportLog } from "@/api/modules/sys/log";
import { listRole } from "@/api/modules/sys/role";

export default {
  name: "AppLoginLog",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 登录记录表格数据
      logList: null,
      // 角色数据字典
      roleOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        deptName: undefined,
        roleId: undefined,
        loginDate: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    }
  },
  created() {
    this.getList();
    this.getRoleList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then(response => {
        const result = response.result;
        this.logList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 查询角色列表 */
    getRoleList() {
      listRole().then(response => {
        const result = response.result.map(item => {
          return {
            roleId: item.roleId,
            name: item.name
          };
        });
        this.roleOptions = result;
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
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(exportLog, this.queryParams, "APP登录记录", "APP登录");
    }
  }
};
</script>
