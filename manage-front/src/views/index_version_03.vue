<template>
  <div class="home-bg">
    <div class="home-title">
      <p>企业安全生产管控平台</p>
      <span>智慧安全生产管理信息系统</span>
    </div>
    <div class="app-container" style="margin-top: -20px">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="public-title flex items-center">
            <i class="icon icon01"></i>
            <span>企业证书</span>
          </div>
          <MaturityCompany ref="MaturityCompany" :height="chartHeight" />
          <div class="public-title flex items-center">
            <i class="icon icon02"></i>
            <span>人员证书</span>
          </div>
          <div
            class="box"
            :style="{ height: chartHeight }"
            style="position: relative"
          >
            <Maturity ref="Maturity" :height="chartHeight" />
          </div>
        </el-col>
        <el-col :span="9">
          <Statistics ref="Statistics" />
        </el-col>
        <el-col :span="7">
          <div class="public-title flex items-center">
            <i class="icon icon03"></i>
            <span>当日作业票种类数量</span>
          </div>
          <Operation ref="Operation" :height="chartHeight" />
          <div class="public-title flex items-center">
            <i class="icon icon04"></i>
            <span>风险辨识统计占比</span>
          </div>
          <Personnel ref="Personnel" :height="chartHeight" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <Abnormal :height="chartHeight" />
        </el-col>
        <el-col :span="12">
          <Classification :height="chartHeight" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  statistics_API,
  countByType_API,
  mxxjy_API,
  expirationReminder_API,
  enterpriseReminder_API,
} from "@/api/modules/home/index";
import { mapState } from "vuex";

import Maturity from "@/views/dashboard/home_version_03/maturity"; //到期提醒
import MaturityCompany from "@/views/dashboard/home_version_03/maturityCompany"; //到期提醒
import Abnormal from "@/views/dashboard/home_version_03/abnormal"; //异常巡检统计
import Classification from "@/views/dashboard/home_version_03/classification"; //隐患细分类别统计
import Operation from "@/views/dashboard/home_version_03/operation"; //当日作业票种类数量
import Personnel from "@/views/dashboard/home_version_03/personnel"; //人员培训数据
import Statistics from "@/views/dashboard/home_version_03/statistics"; //中间图片内容
export default {
  name: "index_version_03",
  components: {
    Maturity,
    Abnormal,
    Classification,
    Operation,
    Personnel,
    Statistics,
    MaturityCompany,
  },
  computed: {
    ...mapState({
      workTypes: (state) => state.common.workTypes,
    }),
  },
  data() {
    return {
      // 图表高度
      chartHeight: undefined,
      containerHeight: document.documentElement.clientHeight - 84,
      statisticsToday: null, //当日巡检管理内容统计
      intermediateContent: null, //中间内容
      jobTicket: null, //当日作业票种类数量
      hiddenDanger: null,
    };
  },
  created() {
    if (document.documentElement.clientWidth > 1400) {
      this.chartHeight = (this.containerHeight - 302) / 3 + "px";
    } else {
      this.chartHeight = (this.containerHeight - 248) / 3 + "px";
    }
    this.getAllDate();
  },
  methods: {
    getAllDate() {
      //累计巡检任务/累计异常巡检记录/累计漏检点位/巡检点数量----//巡检任务
      mxxjy_API().then((res) => {
        this.statisticsToday = res;
        this.$nextTick(() => {
          this.$refs["Statistics"].setXjdsl(this.statisticsToday.xjdsl);
        });
      });

      //页面中间统计
      statistics_API().then((res) => {
        this.intermediateContent = res;
        this.$nextTick(() => {
          this.$refs["Statistics"].init(this.intermediateContent);
        });
      });

      //作业票统计-各类作业票占比
      countByType_API().then((res) => {
        let arr = res.result;

        if (arr && arr.length > 0) {
          arr.forEach((item) => {
            this.workTypes.forEach((item02) => {
              if (item.type == item02.value) {
                item.typeValue = item02.label;
              }
            });
          });
        }
        this.jobTicket = arr;
        this.$nextTick(() => {
          this.$refs["Operation"].init(this.jobTicket);
        });
      });

      //人员证书
      expirationReminder_API().then((res) => {
        this.$nextTick(() => {
          this.$refs["Maturity"].init(res.result);
        });
      });

      //企业证书
      enterpriseReminder_API().then((res) => {
        this.$nextTick(() => {
          this.$refs["MaturityCompany"].init(res.result);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-bg {
  min-height: calc(100vh - 84px);
  background: url("../assets/image/home/bg.png") no-repeat center 0px;
  overflow: hidden;
  color: #ffffff;
  .home-title {
    margin-top: 20px;
    height: 88px;
    background: url("../assets/image/home/home_title.png") no-repeat center
      center;
    position: relative;
    z-index: 2;
    .flex-right {
      position: absolute;
      z-index: 9999;
      right: 20px;
      top: 30px;
      animation: blink 2s linear infinite;
      -webkit-animation: blink 2s linear infinite;
      -moz-animation: blink 2s linear infinite;
      -ms-animation: blink 2s linear infinite;
      -o-animation: blink 2s linear infinite;
    }
    p {
      text-align: center;
      font-size: 30px;
      line-height: 30px;
      padding: 0;
      margin: 0;
      transition: all 300ms ease-in-out;
    }
    span {
      display: block;
      text-align: center;
      font-size: 24px;
      line-height: 24px;
      padding: 0;
      margin-top: 10px;
      transition: all 300ms ease-in-out;
    }
  }
  .public-title {
    width: 272px;
    height: 40px;
    background: url("../assets/image/home/border.png") no-repeat center center;
    background-size: 100%;
    margin-top: 15px;
    .icon {
      display: block;
      margin-left: 16px;
      margin-right: 10px;
      width: 30px;
      height: 30px;
    }
    .icon01 {
      background: url("../assets/image/home/icon01.png") no-repeat center center;
      background-size: 60%;
    }
    .icon02 {
      background: url("../assets/image/home/icon02.png") no-repeat center center;
      background-size: 60%;
    }
    .icon03 {
      background: url("../assets/image/home/icon03.png") no-repeat center center;
      background-size: 60%;
    }
    .icon04 {
      background: url("../assets/image/home/icon04.png") no-repeat center center;
      background-size: 60%;
    }
    span {
      display: block;
      font-size: 16px;
    }
  }
}
.decoration-5 {
  width: 300px;
  height: 40px;
  margin: 46px auto 0;
}
@keyframes blink {
  0% {
    color: #ffffff;
  }

  50% {
    color: transparent;
  }

  100% {
    color: #ffda31;
  }
}
@media screen and (max-width: 1400px) {
  .app-container{
    padding: 10px 20px 0 20px;
    .box-bg{
      padding: 10px 10px 6px 10px;
    }
  }
  .home-bg {
    .home-title {
      p {
        font-size: 24px;
        line-height: 24px;
      }
      span {
        margin-top: 6px;
        font-size: 20px;
        line-height: 20px;
      }
    }
    .public-title {
      width: 204px;
      height: 30px;
      .icon {
        margin-left: 8px;
        margin-right: 2px;
      }
      span {
        font-size: 14px;
        display: inline-block;
        small {
          margin-left: 2px;
          font-size: 10px;
        }
      }
    }
  }
}
</style>