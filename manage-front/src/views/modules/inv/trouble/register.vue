<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="隐患描述" prop="description">
            <el-input
              v-model="queryParams.description"
              placeholder="请输入隐患描述"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="隐患来源" prop="source">
            <el-select
              v-model="queryParams.source"
              placeholder="请选择隐患来源"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in sourceOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检查人员" prop="checkUserName">
            <el-input
              v-model="queryParams.checkUserName"
              placeholder="请输入检查人员"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">隐患列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                >新增</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                >删除</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                :disabled="total <= 0"
                @click="handleExport"
                >导出到Excel</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="troubleList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="检查日期"
            align="center"
            prop="checkDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患描述"
            align="center"
            prop="description"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患来源"
            align="center"
            prop="source"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检查人员"
            align="center"
            prop="checkUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患地点"
            align="center"
            prop="place"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患部位"
            align="center"
            prop="position"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患大类"
            align="center"
            prop="mainClass"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患整改前图片"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <image-viewer
                :ref="'imageViewer' + scope.$index"
                :images="scope.row.fileList"
              ></image-viewer>
              <el-button
                v-if="scope.row.fileList && scope.row.fileList.length"
                class="number"
                size="mini"
                type="text"
                @click="showImages(scope.$index)"
                >{{ scope.row.fileList.length }}</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <register-dialog
      ref="registerDialog"
      v-model="open"
      :fromRisk="true"
      @submitSuccess="handleAddCompletion"
    ></register-dialog>
  </div>
</template>

<script>
import {
  listTrouble,
  delTrouble,
  exportTrouble
} from "@/api/modules/investigate/trouble";
import ImageViewer from "@/components/ImageViewer";
import RegisterDialog from "@/views/components/trouble/register-dialog";

export default {
  name: "DangerRegister",
  components: { ImageViewer, RegisterDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 隐患表格数据
      troubleList: null,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        examResult: 0,
        description: undefined,
        source: undefined,
        checkUserName: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 隐患来源 */
    sourceOptions() {
      return this.$store.state.common.dangerSources;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listTrouble(this.queryParams).then(response => {
        const result = response.result;
        const troubles = result.list;
        this.troubleList = troubles;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 显示隐患整改前图片 */
    showImages(index) {
      this.$refs["imageViewer" + index].show();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.setupDialog();
      this.open = true;
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.setupDialog(row.id);
      this.open = true;
    },
    setupDialog(id = undefined) {
      this.$nextTick(() => {
        this.$refs.registerDialog.setup(id);
      });
    },
    /** 隐患添加完成回调 */
    handleAddCompletion(danger) {
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const troubleIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delTrouble, troubleIds, "隐患").then(_ => {
        this.getList();
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportTrouble,
        this.queryParams,
        "隐患列表记录",
        "隐患列表"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.number {
  color: #1890ff;
}
</style>
