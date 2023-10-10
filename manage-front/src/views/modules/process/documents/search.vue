<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          size="small"
          label-width="80px"
        >
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="queryParams.fileName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="文件编号" prop="fileNo">
            <el-input v-model="queryParams.fileNo"></el-input>
          </el-form-item>
          <el-form-item label="文件版本" prop="fileVersion">
            <el-input v-model="queryParams.fileVersion"></el-input>
          </el-form-item> -->
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
            <el-select
              v-model="queryParams.state"
              placeholder="请选择状态"
              clearable
            >
              <el-option label="作废" value="3"> </el-option>
              <el-option label="已评审" value="2"> </el-option>
            </el-select>
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
          <el-table-column label="状态" header-align="center" align="center">
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
            width="150"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
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
import { list_API, export_API } from "@/api/modules/process/webfilelist";
import Detail from "./components/detail";
export default {
  name: "documentsSearch",
  computed: {
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
        queryFlag: 1, // 不要显示草稿（用这个来区分）
        fileName: undefined,
        fileNo: undefined,
        fileVersion: undefined,
        issueDate: undefined,
        carryDate: undefined,
        state: undefined,
      },
      total: 0,
      tableData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(export_API, this.queryParams, "文件查询", "文件查询");
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
    //修改弹窗
    handleEdit(row, islock) {
      this.islock = islock;
      this.islock == true
        ? (this.dialogTitle = "查看")
        : (this.dialogTitle = "编辑");
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Detail"].editTemp(row);
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
.button-delete {
  margin-left: 10px;
  margin-right: 10px;
}
</style>