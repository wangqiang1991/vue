<template>
  <div id="bankActivity_Vue">
    <div class="opationbox">

      <div class="coupon_money_box">
        <p class="coupon_money">¥30</p>
        <p class="coupon_desc">满199元可用，全场商品通用</p>
        <p class="coupon_time">使用时间为2018-12-20至2019-06-20</p>
      </div>
      <div class="coupon_money_box">
        <p class="coupon_money">¥100</p>
        <p class="coupon_desc">满699元可用，全场商品通用</p>
        <p class="coupon_time">使用时间为2018-12-20至2019-06-20</p>
      </div>
      <div class="coupon_money_box">
        <p class="coupon_money">¥350</p>
        <p class="coupon_desc">满2499元可用，全场商品通用</p>
        <p class="coupon_time">使用时间为2018-12-20至2019-06-20</p>
      </div>

      <div class="show_money_box">

        <p class="button" style="margin-top:0.16rem;height:0.4rem;" @click="receive" v-if="!received && !showPhone">立即领取</p>
        
        <p class="button" v-if="received && !phone" style="margin-top:0.16rem;height:0.4rem;" @click="gotoCoupon">前往查看</p>
        <p class="receive_message" v-if="received && !phone" style="margin-top:0.05rem;font-size:0.16rem;">领取成功!</p>

        <input  style="margin-top:0.08rem;margin-bottom:0.1rem"  v-show="!received && showPhone" type="text" v-model="phone" placeholder="请输入手机号领取" maxlength="11" class="phone_input">
        <p class="button" v-if="!received && showPhone" @click="receive">立即领取</p>

        <p class="receive_message" v-if="received && phone" style="margin-top:0.04rem">红包已放至账户</p>
        <p class="receive_message" v-if="received && phone" style="margin-top:0.04rem;color:#fff;font-size:0.14rem;">{{phone}}</p>
        <p class="button" v-if="received && phone"  style="margin-top:0.06rem;" @click="gotoShopping">立即使用</p>

      </div>  

    </div>

    <p class="goochaoDesc">此活动最终解释权归构巢所有</p>
    <img class="logo" src="../../assets/img/bank_logo.png" style="width:1.58rem;margin-left:-0.79rem;height:0.24rem;">  
      
  </div>
</template>

<script>
  import jsBridge from '../../commons/jsBridge.js'; 
  import {getUser, getCookie, setCookie , GetQueryString} from '../../commons/tools'
  export default {
    name: 'newComers',
    data() {
      return {
       title: '优惠活动大礼包',
       desc: '送您480元大礼包，赶快来领取吧！', 
       link: null,
       imgUrl:"http://appsource.goochao.com/share_logo.png",        
       phone:null,
       money:2000,
       activityId:null,
       boothId:null,
       shareMemberId:null,
       hasInWx:null,
       token:null,
       code:"0001",
       type:1,   //1 app登录未领取  2 app登录领取成功  3 扫码进入输入手机号  4 扫码进入已发放红包
       state:null,
       received:false,    // 是否领取
       showPhone:false,     // 是否显示手机号
      }
    },
    mounted() {
      
      let platform = jsBridge.getPlatform();
      this.hasInWx = this.getParam('hasInWx');  //hasInWx  1 微信扫码进入  2 微信首页进入
      this.activityId = this.getParam('activityId');//"Dy7Nv7VQ"//
      this.boothId = this.getParam('boothId'); //"YJ0bB09x"//
      this.shareMemberId = this.getParam('shareMemberId');  //分享者Id


      //判断版本
      if(process.env.NODE_ENV == "production") {
        this.link = "https://wx.goochao.com/bank_activity.html";
      } else if(process.env.NODE_ENV == "test") {
        this.link = "http://test.wx.goochao.com/bank_activity.html";
      } else {
        this.link = "http://192.168.20.102:8080/bank_activity.html";
      }

      //判断设备
      if (platform == 'ios') {
        this.state = 1;
      } else if (platform == 'android') {
        this.state = 2;
      } else if ( this.isWeiXin() ){
        this.completeLink();
        this.initShareToFriend();
        this.initShareToCircle();
        if (this.hasInWx == '2') {
          this.state = 3;
        } else {  
           this.state = 4; 
           this.showPhone = true;
        }
      } else {
        this.state = 5;
        if (this.isPcPreview()) {
          return ;
        }
        this.showMessage("请使用微信打开");     
      }



      //获取token 判断是否领取活动
      this.refreshToken();
      this.token = getUser('access_token');
      if (this.token) {
        if (this.activityId) {
          this.activityIsReceive();
        } else {
          this.commerIsReceive();
        }
      }


      //建立联系
      if (this.activityId && this.token) {
        this.bindActivity();
      } 


    },
    created() {
      document.title = "优惠活动";
    },
    methods: {
      completeLink() {
        var users = this.getUserData('user');
        let memberId = JSON.parse(users).memberId;

        this.link += "?shareMemberId=" + memberId;
        if (this.activityId) {
          this.link += "&activityId=" + this.activityId;
        }
        if (this.boothId) {
          this.link += "&boothId=" + this.boothId;
        }        
      },
      bindActivity() {
        if (!this.boothId) {
          this.boothId = null;
        }
        this.http.post(this).url(this.config.activity.bind_activity).params({activityId:this.activityId, boothId:this.boothId}).request((response) => {
          if (response.data.code != 0) {
            return false;
          }
          
        },(err)=>{console.log(err)})
      },
      isPcPreview() {
        let preview = this.getParam('preview');
        
        if (preview == "isPc" || preview == "isPC") {
          $("html").css({'font-size':"100px"});
          $("#bankActivity_Vue").css({'width':"375px",'margin':"auto"});
          return true;
        } else {
          return false;
        }
      },
      refreshToken() {
        if(this.state == 1 || this.state == 2) {
          let isLogin = jsBridge.invoke("isLogin",null);
          if (isLogin.data) {
            let data = jsBridge.invoke("getLoginResult",null);
            let accessToken = JSON.parse(data.data).accessToken;
            document.cookie  = "access_token=" + accessToken;
          } else{
            document.cookie = 'access_token' + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
          }
        } 
      }, 
      isWeiXin(){ 
        var ua = window.navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
          return true; 
        } else { 
          return false; 
        }
      },
      commerIsReceive() {
        this.http.get(this).url(this.config.activity.is_activityCommer).params({code: this.code }).request((response) => {
          if (response.data.code != 0) {
            return false;
          }
          var data = response.data.data;
          this.received = data != null;
          this.received && (this.phone = data.relationPhone);
          console.log(data)
        },(err)=>{console.log(err)})
      },
      activityIsReceive() {
        this.http.get(this).url(this.config.activity.is_activity).params({activityId:this.activityId}).request((response) => {
          if (response.data.code != 0) {
            return false;
          }
          var data = response.data.data;
          this.received = data != null;
          this.received && (this.phone = data.relationPhone);
          console.log(data)
        },(err)=>{console.log(err)})
      },
      receiveActivity() {
        this.http.post(this).url(this.config.activity.receive_activity).params({phone:this.phone, activityId:this.activityId, boothId:this.boothId, shareMemberId:this.shareMemberId}).request((response) => {
          if (response.data.code != 0) {
            return;
          }
          this.received = true;
          this.showSuccess("领取成功！");
          if (this.state == 1 || this.state == 2) {
            jsBridge.invoke("joinSuccess",null);
          }
         
        },(err)=>{console.log(err)})
      },
      receiveCommber() {
        this.http.post(this).url(this.config.activity.receive_commber).params({code:this.code, phone:this.phone}).request((response) => {
          if (response.data.code != 0) {
            return;
          }
          this.received = true;
          this.showSuccess("领取成功！");
          if (this.state == 1 || this.state == 2) {
            jsBridge.invoke("joinSuccess",null);
          }

        },(err)=>{console.log(err)})
      },
      /*立即领取*/
      receive() {
        if (this.state == 5) {
          this.showMessage('扫码关注微信，即可立即领取大礼包');
          return false;
        }

        if (this.showPhone && !/^((1[3,5,8][0-9])|(14[5,7])|(17[0,1,3,6,7,8])|(19[7,8,9])|(166))\d{8}$/.test(this.phone)) {
          this.showError('请输入正确的电话号码');
          return false;
        }

        if(this.state == 1 || this.state == 2) {
          let isLogin = jsBridge.invoke("isLogin",null);
          if (isLogin.data) {
            this.receiveMoney();
          } else{
            jsBridge.invoke("toLogin",null);
          }
        } else {
          this.receiveMoney();
        }

      },
      receiveMoney() {
        if (this.activityId) {
          // huodong
          this.receiveActivity();
        } else {
          // xinren
          this.receiveCommber();
        }
      },
      /*跳转到优惠券*/
      gotoCoupon() {
        if (this.state == 1 || this.state == 2) {
          jsBridge.invoke("toCouponList",null);
        } else{
          this.keep.go("/personal_center.html", false);
        }
      },
      //type = 4  跳转商城购物
      gotoShopping() {
        if (this.state == 1 || this.state == 2) {
          jsBridge.invoke("toCouponList",null);
        } else{
          this.keep.go("/category2.html", false);
        }

      },
      initShareToFriend() {
        let that = this;

        that.wx.ready(function () { 
          that.wx.onMenuShareAppMessage({
              title:that.title,
              desc: that.desc,
              link: that.link,
              imgUrl: that.imgUrl,
              success: function (res) {
                if (that.state == 3 || that.state == 4) {
                  that.showMessage("分享成功!")
                }
              },
              cancel: function (res) {
                if (that.state == 3 || that.state == 4) {
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
              title:that.title,
              desc: that.desc,
              link: that.link,
              imgUrl: that.imgUrl,
              success: function (res) {
                if (that.state == 3 || that.state == 4) {
                  that.showMessage("分享成功!")
                }  
              },
              cancel: function (res) {
                if (that.state == 3 || that.state == 4) {
                  that.showMessage("取消分享!")
                }  
              }
          });
        });
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/bankActivity.scss';
</style>
