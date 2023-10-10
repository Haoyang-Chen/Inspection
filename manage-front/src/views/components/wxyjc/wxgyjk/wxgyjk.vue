<template>
  <div class="app-container">
    <div style="margin-top: 27px"></div>
    <div class="header-title-buttons flex justify-between items-center">
      <div class="title"><i class="el-icon-s-operation"></i> 设备实时参数</div>
    </div>
    <el-row class="table-list">
      <el-col
        :span="12"
        class="item"
        v-for="(item, index) in tableData"
        :key="index"
      >
        <div class="box flex">
          <div class="list">
            <span>高报值：{{ item.maxReport }}</span>
            <span>低报值：{{ item.lowReport }}</span>
            <span>高高报值：{{ item.highReport }}</span>
            <span>低低报值：{{ item.minReport }}</span>
          </div>
          <div class="intro">
            <small>实时数据</small>
            <b>{{ item.value }}</b>
            <em>{{ item.unit2 }}</em>
          </div>
        </div>
        <div class="box-title">{{ item.targetType }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { apparatus_API } from "@/api/modules/wxyjc/wxyjctargetcode";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "查看",
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      // 是否显示弹出层
      visible: this.value,
      size: "small",
      relationId: undefined,
      tableData: [],
      timer: null, //定时器名称
    };
  },
  beforeDestroy() {
    console.log("定时器关闭");
    clearInterval(this.timer); // 清除定时器
    this.timer = null;
  },
  methods: {
    editTemp(relationId) {
      if (this.relationId) {
        this.relationId = relationId;
        clearInterval(this.timer); // 清除定时器
        this.timer = null;
        this.getList();
        this.timer = setInterval(() => {
          this.getList();
        }, 10000);
      } else {
        this.relationId = relationId;
        this.getList();
        //设置定时器
        this.timer = setInterval(() => {
          this.getList();
        }, 10000);
      }
    },
    getList() {
      console.log("getList");
      apparatus_API(this.relationId).then((res) => {
        this.tableData = res.result;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-list {
  .item {
    padding: 4px;
    .box {
      border: 1px solid #409eff;
      color: #909399;
      .list {
        flex-basis: 55%;
        span {
          display: block;
          color: #ffffff;
          padding: 6px 10px;
          font-size: 12px;
          background: linear-gradient(to bottom, #b3d8ff, #79bbff);
        }
      }
      .intro {
        flex-basis: 45%;
        position: relative;
        small {
          display: block;
          text-align: right;
          padding: 4px;
        }
        b {
          display: block;
          text-align: center;
          font-size: 30px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #409eff;
        }
        em {
          position: absolute;
          right: 4px;
          bottom: 4px;
          color: #409eff;
          font-style: normal;
          font-size: 12px;
        }
      }
    }
    .box-title{
      line-height: 30px;
      text-align: center;
      margin-bottom: 20px;
    }
  }
}
</style>