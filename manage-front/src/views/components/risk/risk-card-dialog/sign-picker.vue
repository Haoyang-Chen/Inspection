<template>
  <ul class="sign-picker">
    <li v-for="(item, index) in signs" :key="index">
      <img :src="imgUrl + item.name" />
      <el-tooltip
        v-if="item.name && item.name.length"
        class="item"
        effect="dark"
        :content="item.name"
        placement="top"
      >
      </el-tooltip>
      <el-checkbox
        class="check-btn"
        v-model="item.checked"
        :disabled="editable ? false : item.checked ? false : true"
        @change="handleSignChange"
      ></el-checkbox>
    </li>
  </ul>
</template>

<script>
export default {
  name: "SignPicker",
  components: {},
  props: {
    value: {
      type: Array
    },
    editable: {
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
    handleSignChange(value) {
      const select = this.signs.filter(f => f.checked);
      this.$emit("change", select);
    }
  }
};
</script>

<style lang="scss" scoped>
.sign-picker {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
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
    p {
      width: 125px;
      margin-top: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
    .check-btn {
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }
}
/deep/ .el-checkbox__inner{
   border: 1px solid #1890ff
}
</style>
