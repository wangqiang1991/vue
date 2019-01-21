<template>
  <div id="home_vue">
    <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader :showAppTip = "showAppTip" :class="{'showAppTip1':showAppTip}"></Vheader>
    <div id="content" :class="{'showAppTip2':showAppTip}">

       <!-- 营销活动banner -->
      <div class="banner">
        <mt-swipe :auto="4000">
          <mt-swipe-item v-for="banner in data.banners" :key='banner.keys'>
            <img @click="bannerClickTime(banner)" :src="banner.cover + '?imageView2/0/w/1024/h/546|imageslim' " :alt="banner.title">
          </mt-swipe-item>
        </mt-swipe>
      </div>

      <!-- category类别选择 -->
      <ul class="category">
          <li> <img src="../../assets/img/new_icon_design.png" alt=""><p>匠心设计</p> </li>
          <li> <img src="../../assets/img/new_icon_soft.png" alt=""><p>精致软装</p> </li>
          <li> <img src="../../assets/img/new_icon_environmental.png" alt=""><p>绿色环保</p> </li>
          <li> <img src="../../assets/img/new_icon_after_sales.png" alt=""><p>无忧售后</p> </li>
      </ul>
       
      
      <div class="hotGoods" v-if="data.goodsArr && data.goodsArr.length">
        <p class="title">
          <b>人气热卖</b>
          <img src="../../assets/img/icon_hot.png" >
        </p>
        <div class="goods_home_box">
          <mt-swipe :auto="4000">
            <mt-swipe-item v-for="goods in data.goodsArr" :key='goods.objectId'>
               <div class="goodsBox" @click='toGoodsDetail(goods.detail.goodsId)'>
                 <img :src="goods.detail.cover + '?imageView2/0/w/320/h/320|imageslim' " alt="商品封面图">
                 <div>

                   <p class="title1" style="font-weight:700;">{{goods.detail.title}}</p>
                   <p class="desc">{{goods.detail.description}}</p>

                   <span class="goods_price" v-show="!goods.detail.discountType" style="font-weight:700;color:#f75151;">¥{{goods.detail.minPrice}}</span>
                   <div class="goods_discount" v-show="goods.detail.discountType == 2">
                     <p style="color:#f75151;">¥{{goods.detail.discountPrice}}  <span>¥{{goods.detail.minPrice}}</span></p> 
                     <!-- <div class="goods_tag">{{goods.detail.discountTag}}</div> -->
                   </div>
                   <div class="goods_amount" v-show="goods.detail.discountType == 3">
                     <p style="color:#f75151;">¥{{goods.detail.minPrice}}</p> 
                     <!-- <div class="goods_tag">{{goods.detail.discountTag}}</div> -->
                   </div>

                 </div>
               </div> 
            </mt-swipe-item>
          </mt-swipe>          
        </div>

      </div>

      <!-- 软装案例 -->
      <div class="home_plan_box" v-if="data.plans.length">
        <p class="space_title">
          <b>软装案例</b>
          <img src="../../assets/img/new_btn_more.png" @click="gotoFind(3)">
        </p>

        <div class="jjImg" style="margin-bottom:0.15rem;">

          <div class="swiper-container swiper-container-horizontal" id="swiper-container2">
            <div class="swiper-wrapper">
              <div v-for="plan in data.plans" class="swiper-slide">

                <div class="spaceImage" @click="gotoPlanDetail(plan)" >
                  <div class="plan_image_box">
                    <img class="space_cover" v-lazy="plan.cover + '?imageView2/0/w/1024/h/963|imageslim'">
                  </div>
                  <div class="icon_layout">
                    <span>{{plan.detail.planName}}</span>
                    <p>{{plan.detail.houseTypeName}} &nbsp  |  &nbsp {{plan.detail.style.name}}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>

        <p style="width:100%;height:0.12rem;background:#F6F6F6;"></p>
      </div>

       <!-- 空间搭配 -->
      <div class="space" style="padding-top:0.25rem;" v-if="data.spaces.length">
        <p class="space_title">
          <b>空间搭配</b>
          <img src="../../assets/img/new_btn_more.png" @click="gotoFind(1)">
        </p>

        <div class="jjImg">

          <div class="swiper-container swiper-container-horizontal" id="swiper-container1">
            <div class="swiper-wrapper">
              <div v-for="space in data.spaces" class="swiper-slide">

                <div class="spaceImage" @click="gotoSpaceDetail(space,0)" >
                  <img class="space_cover" v-lazy="space.cover + '?imageView2/0/w/1024/h/611|imageslim'">
                  <div class="icon_layout">
                    <span>{{space.detail.goodsCount}}</span>
                    <img src="../../assets/img/new_icon_tag_white_line.png" class="icon">
                  </div>
                </div>

              </div>
            </div>
          </div>

          <p class="design_recommend" v-show="isSpace">—— 设计师推荐搭配 ——</p>

          <div class="design_recommend_box" >

            <div class="praise_goods_layout" v-show="isSpace">
              <div class="praise_goods" v-for="goods in currentSpace.data" @click="gotoGoods(goods)">
              <!--  @touchstart='onTouchstart(goods,currentSpace.data)' @touchend='onTouchend(goods,5)' @touchcancel='onCancel(goods)' :class="{'imgactive':goods.imgactive}"> -->
                 <img :src="goods.cover + '?imageView2/0/w/320/h/320|imageslim'" :class="{'imgactive':goods.imgactive}">
                 <div class="goods_message">
                   <p class="title1" style="font-weight:700;">{{goods.title}}</p>
                   <p class="desc">{{goods.description}}</p>

                   <span class="goods_price" v-show="!goods.discountType" style="font-weight:700;">¥{{goods.minPrice}}</span>
                   <div class="goods_discount" v-show="goods.discountType == 2">
                     <p>¥{{goods.discountPrice}}  <span>¥{{goods.minPrice}}</span></p> 
                     <div class="goods_tag">{{goods.discountTag}}</div>
                   </div>
                   <div class="goods_amount" v-show="goods.discountType == 3">
                     <p>¥{{goods.minPrice}}</p> 
                     <div class="goods_tag">{{goods.discountTag}}</div>
                   </div>

                 </div>
              </div>
            </div>

            <p v-show="isSpace" class="goods_learnMore" @click="gotoSpaceDetail(currentSpace,1)"> <span>组合陈列</span> <img src="../../assets/img/new_btn_more.png"> </p>

          </div>

        </div>

      </div>

      <!-- 积攒优选 -->
      <div class="praise_goods_box" style="padding-top:0.2rem;" v-if="data.scenePraiseGoods.length == 3">
        <p class="space_title">
          <b>集赞优选</b>
          <img src="../../assets/img/new_btn_more.png" @click="gotoFind(2)">
        </p>
        <div class="praise_goods_content" v-if="data.scenePraiseGoods.length == 3">
          <div class="left" @click="gotoScene(data.scenePraiseGoods[0].detail.scenePicture.sceneId)">
            <img :src="data.scenePraiseGoods[0].cover + '?imageView2/0/w/640/h/640|imageslim'" >
            <p>{{data.scenePraiseGoods[0].detail.title}}</p>
          </div>
          <div class="right">
              <div @click="gotoScene(data.scenePraiseGoods[1].detail.scenePicture.sceneId)">
                <img :src="data.scenePraiseGoods[1].cover + '?imageView2/0/w/640/h/640|imageslim'" >
                <p>{{data.scenePraiseGoods[1].detail.title}}</p>
              </div>
              <div @click="gotoScene(data.scenePraiseGoods[2].detail.scenePicture.sceneId)">
                <img :src="data.scenePraiseGoods[2].cover + '?imageView2/0/w/640/h/640|imageslim'" >
                <p>{{data.scenePraiseGoods[2].detail.title}}</p>
              </div>
          </div>
        </div>
      </div>

       <!-- 期刊 -->
      <div class="subject" v-for="subject in data.subjectArticles" >
        <div @click="gotoSubject(subject)">
       <!--  @touchstart='onTouchstart(subject,data.subjectArticles)' @touchend='onTouchend(subject,2)' @touchcancel='onCancel(subject)' :class="{'imgactive':subject.imgactive}"> -->
          <img v-lazy="subject.cover + '?imageView2/0/w/1024/h/520|imageslim'">
          <span>{{subject.data.typeName}}</span>
        </div>
        <p class="line"></p>
      </div>

      <!-- 好货推荐 -->
  		<div class="goods recommend"
  			v-infinite-scroll="loadMore"
  			infinite-scroll-disabled="loading"
  			infinite-scroll-distance="50">
        <p class="recommend_title"> <span style="font-weight:700;">精选推荐</span> <img src="../../assets/img/new_icon_recommend.png"></p>
  			<template v-for="recommend in recommends">

  				<!-- 1 => 场景图 -->
  				<div v-if="recommend.type == 1" class="recommendimg">

  					<div @click="gotoScene1(recommend)">
           <!--  :class="{'imgactive':recommend.imgactive}"  @touchstart='onTouchstart(recommend,recommends)' @touchend='onTouchend(recommend,3)' @touchcancel='onCancel(recommend)'> -->
                <img class="recommendsceneing" v-lazy="recommend.cover + '?imageView2/0/w/640/h/640|imageslim'" >
                <!-- <div class="bottomArea">
                  <span class="length">{{recommend.detail.name}}</span>
                  <img src="../../assets/img/new_icon_tag_white_line.png"/>
                  <span>{{recommend.detail.goodsCount}}</span>
                </div> -->
                <img src="../../assets/img/new_icon_img.png" class="icon_type">
            </div>
  				</div>
  				<!-- 4 => 商品 -->
  				<div v-if="recommend.type == 4">

  					<div class="goodsdiv">
                <div @click="gotoGoods(recommend)">
                  <img style="height:100%;"  v-lazy="recommend.cover + '?imageView2/0/w/640/h/640|imageslim'" >
                 <!--   @touchstart='onTouchstart(recommend,recommends)' @touchend='onTouchend(recommend,4)' @touchcancel='onCancel(recommend)' :class="{'imgactive':recommend.imgactive}"> -->
                </div>
                 <div>
                  <div>
                     <p class="goodstitle">{{recommend.object.title}}</p>

                     <p style="color:#333333;padding-top:0.02rem;" class="goodsprice" v-show="!recommend.object.discountType">¥{{recommend.object.minPrice}}</p>

                     <div class="goods_discount" v-show="recommend.object.discountType == 2">
                         <p>¥{{recommend.object.discountPrice}}  
                          <span class="goods_discountPrice">¥{{recommend.object.minPrice}}</span>
                          <span class="goods_tag">{{recommend.object.discountTag}}</span>
                       </p> 
                     </div>
                     
                     <div class="goods_amount" v-show="recommend.object.discountType == 3">
                       <p>¥{{recommend.object.minPrice}} <span class="goods_tag">{{recommend.object.discountTag}}</span></p> 
                     </div>

                  </div>
                   <div>
                     <p class="goodsshop" @click="gotogoods(recommend.object.goodsId)" style="font-weight:700;">立即购买</p>
                   </div>
                 </div>
            </div>
  				</div>

  				<!-- 3 => 专题 -->
  				<div v-if="recommend.type == 3" class="subject">

            <div style="margin:0;" @click="gotoSubject(recommend)">
            <!--  @touchstart='onTouchstart(recommend,recommends)' @touchend='onTouchend(recommend,2)' @touchcancel='onCancel(recommend)' :class="{'imgactive':recommend.imgactive}"> -->
              <img v-lazy="recommend.cover + '?imageView2/0/w/1024/h/520|imageslim'">
               <span>{{recommend.object.typeName}}</span>
            </div>

  				</div>

          <p v-if="recommend.type == 4" style="width:3.35rem;height:1px;background:#CACACA;margin:auto;"></p>
          <div v-else style="width:100%;padding:0; height:0.12rem; background:#F6F6F6;">
          </div>

        </template>

        <div id="loademoreimg" v-show='noRecommends' style="padding:0;">
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

        <div id="reload" v-show='reloadflag' @click='reloadData()'>
            加载失败,点击重新加载
        </div>

        <div v-show="noMoreData" style="width:100%;background:white;padding:0.2rem 0;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
        </div>

      </div>


    </div>

    <!-- <p style="position:fixed;top:0;left:0;width:100px;height:100px;background:red;" @click="clearCookie"> test</p> -->
    <img src="../../assets/img/activity_home.png" v-show="showActivity" class="activityHomeImage" @click="gotoActivityPage">

    <Vmenu thisChoice='gc'></Vmenu>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad'></firstLoad>
  </div>
</template>

<script>
import Header from '../../components/Header.vue';
import Menu from '../../components/Menu.vue';
import swiper from 'swiper';
import jsBridge from '../../commons/jsBridge.js'; 
import {getUser} from '../../commons/tools';
import axios from 'axios';
import downLoadApp from '../../components/tipDownLoadApp.vue';
import loadFailed from '../../components/loadFailed.vue';
import firstLoad from '../../components/firstLoad.vue';
export default {
  name: 'home',
  components: {
     Vheader: Header,
     Vmenu: Menu,
     loadFailed:loadFailed,
     firstLoad:firstLoad,
     VdownLoadApp:downLoadApp
  },
  created (){
     document.title="构巢Goochao"
  },
  mounted:function () {
    
    if (this.getCookie("showAppTip") == "false") {
      this.showAppTip = false;
    }

    //添加活动图片出现的过渡效果
    setTimeout(()=>{
      $(".activityHomeImage").addClass("showActivity");
    },200)

    if (this.keep.isKeepAlive()) {
      this.firstLoad = false;
      this.data = this.keep.cache.get("home-top", {spaces: []});
      this.currentSpace = this.data.spaces[0];
      this.initLayer();
      // 读缓存
      this.recommends = this.keep.cache.get("home-recommends", []);
      this.pictureData = this.keep.cache.get("pictureData", []);
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
      this.keep.cache.remove("pictureData");
      this.keep.cache.remove("home-recommends-pageIndex");
      this.keep.cache.remove("home-recommends-pageSize");
      this.keep.cache.remove("home-top");
      this.firstLoad = true;
      this.loadData();
    }

    this.loadActivityUrl();
    this.trackLogin();

    //判断活动 是否电脑进入
    this.activityId = this.getParam('activityId');
    this.isPcPreview();
    if (this.activityId) {
      this.setBindActivity();
    }
  },

  data () {
    return {
      title: '构巢,高品质家居生活',
      desc: '搬新家买家具，不用东奔西跑，只需坐着就好，我们更懂您的家', 
      link: null,
      imgUrl:"http://appsource.goochao.com/share_logo.png",        
      activityId:null,
      boothId:null,
      shareMemberId:null,
      token:null,
      state:null,

      showActivity:false,
      activityUrl:null,
      noMoreData:false,
      firstLoad:false,
      showAppTip:true,
      reloadflag:false,
      thisVueName:'home',
      loadFailed:false,
      loading: false,
      noRecommends: false,
      praiseGoods:[],
      currentSpace:{},
      isSpace:true,
      showSpace:true,
      data: {spaces: [],scenePraiseGoods:[],plans:[],goodsArr:[]},
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
    setBindActivity() {
      let platform = jsBridge.getPlatform();
      this.boothId = this.getParam('boothId'); //"YJ0bB09x"//
      this.shareMemberId = this.getParam('shareMemberId');  //分享者Id      

      //判断版本
      if(process.env.NODE_ENV == "production") {
        this.link = "https://wx.goochao.com/index.html";
      } else if(process.env.NODE_ENV == "test") {
        this.link = "http://test.wx.goochao.com/index.html";
      } else {
        this.link = "http://192.168.20.102:8080/index.html";
      }



      //判断设备
      if (platform == 'ios') {
        this.state = 1;
      } else if (platform == 'android') {
        this.state = 2;
      } else if ( this.isWeiXin() ){
        this.state = 3;
        this.completeLink();
        this.initShareToFriend();
        this.initShareToCircle();
      } else {
        this.state = 4;    
      }



      //建立联系
      this.refreshToken();
      this.token = getUser('access_token');
      if (this.activityId && this.token) {
        this.bindActivity();
      } 
    },
    isPcPreview() {
      let preview = this.getParam('preview');
      if (preview == "isPc") {
        $("html").css({'font-size':"100px"});
        $("#home_vue").css({'width':"375px",'margin':"auto"});
        $("#menu_vue").hide();
        $("#downLoadApp_vue").hide();
        $("#header_vue").hide();
        $(".activityHomeImage").hide();
        $("#content").css({'left':'36%','marginTop':'-90px'});
        setTimeout(()=>{
          this.showActivity = false;
        },200)          
        return true;
      } else {
        return false;
      }
    },
    isWeiXin(){ 
      var ua = window.navigator.userAgent.toLowerCase(); 
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
        return true; 
      } else { 
        return false; 
      }
    },
    completeLink() {
      var users = this.getUserData('user');
      if (!users) {
        return ;
      }
      let memberId = JSON.parse(users).memberId;
      
      this.link += "?shareMemberId=" + memberId;
      if (this.activityId) {
        this.link += "&activityId=" + this.activityId;
      } 
      if (this.boothId) {
        this.link += "&boothId=" + this.boothId;
      }    
    },
    initShareToFriend() {
      let that = this;
      that.wx.ready(function () { 
        that.wx.onMenuShareAppMessage({
            title:that.title,
            desc: that.desc,
            link: that.link,
            imgUrl: that.imgUrl,
            success: function (res) {
              if (that.state == 3) {
                that.showMessage("分享成功!")
              }
            },
            cancel: function (res) {
              if (that.state == 3) {
                that.showMessage("取消分享!")
              }
            }
        });
      });
    },
    initShareToCircle() {
      let that = this;
      that.wx.ready(function () { 
        that.wx.onMenuShareTimeline({
            title:that.title,
            desc: that.desc,
            link: that.link,
            imgUrl: that.imgUrl,
            success: function (res) {
              if (that.state == 3) {
                that.showMessage("分享成功!")
              }  
            },
            cancel: function (res) {
              if (that.state == 3) {
                that.showMessage("取消分享!")
              }  
            }
        });
      });
    },
    refreshToken() {
      if(this.state == 1 || this.state == 2) {
        let isLogin = jsBridge.invoke("isLogin",null);
        if (isLogin.data) {
          let data = jsBridge.invoke("getLoginResult",null);
          let accessToken = JSON.parse(data.data).accessToken;
          document.cookie  = "access_token=" + accessToken;
        } else{
          document.cookie = 'access_token' + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        }
      } 
    },   
    bindActivity() {
      if (!this.boothId) {
        this.boothId = null;
      }
      this.http.post(this).url(this.config.activity.bind_activity).params({activityId:this.activityId, boothId:this.boothId}).request((response) => {
        if (response.data.code != 0) {
          return false;
        }
        
      },(err)=>{console.log(err)})
    },

    clearCookie() {
      document.cookie = 'user' + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    /*关闭app下载div*/
    closeTip(data){
      if(!data){
        this.showAppTip = false;
      }
    },
    /*查询更多推荐失败重新加载*/
    reloadData(){
      this.loading = false;
      this.reloadflag = false;
      //.loadRecommends();
    },
    /*第一次加载失败重新加载*/
    reload (){
      this.loading = false;
      this.loadFailed = false;
      this.loadData();
    },
    /*空间右边箭头跳转*/
    gotoFind(type){
      this.keep.scroll.save();
      if(type == 1){
        this.keep.go("/scene_list.html",true,{home_type:1});
      }else if(type == 2){
        this.keep.go("/scene_list.html",true,{home_type:2});
      }else if(type == 3){
        this.keep.go("/scene_list.html",true,{home_type:4});
      }
    },
    /*banner点击记录活动点击次数*/
    bannerClickTime(banner){
      var url = this.config.home.banner_click.slice(0,this.config.home.banner_click.lastIndexOf(":")) + banner.bannerId;
      axios.head(url,{}).then(()=>{
        this.keep.scroll.save();
        console.log(banner)
        if (banner.type == 1) {
          this.keep.go("/article.html",true,{subjectArticleId:banner.detail.subjectArticleId,showGoHome:'1'});
        } else if (banner.type == 2) {
          this.keep.go("/goods_detail.html",true,{goodsid:banner.detail.goodsId,showGoHome:'1'});
        } else if (banner.type == 3) {
          this.keep.go("/shopwindowdetail2.html",true,{spaceId:banner.detail.spaceId,showGoHome:'1'});
        } else if (banner.type == 4) {
          this.keep.go("/plan_detail.html",true,{planId:banner.detail.planId,showGoHome:'1'});
        } else if (banner.type == 5) {
          let url = banner.detail.url;
          this.keep.go(url,true,{bannerId:banner.bannerId,activityId:banner.detail.activityId});
        } else if (banner.type == 6) {
          let url = banner.url;
          this.keep.go(url,true,{bannerId:banner.bannerId});
        } else if (banner.type == 7) {
          this.keep.go("/banner_detail.html",true,{bannerId:banner.bannerId});
        } else {
          this.showMessage('此活动暂不支持!')
        }
       
      })
    },
    /*跳转到商品详情*/
    gotogoods:function(goodsid){
      this.keep.scroll.save();
      this.keep.go("/goods_detail.html",true,{goodsid:goodsid,showGoHome:'1'});
    },
    /*跳转到空间指定位置*/
    gotoSpaceDetail(space,type) {
      this.keep.scroll.save();
      if(type == 0){
        this.keep.go("/shopwindowdetail2.html",true,{spaceId:space.objectId,showGoHome:'1'});
      }else if (type == 1) {
        this.keep.go("/shopwindowdetail2.html",true,{spaceId:space.objectId,showGoHome:'1',scrollTo:"goto"});
      }
     
    },
    gotoPlanDetail(plan) {
      this.keep.scroll.save();
      this.keep.go("/plan_detail.html",true,{planId:plan.detail.planId,showGoHome:'1'});
    },
    gotoScene(sceneId) {
      this.keep.scroll.save();
      this.keep.go("/scene.html",true,{sceneId:sceneId,showGoHome:'1'});
    },
    /*点击缩放动画效果*/
    onTouchstart (e,data){
      this.top = window.event.changedTouches[0].clientX;
      this.time = 0;

      for(var i = 0;i<data.length;i++){
        data[i].imgactive = false;
      }

      e.imgactive =true;

      setTimeout( () =>{
        this.time = 200;
      },200)
    },
    gotoGoods(goods) {
      this.keep.scroll.save();
      if(goods.object){
       this.keep.go("/goods_detail.html",true,{goodsid:goods.object.goodsId,showGoHome:'1'});
      } else {
       this.keep.go("/goods_detail.html",true,{goodsid:goods.goodsId,showGoHome:'1'});
      }
    },
    toGoodsDetail(goodsId){
      this.keep.scroll.save();
      this.keep.go("/goods_detail.html",true,{goodsid:goodsId,showGoHome:'1'});
    },
    gotoSubject(e) {
      this.keep.scroll.save();
      if(e.object != undefined){
        this.keep.go("/article.html",true,{subjectArticleId:e.object.subjectArticleId,showGoHome:'1'});
      }else{
        this.keep.go("/article.html",true,{subjectArticleId:e.data.subjectArticleId,showGoHome:'1'});
      }
    },
    gotoScene1(e) {
      this.keep.scroll.save();
      this.keep.go("/newscene.html",true,{sceneId:e.detail.sceneId,type:2,number:e.number,pageIndex:this.page.pageIndex-1});
    },
    onTouchend:function(e,type){
      var top =  window.event.changedTouches[0].clientX
      if(this.time < 200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        this.keep.scroll.save();

       /*空间跳转*/
        if(type == 1){
          this.keep.go("/shopwindowdetail2.html",true,{spaceId:e.objectId,showGoHome:'1'});
        }
        //文章的跳转
        if(type == 2){
          if(e.object != undefined){
            this.keep.go("/article.html",true,{subjectArticleId:e.object.subjectArticleId,showGoHome:'1'});
          }else{
            this.keep.go("/article.html",true,{subjectArticleId:e.data.subjectArticleId,showGoHome:'1'});
          }
        }
        //场景图的跳转
       if(type == 3){
        this.keep.go("/newscene.html",true,{sceneId:e.detail.sceneId,type:2,number:e.number,pageIndex:this.page.pageIndex-1});
       }

       if(type == 4){
        this.gotogoods(e.object.goodsId)
       }

       if(type == 5){
         this.keep.go("/goods_detail.html",true,{goodsid:e.goodsId,showGoHome:'1'});
       }

     }else{
      e.imgactive = false;
     }
    },
    onCancel (e){
      e.imgactive = false;
    },

    /*加载更多*/
		loadMore() {
			console.log("loading more recommends");
      this.loading = true;
      this.noRecommends = true;
			this.loadRecommends();
	  },
    /*查询首页活动*/
    loadActivityUrl() {
      this.http.get(this).url(this.config.home.activity_home_url).request((response) => {
        if (response.data.code != 0) {
          return;
        }
        let data = response.data.data;
        this.showActivity = !data.newMemberPackageReceive;
        this.activityUrl = data.newMemberPackageUrl;
        this.keep.cache.push("homeShareUrl", data.shareUrl);
        },(err) =>{
          this.loadFailed = true;
        }
      )
    },
    gotoActivityPage() {
      this.keep.go(this.activityUrl,true,{hasInWx:2});
    },
    /*查询首页数据*/
		loadData() {
			this.http.get(this).url(this.config.home.url_v2).request(
				(response) => {
          this.firstLoad = false;
					if (response.data.code != 0) {
						return;
					}

          var data = response.data.data;

          for(var i = 0;i<data.spaces.length;i++){
            data.spaces[i].imgactive = false;
             for(var j = 0; j < data.spaces[i].data.length; j++){
              data.spaces[i].data[j].imgactive = false;
            }
          }
          for(var i = 0;i<data.subjectArticles.length;i++){
            data.subjectArticles[i].imgactive = false;
          }


          if(data.spaces){
            if(data.spaces[0].data.length){
              this.isSpace = true;
            } else{
              this.isSpace = false;
            }
            this.currentSpace = data.spaces[0];
          }
          this.keep.cache.push("home-top", response.data.data);
					this.data = data;
          this.praiseGoods = data.spaces[0].data;
					this.initLayer();
				},(err) =>{
          this.firstLoad = false;
          console.log(err,'++++++++++++++++++++++++++');
          this.loadFailed = true;
        }
			)
		},
    /*查询推荐数据*/
		loadRecommends() {
			this.http.get(this).url(this.config.home.recommend).params(this.page).request(
				(response) => {
					this.noRecommends = false;
          this.reloadflag = false;
					if (response.data.code != 0) {
						return;
					}
					var recommends = response.data.data;
          if (recommends.length == 0) {
            this.loading = true;
            this.noMoreData = true;
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
				},(err) => {
					console.log(err);
					this.loading = true;
          this.noRecommends = false;
          if(this.page.pageIndex == 1){
             this.loadFailed = true;
          }else{
            this.reloadflag = true;
          }
				}
			)
		},
    /*swiper初始化*/
		initLayer() {
      let that = this;
			this.$nextTick(() => {
				new	swiper('#swiper-container1',{
				  slidesPerView: 'auto',
		      paginationClickable: true,
          observer:true,
          observeParents:true,

          onSlideChangeEnd: function(swiper){

            that.showSpace = true;

            if( that.data.spaces[swiper.activeIndex].data.length == 0){
              that.isSpace = false;
            } else{
              that.isSpace = true;
            }

            that.currentSpace = that.data.spaces[swiper.activeIndex];
          },
			  });

        new swiper('#swiper-container2',{
          slidesPerView: 'auto',
          paginationClickable: true,
          observer:true,
          observeParents:true,
        });

			});
		},
    //记录最后一次使用微商城
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
</style>
