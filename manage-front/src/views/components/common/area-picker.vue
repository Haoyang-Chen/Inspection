<template>
  <div class="flex">
    <el-form-item label="所在省" prop="regProvinceCode" label-width="140px">
      <el-select
        v-model="form.regProvinceCode"
        placeholder="请选择"
        style="width: 156px"
        @change="handleProvinceChange"
        clearable
      >
        <el-option
          v-for="item in provinceOpts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所在市" prop="regMarketCode" label-width="100px">
      <el-select
        v-model="form.regMarketCode"
        placeholder="请选择"
        style="width: 156px"
        @change="handleMarketChange"
        clearable
      >
        <el-option
          v-for="item in cityOpts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所在区" prop="regCountyCode" label-width="100px">
      <el-select
        v-model="form.regCountyCode"
        placeholder="请选择"
        style="width: 156px"
        @change="handleCountyChange"
        clearable
      >
        <el-option
          v-for="item in areaOpts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所在乡镇" prop="regTownCode" label-width="100px">
      <el-select
        v-model="form.regTownCode"
        placeholder="请选择"
        style="width: 160px"
        clearable
      >
        <el-option
          v-for="item in streetOpts"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { listByParentId_API} from "@/api/common/area";
export default {
  data() {
    return {
      form: this.value,
      provinceOpts: [],
      cityOpts: [],
      areaOpts: [],
      streetOpts: [],
    };
  },
  props: {
    // 模型数据
    value: {
      type: Object,
    },
  },
  watch: {
    value: {
      handler(val) {
        this.form = val;
        this.getCitys();
        this.getAreas();
        this.getStreet();
      },
      immediate: true,
    },
  },
  created() {
    this.getProvinces();
  },
  methods: {
    handleProvinceChange() {
      this.form.regMarketCode = undefined;
      this.form.regCountyCode = undefined;
      this.form.regTownCode = undefined;
      this.getCitys();
      this.cityOpts = [];
      this.areaOpts = [];
      this.streetOpts = [];
    },
    handleMarketChange() {
      this.form.regCountyCode = undefined;
      this.form.regTownCode = undefined;
      this.getAreas();
      this.areaOpts = [];
      this.streetOpts = [];
    },
    handleCountyChange() {
      this.form.regTownCode = undefined;
      this.getStreet();
      this.streetOpts = [];
    },
    //获取第一个选择----省
    getProvinces() {
      listByParentId_API().then((res) => {
        this.provinceOpts = res.result;
      });
    },
    getCitys() {
      if (this.form.regProvinceCode) {
        let params = {
          parentId: this.form.regProvinceCode,
        };
        listByParentId_API(params).then((res) => {
          this.cityOpts = res.result;
        });
      } else {
        this.cityOpts = [];
      }
    },
    getAreas() {
      if (this.form.regMarketCode) {
        let params = {
          parentId: this.form.regMarketCode,
        };
        listByParentId_API(params).then((res) => {
          this.areaOpts = res.result;
        });
      }else{
          this.areaOpts = []
      }
    },
    getStreet() {
      if (this.form.regCountyCode) {
        let params = {
          parentId: this.form.regCountyCode,
        };
        listByParentId_API(params).then((res) => {
          this.streetOpts = res.result;
        });
      } else {
          this.streetOpts = []
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>