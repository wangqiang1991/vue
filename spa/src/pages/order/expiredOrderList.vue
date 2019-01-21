<template>
  <div>
    <orderList :orderType="orderType"></orderList>
  </div>
</template>
<script>

  /**
   *  订单已取消 列表
   */
  import orderListV2 from './orderListV2.vue'
  export default {
    data() {
      return {
        orderType:4
      }
    },
    components:{
      orderList:orderListV2
    }
  };
</script>
