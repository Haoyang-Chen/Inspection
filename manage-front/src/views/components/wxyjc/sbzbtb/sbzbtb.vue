<template>
  <div class="app-container" style="margin-top: 25px">
    <div class="header-title-buttons flex justify-between items-center">
      <div class="title">
        <i class="el-icon-s-operation"></i> 指标列表
      </div>
    </div>

    <el-table :data="tableData" :max-height="tableHeight">
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column
        label="企业ID"
        align="center"
        prop="companyId"
        width="60"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备类型"
        align="center"
        prop="deviceType"
        width="80"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备名称编号"
        align="center"
        prop="deviceNo"
        min-width="140"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="指标类型"
        align="center"
        prop="targetType"
        width="80"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="计量单位"
        align="center"
        prop="unit"
        width="80"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="低报"
        align="center"
        prop="lowReport"
        width="60"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="高报"
        align="center"
        prop="maxReport"
        width="60"
        :show-overflow-tooltip="true"
      />
      <el-table-column fixed="right" label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            <span v-if="ifGov == 1">查看</span>
            <span v-else>编辑</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <SbzbtbEdit
      v-model="dialogVisible"
      ref="SbzbtbEdit"
      @closeView="handleQuery()"
      :editable="ifGov != 1"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import SbzbtbEdit from "./sbzbtbEdit";
import { targetCode_API } from "@/api/modules/wxyjc/wxyjctargetcode";
export default {
  components: {
    SbzbtbEdit,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    ...mapState({
      ifGov: (state) => state.user.ifGov,
    }),
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
      dialogVisible: false,
      size: "small",
      tableData: [],
      relationId: undefined,
      deviceType: undefined
    };
  },
  methods: {
    //搜索
    handleQuery() {
      this.getList();
    },
    editTemp(relationId, deviceType) {
      this.relationId = relationId;
      this.deviceType = deviceType;
      targetCode_API(relationId, deviceType).then((res) => {
        this.tableData = res.result;
      });
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["SbzbtbEdit"].editTemp(row);
      });
    },
    //获取数据
    getList() {
      targetCode_API(this.relationId, this.deviceType).then((res) => {
        this.tableData = res.result;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>