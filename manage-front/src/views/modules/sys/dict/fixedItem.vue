<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="作业票种类" prop="ticketType">
            <el-select
              v-model="queryParams.ticketType"
              placeholder="请选择作业票种类"
              clearable
              size="small"
              style="width: 165px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="现场固定检查项" prop="item">
            <el-input
              v-model="queryParams.item"
              placeholder="请输入现场固定检查项"
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
            <span class="table-title">现场固定检查项列表</span>
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
          :data="fixedList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="作业票种类"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ typeName(scope.row.ticketType) }}
            </template>
          </el-table-column>
          <el-table-column
            label="现场固定检查项"
            align="center"
            prop="item"
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
            <el-form-item label="作业票种类:" prop="ticketType">
              <el-select
                v-model="form.ticketType"
                placeholder="请选择作业票种类"
                clearable
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="现场固定检查项:" prop="item">
              <el-input
                v-model="form.item"
                placeholder="请输入现场固定检查项"
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
  listFixed,
  addFixed,
  updateFixed,
  delFixed
} from "@/api/modules/sys/fixed";

export default {
  name: "WorkArea",
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
      // 现场固定检查项表格数据
      fixedList: null,
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
        ticketType: undefined,
        item: undefined
      },
      // 表单校验
      rules: {
        ticketType: [
          { required: true, message: "作业票种类不能为空", trigger: "blur" }
        ],
        item: [
          { required: true, message: "现场固定检查项不能为空", trigger: "blur" }
        ]
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
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listFixed(this.queryParams).then(response => {
        const result = response.result;
        this.fixedList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据作业票种类value获取label
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
        ticketType: undefined,
        item: undefined
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
      this.title = "添加现场固定检查项";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改现场固定检查项";
      this.form = { ...row };
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addFixed, updateFixed, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const fixedIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delFixed, fixedIds, "现场固定检查项").then(_ => {
        this.getList();
      });
    }
  }
};
</script>
