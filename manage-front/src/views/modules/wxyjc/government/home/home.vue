<template>
  <div class="governmentHomeBox">
    <div class="leftBox">
      <div class="topBox">
        <div class="titleBox">数据接入统计</div>
        <div class="contText">已接入设备总数</div>
        <div class="contBigBox">
          <div
            class="contBox"
            v-for="(tem, index) in totalPersonNumberList"
            :key="index"
          >
            {{ tem }}
          </div>
        </div>
        <div class="echartsPieBox">
          <div
            id="myChartPie"
            :style="{ width: '100%', height: '100%' }"
            v-if="echartsType"
          ></div>
        </div>
      </div>
      <div class="bottomBox">
        <div class="titleBox">
          危化品实时储量
          <span style="color: #999; font-size: 12px">(鼠标滚动可缩放)</span>
        </div>
        <div class="echartsBarBox">
          <div
            id="myChartBar"
            :style="{ width: '100%', height: '100%' }"
            v-if="echartsType"
          ></div>
        </div>
      </div>
    </div>
    <div class="middleBox">
      <div class="mapBox">
        <h2>累计接入企业数量： {{ companyTotal }} 家</h2>
        <div class="baidu-map">
          <baidu-map
            v-bind:style="{ width: '100%', height: '100%' }"
            :ak="ak"
            :center="center"
            :zoom="zoom"
            :scroll-wheel-zoom="true"
            map-type="BMAP_NORMAL_MAP"
            @ready="handlerReady"
          >
            <bm-boundary
              :name="mapName"
              :strokeWeight="2"
              strokeColor="blue"
            ></bm-boundary>
            <bm-marker
              v-for="(item, index) in companyList"
              :key="index"
              :position="item.positionObj"
              @click="infoWindowOpen(item)"
            >
              <bm-info-window
                :show="item.isOpen"
                @close="infoWindowClose(item)"
              >
                <div class="map-content" @click="handleEdit(item.companyId)">
                  <div class="item"><span>名称</span>{{ item.compName }}</div>
                  <div class="item">
                    <span>联系人</span>{{ item.corporationName }}
                  </div>
                  <div class="item">
                    <span>电话</span>{{ item.corporationMobile }}
                  </div>
                </div>
              </bm-info-window>
            </bm-marker>
          </baidu-map>
        </div>
      </div>
    </div>
    <div class="rightBox">
      <div class="topBox">
        <div class="titleBox">最新报警信息</div>
        <div class="tableBox" ref="tableBox">
          <el-table :data="listInfo.dataList" max-height="300px">
            <el-table-column
              label="企业名称"
              align="center"
              prop="compName"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="设备编号"
              align="center"
              prop="deviceNo"
              width="90"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="最新报警时间"
              align="center"
              prop="collectTime"
              width="150"
            />
          </el-table>
        </div>
      </div>
      <div class="bottomBox">
        <div class="titleBox">
          报警统计
          <span style="color: #999; font-size: 12px">(鼠标滚动可缩放)</span>
        </div>
        <div class="echartsLineBox">
          <ChartTemplate ref="echartsLine" v-if="echartsType"></ChartTemplate>
        </div>
      </div>
    </div>
    <DialogCompany v-model="dialogVisible" ref="DialogCompany" />
  </div>
</template>

<script>
import { category_API } from "@/api/modules/wxyjc/wxyjcdangerousinfo";
import { deviceTotal_API } from "@/api/modules/wxyjc/wxyjctargetcode";
import {
  list_API,
  HistoricalTrendChart_API,
} from "@/api/modules/wxyjc/wxyjcwarninginformopt";

import { mapList_API } from "@/api/modules/wxyjc/wxyjcenterpriseinfo";

import ChartTemplate from "@/views/components/wxyjc/chart/chart";
import chart from "echarts";
import post from "@/assets/image/wxyjc/post.png";


import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
import BmInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
import DialogCompany from "@/views/components/wxyjc/common/dialogCompany";

import Vue from "vue";
import BaiduMap from "vue-baidu-map";
Vue.use(BaiduMap, {
  ak: "919b8890ece903b4e8ea9c756963b4a6",
});

export default {
  components: {
    chart,
    ChartTemplate,
    DialogCompany,
    BmMarker,
    BmInfoWindow,
    post,
  },
  computed: {
    /** 位置 */
    coordinate() {
      return this.$store.state.user.coordinate;
    },
    /** 百度地图ApiKey */
    ak() {
      return this.$store.state.common.bMapApiKey;
    },
    mapName() {
      return this.$store.state.user.province_city_area_Name;
    },
  },
  props: {
    zoom: {
      type: Number,
      default: 12,
    },
  },
  data() {
    return {
      dialogVisible: false,
      companyList: [],
      // 地图中心点位置
      center: undefined,
      // 百度地图对象
      BMap: undefined,
      // 地图实例对象
      map: undefined,
      echartsType: true,
      fullscreen: false,
      visible: false,
      dialogType: "see",
      companyTotal: 0,
      enterpriseMessage: null,
      setIntervalData10s: null,
      setIntervalData10min: null,
      totalPersonNumberList: ["0", "0", "0", "0", "0", "0"],
      governmentHomeTableData: {
        showIndex: true, // 是否显示序号
        selectionType: false, // 是否启用选框
        pagination: false, // 是否启用分页
        tableList: [
          {
            label: "企业名称",
            prop: "compName",
          },
          {
            label: "设备",
            prop: "deviceCategory",
          },
          {
            label: "报警时间",
            prop: "collectTime",
          },
        ],
      },
      listInfo: {
        dataList: [],
        listLoading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      colorList: ["#66CCFF", "#56DBB7", "#FFCC00"],
      pieList: [
        { name: "储罐", value: 0 },
        { name: "气体检测", value: 0 },
        { name: "危险工艺", value: 0 },
      ],
    };
  },
  created() {
    this.getCompanyTotal();
  },
  mounted() {
    this.getWarningInformOpt();

    this.getDangerousApparatus();
    this.drawBar();
    this.drawLine();

    this.startSetInterval10s();
    this.startSetInterval10min();
  },
  methods: {
    //搜索
    handleEdit(companyId) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["DialogCompany"].editTemp(companyId);
      });
    },
    handlerReady({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      this.center = { ...this.coordinate };
    },
    //弹窗
    infoWindowOpen(item) {
      console.log(item);
      item.isOpen = true;
    },
    infoWindowClose(item) {
      item.isOpen = false;
    },
    startSetInterval10s() {
      this.setIntervalData10s = setInterval(() => {
        this.getWarningInformOpt();
      }, 10000);
    },
    startSetInterval10min() {
      this.setIntervalData10min = setInterval(() => {
        this.getCompanyTotal();
        this.getDangerousApparatus();
        this.drawBar();
        this.drawLine();
      }, 600000);
    },
    stopSetInterval() {
      clearInterval(this.setIntervalData10s);
      clearInterval(this.setIntervalData10min);
      this.setIntervalData10s = null;
      this.setIntervalData10min = null;
    },
    getCompanyTotal() {
      mapList_API().then((res) => {
        let arr = res.result;
        this.companyTotal = arr.length;
        this.companyList = arr.map((item) => {
          return {
            id: item.id,
            companyId: item.companyId,
            compName: item.compName,
            lng: item.lng,
            lat: item.lat,
            provinceId: item.provinceId,
            cityId: item.cityId,
            areaId: item.areaId,
            streetId: item.streetId,
            corporationName: item.corporationName,
            corporationMobile: item.corporationMobile,
            position: [item.lng, item.lat],
            positionObj: {
              lng: item.lng,
              lat: item.lat,
            },
            isOpen: false,
          };
        });
      });
    },
    //数据接入统计
    drawPie() {
      // 饼图
      let that = this;
      let myChart = chart.init(document.getElementById("myChartPie"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}个",
        },
        toolbox: {
          show: false,
          feature: {
            mark: {
              show: true,
            },
            dataView: {
              show: true,
              readOnly: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
            },
          },
        },
        calculable: true,
        series: [
          {
            name: "设备",
            type: "pie",
            radius: ["0", "65%"],
            itemStyle: {
              normal: {
                color: function (params) {
                  return that.colorList[params.dataIndex];
                },
                label: {
                  //展示文本设置
                  normal: {
                    show: true, //展示
                    position: "outside", // outside表示文本显示位置为外部
                  },
                  emphasis: {
                    //文本样式
                    show: true, //展示
                    textStyle: {
                      //文本样式
                      fontSize: "14",
                      fontWeight: "600",
                    },
                  },
                },
                labelLine: {
                  //引导线设置
                  normal: {
                    show: true, //引导线显示
                  },
                },
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
            },
            data: this.pieList,
          },
        ],
      });
    },

    //危化品实时储量
    drawBar() {
      // 柱状图
      category_API().then((res) => {
        let dataList = res.result;
        if (dataList.length > 0) {
          let myChart = chart.init(document.getElementById("myChartBar"));
          myChart.setOption({
            tooltip: {
              trigger: "axis",
            },
            grid: {
              left: "5%",
              right: "10%",
              bottom: "8%",
              containLabel: true,
            },
            color: ["#3398DB"],
            xAxis: [
              {
                type: "category",
                data: dataList.map((item) => item.m1),
                axisTick: {
                  alignWithLabel: true,
                },
                axisLabel: {
                  rotate: 20,
                },
              },
            ],
            yAxis: {
              name: "实时储量（m³）",
              type: "value",
            },
            series: [
              {
                name: "",
                type: "bar",
                barWidth: "30%",
                data: dataList.map((item) => item.m2),
              },
            ],
            dataZoom: [
              {
                type: "inside",
              },
            ],
          });
        }
      });
    },
    drawLine() {
      // 折线图
      let shebeiData = [];
      HistoricalTrendChart_API({ flag: 1 }).then((res) => {
        shebeiData = res.result;
        let monthList = [];
        let num1List = [];
        let num2List = [];
        let num3List = [];
        shebeiData.map((item) => {
          monthList.push(item.month);
          num1List.push(item.cgnum); //重大危险源
          num2List.push(item.qtnum); //可燃有毒气体
          num3List.push(item.zznum); //危险工艺
        });
        if (shebeiData.length > 0) {
          let options = {
            tooltip: {
              trigger: "axis",
            },
            dataZoom: [
              {
                // 在内部可以横向拖动
                type: "inside",
                start: 0,
                end: 100,
                xAxisIndex: [0],
              },
            ],
            grid: {
              left: "5%",
              right: "15%",
              bottom: "8%",
              containLabel: true,
            },
            legend: {
              x: "center",
              y: "top",
              data: ["重大危险源", "可燃有毒气体", "危险工艺"],
            },
            color: ["#3695EE", "#FF9900", "#FF9999", "#CC0000"],
            xAxis: {
              name: "日期",
              type: "category",
              data: monthList,
              axisLabel: {
                rotate: 20,
              },
            },

            yAxis: {
              name: "数量",
              type: "value",
            },
            series: [
              {
                name: "重大危险源",
                type: "line",
                data: num1List,
              },
              {
                name: "可燃有毒气体",
                type: "line",
                data: num2List,
              },
              {
                name: "危险工艺",
                type: "line",
                data: num3List,
              },
            ],
          };
          this.$nextTick(() => {
            this.$refs.echartsLine.init(options);
          });
        }
      });
    },
    buzo(val) {
      if (val.length < 6) {
        val.unshift(0);
        this.buzo(val);
      }
    },

    //数据接入统计
    getDangerousApparatus() {
      //return false;
      deviceTotal_API().then((res) => {
        let arr = res.result;

        let numbers = arr.map((item) => {
          return item.num;
        });
        let newnumbers = numbers.reduce((preValue, n) => {
          return (preValue += n);
        }, 0);
        this.totalPersonNumberList = String(newnumbers).split("");
        this.buzo(this.totalPersonNumberList);

        this.pieList = [
          { name: "储罐", value: arr[0].num },
          { name: "气体检测", value: arr[1].num },
          { name: "危险工艺", value: arr[2].num },
        ];
        this.drawPie();
      });
    },

    //最新报警信息
    getWarningInformOpt() {
      list_API({ page: 1, limit: 1000000 }).then((res) => {
        this.listInfo.dataList = res.result.list;
      });
    },
    close() {
      this.visible = false;
    },
    toggle() {
      this.fullscreen = !this.fullscreen;
    },
  },
  destroyed() {
    this.stopSetInterval();
  },
};
</script>

<style  lang='scss' scoped>
.governmentHomeBox {
  padding: 20px;
  height: calc(100vh - 80px);
  min-height: 857px;
  .titleBox {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid #f8f8f8;
  }
  .leftBox {
    float: left;
    width: 350px;
    height: 100%;
    .topBox {
      height: calc(50% - 5px);
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 10px;
      .contText {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        text-align: center;
      }
      .contBigBox {
        margin-bottom: 10px;
        height: 60px;
        .contBox {
          width: calc(16.66% - 12px);
          height: 60px;
          line-height: 60px;
          text-align: center;
          font-size: 36px;
          font-weight: 700;
          color: #3aa0ff;
          float: left;
          margin-left: 10px;
          border: 1px solid #ddf4ff;
        }
      }
      .echartsPieBox {
        height: calc(100% - 150px);
      }
    }
    .bottomBox {
      height: calc(50% - 5px);
      background-color: #fff;
      border-radius: 10px;
      .echartsBarBox {
        height: calc(100% - 40px);
      }
    }
  }
  .middleBox {
    float: left;
    width: calc(100% - 700px);
    height: 100%;
    .mapBox {
      h2 {
        position: absolute;
        top: -10px;
        left: 10px;
        z-index: 10;
        color: #409eff;
        font-size: 18px;
      }
      width: calc(100% - 20px);
      height: 100%;
      border-radius: 10px;
      margin: 0 auto;
      background-color: #fff;
      position: relative;
      .baidu-map {
        height: 100%;
      }
    }
  }
  .rightBox {
    float: left;
    width: 350px;
    height: 100%;
    .topBox {
      height: calc(50% - 5px);
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 10px;
      .tableBox {
        padding: 0 10px;
        height: calc(100% - 40px);
      }
    }
    .bottomBox {
      height: calc(50% - 5px);
      background-color: #fff;
      border-radius: 10px;
      .echartsLineBox {
        height: calc(100% - 40px);
      }
    }
  }
}
.map-content {
  min-width: 400px;
  min-height: 100px;
  padding: 20px;
  background-color: #ffffff;
  color: #606266;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .item {
    line-height: 30px;
    span {
      display: inline-block;
      min-width: 100px;
      padding: 0 10px;
    }
  }
}
</style>
