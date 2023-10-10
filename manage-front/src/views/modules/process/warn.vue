<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="检测类别" prop="checkCategory">
            <el-select
              v-model="queryParams.checkCategory"
              placeholder="请选择检测类别"
              filterable
              clearable
              size="small"
              style="width: 215px"
              @change="queryParams.checkItems = undefined"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检测项目" prop="checkItems">
            <el-select
              v-model="queryParams.checkItems"
              placeholder="请选择检测项目"
              filterable
              clearable
              size="small"
              style="width: 215px"
            >
              <el-option
                v-for="dict in itemOptions(queryParams.checkCategory)"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称"
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="最近检测时间" prop="checkTime">
            <el-date-picker
              v-model="queryParams.checkTime"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="请选择最近检测时间"
              size="small"
              style="width: 180px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="有效时间" prop="effectiveTime">
            <el-date-picker
              v-model="queryParams.effectiveTime"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="请选择有效时间"
              size="small"
              style="width: 160px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="预警状态" prop="checkWarn">
            <el-select
              v-model="queryParams.checkWarn"
              placeholder="请选择预警状态"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option label="红色预警" value="R" />
              <el-option label="黄色预警" value="Y" />
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
          <el-col style="text-align:center">
            <div class="table-title" style="float:left;display:inline-block">
              检测预警列表
            </div>
            <!-- <div class="table-title" style="display:inline-block">
              <span>
                <span class="warn-status warn-red">红色预警</span>
                <span style="margin-left:10px">一月内检测</span>
              </span>
              <span style="margin-left:40px">
                <span class="warn-status warn-yellow">黄色预警</span>
                <span style="margin-left:10px">一季度内检测</span>
              </span>
            </div> -->
            <div style="float:right;display:inline-block">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                >新增</el-button
              >
              <el-button
                type="success"
                icon="el-icon-s-finance"
                size="small"
                @click="handleExport"
                >批量导出</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                >删除</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="warnList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="设备名称"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检测类别"
            align="center"
            prop="checkCategory"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检测项目"
            align="center"
            prop="checkItems"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检测周期"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{
                scope.row.fixLongTerm ? "长期" : scope.row.checkPeriod + "年/次"
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="最近检测时间"
            align="center"
            prop="checkTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="有效时间"
            align="center"
            prop="effectiveTime"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="书面报告"
            align="center"
            prop="fileUrlList"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.fileUrlList && scope.row.fileUrlList.length"
                size="mini"
                type="text"
                @click="showFiles(scope.row.fileUrlList)"
                >{{ scope.row.fileUrlList.length }}</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="检测责任人"
            align="center"
            prop="checkUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="预警状态" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.checkWarn === 'R'"
                class="warn-status warn-red"
                >红色预警</span
              >
              <span
                v-else-if="scope.row.checkWarn === 'Y'"
                class="warn-status warn-yellow"
                >黄色预警</span
              >
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
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
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
      width="640px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="125px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="检测类别" prop="checkCategory">
              <el-select
                v-model="form.checkCategory"
                clearable
                placeholder="请选择检测类别"
                @change="form.checkItems = undefined"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检测项目:" prop="checkItems">
              <el-select
                v-model="form.checkItems"
                clearable
                placeholder="请选择检测项目"
              >
                <el-option
                  v-for="item in itemOptions(form.checkCategory)"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="设备名称:" prop="deviceName">
              <el-input
                v-model="form.deviceName"
                placeholder="请输入设备名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检测周期:" prop="fixLongTerm">
              <el-radio-group
                v-model="form.fixLongTerm"
                @change="handlePeriodTypeChange"
              >
                <el-radio :label="0">定期</el-radio>
                <el-radio :label="1">长期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.fixLongTerm === 0" :span="24">
            <el-form-item prop="checkPeriod">
              <el-input-number
                v-model="form.checkPeriod"
                :min="0.5"
                :step="0.5"
                :precision="1"
                controls-position="right"
                style="width:100px"
                @blur="handlePeriodChange"
              ></el-input-number>
              <span> 年/次</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="最近检测时间:" prop="checkTime">
              <el-date-picker
                v-model="form.checkTime"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                placeholder="请选择最近检测时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col v-if="form.fixLongTerm === 0" :span="24">
            <el-form-item label="有效时间:" prop="effectiveTime">
              <el-date-picker
                v-model="form.effectiveTime"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                placeholder="请选择有效时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="书面文件:" prop="fileUrlList">
              <uploader
                ref="uploader"
                listType="text"
                accept=""
                @uploadCompletion="handleUploadCompletion"
              ></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="责任部门:" prop="checkDeptId">
              <treeselect
                v-model="form.checkDeptId"
                :options="deptOptions"
                :normalizer="deptNormalizer"
                :show-count="true"
                :disable-branch-nodes="false"
                :clearable="false"
                :searchable="true"
                noResultsText="未找到结果..."
                placeholder="请选择责任部门"
                clearAllText="清除"
                style="width:195px"
                @select="handleDeptSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检测责任人:" prop="checkUserId">
              <el-select
                v-model="form.checkUserId"
                placeholder="请选择检测责任人"
                filterable
                clearable
              >
                <el-option
                  v-for="dict in userOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="黄色预警标准:" prop="yellowTimeWarn">
              <el-select
                v-model="form.yellowTimeWarn"
                placeholder="请选择黄色预警标准"
                clearable
                @change="handleYellowChange"
              >
                <el-option
                  v-for="dict in yellowStdOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="红色预警标准:" prop="redTimeWarn">
              <el-select
                v-model="form.redTimeWarn"
                placeholder="请选择红色预警标准"
                clearable
                :disabled="!form.yellowTimeWarn"
                @change="handleRedChange"
              >
                <el-option
                  v-for="dict in redStdOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 文件上传对话框 -->
    <uploader-dialog
      ref="uploaderDialog"
      v-model="uploading"
      :editable="false"
      accept=""
    ></uploader-dialog>
  </div>
</template>

<script>
import { listWarn, addWarn, updateWarn, delWarn, exportWarn } from "@/api/modules/process/warn";
import { deptTree } from "@/api/modules";
import { listDeptUser } from "@/api/modules/sys/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Uploader from "@/components/Uploader";
import UploaderDialog from "@/components/Uploader/uploader-dialog";
import { warnItems } from "./utils";

export default {
  name: "DetectionWarning",
  components: { Treeselect, Uploader, UploaderDialog },
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
      // 线路表格数据
      warnList: null,
      // 是否显示上传文件弹出层
      uploading: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门数据字典
      deptOptions: [],
      // 人员数据
      userOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        checkCategory: undefined,
        checkItems: undefined,
        deviceName: undefined,
        checkTime: undefined,
        effectiveTime: undefined,
        checkWarn: undefined
      },
      // 表单校验
      rules: {
        checkCategory: [
          { required: true, message: "检测类别不能为空", trigger: "blur" }
        ],
        checkItems: [
          { required: true, message: "检测项目不能为空", trigger: "blur" }
        ],
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        fixLongTerm: [
          { required: true, message: "检测周期不能为空", trigger: "blur" }
        ],
        checkPeriod: [
          { required: true, message: "检测周期不能为空", trigger: "blur" }
        ],
        checkTime: [
          { required: true, message: "最近检测时间不能为空", trigger: "change" }
        ],
        effectiveTime: [
          { required: true, message: "有效时间不能为空", trigger: "change" }
        ],
        fileUrlList: [
          { required: true, message: "书面文件不能为空", trigger: "blur" }
        ],
        checkDeptId: [
          { required: true, message: "责任部门不能为空", trigger: "blur" }
        ],
        checkUserId: [
          { required: true, message: "检测责任人不能为空", trigger: "blur" }
        ],
        yellowTimeWarn: [
          { required: true, message: "黄色预警标准不能为空", trigger: "blur" }
        ],
        redTimeWarn: [
          { required: true, message: "红色预警标准不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 检测类别 */
    typeOptions() {
      return this.$store.state.common.checkTypes;
    },
    /** 检测项目 */
    itemOptions() {
      return function(type) {
        return warnItems(type);
      };
    },
    /** 黄色预警标准 */
    yellowStdOptions() {
      return this.$store.state.common.stdWarnTimes.filter(item => {
        if (!this.form.redTimeWarn) return item.value !== 30;
        else return item.value > this.form.redTimeWarn;
      });
    },
    /** 红色预警标准 */
    redStdOptions() {
      return this.$store.state.common.stdWarnTimes.filter(
        item => item.value < this.form.yellowTimeWarn
      );
    }
  },
  watch: {
    open(val) {
      if (!val) this.setupUploader();
    }
  },
  created() {
    this.getList();
    this.getDeptTree();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listWarn(this.queryParams).then(response => {
        const result = response.result;
        this.warnList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 查询部门树 */
    getDeptTree() {
      deptTree().then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 查询检查人列表 */
    getUserList(deptId) {
      if (!deptId) {
        this.userOptions = [];
        return;
      }
      listDeptUser(deptId, 1)
        .then(response => {
          const result = response.result;
          let users = result.list || [];
          users = users.map(item => {
            return { value: item.userId, label: item.name };
          });
          this.userOptions = users;
        })
        .catch(_ => {
          this.userOptions = [];
        });
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
        checkCategory: undefined,
        checkItems: undefined,
        deviceName: undefined,
        fixLongTerm: 0,
        checkPeriod: undefined,
        checkTime: undefined,
        effectiveTime: undefined,
        fileUrlList: undefined,
        checkDeptId: undefined,
        checkUserId: undefined,
        yellowTimeWarn: 90,
        redTimeWarn: 30
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 文件上传按钮操作 */
    showFiles(fileList) {
      this.uploading = true;
      this.$nextTick(() => {
        this.$refs.uploaderDialog.setup(fileList);
      });
    },
    /** 黄色预警标准值变化 */
    handleYellowChange(value) {
      if (value < this.form.redTimeWarn) this.form.redTimeWarn = undefined;
    },
    /** 红色预警标准值变化 */
    handleRedChange(value) {
      if (value > this.form.yellowTimeWarn)
        this.form.yellowTimeWarn = undefined;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加检测预警";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.getUserList(row.checkDeptId);
      this.reset();
      this.open = true;
      this.title = "修改检测预警";
      this.form = { ...row };
      if (row.fileUrlList && row.fileUrlList.length)
        this.setupUploader(row.fileUrlList);
    },
    /** 检测周期变动 */
    handlePeriodTypeChange(value) {
      if (value !== 0) {
        this.form.checkPeriod = undefined;
        this.form.effectiveTime = undefined;
      }
    },
    handlePeriodChange(ev) {
      const values = ev.target.value.split(".");
      const decimal = Number(values[1].slice(0, 1));
      if (decimal > 0 && decimal < 5) {
        this.form.checkPeriod = Number(values[0] + "." + 5);
      } else if (decimal > 5 && decimal < 10) {
        this.form.checkPeriod = parseInt(value) + 1;
      }
    },
    /** 责任部门变动 */
    handleDeptSelect(node, instanceId) {
      if (this.form.checkDeptId !== node.deptId) {
        this.form.checkUserId = undefined;
        this.getUserList(node.deptId);
      }
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.fileUrlList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addWarn, updateWarn, this.form).then(_ => {
            this.open = false;
            this.getList();
            this.$store.dispatch("GetUnreadMessage");
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const warnIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delWarn, warnIds, "检测预警").then(_ => {
        this.getList();
        this.$store.dispatch("GetUnreadMessage");
      });
    },
    /** 批量导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportWarn,
        this.queryParams,
        "检测预警列表",
        "检测预警列表"
      );
    },
  }
};
</script>
