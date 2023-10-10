<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
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
          <el-form-item label="申请人" prop="createUserName">
            <el-input
              v-model="queryParams.createUserName"
              placeholder="请输入申请人"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="问题归类" prop="problem">
            <el-select
              v-model="queryParams.problem"
              placeholder="请选择问题归类"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in problemOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
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
            <span class="table-title">审核问题列表</span>
            <div style="float:right;">
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

        <el-table v-loading="loading" :data="workList" max-height="80%">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="申请人"
            align="center"
            prop="createUserName"
            :show-overflow-tooltip="true"
          />
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
            label="签发时间"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.ycqfTime, "{y}-{m}-{d} {h}:{i}") }}
            </template>
          </el-table-column>
          <el-table-column
            label="发现问题"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-for="(problem, index) in scope.row.problems" :key="index">
                {{ problem }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="问题相关方"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-for="(dept, index) in scope.row.depts" :key="index">
                {{ dept }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="审核人"
            align="center"
            prop="examineUser"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="审核时间"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.examineTime, "{y}-{m}-{d} {h}:{i}") }}
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
  </el-dialog>
</template>

<script>
import { listProblem, exportProblem } from "@/api/modules/ptw/work";

export default {
  name: "ProblemDialog",
  components: {},
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "80%"
    }
  },
  data() {
    return {
      // 标题
      title: "作业票审核问题统计",
      // 是否显示弹出层-内部
      visible: this.value,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 作业票表格数据
      workList: null,
      // 申请人
      userOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        type: undefined,
        createUserName: undefined,
        problem: undefined
      }
    };
  },
  computed: {
    /** 作业票种类 */
    typeOptions() {
      return this.$store.state.common.workTypes;
    },
    /** 问题归类 */
    problemOptions() {
      return this.$store.state.common.workProblems;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
      if (!val) this.resetForm("queryForm");
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup() {
      this.getList();
    },
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listProblem(this.queryParams).then(response => {
        const result = response.result;
        const works = result.list || [];
        works.forEach(item => {
          const problems =
            item.problem && item.problem.length ? item.problem.split(",") : [];
          const depts =
            item.dept && item.dept.length ? item.dept.split(",") : [];
          item.problems = problems;
          item.depts = depts;
        });
        this.workList = works;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据作业票种类value获取label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
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
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportProblem,
        this.queryParams,
        "审核问题统计记录",
        "审核问题统计"
      );
    }
  }
};
</script>
