<template>
  <el-dialog
    title="作业票进度"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <div :style="{height: dialogHei, 'overflow-y': 'auto','overflow-x': 'hidden'}">
      <el-steps direction="vertical" :active="activeIndex">
        <el-step v-for="(item, index) in processList" :key="index" :title="item.nodeName">
          <i class="el-icon-check" slot="icon"></i>
          <template slot="description">
            <div class="desc-item" v-for="(approveTask, approveIndex) in item.approveTaskList" :key="approveIndex">
              <el-row :gutter="12" type="flex" justify="between">
                <el-col>{{ approveTask.taskName }}</el-col>
                <el-col>
                  <div v-if="approveTask.realCommitTime"><span style="color:#67c23a">已完成</span><span style="padding-left:10px">{{ approveTask.realCommitTime }}</span></div>
                  <div v-else><span style="color:#f56c6c">未完成</span><span style="padding-left:10px">--</span></div>
                </el-col>
              </el-row>
              <div v-if="approveTask.realCommitTime" class="mb10 mt10">{{ approveTask.realCommitUserName }}</div>
              <div v-else class="mb10 mt10">{{ approveTask.userNames.join() }}</div>
            </div>
          </template>
        </el-step>
      </el-steps>
   </div>
  </el-dialog>
</template>

<script>
import { fullProcess } from "@/api/modules/ptw/work";

export default {
  name: "ProcessDialog",
  components: {},
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "860px"
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 进度列表
      processList: [],
      // 弹出层高度
      dialogHei: document.documentElement.clientHeight - 210 + 'px',
      // 当前步骤
      activeIndex: 0
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(workId) {
      fullProcess(workId).then(response => {
        const result = response.result;
        this.processList = result;
        result.forEach((item, index) => {
          var reject = item.approveTaskList.find(task => task.realCommitTime);
          if (!!reject) {
            this.activeIndex = index + 1;
          }
        });
      })
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-step__description {
  padding: 20px 0;
  color: #606266;
}
.desc-item {
  font-size: 15px;
}
/deep/ .el-steps--vertical{
  margin-left: 50px;
  height: auto;
}
</style>
