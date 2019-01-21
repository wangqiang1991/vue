<template>
  <div id="firstLoad_vue" v-show='firstLoad'>
   
    <img src="../assets/img/firstLoad_gif.gif" alt="loadFailedImg">
  
  </div>
</template>

<script>
  export default {
    name:'firstLoad',
    props:['firstLoad'],
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
      width:0.8rem;
      height:0.8rem;
      position:absolute;
      top:40%;left:50%;
      margin-top:-0.4rem;
      margin-left:-0.4rem;
    }
  }
</style>
