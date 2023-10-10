<template>
  <div class="bodyCon">
    <div class="header">
      <div class="headTit">企业现场管控监测分析平台</div>
      <div class="date">
        <div class="time">{{ currentTime }}</div>
        <div style="text-align:right;display:flex">
          <div>
            {{ weekDay }}<div>{{ currentDate }}</div>
          </div>
          <iframe
            allowtransparency="true"
            frameborder="0"
            width="180"
            height="36"
            scrolling="no"
            src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=2&t=1&v=0&d=1&bd=0&k=&f=ffffff&ltf=ffffff&htf=ffffff&q=1&e=0&a=1&c=58362&w=180&h=36&align=right"
          ></iframe>
        </div>
      </div>
    </div>
    <FMap class="mapCon" ref="fmap" @mapLoaded="mapLoaded" :height="bodyHeight + 'px'"/>
    <div  class="bot-left">
      <div v-if="!showBtn1" class="con" :style="{height: botHeight + 'px'}" :class="showView1 ? 'slideOut': 'slideIn'" > 
        <div class="con-panel-top" @click="handleClick(1)"><img src="@/assets/image/tit.png"/></div>
        <div class="con-panel-title">
          <img src="@/assets/image/video.png"/>
          <span class="txt">实时视频</span>
        </div>
        <el-row :gutter="10" type="flex" justify="space-around">
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
        </el-row>
        <el-row :gutter="10" type="flex" justify="space-around" class="mt10">
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
          <el-col><LivePlayer :videoUrl="videourl1"></LivePlayer></el-col>
        </el-row>
      </div>
      <div class="con-panel-btn btnBg" v-else @click="handleClick(1)"><img src="@/assets/image/tit1.png"/></div>
    </div>
    
    <div class="bot-right">
      <div v-if="!showBtn2" class="con" :style="{height: botHeight + 'px'}" :class="showView2 ? 'slideOut': 'slideIn'">
        <div class="con-panel-top" @click="handleClick(2)"><img src="@/assets/image/tit.png"/></div>
        <div class="con-panel-title">
          <img src="@/assets/image/alarmIcon.png"/>
          <span class="txt">最新报警类型</span>
        </div>
        <div class="itemList alarmTable">
          <el-table
            :data="tableData"
            :row-style="TableRowStyle"
            :max-height="botHeight - 65"
          >
            <el-table-column label="报警类型" align="center" prop="alarmType" :show-overflow-tooltip="true" />
            <el-table-column label="采集时间" align="center" prop="alarmTime" :show-overflow-tooltip="true" />
            <el-table-column label="报警图片" align="center" :show-overflow-tooltip="true" width="80px">
              <template slot-scope="scope">
                <div v-if="scope.row.image" style="display: flex;align-items: center;">
                  <el-image 
                    fit="contain"
                    :src="'data:image/' + scope.row.imageType + ';base64,' + scope.row.image" 
                    @click="onpreview(scope.row)">
                  </el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="60"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.operStatus === 0"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.row, true)"
                >处理</el-button>
                <el-button
                  v-else
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handleEdit(scope.row, false)"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="con-panel-btn" v-else @click="handleClick(2)"><img src="@/assets/image/tit2.png"/></div>
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <alarm-form ref="alarmForm" v-model="open" :editable="editable" @submitSuccess="getAlarmList"></alarm-form>
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showviewer"
      :on-close="closeviewer"
      :url-list="urlList"
    />
  </div>
</template>

<script>
import FMap from "@/views/components/video/FMap";
import { getCurrentDate } from "@/views/modules/ins/utils";
import LivePlayer from "@/components/LivePlayer";
import { alarmList } from "@/api/modules/video/alarm";
import AlarmForm from "@/views/components/video/alarm-form";
import elImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  components: { FMap, LivePlayer, AlarmForm, elImageViewer },
  data() {
    return {
      // 当前日期
      currentDate: getCurrentDate(),
      // 当前时间
      currentTime: '',
      // 周几
      weekDay: this.getWeekDay(),
      showView1: true,
      showBtn1: false,
      showView2: true,
      showBtn2: false,
      // 是否显示弹出层
      open: false,
      // 表单是否可编辑
      editable: true,
      tableData: [],
      videourl: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
      videourl1: "", // http://192.168.1.222:8088/video/118.m3u8
      showviewer: false,
      urlList: []
    }
  },
  computed: {
    // 主体高度
    bodyHeight() {
      return document.documentElement.clientHeight - 84
    },
    botHeight() {
      var bodyHei = document.documentElement.clientHeight - 84;
      return bodyHei * 0.4
    }
  },
  mounted() {
    this.nowTimes();
    this.getAlarmList();
  },
  methods: {
    /** 最新报警类型 */
    getAlarmList() {
      var params = { page: 1, limit: 10 };
      alarmList(params).then(response => {
        const result = response.result;
        this.tableData = result.list;
      });
    },
    /** 处理/查看按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.editable = editable;
      this.$nextTick(() => {
        this.$refs.alarmForm.setup({ ...row });
      })
    },
    // 关闭查看器
    closeviewer() {
      this.showviewer = false;
      this.urlList = [];
    },
    onpreview(row) {
      var src = 'data:image/' + row.imageType + ';base64,' + row.image;
      this.urlList = [src];
      this.showviewer = true;
    },
    //设置表格行的样式
    TableRowStyle({ row, rowIndex }) {
      let rowBackground = {};
      if (rowIndex % 2 === 0) {
        rowBackground.background = "#153767 !important";
        return rowBackground;
      }
    },
    /** 显示隐藏统计模块操作 */
    handleClick(val) {
      this['showView' + val] = !this['showView' + val];
      if (!this['showView' + val]) {
        setTimeout(() => {
          this['showBtn' + val] = !this['showBtn' + val];
        }, 300);
      } else {
        this['showBtn' + val] = !this['showBtn' + val];
      }
    },
    /** 地图加载完成回调 */
    mapLoaded() {},
    /** 获取周几 */
    getWeekDay() {
      var day = new Date().getDay();
      return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][day]
    },
    /**
     * 动态显示当前日期
     */
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    timeFormate(timeStamp) {
      let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
      let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
      let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
      this.currentTime = hh + ":" + mm + ':' + ss ;
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.bodyCon {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  background: #173462;
  .header {
    position: relative;
    height: 40px;
    background: radial-gradient(circle, rgba(15, 68, 151, 0.9), rgba(20, 40, 69, 0.9));
    text-align: center;
    color: #fff;
    font-size: 22px;
    .headTit {
      line-height: 40px;
    }
    .date {
      position: absolute;
      right: 2%;
      top: 4px;
      z-index: 9;
      display: flex;
      align-items: center;
      font-size: 14px;
      .time {
        margin-right: 15px;
        font-size: 20px;
      }
    }
  }
  .con {
    background: rgba(25, 49, 86, 0.86);
    box-shadow: 0 0 16px 0 rgba(77, 229, 247, 0.5);
    color: #fff;
    padding: 20px;
    font-size: 14px;
    .con-panel-top {
      margin-top: -20px;
      text-align: center;
    }
    .con-panel-title {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .txt {
        padding-left: 10px;
        padding-top: 5px;
      }
    }
  }
  .bot-left {
    position: absolute;
    bottom: 20px;
    width: 67%;
    left: 1%;
  }
  .bot-right {
    position: absolute;
    bottom: 20px;
    width: 30%;
    left: 69%;
  }
  .con-panel-btn {
    position: absolute;
    width: 100%;
    bottom: -20px;
    text-align: center;
    img {
      height: 30px
    }
  }
}
.alarmTable {
  border: #00A0E9 solid 1px;
  padding: 0 5px;
  .btn {
    background: rgba(17, 219, 51, 0.5);
    border-radius: 1px;
    color: #11DB33;
    font-size: 13px;
    border: none;
  }
  /deep/.el-table{
    background-color: transparent;
    color: #fff;
  }
  /deep/.el-table__header-wrapper th {
    background-color: transparent;
    color: #fff;
  }
  /deep/.el-table tr {
    background-color: transparent!important;
  }
  /deep/.el-table--enable-row-transition .el-table__body td, .el-table .cell {
    background-color: transparent;
  }
  /deep/.el-table th.is-leaf, /deep/.el-table td {
    border-bottom: none;
  }
  /deep/ .el-table--medium td {
    padding: 5px 0;
  }
  /deep/ .el-table::before{
    height: 0;
  }
  // 滚动条的宽度
  /deep/.el-table__body-wrapper::-webkit-scrollbar {
    width: 6px; // 横向滚动条
    height: 6px; // 纵向滚动条 必写
  }
  // 滚动条的滑块
  /deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: rgba(84, 248, 246, 0.9);
    border-radius: 3px;
  }
}

// 滑动动画
.slideIn {
  animation: slideIn1 .3s ease forwards;
}
.slideOut {
  animation: slideOut .3s ease forwards;
}
@keyframes slideIn1 {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}
@keyframes slideOut {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
}
</style>