<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="200px"
    size="small"
    :disabled="isLOCK"
    class="ruleForm"
  >
    <el-row>
      <el-col :lg="8" :md="12">
        <el-form-item label="安全生产主要负责人" prop="headSafePerson">
          <el-input v-model="ruleForm.headSafePerson"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-form-item label="联系方式" prop="headSafePersonPhone">
          <el-input v-model="ruleForm.headSafePersonPhone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :lg="8" :md="12">
        <el-form-item label="安全生产管理人员" prop="principalPerson">
          <el-input v-model="ruleForm.principalPerson"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-form-item label="联系方式" prop="principalPersonPhone">
          <el-input v-model="ruleForm.principalPersonPhone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :lg="8" :md="12">
        <el-form-item label="从业人员数量" prop="employeesPersonNum">
          <el-input v-model="ruleForm.employeesPersonNum"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-form-item
          label="特种作业人员数量"
          prop="specialOperationPersonnelNum"
        >
          <el-input v-model="ruleForm.specialOperationPersonnelNum"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :lg="8" :md="12">
        <el-form-item
          label="专职安全生产管理人员数量"
          prop="securityManagersFullNum"
        >
          <el-input v-model="ruleForm.securityManagersFullNum"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-form-item
          label="兼职安全生产管理 人员数量"
          prop="securityManagersPartNum"
        >
          <el-input v-model="ruleForm.securityManagersPartNum"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :lg="8" :md="12">
        <el-form-item
          label="专职应急管理人员数量"
          prop="managementPersonnelFullNum"
        >
          <el-input v-model="ruleForm.managementPersonnelFullNum"></el-input>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-form-item label="注册安全工程师数量" prop="registSafetyEngineerNum">
          <el-input v-model="ruleForm.registSafetyEngineerNum"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :lg="8" :md="12">
        <el-form-item
          label="是否有专职安全管理机构"
          prop="isSafetyStandConstruct"
        >
          <el-select
            v-model="ruleForm.isSafetyStandConstruct"
            placeholder="请选择"
          >
            <el-option
              v-for="item in trueFalseList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :lg="8" :md="12">
        <el-form-item label="安全生产标准等级" prop="safeStandardLevel">
          <el-select v-model="ruleForm.safeStandardLevel" placeholder="请选择">
            <el-option
              v-for="item in SafetyLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :lg="8" :md="12">
        <el-form-item label="是否涉及重大危险源" prop="isMajorDanger">
          <el-select
            v-model="ruleForm.isMajorDanger"
            placeholder="请选择"
            @change="isMajorDangerChange"
          >
            <el-option
              v-for="item in trueFalseList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="8" :md="12">
        <el-form-item
          label="重大危险源等级"
          prop="majorDangerSourceLevel"
          v-if="ruleForm.isMajorDanger == 1"
        >
          <el-select
            v-model="ruleForm.majorDangerSourceLevel"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dangerSourceLevels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :lg="16" :md="24">
        <el-form-item label="周边情况" prop="surroundingConditions">
          <el-input
            type="textarea"
            v-model="ruleForm.surroundingConditions"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="!isLOCK">
      <el-col>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')"
            >保存</el-button
          >
          <!-- <el-button @click="setCancel()">取消</el-button> -->
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import {
  info_API,
  info_update_API,
} from "@/api/modules/process/webcompanyinfo";
export default {
  name: "product",
  computed: {
    ...mapState({
      SafetyLevel: (state) => state.common.SafetyLevel,
      dangerSourceLevels: (state) => state.common.dangerSourceLevels,
    }),
    ...mapGetters(["trueFalseList"]),
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (Number.isInteger(Number(value)) && Number(value) >= 0) {
        callback();
      } else {
        callback(new Error("请输入大于0的整数"));
      }
    };
    return {
      ruleForm: {
        companyCode: undefined, //企业代码(单位代码)
        companyName: undefined, //企业名称(单位名称)
        companyPhone: undefined, //企业电话
        legalPerson: undefined, //法人
        legalPersonMobile: undefined, //法人手机,
        foundingTime: undefined, //成立时间,
        regProvinceCode: undefined, //注册所在省,
        regMarketCode: undefined, //注册所在市,
        regCountyCode: undefined, //注册所在区县代码,
        regTownCode: undefined, //注册所在街镇代码,
        regVillageCode: undefined, //注册所在村社代码,
        regAddress: undefined, //注册地址详情,
        corAddress: undefined, //生产经营地址详情,
        businessScope: undefined, //经营范围,
        enterpriseScale: undefined, //企业规模,
        nationalEconomicCode: undefined, //国民经济分类编码,
        headSafePerson: undefined, //企业安全负责人,
        headSafePersonPhone: undefined, //企业安全负责人电话,
        principalPerson: undefined, //企业主要负责人,
        principalPersonPhone: undefined, //企业主要负责人电话,
        employeesPersonNum: undefined, //企业职工总数,
        specialOperationPersonnelNum: undefined, //特种作业人员数量,
        securityManagersFullNum: undefined, //安全管理人员数-专职人员,
        securityManagersPartNum: undefined, //安全管理人员数-兼职人员,
        registSafetyEngineerNum: undefined, //注册安全工程师人数,
        isSafetyStandConstruct: undefined, //是否有专职安全管理机构,
        levelAttainment: undefined, //达标等级,
        expertReview: undefined, //专家审核附件,
        registerLargeClass: undefined, //注册类型大类代码,
        registerSmallClass: undefined, //注册类型小类代码,
        lon: undefined, //经营地址经度(基本信息),
        lat: undefined, //经营地址纬度(基本信息),
        postalCode: undefined, //邮政编码,
        economicType: undefined, //经济类型,
        safetyDutyTelephone: undefined, //安全值班电话,
        park: undefined, //所在园区(开发区),
        industry: undefined, //所属行业,
        managementPersonnelFullNum: undefined, //专职应急管理人员数量,
        safeStandardLevel: undefined, //安全生产标准等级,
        isMajorDanger: undefined, //是否涉及重大危险源,
        majorDangerSourceLevel: undefined, //重大危险源级别,
        surroundingConditions: undefined, //周边情况,
        createTime: undefined, //创建时间,
        updateTime: undefined, //最后一次调整时间,
        createUserId: undefined, //创建者ID，人工系统创建为0,
        updateUserId: undefined, //最后一次调整者ID,
      },
      rules: {
        headSafePerson: [
          {
            required: true,
            message: "请输入企业安全负责人",
            trigger: "blur",
          },
        ],
        headSafePersonPhone: [
          {
            required: true,
            message: "请输入企业安全负责人电话",
            trigger: "blur",
          },
        ],
        employeesPersonNum: [
          {
            required: true,
            validator: validatePass,
            message: "请输入企业职工总数(必选正整数)",
            trigger: "blur",
          },
        ],
        specialOperationPersonnelNum: [
          {
            required: true,
            validator: validatePass,
            message: "请输入特种作业人员数量(必选正整数)",
            trigger: "blur",
          },
        ],
        securityManagersFullNum: [
          {
            required: true,
            validator: validatePass,
            message: "安全管理人员数-专职人员(必选正整数)",
            trigger: "blur",
          },
        ],
        securityManagersPartNum: [
          {
            validator: validatePass,
            message: "安全管理人员数-兼职人员(必选正整数)",
            trigger: "blur",
          },
        ],
        managementPersonnelFullNum: [
          {
            required: true,
            validator: validatePass,
            message: "专职应急管理人员数量(必选正整数)",
            trigger: "blur",
          },
        ],
        registSafetyEngineerNum: [
          {
            required: true,
            validator: validatePass,
            message: "注册安全工程师数量(必选正整数)",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    isLOCK: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.getFormData();
  },
  methods: {
    getFormData() {
      info_API().then((res) => {
        let obj = res.result;
        if(obj){
          this.ruleForm = obj;
        }
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          info_update_API(this.ruleForm).then((res) => {
            this.$message({
              message: "编辑成功！",
              type: "success",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    isMajorDangerChange(val) {
      //如果是否，那么 需要清空 重大危险源等级
      if (val == 0) {
        this.ruleForm.majorDangerSourceLevel = undefined;
      }
    },
  },
};
</script>

<style>
</style>