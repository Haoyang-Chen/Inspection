<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="1200px"
  >
    <el-table :data="tableData" :max-height="tableHeight">
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column
        label="报警时间"
        align="center"
        prop="collectTime"
        width="160"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="实时数据"
        align="center"
        prop="realTimeData"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="低低报"
        align="center"
        prop="minReport"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="高高报"
        align="center"
        prop="highReport"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="低报"
        align="center"
        prop="lowReport"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="高报"
        align="center"
        prop="maxReport"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="报警原因"
        align="center"
        prop="causeAlarm"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="报警处理"
        align="center"
        prop="alarmDeal"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="处理时间"
        align="center"
        prop="dealTime"
        width="160"
        :show-overflow-tooltip="true"
      />
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <span slot="footer" class="dialog-footer">
      <el-button :size="size" @click="handleCancel()">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { detailList_API } from "@/api/modules/wxyjc/wxyjcwarninginformopt";
export default {
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "查看",
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      // 是否显示弹出层
      visible: this.value,
      size: "small",
      queryParams: {
        page: 1,
        limit: 10,
        targetId: undefined,
      },
      tableData: [],
      total: 0,
    };
  },
  methods: {
    //取消
    handleCancel() {
      this.visible = false;
      this.queryParams.page = 1;
      this.queryParams.limit = 10;
      this.queryParams.targetId = undefined;
      this.tableData = [];
      this.total = 0;
    },
    //搜索
    handleQuery() {},
    editTemp(targetId) {
      if (targetId) {
        this.queryParams.targetId = targetId;
        this.getList();
      }
    },
    //获取数据
    getList() {
      detailList_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>