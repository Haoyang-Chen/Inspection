<template>
  <div class="app-container">
    <panel-group></panel-group>
    <el-row :gutter="24" class="mt20">
      <el-col :span="10">
        <alarm-type-pie-chart ref="alarmTypePieChart" :height="chartHeight"></alarm-type-pie-chart>
      </el-col>
      <el-col :span="14">
        <alarm-bar-chart ref="alarmBarChart" :height="chartHeight"></alarm-bar-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from '@/views/components/video/analysis/PanelGroup';
import AlarmTypePieChart from '@/views/components/video/analysis/alarmTypePieChart';
import AlarmBarChart from '@/views/components/video/analysis/alarmBarChart';

export default {
  components: {
    PanelGroup,
    AlarmTypePieChart,
    AlarmBarChart
  },
  data() {
    return {}
  },
  computed: {
    chartHeight() {
      return document.documentElement.clientHeight - 220- 128 + 'px'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.el-card {
  border: 0;
  border-radius: 0;
  /deep/ .el-card__header {
    border-bottom: 0;
  }
}
</style>
