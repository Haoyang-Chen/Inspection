<template>
    <div :id="id" style="width: 100%; height: 100%"></div>
</template>

<script>
  import $ from 'jquery'
  import {getUUID} from '@/utils/wxyjc/utils'
  import chart from 'echarts'
  export default {
    name: 'chart-util',
    data () {
      return {
        chart: null,
        id: getUUID(),
        options: {}
      }
    },
    components: {chart},
    activated () {
    },
    methods: {
      init (options) {
        this.options = options
        this.$nextTick(() => {
          this.initChart()
        })
      },

      initChart () {
        this.echart = chart.init(document.getElementById(this.id))
        this.echart.setOption(this.options, true)
        $(window).resize(() => {
          this.echart.resize()
        })
      }
    }
  }
</script>

<style scoped>

</style>
