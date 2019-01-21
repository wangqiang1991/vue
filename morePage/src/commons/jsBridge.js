import { Toast } from 'mint-ui'
var dsBridge = require("dsbridge");

export default{
  /*端口信息  web ios android*/
  getPlatform:function() {
    var platform =  dsBridge.call("getPlatform",{msg:'getPlatform'});
    if (!platform) {
      return null;
    } else {
      var data = JSON.parse(platform);
      if (data.code == 0) {
        return data.data;
      } else {
        return null;
      }
    }
  },
  /*判断是否有API*/
  hasApi:function(apiName) {
    var api =  dsBridge.call("hasApi",{apiName:apiName});
    if (!api) {
      return null;
    } else {
      var data = JSON.parse(api);     
      if (data.code == 0) {
        return true;
      } else {
        Toast({message:data.errMsg, position: 'bottom'});
        return false; 
      }
    } 
  },
  /*api方法*/
  invoke:function(apiName, params) {
    let obj = {};
    if (params) {
      obj = {apiName:apiName,params:params};   
    } else {
      obj = {apiName:apiName};
    }

    if (this.hasApi(apiName)) {
      let invoke = dsBridge.call("invoke", obj);

      if (!invoke) {
        return null;
      } else {
        invoke = invoke.replace('"true"', 'true');
        invoke = invoke.replace('"false"', 'false');
        var data = JSON.parse(invoke);
        if (data.code == 0) {
          return data;
        } else {
          Toast({message:data.errMsg, position: 'bottom'});
          return null;
        }
      }
    } else {
      return null;
    }
  },

}