<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="区域位置" prop="position">
            <el-select
              v-model="queryParams.position"
              placeholder="请选择区域位置"
              clearable
              size="small"
              style="width: 140px"
            >
              <el-option
                v-for="dict in positionOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区域名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入区域名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="区域类别" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择区域类别"
              clearable
              size="small"
              style="width: 140px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">作业区域列表</span>
            <div style="float:right;">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除</el-button>
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="areaList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="区域位置"
            align="center"
            prop="position"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="区域名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="区域类别" align="center" prop="type" :show-overflow-tooltip="true" />
          <el-table-column label="备注" align="center" prop="memo" :show-overflow-tooltip="true" />
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
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
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
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="区域位置:" prop="position">
              <el-radio-group v-model="form.position">
                <el-radio
                  v-for="dict in positionOptions"
                  :key="dict.label"
                  :label="dict.label"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="区域名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入区域名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="区域类别:" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio
                  v-for="dict in typeOptions"
                  :key="dict.label"
                  :label="dict.label"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="memo">
              <el-input v-model="form.memo" type="textarea" placeholder="请输入备注" />
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
import { listArea, addArea, updateArea, delArea } from "@/api/modules/sys/area";

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
      // 工作区域表格数据
      areaList: null,
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
        position: undefined,
        name: undefined,
        type: undefined
      },
      // 表单校验
      rules: {
        position: [
          { required: true, message: "区域位置不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "区域名称不能为空", trigger: "blur" }
        ],
        type: [{ required: true, message: "区域类别不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 位置数据字典 */
    positionOptions() {
      return this.$store.state.common.areaPositions;
    },
    /** 类别数据字典 */
    typeOptions() {
      return this.$store.state.common.areaTypes;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then(response => {
        const result = response.result;
        this.areaList = result.list;
        this.total = result.totalCount;
        this.loading = false;
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
        position: "生产区",
        name: undefined,
        type: "防爆",
        memo: undefined
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
      this.title = "添加作业区域";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改作业区域";
      this.form = { ...row };
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addArea, updateArea, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const areaIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delArea, areaIds, "作业区域").then(_ => {
        this.getList();
      });
    }
  }
};
</script>
