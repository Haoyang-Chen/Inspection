<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入标题"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="类型" prop="mainType">
            <el-select
              v-model="queryParams.mainType"
              placeholder="请选择类型"
              clearable
              size="small"
              style="width: 120px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
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
            <span class="table-title">消息列表</span>
            <div style="float:right;">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                >删除</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="msgList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="标题"
            align="center"
            prop="title"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="类别"
            align="center"
            prop="mainType"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-bind:class="{ active: !scope.row.status }">{{
                !scope.row.status ? "未读" : "已读"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            align="center"
            prop="title"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="时间"
            align="center"
            prop="createTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            width="140"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
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
  </div>
</template>

<script>
import { listMsg, readMsg, delMsg } from "@/api/modules/sys/msg";

export default {
  name: "Message",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 消息表格数据
      msgList: null,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        title: undefined,
        mainType: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 消息类型 */
    typeOptions() {
      return this.$store.state.common.messageTypes;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listMsg(this.queryParams).then(response => {
        const result = response.result;
        this.msgList = result.list;
        this.total = result.totalCount;
        this.loading = false;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const msgIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delMsg, msgIds, "消息").then(_ => {
        this.getList();
      });
    },
    /** 单击一行操作 */
    handleRowClick(row) {
      const msgIds = [row.id];
      readMsg(msgIds).then(response => {
        this.getList();
        this.$store.dispatch("GetUnreadMessage");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  color: red;
}
</style>
