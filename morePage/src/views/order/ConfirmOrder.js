import MintUI from 'mint-ui'    //需要调用就引入
import 'mint-ui/lib/style.css' // 需要调用就引入
Vue.use(MintUI);

//下面这些事必须的
import commons from '../../commons'
Vue.use(commons);

import ConfirmOrder from './ConfirmOrder.vue'  //引入该html的vue

//将路由注入到Vue对象中
new Vue({
  el: '#app',
  render: h => h(ConfirmOrder)
})