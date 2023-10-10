<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <el-col v-if="!eliminate" :span="24">
        <el-form-item label="隐患描述:">
          <el-input
            v-model="display.descript"
            disabled
            placeholder="请输入隐患描述"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <!-- <dept-user-picker
          ref="reformPicker"
          v-model="form"
          :disabled="!editable"
          deptLabel="整改责任部门"
          userLabel="整改责任人"
          deptIdProp="reformDeptId"
          userIdProp="reformUserId"
        ></dept-user-picker> -->
        <el-form-item label="整改责任人:" prop="reformUserId">
          <el-select
            v-model="form.reformUserId"
            :disabled="!editable"
            :placeholder="editable ? '请选择整改责任人' : ''"
            filterable
            clearable
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
      <el-col :span="24">
        <el-form-item label="整改类型:" prop="reformType">
          <el-select
            v-model="form.reformType"
            :disabled="!editable"
            placeholder="请选择整改类型"
            clearable
          >
            <el-option
              v-for="dict in typeOptions"
              :key="dict.label"
              :label="dict.label"
              :value="dict.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="整改期限:" prop="reformDeadline">
          <el-date-picker
            v-model="form.reformDeadline"
            :disabled="!editable"
            :placeholder="editable ? '请选择整改期限' : ''"
            type="date"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="整改情况:" prop="status">
          <el-select
            v-model="form.status"
            :disabled="!editable"
            placeholder="请选择整改情况"
            clearable
            @change="handleStatusChange"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注:" prop="memo">
          <el-input
            v-model="form.memo"
            :disabled="!editable"
            :placeholder="editable ? '请输入备注' : ''"
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否复查:" prop="review">
          <el-radio-group
            v-model="form.review"
            :disabled="editable ? form.status === 3 : true"
            @change="handleReviewChange"
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <template v-if="form.review">
        <el-col :span="24">
          <dept-user-picker
            ref="reviewPicker"
            v-model="form"
            :disabled="!editable"
            deptLabel="复查单位"
            userLabel="复查人"
            deptIdProp="reviewDeptId"
            userIdProp="reviewUserId"
          ></dept-user-picker>
        </el-col>
      </template>
      <template v-if="form.level === 2">
        <el-col :span="24">
          <el-form-item label="重大隐患跟进:" prop="major">
            <el-radio-group
              v-model="form.major"
              :disabled="editable ? form.status === 3 : true"
              @change="handleMajorChange"
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <template v-if="form.major">
          <el-col :span="24">
            <dept-user-picker
              ref="trackPicker"
              v-model="form"
              :disabled="!editable"
              deptLabel="责任部门"
              userLabel="责任人"
              deptIdProp="trackDeptId"
              userIdProp="trackUserId"
            ></dept-user-picker>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查频率:" prop="trackRate">
              <el-input-number
                v-model="form.trackRate"
                :disabled="!editable"
                :min="1"
                :precision="0"
                :placeholder="editable ? '请输入频率' : ''"
                controls-position="right"
                style="width:155px"
              />
              (天/次)
            </el-form-item>
          </el-col>
        </template>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import { listDeptUser } from "@/api/modules/sys/user";
import { getPublish } from "@/api/modules/investigate/trouble";
import DeptUserPicker from "./dept-user-picker";

export default {
  name: "TroublePublishForm",
  components: { DeptUserPicker },
  props: {
    // 表单参数
    value: {
      type: Object
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 隐藏冗余
    eliminate: {
      type: Boolean,
      default: false
    },
    // 是否可见
    visible: {
      type: Boolean,
      default: false
    },
    // 表单标题宽度
    labelWidth: {
      type: String,
      default: "125px"
    }
  },
  data() {
    return {
      // 顶部显示表单参数
      display: {
        descript: undefined
      },
      // 整改情况-编辑
      addOptions: [
        {
          label: "未整改",
          value: 0
        },
        {
          label: "已整改",
          value: 3
        }
      ],
      // 整改情况-显示
      displayOptions: [
        {
          label: "未整改",
          value: 0
        },
        {
          label: "未整改",
          // label: "未复查",
          value: 1
        },
        {
          label: "未整改",
          // label: "复查退回",
          value: 2
        },
        {
          label: "已整改",
          value: 3
        }
      ],
      // 整改情况数据
      statusOptions: [],
      // 人员数据
      userOptions: [],
      // 表单参数-内部
      form: this.value || {
        registerId: undefined,
        level: undefined,
        reformDeptId: undefined,
        reformUserId: undefined,
        reformType: undefined,
        reformDeadline: undefined,
        status: 0,
        review: 1,
        reviewDeptId: undefined,
        reviewUserId: undefined,
        memo: undefined,
        major: 1,
        trackDeptId: undefined,
        trackUserId: undefined,
        trackRate: undefined
      },
      // 表单校验
      rules: {
        reformUserId: [
          { required: true, message: "整改责任人不能为空", trigger: "blur" }
        ],
        reformType: [
          { required: true, message: "整改类型不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "整改情况不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 整改类型 */
    typeOptions() {
      return this.$store.state.common.reformTypes;
    }
  },
  watch: {
    value(val) {
      this.form = val;
    },
    form(val) {
      this.$emit("input", val);
    },
    visible(val) {
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 查询人员列表 */
    getUserList(deptId) {
      if (!deptId) {
        this.userOptions = [];
        return;
      }
      listDeptUser(deptId, 1)
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
    /** 重置相关值 */
    setup(params = undefined, taskId = undefined) {
      this.reset();
      if (taskId) {
        this.statusOptions = this.displayOptions;
        this.form.taskId = taskId;
        this.getData(taskId);
      } else {
        this.statusOptions = this.addOptions;
        if (params) {
          this.form.registerId = params.id || undefined;
          this.form.level = params.level || undefined;
          this.form.reformDeptId = params.respDeptId || undefined;
          this.display.descript = params.description || undefined;
          this.getUserList(params.respDeptId);
        }
      }
    },
    getData(id) {
      getPublish(id).then(response => {
        const result = response.result;
        this.form = { ...result };
        this.form.review = result.reviewDeptId ? 1 : 0;
        this.form.major = result.trackDeptId ? 1 : 0;
        this.getUserList(this.form.reformDeptId);
      });
    },
    /** 表单重置操作 */
    reset() {
      this.display = {
        descript: undefined
      };
      this.form = {
        registerId: undefined,
        reformDeptId: undefined,
        reformUserId: undefined,
        reformType: undefined,
        reformDeadline: undefined,
        status: 0,
        review: 1,
        reviewDeptId: undefined,
        reviewUserId: undefined,
        memo: undefined,
        major: 1,
        trackDeptId: undefined,
        trackUserId: undefined,
        trackRate: undefined
      };
      this.resetForm("form");
    },
    // 整改情况切换操作
    handleStatusChange(value) {
      if (value === 3) {
        this.form.review = 0;
        this.form.major = 0;
        this.form.reviewDeptId = undefined;
        this.form.reviewUserId = undefined;
        this.form.trackDeptId = undefined;
        this.form.trackUserId = undefined;
        this.form.trackRate = undefined;
      }
    },
    // 是否复查切换操作
    handleReviewChange(value) {
      if (value === 0) {
        this.form.reviewDeptId = undefined;
        this.form.reviewUserId = undefined;
      }
    },
    // 重大隐患跟进切换操作
    handleMajorChange(value) {
      if (value === 0) {
        this.form.trackDeptId = undefined;
        this.form.trackUserId = undefined;
        this.form.trackRate = undefined;
      }
    },
    /** 验证表单 */
    validate() {
      const validList = [];
      // const reformValid = this.$refs.reformPicker.verifyPicker();
      // validList.push(reformValid);
      if (this.$refs.reviewPicker)
        validList.push(this.$refs.reviewPicker.verifyPicker());
      if (this.$refs.trackPicker)
        validList.push(this.$refs.trackPicker.verifyPicker());
      const otherValid = new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      validList.push(otherValid);
      return Promise.all(validList);
    },
    /** 清空验证 */
    clearValidate() {
      // this.$refs.reformPicker.clearValidate();
      if (this.$refs.reviewPicker) this.$refs.reviewPicker.clearValidate();
      if (this.$refs.trackPicker) this.$refs.trackPicker.clearValidate();
      this.$refs["form"].clearValidate();
    }
  }
};
</script>
