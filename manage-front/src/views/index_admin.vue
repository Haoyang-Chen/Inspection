<template>
  <div class="app-container app-container-bg">
    <PanelGroup ref="PanelGroup" />
    <el-row :gutter="20" class="mt20">
      <el-col :span="16">
        <Ytsxjrwtj ref="Ytsxjrwtj" :height="chartHeight" />
      </el-col>
      <el-col :span="8">
        <Jrzdwxy ref="Jrzdwxy" :height="chartHeight" />
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt20">
      <el-col :span="16">
        <Yhtj ref="Yhtj" :height="chartHeight" />
      </el-col>
      <el-col :span="8">
        <Zyptj ref="Zyptj" :height="chartHeight" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "@/views/dashboard/home_admin/panelGroup";
import Ytsxjrwtj from "@/views/dashboard/home_admin/ytsxjrwtj";
import Jrzdwxy from "@/views/dashboard/home_admin/jrzdwxy";
import Yhtj from "@/views/dashboard/home_admin/yhtj";
import Zyptj from "@/views/dashboard/home_admin/zyptj";
export default {
  name: "index_admin",
  components: {
    PanelGroup,
    Ytsxjrwtj,
    Jrzdwxy,
    Yhtj,
    Zyptj,
  },
  data() {
    return {
      chartHeight: (document.documentElement.clientHeight - 404) / 2 + "px",
    };
  },
};
</script>

<style lang="scss" scoped>
.app-container-bg {
  background-color: #f4f8f9;
}
</style>