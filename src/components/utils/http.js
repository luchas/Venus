import Vue from 'vue'
import { Message, MessageBox } from 'element-ui'
import {clearAllCookie} from "../../assets/js/cookies"
let vue = new Vue()

//GET请求,将url和请求参数传入，通过Promise，将成功和失败的数据派发出去
export function getHttp(url, params) {
  return new Promise((resolve, reject) => {
    vue
      .$http({
        url: url,
        params: params,
        method: 'GET'
      })
      .then(response => {
        resolve(response.body)
      }, response => {      
        reject(response.bodyText)
      })
  })
}

//POST请求，将url,请求参数和body传入，通过Promise，将成功和失败的数据派发出去
export function postHttp(url, params, body) {
  return new Promise((resolve, reject) => {
    Vue.http.post(
      url,
      params)
      .then(response => {
        
        const res = response.data
        //console.log('res :' + JSON.stringify(res))
        if (res.code !== 200 &&  res.code !== 407) {
          // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
          /** 
               *   RESPONSE_OK(200, "返回正常"),
               *   RESPONSE_ERROR(400, "返回异常"),
                *  RESPONSE_EMPTY(401, "参数为空"),
                *  RESPONSE_NOT_LOGIN(402, "用户未登录"),
                *  RESPONSE_USER_EXIST(403, "用户名已存在"),
                *  RESPONSE_USER_NOT_EXIST(405, "用户名不存在"),
                *  RESPONSE_PASSWORD_ERROR(406, "密码错误"),
                *  RESPONSE_IS_LOGIN(407, "已经登录");
                *  RESPONSE_TIME_OUT(408, "登录超时");
              */
          if (res.code === 402 || res.code === 408) {
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              
               //清除缓存
               clearAllCookie();
               //this.$router.push('/login');
               window.location.href = "/";
            })
          }else{
            Message({
              message: res.msg || '请求失败！',
              type: 'error',
              duration: 5 * 1000
            })
          }
          reject(response.body)
        } else {
          resolve(response.body)
        }
      }, response => {
        reject(response.bodyText)
      })
  })
}