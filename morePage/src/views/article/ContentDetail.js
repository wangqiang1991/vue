import commons from '../../commons'
Vue.use(commons);
import contentDetail from './ContentDetail.vue'
//下面这些事必须的
//将路由注入到Vue对象中
new Vue({
  el: '#app',
  render: h => h(contentDetail)    //注意名字和上面的对应 home 对应 home.vue
})
