<template>
  <div>
    <el-form :model="form" ref="form" label-width="0" class="demo-ruleForm">
      <!-- 状态（M） -->
      <el-form-item
        prop="mmodeList"
        :rules="[
          { required: true, message: '控制措施的状态（M）不能为空', trigger: 'change' }
        ]"
      >
        <basic-table
          v-model="form.mmodeList"
          :columnName="tableM"
          :editable="editable"
          :tableType='1'
          :selectedAlgorithmModel="selectedModel.mmode || {}"
          @singleChang="singleChang"
          :class="editable ? '': 'mb10'"
          ></basic-table>
      </el-form-item>
      <!-- 频繁程度（E） -->
      <el-form-item
        prop="emodeList"
        :rules="[
          { required: true, message: '人体暴露于危险状态的频繁程度（E）不能为空', trigger: 'change' }
        ]"
      >
        <basic-table
          v-model="form.emodeList"
          :columnName="tableE"
          :editable="editable"
          :tableType='2'
          :selectedAlgorithmModel="selectedModel.emode || {}"
          @singleChang="singleChang"
          :class="editable ? '': 'mb10'"
        ></basic-table>
      </el-form-item>
      <!-- 严重性（S） -->
      <el-form-item
        prop="smodeList"
        :rules="[
          { required: true, message: '事故的可能后果严重性（S）不能为空', trigger: 'change' }
        ]"
      >
        <basic-table
          v-model="form.smodeList"
          :columnName="tableS"
          :editable="editable"
          :tableType='3'
          :selectedAlgorithmModel="selectedModel.smode || {}"
          @singleChang="singleChang"
          :class="editable ? '': 'mb10'">
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
import { editMES } from "@/api/modules/risk/algorithm";

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
      tableM: '控制措施的状态（M）',
      tableE: '人体暴露于危险状态的频繁程度（E）',
      tableS: '事故的可能后果严重性（S）',
      algorithmModel: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        this.form = val ? val : {
          mmodeList: [], // 状态
          emodeList: [], // 频繁程度
          smodeList: [], // 严重性
          levelList: [ // first 风险等级 second 最小值 third 最大值
            { first: 4, second: null, third: null },
            { first: 3, second: null, third: null },
            { first: 2, second: null, third: null },
            { first: 1, second: null, third: null } 
          ] // 风险 // 风险等级
        };
      },
      immediate: true
    },
    form(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    setup(params) {
      this.form = params ? params : {
        mmodeList: [], // 状态
        emodeList: [], // 频繁程度
        smodeList: [] // 
      };
    },
    /** 保存操作 */
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          editMES(this.form).then(res => {
            this.$message.success('编辑成功');
            this.$emit("submitSuccess");
          })
        }
      })
    },
    /** 选择的算法 */
    singleChang(type, val) {
      if (type === 1) {
        this.algorithmModel.mmode = val;
      } else if (type === 2) {
        this.algorithmModel.emode = val;
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