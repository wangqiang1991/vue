<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:16px;">
      <el-tab-pane label="全场优惠券" name="1">
        <set-coupon :global="true"></set-coupon>
      </el-tab-pane>
      <el-tab-pane label="商品优惠券" name="2">
        <set-coupon :global="false"></set-coupon>
      </el-tab-pane>
  </el-tabs>    
</template>

<script>
  import setCoupon from "./setCoupon.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      setCoupon
    }
  }
</script>