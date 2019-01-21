<template>
  <div id="loadFailed_vue1" v-show='oldGoods'>
    <div>
      <img src="../assets/img/loadFailed_image.png" alt="loadFailedImg">
      <p style="color:#ddd;font-size:0.16rem;text-align:center;">商品已经out了，早不到了</p>
      <p class="reload_data_button" @click='reload'>重新加载</p>
    </div>
  </div>
</template>

<script>
  export default {
    name:'oldGoods',
    props:['oldGoods'],
    data() {
      return {

      };
    },
    mounted() {
      $('#loadFailed_vue1').css({'height': document.documentElement.clientHeight});
    },
    methods: {
      reload (){
        this.$emit('reload')
      }
    }
  }
</script>

<style lang="scss">
  #loadFailed_vue1{
    width:100%;
    height:auto;
    overflow:hidden;
    background:white;
    position:fixed;
    z-index:300;
    left:0;top:0;
    >div{
      position:absolute;
      top:20%;left:0;
      width:3.75rem;
      height:auto;
      >img{
        width:1.1rem;
        height:1.1rem;
        display:block;
        margin: 0 auto 0.2rem;
      }
      >p{
        font-size:0.14rem;
        color:#333;
        width:100%;
        text-align:center;
        margin-bottom:0.2rem;
      }
      >p.reload_data_button{
        margin:0 auto;
        padding: 0.05rem;
        height: 0.2rem;
        line-height: 0.2rem;
        background: #333333;
        color: white;
        width: 0.8rem;
      }
    }
  }
</style>
