<template>
  <div id="firstLoad_vue" v-show='firstLoad'>
   
    <img src="../assets/img/loading_page_article.png" alt="loadFailedImg" v-if="type == 1">
    <img src="../assets/img/loading_page_goods.png" alt="loadFailedImg"  v-if="type == 2">
    <img src="../assets/img/loading_page_space.png" alt="loadFailedImg"  v-if="type == 3">
    <img src="../assets/img/loading_page_plan.png" alt="loadFailedImg"  v-if="type == 4">
  </div>
</template>

<script>
  export default {
    name:'firstLoadNormal',
    props:['firstLoad','type'], //type  1 文章  2商品 3空间
    data() {
      return {

      }
    },
    mounted() {
      $('#firstLoad_vue').css({'height': document.documentElement.clientHeight});
    }
  }
</script>

<style lang="scss">
  #firstLoad_vue{
    width:100%;
    height:auto;
    overflow:hidden;
    background:white;
    position:fixed;
    z-index:10;
    left:0;top:0;
    img{
      display:block;
      width:100%;
      height:100%;
    }
  }
</style>
