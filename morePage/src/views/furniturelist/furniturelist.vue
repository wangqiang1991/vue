<template>
  <div id="jiajullist_vue">
    <div class="box">
      <p class="title">热门头条</p>
      <div class="toutiao">
        <div class="swiper-container swiper-container-horizontal" id="swiper-container1">
            <div class="swiper-wrapper">

                <div class="swiper-slide"  v-for="subjectArticle in topSubjectArticles" >
                  <img v-lazy="subjectArticle.cover + '?imageView2/0/w/1024/h/568|imageslim'" @touchcancel='onCancel(subjectArticle)' @touchstart='onTouchstart(subjectArticle)' @touchend='onTouchend(subjectArticle)' :class="{'imgactive':subjectArticle.imgactive}">
                  <p>{{subjectArticle.data.description}}</p>
                </div>
            </div>
            <div class="swiper-pagination swiper-pagination-progress" id="swiper-pagination1">
              <span class="swiper-pagination-progressbar"></span>
            </div>

        </div>
        <div class="spaceArea"></div>
      </div>
      <p class="addTitle">新增</p>
      <div class="newadd">
        <div class="swiper-container swiper-container-horizontal" id="swiper-container2">
            <div class="swiper-wrapper">
              <div class="swiper-slide"  v-for="subject in newSubjectArticles" @touchcancel='onCancel(subject)' @touchstart='onTouchstart(subject)' @touchend='onTouchend(subject)' :class="{'sliderActive':subject.sliderActive}">
                <img v-lazy="subject.cover + '?imageView2/0/w/1024/h/568|imageslim'">
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-progress" id="swiper-pagination2">
              <span class="swiper-pagination-progressbar"></span>
            </div>

        </div>
      </div>
      <div class="spaceArea"></div>
      <p class="agoTitle">往期内容 <!-- <span>截止至2017年10月08日</span> --></p>
    </div>
     <div class="more" v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="20">
        <div v-for="subjectArticle in subjectArticles">
          <img v-lazy="subjectArticle.cover+ '?imageView2/0/w/1024/h/568|imageslim'" @touchcancel='onCancel(subjectArticle)' @touchstart='onTouchstart(subjectArticle)' @touchend='onTouchend(subjectArticle)' :class="{'imgactive':subjectArticle.imgactive}">
          <p>{{subjectArticle.description}}</p>
          <!-- <div>
            <p>把家变成森林</p>
          </div> -->
          <div style="border-bottom:1px solid #f2f2f2;width:3.43rem;"></div>
        </div>
      </div>
    <div id="loademoreimg" v-show='load'>
      <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
    </div>
    <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
  </div>
</template>

<script>
import loadFailed from '../../components/loadFailed.vue';
import swiper from 'swiper';
  export default {
    name:'jiajulist',
    components:{
      loadFailed:loadFailed
    },
    created(){
      document.title = '家居期刊'
    },

    data(){
      return{
        reloadflag:false,
        loadFailed:false,
        thisVueName:'jiajulist',
        subjectArticles: [],
        newSubjectArticles: [],
        topSubjectArticles: [],
        top:0,
        time:0,
        loading: false,
        load: false,
        noDatas: false,
        page: {
          pageIndex: 1,
          pageSize: 10
        }
      }
    },
    mounted:function(){
      if(this.keep.isKeepAlive()) {
        this.topSubjectArticles = this.keep.cache.get("topSubjectArticles");
        this.newSubjectArticles = this.keep.cache.get("newSubjectArticles");
        this.subjectArticles = this.keep.cache.get('subjectArticles');
        this.page.pageIndex = this.keep.cache.get('pageIndex');
        this.initLayer();
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
      this.keep.cache.remove("topSubjectArticles");
      this.keep.cache.remove("newSubjectArticles");
      this.keep.cache.remove("subjectArticles");
      this.keep.cache.remove("pageIndex");  
      this.loadTopHomes();
     // this.findByPage();
     }
    },
    methods: {
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      reload(){
        this.findByPage();
        this.loadFailed = false;
      },
      findByPage() {
        console.log(this.page.pageIndex)
        this.http.get(this).url("/app/api/subject").params(this.page).request(
          (response) => {
            
            var subjectArticles = response.data.data;
             console.log(subjectArticles)
             for(var i = 0;i < subjectArticles.length ;i++){
              subjectArticles[i].sliderActive = false;
              subjectArticles[i].imgactive = false;
             }
            if (this.page.pageIndex == 1) {
              this.newSubjectArticles = subjectArticles.slice(0, 4);
              this.keep.cache.push("newSubjectArticles", this.newSubjectArticles);
              subjectArticles.splice(0, 4);
              this.initLayer();
            }

            subjectArticles.forEach((item) => {
              this.subjectArticles.push(item);
            });

            if(subjectArticles.length == 0){
              this.loading = true;
              this.load = false;
            }else{
              this.page.pageIndex ++;
              this.loading = false;
              this.load = false;
            }
            this.keep.cache.push("subjectArticles", this.subjectArticles);
            this.keep.cache.push("pageIndex", this.page.pageIndex );
          },(err)=>{
            if(this.page.pageIndex == 1){
              this.loadFailed = true;
            }else{
              this.reloadflag = true;

            }
            this.load = false;
          }
        )
      },
      initLayer() {
        this.$nextTick(() => {
          new swiper('#swiper-container1',{
                pagination : '#swiper-pagination1',
                paginationType: 'progress',
                slidesPerView: 'auto',
                paginationClickable: true,
              //  spaceBetween: 10,
                observer:true,
//              initialSlide:0,
                observeParents:true
          });
          new swiper('#swiper-container2',{
                pagination : '#swiper-pagination2',
                paginationType: 'progress',
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 10,
                observer:true,
                //initialSlide:0,
                observeParents:true
          });
        });
      },
      loadMore() {
        this.loading = true;
        this.load = true ;
        this.findByPage();
      },
      loadTopHomes() {

       var homeData = this.keep.cache.get("home-top",null,'/index.html');
       console.log(homeData)
       for(var i=0;i<homeData.subjectArticles.length;i++){
            homeData.subjectArticles[i].sliderActive = false;
            homeData.subjectArticles[i].imgactive = false;
      }
       this.topSubjectArticles = homeData.subjectArticles;
       this.keep.cache.push("topSubjectArticles", this.topSubjectArticles);
       
      },

      //一级分类动画
      onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.topSubjectArticles.length;i++){
          this.topSubjectArticles[i].sliderActive = false;
          this.topSubjectArticles[i].imgactive = false;
        }
        for(var i = 0 ;i<this.newSubjectArticles.length;i++){
          this.newSubjectArticles[i].sliderActive = false;
          this.newSubjectArticles[i].imgactive = false;
        }
        for(var i = 0 ;i<this.subjectArticles.length;i++){
          this.subjectArticles[i].sliderActive = false;
          this.subjectArticles[i].imgactive = false;
        }
        e.sliderActive =true;
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onTouchend:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200  && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.sliderActive = false;
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          let subjectArticleId = e.subjectArticleId;
          if(subjectArticleId == undefined){
            subjectArticleId = e.data.subjectArticleId;
          }
          this.keep.go('/article.html',true,{subjectArticleId:subjectArticleId,showGoHome:'1'})
        })
        
       }else{
        e.sliderActive = false;
        e.imgactive = false;
       }
      },
    onCancel (e){
        e.sliderActive = false;
        e.imgactive = false;
    },

      toDetial(subjectArticle) {
        console.log(subjectArticle)
        this.keep.scroll.save();
        this.keep.go('/article.html',true,{subjectArticleId:subjectArticle.subjectArticleId,showGoHome:'1'})
      }
    }

  }

</script>


<style lang="scss">
  @import '../../assets/scss/jiajulist.scss';
</style>
<style media="screen">
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
 #reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }
</style>
