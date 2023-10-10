<template>
  <div>
    <div class="header-title-buttons flex justify-between items-center">
      <div class="title">
        <i class="el-icon-s-operation"></i> 危化品类别列表
      </div>
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
        label="上限"
        align="center"
        prop="riskMax"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="下限"
        align="center"
        prop="riskMin"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="系数"
        align="center"
        prop="riskFactor"
        :show-overflow-tooltip="true"
      />
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
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <WhpclEdit
      v-model="dialogVisible"
      @closeView="handleQuery()"
      ref="WhpclEdit"
    />
  </div>
</template>

<script>
import {
  list_API,
  delete_API,
} from "@/api/modules/wxyjc/wxyjcriskfactorreserves";
import WhpclEdit from "./whpclEdit";
export default {
  components: {
    WhpclEdit,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  data() {
    return {
      dialogVisible: false,
      multiple: true,
      ids: [],
      queryParams: {
        page: 1,
        limit: 10,
      },
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //搜索
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    handleEdit(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["WhpclEdit"].editTemp(id);
      });
    },
    handleDelete(id) {
      const itemIds = id != undefined ? [id] : this.ids;
      this.rowsOpRequest(delete_API, itemIds, "危化品储量").then((_) => {
        this.getList();
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style>
</style>