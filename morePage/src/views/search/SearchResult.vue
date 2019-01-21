<template>
  <div id="searchResult_vue">
    <Vheader type="3" v-bind:word="keyword" @keyword='searchResult'></Vheader>
    <!-- <div class="all">
      ∨
    </div> -->
    <div class="spaceArea"></div>

    <div class="content" v-infinite-scroll="getGoods" infinite-scroll-disabled="loading" infinite-scroll-distance="10" v-show="!emptyResult">

      <div class="productBoxFather">
        <div class="productBox" v-for="product in productArray" @click="gotoGoods(product)" >
         <!-- @touchcancel='onCancel(product)' @touchstart='onTouchstart(product)' @touchend='onTouchend(product)'> -->
            <img :src="product.detail.cover+ '?imageView2/0/w/512/h/512|imageslim'"  :class="{'productPicBoxActive':product.productPicBoxActive}"/>
          <div>
             <p class="title" style="height:0.2rem;line-height: 0.2rem;font-size:0.16rem;color:#343434;">{{product.detail.title}}</p>
             <p class="style" style="color:#999;height:0.18rem;line-height: 0.18rem;">{{product.detail.description ? product.detail.description : '无'}}</p>

             <p class="price" style="margin-bottom:0;height:0.42rem;" v-show="!product.detail.discountType">¥{{product.dynamicId.price/100}}</p>
             <div class="goods_discount" v-show="product.detail.discountType == 2">
               <p>¥{{product.dynamicId.discountPrice/100}}  <span>¥{{product.dynamicId.price / 100}}</span></p> 
               <div class="goods_tag">{{product.detail.discountTag}}</div>
             </div>
             <div class="goods_amount" v-show="product.detail.discountType == 3">
               <p>¥{{product.dynamicId.price/100}}</p> 
               <div class="goods_tag">{{product.detail.discountTag}}</div>
             </div>

          </div>
        </div>
       
      </div>

      <div id="load" v-show='loadingMore'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

     
      <div v-show="showMore" style="width:100%;background:white;padding:0.2rem 0;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>

    </div>

    <div class="emptyArea" v-show="emptyResult" >
      <div> 
        <img src="../../assets/img/find_noData.png" class="noResult"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
        <p style="font-size:0.16rem;color:#ddd;text-align:center;">世界上最遥远的距离<br> 莫过于你知道我而我不知道你</p>
      </div>
    </div>
  
    
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad'></firstLoad>

  </div>
</template>

<script>
  import Header from '../../components/Header.vue';
  import Menu from '../../components/Menu.vue';
  import Load from '../../components/Loading.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  export default {
    name: 'searchResult',
    components: {
      Vheader: Header,
      Vmenu: Menu,
      Vload: Load,
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        firstLoad:false,
        loadFailed:false,
        reloadflag:false,
        productArray: [],
        keyword: '',
        emptyResult: false,
        pageIndex: 1,
        pageSize: 8,
        loading: false,
        loadingMore: false,
        showMore: false
      }
    },
    created() {
      document.title = "搜索结果"
    },
    mounted: function() {
      $('.emptyArea').css({'height': document.documentElement.clientHeight});
      //    this.getGoods();
      this.keyword = this.getParam('keyword');
      console.log(this.keyword)
      this.val = this.keyword;
      if(this.keep.isKeepAlive()) {
        this.firstLoad = false;
        this.productArray = this.keep.cache.get('productArray');
        this.pageIndex = this.keep.cache.get('pageIndex');
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      } else {
        this.firstLoad = true;
        this.keep.cache.remove('productArray');
        this.keep.cache.remove('pageIndex');
      }
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.getGoods();
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      searchResult(data){
        console.log('----------')
        console.log(data);
        this.productArray = [];
        for(var i = 0;i < data.length-1;i++){
          this.productArray.push(data[i]);
        }
        this.keyword = data[data.length-1].keyword;
        console.log(this.keyword);
        this.val  = this.keyword;
        this.pageIndex = 2;
        this.loading = false;
//      data.forEach((n) => {
//        this.productArray.push(n);
//      })
        console.log(this.productArray)
        if(this.productArray.length == 0 && data.length == 1) {
          this.emptyResult = true;
        }else{
          this.emptyResult = false;
        }
      },
      getGoods() {
        this.loading = true;
        this.loadingMore = true;
        console.log(this.pageIndex)
        this.http.get(this).url(this.config.find.goods).params({
          keyword: this.keyword,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).request(function(response) {
          this.firstLoad = false;
          console.log(response)
          if(response.data.code != 0){
            return ;
          }
          var data = response.data.data;
          this.loadingMore = false;

          if(data.length == 0) {
            this.loading = true;
            this.showMore = true;
          } else {
            this.loading = false;
            this.pageIndex++;
          }

          for(var i = 0; i < data.length; i++) {
            data[i].productPicBoxActive = false;
          }

          data.forEach((n) => {
            this.productArray.push(n);
          })

          if(this.productArray.length == 0 && data.length == 0) {
            this.emptyResult = true;
          }

          this.keep.cache.push('productArray', this.productArray);
          this.keep.cache.push('pageIndex', this.pageIndex);

        },(err)=>{
          if(this.pageIndex == 1){
            this.loadFailed = true;
          }
          this.firstLoad = false;
          this.reloadflag = true;
          this.loadingMore = false;
        })
      },
      onTouchstart(e) {
        var top = window.event.changedTouches[0].clientY
        // var top = document.body.scrollTop || document.documentElement.scrollTop;
        // console.log(top)
        this.top = top;
        this.time = 0;
        for(var i = 0; i < this.productArray.length; i++) {
          this.productArray.productPicBoxActive = false;
        }
        e.productPicBoxActive = true;
        setTimeout(() => {
          this.time = 200;
        }, 200)

        // setTimeout(function(){
        //    this.time = 200;

        // }.bind(this),200)
      },
      onTouchend: function(e) {
        console.log(window.event)
        // var top = document.body.scrollTop || document.documentElement.scrollTop;
        // console.log(top)
        var top = window.event.changedTouches[0].clientY
        if(this.time < 200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ) {
          e.productPicBoxActive = false;
          setTimeout(() => {
            //        this.keep.scroll.save();
            console.log(e)
            this.keep.scroll.save();
            this.keep.go('/goods_detail.html', true, {
              goodsid: e.detail.goodsId,showGoHome:'1'
            })
          })

        } else {
          e.productPicBoxActive = false;
        }
      },
      gotoGoods(e) {
        this.keep.scroll.save();
        this.keep.go('/goods_detail.html', true, {
          goodsid: e.detail.goodsId,showGoHome:'1'
        })
      },
      onCancel(e) {
        e.productPicBoxActive = false;
      }
      
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/searchResult.scss';
  #searchResult_vue {
    #header_vue {
      .logo {
        opacity: 0;
        display:none;
      }
      .shopcat {
        opacity: 0;
        display:none;
      }
      .searchArea {
        //border-radius: 0.15rem;
        position: absolute;
        width: 3.4rem;
        left: 0.175rem;
      }
    }
   #reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }
  .content > div > div:nth-child(even){
    border-right: 0;
  }
  }
</style>