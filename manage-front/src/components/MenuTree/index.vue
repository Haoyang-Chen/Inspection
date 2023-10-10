<template>
  <div>
    <el-row class="titles">
      <el-col :span="12">web菜单:</el-col>
      <el-col :span="12">app菜单:</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <tree
          class="trees"
          v-bind:style="{ height: height + 'px' }"
          :setting="treeSetting"
          :nodes="webMenus"
          @onCreated="webTreeCreated"
          @onClick="webTreeClick"
        />
      </el-col>
      <el-col :span="12">
        <tree
          class="trees"
          v-bind:style="{ height: height + 'px' }"
          :setting="treeSetting"
          :nodes="appMenus"
          @onCreated="appTreeCreated"
          @onClick="appTreeClick"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tree from "vue-giant-tree";

export default {
  name: "MenuTree",
  components: { tree },
  props: {
    // web菜单源数据
    webMenuSource: {
      type: Array,
      default: []
    },
    // app菜单源数据
    appMenuSource: {
      type: Array,
      default: []
    },
    // 选中菜单源数据
    checkedSource: {
      type: Array,
      default: []
    },
    height: {
      default: "350"
    }
  },
  data() {
    return {
      // web树对象
      webTreeObj: null,
      // web菜单源数据-内部
      webMenus: [...this.webMenuSource],
      // app树对象
      appTreeObj: null,
      // app菜单源数据-内部
      appMenus: [...this.appMenuSource]
    };
  },
  computed: {
    /** 树控件配置 */
    treeSetting() {
      return this.$store.state.common.treeSetting;
    }
  },
  watch: {
    webMenuSource(val) {
      this.webMenus = [...val];
    },
    appMenuSource(val) {
      this.appMenus = [...val];
    },
    checkedSource(val) {
      this.webMenus = [...this.webMenuSource];
      this.appMenus = [...this.appMenuSource];
      val.forEach(item => {
        const webIndex = this.webMenus.findIndex(f => f.menuId === item);
        const appIndex = this.appMenus.findIndex(f => f.menuId === item);
        if (webIndex >= 0) {
          const temp = { ...this.webMenus[webIndex], checked: true };
          this.webMenus.splice(webIndex, 1, temp);
        }
        if (appIndex >= 0) {
          const temp = { ...this.appMenus[appIndex], checked: true };
          this.appMenus.splice(appIndex, 1, temp);
        }
      });
    }
  },
  methods: {
    /** web菜单树初始化 */
    webTreeCreated: function(ztreeObj) {
      this.webTreeObj = ztreeObj;
    },
    /** app菜单树初始化 */
    appTreeCreated: function(ztreeObj) {
      this.appTreeObj = ztreeObj;
    },
    /** web菜单树点击折叠 */
    webTreeClick: function(evt, treeId, treeNode) {
      evt.preventDefault();
      this.webTreeObj.expandNode(treeNode);
    },
    /** app菜单树点击折叠 */
    appTreeClick: function(evt, treeId, treeNode) {
      evt.preventDefault();
      this.appTreeObj.expandNode(treeNode);
    },
    /** 获取所有菜单选中状态 */
    getAllChecked() {
      const webChecked = this.webTreeObj.getCheckedNodes(true);
      const appChecked = this.appTreeObj.getCheckedNodes(true);
      return [...webChecked, ...appChecked].map(m => {
        return m.menuId;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.titles {
  font-size: 15px;
  height: 25px;
}
.trees {
  overflow-y: auto;
}
</style>
