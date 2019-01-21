<template>
  <div>
    <orderList :orderType="orderType"></orderList>
  </div>
</template>
<script>

  /**
   *  交易已关闭订单列表
   */
  import orderListV2 from './orderListV2.vue'
  export default {
    data() {
      return {
        orderType:6
      }
    },
    components:{
      orderList:orderListV2
    }
  };
</script>
