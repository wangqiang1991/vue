<template>
  <div id="findAll_vue">

    <div class="pic_tit" style="top:0;" >

       <!-- 风格类型价格区间文章类型等 -->
     <!--   <p style="text-align:center;" class="choiceName"  @click="showitem(4)">
          <span v-for="(name,index) in plan.title"><i v-if="index"> / </i>{{name}} </span>
       </p> -->
       <p class="fllter"  @click="showitem(4)" v-show="showFilter">
         <img src="../../assets/img/filterIcon.png" alt="筛选图标">
         筛选
       </p>

      <!-- 价格 区域 风格 选择类型 -->
       <div style="width:100%; position:fixed;top:0.5rem;left:0;z-index:110;" class="choiceSpace" v-show="plan.show">
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

    </div>

    <!-- 蒙版div -->
    <div class="spaceArea" @click="closeMengban" v-show="showMengban" id="mengban"></div>


    <!-- 软装方案容器 -->
      <div  style="padding-top:0;display:block;padding-bottom:0;"  class="content_box" :infinite-scroll-immediate-check="true"  v-infinite-scroll="planLoadMore" infinite-scroll-disabled="plan.loading" infinite-scroll-distance="10" >
        <div :class="{'noMoreone':moreOne}" class="houseMessage" v-show="plan.data.length">
          <p class="houseTitle">{{houseItem.houseName}}</p>
          <p class="houseDesc">{{houseItem.city}}{{houseItem.county}}{{houseItem.address}}</p>
          <div class="showCount">
            <div>
              <p>
                <img src="../../assets/img/houseTypeCountIcon.png" alt="户型Icon">
                户型数量
              </p>
              <span>{{houseItem.houseTypeCount}}</span>
            </div>
            <div style="border-right:none;">
              <p>
                <img src="../../assets/img/planCountIcon.png" alt="户型Icon">
                方案数量
              </p>
              <span>{{houseItem.planCount}}</span>        
            </div>
          </div>
        </div>
        <p v-show="plan.data.length" style="margin:0;width:100%;height:0.08rem;background:#f2f2f2;"></p>

        <div class="planContentBox"  v-for="planItem in plan.data" >
          <img v-lazy="planItem.cover+ '?imageView2/0/w/1024/h/611|imageslim'" @click="gotoPlanDetail(planItem,4)" >
          <p class="plan_title">{{planItem.planName}}</p>
          <div class="plan_message">
            <p><span>户型:</span>{{planItem.houseTypeName}}</p>
            <p><span>风格:</span>{{planItem.style.name}}</p>
            <p><span>建筑面积:</span>{{planItem.houseTypePlanRelations[0].houseType.buildArea}}m²</p>
            <p><span>价格区间:</span>{{planItem.priceRangeName}}</p>
          </div>
          
          <p style="margin:0;width:100%;height:0.15rem;background:#f2f2f2;"></p>

        </div>

        <div  v-show="!firstLoad && !plan.data.length" style="width:100%;background:white;padding:0.2rem 0;margin-top:1.5rem;">
          <img src="../../assets/img/find_noData.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
          <p style="font-size:0.16rem;color:#ddd;text-align:center;">软装方案正在完善中...</p>
        </div>

        <div class="load" v-show='plan.loadData'>
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

        <div class="reload" v-show='plan.reload' @click='reloadData(4)'>
            加载失败,点击重新加载
        </div>

        <div  v-show='!firstLoad && plan.data.length' style="width:100%;background:white;padding-top:0.2rem;padding-bottom:0.2rem;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
        </div>

      </div>
  

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
      loadFailed:loadFailed,
      firstLoad:firstLoad
    },
    data() {
      return {
        moreOne:false,
        showFilter:false,
        houseItem:{},
        houseId:null,
        firstLoad:false,
        showAppTip:true,
        loadFailed:false,
        scrollTop:false, //滚动控制位置变量
        showMengban:false, //控制蒙版变量
        styledata:[],
        planData:[],
        spaceData:[],
        areadata:[],
        allData:[],
        subjectType:[],
        planHouseType:[], //软装方案户型
        planPriceData:[], //软装方案价格
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
      document.title = '方案列表';//this.getParam('title');
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    mounted: function() {
      $('#mengban').css({'height': document.documentElement.clientHeight})
      this.houseId = this.getParam('houseId');
      this.houseItem = this.keep.cache.get("houseItem",null,'/scene_list.html');

      window.addEventListener('scroll', this.handleScroll)


      //判断缓存
      if(this.keep.isKeepAlive()) {
        this.firstLoad = false;

        this.planData = this.keep.cache.get("planData", []);
        this.planHouseType = this.keep.cache.get("planHouseType", []);
        this.planPriceData = this.keep.cache.get("planPriceData", []);

        this.plan.data = this.keep.cache.get("data", []);
        this.plan.pageIndex = this.keep.cache.get("pageIndex", 1);

        this.plan.title = this.keep.cache.get("title", ["全风格","全户型","全价格"]);

        var id = this.keep.cache.get("id", ["","",""]);
        this.plan.styleId = id[0];
        this.plan.houseType = id[1];
        this.plan.priceRange = id[2];

        this.initSwiper();
        this.initSwiperPlan();

        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });

      } else {
        this.firstLoad = true;
        this.keep.cache.remove("planData");
        this.keep.cache.remove("planHouseType");
        this.keep.cache.remove("planPriceData");
        this.keep.cache.remove("data");
        this.keep.cache.remove("pageIndex");
        this.keep.cache.remove("title");
        this.keep.cache.remove("id");

        this.findArea();
        this.findPlanType();
        this.findPlan();

       }
      
    },
    methods: {
       handleScroll () { 
        this.plan.show = false;
        this.showMengban = false;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if(scrollTop >= 200){
          this.showFilter = true;         
        }else{
          if (this.plan.data.length <= 1) {
            this.moreOne = true;
            this.showFilter = true;
          } else {
            this.showFilter = false;
            this.moreOne = false;
          } 
          
        }
      },
      reloadData(type){
        this.plan.reload = false;
        this.plan.loading = true;
        if(!this.plan.isLoading){
          this.findPlan();
        }
      },
      reload(){
        this.loadFailed = false;
        this.findArea();
        this.findPlanType();
        this.findPlan();
      },
      typeChange(type) {
        this.firstLoad = true;
        this.showMengban = false;
        this.plan.show = false;
        this.plan.loading = true;
        if(!this.plan.isLoading){
          this.findPlan();
        }
      },
      showitem(type){
        this.plan.show = !this.plan.show;
        this.showMengban = !this.showMengban;
      },
      closeMengban() {
        this.showMengban = false;
        this.plan.show = false;
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

      findPlan() {
        this.closeMengban();
        this.plan.isLoading = true;
        var params = {
          houseId:this.houseId,
          pageIndex: this.plan.pageIndex,
          styleId: this.plan.styleId,
          houseType:this.plan.houseType,
          priceRange:this.plan.priceRange
        };
        this.http.get(this).url(this.config.sceneList.planV2_url).params(params).request((res) => {
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
            
          if (this.plan.data.length <= 1) {
            this.moreOne = true;
            this.showFilter = true;
          } else {
            this.moreOne = false;
            this.showFilter = false;           
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
      planLoadMore() {
        this.plan.loading = true;
        this.plan.loadData = true;
        if(!this.plan.isLoading){
          this.findPlan();
         }
      },
      initSwiper() {
        this.$nextTick(() => {
          new swiper('#swiper_plan',{
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
      gotoPlanDetail(plan,type) {
        this.keep.scroll.save();
        this.setCache(type);
        this.keep.go("/plan_detail.html",true,{planId:plan.planId,showGoHome:'1'});
      },

      setCache(type){

        this.keep.cache.push("planData", this.planData);
        this.keep.cache.push("planHouseType", this.planHouseType);
        this.keep.cache.push("planPriceData", this.planPriceData);
          
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
  .noMoreone{
    padding-top: 0.52rem !important;
  }
  .fllter{
    width: 100%;
    height: 0.5rem;
    background-color: #FFFFFF;
    border-bottom: 1px solid #ddd;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 120;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:0.14rem;
    color:#343434;
    >img{
      display:block;
      width:0.24rem;
      height:0.24rem;
    }
  }
  .houseMessage{
    width:100%;
    height:auto;
    background:#fff;
    overflow: hidden;
    p.houseTitle{
      font-size:0.18rem;
      color:#343434;
      text-align:center;
      font-weight: 700;
      margin-top: 0.15rem;
      margin-bottom: 0.05rem;
    }
    p.houseDesc{
      width:3.35rem;
      margin:auto;
      height:auto;
      text-align:center;
      font-size:0.14rem;
      color:#cacaca;
      margin-bottom: 0.15rem;
      word-break: break-all;
    }
    div.showCount{
      width:100%;
      height:auto;
      overflow: hidden;
      border-top: 1px solid #ddd;
      >div{
        width:1.86rem;
        height:auto;
        margin-top: 0.1rem;
        margin-bottom: .1rem;
        float: left;
        border-right: 1px solid #cacaca;
        p{
          font-size:0.12rem;
          color:#343434;
          width:100%;
          display: flex;
          align-items:center;
          justify-content:center;
        }
        span{
          display:block;
          text-align:center;
          font-size:0.14rem;
          color:#343434;
        }
        img{
          display:block;;
          width:0.24rem;
          height:0.24rem;
          margin-right: 0.05rem;
        }
      }
    }
  }
</style>
