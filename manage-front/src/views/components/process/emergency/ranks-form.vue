<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      class="demo-form"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="队伍名称：" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入队伍名称"
              :disabled="!editable"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="队伍级别：" prop="level">
            <el-select
              v-model="form.level"
              placeholder="请选择队伍级别"
              :disabled="!editable"
              clearable
            >
              <el-option
                v-for="dict in ranksLevelOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="队伍负责人：" prop="respUser">
            <el-input
              v-model="form.respUser"
              placeholder="请输入队伍负责人"
              :disabled="!editable"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人手机：" prop="mobile">
            <el-input
              v-model="form.mobile"
              placeholder="请输入负责人手机"
              :disabled="!editable"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="固定电话：" prop="tellphone">
            <el-input
              v-model="form.tellphone"
              placeholder="请输入固定电话"
              :disabled="!editable"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人部门：" prop="dept">
            <el-input
              v-model="form.dept"
              placeholder="请输入负责人部门"
              :disabled="!editable"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述：" prop="memo">
            <el-input
              v-model="form.memo"
              placeholder="请输入描述"
              type="textarea"
              :rows="3"
              :disabled="!editable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0" prop="workerList">
        <el-table :data="form.workerList">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="工号" align="center" prop="workNo">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.workNo"
                :disabled="!editable"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="人员名称" align="center" prop="name">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.name"
                :disabled="!editable"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" prop="sex">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.sex"
                :disabled="!editable"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" align="center" prop="phone">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.phone"
                :disabled="!editable"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="职位" align="center" prop="position">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.position"
                :disabled="!editable"
                clearable
              ></el-input>
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
              <i
                class="el-icon-remove"
                @click="handleDel(scope.$index)"
                v-if="form.workerList.length > 1"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">{{ editable ? "取 消" : "关 闭" }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addRanks,
  updateRanks,
  ranksDetail,
} from "@/api/modules/process/emergency/ranks";


export default {
  name: "RanksForm",
  components: {},
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "800px",
    },
    // 弹出层标题
    title: {
      type: String,
      default: "添加",
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: this.initForm(),
      rules: {
        name: [
          { required: true, message: "队伍名称不能为空", trigger: "blur" },
        ],
        respUser: [
          { required: true, message: "队伍负责人不能为空", trigger: "blur" },
        ],
        mobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    /** 队伍级别数据字典 */
    ranksLevelOptions() {
      return this.$store.state.common.ranksLevels;
    },
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
    },
  },
  created() {},
  methods: {
    /** 重置 */
    setup(id) {
      ranksDetail(id).then((res) => {
        this.form = res.result;
      });
    },
    /** 添加 */
    handleAdd() {
      var base = {
        workNo: undefined,
        name: undefined,
        sex: undefined,
        phone: undefined,
        position: undefined,
      };
      this.form.workerList.push(base);
    },
    /** 删除 */
    handleDel(index) {
      this.form.workerList.splice(index, 1);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateRanks : addRanks;
          opFunc(this.form).then((response) => {
            this.msgSuccess(this.form.id ? "修改成功" : "新增成功");
            this.visible = false;
            this.$emit("submitSuccess");
          });
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
        name: undefined,
        level: undefined,
        respUser: undefined,
        mobile: undefined,
        tellphone: undefined,
        dept: undefined,
        memo: undefined,
        workerList: [
          {
            workNo: undefined,
            name: undefined,
            sex: undefined,
            phone: undefined,
            position: undefined,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .tipsFont .el-input__inner {
  color: red;
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