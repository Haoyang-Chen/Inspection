<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="compName">
        <el-input v-model="queryParams.compName"></el-input>
      </el-form-item>
      <el-form-item label="危化品类别" prop="chemicalsCategory">
        <el-select
          v-model="queryParams.chemicalsCategory"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in dangerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重点监管" prop="isSupervision">
        <el-select
          v-model="queryParams.isSupervision"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in trueFalseList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="易制毒" prop="isEasytoxic">
        <el-select
          v-model="queryParams.isEasytoxic"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in trueFalseList"
            :key="index"
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
      <div class="title"><i class="el-icon-s-operation"></i> 危化品列表</div>
      <div class="buttons">
        <el-button icon="el-icon-download" size="mini" @click="handleExport()"
          >批量导出</el-button
        >
      </div>
    </div>
    <el-table :data="tableData" :max-height="tableHeight">
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column
        label="企业名称"
        align="center"
        prop="compName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="类别"
        align="center"
        prop="category"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="危化品名称"
        align="center"
        prop="dangerName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="CAS号"
        align="center"
        prop="casNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="储存方式"
        align="center"
        prop="storageMethod"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="年用量/年产量"
        align="center"
        prop="outputVolume"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="最大储量"
        align="center"
        prop="reservesVolume"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="危化品类别"
        align="center"
        prop="chemicalsCategoryName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="重点监管"
        align="center"
        prop="isSupervision"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isSupervision == 1">是</span>
          <span v-if="scope.row.isSupervision == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="易制毒"
        align="center"
        prop="isEasytoxic"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isEasytoxic == 1">是</span>
          <span v-if="scope.row.isEasytoxic == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="140">
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

    <Whpxx
      ref="Whpxx"
      v-model="dialogVisible"
      @closeView="handleQuery()"
      :editable="editable"
    />
  </div>
</template>

<script>
import { list_API, excel_API } from "@/api/modules/wxyjc/wxyjcdangerousinfo";
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
import { mapGetters } from "vuex";
import Whpxx from "@/views/components/wxyjc/whpxx/whpxx";

export default {
  components: {
    Whpxx,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    ...mapGetters(["trueFalseList"]),
  },
  data() {
    return {
      editable: false,
      dialogVisible: false,
      dangerList: [],
      queryParams: {
        page: 1,
        limit: 10,
        isToxic:1,
        compName: undefined, //企业名称
        chemicalsCategory: undefined, //危化品类别
        isSupervision: undefined, //重点监管
        isEasytoxic: undefined, //易制毒
      },
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getList();
    wxyjcdictindex_API("wxhxpfl").then((res) => {
      this.dangerList = res.result;
    });
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
    handleEdit(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["Whpxx"].editTemp(id);
      });
    },
    //获取数据
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        excel_API,
        this.queryParams,
        "剧毒危化品",
        "剧毒危化品"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>