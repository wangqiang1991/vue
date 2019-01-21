<template>
  <div id="bannerDetail_vue">
   <!--  <div id="loademoreimg" v-show="loading" class="loademoreimg" style="text-align: center; margin-top: 0.3rem">
      <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
    </div> -->
    <div class="main" v-show="!loading">
      <article-content ref="articleContent" class="content"></article-content>
    </div>
  </div>
</template>

<script>

import ArticleContent from '../../components/contentV2.vue'

export default{
  name:'contentDetail',
  created() {
    let title = this.getParam('title')
    document.title = title;
  },
  components: {
    ArticleContent
  },
  mounted() {
     var articleId = this.getParam("articleId");
     if (articleId) {
       this.loadDetail(articleId);
     }
  },
  data(){
    return{
      loading: false,
      banner: null
    }
  },
  methods: {
    loadDetail(articleId) {
      this.loading = true;
      this.http.get(this).url("/app/api/articles/detail/:articleId").restful({articleId:articleId})
      .request(
        (response) => {
          if (response.data.code != 0) {
            return;
          }
          var that = this;
          setTimeout(function() {
            that.loading = false;
          }, 500);
          this.article = response.data.data;
          this.$refs.articleContent.loadContent(this.article.articleId);
        },
        (err) => {

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
