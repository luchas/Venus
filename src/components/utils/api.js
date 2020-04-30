import {getHttp, postHttp} from './http'
import {getCookie} from '../../assets/js/cookies'

export function getSessionToken(){
  let TOKEN=getCookie('STORAGE_TOKEN');
  return TOKEN;
}
/**
  * 登陆请求
 **/
export function login(username,password) {
  let url = 'bg/userLogin'
  var param = {
    username:username,
    password:password
  }
  return postHttp(url, param)
}

/**
 * 1 认证审核列表 bg/certificate/status
 * @param {类型} status 
 * @param {当前页码} current 
 * @param {页数} size 
 */
export function certificateList(search,status,current,size)
{
  let url = 'bg/certificate/status';
  var param = {
    token:getSessionToken(),
    search:search,
    status:status,
    current:current,
    size:size
  }
  return postHttp(url,param);
}

/**
 * 1.1 认证审核
 * @param {id} id
 * @param {状态} operate_status  1：通过，2：不通过
 */
export function certificateCheck(id,operate_status)
{
  let url = 'bg/certificate/operate';
  var param ={
    token : getSessionToken(),
    status:operate_status,
    id:id
  }
  return postHttp(url,param);
}

/**
 * 2 提款审核列表 bg/drawings/status
 * @param {类型} status 
 * @param {当前页码} current 
 * @param {页数} size 
 */
export function drawingsList(search,status,current,size)
{
  let url = 'bg/drawings/status';
  var param = {
    token:getSessionToken(),
    search:search,
    status:status,
    current:current,
    size:size
  }
  return postHttp(url,param);
}

/**
 * 2.1 提款审核
 * @param {id} id
 * @param {状态} operate_status  1：通过，2：不通过
 */
export function drawingsCheck(id,operate_status)
{
  let url = 'bg/drawings/operate';
  var param ={
    token : getSessionToken(),
    status:operate_status,
    id:id
  }
  return postHttp(url,param);
}


/**
 * 3 客服管理列表 bg/service/status
 * @param {类型} status 
 * @param {当前页码} current 
 * @param {页数} size 
 */
export function serviceList(search,current,size)
{
  let url = 'bg/customerservice/list';
  var param = {
    token:getSessionToken(),
    search:search,
    current:current,
    size:size
  }
  return postHttp(url,param);
}

/**
 * 3.1 客服新增
 * @param {id} id
 * @param {状态} operate_status  1：通过，2：不通过
 */
export function addService(name,account,pwd,isAdmin)
{
  let url = "bg/customerservice/add";
  var param = {
    token:getSessionToken(),
    name:name,
    account:account,
    pwd:pwd,
    isAdmin:isAdmin
  }
  return postHttp(url,param);
}
/**
 * 3.2 客服删除
 * @param {id} id
 * @param {状态} operate_status  1：通过，2：不通过
 */
export function deleteService(id)
{
  let url = "bg/customerservice/delete";
  var param = {
    token:getSessionToken(),
    id:id
  }
  return postHttp(url,param);
}
/**
 * 4 用户管理列表 bg/usermanage/status
 * @param {类型} status 
 * @param {当前页码} current 
 * @param {页数} size 
 */
export function userManageList(search,status,current,size)
{
  let url = 'bg/usermanage/status';
  var param = {
    token:getSessionToken(),
    search:search,
    status:status,
    current:current,
    size:size
  }
  return postHttp(url,param);
}

/**
 * 4.1 用户举报审核
 * @param {id} id
 * @param {状态} status  1：通过，2：不通过
 */
export function userManageCheck(id,status)
{
  let url = 'bg/usermanage/operate';
  var param ={
    token : getSessionToken(),
    status:status,
    id:id
  }
  console.log("userManageCheck :" + JSON.stringify(param));
  return postHttp(url,param);
}

/**
 * 5 动态列表
 * @param {类型} status 
 * @param {当前页码} current 
 * @param {页数} size 
 */
export function dynamicList(search,status,current,size)
{
  let url = 'bg/dynamiccheck/status';
  var param = {
    token:getSessionToken(),
    search:search,
    status:status,
    current:current,
    size:size
  }
  return postHttp(url,param);
}

/**
 * 5.1 动态审核
 * @param {id} id
 * @param {状态} operate_status  1：通过，2：不通过
 */
export function dynamiCheck(id,operate_status)
{
  let url = 'bg/dynamiccheck/operate';
  var param ={
    token : getSessionToken(),
    status:operate_status,
    id:id
  }
  return postHttp(url,param);
}

/**
 * 6 约单审核列表 /bg/appointment/status
 * @param {类型} status 
 * @param {当前页码} current 
 * @param {页数} size 
 */
export function appointmentList(search,status,current,size)
{
  let url = 'bg/appointment/status';
  var param = {
    token:getSessionToken(),
    search:search,
    status:status,
    current:current,
    size:size
  }
  return postHttp(url,param);
}

/**
 * 6.1 约单审核
 * @param {id} id
 * @param {状态} status  1：通过，2：不通过
 */
export function appointmentCheck(id,status)
{
  let url = 'bg/appointment/operate';
  var param ={
    token : getSessionToken(),
    status:status,
    id:id
  }
  return postHttp(url,param);
}
/**
 * 7 版本列表 /bg/version/list
 */
export function versionList()
{
  let url = 'bg/version/list';
  var param = {
    token:getSessionToken(),
    current:0,
    size:5
  }
  return postHttp(url,param);
}
/**
 * 7.1 上传文件
 */
export function uploadApk(data)
{
  let url = 'bg/version/upload';
  return postHttp(url,data);
}