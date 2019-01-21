<template>
  <div>
    <orderList :orderType="orderType"></orderList>
  </div>
</template>
<script>

  /**
   *  待付款订单列表
   */
  import orderListV2 from './orderListV2.vue'
  export default {
    data() {
      return {
        orderType:1
      }
    },
    components:{
      orderList:orderListV2
    }
  };
</script>
