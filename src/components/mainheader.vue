<template>
  <el-row
    type="flex"
    class="row-bg"
  >
    <el-col :span="18">
      <el-form
        :inline="true"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
            size="mini"
            :placeholder="searchName"
            prefix-icon="el-icon-search"
            v-model="searchContent"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="onSearchSubmit"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="6">
      <el-dropdown
        class="avatar-container right-menu-item"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="imgUrl"
            class="user-avatar"
          >
          <span v-text="username"></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span
              style="display:block;"
              @click="logout"
            >退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
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
  background-color: #5967d9;
  border-color: #5967d9;
}
.row-bg {
  z-index: 99999;
  background-color: white;
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
</style>
<script>
import {getCookie,clearAllCookie} from '../assets/js/cookies';
export default {
  data() {
    return {
      imgUrl: require("../assets/avator1.png"),
      username: "",
      searchContent: ""
    };
  },
  props:["searchName"],
  created() {
    
  },
  mounted(){
    this.username = getCookie("userAccount");
  },
  methods: {
    logout() {
      //清除缓存
      clearAllCookie();
      this.$router.push("/");
    },
    onSearchSubmit() {
      this.$emit("getSearchData", this.searchContent); //触发父组件的方法
    }
  },
  watch: {
    searchContent(curVal, oldVal) {
      if (curVal != oldVal) {
        this.$emit("getSearchData", curVal); //触发父组件的方法
      }
    }
  }
};
</script>