<template>
	<div id="goodsDetail_Vue" >
		<VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
		<!-- banner -->
		<div class="banner" :class="{'showAppTip1':showAppTip}">

			<div class="swiper-container" id="banner_swiper">
		    <div class="swiper-wrapper">
		      <div class="swiper-slide"  v-for='n in swipeInfo' :key='n.bannerImage'>
		      	<img @click="bannerPreview(n.bannerImage,swipeInfo)" v-lazy="n.bannerImage">
		      </div>
		    </div>
		    <div class="banner_swiper_pagination"></div>
		  </div>

		</div>

		<img src="../../assets/img/go_to_home_icon.png"  style="width:0.64rem;height:0.64rem;bottom:0.8rem;" alt="go_to_home" id="goHome" @click="goToHome" v-if="showGoHome">
		
		<!-- 标题描述 -->
		<div class="boxTitle">
			<p class="goods_title">{{title}}</p>
			<p class="reduction">{{description}}</p>
			<div class="underLine">

					<p  v-show="!detail.discountType">¥{{currentStyle.price}}</p>

					<div class="goods_discount" v-show="detail.discountType == 2">
	           <p>¥{{currentStyle.discountPrice}}  <span>¥{{currentStyle.price}}</span></p> 
	           <div class="goods_tag">{{detail.discountTag}}</div>
	         </div>
	         <div class="goods_amount" v-show="detail.discountType == 3">
	           <p>¥{{currentStyle.price}}</p> 
	           <div class="goods_tag">{{detail.discountTag}}</div>
	        </div>

					<img v-if="!showCollect" src="../../assets/img/new_product_collect_default.png" @click="addCollect">
					<img v-else src="../../assets/img/new_product_collect_select.png" @click="cancelCollect">	
			</div>
			<div class="serviceTags" v-if="serviceTags.length">
				<p v-for="tag in serviceTags">
					<img src="../../assets/img/goods_detail_tag.png">{{tag}}
				</p>
			</div>
		</div>

		<!-- sku组件 -->
		<goods-detail-sKU ref="goodsSKU"  v-on:onSkuChange="onSkuChange">
		</goods-detail-sKU>
		
		<p style="width:3.35rem;height:1px;border-bottom:1px solid #ddd;margin:0 auto;"></p>

		<!-- 空间搭配 -->
		<div class="title" v-if="hotSpace != null">
			<div class="abber background">
				<div class="secen">场景搭配</div>
				<div class="sceneGraph" @click="gotoSpace(hotSpace.spaceId)"><img v-lazy="hotSpace.cover" />
				</div>
				<div class="recommend">
					<div class="posi">
						<span class="span_z"><img src="../../assets/img/reduce.png"></span>
						<span class="bold">设计师推荐搭配</span>
						<span class="span_zz"><img src="../../assets/img/reduce.png"></span>
					</div>
					<div class="praise_goods_layout">
            <div class="praise_goods" v-for="item in hotGoods" @click="gotoGoods(item.goodsId)">
             <!-- @touchstart='onTouchstart(item,hotGoods)' @touchend='onTouchend1(item,1)' @touchcancel='onCancel(item)' > -->
               <img v-lazy="item.cover" :class="{'imgactive':item.imgactive}" >
               <div class="goods_message">
                 <p class="title1" style="height:0.2rem;line-height: 0.2rem;">{{item.title}}</p>
                 <p class="desc" style="height:0.18rem;line-height: 0.18rem;">{{item.description}}</p>

                 <span class="goods_price" v-show="!item.discountType">¥{{item.minPrice}}</span>
                 <div class="goods_discount" v-show="item.discountType == 2">
                   <p>¥{{item.discountPrice}}  <span>¥{{item.minPrice}}</span></p> 
                   <div class="goods_tag">{{item.discountTag}}</div>
                 </div>
                 <div class="goods_amount" v-show="item.discountType == 3">
                   <p>¥{{item.minPrice}}</p> 
                   <div class="goods_tag">{{item.discountTag}}</div>
                 </div>

               </div> 
            </div>
            
          </div>
          <p class="goods_learnMore" @click="gotoSpaceDetail(hotSpace.spaceId)"> <span>组合陈列</span> <img src="../../assets/img/new_btn_more.png"> </p>
				</div>
			</div>
		</div>

		<!-- 详情页渲染 -->
		<div v-for="item in content" class="goods_detail_item" v-show="detail.content != null">
			<!--标题开始-->
			<div v-show="item.type == 'text'">
				<div v-show="!item.desc" class="towTitle">
					<p>{{item.title}}</p>
				</div>
				<div v-show="item.desc" class="text_txt">
					<div>{{item.title}}</div>
					<p>{{item.desc}}</p>
				</div>
			</div>
			<!--标题结束-->
			<div style="clear: both;"></div>
			<!--尺寸开始-->
			<div v-show="item.type == 'dim'">
				<div class="size ">
					<p>Dimension</p>
					<p>尺寸</p>
				</div>
				<div class="sofa" v-for="itemc in item.content" v-show="itemc.selects">
					<p>{{itemc.name}}</p>
					<img v-lazy="itemc.image" @click="preview(itemc.image,imageArray)"/>
				</div>
				<ul class="person" v-show="showDimChild">
					<div class="swiper-container dim_swiper">
						<div class="swiper-wrapper">
							<div v-for="itemc in item.content" class="swiper-slide">
								<img v-if="itemc.cover" v-lazy="itemc.cover" @click="dimItemClick(itemc,item.content)" :class="itemc.selects ? 'determine' : 'uncertain'" />
							</div>
						</div>
					</div>		
				</ul>
				<!--尺寸结束-->
			</div>

			<!--参数开始-->
			<div v-show="item.type == 'parameter'" >
				<div class="parameters" style="padding-bottom:0.3rem;">
					<div class="parameter">parameter</div>
					<div class="details">详细参数规格</div>
					<div class="secens">
						<div class="speci" v-for="n in item.content">
							<span class="sen">{{n.name}}</span>
							<span class="public" style="white-space: pre-wrap;word-break: break-all;">{{n.value}}</span>
						</div>
					</div>
					<div class="parameter" style="margin-top:0.5rem;">Vision</div>
					<div class="details" style="margin-bottom:0;">视图</div>
				</div>
			</div>
			<!--参数结束-->

			<!--细节细节-->
			<div v-show="item.type == 'detail'">
				<div class="detail">
					<div class="Detail">Detail</div>
					<div>细节</div>
					<div class="twodetail">
						<div class="detail1"><img  @click="preview(item.one.image,imageArray)" v-lazy="item.one ? item.one.image : ''" /></div>
						<div class="detail2"><img  @click="preview(item.two.image,imageArray)" v-lazy="item.two ? item.two.image : ''" /></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="text">
					<div class="textLeft">
						<p style="white-space:pre-wrap;">{{item.one ? item.one.title : ''}}</p>
						<p class="color">{{item.one ? item.one.desc : ''}}</p>
					</div>

					<div class="txetRight">
						<p>{{item.two ? item.two.title : ''}}</p>
						<p class="color2">{{item.two ? item.two.desc : ''}}</p>
					</div>
				</div>
				<div style="clear:both;"></div>
				<div class="imamge">
					<img  @click="preview(item.thress.image,imageArray)" v-lazy="item.thress ? item.thress.image : ''">
				</div>
				<div class="text_text">
					<div style="white-space:pre-wrap;">{{item.thress ? item.thress.title : ''}}</div>
					<p>{{item.thress ? item.thress.desc : ''}}</p>
				</div>
			</div>
			<!--细节结束-->

			<!--图片开始-->
			<div v-show="item.type == 'image'">
				<div class="myimage">
					<div><img @click="preview(item.url,imageArray)" v-lazy="item.url" /></div>
					<div style="clear: both;"></div>
				</div>
				<div style="clear: both;"></div>
			</div>
			<div style="clear: both;"></div>
			<!--图片结束-->
		</div>

		<!-- 用户评论条数 -->
		<div class="user">
			<p @click="goCommentaruse(n)">用户晒单({{detail.commentsCount}})<span></span></p>
		</div>
		
		<!-- 推荐相似商品 -->
		<div class="commend" v-show="similarGoodsArr.length != 0">
			<div class="comm">
				<span class="span_co"><img src="../../assets/img/reduce.png"></span>
				<span>猜你喜欢</span>
				<span class="span_com"><img src="../../assets/img/reduce.png"></span>
			</div>
		</div>
		<div class="recommended" v-show="similarGoodsArr.length != 0">
			<ul>
				<li v-for="similarGood in similarGoodsArr" @click="gotoGoods(similarGood.detail.goodsId)">
				 <!-- @touchcancel='onCancel(similarGood)' @touchstart='onTouchstart1(similarGood,similarGoodsArr)' @touchend='onTouchend1(similarGood,0)'> -->
					<img v-lazy="similarGood.detail.cover" :class="{'imgactive':similarGood.imgactive}" />
					<div>
						<p class="goodTitle" style="height:0.2rem;line-height: 0.2rem;font-size:0.16rem;color:#343434;">{{similarGood.detail.title}}</p>
						<p class="style" style="color:#999;height:0.18rem;line-height: 0.18rem;">{{similarGood.detail.description ? similarGood.detail.description : "无"}}</p>

						 <p class="goodsPrice" style="height:0.42rem;margin-bottom:0;" v-show="!similarGood.detail.discountType">¥{{similarGood.dynamicId.price/100}}</p>
						 <div class="goods_discount" v-show="similarGood.detail.discountType == 2">
               <p>¥{{similarGood.dynamicId.discountPrice/100}}  <span>¥{{similarGood.dynamicId.price / 100}}</span></p> 
               <div class="goods_tag">{{similarGood.detail.discountTag}}</div>
             </div>
             <div class="goods_amount" v-show="similarGood.detail.discountType == 3">
               <p>¥{{similarGood.dynamicId.price/100}}</p> 
               <div class="goods_tag">{{similarGood.detail.discountTag}}</div>
             </div>


					</div>
				</li>
			</ul>
		</div>

		<!--滚动到顶部-->
		<div class="goTop" style="display: none;"><img src="../../assets/img/bai.png" @click="goTop"></div>


		<!--购买弹窗-->
		<div class="choiceSize cd-popup2" id="choiceSize" @click="showShopping = false;" :class="{'is-visible2':showShopping}">
			<div  @click.stop class="cd-popup-container2">
				<div class="goodsDetailArea">
					<div class="goodsPicBox ">
						<img class="goodsCover" v-lazy="currentStyle.cover" />
					</div>
					<div class="right">
						<p>¥{{currentStyle.discountPrice}} <span v-show="detail.discountType == 2" class="discountPrice">¥{{currentStyle.price}}</span> </p>
						<p class="right_p"><span style="display:inline-block;width:0.4rem;">已选：</span><span>{{currentStyle.name}}</span> <br><span style="margin-left:0.4rem;"> {{currentStyle.subName}} </span></p>
					</div>
					<div class="myIcon"><img src="../../assets/img/closeDownLoad.png" @click="showShopping = false;" /></div>
					<div class="line">
						<span>
						<!-- <img src="../../assets/img/lian_shadow@3x.png"> -->
						</span>
					</div>
				</div>
				<div style="clear: both;"></div>
				<div class="choice">
					<div id="choicenumber">
						<goods-detail-sKU ref="goodsSKUPop"  v-on:onSkuChange="onSkuChange">
	                    </goods-detail-sKU>
						<div class="out">数量&nbsp;</div>
						<div class="images">
							<span @click='reduce'> <img src="../../assets/img/red.png" /> </span>
							<span class="number">{{count}}</span>
							<span @click='add'><img src="../../assets/img/ad.png" /> </span>
						</div>
						<div style="clear: both;"></div>
					</div>
				</div>
			</div>
			<div  @click.stop>
				<p class="AddToCart1" @click="addshipcat()" v-show="showShoppingType == 1" style="font-weight:700;">加入购物车</p>
				<p class="noCount" v-show="showShoppingType == 2" style="font-weight:700;">暂无库存</p>
				<p class="buyNow1" @click="createOrder()" v-show="showShoppingType == 3" style="font-weight:700;">立即购买</p>
			</div>
		</div>

		<!--优惠券弹框-->
		<div @click="showCoupon = false;" class="coupons cd-popup2" id="coupons" :class="{'is-visible2':showCoupon}">
			<div @click.stop class="cd-popup-container2" style="height:4.5rem;width:100%;border-radius:8px 8px 0 0;padding-bottom:0;position:absolute;left:0,bottom:0;">
				<p class="couponTip">促销活动</p>
				<div class="coupon_div">
					<div class="couponsBox1" v-for="coupon in coupons">
						<div class="box">

	            <p class="coupon_title">{{coupon.name}}</p>
	            <p class="time"><span class="expire">{{coupon.expireDescription}}</span><span class="coupon_type">{{coupon.typeStr}}</span></p>
	            <p class="desc"><span>{{coupon.description}}</span></p>


						</div>
					</div>
				</div>
				<p class="coupon_bottom"> <span>结算时可选择有效优惠券使用</span></p>
			</div>
		</div>

		<!-- 底部固定栏图标 -->
		<div class="fixedArea">
			<div style="width: 1.20rem;border-top: 1px solid #f2f2f2;">
				<mt-badge style="left:0.28rem;" size="small" class="goodsnum" v-if='messageCount'>{{messageCount}}</mt-badge>
				<img src="../../assets/img/new_icon_service.png" class="customerServicePic" @click="tocustomerService" />
				<span class="customerService" @click="tocustomerService">客服</span>
				<mt-badge size="small" class="goodsnum" v-show='showCart'>{{goodsNumber}}</mt-badge>
				<img src="../../assets/img/new_icon_cart.png" class="shoppingCartPic" @click="goShoppingCart" />
				<span class="shoppingCart" @click="goShoppingCart">购物车</span>
			</div>
			<p class="AddToCart" @click="shoppingJointoCart" v-if="!detail.skuPull" style="font-weight:700;">加入购物车</p>
			<p class="buyNow" @click="shoppingBuynow" v-if="!detail.skuPull" style="font-weight:700;">立即购买</p>
			<p class="alreadyDown1"  v-if="detail.skuPull" style="font-weight:700;">已下架</p>
		</div>

		<div class="zhiCustomBtn" style="display:none !important;"></div>  
		<loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad' :type="2"></firstLoad>
		<oldGoods :oldGoods='oldGoods' @reload='reloadGods'></oldGoods>
		<wxQrcode ref='wxQrcode'></wxQrcode>
	</div>
</template>
<script>
  import jsBridge from '../../commons/jsBridge.js'; 
  import {getUser, getCookie, setCookie , GetQueryString} from '../../commons/tools'
	import goodsDetailSKU from './goodsDetailSKU.vue';
	import downLoadApp from '../../components/tipDownLoadApp.vue';
	import swiper from 'swiper';
	import loadFailed from '../../components/loadFailed.vue';
	import oldGoods from '../../components/oldGoods.vue';
	import firstLoad from '../../components/firstLoadNormal.vue';
	import wxQrcode from '../../components/wxQrcode.vue';
	export default {
		name: "goodsDetail",
		components: {
			goodsDetailSKU,
			VdownLoadApp:downLoadApp,
			loadFailed:loadFailed,
			oldGoods:oldGoods,
			firstLoad:firstLoad,
			wxQrcode:wxQrcode
		},
		data() {
			return {
				shareTitle: '',
	      shareDesc: '', 
	      link: null,
	      imgUrl:"",        
	      boothId:null,
	      shareMemberId:null,
	      token:null,
	      state:null,
	      oldGoods:false,
				messageCount:0,
				showGoHome:true,
				showDimChild:true,
				firstLoad:true,
				loadFailed:false,
				showAppTip:true,
				goodsId: "",
				swipeInfo: [],
				detail: {
					title: "",
					titleImage: "", 
					dim: [], 
					parameter: [],
				},
				dimItem: {},
				title: "",
				description: '',
				styles: [],
				currentStyle: {},
				hotSpace: null,
				hotGoods: [],
				mySwiper:null,
				content: [{type:"dim",content:[]}],
				similarGoodsArr: [],
				showCart: false,
				goodsNumber: '',
				showCollect: false,
				skuPull: '',
				count: 1,
				coupons:[],
				imageArray:[],
				showCoupon:false,
				showShopping:false,
				mianshort:false,
				serviceTags:[],
				showShoppingType:null, //1 加入购物车 2 无库存 3 立即购买
				buyNowOrJoinCart:null, //1 加入购物车 3 立即购买 
				isBuy:false
			}
		},
		created() {
      document.title = "商品详情";
    },
    beforeDestroy() {
      this.keep.cache.remove("goodsDetailWxCache");
    },
		mounted() {
			/*判断是否显示下载app提示*/
			if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }
      //获取goodsId 是否回首页变量
      this.goodsId = (this.getParam('goodsid') == null) ? this.getParam('goodsId') : this.getParam('goodsid');
      this.showGoHome = this.getParam('showGoHome') == '1' ? false : true;


			let that = this;

			$(window).focus(function(){
				that.$refs.wxQrcode.closeQrcode();
			
				if (that.isBuy) {
					that.shoppingBuynow()
				} else {
      		that.shoppingJointoCart()					
				}
				
		  });
     
			/*查询购物车数量*/
			this.showShoppingCartCount();
			this.loadGoodsDetail();
		},
		methods: {
			findSubscribe() {
				this.$indicator.open({
          spinnerType: 'fading-circle'
        });
        this.http.get(this).url(this.config.attendWx).request(function(response) {
        	this.$indicator.close();

          if (response.data.data) {
          	this.keep.cache.remove("goodsDetailWxCache");
          		if (this.isBuy) {
          				this.showShopping = true;
					      	this.count = 1;
					      	this.buyNowOrJoinCart = 3;
					      	if(!this.currentStyle.count && !this.detail.noStorageSale){
					      		this.showShoppingType = 2;
					      	}else{
					      		this.showShoppingType = 3;
					      	}
          		} else {
          			this.showShopping = true;
				      	this.count = 1;
				      	this.buyNowOrJoinCart = 1;
				      	if(!this.currentStyle.count && !this.detail.noStorageSale){
				      		this.showShoppingType = 2;
				      	}else{
				      		this.showShoppingType = 1;
				      	}
          		}
          } else {
          	let goodsDetailWxCache = {};
          	goodsDetailWxCache.isBuy = this.isBuy;
          	this.keep.cache.push("goodsDetailWxCache", goodsDetailWxCache);
          	this.$refs.wxQrcode.setQrcode();
          }

        },(err)=>{
        	this.$indicator.close();
        	console.log(err);
        })
			},
      confirmMessageBox(e) {
        this.$messagebox({
         message: '请先关注公众号!',
         confirmButtonText:"确定",
         showConfirmButton:true
        }).then((action) => {
        if(action == "cancel"){
          return ;
        }
        window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUxNjE2MzA1Mg==&scene=125#wechat_redirect';
        }).catch((err) => {
          console.log(err)
        });     
      },

			setBindUser() {

	      this.shareMemberId = this.getParam('shareMemberId');  //分享者Id      

	      //判断版本
	      if(process.env.NODE_ENV == "production") {
	        this.link = "https://wx.goochao.com/goods_detail.html";
	      } else if(process.env.NODE_ENV == "test") {
	        this.link = "http://test.wx.goochao.com/goods_detail.html";
	      } else {
	        this.link = "http://192.168.20.102:8080/goods_detail.html";
	      }

        this.completeLink();
        this.initShareToFriend();
        this.initShareToCircle();
	      this.bindActivity();

			},
      completeLink() {
        var users = this.getUserData('user');
	      if (!users) {
	        return ;
	      }
        let memberId = JSON.parse(users).memberId;        
        this.link += "?shareMemberId=" + memberId +  "&boothId=" + this.boothId + "&goodsid=" + this.goodsId;

				this.shareTitle = this.detail.title;
				this.imgUrl = this.detail.cover;
				if (this.detail.description) {
					this.shareDesc = this.detail.description;
				} else {
					this.shareDesc = '搬新家买家具，不用东奔西跑，只需坐着就好，我们更懂您的家';
				}
				
      },
      initShareToFriend() {
        let that = this;

        that.wx.ready(function () { 
          that.wx.onMenuShareAppMessage({
              title:that.shareTitle,
              desc: that.shareDesc,
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
              title:that.shareTitle,
              desc: that.shareDesc,
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
      bindActivity() {
        this.http.post(this).url(this.config.activity.bind_goods).params({goodsId:this.goodsId, boothId:this.boothId}).request((response) => {
          if (response.data.code != 0) {
            return false;
          }
          
        },(err)=>{console.log(err)})
      },

      initzhichi() {
      	var user =  JSON.parse(this.getUserData('user'));
        let that = this;
        var zhiManager = (getzhiSDKInstance());
        // 设置参数
        zhiManager.set('color','000000'); //设置颜色
        zhiManager.set('customBtn', 'true'); //不使用智齿咨询按钮
        zhiManager.set('partnerId', user.memberId); //设置uid
        var obj = {'customField2':this.detail.title,'customField4':this.detail.goodsNumber};
        zhiManager.set("customerFields",JSON.stringify(obj)); // 设置自定义参数
        //手动初始化时 通过 load 方法调用 js 组件
        zhiManager.on("load", function() {
          zhiManager.initBtnDOM();
        });

        /*未读消息*/
        zhiManager.on("receivemessage", function(ret) {    
          console.log(ret);
          that.messageCount += ret.data.length;
        });

        /*离线消息*/
        zhiManager.on("unread.count",function(data){
          console.log(data);
          that.messageCount = data;
        });

      },
			goToHome() {
				this.keep.go('/category2.html',false);
			},
			/*关闭app下载div*/
			closeTip(data){
      if(!data){
          this.showAppTip = false;
        }
      },
      /*重新加载*/
      reload() {
      	this.loadFailed = false;
      	this.showShoppingCartCount();
      	this.loadGoodsDetail();
      },
      reloadGods() {
       	this.oldGoods = false;
      	this.showShoppingCartCount();
      	this.loadGoodsDetail();  
      },
      /*回到顶部*/
			// goTop() {
			// 	let distance = document.documentElement.scrollTop || document.body.scrollTop;
			// 	let step = distance / 30;
			// 	(function jump() {
			// 		if(distance > 0) {
			// 			distance -= step;
			// 			document.documentElement.scrollTop = distance;
			// 			document.body.scrollTop = distance;
			// 			window.scrollTo(0, distance);
			// 			setTimeout(jump, 10)
			// 		}
			// 	})();
			// },		
			/*查询商品详情*/
			loadGoodsDetail() {
				this.http.get(this).url(this.config.goodsDetail.goodsDetailInterface).restful({goodsId:this.goodsId
					}).request((req) => {
						this.firstLoad = false;
						if(req.data.code != 0){
							return ;
						}

						var detail = req.data.data;

						if (!detail.content) {
							console.log('old goods')
							this.oldGoods = true;
						} else {
							this.oldGoods = false;
						}

						if(detail.hotSpace != null) {
							detail.hotSpace.hotGoods.forEach((item)=>{
								item.imgactive = false;
							});
						}	

						if(!detail.serviceTags) {
							this.serviceTags = [];
						} else {
							this.serviceTags = detail.serviceTags.split(",");
						}

						this.showCollect = detail.collection;
						this.coupons = detail.coupons;

						this.$refs.goodsSKU.loadSource(detail);
						this.$refs.goodsSKUPop.loadSource(detail);

						if(detail.styles.length){
							var firstSku = detail.styles[0];
							this.$refs.goodsSKU.selectSku(firstSku);
							this.$refs.goodsSKUPop.selectSku(firstSku);
						}

						this.detail = detail;
						this.title = detail.title;
						this.description = detail.description;

						for(var i = 0; i < detail.styles.length; i++) {
							if(i == 0) {
								detail.styles[i].state = true;
							} else {
								detail.styles[i].state = false;
							}
						}

						if(detail.styles.length){
							this.currentStyle = detail.styles[0];
							detail.styles.forEach((item)=>{
								let bannerArray = item.banner ? item.banner.split(",") : [];
								bannerArray.forEach((bannerItem)=>{
									let obj = $.extend({},item);
									obj.bannerImage = bannerItem;
									this.swipeInfo.push(obj)
								})
							})
						}
						this.styles = detail.styles;
						if(detail.hotSpace != null) {
							// detail.hotSpace.hotGoods.forEach((item)=>{
							// 	item.imgactive = false;
							// });
							this.hotSpace = detail.hotSpace;
							this.hotGoods = this.hotSpace.hotGoods;
							console.log(this.hotGoods)
						} else {
							this.hotSpace = null;
						}

						if(detail.content != null) {
							var content = JSON.parse(detail.content).content;
							this.imageArray = [];
							content.forEach(function(item, index) {
								if(item.type == "image"){
									this.imageArray.push(item.url);
								}	

								if(item.type == 'dim') {
									item.current = item.content[0];
									this.dimItem = item.content[0];
									if(item.content.length == 1){
										this.showDimChild = false;
									}
									for(var i = 0; i < item.content.length; i++) {
										this.imageArray.push(item.content[i].image);
										if(i == 0) {
											item.content[i].selects = true;
										} else {
											item.content[i].selects = false;
										}
									}
								}
								if(item.type == 'detail') {
									for(var i = 0; i < item.content.length; i++) {
										this.imageArray.push(item.content[i].image);
									}
									item.one = item.content[0];
									item.two = item.content[1];
									item.thress = item.content[2];
								}
							}.bind(this));

							this.content = content;
							console.log(content)
						}
						//初始化layer布局
						this.initLayer();
						//初始化智齿
						this.initzhichi();
						//加载相似商品
						this.loadSimilarGoods();

						//初始化swiper
						this.initSwiper();
						//设定绑定关系
						this.boothId = this.getParam('boothId');
				    if (this.boothId) {
				      this.setBindUser();
				    }

					},(err)=>{
						this.firstLoad = false;
						this.loadFailed = true;
					})
			},
			initSwiper() {
	      let that = this;
				this.$nextTick(() => {
				this.mySwiper = new	swiper('#banner_swiper',{
					  slidesPerView: 'auto',
			      paginationClickable: true,
	          observer:true,
	          observeParents:true, 
	          pagination:'.banner_swiper_pagination',
	          paginationType : 'fraction',
	          onSlideChangeEnd: function(swiper){
	          	that.swiperSkuChange(that.swipeInfo[swiper.activeIndex])
	          },
				  });

				});
			},
			/*加入收藏*/
			addCollect() {
        this.http.post(this).url(this.config.goodsDetail.collect_goods).params({
          goodsId: this.goodsId
        }).request(function(response) {
          this.showMessage('收藏成功')
          this.showCollect = true;
        }, function(err) {
        	console.log(err)
        })
      },	
      /*取消收藏*/
      cancelCollect() {
      	this.http.delete(this).url(this.config.collect.cancel_goods).restful({ goodsId: this.goodsId}).request(function(response) {
        	this.showMessage('已取消收藏')
          this.showCollect = false;
        	}, function(err) {console.log(err)}
        )
      },
      bannerPreview(currentImage,images) {
      	let imageArray = [];
      	images.forEach((item)=>{
      		imageArray.push(item.bannerImage)
      	})
				this.wx.previewImage({
          current: currentImage, 
          urls: imageArray 
        });
      },
      /*图片预览*/
      preview(currentImage,images) {
        this.wx.previewImage({
          current: currentImage, 
          urls: images 
        });
      },
      /*去空间详情*/
      gotoSpace(spaceId) {
	      this.keep.go("/shopwindowdetail2.html",false,{spaceId:spaceId,showGoHome:'1'});
	    },
	    /*去空间详情调到指定位置*/
	    gotoSpaceDetail(spaceId) {
	      this.keep.scroll.save();
	      this.keep.go("/shopwindowdetail2.html",false,{spaceId:spaceId,showGoHome:'1',scrollTo:"goto"});
	    },
	    /*跳转商品详情*/
	    gotogoods(goodsId) {
	    	this.keep.go("/goods_detail.html", false, {goodsid:goodsId,showGoHome:'1'	});
	    },
	    /*跳转到评论*/
			goCommentaruse(e) {
				console.log(this)
				this.keep.go("/product_commentaries.html", false, {
					goodsid: this.goodsId
				});
			},
			/*尺寸小图点击*/
			dimItemClick(dim,dimArray) {
				dimArray.forEach((item)=>{
					item.selects = false;
				})
				dim.selects = true;
			},
			/*跳转到购物车*/
			goShoppingCart() {
				this.keep.go("/shopping_cart.html", false);
			},
			//跳转客服
			tocustomerService() {		
				this.goToRobot({'customField2':this.detail.title,'customField4':this.detail.goodsNumber});
			},
			/*推荐商品点击动画*/
			onTouchstart1(e,data) {
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
			onTouchstart(e,data) {
				var top = window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0; i < this.hotGoods.length; i++) {
          this.hotGoods[i].imgactive = false;
        }
        e.imgactive = true;
        setTimeout(() => {
          this.time = 200;
        }, 200)
			},
			onTouchend1(e,type) {
				var top = window.event.changedTouches[0].clientX
				if(this.time < 200 && this.top >= (top - 3) && this.top <= (top + 3)) {
					e.imgactive = false;
					this.keep.scroll.save();
					if(type == 0){
						this.keep.go("/goods_detail.html", false, {
							goodsid: e.detail.goodsId,showGoHome:'1'
						});
					}else if (type == 1) {
						this.keep.go("/goods_detail.html", false, {goodsid:e.goodsId,showGoHome:'1'	});
					}
					
				} else {
					e.imgactive = false;
				}
			},
			gotoGoods(goodsid) {
				this.keep.go("/goods_detail.html", false, {goodsid:goodsid,showGoHome:'1'});
			},
			onCancel(e) {
				e.imgactive = false;
			},
			/*查询推荐商品*/
			loadSimilarGoods() {
				this.http.get(this).url(this.config.goodsDetail.similarity_goods).params({
					goodsId: this.goodsId,
					size: 6
				}).request((response) => {
					this.firstLoad = false;
					var data = response.data.data;
					data.forEach((n) => {
						n.imgactive = false;
					});
					this.similarGoodsArr = data;
				},(err)=>{
					this.firstLoad = false;
					this.loadFailed = true;
				})
			},
			/*查询购物车数量*/
			showShoppingCartCount() {
        this.http.get(this).url(this.config.goodsDetail.shoppingCart_number).request(function(response) {
        	this.firstLoad = false;
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
        },(err)=>{
        	this.firstLoad = false;
        	this.loadFailed = true;
        })
      },
      /*点击加入购物车弹开展示*/
      shoppingJointoCart(){

      	this.isBuy = false;
      	this.findSubscribe()

      },
      /*点击立即购买弹开展示*/
      shoppingBuynow(){

    		this.isBuy = true;
      	this.findSubscribe()

      }, 
			//商品数量减1
			reduce() {
				if(this.count > 1) {
					this.count--;
				}
			},
			//商品数量加1
			add() {
				if(this.currentStyle.count == 0 && !this.detail.noStorageSale) {
					this.showError('该商品暂无库存');
				} else if(this.count < 99 && !this.detail.noStorageSale && this.count < this.currentStyle.count) {
					this.count++;
				} else if(this.count < 99 && this.detail.noStorageSale){
					this.count++;
				}
			},

			/*加入购物车*/
			addshipcat() {

					if(this.count == 0  && !this.detail.noStorageSale){
						this.showError("该商品暂无库存");
						return;
					}
					this.$indicator.open({spinnerType: 'fading-circle'});
					var users = this.getUserData('user')
					var memberId = JSON.parse(users).memberId;

					this.http.postJson(this).url(this.config.goodsDetail.add_shopping).params({
						goodsId: this.goodsId,
						styleId: this.currentStyle.styleId,
						memberId: memberId,
						amount: this.count
					}).request((req) => {
							this.$indicator.close();
							this.showShopping = false;
							this.showSuccess('加入成功');
							this.showShoppingCartCount();
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

			/*立即购买*/
			createOrder() {

				if(this.count == 0  && !this.detail.noStorageSale){
					this.showError("该商品暂无库存");
					return;
				}
				let items = [];
				let item = {};
				item.goodsId = this.goodsId;
				item.styleId = this.currentStyle.styleId;
				item.amount = this.count;
				item.outright = true;
				items.push(item);
				this.$indicator.open({spinnerType: 'fading-circle'});

				this.http.postJson(this).url(this.config.goodsDetail.buy_now).params({
					items: items
				}).request(function(response) {

					this.$indicator.close();
					let orderId = response.data.data;
					// 页面跳转
					this.keep.go("confirm_order.html", false, {orderId: orderId});

				}, function(error) {
					this.$indicator.close();
				}, function(response) {
					this.$indicator.close();
				});
			},
			initLayer() {

				this.$nextTick(() => {
					var myswiper1 = new swiper('.dim_swiper', {
						slidesPerView: "auto",
						paginationClickable: true,
						freeMode: true,
						observer: true,
						observeParents: true,
						freeMode: true,
						freeModeFluid: true
					});
				});
			},
			swiperSkuChange(sku) {
				console.log(sku)
				this.currentStyle = sku;

				if (sku.count <= 0) {
					if(this.detail.noStorageSale){
						this.count = 1;
					}else{
						this.count = 0;	
					}
				}else{
					this.count = 1;
				}

			  if(!sku.count && !this.detail.noStorageSale){
      		this.showShoppingType = 2;
      	}else{
      		this.showShoppingType = this.buyNowOrJoinCart;
      	}

				this.$refs.goodsSKU.selectSku(sku);
				this.$refs.goodsSKUPop.selectSku(sku);				
			},
			//规格改变执行的方法
			onSkuChange(sku) {
				console.log(sku)
				this.currentStyle = sku;

				for (var i = 0; i < this.swipeInfo.length; i++) {
					if (this.swipeInfo[i].styleId == sku.styleId) {
						this.mySwiper.slideTo(i);
						break ;
					}
				}

				if (sku.count <= 0) {
					if(this.detail.noStorageSale){
						this.count = 1;
					}else{
						this.count = 0;	
					}
				}else{
					this.count = 1;
				}

			  if(!sku.count && !this.detail.noStorageSale){
      		this.showShoppingType = 2;
      	}else{
      		this.showShoppingType = this.buyNowOrJoinCart;
      	}

				this.$refs.goodsSKU.selectSku(sku);
				this.$refs.goodsSKUPop.selectSku(sku);
			}
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/goodsDetail.scss';
	.showAppTip1{
      margin-top:0.5rem !important;
  }
  .mianshort{
    height:4rem;
    overflow: hidden;
  } 
</style>