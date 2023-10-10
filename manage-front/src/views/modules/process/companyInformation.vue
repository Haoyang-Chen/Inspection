<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--title-->
      <el-col :span="24" :xs="24">
        <div class="header-button flex justify-between items-center">
          <span class="title">企业基本信息</span>
          <div v-if="ifAdmin === 1">
            <el-button type="primary" icon="el-icon-lock" size="small" @click="setLock">
              <span v-show="lock">编辑</span>
              <span v-show="!lock">只读</span>
            </el-button>
          </div>
        </div>
      </el-col>

      <el-col :span="24" :xs="24" style="margin-top:20px">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="企业基本信息" name="first">
            <Enterprise :isLOCK="lock"></Enterprise>
          </el-tab-pane>
          <el-tab-pane label="安全生产基本信息" name="second">
            <Product :isLOCK="lock"></Product>
          </el-tab-pane>
        </el-tabs>
      
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Enterprise from './components/enterprise';
import Product from './components/product';


export default {
  name:"companyInformation",
  data(){
    return{
      activeName: 'first',
      lock: true,
    }
  },
  components:{
    Enterprise,
    Product
  },
  computed: {
    ifAdmin() {
      return this.$store.state.user.ifAdmin;
    }
  },
  methods:{
    setLock(){
      this.lock = !this.lock;
    },
  }
}
</script>

<style lang="scss" scoped>
.header-button{
  .title{
    color: #303133;
    line-height: 28px;
    font-size: 16px;
  }
}
</style>