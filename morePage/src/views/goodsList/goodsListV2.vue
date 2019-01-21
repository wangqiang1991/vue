<template>
  <div id="goodsList2_vue">
    <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader type="1" :active="firstCategoryId" :showAppTip = "showAppTip" :class="{'showAppTip1':showAppTip}"></Vheader>
    <header :class="{'showAppTip2':showAppTip}" style="border-bottom:1px solid #ddd;">
      <div class="swiper-container" id="swiper-container" >
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="n in tabName">
            <span :class="{'active':n.show}" @click="choice(n)">{{n.name}}</span>
          </div>
        </div>
      </div>
    </header>
    <img src="../../assets/img/go_to_home_icon.png" style="width:0.64rem;height:0.64rem;" alt="go_to_home" id="goHome" @click="goToHome" v-if="showGoHome">
    <div class="content " v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" :class="{'showAppTip3':showAppTip}">
      <div id="nogoogs" v-show="!firstLoad && !goodsdata.length"  style="width:100%;background:white;padding:1rem 0 0;">
        <img src="../../assets/img/noGoodsData.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
        <p style="font-size:0.16rem;color:#ddd;text-align:center;">更多优质商品正在接近中</p>
      </div>

      <div v-for='n in goodsdata' class="goodsList" @click="gotoGoods(n)">
      <!--  @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)'> -->
       
        <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" :class="{'imgactive':n.imgactive}" alt="n.title">
        
        <div>
          <p class="goodTitle" style="height:0.2rem;line-height: 0.2rem;font-size:0.16rem;color:#343434;">{{n.title}}</p>
          <p class="style" style="color:#999;height:0.18rem;line-height: 0.18rem;">{{n.description ? n.description : '无'}}</p>

          <p class="goodsPrice" style="height:0.42rem;margin-bottom:0;" v-show="!n.discountType">¥{{n.minPrice}}</p>
          <div class="goods_discount" v-show="n.discountType == 2">
            <p>¥{{n.discountPrice}}  <span>¥{{n.minPrice}}</span></p> 
            <div class="goods_tag">{{n.discountTag}}</div>
          </div>
          <div class="goods_amount" v-show="n.discountType == 3">
            <p>¥{{n.minPrice}}</p> 
            <div class="goods_tag">{{n.discountTag}}</div>
          </div>


        </div>

      </div>

      <div id="load" v-show='loadData'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

      <div id="tobottom" v-show='showbottom && goodsdata.length' style="width:100%;background:white;padding:0.2rem 0;">
        <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>


    </div>

    <!-- <img src="../../assets/img/seach_btn.png" id="search_btn"> -->
    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
  import swiper from 'swiper';
  import Header from '../../components/Header.vue';
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'goodsList2',
    components: {
      Vheader: Header,
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      VdownLoadApp:downLoadApp
    },
    data() {
      return {
        showGoHome:true,
        loadFailed:false,
        firstLoad:false,
        showAppTip:true,
        reloadflag:false,
        name: [], //分类数据
        goodsdata: [],
        pageIndex: 1,
        loading: false,
        loadData: true,
        firstCategoryId: null,
        secondCategoryId:null,
        showbottom:false,
        top: 0,
        time: 0,
        show:false,
        tabName:[],
        noData:false
      }
    },
    created() {
      let title = this.keep.cache.get('categoryName',null,'/category2.html');
      document.title = title ? title : '商品列表';
    },
    mounted: function() {
      if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }

      if(this.keep.isKeepAlive()){
        this.firstLoad = false;
        this.firstCategoryId = this.keep.cache.get('firstCategoryId');
        this.secondCategoryId = this.keep.cache.get('secondCategoryId');
        this.pageIndex = this.keep.cache.get("pageIndex");
        this.goodsdata = this.keep.cache.get("data");
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.firstLoad = true;
        this.keep.cache.remove('firstCategoryId');
        this.keep.cache.remove('secondCategoryId');
        this.firstCategoryId = this.getParam('firstCategoryId');
        this.secondCategoryId = this.getParam('secondCategoryId');
        this.keep.cache.remove("pageIndex");
        this.keep.cache.remove("data");
      }

      this.showGoHome = this.getParam('showGoHome') == '1' ? false : true;
      let tabName = this.keep.cache.get("tabName",null,'/category2.html');
      console.log(tabName);
      if (!tabName) {
        this.getcategory();
      } else {
        this.setTableName(tabName);
      }
      

    },
    methods: {
      goToHome() {
        this.keep.go('/category2.html',false);
      },
      getcategory(){
        this.http.get(this).url(this.config.category.list_v2).request(function(response){
          if (response.data.code != 0) {
             return ; 
          }  
          var data = response.data.data;
          data.forEach((item)=>{
            item.showCategory2 = false;
            if(item.children){
              var obj = {};
              obj.name = "全部";
              obj.parentId = item.categoryId;
              obj.categoryId = null;
              obj.all = true;
              item.children.unshift(obj);
            }else{
              item.children = [];
              var obj = {};
              obj.name = "全部";
              obj.parentId = item.categoryId;
              obj.categoryId = null;
              obj.all = true;
              item.children.unshift(obj);
            }

            if (item.categoryId == this.firstCategoryId) {
              this.setTableName(item.children);                    
            }
          });
        },(err)=>{console.log(err)})
      },
      reload(){
        this.loadFailed = false;
        this.loading = false;
        this.getgoods(this.firstCategoryId,this.secondCategoryId);
      },
      setTableName(tabName) {
        console.log(this.secondCategoryId)
        for(var i = 0;i < tabName.length;i++){
          if (this.secondCategoryId == "null") {
            tabName[0].show = true;
            this.secondCategoryId = null;
          }else if(this.secondCategoryId != "null" && tabName[i].categoryId == this.secondCategoryId){
            tabName[i].show = true;
          }else{
            tabName[i].show = false;
          }
        }
        this.initLayer();
        this.setTableWidth();
        this.tabName = tabName;
      },
      initLayer() {
        this.$nextTick(() => {
          new swiper('#swiper-container', {
              paginationClickable: true,
              spaceBetween: 0,
              observer: true,
              slidesPerView: 'auto',
              freeMode:true,
              freeModeFluid:true,
              calculateHeight : true,
              visibilityFullFit: true
          });
        });
      },
      setTableWidth() {
        setTimeout(() => {
          var praentArr = $('.active').parent().prevAll();
          var width = 0;
          var lastWidth = 0;
          for(var k = 0;k < praentArr.length;k++){
            width += praentArr[k].offsetWidth;
          }
          var w = $('.active').parent().get(0).offsetWidth + 10;
          lastWidth = width-(375-w);
          if (lastWidth < 0) {
            lastWidth = 0;
          }
          $('.swiper-wrapper').css('transform','translateX('+ -lastWidth+'px)')
        },50)
      },
      closeTip(data){
        if(!data){
          this.showAppTip = false;
        }
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = true;
        this.loadData = true;
        this.showbottom = false;
        this.getgoods(this.firstCategoryId,this.secondCategoryId);
      },
      choice(e){
        for (var i = 0; i < this.tabName.length; i++) {
          this.tabName[i].show = false;
        }
        e.show = true;
        this.pageIndex = 1;
        this.firstCategoryId = e.parentId;
        this.secondCategoryId = e.categoryId;
        this.goodsdata = [];
        this.firstLoad = true;
        this.loadMore();
      },
      loadMore() {
        this.loading = true;
        this.loadData = true;
        this.showbottom = false;
        this.getgoods(this.firstCategoryId,this.secondCategoryId);
      },
      //查询商品列表
      getgoods: function(firstCategoryId,secondCategoryId) {
        if(secondCategoryId == "null"){
          secondCategoryId = null;
        }
        this.http.get(this).url(this.config.goods.goods_list).params({
            firstCategoryId: firstCategoryId,
            secondCategoryId:secondCategoryId,
            pageIndex: this.pageIndex
          }).request((response) => {

            this.firstLoad = false;
            this.loadData = false;

            var data = response.data.data;
          
            for(var i = 0; i < data.length; i++) {
              data[i].imgactive = false;
            }

            if(response.data.data.length == 0) {
              this.loading = true;
              this.showbottom = true;
            } else {
              this.loading = false;
              this.noData = false;
              this.pageIndex++;  
            }

            data.forEach((item) => {
              this.goodsdata.push(item);
            });

            if(this.goodsdata.length == 0){
              this.noData = true;  
            }

            this.keep.cache.push("data", this.goodsdata);
            this.keep.cache.push("pageIndex", this.pageIndex);

          },(err)=>{
            if(this.pageIndex == 1){
              this.loadFailed = true;
            }
            this.firstLoad = false;
            this.reloadflag = true;
            this.loadData = false;
          });

      },
      //列表动画
      onTouchstart(e) {
        var top = window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0; i < this.goodsdata.length; i++) {
          this.goodsdata[i].imgactive = false;
        }
        e.imgactive = true;
        setTimeout(() => {
          this.time = 200;
        }, 200)
      },
      onTouchend: function(e) {
        var top = window.event.changedTouches[0].clientX
        if(this.time < 200 && this.top >= (top - 3) && this.top <= ( top + 3 )) {
          e.imgactive = false;
          if(this.secondCategoryId == null){
            this.secondCategoryId = "null";
          }
          this.keep.scroll.save();
          setTimeout(() => {
          this.keep.cache.push('firstCategoryId',this.firstCategoryId);
          this.keep.cache.push('secondCategoryId',this.secondCategoryId);
          this.keep.go("/goods_detail.html", true, {goodsid: e.goodsId,showGoHome:'1'});
          })
        } else {
          e.imgactive = false;
        }
      },
      gotoGoods(e) {
        if(this.secondCategoryId == null){
          this.secondCategoryId = "null";
        }
        this.keep.scroll.save();
        this.keep.cache.push('firstCategoryId',this.firstCategoryId);
        this.keep.cache.push('secondCategoryId',this.secondCategoryId);
        this.keep.go("/goods_detail.html", true, {goodsid: e.goodsId,showGoHome:'1'});
      },
      onCancel(e) {
        e.imgactive = false;
      },
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/goodsList2.scss';
</style>

<style lang="scss">
  #goodsList2_vue{
     #header_vue{
    .logo{
      opacity:0;
      display:none;
    }
    .shopcat{
      opacity:0;
      display:none;
    }
    .searchArea{
      //border-radius:0.15rem;
      position:absolute;
      width:3.4rem;
      left:0.175rem;
    }

   }
   #goHome{
    position: fixed;
    bottom: .4rem;
    right: 0.15rem;
    width: 0.44rem;
    height: 0.44rem;
    z-index: 99;
   }
    #reload{
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
  }
</style>
