<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="危化品类别">
        <Whplb />
      </el-tab-pane>
      <el-tab-pane label="危化品储量">
        <Whpcl />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Whplb from "./components/whplb";
import Whpcl from "./components/whpcl";
export default {
  components: {
    Whplb,
    Whpcl,
  },
};
</script>

<style>
</style>