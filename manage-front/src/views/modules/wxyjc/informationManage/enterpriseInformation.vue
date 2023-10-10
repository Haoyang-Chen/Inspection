<template>
  <div class="app-container">
    <Qyjbxx ref="Qyjbxx"/>
  </div>
</template>

<script>
import Qyjbxx from "@/views/components/wxyjc/qyjbxx/qyjbxx";
export default {
  components: {
    Qyjbxx,
  },
  created(){
    //console.log(this.$store.state.user.companyId);
    let companyId = this.$store.state.user.companyId;
    this.$nextTick(()=>{
      this.$refs['Qyjbxx'].init(companyId);
    })
  },
};
</script>

<style lang="scss" scoped>
</style>