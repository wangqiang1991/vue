<template>
  <div id="planDetail_vue">
    <img src="../../assets/img/go_to_home_icon.png" alt="go_to_home" style="position:fixed;bottom:0.8rem;right:0.15rem;width:0.64rem;height:0.64rem;z-index:199;"  @click="goToHome" v-if="showGoHome">

    <div class="swiper-container" id="swiper-container" >
      <div class="swiper-wrapper">
        <div class="swiper-slide"  @click="choicePlan(n,index)" v-for="(n,index) in details">
          <p :class="{'active':n.active}" ><span >{{n.detailName}}</span></p>
        </div>
      </div>
    </div>
    
  <div v-for="currentPlan1 in details" v-show="currentPlan1.active">

    <div class="planImage">
      <p class="title">#{{currentPlan1.detailId ? "平面布置图" : "全屋平面户型图"}}</p>
      <img @click="preview(currentPlan1.planImage)" v-lazy="currentPlan1.planImage + '?imageView2/2/w/1024|imageslim' " >
    </div>

    <div class="houseType_message" v-show="!currentPlan1.detailId">
      <div class="basic_message">
        <p class="plan_title">{{planData.planName}}</p>
          <div class="plan_message">
            <p><span>户型:</span>{{planData.houseTypeName}}</p>
            <p><span>风格:</span>{{planData.style.name}}</p>
            <p><span>建筑面积:</span>{{planData.houseTypePlanRelations[0].houseType.buildArea}}m²</p>
            <!-- <p><span>实得面积:</span>{{planData.houseTypePlanRelations[0].houseType.realityArea}}m²</p> -->
            <p><span>价格区间:</span>{{planData.priceRangeName}}</p>
          </div>
      </div>
      <div>
        <p class="title">#设计说明</p>
        <p class="design_explain">
          {{planData.designExplain}}
        </p>
      </div>

    </div>

    <div class="planImage" v-show="currentPlan1.effectImage"> 
      <p class="title">#场景示意图</p>
      <img  @click="preview(currentPlan1.effectImage)"  v-lazy="currentPlan1.effectImage + '?imageView2/2/w/1024|imageslim' ">
    </div>

    <div class="planImage" > 
      <p class="title">#色彩关系</p>
      <img @click="preview(currentPlan1.colorRelationImage)"  v-lazy="currentPlan1.colorRelationImage + '?imageView2/2/w/1024|imageslim' ">
      <p class="line" v-show="!currentPlan1.detailId"></p>
    </div>

    <div class="planImage" > 
      <p class="title">#{{currentPlan1.detailId ? "软装搭配详案" : "材料搭配"}}</p>
      <img @click="preview(currentPlan1.matchImage)"  v-lazy="currentPlan1.matchImage + '?imageView2/2/w/1024|imageslim'">
      <p class="line" v-show="currentPlan1.detailId && currentPlan1.planDetailGoodsRelations.length"></p>
    </div>

    <div class="plan_goods" style="overflow:hidden;" v-show="currentPlan1.detailId">
      <p class="title" style="color:#343434;" v-show="currentPlan1.planDetailGoodsRelations.length">相关单品</p> 
      <div class="goods_message" v-for="goods in currentPlan1.planDetailGoodsRelations">
         
        <img @click="gotogoods(goods)" class="goods_cover"  :src="goods.cover + '?imageView2/0/w/500/h/500|imageslim' ">

        <img class="goods_check" @click="goodsChoice(goods)" src="../../assets/img/plan_choice.png" v-show="goods.checked" />
        <img class="goods_check" @click="goodsChoice(goods)" src="../../assets/img/plan_nochoice.png" v-show="!goods.checked" />
        
        <p class="goods_title" style="height:0.2rem;line-height:0.2rem;">{{goods.title}}</p>
        <!-- <p class="goods_price">¥{{goods.minPrice}}</p> -->
        
        <p class="goods_price" style="height:0.42rem;margin-bottom:0;" v-show="!goods.goodsDetail.discountType">¥{{goods.goodsDetail.minPrice}}</p>

        <div class="goods_discount" v-show="goods.goodsDetail.discountType == 2">
          <p>¥{{goods.goodsDetail.discountPrice}}  <span>¥{{goods.goodsDetail.minPrice}}</span></p> 
          <div style="display:flex;justify-content:center;"><div class="goods_tag">{{goods.goodsDetail.discountTag}}</div></div>
        </div>

        <div class="goods_amount" v-show="goods.goodsDetail.discountType == 3">
          <p>¥{{goods.goodsDetail.minPrice}}</p> 
         <div style="display:flex;justify-content:center;"> <div class="goods_tag">{{goods.goodsDetail.discountTag}}</div> </div>
        </div>


      </div>
    </div>

  </div>

    <div class="space"></div>
    <div class="fixarea">
      <div class="left" style="justify-content:flex-start;">
        
        <img src="../../assets/img/icon_focus_def.png" @click="addCollect" v-if="!collection" />
        <img src="../../assets/img/icon_focus_select.png" @click="cancelCollect" v-else/>
          
        <div class="goodsNumber" @click="goShoppingCart" >
            
          <mt-badge size="small" class="goodsnum" v-show='showCart'>{{goodsNumber}}</mt-badge>
          <img src="../../assets/img/new_icon_cart.png" class="shoppingCartPic" />            
      
        </div>

      </div>

      <div class="right" v-show="currentPlan.detailId && currentPlan.planDetailGoodsRelations.length && noGoodsChoice" style="background:#999;">请选择商品</div>
      <div class="right" v-show="currentPlan.detailId && currentPlan.planDetailGoodsRelations.length && !noGoodsChoice" @click="findSubscribe">
        一起加入购物车
      </div>

    </div>

    <!-- 购买弹窗 -->
    <div class="choiceSize" @click="showShopping = false;" :class="{'is-visible2':showShopping}">
      <div  @click.stop class="cd-popup-container2">
        <div class="all_goods">
          <div class="all_message">

            <p class="choice_goods_count">{{choiceGoodsCount}}件搭配价</p> 

            <div>
              <!-- <span>¥{{(allGoodsMoney).toFixed(2)}} </span> -->
              <span :class="{'has_coupon': (allGoodsMoney-disCountMoney) > 0}">¥{{disCountMoney.toFixed(2)}} </span>
              <span v-show="(allGoodsMoney-disCountMoney) > 0" class="coupon_money">已优惠¥{{(allGoodsMoney-disCountMoney).toFixed(2)}} </span>
            </div>

            <img src="../../assets/img/closeDownLoad.png" @click="showShopping = false;" />

          </div>
          <div class="goods_content">
            <div class="goods_box" >

              <div class="goods_item" v-for="(goods,index) in currentGoodsChoice">
                <div class="goods_header">
                  <img :src="goods.currentStyle.cover" >    
                  <div class="goods_header_right">
                    <p class="goods_header_title">{{goods.title}}</p>


                    <p class="goods_header_price" v-show="!goods.discountType">¥{{goods.currentStyle.price}}</p>
                    <p class="goods_header_price goods_header_discount" v-show="goods.discountType == 2">
                      ¥{{goods.currentStyle.discountPrice}}
                      <span>¥{{goods.currentStyle.price}}</span>
                    </p>
                    <p class="goods_header_price goods_header_amount" v-show="goods.discountType == 3">
                      ¥{{goods.currentStyle.price}}
                      <span>{{goods.discountTag}}</span>
                    </p>

                    <p class="right_p">
                      <span style="display:inline-block;width:0.4rem;">已选：</span>
                      <span>{{goods.currentStyle.name}}</span> 
                      <br>
                      <span style="margin-left:0.4rem;"> {{goods.currentStyle.subName}} </span>
                    </p>
                    <div class="no_goods_count" v-show="!goods.hasCount">
                      <p>暂无库存</p>
                      <img src="../../assets/img/important_image.png" />
                    </div>
                  </div>
                </div>  
                <goods-detail-sKU :ref="'goodsSKU'+index"  @onSkuChange="onSkuChange"></goods-detail-sKU>
                <div class="goods_count">
                  <p>数量</p>
                  <div class="images">
                    <span @click='reduce(index)'> <img src="../../assets/img/red.png" /> </span>
                    <span class="number">{{goods.count}}</span>
                    <span @click='add(index)'><img src="../../assets/img/ad.png" /> </span>
                  </div>
                </div>
                <div style="width:100%;height:0.1rem;background:#f2f2f2;"></div>
              </div>  

            </div>
          </div>  
        </div>
      </div>
      <div  @click.stop>

        <p class="join_btn" style="background:#333;" v-show="showShoppingType == 1"   @click="addJoinCart">加入购物车</p>
        <p class="join_btn" style="background:#999;" v-show="showShoppingType == 2">请修改无效商品规格</p>

      </div>
    </div>

    <firstLoad :firstLoad='firstLoad' :type="4"></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <wxQrcode ref='wxQrcode'></wxQrcode>
  </div>
</template>

<script>
  import swiper from 'swiper';
  import firstLoad from '../../components/firstLoadNormal.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import goodsDetailSKU from '../productInformation/goodsDetailSKU.vue';
  import wxQrcode from '../../components/wxQrcode.vue';
  export default {
    name: 'planDetail',
    components: {
      goodsDetailSKU,
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      wxQrcode:wxQrcode
    },
    data() {
      return {
        wxQrcodeData:{},
        showCart: false,
        goodsNumber: '', 
        showGoHome:true,
        collection:false,
        noGoodsChoice:false,
        loadFailed:false,
        firstLoad:true,
        planId:null,
        planData:{
          houseTypePlanRelations:[{
            house:{},houseType:{}
          }],
          style:{}
        },
        details:[],
        currentPlan:{},
        currentGoodsChoice:[],
        planType:1,
        top:0,
        time:0,
        showShopping:false,
        choiceGoodsCount:0,
        allGoodsMoney:0,
        disCountMoney:0,
        showShoppingType:null  //1 加入购物车 2 无库存
      }
    },
    created() {
      document.title = "软装方案详情";
    },
    mounted: function() {
      this.showGoHome = this.getParam('showGoHome') == '1' ? false : true;
      this.planId = this.getParam('planId');
      this.isCollect();
      if (this.keep.isKeepAlive()) {
        this.firstLoad = false;

        this.planData = this.keep.cache.get("planData",{});
        this.planType = this.keep.cache.get("planType",1);
        this.details = this.planData.details;
        this.currentPlan = this.planData.details[this.planType-1];

        this.initLayer();
        // 标记不keep-alive
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      } else {
        // 删除缓存
        this.keep.cache.remove("planType");
        this.keep.cache.remove("planData");

        this.firstLoad = true;
        this.loadPlanDetail();

      }



      let that = this;
      $(window).focus(function(){
        that.$refs.wxQrcode.closeQrcode();
        // that.planData = that.keep.cache.get("planData1",{});
        // that.planType = that.keep.cache.get("planType1",1);
        // that.details = that.planData.details;
        // that.currentPlan = that.planData.details[that.planType-1];            
        // if (that.planData.details) {
        that.findSubscribe();
        // }
      });
      console.log(this.$refs)
      this.wxQrcodeData = this.$refs.wxQrcode;
      this.showShoppingCartCount();    

    },
    methods: {
      showShoppingCartCount() {
        this.http.get(this).url(this.config.goodsDetail.shoppingCart_number).request(function(response) {
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
        },(err)=>{console.log(err)})
      },
      reload(){
        this.loadFailed = false;
        this.loadPlanDetail();
        this.showShoppingCartCount();
      },
      goToHome() {
        this.keep.go('/category2.html',false);
      },
      /*跳转到购物车*/
      goShoppingCart() {
        this.keep.go("/shopping_cart.html", false);
      },
      initLayer() {
        this.$nextTick(() => {
          new swiper('#swiper-container', {
              slidesPerView: 'auto',
              paginationClickable: true,
              observer:true,
              observeParents:true,
          });
        });
      },
      preview(currentImage) {
        let images = [];
        images.push(this.currentPlan.planImage);
        images.push(this.currentPlan.colorRelationImage);
        images.push(this.currentPlan.matchImage);  
        if(this.currentPlan.effectImage){
          images.push(this.currentPlan.effectImage);  
        }

        this.wx.previewImage({
          current: currentImage, 
          urls: images 
        });
      },
      goodsChoice(goods) {
        goods.checked = !goods.checked;

        let hasGoodsSelect = false
        this.currentPlan.planDetailGoodsRelations.forEach((item)=>{
          if (item.checked) {
            hasGoodsSelect = true;
          }
        });

        if (!hasGoodsSelect) {
          this.noGoodsChoice = true; 
        } else {
          this.noGoodsChoice = false; 
        }
      },
      gotogoods(goods){
        this.keep.cache.push("planData",this.planData);
        this.keep.cache.push("planType", this.planType);
        this.keep.scroll.save();
        this.keep.go("/goods_detail.html", true, { goodsid: goods.goodsId,showGoHome:'1'});
      },
      choicePlan(plan,index) {
        this.planType = index + 1;
        this.currentPlan = plan;
        console.log(plan)
        this.details.forEach((item)=>{
          item.active = false;
        });
        plan.active = true;
        console.log(this.wxQrcodeData )
        this.$refs = {};
        this.$refs.wxQrcode = this.wxQrcodeData;
      },
      findSubscribe() {
        this.$indicator.open({
          spinnerType: 'fading-circle'
        });
        this.http.get(this).url(this.config.attendWx).request(function(response) {
          this.$indicator.close();
          if (response.data.data) {
            //this.keep.cache.remove("planData1");
            //this.keep.cache.remove("planType1");
            this.shoppingJointoCart()
          } else {
            //this.keep.cache.push("planData1",this.planData);
            //this.keep.cache.push("planType1", this.planType);            
            this.$refs.wxQrcode.setQrcode();
          }
        },(err)=>{
          this.$indicator.close();
          console.log(err);
        })
      },
      /*点击加入购物车弹开展示选择规格*/
      shoppingJointoCart(){

        let hasGoodsSelect = false
        this.currentPlan.planDetailGoodsRelations.forEach((item)=>{
          if (item.checked) {
            hasGoodsSelect = true;
          }
        })
        if (!hasGoodsSelect) {
          this.showError("至少选择一件单品!");
          return ;
        }
        
        let flag = true;
        let firstSkuCount = true;
        let number = 0;
        this.choiceGoodsCount = 0;
        this.allGoodsMoney = 0;
        this.disCountMoney = 0;
        this.currentGoodsChoice = [];

        for (var i = 0; i < this.currentPlan.planDetailGoodsRelations.length; i++) {

          if(this.currentPlan.planDetailGoodsRelations[i].checked) {

           
            //添加初始数据
            let obj = {};
            number++;
            obj.index = number;
            obj.goodsId = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.goodsId;
            obj.styleId = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.styles[0].styleId;
            obj.currentStyle = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.styles[0];
            obj.discountType = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.discountType;
            obj.discountTag = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.discountTag;

            if (!this.currentPlan.planDetailGoodsRelations[i].goodsDetail.coupon) {
              obj.coupon = {};
            } else {
              obj.coupon = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.coupon;
            }

            obj.noStorageSale = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.noStorageSale;
            obj.title = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.title;
            obj.styles = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.styles;

            obj.firstStyleEnabledCover = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.firstStyleEnabledCover;
            obj.firstStyleItemId = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.firstStyleItemId;
            obj.firstStyleItemName = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.firstStyleItemName;
            obj.firstStyleItems = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.firstStyleItems;

            obj.secondStyleEnabledCover = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.secondStyleEnabledCover;
            obj.secondStyleItemId = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.secondStyleItemId;
            obj.secondStyleItemName = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.secondStyleItemName;
            obj.secondStyleItems = this.currentPlan.planDetailGoodsRelations[i].goodsDetail.secondStyleItems;
           

            //判断弹开后选中规格无库存
            if (obj.currentStyle.count <= 0 && !this.currentPlan.planDetailGoodsRelations[i].goodsDetail.noStorageSale) {
              firstSkuCount = false;
              obj.hasCount = false;
              obj.count = 0;
              //this.showMessage("'"+ obj.currentStyle.name + "-"+ obj.currentStyle.subName + "'暂无库存,请重选择其他规格");
            } else {
              obj.count = 1;
              obj.hasCount = true;
            }

            //计算选择商品数量和价格
            this.choiceGoodsCount++;
            this.allGoodsMoney += obj.currentStyle.price * obj.count;

            if (this.currentPlan.planDetailGoodsRelations[i].goodsDetail.discountType == 2) {
              this.disCountMoney += obj.currentStyle.discountPrice;
            } else if (this.currentPlan.planDetailGoodsRelations[i].goodsDetail.discountType == 3) {
              if (obj.currentStyle.price >  this.currentPlan.planDetailGoodsRelations[i].goodsDetail.coupon.toAmount ) {
                this.disCountMoney += (obj.currentStyle.price - this.currentPlan.planDetailGoodsRelations[i].goodsDetail.coupon.amount );
              } else {
                this.disCountMoney += obj.currentStyle.price;
              }
            } else {
              this.disCountMoney += obj.currentStyle.price;
            }


            this.currentGoodsChoice.push(obj);


            //判断是否商品所有规格都无库存
            // if (!this.currentPlan.planDetailGoodsRelations[i].goodsDetail.noStorageSale) {
            //   var hasCount = false;
            //   for (var j = 0; j < this.currentPlan.planDetailGoodsRelations[i].goodsDetail.styles.length; j++) {
            //     if (this.currentPlan.planDetailGoodsRelations[i].goodsDetail.styles[j].count > 0) {
            //       hasCount = true;
            //     }
            //   }
            //   if (!hasCount) {
            //     flag = false;
            //     this.showMessage("'"+ this.currentPlan.planDetailGoodsRelations[i].title + "'暂无库存,请重新选择单品");
            //     return false;
            //   }
            // }
          }
        }
       
        if (flag) {
          if (firstSkuCount) {
            this.showShoppingType = 1;
          } else {
            this.showShoppingType = 2;
          }
          
          this.showShopping = true;
          
          setTimeout(()=>{
            this.$nextTick(() => {
              let index = 0;
              for(var i in this.$refs){
                if(this.$refs[i].length){
                  this.$refs[i][0].loadSource(this.currentGoodsChoice[index])
                  this.$refs[i][0].selectSku(this.currentGoodsChoice[index].currentStyle);
                  index++;
                }
              }
            })
          },200)
        }
      },
      /*刷新折扣金额*/
      refreshDisCountMoney(discountType,count,discountPrice,price,toAmount,amount) {
        console.log(discountType,count,discountPrice,price,toAmount,amount)
        if (discountType == 2 ) {
          this.disCountMoney += discountPrice * count;
        } else if (discountType  == 3) {

          if((price * count) > toAmount ) {
            this.disCountMoney += (price * count - amount );
          } else {
            this.disCountMoney += price * count ;
          }

        } else {
          this.disCountMoney += price * count;
        }

      },
      /*sku选择回调*/
      onSkuChange(sku) {
       
        this.allGoodsMoney = 0;
        this.disCountMoney = 0;
        for (var i = 0; i < this.currentGoodsChoice.length; i++) {
          
          if(i == (sku.index - 1)){
            let obj = {};
            obj.goodsId = sku.goodsId;
            obj.styleId = sku.styleId;
            obj.index = sku.index;
            obj.currentStyle = sku;
            obj.noStorageSale = this.currentGoodsChoice[i].noStorageSale;
            obj.title = this.currentGoodsChoice[i].title;
            obj.discountType = this.currentGoodsChoice[i].discountType;
            obj.discountTag = this.currentGoodsChoice[i].discountTag;
            obj.coupon = this.currentGoodsChoice[i].coupon;
            obj.styles = this.currentGoodsChoice[i].styles;


            if (sku.count <= 0) {
              if (this.currentGoodsChoice[i].noStorageSale) {
                obj.count = 1;
                obj.hasCount = true;
              } else {
                obj.count = 0;
                obj.hasCount = false;
              }
            } else {
              obj.count = 1;
              obj.hasCount = true;
            }
            
            this.allGoodsMoney += sku.price * obj.count;  

            this.refreshDisCountMoney(obj.discountType, obj.count, sku.discountPrice, sku.price, obj.coupon.toAmount, obj.coupon.amount); 

            this.currentGoodsChoice.splice(i,1,obj);
          } else {
            this.allGoodsMoney += this.currentGoodsChoice[i].currentStyle.price * this.currentGoodsChoice[i].count;

            this.refreshDisCountMoney(this.currentGoodsChoice[i].discountType, this.currentGoodsChoice[i].count, this.currentGoodsChoice[i].currentStyle.discountPrice, this.currentGoodsChoice[i].currentStyle.price, this.currentGoodsChoice[i].coupon.toAmount, this.currentGoodsChoice[i].coupon.amount); 
          }

        }

        //判断是否所有商品都有库存
        let isCount = true;
        this.currentGoodsChoice.forEach((item)=>{
          if (!item.hasCount) {
            isCount = false;
          } 
        })
        this.showShoppingType = isCount ? 1 : 2;

        // this.$refs.goodsSKU.selectSku(sku);
        // this.$refs.goodsSKUPop.selectSku(sku);
      },

      //商品数量减1
      reduce(i) {
        if(this.currentGoodsChoice[i].count > 1) {
          this.currentGoodsChoice[i].count--;
        }

        this.refreshMoney();
        this.disCountMoney = 0;
        for (var i = 0; i < this.currentGoodsChoice.length; i++) {
         this.refreshDisCountMoney(this.currentGoodsChoice[i].discountType, this.currentGoodsChoice[i].count, this.currentGoodsChoice[i].currentStyle.discountPrice, this.currentGoodsChoice[i].currentStyle.price, this.currentGoodsChoice[i].coupon.toAmount, this.currentGoodsChoice[i].coupon.amount); 
        }
      },
      //商品数量加1
      add(i) {
        
        if(this.currentGoodsChoice[i].count == 0 && !this.currentGoodsChoice[i].noStorageSale) {
          this.showError('该规格暂无库存');
        } else if(this.currentGoodsChoice[i].count < 99 && !this.currentGoodsChoice[i].noStorageSale && this.currentGoodsChoice[i].count < this.currentGoodsChoice[i].currentStyle.count) {
          this.currentGoodsChoice[i].count++;
        } else if(this.currentGoodsChoice[i].count < 99 && this.currentGoodsChoice[i].noStorageSale){
          this.currentGoodsChoice[i].count++;
        }

        this.refreshMoney();
        this.disCountMoney = 0;
        for (var i = 0; i < this.currentGoodsChoice.length; i++) {
          this.refreshDisCountMoney(this.currentGoodsChoice[i].discountType, this.currentGoodsChoice[i].count, this.currentGoodsChoice[i].currentStyle.discountPrice, this.currentGoodsChoice[i].currentStyle.price, this.currentGoodsChoice[i].coupon.toAmount, this.currentGoodsChoice[i].coupon.amount); 
        }
      },

      //计算总金额
      refreshMoney() {

        this.allGoodsMoney = 0;
        this.currentGoodsChoice.forEach((item)=>{
          this.allGoodsMoney += item.currentStyle.price * item.count;
        });

      },

      /*点击加入购物车请求接口*/
      addJoinCart() {
        console.log(this.currentGoodsChoice)

        let params = {};
        let shoppingCartVos = [];
        params.planId = this.planData.planId;
        params.planDetailId = this.planData.details[this.planType-1].detailId;

        this.currentGoodsChoice.forEach((item)=>{
          var obj = {};
          obj.goodsId = item.goodsId;
          obj.styleId = item.currentStyle.styleId;
          obj.amount = item.count;
          shoppingCartVos.push(obj);
        });
        params.shoppingCartVos = shoppingCartVos;
        console.log(params);

        this.$indicator.open({spinnerType: 'fading-circle'});

        this.http.postJson(this).url(this.config.plan.join_shopping_cart).params(params).request((req) => {
          this.$indicator.close();
          this.showShopping = false;
          this.showShoppingCartCount();
          this.showSuccess('加入成功');
        }, (err) => {
          this.$indicator.close();
          this.showShopping = false;
          console.log(err);
        }, (response) => {
          this.$indicator.close();
          this.showShopping = false;
          console.log(response);
        })
      },
      /*查询是否已经收藏*/  
      isCollect() {
        this.http.get(this).url(this.config.plan.is_receive).params({ planId: this.planId }).request(function(response) {
          this.collection = response.data.data;
        }, function(err) {
          console.log(err)
        })
      },
      /*加入收藏*/
      addCollect() {
        this.http.post(this).url(this.config.plan.collection_url).params({ planId: this.planId }).request(function(response) {
          this.showSuccess('方案收藏成功!')
          this.collection = true;
        }, function(err) {
          console.log(err)
        })
      },  
      /*取消收藏*/
      cancelCollect() {
        this.http.delete(this).url(this.config.plan.cancel_collect).restful({ planId: this.planId }).request(function(response) {
          this.showSuccess('方案已取消收藏!')
          this.collection = false;
        }, function(err) {
          console.log(err)
        })
      },  
      loadPlanDetail() {
        this.http.get(this).url(this.config.plan.detail_url).restful({planId:this.planId}).request((res) => {
          this.firstLoad = false;
          if(res.data.code != 0){
            return ;
          }
          let data = res.data.data;
          var obj = {};
          obj.detailId = null;
          obj.planId = this.planId;
          obj.detailName = "设计概念";
          obj.planDetailGoodsRelations = [];
          obj.planImage = data.houseTypeImage  //平面图 对应户型图
          obj.effectImage = '';
          obj.colorRelationImage = data.colorRelationImage;  //颜色 对应 颜色
          obj.matchImage = data.materialImage  //软装搭配详案图 对应 材料搭配图
          data.details.unshift(obj);

          for (var i = 0; i < data.details.length; i++) {
            if(i == 0){
              data.details[i].active = true;
            } else {
              data.details[i].active = false;
            }

            data.details[i].planDetailGoodsRelations.forEach((item)=>{
              item.checked = true;
              item.imageArray = false;
              for (var j = 0; j < item.goodsDetail.styles.length; j++) {
                if (item.styleId == item.goodsDetail.styles[j].styleId) {
                  var tem = item.goodsDetail.styles[0];
                  item.goodsDetail.styles[0] = item.goodsDetail.styles[j];
                  item.goodsDetail.styles[j] = tem;
                  break ;
                }
              }
            })

          }

          console.log(data.details)
          this.details = data.details;
          this.planData = data; 
          this.currentPlan = data.details[0];

          this.initLayer();
        },(err)=>{ 
         this.loadFailed = true;  
         this.firstLoad = false;
        }) 
      },
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/planDetail.scss';
</style>
