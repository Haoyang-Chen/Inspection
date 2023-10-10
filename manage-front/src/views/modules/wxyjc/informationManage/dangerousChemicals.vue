<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="危化品名称" prop="dangerName">
        <el-input v-model="queryParams.dangerName"></el-input>
      </el-form-item>
      <el-form-item label="危化品类别" prop="chemicalsCategory">
        <el-select
          v-model="queryParams.chemicalsCategory"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in dangerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重点监管" prop="isSupervision">
        <el-select
          v-model="queryParams.isSupervision"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in trueFalseList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
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
    <div class="header-title-buttons flex justify-between items-center">
      <div class="title"><i class="el-icon-s-operation"></i> 危化品列表</div>
      <div class="buttons">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd()"
          >新增</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete()"
          >批量删除</el-button
        >
        <el-button icon="el-icon-upload" size="mini" @click="handleImort()"
          >批量导入</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      :max-height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" label="序号" align="center" width="50" />

      <el-table-column
        label="类别"
        align="center"
        prop="category"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="危化品名称"
        align="center"
        prop="dangerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="CAS号"
        align="center"
        prop="casNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="储存方式"
        align="center"
        prop="storageMethod"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="年用量/年产量"
        align="center"
        prop="outputVolume"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="最大储量"
        align="center"
        prop="reservesVolume"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="危化品类别"
        align="center"
        prop="chemicalsCategoryName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="重点监管"
        align="center"
        prop="isSupervision"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isSupervision == 1">是</span>
          <span v-if="scope.row.isSupervision == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="易制毒"
        align="center"
        prop="isEasytoxic"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isEasytoxic == 1">是</span>
          <span v-if="scope.row.isEasytoxic == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button type="text" @click="handleDelete(scope.row.id)"
            >删除</el-button
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

    <Whpxx ref="Whpxx" v-model="dialogVisible" @closeView="handleQuery()" />
    <!-- 导入对话框 -->
    <UploadDialog
      v-model="uploading"
      :actionUri="UploadDialogActionUri"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    />
  </div>
</template>

<script>
import { getString } from "@/utils/wxyjc/utils/index";
import {
  list_API,
  delete_API,
  template_API,
} from "@/api/modules/wxyjc/wxyjcdangerousinfo";
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
import { mapGetters } from "vuex";
import Whpxx from "@/views/components/wxyjc/whpxx/whpxx";
import UploadDialog from "@/components/UploadDialog";

export default {
  components: {
    Whpxx,
    UploadDialog,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    ...mapGetters(["trueFalseList"]),
  },
  data() {
    return {
      multiple: true,
      ids: [],
      dialogVisible: false,
      uploading: false,
      dangerList: [],
      UploadDialogActionUri: "/wxyjcdangerousinfo/import",
      templateFunc: () => {
        this.templateRequest(template_API, {}, "危化品信息导入模板");
      },
      queryParams: {
        page: 1,
        limit: 10,
        dangerName: undefined, //危化品名称
        chemicalsCategory: undefined, //危化品类别
        isSupervision: undefined, //重点监管
      },
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
    wxyjcdictindex_API("wxhxpfl").then((res) => {
      this.dangerList = res.result;
    });
  },
  methods: {
    //搜索
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    //重置
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //新增
    handleAdd() {
      this.dialogVisible = true;
    },
    handleEdit(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Whpxx"].editTemp(id);
      });
    },
    //删除
    handleDelete(id) {
      const itemIds = id != undefined ? [id] : this.ids;
      this.rowsOpRequest(delete_API, itemIds, "危化品信息").then((_) => {
        this.getList();
      });
    },
    //批量导入
    handleImort() {
      this.uploading = true;
    },
    //获取数据
    getList() {
      let params = { ...this.queryParams };
      if (params.dangerName) {
        params.dangerName = getString(params.dangerName);
      }
      list_API(params).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    // 文件上传完成处理
    handleUploadCompletion() {
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>