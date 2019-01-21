<template>
  <div id="goodsList2_vue">
   <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader type="1" :active="firstCategoryId" :showAppTip = "showAppTip" :class="{'showAppTip1':showAppTip}"></Vheader>
    <header :class="{'showAppTip2':showAppTip}">
      <!--<p>{{name}}</p>-->
      <div class="swiper-container" id="swiper-container" >
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="n in tabName">
            <span :class="{'active':n.show}" @click="choice(n)">{{n.name}}</span>
          </div>
        </div>
      </div>
      <!--<div class="test">
      	<div v-for="n in tabName">
      		<span :class="{'active':n.show}" @click="choice(n)" class="nameLi">{{n.name}}</span>
      	</div>
      </div>-->
    </header>

    <div class="content " v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" :class="{'showAppTip3':showAppTip}">
      <div id="nogoogs" v-show="noData" style="padding-top:0.1rem;">
        更多优质商品，敬请期待
      </div>

      <div v-for='n in goodsdata' class="goodsList" @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)'>
       
          <img :src="n.cover + '?imageView2/0/w/512/h/512|imageslim'" :class="{'imgactive':n.imgactive}" alt="n.title">
        
        <div>
          <p class="goodTitle" style="height:0.2rem;line-height: 0.2rem;">{{n.title}}</p>
          <p class="style">{{n.description}}</p>
          <p class="goodsPrice">¥{{n.minPrice}}</p>
        </div>

      </div>


      <div id="load" v-show='loadData'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

      <div id="tobottom" v-show='showbottom && goodsdata.length >= 8'>
        已经到底了哦~
      </div>

    </div>

    <!-- <img src="../../assets/img/seach_btn.png" id="search_btn"> -->


  </div>
</template>

<script>
  import swiper from 'swiper';
  import Header from '../../components/Header.vue';
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  export default {
    name: 'goodsList2',
    components: {
      Vheader: Header,
      VdownLoadApp:downLoadApp
    },
    data() {
      return {
        showAppTip:true,
        reloadflag:false,
        name: [], //分类数据
        goodsdata: [],
        pageIndex: 1,
        loading: false,
        loadData: true,
        firstCategoryId: null,
        showbottom:false,
        top: 0,
        time: 0,
        show:false,
        tabName:[],
        noData:false
      }
    },
    created() {
      document.title = "商品列表";
    },
    mounted: function() {
      if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }
      console.log(this.goodsdata)
      if(this.keep.isKeepAlive()){
        this.firstCategoryId = this.keep.cache.get('active');
        this.keep.markNotKeepAlive();
        this.pageIndex = this.keep.cache.get("pageIndex");
        this.goodsdata = this.keep.cache.get("data");
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.keep.cache.remove('active');
        this.firstCategoryId = this.getParam('firstCategoryId');
        this.keep.cache.remove("pageIndex");
        this.keep.cache.remove("data");
      }


       let tabName = this.keep.cache.get("tabName",null,'/category2.html');
       console.log("-----")
       console.log(this.firstCategoryId)
       if(tabName == null){
         let tabName = [];
         this.http.get(this).url('/app/api/category').request(function(response){
           console.log(response)
           var data = response.data.data;
           console.log(data)
           for (var i = 0;i < data.length;i++){
             tabName.push(data[i])
           }
           console.log(tabName)
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
            setTimeout(() => {
              var praentArr = $('.active').parent().prevAll();
              var width = 0;
              var lastWidth = 0;
              for(var k = 0;k < praentArr.length;k++){
                width += praentArr[k].offsetWidth;
              }
              var w = $('.active').parent().get(0).offsetWidth + 10;
              console.log("0000")
              console.log(w)
              lastWidth = width-(375-w);
              if (lastWidth < 0) {
                lastWidth = 0;
              }
              $('.swiper-wrapper').css('transform','translateX('+ -lastWidth+'px)')
            },50)
           for(var i = 0;i < tabName.length;i++){
            if(tabName[i].categoryId == this.firstCategoryId){
              console.log(i)
              tabName[i].show = true;
  //          tabName[i].imgactive = false;
            }else{
              tabName[i].show = false;
            }
            this.tabName = tabName;
          }
         },(err)=>{

         })
       }else{
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
            console.log(tabName)
            setTimeout(() => {
              var praentArr = $('.active').parent().prevAll();
              console.log($('.active'))
              var width = 0;
              var lastWidth = 0;
              for(var k = 0;k < praentArr.length;k++){
                width += praentArr[k].offsetWidth;
              }
              var w = $('.active').parent().get(0).offsetWidth + 10;
              console.log("0000")
              console.log(w)
              lastWidth = width-(375-w);

              if (lastWidth < 0) {
                lastWidth = 0;
              }
//            debugger
              $('.swiper-wrapper').css('transform','translateX('+ -lastWidth+'px)')
            },50)
        for(var i = 0;i < tabName.length;i++){
          if(tabName[i].categoryId == this.firstCategoryId){
            tabName[i].show = true;
          }else{
            tabName[i].show = false;
          }

        }
       }
       this.tabName = tabName;

    },
    methods: {
       closeTip(data){
      if(!data){
          this.showAppTip = false;
        }
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      choice(e){
        for (var i = 0; i < this.tabName.length; i++) {
          this.tabName[i].show = false;
        }
        e.show = true;
        this.pageIndex = 1;
        this.firstCategoryId = e.categoryId;
        this.goodsdata = [];
        //this.loadData = true;
        //this.showbottom = false;
        //this.loading = false;
        this.loadMore();
      },
//    getcategory(){
//      console.log(this.firstCategoryId)
//      this.http.get(this).url('/app/api/category').request(function(response){
//        var data = response.data.data;
//            for(var i=0;i<data.length;i++){
//              if(data[i].categoryId == this.firstCategoryId){
//                data[i].show = true;
//                data[i].imgactive = false;
//              }else{
//                data[i].show = false;
//              }
//            }
//            console.log(data)
//            this.name = data;
//      })
//          new swiper('#swiper-container', {
//          width: 40,
//          paginationClickable: true,
//          spaceBetween: 0,
//          observer: true,
//          observeParents: true
//        });
//  },
      loadMore() {
        console.log(123)
        this.loading = true;
        this.loadData = true;
        this.showbottom = false;
        this.getgoods(this.firstCategoryId);
      },
      getgoods: function(categoryId) {

        this.http.get(this).url('/app/api/goods').params({
            firstCategoryId: categoryId,
            pageIndex: this.pageIndex
          }).request((response) => {

            this.loadData = false;

            var data = response.data.data;
          
            for(var i = 0; i < data.length; i++) {
              data[i].imgactive = false;
            }

            if(response.data.data.length == 0) {
              this.loading = true;
              this.showbottom = true;
              if(this.goodsdata.length == 0){
                this.noData = true;  
              }
              return ;
            } else {
               this.loading = false;
               this.noData = false;
            }

            data.forEach((item) => {
              this.goodsdata.push(item);
            });

            this.pageIndex++;  
            this.keep.cache.push("data", this.goodsdata);
            this.keep.cache.push("pageIndex", this.pageIndex);

          },(err)=>{
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
          setTimeout(() => {
            this.keep.scroll.save();
            this.keep.cache.push('active',this.firstCategoryId);
            this.keep.go("/goods_detail.html", true, {
              goodsid: e.goodsId,showGoHome:'1'
            });
          })

        } else {
          e.imgactive = false;
        }
      },
      onCancel(e) {
        e.imgactive = false;
      },

      goodsdetail: function(e) {
        console.log(e)
        this.keep.scroll.save();
        this.keep.go('/goods_detail.html', true, { goodsid: e.goodsId,showGoHome:'1'})
      }
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
