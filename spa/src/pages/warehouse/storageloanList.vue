<template>
  <el-tabs v-model="activeName"  @tab-click="handleClick">

      <el-tab-pane label="借出中" name="1">
        <storageloanListItem :loanStatus="1" :status="1" ref="isLoan"></storageloanListItem>
      </el-tab-pane>

      <el-tab-pane label="已完成" name="2">
        <storageloanListItem :loanStatus="2" :status="2" ref="loanComplate"></storageloanListItem>
      </el-tab-pane>

      <el-tab-pane label="已报损" name="3">
        <storageloanListItem :queryBad="true" :status="3" ref="purpose"></storageloanListItem>
      </el-tab-pane>

      <el-tab-pane label="借转调" name="4">
        <storageloanListItem :queryOutside="true" :status="4" ref="damageDegree"></storageloanListItem>
      </el-tab-pane>

  </el-tabs>   

</template>

<script>
  import storageloanListItem from "./storageloanListItem.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    methods:{
      handleClick(tab, event) {
        if(this.activeName == "1"){
          this.$refs.isLoan.loadData();
        }else if (this.activeName == "2") {
          this.$refs.loanComplate.loadData();
        }else if(this.activeName == "3"){
          this.$refs.purpose.loadData();
        }else if(this.activeName == "4"){
          this.$refs.damageDegree.loadData();
        }
      }
    },
    components:{
      storageloanListItem:storageloanListItem
    }
  }
</script>