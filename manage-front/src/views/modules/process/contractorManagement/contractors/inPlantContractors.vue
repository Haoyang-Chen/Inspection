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
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="queryParams.state"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="item in userStatus01"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
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
          <span class="title">承包商数据列表</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="add()"
              >新增</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-upload2"
              size="small"
              @click="handleImport()"
              >从Excel导入</el-button
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
            prop="contractorName"
            label="单位名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="contractorNature"
            label="单位性质"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="contactPhone"
            label="承包商电话"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="approachDate"
            label="进厂日期"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="responsibySignDate"
            label="责任书签订日期"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="responsibyExpiryDate"
            label="责任书到期日期"
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
          <el-table-column label="状态" header-align="center" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 1">
                <el-tag type="success">正常</el-tag>
              </span>
              <span v-else>
                <el-tag type="danger">禁入</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                type="text"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-popconfirm
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
      </el-col>
    </el-row>
    <InPlantContractorsDetail
      :dialogTitle="dialogTitle"
      v-model="dialogVisible"
      @closeView="getList()"
      ref="InPlantContractorsDetail"
    ></InPlantContractorsDetail>
    <!-- 导入对话框 -->
     <UploadDialog
      v-model="uploading"
      actionUri="/webcontractor/import"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></UploadDialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  list_API,
  delete_API,
  export_API,
  template_API,
} from "@/api/modules/process/webcontractor";
import InPlantContractorsDetail from "./components/inPlantContractorsDetail";
import UploadDialog from "@/components/UploadDialog";
export default {
  name: "inPlantContractors",
  computed: {
    ...mapState({
      userStatus01: (state) => state.common.userStatus01,
    }),
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    InPlantContractorsDetail,
    UploadDialog,
  },
  data() {
    return {
      // 是否显示上传弹出层
      uploading: false,
      dialogVisible: false,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        contractorName: undefined,
        state: undefined,
      },
      tableData: [],
      ids: [],
      total: 0,
      dialogTitle: "",
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template_API, "在厂承包商导入模板");
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    // 文件上传完成处理
    handleUploadCompletion(response) {
      this.getList();
    },
    //导出
    handleExport() {
      let params = {
        exportFlag: 1,
        ...this.queryParams,
      };
      this.exportRequest(export_API, params, "在厂承包商", "在厂承包商");
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
    //新增弹窗
    add() {
      this.dialogTitle = "新增";
      this.dialogVisible = true;
    },
    //修改弹窗
    handleEdit(row) {
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["InPlantContractorsDetail"].editTemp(row);
      });
    },
    //删除按钮处理
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      this.multiple = !val.length;
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