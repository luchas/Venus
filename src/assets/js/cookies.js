/*用export把方法暴露出来*/
/*设置cookie*/
export function setCookie(c_name,value,expire) {
  var date=new Date()
  date.setDate(date.getDate()+expire)
  document.cookie=c_name+ "="+escape(value)+"; expires="+date.toGMTString()
  //console.log(document.cookie)
}

/*获取cookie*/
export function getCookie(c_name){
  //console.log("cookie :" + document.cookie)
  if (document.cookie.length>0){
      let c_start=document.cookie.indexOf(c_name + "=")
      if (c_start!=-1){ 
          c_start=c_start + c_name.length+1 
          let c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length
              return unescape(document.cookie.substring(c_start,c_end))
          } 
      }
  return ""
}

/*删除cookie*/
export function delCookie(c_name){
  setCookie(c_name, "", -1)
}

/** 删除所有的cookie */
export function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if(keys) {
    for(var i = keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}