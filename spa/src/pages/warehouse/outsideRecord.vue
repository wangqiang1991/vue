<template>

  <el-tabs v-model="activeName"  @tab-click="handleClick">

      <el-tab-pane label="直接调拨" name="1">
        <outsideRecordItem :type="1" ref="financialAudit"></outsideRecordItem>
      </el-tab-pane>

      <el-tab-pane label="借转调" name="2">
        <outsideRecordItem :type="2" ref="financialReject"></outsideRecordItem>
      </el-tab-pane>

  </el-tabs>

</template>

<script>
  import outsideRecordItem from "./outsideRecordItem.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      outsideRecordItem:outsideRecordItem
    },
    methods:{
      loadData(){
        console.log(12)
        this.activeName = "1";
        this.$refs.financialAudit.loadData();
      },
      handleClick(tab, event) {
        // if(this.activeName == "1"){
        //   this.$refs.financialAudit.loadData();
        // }else if (this.activeName == "2") {
        //   this.$refs.financialReject.loadData();
        // }
      }
    }
  }
</script>
