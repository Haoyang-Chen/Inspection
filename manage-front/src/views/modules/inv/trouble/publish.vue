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
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="troubleList"
          :max-height="tableHeight"
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
                @click="handlePublish(scope.row)"
                >发布</el-button
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
    <register-dialog
      ref="registerDialog"
      v-model="open"
      :fromRisk="true"
      :editable="false"
    ></register-dialog>

    <!-- 发布对话框 -->
    <publish-dialog
      ref="publishDialog"
      v-model="publishing"
      @submitSuccess="getList"
    ></publish-dialog>
  </div>
</template>

<script>
import { listTrouble } from "@/api/modules/investigate/trouble";
import RegisterDialog from "@/views/components/trouble/register-dialog";
import PublishDialog from "@/views/components/trouble/publish-dialog";

export default {
  name: "TaskPublish",
  components: { RegisterDialog, PublishDialog },
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
      // 是否显示发布弹出层
      publishing: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        examResult: 1,
        description: undefined,
        source: undefined
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
        this.$refs.registerDialog.setup(row.id);
      });
    },
    /** 发布按钮操作 */
    handlePublish(row) {
      this.publishing = true;
      this.$nextTick(() => {
        this.$refs.publishDialog.setup(row);
      });
    }
  }
};
</script>
