<template>
  <div>
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
            <span class="table-title">风险辨识数据列表</span>
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
          :data="riskList"
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
            label="风险因素"
            align="center"
            prop="factor"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="安全措施"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.measuresList" :key="index">
                {{ item }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="创建人"
            align="center"
            prop="createUserName"
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
      width="650px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="作业票种类:" prop="ticketType">
              <el-select
                v-model="form.ticketType"
                :disabled="!!form.id"
                clearable
                placeholder="请选择作业票种类"
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
            <risk-form
              ref="riskForm"
              :multiple="!form.id"
              :visible="open"
            ></risk-form>
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
import { listRisk, addRisk, updateRisk, delRisk } from "@/api/modules/risk";
import RiskForm from "./risk-form";

export default {
  name: "RiskBasis",
  components: { RiskForm },
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
      // 风险辨识表格数据
      riskList: null,
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
        ticketType: undefined
      },
      // 表单校验
      rules: {
        ticketType: [
          { required: true, message: "作业票种类不能为空", trigger: "blur" }
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
      listRisk(this.queryParams).then(response => {
        const result = response.result;
        this.riskList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据作业票种类value获取检点类型label
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
        ticketType: undefined
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
      this.title = "添加风险辨识";
      this.$nextTick(() => {
        this.$refs.riskForm.setup();
      });
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改风险辨识";
      this.form.id = row.id;
      this.form.ticketType = row.ticketType;
      const identifyList = [
        { factor: row.factor, measuresList: row.measuresList }
      ];
      this.$nextTick(() => {
        this.$refs.riskForm.setup(identifyList);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      const validList = [];
      const typeValid = new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve({ id: this.form.id, ticketType: this.form.ticketType });
          } else {
            reject();
          }
        });
      });
      validList.push(typeValid);
      const riskValid = this.$refs.riskForm.validate();
      validList.push(riskValid);
      Promise.all(validList)
        .then(([{ id, ticketType }, risks]) => {
          const data = this.generateSubmit(id, ticketType, risks);
          this.formRequest(addRisk, updateRisk, data).then(_ => {
            this.open = false;
            this.getList();
          });
        })
        .catch(_ => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const riskIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delRisk, riskIds, "风险辨识").then(_ => {
        this.getList();
      });
    },
    /** 生成提交数据 */
    generateSubmit(id, ticketType, risks) {
      const data = risks.map(item => {
        return {
          ticketType,
          factor: item.factor,
          measuresList: item.measuresList
        };
      });
      if (id) return { ...data[0], id };
      return data;
    }
  }
};
</script>
