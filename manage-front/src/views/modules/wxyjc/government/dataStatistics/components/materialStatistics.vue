<template>
  <div class="materialStatisticsBox">
    <el-row class="mb10">
      <el-col :span="12" style="height: 400px">
        <div class="leftCard">
          <div class="leftCard-top">企业物料实时储量--物料类别</div>
          <div class="leftCard-body mt10" style="height:330px;overflow-y: auto;">
            <el-table :data="listInfo.dataList" border style="width: 100%">
              <el-table-column prop="m1" label="物料名称">
              </el-table-column>
              <el-table-column prop="m2" label="实时储量（m³）">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="height: 400px">
        <div class="rightCard">
          <div class="rightCard-top">企业物料实时储量--物料名称</div>
          <div class="rightCard-body mt10" style="height:330px;overflow-y: auto;">
            <el-table :data="listInfo2.dataList" border style="width: 100%">
              <el-table-column prop="m1" label="物料类别">
              </el-table-column>
              <el-table-column prop="m2" label="实时储量（m³）">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="height: 400px">
        <div class="leftCard">
          <div class="leftCard-top">
            根据物料类别实时统计储量
            <span style="color: #999; font-size: 12px">(鼠标滚动可缩放)</span>
          </div>
          <div class="leftCard-body">
            <div class="mt20" style="height: 320px; width: 100%">
              <chart ref="dangerChartRefLeft" v-if="cahartType"></chart>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="height: 400px">
        <div class="rightCard">
          <div class="rightCard-top">
            根据物料名称实时统计储量
            <span style="color: #999; font-size: 12px">(鼠标滚动可缩放)</span>
          </div>
          <div class="rightCard-body">
            <div class="mt20" style="height: 320px; width: 100%">
              <chart ref="dangerChartRefRight" v-if="cahartType"></chart>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  category_API,
  materialName_API,
} from "@/api/modules/wxyjc/wxyjcdangerousinfo";
import Chart from "@/views/components/wxyjc/chart/chart";

export default {
  components: {
    Chart,
  },
  data() {
    return {
      listInfo: {
        dataList: [],
        listLoading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      listInfo2: {
        dataList: [],
        listLoading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      colorList: [],
    };
  },
  props: {
    cahartType: {
      required: true,
      default: false,
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getCategoryList();
    this.getMaterialnameList();
  },
  methods: {
    getCategoryList() {
      category_API().then((res) => {
        this.listInfo.dataList = res.result;
        if (this.listInfo.dataList.length > 0) {
          this.initLeft();
        }
      });
    },
    getMaterialnameList() {
      materialName_API().then((res) => {
        this.listInfo2.dataList = res.result;
        if (this.listInfo2.dataList.length > 0) {
          this.initRight();
        }
      });
    },
    color16() {
      // 十六进制颜色随机
      var colorText = "#";
      var arr = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
      ];
      for (var i = 0; i < 6; i++) {
        var num = parseInt(Math.random() * 16);
        colorText += arr[num];
      }
      if (this.colorList.indexOf(colorText) === -1) {
        return colorText;
      } else {
        this.color16();
      }
    },
    initLeft() {
      this.$nextTick(() => {
        let options = {
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
              data: this.listInfo.dataList.map((res) => res.m1),
              axisTick: {
                alignWithLabel: true,
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
              data: this.listInfo.dataList.map((res) => res.m2),
            },
          ],
          dataZoom: [
            {
              type: "inside",
            },
          ],
        };
        this.$refs.dangerChartRefLeft.init(options);
      });
    },
    initRight() {
      this.$nextTick(() => {
        let options = {
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
              data: this.listInfo2.dataList.map((res) => res.m1),
              axisTick: {
                alignWithLabel: true,
              },
              // axisLabel: {
              //   rotate: 30, // 旋转30度
              // }
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
              data: this.listInfo2.dataList.map((res) => res.m2),
            },
          ],
          dataZoom: [
            {
              type: "inside",
            },
          ],
        };
        this.$refs.dangerChartRefRight.init(options);
      });
    },
  },
  destroyed() {},
};
</script>

<style  lang='scss' scoped>
.materialStatisticsBox {
  .leftCard {
    width: calc(100% - 5px);
    height: 400px;
    float: left;
    border: 1px solid #dfe4ed;
    border-radius: 10px;
    &-top {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid #dfe4ed;
    }
    &-body {
      padding: 0 10px 10px 10px;
      
    }
  }
  .rightCard {
    width: calc(100% - 5px);
    height: 400px;
    float: right;
    border: 1px solid #dfe4ed;
    border-radius: 10px;
    &-top {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid #dfe4ed;
    }
    &-body {
      padding: 0 10px 10px 10px;
    }
  }
}
</style>
