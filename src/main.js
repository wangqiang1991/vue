import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import App from './App.vue'
import router1 from './components/router1.vue'
import router2 from './components/router2.vue'

Vue.use(ElementUI)

//全局安装路由功能
Vue.use(VueRouter)

//定义路径
const routes = [
    { path: '/', component: router1 },
    { path: '/router1', component: router1 },
    { path: '/router2', component: router2 },
]

//创建路由对象
const router = new VueRouter({
  routes
})

//将路由注入到Vue对象中
new Vue({
  el: '#app',
  router:router,
  template: '<App></App>',
  components: { App },  
})


