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
        <el-col :span="12">
          <el-form-item label="设备类别" prop="deviceCategory">
            <el-select v-model="ruleForm.deviceCategory" placeholder="请选择">
              <el-option
                v-for="item in equipmentCategoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备描述" prop="deviceDes">
            <el-input type="textarea" v-model="ruleForm.deviceDes"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-for="(item, index) in ruleForm.wxyjcTargetCodeList"
            :key="index"
            label="检测气体"
            :prop="'wxyjcTargetCodeList.' + index + '.targetType'"
            :rules="rules.targetType"
          >
            <div class="flex mb10">
              <el-input
                v-model="item.targetType"
                placeholder="请填写"
                style="margin-right: 10px; min-width: 174px"
              ></el-input>
              <!-- <el-input
                v-model="item.targetCode"
                placeholder="指标编码"
                style="margin-right: 10px; min-width: 174px"
              ></el-input> -->
              <el-button
                icon="el-icon-plus"
                type="primary"
                circle
                @click="handleAdd()"
              ></el-button>
              <el-button
                v-if="ruleForm.wxyjcTargetCodeList.length > 1"
                icon="el-icon-minus"
                type="danger"
                circle
                @click="handleRemove(index)"
              ></el-button>
            </div>
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
} from "@/api/modules/wxyjc/wxyjcdangerousgaspoint";
import { check_API } from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import { list_API } from "@/api/modules/wxyjc/wxyjcdangeroushazard";
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
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
      equipmentCategoryList: [],
      ruleForm: {
        id: undefined,
        hazardId: undefined,
        hazardNo: undefined,
        deviceNo: undefined,
        deviceCategory: undefined,
        deviceDes: undefined,
        wxyjcTargetCodeList: [{ targetType: undefined, targetCode: undefined }],
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
        deviceCategory: [
          { required: true, message: "设备类别", trigger: "change" },
        ],
        deviceDes: [{ required: true, message: "设备描述", trigger: "blur" }],
        targetType: [{ required: true, message: "检测气体", trigger: "blur" }],
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
      wxyjcdictindex_API("device_category_sub").then((res) => {
        this.equipmentCategoryList = res.result;
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
      this.ruleForm.wxyjcTargetCodeList = [{ targetType: undefined }];
    },
    editTemp(id) {
      info_API(id).then((res) => {
        this.ruleForm = res.result;
      });
    },
    //保存
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
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
    handleAdd() {
      let param = {
        targetCode: undefined,
        targetType: undefined,
      };
      this.ruleForm.wxyjcTargetCodeList.push(param);
    },
    handleRemove(index) {
      this.ruleForm.wxyjcTargetCodeList.splice(index, 1);
    },
    deviceNoChange() {
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
</style>