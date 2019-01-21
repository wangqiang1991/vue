<template>
  <div id="bannerDetail_vue">
    <!-- <div id="loademoreimg" v-show="loading" class="loademoreimg" style="text-align: center; margin-top: 0.3rem">
      <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
    </div> -->
    <div class="main" v-show="!loading">
      <article-content ref="articleContent" class="content"></article-content>
    </div>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad'></firstLoad>
  </div>
</template>

<script>

import ArticleContent from '../../components/contentV2.vue'
import loadFailed from '../../components/loadFailed.vue';
import firstLoad from '../../components/firstLoad.vue';
export default{
  name:'bannerDetail',
  components: {
     loadFailed:loadFailed,
     firstLoad:firstLoad,
    ArticleContent
  },
  created (){
     document.title="活动详情"
  },
  activated () {
      document.title="活动详情";
  },
  mounted() {
    var that = this;
    // 监听内容详情里点击场景图的点击事件回调
    window.showScene = function(data) {
      that.keep.scroll.save();
      that.keep.go("/scene.html", true, {sceneId:data.sceneId,showGoHome:'1'});
    }

    window.receiveGoodsMessage = function(data) {
      that.keep.scroll.save();
      that.keep.go("/goods_detail.html", true, {goodsid: data.goodsId,showGoHome:'1'});
    }

    if (this.keep.isKeepAlive()) {
      this.firstLoad = false;
      this.keep.markNotKeepAlive();
      this.banner = this.keep.cache.get("banner-detail")
      this.$refs.articleContent.loadContent(this.banner.article.articleId);
      this.$nextTick(() => {
        setTimeout(() => {
          this.keep.scroll.recoverAndClear();
        }, 100);
      });
    } else {
      this.firstLoad = true;
      this.keep.cache.remove("banner-detail");
      var bannerId = this.getParam("bannerId");
      if (bannerId) {
       this.loadDetail(bannerId);
      }
    }
  },
  data(){
    return{
      firstLoad:false,
      loadFailed:false,
      loading: false,
      banner: null
    }
  },
  methods: {
    reload(){
      this.loadFailed = false;
      this.loadDetail(this.getParam("bannerId"));
    },
    loadDetail(bannerId) {
      this.loading = true;
      this.http.get(this).url(this.config.banner.url).restful({bannerId:bannerId})
      .request((response) => {
          this.firstLoad = false;
          if (response.data.code != 0) {
            return;
          }
          var that = this;
          setTimeout(function() {
            that.loading = false;
          }, 500);
          this.keep.cache.push("banner-detail", response.data.data)
          this.banner = response.data.data;
          this.$refs.articleContent.loadContent(this.banner.article.articleId);
        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
        });
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
