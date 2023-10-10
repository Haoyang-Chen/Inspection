<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item label="延期原因:" prop="delayReason">
          <el-input
            v-model="form.delayReason"
            :disabled="type !== 1"
            type="textarea"
            placeholder="请输入延期原因"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请作业开始时间:" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            disabled
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请作业结束时间:" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            disabled
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col
        v-for="(item, index) in form.delayEndDateList"
        :key="index"
        :span="24"
      >
        <el-form-item
          :label="`第${index + 1}次延期结束时间:`"
          :prop="'delayEndDateList.' + index + '.value'"
        >
          <el-date-picker
            v-model="item.value"
            disabled
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-if="type === 1" :span="24">
        <el-form-item
          label="作业延期结束时间:"
          prop="delayEndDate"
          :rules="[
            {
              required: true,
              validator: validateEndDate,
              trigger: 'blur'
            }
          ]"
        >
          <el-date-picker
            v-model="form.delayEndDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择延期时间"
          ></el-date-picker>
          <span v-if="diffTips">{{ `(时间间隔提示：${diffTips})` }}</span>
        </el-form-item>
      </el-col>
      <el-col v-if="type === 1" :span="24">
        <basis-process-form
          ref="basisProcessForm"
          :type="4"
          :labelWidth="labelWidth"
          :processable="false"
          :visible="visible"
        >
        </basis-process-form>
      </el-col>
      <el-col v-else-if="type === 2" :span="24">
        <el-form-item label="延期申请人:">
          {{ form.delayUserName }}
        </el-form-item>
      </el-col>
      <template v-else>
        <el-col :span="24">
          <el-form-item label="延期申请人:">
            {{ form.delayUserName }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="延期签发人:">
            {{ form.delaySignUserName }}
          </el-form-item>
        </el-col>
      </template>
      <el-col
        v-if="!eliminate && form.delayBackReason && type === 1"
        :span="24"
      >
        <el-form-item label="退回理由:" prop="delayBackReason">
          <el-input v-model="form.delayBackReason" disabled type="textarea" />
        </el-form-item>
      </el-col>
      <template v-if="!eliminate && type === 2">
        <el-col :span="24">
          <el-form-item label="签发结果:" prop="result">
            <el-radio-group v-model="form.result" @change="handleResultChange">
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">退回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!form.result" :span="24">
          <el-form-item label="退回理由:" prop="delayBackReason">
            <el-input
              v-model="form.delayBackReason"
              type="textarea"
              placeholder="请输入退回理由"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import { getDelay } from "@/api/modules/ptw/work";
import BasisProcessForm from "../basis-dialog/basis-process-form";
import { workIntervalTips, verifyWorkInterval } from "../utils";

export default {
  name: "DelayForm",
  components: { BasisProcessForm },
  props: {
    // 弹出层类型1-作业票延期申请,2-作业票延期签发,3-展示详情
    type: {
      type: Number,
      default: 1
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
      // 遮罩层
      loading: false,
      // 表单参数
      form: {
        ticketId: undefined,
        type: undefined,
        level: undefined,
        delayReason: undefined,
        startTime: undefined,
        endTime: undefined,
        delayEndDateList: [],
        delayEndDate: undefined,
        taskNodeModelList: [],
        delayUserName: undefined,
        delaySignUserName: undefined,
        result: 1,
        delayBackReason: undefined
      },
      // 表单验证
      rules: {
        delayReason: [
          { required: true, message: "延期原因不能为空", trigger: "blur" }
        ],
        delayBackReason: [
          { required: true, message: "退回理由不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
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
    setup(workId) {
      this.reset();
      this.form.ticketId = workId;
      this.getData(workId);
    },
    getData(id) {
      getDelay(this.type, id).then(response => {
        const result = response.result;
        let delayEndDateList = result.delayEndDateList || [];
        if (delayEndDateList.length)
          delayEndDateList = delayEndDateList.map(item => {
            return { value: item };
          });
        this.form = { ...this.form, ...result, delayEndDateList };
        if (this.type === 1) {
          this.$nextTick(() => {
            this.$refs.basisProcessForm.setup(this.form);
          });
        }
      });
    },
    /** 结果切换 */
    handleResultChange(value) {
      if (value) this.form.delayBackReason = undefined;
    },
    /** 延期结束时间验证 */
    validateEndDate(rule, value, callback) {
      if (value == undefined || value == null || value == "")
        return callback(new Error("作业延期结束时间不能为空"));
      if (
        (!this.form.delayEndDateList || !this.form.delayEndDateList.length) &&
        Date.parse(value) <= Date.parse(this.form.endTime)
      )
        return callback(new Error("延期结束时间必须大于结束时间"));
      if (
        this.form.delayEndDateList &&
        this.form.delayEndDateList.length &&
        Date.parse(value) <= Date.parse(this.form.delayEndDateList[0].value)
      )
        return callback(new Error("延期结束时间必须大于最近一次延期结束时间"));
      if (
        !verifyWorkInterval(
          this.form.startTime,
          value,
          this.form.type,
          this.form.level
        )
      )
        return callback(new Error("时间间隔不符合要求，请遵循提示"));
      callback();
    },
    /** 验证表单 */
    validate() {
      const validList = [];
      const basisValid = this.validateBasis();
      validList.push(basisValid);
      if (this.type === 1) {
        validList.push(this.$refs.basisProcessForm.validate());
      }

      return new Promise((resolve, reject) => {
        Promise.all(validList)
          .then(([basis, process]) => {
            let data = {
              ticketId: basis.ticketId
            };
            if (this.type === 1) {
              data.delayReason = basis.delayReason;
              data.delayEndDate = basis.delayEndDate;
              data.taskNodeModelList = process.taskNodeModelList;
            } else if (this.type === 2) {
              data.result = basis.result;
              data.delayBackReason = basis.delayBackReason;
            }
            resolve(data);
          })
          .catch(_ => {
            reject();
          });
      });
    },
    validateBasis() {
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
    /** 表单重置操作 */
    reset() {
      this.form = {
        ticketId: undefined,
        type: undefined,
        level: undefined,
        delayReason: undefined,
        startTime: undefined,
        endTime: undefined,
        delayEndDateList: [],
        delayEndDate: undefined,
        taskNodeModelList: [],
        delayUserName: undefined,
        delaySignUserName: undefined,
        result: 1,
        delayBackReason: undefined
      };
      // this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>
