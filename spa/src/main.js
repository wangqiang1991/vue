import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/icon/iconfont.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters' // 全局filter
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限
import './sidebarWatch' //左侧菜单任务监听
// import './mock'  // 该项目所有请求使用mockjs模拟
import $ from 'jquery'

import axios from 'axios'
import http from '@/utils/http'
import config from '@/commons/config'
import validate from '@/utils/validate'




Vue.use(ElementUI, { locale })

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;
Vue.prototype.http = http;
Vue.prototype.validate = validate;
Vue.prototype.config = config;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
