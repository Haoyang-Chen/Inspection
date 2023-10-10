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
          <el-form-item label="设备名称编号" prop="deviceNo">
            <el-input
              v-model="ruleForm.deviceNo"
              clearable
              @blur="deviceNoChange"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="指标选择" prop="codeList">
            <el-checkbox-group
              v-model="ruleForm.codeList"
              class="checkbox-list"
              @change="handleChange"
              :min="1"
            >
              <el-checkbox
                v-for="item in options"
                :key="item.value"
                :label="item.value"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="设备描述" prop="deviceDes">
            <el-input type="textarea" v-model="ruleForm.deviceDes"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备内介质" prop="dangerousInfoId">
            <el-select
              v-model="ruleForm.dangerousInfoId"
              class="w200"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in dangerousInfoList"
                :key="item.id"
                :label="item.dangerName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="介质形态" prop="deviceMedium">
            <el-select v-model="ruleForm.deviceMedium" placeholder="请选择">
              <el-option
                v-for="item in shapeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="罐液位最高值（M）" prop="tankMaximum">
            <el-input type="number" v-model="ruleForm.tankMaximum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"> </el-col>

        <el-col :span="12">
          <el-form-item label="罐容积" prop="tankVolume">
            <el-input type="number" v-model="ruleForm.tankVolume"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐容积计量单位" prop="tankVolumeUnit">
            <el-select
              v-model="ruleForm.tankVolumeUnit"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in tankUnitList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐高" prop="tankHeight">
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.tankHeight"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐高计量单位" prop="tankHeightUnit">
            <el-select
              v-model="ruleForm.tankHeightUnit"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in tankDiamUnitList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label=" 罐径" prop="tankDiameter">
            <el-input
              type="number"
              min="0"
              v-model="ruleForm.tankDiameter"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐径计量单位" prop="tankDiameterUnit">
            <el-select
              v-model="ruleForm.tankDiameterUnit"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in tankDiamUnitList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐类型" prop="tankType">
            <el-select v-model="ruleForm.tankType" placeholder="请选择">
              <el-option
                v-for="item in containerList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐压力类型" prop="tankPressureType">
            <el-select v-model="ruleForm.tankPressureType" placeholder="请选择">
              <el-option
                v-for="item in pressureList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐设计压力" prop="tankDesignPressure">
            <el-input
              type="number"
              v-model="ruleForm.tankDesignPressure"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐最高工作压力" prop="tankPressureMaximum">
            <el-input
              type="number"
              v-model="ruleForm.tankPressureMaximum"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐温度类型" prop="tankTempType">
            <el-select v-model="ruleForm.tankTempType" placeholder="请选择">
              <el-option
                v-for="item in temperatureList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐设计温度低限" prop="tankDesignLowerTemp">
            <el-input
              type="number"
              v-model="ruleForm.tankDesignLowerTemp"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="罐设计温度高限" prop="tankDesignUpperTemp">
            <el-input v-model="ruleForm.tankDesignUpperTemp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建造日期" prop="buildDate">
            <el-date-picker
              v-model="ruleForm.buildDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              @change="buildDateChange"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投用日期" prop="useDate">
            <el-date-picker
              v-model="ruleForm.useDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              @change="useDateChange"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最近检维修日期" prop="lastMaintenanceDate">
            <el-date-picker
              v-model="ruleForm.lastMaintenanceDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              @change="lastMaintenanceDateChange"
            >
            </el-date-picker>
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
  check_edit_API,
} from "@/api/modules/wxyjc/wxyjcdangeroustank";
import { check_API } from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import { list_API } from "@/api/modules/wxyjc/wxyjcdangeroushazard";
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
import { list_API as whpxx_API } from "@/api/modules/wxyjc/wxyjcdangerousinfo";
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
      options: [
        {
          value: "温度",
          label: "温度",
        },
        {
          value: "压力",
          label: "压力",
        },
        {
          value: "液位",
          label: "液位",
        },
        // {
        //   value: "储量",
        //   label: "储量",
        // },
      ],
      // 是否显示弹出层
      visible: this.value,
      size: "small",
      hazardNameList: [],
      dangerousInfoList: [], //设备内介质
      temperatureList: [],
      pressureList: [],
      containerList: [],
      shapeList: [],
      tankUnitList: [],
      tankDiamUnitList: [],
      ruleForm: {
        id: undefined,
        hazardId: undefined,
        hazardNo: undefined,
        deviceNo: undefined,
        codeList: [], //指标选择
        wxyjcTargetCodeList: [],
        editWxyjcTargetCodeList: [],
        deviceDes: undefined,
        dangerousInfoId: undefined,
        deviceMedium: undefined,
        tankUnitMaximumVolume: undefined,
        tankVolume: undefined,
        tankVolumeUnit: undefined,
        tankHeight: undefined,
        tankHeightUnit: undefined,
        tankDiameter: undefined,
        tankDiameterUnit: undefined,
        tankType: undefined,
        tankPressureType: undefined,
        tankDesignPressure: undefined,
        tankPressureMaximum: undefined,
        tankTempType: undefined,
        tankDesignLowerTemp: undefined,
        tankDesignUpperTemp: undefined,
        buildDate: undefined,
        useDate: undefined,
        lastMaintenanceDate: undefined,
        tankMaximum: undefined,
      },
      rules: {
        hazardId: [
          { required: true, message: "请选择重大危险源", trigger: "change" },
        ],
        hazardNo: [
          { required: true, message: "请输入重大危险源ID", trigger: "blur" },
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
        dangerousInfoId: [
          { required: true, message: "请输入设备内介质", trigger: "blur" },
        ],
        tankMaximum: [
          { required: true, message: "请输入罐液位最高值", trigger: "blur" },
        ],
        tankVolume: [
          { required: true, message: "请输入罐容积", trigger: "blur" },
        ],
        tankVolumeUnit: [
          { required: true, message: "请选择罐容积单位", trigger: "change" },
        ],
        tankType: [
          { required: true, message: "请选择罐类型", trigger: "change" },
        ],
        tankPressureType: [
          { required: true, message: "请选择罐压力类型", trigger: "change" },
        ],
        tankTempType: [
          { required: true, message: "请选择温度类型", trigger: "change" },
        ],
        buildDate: [
          { required: true, message: "请选择建造日期", trigger: "change" },
        ],
        useDate: [
          { required: true, message: "请选择投用日期", trigger: "change" },
        ],
        codeList: [
          {
            type: "array",
            required: true,
            message: "指标编码",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    getAlltypeList() {
      //重大危险源名称
      list_API({
        page: 1,
        limit: 1000,
      }).then((res) => {
        this.hazardNameList = res.result.list;
      });

      whpxx_API({ page: 1, limit: 1000 }).then((res) => {
        this.dangerousInfoList = res.result.list;
      });

      wxyjcdictindex_API("device_media").then((res) => {
        this.shapeList = res.result;
      });
      wxyjcdictindex_API("tank_type").then((res) => {
        this.containerList = res.result;
      });
      wxyjcdictindex_API("tank_pressure_type").then((res) => {
        this.pressureList = res.result;
      });
      wxyjcdictindex_API("tank_temp_type").then((res) => {
        this.temperatureList = res.result;
      });
      wxyjcdictindex_API("tank_unit").then((res) => {
        this.tankUnitList = res.result;
      });
      wxyjcdictindex_API("tank_diam_unit").then((res) => {
        this.tankDiamUnitList = res.result;
      });
    },
    hazardNameChange(item) {
      this.hazardNameList.map((res) => {
        if (res.id === item) {
          this.ruleForm.hazardName = res.hazardName;
          this.ruleForm.hazardNo = res.hazardNo;
        }
      });
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
      //this.ruleForm.codeList = [];
      this.ruleForm.wxyjcTargetCodeList = [];
      this.ruleForm.editWxyjcTargetCodeList = [];
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
        });
      }
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
      if (this.ruleForm.deviceNo == "") {
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
    buildDateChange(val) {
      if (val) {
        let buildDateTime = new Date(val).getTime();
        let lastMaintenanceDateTime = 0;
        let useDateTime = 0;
        if (this.ruleForm.lastMaintenanceDate) {
          lastMaintenanceDateTime = new Date(
            this.ruleForm.lastMaintenanceDate
          ).getTime();
        }
        if (this.ruleForm.useDate) {
          useDateTime = new Date(this.ruleForm.useDate).getTime();
        }
        if (this.ruleForm.lastMaintenanceDate && this.ruleForm.useDate) {
          if (
            buildDateTime > useDateTime ||
            buildDateTime > lastMaintenanceDateTime
          ) {
            this.ruleForm.buildDate = null;
            this.$message({
              message: "建造日期不能在投用日期或最近检维修日期之后",
              type: "warning",
            });
          }
        } else if (
          this.ruleForm.lastMaintenanceDate &&
          !this.ruleForm.useDate
        ) {
          if (buildDateTime > lastMaintenanceDateTime) {
            this.ruleForm.buildDate = null;
            this.$message({
              message: "建造日期不能在最近检维修日期之后",
              type: "warning",
            });
          }
        } else if (
          !this.ruleForm.lastMaintenanceDate &&
          this.ruleForm.useDate
        ) {
          if (buildDateTime > useDateTime) {
            this.ruleForm.buildDate = null;
            this.$message({
              message: "建造日期不能在投用日期之后",
              type: "warning",
            });
          }
        }
      }
    },
    useDateChange(val) {
      if (val) {
        let buildDateTime = 0;
        let lastMaintenanceDateTime = 0;
        let useDateTime = new Date(val).getTime();
        if (this.ruleForm.lastMaintenanceDate) {
          lastMaintenanceDateTime = new Date(
            this.ruleForm.lastMaintenanceDate
          ).getTime();
        }
        if (this.ruleForm.buildDate) {
          buildDateTime = new Date(this.ruleForm.buildDate).getTime();
        }
        if (this.ruleForm.lastMaintenanceDate && this.ruleForm.buildDate) {
          if (
            useDateTime > lastMaintenanceDateTime ||
            useDateTime < buildDateTime
          ) {
            this.ruleForm.useDate = null;
            this.$message({
              message: "投用日期不能在建造日期之前也不能在最近检维修日期之后",
              type: "warning",
            });
          }
        } else if (
          this.ruleForm.lastMaintenanceDate &&
          !this.ruleForm.buildDate
        ) {
          if (useDateTime > lastMaintenanceDateTime) {
            this.ruleForm.useDate = null;
            this.$message({
              message: "投用日期不能在最近检维修日期之后",
              type: "warning",
            });
          }
        } else if (
          !this.ruleForm.lastMaintenanceDate &&
          this.ruleForm.buildDate
        ) {
          if (useDateTime < buildDateTime) {
            this.ruleForm.useDate = null;
            this.$message({
              message: "投用日期不能在建造日期之前",
              type: "warning",
            });
          }
        }
      }
    },
    lastMaintenanceDateChange(val) {
      if (val) {
        let buildDateTime = 0;
        let lastMaintenanceDateTime = new Date(val).getTime();
        let useDateTime = 0;
        if (this.ruleForm.useDate) {
          useDateTime = new Date(this.ruleForm.useDate).getTime();
        }
        if (this.ruleForm.buildDate) {
          buildDateTime = new Date(this.ruleForm.buildDate).getTime();
        }
        if (this.ruleForm.useDate && this.ruleForm.buildDate) {
          if (
            lastMaintenanceDateTime < buildDateTime ||
            lastMaintenanceDateTime < useDateTime
          ) {
            this.ruleForm.lastMaintenanceDate = null;
            this.$message({
              message: "最近检维修日期不能在建造日期或投用日期之前",
              type: "warning",
            });
          }
        } else if (this.ruleForm.useDate && !this.ruleForm.buildDate) {
          if (lastMaintenanceDateTime < useDateTime) {
            this.ruleForm.lastMaintenanceDate = null;
            this.$message({
              message: "最近检维修日期不能在投用日期之前",
              type: "warning",
            });
          }
        } else if (!this.ruleFormData.useDate && this.ruleForm.buildDate) {
          if (lastMaintenanceDateTime < buildDateTime) {
            this.ruleForm.lastMaintenanceDate = null;
            this.$message({
              message: "最近检维修日期不能在建造日期之前",
              type: "warning",
            });
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>