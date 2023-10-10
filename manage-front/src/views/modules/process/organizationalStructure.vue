<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--title-->
      <el-col :span="24" :xs="24">
        <div class="header-button flex justify-between items-center">
          <span class="title">组织架构图</span>
          <div v-if="ifAdmin === 1">
            <el-button
              type="primary"
              v-if="islock"
              icon="el-icon-lock"
              size="small"
              @click="setlock()"
              >编辑</el-button
            >
            <el-button
              type="primary"
              v-else
              icon="el-icon-unlock"
              size="small"
              @click="setlock()"
              >只读</el-button
            >
          </div>
        </div>
      </el-col>

      <el-col :span="24" :xs="24" style="margin-top: 20px">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="ruleForm"
          size="small"
          :disabled="islock"
        >
          <el-form-item label="组织架构图" prop="organizationChartFilesList">
            <Uploader
              :class="{'uploaderIsdisabled':islock}"
              ref="organizationChartFilesList"
              :multiple="false"
              :limit="5"
              :size="size"
              @uploadCompletion="handleTrainUploadedImage"
            ></Uploader>
          </el-form-item>
          <el-form-item v-if="!islock">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  organization_API,
  info_API,
} from "@/api/modules/process/webcompanyinfo";
import Uploader from "@/components/Uploader";
export default {
  name:"organizationalStructure",
  components: { Uploader },
  data() {
    return {
      size: "small",
      islock: true,
      ruleForm: {
        organizationChartFilesList: [], //组织架构图
      },
      rules: {
        organizationChartFilesList: [
          { required: true, message: "请上传组织架构图", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ifAdmin() {
      return this.$store.state.user.ifAdmin;
    }
  },
  created() {
    this.getFormData();
  },
  methods: {
    getFormData() {
      info_API().then((res) => {
        let obj = res.result;
        this.ruleForm.id = obj.id;
        this.ruleForm.organizationChartFilesList =
          obj.organizationChartFilesList;
        this.$refs["organizationChartFilesList"].setup(
          this.ruleForm.organizationChartFilesList
        );
      });
    },
    handleTrainUploadedImage(fileList) {
      this.ruleForm.organizationChartFilesList = fileList;
    },
    //编辑
    setlock() {
      this.islock = !this.islock;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          organization_API(this.ruleForm).then((res) => {
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
.header-button {
  .title {
    color: #303133;
    line-height: 28px;
    font-size: 16px;
  }
}
/deep/ .uploaderIsdisabled .el-upload-list__item-delete:nth-child(3){
  display: none !important;
}
</style>