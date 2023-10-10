<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-row :gutter="40">
        <!-- 风险点检查设定 -->
        <el-col :span="24" class="settings-risk">
          <div class="settings-title">风险点检查设定</div>
          <div class="settings-updateTime-updateUserName" v-if="form.updateTime">
            <span> 最新设定时间：</span>
            <span>{{ form.updateTime }}</span>
            <span style="margin-left: 20px">设定人：</span>
            <span>{{ form.updateUserName }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重大风险检查频率:" prop="zdRate">
            <el-input-number
              v-model="form.zdRate"
              :min="1"
              :precision="0"
              controls-position="right"
              placeholder="请输入重大风险检查频率"
              style="width: 220px"
            ></el-input-number>
            <span> (天)</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="较大风险检查频率:" prop="jdRate">
            <el-input-number
              v-model="form.jdRate"
              :min="1"
              :precision="0"
              controls-position="right"
              placeholder="请输入较大风险检查频率"
              style="width: 220px"
            ></el-input-number>
            <span> (天)</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="一般风险检查频率:" prop="ybRate">
            <el-input-number
              v-model="form.ybRate"
              :min="1"
              :precision="0"
              controls-position="right"
              placeholder="请输入一般风险检查频率"
              style="width: 220px"
            ></el-input-number>
            <span> (天)</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="低风险检查频率:" prop="diRate">
            <el-input-number
              v-model="form.diRate"
              :min="1"
              :precision="0"
              controls-position="right"
              placeholder="请输入低风险检查频率"
              style="width: 220px"
            ></el-input-number>
            <span> (天)</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </el-form>
  </div>
</template>

<script>
import { rateDetail, rateEdit } from "@/api/modules/risk/rate";

export default {
  name: "OrgRiskSettings",
  data() {
    return {
      // 表单参数
      form: {
        id: undefined,
        updateTime: undefined,
        updateUserName: undefined,
        zdRate: undefined,
        jdRate: undefined,
        ybRate: undefined,
        diRate: undefined,
      },
      rules: {
        zdRate: [
          { required: true, message: '重大风险检查频率不能为空', trigger: 'blur' }
        ],
        jdRate: [
          { required: true, message: '较大风险检查频率不能为空', trigger: 'blur' }
        ],
        ybRate: [
          { required: true, message: '一般风险检查频率不能为空', trigger: 'blur' }
        ],
        diRate: [
          { required: true, message: '低风险检查频率不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  created() {
    this.getData();
  },
  methods: {
    /** 查询主数据 */
    getData() {
      this.reset();
      rateDetail().then((response) => {
        const result = response.result;
        if (result) {
          this.form = result;
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          rateEdit(this.form).then((_) => {
            this.msgSuccess("保存成功");
            this.getData();
          });
        } else {
          return false;
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        updateTime: undefined,
        updateUserName: undefined,
        zdRate: undefined,
        jdRate: undefined,
        ybRate: undefined,
        diRate: undefined,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 5%;
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      width: 100px;
      margin-top: 22px;
    }
  }
}
.settings-risk {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.settings-title {
  font-size: 18px;
  color: #303133;
  font-weight: bold;
}
.settings-updateTime-updateUserName{
  color: #606266;
  padding-left: 3%;
}
/deep/ .el-input.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border: #dfe4ed solid 1px !important;
  color: #c0c4cc;
}

/deep/ .el-form-item__label{
  font-weight: normal;
}
</style>
