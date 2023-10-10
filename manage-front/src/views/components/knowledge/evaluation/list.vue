<template>
  <el-dialog
    title="符合性评价列表"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-row :gutter="24" class="mb8">
      <el-col class="table-title-panel">
        <span class="table-title">符合性评价列表</span>
        <div style="float:right;">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="ids.length <= 0"
            @click="handleDelete"
          >批量删除</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="评价时间" align="center" prop="createTime" :show-overflow-tooltip="true" />
      <el-table-column label="评价人" align="center" prop="createBy" :show-overflow-tooltip="true" />
      <el-table-column label="是否存在不符合性" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.isConformity === 0 ? "是" : scope.row.isConformity === 1 ? '否': '' }}
        </template>
      </el-table-column>
      <el-table-column label="原因分析" align="center" prop="reason" :show-overflow-tooltip="true" />
      <el-table-column label="计划整改时间" align="center" prop="rectifyTime" :show-overflow-tooltip="true" />
      <el-table-column label="整改措施" align="center" prop="rectifyMeasure" :show-overflow-tooltip="true" />
      <el-table-column
        label="操作"
        align="center"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row, true)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-view"
          @click="handleEdit(scope.row, false)"
        >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <!-- 符合性评价 -->
    <evaluation-dialog ref="evaluationDialog" v-model="open" :editable="editable" :type="type" @submitSuccess="getList"></evaluation-dialog>
  </el-dialog>
</template>

<script>
import Uploader from "@/components/Uploader";
import { listComment, delComment } from "@/api/modules/knowledge/evaluation";
import EvaluationDialog from "@/views/components/knowledge/evaluation/evaluationDialog";

export default {
  name: "EvaluationList",
  components: { Uploader, EvaluationDialog },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "800px"
    },
    // 0法律法规，1标准规范，2安全文件
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 遮罩层
      loading: false,
      // 是否显示弹出层
      open: false,
      // 是否可编辑
      editable: false,
      // 表格数据
      tableData: [],
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 查询条件
      queryParams: {
        page: 1,
        limit: 10
      }
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
    type: {
      handler(val) {
        this.queryParams.type = val;
      },
      immediate: true,
    }
  },
  created() {},
  methods: {
    /** 重置 */
    setup(id) {
      this.queryParams.relationId = id;
      this.getList();
    },
    /** 查询评价列表 */
    getList() {
      this.loading = true;
      listComment(this.queryParams).then(response => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
    },
    /** 编辑按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.editable = editable;
      this.$nextTick(() => {
        this.$refs.evaluationDialog.setup({...row});
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const idList = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delComment, idList, "是否符合性评价").then(_ => {
        this.getList();
      });
    },
  }
};
</script>
