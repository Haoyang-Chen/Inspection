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
          <el-form-item label="人员姓名" prop="personnelName">
            <el-input v-model="queryParams.personnelName"></el-input>
          </el-form-item>
          <el-form-item label="所属岗位" prop="position">
            <el-input v-model="queryParams.position"></el-input>
          </el-form-item>
          <el-form-item label="发证日期" prop="issueDate">
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
          <el-form-item label="有效期至" prop="expiryDate">
            <el-date-picker
              v-model="queryParams.expiryDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
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
          <span class="title">人员证书列表</span>
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
            prop="personnelName"
            label="人员姓名"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="position"
            label="所属岗位"
            header-align="center"
            align="center"
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
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="issueDate"
            label="发证日期"
            header-align="center"
            align="center"
          >
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
            align="center"
          >
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.overdueFlag == '已过期'">{{
                scope.row.overdueFlag
              }}</el-tag>
              <el-tag type="warning" v-else-if="scope.row.overdueFlag == '即将到期'">{{ scope.row.overdueFlag }}</el-tag>
              <span v-else>{{ scope.row.overdueFlag }}</span>
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
  </div>
</template>

<script>
import {
  list_API,
  export_API,
} from "@/api/modules/process/webcertificateperson";
import ImageViewer from "@/components/ImageViewer";
export default {
  name: "personnelSearch",
  components: {
    ImageViewer,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  data() {
    return {
      queryParams: {
        page: 1,
        limit: 10,
        state: 1,
        certificateName: undefined,
        personnelName: undefined,
        position: undefined,
        issueDate: undefined,
        expiryDate: undefined,
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
      this.exportRequest(export_API, this.queryParams, "人员证书", "人员证书");
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
</style>