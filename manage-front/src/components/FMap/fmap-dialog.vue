<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
    @closed="handleClosed"
  >
    <f-map
      ref="fMap"
      :height="height"
      :editable="editable"
      @setupComplete="handleSetup"
      @mapOK="mapOK"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="!editable" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FMap from "./index";

export default {
  name: "FMapDialog",
  components: { FMap },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "地图"
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: "61.8vw"
    },
    height: {
      type: String,
      default: "61.8vh"
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      marker: undefined,
      // 地图加载完成
      mapLoaded: false
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 地图加载完成回调 */
    mapOK() {
      this.mapLoaded = true;
      if (this.mapLoaded && this.marker) {
        this.setMarker(this.marker);
      }
    },
    handleClosed() {},
    /** 重置相关值 */
    setup(data) {
      this.marker = data;
      // console.log('mapLoaded', this.mapLoaded)
      if (this.mapLoaded) {
        this.setMarker(data);
      }
    },
    setMarker(data) {
      this.$nextTick(() => {
        this.$refs.fMap.addMarkerPoint({point: data, floor: 1});
      })
    },
    /** 获取地图点击坐标点 */
    handleSetup(val) {
      this.marker = val;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$emit("completion", this.marker);
      this.visible = false;
    }
  }
};
</script>
