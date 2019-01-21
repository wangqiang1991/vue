<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="商品列表" name="first">
      <goos-list></goos-list>
    </el-tab-pane>
    <el-tab-pane label="点赞商品" name="second">
         <praise-list></praise-list>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import GoosList from './goosList'
  import PraiseList from './praiseList'
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    components:{
        GoosList,
        PraiseList
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
