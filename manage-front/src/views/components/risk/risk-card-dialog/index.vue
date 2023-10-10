<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="card-tools">
      <div style="font-size:15px;color:#333;font-weight:bold">
        告知卡预览:
      </div>
      <div v-if="!isOrg">
        <el-button type="primary" size="mini" @click="handleDownLoad"
          >下载</el-button
        >
      </div>
    </div>
    <div class="card-container">
      <img :src="src" alt="" style="width:100%;height:100%" />
      <div class="header">{{ cardTitle }}</div>
      <table class="table">
        <caption>
          {{
            "企业名称：" + this.$store.state.user.name
          }}
        </caption>
        <tr align="center">
          <td class="title">场所/环节/部位</td>
          <td class="middle">
            <span class="limit-text">{{ riskData.place || '' }}</span>
          </td>
          <td class="title">风险点名称</td>
          <td colspan="3">
            <span class="limit-text">{{ riskData.hazardName }}</span>
          </td>
        </tr>
        <tr align="center">
          <td class="title">风险类型</td>
          <td class="middle">
            <span class="limit-text">{{ riskData.typeName }}</span>
          </td>
          <td class="title">可能造成的事故类型</td>
          <td colspan="3">
            <span class="limit-text">{{ riskData.accidentList ? riskData.accidentList.join(',') : '' }}</span>
          </td>
        </tr>
        <tr align="center">
          <td class="scene" rowspan="3" colspan="2">
            <img :src="scene" />
          </td>
          <td class="title">具体管控措施</td>
          <td colspan="3">
            <div id="div1" class="div1" style="max-height:240px;text-align:left;overflow: hidden;">
              <div
                v-for="(item, index) in mainMeasureList"
                :key="index"
                class="limit-text-1"
              >
                {{ subStr(item) }}；
              </div>
            </div>
          </td>
        </tr>
        <tr align="center">
          <td class="title">警示标志</td>
          <td colspan="3">
            <div class="signs">
              <img v-for="(item, index) in riskData.warnSignList" :key="index" :src="imgUrl + item.name" />
            </div>
          </td>
        </tr>
        <tr align="center">
          <td class="title">责任部门</td>
          <td colspan="3">
            <span class="limit-text">{{ riskData.respDeptName }}</span>
          </td>
        </tr>
      </table>

      <div class="footer">安全生产，人人有责！</div>
      <img v-show="!hideQrcode" class="qrcode" :src="codeUrl" />
    </div>
    <el-checkbox v-if="!isOrg" v-model="hideQrcode" style="margin-top:15px"
      >隐藏二维码</el-checkbox
    >
    <sign-dialog
      v-model="open"
      :riskId="riskId"
      :selects="riskData.warnSignList"
      @change="handleSignChange"
    ></sign-dialog>

  </el-dialog>
</template>

<script>
import { exportCard, qrCode } from "@/api/modules/risk/classification";
import SignDialog from "./sign-dialog";
import { levelName } from "@/views/components/risk/utils";

export default {
  name: "RiskCardDialog",
  components: { SignDialog },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "风险告知卡"
    },
    width: {
      type: String,
      default: "1108px"
    },
    riskData: {
      type: Object
    },
    // 是否政府端
    isOrg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 是否显示弹出层
      open: false,
      // 警示标志
      warnSignList: [],
      // 隐藏二维码
      hideQrcode: false,
      imgUrl: process.env.VUE_APP_BASE_API + '/file/show/',
      codeUrl: ''
    };
  },
  computed: {
    src() {
      let level = 1;
      if (this.riskData) {
        level = this.riskData.level || 1;
      }
      return require(`@/assets/image/risk_card_${level}.jpg`);
    },
    cardTitle() {
      let level = "低风险";
      if (this.riskData) {
        level = levelName(this.riskData.level);
      }
      return level + "安全告知卡";
    },
    scene() {
      if (this.riskData) {
        if (
          this.riskData.photoList &&
          this.riskData.photoList.length
        ) {
          const img = this.riskData.photoList[0].name;
          return process.env.VUE_APP_BASE_API + "/file/show/" + img;
        }
      }
      return "";
    },
    riskId() {
      return this.riskData.id;
    },
    mainMeasureList() {
      if (
        !this.riskData ||
        !this.riskData.mainMeasureList ||
        !this.riskData.mainMeasureList.length
      )
        return [];
      return this.riskData.mainMeasureList;
    }
   },
  watch: {
    value: {
      handler(val) {
        this.visible = val;
        if (val) {
          qrCode(this.riskData.id).then(res => {
            this.codeUrl = res.result;
          })
        }
      },
      immediate: true
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    subStr(str) {
      var n = 41;
      var len = str.length;
      var strTemp = '';
      if (len > n) {
        strTemp = str.substring(0, n);
        str = str.substring(n, len);
        return strTemp + '\n' + this.subStr(str)
      } else {
        return str
      }
    },
    handleDownLoad(type) {
      this.exportRequest(
        exportCard,
        {
          id: this.riskId
        },
        "风险告知卡",
        "风险告知卡"
      );
    },
    handleSignChange(value) {
      this.riskData.warnSignList = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.card-tools {
  display: flex;
  justify-content: space-between;
}
.card-container {
  position: relative;
  margin-top: 15px;
  .header {
    position: absolute;
    top: 20px;
    width: 100%;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    color: white;
  }
  .table {
    position: absolute;
    top: 80px;
    bottom: 80px;
    left: 15px;
    right: 15px;
    border-collapse: collapse;
    border: none;
    width: calc(100% - 30px);
    height: calc(100% - 190px);
    font-size: 15px;
    color: #333;
    caption {
      text-align: left;
      font-weight: bold;
      margin-bottom: 10px;
    }
    td {
      border: 1px solid #000;
      padding: 0 5px;
    }
    .title {
      width: 120px;
      background: #f1f1f1;
    }
    .small {
      width: 100px;
    }
    .middle {
      width: 140px;
      text-align: left;
    }
  }
  .scene {
    img {
      height: 136px;
      object-fit: contain;
    }
  }
  .signs {
    display: flex;
    width: 100%;
    // justify-content: center;
    img {
      width: 90px;
      height: 115px;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .limit-text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-align: left;
  }
  .limit-text-1 {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    white-space: pre-line;
  }
  .footer {
    position: absolute;
    bottom: 15px;
    width: 100%;
    font-size: 20px;
    text-align: center;
    color: white;
  }
  .qrcode {
    position: absolute;
    width: 75px;
    height: 75px;
    top: 15px;
    right: 15px;
  }
}
#div1 {
  overflow : hidden;
  // text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 12; /* 能够显示的行数，超出部分用...表示*/
  -webkit-box-orient: vertical;
}
</style>
