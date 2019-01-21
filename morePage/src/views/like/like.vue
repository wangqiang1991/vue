<template>
  <div id="like_Vue">
    <p>欢迎来到</p>
    <p>喜欢</p>
    <p>这里有您期望变为现实的产品</p>
    <p>您的愿望</p>
    <p>极大可能实现</p>
    <img src="../../assets/img/welcomeBanner.png" class="bannerImg"/>
    <p class="Ilike" @click="goLikeList">查看我的“喜欢”</p>
    <!--<img src="../../assets/img/off_btn2.png" class="cancel" @click="cancel"/>-->
  </div>
</template>
<script>
  
  export default {
    name: 'like',
    created() {
      document.title="我的喜欢"
    },
    data() {
      return {
        
      }
    },
    mounted: function () {
      localStorage.setItem('showWelPage',false);
//    console.log(showWelPage)
    },
    component: {

    },
    methods: {
//    cancel(){
//      this.keep.go('personal_center.html',false)
//    },
      goLikeList(){
        this.keep.go('/like_list.html',false)
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/like.scss';
</style>