<template>
  <div id="wxQrcode_vue" v-show='showQrcode' @click='showQrcode = false'>
    <img src="../assets/img/wxQrcode.png" class="wxQrcode_image" alt="loadFailedImg"  @click.stop>
    <img src="../assets/img/wxRrcode_off.png" class="wxQrcode_off" alt="loadFailedImg"  @click='showQrcode = false'>
  </div>
</template>

<script>
  export default {
    name:'wxQrcode_vue',
    data() {
      return {
        showQrcode:false,
      }
    },
    mounted() {
      $('#wxQrcode_vue').css({'height': document.documentElement.clientHeight});
    },
    methods: {
      getStatus() {
        return this.showQrcode
      },
      setQrcode() {
        this.showQrcode = true;
      },
      closeQrcode() {
        this.showQrcode = false;     
      }
    }
  }
</script>

<style lang="scss">
  #wxQrcode_vue{
    width:100%;
    height:auto;
    overflow:hidden;
    background:rgba(0,0,0,0.4);
    position:fixed;
    z-index:999;
    left:0;top:0;
    img.wxQrcode_image{
      display:block;
      width:2.9rem;
      height:3.11rem;
      position:absolute;
      top:0.88rem;left:50%;
      margin-left:-1.45rem;
    }
    img.wxQrcode_off{
      display:block;
      width:0.48rem;
      height:0.48rem;
      position:absolute;
      top:4.24rem;left:50%;
      margin-left:-0.24rem;      
    }
  }
</style>
