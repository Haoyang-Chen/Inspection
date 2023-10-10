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
          <el-form-item label="公告标题" prop="titleNotice">
            <el-input v-model="queryParams.titleNotice"></el-input>
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
          <span class="title">文件列表</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="add((islock = false))"
              >新增</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              :disabled="multiple"
              @click="batchDelete()"
              >删除</el-button
            >
          </div>
        </div>
      </el-col>

      <el-col :span="24" :xs="24">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :max-height="tableHeight"
        >
          <el-table-column
            type="selection"
            width="44"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            header-align="center"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="titleNotice"
            label="公告名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column label="附件" header-align="center" align="center">
            <template slot-scope="scope">
              <span
                @click="handleFileDownLoad(scope.row.filesList)"
                v-if="scope.row.filesList && scope.row.filesList.length > 0"
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
                    >{{ scope.row.filesList.length }}</el-button
                  >
                </el-tooltip>
              </span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="320"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row, (islock = false))"
                type="text"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-popconfirm
                title="这条信息确定删除吗？"
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  slot="reference"
                  class="button-delete"
                  >删除</el-button
                >
              </el-popconfirm>
              <el-button
                type="text"
                icon="el-icon-view"
                @click="handleEdit(scope.row, (islock = true))"
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
      </el-col>
    </el-row>
    <NoticeDetail
      v-model="dialogVisible"
      :islock="islock"
      :dialogTitle="dialogTitle"
      @closeView="getList()"
      ref="NoticeDetail"
    ></NoticeDetail>
  </div>
</template>

<script>
import {
  list_API,
  delete_API,
  export_API,
} from "@/api/modules/process/webfilenotice";

import { allLoad } from "@/utils/fileListDownload";

import NoticeDetail from "./components/noticeDetail";
export default {
  name:"documentsNotice",
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    NoticeDetail,
  },
  data() {
    return {
      dialogVisible: false,
      multiple: true,
      islock: false,
      queryParams: {
        page: 1,
        limit: 10,
        titleNotice:undefined
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
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        export_API,
        this.queryParams,
        "首页通知公告",
        "首页通知公告"
      );
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
    //批量删除-删除
    batchDelete() {
      delete_API(this.ids).then((res) => {
        this.$message({
          message: "批量删除成功！",
          type: "success",
        });
        this.handleQuery();
      });
    },
    //单个删除
    handleDelete(row) {
      this.ids = [row.id];
      delete_API(this.ids).then((res) => {
        this.$message({
          message: "删除成功！",
          type: "success",
        });
        this.resetQuery();
      });
    },
    //新增弹窗
    add(islock) {
      this.islock = islock;
      this.dialogTitle = "新增";
      this.dialogVisible = true;
    },
    //修改弹窗
    handleEdit(row, islock) {
      this.islock = islock;
      this.islock == true
        ? (this.dialogTitle = "查看")
        : (this.dialogTitle = "编辑");
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["NoticeDetail"].editTemp(row);
      });
    },
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      this.multiple = !val.length;
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
.button-delete {
  margin-left: 10px;
  margin-right: 10px;
}
</style>