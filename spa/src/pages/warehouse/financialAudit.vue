<template>

  <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="待审核" name="1">
        <financialAuditItem :status="1" ref="financialAudit"></financialAuditItem>
      </el-tab-pane>

      <el-tab-pane label="已审核" name="2">
        <financialAuditItem :status="5" ref="isFinancialAudit"></financialAuditItem>
      </el-tab-pane>

  </el-tabs>   

</template>

<script>
  import financialAuditItem from "./financialAuditItem.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      financialAuditItem:financialAuditItem
    },
    methods:{
       handleClick(tab, event) {
        if(this.activeName == "1") {
          this.$refs.financialAudit.doSearch();
        } else if (this.activeName == "2") {
          this.$refs.isFinancialAudit.doSearch();
        }
      }
    }
  }
</script>