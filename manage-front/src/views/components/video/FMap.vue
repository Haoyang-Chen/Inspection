<template>
  <div id="fengMapD" :style="{height: height}"></div>
</template>

<script>
var map = null;
export default {
  components: {},
  data () {
    return {
      loading: false,
      markerList: []
    }
  },
  props: {
    mapType: {
      required: false,
      default: ''
    },
    height: {
      type: String,
      default: "100%"
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
        container: document.getElementById('fengMapD'), // 设置显示地图容器
        // 设置本地地图数据的相对路径。对应的地图文件为:data/{fmapID}/{fmapID}.fmap
        mapServerURL: '/fmap/data/' + fmapID, // 地图数据位置
        mapThemeURL: '/fmap/data/theme', // 设置主题
        defaultThemeName: fmapID, // 设置默认主题
        appName: 'xhttxm', // 开发者应用名称
        modelSelectedEffect: false,
        defaultControlsPose: -80, // 地图默认旋转角度
        key: '43eb12914be019d05efdb5ea3b56d525' // 开发者申请应用下web服务的key
      })
      // console.log('map', map)
      // map.mapScaleLevel = 18;
      map.setBackgroundColor('', 0); // 设置地图背景色和透明度
      map.openMapById(fmapID);
      // 外部模型加载完成事件
      // map.on('gltfLoaded', () => {
      //   console.log('ok')
      //   // this.$emit('mapLoaded');
      // })
      map.on('loadComplete', () => {
        console.log('ok')
        // this.$emit('mapLoaded');
      })
      // map.on('mapClickNode', (event) => {
      //   console.log('event', event)
      //   // this.addMarkerPoint({
      //   //   point: [event.eventInfo.coord.x, event.eventInfo.coord.y],
      //   //   floor: map.focusGroupID,
      //   // })
      //   var coord = event.eventInfo.coord;
      //   var pointObject = this.markerList.find(item => item.lon === coord.x && item.lat === coord.y);
      //   // console.log('pointObject', pointObject)
      //   if (pointObject && pointObject.lon && pointObject.lat) {
      //     let html = ''
      //     html = `<div class="">
      //       <div style="color:#333;font-size: 13px;padding-bottom:5px;">
      //         人员姓名：${pointObject.name}
      //       </div>
      //       <div style="color:#333;font-size: 13px;padding-bottom:5px;">
      //         数据来源：${pointObject.dataSource}
      //       </div>
      //       <div style="color:#333;font-size: 13px;padding-bottom:5px;">人员状态：${pointObject.alarmTypeLabel ? pointObject.alarmTypeLabel:'安全'}</div>
      //       <div style="color:#333;font-size: 13px;">最新上报时间：${pointObject.utc}</div>
      //     </div>`
      //     var mark = { x: pointObject.lon, y: pointObject.lat };
      //     this.addPopInfoWindow(mark, html)
      //   }
      // })
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
      console.log('11', data);
      this.markImgRemoveAll();
      this.markerList = data;
      if (this.markerList.length > 0) {
        this.markerList.forEach(item => {
          let groupLayer = map.getFMGroup(data.floor || map.focusGroupID); // 获取当前楼层
          let layer = groupLayer.getOrCreateLayer('imageMarker');
          let im = new fengmap.FMImageMarker({
            // 标注x坐标点
            x: item.lon, // 13353867.046750322,
            // 标注y坐标点
            y: item.lat, // 3721876.313015636,
            // 设置图片路径
            url: '',
            // 设置图片显示尺寸
            size: item.size || 32,
            // 标注高度，大于model的高度
            height: item.height || 0,
            callback: function () {
              // 在图片载入完成后，设置 "一直可见"，不被其他层遮挡
              im.alwaysShow()
            }
          });
          layer.addMarker(im);
          groupLayer.addLayer(layer); // 添加图片标注层到模
        });
      }
    },
    addPopInfoWindow(marker, html) { // 添加信息窗
      if (marker) {
        // 添加绑定marker信息窗
        let ctlOpt = {
          mapCoord: {
            //设置弹框的x轴
            x: marker.x,
            //设置弹框的y轴
            y: marker.y,
            //控制信息框距离地图的高度
            height: 2,
            //设置弹框位于的楼层,当前聚焦楼层
            groupID: 1
          },
          // 设置弹框的宽度
          width: 220,
          // 设置弹框的高度px
          height: 120,
          // 设置弹框的内容，文本或html页面元素
          content: html,
          // 关闭回调函数
          closeCallBack: function () {
            // 信息窗点击关闭操作
            console.log('信息窗关闭了！');
          }
        };
      //   // 添加弹框到地图上，绑定marker
        let popMarker = new fengmap.FMPopInfoWindow(map, ctlOpt)
        // popMarker.close() // 关闭信息窗
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
