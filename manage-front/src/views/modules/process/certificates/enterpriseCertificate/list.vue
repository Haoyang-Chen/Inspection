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
          <el-form-item label="证书名称" prop="certificateName">
            <el-input v-model="queryParams.certificateName"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="overdueFlag">
            <el-select
              v-model="queryParams.overdueFlag"
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in overdueFlagList"
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
          <span class="title">企业资质证书列表</span>
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
            prop="certificateName"
            label="证书名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="certificateNo"
            label="证书编号"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="certificateType"
            label="证书类型"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="是否长期有效"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isLongRange == 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="有效期至"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.isLongRange == 1"
                >长期有效</el-tag
              >
              <span v-else>{{ scope.row.expiryDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="overdueFlag"
            label="状态"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.overdueFlag == '已过期'">{{ scope.row.overdueFlag }}</el-tag>
              <el-tag type="warning" v-else-if="scope.row.overdueFlag == '即将到期'">{{ scope.row.overdueFlag }}</el-tag>
              <span v-else>{{ scope.row.overdueFlag }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="证书扫描件"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <image-viewer
                :ref="'imageViewer' + scope.$index"
                :images="scope.row.certificatePhotoList"
              ></image-viewer>
              <span
                v-if="
                  scope.row.certificatePhotoList &&
                  scope.row.certificatePhotoList.length
                "
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
                    >{{ scope.row.certificatePhotoList.length }}</el-button
                  >
                </el-tooltip>
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="预警状态" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.warnStatus === '红色告警'"
                class="warn-status warn-red"
                >红色预警</span
              >
              <span
                v-else-if="scope.row.warnStatus === '黄色告警'"
                class="warn-status warn-yellow"
                >黄色预警</span
              >
              <span v-else>--</span>
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
                @click="handleEdit(scope.row, (islock = false))"
                type="text"
                icon="el-icon-edit"
                >换证</el-button
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
    <Detail
      :dialogTitle="dialogTitle"
      :islock="islock"
      v-model="dialogVisible"
      @closeView="getList()"
      ref="Detail"
    ></Detail>
    <!-- 导入对话框 -->
     <UploadDialog
      v-model="uploading"
      actionUri="/webcertificatedepart/import"
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
} from "@/api/modules/process/webcertificatedepart";
import ImageViewer from "@/components/ImageViewer";
import Detail from "./components/detail";
import UploadDialog from "@/components/UploadDialog";
export default {
  name:"enterpriseCertificateList",
  computed: {
    ...mapState({
      overdueFlagList: (state) => state.common.overdueFlagList,
    }),
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    Detail,
    UploadDialog,
    ImageViewer,
  },
  data() {
    return {
      // 是否显示上传弹出层
      uploading: false,
      dialogVisible: false,
      islock: false,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        state: 1,
        certificateName:undefined,
        overdueFlag: undefined,
      },
      tableData: [],
      total: 0,
      dialogTitle: "",
      ids: [],
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template_API, "企业证书导入模板");
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
      this.exportRequest(export_API, this.queryParams, "企业证书", "企业证书");
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
    //修改弹窗-查看
    handleEdit(row, islock = false) {
      if (row.state == 2 && islock == false) {
        this.$message({
          message: "已经过期，不需要再换证",
          type: "warning",
        });
      } else {
        this.islock = islock;
        this.islock == true
          ? (this.dialogTitle = "查看")
          : (this.dialogTitle = "换证");
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs["Detail"].editTemp(row, islock);
        });
      }
    },
    //批量删除-选择
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      this.multiple = !val.length;
    },
    /** 显示图片 */
    showImages(index) {
      this.$refs["imageViewer" + index].show();
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