(function(window, document){
/*验证是否登陆*/
let user = getUser("user");
let access_token = getUser('access_token');
let preview = GetQueryString('preview');
let platform = getPlatform();

/*判断登录*/
if (platform != 'ios' && platform != 'android' && preview != 'isPc') {
  relogin();
}

function relogin() {
  if (!user || !access_token) {

    var errorCode = getCookie("errorCode");
    if (errorCode != null && errorCode != "") {
      // Toast({message: "登录失败，请重新刷新。", position: 'bottom'})
      alert("登录失败，请重新刷新。")
      setCookie("errorCode", "", -1);
      return false;
    }

    var href = window.location.href;
    var currentUrl = href.substr(href.lastIndexOf("/"));
    console.log("未登录,自动调用微信登录,登录后跳转到:" + currentUrl);
    currentUrl = encodeURIComponent(currentUrl);
    var wxlogin = "";

    //正式环境
    wxlogin = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1a8140619d08e20d&redirect_uri=https%3a%2f%2fwx.goochao.com%2fapp%2fapi%2fauth%2fcallback&response_type=code&scope=snsapi_userinfo&state=${currentUrl}#wechat_redirect`;

    //测试环境
    //wxlogin = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx44b6108c072668e4&redirect_uri=http%3a%2f%2ftest.wx.goochao.com%2fapp%2fapi%2fauth%2fcallback&response_type=code&scope=snsapi_userinfo&state=${currentUrl}#wechat_redirect`;

    //开发环境
    //wxlogin = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e0ee657dc01427c&redirect_uri=http%3a%2f%2fwxtest.goochao.com%3a8080%2fapp%2fapi%2fauth%2fcallback&response_type=code&scope=snsapi_userinfo&state=${currentUrl}#wechat_redirect`;

    if (!wxlogin) {
      console.log("未配置转向Url");
    } else {
      console.log("微信登录地址:" + wxlogin);
      window.location.href = wxlogin;
    }

  }
}

//设置cookie
function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + encodeURIComponent(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

//取回cookie
function getCookie(c_name) {
  var c_start = null;
  var c_end = null;
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) {
        return document.cookie.slice(c_start)
      } else {
        return document.cookie.slice(c_start, c_end)
      }
    }
  }
  return ""
}

//获取用户信息并且用uri转码
function getUser(user) {
  let userdata = getCookie(user);
  return decodeURIComponent(userdata)
}

//获取地址栏参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2])
  } else {
    return null
  }
}

//判断是否是ios或是Android进入页面
function getPlatform() {
  var platform =  window.dsBridge.call("getPlatform",{msg:'getPlatform'});
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
}

}(window, document));