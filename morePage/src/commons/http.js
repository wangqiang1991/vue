import axios from 'axios'
import {getUser, setCookie} from './tools';
import { Toast } from 'mint-ui'
function Request(method, context) {
  this.method = method;
  this.context = context;
  this.requestUrl = "";
  this.requestParams = {};
  this.restParams = {};
  this.requestHeaders = {};
}

Request.prototype.url = function(url) {
  this.requestUrl = url;
  return this;
}

Request.prototype.restful = function(params) {
  this.restParams = params;
  return this;
}

Request.prototype.params = function(params) {
  this.requestParams = params;
  return this;
}

Request.prototype.headers = function(headers) {
  this.requestHeaders = headers;
  return this;
}



Request.prototype.request = function(success, fault, error) {
  // 替换restful参数
  for (var k in this.restParams) {
    this.requestUrl = this.requestUrl.replace(":" + k, this.restParams[k]);
  }

  //设置请求头的 access_token  参数由cookie中获取,利用getUser
  this.requestHeaders.access_token = getUser('access_token');

  //设置当前版本号
  this.requestHeaders.version_name = "2.0";
  this.requestHeaders.version_code = "5";
  this.requestHeaders.from = "web";

  console.log(this.method + " " + this.requestUrl)

  var instance = axios.create({
   baseURL: "",
   timeout: 30000,
   headers: this.requestHeaders,
   params:this.requestParams,
   data:this.requestParams
 });

//返回成功时执行的函数
let thenFn = (response)=>{

  if (response.data.code != 0) {

    console.log("error, code != 0", response.data);
    this.context.showError(response.data.message);

    if (response.data.code == 401 || response.data.code == 402 || response.data.code == 403) {
      document.cookie = 'access_token' + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie = 'user' + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      Toast({message: "身份信息已过期,请重新刷新页面!", position: 'bottom'})
      return ;
    }

    if (fault) {
      fault.apply(this.context, [response])
    }
    if (error) {
      error.apply(this.context, [response])
    }
  } else {
    success.apply(this.context, [response])
  }

}
//请求失败时执行的函数
let catchFn = (err)=>{

  console.log('err,netWork error:' , err)
  this.context.showError('网络错误');

  if (fault) {
    fault.apply(this.context, [err]);
  }
  if (error) {
    error.apply(this.context, [err])
  }

}

if (this.method === "postJson") {
  instance.defaults.params = {};
  instance.defaults.headers["Content-Type"] = "application/json";
  var jsonParams = JSON.stringify(this.requestParams);
  instance.post(this.requestUrl, jsonParams).then(thenFn).catch(catchFn);
 }else{
  instance[this.method](this.requestUrl).then(thenFn).catch(catchFn);
}


}

export default {
  get:function(context) {
    return new Request("get", context);
  },
  post:function(context) {
    return new Request("post", context);
  },
  postJson:function(context) {
    return new Request("postJson", context);
  },
  put:function(context) {
    return new Request("put", context);
  },
  delete:function(context) {
    return new Request("delete", context);
  }
}
