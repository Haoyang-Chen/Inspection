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
          <el-form-item label="证书编号" prop="certificateNo">
            <el-input v-model="queryParams.certificateNo"></el-input>
          </el-form-item>
          <el-form-item label="证书类型" prop="certificateType">
            <el-select
              v-model="queryParams.certificateType"
              placeholder="请选择证书类型"
            >
              <el-option
                v-for="item in certificateTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否长期有效" prop="isLongRange">
            <el-select
              v-model="queryParams.isLongRange"
              placeholder="请选择证书类型"
            >
              <el-option
                v-for="item in trueFalseList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="有效期"
            prop="expiryDate"
            v-if="queryParams.isLongRange != 1"
          >
            <el-date-picker
              v-model="queryParams.expiryDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
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
          <span class="title">企业资质证书列表</span>
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
      v-if="dialogVisible"
      :islock="islock"
      :dialogTitle="dialogTitle"
      :sendData="sendData"
      :dialogVisible="dialogVisible"
      @closeView="changeDialogVisible()"
      ref="JobInformationDetail"
    ></Detail>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  list_API,
  export_API,
} from "@/api/modules/process/webcertificatedepart";
import Detail from "./components/detail";
import ImageViewer from "@/components/ImageViewer";
export default {
  name:"enterpriseCertificateHistory",
  computed: {
    ...mapGetters(["trueFalseList", "certificateTypeList"]),
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    Detail,
    ImageViewer,
  },
  data() {
    return {
      dialogVisible: false,
      islock: false,
      queryParams: {
        page: 1,
        limit: 10,
        state: 2,
        certificateName:undefined,
        certificateNo:undefined,
        certificateType:undefined,
        isLongRange:undefined,
        expiryDate:undefined
      },
      tableData: [],
      total: 0,
      sendData: {},
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
        "企业历史证书",
        "企业历史证书"
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