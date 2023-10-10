<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-row :gutter="24">
      <el-col :span="8">
        <ve-calendar
          class="adjust-calendar"
          :value="selectedDate"
          :most-choice="1"
          :right-menu="false"
          :event="false"
          :cancel-click="false"
          :cross-month="true"
          :min="minDate"
          :max="maxDate"
          @change="handeleDateChange"
        ></ve-calendar>
      </el-col>
      <el-col :offset="1" :span="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="selectedDate[0]+' '+week" label-width="135px"></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检频率:" prop="inspectRate">
                <el-input-number
                  v-model="form.inspectRate"
                  :min="1"
                  :precision="0"
                  controls-position="right"
                  placeholder="请输入频率"
                  style="width:140px"
                />
                <span>时/次</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="巡检班组:" prop="insTeamInfoList">
                <team-group v-model="form.insTeamInfoList" :status="1" :isRevoke="0"></team-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="巡检班次:" prop="insClassInfoList">
                <team-rate v-model="form.insClassInfoList" :status="1" :isRevoke="0"></team-rate>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="submit(true)">保存并关闭</el-button>
      <el-button :loading="loading" type="primary" @click="submit(false)">保 存</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getDayTask,
  updateDayTask,
  baseGroupLine,
  baseRateLine
} from "@/api/modules/inspect/task";
import { getCurrentDate } from "@/views/modules/ins/utils";
import veCalendar from "ve-calendar";
import TeamGroup from "./team-group";
import TeamRate from "./team-rate";

export default {
  name: "AdjustDialog",
  components: {
    veCalendar,
    TeamGroup,
    TeamRate
  },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 任务id
    taskId: {
      required: true
    },
    taskStatus: {
      type: Number,
      default: 1
    },
    taskStartDate: {
      type: String,
      default: undefined
    },
    taskEndDate: {
      type: String,
      default: undefined
    },
    // 弹出层标题
    title: {
      type: String,
      default: "任务调整"
    },
    width: {
      type: String,
      default: "1220px"
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层-内部
      visible: this.value,
      // 当前选中日期
      selectedDate: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inspectRate: [
          { required: true, message: "巡检频率不能为空", trigger: "blur" }
        ],
        insTeamInfoList: [
          { required: true, message: "巡检班组不能为空", trigger: "change" }
        ],
        insClassInfoList: [
          { required: true, message: "巡检班次不能为空", trigger: "change" }
        ]
      },
      // 星期
      weeks: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ]
    };
  },
  computed: {
    /** 最小可选时间 */
    minDate() {
      if (this.taskStatus === 1) {
        return this.taskStartDate;
      } else {
        return getCurrentDate();
      }
    },
    /** 最大可选时间 */
    maxDate() {
      return this.taskEndDate;
    },
    /** 选中星期 */
    week() {
      if (!this.selectedDate) {
        return undefined;
      }
      return this.weeks[new Date(this.selectedDate[0]).getDay()];
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    /** 重置相关值 */
    setup() {
      this.selectedDate = [
        this.taskStatus === 1 ? this.taskStartDate : getCurrentDate()
      ];
      this.getDetail();
    },
    /** 根据任务id及日期查询任务详情 */
    getDetail() {
      this.loading = true;
      getDayTask(this.taskId, this.selectedDate[0])
        .then(response => {
          const result = response.result;
          const group = result.insTeamInfoList || [baseGroupLine];
          const rate = result.insClassInfoList || [baseRateLine];
          this.form = {
            ...result,
            insTeamInfoList: group,
            insClassInfoList: rate
          };
          this.loading = false;
        })
        .catch(_ => {
          this.loading = false;
        });
    },
    /** 日期切换 */
    handeleDateChange(selectedDate) {
      this.selectedDate = selectedDate;
      this.getDetail();
    },
    /** 提交按钮 */
    submit(close) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const data = {
            taskId: this.form.id,
            taskDate: this.selectedDate[0],
            inspectRate: this.form.inspectRate,
            insTeamInfoList: this.form.insTeamInfoList,
            insClassInfoList: this.form.insClassInfoList
          };
          this.loading = true;
          updateDayTask(data)
            .then(response => {
              this.msgSuccess("调整成功");
              this.loading = false;
              if (close) {
                this.visible = false;
              }
            })
            .catch(_ => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.adjust-calendar {
  width: 430px;
  .days-line .day-grid {
    height: 50px;
    .day-title {
      flex-direction: column;
    }
  }
}
</style>

