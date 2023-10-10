<template>
  <el-form
    ref="form"
    :model="form"
    :label-width="labelWidth"
    class="dept-user-picker"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item
          :label="deptLabel + ':'"
          :prop="deptIdProp"
          :rules="[
            {
              required: deptRequired,
              message: deptLabel + '不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <treeselect
            v-model="form[deptIdProp]"
            :options="deptOptions"
            :normalizer="deptNormalizer"
            :show-count="true"
            :disable-branch-nodes="false"
            :clearable="true"
            :searchable="true"
            :disabled="disabled"
            :placeholder="!disabled ? '请选择' + deptLabel : ''"
            noResultsText="未找到结果..."
            clearAllText="清除"
            @select="deptSelect"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="userLabel + ':'"
          :prop="userIdProp"
          :rules="[
            {
              required: userRequired,
              message: userLabel + '不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <el-select
            v-model="form[userIdProp]"
            :disabled="disabled"
            :placeholder="!disabled ? '请选择' + userLabel : ''"
            filterable
            clearable
            @change="userSelect"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { treeDept } from "@/api/modules/sys/dept";
import { listDeptUsers } from "@/api/modules/sys/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "DeptUserPicker",
  components: { Treeselect },
  props: {
    // 模型数据
    value: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    deptLabel: {
      type: String,
      default: "部门"
    },
    userLabel: {
      type: String,
      default: "人员"
    },
    deptIdProp: {
      type: String,
      required: true
    },
    deptNameProp: {
      type: String,
      default: ""
    },
    userIdProp: {
      type: String,
      required: true
    },
    userNameProp: {
      type: String,
      default: ""
    },
    deptRequired: {
      type: Boolean,
      default: true
    },
    userRequired: {
      type: Boolean,
      default: true
    },
    // 表单标题宽度
    labelWidth: {
      type: String,
      default: "125px"
    }
  },
  data() {
    return {
      // 模型数据-内部
      form: this.value || {
        [this.deptIdProp]: undefined,
        [this.userIdProp]: undefined
      },
      // 部门树数据
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      // 人员数据
      userOptions: []
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.form = val;
    },
    form(newVal, oldVal) {
      this.$emit("input", newVal);
      if (
        newVal[this.deptIdProp] != oldVal[this.deptIdProp] &&
        newVal[this.deptIdProp]
      )
        this.getUserList(newVal[this.deptIdProp]);
    }
  },
  created() {
    this.getDeptTree();
  },
  methods: {
    /** 查询部门树 */
    getDeptTree() {
      treeDept({ withoutTeam: 1 }).then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 查询人员列表 */
    getUserList(deptId) {
      listDeptUsers(deptId)
        .then(response => {
          const result = response.result.list;
          if (result && result.length) {
            this.userOptions = result.map(item => {
              return { value: item.userId, label: item.name };
            });
          } else {
            this.userOptions = [];
          }
        })
        .catch(_ => {
          this.userOptions = [];
        });
    },
    /** 根据部门id查询人员列表 */
    deptSelect(node, instanceId) {
      this.form[this.userIdProp] = undefined;
      if (this.userNameProp && this.userNameProp.length)
        this.form[this.userNameProp] = "";
      if (this.deptNameProp && this.deptNameProp.length)
        this.form[this.deptNameProp] = node.name;
      const deptId = node.deptId;
      if (deptId) this.getUserList(deptId);
      else this.userOptions = [];
    },
    /** 人员选择 */
    userSelect(value) {
      if (this.userNameProp && this.userNameProp.length)
        this.form[this.userNameProp] = this.userOptions.find(
          item => item.value === value
        ).label;
    },
    /** 验证表单 */
    verifyPicker() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>

<style lang="scss">
.dept-user-picker {
  .vue-treeselect__single-value {
    color: #606266;
  }
  .vue-treeselect--disabled .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
