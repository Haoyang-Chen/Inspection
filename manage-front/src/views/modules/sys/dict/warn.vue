<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="线路名称" prop="lineName">
            <el-input
              v-model="queryParams.lineName"
              placeholder="请输入线路名称"
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
            <span class="table-title">线路列表</span>
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
          :data="warnList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="线路名称"
            align="center"
            prop="lineName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="计算办法"
            align="center"
            prop="method"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="报警时间/min"
            align="center"
            prop="time"
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
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="线路名称:" prop="lineName">
              <el-autocomplete
                v-model="form.lineName"
                :fetch-suggestions="querySearch"
                :disabled="form.id != undefined"
                clearable
                placeholder="请输入搜索关键字"
                style="width:460px;"
                @select="handleLineSelect"
              >
                <template slot-scope="{ item }">
                  <span>{{ item.name }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计算办法:" prop="method">
              <el-input
                v-model="form.method"
                :disabled="true"
                placeholder="请输入计算办法"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报警时间:" prop="time">
              <el-input-number
                v-model="form.time"
                :min="1"
                :precision="0"
                controls-position="right"
                placeholder="请输入报警时间"
                style="width:180px;"
              ></el-input-number>
              <span>min</span>
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
import { listWarn, addWarn, updateWarn, delWarn } from "@/api/modules/sys/warn";
import { listLine } from "@/api/modules/inspect/line";

export default {
  name: "WarnTime",
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
      // 报警时间表格数据
      warnList: null,
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
        lineName: undefined
      },
      // 表单校验
      rules: {
        lineName: [
          { required: true, message: "线路名称不能为空", trigger: "change" }
        ],
        method: [
          { required: true, message: "计算办法不能为空", trigger: "blur" }
        ],
        time: [{ required: true, message: "报警时间不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    }
  },
  created() {
    this.getList();
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        lineId: undefined,
        lineName: undefined,
        method: "从任务开始到结束",
        time: undefined
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
      this.title = "添加报警时间";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改报警时间";
      this.form = { ...row };
    },
    /** 按关键字搜索标签 */
    querySearch(queryString, cb) {
      listLine({ limit: 100000, name: queryString, ifHasWarnTime: 1 })
        .then(response => {
          const result = response.result;
          cb(result.list);
        })
        .catch(_ => {
          cb();
        });
    },
    /** 线路选中 */
    handleLineSelect(item) {
      this.form.lineId = item.id;
      this.form.lineName = item.name;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addWarn, updateWarn, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const warnIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delWarn, warnIds, "报警时间").then(_ => {
        this.getList();
      });
    }
  }
};
</script>
