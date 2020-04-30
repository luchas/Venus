<template>
  <div class="login-container">
    <div class="title-container">
      <p class="title">登 录</p>
      <p class="title">SIGN IN</p>
    </div>
    <el-form
      :inline="true"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form demo-form-inline"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          :placeholder="loginForm.nametitle"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="loginForm.passtitle"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="success"
        @click.native.prevent="handleLogin"
      >{{loginForm.logIn }}</el-button>
      <br>
      <div style="text-align:left;padding-left:80px;color:white;">
        <el-checkbox v-model="loginForm.isRememberPassword">记住密码</el-checkbox>
      </div>
    </el-form>
    
  </div>
</template>

<script>
import { isEmpty } from "../../components/utils/validate";
import * as http from "../../components/utils/api";
import { setCookie,getCookie,delCookie } from '../../assets/js/cookies.js';
import md5 from 'js-md5';

export default {
  name: "Login",
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isEmpty(value)) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("密码至少1位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        isRememberPassword:false,
        nametitle: "账号",
        passtitle: "密码",
        logIn: "登 陆"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined
    };
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
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  mounted () {
    //处理记住用户名和密码
    //debugger;
    var username = getCookie('username')
    this.loginForm.username = username;
    var password = getCookie("password");
    this.loginForm.password = password;
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // 由于已经导入了 Vue-resource这个包，所以 ，可以直接通过  this.$http 来发起数据请求
          // 加密可以使用md5(this.loginForm.password)
          var rememberPassword = this.loginForm.isRememberPassword;
          var username = this.loginForm.username;
          var password = this.loginForm.password;
          http.login(this.loginForm.username,md5(this.loginForm.password)).then(
            result => {
              //成功处理
              // debugger;
              this.loading = false;
              if (result.code == "200" || result.code == "407") {
                //处理记住用户名和密码
                setCookie('username',rememberPassword?username:"",7)
                setCookie('password',rememberPassword?password:"",7)
                // 成功了
                // console.log(result);
                setCookie("user", JSON.stringify(result.data),7);
                setCookie("userAccount", result.data.name,7);
                setCookie("STORAGE_TOKEN", result.data.token,7);
                var testname = getCookie("name");
                this.$router.push({ path: this.redirect || "/homeBlog" });
              } else {
                // 失败了
                this.$message(result.msg ? result.msg : "登陆失败，请重试！");
              }
            },
            reject => {
              //失败处理
               //Treat timeout error
                this.loading = false;
                //this.$message("服务器请求超时，请联系管理员！");
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #8a80b2;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    //color: $cursor;
    &::first-line {
      // color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 30px;
    width: 100%;
    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 5px;
      height: 30px;
      width: 230px;
      display: inline-block;
      -webkit-box-shadow: 0 0 0px 1000px white inset;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    background: white;
    height: 36px;
    line-height: 36px;
    color: #454545;
  }
  .el-button {
    background-color: #4ad4bc;
    border: none;
    font-size: 12px;
    height: 38px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
input:-webkit-autofill {
  background-color: white;
}

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("../../assets/login_bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    width: 700px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
    el-input {
      width: 200px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    margin-top: 170px;
    .title {
      font-size: 24px;
      color: $light_gray;
      margin: 0px auto 10px auto;
      text-align: center;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
    color: white;
  }
}
</style>
