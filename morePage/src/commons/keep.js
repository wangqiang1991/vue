export default (function() {
  var keyPrefix = window.location.pathname;
  if (keyPrefix == "/") {
    keyPrefix = "/index.html";
  }
  var cache = {
    // 添加缓存
    push(key, value, pathname) {
      if (!value) {
        return;
      }
      if (!pathname) {
        pathname = keyPrefix;
      }
      sessionStorage[pathname + "-" + key] = JSON.stringify(value);
    },
    // 获取缓存
    get(key, defaultValue, pathname) {
      if (!pathname) {
        pathname = keyPrefix;
      }
      var value = sessionStorage[pathname + "-" + key];
      if (!value) {
        if (defaultValue) {
          return defaultValue;
        }
        return null;
      }
      return JSON.parse(value);
    },
    // 删除缓存
    remove(key) {
      sessionStorage.removeItem(keyPrefix + "-" + key);
    },
    // 删除某个页面的缓存
    removeByPathname(pathname, key) {
      if (!pathname) {
        pathname = keyPrefix;
      }
      sessionStorage.removeItem(pathname + "-" + key);
    },
    // key是否存在
    has(key, pathname) {
      if (!pathname) {
        pathname = keyPrefix;
      }
      return sessionStorage.hasOwnProperty(pathname + "-" + key)
    }
  };
  return {
    // 保持keep-alive
    markKeepAlive() {
      cache.push("keep-alive", "1");
      var url = window.location.href;

      if (url.indexOf("?r=1") == -1 || url.indexOf("&r=1") == -1) {
        if (url.indexOf("?") == -1) {
          url = url + "?r=1";
        } else {
          url = url + "&r=1";
        }
      }
      window.history.replaceState({}, null, url);
    },
    // 不保持keep-alive
    markNotKeepAlive() {
      cache.remove("keep-alive");
      var url = window.location.href;
      url = url.replace("\?r=1", "");
      url = url.replace("\&r=1", "")
      if (url.indexOf("&") != -1 && url.indexOf("?") == -1) {
        url = url.replace("\&", "?")
      }
      window.history.replaceState({}, null, url);
    },
    // 是否keep-alive状态
    isKeepAlive() {
      var keepAliveNotEmpty = cache.has("keep-alive");
      var url = window.location.href;
      return keepAliveNotEmpty && (url.indexOf("?r=1") != -1 || url.indexOf("&r=1") != -1);
    },
    // 使某个页面的keep-alive提前失效, pathname示例:/index.html
    invalidKeepAlive(pathname) {
      cache.removeByPathname(pathname, "keep-alive");
    },
    // 跳转到指定页面,并标记keep-alive模式
    go(path, keepAlive = true, params, wrapperLink = false) {
      if (keepAlive) {
        this.markKeepAlive();
      }
      if (wrapperLink) {
        if (path.indexOf("?") == -1) {
          path = path + "?r=1";
        } else {
          path = path + "&r=1";
        }
      }
      if (params) {
        for (var k in params) {
          if (path.indexOf("?") == -1) {
            path += `?${k}=${params[k]}`;
          } else {
            path += `&${k}=${params[k]}`;
          }
        }
      }
      window.location.href = path;
    },

    back() {
      window.history.go(-1);
    },


    // 缓存
    cache,
    // 滚动条
    scroll: {
      getDom(dom) {
        return dom ? dom : window.document;
      },
      getKey(key) {
        return key ? key : "position";
      },
      // 保存当前滚动位置
      save(dom, key) {
        dom = this.getDom(dom);
        key = this.getKey(key);
        cache.push(key, $(dom).scrollTop());
      },
      // 恢复滚动位置
      recover(dom, key) {
        dom = this.getDom(dom);
        key = this.getKey(key);
        var pos = cache.get(key);
        setTimeout(()=> {
          $(dom).scrollTop(pos)
        }, 10)
      },
      // 恢复滚动位置并清除位置的值
      recoverAndClear(dom, key) {
        this.recover(dom, key);
        this.clear(key);
      },
      // 恢复滚动位置
      clear(key) {
        key = this.getKey(key);
        cache.remove(key);
      }
    },
    install: function(Vue){
      Vue.prototype.keep = this;
    }
  };
})();
