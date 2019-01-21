<!-- 销售退货入库 -->
<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="销售退货待入库" name="1">
        <orderWarehousItem :type="3" :workStatus='1' ref="isPutStorage"></orderWarehousItem>
      </el-tab-pane>

      <el-tab-pane label="销售退货已入库" name="2">
        <orderWarehousItem :type="3" :workStatus='2' ref="hasPutStorage"></orderWarehousItem>
      </el-tab-pane>

  </el-tabs>   

</template>

<script>
  import orderWarehousItem from "./orderWarehousItem.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      orderWarehousItem:orderWarehousItem
    },
    methods:{
       handleClick(tab, event) {
        if(this.activeName == "1") {
          this.$refs.isPutStorage.loadData();
        } else if (this.activeName == "2") {
          this.$refs.hasPutStorage.loadData();
        }
      }
    }
  }
</script>