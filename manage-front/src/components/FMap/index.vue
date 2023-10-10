<template>
  <div id="fengMapD1" :style="{height: height}"></div>
</template>

<script>
var map = null;
export default {
  components: {},
  data () {
    return {
      loading: false
    }
  },
  props: {
    height: {
      type: String,
      default: "100%"
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.openMap();
  },
  methods: {
    /** 初始化地图 */
    openMap () {
      let fmapID = '1473183215222833153';
      map = new fengmap.FMMap({
        container: document.getElementById('fengMapD1'), // 设置显示地图容器
        // 设置本地地图数据的相对路径。对应的地图文件为:data/{fmapID}/{fmapID}.fmap
        mapServerURL: '/fmap/data/' + fmapID, // 地图数据位置
        mapThemeURL: '/fmap/data/theme', // 设置主题
        defaultThemeName: fmapID, // 设置默认主题
        appName: 'xhttxm', // 开发者应用名称
        modelSelectedEffect: false,
        defaultControlsPose: -80, // 地图默认旋转角度
        key: '43eb12914be019d05efdb5ea3b56d525' // 开发者申请应用下web服务的key
      })
      // console.log(map)
      // map.mapScaleLevel = 18;
      map.setBackgroundColor('', 0); // 设置地图背景色和透明度
      map.openMapById(fmapID);
      // 地图加载完成
      map.on('loadComplete', () => {
        // console.log('ok111')
        this.$emit('mapOK');
      })
      map.on('mapClickNode', (event) => {
        // console.log('event', event)
        if (this.editable) {
          var point = [event.eventInfo.coord.x, event.eventInfo.coord.y];
          this.addMarkerPoint({
            point: point,
            floor: map.focusGroupID,
          })
        }
      })
    },
    // 清空
    markImgRemoveAll(focusGroupID) {
      let groupLayer = map.getFMGroup(focusGroupID || map.focusGroupID); // 获取当前楼层
      let layerPolygon = groupLayer.getOrCreateLayer('polygonMarker');
      let layerImg = groupLayer.getOrCreateLayer('imageMarker');
      if (layerPolygon) {
        layerPolygon.removeAll();
      }
      if (layerImg) {
        layerImg.removeAll();
      }
    },
    addMarkerPoint(data) {
      // console.log('11', data);
      this.markImgRemoveAll();
      if (data.point[0] && data.point[1]) {
        let groupLayer = map.getFMGroup(data.floor || map.focusGroupID); // 获取当前楼层
        let layer = groupLayer.getOrCreateLayer('imageMarker');
        let im = new fengmap.FMImageMarker({
          // 标注x坐标点
          x: data.point[0], // 13353867.046750322,
          // 标注y坐标点
          y: data.point[1], // 3721876.313015636,
          // 设置图片路径
          url: data.img || '/fmap/image/redImageMarker.png',
          // 设置图片显示尺寸
          size: data.size || 32,
          // 标注高度，大于model的高度
          height: data.height || 0,
          callback: function () {
            // 在图片载入完成后，设置 "一直可见"，不被其他层遮挡
            im.alwaysShow()
          }
        });
        layer.addMarker(im);
        groupLayer.addLayer(layer); // 添加图片标注层到模型层。否则地图上不会显示
        this.$emit('setupComplete', data.point);
      }
    },
    /** 释放内存 */
    mapDispose() {
      if (map) {
        map.dispose();
      }
    }
  },
  destroyed () {
    if (map) {
      map.dispose();
    }
  }
}
</script>

<style  lang='scss' scoped>
#fengMapD {
  width: 100%;
  height: 100%;
}
.userInformationBox {
  color: #333 !important;
}
</style>
