<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="800px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="165px"
      :size="size"
      :disabled="!editable"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="类别" prop="category">
            <el-select v-model="ruleForm.category" placeholder="请选择">
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危化品名称" prop="dangerName">
            <el-autocomplete
              style="width: 215px"
              v-model="ruleForm.dangerName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入危化品名称"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CAS号" prop="casNo">
            <el-input v-model="ruleForm.casNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="储存方式" prop="storageMethod">
            <el-select v-model="ruleForm.storageMethod" placeholder="请选择">
              <el-option
                v-for="item in storeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年用量/年产量" prop="annualOutput">
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.annualOutput"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用量/产量计量单位" prop="annualOutputUnit">
            <el-select
              v-model="ruleForm.annualOutputUnit"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最大储量" prop="maxReserves">
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.maxReserves"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="储量计量单位" prop="maxReservesUnit">
            <el-select
              v-model="ruleForm.maxReservesUnit"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="危化品类别" prop="chemicalsCategory">
            <el-select
              v-model="ruleForm.chemicalsCategory"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dangerList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主要危险性" prop="majorRisks">
            <el-input v-model="ruleForm.majorRisks"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重点监管" prop="isSupervision">
            <el-radio-group v-model="ruleForm.isSupervision">
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
          <el-form-item label="易制毒" prop="isEasytoxic">
            <el-radio-group v-model="ruleForm.isEasytoxic">
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
          <el-form-item label="剧毒" prop="isToxic">
            <el-radio-group v-model="ruleForm.isToxic">
              <el-radio
                v-for="(item, index) in trueFalseList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="ruleForm.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="editable">
      <el-button :size="size" @click="handleCancel()">取消</el-button>
      <el-button :size="size" type="primary" @click="submitForm()"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { getString, SpecialSymbols } from "@/utils/wxyjc/utils/index";
import { mapGetters } from "vuex";
import {
  save_API,
  update_API,
  info_API,
  check_API,
  check_edit_API,
} from "@/api/modules/wxyjc/wxyjcdangerousinfo";
import { name_API } from "@/api/modules/wxyjc/wxyjcdictdangerous";
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
export default {
  computed: {
    ...mapGetters(["trueFalseList"]),
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "查看",
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.getAlltypeList();
      }
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      // 是否显示弹出层
      visible: this.value,
      size: "small",
      ruleForm: {
        category: undefined,
        dangerName: undefined,
        casNo: undefined,
        storageMethod: undefined,
        annualOutput: undefined,
        annualOutputUnit: undefined,
        maxReserves: undefined,
        maxReservesUnit: undefined,
        chemicalsCategory: undefined,
        majorRisks: undefined,
        isSupervision: undefined,
        isEasytoxic: undefined,
        isToxic: undefined,
        remarks: undefined,
      },
      categoryList: [],
      storeList: [],
      dangerList: [],
      companyList: [],
      rules: {
        category: [{ required: true, message: "类别", trigger: "change" }],
        dangerName: [
          { required: true, message: "危化品名称", trigger: "blur" },
        ],
        casNo: [{ required: true, message: "CAS号", trigger: "blur" }],
        isSupervision: [
          { required: true, message: "重点监管", trigger: "change" },
        ],
        isEasytoxic: [{ required: true, message: "易制毒", trigger: "change" }],
        isToxic: [{ required: true, message: "剧毒", trigger: "change" }],
      },
    };
  },
  methods: {
    getAlltypeList() {
      wxyjcdictindex_API("category").then((res) => {
        this.categoryList = res.result;
      });
      wxyjcdictindex_API("storage_method").then((res) => {
        this.storeList = res.result;
      });
      wxyjcdictindex_API("wxhxpfl").then((res) => {
        this.dangerList = res.result;
      });
      wxyjcdictindex_API("unit").then((res) => {
        this.companyList = res.result;
      });
    },
    querySearchAsync(queryString, cb) {
      if (SpecialSymbols(queryString)) {
        return false;
      }
      // 危化品名称
      if (queryString) {
        return name_API(getString(queryString)).then((res) => {
          cb(
            res.result.map((x) => {
              return {
                id: x.id,
                value: x.nameProd,
                isToxic: x.isRankPoison,
                isEasytoxic: x.isEasyMakePoison,
                isSupervision: x.isKeySupervision,
                casNo: x.cas,
              };
            })
          );
        });
      }
    },
    handleSelect(item) {
      //去除校验
      // if (this.ruleForm.id) {
      //   check_edit_API(
      //     urlencode(this.ruleForm.dangerName),
      //     this.ruleForm.id
      //   ).then((res) => {
      //     if (!res.data) {
      //       this.ruleForm.dangerName = undefined;
      //       this.$message({
      //         message: "该危化品已存在请重新输入",
      //         type: "warning",
      //       });
      //       return false;
      //     }
      //   });
      // } else {
      //   check_API(urlencode(this.ruleForm.dangerName)).then((res) => {
      //     if (!res.data) {
      //       this.ruleForm.dangerName = undefined;
      //       this.$message({
      //         message: "该危化品已存在请重新输入",
      //         type: "warning",
      //       });
      //       return false;
      //     }
      //   });
      // }
      // console.log()
      this.ruleForm.isToxic = item.isToxic ? 1 : 0;
      this.ruleForm.isEasytoxic = item.isEasytoxic ? 1 : 0;
      this.ruleForm.isSupervision = item.isSupervision ? 1 : 0;
      this.ruleForm.casNo = item.casNo;
      this.$forceUpdate();
    },
    //取消
    handleCancel() {
      this.visible = false;
      this.handleReset();
    },
    //重置
    handleReset() {
      this.resetForm("ruleForm");
      this.ruleForm.id = undefined;
    },
    //编辑
    editTemp(id) {
      if (id) {
        info_API(id).then((res) => {
          this.ruleForm = res.result;
        });
      }
    },
    //保存
    submitForm() {
      console.log(this.ruleForm);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.formRequest(save_API, update_API, this.ruleForm).then((_) => {
            this.$emit("closeView");
            this.handleCancel();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>