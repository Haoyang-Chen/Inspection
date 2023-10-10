<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      size="mini"
      v-if="ifGov == 1"
    >
      <el-form-item label="企业名称" prop="compName">
        <el-input v-model="queryParams.compName"></el-input>
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
      <div class="title">
        <i class="el-icon-s-operation"></i> 可燃有毒气体监控列表
      </div>
      <div class="buttons" v-if="ifGov == 1">
        <el-button icon="el-icon-download" size="mini" @click="handleExport()"
          >批量导出</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" :max-height="tableHeight">
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column
        label="企业名称"
        align="left"
        prop="compName"
        v-if="ifGov == 1"
        min-width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备名称"
        align="center"
        prop="deviceNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备类别"
        align="center"
        prop="deviceCategory"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="检测气体"
        align="center"
        prop="gasDetection"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="浓度"
        align="center"
        prop="tinickness"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column fixed="right" label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row.id)"
            >查看</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <Krydqtjklb v-model="dialogVisible" @closeView="handleQuery()" />
  </div>
</template>

<script>
import { gasPointMonitors_API,excel2_API } from "@/api/modules/wxyjc/wxyjcdangerousgaspoint";
import Krydqtjklb from "@/views/components/wxyjc/krydqtjklb/krydqtjklb";
import { mapState } from "vuex";
export default {
  components: {
    Krydqtjklb,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    ...mapState({
      ifGov: (state) => state.user.ifGov,
    }),
  },
  data() {
    return {
      dialogVisible: false,
      queryParams: {
        page: 1,
        limit: 10,
        compName: undefined,
      },
      tableData: [],
      total: 0,
      timer: null, //定时器名称
    };
  },
  created() {
    this.getList();
    this.timer = setInterval(() => {
      this.getList();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer); // 清除定时器
    this.timer = null;
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
      gasPointMonitors_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    //报警处理
    handleEdit() {
      this.dialogVisible = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        excel2_API,
        this.queryParams,
        "可燃有毒气体监控",
        "可燃有毒气体监控"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>