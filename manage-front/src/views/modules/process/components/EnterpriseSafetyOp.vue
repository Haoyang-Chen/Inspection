<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="900px"
  >
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          size="small"
        >
          <el-form-item label="设置人" prop="uploader">
            <el-input v-model="queryParams.uploader"></el-input>
          </el-form-item>
          <el-form-item label="起始日期" prop="startDate">
            <el-date-picker
              v-model="queryParams.startDate"
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
            prop="uploader"
            label="设置人"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="uploaderDate"
            label="设置时间"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="startDate"
            label="起始日期"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="结束日期"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="rundays"
            label="企业安全运行时间（天）"
            width="170"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column label="附件" header-align="center" align="center">
            <template slot-scope="scope">
              <image-viewer
                :ref="'imageViewer' + scope.$index"
                :images="scope.row.fileUploadList"
              ></image-viewer>
              <el-button
                v-if="scope.row.fileUploadList && scope.row.fileUploadList.length > 0"
                class="number"
                size="mini"
                type="text"
                @click="showImages(scope.$index)"
                >{{ scope.row.fileUploadList.length }}</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            label="备注"
            header-align="center"
            align="center"
          >
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
  </el-dialog>
</template>

<script>
import { list_API } from "@/api/modules/process/webcontratorsafeoperation";
import ImageViewer from "@/components/ImageViewer";

export default {
  name: "EnterpriseSafetyOp",
  components: { ImageViewer },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "记录查询",
    },
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.getList();
      }
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  data() {
    return {
      // 是否显示弹出层
      visible: this.value,
      queryParams: {
        page: 1,
        limit: 10,
        isFinish: 1,
        uploader: undefined,
        startDate: undefined,
      },
      tableData: [],
      total: 0,
    };
  },
  methods: {
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
    /** 显示现场照片 */
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
