<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="线路名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入线路名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="线路类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择线路类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" prop="isRelease">
            <el-select
              v-model="queryParams.isRelease"
              placeholder="请选择发布状态"
              clearable
              size="small"
              style="width: 145px"
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
            <span class="table-title">线路管理列表</span>
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
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="lineList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="线路名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="线路类型" align="center">
            <template slot-scope="scope">{{
              typeName(scope.row.type)
            }}</template>
          </el-table-column>
          <el-table-column
            label="线路描述"
            align="center"
            prop="description"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="发布状态" align="center">
            <template slot-scope="scope">{{
              scope.row.isRelease ? "已发布" : "未发布"
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
      width="1080px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="线路名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入线路名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线路类型:" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio
                  v-for="dict in typeOptions"
                  :key="dict.value"
                  :label="dict.value"
                  :disabled="Boolean(form.id)"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <table-transfer
              ref="transfer"
              v-model="form.insPointList"
              :lineType="form.type"
            ></table-transfer>
          </el-col>
          <el-col :span="24">
            <el-form-item label="线路描述:" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                placeholder="请输入线路描述"
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
  listLine,
  addLine,
  updateLine,
  delLine
} from "@/api/modules/inspect/line";
import TableTransfer from "@/views/components/inspect/table-transfer";

export default {
  name: "LineManagement",
  components: { TableTransfer },
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
      lineList: null,
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
        type: undefined,
        isRelease: undefined
      },
      // 表单校验
      rules: {
        code: [
          { required: true, message: "标签编码不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "标签名称不能为空", trigger: "blur" }
        ],
        posX: [{ required: true, message: "经度不能为空", trigger: "change" }],
        posY: [{ required: true, message: "纬度不能为空", trigger: "change" }]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 线路类型 */
    typeOptions() {
      return this.$store.state.common.lineTypes;
    },
    /** 发布状态 */
    statusOptions() {
      return this.$store.state.common.publishStatus;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listLine(this.queryParams).then(response => {
        const result = response.result;
        this.lineList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取线路类型label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
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
        name: undefined,
        type: 2,
        insPointList: [],
        description: undefined
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加线路";
      this.$nextTick(() => {
        this.$refs.transfer.setup(this.form.id);
      });
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改线路";
      this.form = { ...row };
      this.$nextTick(() => {
        this.$refs.transfer.setup(this.form.id);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.insPointList.length <= 0) {
        this.$message.error("检点不能为空");
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addLine, updateLine, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const lineIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delLine, lineIds, "线路").then(_ => {
        this.getList();
      });
    }
  }
};
</script>
