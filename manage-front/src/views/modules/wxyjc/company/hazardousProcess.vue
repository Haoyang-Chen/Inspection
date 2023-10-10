<template>
  <div class="app-container">
    <el-row>
      <el-col :span="14">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          size="mini"
        >
          <el-form-item label="企业名称" prop="compName" v-if="ifGov == 1">
            <el-input v-model="queryParams.compName"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName" v-if="ifGov != 1">
            <el-input v-model="queryParams.deviceName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleQuery()"
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
            <i class="el-icon-s-operation"></i> 设备信息列表
          </div>
        </div>
        <el-table :data="tableData" :max-height="tableHeight">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
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
            label="所属工艺"
            align="center"
            prop="processCategoryName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="典型工艺装置"
            align="center"
            prop="processCategorySubName"
            :show-overflow-tooltip="true"
          />
          <el-table-column fixed="right" label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row.id)"
                >查看</el-button
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
      </el-col>
      <el-col :span="10">
        <Wxgyjk
          v-model="dialogVisible"
          @closeView="handleQuery()"
          ref="Wxgyjk"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { list_API } from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import Wxgyjk from "@/views/components/wxyjc/wxgyjk/wxgyjk";
import { mapState } from "vuex";
export default {
  components: {
    Wxgyjk,
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
      dialogVisible: true,
      queryParams: {
        page: 1,
        limit: 10,
        compName: undefined,
        deviceName: undefined,
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
      this.dialogVisible = false;
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
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Wxgyjk"].editTemp(id);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>