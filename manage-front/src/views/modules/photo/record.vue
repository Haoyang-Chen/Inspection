<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="记录时间">
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
          <el-form-item label="问题类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择问题类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所在区域" prop="areaName">
            <el-input
              v-model="queryParams.areaName"
              placeholder="请输入所在区域"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              size="small"
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
              size="small"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">问题记录列表</span>
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

        <el-table
          v-loading="loading"
          :data="recordList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="问题描述"
            align="center"
            prop="problem"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="问题类型"
            align="center"
            prop="type"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所在区域"
            align="center"
            prop="areaName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="现场照片" align="center" width="80">
            <template slot-scope="scope">
              <image-viewer
                :ref="'imageViewer' + scope.$index"
                :images="scope.row.fileInfoModels"
              ></image-viewer>
              <el-button
                v-if="scope.row.fileInfoModels"
                class="number"
                size="mini"
                type="text"
                @click="showImages(scope.$index)"
                >{{ scope.row.fileInfoModels.length }}</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="记录时间"
            align="center"
            prop="createTime"
            width="160"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="记录人"
            align="center"
            prop="createUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="状态" align="center" width="140">
            <template slot-scope="scope">
              <!-- <span v-bind:class="{ active: !scope.row.status }">{{
                !scope.row.status ? "未处理" : "已处理"
              }}</span> -->
              <span class="active" v-if="scope.row.status == 0">未处理</span>
              <span v-if="scope.row.status == 1">已处理</span>
              <span v-if="scope.row.status == 2">已处理并生成隐患</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="120"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.status"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleOperation(scope.row)"
                >编辑</el-button
              >
              <el-button
                v-else
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleOperation(scope.row)"
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
      width="640px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述:" prop="problem">
              <el-input
                v-model="form.problem"
                :disabled="!editable"
                placeholder="请输入问题描述"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="form.status"
                :disabled="!editable"
                placeholder="请选择状态"
                style="width: 180px"
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题类型:" prop="type">
              <el-select
                v-model="form.type"
                :disabled="!editable"
                placeholder="请选择问题类型"
                style="width: 180px"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.label"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所在区域:" prop="areaId">
              <el-select
                v-model="form.areaId"
                :disabled="!editable"
                placeholder="请选择所在区域"
                style="width: 460px"
                @change="handleAreaChange"
              >
                <el-option
                  v-for="dict in areaOptions"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="具体位置:" prop="position">
              <el-input
                v-model="form.position"
                :disabled="!editable"
                placeholder="请输入具体位置"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="记录人:" prop="createUserName">
              <el-input
                v-model="form.createUserName"
                :disabled="!editable"
                placeholder="请输入记录人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="记录时间:" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                :disabled="!editable"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择记录时间"
                style="width: 180px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="图片上传:"
              prop="fileInfoModels"
              :rules="[
                {
                  required: true,
                  validator: validatePhotos,
                  trigger: 'blur'
                }
              ]"
            >
              <uploader
                ref="uploader"
                :editable="editable"
                @uploadCompletion="handleUploadCompletion"
              ></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="memo">
              <el-input
                v-model="form.memo"
                :disabled="!editable"
                type="textarea"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listProblem,
  updateProblem,
  exportProblem
} from "@/api/modules/photo/problem";
import { listArea } from "@/api/modules/sys/area";
import Uploader from "@/components/Uploader";
import ImageViewer from "@/components/ImageViewer";

export default {
  name: "RecordManagement",
  components: { Uploader, ImageViewer },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 问题记录表格数据
      recordList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单是否可编辑
      editable: true,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        type: undefined,
        areaName: undefined,
        status: undefined,
        createTimeStart: undefined,
        createTimeEnd: undefined
      },
      // 所在区域
      areaOptions: null,
      // 表单校验
      rules: {
        problem: [
          { required: true, message: "问题描述不能为空", trigger: "blur" }
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        type: [
          { required: true, message: "问题类型不能为空", trigger: "blur" }
        ],
        areaId: [
          { required: true, message: "所在区域不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 类型数据字典 */
    typeOptions() {
      return this.$store.state.common.problemTypes;
    },
    /** 状态数据字典 */
    statusOptions() {
      return this.$store.state.common.problemState;
    }
  },
  watch: {
    open(val) {
      if (!val) this.setupUploader();
    }
  },
  created() {
    this.getList();
    this.getArea();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listProblem(this.queryParams).then(response => {
        const result = response.result;
        const records = result.list;
        this.recordList = records;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    getArea() {
      listArea({ limit: 1000000 }).then(response => {
        const result = response.result;
        this.areaOptions = result.list;
      });
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup([...fileList]);
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
        'createTimeStart',
        'createTimeEnd'
      );
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportProblem,
        this.queryParams,
        "问题拍照记录",
        "问题拍照"
      );
    },
    /** 显示现场照片 */
    showImages(index) {
      this.$refs["imageViewer" + index].show();
    },
    /** 编辑、详情按钮操作 */
    handleOperation(row) {
      this.reset();
      this.open = true;
      this.editable = !row.status;
      this.title = !row.status ? "修改问题记录" : "查看详情";
      this.form = { ...row };
      this.setupUploader(row.fileInfoModels);
    },
    // 所在区域改变
    handleAreaChange(id) {
      this.form.areaName = this.areaOptions.find(item => item.id === id).name;
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.fileInfoModels = [...fileList];
    },
    /** 图片上传验证 */
    validatePhotos(rule, value, callback) {
      if (!this.form.fileInfoModels || !this.form.fileInfoModels.length) {
        return callback(new Error("图片上传不能为空"));
      }
      callback();
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.editable)
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateProblem(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        });
      else this.open = false;
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
        problem: undefined,
        status: undefined,
        type: undefined,
        areaId: undefined,
        areaName: undefined,
        position: undefined,
        description: undefined,
        createUserName: undefined,
        createTime: undefined,
        fileInfoModels: undefined,
        memo: undefined
      };
      this.resetForm("form");
    }
  }
};
</script>

<style lang="scss" scoped>
.number {
  color: #1890ff;
}
.active {
  color: red;
}
</style>
