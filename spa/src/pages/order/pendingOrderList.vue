<template>
  <el-tabs v-model="activeName" class="order_tabs">

      <el-tab-pane label="正常售卖待发货" name="1">
        <orderList :orderType="orderType"></orderList>
      </el-tab-pane>

      <el-tab-pane label="售后换货待发货" name="2">
        <afterSaleList :afterSaleType="afterSaleType"></afterSaleList>
      </el-tab-pane>

  </el-tabs>   
</template>
<script>
  import orderListV2 from './orderListV2.vue'
  import afterSaleList from './afterSaleList.vue'

  /**
   * 待发货订单列表
   */
  export default {
    data() {
      return {
        activeName:'1',
        orderType:2,
        afterSaleType:2,
      }
    },
    components:{
      orderList:orderListV2,
      afterSaleList:afterSaleList
    }
  };
</script>
