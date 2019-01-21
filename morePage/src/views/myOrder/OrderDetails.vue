<template>
  <div id="orderDetails_Vue">
    <!-- <Vload v-bind:dataload="loading"></Vload> -->
    <div class="waitAppraise">
      <div class="waitAppraiseContent">
        <p>等待结算</p>
        <p>该笔订单正在等待您去结算</p>
      </div>
    </div>

 
    <div  class="addressMessage">
      <div style="height:1.37rem;">
          <img src="../../assets/img/location.png" >
          <div>
            <b style="overflow:hidden;">
              <span style="display:block;float:left;width:1.58rem">{{order.reallyName}}</span> 
              <span style="display:block;float:right;">{{order.phone}}</span>
            </b>
            <span style="word-break: break-all;">{{order.address}}</span>
          </div>
      </div>
    </div>
    <div class="remark" v-if="order.message">
      <img src="../../assets/img/remarks.png" >
      <p>{{order.message}} </p>
    </div>

    <div class="productInformation">

      <div class="contentBoxMain" @click="goDetal(n)" v-for='n in order.orderGoodsRelations'>
        <div class="productPic">
          <span>
            <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
          </span>
          <img class="goods_status" src="../../assets/img/isPutaway.png" v-if="n.pulled">
          <img class="goods_status" src="../../assets/img/isPulled.png" v-else-if="n.sellout">
          <img class="goods_status" src="../../assets/img/noStorage.png" v-else-if="n.noStorage">
          <img class="goods_status" src="../../assets/img/noCanSend.png" v-else-if="!n.isExpress">
        </div>

        <div class="box-right" style="overflow:hidden;">
          <p class="productTitle">
            {{n.title}}
          </p>
          <p class="productSize" style="width:5rem;max-width:5rem;"><span>{{n.styleName}}</span><span v-if="n.subName">{{n.subName}}</span></p>
          <p class="productPrice">¥{{n.stylePrice}}</p>
          <p class="productNum">x{{n.amount}}</p>
        </div>
      </div>
      <p style="width:100%;height:0.2rem;background:#Fff;"></p>
      <div class="goods_totalMoney">
          <p>共{{totalGoodsAmount}} &nbsp;件商品</p>
          <p>¥ {{((order.goodsMoney).toFixed(2) + "").replace(".00", "") }}</p>
      </div>

    </div>
    <div class="pay">
      <div class="payInformation">
       <!--  <p>
          <span>商品总额</span>
          <span>¥{{order.goodsMoney}}</span>
        </p> -->
        <p>
          <span>运费</span>
          <span>¥{{order.expressMoney}}</span>
        </p>
        <p>
          <span>优惠劵</span>
          <span>-¥{{((order.saleMoney).toFixed(2) + "").replace(".00", "") }}</span>
        </p>
        <p>
          <span>订单总价</span>
          <span>¥{{(order.totalMoney).toFixed(2)}}</span>
        </p>
      </div>
      <div class="btn">
        <p class="cancelBtn" @click='cancelOrder()'>取消订单</p>
        <p class="payBtn" @click="showPay" v-if="!canNotPay">立即支付</p>
        <p class="payBtn" style="background:#cacaca;" v-else>立即支付</p>
      </div>
    </div>
    <div class="cd-popup2 payBox">
      <div class="cd-popup-container2 payMethod">
        <span class="cancel">取消</span>
        <span class="title">选择你的支付方式</span>
        <div class="content1">
          <div @click="wxPay" class="contentBox1">
            <img src="../../assets/img/wx.png" />
            <p>微信支付</p>
          </div>
        </div>
        <!-- <div class="content">
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

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
  import swiper from 'swiper';
  import LoadingView from '@/components/Loading.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  function onBridgeReady(params, context) {
    console.log(JSON.stringify(params))
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', params,
      function(res) {
        console.log(context)
        //window.location.replace('/pay_success.html?orderId='+context.orderId)
        if(res.err_msg == "get_brand_wcpay_request:ok") { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          console.log("支付成功!!!!")
          window.location.replace('/pay_success.html?orderId=' + context.orderId)
        } else if(res.err_msg == "get_brand_wcpay_request:cancel") {
          console.log("支付取消!!!!")
          context.showError('支付取消')
        } else if(res.err_msg == "get_brand_wcpay_request:fail") {
          console.log("支付失败!!!!")
          context.showError('支付失败')
        }
      }.bind(context)
    );
  }
  export default {
    name: 'orderDetails',
    created() {
      document.title = "订单详情"
    },
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      Vload: LoadingView
    },
    data() {
      return {
        totalGoodsAmount:0,
        totalGoodsMoney:0,
        canNotPay:false,
        firstLoad:true,
        loadFailed:false,
        loading: true,
        orderId: null,
        order: {
          orderNumber: null,
          reallyName: '',
          message:'1',
          phone: '',
          address: '',
          goodsMoney: 0,
          expressMoney: 0,
          saleMoney: 0,
          totalMoney: 0,
          orderGoodsRelations: [],
        }
      }
    },
    mounted: function() {
      let showMessage = this.getParam('showMessage');
      let h5 = 0;
      if(showMessage == 1){
        h5 = $('.remark').height();
      }
      var h = document.documentElement.clientHeight;
      var h1 = $('.waitAppraise').height();
      var h2 = $('.addressMessage').height();
      var h3 = $('.pay').height();
      var h4 = h-h1-h2-h3-h5-16;
      $('.productInformation').css('height',h4+'px')

      this.initLayer();
      let orderId = this.getParam('orderId');
      this.orderId = orderId;
      this.loadOrderDetail();
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.loadOrderDetail();
      },
      loadOrderDetail() {
        this.http.get(this).url("/app/api/order/repay/:orderId").restful({
          orderId: this.orderId
        }).request(function(req) {
          this.firstLoad = false;
          console.log(req.data.data)
          this.loading = false;
          var data = req.data.data;
          this.setExpress(data.addressCityCode,data.orderGoodsRelations);
          this.order.reallyName = data.reallyName;
          this.order.phone = data.phone;
          this.order.message = data.message;
          this.order.address = data.address;
          this.order.orderGoodsRelations = data.orderGoodsRelations;
          this.order.goodsMoney = data.totalMoney;
          this.order.expressMoney = data.expressMoney;
          this.order.saleMoney = data.totalMoney - data.settlementMoney + data.expressTotalMoney - data.expressMoney;
          this.order.totalMoney = data.expressMoney  + data.settlementMoney;
          this.order.orderNumber = data.orderNumber;

          
          var totalGoodsAmount = 0;
          var totalGoodsMoney = 0;
          data.orderGoodsRelations.forEach((item)=>{
            totalGoodsAmount +=item.amount;
            totalGoodsMoney += item.money * item.amount;
          })
          this.totalGoodsAmount = totalGoodsAmount;
          this.totalGoodsMoney = totalGoodsMoney;

        }, function(error) {
          this.loadFailed = true;
          this.firstLoad = false;
          this.loading = false;
        }, function(response) {
          this.firstLoad = false;
          this.loadFailed = true;
          this.loading = false;
        })
      },
      setExpress(code,goodsArray) {
        goodsArray.forEach((item)=>{
          var isExpress = false;

          item.supportCityCodes.forEach((cityItem)=>{
            if(cityItem == code){
              isExpress = true;
            }
          })

          if(!isExpress || item.pulled || item.sellout  || item.noStorage ){
            this.canNotPay = true;
          }

          item.isExpress = isExpress;
        })
      },
      goDetal(e) {
        console.log(e)
        this.keep.go('/goods_detail.html', true, {
          goodsid: e.goodsId,showGoHome:'1'
        });
      },
      showPay() {
        event.preventDefault();
        $('.cd-popup2').addClass('is-visible2');
        //关闭弹框
        $(".cd-popup2").click(function(event) {
          if($(event.target).is('.cancel') || $(event.target).is('.cd-popup2') || $(event.target).is('.contentBox1')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        })
      },
      cancelOrder() {
        var orderId = this.getParam('orderId');
        this.$messagebox.confirm('确认取消此订单？').then((action) => {
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          this.http.postJson(this).url('/app/api/order/cancel/:orderId').restful({
            orderId: orderId
          }).request((req) => {
            this.$indicator.close();
            if(req.data.code != 0) {
              return;
            }
            var data = req.data.data;
            if(data == 'success') {
              this.keep.go('/order_list.html', false, {
                activated: 1
              })
            } else {
              this.showError('订单取消失败')
            }
          }, (err) => {
           // this.showError('订单取消失败')
            console.log(err)
          })
        }).catch((err) => {
          //console.log('取消订单', err)
          return;
        });
      },
      wxPay() {

        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        let params = {};
        params.orderId = this.orderId;
        this.http.post(this).url("app/api/pay/order/wx/prepay/:orderNumber").restful({
          orderNumber: this.order.orderNumber
        }).params(params).request(function (response) {
          this.$indicator.close();

          if(response.data.code == 0) { //唤起微信支付
            let payment = response.data.data;

            onBridgeReady({
              "appId": payment.pay.appId, //公众号名称，由商户传入
              "timeStamp": payment.pay.timeStamp, //时间戳，自1970年以来的秒数
              "nonceStr": payment.pay.nonceStr, //随机串
              "package": payment.pay.package,
              "signType": payment.pay.signType, //微信签名方式：
              "paySign": payment.pay.paySign //微信签名
            }, this)
          }
        }, function(error) {
          this.$indicator.close();
          //this.showError("服务器繁忙")
        }, function(response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        })
      },
      initLayer() {
        this.$nextTick(() => {
          var swiper = new Swiper('.swiper-container3', {
            direction: 'vertical',
            slidesPerView: 1.5,
            spaceBetween: 10,
            mousewheel: true,
            observer: true,
          });
        });
      },
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/orderDetails.scss';
</style>