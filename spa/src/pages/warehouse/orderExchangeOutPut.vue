<!-- 商品换货出库 -->
<template>

  <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="换货待出库" name="1">
        <orderOutputItem :type="2" :outputStatus='1' ref="isPutStorage"></orderOutputItem>
      </el-tab-pane>

      <el-tab-pane label="换货已出库" name="2">
        <orderOutputItem :type="2" :outputStatus='2' ref="hasPutStorage"></orderOutputItem>
      </el-tab-pane>

  </el-tabs>   

</template>

<script>
  import orderOutputItem from "./orderOutputItem.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      orderOutputItem:orderOutputItem
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