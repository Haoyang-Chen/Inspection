<template>
  <div class="app-container bg-image">
    <div class="main-box">
      <el-row type="flex" justify="center">
        <el-col>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
          >
            <el-form-item label="设置人" prop="uploader">
              {{ ruleForm.uploader }}
            </el-form-item>
            <el-form-item label="设置日期" prop="uploaderDate">
              {{ ruleForm.uploaderDate }}
            </el-form-item>
            <el-form-item label="起始日期" prop="startDate">
              <el-date-picker
                v-model="ruleForm.startDate"
                :picker-options="startPickerOptions"
                type="date"
                placeholder="选择起始日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 300px"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否结束" prop="isFinish">
              <el-select
                v-model="ruleForm.isFinish"
                style="width: 300px"
                placeholder="是否结束"
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
            <template v-if="ruleForm.isFinish == 1">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="ruleForm.endDate"
                  :picker-options="endPickerOptions"
                  type="date"
                  placeholder="选择结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 300px"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="附件">
                <Uploader
                  ref="fileUploadList"
                  listType="text"
                  :multiple="false"
                  :limit="5"
                  accept="*"
                  :size="size"
                  @uploadCompletion="handleFileUploadList"
                ></Uploader>
              </el-form-item>
            </template>
            <el-form-item label="备注" prop="reason">
              <el-input
                type="textarea"
                v-model="ruleForm.reason"
                :rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-row style="margin-left: 120px; margin-top: 70px">
            <el-col :span="24">
              <el-button type="primary" @click="submitForm('ruleForm')"
                >保 存</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="btn">
      <el-button icon="el-icon-tickets" @click="handleClick" size="small"
        >记录查询</el-button
      >
    </div>
    <!-- 记录查询弹出层 -->
    <EnterpriseSafetyOp v-model="dialogVisible"></EnterpriseSafetyOp>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  save_API,
  currentInfo_API,
} from "@/api/modules/process/webcontratorsafeoperation";
import Uploader from "@/components/Uploader";
import { getCurrentDate } from "@/views/modules/ins/utils";
import EnterpriseSafetyOp from "./components/EnterpriseSafetyOp";

export default {
  name: "EnterpriseSafetyOperation",
  computed: {
    ...mapGetters(["trueFalseList"]),
  },
  components: { Uploader, EnterpriseSafetyOp },
  data() {
    return {
      size: "small",
      // 是否显示弹出层
      dialogVisible: false,
      // 表单参数
      ruleForm: {
        uploader: this.$store.state.user.name,
        uploaderDate: getCurrentDate(),
        startDate: undefined,
        endDate: undefined,
        isFinish: 0, // 默认否
        fileUploadList: [],
      },
      rules: {
        startDate: [{ required: true, message: "起始日期", trigger: "change" }],
        endDate: [{ required: true, message: "结束日期", trigger: "change" }],
      },
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      endPickerOptions: {
        disabledDate: this.endDisabledDate,
      },
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    endDisabledDate(time) {
      return (
        time.getTime() <
          Date.parse(this.ruleForm.startDate) - 24 * 3600 * 1000 ||
        time.getTime() > Date.now()
      );
    },
    /** 企业安全运行最新信息 */
    getInfo() {
      currentInfo_API().then((response) => {
        const result = response.result;
        if (result) {
          this.ruleForm = result;
          if (this.ruleForm.fileUploadList)
            this.$refs["fileUploadList"].setup(this.ruleForm.fileUploadList);
        }
      });
    },
    // 文件上传回调
    handleFileUploadList(fileList) {
      this.ruleForm.fileUploadList = fileList;
    },
    /** 保存按钮操作 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.isFinish == 0) {
            this.ruleForm.endDate = undefined;
          }
          save_API(this.ruleForm).then((res) => {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            this.getInfo();
          });
        }
      });
    },
    /** 记录查询弹出层 */
    handleClick() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-image {
  background: url("../../../assets/image/smsd.png") no-repeat center center;
  background-size: 100%;
}
.app-container {
  position: relative;
  min-height: calc(100vh - 84px);
  .main-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-60%, -50%);
    min-width: 500px;
    font-size: 20px;
  }
}
.btn {
  position: absolute;
  right: 5%;
  top: 5%;
}
</style>
