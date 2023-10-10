<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-task">
          <svg-icon icon-class="tasks" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">隐患总数</div>
          <count-to
            :start-val="0"
            :end-val="totalCount"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-error">
          <svg-icon icon-class="errors" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">已整改数</div>
          <count-to
            :start-val="0"
            :end-val="reformCount"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-point">
          <svg-icon icon-class="points" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">未整改数</div>
          <count-to
            :start-val="0"
            :end-val="unReformCount"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-problem">
          <svg-icon icon-class="problems" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">重大隐患数</div>
          <count-to
            :start-val="0"
            :end-val="majorCount"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { chartPanel } from "@/api/modules/investigate/analysis";
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo
  },
  data() {
    return {
      totalCount: 0,
      reformCount: 0,
      unReformCount: 0,
      majorCount: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getData();
    });
  },
  methods: {
    /** 查询数据 */
    getData() {
      chartPanel().then(response => {
        const result = response.result;
        this.totalCount = result.yhzs || 0;
        this.reformCount = result.yzgs || 0;
        this.unReformCount = result.wzgs || 0;
        this.majorCount = result.zdyhs || 0;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 0px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-task {
        background: #fad337;
      }

      .icon-error {
        background: #3aa0ff;
      }

      .icon-point {
        background: #4ecb73;
      }

      .icon-problem {
        background: #56dbb7;
      }
    }

    .icon-task {
      color: #fad337;
    }

    .icon-error {
      color: #3aa0ff;
    }

    .icon-point {
      color: #4ecb73;
    }

    .icon-problem {
      color: #56dbb7;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 10px 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      // float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
