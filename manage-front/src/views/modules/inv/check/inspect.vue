<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="检查表名称" prop="formName">
            <el-input
              v-model="queryParams.formName"
              placeholder="请输入检查表名称"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="计划检查日期">
            <el-date-picker
              v-model="queryParams.planCheckDateStart"
              type="date"
              placeholder="开始日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.planCheckDateEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检查要求" prop="requirement">
            <el-input
              v-model="queryParams.requirement"
              placeholder="请输入检查要求"
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
            <span class="table-title">安全检查列表</span>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="inspectList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="计划检查日期"
            align="center"
            prop="planCheckDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检查表名称"
            align="center"
            prop="formName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检查人"
            align="center"
            prop="checkUserNames"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检查要求"
            align="center"
            prop="requirement"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.temporaryState === 1"
                size="mini"
                type="text"
                icon="el-icon-edit-outline"
                @click="handleCheck(scope.row)"
                >检查</el-button
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

    <!-- 检查对话框 -->
    <checking-dialog
      ref="checkingDialog"
      v-model="open"
      @checkSuccess="getList"
    ></checking-dialog>
  </div>
</template>

<script>
import { listCheck } from "@/api/modules/investigate/check";
import CheckingDialog from "@/views/components/trouble/check/checking-dialog";

export default {
  name: "SafeInspect",
  components: { CheckingDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 安全检查表格数据
      inspectList: null,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        check: 1,
        formName: undefined,
        requirement: undefined,
        planCheckDateStart: undefined,
        planCheckDateEnd: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listCheck(this.queryParams).then(response => {
        const result = response.result;
        this.inspectList = result.list;
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
      this.clearDateRange(
        this.queryParams,
        'planCheckDateStart',
        'planCheckDateEnd'
      );
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 检查按钮操作 */
    handleCheck(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.checkingDialog.setup(row);
      });
    }
  }
};
</script>
