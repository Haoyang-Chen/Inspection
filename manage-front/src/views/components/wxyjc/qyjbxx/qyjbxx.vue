<template>
  <div>
    <div class="public-title">基本信息</div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      :size="size"
      :disabled="disabled"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="企业名称" prop="compName">
            <el-input v-model="ruleForm.compName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工商注册地址" prop="regAddress">
            <el-input v-model="ruleForm.regAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生产场所地址" prop="proAddress">
            <el-input v-model="ruleForm.proAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="行政区域" style="margin-bottom: 0">
            <AreaPicker
              :labelTitle="labelTitle"
              v-model="ruleForm"
            ></AreaPicker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="经度" prop="lng">
            <el-input v-model="ruleForm.lng" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="纬度" prop="lat" label-width="70px">
            <el-input v-model="ruleForm.lat" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-button plain icon="el-icon-folder-opened" @click="handleOpenMap()"
            >查看</el-button
          >
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码" prop="creditCode">
            <el-input v-model="ruleForm.creditCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立日期" prop="estabDate">
            <el-date-picker
              v-model="ruleForm.estabDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业类型" prop="enterpriseType">
            <el-select
              v-model="ruleForm.enterpriseType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in enterpriseTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业规模" prop="scaleSituation">
            <el-select
              v-model="ruleForm.scaleSituation"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in scaleSituationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业类别" prop="industryId">
            <el-select
              v-model="ruleForm.industryId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in industryIdList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经济类型" prop="economicType">
            <el-select
              v-model="ruleForm.economicType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in economicTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行政隶属关系" prop="subordination">
            <el-select
              v-model="ruleForm.subordination"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in subordinationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册资金（万元）" prop="registeredCapital">
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.registeredCapital"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监管层级" prop="regulatory">
            <el-select
              v-model="ruleForm.regulatory"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in regulatoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全风险等级" prop="safetyRiskLevel">
            <el-select
              v-model="ruleForm.safetyRiskLevel"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in safetyStandardLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="企业状态" prop="status">
            <el-select
              v-model="ruleForm.status"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全标准化等级" prop="safetyStandardLevel">
            <el-select
              v-model="ruleForm.safetyStandardLevel"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in safetyRiskLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否在化工园区内" prop="isIndustryPark">
            <el-radio-group v-model="ruleForm.isIndustryPark">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法定代表人" prop="legalName">
            <el-input v-model="ruleForm.legalName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主要负责人" prop="corporationName">
            <el-input v-model="ruleForm.corporationName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主要负责人联系方式" prop="corporationMobile">
            <el-input v-model="ruleForm.corporationMobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全负责人" prop="leaderName">
            <el-input v-model="ruleForm.leaderName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全负责人联系方式" prop="leaderMobile">
            <el-input v-model="ruleForm.leaderMobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全值班电话" prop="leaderPhone">
            <el-input v-model="ruleForm.leaderPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="从业人员数量" prop="employeesNumber">
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.employeesNumber"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否设置安全机构" prop="isSafetyMech">
            <el-radio-group v-model="ruleForm.isSafetyMech">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特种作业人员数量" prop="specialEmpNumber">
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.specialEmpNumber"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经营范围" prop="businessScope">
            <el-input v-model="ruleForm.businessScope"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="public-title">企业特性</div>
      <el-row class="form-box-02">
        <el-col :span="12">
          <el-form-item label="是否涉及重大危险源" prop="isHazardSources">
            <el-radio-group v-model="ruleForm.isHazardSources">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="重大危险源等级"
            prop="isHazardGrade"
            v-show="ruleForm.isHazardSources == 1"
          >
            <el-select v-model="ruleForm.isHazardGrade" placeholder="请选择">
              <el-option
                v-for="item in zdwxyjbList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否存在有限空间" prop="isFiniteSpace">
            <el-radio-group v-model="ruleForm.isFiniteSpace">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否涉及可燃爆粉尘作业"
            prop="isCombustibleOperation"
          >
            <el-radio-group v-model="ruleForm.isCombustibleOperation">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否涉及喷涂作业" prop="isSprayingInvolved">
            <el-radio-group v-model="ruleForm.isSprayingInvolved">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否涉氨制冷企业" prop="isAmmoniaRefrigeration">
            <el-radio-group v-model="ruleForm.isAmmoniaRefrigeration">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否船舶修造企业"
            prop="isShipbuildingEnterprise"
          >
            <el-radio-group v-model="ruleForm.isShipbuildingEnterprise">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否金属冶炼企业" prop="isMetalSmelting">
            <el-radio-group v-model="ruleForm.isMetalSmelting">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否租赁生产企业" prop="isLease">
            <el-radio-group v-model="ruleForm.isLease">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否三合一企业" prop="isThreeOne">
            <el-radio-group v-model="ruleForm.isThreeOne">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否开展安全评价" prop="isSafetyAssessment">
            <el-radio-group v-model="ruleForm.isSafetyAssessment">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否涉及危化品" prop="isHazardousChemicals">
            <el-radio-group v-model="ruleForm.isHazardousChemicals">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否涉及重点监管危化品"
            prop="isRegulatoryHazardous"
            label-width="150px"
          >
            <el-radio-group v-model="ruleForm.isRegulatoryHazardous">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否涉及储存" prop="isStorageInvolved">
            <el-radio-group v-model="ruleForm.isStorageInvolved">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否涉及重点监管危险化工工艺"
            prop="isSupervisionHazardous"
          >
            <el-radio-group v-model="ruleForm.isSupervisionHazardous">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="ruleForm.isSupervisionHazardous == 1">
          <el-form-item label="重点监管危险化工工艺" label-width="220px">
            <el-checkbox-group
              v-model="ruleForm.chemicalHazardous"
              class="checkbox-list"
            >
              <el-checkbox label="光气及光气化工艺"></el-checkbox>
              <el-checkbox label="电解工艺(氯碱)"></el-checkbox>
              <el-checkbox label="氯化工艺"></el-checkbox>
              <el-checkbox label="硝化工艺"></el-checkbox>
              <el-checkbox label="合成氨工艺"></el-checkbox>
              <el-checkbox label="裂解(裂化)工艺"></el-checkbox>
              <el-checkbox label="氟化工艺"></el-checkbox>
              <el-checkbox label="加氢工艺"></el-checkbox>
              <el-checkbox label="重氮化工艺"></el-checkbox>
              <el-checkbox label="氧化工艺"></el-checkbox>
              <el-checkbox label="过氧化工艺"></el-checkbox>
              <el-checkbox label="氨基化工艺"></el-checkbox>
              <el-checkbox label="磺化工艺"></el-checkbox>
              <el-checkbox label="聚合工艺"></el-checkbox>
              <el-checkbox label="烷基化工艺"></el-checkbox>
              <el-checkbox label="新型煤化工工艺"></el-checkbox>
              <el-checkbox label="电石生产工艺"></el-checkbox>
              <el-checkbox label="偶氮化工艺"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" :offset="7" v-if="!disabled">
          <el-form-item>
            <el-button type="primary" @click="submitForm()">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <BaiduMap
      ref="BaiduMap"
      v-model="baiduMapShow"
      :editable="true"
      @completion="setPosition"
    ></BaiduMap>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  companyInfo_API,
  update_API,
} from "@/api/modules/wxyjc/wxyjcenterpriseinfo";

import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";

import AreaPicker from "@/views/components/common/area-picker01";
import BaiduMap from "./map";
export default {
  computed: {
    ...mapGetters(["trueFalseList"]),
    ...mapState({
      dangerSourceLevels: (state) => state.common.dangerSourceLevels,
    }),
  },
  components: {
    AreaPicker,
    BaiduMap,
  },
  props: {
    size: {
      type: String,
      default: "small",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      labelTitle: "",
      baiduMapShow: false,
      ruleForm: {
        provinceId: undefined,
        cityId: undefined,
        areaId: undefined,
        streetId: undefined,
        chemicalHazardous: [],
      },
      enterpriseTypeList: [], //企业类型
      scaleSituationList: [], //企业规模
      industryIdList: [], //行业类别
      economicTypeList: [], //经济类型
      subordinationList: [], //行政隶属关系
      regulatoryList: [], //监管层级
      safetyStandardLevelList: [], //安全风险等级
      statusList: [], //企业状态
      safetyRiskLevelList: [], //安全标准化等级
      zdwxyjbList: [], //重大危险源等级
      rules: {
        compName: [{ required: true, message: "企业名称", trigger: "blur" }],
        provinceId: [{ required: true, message: "所在省", trigger: "change" }],
        // cityId: [{ required: true, message: "所在市", trigger: "change" }],
        // areaId: [{ required: true, message: "所在区", trigger: "change" }],
        // streetId: [{ required: true, message: "所在乡镇", trigger: "change" }],
        lng: [{ required: true, message: "经度", trigger: "blur" }],
        lat: [{ required: true, message: "纬度", trigger: "blur" }],
        industryId: [
          { required: true, message: "行业类别", trigger: "change" },
        ],
        safetyRiskLevel: [
          { required: true, message: "安全风险等级", trigger: "change" },
        ],
        safetyStandardLevel: [
          { required: true, message: "安全标准化等级", trigger: "change" },
        ],
        employeesNumber: [
          {
            pattern: /(^[1-9]\d*$)/,
            message: "从业人员数量",
            trigger: "blur",
          },
        ],
        specialEmpNumber: [
          {
            pattern: /(^[1-9]\d*$)/,
            message: "特种作业人员数量",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    init(companyId) {
      this.getAllTypeList();
      companyInfo_API(companyId).then((res) => {
        let obj = res.result;
        this.ruleForm = obj;
        if (obj.chemicalHazardous == null) {
          this.ruleForm.chemicalHazardous = [];
        } else {
          this.ruleForm.chemicalHazardous = obj.chemicalHazardous.split(",");
        }
      });
    },
    getAllTypeList() {
      wxyjcdictindex_API("enterprise_type").then((res) => {
        this.enterpriseTypeList = res.result;
      });
      wxyjcdictindex_API("scale").then((res) => {
        this.scaleSituationList = res.result;
      });
      wxyjcdictindex_API("industry_category").then((res) => {
        this.industryIdList = res.result;
      });
      wxyjcdictindex_API("economic_type").then((res) => {
        this.economicTypeList = res.result;
      });
      wxyjcdictindex_API("sub_dination").then((res) => {
        this.subordinationList = res.result;
      });
      wxyjcdictindex_API("regultory").then((res) => {
        this.regulatoryList = res.result;
      });
      wxyjcdictindex_API("safety_risk_level").then((res) => {
        this.safetyStandardLevelList = res.result;
      });
      wxyjcdictindex_API("qyjyzt").then((res) => {
        this.statusList = res.result;
      });
      wxyjcdictindex_API("bzhdj").then((res) => {
        this.safetyRiskLevelList = res.result;
      });
      wxyjcdictindex_API("zdwxyjb").then((res) => {
        this.zdwxyjbList = res.result;
      });
    },
    handleOpenMap() {
      this.baiduMapShow = true;
      this.$nextTick(() => {
        let location = {
          lng: this.ruleForm.lng,
          lat: this.ruleForm.lat,
        };
        console.log(location);
        this.$refs["BaiduMap"].setup(location);
      });
    },
    setPosition(val) {
      this.ruleForm.lng = val.lng;
      this.ruleForm.lat = val.lat;
      this.baiduMapShow = false;
    },
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let params = { ...this.ruleForm };
          params.chemicalHazardous = params.chemicalHazardous.join(",");
          update_API(params).then((res) => {
            this.msgSuccess("修改成功！");
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.public-title {
  max-width: 1200px;
  margin: 20px auto;
  font-size: 16px;
  position: relative;
  padding-left: 10px;
}
.demo-ruleForm {
  max-width: 1000px;
  min-width: 850px;
  margin: 0 auto;
}

.public-title::before {
  display: block;
  content: "";
  width: 3px;
  height: 16px;
  background-color: #409eff;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.checkbox-list {
  /deep/.el-checkbox {
    width: 20%;
  }
}

.form-box-02 {
  /deep/.el-form-item__label {
    width: 220px !important;
  }
}
</style>