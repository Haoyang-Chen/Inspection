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
          <el-form-item label="被考核人" prop="coverAssessPerson">
            <el-input v-model="queryParams.coverAssessPerson"></el-input>
          </el-form-item>
          <el-form-item label="被考核人部门" prop="coverAssessDept">
            <el-input v-model="queryParams.coverAssessDept"></el-input>
          </el-form-item>
          <el-form-item label="考核人" prop="assessPerson">
            <el-input v-model="queryParams.assessPerson"></el-input>
          </el-form-item>
          <el-form-item label="考核结果" prop="assessResult">
            <el-input v-model="queryParams.assessResult"></el-input>
          </el-form-item>
          <el-form-item label="年份" prop="particularYear">
            <el-date-picker
              v-model="queryParams.particularYear"
              type="year"
              placeholder="选择年"
              format="yyyy"
              value-format="yyyy"
              :editable="false"
            >
            </el-date-picker>
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
          <span class="title">岗位考核</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="add((islock = false))"
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
            prop="coverAssessPerson"
            label="被考核人"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="coverAssessStation"
            label="被考核人岗位"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="coverAssessDept"
            label="被考核人部门"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="assessPerson"
            label="考核人"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="assessResult"
            label="考核结果"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="particularYear"
            label="年份"
            header-align="center"
            align="center"
          >
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
                @click="handleEdit(scope.row, (islock = false))"
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
    <PositionAssessmentDetail
      :dialogTitle="dialogTitle"
      :islock="islock"
      v-model="dialogVisible"
      @closeView="getList()"
      ref="PositionAssessmentDetail"
    ></PositionAssessmentDetail>
    <!-- 导入对话框 -->
     <UploadDialog
      v-model="uploading"
      actionUri="/webstationassess/import"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></UploadDialog>
  </div>
</template>

<script>
import {
  list_API,
  delete_API,
  export_API,
  template_API,
} from "@/api/modules/process/webstationassess";
import PositionAssessmentDetail from "./components/positionAssessmentDetail";
import UploadDialog from "@/components/UploadDialog";
export default {
  name:"positionAssessment",
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    PositionAssessmentDetail,
    UploadDialog,
  },
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 10,
        coverAssessPerson:undefined,
        coverAssessDept:undefined,
        assessPerson:undefined,
        assessResult:undefined,
        particularYear:undefined
      },
      tableData: [],
      dialogVisible: false,
      // 是否显示上传弹出层
      uploading: false,
      multiple: true,
      total: 0,
      dialogTitle: "",
      ids: [],
      islock: false,
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template_API, "岗位考核导入模板");
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
      this.exportRequest(export_API, this.queryParams, "岗位考核", "岗位考核");
    },

    //查询
    handleQuery() {
      console.log(this.queryParams);
      //return false;
      this.queryParams.page = 1;
      this.getList();
    },
    //重置
    resetQuery() {
      console.log("resetQuery");
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
    },
    //修改弹窗
    handleEdit(row, islock) {
      this.islock = islock;
      this.islock == true
        ? (this.dialogTitle = "查看")
        : (this.dialogTitle = "编辑");
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["PositionAssessmentDetail"].editTemp(row);
      });
    },
    //关闭弹窗
    changeDialogVisible() {
      this.dialogVisible = false;
    },
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