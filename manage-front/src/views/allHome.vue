<template>
  <div>
    <IndexVersion01
      v-if="userName != '超级管理员' && ifGov != 1 && (version == 1 || version == 2 )"
    />
    <IndexVersion02
      v-if="userName != '超级管理员' && ifGov != 1 && (version == 3 || version == 4 )"
    />
    <!--专业版本-->
    <IndexVersion03
      v-if="userName != '超级管理员' && ifGov != 1 && version == 5"
    />

    <!--超级管理员首页-->
    <IndexAdmin v-if="userName == '超级管理员'" />

    <!--政府首页-->
    <IndexGovernment v-if="ifGov == 1" />
  </div>
</template>

<script>
import IndexVersion01 from "@/views/index_version_01";
import IndexVersion02 from "@/views/index_version_02";
import IndexVersion03 from "@/views/index_version_03";
import IndexAdmin from "@/views/index_admin";
import IndexGovernment from "@/views/modules/wxyjc/government/home/home";
import { mapState } from "vuex";
export default {
  name:'allHome',
  components: {
    IndexVersion01,
    IndexVersion02,
    IndexVersion03,
    IndexAdmin,
    IndexGovernment
  },
  computed: {
    ...mapState({
      userName: (state) => state.user.name,
      version: (state) => state.user.version,
      ifGov: (state) => state.user.ifGov,
    }),
  }
};
</script>

<style>
</style>