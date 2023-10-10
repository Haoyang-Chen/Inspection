<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-card shadow="never" :style="{ height: height }">
            <div class="card-header">
              <span>风险评估算法</span>
            </div>
            <el-menu
              :default-active="active"
              class="el-menu-vertical-demo"
              @select="handleSelect">
              <el-menu-item v-for="item in menuList" :key="item.value" :index="item.value">
                <span slot="title">{{ item.label }}</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </el-col>
        <el-col :span="20">
          <el-card shadow="never" class="con" :style="{ height: height }">
            <div class="card-header">
              <span>{{ active }}算法</span>
            </div>
            <ls-from v-show="active === 'LS'" v-model="form" @submitSuccess="getAlgorithm"></ls-from>
            <lec-from v-show="active === 'LEC'" v-model="form" @submitSuccess="getAlgorithm"></lec-from>
            <mes-from v-show="active === 'MES'" v-model="form" @submitSuccess="getAlgorithm"></mes-from>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { algorithm } from "@/api/modules/risk/algorithm";
import LsFrom from "@/views/components/risk/basic/algorithm/ls";
import LecFrom from "@/views/components/risk/basic/algorithm/lec";
import MesFrom from "@/views/components/risk/basic/algorithm/mes";

export default {
  components: {
    LsFrom,
    LecFrom,
    MesFrom
  },
  data() {
    return {
      height: document.body.offsetHeight - 130 + 'px',
      active: "LS",
      // 左侧栏目
      menuList: [
        { label: 'LS算法', value: "LS" },
        { label: 'LEC算法', value: "LEC" },
        { label: 'MES算法', value: "MES" }
      ],
      // 表单参数
      form: {},
      algorithm: {}
    }
  },
  watch: {},
  created() {
    this.getAlgorithm();
  },
  methods: {
    /** 获取算法 */
    getAlgorithm() {
      algorithm().then(res => {
        var result = res.result;
        if (result) {
          this.algorithm = result;
          this.setAlgorithmForm();
        }
      })
    },
    /** tab切换 */
    handleSelect(key, keyPath) {
      this.active = keyPath[0];
      this.setAlgorithmForm();
    },
    /** 设置算法 */
    setAlgorithmForm() {
      if (this.active === 'LS') {
        this.form = this.algorithm.lsAlgorithmModel;
      } else if (this.active === 'LEC') {
        this.form = this.algorithm.lecAlgorithmModel;
      } else {
        this.form = this.algorithm.mesAlgorithmModel;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-header {
  padding-bottom: 20px;
}
.el-menu {
  border-right: 0;
}
.con {
  overflow-y: scroll
}
/deep/ .el-input__inner {
  text-align: center;
  height: 32px;
  line-height: 32px;
}
.btn {
  text-align: center;
  margin-bottom: 20px;
  background: #f8f8f9;
}
</style>