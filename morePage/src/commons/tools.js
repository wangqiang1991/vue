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

//对时间进行格式化转码
function parseTime(time, cFormat) {
  if (!time) {
    return null;
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
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


export {setCookie, getCookie, getUser, parseTime, GetQueryString}
