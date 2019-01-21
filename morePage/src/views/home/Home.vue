<template>
  <div id="home_vue">
    <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader :showAppTip = "showAppTip" :class="{'showAppTip1':showAppTip}"></Vheader>
    <div id="content" :class="{'showAppTip2':showAppTip}">
    <div class="banner">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="banner in data.banners" :key='banner.keys'>
          <img @click="gotoByParams('/banner_detail.html', {bannerId:banner.bannerId})" :src="banner.cover + '?imageView2/0/w/1124/h/383|imageslim' " :alt="banner.title">
        </mt-swipe-item>
      </mt-swipe>
    </div>


    <div class="goods">
      <div class="title">
        <h4>家居品类</h4>
        <img src="../../assets/img/blueRight.png"/>
        <p class="more" @click="findall('category2')">查看更多</p>
      </div>
      <div class="goodsImg">
        <div class="swiper-container" id="swiper-container">
            <div class="swiper-wrapper">
                <div  v-for="category in data.categories" class="swiper-slide"  @touchcancel='onCancel(category)' @touchstart='onTouchstart(category)' @touchend='onTouchend(category)'>
                  <img :src="category.image + '?imageView2/0/w/500/h/500|imageslim' " :class="{'imgactive':category.imgactive}">
                  <span>{{category.name}}</span>
                </div>
            </div>
        </div>
      </div>
    </div>

    <div style="width:100%; height:9px; background:#F2F2F2">
    </div>

    <div class="goods" style="padding-bottom: 0.1rem;">
      <div class="title">
        <h4>家居场景</h4>
        <img src="../../assets/img/blueRight.png"/>
        <p class="more" @click="findall('furniture_scene')">查看更多</p>
      </div>

      <div class="cwImg">
        <div v-if="data.spaces.length >= 3" class="left"  @touchcancel='onCancel(data.spaces[0])' @touchstart='onWindowTouchstart(data.spaces[0])' @touchend='onWindowTouchend(data.spaces[0])'>
          <img v-lazy="data.spaces[0].cover + '?imageView2/0/w/1024/h/1024|imageslim'" :class="{'imgactive':data.spaces[0].imgactive}">
        </div>
        <div v-if="data.spaces.length >= 3" class="right">
          <div  @touchcancel='onCancel(data.spaces[1])' @touchstart='onWindowTouchstart(data.spaces[1])' @touchend='onWindowTouchend(data.spaces[1])'>
            <img v-lazy="data.spaces[1].cover + '?imageView2/0/w/1024/h/568|imageslim'" :class="{'imgactive':data.spaces[1].imgactive}">
          </div>
          <div v-if="data.spaces.length >= 3"  @touchcancel='onCancel(data.spaces[2])' @touchstart='onWindowTouchstart(data.spaces[2])' @touchend='onWindowTouchend(data.spaces[2])'>
            <img v-lazy="data.spaces[2].cover + '?imageView2/0/w/1024/h/568|imageslim'" :class="{'imgactive':data.spaces[2].imgactive}">
          </div>
        </div>

        <div v-if="data.spaces.length >= 6" class="right" style="margin-left:0;margin-right:0.13rem;">
          <div  @touchcancel='onCancel(data.spaces[3])' @touchstart='onWindowTouchstart(data.spaces[3])' @touchend='onWindowTouchend(data.spaces[3])'>
            <img v-lazy="data.spaces[3].cover + '?imageView2/0/w/1024/h/568|imageslim'" :class="{'imgactive':data.spaces[3].imgactive}">
          </div>
          <div v-if="data.spaces.length >= 6"  @touchcancel='onCancel(data.spaces[4])' @touchstart='onWindowTouchstart(data.spaces[4])' @touchend='onWindowTouchend(data.spaces[4])'>
            <img v-lazy="data.spaces[4].cover + '?imageView2/0/w/1024/h/568|imageslim'" :class="{'imgactive':data.spaces[4].imgactive}">
          </div>
        </div>
         <div v-if="data.spaces.length >= 6" class="left" @touchcancel='onCancel(data.spaces[5])' @touchstart='onWindowTouchstart(data.spaces[5])' @touchend='onWindowTouchend(data.spaces[5])'>
          <img v-lazy="data.spaces[5].cover + '?imageView2/0/w/1024/h/1024|imageslim'" :class="{'imgactive':data.spaces[5].imgactive}">
        </div>


        <div v-if="data.spaces.length >= 9" class="left" @touchcancel='onCancel(data.spaces[6])' @touchstart='onWindowTouchstart(data.spaces[6])' @touchend='onWindowTouchend(data.spaces[6])'>
          <img v-lazy="data.spaces[6].cover + '?imageView2/0/w/1024/h/1024|imageslim'" :class="{'imgactive':data.spaces[6].imgactive}">
        </div>
        <div v-if="data.spaces.length >= 9" class="right">
          <div @touchcancel='onCancel(data.spaces[7])' @touchstart='onWindowTouchstart(data.spaces[7])' @touchend='onWindowTouchend(data.spaces[7])'>
            <img v-lazy="data.spaces[7].cover + '?imageView2/0/w/1024/h/568|imageslim'" :class="{'imgactive':data.spaces[7].imgactive}">
          </div>
          <div v-if="data.spaces.length >= 9" @touchcancel='onCancel(data.spaces[8])' @touchstart='onWindowTouchstart(data.spaces[8])' @touchend='onWindowTouchend(data.spaces[8])'>
            <img v-lazy="data.spaces[8].cover + '?imageView2/0/w/1024/h/568|imageslim'" :class="{'imgactive':data.spaces[8].imgactive}">
          </div>
        </div>

      </div>
    </div>

    <div style="width:100%; height:9px; background:#F2F2F2">
    </div>

    <div class="goods">
      <div class="title">
        <h4>家居期刊</h4>
        <img src="../../assets/img/blueRight.png"/>
        <p class="more" @click="findall('furniturelist')">查看更多</p>
      </div>
      <div class="jjImg">
        <div class="swiper-container swiper-container-horizontal" id="swiper-container1">
            <div class="swiper-wrapper">
              <div v-for="subjectArticle in data.subjectArticles" class="swiper-slide" @touchcancel='onCancel(subjectArticle)' @touchstart='onJJTouchstart(subjectArticle)' @touchend='onJJTouchend(subjectArticle)'>
                <img v-lazy="subjectArticle.cover + '?imageView2/0/w/1024/h/568|imageslim'" :alt="subjectArticle.data.title" :class="{'imgactive':subjectArticle.imgactive}">
                <p>{{subjectArticle.data.description}}</p>
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-progress" id="swiper-pagination1">
              <span class="swiper-pagination-progressbar"></span>
            </div>

        </div>
      </div>
    </div>

    <div style="width:100%; height:9px; background:#F2F2F2">
    </div>


		<div class="goods" style="padding-bottom: 10px">
			<div class="title">
				<h4>家居定制</h4>
				<img src="../../assets/img/blueRight.png"/>
				<p class="more" @click="keep.scroll.save();keep.go('/home_sceneList.html', true, null, true)">查看更多</p>
			</div>
			<div class="jzImg"
			  style="padding-bottom: 0px">
				<div v-for="scenePicture in data.scenePictures"  :class="{'imgactive':scenePicture.imgactive}" @touchcancel='onCancel(scenePicture)' @touchstart='onPictureTouchstart(scenePicture)' @touchend='onPictureTouchend(scenePicture)'>
					<img v-lazy="scenePicture.cover + '?imageView2/0/w/512/h/512|imageslim'">
					<div>
						<p>
							<span>{{scenePicture.detail.name}}</span>
							<span class="biaoqian"><img src="../../assets/img/biaoqian.png" alt="标签">
								{{scenePicture.detail.goodsCount + scenePicture.detail.praiseCount}}
							</span>
						</p>
					</div>
				</div>
			</div>


    </div>

    <div style="width:100%; height:9px; background:#F2F2F2">
    </div>


		<div class="goods recommend"
			v-infinite-scroll="loadMore"
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="50">
			<template v-for="recommend in recommends">
				<!-- 1 => 场景图 -->
				<div v-if="recommend.type == 1" class="recommendimg"  @touchcancel='onCancel(recommend)' @touchstart='onPictureTouchstart(recommend)' @touchend='onPictureTouchend(recommend)' >
          <h4 class="recommendtitle">精选场景
              <span>推荐</span>
          </h4>
					<div  :class="{'imgactive':recommend.imgactive}">
              <img class="recommendsceneing" v-lazy="recommend.cover + '?imageView2/0/w/1024/h/1024|imageslim'">
              <div class="bottomArea">
                <span id="length">{{recommend.detail.name}}</span>
                <img src="../../assets/img/biaoqian.png"/>
                <span>{{recommend.detail.goodsCount}}</span>
              </div>
          </div>
				</div>
				<!-- 4 => 商品 -->
				<div v-if="recommend.type == 4">
        <h4 class="recommendtitle">精选好货
          <span>推荐</span>
        </h4>
					<div class="goodsdiv">
              <div>
                <img style="height:100%;"  @touchcancel='onCancel(recommend)' @touchstart='onGoodsTouchstart(recommend)' @touchend='onGoodsTouchend(recommend)' v-lazy="recommend.cover + '?imageView2/0/w/1024/h/1024|imageslim'" :class="{'imgactive':recommend.imgactive}">
              </div>
               <div>
                <div>
                   <p class="goodstitle">{{recommend.object.title}}</p>
                   <p style="color:#333333" class="goodsprice">￥{{recommend.object.minPrice}}</p>
                </div>
                 <div>
                   <p class="goodsshop" @click="gotogoods(recommend.object.goodsId)">立即购买</p>
                 </div>
               </div>
          </div>
				</div>

				<!-- 3 => 专题 -->
				<div v-if="recommend.type == 3">
          <h4 class="recommendtitle">精选期刊
            <span>推荐</span>
          </h4>
          <div @touchcancel='onCancel(recommend)' @touchstart='onJJTouchstart(recommend)' @touchend='onJJTouchend(recommend)' :class="{'imgactive':recommend.imgactive}">
            <img v-lazy="recommend.cover + '?imageView2/0/w/1024/h/568|imageslim'">
          </div>
					<p>{{recommend.object.description}}</p>
				</div>


        <div style="width:100%; height:0.1rem; background:#F2F2F2;padding:0;">
        </div>

      </template>
      <div id="loademoreimg" v-show='noRecommends' style="padding:0;">
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>
      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

    </div>
    </div>
    <Vmenu thisChoice='gc'></Vmenu>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
   <!--  <div style="position: fixed; bottom:50px; right:20px; z-index:999">
      <button @click="goBaidu" type="button" name="button">百度</button>
      <button @click="mark" type="button" name="button">存储位置</button>
    </div> -->
  </div>
</template>

<script>
import Header from '../../components/Header.vue';
import Menu from '../../components/Menu.vue';
import swiper from 'swiper';
import {getUser} from '../../commons/tools';
import axios from 'axios';
import loadFailed from '../../components/loadFailed.vue';
import downLoadApp from '../../components/tipDownLoadApp.vue';
export default {
  name: 'home',
  components: {
     Vheader: Header,
     Vmenu: Menu,
     loadFailed:loadFailed,
     VdownLoadApp:downLoadApp
  },
  created (){
     document.title="构巢微商城"
  },
  activated () {
    document.title="构巢微商城";
  },

  mounted:function () {

    if (this.getCookie("showAppTip") == "false") {
      this.showAppTip = false;
    }


    if (this.keep.isKeepAlive()) {
      this.data = this.keep.cache.get("home-top", {spaces: []});
      //console.log(this.data)
      if(this.data.spaces.length == 0){
        this.loadData();
      }
      this.initLayer();
      // 读缓存
      this.recommends = this.keep.cache.get("home-recommends", []);
      this.page.pageIndex = this.keep.cache.get("home-recommends-pageIndex", 1);
      this.page.pageSize = this.keep.cache.get("home-recommends-pageSize", 10);
      // 标记不keep-alive
      this.keep.markNotKeepAlive();
      this.$nextTick(() => {
        this.keep.scroll.recoverAndClear();
      });
    } else {
      // 删除缓存
      this.keep.cache.remove("home-recommends");
      this.keep.cache.remove("home-recommends-pageIndex");
      this.keep.cache.remove("home-recommends-pageSize");
      this.keep.cache.remove("home-top");
      this.loadData();
    }


    this.trackLogin();
  },

  data () {
    return {
      showAppTip:true,
      reloadflag:false,
      thisVueName:'home',
      loadFailed:false,
      loading: false,
      noRecommends: false,
      data: {spaces: []},
      recommends: [],
      pictureData:[],
      number:0,
      recommendsNumber:0,
      top:0,
      time:0,
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    closeTip(data){
      if(!data){
        this.showAppTip = false;
      }
    },
    reloadData(){
      this.loading = false;
      this.reloadflag = false;
      //.loadRecommends();
    },
    reload (){
      //console.log('----------------------++++')
      this.loading = false;
      this.loadFailed = false;
      this.loadData();   
      //this.loadRecommends();
    },
    findall:function(page){
      //this.keep.go("");
      //this.keep.markKeepAlive();
      this.keep.scroll.save();
      this.keep.go("/"+page+".html");
    },
    gobanner (bannerid){
      this.keep.scroll.save();
      this.keep.go("/article.html",true,{bannerid:bannerid,showGoHome:'1'});
    },

//分类的动画
    gocategory:function(e){
      this.keep.scroll.save();
      this.keep.go("/goods_list2.html",true,{firstCategoryId:e.categoryId});
    },
    onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.data.categories.length;i++){
          this.data.categories[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onTouchend:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          this.keep.go("/goods_list2.html",true,{firstCategoryId:e.categoryId});
        })

       }else{
        e.imgactive = false;
       }
      },
    onCancel (e){
        e.imgactive = false;
    },

//商品橱窗的动画
    goshopwindowdetail (e){
      console.log(e)
      this.keep.scroll.save();
      this.keep.go("/shopwindowdetail2.html",true,{spaceId:e.objectId,cover:e.cover,showGoHome:'1',source:"index"});
    },
    onWindowTouchstart (e){
        var top =  window.event.changedTouches[0].clientY
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.data.spaces.length;i++){
          this.data.spaces[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onWindowTouchend:function(e){
      var top =  window.event.changedTouches[0].clientY
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
      this.keep.go("/shopwindowdetail2.html",true,{spaceId:e.objectId,showGoHome:'1',cover:e.cover,source:"index"});
        })

       }else{
        e.imgactive = false;
       }
      },


//进入商品详情
    gotogoods:function(goodsid){
      this.keep.scroll.save();
      this.keep.go("/goods_detail.html",true,{goodsid:goodsid,showGoHome:'1'});
    },
    onGoodsTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0;i<this.recommends.length;i++){
              this.recommends.imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onGoodsTouchend:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          console.log(e)
          this.keep.go("/goods_detail.html",true,{goodsid:e.object.goodsId,showGoHome:'1'});
        })

       }else{
        e.imgactive = false;
       }
      },

//家具指南动画
    goarticle:function(subjectArticleId){
      this.keep.scroll.save();
      this.keep.go("/article.html",true,{subjectArticleId:subjectArticleId,showGoHome:'1'});
    },
    onJJTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        if(e.object != undefined){
            for(var i = 0;i<this.recommends.length;i++){
              this.recommends.imgactive = false;
            }
        }else{
          for(var i = 0 ;i<this.data.subjectArticles.length;i++){
          this.data.subjectArticles[i].imgactive = false;
         }
        }

        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onJJTouchend:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          if(e.object != undefined){
          this.keep.go("/article.html",true,{subjectArticleId:e.object.subjectArticleId,showGoHome:'1'});
          }else{
          this.keep.go("/article.html",true,{subjectArticleId:e.data.subjectArticleId,showGoHome:'1'});
          }
        })

       }else{
        e.imgactive = false;
       }
      },





 //场景图动画
		gotoByParams(path, params) {
			//this.$router.push({path: "/" + path,  query:params});
      this.keep.scroll.save();
      this.keep.go(path, true, params);
		},
    onPictureTouchstart (e){
        var top =  window.event.changedTouches[0].clientY
        this.top = top;
        this.time = 0;


          for(var i = 0;i<this.recommends.length;i++){
            this.recommends.imgactive = false;
          }

           for(var i = 0 ;i<this.data.scenePictures.length;i++){
          this.data.scenePictures[i].imgactive = false;

        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onPictureTouchend:function(e){
      var top =  window.event.changedTouches[0].clientY
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          console.log(e ,e.pageIndex)
          this.keep.go("/newscene.html",true,{sceneId:e.detail.sceneId,type:2,number:e.number,pageIndex:this.page.pageIndex-1});


        })

       }else{
        e.imgactive = false;
       }
      },


		loadMore() {
			console.log("loading more recommends");
      //alert('loadingMore')
      this.loading = true;
      this.noRecommends = true;
			this.loadRecommends();
	  },
		loadData() {
			this.http.get(this).url("/app/api/home").request(
				(response) => {
          console.log(response)
					if (response.data.code != 0) {
						return;
					}
          var data = response.data.data;
          console.log('========================')
          console.log(data.categories)
          for(var i = 0;i<data.categories.length;i++){
            data.categories[i].imgactive = false;
          }
          for(var i = 0;i<data.spaces.length;i++){
            data.spaces[i].imgactive = false;
          }
          for(var i = 0;i<data.subjectArticles.length;i++){
            data.subjectArticles[i].imgactive = false;
          }
          for(var i = 0;i<data.scenePictures.length;i++){
            data.scenePictures[i].imgactive = false;
            data.scenePictures[i].number = this.number;
            data.scenePictures[i].pageIndex = 1;
            this.number++;
            this.pictureData.push(data.scenePictures[i])
          }
          // 缓存首页指定数据
          this.keep.cache.push("pictureData", this.pictureData);
          this.keep.cache.push("home-top", response.data.data);
					this.data = response.data.data;
					this.initLayer();
				},(err) =>{
          console.log(err,'++++++++++++++++++++++++++');
          this.loadFailed = true;
        }
			)
		},
		loadRecommends() {
			this.http.get(this).url("/app/api/home/recommends").params(this.page).request(
				(response) => {
					this.noRecommends = false;
          this.reloadflag = false;
					if (response.data.code != 0) {
            //this.showError(response.data.message)
						return;
					}
					var recommends = response.data.data;
          if (recommends.length == 0) {
            this.loading = true;
            return;
          }else{
            this.loading = false;
          }
          for(var i=0;i<recommends.length;i++){
            recommends[i].imgactive = false;
            recommends[i].pageIndex = this.page.pageIndex;
            if(recommends[i].type == 1){
              recommends[i].number = this.number;
              this.number++;
              this.pictureData.push(recommends[i])
            }
          }
					recommends.forEach((item) => {
						this.recommends.push(item);
					});
					this.page.pageIndex ++;
          // 缓存首页推荐数据和分页数据

          this.keep.cache.push("pictureData", this.pictureData);
          this.keep.cache.push("home-recommends", this.recommends);
          this.keep.cache.push("home-recommends-pageIndex", this.page.pageIndex);
          this.keep.cache.push("home-recommends-pageSize", this.page.pageSize);
				},
				(err) => {
					console.log(err);
					//this.showError("服务器繁忙")
					this.loading = true;
          this.noRecommends = false;
          if(this.page.pageIndex == 1){
             this.loadFailed = true;
          }else{
            this.reloadflag = true;
          }
         
				},
        (response) => {
				  //this.showError(response.data.message);
				  this.loading = true;
        }
			)
		},
		initLayer() {
			this.$nextTick(() => {
			var myswiper1 = new swiper('#swiper-container', {
		        slidesPerView: 'auto',
		        paginationClickable: true,
//		        spaceBetween: 10,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
		    });


				new	swiper('#swiper-container1',{
				  pagination : '#swiper-pagination1',
		      paginationType: 'progress',
				  slidesPerView: 'auto',
//				  centeredSlides:true,
		      paginationClickable: true,
//		      spaceBetween: 10,
          observer:true,
          observeParents:true
			  });
			});
		},
    mark() {
      // 成为keep-alive模式,下次加载不刷新
      this.keep.markKeepAlive();
      // 保存当前滚动位置,下次刷新恢复该位置
      this.keep.scroll.save();
    },
    goBaidu() {
      window.location.href='https://www.baidu.com';
    },
    trackLogin() {
      var access_token = getUser('access_token');
      if (!access_token) {
        return;
      }
      axios.head('/app/api/member/track', {
        headers: {
          access_token: access_token
        }
      }).then(()=>{})
    }
  }
}
</script>

<style lang="scss">

	@import '../../assets/scss/home.scss';

	#home_vue .banner .mint-swipe-indicators {
	    bottom: 3px;
	    font-size: 10px;
	}
 #home_vue{
  .showAppTip1{
    top:0.5rem !important;
  }
  .showAppTip2{
    top:1rem !important;
  }
 } 
#length{
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap; 
			width: 80%;
			text-align: center;
}
</style>
