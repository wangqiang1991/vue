<template>
  <div id="newComers_Vue">
    <div class="header">
      <img src="../../assets/img/gift_message.png" >  
      <div>
        <p class="title1">注册即送<b>{{money}}</b>元新人大礼包</p>
        <p class="title2">构巢生活 演绎态度</p>
        <p class="title3">构巢家居</p>
      </div>
    </div>    
    <div class="bottom">
      <div class="show_money_box">
        <p class="money"><span>¥</span><b>{{money}}</b></p>
        <p class="button" @click="receive" v-if="!received && !showPhone">立即领取</p>

        <p class="receive_message" v-if="received && !phone">红包已放至你的账户</p>
        <p class="button" v-if="received && !phone" style="margin-top:0.52rem;" @click="gotoCoupon">前往查看</p>

        <input v-show="!received && showPhone" type="text" v-model="phone" placeholder="请输入手机号领取" maxlength="11" class="phone_input">
        <p class="button" v-if="!received && showPhone" style="margin-top:0.42rem;" @click="receive">立即领取</p>

        <p class="receive_message" v-if="received && phone" style="margin-top:0.04rem">红包已放至账户</p>
        <p class="receive_message" v-if="received && phone" style="margin-top:0.04rem;color:#666;font-size:0.16rem;">{{phone}}</p>
        <p class="button" v-if="received && phone" style="margin-top:0.39rem;" @click="gotoShopping">立即使用</p>

      </div>  

      <div class="rule">
        <p style="font-size:0.14rem;font-weight:700;text-align:center;margin-bottom:0.15rem;">活动规则</p>
        <p>1.新人礼包领取过后请在个人中心“我的优惠券”中查看优惠券详情。</p>
        <p>2.此礼包仅限新用户领取,每个账号仅限领取一次。</p>
        <p>3.该优惠券具体抵扣规则请详见“我的优惠券”。</p>
        <p style="margin-bottom:0;">4.此活动的解释权归构巢所有。</p>
      </div>
      <img class="logo" src="../../assets/img/bottom_logo.png" style="width:1.58rem;margin-left:-0.79rem;height:0.29rem;">  
    </div>
  </div>

</template>

<script>
  import jsBridge from '../../commons/jsBridge.js'; 
  import {getUser, getCookie, setCookie , GetQueryString} from '../../commons/tools'
  export default {
    name: 'newComers',
    data() {
      return {
       title: '新人2000元大礼包',
       desc: '注册即送2000元大礼包，不仅省钱，还省时，更省心', 
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
        this.link = "https://wx.goochao.com/newcomers_gift.html";
      } else if(process.env.NODE_ENV == "test") {
        this.link = "http://test.wx.goochao.com/newcomers_gift.html";
      } else {
        this.link = "http://192.168.20.102:8080/newcomers_gift.html";
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
      document.title = "构巢新人礼包";
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
        if (preview == "isPc") {
          $("html").css({'font-size':"100px"});
          $("#newComers_Vue").css({'width':"375px",'margin':"auto"});
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
  #newComers_Vue{
    width: 3.75rem;
    background: white;
    .header{
      position: relative;;
      width:3.75rem;
      height: 3.73rem;
      background-image:url("../../assets/img/giftTop.png");
      background-size:100%; 
      >img{
        width:100%;
        height:3.6rem;
        display:block;

      }
      >div{
        position:absolute;
        top:1.97rem;
        left:0;
        width:100%;
        height:auto;
        >p{
          color:white;
          font-size:0.12rem;
          text-align: center;
          >b{
            color:#f75151;
          }
        }
        p.title1{
          font-weight: 650;
          margin-bottom: 0.4rem;
        }
        p.title2{
          font-weight:200;
          font-size:0.16rem;
          margin-bottom:0.05rem;
        }
        p.title3{
          font-size:0.14rem;
          font-weight:700;
        }
      }
    }
    .bottom{
      position:relative;
      width:3.75rem;
      height: 6.06rem;
      background-image:url("../../assets/img/giftBottom.png");
      background-size:100%; 
      >div.show_money_box{
        position:absolute;
        top:0.2rem;
        left:0;
        width:100%;
        height:auto;

        >p.money{
          height:0.76rem;
          display:flex;
          justify-content:center;
          align-items: flex-end;
          >span{
            font-size:0.24rem;
            color:#f07c7c;
            font-weight:700;
            display:block;
            margin-bottom:0.15rem;
            margin-right: 0.07rem;
          }
          >b{
            font-size:0.66rem;
            color:#f07c7c;
            display:block;
          }
        }

        p.button{
          width:1rem;
          height:0.32rem;
          border-radius: 0.03rem;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:0.14rem;
          background:#f07c7c;
          margin:0.06rem auto 0;
          font-weight: 700;
        }

        p.receive_message{
          width:100%;
          text-align:center;
          color:#999;
          font-size:0.12rem;
          margin-top: 0.15rem;
        }

        input.phone_input{
          display:block;
          width:1.7rem;
          height:0.36rem;
          color:#cacaca;
          border-radius:0.05rem;
          margin:auto;
          font-size:0.14rem;
          outline:none;
          border:1px solid #cacaca;
          padding-left: 0.1rem;
        }
        input::-webkit-input-placeholder {
          font-size:0.14rem;
          color:#cacaca;
        }

      }
      >div.rule{
        width:3.35rem;
        height:auto;
        position:absolute;
        left:0.2rem;
        bottom:2.2rem;
        >p{
          font-size:0.12rem;
          color:#fff;
          text-align:left;
          margin-bottom:0.05rem;
        }
      }
      >img.logo{
        display:block;
        width:2.04rem;
        height:0.288rem;
        position:absolute;
        left:50%; bottom:0.4rem;
        margin-left: -1.02rem;
      }
    }
    p.tip{
      font-size: 0.12rem;
      color: white;
      width: 3.35rem;
      margin: 0 auto 0.05rem;
    }
  }
</style>
