<template>
  <!--风险点数量变化趋势-->
    <div style="width: 100%;height: 100%">
        <chart v-if="dangerChartVisible" ref="dangerChartRef"></chart>
    </div>
</template>

<script>
  import Chart from './chart'
  import {LEVEL_COLOR} from '@/utils/wxyjc/utils/constant'
  export default {
    name: 'danger-line-chart',
    data () {
      return {
        dangerChartVisible: false,
        list: {
          dateSet: [],
          level1: [],
          level2: [],
          level3: [],
          level4: []
        }
      }
    },
    components: {Chart},
    mounted () {
      this.init()
    },
    methods: {
     /* getData (cb) {
        this.$http({
          url: this.$http.adornUrl('comp/compriskidentification/levelAnalysis'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            cb(data.result)
          } else {
            console.error('danger-line-chart init failed')
          }
        })
      },*/
      init () {
        this.dangerChartVisible = true
        /*this.getData((data) => {
          let list = data || this.list*/
          this.$nextTick(() => {
            let options = {
              title: {
                text: '温度变化趋势图'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                x: 'center',
                y: 'top',
                data: [ '最高温度', '平均温度', '最低温度','闪点高值','闪点低值']
              },
              grid: {
                left: '5%',
                right: '5%',
                bottom: '8%',
                containLabel: true
              },
              color: LEVEL_COLOR,
              xAxis: {
                type: 'category',
                data: [ '4', '8', '12', '16', '20']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: '最高温度',
                  type: 'line',
                  smooth: true,
                  data: [56,66,76,86]
                },
                {
                  name: '平均温度',
                  type: 'line',
                  smooth: true,
                  data: [50,30,56,66]
                },
                {
                  name: '最低温度',
                  type: 'line',
                  smooth: true,
                  data: [20,25,26,36]
                },
                {
                  name: '闪点高值',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                    opacity: 2,
                    type:'dotted'
                  },
                  data: [90,90,90,90,90]
                },
                {
                  name: '闪点低值',
                  type: 'line',
                  smooth: true,
                  lineStyle: {
                    opacity: 2,
                    type:'dotted'
                  },
                  data: [65,65,65,65,65]
                }
              ]
            }
            this.$refs.dangerChartRef.init(options)
          })
        //})
      }
    }
  }
</script>

<style scoped>

</style>
