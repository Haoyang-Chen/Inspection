<template>
  <viewer ref="viewer" :options="{ zIndex: 9999 }" :images="imageUrls">
    <template slot-scope="scope">
      <img
        v-for="src in scope.images"
        :src="src"
        :key="src"
        style="display:none"
      />
    </template>
  </viewer>
</template>

<script>
import Viewer from "v-viewer/src/component.vue";
import "viewerjs/dist/viewer.css";

export default {
  name: "ImageViewer",
  components: { Viewer },
  props: {
    // 图片数据
    images: {
      type: Array,
      default() {
        return [];
      }
    },
    // 图片预览uri
    uri: {
      type: String,
      default: "/file/show/"
    }
  },
  data() {
    return {};
  },
  computed: {
    imageUrls() {
      if (!this.images || !this.images.length) return [];
      const previewOperate = this.uri && this.uri ? this.uri : "/";
      return this.images.map(item => {
        if (!item.name) return "";
        if (item.name.includes("http") || item.name.includes("https"))
          return item.name;
        else return process.env.VUE_APP_BASE_API + previewOperate + item.name;
      });
    }
  },
  watch: {},
  methods: {
    /**
     * 展示图片
     * @param {Number} index 指定打开的图片index
     */
    show(index = undefined) {
      this.$nextTick(() => {
        if (index) {
          this.$refs["viewer"].$viewer.view(index);
        } else {
          this.$refs["viewer"].$viewer.show();
        }
      });
    }
  }
};
</script>
