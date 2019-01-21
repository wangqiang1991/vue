import MintUI from 'mint-ui'    //需要调用就引入
import 'mint-ui/lib/style.css' // 需要调用就引入
Vue.use(MintUI)
import commons from '../../commons'
Vue.use(commons);
import ReceiveGoodsWait from './ReceiveGoodsWait.vue'  //引入该html的vue
//下面这些事必须的

//将路由注入到Vue对象中
new Vue({
  el: '#app',
  render: h => h(ReceiveGoodsWait)    //注意名字和上面的对应 home 对应 home.vue
})