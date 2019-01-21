<!-- 平台待退款 -->
<template>

  <el-tabs v-model="activeName" class="problemOrder_tabs" @tab-click="handleClick">

      <el-tab-pane label="售后退款待退款" name="1">
        <problemOrderList ref="problemOrderList1"  :orderWorkType="1" :status='6' :type='5'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="售后退款已退款" name="2">
        <problemOrderList ref="problemOrderList2"  :orderWorkType="1" :status='4' :type='5'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="售后退货待退款" name="3">
        <problemOrderList ref="problemOrderList3"  :orderWorkType="3" :status='5' :type='5'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="售后退货已退款" name="4">
        <problemOrderList ref="problemOrderList4"  :orderWorkType="3" :status='7' :type='5'></problemOrderList>
      </el-tab-pane>

  </el-tabs>   

</template>
<script>
  import problemOrderListV2 from './problemOrderListV2.vue'
  export default {
    data() {
      return {
        activeName:'1',
        orderWorkType:5 
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