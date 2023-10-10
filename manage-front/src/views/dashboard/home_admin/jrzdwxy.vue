<template>
  <el-card shadow="hover" :body-style="{ padding: '15px 15px' }">
    <div slot="header" class="chart-header clearfix">
      <span>接入重大危险源</span>
    </div>
    <div :class="className" :style="{ height: height, width: width }">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="重大危险源类别" min-width="180"/>
        <el-table-column prop="number" label="数量" align="center"/>
      </el-table>
    </div>
  </el-card>
</template>

<script>
//接入重大危险源

require("echarts/theme/macarons"); // echarts theme
export default {
  name: "jrzdwxy",
  props: {
    className: {
      type: String,
      default: "jrzdwxy",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "266px",
    },
  },
  data() {
    return {
      tableData: [
        {
          name: "重大危险源实时监控",
          number: "0",
        },
        {
          name: "可燃有毒气体监控",
          number: "0",
        },
        {
          name: "危险工艺监控",
          number: "0",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-card__header {
  border-bottom: 0;
}
// /deep/.el-table .el-table__header-wrapper th{
//   background-color: #ffffff;
// }
</style>