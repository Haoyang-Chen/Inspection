<template>
  <div>
    <ul class="sign-display">
      <li v-for="(item, index) in signs" :key="index">
        <img :src="imgUrl + item.name" />
        <span
          class="el-icon-error delete-btn"
          @click="handleDelete(index, item)"
        ></span>
      </li>
    </ul>
    <el-divider v-if="dividerable && signs && signs.length" />
  </div>
</template>

<script>
export default {
  name: "SignDisplay",
  components: {},
  props: {
    value: {
      type: Array
    },
    editable: {
      type: Boolean,
      default: true
    },
    dividerable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      signs: this.value,
      imgUrl: process.env.VUE_APP_BASE_API + '/file/show/'
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.signs = val;
    },
    signs(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    handleDelete(idx, src) {
      this.signs.splice(idx, 1);
      this.$emit("delete", src);
    }
  }
};
</script>

<style lang="scss" scoped>
.sign-display {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  margin-top: -20px;
  margin-left: -10px;
  li {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 5px 10px 0 10px;
    img {
      width: 125px;
      height: 160px;
    }
    .delete-btn {
      position: absolute;
      top: 15px;
      right: 20px;
      cursor: pointer;
      font-size: 16px;
      color: rgba(153, 153, 153, 0.3);
      &:hover {
        color: #999;
      }
    }
  }
}
</style>
