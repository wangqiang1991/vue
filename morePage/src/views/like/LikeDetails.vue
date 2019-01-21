<template>
  <div id="LikeDetails_Vue">

    <div class="detailBanner" style="background:#Fff;">
      <mt-swipe :auto="0">
        <mt-swipe-item v-for='n in banner' :key='n.keys'>
          <img :src="n.images + '?imageView2/0/w/1024/h/1024|imageslim'" >
        </mt-swipe-item>
      </mt-swipe>
    </div>

    <div class="contentBox">
    	<p class="title">{{goods.title}}</p>
    	<p class="contentProduce">{{goods.description}}</p>
    	<article-content ref="articleContent" class="content" v-show="goods.article != null"></article-content>
    </div>

    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad'></firstLoad>

  </div>
</template>
<script>
  import ArticleContent from '../../components/contentV2.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import firstLoad from '../../components/firstLoad.vue';

  export default {
    name: 'LikeDetails',
    components:{
     loadFailed:loadFailed,
     firstLoad:firstLoad,
      ArticleContent
    },
    created() {
      document.title="详情"
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        banner:[],
        goods:[]
      }
    },
    mounted: function () {
      this.loadData();
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.loadData();
      },
      loadData() {
       let goodsId = this.getParam("goodsid");
       this.http.get(this).url('/app/api/praise-goods/:goodsId').restful({goodsId:goodsId}).request((req) => {
          this.firstLoad = false;
          let data= req.data.data;
          console.log(data)
          var banner = data.banner.split(',');
          for(var i = 0 ;i<banner.length;i++){
              var obj = {};
              obj.keys = i;
              obj.images = banner[i];
              this.banner.push(obj);
          }
          this.goods = data;
          if(data.article != null){
            this.$refs.articleContent.loadContent(data.article.articleId);
          }
         },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
         }) 
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/LikeDetails.scss';
</style>