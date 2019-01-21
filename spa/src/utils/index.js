/**
 * Created by jiachenpan on 16/11/18.
 */

import session from './session'

 export function parseTime(time, cFormat) {

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

 export function formatTime(time, option) {
   time = +time * 1000
   const d = new Date(time)
   const now = Date.now()

   const diff = (now - d) / 1000

   if (diff < 30) {
     return '刚刚'
   } else if (diff < 3600) { // less 1 hour
     return Math.ceil(diff / 60) + '分钟前'
   } else if (diff < 3600 * 24) {
     return Math.ceil(diff / 3600) + '小时前'
   } else if (diff < 3600 * 24 * 2) {
     return '1天前'
   }
   if (option) {
     return parseTime(time, option)
   } else {
     return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
   }
 }

// 格式化时间
 export function getQueryObject(url) {
   url = url == null ? window.location.href : url
   const search = url.substring(url.lastIndexOf('?') + 1)
   const obj = {}
   const reg = /([^?&=]+)=([^?&=]*)/g
   search.replace(reg, (rs, $1, $2) => {
     const name = decodeURIComponent($1)
     let val = decodeURIComponent($2)
     val = String(val)
     obj[name] = val
     return rs
   })
   return obj
 }

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
 export function getByteLen(val) {
   let len = 0
   for (let i = 0; i < val.length; i++) {
     if (val[i].match(/[^\x00-\xff]/ig) != null) {
       len += 1
     } else { len += 0.5 }
   }
   return Math.floor(len)
 }

 export function cleanArray(actual) {
   const newArray = []
   for (let i = 0; i < actual.length; i++) {
     if (actual[i]) {
       newArray.push(actual[i])
     }
   }
   return newArray
 }

 export function param(json) {
   if (!json) return ''
   return cleanArray(Object.keys(json).map(key => {
     if (json[key] === undefined) return ''
     return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
   })).join('&')
 }

 export function param2Obj(url) {
   const search = url.split('?')[1]
   if (!search) {
     return {}
   }
   return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
 }

 export function html2Text(val) {
   const div = document.createElement('div')
   div.innerHTML = val
   return div.textContent || div.innerText
 }

 export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

   if (typeof target !== 'object') {
     target = {}
   }
   if (Array.isArray(source)) {
     return source.slice()
   }
   for (const property in source) {
     if (source.hasOwnProperty(property)) {
       const sourceProperty = source[property]
       if (typeof sourceProperty === 'object') {
         target[property] = objectMerge(target[property], sourceProperty)
         continue
       }
       target[property] = sourceProperty
     }
   }
   return target
 }

 export function scrollTo(element, to, duration) {
   if (duration <= 0) return
   const difference = to - element.scrollTop
   const perTick = difference / duration * 10
   setTimeout(() => {
     console.log(new Date())
     element.scrollTop = element.scrollTop + perTick
     if (element.scrollTop === to) return
     scrollTo(element, to, duration - 10)
   }, 10)
 }

 export function toggleClass(element, className) {
   if (!element || !className) {
     return
   }
   let classString = element.className
   const nameIndex = classString.indexOf(className)
   if (nameIndex === -1) {
     classString += '' + className
   } else {
     classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
   }
   element.className = classString
 }

 export const pickerOptions = [
   {
     text: '今天',
     onClick(picker) {
       const end = new Date()
       const start = new Date(new Date().toDateString())
       end.setTime(start.getTime())
       picker.$emit('pick', [start, end])
     }
   }, {
     text: '最近一周',
     onClick(picker) {
       const end = new Date(new Date().toDateString())
       const start = new Date()
       start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
       picker.$emit('pick', [start, end])
     }
   }, {
     text: '最近一个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString())
       const start = new Date()
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
       picker.$emit('pick', [start, end])
     }
   }, {
     text: '最近三个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString())
       const start = new Date()
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
       picker.$emit('pick', [start, end])
     }
   }]

 export function getTime(type) {
   if (type === 'start') {
     return new Date().getTime() - 3600 * 1000 * 24 * 90
   } else {
     return new Date(new Date().toDateString())
   }
 }

 export function debounce(func, wait, immediate) {
   let timeout, args, context, timestamp, result

   const later = function() {
    // 据上一次触发时间间隔
     const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
     if (last < wait && last > 0) {
       timeout = setTimeout(later, wait - last)
     } else {
       timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
       if (!immediate) {
         result = func.apply(context, args)
         if (!timeout) context = args = null
       }
     }
   }

   return function(...args) {
     context = this
     timestamp = +new Date()
     const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
     if (!timeout) timeout = setTimeout(later, wait)
     if (callNow) {
       result = func.apply(context, args)
       context = args = null
     }

     return result
   }
 }

 export function deepClone(source) {
   if (!source && typeof source !== 'object') {
     throw new Error('error arguments', 'shallowClone')
   }
   const targetObj = source.constructor === Array ? [] : {}
   for (const keys in source) {
     if (source.hasOwnProperty(keys)) {
       if (source[keys] && typeof source[keys] === 'object') {
         targetObj[keys] = source[keys].constructor === Array ? [] : {}
         targetObj[keys] = deepClone(source[keys])
       } else {
         targetObj[keys] = source[keys]
       }
     }
   }
   return targetObj
 }


/*时间戳转时间*/
export function toDate(number) {
   // var n = number * 1000;   //如果是毫秒的时间戳就不需要这一步，直接下一步就可以
    var date = new Date(number);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? ('0'+ date.getHours() + ':') : ( date.getHours() + ':' );
    var m = date.getMinutes() < 10 ? ('0'+ date.getMinutes() + ':') : ( date.getMinutes() + ':' );
    var s = date.getSeconds() <10 ? ('0'+ date.getSeconds() ) : ( date.getSeconds() );
    return (Y + M + D + " " + h + m + s);
}


function getDate(datestr){
  var temp = datestr.split("-");
  var date = new Date(temp[0],temp[1]-1,temp[2]);
  return date;
}

/*输入开始日期结束日期计算中间所有日期*/
export function getAllDate(start,end) {
    var date_all=[];
    var i = 0;

    var startTime = getDate(start);
    var endTime = getDate(end);
    while((endTime.getTime()-startTime.getTime())>=0){
      var year = startTime.getFullYear();
      var month = (startTime.getMonth()+1).toString().length==1?"0"+(startTime.getMonth()+1).toString():(startTime.getMonth()+1).toString();
      var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
      date_all[i]=year+"-"+month+"-"+day;
      startTime.setDate(startTime.getDate()+1);
      i+=1;
    }
   return date_all;
}

/*判断是否是闰年*/
function isLeapYear(iYear) {
if (iYear % 4 == 0 && iYear % 100 != 0) {
  return true;
  } else {
    if (iYear % 400 == 0) {
      return true;
    } else {
      return false;
    }
  }
}

/*设置到当前月的上一个月最后一天*/
export function setLastDay(date) {
  let year = date.getFullYear();
  let month = date.getMonth() - 1;
  if (month < 0) {
    month = 11;
  }

  let lastDay = 0;
  if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
    lastDay = 31;
  } else if (month == 3 || month == 5 || month == 8 || month == 10) {
    lastDay = 30;
  } else if (month == 1) {
    if (isLeapYear(year)) {
      lastDay = 29;
    } else {
      lastDay = 28;
    }
  } else {
    lastDay = 28;
  }

  return new Date(date.setMonth(month)).setDate(lastDay);

}


//查询按钮级权限功能
export function searchBtnPermission(code) {
  let permissionVos =  session.getUser().permissionVos;
  let flag = true;
  for(var i = 0; i < permissionVos.length; i++){
    if (code == permissionVos[i].code) {
      flag = false;
      return false;
    }
  }

  if (flag) {
    return true;
  }

}


