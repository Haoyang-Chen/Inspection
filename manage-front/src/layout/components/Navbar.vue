<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="menu-title">{{ sysInfo.systemShort }}</div>
    <div class="left-menu" :style="{ width: menuWidth + 'px' }">
      <el-menu
        ref="fixedMenu"
        :default-active="activeIndex"
        mode="horizontal"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#ffd04b"
        :router="true"
        class="scrollbar"
        :style="{ left: positionLeft + 'px' }"
      >
        <el-menu-item
          class="nav-list-width"
          v-for="(item, index) in navMenus"
          :key="index"
          :ref="'menu' + index"
          :index="`${item.path}`"
          @click.native="handleSelect(item, index)"
          >{{ item.name }}</el-menu-item
        >
      </el-menu>
    </div>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <notice id="notice" class="right-menu-item hover-effect"></notice>
        <phone id="phone" class="right-menu-item hover-effect"></phone>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="hover"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <span class="user-name">{{ userInfo.name }}</span>
          <i class="el-icon-caret-bottom" style="color: white" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="resetPassword"
            >修改密码</el-dropdown-item
          >
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原密码:" prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入原密码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="新密码:" prop="newPassword">
              <el-input
                v-model="form.newPassword"
                placeholder="请输入新密码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="确认密码:" prop="checkPassword">
              <el-input
                v-model="form.checkPassword"
                placeholder="请再次输入新密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { resetPwd } from "@/api/modules";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Notice from "@/components/Notice";
import Phone from "@/components/Phone";
import Screenfull from "@/components/Screenfull";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Notice,
    Phone,
    Screenfull,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("新密码不能为空"));
      } else {
        if (this.form.checkPassword !== "") {
          this.$refs.form.validateField("checkPassword");
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("确认密码不能为空"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 菜单固定宽度
      // menuWidth:
      //   document.documentElement.clientWidth -
      //   document.documentElement.clientWidth * 0.3 -
      //   218,
      menuWidth: document.documentElement.clientWidth - 580,
      // 菜单滚动宽度
      scrollWidth: 0,
      // 表单校验
      rules: {
        password: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur",
          },
        ],
        checkPassword: [
          {
            required: true,
            validator: validateCheckPass,
            trigger: "blur",
          },
        ],
      },
      positionLeft: 0,
      windowWidth: document.documentElement.clientWidth,
      number: 5,
      roll: false,
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    userInfo() {
      return this.$store.state.user;
    },
    sysInfo() {
      return this.$store.state.common.systemInfo;
    },
    navMenus() {
      return this.$store.state.permission.navMenus;
    },
    activeIndex() {
      return this.$store.state.permission.activeNavMenu.path;
    },
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
  },
  mounted() {
    let arr = document.getElementsByClassName("nav-list-width");
    let allWidth = 0;
    arr.forEach((item) => {
      //console.log(item.offsetWidth);
      allWidth += item.offsetWidth;
    });
    //console.log(allWidth, document.documentElement.clientWidth, "allWidth");
    if (allWidth + 570 < document.documentElement.clientWidth) {
      this.roll = true;
    }

    this.getWidthText();
    // var that = this;
    // window.onresize = function temp() {
    //   that.calcWidth();
    // };
  },
  methods: {
    calcWidth() {
      // this.menuWidth =
      //   document.documentElement.clientWidth -
      //   document.documentElement.clientWidth * 0.3 -
      //   218;
      this.menuWidth = document.documentElement.clientWidth - 580;
    },
    getWidthText() {
      this.scrollWidth =
        this.$refs["fixedMenu"].$el.scrollWidth -
        this.$refs["fixedMenu"].$el.offsetWidth;
      this.navMenus.find((item, index) => {
        if (item.path === this.activeIndex) {
          this.calc(index); // 当前菜单index
        }
      });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    handleSelect(menu, index) {
      if (this.roll) {
        return false;
      }
      let arr = document.getElementsByClassName("nav-list-width");
      let width = 0;
      if (index > 6) {
        for (let i = 0; i < index - 4; i++) {
          width = width + arr[i].offsetWidth;
        }
      }
      this.positionLeft = 0 - width;

      var activeIndexWidth = this.$refs["menu" + index][0].$el.offsetWidth; // 当前菜单index
      this.scrollWidth = activeIndexWidth; // 滚动宽度
      this.$store.dispatch("SwitchNavMenu", menu);
      this.calc(index);
    },
    calc(index) {
      var total = 0;
      for (var i = 0; i <= index; i++) {
        total += this.$refs["menu" + i][0].$el.offsetWidth;
      }

      this.$nextTick(() => {
        var nextIndexWidth = 0;
        if (index <= this.navMenus.length - 1) {
          nextIndexWidth = this.$refs["menu" + (index + 1)][0].$el.offsetWidth;
        }
        //console.log("nextIndexWidth", nextIndexWidth);
        if (total - this.menuWidth < nextIndexWidth) {
          this.scrollWidth = this.scrollWidth + nextIndexWidth;
          total = total + nextIndexWidth;
        }
        // console.log("total", total);
        // console.log("menuWidth", this.menuWidth);
        // console.log("scrollWidth", this.scrollWidth);

        if (total > this.menuWidth) {
          this.$refs["fixedMenu"].$el.scrollLeft += this.scrollWidth;
        } else {
          this.$refs["fixedMenu"].$el.scrollLeft -= this.scrollWidth;
        }
      });
    },
    /** 修改密码按钮 */
    resetPassword() {
      this.reset();
      this.open = true;
      this.title = "修改密码";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          resetPwd(this.form).then((response) => {
            this.msgSuccess("修改成功");
            this.open = false;
            this.$store.dispatch("FedLogOut").then(() => {
              location.reload();
            });
          });
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        password: undefined,
        newPassword: undefined,
        checkPassword: undefined,
      };
      this.resetForm("form");
    },
    /** 退出登录按钮 */
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$store.dispatch("FedLogOut").then(() => {
          location.href = "/";
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #409eff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .menu-title {
    float: left;
    color: #fff;
    height: 100%;
    line-height: 50px;
    font-weight: bold;
    font-size: 22px;
    min-width: 138px;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .left-menu {
    float: left;
    text-align: left;
    padding-left: 10px;
    overflow: hidden;
    // border-left: 1px solid #000;
    .el-menu.el-menu--horizontal {
      border-bottom: 0;
    }

    .el-menu--horizontal > .el-menu-item {
      height: 50px;
      color: #fff;
      font-weight: bold;
      font-size: 14px;
      line-height: 50px;
    }

    .el-submenu__title:hover {
      background: rgba(0, 0, 0, 0.08) !important;
    }
    .el-menu-item:hover {
      background: rgba(0, 0, 0, 0.08) !important;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.08);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .user-name {
          padding-left: 5px;
          font-size: 15px;
          line-height: 40px;
          text-align: center;
          color: white;
          max-width: 180px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  /deep/ .el-menu.el-menu--horizontal {
    display: flex;
    flex-wrap: nowrap;
    // overflow-x: auto;
    .el-menu-item {
      height: 50px;
    }
  }
  .scrollbar {
    transition: all 500ms ease-in-out;
  }
  .scrollbar::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
  }
  .scrollbar::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #fff;
  }
  .scrollbar::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #409eff;
  }
}
</style>
