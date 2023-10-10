<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="人员姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入人员姓名"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门" prop="dept">
            <el-input
              v-model="queryParams.dept"
              placeholder="请输入部门"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="班组" prop="team">
            <el-input
              v-model="queryParams.team"
              placeholder="请输入班组"
              clearable
              size="small"
              style="width: 160px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
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
          </el-form-item> -->
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
            <span class="table-title">施工人员列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                >新增</el-button
              >
              <!-- <el-button
                type="info"
                icon="el-icon-lock"
                size="mini"
                :disabled="multiple"
                @click="handleRowOp(undefined, 3)"
                >禁用</el-button
              >
              <el-button
                type="success"
                icon="el-icon-unlock"
                size="mini"
                :disabled="multiple"
                @click="handleRowOp(undefined, 2)"
                >启用</el-button
              > -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleRowOp(undefined, 0)"
                >删除</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="workerList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="人员姓名"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            prop="dept"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="班组"
            align="center"
            prop="team"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="是否通过安全监护培训" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.ifSafety == 1">
                是
              </span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="培训文件" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.trainFileModel && scope.row.trainFileModel.name"
                class="number"
                size="mini"
                type="text"
                @click="handleDownload(scope.row.trainFileModel)"
                >下载</el-button
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
                @click="handleRowOp(scope.row.id, 0)"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员姓名:" prop="name">
              <el-input v-model="form.name" placeholder="请输入人员姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门:" prop="dept">
              <el-input v-model="form.dept" placeholder="请输入部门" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="班组:" prop="team">
              <el-input v-model="form.team" placeholder="请输入班组" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="通过安全监护培训:" prop="ifSafety">
              <el-radio-group v-model="form.ifSafety">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.ifSafety === 1">
            <el-form-item label="培训文件:" prop="trainFileModel"
              :rules="[
                {
                  required: form.ifSafety === 1,
                  message: '培训文件不能为空',
                  trigger: 'blur'
                }
              ]"
            >
              <uploader
                ref="trainUploader"
                listType="text"
                :multiple="false"
                :limit="1"
                accept=""
                @uploadCompletion="handleTrainUploaded"
              ></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作证书:">
              <el-button
                v-if="
                  !form.workerCertificateList ||
                    !form.workerCertificateList.length
                "
                type="primary"
                icon="el-icon-plus"
                size="mini"
                circle
                @click="handleCerAdd"
              ></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row
              v-for="(item, index) in form.workerCertificateList"
              :key="index"
            >
              <el-form-item
                label-width="0"
                :prop="'workerCertificateList.' + index"
                :rules="[
                  {
                    validator: validateCerRow,
                    trigger: 'blur'
                  }
                ]"
              >
                <el-col :span="22" :offset="2">
                  <el-row>
                    <el-col :span="2">
                      <span class="number-index">{{ index + 1 }}</span>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item
                        label="特种作业种类:"
                        :prop="'workerCertificateList.' + index + '.type'"
                        style="margin-bottom:22px"
                      >
                        <el-select
                          v-model="item.type"
                          placeholder="请选择特种作业种类"
                          clearable
                        >
                          <el-option
                            v-for="dict in typeOptions"
                            :key="dict.label"
                            :label="dict.label"
                            :value="dict.label"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item
                        label="证书文件:"
                        style="margin-bottom:22px"
                      >
                        <uploader
                          :ref="'cerUploader' + index"
                          listType="text"
                          :multiple="false"
                          :limit="1"
                          accept=""
                          @uploadCompletion="handleCerUploaded($event, index)"
                        ></uploader>
                      </el-form-item>
                      <el-form-item
                        label="有效期至:"
                        :prop="'workerCertificateList.' + index + '.deadline'"
                        style="margin-bottom:22px"
                      >
                        <el-date-picker
                          v-model="item.deadline"
                          type="date"
                          format="yyyy年MM月dd日"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择有效期"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item
                        label="证书编号:"
                        :prop="'workerCertificateList.' + index + '.number'"
                      >
                        <el-input
                          v-model="item.number"
                          placeholder="请输入证书编号"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        circle
                        style="margin-top:5px"
                        @click="handleCerAdd(index)"
                      ></el-button>
                      <el-button
                        type="danger"
                        icon="el-icon-minus"
                        size="mini"
                        circle
                        style="margin-top:5px"
                        @click="handleCerDel(index)"
                      ></el-button>
                    </el-col>
                  </el-row>
                </el-col>
              </el-form-item>
            </el-row>
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
  listWorker,
  listCer,
  addWorker,
  updateWorker,
  delWorker,
  disableWorker,
  enableWorker
} from "@/api/modules/sys/worker";
import Uploader from "@/components/Uploader";
import { urlOfFileName } from "@/utils/zipdownload";

export default {
  name: "WorkerLibrary",
  components: { Uploader },
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
      // 施工人员表格数据
      workerList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        dept: undefined,
        team: undefined,
        status: undefined
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: "人员姓名不能为空", trigger: "blur" }],
        ifSafety: [{ required: true, message: "通过安全监护培训", trigger: "change" }]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 状态数据字典 */
    statusOptions() {
      return this.$store.state.common.userStatus;
    },
    /** 特种作业种类数据字典 */
    typeOptions() {
      return this.$store.state.common.specialWorkTypes;
    }
  },
  watch: {
    open(val) {
      if (!val) this.setupUploader();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listWorker(this.queryParams).then(response => {
        const result = response.result;
        this.workerList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 查询工作证书列表 */
    getCerList(id) {
      listCer(id).then(response => {
        const result = response.result;
        this.form.workerCertificateList = result || [];
        this.setupUploader(
          [this.form.trainFileModel],
          this.form.workerCertificateList
        );
      });
    },
    setupUploader(trainFiles = [], cerList = []) {
      this.$nextTick(() => {
        if (this.$refs.trainUploader) this.$refs.trainUploader.setup(trainFiles || []);
        const necessary = this.$refs.trainUploader && cerList && cerList.length;
        if (necessary) {
          cerList.forEach((item, index) => {
            const files = Object.keys(item.certificateFileModel) || [];
            if (files.length)
              this.$refs["cerUploader" + index][0].setup([
                item.certificateFileModel
              ]);
          });
        }
      });
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
    // 施工人员状态修改
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.name + '"施工人员吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return row.status === 1
            ? enableUser([row.id])
            : disableUser([row.id]);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
    // 下载培训文件
    handleDownload(file) {
      this.download(urlOfFileName(file.name));
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        dept: "",
        team: "",
        ifSafety: 0,
        trainFileModel: undefined,
        workerCertificateList: []
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加施工人员";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改施工人员";
      this.form = { ...row };
      this.getCerList(row.id);
    },
    /** 删除、启用、禁用按钮操作 */
    handleRowOp(id, op) {
      const workerIds = id ? [id] : this.ids;
      let opFunc;
      if (op === 0) opFunc = delWorker;
      else if (op === 2) opFunc = enableWorker;
      else if (op === 3) opFunc = disableWorker;
      this.rowsOpRequest(opFunc, workerIds, "施工人员", op).then(_ => {
        this.getList();
      });
    },
    /** 培训文件上传完成回调 */
    handleTrainUploaded(fileList) {
      this.form.trainFileModel = this.formatUploadFiles(fileList);
    },
    /** 证书文件上传完成回调 */
    handleCerUploaded(fileList, index) {
      this.form.workerCertificateList[
        index
      ].certificateFileModel = this.formatUploadFiles(fileList);
    },
    /** 添加工作证书按钮 */
    handleCerAdd(index = undefined) {
      const baseLine = {
        type: "",
        certificateFileModel: {},
        deadline: "",
        number: ""
      };
      if (!index) {
        this.form.workerCertificateList.push(baseLine);
      } else {
        this.form.workerCertificateList.splice(index + 1, 0, baseLine);
      }
    },
    /** 删除工作证书按钮 */
    handleCerDel(index) {
      this.$confirm("是否确认删除所选工作证书？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.form.workerCertificateList.splice(index, 1);
      });
    },
    /** 工作证书行数据验证 */
    validateCerRow(rule, value, callback) {
      const hasType = value.type && value.type.length > 0;
      const files = Object.keys(value.certificateFileModel) || [];
      const hasFile = files.length > 0;
      const hasDate = value.deadline && value.deadline.length > 0;
      const hasNumber = value.number && value.number.length > 0;
      if (!hasType && !hasFile && !hasDate && !hasNumber) {
        return callback(new Error("请至少填写一项工作证书相关数据"));
      }
      callback();
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addWorker, updateWorker, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 格式化上传回调数据 */
    formatUploadFiles(files) {
      if (files && files.length) {
        return { ...files[0] };
      } else {
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.number {
  color: #1890ff;
}
</style>
