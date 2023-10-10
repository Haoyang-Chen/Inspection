<template>
  <div class="header">
    <div class="title font">
      企业安全生产管控平台
    </div>
    <div class="date">
      <div class="time">{{ currentTime }}</div>
      <div style="text-align:right;display:flex">
        {{ currentDate }}
      </div>
      <div class="preview">
        <svg-icon :icon-class="screenfull?'exit-fullscreen':'fullscreen'" @click="handleClick" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentDate } from "@/views/modules/ins/utils";
import { mapState } from "vuex";

export default {
  name: "Header",
  components: {},
  data() {
    return {
      // 当前日期
      currentDate: getCurrentDate(),
      // 当前时间
      currentTime: ''
    };
  },
  computed: {
    ...mapState({
      screenfull: state => state.common.screenfull
    })
  },
  created() {},
  mounted() {
    this.nowTimes();
  },
  methods: {
    handleClick() {
      this.$store.dispatch("SetScreenfull", !this.screenfull);
    },
    /**
     * 动态显示当前日期
     */
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    timeFormate(timeStamp) {
      let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
      let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
      let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
      this.currentTime = hh + ":" + mm + ':' + ss ;
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  height: 100px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 0;
  background: url('~@/assets/image/dashboard/topbg.png') center no-repeat;
  background-size: 100% 100%;
  position: relative;
  .date {
    position: absolute;
    right: 2%;
    top: 20px;
    z-index: 9;
    display: flex;
    align-items: center;
    font-size: 14px;
    .time {
      margin-right: 15px;
      font-size: 20px;
    }
  }
  .decoration {
    object-fit: contain;
  }

  .left,
  .right {
    width: calc((100% - 26vw - 10px) / 2);
  }
  .title {
    font-size: 30px;
    text-align: center;
    letter-spacing: 3px;
  }
  .shadow {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.preview {
  cursor: pointer;
  padding-left: 15px;
}
.font {
  font-weight: bold;
  background-image: -webkit-linear-gradient(bottom, rgb(143, 221, 240), rgb(5, 201, 239));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
