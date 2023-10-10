<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="任务名称" prop="taskName">
            <el-input
              v-model="queryParams.taskName"
              placeholder="请输入任务名称"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="任务类型" prop="taskType">
            <el-select
              v-model="queryParams.taskType"
              placeholder="请选择任务类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in taskTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="线路名称" prop="lineName">
            <el-input
              v-model="queryParams.lineName"
              placeholder="请输入线路名称"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="taskStatus">
            <el-select
              v-model="queryParams.taskStatus"
              placeholder="请选择状态"
              clearable
              size="small"
              style="width: 120px"
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
            <span class="table-title">任务发布列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-s-promotion"
                size="mini"
                @click="handleAdd"
                >发布</el-button
              >
              <el-button
                type="info"
                icon="el-icon-refresh-left"
                size="mini"
                :disabled="checkRevokeDisable"
                @click="handleDAR(undefined, 1)"
                >撤销</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="checkDeleteDisable"
                @click="handleDAR(undefined, 0)"
                >删除</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="publishList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="45"
            align="center"
            :selectable="checkSelectable"
          />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="任务名称"
            align="center"
            prop="taskName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="任务类型" align="center">
            <template slot-scope="scope">
              {{ taskTypeName(scope.row.taskType) }}
            </template>
          </el-table-column>
          <el-table-column
            label="线路名称"
            align="center"
            prop="lineName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="任务时间" align="center">
            <template slot-scope="scope">{{
              scope.row.taskStartDate + "至" + scope.row.taskEndDate
            }}</template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">{{
              statusName(scope.row.taskStatus)
            }}</template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.taskStatus === 1 || scope.row.taskStatus === 2"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-if="scope.row.taskStatus === 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDAR(scope.row.id, 0)"
                >删除</el-button
              >
              <el-button
                v-if="scope.row.taskStatus === 2"
                size="mini"
                type="text"
                icon="el-icon-refresh-left"
                @click="handleDAR(scope.row.id, 1)"
                >撤销</el-button
              >
              <el-button
                v-if="
                  (scope.row.taskStatus === 1 || scope.row.taskStatus === 2) &&
                    scope.row.taskType !== 0
                "
                size="mini"
                type="text"
                icon="el-icon-guide"
                @click="handleAdjust(scope.row)"
                >调整</el-button
              >
              <el-button
                v-if="scope.row.taskStatus === 0 || scope.row.taskStatus === 3"
                size="mini"
                type="text"
                icon="el-icon-reading"
                @click="handleEdit(scope.row)"
                >详情</el-button
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务类型:" prop="taskType">
              <el-radio-group
                :value="form.taskType"
                :disabled="Boolean(form.id)"
                @input="handleTaskTypeChange"
              >
                <el-radio
                  v-for="dict in taskTypeOptions"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务时间:" required>
              <el-col :span="11.5">
                <el-form-item prop="taskStartDate">
                  <el-date-picker
                    v-model="form.taskStartDate"
                    :picker-options="startPickerOptions"
                    :disabled="form.taskStatus !== 1"
                    type="date"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择开始时间"
                    @change="handelDateChange"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <div style="text-align:center;">-</div>
              </el-col>
              <el-col :span="11.5">
                <el-form-item prop="taskEndDate">
                  <el-date-picker
                    v-model="form.taskEndDate"
                    :picker-options="endPickerOptions"
                    :disabled="form.taskStatus === 0 || form.taskStatus === 3"
                    type="date"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择结束时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线路类型:" prop="lineType">
              <el-select
                v-model="form.lineType"
                :disabled="Boolean(form.id)"
                placeholder="请选择线路类型"
                style="width:280px"
                @change="handleLineTypeChange"
              >
                <el-option
                  v-for="dict in lineTypeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线路名称:" prop="lineName">
              <el-select
                v-model="form.lineName"
                :disabled="Boolean(form.id)"
                filterable
                placeholder="请输入搜索关键字"
                style="width: 280px"
                @input="handleLineNameSelect"
              >
                <el-option
                  v-for="item in lineOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称:" prop="taskName">
              <el-input
                v-model="form.taskName"
                placeholder="请输入任务名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.taskType === 1"
              :rules="[
                { required: true, message: '巡检频率不能为空', trigger: 'blur' }
              ]"
              label="巡检频率:"
              prop="inspectRate"
            >
              <el-input-number
                v-model="form.inspectRate"
                :min="1"
                :precision="0"
                controls-position="right"
                placeholder="请输入频率"
                style="width:140px"
              />
              <span>时/次</span>
            </el-form-item>
            <el-form-item
              v-if="form.taskType === 0 || form.taskType === 2"
              :rules="[
                { required: true, message: '巡检次数不能为空', trigger: 'blur' }
              ]"
              label="巡检次数:"
              prop="inspectRate"
            >
              <el-input-number
                v-model="form.inspectRate"
                :min="1"
                controls-position="right"
                placeholder="请输入次数"
                style="width:140px"
              />
              <span>{{ form.taskType === 0 ? '次' : '次/周' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="巡检班组:" prop="insTeamInfoList">
              <team-group
                v-model="form.insTeamInfoList"
                :status="form.taskStatus"
                :type="form.taskType"
              ></team-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.taskType === 1" :span="24">
            <el-form-item label="巡检班次:" prop="insClassInfoList">
              <team-rate
                v-model="form.insClassInfoList"
                :status="form.taskStatus"
              ></team-rate>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <adjust-dialog
      ref="adjustDialog"
      v-model="showAdjust"
      :taskId="form.id"
      :taskStatus="form.taskStatus"
      :taskStartDate="form.taskStartDate"
      :taskEndDate="form.taskEndDate"
    ></adjust-dialog>
  </div>
</template>

<script>
import {
  listTask,
  getTask,
  addTask,
  updateTask,
  delTask,
  revokeTask,
  baseGroupLine,
  baseRateLine,
  defaultRate
} from "@/api/modules/inspect/task";
import { listLine } from "@/api/modules/inspect/line";
import TeamGroup from "@/views/components/inspect/team-group";
import TeamRate from "@/views/components/inspect/team-rate";
import AdjustDialog from "@/views/components/inspect/adjust-dialog";

export default {
  name: "TaskPublish",
  components: { TeamGroup, TeamRate, AdjustDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      selections: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 任务表格数据
      publishList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示调整
      showAdjust: false,
      // 线路名称
      lineOptions: null,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        taskName: undefined,
        taskType: undefined,
        lineName: undefined,
        taskStatus: undefined
      },
      // 开始时间不可选日期
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000;
        }
      },
      // 表单校验
      rules: {
        taskType: [
          { required: true, message: "任务类型不能为空", trigger: "blur" }
        ],
        taskStartDate: [
          { required: true, message: "任务开始时间不能为空", trigger: "change" }
        ],
        taskEndDate: [
          { required: true, message: "任务结束时间不能为空", trigger: "change" }
        ],
        lineType: [
          { required: true, message: "线路类型不能为空", trigger: "change" }
        ],
        lineName: [
          { required: true, message: "线路名称不能为空", trigger: "blur" }
        ],
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        insTeamInfoList: [
          { required: true, message: "巡检班组不能为空", trigger: "change" }
        ],
        insClassInfoList: [
          { required: true, message: "巡检班次不能为空", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 任务类型 */
    taskTypeOptions() {
      return this.$store.state.common.taskTypes;
    },
    /** 线路类型 */
    lineTypeOptions() {
      return this.$store.state.common.lineTypes;
    },
    /** 任务状态 */
    statusOptions() {
      return this.$store.state.common.taskStatus;
    },
    // 检测顶部撤销按钮是否可用
    checkRevokeDisable() {
      if (this.selections.filter(item => item.taskStatus !== 2).length > 0) {
        return true;
      } else {
        return this.multiple;
      }
    },
    // 检测顶部删除按钮是否可用
    checkDeleteDisable() {
      if (this.selections.filter(item => item.taskStatus !== 1).length > 0) {
        return true;
      } else {
        return this.multiple;
      }
    },
    // 选中任务id数组
    ids() {
      return this.selections.map(item => item.id);
    },
    /** 结束时间不可选日期 */
    endPickerOptions() {
      let that = this;
      return {
        disabledDate(time) {
          if (that.form.taskStartDate) {
            return (
              time.getTime() <
              Date.parse(that.form.taskStartDate) - 24 * 3600 * 1000
            );
          } else {
            return time.getTime() < Date.now() - 24 * 3600 * 1000;
          }
        }
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listTask(this.queryParams).then(response => {
        const result = response.result;
        const list = [];
        result.list.forEach(item => {
          list.push({
            ...item,
            taskStatus: item.delFlag === 1 ? 0 : item.taskStatus
          });
        });
        this.publishList = list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取任务类型label
    taskTypeName(val) {
      return this.taskTypeOptions.find(item => item.value === val).label;
    },
    // 根据版本value获取任务类型label
    statusName(val) {
      return this.statusOptions.find(item => item.value === val).label;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        taskType: 1,
        taskStatus: 1,
        taskStartDate: undefined,
        taskEndDate: undefined,
        lineType: undefined,
        lineName: undefined,
        taskName: undefined,
        inspectRate: undefined,
        insTeamInfoList: [{ ...baseGroupLine }],
        insClassInfoList: JSON.parse(JSON.stringify(defaultRate))
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selections = selection.map(item => {
        return { id: item.id, taskStatus: item.taskStatus };
      });
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    checkSelectable(row) {
      return row.taskStatus === 1 || row.taskStatus === 2;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = row.taskStatus !== 3 ? "修改任务" : "查看任务";
      this.form.id = row.id;
      this.form.taskStatus = row.delFlag === 1 ? 0 : row.taskStatus;
      this.getTaskDetail(row.id);
    },
    /** 调整按钮操作 */
    handleAdjust(row) {
      this.reset();
      this.showAdjust = true;
      this.form = { ...row };
      this.$nextTick(() => {
        this.$refs.adjustDialog.setup();
      });
    },
    /** 获取任务详情 */
    getTaskDetail(taskId) {
      getTask(taskId).then(response => {
        const result = response.result;
        const group = result.insTeamInfoList || [baseGroupLine];
        const rate = result.insClassInfoList || [baseRateLine];
        this.form = {
          ...result,
          taskStatus: result.delFlag === 1 ? 0 : result.taskStatus,
          insTeamInfoList: group,
          insClassInfoList: rate
        };
      });
    },
    /** 当开始时间>结束时间时调整异常 */
    handelDateChange(date) {
      if (Date.parse(this.form.taskEndDate) < Date.parse(date)) {
        this.form.taskEndDate = date;
      }
    },
    /** 任务类型切换 */
    handleTaskTypeChange(type) {
      const message =
        type !== 1
          ? "当前所填巡检班组及巡检班次信息将被清除，是否继续？"
          : "当前所填巡检班组信息将被清除，是否继续？";
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type === 1) {
            this.form.insTeamInfoList = [{ ...baseGroupLine }];
          } else {
            this.form.insTeamInfoList = [{ ...baseGroupLine, sort: 1 }];
          }
          this.form.insClassInfoList = defaultRate;
          this.form.taskType = type;
        })
        .catch(() => {});
    },
    /** 线路类型切换 */
    handleLineTypeChange(type) {
      this.form.lineId = undefined;
      this.form.lineName = undefined;
      listLine({ limit: 100000, type }).then(response => {
        const result = response.result;
        this.lineOptions = result.list;
      });
    },
    /** 线路名称选中 */
    handleLineNameSelect(name) {
      this.form.taskName = name;
      this.form.lineId = this.lineOptions.find(item => item.name === name).id;
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.taskType === 1) {
        if (!this.validateGroup()) {
          return;
        }
        if (!this.validateRate()) {
          return;
        }
      } else {
        if (!this.validateGroup()) {
          return;
        }
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addTask, updateTask, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 验证巡检班组 */
    validateGroup() {
      let status = true;
      for (let i = 0; i < this.form.insTeamInfoList.length; i++) {
        const item = this.form.insTeamInfoList[i];
        if (
          !item.teamId ||
          !item.users ||
          item.users.length <= 0
        ) {
          this.$message.error("请确保巡检班组填写完整");
          status = false;
          return;
        }
      }
      return status;
    },
    /** 验证巡检班次 */
    validateRate() {
      let status = true;
      for (let i = 0; i < this.form.insClassInfoList.length; i++) {
        const item = this.form.insClassInfoList[i];
        if (!item.className || !item.startTime) {
          this.$message.error("请确保巡检班次填写完整");
          status = false;
          return;
        }
      }
      return status;
    },
    /** 撤销、删除按钮操作 */
    handleDAR(id, op) {
      const taskIds = id ? [id] : this.ids;
      const DARFunc = op === 1 ? revokeTask : delTask;
      this.rowsOpRequest(DARFunc, taskIds, "任务", op).then(_ => {
        this.getList();
      });
    }
  }
};
</script>
