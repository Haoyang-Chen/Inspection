<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="作业区域" prop="area">
            <el-input
              v-model="queryParams.area"
              placeholder="请输入作业区域"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="风险等级" prop="level">
            <el-select
              v-model="queryParams.level"
              placeholder="请选择风险等级"
              clearable
              size="small"
              style="width: 180px"
            >
              <el-option
                v-for="dict in riskLevelsOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.value"
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
            <span class="table-title">固有风险区域列表</span>
            <div style="float:right;">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="ids.length <= 0"
                @click="handleDelete"
              >批量删除</el-button>
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="tableData"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="作业区域"
            align="center"
            prop="area"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="区域描述" align="center" prop="areaDesc" :show-overflow-tooltip="true" />
          <el-table-column label="风险等级" align="center" prop="level" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ levelName(scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column label="关键设备" align="center" prop="device" :show-overflow-tooltip="true" />
          <el-table-column label="工作岗位" align="center" prop="station" :show-overflow-tooltip="true" />
          <el-table-column label="责任部门" align="center" prop="respDeptName" :show-overflow-tooltip="true" />
          <el-table-column label="责任人" align="center" prop="respUserName" :show-overflow-tooltip="true" />
          <el-table-column label="最近辨识时间" align="center" prop="createTime" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}
            </template>
          </el-table-column>
          <el-table-column label="辨识人" align="center" prop="createUserName" :show-overflow-tooltip="true" />
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row, true)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleEdit(scope.row, false)"
              >查看详情</el-button>
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
    <area-dialog ref="areaDialog" v-model="open" :editable="editable" :title="title" @submitSuccess="getList"></area-dialog>
  </div>
</template>

<script>
import AreaDialog from "@/views/components/risk/area";
import { listArea, delArea } from "@/api/modules/risk/area";
import { levelName } from "@/views/components/risk/utils";

export default {
  components: {
    AreaDialog
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 表格数据
      tableData: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单是否可编辑
      editable: true,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        area: undefined,
        level: undefined
      },
      levelName
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 风险等级数据字典 */
    riskLevelsOptions() {
      return this.$store.state.common.riskLevels;
    }
  },
  filters: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then(response => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
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
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.editable = true;
      this.title = "添加固有风险区域";
    },
    /** 编辑按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.editable = editable;
      this.title = "修改固有风险区域";
      this.$nextTick(() => {
        this.$refs.areaDialog.setup({ ...row });
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const areaIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delArea, areaIds, "风险区域").then(_ => {
        this.getList();
      });
    }
  }
};
</script>
