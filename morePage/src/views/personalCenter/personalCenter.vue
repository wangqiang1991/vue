<template>
  <div id="personalCenter_Vue">
    <div class="userHeader">
    <div>
      <div class="userBox"  @click="goMembers">
        <img  :src="user.head"  class="headPic"/>
        <p class="personalName">{{user.nickName}}</p>
        <p class="editUser">查看并编辑个人资料</p>
      </div>
      <div class="messageBox" @click="toMessageCenter">
          <img src="../../assets/img/nav_icon_message.png" />
          <span v-show="unread" class="showUnread"></span>       
      </div>
    </div>  
    </div>
    <!-- <div class="line"></div> -->
    <div class="main">

      <div class="myOrder">
        <div class="myOrderTitle">
          <!-- <p>我的订单</p> -->
          <span style="color:#666;" @click='toOrder("first")'>查看全部订单</span>
          <!-- <img src="../../assets/img/right.png" /> -->
        </div>
        <div class="informationBox" @click='toOrder(1)'>
          <div class="picBox">
            <img src="../../assets/img/nopay_image.png" />
            <mt-badge size="small" v-show='pendingPayment != 0'>{{pendingPayment}}</mt-badge>
            <p>待付款</p>
          </div>
        </div>
        <div class="informationBox" @click='toOrder(2)'>
          <div class="picBox">
            <img src="../../assets/img/order_send_image.png" />
            <mt-badge size="small" v-show='pendingDeliver != 0'>{{pendingDeliver}}</mt-badge>
            <p>待发货</p>
          </div>
        </div>
        <div class="informationBox" @click='toOrder(3)'>
          <div class="picBox">
            <img src="../../assets/img/order_reciver.png" />
            <mt-badge size="small" v-show='pendingReceived != 0'>{{pendingReceived}}</mt-badge>
            <p>待收货</p>
          </div>
        </div>
        <div class="informationBox" @click='toComment()'>
          <div class="picBox">
            <img src="../../assets/img/order_comment.png" />
            <mt-badge size="small" v-show='pendingComments != 0'>{{pendingComments}}</mt-badge>
            <p>待评价</p>
          </div>
        </div>

        <div class="informationBox" @click='toService()'>
          <div class="picBox"  @click="goReturnGoods">
            <img src="../../assets/img/order_apprise.png" />
            <mt-badge size="small" v-show='saleService != 0'>{{saleService}}</mt-badge>
            <p>退换货</p>
          </div>
        </div>
      </div>


      <div class="myService">
        <div class="plan_item" @click="toCollectPlan" >
          <img src="../../assets/img/icon_plan_collect.png" >
          <p>我领取&关注的软装方案</p>      
        </div>


        <div class="service_item"  @click="toShoppingCart">
          <img src="../../assets/img/new_icon_cart.png" />
          <mt-badge size="small" v-show='shoppingCartNum != 0'>{{shoppingCartNum}}</mt-badge>
          <p>购物车</p>
        </div>

        <div class="service_item" @click="toCoupons">
          <img src="../../assets/img/me_icon_coupon.png" />
          <p>优惠券</p>
        </div>

         <div class="service_item" @click="goLike">
           <img src="../../assets/img/me_liek-start.png" />
           <p>喜欢</p>
        </div>

         <div class="service_item" style="border-bottom:none;" @click="toCollect">
           <img src="../../assets/img/me_liek_image.png" />
           <p>收藏</p>
        </div>

        <div class="line"></div>  


        <div class="service_item"  @click="toAddress">
          <img src="../../assets/img/me_icon_address.png"/>
          <p>地址管理</p>
        </div>

        <div class="service_item" @click="toHelpCenter" style="border-bottom:none;" >
          <img src="../../assets/img/me_icon_help.png" />
          <p>帮助中心</p>
        </div>

        
<!--         <div class="service_item" @click="toMessageCenter" style="border-bottom:none;">
          <img src="../../assets/img/nav_icon_message.png" />
          <p>消息中心</p>
          <span v-show="unread" class="showUnread"></span>
        </div> -->

<!-- 
         <div class="service_item" style="border-bottom:none;" @click="tocustomerService">
            <img src="../../assets/img/new_icon_service.png" />
            <mt-badge size="small" v-show='messageCount != 0'>{{messageCount}}</mt-badge>
            <p>客服</p>
        </div>
        
        <div class="zhiCustomBtn" style="display:none !important;"></div>   -->
<!-- 
        <div class="service_item" @click="gotoShare">
          <img src="../../assets/img/share_to_firend.png" />
          <p>推荐给好友</p>
        </div>
 -->
       <!--  <div class="service_item" style="border-bottom:none;" @click="goFeedback">
          <img src="../../assets/img/me_icon_prom.png" />
          <p>打小报告</p>
        </div> -->


      </div>

    </div>
    <Vmenu thisChoice='my'></Vmenu>
  </div>
</template>

<script>
  import Menu from '../../components/Menu.vue';
  import { Badge } from 'mint-ui';
  import {setCookie} from  "../../commons/tools.js";
  export default {
    name: 'personalCenter',
    components: {
      Vmenu: Menu
    },
    data() {
      return {
        user: {},
        gender:'',
        pendingComments:'',
        pendingDeliver:'',
        pendingPayment:'',
        pendingReceived:'',
        saleService:'',
        shoppingCartNum:'',
        messageCount:0,
        unread:0
      }
    },
    created (){
      document.title="我的";
    },
    activated () {
      document.title="我的";
    },

    mounted() {
      // let that = this;
      // window.onpageshow = function(event){
      //   //event.persisted 判断浏览器是否有缓存, 有为true, 没有为false
      //     if (event.persisted) {  
      //         //window.location.reload();
      //         that.getOrderCount();
      //         that.getShoppingCartNum();
      //         that.getUseMessage();
      //     }
      // }
      this.getOrderCount();
      this.getShoppingCartNum();
      this.getUseMessage();
      this.getUnread();
      //this.initzhichi();
    },
    methods: {
      initzhichi() {
        var user =  JSON.parse(this.getUserData('user'));
        let that = this;
        var zhiManager = (getzhiSDKInstance());
        // 设置参数
        zhiManager.set('color','000000'); //设置颜色
        zhiManager.set('customBtn', 'true'); //不使用智齿咨询按钮
        zhiManager.set('partnerId', user.memberId); //设置uid
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
      getUseMessage(){
        var user = JSON.parse(this.getUserData('user'));
        this.http.get(this).url('/app/api/member/details/:memberId').restful({
         memberId:user.memberId
        }).request(function(response) { 
          this.user = response.data.data;
          setCookie("user",JSON.stringify(response.data.data),365);
        }, function(err) {
          console.log(err);
        }, function(response) {
          console.log(response);
        })
      },
      getUnread() {
        this.http.get(this).url(this.config.message.unread_url).request(function(response) { 
          let data = response.data.data;
          this.unread += data.activityUnreadCount + data.goodsUnreadCount + data.subjectUnreadCount + data.sysUnreadCount;
        }, function(err) {
          console.log(err);
        })
      },
      //查询购物车数量
      getShoppingCartNum(){
        this.http.get(this).url('app/api/shopping-cart/count').request(function(response){
          
          this.shoppingCartNum = response.data.data;
          if(this.shoppingCartNum >= 99){
            this.shoppingCartNum = '99+'
          }
        })
      },
      getOrderCount(){
        this.http.get(this).url('/app/api/order/count').request(function(response){
          
          this.pendingComments = response.data.data.pendingComments;
          
          if(this.pendingComments >= 100){
            this.pendingComments = '99+';
          }
          this.pendingDeliver = response.data.data.pendingDeliver;
          if(this.pendingDeliver >= 100){
            this.pendingDeliver = '99+';
          }
          this.pendingPayment = response.data.data.pendingPayment;
          
          if(this.pendingPayment >= 100){
            this.pendingPayment = '99+';
          }
          this.pendingReceived = response.data.data.pendingReceived;
          if(this.pendingReceived >= 100){
            this.pendingReceived = '99+';
          }
          this.saleService = response.data.data.saleService;
          if(this.saleService >= 100){
            this.saleService = '99+';
          }
        })
      },
      toOrder(e){
        console.log(e)
        if(e == undefined){
          this.keep.go('/order_list.html',false);
        }else{
          this.keep.go('/order_list.html',false,{activated:e})
        }
        
      },
      toCollectPlan() {
        this.keep.go('/plan_receive.html',false)
      },
      goMembers(){
        this.keep.go('/members.html',false)
      },
      toService(){
        this.keep.go('/service.html',false)
      },
      toComment(){
        this.keep.go('/comment.html',false)
      },
      tocustomerService(){
        this.goToRobot({});
      },
      toAddress() {
        this.keep.go("/receiver_address.html", false);
      },
      toShoppingCart() {
        this.keep.go("/shopping_cart.html", false);
      },
      toCoupons() {
        this.keep.go("/coupons.html", false);
      },
      toHelpCenter() {
        this.keep.go("/help.html", false);
      },
      toMessageCenter() {
        this.keep.go("/message_center.html", false);
      },
      toCollect() {
        this.keep.go("/collect.html", false);
      },
      goAppraiseWait(){
        this.keep.go("/appraise_wait.html", false);
      },
      goReturnGoods(){
        this.keep.go("/return_goods.html", false);
      },
      goLike(){
        var showWelPage = localStorage.getItem('showWelPage');
        this.keep.go("/like_list.html", false);
      },
      goFeedback(){
        this.keep.go("/feedback.html", false);
      },
      gotoShare(){
        let url = this.keep.cache.get("homeShareUrl",null,'/index.html');
        this.keep.go(url, false);
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/personalCenter.scss';
</style>