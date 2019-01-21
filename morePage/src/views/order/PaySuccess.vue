<template>
  <div id="PaySuccess_Vue">
  	<!--<img src="../../assets/img/paySuccsee.png"/>-->
  	<p class="content1">付款成功</p>
  	<p class="content2">您的包裹即将发货</p>
  	<p class="checkOrder" @click='seeOrder'>查看订单</p>
  	<p class="backToHome" @click='goHome'>返回首页</p>
  </div>
</template>

<script>
export default {
  name: 'PaySuccess',
  created (){
      document.title="支付成功"
  },
  data () {
    return {

    }
  },
  mounted:function(){
    
  },
  methods:{
    goHome(){
      this.keep.go('/index.html',false)
    },
    seeOrder(){
    	this.keep.go('/order_list.html?activated=2',true)
      let orderId = this.getParam('orderId');
      console.log(orderId)
//    this.keep.go('/order_list.html',true,{orderId:orderId})
    }
  }
}
</script>

<style lang='scss'>
  @import '../../assets/scss/PaySuccess.scss';
</style>