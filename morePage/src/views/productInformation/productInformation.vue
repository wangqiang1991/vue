<template>
  <div id="productInformation_Vue" style="display:none">
  <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <div class="main" :class="{'showAppTip1':showAppTip}"> 
      <!--<div class="couponsBg">
        <div class="couponsBox">
        	<div class="left">
        		<div class="box1">
        			<p>¥100</p>
        			<p>买2件可用</p>
        		</div>
        		<div class="box2">
        			<p>沙发专属优惠券沙发专属优惠券沙发专属优惠券</p>
        			<div>
        			  <p>·限24小时内使用限24小时内使用</p>
        			  <p>·仅可用于购买该商品仅可用于购买该商品</p>
        			</div>
        		</div>
        	</div>
        	<div class="right">
            <p>立即领取</p>
          </div>
        </div>
      </div>-->
      <div>
       <!--  <div class="collectBox">
          <img src="../../assets/img/collectProPic.png" class="collectPic" @click="addCollect" v-if="showCollect" />
          <img src="../../assets/img/collectProPic1.png" class="collectPic" v-else/>
        </div> -->
        <div class="banner">
          <mt-swipe :auto="4000">
            <mt-swipe-item v-for='n in banner' :key='n.keys'><img @click="preview(n.images)" :src="n.images + '?imageView2/0/w/1024/h/1024|imageslim'"></mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
      <div class="productTitle">
        <p class="productName">{{goods.title}}</p>
        <p @click="showMore" :class=" descriptionMore ? 'productContentShort' : 'productContentMore' ">{{goods.description}}</p>
        <p class="productPrice">￥{{price}}</p>
        <!-- <img src="../../assets/img/couponPic.png" @click="coupons" v-show="showCoupons" /> -->
      </div>
      <div class="choiceSize1" id="choiceSize1" @click="AddToCart">
        <p>规格选择</p>
        <img src="../../assets/img/right.png" />
        <img src="../../assets/img/line.png" />
      </div>
      <div class="appraise" @click="goCommentaruse(n)">
        <p>评价 ({{goods.commentsCount}})</p>
        <img src="../../assets/img/right.png" />
      </div>
      <div class="productInformation">
        <p style='font-size:0.16rem;'>商品介绍</p>
        <div class="productContent1">
          <article-content ref="articleContent" class="content"></article-content>
        </div>
      </div>
      <p class="title" v-show="similarGoodsArr.length != 0">— 为您推荐 —</p>
      <div class="recommended" v-show="similarGoodsArr.length != 0">

        <ul>
          <li v-for="similarGood in similarGoodsArr" @touchcancel='onCancel(similarGood)' @touchstart='onTouchstart1(similarGood)' @touchend='onTouchend1(similarGood)'>

              <img :src="similarGood.detail.cover+ '?imageView2/0/w/512/h/512|imageslim'" :class="{'imgactive':similarGood.imgactive}" />
           <div>
              <p class="goodTitle" style="height:0.2rem;line-height: 0.2rem;">{{similarGood.detail.title}}</p>
              <p class="style">{{similarGood.detail.description}}</p>
             <p class="goodsPrice">¥{{similarGood.dynamicId.price/100}}</p>
           </div>

          </li>
        </ul>
      </div>
      <div class="choiceSize cd-popup2" id="choiceSize">
        <div class="cd-popup-container2">
          <!--<div id="choiceSizeTitle">
            <p>规格选择</p>
               <img src="../../assets/img/closePic.png" class="cancel"/>
          </div>-->
          <div class="goodsDetailArea">
            <div class="goodsPicBox">
              <img class="goodsCover" :src="cover+ '?imageView2/0/w/512/h/512|imageslim'" />
            </div>
            <img src="../../assets/img/down.png" class="downPic" />
            <!--<img src="../../assets/img/up.png" class="upPic"/>-->
            <p class="goodsTitle">{{name}}</p>
            <p class="goodsPrice">￥{{price}}</p>
          </div>
          <div class="choice">
            <div id="choice_style">
               <p v-for='n in style' @click='choicestyle(n)' :class="{'goodschoice':n.goodschoice}">{{n.name}} </p>
            </div>
            <div id="choicenumber">
              <p>选择数量 <b>库存 {{maxnumber}}件</b></p>
              <p>
                <span @click='reduce'>
                  <img src="../../assets/img/reduce.png" />
                </span>
                <span class="number">{{count}}</span>
                <span @click='add'>
                  <img src="../../assets/img/goodsadd.png" />
                </span>
              </p>
            </div>

          </div>
        </div>
        <div>
          <p class="AddToCart1" @click="addshipcat()">加入购物车</p>
          <p class="noCount">无库存</p>
          <p class="alreadyDown">已下架</p>
          <p class="buyNow1" @click="createOrder()">立即购买</p>
        </div>
      </div>
      
      
      
      <!--优惠券弹框-->
      <div class="coupons cd-popup2" id="coupons">
        <div class="cd-popup-container2" style="height: 50%;">
          <div class="couponsBox1" v-for="coupon in couponsArr" @click = "getSingleCoupon(coupon.couponId)">
            <div class="box">
              <p class="amount">{{coupon.name}}</p>
              <p class="how">{{coupon.description}}</p>
              <p class="time">*{{coupon.expireDescription}}</p>
             
            </div>
          </div>
        </div>
        <div>
          <p class="getCouponsBtn" @click="getAllCoupons">全部领取</p>
        </div>
      </div>
      
      
      
    </div>
    <div class="fixedArea">
      <div style="width: 1.20rem;border-top: 1px solid #f2f2f2;">
        <img src="../../assets/img/customerService.png" class="customerServicePic" @click="tocustomerService" />
        <span class="customerService" @click="tocustomerService">客服</span>
        <mt-badge size="small" class="goodsnum" v-show='showCart'>{{goodsNumber}}</mt-badge>
        <img src="../../assets/img/shoppingCart.png" class="shoppingCartPic" @click="goShoppingCart" />
        <span class="shoppingCart" @click="goShoppingCart">购物车</span>
      </div>
      <p class="AddToCart" @click="AddToCart"  v-if="skuPull == false">加入购物车</p>
      <p class="buyNow" @click="buyNow" v-if="skuPull == false">立即购买</p>
      <p class="alreadyDown1" v-if="skuPull" style="width:2.55rem;left:1.2rem;">已下架</p>
    </div>

  </div>
</template>

<script>
  import ArticleContent from '../../components/contentV2.vue';
  import { Badge } from 'mint-ui';
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  export default {
    name: 'productInformation',
    components: {
      ArticleContent,
      VdownLoadApp:downLoadApp
    },
    data() {
      return {
        showAppTip:true,
        count: 1,
        banner: [],
        goods: [],
        style: [],
        price: 0,
        maxnumber: 0,
        styleId: null,
        goodsId: null,
        totalCount: 0,
        showCollect: true,
        goodsNumber:'',
        showCart: false,
        cover: '',
        name: '',
        couponsArr: [],
        couponsIdArr: [],
        showCoupons: false,
        top:0,
        time:0,
        similarGoodsArr: [],
        skuPull:'',
        showAddToCart: false,
        showbuyNow: false,
        descriptionMore:true
      }
    },
    created() {
      document.title = "商品详情"
    },
    activated() {
      document.title = "商品详情";
    },
    mounted: function() {
      this.goodsId = (this.getParam('goodsid') == null) ? this.getParam('goodsId') : this.getParam('goodsid');
      var link = window.location.href
      var index = link.indexOf('/product_information.html')
      var index1 = link.indexOf('?')
      var url = link.slice(0,index);
      var url1 = link.slice(index1);
      var gotoLink = url + '/goods_detail.html' + url1;
      console.log(index,index1,url,url1,gotoLink)
      window.location.replace(gotoLink);
      return ;
      this.showShoppingCartCount();
      if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }
      $('.addCollect').click(function(event) {
        event.stopPropagation();
      })
      this.$nextTick(function() {
        $("#choiceSize").on("touchmove", function() {
          event.preventDefault();
        });
        $("#choiceSize").on("click", function() {
          event.preventDefault();
        });
      });
      

      this.http.get(this).url('/app/api/goods/:goodsId').restful({
        goodsId: this.goodsId
      }).request((req) => {
        var data = req.data.data;
        this.skuPull = true;//data.skuPull;
        console.log(this.skuPull)
        if(data.coupons.length != 0) {
          data.coupons.forEach((n) => {
            this.couponsArr.push(n);
          })
          this.showCoupons = true;
        } else {
          this.showCoupons = false;
        }
        if(data.collection == true) {
          this.showCollect = false;
        } else {
          this.showCollect = true;
        }
        var banner = data.banner.split(',');
        for(var i = 0; i < banner.length; i++) {
          var obj = {};
          obj.keys = i;
          obj.images = banner[i];
          this.banner.push(obj);
        }
        for(var i = 0; i < data.styles.length; i++) {
          data.styles[i].goodschoice = false;
        }
        this.price = data.minPrice + ' ~ ￥' + data.maxPrice;
        this.goods = data;
        this.style = data.styles;
        this.cover = this.goods.cover;
        this.robtoNumber = data.goodsNumber;
        if(data.styles && data.styles.length > 0) {
          var newArr = [];
          for(var i = 0;i < data.styles.length;i++){
            if(data.styles[i].count != 0){
              newArr.push(i);
              this.choicestyle(data.styles[newArr[0]]);
            }else{
              this.choicestyle(data.styles[0]);
            }
          }
//        this.choicestyle(data.styles[0]);
        }
        if(data.article != null) {
          this.$refs.articleContent.loadContent(data.article.articleId);
        }
      })
      this.loadSimilarGoods();
    },
    methods: {
      closeTip(data){
      if(!data){
          this.showAppTip = false;
        }
      },
      onTouchstart1(e) {
        var top = window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0; i < this.similarGoodsArr.length; i++) {
          this.similarGoodsArr[i].imgactive = false;
        }
        e.imgactive = true;
        setTimeout(() => {
          this.time = 200;
        }, 200)
      },
      onTouchend1(e) {
        var top = window.event.changedTouches[0].clientX
        if(this.time < 200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ) {
          e.imgactive = false;
          setTimeout(() => {
            this.keep.scroll.save();

            this.keep.go("/goods_detail.html", true, {
              goodsid: e.detail.goodsId,showGoHome:'1'
            });
          })

        } else {
          e.imgactive = false;
        }
      },
      onCancel(e) {
        e.imgactive = false;
      },
      loadSimilarGoods() {
//      相识
        this.http.get(this).url('/app/api/goods/similarity').params({
          goodsId:this.goodsId,
          size: 8
        }).request((response) => {
          var data = response.data.data;
          data.forEach((n) => {
            n.imgactive = false;
            this.similarGoodsArr.push(n)
          })
        })
      },
      tocustomerService() {
        this.goToRobot({'customField2':this.goods.title,'customField4':this.goods.goodsNumber})
        //window.location.href = 'https://www.sobot.com/chat/h5/index.html?sysNum=3cbfaabaed5240f7b8c71caf1eb2696b&uname=%E5%A4%A7%E7%A5%9E&tel=13730694002&face=http%3a%2f%2foy3ws2wwt.bkt.clouddn.com%2fo_1c033qp2h10lgqcfqpdmm1j1j3c.png&email=284885166@qq.com&realname=%E9%97%AB%E6%B2%88&params=%7b%22customField1%22%3a%22123123123123%22%7d'
      },
//    领取
      getAllCoupons() {
        this.http.post(this).url("app/api/coupon/batch/:goodsId").restful({
          goodsId: this.goodsId
        }).request((response) => {
          if(response.data.data == 'success') {
            this.showSuccess('领取成功')
            $('.coupons').removeClass('is-visible2');
            $('.main').removeClass("mianshort");
          }
        })
      },
      //获取单个优惠券
      getSingleCoupon(couponId) {
        this.http.post(this).url("app/api/coupon/:couponId").restful({
          couponId: couponId
        }).request((response) => {
          if(response.data.data == 'success') {
              this.showSuccess('领取成功')
              $('.coupons').removeClass('is-visible2');
              $('.main').removeClass("mianshort");
            }
        })
      },
      coupons() {
        event.preventDefault();
        $('.coupons').addClass('is-visible2');
        $('.main').addClass("mianshort");
        //        关闭弹框
        $(".cd-popup2").click(function(event) {
          if($(event.target).is('.cd-popup2')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
            $('.main').removeClass("mianshort");
          }
        });
        //      $('.couponsBg').css('display','block');
        //      $(".couponsBg").click(function (event) {
        //        if ($(event.target).is('.couponsBg')) {
        //          event.preventDefault();
        //          $('.couponsBg').css('display','none');
        //        }
        //      });
      },
      preview(image) {
        var images = [];
        this.banner.forEach((item) => {
          images.push(item.images);
        });
        this.wx.previewImage({
          current: image, // 当前显示图片的http链接
          urls: images // 需要预览的图片http链接列表
        });
      },
//    查询购物车数量
      showShoppingCartCount() {
        this.http.get(this).url('app/api/shopping-cart/count').request(function(response) {
          this.goodsNumber = response.data.data;
          if(this.goodsNumber > 99) {
            this.goodsNumber = '99+';
          }
          if(this.goodsNumber == 0) {
            this.showCart = false;
            $('.mint-badge').hide();
          }else{
            this.showCart = true;
            $('.mint-badge').show();
          }
        })
      },
//    收藏商品
      addCollect() {
        var goodsId = this.getParam('goodsid');
        this.http.post(this).url('/app/api/goods/collection').params({
          goodsId:this.goodsId
        }).request(function(response) {
          this.showSuccess('收藏成功')
          this.showCollect = false;
        }, function(err) {
         // this.showMessage('收藏失败')
        })
      },
      AddToCart() {
        event.preventDefault();
        $('.choiceSize').addClass('is-visible2');
        this.showAddToCart = true;
        this.showbuyNow = false;
        //        关闭弹框
        $(".cd-popup2").click(function(event) {
          if($(event.target).is('.downPic') || $(event.target).is('.cd-popup2')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        });
        if(this.skuPull == true){
          $('.alreadyDown').css('display', 'block');
          $('.AddToCart1').css('display', 'none');
        }else{
          $('.alreadyDown').css('display', 'none');
          if(this.maxnumber == 0){
            $('.noCount').css('display', 'block');
            $('.AddToCart1').css('display', 'none');
          }else{
            $('.noCount').css('display', 'none');
            $('.AddToCart1').css('display', 'block');
          }
        }
        $('.buyNow1').css('display', 'none');
      },
      buyNow() {
        event.preventDefault();
        $('.choiceSize').addClass('is-visible2');
        this.showAddToCart = false;
        this.showbuyNow = true;
        //        关闭弹框
        $(".cd-popup2").click(function(event) {
          if($(event.target).is('.downPic') || $(event.target).is('.cd-popup2')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        });
        if(this.skuPull == true){
          $('.alreadyDown').css('display', 'block');
          $('.buyNow1').css('display', 'none');
        }else{
          $('.alreadyDown').css('display', 'none');
          if(this.maxnumber == 0){
            $('.noCount').css('display', 'block');
            $('.buyNow1').css('display', 'none');
          }else{
            $('.noCount').css('display', 'none');
            $('.buyNow1').css('display', 'block');
          }
        }
        $('.AddToCart1').css('display', 'none');

      },
      showMore(){
        this.descriptionMore = !this.descriptionMore;
      },
      choicestyle(n) {
        for(var i = 0; i < this.style.length; i++) {
          this.style[i].goodschoice = false;
        }
        if(n.count == 0) {
//        this.$toast('对不起，该商品暂无库存，请选择其他规格');
          n.goodschoice = true;
          $('.noCount').css('display', 'block');
          $('.AddToCart1').css('display', 'none');
          $('.buyNow1').css('display', 'none');
        } else {
          if(this.showAddToCart == true){
            $('.AddToCart1').css('display', 'block');
            $('.buyNow1').css('display', 'none');
          }else{
            $('.AddToCart1').css('display', 'none');
          }
          if(this.showbuyNow == true){
            $('.AddToCart1').css('display', 'none');
            $('.buyNow1').css('display', 'block');
          }else{
            $('.buyNow1').css('display', 'none');
          }
          $('.noCount').css('display', 'none');
          n.goodschoice = true;
        }
        this.totalCount = n.totalCount;
        this.price = n.price;
        this.maxnumber = n.count;
        this.count = 1;
        this.styleId = n.styleId;
        this.goodsId = n.goodsId;
        if(n.cover){
          this.cover = n.cover;
        }else{
          this.cover = this.cover;
        }
        this.name = n.name;
      },
      addshipcat() {
        if(this.styleId == null) {
          this.$toast({
            message: '请先选择规格',
            position: 'bottom',
            duration: 1000
          });
          return false;
        }
//      else if(this.maxnumber == 0){
//        this.$toast('对不起，该商品暂无库存，请选择其他规格');
//        console.log('333')
//        return;
//      }
        else {
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          $('#choiceSize').removeClass('is-visible2');
          var users = this.getUserData('user')
          var memberId = JSON.parse(users).memberId;
//        加入购物车
          this.http.postJson(this).url('app/api/shopping-cart').params({
            goodsId: this.goodsId,
            styleId: this.styleId,
            memberId: memberId,
            amount: this.count
          }).request((req) => {
              this.$indicator.close();
              this.showMessage('加入成功');
              //this.goodsNumber++;
            }, (err) => {
              this.$indicator.close();
              //this.showError("加入失败")
            }, (response) => {
              this.$indicator.close();
              //this.showError(response.data.message)
            }

          )
        }
        var that = this;
        setTimeout(function(){
          that.showShoppingCartCount();
        },200)
      },

      /**
       * 功能:创建订单
       */
      createOrder() {

        if(this.styleId == null) {
          this.$toast({
            message: '请先选择规格',
            position: 'bottom'
          });
          return;
        }

        let items = [];

        let item = {};
        item.goodsId = this.goodsId;
        item.styleId = this.styleId;
        item.amount = this.count;
        item.outright = true;
        items.push(item);

        this.$indicator.open({
          spinnerType: 'fading-circle'
        });
        $('#choiceSize').removeClass('is-visible2');
//      立即购买
        this.http.postJson(this).url("/app/api/order").params({
          items: items
        }).request(function(response) {
          this.$indicator.close();

          let orderId = response.data.data;
          // 页面跳转
          this.keep.go("/confirm_order.html", false, {
            orderId: orderId
          });
        }, function(error) {
          this.$indicator.close();
          //this.showError("服务器繁忙")
        }, function(response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        });
      },

      add() {
        if(this.maxnumber == 0) {
          this.$toast({
            message: '该商品暂无库存',
            position: 'bottom',
            duration: 1000
          });

        } else if(this.count < this.maxnumber) {
          this.count++;
        }
      },
      reduce() {
        if(this.count > 1) {
          this.count--;
        }
      },
      goCommentaruse(e) {
        this.keep.go("/product_commentaries.html", false, {
          goodsid: this.goods.goodsId
        });
      },
      goShoppingCart() {
        this.keep.go("/shopping_cart.html", false);
      }

    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/productInformation.scss';
  .showAppTip1{
      margin-top:0.5rem !important;
  }
  .mianshort{
    height:4rem;
    overflow: hidden;
  }    
</style>
