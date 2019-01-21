<template>

  <el-tabs v-model="activeName"  @tab-click="handleClick">

      <el-tab-pane label="财务审核中" name="1">
        <purchaseOrderItem :status="1" @success="loadData" ref="financialAudit"></purchaseOrderItem>
      </el-tab-pane>

      <el-tab-pane label="财务审核驳回" name="2">
        <purchaseOrderItem :status="2" @success="loadData" ref="financialReject"></purchaseOrderItem>
      </el-tab-pane>

      <el-tab-pane label="采购中" name="3">
        <purchaseOrderItem :status="3" @success="loadData" ref="procurement"></purchaseOrderItem>
      </el-tab-pane>

      <el-tab-pane label="已完成" name="4">
        <purchaseOrderItem :status="4" @success="loadData" ref="completed"></purchaseOrderItem>
      </el-tab-pane>

      <el-tab-pane label="已失效" name="5">
        <purchaseOrderItem :status="0" @success="loadData" ref="invalided"></purchaseOrderItem>
      </el-tab-pane>

  </el-tabs>   

</template>

<script>
  import purchaseOrderItem from "./purchaseOrderItem.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      purchaseOrderItem:purchaseOrderItem
    },
    methods:{
      loadData(){
        console.log(12)
        this.activeName = "1";
        this.$refs.financialAudit.loadData();
      },
      handleClick(tab, event) {
        if(this.activeName == "1"){
          this.$refs.financialAudit.loadData();
        }else if (this.activeName == "2") {
          this.$refs.financialReject.loadData();
        }else if(this.activeName == "3"){
          this.$refs.procurement.loadData();
        }else if(this.activeName == "4"){
          this.$refs.completed.loadData();
        }else if(this.activeName == "5"){
          this.$refs.invalided.loadData();
        }
      }
    }
  }
</script>