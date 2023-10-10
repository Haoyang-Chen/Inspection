<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <!-- <el-form-item label="任务名称" prop="taskName">
            <el-input
              v-model="queryParams.taskName"
              placeholder="请输入任务名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <!-- <el-form-item label="任务类型" prop="taskType">
            <el-select
              v-model="queryParams.taskType"
              placeholder="请选择任务类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="巡检内容" prop="patrolContent">
            <el-input
              v-model="queryParams.patrolContent"
              placeholder="请输入巡检内容"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检点名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入检点名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
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
            <span class="table-title">异常记录处理列表</span>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="errorList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <!-- <el-table-column
            label="任务名称"
            align="center"
            prop="taskName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="任务类型" align="center">
            <template slot-scope="scope">{{
              typeName(scope.row.taskType)
            }}</template>
          </el-table-column> -->
          <el-table-column
            label="检点名称"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="巡检内容"
            align="center"
            prop="patrolContent"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="异常数"
            align="center"
            prop="count"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            width="80"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status !== 1"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >处理</el-button
              >
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
    <!-- 异常处理 -->
    <error-dialog ref="errorDialog" v-model="dialogVisible" @submitSuccess="getList"></error-dialog>
  </div>
</template>

<script>
import { listErrorGroup } from "@/api/modules/inspect/error";
import ErrorDialog from "@/views/components/inspect/error-dialog";

export default {
  name: "ExceptionHandle",
  components: { ErrorDialog },
  data() {
    return {
      // 总条数
      total: 0,
      // 异常处理表格数据
      errorList: null,
      // 是否显示弹框
      dialogVisible: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        patrolContent: undefined,
        deviceName: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 任务类型 */
    typeOptions() {
      return this.$store.state.common.taskTypes;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listErrorGroup(this.queryParams).then(response => {
        const result = response.result;
        this.errorList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取任务类型label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
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
    /** 处理按钮操作 */
    handleEdit(row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.errorDialog.setup({ ...row });
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  color: red;
}
</style>
