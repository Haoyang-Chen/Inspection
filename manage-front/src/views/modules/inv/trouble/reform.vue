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
          <el-form-item label="隐患等级" prop="level">
            <el-select
              v-model="queryParams.level"
              placeholder="请选择隐患等级"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in levelOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检查日期" prop="checkDate">
            <el-date-picker
              v-model="queryParams.checkDate"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="请选择检查日期"
              size="small"
              style="width: 165px"
            ></el-date-picker>
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
            <span class="table-title">隐患整改列表</span>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="troubleList"
          :max-height="tableHeight"
        >
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
            label="隐患部位"
            align="center"
            prop="position"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患来源"
            align="center"
            prop="source"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="整改类型"
            align="center"
            prop="reformType"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="整改期限"
            align="center"
            prop="reformDeadline"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="status"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">未整改</span>
              <span v-else-if="scope.row.status === 2">复查退回</span>
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
                icon="el-icon-view"
                @click="handleView(scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-position"
                @click="handleReform(scope.row)"
                >整改</el-button
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

    <!-- 查看对话框 -->
    <el-dialog
      title="查看详情"
      :visible.sync="open"
      width="680px"
      :close-on-click-modal="false"
      append-to-body
    >
      <register-form
        ref="registerForm"
        :fromRisk="true"
        :editable="false"
        :eliminate="true"
        :visible="open"
      ></register-form>
      <publish-form
        v-if="versionType === 1"
        ref="publishForm"
        :editable="false"
        :eliminate="true"
        :visible="open"
      ></publish-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 整改对话框 -->
    <reform-dialog
      ref="reformDialog"
      v-model="reforming"
      @submitSuccess="getList"
    ></reform-dialog>
  </div>
</template>

<script>
import { listTrouble, getSetting } from "@/api/modules/investigate/trouble";
import RegisterForm from "@/views/components/trouble/register-form";
import PublishForm from "@/views/components/trouble/publish-form";
import ReformDialog from "@/views/components/trouble/reform-dialog";

export default {
  name: "TroubleReform",
  components: { RegisterForm, PublishForm, ReformDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 隐患表格数据
      troubleList: null,
      // 是否显示查看弹出层
      open: false,
      // 是否显示整改弹出层
      reforming: false,
      // 版本类型
      versionType: 1,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        reform: 1,
        description: undefined,
        level: undefined,
        checkDate: undefined
      }
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
  created() {
    this.getTroubleSet();
    this.getList();
  },
  methods: {
    /** 查询当前隐患版本 1 正常流程 2 简易流程 */
    getTroubleSet() {
      getSetting().then(response => {
        this.versionType = response.result;
      })
    },
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listTrouble(this.queryParams, true).then(response => {
        const result = response.result;
        this.troubleList = result.list;
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
    /** 查看按钮操作 */
    handleView(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.registerForm.setup(row.id);
        if (this.versionType === 1) this.$refs.publishForm.setup(undefined, row.taskId);
      });
    },
    /** 整改按钮操作 */
    handleReform(row) {
      this.reforming = true;
      this.$nextTick(() => {
        this.$refs.reformDialog.setup(row);
      });
    }
  }
};
</script>
