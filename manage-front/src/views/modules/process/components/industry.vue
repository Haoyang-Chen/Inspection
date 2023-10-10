<template>
  <div class="flex">
    <el-form-item label="所属行业" prop="industryCategory" label-width="134px">
      <el-select
        v-model="ruleForm.industryCategory"
        placeholder="请选择"
        @change="handleCategoryChange"
      >
        <el-option
          v-for="item in industryCategoryList"
          :key="item.id"
          :label="item.industryName"
          :value="item.industryCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="industryLarge" label-width="10px">
      <el-select
        v-model="ruleForm.industryLarge"
        placeholder="请选择"
        @change="handleLargeChange"
      >
        <el-option
          v-for="item in industryLargeList"
          :key="item.id"
          :label="item.industryName"
          :value="item.industryCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="industryMiddle" label-width="10px">
      <el-select
        v-model="ruleForm.industryMiddle"
        placeholder="请选择"
        @change="handleMiddleChange"
      >
        <el-option
          v-for="item in industryMiddleList"
          :key="item.id"
          :label="item.industryName"
          :value="item.industryCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="industrySmall" label-width="10px">
      <el-select v-model="ruleForm.industrySmall" placeholder="请选择">
        <el-option
          v-for="item in industrySmallList"
          :key="item.id"
          :label="item.industryName"
          :value="item.industryCode"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { cfgindustry_API } from "@/api/modules/process/webcompanyinfo";
export default {
  name:"industry",
  props: {
    // 模型数据
    value: {
      type: Object,
      default: {},
    },
  },
  watch: {
    value: {
      handler(val) {
        this.ruleForm = val;
        this.getLargeList();
        this.getMiddleList();
        this.getSmallList();
      },
      immediate: false,
    },
  },
  data() {
    return {
      ruleForm: this.value,
      industryCategoryList: [], //门类
      industryLargeList: [], //大类
      industryMiddleList: [], //中类
      industrySmallList: [], //小类
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    //获取门类数据
    getCategoryList() {
      cfgindustry_API(0).then((res) => {
        this.industryCategoryList = res.result;
      });
    },
    //获取大类数据
    getLargeList(val) {
      if (this.ruleForm.industryCategory) {
        val = this.ruleForm.industryCategory;
      }
      cfgindustry_API(val).then((res) => {
        this.industryLargeList = res.result;
      });
    },
    //获取中类数据
    getMiddleList(val) {
      if (this.ruleForm.industryLarge) {
        val = this.ruleForm.industryLarge;
      }
      cfgindustry_API(val).then((res) => {
        this.industryMiddleList = res.result;
      });
    },
    //获取小类数据
    getSmallList(val) {
      if (this.ruleForm.industryMiddle) {
        val = this.ruleForm.industryMiddle;
      }
      cfgindustry_API(val).then((res) => {
        this.industrySmallList = res.result;
      });
    },
    //门类选择触发-获取大类数据
    handleCategoryChange(val) {
      this.ruleForm.industryLarge = "";
      this.ruleForm.industryMiddle = "";
      this.ruleForm.industrySmall = "";
      this.getLargeList(val);
      this.ruleForm.industryLargeList = [];
      this.ruleForm.industryMiddleList = [];
      this.ruleForm.industrySmallList = [];
    },
    //大类选择触发-获取中类数据
    handleLargeChange(val) {
      this.ruleForm.industryMiddle = "";
      this.ruleForm.industrySmall = "";
      this.getMiddleList(val);
      this.ruleForm.industryMiddleList = [];
      this.ruleForm.industrySmallList = [];
    },

    //中类选择触发-获取小类数据
    handleMiddleChange(val) {
      this.ruleForm.industrySmall = "";
      this.getSmallList(val);
      this.ruleForm.industrySmallList = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>