<template>
  <el-tabs v-model="activeName">

      <el-tab-pane label="未受理" name="1">
        <procurementStatus :status="1"></procurementStatus>
      </el-tab-pane>

      <el-tab-pane label="受理中" name="2">
        <procurementStatus :status="2"></procurementStatus>
      </el-tab-pane>

      <el-tab-pane label="采购中" name="3">
        <procurementStatus :status="3"></procurementStatus>
      </el-tab-pane>

      <el-tab-pane label="已完成" name="4">
        <procurementStatus :status="4"></procurementStatus>
      </el-tab-pane>

      <el-tab-pane label="采购驳回" name="5">
        <procurementStatus :status="5"></procurementStatus>
      </el-tab-pane>

  </el-tabs>   

</template>

<script>
  import procurementStatus from "./procurementStatus.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      procurementStatus:procurementStatus
    }
  }
</script>