<template>
  <div class="login">
    <el-image
      :src="require('@/assets/image/login-background.jpg')"
      fit="cover"
      style="width:100%;height:100%;"
    ></el-image>
    <el-form ref="form" :model="form" :rules="rules" class="login-form">
      <h3 class="login-title">用户登录</h3>
      <el-form-item prop="username">
        <el-input
          v-model="form.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="form.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item>
      <div style="display:flex;justify-content:space-between">
        <el-checkbox v-model="form.rememberMe" style="margin:0px 0px 25px 0px;"
          >记住密码</el-checkbox
        >
        <label class="el-checkbox" @click="forgetPassword">
          <u>忘记密码?</u>
        </label>
      </div>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <div>{{ sysInfo.systemTec }}</div>
      <div>{{ sysInfo.systemName }}</div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import uuidv1 from "uuid/v1";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      form: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      rules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
      redirect: undefined
    };
  },
  computed: {
    loading() {
      return this.$store.getters.logging;
    },
    sysInfo() {
      return this.$store.state.common.systemInfo;
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCookie();
    this.getCode();
  },
  methods: {
    getCode() {
      this.form.uuid = uuidv1();
      this.codeUrl = getCodeImg(this.form.uuid);
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.form = {
        username: username === undefined ? this.form.username : username,
        password:
          password === undefined ? this.form.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    forgetPassword() {
      this.$message({
        message: "请联系管理员",
        type: "warning"
      });
    },
    handleLogin() {
      if (this.loading === true) {
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rememberMe) {
            Cookies.set("username", this.form.username, { expires: 30 });
            Cookies.set("password", encrypt(this.form.password), {
              expires: 30
            });
            Cookies.set("rememberMe", this.form.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.form)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch(() => {
              this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.login-title {
  margin: 0px auto 20px auto;
  text-align: center;
  color: #606266;
}

.login-form {
  position: fixed;
  border-radius: 3px;
  background: #e8f0fa;
  width: 360px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 60px;
  line-height: 20px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
