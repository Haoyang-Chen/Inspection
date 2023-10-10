<template>
  <el-dialog
    title="隐患库"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="61.8%"
    append-to-body
  >
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
              style="width: 240px"
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
            <span class="table-title">隐患库列表</span>
          </el-col>
        </el-row>

        <el-table
          ref="libraryTable"
          class="libraryTable"
          v-loading="loading"
          :data="libraryList"
          :max-height="tableHeight"
          highlight-current-row
          @row-click="handleRowClick"
          @row-dblclick="handleRowDoubleClick"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="隐患描述"
            align="center"
            prop="description"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患等级"
            align="center"
            prop="level"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ levelName(scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column
            label="参考依据"
            align="center"
            prop="reference"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="整改措施"
            align="center"
            prop="rectification"
            :show-overflow-tooltip="true"
          />
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listTrouble } from "@/api/modules/trouble";

export default {
  name: "TroubleLibrary",
  components: {},
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否显示列表弹出层
      visible: this.value,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 隐患库表格数据
      libraryList: null,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        description: undefined
      },
      // 当前选中行
      currentRow: undefined
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 隐患等级 */
    levelOptions() {
      return this.$store.state.common.dangerLevels;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
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
        this.libraryList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据隐患等级value获取label
    levelName(val) {
      const level = this.levelOptions.find(item => item.value === val);
      return level ? level.label : "";
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
    /** 单行单击操作 */
    handleRowClick(row) {
      this.currentRow = row;
      this.$refs.libraryTable.setCurrentRow(row);
    },
    /** 单行双击操作 */
    handleRowDoubleClick(row) {
      this.currentRow = row;
      this.$refs.libraryTable.setCurrentRow(row);
      this.handleSubmit();
    },
    /** 提交按钮操作 */
    handleSubmit() {
      this.$emit("didSelectRow", this.currentRow);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss">
.libraryTable {
  .el-table__body tr.current-row > td {
    background: #67b2f9;
    color: white;
  }
}
</style>
