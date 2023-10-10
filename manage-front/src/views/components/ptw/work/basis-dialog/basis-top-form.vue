<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <el-col :span="12">
        <el-form-item
          :label="isParent ? '作业票种类:' : '关联作业票种类:'"
          prop="type"
        >
          <el-select
            v-model="form.type"
            :disabled="!editable || !!form.id"
            clearable
            placeholder="请选择作业票种类"
            @change="handleTypeChange"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="levelOptions.length" :span="12">
        <el-form-item label="作业级别:" prop="level">
          <el-select
            v-model="form.level"
            :disabled="!editable"
            clearable
            placeholder="请选择作业级别"
            @change="handleLevelChange"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="作业区域:" prop="workArea">
          <el-select
            v-model="form.workArea"
            :disabled="!editable"
            filterable
            clearable
            placeholder="请选择作业区域"
          >
            <el-option
              v-for="item in areaOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="作业内容:" prop="workContent">
          <el-input
            v-model="form.workContent"
            :disabled="!editable"
            type="textarea"
            placeholder="请输入作业内容"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="申请作业开始时间:"
          prop="startTime"
          :rules="[
            {
              required: true,
              validator: validateStartTime,
              trigger: 'blur'
            }
          ]"
        >
          <el-date-picker
            v-model="form.startTime"
            :picker-options="startPickerOptions"
            :disabled="!editable"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="申请作业结束时间:"
          prop="endTime"
          :rules="[
            {
              required: true,
              validator: validateEndTime,
              trigger: 'blur'
            }
          ]"
        >
          <el-date-picker
            v-model="form.endTime"
            :picker-options="endPickerOptions"
            :disabled="!editable"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-if="diffTips" :span="24">
        <div
          style="margin-bottom:22px"
          v-bind:style="{ 'margin-left': labelWidth }"
        >
          {{ `(时间间隔提示：${diffTips})` }}
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { typesSubwork } from "@/api/modules/ptw/work";
import { listArea } from "@/api/modules/sys/area";
import { workLevels, workIntervalTips, verifyWorkInterval } from "../utils";

export default {
  name: "BasisTopForm",
  components: {},
  props: {
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 是否主票
    isParent: {
      type: Boolean,
      default: true
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
      /** 作业票种类 */
      typeOptions: [],
      // 作业区域
      areaOptions: [],
      // 开始时间不可选日期
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000;
        }
      },
      // 表单参数
      form: {
        id: undefined,
        type: undefined,
        level: undefined,
        workArea: undefined,
        workContent: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 表单验证
      rules: {
        type: [
          { required: true, message: "作业票种类不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "作业级别不能为空", trigger: "blur" }
        ],
        workArea: [
          { required: true, message: "作业区域不能为空", trigger: "blur" }
        ],
        workContent: [
          { required: true, message: "作业内容不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 作业级别 */
    levelOptions() {
      return workLevels(this.form.type);
    },
    /** 结束时间不可选日期 */
    endPickerOptions() {
      let that = this;
      return {
        disabledDate(time) {
          if (that.form.startTime) {
            return (
              time.getTime() <
              Date.parse(that.form.startTime) - 24 * 3600 * 1000
            );
          } else {
            return time.getTime() < Date.now() - 24 * 3600 * 1000;
          }
        }
      };
    },
    /** 时间间隔提示信息 */
    diffTips() {
      return workIntervalTips(this.form.type, this.form.level);
    }
  },
  watch: {
    visible(val) {
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(data) {
      this.reset();
      this.getSubworkTypes(data.parentId || undefined);
      this.getAreaList();
      if (data) {
        const parseData = JSON.parse(JSON.stringify(data));
        this.form.id = parseData.id || undefined;
        this.form.type = parseData.type || undefined;
        this.form.level = parseData.level != null ? parseData.level : undefined;
        this.form.workArea = parseData.workArea || undefined;
        this.form.workContent = parseData.workContent || undefined;
        this.form.startTime = parseData.startTime || undefined;
        this.form.endTime = parseData.endTime || undefined;
      }
    },
    /** 查询所有已经添加的子作业票类型 */
    getSubworkTypes(parentId) {
      this.typeOptions = [];
      const types = JSON.parse(
        JSON.stringify(this.$store.state.common.workTypes)
      );
      if (!parentId) this.typeOptions = types;
      else
        typesSubwork(parentId).then(response => {
          const result = response.result;
          if (result && result.length) {
            types.forEach(item => {
              item.disabled = result.includes(item.value);
            });
            this.typeOptions = types;
          }
        });
    },
    /** 查询作业区域列表 */
    getAreaList() {
      listArea({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result.list;
        if (result && result.length) {
          this.areaOptions = result.map(item => {
            return { value: item.id, label: item.name };
          });
        }
      });
    },
    /** 作业票种类切换 */
    handleTypeChange(value) {
      this.form.level = undefined;
      this.$emit("typeChange", value);
      this.$emit("levelChange", undefined);
    },
    /** 作业级别切换 */
    handleLevelChange(value) {
      this.$emit("levelChange", value);
    },
    /** 开始时间验证 */
    validateStartTime(rule, value, callback) {
      if (value == undefined || value == null || value == "")
        return callback(new Error("申请作业开始时间不能为空"));
      if (Date.parse(value) <= Date.now())
        return callback(new Error("申请作业开始时间必须大于当前时间"));
      if (!this.validateTimeDiff(value, this.form.endTime))
        return callback(new Error("时间间隔不符合要求，请遵循提示"));
      callback();
    },
    /** 结束时间验证 */
    validateEndTime(rule, value, callback) {
      if (value == undefined || value == null || value == "")
        return callback(new Error("申请作业结束时间不能为空"));
      if (Date.parse(value) <= Date.parse(this.form.startTime))
        return callback(new Error("申请作业结束时间必须大于开始时间"));
      if (!this.validateTimeDiff(this.form.startTime, value))
        return callback(new Error("时间间隔不符合要求，请遵循提示"));
      callback();
    },
    validateTimeDiff(start, end) {
      return verifyWorkInterval(start, end, this.form.type, this.form.level);
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        id: undefined,
        type: undefined,
        level: undefined,
        workArea: undefined,
        workContent: undefined,
        startTime: undefined,
        endTime: undefined
      };
      // this.resetForm("form");
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const parseData = JSON.parse(JSON.stringify(this.form));
            resolve(parseData);
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
