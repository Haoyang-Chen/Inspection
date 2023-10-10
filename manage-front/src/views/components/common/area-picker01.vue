<template>
  <div class="flex">
    <el-form-item :label="labelTitle" prop="provinceId">
      <el-select
        v-model="form.provinceId"
        placeholder="所在省"
        @change="handleProvinceChange"
        :disabled="!editable"
        clearable
        style="width: 140px"
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
    <el-form-item prop="cityId" label-width="10px">
      <el-select
        v-model="form.cityId"
        placeholder="所在市"
        :disabled="!editable && form.cityId"
        @change="handleMarketChange"
        clearable
        style="width: 140px"
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
    <el-form-item prop="areaId" label-width="10px">
      <el-select
        v-model="form.areaId"
        placeholder="所在区"
        @change="handleCountyChange"
        clearable
        style="width: 140px"
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
    <el-form-item prop="streetId" label-width="10px">
      <el-select
        v-model="form.streetId"
        placeholder="所在乡镇"
        clearable
        style="width: 140px"
        @change="handleStreetChange"
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
import { listByParentId_API } from "@/api/common/area";
import { ORG_AREA } from "./utils";
export default {
  data() {
    return {
      form: this.value || { ...ORG_AREA },
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
    labelTitle: {
      type: String,
      default: "区域选择",
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
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
      this.form.cityId = undefined;
      this.form.areaId = undefined;
      this.form.streetId = undefined;
      this.getCitys();
      this.cityOpts = [];
      this.areaOpts = [];
      this.streetOpts = [];
    },
    handleMarketChange() {
      this.form.areaId = undefined;
      this.form.streetId = undefined;
      this.getAreas();
      this.areaOpts = [];
      this.streetOpts = [];
    },
    handleCountyChange() {
      this.form.streetId = undefined;
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
      if (this.form.provinceId) {
        let params = {
          parentId: this.form.provinceId,
        };
        listByParentId_API(params).then((res) => {
          this.cityOpts = res.result;
        });
      } else {
        this.cityOpts = [];
      }
      this.$forceUpdate();
    },
    getAreas() {
      if (this.form.cityId) {
        let params = {
          parentId: this.form.cityId,
        };
        listByParentId_API(params).then((res) => {
          this.areaOpts = res.result;
        });
      } else {
        this.areaOpts = [];
      }
      this.$forceUpdate();
    },
    getStreet() {
      if (this.form.areaId) {
        let params = {
          parentId: this.form.areaId,
        };
        listByParentId_API(params).then((res) => {
          this.streetOpts = res.result;
        });
      } else {
        this.streetOpts = [];
      }
      this.$forceUpdate();
    },
    handleStreetChange() {
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>