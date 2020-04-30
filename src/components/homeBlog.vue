<template>
  <el-container style="position: fixed;width:100%;height:100%;background-color:#E9EEEE;">
    <el-aside style="width:150px;background:#1F2537;">
      <div
        style="height:53px;line-height:53px;color:white;text-align:center;background:#28315E;"
      >后台管理</div>
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#1F2537"
        text-color="#fff"
        active-text-color="#ffd04b"
        :default-active="initSelect"
        :active="initSelect"
        :router="true"
        @select="menuSelect"
      >
        <el-menu-item index="/certify">
          <i class="el-icon-venus-camera"></i>
        
          <span slot="title">认证审核</span>
        </el-menu-item>
        <el-menu-item index="/checkin">
          <i class="el-icon-venus-qianbao"></i>
          <span slot="title">提款审核</span>
        </el-menu-item>
        <el-menu-item index="/service" v-if="isAdmin">
          <i class="el-icon-venus-ermai"></i>
          <span slot="title">客服管理</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <i class="el-icon-venus-user-msg"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/dynamic">
          <i class="el-icon-venus-start"></i>
          <span slot="title">动态审核</span>
        </el-menu-item>
        <el-menu-item index="/order">
          <i class="el-icon-venus-heart"></i>
          <span slot="title">约单审核</span>
        </el-menu-item>
        <el-menu-item index="/version">
          <i class="el-icon-venus-download"></i>
          <span slot="title">版本更新</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <!-- <div class="right-menu">
        <el-row type="flex" class="row-bg">
          <el-col :span="18">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item>
                <el-input size="mini" placeholder="搜索用户ID或昵称" prefix-icon="el-icon-search"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="onSearchSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="6">
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
              <div class="avatar-wrapper">
                <img :src="imgUrl" class="user-avatar">
                <span v-text="username"></span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span style="display:block;" @click="logout">退出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div> -->
      <transition name="fade-transform" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
@import url("../assets/icon/iconfont.css");
.el-menu {
  border-right: 0;
}
.el-input__inner {
  border-radius: 26px;
}
.el-input--small {
  width: 200px;
}
.el-button--primary {
    color: #fff;
    background-color: #5967D9;
    border-color: #5967D9;
}
.el-main {
  padding: 0;
  .right-menu {
    background-color: white;
    position: relative;
    .demo-form-inline {
      margin-top: 5px;
      margin-left: 50px;
      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
      }
    }
    .right-menu-item {
      display: inline-block;
      float: right;
    }
    .avatar-container {
      padding: 5px;
      height: 40px;
      line-height: 40px;
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 20px;
          vertical-align: middle;
          margin-right: 10px;
        }
        .el-icon-message {
          margin-left: 10px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<script>
import { getCookie,clearAllCookie } from '../assets/js/cookies.js';
export default {
  data() {
    return {
      isCollapse: true,
      imgUrl: require("../assets/avator1.png"),
      isAdmin:false
    };
  },
  created(){
    var user =  JSON.parse(getCookie("user"));
    this.isAdmin = user.is_admin && user.is_admin == 1?true:false;
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      //清除缓存
      clearAllCookie();
      this.$router.push('/'); 
    },
    click() {},
    onSearchSubmit() {},
    menuSelect(index,indexPath){
      console.log("setIndex :" + index);
      this.$store.commit("setIndex",index);
    }
  },
  computed: {
    initSelect(){
      //console.log("getIndex :" + this.$store.getters.getIndex);
      return this.$store.getters.getIndex;
    }
  },
};
</script>