import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router.js'
import VueResource from 'vue-resource'
import Moment from 'moment'
import 'normalize.css/normalize.css'
import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)
import 'video.js/dist/video-js.css'

import './icons'
import './assets/icon/iconfont'
import store from './store/index.js'
import {getCookie} from './assets/js/cookies'

Vue.use(Vuex)
Vue.use(Viewer)


// 安装 ElementUI（ui）
Vue.use(ElementUI)

// 安装 路由（url）
Vue.use(VueRouter)

// 绑定 vue-resource（ajax）
Vue.use(VueResource)

// 绑定 moment 进行时间格式化 ✔
Vue.prototype.$moment = Moment;//赋值使用


// 如果我们通过全局配置了，请求的数据接口 根域名，则 ，在每次单独发起 http 请求的时候，请求的 url 路径，应该以相对路径开头，前面不能带 /  ，否则 不会启用根路径做拼接；
//Vue.http.options.root = ' http://47.105.130.223:8080/';
Vue.http.options.root = ' http://47.105.130.223:8080/';

// 全局启用 emulateJSON 选项:如果Web服务器无法处理编码为application/json的请求，你可以启用emulateJSON选项。
Vue.http.options.emulateJSON = false;
Vue.http.options.crossOrigin = true;
Vue.http.options.emulateHTTP = true;
/******************拦截器设置请参考这部分(开始)******************/
Vue.http.interceptors.push((request, next)  =>{
  //登录成功后将后台返回的TOKEN在本地存下来,每次请求从sessionStorage中拿到存储的TOKEN值
  let TOKEN=getCookie('STORAGE_TOKEN');
  if(TOKEN){
    //如果请求时TOKEN存在,就为每次请求的headers中设置好TOKEN,后台根据headers中的TOKEN判断是否放行
    request.headers.set('TOKEN',TOKEN);
  }
  next((response) => {
    return response;
  });
});
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      let USER = getCookie('user');
      if (USER) {  // 通过vuex state获取当前的token是否存在
         // console.log("user :" + JSON.stringify(USER));
         if(to.fullPath != from.fullPath){
            store.commit("setIndex", to.fullPath);
         }
         next();
      }
      else {
        next({
            path: '/',
            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
  }
  else {
      next();
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  // 挂在路由对象到 VM 实例上
  router,
  store
})

