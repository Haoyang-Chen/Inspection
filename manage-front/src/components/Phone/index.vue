<template>
  <el-dropdown trigger="hover">
    <div style="color:white;">
      <i class="el-icon-mobile-phone"></i>
    </div>
    <el-dropdown-menu style="width:200px;height:230px" slot="dropdown">
      <div class="qr-text">APP下载</div>
      <div class="qr-text qr-container">
        <div class="code">
          <vue-qr :text="appUrl" :size="140"></vue-qr>
        </div>
        <div style="padding: 0 10px">请使用手机浏览器或手机百度扫描下载</div>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { appQR } from "@/api/modules";
import VueQr from "vue-qr";

export default {
  name: "Phone",
  components: { VueQr },
  data() {
    return {
      // 遮罩层
      loading: true,
      // App下载地址
      appUrl: ""
    };
  },
  mounted() {
    this.getQR();
  },
  methods: {
    getQR() {
      appQR(this.queryParams).then(response => {
        const result = response.result;
        this.appUrl = result.url;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.qr-text {
  text-align: center;
  color: #a3a3a3;
  height: 20px;
  font-size: 14px;
  line-height: 20px;
}
.qr-container {
  display: flex;
  flex-direction: column;
  .code {
    padding-top: 8px;
  }
}
</style>
