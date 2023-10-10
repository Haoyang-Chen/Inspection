<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="GPS识别范围设置:" prop="distance" style="width:370px">
        <el-input-number
          v-model="form.distance"
          :min="1"
          :precision="0"
          controls-position="right"
          placeholder="请输入识别范围"
        ></el-input-number>
        <span>(米)</span>
      </el-form-item>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </el-form>
  </div>
</template>

<script>
import { GPSInfo, updateGPS } from "@/api/modules";

export default {
  name: "GPSRange",
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        distance: [
          { required: true, message: "GPS识别范围不能为空", trigger: "blur" }
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
      GPSInfo().then(response => {
        const result = response.result;
        if (result) {
          this.form = result;
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateGPS(this.form.distance).then(response => {
            this.msgSuccess("保存成功");
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding-top: 15%;
  form {
    width: 50%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      width: 40%;
      margin-top: 15px;
    }
  }
}
</style>
