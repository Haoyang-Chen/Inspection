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
          <span class="title">承包商人员数据列表</span>
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
            prop="personName"
            label="人员姓名"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="contractorName"
            label="承包商名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="trainDate"
            label="培训日期"
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
          <el-table-column
            label="培训附件"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <image-viewer
                :ref="'imageViewer' + scope.$index"
                :images="scope.row.trainFileList"
              ></image-viewer>
              <span
                v-if="scope.row.trainFileList && scope.row.trainFileList.length"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="点击预览图片"
                  placement="top-start"
                >
                  <el-button
                    icon="el-icon-picture-outline"
                    type="primary"
                    plain
                    size="mini"
                    @click="showImages(scope.$index)"
                    >{{ scope.row.trainFileList.length }}</el-button
                  >
                </el-tooltip>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="特种操作种类"
            header-align="center"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span
                style="color:#409EFF;cursor: pointer;"
                @click="handleFileDownLoad(scope.row.specialCertificates)"
                v-if="
                  scope.row.specialCertificates &&
                  scope.row.specialCertificates.length > 0
                "
              >
                {{ scope.row.specialOperationType }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="有效状态"
            header-align="center"
            align="center"
          >
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
    <ContractorStaffDetail
      :dialogTitle="dialogTitle"
      v-model="dialogVisible"
      @closeView="getList()"
      ref="contractorStaffDetail"
    ></ContractorStaffDetail>
    <!-- 导入对话框 -->
     <UploadDialog
      v-model="uploading"
      actionUri="/webcontratorperson/import"
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
} from "@/api/modules/process/webcontratorperson";
import ContractorStaffDetail from "./components/contractorStaffDetail";
import ImageViewer from "@/components/ImageViewer";
import UploadDialog from "@/components/UploadDialog";

import { allLoad } from "@/utils/fileListDownload";

export default {
  name: "contractorStaff",
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
    ContractorStaffDetail,
    UploadDialog,
    ImageViewer,
  },
  data() {
    return {
      uploading: false, // 是否显示上传弹出层
      dialogVisible: false,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        contractorName: undefined,
        state: undefined,
      },
      tableData: [],
      total: 0,
      dialogTitle: "",
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template_API, "承包商人员导入模板");
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
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        export_API,
        this.queryParams,
        "承包商人员",
        "承包商人员"
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
    add() {
      this.dialogTitle = "新增";
      this.dialogVisible = true;
    },
    //修改弹窗
    handleEdit(row) {
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["contractorStaffDetail"].editTemp(row);
      });
    },
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      this.multiple = !val.length;
    },
    /** 显示图片 */
    showImages(index) {
      this.$refs["imageViewer" + index].show();
    },
    handleFileDownLoad(arr) {
      let newarr = [];
      arr.forEach((item) => {
        if (item.fileUploadList && item.fileUploadList.length > 0) {
          newarr = newarr.concat(item.fileUploadList);
        }
      });
      allLoad(newarr);
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