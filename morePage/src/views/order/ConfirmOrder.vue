<template>
  <div id="sureOrder_Vue">

    <!-- <LoadingView v-bind:dataload="loading"></LoadingView> -->
      <div v-if="order.addressId" @click="toChoiceAddress" v-show="!loading" class="addressMessage">
        <div>
            <img src="../../assets/img/location.png" >
            <div>
              <b>{{order.reallyName}} <span style="display:inline-block;width:0.14rem"></span> {{order.phone}} </b>
              <span style="word-break: break-all;">{{order.province}}{{order.city}}{{order.county}}{{order.address}}</span>
            </div>
        </div>
      </div>

      <div v-else @click="toChoiceAddress" v-show="!loading" class="noAddress">
        <img src="../../assets/img/addAddress1.png" >
        <p>请添加收货地址</p>
      </div>

      <img class="order_line" src="../../assets/img/color_line.png"/>


    <div v-show="!loading" class="productContent" style="overflow:hidden;">
      <div v-for="product in order.orderGoodsRelations" class="contentBoxMain">
        <div class="productPic">
          <img class="goods_message" v-lazy="product.cover+ '?imageView2/0/w/500/h/500|imageslim' "/>
          <img v-if="!product.isExpress" class="can_not_express" src="../../assets/img/noCanPay.png" >
        </div>

        <p class="productTitle">{{product.title}}</p>
        <span class="productSize" style="width:5rem;"> <span>{{product.styleName}}</span><span v-if="product.subName">{{product.subName}}</span></span>
        
        <!-- 选择全场优惠券 -->
        <p class="productPrice" v-if="coupon != null">¥{{product.stylePrice}}</p>                 
         <!-- 没有选择全场优惠券 -->
        <p class="productPrice" v-else>¥{{product.discountPrice}}  <span v-if="product.discountType">¥{{product.stylePrice}}</span> </p>

        <p class="productNum">x{{product.amount}}</p>
      </div>
    </div>

    <div v-show="!loading" class="cd-popup2 payBox">
      <div class="cd-popup-container2 payMethod">
        <span class="cancel" @click="cancelPay">取消</span>
        <span class="title">选择你的支付方式</span>
        <div class="content1">
          <div @click="wxPay" class="contentBox1">
            <img src="../../assets/img/wx.png"/>
            <p>微信支付</p>
          </div>
        </div>
       <!--  <div class="content">
          <div class="contentBox2">
            <p>申请贷款</p>
          </div>
        </div> -->
        <p>更多支付方式请下载APP使用</p>
      </div>
      <!--<div class="payBtn">-->
        <!--<div class="aTotalOf">-->
          <!--<p>实付款：-->
            <!--<span>¥{{order.settlementMoney}}</span>-->
          <!--</p>-->
        <!--</div>-->
        <!--<div class="sureBtn">-->
          <!--<p>结算</p>-->
        <!--</div>-->
      <!--</div>-->
    </div>

    <div v-show="!loading" class="orderService">
      <div class="service">
        <span>运费</span>
        <span class="postage">¥{{order.expressMoney}}</span>
      </div>

      <div @click="toChoiceCoupons" class="service useCoupons">
        <span>优惠券</span>

        <span v-if="order.haveCoupon" class="useCouponsText">
          <span v-if="coupon == null">选择优惠券</span>
          <span v-else style="color:#f75151;">{{coupon.name}}</span>
        </span>

        <span v-if="!order.haveCoupon" class="useCouponsText">暂无可用</span>

        <img src="../../assets/img/new_arrow_right.png"/>
      </div>

      <div class="service massage" style="margin-bottom:0;">
        <span>留言：</span>
        <input type="text" v-model="message" maxlength="300" placeholder="输入留言" onfocus="this.placeholder=''"
               onblur="this.placeholder='选填'"/>
      </div>

    </div>

<!--     <div v-if="(coupon != null) && !coupon.global" class="showExpress">
      <p>部分商品折扣共{{((order.couponMoney).toFixed(2) + "").replace(".00", "")}}元</p>
    </div> -->

    <div style="width:100%;height:0.8rem;background:#f2f2f2;"></div>

    <div v-show="!loading" class="fixedArea">
      <div class="aTotalOf">
        <p>
          <span>¥{{((order.payMoney).toFixed(2) + "").replace(".00", "") }}</span>
          <b v-if="coupon != null">已优惠:{{((order.couponMoney).toFixed(2) + "").replace(".00", "")}}</b>
          <b v-else  v-show="order.initCouponMoney > 0">已优惠:{{((order.initCouponMoney).toFixed(2) + "").replace(".00", "")}}</b>
        </p>
      </div>

      <div class="sureBtn" v-if="!canNotPay" @click="confirmOrder()">
        <p>立即支付</p>
      </div>
      <div class="sureBtn" v-else style="background:#cacaca;">
        <p>立即支付</p>
      </div>


    </div>


    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>

  import LoadingView from '@/components/Loading.vue'
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  function onBridgeReady(params,context) {
    // console.log(JSON.stringify(params))
    //alert(params)
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', params,
      function (res) {
       // alert(JSON.stringify(res))
       //context.showError('支付失败')
       // window.location.replace('/pay_success.html?orderId='+context.order.orderId)
       //alert(res.err_msg)
        if (res.err_msg == "get_brand_wcpay_request:ok") { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          console.log("支付成功!!!!")
          window.location.replace('/pay_success.html?orderId='+context.order.orderId)
        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
          console.log("支付取消!!!!")
          context.showError('支付取消')
        } else if (res.err_msg == "get_brand_wcpay_request:fail") {
          console.log("支付失败!!!!")
          context.showError('支付失败')
        }
      }.bind(context)
    );
  }

  export default {
    name: 'sureOrder',
    data() {
      return {
        canNotPay:false,
        firstLoad:true,
        loadFailed:false,
        loading: false,
        order: {
          reallyName: '',
          phone: '',
          province:'',
          city:'',
          county:'',
          address: '',
          orderGoodsRelations: [],
          initCouponMoney:0,  //初始商品金额
          settlementMoney:0, //运费金额
          payMoney:0,  //总金额
          couponMoney:0, //优惠金额
          orderTotalMoney:0 //无优惠券订单总金额
        },
        addressObject:{},
        message:'',
        coupon:null,
        addressId:null
      }
    },
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      LoadingView
    },
    created (){
      document.title="订单确认"
    },

    beforeDestroy() {
      clearInterval(this.intervalAddress);
      clearInterval(this.intervalCoupon);
    },

    mounted: function () {
      this.$nextTick(function () {

        $(".payBox").on("touchmove", function () {
          event.preventDefault();
        })
        $(".payBox").on("click", function () {
          event.preventDefault();
        })

        if (this.keep.isKeepAlive()) {
          this.firstLoad = false;

          //读取缓存
          this.order = this.keep.cache.get("ConfirmOrder");
          this.addressId = this.keep.cache.get("addressId");
          this.message = this.order.message;
          this.coupon = this.order.couponVo;
          console.log(this.coupon)

          this.initAddressCache();

          this.initCouponCache();

          // 标记不keep-alive
          this.keep.markNotKeepAlive();
          this.$nextTick(() => {
            this.keep.scroll.recoverAndClear();
          });

        } else {
          this.firstLoad = true;
          let orderId = this.getParam('orderId');
          this.loadOrderDetail(orderId);
          this.keep.cache.remove("addressId");
          this.keep.cache.remove("ConfirmOrder");
        }

        this.intervalAddress = setInterval(() => {
          this.initAddressCache();
        }, 500)

        this.intervalCoupon = setInterval(() => {
          this.initCouponCache();
        }, 500)

        console.log(this.order)

      })

    },
    methods: {


      reload() {
        this.loadFailed = false;
        let orderId = this.getParam('orderId');
        this.loadOrderDetail(orderId);
      },
      cancelPay(){
        $('.cd-popup2').removeClass('is-visible2');
      },

      /*设置是否支持配送*/
      setExpress(code,goodsArray) {
        var canNotExpressCount = 0;

        goodsArray.forEach((item)=>{
          var isExpress = false;

          item.supportCityCodes.forEach((cityItem)=>{
            if(cityItem == code){
              isExpress = true;
            }
          })

          if(!isExpress){
            canNotExpressCount++;
          }

          item.isExpress = isExpress;
        })

        if(canNotExpressCount > 0){
          this.canNotPay = true;
        } else {
          this.canNotPay = false;
        }

      },

      loadOrderDetail(orderId) {
        this.loading = true;
        console.log(orderId);
        this.http.get(this).url("/app/api/order/:orderId").restful({
          orderId: orderId
        }).request(function (response) {
          let data = response.data.data;
          if(data.addressCityCode){
            this.setExpress(data.addressCityCode,data.orderGoodsRelations);
          } else {
            data.orderGoodsRelations.forEach((item)=>{
              item.isExpress = true;
            })
          }
          /*初始优惠金额*/
          data.initCouponMoney = data.totalMoney - data.settlementMoney;
          
          data.couponMoney = 0;
          data.payMoney = data.expressMoney + data.settlementMoney;
          data.orderTotalMoney = data.expressMoney + data.totalMoney;

          this.firstLoad = false;
          this.loading = false;
          this.order = response.data.data;
          this.message = this.order.message;
          this.coupon = this.order.couponVo;
          this.addressId = this.order.addressId;
          this.keep.cache.push("ConfirmOrder", this.order);

          console.log(this.order)
        }, function (error) {
          this.loadFailed = true;
          this.firstLoad = false;
          //this.showError("服务器繁忙")
          this.loading = false;
        }, function (response) {
          this.firstLoad = false;
          this.loadFailed = true;
          //this.showError(response.message);
          this.loading = false;
        })

      },

      /*刷新运费信息*/
      refreshExpress(addressId) {
        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        this.http.get(this).url("/app/api/order/express/money/:orderId").restful({orderId: this.order.orderId}).params({
          addressId:addressId
        }).request(function (response) {
          this.$indicator.close();
          let data = response.data.data;
          //运费金额
          this.order.expressMoney = response.data.data.expressMoney;

          //订单总金额
          this.order.payMoney = data.expressMoney + data.settlementMoney;

        }, function (error) {
          this.$indicator.close();
          this.loadFailed = true;
        })
      },

      initAddressCache() {
        //判断是否选择了地址
        let choiceAddress = this.keep.cache.get("ChoiceAddress",null,'/receiver_address.html');
        if (choiceAddress) {
          console.log("choiceAddress++++++++++++++++++++++")

          this.order.reallyName = choiceAddress.reallyName;
          this.order.phone = choiceAddress.phone;

          this.order.province = choiceAddress.province;
          this.order.city = choiceAddress.city;
          this.order.county = choiceAddress.county;
          this.order.address = choiceAddress.address;
          this.order.addressCityCode = choiceAddress.cityCode;
          this.order.addressId = choiceAddress.addressId;
          this.addressId = choiceAddress.addressId
          this.addressObject = choiceAddress;

          console.log(this.order, this.addressObject)
          //console.log(choiceAddress)

          this.refreshExpress(choiceAddress.addressId);
          this.setExpress(choiceAddress.cityCode,this.order.orderGoodsRelations);

          this.keep.cache.removeByPathname("/receiver_address.html","ChoiceAddress");
        }
      },

      initCouponCache() {
        //判断是否选择了优惠券
        let choiceCoupon = this.keep.cache.get("ChoiceCoupon",null,'/choice_coupons.html');
        //console.log(choiceCoupon)
        if (choiceCoupon && this.order) {

          if (choiceCoupon == 'null') {
            let params = {};
            params.couponId = null;
            this.coupon = null;
            this.order.couponVo = null;
            this.refreshOrderWithCoupon(params);
          } else {
            this.coupon = choiceCoupon;
            this.order.couponVo = choiceCoupon;
            this.refreshOrderWithCoupon(this.coupon);
          }

          if(this.order.addressCityCode){
            this.setExpress(this.order.addressCityCode,this.order.orderGoodsRelations);
          }
          //清除sessionStorage缓存
          this.keep.cache.removeByPathname("/choice_coupons.html","ChoiceCoupon");

        }
      },

      //计算使用优惠券之后的金额
      refreshOrderWithCoupon(coupon) {
        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        this.http.get(this).url("/app/api/order/coupon/money/:orderId").restful({orderId:this.order.orderId}).params({
          orderId:this.order.orderId,
          couponId:coupon.couponId
        }).request(function (response) {
          this.$indicator.close();
          let data = response.data.data;
          //优惠金额
          this.order.couponMoney = this.order.orderTotalMoney - data.expressMoney - data.settlementMoney;

          //订单总金额
          this.order.payMoney = this.order.expressMoney + data.settlementMoney;

          //console.log(response);
        },function (error) {
          this.loadFailed = true;
          this.$indicator.close();
          //this.showError("服务器繁忙")
        },function (response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        });

      },

      toChoiceAddress() {
        this.order.message = this.message;
        this.keep.cache.push('addressId',this.addressId);
        this.keep.cache.push("ConfirmOrder", this.order);
        this.keep.go('/receiver_address.html',true,{choice:true})
      },

      toChoiceCoupons() {
        let params = {orderId:this.order.orderId};
        if (this.coupon) {
          params.couponId = this.coupon.couponId;
        }
        this.order.message = this.message;
        this.keep.cache.push('addressId',this.addressId);
        this.keep.cache.push("ConfirmOrder", this.order);
        this.keep.go('/choice_coupons.html',true,params)
      },

      /**
       * 功能:确认订单
       */
      confirmOrder() {
        // 判断是否选择地址
        if (!this.order.reallyName || this.order.reallyName.trim().length == 0) {
          this.showError('请选择收货人');
          return;
        }
        if (!this.order.phone || this.order.phone.trim().length == 0) {
          this.showError('请选择收货人电话');
          return;
        }
        if (!this.order.address || this.order.address.trim().length == 0) {
          this.showError('请选择收货地址');
          return;
        }


        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        let params = {};
        params.orderId = this.order.orderId;

        params.addressId = this.order.addressId;

        // console.log(params.addressId)

        if (this.message && this.message.trim().length > 0) {
          params.message = this.message;
        }

        if (this.coupon) {
          params.couponId = this.coupon.couponId;
        }

        this.http.postJson(this).url("/app/api/order/confirm").params(params).request(function (response) {
          this.$indicator.close();

          // console.log(response);

          if (response.data.code == 0) {
            this.keep.cache.removeByPathname("/receiver_address.html","ChoiceAddress");
            this.keep.cache.removeByPathname("/choice_coupons.html","ChoiceCoupon");
            this.showPay();
          }

        }, function (error) {
          this.$indicator.close();
         // this.showError("服务器繁忙")
        }, function (response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        })
      },

      showPay() {
        event.preventDefault();
        $('.cd-popup2').addClass('is-visible2');
        //关闭弹框
        $(".cd-popup2").click(function (event) {
          if ($(event.target).is('.cancel') || $(event.target).is('.cd-popup2') || $(event.target).is('.contentBox1')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        })

      },

      wxPay() {

        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        this.http.post(this).url("app/api/pay/order/wx/prepay/:orderNumber").restful({
          orderNumber: this.order.orderNumber
        }).params({orderId:this.order.orderId}).request(function (response) {
          this.$indicator.close();

          if (response.data.code == 0) {  //唤起微信支付
            let payment = response.data.data;
            // console.log(payment)
            onBridgeReady({
              "appId": payment.pay.appId,     //公众号名称，由商户传入
              "timeStamp": payment.pay.timeStamp,         //时间戳，自1970年以来的秒数
              "nonceStr": payment.pay.nonceStr, //随机串
              "package": payment.pay.package,
              "signType": payment.pay.signType,         //微信签名方式：
              "paySign": payment.pay.paySign //微信签名
            },this)
          }
        }, function (error) {
          this.$indicator.close();
          //this.showError("服务器繁忙")
        },function (response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        })
      }

    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/ConfirmOrder.scss';
</style>
