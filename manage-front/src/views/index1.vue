<template>
  <div class="dashboard-container">
    <Header />
    <div>
      <Map />
    </div>
  </div>
</template>

<script>
import Header from "@/views/dashboard/home/Header";
import Map from "@/views/dashboard/home/Map";

export default {
  name: "Index",
  components: { Header, Map },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;
}
</style>
