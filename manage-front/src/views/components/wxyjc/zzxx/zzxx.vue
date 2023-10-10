<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    width="754px"
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
          <el-form-item label="重大危险源名称" prop="hazardId">
            <el-select
              v-model="ruleForm.hazardId"
              clearable
              filterable
              placeholder="请选择"
              @change="hazardNameChange"
            >
              <el-option
                v-for="item in hazardNameList"
                :key="item.id"
                :label="item.hazardName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重大危险源编号" prop="hazardNo">
            <el-input v-model="ruleForm.hazardNo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="装置名称编号" prop="deviceNo">
            <el-input
              v-model="ruleForm.deviceNo"
              clearable
              @blur="deviceNoChange"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备描述" prop="deviceDes">
            <el-input type="textarea" v-model="ruleForm.deviceDes"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属工艺大类" prop="processCategory">
            <el-select
              v-model="ruleForm.processCategory"
              placeholder="请选择"
              @change="getProcessDetailsList"
            >
              <el-option
                v-for="item in processCategoryList"
                :key="item.id"
                :label="item.processName"
                :value="item.processCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属工艺细类" prop="processCategorySub">
            <el-select
              v-model="ruleForm.processCategorySub"
              placeholder="请选择"
              @change="getProcessParametersList"
            >
              <el-option
                v-for="item in processDetailsList"
                :key="item.id"
                :label="item.processName"
                :value="item.processCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工艺参数选择" prop="codeList">
            <el-checkbox-group
              v-model="ruleForm.codeList"
              class="checkbox-list"
              @change="handleChange"
            >
              <el-checkbox
                v-for="item in processParametersList"
                :key="item.id"
                :label="item.processName"
                >{{ item.processName }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item
            v-for="(item, index) in ruleForm.wxyjcTargetCodeList"
            :key="index"
            label="指标编码"
          >
            <el-input
              v-model="item.targetCode"
              :placeholder="item.targetType"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item
            label="安全仪表系统投用状态位号"
            prop="statusTagNo"
            label-width="200px"
          >
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.statusTagNo"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="安全仪表连锁回路总数"
            prop="circuitsTotal"
            label-width="200px"
          >
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.circuitsTotal"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="安全仪表连锁回路旁路数位号"
            prop="circuitBypassNo"
            label-width="200px"
          >
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.circuitBypassNo"
            ></el-input>
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
import {
  save_API,
  update_API,
  info_API,
  check_API,
  check_edit_API,
} from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import { list_API } from "@/api/modules/wxyjc/wxyjcdangeroushazard";
import { wxyjcdicttechnology_API } from "@/api/common/wxyjcdicttechnology";
export default {
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
      hazardNameList: [], //重大危险源名称
      processCategoryList: [],
      processDetailsList: [],
      processParametersList: [],
      ruleForm: {
        hazardId: undefined,
        hazardNo: undefined,
        deviceNo: undefined,
        deviceDes: undefined,
        processCategory: undefined,
        processCategorySub: undefined,
        codeList: [], //工艺参数选择
        wxyjcTargetCodeList: [],
        editWxyjcTargetCodeList: [],
        statusTagNo: undefined,
        circuitsTotal: undefined,
        circuitBypassNo: undefined,
      },
      rules: {
        hazardId: [
          { required: true, message: "重大危险源名称", trigger: "blur" },
        ],
        hazardNo: [
          { required: true, message: "重大危险源编号", trigger: "blur" },
        ],
        deviceNo: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
          {
            pattern: /^[0-9a-zA-Z]*$/,
            message: "只允许英文和数字",
            trigger: "blur",
          },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
        processCategory: [
          { required: true, message: "所属工艺大类", trigger: "change" },
        ],
        processCategorySub: [
          { required: true, message: "所属工艺细类", trigger: "change" },
        ],
        // targetCode: [{ required: true, message: "指标编码", trigger: "blur" }],
        codeList: [
          { required: true, message: "工艺参数选择", trigger: "change" },
        ],
        circuitsTotal: [
          {
            pattern: /(^[1-9]\d*$)/,
            message: "请输入正整数",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getAlltypeList() {
      list_API({
        page: 1,
        limit: 1000,
      }).then((res) => {
        this.hazardNameList = res.result.list;
      });
      this.getProcessCategoryList();
    },
    getProcessCategoryList() {
      wxyjcdicttechnology_API(0).then((res) => {
        this.processCategoryList = res.result;
      });
    },
    getProcessDetailsList(val) {
      if (val) {
        wxyjcdicttechnology_API(val).then((res) => {
          this.processDetailsList = res.result;

          this.ruleForm.processCategorySub = undefined; //所属工艺细类

          this.processParametersList = []; //工艺参数选择
          this.ruleForm.codeList = []; ////工艺参数选择
        });
      }
    },
    getProcessParametersList(val) {
      if (val) {
        wxyjcdicttechnology_API(val).then((res) => {
          this.processParametersList = res.result; //工艺参数选择
          this.ruleForm.codeList = []; //工艺参数选择
        });
      }
    },
    hazardNameChange(item) {
      this.hazardNameList.map((res) => {
        if (res.id === item) {
          this.ruleForm.hazardName = res.hazardName;
          this.ruleForm.hazardNo = res.hazardNo;
        }
      });
    },
    editTemp(id) {
      if (id) {
        info_API(id).then((res) => {
          let obj = res.result;
          this.ruleForm = obj;

          let arr = obj.wxyjcTargetCodeList.map((item) => {
            return item.targetType;
          });

          this.$set(this.ruleForm, "codeList", arr);

          wxyjcdicttechnology_API(this.ruleForm.processCategory).then((res) => {
            this.processDetailsList = res.result;
          });
          wxyjcdicttechnology_API(this.ruleForm.processCategorySub).then(
            (res) => {
              this.processParametersList = res.result; //工艺参数选择
            }
          );
        });
      }
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

      this.$delete(this.ruleForm, "codeList");
      this.$set(this.ruleForm, "codeList", []);

      this.ruleForm.wxyjcTargetCodeList = [];
      this.ruleForm.editWxyjcTargetCodeList = [];

      this.ruleForm.processCategoryList = [];
      this.ruleForm.processDetailsList = [];
      this.ruleForm.processParametersList = [];
    },
    //保存
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (
            this.ruleForm.id &&
            this.ruleForm.editWxyjcTargetCodeList &&
            this.ruleForm.editWxyjcTargetCodeList.length > 0
          ) {
            this.ruleForm.editWxyjcTargetCodeList.forEach((item) => {
              this.ruleForm.wxyjcTargetCodeList.forEach((item01) => {
                if (item.targetType == item01.targetType) {
                  item.id = item01.id;
                }
              });
            });
            this.ruleForm.wxyjcTargetCodeList =
              this.ruleForm.editWxyjcTargetCodeList;
          }
          this.ruleForm.wxyjcTargetCodeList.forEach((item) => {
            item.deviceNo = this.ruleForm.deviceNo;
          });
          this.formRequest(save_API, update_API, this.ruleForm).then((_) => {
            this.$emit("closeView");
            this.handleCancel();
          });
        }
      });
    },
    handleChange(arr) {
      if (this.ruleForm.id) {
        this.ruleForm.editWxyjcTargetCodeList = arr.map((item) => {
          return {
            targetType: item,
          };
        });
      } else {
        this.ruleForm.wxyjcTargetCodeList = arr.map((item) => {
          return {
            targetType: item,
          };
        });
      }
    },
    deviceNoChange() {
      if (this.ruleForm.deviceNo == undefined || this.ruleForm.deviceNo == "") {
        this.$message({
          message: "请输入设备编号",
          type: "warning",
        });
        return false;
      }
      if (this.ruleForm.id) {
        check_edit_API(this.ruleForm.deviceNo, this.ruleForm.id).then((res) => {
          if (!res.data) {
            this.ruleForm.deviceNo = undefined;
            this.$message({
              message: "该设备名称编号已被使用请重新输入",
              type: "warning",
            });
            return;
          }
        });
      } else {
        check_API(this.ruleForm.deviceNo).then((res) => {
          if (!res.data) {
            this.ruleForm.deviceNo = undefined;
            this.$message({
              message: "该设备名称编号已被使用请重新输入",
              type: "warning",
            });
            return;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-list {
  /deep/.el-checkbox {
    min-width: 24%;
  }
}
</style>