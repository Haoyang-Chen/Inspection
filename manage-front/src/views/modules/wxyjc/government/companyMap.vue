<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="companyId">
        <el-select
          v-model="queryParams.companyId"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.compName"
            :value="item.companyId"
          >
          </el-option>
        </el-select>
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
        <bm-marker
          v-for="(item, index) in companyList"
          :key="index"
          :position="item.positionObj"
          @click="infoWindowOpen(item)"
        >
          <bm-info-window :show="item.isOpen" @close="infoWindowClose(item)">
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

    <DialogCompany v-model="dialogVisible" ref="DialogCompany" />
  </div>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
import BmInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";

import { mapList_API } from "@/api/modules/wxyjc/wxyjcenterpriseinfo";
import DialogCompany from "@/views/components/wxyjc/common/dialogCompany";
export default {
  name: "companyMap",
  components: {
    DialogCompany,
    BaiduMap,
    BmMarker,
    BmInfoWindow,
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
      queryParams: {
        page: 1,
        limit: 1000,
        companyId: undefined,
      },
      companyList: [],
      // 地图中心点位置
      center: undefined,
      // 百度地图对象
      BMap: undefined,
      // 地图实例对象
      map: undefined,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handlerReady({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      this.center = { ...this.coordinate };
    },
    //弹窗
    infoWindowOpen(item) {
      console.log(item)
      item.isOpen = true;
    },
    infoWindowClose(item) {
      item.isOpen = false;
    },
    handleQuery(){
      this.changeCompanyId(this.queryParams.companyId);
    },
    //搜索
    handleEdit(companyId) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["DialogCompany"].editTemp(companyId);
      });
    },
    //重置
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },
    getList() {
      mapList_API().then((res) => {
        let arr = res.result;
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
    changeCompanyId(companyId) {
      let arr = this.companyList.filter((item, index) => {
        if (item.companyId == companyId) {
          this.companyList[index].isOpen = true;
        }
        return item.companyId == companyId;
      });
      if (arr && arr.length > 0) {
        if (arr[0].lng && arr[0].lat) {
          arr[0].position = [arr[0].lng, arr[0].lat];
        }
        if (arr[0].position == undefined || arr[0].position == "") {
          this.msgError("该企业没有定位");
        } else {
          this.center = {
            lng: arr[0].lng,
            lat: arr[0].lat,
          };
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
.baidu-map {
  width: 100%;
  height: calc(100vh - 174px);
}
</style>