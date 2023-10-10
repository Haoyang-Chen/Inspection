<template>
  <div class="baiMapBox" id="baiMapBox" style="background-color: transparent;" v-loading="loading"></div>
</template>

<script>
export default {
  name: 'baiMap',
  props: ['mapType', 'visibleType'],
  watch: {
  },
  data () {
    return {
      loading: false,
      sosList: [],
      correctList: [],
      labelList: [],
      workList: [],
      collectPersons: [],
      circleList: [],
      circleDangerList: [],
      polygonList: [],
      polygonDangerList: [],
      heatmapOverlayPointList: [],
      drawingModes: [],
      polylineAddMarkerListAll: [],
      polylineAddMarkerList: [],
      drawManageOverlays: null,
      markerClusterer: null,
      drawingManager: null,
      map: null,
      heatmapOverlay: null,
      lushu: null,
      a1: '',
      b1: '',
      a2: '',
      b2: '',
      polygon: null
    }
  },
  mounted () {
    this.handlerBMap()
  },
  methods: {
    clearOverlaysAll () {
      this.map.clearOverlays()
      this.collectPersons = []
      this.heatmapOverlayPointList = []
      this.polygonList = []
      this.circleList = []
    },
    addMarker (data) { // 点
      let point = new BMap.Point(data.point[0], data.point[1])
      let marker
      if (data.icon) {
        let myIcon = new BMap.Icon(data.icon, new BMap.Size(32, 32))
        marker = new BMap.Marker(point, { icon: myIcon }) // 创建标注
        let infoWindow = null
        if (data.user) {
          marker.addEventListener('click', e => {
            const html = `<div class="userInformationBox" onclick="document.getElementById('t1').click();return false;">
                    <div class="userInformationBox-body">
                      <p>名称：${data.user.compName || ''}</p>
                      <p>地址：${data.user.streetId || ''}</p>
                      <p>联系人：${data.user.corporationName || ''}</p>
                      <p>电话：${data.user.corporationMobile || ''}</p>
                    </div>
                  </div>`
            this.map.centerAndZoom(point, 18)
            infoWindow = new BMap.InfoWindow()
            // infoWindow.setHeight(500)
            infoWindow.setContent(html)
            this.map.openInfoWindow(infoWindow, point)
            setTimeout(() => {
              this.map.closeInfoWindow()
            }, 10000)
          })
        }
        if (data.label) {
          let label = new BMap.Label(data.label, { offset: new BMap.Size(0, -15) })
          marker.setLabel(label)
          label.setStyle({ cursor: 'pointer' })
        }
      } else {
        marker = new BMap.Marker(point)
      }
      if (data.zIndex) {
        marker.setZIndex(data.zIndex)
      }
      this.collectPersons.push(marker)
      if (data.arrLen === 1) {
        this.map.addOverlay(marker)
      } else if (data.recycleDefault && data.arrLen > 1) {
        this.clustererMarker()
      }
      return [marker]
    },
    clustererMarker () { // 点聚合
      if (this.markerClusterer && this.collectPersons.length > 0) {
        this.markerClusterer.clearMarkers(this.collectPersons)
      }
      this.markerClusterer.addMarkers(this.collectPersons)
      // this.collectPersons = []
      return this.markerClusterer
    },
    useHeatmapOverlay () { // 热力图
      if (this.heatmapOverlay) {
        this.heatmapOverlay.hide()
        this.map.removeOverlay(this.heatmapOverlay)
        this.heatmapOverlay = null
      }
      let that = this
      this.heatmapOverlay = new BMapLib.HeatmapOverlay({ radius: 50 })
      this.map.addOverlay(this.heatmapOverlay)
      this.heatmapOverlay.setDataSet({
        data: that.heatmapOverlayPointList,
        max: 100
      })
      this.dingXiang({ lng: that.heatmapOverlayPointList[that.heatmapOverlayPointList.length - 1].lng, lat: that.heatmapOverlayPointList[that.heatmapOverlayPointList.length - 1].lat })
      // this.heatmapOverlayPointList = []
    },
    addHeatmapOverlay (val) {
      this.heatmapOverlayPointList = val
      console.log(this.heatmapOverlayPointList)
      this.useHeatmapOverlay()
    },
    addCircle (data, length) { // 圆
      const point = new BMap.Point(data.lng, data.lat)
      let circle = new BMap.Circle(point, length, data.opt || {})
      data.opt.type === 1
        ? this.circleList.push(circle)
        : this.circleDangerList.push(circle)
      this.map.addOverlay(circle)
    },
    addPolygon (data, opt) { // 多边形
      const bMaps = []
      data.forEach(value => {
        bMaps.push(new BMap.Point(value.lng, value.lat))
      })
      const polygon = new BMap.Polygon(bMaps, opt)
      opt.type === 1
        ? this.polygonList.push(polygon)
        : this.polygonDangerList.push(polygon)
      this.map.addOverlay(polygon)
    },
    useOpenInfoWindow (data, lng, lat) { // 添加一个窗口
      console.log(lng, lat)
      const html = `<div class="userInformationBox" onclick="document.getElementById('t1').click();return false;">
                    <div class="userInformationBox-body">
                      <p>名称：${data.page.compName || ''}</p>
                      <p>地址：${data.page.streetId || ''}</p>
                      <p>联系人：${data.page.corporationName || ''}</p>
                      <p>电话：${data.page.corporationMobile || ''}</p>
                    </div>
                  </div>`
      let pLngLat = new BMap.Point(lng, lat)
      this.map.centerAndZoom(pLngLat, 18)
      let infoWindow = new BMap.InfoWindow()
      infoWindow.setHeight(500)
      infoWindow.setContent(html)
      this.map.openInfoWindow(infoWindow, pLngLat)
      setTimeout(() => {
        this.map.closeInfoWindow()
      }, 5000)
    },
    useCenterAndZoom (...points) { // 对焦
      if (!(points && points.length > 0)) {
        return
      }
      const bPoints = points.map(v => {
        if (v.lng && v.lat) {
          return new BMap.Point(v.lng, v.lat)
        }
      })
      const view = this.map.getViewport(bPoints)
      this.map.centerAndZoom(view.center, 18)
    },
    dingXiang (val) { // 视窗移动到指定点
      this.map.centerAndZoom(new BMap.Point(val.lng, val.lat), 18)
    },
    handlerBMap () { // 初始化
      // this.map = new BMap.Map('baiMapBox', { mapType: BMAP_SATELLITE_MAP }) // 创建Map实例
      this.loading = true
      let that = this
      this.map = new BMap.Map('baiMapBox') // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(119.98186101, 31.77139674), 15)
      // this.map.setMinZoom(9)
      this.map.setCurrentCity('台州')
      this.map.enableScrollWheelZoom(true)
      console.log(this.mapType)
      this.map.addControl(new BMap.MapTypeControl({
        mapTypes: [
          BMAP_NORMAL_MAP,
          BMAP_HYBRID_MAP
        ]      }))
      if (this.mapType === 'location') {
        this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
          markers: []
        })
      }
      if (
        this.mapType === 'enclosureDialog' ||
        this.mapType === 'labelManagementDialog'
      ) {
        this.addDraw()
      }
      if (this.mapType === 'EnterpriseInformation' && this.visibleType !== 'see') {
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
          {
            "input": "suggestId",
            "location": this.map
          });

        ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
          var str = "";
          var _value = e.fromitem.value;
          var value = "";
          if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
          }
          str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

          value = "";
          if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
          }
          str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
          // G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
          var _value = e.item.value;
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
          // G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

          setPlace();
        });

        function setPlace () {
          that.map.clearOverlays();    //清除地图上所有覆盖物
          function myFun () {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            console.log(pp)
            that.$emit('getPoint', pp)
            that.map.centerAndZoom(pp, 18);
            that.map.addOverlay(new BMap.Marker(pp));    //添加标注
          }
          var local = new BMap.LocalSearch(that.map, { //智能搜索
            onSearchComplete: myFun
          });
          local.search(myValue);
        }
      }
      that.loading = false
    },
    getPoint () { // 获取当前经纬度
      let that = this
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) { // 获取当前位置
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          that.loading = false
          that.map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 15)
          that.$emit('mapOk')
        } else {
          that.loading = false
          that.map.centerAndZoom(new BMap.Point(119.98186101, 31.77139674), 15)
          that.$emit('mapOk')
        }
      }, { enableHighAccuracy: true })
    },
    addDraw () { // 画图工具
      let drawingModes
      if (this.mapType === 'enclosureDialog') {
        drawingModes = [
          BMAP_DRAWING_CIRCLE, // 画圆
          BMAP_DRAWING_POLYGON, // 画多边形
          BMAP_DRAWING_RECTANGLE // 画矩形
        ]
      } else {
        drawingModes = [
          BMAP_DRAWING_MARKER // 画点
        ]
      }
      const drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: true, // 是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
          offset: new BMap.Size(0, 5), // 偏离值
          scale: 0.8, // 工具栏缩放比例
          drawingModes: drawingModes
        }
      })
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      drawingManager.addEventListener('overlaycomplete', e => {
        if (
          this.drawManageOverlays ||
          this.circleList.length > 0 ||
          this.polygonList.length > 0 ||
          this.collectPersons.length > 0
        ) {
          this.removeOverlayAddDraw()
        }
        this.drawManageOverlays = e.overlay
        console.log(this.drawManageOverlays, e)
        this.$emit('drawingSuccess', e, this.drawManageOverlays)
      })
      this.drawingManager = drawingManager
      return drawingManager
    },
    removeOverlayAddDraw () { // 清空画图
      if (this.map) {
        if (this.circleList.length > 0 || this.polygonList.length > 0) {
          this.circleList.length > 0
            ? this.circleList.map(res => {
              this.map.removeOverlay(res)
            })
            : this.polygonList.map(res => {
              this.map.removeOverlay(res)
            })
        }
        if (this.collectPersons.length > 0) {
          this.collectPersons.map(res => {
            this.map.removeOverlay(res)
          })
        }
        this.map.removeOverlay(this.drawManageOverlays)
      }
    },
    openDraw () { // 开启画图模式
      this.drawingManager.open()
    },
    closeDraw () { // 停止画图模式
      this.drawingManager.close()
    },
    openBut () { // 开启拉框
      this.map.setDefaultCursor('crosshair')
      this.map.disableDragging()
      this.register()
    },
    closeBut () { // 关闭拉框
      this.map.setDefaultCursor("url('bird.cur')")
      this.map.enableDragging()
      this.cancellation()
    },
    huafang (e) { // 拖动事件
      if (this.polygon) {
        this.map.removeOverlay(this.polygon)
        this.polygon = null
      }
      this.a2 = e.point.lng
      this.b2 = e.point.lat
      this.polygon = new BMap.Polygon([
        new BMap.Point(this.a1, this.b1),
        new BMap.Point(this.a2, this.b1),
        new BMap.Point(this.a2, this.b2),
        new BMap.Point(this.a1, this.b2)
      ], {
        strokeColor: 'blue',
        strokeWeight: 6,
        strokeOpacity: 0.5
      });
      this.map.addOverlay(this.polygon)
    },
    mousedownEvent (e) { // 点击事件
      this.a1 = e.point.lng
      this.b1 = e.point.lat
      this.beginMove()
    },
    mousemoveEvent (e) { // 松开事件
      let polygon = [
        { lng: this.a1, lat: this.b1 },
        { lng: this.a2, lat: this.b1 },
        { lng: this.a2, lat: this.b2 },
        { lng: this.a1, lat: this.b2 }
      ]
      this.$emit('mouseEvent', polygon, this.polygon)
      this.a1 = ''
      this.a2 = ''
      this.b1 = ''
      this.b2 = ''
      this.map.removeEventListener('mousemove', this.huafang)
      this.map.removeOverlay(this.polygon)
      this.polygon = null
    },
    beginMove () { // 注册鼠标拖到事件
      this.map.addEventListener('mousemove', this.huafang)
    },
    register () { // 注册鼠标点击松开事件
      this.map.addEventListener('mousedown', this.mousedownEvent)
      this.map.addEventListener('mouseup', this.mousemoveEvent)
    },
    cancellation () { // 注消鼠标点击松开事件
      this.map.removeEventListener('mousedown', this.mousedownEvent)
      this.map.removeEventListener('mouseup', this.mousemoveEvent)
    }
  }
}
</script>

<style lang='scss' scoped>
.baiMapBox {
  width: 100%;
  height: 100%;
  .bm-view {
    height: 100%;
  }
}
</style>
