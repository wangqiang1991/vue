<template>
  <div id="downLoadApp_vue" v-show = "showAppTip">
    <img src="../assets//img/closeDownLoad.png" class="close" @click = "close()">
    <img src="../assets/img/downLoadAppBg1.png" class="bg" @click = "gotoDown()">
    <img src="../assets/img/downLoadApp.png" class="goto" @click = "gotoDown()">
  </div>
</template>

<script>

import {setCookie , getCookie} from '../commons/tools';

export default{
  name:"tipDownLoadApp",
  data(){
    return {
       showAppTip:true     
    }
  },
  mounted(){
   
  },
  methods:{
    close() {
      setCookie("showAppTip",false,7);
      this.showAppTip = false;
      this.$emit("showAppTip",false);
    },
    gotoDown() {
      let u = navigator.userAgent;
       if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
          window.location.href =  "https://itunes.apple.com/app/id1355616191";
       }else if ( u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
          window.location.href =  "http://a.app.qq.com/o/simple.jsp?pkgname=com.hande.goochao";
       }
    }
  }
} 

</script>

<style lang='scss'>
  
  #downLoadApp_vue{
    width:100%;
    height:0.5rem;
    position:fixed;
    top:0;left:0;
    z-index:999;
    .bg{
      display:block;
      width:100%;
      height:100%;
    }
    .close{
      display:block;
      width:0.2rem;
      height:0.2rem;
      position:absolute;
      padding:0.1rem;
      top:0.05rem; left:0;
    }
    .goto{
      display:block;
      height:0.25rem;
      padding:0.05rem;
      width:0.6rem;
      position:absolute;
      top:0.075rem;
      right:0.05rem;
    }
  }

</style>