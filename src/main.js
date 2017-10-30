import Vue from 'vue'
import VueRouter from 'vue-router';
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import App from './App.vue'
import Login from './components/login.vue'

Vue.use(ElementUI)

//全局安装路由功能
Vue.use(VueRouter)

//定义路径
const routes = [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/home', component: resolve => require(['./components/home.vue'], resolve),
    	children:[
            { path: 'addstudent', component: resolve => require(['./components/addstudent.vue'], resolve) },
            { path: 'update', component: resolve => require(['./components/update.vue'], resolve) }
       ]
     }
]

//创建路由对象
const router = new VueRouter({
  routes
})

//将路由注入到Vue对象中
new Vue({
  el: '#app',
  router:router,
  store,
  template: '<App></App>',
  components: { App },  
})


