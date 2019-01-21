<!-- 退款工单 -->
<template>

  <el-tabs v-model="activeName" class="problemOrder_tabs" @tab-click="handleClick">

      <el-tab-pane label="未受理" name="1">
        <problemOrderList ref="problemOrderList1" :orderWorkType="orderWorkType" :status='1' :type='1'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="财务待退款" name="6">
        <problemOrderList ref="problemOrderList6" :orderWorkType="orderWorkType" :status='6' :type='1'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="退款中" name="3">
        <problemOrderList ref="problemOrderList3" :orderWorkType="orderWorkType" :status='3' :type='1'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="退款成功" name="4">
        <problemOrderList ref="problemOrderList4" :orderWorkType="orderWorkType" :status='4' :type='1'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="退款失败" name="5">
        <problemOrderList ref="problemOrderList5" :orderWorkType="orderWorkType" :status='5' :type='1'></problemOrderList>
      </el-tab-pane>

      <el-tab-pane label="拒绝受理" name="2">
        <problemOrderList ref="problemOrderList2" :orderWorkType="orderWorkType" :status='2' :type='1'></problemOrderList>
      </el-tab-pane>


  </el-tabs>   

</template>

<script>
  import problemOrderListV2 from './problemOrderListV2.vue'
  export default {
    data() {
      return {
        activeName:'1',
        orderWorkType:1 
      }
    },
    components:{
      problemOrderList:problemOrderListV2
    },
    methods:{
       handleClick(tab, event) {
        if(this.activeName == "1") {
          this.$refs.problemOrderList1.doSearch();
        } else if (this.activeName == "6") {
          this.$refs.problemOrderList6.doSearch();
        } else if (this.activeName == "3") {
          this.$refs.problemOrderList3.doSearch();
        } else if (this.activeName == "4") {
          this.$refs.problemOrderList4.doSearch();
        } else if (this.activeName == "5") {
          this.$refs.problemOrderList5.doSearch();
        } else if (this.activeName == "2") {
          this.$refs.problemOrderList2.doSearch();
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
