<template>
  <div id="share_Vue">
    <div class="header">
      <img @click="goHome" id="logo_icon" src="../../assets/img/logo_white.png" alt="logo">
      <div class="message_box">
        <p class="user_header">
          50元优惠券         
        </p>
        <p class="title1">满299可用</p>
        
        <div class="operation_box" v-if="state != 3">
          <div class="left">
            <img src="../../assets/img/share_wx.png" @click="shareToFriend">
            <p>分享至微信好友</p>
          </div>    
          <div class="right">
            <img src="../../assets/img/share_pyj.png" @click="shareToCircle">
            <p>分享至朋友圈</p>
          </div>
        </div>
        <div v-else class="wxShareTip">
          <span id="shareToGift" @click='shareHideBox = true;'>我要分享领劵</span>
          <span id="gotoHome" @click="gotoHome">前往商城首页</span>
        </div>

      </div>


    </div>

    <div class="share_bottom">
      <p>邀请好友关注构巢平台 <br>对方通过你的分享链接输入手机后<br> 你和对方都将获得一张“50元优惠券” <br>优惠券使用规则详见“我的优惠券”</p>
      <p style="font-size:0.09rem;margin-bottom:0;">本活动最终解释权归构巢平台所有</p>
    </div>

    <div class="shareHideBox" v-show='shareHideBox' @click="shareHideBox = false;">
      <img src="../../assets/img/share_tip.png" alt="分享箭头图标" class="shareImage1">
      <img src="../../assets/img/share_message.png" alt="分享提示语" class="shareImage2">
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
       title: '亲~送你一张50元优惠券，赶紧去逛逛吧~',
       desc: '我们不做高大上，我们在乎的是真材实料，我们只想让大众都有一个温馨舒适的居家享受~', 
       link: null,
       imgUrl:"http://appsource.goochao.com/share_logo.png",
       activityId:null,
       boothId:null,
       token:null,
       money:50,
       shareHideBox:false,
       phone:null,
       state:null, // 1 ios 2 androdi 3 web 4 其他
       type:1,   //1 未分享  2 已分享
      }
    },
    mounted() {
      $('.shareHideBox').css({'height': document.documentElement.clientHeight});
      /*获取登录方式*/
      let platform = jsBridge.getPlatform();
      this.activityId = this.getParam('activityId');
      this.boothId = this.getParam('boothId'); //"YJ0bB09x"//
      this.shareMemberId = this.getParam('shareMemberId');  //分享者Id      

      //判断版本
      if(process.env.NODE_ENV == "production") {
        this.link = "https://wx.goochao.com/share.html";
      } else if(process.env.NODE_ENV == "test") {
        this.link = "http://test.wx.goochao.com/share.html";
      } else {
        this.link = "http://192.168.20.102:8080/share.html";
      }


      //判断设备
      if (platform == 'ios') {
        this.state = 1;
      } else if (platform == 'android') {
        this.state = 2;
      } else if ( this.isWeiXin() ){
        this.state = 3;
        this.completeLink();
        this.initShareToFriend();
        this.initShareToCircle();
      } else {
        this.state = 4;
        if (this.isPcPreview()) {
          return ;
        }
        this.showMessage("请使用微信打开");     
      }

      //建立联系
      this.refreshToken();
      this.token = getUser('access_token');
      if (this.activityId && this.token) {
        this.bindActivity();
      } 



    },
    created() {
      document.title = "一份分享礼";
    },
    methods: {
      gotoHome() {
        this.keep.go('/category2.html',false);
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
      completeLink() {
        var users = this.getUserData('user');
        let memberId = JSON.parse(users).memberId;
        this.link += "?mmid=" + memberId;
        if (this.activityId) {
          this.link += "&activityId=" + this.activityId;
        } 
        if (this.boothId) {
          this.link += "&boothId=" + this.boothId;
        } 
      },
      isPcPreview() {
        let preview = this.getParam('preview');
        if (preview == "isPc") {
          $("html").css({'font-size':"100px",'width':"375px",'margin':"auto"});
          $("#share_Vue").css({'width':"375px",'margin':"auto","position":"relative","height":"667px;"});
          $(".header").css({'marginLeft':"-187.5px","left":"50%"});
          
          return true;
        } else {
          return false;
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
      isWeiXin(){ 
        var ua = window.navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
          return true; 
        } else { 
          return false; 
        }
      },
      shareToFriend() {
        if(this.state == 1 || this.state == 2) {
          let isLogin = jsBridge.invoke("isLogin",null);
          if (isLogin.data) {
            let data = jsBridge.invoke("getLoginResult",null);
            let memberId = JSON.parse(data.data).memberId;
            this.link += "?mmid=" + memberId;
            if (this.activityId) {
              this.link += "&activityId=" + this.activityId;
            } 
            if (this.boothId) {
              this.link += "&boothId=" + this.boothId;
            } 

            let obj = {};
            obj.title = this.title;
            obj.desc = this.desc;
            obj.link = this.link;
            obj.imgUrl = this.imgUrl;

            jsBridge.invoke("shareToFriend",obj);
          } else{
            jsBridge.invoke("toLogin",null);
          }
        } else {
          this.showMessage("请使用微信打开");     
        }
      },
      shareToCircle() { 
        if(this.state == 1 || this.state == 2) {
          let isLogin = jsBridge.invoke("isLogin",null);
          if (isLogin.data) {
            let data = jsBridge.invoke("getLoginResult",null);
            let memberId = JSON.parse(data.data).memberId;
            this.link += "?mmid=" + memberId;
            if (this.activityId) {
              this.link += "&activityId=" + this.activityId;
            } 
            if (this.boothId) {
              this.link += "&boothId=" + this.boothId;
            } 

            let obj = {};
            obj.title = this.title;
            obj.desc = this.desc;
            obj.link = this.link;
            obj.imgUrl = this.imgUrl;

            jsBridge.invoke("shareToCircle",obj);
          } else{
            jsBridge.invoke("toLogin",null);
          }
        } else {
          this.showMessage("请使用微信打开");     
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
              title:that.title,
              desc: that.desc,
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
      goHome() {
        this.keep.go("/index.html",false);
      }
    }
  }
</script>

<style lang='scss'>
  html,body{
    background:#f2f2f2;
    width:3.75rem; height:100%;
  }
  #share_Vue{
    width: 3.75rem;
    #logo_icon{
      position: absolute;
      width:1.47rem;
      height:0.24rem;
      top:0.2rem;
      left:50%;
      margin-left:-0.735rem;
    }
    .header{
      width:3.75rem;
      height:3.70rem;
      background-image:url("../../assets/img/share_top_bg.jpg");
      background-size:100%;
      position:fixed;
      left:0; top:0;
      z-index: 10;
      .logo{
        width:1.7rem;
        height:0.24rem;
        display:block;
        position:absolute;
        top:0.28rem; left:50%;
        margin-left:-0.85rem;
      }

      .message_box{
        width:3.47rem;
        height:2.16rem;
        background-image:url("../../assets/img/share_bg.png");
        background-size:100%;
        position:absolute;
        left:50%;
        margin-left:-1.735rem;
        top:2.1rem;
        z-index: 10;
        p.user_header{
          width:100%;
          height:auto;
          margin-top:0.2rem;
          text-align:center;
          font-size:0.28rem;
          color:#666;
          font-weight:700;
        }
        p.title1{
          font-size:0.1rem;
          color:#989898;
          text-align:center;
          margin-bottom:0.03rem;
        }
        div.wxShareTip{
          text-align:center;
          width:80%;
          height:auto;
          position:absolute;
          left:10%; bottom:0.1rem;
          font-size:0.14rem;
          >span{
            display:block;
            width:1.2rem;
            height:0.35rem;
            line-height: 0.38rem;
            margin:0 auto 0.12rem;
            font-weight:700;
          }
          #shareToGift{
            background:white;
            color:#F98484;
            border:1px solid #F98484;
          }
          #gotoHome{
            background:#343434;
            color:white;
            border:1px solid #343434;
          }
        }
        div.operation_box{
          width:2.4rem;
          height:auto;
          position:absolute;
          left:0.535rem; bottom:0.25rem;
          overflow:hidden;
          >div.left{
            width:50%;
            height:auto;
            float:left;

          }
          >div.right{
            width:50%;
            height:auto;
            float:left;
          }
          div>img{
            display:block;
            width:0.58rem; height:0.58rem;
            margin: 0 auto 0.05rem;
          }
          div>p{
            text-align:center;
            font-size:0.1rem;
            color:#989898;
          }
        }  
      }


    }
    .share_bottom{
      width:100%;
      height:auto;
      position:fixed;
      left:0; bottom:0.11rem;
      z-index: 0;
      >p{
        font-size:0.12rem;
        text-align:center;
        color:#989898;
        margin-bottom:0.05rem;
      }
    }
    .shareHideBox{
      position: fixed;
      top:0; left:0;
      z-index:999;
      width: 3.75rem;
      height:auto;
      background:rgba(0,0,0,0.8);
      img.shareImage1{
        display:block;
        width: 1.18rem;
        height:0.96rem;
        position: fixed;
        top:0.25rem; right:0.24rem;
      }
      img.shareImage2{
        display:block;
        width: 3.27rem;
        height:1.76rem;
        position: fixed;
        top:1.28rem; right:0.24rem;
      }
    }
  }
</style>
