<template>
  <div class="app-container">
    <div class="flex justify-center">
      <el-form :model="queryParams" ref="queryForm" :inline="true" size="small">
        <el-form-item>
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="changeTimeRange"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            icon="el-icon-search"
            @click="handleQuery()"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="time-list flex justify-around">
      <div v-for="(item, index) in timeList" :key="index">
        <span
          :class="{ isActive: active == index }"
          @click="handleTime(item, index)"
          >{{ item }}</span
        >
      </div>
    </div>

    <div class="baidu-map">
      <baidu-map
        class="bm-view"
        :center="coordinate"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
      >
        <bm-boundary
          :name="mapName"
          :strokeWeight="2"
          strokeColor="blue"
        ></bm-boundary>
        <bml-heatmap :data="mapDataList" :max="100" :radius="20"> </bml-heatmap>
      </baidu-map>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import BaiduMap from "vue-baidu-map";
import { BmlHeatmap } from "vue-baidu-map";
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: "919b8890ece903b4e8ea9c756963b4a6",
});

import { mapPtgList_API } from "@/api/modules/wxyjc/wxyjcenterpriseinfo";
import { getDateBetween } from "@/utils/wxyjc/utils/index";
import { formatDate } from "@/utils";
export default {
  components: {
    BmlHeatmap,
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
      queryParams: {},
      timeRange: [],
      // 地图中心点位置
      center: undefined,
      // 百度地图对象
      BMap: undefined,
      // 地图实例对象
      map: undefined,
      mapDataList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now() - 8.64e7;
        },
      },
      timeList: [],
      active: undefined,
    };
  },
  created() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
    this.timeRange = [start, end];
  },
  mounted() {
    this.timeList = getDateBetween(this.timeRange[0], this.timeRange[1]);
    this.active = this.timeList.length - 1;
    this.handleTime(formatDate(new Date(), false), this.active);
  },
  methods: {
    handlerReady({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      this.center = { ...this.coordinate };
    },
    handleQuery() {
      if (this.timeRange && this.timeRange.length == 2) {
        let params = {
          collectStartTime: formatDate(this.timeRange[1], false),
          collectEndTime: formatDate(this.timeRange[1], false),
        };
        this.active = this.timeList.length - 1;
        this.getList(params);
      } else {
        this.msgError("请输入时间");
      }
    },
    handleTime(time, index) {
      this.active = index;
      let params = {
        collectStartTime: time,
        collectEndTime: time,
      };
      this.getList(params);
    },
    getList(params) {
      mapPtgList_API(params).then((res) => {
        let arr = res.result;
        this.mapDataList = arr.map((item) => {
          return {
            lng: item.LNG,
            lat: item.LAT,
            count: item.count,
          };
        });
      });
    },
    changeTimeRange(time) {
      if (time) {
        this.timeList = getDateBetween(time[0], time[1]);
        if (this.timeList.length > 7) {
          this.msgError("输入的时间范围不能大于7天");
          this.timeRange = [];
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.baidu-map {
  width: 100%;
  height: calc(100vh - 236px);
}
.time-list {
  width: 800px;
  margin: 20px auto;
  position: relative;
  img {
    position: absolute;
    right: -40px;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    cursor: pointer;
  }
  .isActive {
    color: #409eff;
    font-weight: bold;
  }
  span {
    cursor: pointer;
  }
}
.bm-view {
  width: 100%;
  height: 100%;
}
</style>