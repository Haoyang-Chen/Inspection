<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="级别：" prop="level">
            <el-select
              v-model="form.level"
              placeholder="请选择级别"
              clearable
              style="width: 100%"
              :disabled="!editable"
            >
              <el-option
                v-for="dict in targetLevelOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="责任部门：" prop="dept">
            <el-input v-model="form.dept" placeholder="请输入责任部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="完成期限：" prop="completeYear">
            <el-date-picker
              v-model="form.completeYear"
              type="year"
              :disabled="!editable"
              value-format="yyyy"
              placeholder="请选择完成期限"
            ></el-date-picker>
            <span style="padding-left:10px">年</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="创建人：" prop="createUserName">
            <el-input v-model="form.createUserName" placeholder="请输入创建人" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息：" prop="memo">
            <el-input v-model="form.memo" placeholder="请输入描述信息" type="textarea" :rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0" prop="targetModelList">
        <el-table
          :data="form.targetModelList"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="类型" align="center" prop="type">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.type" :disabled="!editable"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="目标指标" align="center" prop="quota">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.quota" :disabled="!editable"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="指标" align="center" prop="value" width="200px">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.value" :disabled="!editable" style="width:80px;margin-right:10px"></el-input>
              <el-select
                v-model="scope.row.symbol"
                placeholder="选择"
                clearable
                size="mini"
                style="width: 70px"
                :disabled="!editable"
              >
                <el-option
                  v-for="dict in signOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="center" prop="unit">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.unit" :disabled="!editable"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            v-if="editable"
            label="操作"
            align="center"
            width="120"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <i class="el-icon-circle-plus" @click="handleAdd()"></i>
              <i class="el-icon-remove" @click="handleDel(scope.$index)" v-if="form.targetModelList.length > 1"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">{{ editable ? '取 消': '关 闭'}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDistribute, updateDistribute } from "@/api/modules/process/duty/targetDistribute";

export default {
  name: "TargetDistributeForm",
  components: {},
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "800px"
    },
    // 弹出层标题
    title: {
      type: String,
      default: "添加"
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: this.initForm(),
      rules: {
        title: [
          { required: true, message: '目标内容不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '级别不能为空', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '责任部门不能为空', trigger: 'blur' }
        ],
        completeYear: [
          { required: true, message: '完成期限不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 目标级别数据字典 */
    targetLevelOptions() {
      return this.$store.state.common.targetLevels;
    },
    signOptions() {
      return [
        { label: '＝', value: '1'},
        { label: '＞', value: '2'},
        { label: '＜', value: '3'},
        { label: '≥', value: '4'},
        { label: '≤', value: '5'},
      ]
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 重置 */
    setup(params) {
      this.form = JSON.parse(JSON.stringify(params));
    },
    handleAdd() {
      var base = { type: undefined, quota: undefined, value: undefined, symbol: undefined, unit: undefined };
      this.form.targetModelList.push(base);
    },
    handleDel(index) {
      this.form.targetModelList.splice(index, 1);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateDistribute : addDistribute;
          opFunc(this.form).then(response => {
            this.msgSuccess(this.form.id ? "修改成功" : "新增成功");
            this.visible = false;
            this.$emit("submitSuccess");
          })
        } else {
          return false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.visible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = this.initForm();
      this.resetForm("form");
    },
    initForm() {
      return {
        id: undefined,
        title: undefined,
        level: undefined,
        dept: undefined,
        completeYear: undefined,
        memo: undefined,
        createUserName: undefined,
        targetModelList: [{
          type: undefined, // 类型
          quota: undefined, // 目标指标
          value: undefined, // 指标值
          symbol: undefined, // 指标符号
          unit: undefined // 单位
        }]
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .tipsFont .el-input__inner{
  color:red
}
.el-icon-circle-plus {
  color: #1890ff;
  font-size: 26px;
  margin-right: 5px;
}
.el-icon-remove {
  color: #ff4949;
  font-size: 26px;
}
</style>