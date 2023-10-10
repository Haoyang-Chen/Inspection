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
              @change="queryParams.level = undefined"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="levelOptions.length"
            label="作业级别"
            prop="level"
          >
            <el-select
              v-model="queryParams.level"
              placeholder="请选择作业级别"
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
          <el-form-item label="作业区域" prop="workArea">
            <el-select
              v-model="queryParams.workArea"
              clearable
              filterable
              placeholder="请输入搜索关键字"
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="item in areaOptions"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请作业时间">
            <el-date-picker
              v-model="queryParams.createTimeStart"
              type="date"
              placeholder="开始日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
            -
            <el-date-picker
              v-model="queryParams.createTimeEnd"
              type="date"
              placeholder="结束日期"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              size="small"
              style="width:160px;"
            ></el-date-picker>
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
            <span class="table-title">作业票查询列表</span>
            <div style="float:right;">
              <!-- <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleClose"
                >关闭</el-button
              > -->
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                :disabled="total <= 0"
                @click="handleExport(undefined)"
                >导出到Excel</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="workList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            width="45"
            align="center"
            :selectable="checkSelectable"
          /> -->
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
            label="状态"
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
            width="220"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleProcess(scope.row)"
                >进度</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                >查看</el-button
              >
              <el-button
                v-if="scope.row.status !== 90 && scope.row.status !== 100"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleClose(scope.row)"
                >关闭</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-download"
                @click="handleExport(scope.row)"
                >导出</el-button
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

    <!-- 详情对话框 -->
    <detail-dialog ref="detailDialog" v-model="open"></detail-dialog>
    <!-- 作业票进度对话框  -->
    <process-dialog ref="processDialog" v-model="processVisible"></process-dialog>
  </div>
</template>

<script>
import {
  listWork,
  rsiWork,
  exportWorks,
  exportWork
} from "@/api/modules/ptw/work";
import { listArea } from "@/api/modules/sys/area";
import DetailDialog from "@/views/components/ptw/work/detail-dialog";
import ProcessDialog from "@/views/components/ptw/work/process-dialog";
import { workLevels } from "@/views/components/ptw/work/utils";

export default {
  name: "WorkQuery",
  components: { DetailDialog, ProcessDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 作业票表格数据
      workList: null,
      // 作业区域
      areaOptions: [],
      // 申请作业时间范围
      applyRange: [],
      // 是否显示弹出层
      open: false,
      // 是否显示作业票进度弹出层
      processVisible: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        draft: 0,
        type: undefined,
        level: undefined,
        workArea: undefined,
        status: undefined,
        createTimeStart: undefined,
        createTimeEnd: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 作业票种类 */
    typeOptions() {
      return this.$store.state.common.workTypes;
    },
    /** 作业级别 */
    levelOptions() {
      return workLevels(this.queryParams.type);
    },
    /** 当前状态 */
    statusOptions() {
      return this.$store.state.common.workStatus.filter(
        item => item.value !== 1
      );
    }
  },
  created() {
    this.getAreaList();
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
    /** 查询作业区域列表 */
    getAreaList() {
      listArea({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result.list;
        if (result && result.length) {
          this.areaOptions = result.map(item => {
            return { value: item.id, label: item.name };
          });
        }
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
      this.clearDateRange(
        this.queryParams,
        'createTimeStart',
        'createTimeEnd'
      );
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    checkSelectable(row) {
      return !row.isSub;
    },
    /** 关闭按钮操作 */
    handleClose(row) {
      // const workIds = row.id != undefined ? [row.id] : this.ids;
      const ticketId = row.id;
      const result = 0;
      this.$prompt("关联作业票将全部关闭", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPlaceholder: "请输入关闭理由",
        inputValidator: value => {
          if (!value || !value.length) {
            return "关闭理由不能为空";
          }
        }
      })
        .then(({ value }) => {
          return rsiWork({ ticketId, result, reason: value });
        })
        .then(_ => {
          this.msgSuccess("关闭成功");
          this.getList();
        })
        .catch(() => {});
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.detailDialog.setup(row.id);
      });
    },
    /** 导出按钮操作 */
    handleExport(row) {
      let queryParams = {};
      let tips;
      let exportFunc;
      if (!row) {
        exportFunc = exportWorks;
        queryParams = this.queryParams;
        tips = "作业票查询";
      } else {
        exportFunc = exportWork;
        queryParams = { ticketId: row.id };
        tips = row.number + "号作业票";
      }
      this.exportRequest(exportFunc, queryParams, tips + "记录", tips);
    },
    /** 查看作业票进度操作 */
    handleProcess(row) {
      this.processVisible = true;
      this.$nextTick(() => {
        this.$refs.processDialog.setup(row.id);
      })
    }
  }
};
</script>

<style lang="scss">
.work-sub {
  color: #ff5918;
}
</style>
