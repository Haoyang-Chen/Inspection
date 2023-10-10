<template>
  <div class="app-container materielHistoricalDataBox">
    <div class="title">工艺数据变化趋势图</div>
    <div style="text-align: center;">
      <span>企业名称:</span>
      <!-- <el-input
        clearable
        v-model="compName"
        class="mr10"
        style="width: 200px"
        placeholder="请输入企业名称"
      ></el-input> -->
      <el-select v-model="compName" placeholder="请选择" filterable clearable>
        <el-option
          v-for="item in companyList"
          :key="item.id"
          :label="item.compName"
          :value="item.compName"
        >
        </el-option>
      </el-select>
      <span>起止日期:</span>
      <el-date-picker
        class="mr10"
        v-model="timeData"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timeChange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-button
        class="filter-item"
        type="primary"
        :disabled="!compName || !collectStartTime || !collectEndTime"
        plain
        @click="search"
      >查询</el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
    </div>
    <div class="mt20" style="height:calc(100vh - 252px);width: 100%;min-height: 400px;">
      <chart ref="dangerChartRef" v-if="historicalCahartType"></chart>
    </div>
  </div>
</template>

<script>
import { HistoricalTrendChart_API } from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import { mapList_API } from "@/api/modules/wxyjc/wxyjcenterpriseinfo";
import Chart from "@/views/components/wxyjc/chart/chart";
export default {
  components: {
    Chart
  },
  data () {
    return {
      colorList: [],
      historicalCahartType: false,
      compName: null,
      collectStartTime: null,
      collectEndTime: null,
      timeData: [],
      companyList: [],
    }
  },
  created() {
    mapList_API().then((res) => {
      let arr = res.result;
      this.companyList = arr.map((item) => {
        return {
          id: item.id,
          compName: item.compName,
        };
      });
    });
  },
  methods: {
    search () { // 查询
      this.init()
    },
    reset () { // 重置
      this.timeData = []
      this.collectStartTime = null
      this.collectEndTime = null
      this.compName = null
    },
    timeChange (val) {
      if (val && val.length > 0) {
        var d1 = new Date(val[0]);
        var d2 = new Date(val[1]);
        var day = 1000 * 60 * 60 * 24;
        var diff = Math.ceil((d2.getTime() - d1.getTime()) / (day));
        if (diff + 1 > 7) {
          this.$message({
            message: '选择时间段需小于7天',
            type: 'warning'
          })
          this.timeData = []
          this.collectStartTime = null
          this.collectEndTime = null
        }
        this.collectStartTime = val[0]
        this.collectEndTime = val[1]
      } else {
        this.timeData = []
        this.collectStartTime = null
        this.collectEndTime = null
      }
    },
    init () {
      this.historicalCahartType = false
      this.historicalCahartType = true
      let params = {
        compName: this.compName,
        collectStartTime: this.collectStartTime,
        collectEndTime: this.collectEndTime
      }
      HistoricalTrendChart_API(params).then((res) => {
        console.log(res)
        let shebeiData = res.result
        let seriesList = []
        let timeList = []
        let equipmentList = []
        this.colorList = []
        shebeiData.map(res => {
          let data = {
            name: res.deviceNo,
            type: 'line',
            smooth: false,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            data: res.chartData.map(res => res.data)
          }
          let colorText = this.color16()
          this.colorList.push(colorText)
          timeList = res.chartData.map(res => res.collectTime)
          equipmentList.push(res.deviceNo)
          seriesList.push(data)
        })
        let options = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            x: 'center',
            y: 'bottom',
            data: equipmentList
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            containLabel: true
          },
          // color: this.colorList,
          xAxis: {
            name: '日期',
            type: 'category',
            data: timeList
          },
          yAxis: {
            name: '报警数量',
            type: 'value'
          },
          series: seriesList
        }
        this.$nextTick(() => {
          this.$refs.dangerChartRef.init(options)
        })
      })
    },
    color16 () { // 十六进制颜色随机
      var colorText = "#"
      var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]
      for (var i = 0; i < 6; i++) {
        var num = parseInt(Math.random() * 16)
        colorText += arr[num]
      }
      if (this.colorList.indexOf(colorText) === -1) {
        return colorText
      } else {
        this.color16()
      }
    }
  },
  destroyed () {
    console.log('销毁')
  }
}
</script>

<style  lang='scss' scoped>
.materielHistoricalDataBox {
  .title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
