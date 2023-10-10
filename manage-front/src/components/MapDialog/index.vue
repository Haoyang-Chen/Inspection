<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
    @closed="handleClosed"
  >
    <baidu-map
      v-bind:style="{ width: '100%', height: height }"
      :ak="ak"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      map-type="BMAP_HYBRID_MAP"
      @ready="handlerReady"
      @click="handleMapClick"
    >
      <bm-navigation v-if="showNavigation" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <bm-control v-if="showSearch" :offset="{width: 60, height: 15}">
        <el-autocomplete
          v-model="keyword"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          clearable
          placeholder="请输入搜索关键字"
          style="width:320px"
          @select="handleSelect"
        />
      </bm-control>
      <bm-panorama v-if="showPanorama" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-panorama>
      <bm-map-type
        v-if="showType"
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_TOP_RIGHT"
      ></bm-map-type>
      <bm-city-list v-if="showCitys" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-city-list>
      <bm-scale v-if="showScale" anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
      <bm-overview-map v-if="showOverview" anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
      <bm-geolocation
        v-if="showGeolocation"
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>
    </baidu-map>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="!editable" type="primary" @click="submit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmScale from "vue-baidu-map/components/controls/Scale.vue";
import BmNavigation from "vue-baidu-map/components/controls/Navigation.vue";
import BmMapType from "vue-baidu-map/components/controls/MapType.vue";
import BmOverviewMap from "vue-baidu-map/components/controls/OverviewMap.vue";
import BmGeolocation from "vue-baidu-map/components/controls/Geolocation.vue";
import BmCityList from "vue-baidu-map/components/controls/CityList.vue";
import BmPanorama from "vue-baidu-map/components/controls/Panorama.vue";
import BmControl from "vue-baidu-map/components/controls/Control.vue";
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";

export default {
  name: "MapDialog",
  components: {
    BaiduMap,
    BmScale,
    BmNavigation,
    BmMapType,
    BmOverviewMap,
    BmGeolocation,
    BmCityList,
    BmPanorama,
    BmControl,
    BmMarker
  },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: false
    },
    // 地图放大级别
    zoom: {
      type: Number,
      default: 20
    },
    // 是否显示搜索控件
    showSearch: {
      type: Boolean,
      default: true
    },
    // 是否显示比例尺控件
    showScale: {
      type: Boolean,
      default: true
    },
    // 是否显示缩放控件
    showNavigation: {
      type: Boolean,
      default: true
    },
    // 是否显示地图类型控件
    showType: {
      type: Boolean,
      default: true
    },
    // 是否显示缩略图控件
    showOverview: {
      type: Boolean,
      default: false
    },
    // 是否显示定位控件
    showGeolocation: {
      type: Boolean,
      default: true
    },
    // 是否显示城市切换控件
    showCitys: {
      type: Boolean,
      default: false
    },
    // 是否显示全景控件
    showPanorama: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 弹出层标题
      title: this.editable ? "重新定位" : "预览位置",
      // 是否显示弹出层
      visible: this.value,
      // 搜索关键字
      keyword: "",
      // 地图中心点位置
      center: undefined,
      // 地图中心点位置-地图未初始化前
      tempCenter: undefined,
      // 锚点位置
      position: undefined,
      // 百度地图对象
      BMap: undefined,
      // 地图实例对象
      map: undefined,
      // 是否需要重新定位
      reGeolocation: false
    };
  },
  computed: {
    /** 位置 */
    coordinate() {
      return this.$store.state.user.coordinate;
    },
    /** 百度地图ApiKey */
    ak() {
      return this.$store.state.common.bMapApiKey;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
    editable(val) {
      this.title = val ? "重新定位" : "预览位置";
    }
  },
  methods: {
    /** 重置相关值 */
    setup(location) {
      let coordinate;
      this.reGeolocation = false;
      if (location.lng == undefined) {
        if (this.coordinate.lng != undefined) {
          coordinate = { ...this.coordinate };
        } else {
          this.reGeolocation = true;
        }
      } else {
        coordinate = { ...location };
      }
      if (this.map) {
        let that = this;
        setTimeout(function() {
          if (that.reGeolocation) {
            that.reLocation();
          } else {
            that.center = { ...coordinate };
          }
          that.position = { ...location };
          that.setMarker(location);
        }, 1000 * 0.1);
      } else {
        this.tempCenter = { ...coordinate };
        this.position = { ...location };
      }
    },
    /** Dialog关闭动画结束时的回调 */
    handleClosed() {
      this.keyword = "";
      this.center = undefined;
      this.position = undefined;
      this.map.clearOverlays();
    },
    /** 地图初始化完成 */
    handlerReady({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      if (this.reGeolocation) {
        this.reLocation();
      } else {
        this.center = { ...this.tempCenter };
      }
      this.setMarker(this.position);
    },
    /** 重新定位 */
    reLocation() {
      let that = this;
      let geolocation = new that.BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          that.center = { lng: r.longitude, lat: r.latitude };
        },
        { enableHighAccuracy: true }
      );
    },
    /** 按关键字搜索 */
    querySearch(queryString, cb) {
      const options = {
        onSearchComplete: function(results) {
          if (local.getStatus() === 0) {
            // 判断状态是否正确
            const s = [];
            for (let i = 0; i < results.getCurrentNumPois(); i++) {
              const x = results.getPoi(i);
              const item = { value: x.address + x.title, point: x.point };
              s.push(item);
              cb(s);
            }
          } else {
            cb([]);
          }
        }
      };
      const local = new this.BMap.LocalSearch(this.map, options);
      local.search(queryString);
    },
    /** 选中搜索结果 */
    handleSelect(item) {
      const { point } = item;
      if (this.map) {
        this.map.centerAndZoom(point, this.zoom);
      }
    },
    /** 地图点击 */
    handleMapClick(ev) {
      if (this.editable) {
        this.setMarker(ev.point);
      }
    },
    /** 设置锚点 */
    setMarker(point) {
      if (this.map) {
        this.map.clearOverlays();
        this.map.addOverlay(new this.BMap.Marker(point));
        this.position = { ...point };
      }
    },
    /** 提交按钮 */
    submit() {
      this.$emit("completion", this.position);
      this.visible = false;
    }
  }
};
</script>
