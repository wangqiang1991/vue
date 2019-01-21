<template>
  <div id="bannerDetail_vue">
   <!--  <div id="loademoreimg" v-show="loading" class="loademoreimg" style="text-align: center; margin-top: 0.3rem">
      <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
    </div> -->
    <div class="main" v-show="!loading">
      <article-content ref="articleContent" class="content"></article-content>
    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>

import ArticleContent from '../../components/contentV2.vue'
import firstLoad from '../../components/firstLoad.vue';
import loadFailed from '../../components/loadFailed.vue';

export default{
  name:'spaceIdDetail',
  components: {
    firstLoad:firstLoad,
    loadFailed:loadFailed,
    ArticleContent
  },
   created (){
     document.title="场景介绍"
  },
  mounted() {
     var spaceId = this.getParam("spaceId");
     if (spaceId) {
       this.loadDetail(spaceId);
     }
  },
  data(){
    return{
      firstLoad:true,
      loadFailed:false,
      loading: false,
      space: null
    }
  },
  methods: {
    reload() {
      this.loadFailed = false;
      var spaceId = this.getParam("spaceId");
     if (spaceId) {
       this.loadDetail(spaceId);
     }
    },
    loadDetail(spaceId) {
      this.loading = true;
      this.http.get(this).url("/app/api/space/article/:spaceId").restful({spaceId:spaceId}).request((response) => {
          this.firstLoad = false;
          if (response.data.code != 0) {
            return;
          }
          var that = this;
          setTimeout(function() {
            that.loading = false;
          }, 500);
          this.space = response.data.data;
          this.$refs.articleContent.loadContent(this.space.article.articleId);
        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
        }
      );
    }
  }

}
</script>

<style lang='scss'>
  @import '../../assets/scss/article.scss';
  #bannerDetail_vue{




    #loademoreimg{
      width:100%;
      height:auto;
      text-align:center;
    }
    .show{
      display:none;
    }
    .loademoreimg{
      display:block;
    }
    #loademoreimg span{
      display:block;
      margin:auto;
    }
    #loademoreimg span div{
      margin:auto;
       display: flex;
      align-items: center;
      height:0.5rem;
      width:0.6rem;
    }
    #loademoreimg p{
      color:#999;
      font-size:0.14rem;
      text-align:center;
    }
  }
</style>
