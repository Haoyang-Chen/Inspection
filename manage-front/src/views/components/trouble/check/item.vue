<template>
  <div>
    <el-dialog
      title="检查项管理"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="61.8%"
      append-to-body
    >
      <el-row :gutter="20">
        <!--搜索数据-->
        <el-col :span="24" :xs="24">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="85px"
          >
            <el-form-item label="检查项名称" prop="itemName">
              <el-input
                v-model="queryParams.itemName"
                placeholder="请输入检查项名称"
                clearable
                size="small"
                style="width: 240px"
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
              <span class="table-title">检查项列表</span>
              <div style="float:right;">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                  >新增</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                  >删除</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-upload2"
                  size="mini"
                  @click="handleImport"
                  >从Excel导入</el-button
                >
              </div>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="itemList"
            :max-height="tableHeight"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column
              label="检查项名称"
              align="center"
              prop="itemName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="检查依据"
              align="center"
              prop="basis"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="检查方式"
              align="center"
              prop="mode"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              align="center"
              width="150"
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
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="检查项名称:" prop="itemName">
              <el-input
                v-model="form.itemName"
                placeholder="请输入检查项名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查依据:" prop="basis">
              <el-input v-model="form.basis" placeholder="请输入检查依据" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查方式:" prop="mode">
              <el-input v-model="form.mode" placeholder="请输入检查方式" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <upload-dialog
      v-model="uploading"
      actionUri="/checkform/upload"
      :param=queryParams
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></upload-dialog>
  </div>
</template>

<script>
import {
  listItem,
  addItem,
  updateItem,
  delItem,
  templateItem
} from "@/api/modules/check";
import UploadDialog from "@/components/UploadDialog";

export default {
  name: "CheckItemList",
  components: { UploadDialog },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否显示列表弹出层
      visible: this.value,
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
      // 检查表格数据
      itemList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示上传弹出层
      uploading: false,
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(templateItem, "检查项信息导入模板");
      },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        formId: undefined,
        itemName: undefined
      },
      // 表单校验
      rules: {
        itemName: [
          { required: true, message: "检查项名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(checkId) {
      this.queryParams.formId = checkId;
      this.getList();
    },
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listItem(this.queryParams).then(response => {
        const result = response.result;
        this.itemList = result;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 多选操作 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        id: undefined,
        itemName: undefined,
        basis: "",
        mode: "现场检查"
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加检查项";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改检查项";
      this.form = { ...row };
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const itemIds = row && row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delItem, itemIds, "检查项").then(_ => {
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const data = { ...this.form, formId: this.queryParams.formId };
          this.formRequest(addItem, updateItem, data).then(_ => {
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
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    // 文件上传完成处理
    handleUploadCompletion(response) {
      this.getList();
    }
  }
};
</script>
