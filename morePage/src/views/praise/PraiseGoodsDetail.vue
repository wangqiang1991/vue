<template>
  <div id="productInformation_Vue">
    <!--<header>
      <p>详细介绍</p>
    </header>-->
    <div id="content">
      <div class="banner">
        <mt-swipe :auto="4000">

          <mt-swipe-item v-for='n in banner' :key='n.keys'><img :src="n.images + '?imageView2/0/w/1024/h/1024|imageslim' " ></mt-swipe-item>

        </mt-swipe>
      </div>
      <div class="productTitle">
        <p class="productName">{{goods.title}}</p>
        <p @click="showMore" :class=" descriptionMore ? 'productContentShort' : 'productContentMore' "  style="padding-bottom:0.1rem;width:3.43rem;">{{goods.description}}</p>
      </div>
      <div class="productInformation" v-show="goods.article != null">
        <p class="detail_title" style="font-size:0.16rem;">详情介绍</p>
        <div>
          <article-content ref="articleContent" class="content" v-show="goods.article != null"></article-content>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import ArticleContent from '../../components/contentV2.vue';
  export default{
    name:'intr',
    components:{
      ArticleContent
    },
    data(){
      return{
        banner:[],
        goods:[],
        descriptionMore:true
      }
    },
    created (){
     document.title="点赞详情"
  },
  activated () {
      document.title="点赞详情";
  },
    mounted:function(){
      let goodsId = this.getParam("goodsid");
       this.http.get(this).url('/app/api/praise-goods/:goodsId').restful({goodsId:goodsId})
             .request((req) => {
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
             })
    },
    methods:{
      showMore(){
        this.descriptionMore = !this.descriptionMore;
      },
    }
  }

</script>

<style lang='scss'>
  @import '../../assets/scss/productInformation.scss';
  #productInformation_Vue #content {
    .banner{
      height:3.75rem;
    }
    .productName{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
