<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="mini">
      <el-form-item label="企业名称" prop="companyId">
        <el-select
          v-model="queryParams.companyId"
          clearable
          filterable
          placeholder="请选择"
          @change="changeCompanyId"
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
        <!-- <el-button type="primary" icon="el-icon-search" @click="handleQuery()"
          >搜索</el-button
        > -->
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          @click="resetQuery()"
          >重置数据</el-button
        >
      </el-form-item>
    </el-form>
    <div class="baidu-map">
      <amap
        cache-key="map"
        ref="map"
        view-mode="3D"
        map-style="amap://styles/normal"
        async
        :zoom.sync="mapData.zoom"
        :center.sync="mapData.center"
        :pitch.sync="mapData.pitch"
        :rotation.sync="mapData.rotation"
        :show-indoor-map="false"
        is-hotspot
        @hotspotclick="onHotspotClick"
      >
        <amap-marker
          v-for="(item, index) in companyList"
          :position="item.position"
          :key="index"
          @click="handleSetMarket(item)"
        />
        <amap-info-window
          :position="mapData.position"
          :offset="[0, -30]"
          auto-move
          is-custom
        >
          <div
            class="map-content"
            @click="handleEdit(mapData.content.companyId)"
          >
            <div class="item">
              <span>名称</span>{{ mapData.content.compName }}
            </div>
            <div class="item">
              <span>联系人</span>{{ mapData.content.corporationName }}
            </div>
            <div class="item">
              <span>电话</span>{{ mapData.content.corporationMobile }}
            </div>
          </div>
        </amap-info-window>
      </amap>
    </div>
    <DialogCompany v-model="dialogVisible" ref="DialogCompany" />
  </div>
</template>

<script>
import { mapList_API } from "@/api/modules/wxyjc/wxyjcenterpriseinfo";
import DialogCompany from "@/views/components/wxyjc/common/dialogCompany";
import { mapState } from "vuex";
export default {
  name: "companyMap",
  components: {
    DialogCompany,
  },
  computed: {
    ...mapState({
      lng: (state) => state.user.coordinate.lng,
      lat: (state) => state.user.coordinate.lat,
    }),
  },
  mounted(){
    this.mapData.center = [this.lng,this.lat];
    this.mapData.position = [this.lng,this.lat];
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
      mapData: {
        center: [116.400244,39.917813],
        position: [116.400244,39.917813],
        zoom: 14,
        pitch: 0,
        rotation: 0,
        content: {
          compName: undefined,
          corporationName: undefined,
          corporationMobile: undefined,
        },
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //搜索
    handleQuery() {},
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
            id: item.compName,
            companyId: item.companyId,
            compName: item.compName,
            lng: item.lng,
            lat: item.lat,
            provinceId: item.provinceId,
            cityId: item.cityId,
            areaId: item.areaId,
            streetId: item.streetId,
            position: [item.lng, item.lat],
            compName: item.compName,
            corporationName: item.corporationName,
            corporationMobile: item.corporationMobile,
          };
        });
        if (this.companyList && this.companyList.length > 0) {
          this.mapData.content = {
            compName: this.companyList[0].compName,
            corporationName: this.companyList[0].corporationName,
            corporationMobile: this.companyList[0].corporationMobile,
          };
        }
      });
    },
    onHotspotClick(e) {
      if (e && e.lnglat) {
        this.mapData.center = [e.lnglat.lng, e.lnglat.lat];
      }
    },
    handleSetMarket(value) {
      this.mapData.center = value.position;
      this.mapData.position = value.position;
      this.mapData.content = {
        companyId: value.companyId,
        compName: value.compName,
        corporationName: value.corporationName,
        corporationMobile: value.corporationMobile,
      };
    },
    changeCompanyId(companyId) {
      console.log(companyId);
      let arr = this.companyList.filter((item) => {
        return item.companyId == companyId;
      });
      if (arr && arr.length > 0) {
        if (arr[0].lng && arr[0].lat) {
          arr[0].position = [arr[0].lng, arr[0].lat];
        }
        if (arr[0].position == undefined || arr[0].position == "") {
          this.msgError("该企业没有定位");
        } else {
          this.mapData.center = arr[0].position;
          this.mapData.position = arr[0].position;
          this.mapData.content = {
            companyId: arr[0].companyId,
            compName: arr[0].compName,
            corporationName: arr[0].corporationName,
            corporationMobile: arr[0].corporationMobile,
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
.baidu-map{
  width: 100%;
  height: calc(100vh - 174px);
}
</style>