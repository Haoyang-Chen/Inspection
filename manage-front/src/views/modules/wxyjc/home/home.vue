<template>
  <div class="enterprisetHomeBox">
    <div class="topBox">
      <div class="leftBox">
        <div class="titleBox">报警统计</div>
        <div class="echartsBox">
          <chart ref="echartsLine" v-if="echartsType"></chart>
        </div>
      </div>
      <div class="rightBox">
        <div class="titleBox">最新报警信息</div>
        <div class="tableBox" ref="tableBox">
          <el-table :data="listInfo.dataList">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50"
            />
            <el-table-column
              label="设备类型"
              align="center"
              prop="deviceCategory"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="设备编码"
              align="center"
              prop="deviceNo"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="最新报警时间"
              align="center"
              prop="collectTime"
              width="160"
            />
          </el-table>
        </div>
      </div>
    </div>
    <div class="bottomBox">
      <div class="bodyBox">
        <div class="titleBox">快捷入口</div>
        <div class="navBigBox">
          <div class="navBox" v-for="(tem, index) in navList" :key="index">
            <img
              :src="tem.img"
              alt
              width="100px"
              height="100px"
              style="cursor: pointer"
              @click="routerGo(tem.routerUrl)"
            />
            <div
              style="
                font-size: 18px;
                font-weight: 700;
                margin-top: 10px;
                cursor: pointer;
              "
            >
              {{ tem.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "@/views/components/wxyjc/chart/chart";

import t01 from "@/assets/image/wxyjc/t01.png";
import t02 from "@/assets/image/wxyjc/t02.png";
import t03 from "@/assets/image/wxyjc/t03.png";
import t04 from "@/assets/image/wxyjc/t04.png";
import t05 from "@/assets/image/wxyjc/t05.png";
import t06 from "@/assets/image/wxyjc/t06.png";

import { HistoricalTrendChart_API } from "@/api/modules/wxyjc/wxyjcwarninginformopt";
import { list_API } from "@/api/modules/wxyjc/wxyjcwarninginformopt";

export default {
  components: {
    Chart,
  },
  data() {
    return {
      enterprisetHomeRightData: {
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
            label: "最新报警时间",
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
      echartsType: true,
      navList: [
        {
          name: "企业基本信息",
          routerUrl: "/wxyjc/informationManage/enterpriseInformation",
          img: t01,
        },
        {
          name: "物料信息",
          routerUrl: "/wxyjc/informationManage/dangerousChemicals",
          img: t02,
        },
        {
          name: "重大危险源信息",
          routerUrl: "/wxyjc/majorHazards/dangerousSource",
          img: t03,
        },
        {
          name: "现场实时监控",
          routerUrl: "/wxyjc/company/majorHazardInstallations",
          img: t04,
        },
        { name: "报警处理", routerUrl: "/wxyjc/alarmProcessing", img: t05 },
        { name: "用户管理", routerUrl: "/sys/user", img: t06 },
      ],
    };
  },
  computed: {},
  mounted() {
    this.getalarmList();
    this.drawLine();
  },
  methods: {
    routerGo(url) {
      this.$router.push({ path: url });
    },
    getalarmList() {
      list_API({ page: 1, limit: 100 }).then((res) => {
        if (res.result.list.length > 8) {
          this.enterprisetHomeRightData.height =
            this.$refs.tableBox.offsetHeight - 31 + "";
        }
        this.listInfo.dataList = res.result.list;
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
          num1List.push(item.cgnum);
          num2List.push(item.qtnum);
          num3List.push(item.zznum);
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
  },
  destroyed() {},
};
</script>

<style  lang='scss' scoped>
.enterprisetHomeBox {
  height: calc(100vh - 40px);
  min-height: 852px;
  .titleBox {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid #f8f8f8;
  }
  .topBox {
    padding: 10px;
    height: calc(100% - 330px);
    .leftBox {
      float: left;
      width: calc(60% - 5px);
      height: 100%;
      background-color: #fff;
      border-radius: 10px;
      margin-right: 5px;
      .echartsBox {
        height: calc(100% - 40px);
        padding: 10px;
      }
    }
    .rightBox {
      float: left;
      width: calc(40% - 5px);
      height: 100%;
      background-color: #fff;
      border-radius: 10px;
      margin-left: 5px;
      .tableBox {
        height: calc(100% - 40px);
        padding: 0 10px 10px 10px;
      }
    }
  }
  .bottomBox {
    padding: 10px;
    height: 254px;
    .bodyBox {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: 10px;
      .navBigBox {
        height: calc(100% - 40px);
        padding: 25px 0;
        .navBox {
          width: 16.66%;
          float: left;
          border-right: 1px solid #e4e4e4;
          height: 100%;
          text-align: center;
        }
      }
    }
  }
}
</style>
