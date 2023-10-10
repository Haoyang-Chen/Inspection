<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="作业票种类" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择作业票种类"
              clearable
              size="small"
              style="width: 165px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="当前状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择当前状态"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
            <span class="table-title">作业票申请列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd(true)"
                >新增</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="workList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="作业票编号"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.id !== scope.row.parentId" class="work-sub">
                从票
              </span>
              <span>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="作业票种类"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ typeName(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column
            label="作业级别"
            align="center"
            prop="levelName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="作业区域"
            align="center"
            prop="workArea"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="作业内容"
            align="center"
            prop="workContent"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="申请作业开始时间"
            align="center"
            prop="startTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.startTime, "{y}-{m}-{d} {h}:{i}") }}
            </template>
          </el-table-column>
          <el-table-column
            label="申请人"
            align="center"
            prop="createUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="当前状态"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ statusName(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="250"
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
                v-if="scope.row.id === scope.row.parentId"
                size="mini"
                type="text"
                icon="el-icon-document-add"
                @click="handleAdd(false, scope.row)"
                >添加从票</el-button
              >
              <el-button
                v-if="scope.row.id === scope.row.parentId"
                size="mini"
                type="text"
                icon="el-icon-s-promotion"
                @click="handleSAC(scope.row.id, 5)"
                >提交</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleSAC(scope.row.id, 6)"
                >取消</el-button
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
    <basis-dialog
      ref="basisDialog"
      v-model="open"
      :type="workType"
      @submitSuccess="getList"
    ></basis-dialog>
  </div>
</template>

<script>
import { listWork, submitWork, cancelWork } from "@/api/modules/ptw/work";
import BasisDialog from "@/views/components/ptw/work/basis-dialog";

export default {
  name: "WorkStartApply",
  components: { BasisDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 作业票表格数据
      workList: null,
      // 是否显示弹出层
      open: false,
      // 弹出层类型1-作业票申请,2-从票添加,3-作业票评估审批
      workType: 1,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        apply: 1,
        type: undefined,
        status: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 当前状态 */
    statusOptions() {
      return this.$store.state.common.workStatus.filter(
        item => item.value === 1 || item.value === 2
      );
    },
    /** 作业票种类 */
    typeOptions() {
      return this.$store.state.common.workTypes;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listWork(this.queryParams).then(response => {
        const result = response.result;
        this.workList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据作业票种类value获取label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
    },
    // 根据当前状态value获取label
    statusName(val) {
      return this.statusOptions.find(item => item.value === val).label;
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
    /** 新增按钮操作 */
    handleAdd(isParent, row) {
      this.open = true;
      if (isParent) {
        this.workType = 1;
        this.setupDialog();
      } else {
        this.workType = 2;
        this.setupDialog(undefined, row.id);
      }
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.open = true;
      this.workType = row.id === row.parentId ? 1 : 2;
      this.setupDialog(row.id);
    },
    setupDialog(workId = undefined, parentId = undefined) {
      this.$nextTick(() => {
        this.$refs.basisDialog.setup(workId, parentId);
      });
    },
    /** 提交、取消按钮操作 */
    handleSAC(id, op) {
      const opFunc = op === 5 ? submitWork : cancelWork;
      const tips =
        op === 5
          ? "作业票(从票同步提交，不可撤回)"
          : "作业票(从票同步取消，不可恢复)";
      this.rowsOpRequest(opFunc, id, tips, op).then(_ => {
        this.getList();
      });
    }
  }
};
</script>

<style lang="scss">
.work-sub {
  color: #ff5918;
}
</style>
