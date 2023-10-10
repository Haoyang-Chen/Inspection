<template>
  <div>
    <el-form :model="form" ref="form" label-width="0" class="demo-ruleForm">
      <!-- 可能性（L） -->
      <el-form-item
        prop="lmodeList"
        :rules="[
          { required: true, message: '事故发生的可能性（L）不能为空', trigger: 'change' }
        ]"
      >
        <basic-table 
          v-model="form.lmodeList"
          :columnName="tableL"
          :editable="editable"
          :selectedAlgorithmModel="selectedModel.lmode || {}"
          :tableType='1'
          @singleChang="singleChang"
          :class="editable ? '': 'mb10'">
        </basic-table>
      </el-form-item>
      <!-- 严重性（S） -->
      <el-form-item
        prop="smodeList"
        :rules="[
          { required: true, message: '事件后果严重性（S）不能为空', trigger: 'change' }
        ]"
      >
        <basic-table
          v-model="form.smodeList"
          :columnName="tableS"
          :editable="editable"
          :selectedAlgorithmModel="selectedModel.smode || {}"
          :tableType='2'
          @singleChang="singleChang"
          :class="editable ? '': 'mb10'"
          >
        </basic-table>
      </el-form-item>
      <template v-if="editable">
        <div class="mb10">安全风险等级判定准则</div>
        <el-form-item
          prop="levelList"
          :rules="[
            { required: true, validator: validateLevel, trigger: 'blur' }
          ]"
        >
          <level-table v-model="form.levelList"></level-table>
        </el-form-item>
        <div style="text-align:center;margin-top:15px;">
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script>
import BasicTable from "./table-form";
import LevelTable from "./level-form";
import { editLS } from "@/api/modules/risk/algorithm";

export default {
  components: {
    BasicTable,
    LevelTable
  },
  props: {
    value: {
      type: Object
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 选择的算法
    selectedModel: {
      type: Object,
      default: ()=>{ return {} }
    }
  },
  data() {
    return {
      // 表单参数
      form: {},
      tableL: '事故发生的可能性（L）',
      tableS: '事件后果严重性（S）',
      // 算法
      algorithmModel: {}
    }
  },
  watch: {
    value(val) {
      this.form = val ? val : {
        lmodeList: [], // 事故发生的可能性（L）
        smodeList: [], // 事件后果严重性（S）
        levelList: [ // first 风险等级 second 最小值 third 最大值
          { first: 4, second: null, third: null },
          { first: 3, second: null, third: null },
          { first: 2, second: null, third: null },
          { first: 1, second: null, third: null } 
        ]
      };
    },
    form(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    setup(params) {
      this.form = params ? params : {
        lmodeList: [], // 事故发生的可能性（L）
        smodeList: [] // 事件后果严重性（S）
      };
    },
    /** 保存操作 */
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          editLS(this.form).then(res => {
            this.$message.success('编辑成功');
            this.$emit("submitSuccess");
          })
        }
      })
    },
    /** 选择的算法 */
    singleChang(type, val) {
      if (type === 1) {
        this.algorithmModel.lmode = val;
      } else {
        this.algorithmModel.smode = val;
      }
      this.$emit('getAlgorithmModel', this.algorithmModel)
    },
    /** 安全风险等级判定准则验证 */
    validateLevel(rule, value, callback) {
      if (value == undefined || value == null || value == "")
        return callback(new Error("安全风险等级判定准则不能为空"))
      if (!value[3].third || !value[2].second || !value[2].third || !value[1].second || !value[1].third || !value[0].second)
        return callback(new Error("安全风险等级判定准则不完整"))
      if (!this.validateScore(value[3].third) || !this.validateScore(value[2].second) || !this.validateScore(value[2].third) || !this.validateScore(value[1].second) || !this.validateScore(value[1].third) || !this.validateScore(value[0].second))
        return callback(new Error("风险值要大于0"))
      callback()
    },
    validateScore(score) {
      return score > 0
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  text-align: center;
  height: 32px;
  line-height: 32px;
}
.btn {
  text-align: center;
  margin-bottom: 20px;
  background: #f8f8f9;
}
</style>