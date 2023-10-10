<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <div class="panelGroup-item-box flex justify-between items-center">
        <div class="number-name">
          <span>{{ companyCount }}<em>个</em></span>
          <small>企业账号数量</small>
        </div>
        <div class="icon-picture">
          <img src="@/assets/image/home_gold/icon01.png" />
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="panelGroup-item-box flex justify-between items-center">
        <div class="number-name">
          <span>{{ userCount }}<em>个</em></span>
          <small>用户数量(启动/禁用)</small>
        </div>
        <div class="icon-picture">
          <img src="@/assets/image/home_gold/icon02.png" />
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="panelGroup-item-box flex justify-between items-center">
        <div class="number-name">
          <span>{{ todayLoginCount }}<em>个</em></span>
          <small>当日登录账号</small>
        </div>
        <div class="icon-picture">
          <img src="@/assets/image/home_gold/icon03.png" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mainCount_API } from "@/api/modules/super/index"
export default {
  name: "panelGroup",
  data(){
    return{
      companyCount:0,//企业账号数量
      userCount:0,//用户数量(启动/禁用)
      todayLoginCount:0 //当日登录账号
    }
  },
  created(){
    this.getData();
  },
  methods:{
    getData(){
      mainCount_API().then(res=>{
        this.companyCount = res.companyCount;
        this.userCount = res.userCount;
        this.todayLoginCount = res.todayLoginCount;
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.panelGroup-item-box {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  background-color: #ffffff;
  padding: 20px;
  transition: all 300ms ease-in-out;
  .number-name {
    span {
      display: block;
      color: #525bff;
      font-size: 20px;
      em {
        display: inline-block;
        font-style: normal;
        margin-left: 10px;
      }
    }
    small {
      color: #909399;
      font-size: 14px;
      display: block;
      margin-top: 4px;
    }
  }
}
.panelGroup-item-box:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>