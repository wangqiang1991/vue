<template>
  <div id="findAll_vue">
    <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader type="2" :showAppTip = "showAppTip" :class="{'showAppTip1':showAppTip}" @setCache="setCache"></Vheader>

    <div class="pic_tit" :class="{'showAppTip2':showAppTip,'shortDiv':scrollTop}" >
        <!-- 类型选择 -->
       <ul class="title" :class="{'hiddenTitle':scrollTop}">
         <li :class="{'titleActive':showType == 4}" @click="typeChange(4)">软装方案</li>
         <li :class="{'titleActive':showType == 2}" @click="typeChange(2)">空间搭配</li>
         <li :class="{'titleActive':showType == 1}" @click="typeChange(1)">场景图</li>
         <li :class="{'titleActive':showType == 3}" @click="typeChange(3)">期刊</li>
       </ul>

       <!-- 风格类型价格区间文章类型等 -->
       <p class="choiceName" :class="{'titilCenter':scrollTop,'choiceStyle':scene.choice}" v-show="showType == 1" @click="showitem(1)">
         <span v-for="(name,index) in scene.title"><i v-if="index"> / </i>{{name}} </span>
       </p>
       <p class="choiceName" :class="{'titilCenter':scrollTop,'choiceStyle':space.choice}" v-show="showType == 2"  @click="showitem(2)">{{space.title}}</p>
     <!--   <p class="choiceName" :class="{'titilCenter':scrollTop,'choiceStyle':plan.choice}" v-show="showType == 4"  @click="showitem(4)">
          <span v-for="(name,index) in plan.title"><i v-if="index"> / </i>{{name}} </span>
       </p> -->
       <p class="choiceName" :class="{'titilCenter':scrollTop,'choiceStyle':subject.choice}" v-show="showType == 3"  @click="showitem(3)">{{subject.title}}</p>


       <div class="choiceScene" :class="{'itemScroll':scrollTop}" v-show="showType == 1 && scene.show">
          <div class="choiceArea"> 
              <p>区域</p>
              <div class="scorllArea">
                <div class="swiper-container swiper-container-horizontal" id="swiper_area">
                  <div class="swiper-wrapper">
                    <div v-for="area in areadata" class="swiper-slide">
                      <p @click="choiceArea(area)" :class="{'choice':area.show}">{{area.name}}</p>
                    </div>
                  </div>
                </div>    
              </div>
          </div>
          <div class="choiceStyle">
              <p>风格</p>
              <div class="scrollStyle">
                <div class="swiper-container swiper-container-horizontal" id="swiper_style">
                  <div class="swiper-wrapper">
                    <div v-for="style in styledata" class="swiper-slide">
                      <p @click="choiceStyle(style)" :class="{'choice':style.show}">{{style.name}}</p>
                    </div>
                  </div>
                </div>  
              </div>
          </div>
          <div class="choiceType">
              <p>类型</p>
              <div class="scrollType">
                <li @click="choiceType(type)" v-for="type in allData" :class="{'lichoice':type.show}">{{type.name}}</li>
              </div>  
          </div>
       </div>

       <div class="choiceSpace" :class="{'itemScroll':scrollTop}" v-show="showType == 2 && space.show">
          <div class="choiceStyle">
              <p>风格</p>
              <div class="scrollStyle">
                <div class="scrollStyle">
                  <div class="swiper-container swiper-container-horizontal" id="swiper_space">
                    <div class="swiper-wrapper">
                      <div v-for="style in spaceData" class="swiper-slide">
                        <p  @click="choiceSpace(style)" :class="{'choice':style.show}">{{style.name}}</p>
                      </div>
                    </div>
                  </div>  
                </div>
              </div>
          </div>
       </div>

       <div class="choiceSpace" :class="{'itemScroll':scrollTop}" v-show="showType == 4 && plan.show">
          <div class="choiceStyle">
              <p>风格</p>
              <div class="scrollStyle">
                <div class="scrollStyle">
                  <div class="swiper-container swiper-container-horizontal" id="swiper_plan">
                    <div class="swiper-wrapper">
                      <div v-for="plan in planData" class="swiper-slide">
                        <p  @click="choicePlan(plan)" :class="{'choice':plan.show}">{{plan.name}}</p>
                      </div>
                    </div>
                  </div>  
                </div>
              </div>
          </div>

           <div class="choiceStyle">
              <p>户型</p>
              
              <div class="scrollStyle">
                <div class="swiper-container swiper-container-horizontal" id="swiper_planhouse">
                  <div class="swiper-wrapper">
                    <div v-for="plan in planHouseType" class="swiper-slide">
                      <p  @click="choicePlanHouse(plan)" :class="{'choice':plan.show}">{{plan.name}}</p>
                    </div>
                  </div>
                </div>  
              </div>
             
          </div>

           <div class="choiceStyle">
              <p>价格</p>
             
              <div class="scrollStyle">
                <div class="swiper-container swiper-container-horizontal" id="swiper_planprice">
                  <div class="swiper-wrapper">
                    <div v-for="plan in planPriceData" class="swiper-slide">
                      <p  @click="choicePlanPrice(plan)" :class="{'choice':plan.show}">{{plan.name}}</p>
                    </div>
                  </div>
                </div>  
              </div>
           
          </div>

       </div>

       <div class="choiceSpace" :class="{'itemScroll':scrollTop}" v-show="showType == 3 && subject.show">
          <div class="choiceStyle">
              <p>分类</p>
              <div class="scrollStyle">
                <div class="scrollStyle">
                  <div class="swiper-container swiper-container-horizontal" id="swiper_subject">
                    <div class="swiper-wrapper">
                      <div v-for="subject in subjectType" class="swiper-slide">
                        <p  @click="choiceSubject(subject)" :class="{'choice':subject.show}">{{subject.typeName}}</p>
                      </div>
                    </div>
                  </div>  
                </div>
              </div>
          </div>
       </div>

    </div>

    <!-- 蒙版div -->
    <div class="spaceArea" @click="closeMengban" v-show="showMengban" id="mengban"></div>

    <!-- 场景容器 -->
    <div  class="content_box" v-infinite-scroll="sceneLoadMore" infinite-scroll-disabled="scene.loading" infinite-scroll-distance="10" :infinite-scroll-immediate-check="true" :class="{'showAppTip3':showAppTip,'showCurrentContent':(showType == 1)}">
      <div class="imgContent">
        <img v-lazy="sceneImage.cover+ '?imageView2/0/w/320/h/320|imageslim'" v-for="sceneImage in scene.data"  @click="gotoScene(sceneImage,1)" >
        <!-- @touchcancel='onCancel(sceneImage)' @touchstart='onTouchstart(sceneImage,scene.data)' @touchend='onTouchend(sceneImage,1)' :class="{'imgactive':sceneImage.imgactive}"> -->
      </div>

      <div  v-show="!firstLoad && !scene.data.length" style="width:100%;background:white;padding:0.2rem 0;">
        <img src="../../assets/img/find_noData.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
        <p style="font-size:0.16rem;color:#ddd;text-align:center;">能不能给我一首歌的时间<br> 这个场景还在搭建中哦</p>
      </div>

      <div class="load" v-show='scene.loadData'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div class="reload" v-show='scene.reload' @click='reloadData(1)'>
          加载失败,点击重新加载
      </div>

      <div  v-show='scene.noMoreData && scene.data.length' style="width:100%;background:white;padding:0.2rem 0;">
        <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>

    </div>

    <!-- 空间容器 -->
      <div  class="content_box" :infinite-scroll-immediate-check="true"  v-infinite-scroll="spaceLoadMore" infinite-scroll-disabled="space.loading" infinite-scroll-distance="10" :class="{'showAppTip3':showAppTip,'showCurrentContent':(showType == 2)}">

        <div class="spaceContentBox"  v-for="spaceImage in space.data" >
          <img v-lazy="spaceImage.cover+ '?imageView2/0/w/1024/h/611|imageslim'" @click="gotoSpaceDetail(spaceImage,2)" >
          <p style="font-weight:700;">{{spaceImage.name}}</p>
          <p style="margin:0;width:100%;height:0.15rem;background:#F2f2f2;"></p>
        </div>

        <div  v-show="!firstLoad && !space.data.length" style="width:100%;background:white;padding:0.2rem 0;">
          <img src="../../assets/img/find_noData.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
          <p style="font-size:0.16rem;color:#ddd;text-align:center;">能不能给我一首歌的时间<br> 这个空间还在搭建中哦</p>
        </div>

        <div class="load" v-show='space.loadData'>
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

        <div class="reload" v-show='space.reload' @click='reloadData(2)'>
            加载失败,点击重新加载
        </div>

        <div  v-show='space.noMoreData && space.data.length' style="width:100%;background:white;padding-top:0.2rem;padding-bottom:0.2rem;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
        </div>

      </div>


    <!-- 软装方案容器 -->
      <div style="padding-top:1.13rem;"  class="content_box" :infinite-scroll-immediate-check="true"  v-infinite-scroll="planLoadMore" infinite-scroll-disabled="plan.loading" infinite-scroll-distance="10" :class="{'showAppTip3':showAppTip,'showCurrentContent':(showType == 4)}">

        <div class="planContentBoxV2"  v-for="planItem in plan.data" >
<!--           <img v-lazy="planItem.cover+ '?imageView2/0/w/1024/h/611|imageslim'" @click="gotoPlanDetail(planItem,4)" >
          <p class="plan_title">{{planItem.planName}}</p>
          <div class="plan_message">
            <p><span>户型:</span>{{planItem.houseTypeName}}</p>
            <p><span>风格:</span>{{planItem.style.name}}</p>
            <p><span>建筑面积:</span>{{planItem.houseTypePlanRelations[0].houseType.buildArea}}m²</p>
            <p><span>实得面积:</span>{{planItem.houseTypePlanRelations[0].houseType.realityArea}}m²</p>
            <p><span>价格区间:</span>{{planItem.priceRangeName}}</p>
          </div>
           -->

          <!-- <p style="margin:0;width:100%;height:0.15rem;background:#Fff;"></p> -->
          <div @click='gotoPlanList(planItem,4)'>
             <img v-if='planItem.cover' v-lazy="planItem.cover + '?imageView2/0/w/640/h/480|imageslim' " alt="楼盘封面"> 
             <p v-else class="defaultImage"></p>
             <div class="planRight">
                <p class="planTitle">{{planItem.houseName}}</p>
                <p class="planDesc">{{planItem.city}}{{planItem.county}}{{planItem.address}}</p>
                <p class="count">
                  <span>方案数量</span>
                  <b>{{planItem.planCount}}</b>
                  <span style="margin-left:0.24rem;">户型数量</span>
                  <b>{{planItem.houseTypeCount}}</b>
                </p>
             </div>
          </div>
        </div>

        <div  v-show="!firstLoad && !plan.data.length" style="width:100%;background:white;padding:0.2rem 0;">
          <img src="../../assets/img/find_noData.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
          <p style="font-size:0.16rem;color:#ddd;text-align:center;">软装方案正在完善中...</p>
        </div>

        <div class="load" v-show='plan.loadData'>
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

        <div class="reload" v-show='plan.reload' @click='reloadData(4)'>
            加载失败,点击重新加载
        </div>

        <div  v-show='plan.noMoreData && plan.data.length' style="width:100%;background:white;padding-top:0.2rem;padding-bottom:0.2rem;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
        </div>

      </div>


    <!-- 期刊容器 -->
    <div class="content_box" :infinite-scroll-immediate-check="true"  v-infinite-scroll="subjectloadMore" infinite-scroll-disabled="subject.loading" infinite-scroll-distance="10" :class="{'showAppTip3':showAppTip,'showCurrentContent':(showType == 3)}">

      <div class="subjectContentBox" v-for="subjectItem in subject.data">
        <div class="imgBox" @click="gotoSubjectDetail(subjectItem,3)" >
          <img v-lazy="subjectItem.cover+ '?imageView2/0/w/1024/h/520|imageslim'" >
          <span>{{subjectItem.typeName}}</span>
        </div>
        <p style="font-weight:700;">{{subjectItem.title}}</p>
      </div>

        <div  v-show="!firstLoad && !subject.data.length" style="width:100%;background:white;padding:0.2rem 0;">
          <img src="../../assets/img/find_noData.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
          <p style="font-size:0.16rem;color:#ddd;text-align:center;">更多优质文章正在上架中</p>
        </div>

      <div class="load" v-show='subject.loadData'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div class="reload" v-show='subject.reload' @click='reloadData(3)'>
          加载失败,点击重新加载
      </div>

      <div  v-show='subject.noMoreData && subject.data.length' style="width:100%;background:white;padding:0.2rem 0;">
        <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>

    </div>
  

    <Vmenu thisChoice='img' @setCache="setCache"></Vmenu>

    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad'></firstLoad>

  </div>
</template>

<script>
  import swiper from 'swiper';
  import Header from '../../components/Header.vue';
  import Menu from '../../components/Menu.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  import firstLoad from '../../components/firstLoad.vue';
  export default {
    components: {
      Vheader: Header,
      Vmenu: Menu,
      loadFailed:loadFailed,
      firstLoad:firstLoad,
      VdownLoadApp:downLoadApp
    },
    data() {
      return {
        firstLoad:false,
        showAppTip:true,
        loadFailed:false,
        scrollTop:false, //滚动控制位置变量
        showMengban:false, //控制蒙版变量
        showType:2,  //1 场景 2 空间 3 期刊 4软装方案
        styledata:[],
        planData:[],
        spaceData:[],
        areadata:[],
        allData:[],
        subjectType:[],
        planHouseType:[], //软装方案户型
        planPriceData:[], //软装方案价格
        scene:{
          noMoreData:false,
          styleId:"",
          areaId:"",
          allid:"",
          pageIndex:1,
          pageSize:10,
          show:false,
          loading:true,
          data:[],
          loadData:false,
          reload:false,
          choice:false,
          isLoading:false,
          title:["全区域","全风格","全类型"]
        },
        space:{
          noMoreData:false,
          show:false,
          title:'全风格',
          styleId:'',
          pageIndex:1,
          pageSize:10,
          data:[],
          loading:false,
          reload:false,
          loadData:false,
          isLoading:false,
          choice:false,
        },
        subject:{
          noMoreData:false,
          show:false,
          title:"全类型",
          articleTypeId:"",
          loading:true,
          data:[],
          pageIndex:1,
          pageSize:10,
          loadData:false,
          isLoading:false,
          reload:false,
          choice:false,
        },
        plan:{
          noMoreData:false,
          show:false,
          title:["全风格","全户型","全价格"],
          styleId:'',
          houseType:'',
          priceRange:'',
          pageIndex:1,
          pageSize:10,
          data:[],
          loading:false,
          reload:false,
          loadData:false,
          isLoading:false,
          choice:false,
        },
        time:0,
        top:0,
      }
    },
    created() {
      document.title = "发现"
    },
    //离开该页面需要移除这个监听的事件
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    mounted: function() {
      $('#mengban').css({'height': document.documentElement.clientHeight})
      /*监听滚动事件*/
      window.addEventListener('scroll', this.handleScroll)

      if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }

      var home_type = this.getParam('home_type');

      //判断缓存
      if(this.keep.isKeepAlive()) {
        this.firstLoad = false;
        this.areadata = this.keep.cache.get("areaData", []);
        this.styledata = this.keep.cache.get("styleData", []);
        this.spaceData = this.keep.cache.get("spaceData", []);
        this.allData = this.keep.cache.get("allData", []);
        this.subjectType = this.keep.cache.get("subjectType", []);
        this.planData = this.keep.cache.get("planData", []);
        this.planHouseType = this.keep.cache.get("planHouseType", []);
        this.planPriceData = this.keep.cache.get("planPriceData", []);

        this.showType = this.keep.cache.get("showType", 2);
        if(this.showType == 1){
          this.scene.data = this.keep.cache.get("data", []);
          this.scene.pageIndex = this.keep.cache.get("pageIndex", 1);

          this.scene.title = this.keep.cache.get("title", ["全区域","全风格","全类型"]);

          var id = this.keep.cache.get("id", ["","",""]);
          this.scene.areaId = id[0];
          this.scene.styleId = id[1];
          this.scene.allid = id[2];
        }else if (this.showType == 2) {
          this.space.data = this.keep.cache.get("data", []);
          this.space.pageIndex = this.keep.cache.get("pageIndex", 1);

          this.space.title = this.keep.cache.get("title", "全风格");

          var id = this.keep.cache.get("id", "");
          if(id == "null"){
            this.space.styleId = '';
          } else{
            this.space.styleId = id;
          }
          
          if(!this.space.data.length){
            this.findSpace()
          }

        }else if(this.showType == 3){
          this.subject.data = this.keep.cache.get("data", []);
          this.subject.pageIndex = this.keep.cache.get("pageIndex", 1);

          this.subject.title = this.keep.cache.get("title", "全类型");
          var id = this.keep.cache.get("id", "");
          if(id == "null"){
            this.subject.articleTypeId = '';
          }else{
            this.subject.articleTypeId = id;
          }
          
        }else if(this.showType == 4){
          this.plan.data = this.keep.cache.get("data", []);
          this.plan.pageIndex = this.keep.cache.get("pageIndex", 1);

          this.plan.title = this.keep.cache.get("title", ["全风格","全户型","全价格"]);

          var id = this.keep.cache.get("id", ["","",""]);
          this.plan.styleId = id[0];
          this.plan.houseType = id[1];
          this.plan.priceRange = id[2];
          
        }
        this.initSwiper();
        this.initSwiperSubject();
        this.initSwiperPlan();
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      } else {
        this.firstLoad = true;
        this.keep.cache.remove("areaData");
        this.keep.cache.remove("styleData");
        this.keep.cache.remove("spaceData");
        this.keep.cache.remove("allData");
        this.keep.cache.remove("subjectType");
        this.keep.cache.remove("planData");
        this.keep.cache.remove("planHouseType");
        this.keep.cache.remove("planPriceData");
        this.keep.cache.remove("showType");
        this.keep.cache.remove("data");
        this.keep.cache.remove("pageIndex");
        this.keep.cache.remove("title");
        this.keep.cache.remove("id");

        this.findArea();
        this.findSubjectType();
        this.findPlanType();
        if(home_type == 2){
          this.showType = 1;
          this.findScene();
        } else if (home_type == 1){
          this.showType = 2;
          this.findSpace();
        } else if (home_type == 3){
          this.showType = 3;
          this.findSubject();
        } else {
          this.findPlan();
          this.showType = 4;
        } 

         //初始化场景图全部的数据
        this.allData = [{'name':'全部','show':true,'allid':''},{'name':'场景售卖','show':false,'allid':2},{'name':'人气家居','show':false,'allid':1}];
      }
      
    },
    methods: {
       handleScroll () { 
        // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        // //console.log(scrollTop)  
        // if(scrollTop >= 100){
        //    this.scrollTop = true; 
        // }else{
        //    this.scrollTop = false;
        // }
      },
      closeTip(data){
      if(!data){
          this.showAppTip = false;
        }
      },
      reloadData(type){
        if(type == 1){
          this.scene.reload = false;
          this.scene.loading = true;
          if(!this.scene.isLoading){
            this.findScene();
          }
        }else if (type == 2) {
          this.space.reload = false;
          this.space.loading = true;
          if(!this.space.isLoading){
            this.findSpace();    
          }
        }else if (type == 3) {
          this.subject.reload = false;
          this.subject.loading = true;
          if(!this.subject.isLoading){
            this.findSubject();
          }
        }else if (type == 4) {
          this.plan.reload = false;
          this.plan.loading = true;
          if(!this.plan.isLoading){
            this.findPlan();
          }
        }
      },
      reload(){
        this.loadFailed = false;
        this.findArea();
        this.findSubjectType();
        this.findScene();
        this.findSpace();
        this.findSubject();
        this.findPlanType();
        this.findPlan();
      },
      typeChange(type) {
        this.firstLoad = true;
        this.showType = type;
        this.showMengban = false;

        this.scene.show = false;
        this.space.show = false;
        this.subject.show = false;
        this.plan.show = false;

        this.scene.loading = true;
        this.space.loading = true;
        this.subject.loading = true;
        this.plan.loading = true;

        if(type == 1){
          if(!this.scene.isLoading){
            this.findScene();
           }
        }else if(type == 2){
          if(!this.space.isLoading){
            this.findSpace();    
          }
        }else if(type == 3){
          if(!this.subject.isLoading){
            this.findSubject();
          }
        }else if (type == 4) {
          if(!this.plan.isLoading){
            this.findPlan();
          }
        }
      },
      showitem(type){
        if(type == 1){
          this.scene.show = !this.scene.show;
        }else if(type == 2){
          this.space.show = !this.space.show; 
        }else if(type == 3){
          this.subject.show = !this.subject.show;
        }else if(type == 4){
          this.plan.show = !this.plan.show;
        }
        this.showMengban = !this.showMengban;
      },
      closeMengban() {
        this.showMengban = false;
        this.scene.show = false;
        this.space.show = false;
        this.subject.show = false;
        this.plan.show = false;
      },
      choiceArea(area) {
        this.firstLoad = true;
        this.areadata.forEach((item)=>{
          item.show = false;
        })
        area.show = true;
        if(area.name == "全部"){
          this.scene.title[0]="全区域";
          if(this.scene.title[1]=="全风格" && this.scene.title[2]=="全类型"){
            this.scene.choice = false;
          }else{
            this.scene.choice = true;
          }
        }else{
          this.scene.title[0]=area.name;
          this.scene.choice = true;
        }
        this.scene.data = [];
        this.scene.pageIndex = 1;
        this.scene.areaId = area.areaId;
        this.scene.loading = true;
        if(!this.scene.isLoading){
          this.findScene();
        }
      },
      choiceStyle(style){
        this.firstLoad = true;
        this.styledata.forEach((item)=>{
          item.show = false;
        })
        style.show = true;
        if(style.name == "全部"){
          this.scene.title[1]="全风格";
          if(this.scene.title[0]=="全区域" && this.scene.title[2]=="全类型"){
            this.scene.choice = false;
          }else{
            this.scene.choice = true;
          }
        }else{
          this.scene.title[1]=style.name;
          this.scene.choice = true;
        }
        this.scene.data = [];
        this.scene.pageIndex = 1;
        this.scene.styleId = style.styleId;
        this.scene.loading = true;
        if(!this.scene.isLoading){
          this.findScene();
        }
      },
      choiceType(type){
        this.firstLoad = true;
        this.allData.forEach((item)=>{
          item.show = false;
        })
        type.show = true;

        if(type.name == "全部"){
          this.scene.title[2]="全类型";
          if(this.scene.title[0]=="全区域" && this.scene.title[1]=="全风格"){
            this.scene.choice = false;
          }else{
            this.scene.choice = true;
          }
        }else{
          this.scene.title[2]=type.name;
          this.scene.choice = true;
        }

        this.scene.data = [];
        this.scene.pageIndex = 1;
        this.scene.allid = type.allid;
        this.scene.loading = true;
        if(!this.scene.isLoading){
          this.findScene();
        }
      },
      choicePlan(plan) {
        this.firstLoad = true;
        this.planData.forEach((item)=>{
          item.show = false;
        })
        plan.show = true;

        if(plan.name == "全部"){
          this.plan.title[0]="全风格";
          if(this.plan.title[1]=="全户型" && this.plan.title[2]=="全价格"){
            this.plan.choice = false;
          }else{
            this.plan.choice = true;
          }
        }else{
          this.plan.title[0]=plan.name;
          this.plan.choice = true;
        }

        this.plan.data = [];
        this.plan.pageIndex = 1;
        this.plan.styleId = plan.styleId;
        this.plan.loading = true;
        if(!this.plan.isLoading){
          this.findPlan();    
        }
      },
      choicePlanHouse(plan) {
        this.firstLoad = true;
        this.planHouseType.forEach((item)=>{
          item.show = false;
        })
        plan.show = true;

        if(plan.name == "全部"){
          this.plan.title[1]="全户型";
          if(this.plan.title[0]=="全风格" && this.plan.title[2]=="全价格"){
            this.plan.choice = false;
          }else{
            this.plan.choice = true;
          }
        }else{
          this.plan.title[1]=plan.name;
          this.plan.choice = true;
        }

        this.plan.data = [];
        this.plan.pageIndex = 1;
        this.plan.houseType = plan.value;
        this.plan.loading = true;
        if(!this.plan.isLoading){
          this.findPlan();    
        }
      },
      choicePlanPrice(plan) {
        this.firstLoad = true;
        this.planPriceData.forEach((item)=>{
          item.show = false;
        })
        plan.show = true;

        if(plan.name == "全部"){
          this.plan.title[2]="全价格";
          if(this.plan.title[0]=="全风格" && this.plan.title[1]=="全户型"){
            this.plan.choice = false;
          }else{
            this.plan.choice = true;
          }
        }else{
          this.plan.title[2]=plan.name;
          this.plan.choice = true;
        }

        this.plan.data = [];
        this.plan.pageIndex = 1;
        this.plan.priceRange = plan.value;
        this.plan.loading = true;
        if(!this.plan.isLoading){
          this.findPlan();    
        }
      },

      choiceSpace(style) {
        this.firstLoad = true;
        this.spaceData.forEach((item)=>{
          item.show = false;
        })
        style.show = true;
        if(style.name == "全部"){
          this.space.title="全风格";
          this.space.choice = false;
        }else{
          this.space.title=style.name;
          this.space.choice = true;
        }
        this.space.data = [];
        this.space.pageIndex = 1;
        this.space.styleId = style.styleId;
        this.space.loading = true;
        if(!this.space.isLoading){
            this.findSpace();    
          }
      },
      choiceSubject(subject){
        this.firstLoad = true;
        this.subjectType.forEach((item)=>{
          item.show = false;
        })
        subject.show = true;
        if(subject.typeName == "全部"){
          this.subject.title="全类型";
          this.subject.choice = false;
        }else{
          this.subject.title=subject.typeName;
          this.subject.choice = true;
        }
        this.subject.data = [];
        this.subject.pageIndex = 1;
        this.subject.articleTypeId = subject.typeId;
        this.subject.loading = true;
        if(!this.subject.isLoading){
          this.findSubject();
        }
      },
      findArea(){
       this.http.get(this).url(this.config.sceneList.area).request(
          (res) => {
            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].show = false;
            }
            var area={'name':'全部','show':true,areaId:''};
            res.data.data.unshift(area)
            this.areadata = res.data.data;
            
            this.findStyle();
          }
        );
      },
      findStyle(){
        this.http.get(this).url(this.config.sceneList.style).request(
          (res) => {

            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].show = false;
            }
            var style={'name':'全部','show':true,styleId:''};
            res.data.data.unshift(style)
            this.styledata = res.data.data;
            this.spaceData = res.data.data;
            this.planData = res.data.data;
            
            this.initSwiper();
          },
          (err) => {
            console.log(err);
          }
        );
      },
      findSubjectType() {
         this.http.get(this).url(this.config.sceneList.subjectType).request((res) => {
            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].show = false;
            }
            var style={'typeName':'全部','show':true,typeId:''};
            res.data.data.unshift(style)
            this.subjectType = res.data.data;
            
            this.initSwiperSubject();
          },
          (err) => {
            console.log(err);
          }
        );
      },
      findPlanType() {
        let params = {};
        params.type = 1;
        this.http.get(this).url(this.config.plan.plan_type).restful(params).request((res) => {
            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].show = false;
            }
            var style={'name':'全部','show':true,value:''};
            res.data.data.unshift(style)
            this.planHouseType = res.data.data;
            this.findPlanPrice();
          },
          (err) => {
            console.log(err);
          }
        );
      },
      findPlanPrice() {
        let params = {};
        params.type = 2;
        this.http.get(this).url(this.config.plan.plan_type).restful(params).request((res) => {
            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].show = false;
            }
            var style={'name':'全部','show':true,value:''};
            res.data.data.unshift(style)
            this.planPriceData = res.data.data;
            
            this.initSwiperPlan();
          },
          (err) => {
            console.log(err);
          }
        );
      },
      findSubject() {
        
        this.subject.isLoading = true;
        var params = {
          pageIndex:this.subject.pageIndex,
          articleTypeId:this.subject.articleTypeId
        }
        this.http.get(this).url(this.config.sceneList.subject).params(params).request((res) => {
            this.firstLoad = false;
            this.subject.loadData = false;
            this.subject.isLoading = false;
            if(res.data.code != 0){
              return ;
            }
            let data = res.data.data;
            data.forEach((item)=>{
              item.imgactive = false;
              this.subject.data.push(item);
            });

            if (data.length == 0) {
              this.subject.noMoreData = true;
              this.subject.loading = true;
            }else{
              this.subject.loading = false;
              this.subject.pageIndex++;
            }
            
            },(err)=>{
              if(this.subject.pageIndex == 1){
                this.loadFailed = true;  
              }else{
                this.subject.reload = true;
              }
              this.firstLoad = false;
              this.subject.loadData = false;
              this.subject.loading = false;
              this.subject.isLoading = false;
            }
        )
      },
      findScene() {
        
        this.scene.isLoading = true;
        var data = {
          pageIndex: this.scene.pageIndex,
          styleId: this.scene.styleId,
          areaId: this.scene.areaId,
          loadDetail:true,
          tagType:this.scene.allid
        };
        this.http.get(this).url(this.config.sceneList.picture).params(data).request((res) => {
          this.firstLoad = false;
          this.scene.loadData = false;
          this.scene.isLoading = false;
          if(res.data.code != 0){
            return ;
          }
          let data = res.data.data;
          for(var i = 0; i < data.length; i++){
            data[i].imgNumber = i;
            data[i].imgactive = false;
            this.scene.data.push(data[i]);
          }

          if (data.length == 0) {
            this.scene.noMoreData = true;
            this.scene.loading = true;
          }else{
            this.scene.loading = false;
            this.scene.pageIndex++;
          }
            
          },(err)=>{
            if(this.scene.pageIndex == 1){
              this.loadFailed = true;  
            }else{
              this.scene.reload = true;
            }
            this.firstLoad = false;
            this.scene.loadData = false;
            this.scene.loading = false;
            this.scene.isLoading = false;
          }
        )
      },
      findSpace() {
        
        this.space.isLoading = true;
        var params = {
          pageIndex: this.space.pageIndex,
          styleId: this.space.styleId,
        };
        this.http.get(this).url(this.config.sceneList.space).params(params).request((res) => {
          this.firstLoad = false;
          this.space.loadData = false;
          this.space.isLoading = false;
          if(res.data.code != 0){
            return ;
          }
          let data = res.data.data;
         
          data.forEach((item)=>{
            item.imgactive = false;
            this.space.data.push(item);
          });

          if (data.length == 0) {
            this.space.noMoreData = true;
            this.space.loading = true;
          }else{
            this.space.loading = false;
            this.space.pageIndex++;
          }
            
          },(err)=>{
            if(this.space.pageIndex == 1){
              this.loadFailed = true;  
            }else{
              this.space.reload = true;
            }
            this.firstLoad = false;
            this.space.loadData = false;
            this.space.loading = false;
            this.space.isLoading = false;
          }
        )
      },
      findPlan() {
        
        this.plan.isLoading = true;
        var params = {
          pageIndex: this.plan.pageIndex
          // styleId: this.plan.styleId,
          // houseType:this.plan.houseType,
          // priceRange:this.plan.priceRange
        };
        this.http.get(this).url(this.config.sceneList.house_url).params(params).request((res) => {
          this.firstLoad = false;
          this.plan.loadData = false;
          this.plan.isLoading = false;
          if(res.data.code != 0){
            return ;
          }
          let data = res.data.data;
         
          data.forEach((item)=>{
            item.imgactive = false;
            this.plan.data.push(item);
          });

          if (data.length == 0) {
            this.plan.noMoreData = true;
            this.plan.loading = true;
          }else{
            this.plan.loading = false;
            this.plan.pageIndex++;
          }
            
          },(err)=>{
            if(this.plan.pageIndex == 1){
              this.loadFailed = true;  
            }else{
              this.plan.reload = true;
            }
            this.firstLoad = false;
            this.plan.loadData = false;
            this.plan.loading = false;
            this.plan.isLoading = false;
          }
        )
      },
      sceneLoadMore() {
        this.scene.loading = true;
        this.scene.loadData = true;
        if(this.showType == 1 && !this.scene.isLoading){
          this.findScene();
        }
      },
      spaceLoadMore() {
        this.space.loading = true;
        this.space.loadData = true;
        if(this.showType == 2 && !this.space.isLoading){
          this.findSpace();
         }
      },
      planLoadMore() {
        this.plan.loading = true;
        this.plan.loadData = true;
        if(this.showType == 4 && !this.plan.isLoading){
          this.findPlan();
         }
      },
      subjectloadMore() {
        this.subject.loading = true;
        this.subject.loadData = true;
        if(this.showType == 3 && !this.subject.isLoading){
          this.findSubject();
        }
      },
      initSwiper() {
        this.$nextTick(() => {
          new swiper('#swiper_space',{
            slidesPerView: 'auto',
            paginationClickable: true,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
          });  
          new swiper('#swiper_plan',{
            slidesPerView: 'auto',
            paginationClickable: true,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
          });
          new swiper('#swiper_style',{
            slidesPerView: 'auto',
            paginationClickable: true,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
          });
          new swiper('#swiper_area',{
            slidesPerView: 'auto',
            paginationClickable: true,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
          });
        });
      },
      initSwiperSubject(){
        this.$nextTick(() => {
          new swiper('#swiper_subject',{
            slidesPerView: 'auto',
            paginationClickable: true,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
          });
        });
      },
      initSwiperPlan() {
         this.$nextTick(() => {
          new swiper('#swiper_planhouse',{
            slidesPerView: 'auto',
            paginationClickable: true,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
          });

          new swiper('#swiper_planprice',{
            slidesPerView: 'auto',
            paginationClickable: true,
            observer:true,
            observeParents:true,
            freeMode:true,
            freeModeFluid:true
          });
        });
      },
      onTouchstart (e,data){
        //console.log(data)
        this.top =  window.event.changedTouches[0].clientY
        this.time = 0;
        for(var i = 0; i < data.length; i++){
          data[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
      onTouchend:function(e,type){
        console.log(e)
        var top =  window.event.changedTouches[0].clientY
        if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
          e.imgactive = false;
          this.keep.scroll.save();
          this.setCache(type);
          if(type == 1) {
            this.keep.go('/newscene.html',true,{sceneId:e.sceneId,pageIndex:this.scene.pageIndex-1,styleId:this.scene.styleId,areaId:this.scene.areaId,tagType:this.scene.allid,number:e.imgNumber,type:0})
          }else if(type == 2){
            this.keep.go("/shopwindowdetail2.html",true,{spaceId:e.spaceId,showGoHome:'1',cover:e.cover});
          }else if (type == 3) {
            this.keep.go("/article.html",true,{subjectArticleId:e.subjectArticleId,showGoHome:'1'});
          }
       }else{
        e.imgactive = false;
       }
      },
      gotoScene(e,type) {
        this.keep.scroll.save();
        this.setCache(type);
        this.keep.go('/newscene.html',true,{sceneId:e.sceneId,pageIndex:this.scene.pageIndex-1,styleId:this.scene.styleId,areaId:this.scene.areaId,tagType:this.scene.allid,number:e.imgNumber,type:0})
      },
      onCancel (e){
        e.imgactive = false;
      },
      gotoSpaceDetail(e,type){
        this.keep.scroll.save();
        this.setCache(type);
        this.keep.go("/shopwindowdetail2.html",true,{spaceId:e.spaceId,showGoHome:'1',cover:e.cover});
      },
      gotoPlanDetail(plan,type) {
        this.keep.scroll.save();
        this.setCache(type);
        this.keep.go("/plan_detail.html",true,{planId:plan.planId,showGoHome:'1'});
      },
      gotoPlanList(house,type) {
        this.keep.scroll.save();
        this.setCache(type);
        this.keep.cache.push('houseItem',house);
        this.keep.go("/plan_list.html",true,{houseId:house.houseId,title:house.houseName});
      },
      gotoSubjectDetail(e,type){
        this.keep.scroll.save();
        this.setCache(type);
        this.keep.go("/article.html",true,{subjectArticleId:e.subjectArticleId,showGoHome:'1'});
      },
      initSpaceData() {
        this.spaceData.forEach((item)=>{
          item.show = false;
        })
        this.spaceData[0].show = true;
      },
      iniitSceneData() {
        this.areadata.forEach((item)=>{
          item.show = false;
        })
        this.styledata.forEach((item)=>{
          item.show = false;
        })
        this.allData.forEach((item)=>{
          item.show = false;
        })

        this.areadata[0].show = true;
        this.styledata[0].show = true;
        this.allData[0].show = true;
      },
      initSubject() {
        this.subjectType.forEach((item)=>{
          item.show = false;
        })
        this.subjectType[0].show = true;
      },
      initPlanData() {
        this.planData.forEach((item)=>{
          item.show = false;
        })
        this.planHouseType.forEach((item)=>{
          item.show = false;
        })
        this.planPriceData.forEach((item)=>{
          item.show = false;
        })
        this.planData[0].show = true;
        this.planHouseType[0].show = true;
        this.planPriceData[0].show = true;
      },
      setCache(type){
        if(!type){
          type = this.showType;
        }
        if(type == 1){
         this.initSpaceData();
         this.initSubject();
         this.initPlanData();
        }else if(type == 2){
         this.iniitSceneData();
         this.initSubject();
         this.initPlanData();
        }else if(type == 3){
         this.initSpaceData();
         this.iniitSceneData();
         this.initPlanData();
        }else if (type == 4) {
         this.initSpaceData();
         this.initSubject();
         this.iniitSceneData();
        }

        this.keep.cache.push("areaData", this.areadata);
        this.keep.cache.push("styleData", this.styledata);
        this.keep.cache.push("allData", this.allData);

        this.keep.cache.push("spaceData", this.spaceData);

        this.keep.cache.push("planData", this.planData);
        this.keep.cache.push("planHouseType", this.planHouseType);
        this.keep.cache.push("planPriceData", this.planPriceData);
        
        this.keep.cache.push("subjectType", this.subjectType);

        this.keep.cache.push("showType", this.showType);
        
        if(type == 1){
          this.keep.cache.push("pageIndex", this.scene.pageIndex);
          this.keep.cache.push("data", this.scene.data);
          this.keep.cache.push("title", this.scene.title);
          let idData = [];
          idData.push(this.scene.areaId);
          idData.push(this.scene.styleId);
          idData.push(this.scene.allid);
          this.keep.cache.push("id", idData);

        }else if (type == 2) {
          
          this.keep.cache.push("pageIndex", this.space.pageIndex);
          this.keep.cache.push("data", this.space.data);
          this.keep.cache.push("title", this.space.title);
          if( !this.space.styleId){
            this.space.styleId = "null";
          }
          this.keep.cache.push("id", this.space.styleId);
        }else if (type == 3) {
          
          this.keep.cache.push("pageIndex", this.subject.pageIndex);
          this.keep.cache.push("data", this.subject.data);
          this.keep.cache.push("title", this.subject.title);
          if(!this.subject.articleTypeId){
            this.subject.articleTypeId = "null";
          }
          this.keep.cache.push("id", this.subject.articleTypeId);

        }else if (type == 4) {
          
          this.keep.cache.push("pageIndex", this.plan.pageIndex);
          this.keep.cache.push("data", this.plan.data);
          this.keep.cache.push("title", this.plan.title);

          let idData = [];
          idData.push(this.plan.styleId);
          idData.push(this.plan.houseType);
          idData.push(this.plan.priceRange);
          this.keep.cache.push("id", idData);

        }

      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/findAll.scss';
   .reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
    clear: both;
  }
  .showAppTip1{
      top:0.5rem !important;
    }
  .showAppTip2{
    top:1rem !important;
  }
  .showAppTip3{
    margin-top:0.5rem !important;
  }
</style>
