<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="compName" v-if="ifGov == 1">
        <el-input v-model="queryParams.compName"></el-input>
      </el-form-item>
      <el-form-item label="处理状态" prop="dealState">
        <el-select v-model="queryParams.dealState" placeholder="请选择">
          <el-option
            v-for="item in problemStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="resetQuery()"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="header-title-buttons flex justify-between items-center">
      <div class="title"><i class="el-icon-s-operation"></i> 设备信息列表</div>
      <div class="buttons">
        <el-button icon="el-icon-download" size="mini" @click="handleExport()"
          >批量导出</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" :max-height="tableHeight">
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column
        v-if="ifGov == 1"
        label="企业名称"
        align="center"
        prop="compName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备类别"
        align="center"
        prop="deviceCategory"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备名称编号"
        align="center"
        prop="deviceNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="指标名称"
        align="center"
        prop="targetCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="计量单位"
        align="center"
        prop="targetUnit"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="低低报"
        align="center"
        prop="minReport"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="高高报"
        align="center"
        prop="highReport"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="低报"
        align="center"
        prop="lowReport"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="高报"
        align="center"
        prop="maxReport"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="实时数据"
        align="center"
        prop="realTimeData"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.realTimeData }}{{ scope.row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最新报警时间"
        align="center"
        prop="collectTime"
        width="160"
      />
      <el-table-column
        label="处理状态"
        align="center"
        prop="dealState"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.dealState == 1">已处理</span>
          <span v-if="scope.row.dealState == 0">未处理</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleEdit(scope.row.id)"
            v-if="ifGov != 1 && scope.row.dealState == 0"
            >处理</el-button
          >
          <el-button type="text" @click="handleEditList(scope.row.targetId)"
            >查看报警记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <Bjcl v-model="dialogVisibleList" @closeView="handleQuery()" ref="Bjcl" />
    <BjclEdit
      v-model="dialogVisibleEdit"
      @closeView="handleQuery()"
      ref="BjclEdit"
    />
  </div>
</template>

<script>
import { list_API, excel_API } from "@/api/modules/wxyjc/wxyjcwarninginformopt";
import Bjcl from "@/views/components/wxyjc/bjcl/bjcl";
import BjclEdit from "@/views/components/wxyjc/bjcl/bjclEdit";
import { mapState } from "vuex";
export default {
  components: {
    Bjcl,
    BjclEdit,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    ...mapState({
      problemStatus: (state) => state.common.problemStatus,
      ifGov: (state) => state.user.ifGov,
    }),
  },
  data() {
    return {
      dialogVisibleList: false,
      dialogVisibleEdit: false,
      queryParams: {
        page: 1,
        limit: 10,
        compName: undefined,
        dealState: undefined,
      },
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //搜索
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    //重置
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //获取数据
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    //报警处理
    handleEdit(id) {
      this.dialogVisibleEdit = true;
      this.$nextTick(() => {
        this.$refs["BjclEdit"].editTemp(id);
      });
    },
    //处理记录
    handleEditList(targetId) {
      this.dialogVisibleList = true;
      this.$nextTick(() => {
        this.$refs["Bjcl"].editTemp(targetId);
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(excel_API, this.queryParams, "设备信息", "设备信息");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>