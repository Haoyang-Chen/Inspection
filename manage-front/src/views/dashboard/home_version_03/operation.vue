<template>
  <div>
    <dv-scroll-board
      :config="config"
      :style="{ height: height, width: width }"
      ref="scrollBoard"
    />
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "180px",
    },
  },
  data() {
    return {
      config: {
        header: ["许可证种类", "数量"],
        headerBGC: "rgba(2,13,50,0.1)",
        oddRowBGC: "rgba(11,35,78,0.5)",
        evenRowBGC: "rgba(2,13,50,0.1)",
        data: [],
      },
    };
  },
  methods: {
    init(data = []) {
      let arr = [];
      if (data && data.length > 0) {
        data.forEach((item) => {
          arr.push([item.typeValue, item.count]);
        });
      }
      this.doUpdate(arr);
    },
    doUpdate (arr) {
      this.$refs['scrollBoard'].updateRows(arr, 0)
    }
  },
};
</script>


<style lang="scss" scoped>
/deep/.dv-scroll-board .rows .row-item{
  font-size: 12px;
  opacity: 0.85;
}
</style>