<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col style="width:61.8%">
        <ve-calendar
          class="schedule-calendar"
          :value="selectedDate"
          :most-choice="1"
          :right-menu="false"
          :event="false"
          :cancel-click="false"
          :cross-month="true"
          @change="handeleDateChange"
        ></ve-calendar>
      </el-col>
      <!--排班情况-->
      <el-col :span="7" class="card" v-loading="loading">
        <el-row style="margin: 0 -12px;">
          <el-col :span="24" class="header">
            <div>排班情况</div>
          </el-col>
          <el-col :span="24" class="date">
            <div>{{selectedDate[0]}}</div>
          </el-col>
          <el-col :span="24" class="search">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入任务名称"
              clearable
              size="small"
              style="width:180px;display:inline-block;"
              @keyup.enter.native="handleQuery"
            />
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              style="display:inline-block;"
              @click="handleQuery"
            >搜索</el-button>
          </el-col>
          <el-col
            class="content"
            :span="24"
            :style="{'max-height':tableHeight}"
            v-bind:class="{ 'content-empty': isEmpty }"
          >
            <el-row v-for="(item, index) in scheduleList" :key="index" style="line-height:40px;">
              <el-col :span="24">
                <span>任务名称:</span>
                <span>{{ item.taskName }}</span>
              </el-col>
              <el-col :span="24">
                <span>任务类型:</span>
                <span>日常任务</span>
              </el-col>
              <el-col :span="24">
                <span>巡检频率:</span>
                <span>{{ item.inspectRate + '时/次' }}</span>
              </el-col>
              <el-col :span="24">
                <span>巡检班组:</span>
                <span>{{ teamInfo(item)}}</span>
              </el-col>
              <el-col :span="24">
                <span>巡检时间段:</span>
                <span>{{ periodInfo(item)}}</span>
              </el-col>
              <el-col :span="24">
                <hr style="margin-bottom: 10px; border: #e2e2e2 1px dashed;" />
              </el-col>
            </el-row>
            <span v-if="isEmpty" class="el-table__empty-text">暂无数据</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDaySchedule } from "@/api/modules/inspect/task";
import veCalendar from "ve-calendar";
import { getCurrentDate } from "../utils";

export default {
  name: "Scheduling",
  components: { veCalendar },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 当前选中日期
      selectedDate: [getCurrentDate()],
      // 排班情况表格数据
      scheduleList: null,
      // 查询参数
      queryParams: {
        name: undefined
      },
      tableHeight: document.documentElement.scrollHeight - 250 + "px"
    };
  },
  computed: {
    /** 任务类型 */
    typeOptions() {
      return this.$store.state.common.taskTypes;
    },
    isEmpty() {
      if (!this.scheduleList) {
        return false;
      }
      return !Boolean(this.scheduleList.length);
    }
  },
  created() {
    this.$forceUpdate();
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      getDaySchedule(this.selectedDate[0]).then(response => {
        if (this.queryParams.name) {
          const result = response.result.filter(item => {
            return item.taskName.includes(this.queryParams.name);
          });
          this.scheduleList = result;
        } else {
          this.scheduleList = response.result;
        }
        this.loading = false;
      });
    },
    /** 日期切换 */
    handeleDateChange(selectedDate) {
      this.selectedDate = selectedDate;
      this.getList();
    },
    // 根据行数据获取巡检班组
    teamInfo(row) {
      const team = row.team;
      let users = team.users;
      users = users.map(item => {
        return item.userName;
      });
      return (team.teamName || "") + " " + users.join("、");
    },
    // 根据行数据获取巡检时间段
    periodInfo(row) {
      if (!row.clazz.startTime || !row.clazz.endTime) {
        return "";
      }
      let starts = row.clazz.startTime.split(":");
      starts.pop();
      let ends = row.clazz.endTime.split(":");
      ends.pop();
      return starts.join(":") + "-" + ends.join(":");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0;
}
.header {
  padding: 15px;
  background-color: #107bf5;
  color: #fff;
  font-weight: 800;
  border-radius: 4px 4px 0 0;
}
.date {
  padding: 8px 15px;
  background-color: #d7edfd;
}
.search {
  padding: 15px 15px 0 15px;
}
.content {
  padding: 10px 15px;
  overflow-y: auto;
}

.content-empty {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.schedule-calendar {
  .ve-calendar {
    font-size: 20px;
    .dropdown-content {
      font-size: 16px;
    }
    .day-number {
      font-size: 20px;
    }
    /deep/.day-grid .selected {
      background: #e9f2fe !important;
    }
  }
 /deep/ .days-line .day-grid {
    height: 85px;
    .day-title {
      flex-direction: column;
    }
  }
}

</style>

