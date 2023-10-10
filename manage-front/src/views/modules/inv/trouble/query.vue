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
          <el-form-item label="检查日期">
            <el-date-picker
              v-model="queryParams.checkDateStart"
              type="date"
              placeholder="开始日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width: 160px"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.checkDateEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width: 160px"
            ></el-date-picker>
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
          <el-form-item label="隐患状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择隐患状态"
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
            <span class="table-title">隐患列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                :disabled="total <= 0"
                @click="handleExport"
                >隐患台账</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="queryList"
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
            label="检查人"
            align="center"
            prop="checkUserName"
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
            label="整改人"
            align="center"
            prop="reformUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="整改前图片"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <image-viewer
                :ref="'beforeViewer' + scope.$index"
                :images="scope.row.fileList"
              ></image-viewer>
              <el-button
                v-if="scope.row.fileList && scope.row.fileList.length"
                class="number"
                size="mini"
                type="text"
                @click="showImages('beforeViewer' + scope.$index)"
                >{{ scope.row.fileList.length }}</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="整改后图片"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <image-viewer
                :ref="'afterViewer' + scope.$index"
                :images="scope.row.reformPhotoList"
              ></image-viewer>
              <el-button
                v-if="
                  scope.row.reformPhotoList && scope.row.reformPhotoList.length
                "
                class="number"
                size="mini"
                type="text"
                @click="showImages('afterViewer' + scope.$index)"
                >{{ scope.row.reformPhotoList.length }}</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="隐患状态"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ statusName(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="100"
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
      <el-collapse :value="['register', 'publish', 'review', 'track']">
        <el-collapse-item title="隐患登记" name="register">
          <register-form
            ref="registerForm"
            :fromRisk="true"
            :editable="false"
            :eliminate="rowStatus === -1 ? false : true"
            :visible="open"
          ></register-form>
        </el-collapse-item>
        <el-collapse-item v-if="rowStatus >= 0 && versionType === 1" title="任务发布" name="publish">
          <publish-form
            ref="publishForm"
            :editable="false"
            :eliminate="true"
            :visible="open"
          ></publish-form>
        </el-collapse-item>
        <el-collapse-item
          v-if="rowStatus > 0"
          title="隐患整改复查"
          name="review"
        >
          <review-form
            ref="reviewForm"
            :editable="false"
            :eliminate="true"
            :visible="open"
          ></review-form>
        </el-collapse-item>
        <el-collapse-item
          v-if="rowStatus > 0 && versionType === 1"
          title="重大隐患跟进"
          name="track"
        >
          <track-form
            ref="trackForm"
            :editable="false"
            :eliminate="true"
            :visible="open"
          ></track-form>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listQuery, exportAccount, getSetting } from "@/api/modules/investigate/trouble";
import ImageViewer from "@/components/ImageViewer";
import RegisterForm from "@/views/components/trouble/register-form";
import PublishForm from "@/views/components/trouble/publish-form";
import ReviewForm from "@/views/components/trouble/review-form";
import TrackForm from "@/views/components/trouble/track-form";

export default {
  name: "TroubleQuery",
  components: { ImageViewer, RegisterForm, PublishForm, ReviewForm, TrackForm },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 隐患表格数据
      queryList: null,
      // 是否显示弹出层
      open: false,
      // 隐患状态
      statusOptions: [
        {
          label: "已提交",
          value: -1
        },
        {
          label: "已发布",
          value: 0
        },
        {
          label: "未复查",
          value: 1
        },
        {
          label: "复查退回",
          value: 2
        },
        {
          label: "已完成",
          value: 3
        }
      ],
      // 选中行数据状态
      rowStatus: -1,
      // 版本类型
      versionType: 1,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        description: undefined,
        level: undefined,
        status: undefined,
        checkDateStart: undefined,
        checkDateEnd: undefined
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
    this.getList();
    this.getTroubleSet();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listQuery(this.queryParams).then(response => {
        const result = response.result;
        const troubles = result.list;
        this.queryList = troubles;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 查询当前隐患版本 1 正常流程 2 简易流程 */
    getTroubleSet() {
      getSetting().then(response => {
        this.versionType = response.result;
      })
    },
    // 根据隐患等级value获取label
    levelName(val) {
      const level = this.levelOptions.find(item => item.value === val);
      return level ? level.label : "";
    },
    // 根据状态value获取label
    statusName(val) {
      const value = this.formatStatus(val);
      return this.statusOptions.find(item => item.value === value).label;
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
        'checkDateStart',
        'checkDateEnd'
      );
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 显示隐患整改前、后图片 */
    showImages(ref) {
      this.$refs[ref].show();
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.rowStatus = this.formatStatus(row.status);
      this.open = true;
      this.$nextTick(() => {
        this.$refs.registerForm.setup(row.id);
        if (this.$refs.publishForm)
          this.$refs.publishForm.setup(undefined, row.taskId);
        if (this.$refs.reviewForm) this.$refs.reviewForm.setup(row);
        if (this.$refs.trackForm) this.$refs.trackForm.setup(row);
      });
    },
    // 格式化异常状态
    formatStatus(status) {
      if (status != null && status !== undefined) return status;
      return -1;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportAccount,
        this.queryParams,
        "隐患台账记录",
        "隐患台账"
      );
    }
  }
};
</script>
