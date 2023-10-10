<template>
  <div class="statistics">
    <div class="home-img">
      <div class="box box01">
        <b>今日发现问题总数</b>
        <CountTo :start-val="0" :end-val="wts" :duration="2000" />
      </div>
      <div class="box box02">
        <b>今日作业票总数</b>
        <CountTo :start-val="0" :end-val="allCount" :duration="3000" />
      </div>
      <div class="box box03">
        <b>今日巡检统计</b>
        <CountTo :start-val="0" :end-val="xjdsl" :duration="4000" />
      </div>
      <div class="box box04">
        <b>今日隐患统计</b>
        <CountTo :start-val="0" :end-val="yhzs" :duration="5000" />
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  components: {
    CountTo,
  },
  data() {
    return {
      xjdsl: 0,
      allCount: 0,
      wts: 0,
      yhzs: 0,//隐患汇总
    };
  },
  methods:{
    init(obj = {}){
      this.yhzs = obj.yhzs;
      this.wts = obj.wts;
      this.allCount = obj.allCount;
      // this.yhzs = obj.yhzs;
      // this.yhzs = obj.yhzs;
    },
    setXjdsl(val){
      this.xjdsl = val;
    }
  }
};
</script>


<style lang="scss" scoped>
.statistics {
  width: 500px;
  height: 344px;
  background: url("../../../assets/image/home/home_img.png") no-repeat center
    center;
  background-size: 100%;
  margin: 120px auto 0;
  position: relative;
  .box {
    width: 140px;
    text-align: center;
    b {
      color: #ffffff;
      opacity: 0.8;
      font-weight: normal;
      display: block;
    }
    span {
      display: block;
      color: #44b07b;
      margin-top: 4px;
    }
  }
  .box01 {
    position: absolute;
    left: -34px;
    top: 192px;
  }
  .box02 {
    position: absolute;
    left: 75px;
    top: -34px;
  }
  .box03 {
    position: absolute;
    right: 78px;
    top: -34px;
  }
  .box04 {
    position: absolute;
    right: -34px;
    top: 192px;
  }
}
@media (min-width: 1200px) and (max-width: 1500px) {
  .statistics {
    width: 424px;
    height: 292px;
    background-size: 100%;
    margin: 80px auto 0;
    font-size: 12px;
    .box01 {
      position: absolute;
      left: -38px;
      top: 166px;
    }
    .box02 {
      position: absolute;
      left: 38px;
      top: -28px;
    }
    .box03 {
      position: absolute;
      right: 56px;
      top: -28px;
    }
    .box04 {
      position: absolute;
      right: -38px;
      top: 166px;
    }
  }
}
</style>