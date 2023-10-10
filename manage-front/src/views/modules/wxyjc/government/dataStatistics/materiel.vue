<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="储罐物料统计" name="materiel">
        <materialStatistics ref="materialStatistics" :cahartType="cahartType"></materialStatistics>
      </el-tab-pane>
      <el-tab-pane label="历史数据趋势图" name="history">
        <historicalData ref="historicalData" :historicalCahartType="historicalCahartType"></historicalData>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import historicalData from './components/historicalData'
import materialStatistics from './components/materialStatistics'
export default {
  components: {
    materialStatistics,
    historicalData
  },
  data () {
    return {
      activeName: 'materiel',
      cahartType: true,
      historicalCahartType: false,
    }
  },
  watch: {},
  created () { },
  mounted () { },
  methods: {
    handleClick (val) {
      if (val.name === 'history') {
        this.historicalCahartType = true
        this.cahartType = false
      } else {
        this.cahartType = true
        this.historicalCahartType = false
        this.$nextTick(() => {
          this.$refs.materialStatistics.init()
        })
      }
    }
  },
  destroyed () { }
}
</script>

<style  lang='scss' scoped>
</style>
