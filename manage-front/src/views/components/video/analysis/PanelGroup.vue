<template>
  <div>
    <el-row :gutter="20" class="panel-group">
      <el-col class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon"><svg-icon icon-class="alarm" style="color:#d9c0ff" /></div>
          <div class="card-panel-desc">
            <div class="card-panel-text">当日报警总数</div>
            <count-to :start-val="0" :end-val="number" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon"><svg-icon icon-class="alarmProcessed" style="color:#ffd3b7" /></div>
          <div class="card-panel-desc">
            <div class="card-panel-text">已处理报警数量</div>
            <count-to :start-val="0" :end-val="processed" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon"><svg-icon icon-class="receive" style="color:#37b2ff" /></div>
          <div class="card-panel-desc">
            <div class="card-panel-text">未处理报警数量</div>
            <count-to :start-val="0" :end-val="notProcessed" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { alarmstatistics } from "@/api/modules/video/alarm";

export default {
  components: {
    CountTo
  },
  data() {
    return {
      number: 0,
      processed: 0,
      notProcessed: 0
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      alarmstatistics().then(response => {
        const result = response.result;
        const { number, processed, notProcessed } = result;
        this.number = number;
        this.processed = processed;
        this.notProcessed = notProcessed;
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 0px;
  display: flex;
  .card-panel {
    height: 128px;
    font-size: 12px;
    overflow: hidden;
    color: #666;
    background: #fbf5ff;
    border-radius: 15px;
    padding: 0 12%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .card-panel-icon {
      font-size: 55px;
      padding-right: 8%;
    }
    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.8);
      font-size: 20px;
      margin-bottom: 12px;
      text-align: center;
    }
    .card-panel-desc{
      flex: auto;
      text-align: center;
      .card-panel-num {
        font-size: 30px;
        text-align: right;
      }
    }
  }
  .card-panel-col:nth-child(2n) .card-panel {
    background: #fff8ef;
  }
  .card-panel-col:nth-child(3n) .card-panel {
    background: #eafbff;
  }
}
</style>
