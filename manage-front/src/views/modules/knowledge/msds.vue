<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <div class="title"><span>MSDS</span>搜索</div>
        <div class="flex searchInput">
          <el-input size="small" v-model="queryParams.name" style="margin-right: 20px;"></el-input>
          <el-button type="primary" size="small" icon="el-icon-search">查询</el-button>
        </div>
        <div class="msds-panel">
          <el-radio-group v-model="queryParams.name">
            <el-radio v-for="(dict, index) in msdsParamsOptions" :key="index" :value="dict.label" size="small">{{ dict.label }}</el-radio>
          </el-radio-group>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card mt20" shadow="never">
      <el-row :gutter="24" class="mb8">
        <el-col class="table-title-panel">
          <span class="table-title"></span>
          <div style="float:right;">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="ids.length <= 0"
              @click="handleDelete"
            >删除</el-button>
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
        <el-table-column label="化学品中文名称" align="center" prop="title" :show-overflow-tooltip="true" />
        <el-table-column label="化学品英文名称" align="center" prop="formulateDepartment" :show-overflow-tooltip="true" />
        <el-table-column label="中文名称2" align="center" prop="applyTime" :show-overflow-tooltip="true" />
        <el-table-column label="英文名称2" align="center" prop="applyTime" :show-overflow-tooltip="true" />
        <el-table-column label="技术说明书编导" align="center" prop="applyTime" :show-overflow-tooltip="true" />
        <el-table-column
          label="操作"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <!-- 1是，0否，具有操作权限 -->
            <!-- <template v-if="scope.row.allowOperate === 1">
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
            </template> 
            <el-button
              v-else
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleEdit(scope.row, false)"
            >查看</el-button>-->
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
    </el-card>

    <!-- 添加或修改参数配置对话框 -->
    <msds-dialog ref="msdsDialog" v-model="open" :editable="editable" @submitSuccess="getList"></msds-dialog>
  </div>
</template>

<script>
import { listMSDS, delMSDS } from "@/api/modules/knowledge/msds";
import MsdsDialog from "@/views/components/knowledge/msds";

export default {
   components: {
    MsdsDialog
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 表格数据
      tableData: [],
      // 是否显示弹出层
      open: false,
      // 是否可编辑
      editable: true,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
      },
    }
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 搜索参数字典 */
    msdsParamsOptions() {
      return this.$store.state.common.msdsParams;
    }
  },
  created() {
    this.getList();
  },
   methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listMSDS(this.queryParams).then(response => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.editable = true;
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-card {
  border-radius: none !important;
}
.box-card {
  text-align: center;
}
.title {
  text-align: center;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 26px;
    color: #67C23A;
  }
}
.searchInput {
  padding: 10px 10%;
}
.msds-panel {
  margin: 10px 0;
}
</style>