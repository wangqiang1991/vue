<template>
  <el-tabs v-model="activeName" >
    <el-tab-pane label="商品推送" name="1">
      <propelGoods></propelGoods>
    </el-tab-pane>
    <el-tab-pane label="活动推送" name="2">
      <propelActivity></propelActivity>
    </el-tab-pane>
    <el-tab-pane label="期刊推送" name="3">
      <propelSubject></propelSubject>
    </el-tab-pane>
  </el-tabs>   
</template>

<script>
  import propelGoods from "./propelGoods.vue"
  import propelActivity from "./propelActivity.vue"
  import propelSubject from "./propelSubject.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      propelGoods:propelGoods,
      propelActivity:propelActivity,
      propelSubject:propelSubject
    },
  }
</script>
