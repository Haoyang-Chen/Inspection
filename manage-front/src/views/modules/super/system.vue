<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="系统名称:" prop="systemName">
            <el-input v-model="form.systemName" placeholder="请输入系统名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="系统简称:" prop="systemShort">
            <el-input v-model="form.systemShort" placeholder="请输入系统简称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="系统LOGO:" prop="systemLogoFile">
            <uploader
              ref="uploader"
              :multiple="false"
              :limit="1"
              @uploadCompletion="handleUploadCompletion"
            ></uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="技术支持:" prop="systemTec">
            <el-input v-model="form.systemTec" placeholder="请输入技术支持" />
          </el-form-item>
        </el-col>
        <el-col :offset="10">
          <el-button type="primary" style="width:30.9%;" @click="submitForm"
            >保 存</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { sysInfo, updateSys } from "@/api/modules";
import Uploader from "@/components/Uploader";

export default {
  name: "SystemInfo",
  components: { Uploader },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        systemName: [
          { required: true, message: "系统名称不能为空", trigger: "blur" }
        ],
        systemShort: [
          { required: true, message: "系统简称不能为空", trigger: "blur" }
        ],
        systemTec: [
          { required: true, message: "技术支持不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    /** 查询主列表 */
    getData() {
      sysInfo().then(response => {
        const result = response.result;
        this.form = result;
        this.setupUploader([result.systemLogoFile]);
      });
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup([...fileList]);
      });
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.systemLogoFile = fileList && fileList.length ? fileList[0] : undefined;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateSys(this.form).then(response => {
            this.msgSuccess("保存成功");
            this.$store.dispatch("SetSystemInfo", { ...this.form });
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding-top: 8%;
  form {
    width: 45%;
    margin: 0 auto;
  }
}
</style>
