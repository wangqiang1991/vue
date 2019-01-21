<template>
  <div id="orderList_Vue">
    <div class="orderListMain">
      <div class="widget widget-tab">
        <input type="radio" name="widget-tab" id="all" :checked='activated=="first"' />
        <input type="radio" name="widget-tab" id="waitPay" :checked='activated==1' />
        <input type="radio" name="widget-tab" id="waitSend" :checked='activated==2' />
        <input type="radio" name="widget-tab" id="waitGet" :checked='activated==3' />
        <input type="radio" name="widget-tab" id="waitAppraise" :checked='activated==4' />
        <input type="radio" name="widget-tab" id="afterSale" :checked='activated==5' />
        <div class="widget-title inline-block tabs">
          <ul>
            <li class="all" @click='choiceStyle("first")'>
              <label for="all">全部</label>
            </li>
            <li class="waitPay" @click='choiceStyle(1)'>
              <label for="waitPay">待付款</label>
            </li>
            <li class="waitSend" @click='choiceStyle(2)'>
              <label for="waitSend">待发货</label>
            </li>
            <li class="waitGet" @click='choiceStyle(3)'>
              <label for="waitGet">待收货</label>
            </li>
            <li class="waitAppraise" @click='choiceStyle(4)'>
              <label for="waitAppraise">已完成</label>
            </li>
          </ul>
        </div>
        <div class="spaceArea"></div>
        <div class="widget-box">

         <!--  全部订单 -->
          <ul class="all-list">

            <li v-infinite-scroll="allOrderMore" infinite-scroll-disabled="allLoading" infinite-scroll-distance="20">

              <div class="contentBox" v-for='n in allPaymentData'>
                <div class="contentBoxMain" @click='allOrderClick(n)'>

                  <div>
                    <span class="productPic">
                        <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
                      </span>
                    <div class="productIntr" style="overflow:hidden;">
                      <p class="productTitle">
                        {{n.title}}
                      </p>
                      <p class="productSize" style="width:5rem;max-width:5rem;"> <span>{{n.styleName}}</span><span v-if="n.subName">{{n.subName}}</span></p>
                      <div class="priceDiv">
                        <p class="productPrice">¥{{n.stylePrice}}</p>
                        <p class="productNum">x{{n.amount}}</p>
                      </div>
                    </div>
                  </div>
                </div>
               <!--  <div class="contentBoxService">
                  <div class="contentBoxService1" v-show='n.stylePrice*n.amount-n.money+n.expressTotalMoney-n.expressMoney!=0'>
                    <span style="float: left;">优惠金额:</span>
                    <span style="float: right;">-¥{{ (n.stylePrice*n.amount-n.money) + (n.expressTotalMoney-n.expressMoney) }}</span>
                  </div>
                  <div class="contentBoxService1">
                    <span style="float: left;">运费:</span>
                    <span style="float: right;">¥{{n.expressMoney}}</span>
                  </div>
                </div> -->
                <div class="productNum2">
                  <span class="productNumber">共{{n.amount}}件商品 &nbsp; 共计<span>{{n.expressMoney ? "(含运费 ¥"+n.expressMoney+")" : "(免运费)"}}</span></span>
                  <span class="productPrice2">¥{{ ((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "") }}</span>
                </div>
                <div class="contentBoxBtn">
                  <div>
                      
                      <p v-show='n.orderStatus == 2 && n.afterSaleType == null && n.orderType != 4' class="contentBoxTitle">等待平台发货</p>
                      <p v-show='n.orderStatus == 2 && n.afterSaleType == null && n.orderType == 4' class="contentBoxTitle">等待平台发货(换货)</p>

                      <p v-show='n.orderStatus == 3 && n.afterSaleType == null && n.orderType != 4' class="contentBoxTitle">等待您确认收货</p>
                      <p v-show='n.orderStatus == 3 && n.afterSaleType == null && n.orderType == 4' class="contentBoxTitle">等待您确认收货(换货)</p>

                      <p v-show="n.orderStatus == 5 && n.afterSaleType == null && n.orderType != 4" class="contentBoxTitle">已收货商品</p>
                      <p v-show="n.orderStatus == 5 && n.afterSaleType == null && n.orderType == 4" class="contentBoxTitle">已收货商品(换货)</p>

                      
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==1">已申请退款</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==2">商家拒绝退款</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==3">退款中</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==4">退款成功</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==5">退款失败</p>

                      <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==1">已申请换货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==2">商家拒绝换货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==3">商家待收货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==4">商家拒绝换货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==5">商家已确认收货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==6">客户待收货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==7">客户已确认收货</p>
                      
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==1">已申请退货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==2">商家拒绝退货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==3">商家待收货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==4">商家拒绝退款</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==5">商家已确认收货</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==6">退款中</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==7">退款成功</p>
                      <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==8">退款失败</p>

                  </div>
  
                  <p class="returnBtn" v-show='n.orderStatus == 2&& n.afterSaleStatus == null && n.orderType != 4' @click="customerService(n,'all')">申请退款</p>
                  <p class="checkAfterSaleBtn" @click='goAfterSaleInformation(n,"all")' v-show='n.orderStatus == 2 && n.afterSaleStatus != null'>退款详情</p>

                  <p class="sureGetBtn" v-show='n.orderStatus == 3 && n.afterSaleStatus == null' @click="sureReceive(n)">确认收货</p>
                  <p class="returnBtn" v-show='n.orderStatus == 3 && n.afterSaleStatus == null' @click='goLogistical(n,"all")' style="margin-right:0.1rem;">查看物流</p>
                  

                 <!--  <p v-show='n.orderStatus == 5&& n.commentStatus == 1' class="appraiseBtn" @click='goPublish(n)'>评价</p>
                  <p v-show='n.orderStatus == 5&& n.commentStatus == 2' class="appraiseBtn" @click='goCommentContent(n)'>我的评价</p> -->

                  <p class="afterSaleBtn" @click='customerService(n,"all")' v-show='n.orderStatus == 5 && (n.amount > n.afterApplyCount)'>申请售后</p>
                  <!-- <p class="checkAfterSaleBtn" @click='goAfterSaleInformation(n,"all")' v-show='n.orderStatus == 5 && n.afterSaleStatus != null'>售后详情</p> -->

                </div>
              </div>
              <div class="load" v-show='allload'>
                <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
              </div>

              <div class="reload" v-show='reloadflag' @click='reloadData()'>
                  加载失败,点击重新加载
              </div>
              <div v-show='allPaymentData.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
                <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
              </div>

              <div class="end" v-show='allmore'>
                <!-- <p v-if='allPaymentData.length != 0'>没有更多了</p> -->
                <div class="emptyOrder" v-show='allPaymentData.length == 0'>
                  <img src="../../assets/img/noDataorder.png"/>
                  <p>此类订单暂无内容</p>
                </div>
              </div>

            </li>

          </ul>


          <!-- 待付款订单 -->
          <ul class="waitPay-list">

            <li v-infinite-scroll="noPayLoadMore" infinite-scroll-disabled="noPayLoading" infinite-scroll-distance="20">

              <div class="contentBox" v-for='n in noPaymentData'>
                <div class="contentBoxMain" @click='gopay(n)'>
                 
                  <div v-for='goods in n.orderGoodsRelations'>
                    <span class="productPic">
                        <img :src="goods.cover + '?imageView2/0/w/500/h/500|imageslim'" />
                      </span>
                    <div class="productIntr" style="overflow:hidden;">
                      <p class="productTitle">
                        {{goods.title}}
                      </p>
                      <p class="productSize"  style="width:5rem;max-width:5rem;"><span>{{goods.styleName}}</span><span v-if="goods.subName">{{goods.subName}}</span></p>
                      <div class="priceDiv">
                        <p class="productPrice">¥{{goods.stylePrice}}</p>
                        <p class="productNum">x{{goods.amount}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              <!--   <div class="contentBoxService">
                  <div class="contentBoxService1" v-show='n.totalMoney-n.settlementMoney+n.expressTotalMoney-n.expressMoney!=0'>
                    <span style="float: left;">优惠金额:</span>
                    <span style="float: right;">-¥{{ (n.totalMoney-n.settlementMoney) + (n.expressTotalMoney-n.expressMoney) }}</span>
                  </div>
                  <div class="contentBoxService1">
                    <span style="float: left;">运费:</span>
                    <span style="float: right;">¥{{n.expressMoney}}</span>
                  </div>
                </div> -->
                <div class="productNum2">
                  <span class="productNumber">共{{n.totalAmount}}件商品  &nbsp; 共计<span>{{n.expressMoney ? "(含运费 ¥"+n.expressMoney+")" : "(免运费)"}}</span></span>
                  <span class="productPrice2">¥{{ ((n.expressMoney+n.settlementMoney).toFixed(2) + "").replace(".00", "") }}</span>
                </div>
                <div class="contentBoxBtn">
                  <div>
                     <p class="contentBoxTitle" style="color:#f98484;">等待付款</p>
                  </div>
                  <p class="payBtn" @click='gopay(n)'>去支付</p>
                  <p class="cancelBtn" @click='cancelOrder(n)'>取消订单</p>
                </div>
              </div>
              <div class="load" v-show='nopayload'>
                <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
              </div>
              <div class="reload" v-show='reloadflag' @click='reloadData()'>
                  加载失败,点击重新加载
              </div>
              <div v-show='noPaymentData.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
                <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
              </div>
              <div class="end" v-show='nopaymore'>
                <!-- <p v-if='noPaymentData.length != 0'>没有更多了</p> -->
                <div class="emptyOrder" v-show='noPaymentData.length == 0'>
                	<img src="../../assets/img/noDataorder.png"/>
                  <p>此类订单暂无内容</p>
                </div>
              </div>

            </li>

          </ul>

          <!-- 待发货订单 -->
          <ul class="waitSend-list">

            <li v-infinite-scroll="sendOrderMore" infinite-scroll-disabled="sendLoading" infinite-scroll-distance="20">

              <div class="contentBox" v-for='n in sendPaymentData'>
                <div class="contentBoxMain" @click="goSendDetal(n)">
                 
                  <div>
                    <span class="productPic">
                        <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
                      </span>
                    <div class="productIntr" style="overflow:hidden;">
                      <p class="productTitle">
                        {{n.title}}
                      </p>
                      <p class="productSize" style="width:5rem;max-width:5rem;"><span>{{n.styleName}}</span><span v-if="n.subName">{{n.subName}}</span></p>
                      <div class="priceDiv">
                        <p class="productPrice">¥{{n.stylePrice}}</p>
                        <p class="productNum">x{{n.amount}}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- <div class="contentBoxService">
                  <div class="contentBoxService1" v-show='n.stylePrice*n.amount-n.money+n.expressTotalMoney-n.expressMoney!=0'>
                    <span style="float: left;">优惠金额:</span>
                    <span style="float: right;">-¥{{ (n.stylePrice*n.amount-n.money) + (n.expressTotalMoney-n.expressMoney) }}</span>
                  </div>
                  <div class="contentBoxService1">
                    <span style="float: left;">运费:</span>
                    <span style="float: right;">¥{{n.expressMoney}}</span>
                  </div>
                </div> -->
                <div class="productNum2">
                  <span class="productNumber">共{{n.amount}}件商品  &nbsp; 共计<span>{{n.expressMoney ? "(含运费 ¥"+n.expressMoney+")" : "(免运费)"}}</span></span>
                  <span class="productPrice2">¥{{((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "") }}</span>
                </div>
                <div class="contentBoxBtn">
                  <div>
                     <p class="contentBoxTitle" v-show="n.orderType != 4">等待平台发货</p>
                     <p class="contentBoxTitle" v-show="n.orderType == 4">等待平台发货(换货)</p>
                  </div>
                  <p class="returnBtn" v-show='n.orderType != 4' @click="customerService(n,'send')">申请退款</p>
                </div>
              </div>

              <div class="load" v-show='sendload'>
                <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
              </div>
              <div class="reload" v-show='reloadflag' @click='reloadData()'>
                加载失败,点击重新加载
            </div>
            <div v-show='sendPaymentData.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
                <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
              </div>
              <div class="end" v-show='sendmore'>
                <!-- <p v-if='sendPaymentData.length != 0'>没有更多了</p> -->
                <div class="emptyOrder" v-show='sendPaymentData.length == 0'>
                  <img src="../../assets/img/noDataorder.png"/>
                  <p>此类订单暂无内容</p>
                </div>
              </div>

            </li>

          </ul>

         <!--  待收货订单 -->
          <ul class="waitGet-list">

            <li v-infinite-scroll="getOrderMore" infinite-scroll-disabled="getLoading" infinite-scroll-distance="20">

              <div class="contentBox" v-for='n in getPaymentData'>
                <div class="contentBoxMain" @click="goGetDetal(n)">
                 
                  <div>
                    <span class="productPic">
                        <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
                      </span>
                    <div class="productIntr" style="overflow:hidden;">
                      <p class="productTitle">
                        {{n.title}}
                      </p>
                      <p class="productSize"  style="width:5rem;max-width:5rem;"><span>{{n.styleName}}</span><span v-if="n.subName">{{n.subName}}</span></p>
                      <div class="priceDiv">
                        <p class="productPrice">¥{{n.stylePrice}}</p>
                        <p class="productNum">x{{n.amount}}</p>
                      </div>
                    </div>
                  </div>
                </div>
               <!--  <div class="contentBoxService">
                  <div class="contentBoxService1" v-show='n.stylePrice*n.amount-n.money+n.expressTotalMoney-n.expressMoney!=0'>
                    <span style="float: left;">优惠金额:</span>
                    <span style="float: right;">-¥{{ (n.stylePrice*n.amount-n.money) + (n.expressTotalMoney-n.expressMoney) }}</span>
                  </div>
                  <div class="contentBoxService1">
                    <span style="float: left;">运费:</span>
                    <span style="float: right;">¥{{n.expressMoney}}</span>
                  </div>
                </div> -->
                <div class="productNum2">
                  <span class="productNumber">共{{n.amount}}件商品  &nbsp; 共计<span>{{n.expressMoney ? "(含运费 ¥"+n.expressMoney+")" : "(免运费)"}}</span></span>
                  <span class="productPrice2">¥{{ ((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "")  }}</span>
                </div>
                <div class="contentBoxBtn">
                  <div>
                      <p class="contentBoxTitle" v-show="n.orderType != 4">等待您确认收货</p>
                      <p class="contentBoxTitle" v-show="n.orderType == 4">等待您确认收货(换货)</p>
                  </div>
                  <p class="sureGetBtn" @click="sureReceive(n)">确认收货</p>
                  <p class="returnBtn" @click='goLogistical(n,"get")' style="margin-right:0.1rem;">查看物流</p>
                </div>
              </div>

              <div class="load" v-show='getload'>
                <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
              </div>
              <div class="reload" v-show='reloadflag' @click='reloadData()'>
                  加载失败,点击重新加载
              </div>
               <div v-show='getPaymentData.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
                <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
              </div>
              <div class="end" v-show='getmore'>
                <!-- <p v-if='getPaymentData.length != 0'>没有更多了</p> -->
                <div class="emptyOrder" v-show='getPaymentData.length == 0'>
                  <img src="../../assets/img/noDataorder.png"/>
                  <p>此类订单暂无内容</p>
                </div>
              </div>

            </li>

          </ul>




         <!--  已完成订单 -->
          <ul class="waitAppraise-list">

            <li v-infinite-scroll="afterSaleLoadMore" infinite-scroll-disabled="afterSaleLoading" infinite-scroll-distance="20">

              <div class="contentBox" v-for='n in afterSaleData'>
                <div class="contentBoxMain" @click="goCommentDetal(n,3)">
                 
                  <div>
                    <span class="productPic">
                        <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
                      </span>
                    <div class="productIntr" style="overflow:hidden;">
                      <p class="productTitle">
                        {{n.title}}
                      </p>
                      <p class="productSize" style="width:5rem;max-width:5rem;"><span>{{n.styleName}}</span><span v-if="n.subName">{{n.subName}}</span></p>
                      <div class="priceDiv">
                        <p class="productPrice">¥{{n.stylePrice}}</p>
                        <p class="productNum">x{{n.amount}}</p>
                      </div>
                    </div>
                  </div>
                </div>
               <!--  <div class="contentBoxService">
                  <div class="contentBoxService1" v-show='n.stylePrice*n.amount-n.money+n.expressTotalMoney-n.expressMoney!=0'>
                    <span style="float: left;">优惠金额:</span>
                    <span style="float: right;">-¥{{ (n.stylePrice*n.amount-n.money) + (n.expressTotalMoney-n.expressMoney) }}</span>
                  </div>
                  <div class="contentBoxService1">
                    <span style="float: left;">运费:</span>
                    <span style="float: right;">¥{{n.expressMoney}}</span>
                  </div>
                </div> -->
                <div class="productNum2">
                  <span class="productNumber">共{{n.amount}}件商品  &nbsp; 共计<span>{{n.expressMoney ? "(含运费 ¥"+n.expressMoney+")" : "(免运费)"}}</span></span>
                  <span class="productPrice2">¥{{((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "") }}</span>
                </div>
                <div class="contentBoxBtn">
                   <div>
                      <p class="contentBoxTitle" v-show="n.orderType != 4">已完成商品</p>
                      <p class="contentBoxTitle" v-show="n.orderType == 4">已完成商品(换货)</p>
                   </div>
                   <p class="afterSaleBtn" @click='customerService(n,"done")' v-show='n.amount > n.afterApplyCount'>申请售后</p>
                   <!-- <p class="checkAfterSaleBtn" @click='goAfterSaleInformation(n,"done")' v-show='n.afterSaleStatus != null'>售后详情</p> -->
                </div>
              </div>

              <div class="load" v-show='afterSaleload'>
                <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
              </div>
              <div class="reload" v-show='reloadflag' @click='reloadData()'>
                  加载失败,点击重新加载
              </div>
              <div v-show='afterSaleData.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
                <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
              </div>
              <div class="end" v-show='afterSalemore'>
                <!-- <p v-if='afterSaleData.length != 0'>没有更多了</p> -->
                <div class="emptyOrder" v-show='afterSaleData.length == 0'>
                  <img src="../../assets/img/noDataorder.png"/>
                  <p>此类订单暂无内容</p>
                </div>
              </div>

            </li>

          </ul>

        </div>
      </div>
    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>


  </div>
</template>

<script>

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'orderList',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    created() {
      document.title = "我的订单"
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        reloadflag:false, //网络错误出现的标志

        allPaymentData: [],  //全部订单的数组
        allLoading: false,   //全部订单的滚动条件
        allload: false,      //全部订单滚动时 ... 显示条件
        allmore: false,      //全部订单是否滚动到底了
        allOrderPage: 1,     //全部订单的分页页码

                             //下面依次类推
        noPaymentData: [],   // 待付款
        noPayLoading: true,
        nopayload: false,
        nopaymore: false,
        noPayPage: 1,


        sendPaymentData: [],  //待发货
        sendLoading: true,
        sendload: false,
        sendmore: false,
        sendPage: 1,


        getPaymentData: [],   //待收货
        getLoading: true,
        getload: false,
        getmore: false,
        getPage: 1,


        afterSaleData: [],   //已收货
        afterSaleLoading: true,
        afterSaleload: false,
        afterSalemore: false,
        afterSalePage: 1,

        activated: 0   //切换banner用的变量
      }
    },
    mounted() {
      //this.findComment()
      if(this.keep.isKeepAlive()){
        this.activate = this.keep.cache.get('activate');
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.activate = this.getParam('activated');
        this.keep.cache.remove('activate');        
      }
      var activate = this.activate;
      
      console.log(activate)
      if(activate !== null) {
        this.allLoading = true;
        this.activated = activate;
        if(activate == 'first') {
          this.allLoading = false;
          return;
        }
        if(activate == 1) {
          this.noPayLoading = false;
          return;
        }
        if(activate == 2) {
          this.sendLoading = false;
          return;
        }
        if(activate == 3) {
          this.getLoading = false;
          return;
        }
        if(activate == 4) {
          this.afterSaleLoading = false;
          return;
        }
      }
      //if(activate == )
      // this.activated = 1;
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.allLoading = false;
        this.noPayLoading = false;
        this.sendLoading = false;
        this.getLoading = false;
        this.afterSaleLoading = false;
      },
      reloadData(){
        this.reloadflag = false;
        this.allLoading = false;
        this.noPayLoading = false;
        this.sendLoading = false;
        this.getLoading = false;
        this.afterSaleLoading = false;
      },
      choiceStyle(e) {
        this.activated = e;
        this.allLoading = true;
        this.noPayLoading = true;
        this.sendLoading = true;
        this.getLoading = true;
        this.afterSaleLoading = true;
        if(e == "first") {
          this.allmore = false;
          this.allLoading = false;
          return;
        }
        if(e == 1) {
          this.nopaymore = false;
          this.noPayLoading = false;
          return;
        }
        if(e == 2) {
          this.sendmore = false;
          this.sendLoading = false;
          return;
        }
        if(e == 3) {
          this.getmore = false;
          this.getLoading = false;
          return;
        }
        if(e == 4) {
          this.afterSalemore = false;
          this.afterSaleLoading = false;
          return;
        }
      },
      //查询待支付订单
      noPayment() {
        this.http.get(this).url('/app/api/order/list/non-payment').params({
          pageIndex: this.noPayPage
        }).request((req) => {
          this.firstLoad = false;
          if(req.data.code != 0) {
            return;
          }
          var data = req.data.data;
          console.log(data)
          if(data.length == 0) {
            this.noPayLoading = true;
            this.nopaymore = true;
          } else {
            this.noPayLoading = false;
            this.noPayPage++
          }
          this.nopayload = false;
          for(var i = 0; i < data.length; i++) {
            var totalAmount = 0;
            data[i].orderGoodsRelations.forEach((item)=>{
              totalAmount+=item.amount;
            })
            data[i].totalAmount = totalAmount;
            this.noPaymentData.push(data[i]);
          }
        }, (err) => {
          this.firstLoad = false;
          this.loadFailed = true;
          //this.noPayLoading = false;
          this.nopayload = false;
          //this.nopaymore = true;
          this.reloadflag = true;
          console.log(err)
        })
      },
      //查询所有type==null，待发货type==2，待收货type==3，已完成type==5 数据
      findOrder(type, pageIndex) {
        this.http.get(this).url('/app/api/order/list').params({
          orderStatus: type,
          pageIndex: pageIndex
        }).request((req) => {
          this.firstLoad = false;
          if(req.data.code != 0) {
            return;
          }
          var data = req.data.data;
          console.log(data)

          if(type == null) {
            if(data.length == 0) {
              this.allLoading = true;
              this.allmore = true;
              
            } else {
              this.allLoading = false;
              this.allOrderPage++;
            }
            this.allload = false;
            for(var i = 0; i < data.length; i++) {
              this.allPaymentData.push(data[i]);
            }
            console.log(66666+"+++++++")
            console.log(this.allLoading)
            return;
          }

          if(type == 2) {
            if(data.length == 0) {
              this.sendLoading = true;
              this.sendmore = true;
            } else {
              this.sendLoading = false;
              this.sendPage++;
            }
            this.sendload = false;
            for(var i = 0; i < data.length; i++) {
              if(data[i].afterSaleType == null){
                this.sendPaymentData.push(data[i]);
              }
            }
            return;
          }

          if(type == 3) {
            if(data.length == 0) {
              this.getLoading = true;
              this.getmore = true;
            } else {
              this.getLoading = false;
              this.getPage++;
            }
            this.getload = false
            for(var i = 0; i < data.length; i++) {
              this.getPaymentData.push(data[i]);
            }
            return;
          }

          if(type == 5) {
            if(data.length == 0) {
              this.afterSaleLoading = true;
              this.afterSalemore = true;
            } else {
              this.afterSaleLoading = false;
              this.afterSalePage++;
            }
            this.afterSaleload = false
            for(var i = 0; i < data.length; i++) {
              this.afterSaleData.push(data[i]);
            }
            return;
          }

        }, (err) => {
          this.firstLoad = false;
          this.loadFailed = true;
         // this.allmore = true;
          this.allload = false;
          //this.sendmore = true;
          this.sendload = false;
         // this.getmore = true;
          this.getload = false;
         // this.afterSalemore = true;
          this.afterSaleload = false;
          this.reloadflag = true;

          console.log(err)
        })
      },
      allOrderClick(e){
        if(e.orderStatus == 2){
          this.keep.cache.push('activate',"first");
          this.keep.scroll.save();
          if(e.afterSaleStatus != null){
            this.keep.go("/afterSale_information.html", true, {
              relationId: e.relationId,
              orderNumber: e.orderNumber
            });
           }else{
            this.keep.go('/orderInformation_wait.html', true, {
              orderNumber: e.orderNumber
            });
           }
         
        }else if (e.orderStatus == 3) {
          this.keep.cache.push('activate',"first");
          this.keep.scroll.save();
          this.keep.go('/receiveGoods_wait.html', true, {
            orderNumber: e.orderNumber
          });
        }else if (e.orderStatus == 5) {
          this.keep.cache.push('activate',"first");
          this.keep.scroll.save();
          if(e.afterSaleStatus != null){
            this.keep.go("/afterSale_information.html", true, {
              relationId: e.relationId,
              orderNumber: e.orderNumber
            });
          }else{
            this.keep.go('/appraise_wait.html', true, {
              orderNumber: e.orderNumber,
              orderStatus: 3,
              afterSaleStatus: e.afterSaleStatus
            });
          }
        }
      },
      //到支付页面详情
      gopay(e) {
        console.log(e);
        let showMessage = e.message ? 1 : 0;
        this.keep.cache.push('activate',1);
        this.keep.scroll.save();
        this.keep.go('/order_details.html', true, { orderId: e.orderId,showMessage:showMessage});
      },
      //到待发货详情
      goSendDetal(e) {
        console.log(e)
        this.keep.cache.push('activate',2);
        this.keep.scroll.save();
        this.keep.go('/orderInformation_wait.html', true, {
          orderNumber: e.orderNumber
        });
      },
      //到待收货详情
      goGetDetal(e) {
        this.keep.cache.push('activate',3);
        this.keep.scroll.save();
        this.keep.go('/receiveGoods_wait.html', true, {
          orderNumber: e.orderNumber
        });
      },
      //到已完成详情
      goCommentDetal(e,n) {
        this.keep.cache.push('activate',4);
        this.keep.scroll.save();
        if (!e.afterSaleStatus) {
          e.afterSaleStatus = 'null';
        }
        this.keep.go('/appraise_wait.html', true, {
          orderNumber: e.orderNumber,
          orderStatus: n,
          afterSaleStatus: e.afterSaleStatus
        });
      },
      //到评价界面
      goPublish(e) {
        this.keep.cache.push('activate',"first");
        this.keep.scroll.save();
        this.keep.go("/publish_commentaries.html", true, {
          orderGoodsId: e.relationId,
          goodsId: e.goodsId,
          styleId: e.styleId
        });
      },
      //到已评价界面
      goCommentContent(e){
        console.log(e)
        this.keep.cache.push('activate',"first");
        this.keep.scroll.save();
        this.keep.go('/comment_content.html',true,{'relationId':e.relationId})
      },
      //到申请售后界面
      customerService(e,n) {
        console.log(e.orderNumber)
        if(n == 'all'){
          this.keep.cache.push('activate',"first");
        }else if(n == 'send'){
          this.keep.cache.push('activate',2);
        }else if(n == 'done'){
          this.keep.cache.push('activate',4);
        }
        this.keep.scroll.save();
        this.keep.go("/return_goods.html", true, {
          relationId: e.relationId,
          orderNumber: e.orderNumber,
          orderStatus: e.orderStatus
        });
      },
      //到售后详情界面
      goAfterSaleInformation(e,n) {
        console.log(e)
        if(n == 'all'){
          this.keep.cache.push('activate',"first");
        }else if(n == 'done'){
          this.keep.cache.push('activate',4);
        }
        this.keep.scroll.save();
        this.keep.go("/afterSale_information.html", true, {
          relationId: e.relationId,
          orderNumber: e.orderNumber
        });
      },
      //到查看物流界面
      goLogistical(e,n) {
        console.log(e.orderNumber);
        if(n == 'all'){
          this.keep.cache.push('activate',"first");
        }else if(n == 'get'){
          this.keep.cache.push('activate',3);
        }
        this.keep.scroll.save();
        this.keep.go('/logistical.html', true, {
          orderNumber: e.orderNumber
        });
      },  
//    goDetal(e) {
//      console.log(e)
//      if(e.orderStatus == 2) {
//        this.keep.go('/orderInformation_wait.html', true, {
//          orderNumber: e.orderNumber
//        });
//      }
//      if(e.orderStatus == 3) {
//        this.keep.go('/receiveGoods_wait.html', true, {
//          orderNumber: e.orderNumber
//        });
//      }
//      if(e.orderStatus == 5) {
//        this.keep.go('/appraise_wait.html', true, {
//          orderNumber: e.orderNumber,
//          orderStatus : e.orderStatus
//        });
//      }
//    },
      //取消订单按钮
      cancelOrder(e) {
        this.$messagebox.confirm('确认取消此订单？').then((action) => {
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          this.http.postJson(this).url('/app/api/order/cancel/:orderId').restful({
            orderId: e.orderId
          }).request((req) => {
            this.$indicator.close();
            if(req.data.code != 0) {
              return; 
            }
            var data = req.data.data;
            if(data == 'success') {
              for(var i = 0; i < this.noPaymentData.length; i++) {
                if(e.orderId == this.noPaymentData[i].orderId) {
                  console.log(i)
                  this.noPaymentData.splice(i, 1);
                }
              }
              this.showSuccess('订单取消成功')
            } else {
              this.showError('订单取消失败')
            }
          }, (err) => {
           // this.showError('订单取消失败')
            console.log(err)
          })
        }).catch((err) => {
          console.log('取消订单', err)
          return;
        });
      },
      //确认收货界面
      sureReceive(e) {
        this.$messagebox({
         message: '您是否对该订单商品确认收货？',
         cancelButtonText:"未收到货",
         showCancelButton:true,
         confirmButtonText:"确认收货",
         showConfirmButton:true
        }).then((action) => {
          if(action == "cancel"){
            return ;
          }
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          this.http.postJson(this).url('/app/api/order/receive/:relationId').restful({
            relationId: e.relationId
          }).request((req) => {
            this.$indicator.close();
            if(req.data.code != 0) {
              return;
            }
            console.log(req);
            var data = req.data.data;
            if(data == 'success') {
              this.keep.go('/order_list.html', false, {
                activated: 4
              })
            } else {
              this.showError('提交失败')
            }
          }, (err) => {
            console.log(err)
          })
        });
      },
      //所有订单列表滚动事件
      allOrderMore() {
        console.log(333333+"+-+-+-")
        this.allLoading = true;
        this.allload = true;
        //this.allOrderPage++;
        this.findOrder(null, this.allOrderPage);
      },
      //待发货列表滚动事件
      sendOrderMore() {
        this.sendLoading = true;
        this.sendload = true;
        //this.sendPage++;
        this.findOrder(2, this.sendPage);
      },
      //待收货列表滚动事件
      getOrderMore() {
        this.getLoading = true;
        this.getload = true;
        //this.getPage++;
        this.findOrder(3, this.getPage);
      },
      //待付款列表滚动事件
      noPayLoadMore() {
        this.noPayLoading = true;
        this.nopayload = true;
        this.noPayment()
      },
      //已完成列表滚动事件
      afterSaleLoadMore() {
        this.afterSaleLoading = true;
        this.afterSaleload = true;
        this.findOrder(5,this.afterSalePage)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/orderList.scss';
   .reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }
</style>