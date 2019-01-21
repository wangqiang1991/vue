<template>
  <el-tabs v-model="activeName" class="order_tabs">

      <el-tab-pane label="正常售卖待收货" name="1">
        <orderList :orderType="orderType"></orderList>
      </el-tab-pane>

      <el-tab-pane label="售后换货待收货" name="2">
        <afterSaleList :afterSaleType="afterSaleType"></afterSaleList>
      </el-tab-pane>

  </el-tabs>   
</template>
<script>
/*
待收货订单列表
*/  
  import orderListV2 from './orderListV2.vue'
  import afterSaleList from './afterSaleList.vue'
  export default {
    data() {
      return {
        activeName:'1',
        orderType:3,
        afterSaleType:3,
      }
    },
    components:{
      orderList:orderListV2,
      afterSaleList:afterSaleList
    }
  };
</script>