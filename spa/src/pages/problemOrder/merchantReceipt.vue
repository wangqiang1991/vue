<!-- 平台待收货 -->
<template>
  <el-tabs v-model="activeName" class="problemOrder_tabs" @tab-click="handleClick">

      <el-tab-pane label="售后退货平台待收货" name="1">
        <problemOrderList ref="problemOrderList1"  :orderWorkType="3" :status='3' :type='4'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="售后退货平台已收货" name="2">
        <problemOrderList ref="problemOrderList2"  :orderWorkType="3" :status='0' :type='4'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="售后换货平台待收货" name="3">
        <problemOrderList ref="problemOrderList3"  :orderWorkType="2" :status='3' :type='4'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="售后换货平台已收货" name="4">
        <problemOrderList ref="problemOrderList4"  :orderWorkType="2" :status='0' :type='4'></problemOrderList>
      </el-tab-pane>

  </el-tabs>   
</template>
<script>
  import problemOrderListV2 from './problemOrderListV2.vue'
  export default {
    data() {
      return {
        activeName:'1',
        orderWorkType:4 
      }
    },
    components:{
      problemOrderList:problemOrderListV2
    },
    methods:{
       handleClick(tab, event) {
        if(this.activeName == "1") {
          this.$refs.problemOrderList1.doSearch();
        } else if (this.activeName == "2") {
          this.$refs.problemOrderList2.doSearch();
        } else if (this.activeName == "3") {
          this.$refs.problemOrderList3.doSearch();
        } else if (this.activeName == "4") {
          this.$refs.problemOrderList4.doSearch();
        } 
      }
    }
  };
</script>

<style  rel="stylesheet/scss" lang="scss">
 .problemOrder_tabs .el-table--hidden{
    visibility:visible;
  }
</style>