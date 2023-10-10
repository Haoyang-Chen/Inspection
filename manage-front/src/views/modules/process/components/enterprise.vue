<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="140px"
    size="small"
    :disabled="isLOCK"
    class="ruleForm"
  >
    <el-row>
      <el-col :span="10">
        <el-form-item label="最新更新日期">
          <el-date-picker
            v-model="ruleForm.updateTime"
            type="date"
            placeholder="选择日期"
            disabled
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="ruleForm.companyName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button
          size="small"
          plain
          icon="el-icon-folder-opened"
          @click="openMap()"
          >查看</el-button
        >
      </el-col>
      <el-col :span="5">
        <el-form-item label="经度" label-width="90px">
          <el-input v-model="ruleForm.lon" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="纬度" label-width="90px">
          <el-input v-model="ruleForm.lat" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="注册类型" prop="registerLargeClassSmallClass">
          <el-cascader
            v-model="ruleForm.registerLargeClassSmallClass"
            :options="RegistrationtypeList"
            @change="handleChangeZCLX"
            style="width: 360px"
          ></el-cascader>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="5">
        <el-form-item prop="registerSmallClass" class="registerSmallClass">
        </el-form-item>
      </el-col> -->
      <el-col :span="10">
        <el-form-item label="经济类型" prop="economicType">
          <el-select v-model="ruleForm.economicType" placeholder="请选择">
            <el-option label="国有全资" value="国有全资"></el-option>
            <el-option label="集体全资" value="集体全资"></el-option>
            <el-option label="股份合作" value="股份合作"></el-option>
            <el-option label="联营" value="联营"></el-option>
            <el-option label="私有" value="私有"></el-option>
            <el-option label="其他内资" value=" 其他内资"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="10">
        <el-form-item label="社会统一信用代码" prop="companyCode">
          <el-input v-model="ruleForm.companyCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-form-item label="邮政编码" prop="postalCode">
          <el-input v-model="ruleForm.postalCode"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="10">
        <el-form-item label="成立时间">
          <el-date-picker
            v-model="ruleForm.foundingTime"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-form-item label="法定代表人" prop="legalPerson">
          <el-input v-model="ruleForm.legalPerson"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <AreaPicker v-model="ruleForm"></AreaPicker>
    </el-row>

    <el-row>
      <el-col :span="22">
        <el-form-item label="工商注册地址" prop="regAddress">
          <el-input v-model="ruleForm.regAddress"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="22">
        <el-form-item label="生产经营地址" prop="corAddress">
          <el-input v-model="ruleForm.corAddress"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <el-form-item label="企业规模" prop="enterpriseScale">
          <el-select v-model="ruleForm.enterpriseScale" placeholder="请选择">
            <el-option label="规上" value="规上"></el-option>
            <el-option label="规下" value="规下"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item
          label="所在园区（开发区）"
          prop="park"
          label-width="200px"
        >
          <el-input v-model="ruleForm.park"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="安全值班电话" prop="safetyDutyTelephone">
          <el-input v-model="ruleForm.safetyDutyTelephone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <Industry v-model="ruleForm"></Industry>
    </el-row>

    <el-row v-if="!isLOCK">
      <el-col :span="10">
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >保存</el-button
          >
          <!-- <el-button @click="setCancel()">取消</el-button> -->
        </el-form-item>
      </el-col>
    </el-row>

    <BaiduMap
      ref="BaiduMap"
      v-model="baiduMapShow"
      @completion="setPosition"
    ></BaiduMap>
  </el-form>
</template>

<script>
import {
  info_API,
  info_update_API,
} from "@/api/modules/process/webcompanyinfo";
import BaiduMap from "./map";
import Industry from "./industry";
import AreaPicker from "@/views/components/common/area-picker";

export default {
  name: "enterprise",
  components: {
    BaiduMap,
    AreaPicker,
    Industry,
  },
  props: {
    isLOCK: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      baiduMapShow: false,
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
        companyName: [{ required: true, message: "单位名称", trigger: "blur" }],
        registerLargeClassSmallClass: [
          { required: true, message: "注册类型", trigger: "change" },
        ],
        economicType: [
          { required: true, message: "经济类型", trigger: "change" },
        ],
        companyCode: [
          { required: true, message: "社会统一信用代码", trigger: "blur" },
        ],
        postalCode: [{ required: true, message: "邮政编码", trigger: "blur" }],
        legalPerson: [
          { required: true, message: "法定代表人", trigger: "blur" },
        ],
        regProvinceCode: [
          { required: true, message: "所在省", trigger: "change" },
        ],
        regMarketCode: [
          { required: true, message: "所在市", trigger: "change" },
        ],
        regCountyCode: [
          { required: true, message: "所在区", trigger: "change" },
        ],
        regTownCode: [
          { required: true, message: "所在乡镇", trigger: "change" },
        ],
        regAddress: [
          { required: true, message: "工商注册地址", trigger: "blur" },
        ],
        corAddress: [
          { required: true, message: "生产经营地址", trigger: "blur" },
        ],
        enterpriseScale: [
          { required: true, message: "企业规模", trigger: "change" },
        ],
        safetyDutyTelephone: [
          { required: true, message: "安全值班电话", trigger: "blur" },
        ],
        park: [
          { required: true, message: "所在园区（开发区）", trigger: "blur" },
        ],
        industryCategory: [
          { required: true, message: "必选", trigger: "change" },
        ],
        industryLarge: [{ required: true, message: "必选", trigger: "change" }],
        industryMiddle: [
          { required: true, message: "必选", trigger: "change" },
        ],
        industrySmall: [{ required: true, message: "必选", trigger: "change" }],
      },
      RegistrationtypeList: [
        {
          value: "内资企业",
          label: "内资企业",
          children: [
            {
              value: "国有企业",
              label: "国有企业",
            },
            {
              value: "集体企业",
              label: "集体企业",
            },
            {
              value: "股份合作企业",
              label: "股份合作企业",
            },
            {
              value: "联营企业",
              label: "联营企业",
            },
            {
              value: "有限责任公司",
              label: "有限责任公司",
            },
            {
              value: "股份有限公司",
              label: "股份有限公司",
            },
            {
              value: "私营企业",
              label: "私营企业",
            },
            {
              value: "其他企业",
              label: "其他企业",
            },
          ],
        },
        {
          value: "港澳台商投资企业",
          label: "港澳台商投资企业",
          children: [
            {
              value: "合资经营企业（港或澳、台资）",
              label: "合资经营企业（港或澳、台资）",
            },
            {
              value: "合作经营企业（港或澳、台资）",
              label: "合作经营企业（港或澳、台资）",
            },
            {
              value: "港、澳、台商独资经营企业",
              label: "港、澳、台商独资经营企业",
            },
            {
              value: "港、澳、台商投资股份有限公司",
              label: "港、澳、台商投资股份有限公司",
            },
            {
              value: "其他港、澳、台商投资企业",
              label: "其他港、澳、台商投资企业",
            },
          ],
        },
        {
          value: "外商投资企业",
          label: "外商投资企业",
          children: [
            {
              value: "中外合资经营企业",
              label: "中外合资经营企业",
            },
            {
              value: "中外合作经营企业",
              label: "中外合作经营企业",
            },
            {
              value: "外资企业",
              label: "外资企业",
            },
            {
              value: "外商投资股份有限公司",
              label: "外商投资股份有限公司",
            },
            {
              value: "其他外商投资企业",
              label: "其他外商投资企业",
            },
          ],
        },
      ],
    };
  },
  created() {
    this.getFormData();
  },
  methods: {
    getFormData() {
      info_API().then((res) => {
        //console.log(res);
        let obj = res.result;
        if (obj) {
          obj.regProvinceCode = obj.regProvinceCode
            ? parseInt(obj.regProvinceCode)
            : "";
          obj.regMarketCode = obj.regMarketCode
            ? parseInt(obj.regMarketCode)
            : "";
          obj.regCountyCode = obj.regCountyCode
            ? parseInt(obj.regCountyCode)
            : "";
          obj.regTownCode = obj.regTownCode ? parseInt(obj.regTownCode) : "";

          this.ruleForm = { ...obj };
          this.ruleForm.registerLargeClassSmallClass = [
            obj.registerLargeClass,
            obj.registerSmallClass,
          ];
        }
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        })
      })
    },
    openMap() {
      this.baiduMapShow = true;
      this.$nextTick(() => {
        let location = {
          lng: this.ruleForm.lon,
          lat: this.ruleForm.lat,
        };
        this.$refs.BaiduMap.setup(location);
      });
    },
    setPosition(val) {
      this.ruleForm.lon = val.lng;
      this.ruleForm.lat = val.lat;
      this.baiduMapShow = false;
    },
    handleChangeZCLX(arr) {
      console.log(arr);
      this.ruleForm.registerLargeClass = arr[0];
      this.ruleForm.registerSmallClass = arr[1];
    },
    //取消
    // setCancel() {
    //   this.$refs["ruleForm"].clearValidate();
    //   this.$emit("setisLOCK");
    // },
    submitForm(formName) {
      console.log(this.ruleForm);
      //return false;
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
  },
};
</script>
<style lang="scss" scoped>
.ruleForm {
  width: 1200px;
}
.registerSmallClass /deep/ .el-form-item__content {
  margin-left: 0px !important;
}
</style>