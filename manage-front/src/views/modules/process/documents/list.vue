<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="80px"
      size="small"
    >
      <el-form-item label="文件名称" prop="fileName">
        <el-input v-model="queryParams.fileName"></el-input>
      </el-form-item>
      <el-form-item label="发布日期" prop="issueDate">
        <el-date-picker
          v-model="queryParams.issueDate"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :editable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实施日期" prop="carryDate">
        <el-date-picker
          v-model="queryParams.carryDate"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :editable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态">
          <el-option
            v-for="item in DocumentsState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
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
          type="success"
          icon="el-icon-s-finance"
          size="small"
          @click="handleExport()"
          >批量导出</el-button
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
        prop="fileName"
        label="文件名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="fileNo"
        label="文件编号"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="fileVersion"
        label="版本"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="issueDate"
        label="发布日期"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="carryDate"
        label="实施日期"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1">
            <el-tag type="warning">草稿</el-tag>
          </span>
          <span v-else-if="scope.row.state == 2">
            <el-tag type="success">已评审</el-tag>
          </span>
          <span v-else-if="scope.row.state == 3">
            <el-tag type="danger">作废</el-tag>
          </span>
          <span v-else>
            <el-tag>其他</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="320"
        header-align="center"
        align="left"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state == 2"
            @click="changeAbolition(scope.row)"
            type="text"
            icon="el-icon-document-delete"
            >废止</el-button
          >
          <el-button
            v-if="scope.row.state == 2"
            @click="changeEdition(scope.row)"
            type="text"
            icon="el-icon-document-copy"
            >换版</el-button
          >
          <el-button
            v-if="scope.row.state != 3"
            @click="
              handleEdit(scope.row, (islock = false), (disabledEdit = true))
            "
            type="text"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            type="text"
            icon="el-icon-view"
            @click="handleEdit(scope.row, (islock = true))"
            >查看</el-button
          >
          <el-popconfirm
            v-if="scope.row.state == 1"
            title="这条信息确定删除吗？"
            @onConfirm="handleDelete(scope.$index, scope.row, tableData)"
          >
            <el-button
              type="text"
              icon="el-icon-delete"
              slot="reference"
              class="button-delete"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <Detail
      v-model="dialogVisible"
      :islock="islock"
      :dialogTitle="dialogTitle"
      @closeView="getList()"
      ref="Detail"
    ></Detail>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  list_API,
  delete_API,
  export_API,
  cancel_API,
} from "@/api/modules/process/webfilelist";
import Detail from "./components/detail";
export default {
  name: "documentsList",
  computed: {
    ...mapGetters(["DocumentsState"]),
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    Detail,
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      islock: false,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        fileName: undefined,
        issueDate: undefined,
        carryDate: undefined,
        state: undefined,
      },
      total: 0,
      tableData: [],
      ids: [],
      disabledEdit: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(export_API, this.queryParams, "文件列表", "文件列表");
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
    handleDelete(index, row, rows) {
      this.ids = [row.id];
      delete_API(this.ids).then((res) => {
        this.$message({
          message: "删除成功！",
          type: "success",
        });
        rows.splice(index, 1);
      });
    },
    //新增弹窗
    add(islock) {
      this.islock = islock;
      this.dialogTitle = "新增";
      this.dialogVisible = true;
      this.$refs["Detail"].init(0);
    },
    //修改弹窗
    handleEdit(row, islock) {
      this.islock = islock;
      this.islock == true
        ? (this.dialogTitle = "查看")
        : (this.dialogTitle = "编辑");
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Detail"].editTemp(row);
        this.$refs["Detail"].init(2);
      });
    },
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      this.multiple = !val.length;
    },
    //废止
    changeAbolition(row) {
      let params = {
        id: row.id,
      };
      if (row.state == 3) {
        this.$message({
          message: "文件已经废止，不需要再次废止",
          type: "warning",
        });
      } else {
        this.$confirm("确定要废止吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          cancel_API(params).then((res) => {
            this.getList();
          });
        });
      }
    },
    //换版
    changeEdition(row) {
      this.islock = false;
      this.dialogTitle = "换版";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Detail"].editTemp(row, 1);
        this.$refs["Detail"].init(1);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-button {
  margin-bottom: 8px;
}
.button-delete {
  margin-left: 10px;
  margin-right: 10px;
}
</style>