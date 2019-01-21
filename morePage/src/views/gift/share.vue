<template>
  <div id="share_Vue">
    <div class="header">
      <img src="../../assets/img/logo_white.png" class="logo" style="width:1.47rem;margin-left:-0.735rem;">
      <img src="../../assets/img/share_logo.png" @click="goHome" class="sharelogo">
      <div class="message_box">
        <p class="user_header">
          <img :src="user.head ? user.head+ '?imageView2/0/w/320/h/320|imageslim' : '/static/images/defalt_uer_image.png'">
        </p>
        <p class="title1">{{user.nickName}} 正邀请你一起逛[构巢]商城</p>
        <p class="title2"> 并给你赠送了</p>
        <p class="money">{{money}}元优惠券</p>
        
        <div class="operation_box">
            
          <input type="text" v-if="type == 1" v-model="phone" placeholder="请输入手机号领取礼包" maxlength="11" class="phone_input">

          <p class="button" v-if="type == 1" style="margin-top:0.2rem;" @click="phoneReceive">立即领取</p>

          <p class="receive_message" v-if="type == 2">红包已放至账户</p>
          <p class="receive_message" v-if="type == 2" style="margin-top:0.04rem;margin-bottom:0.15rem; color:#666;font-size:0.16rem;">{{phone}}</p>
          <p class="button" v-if="type == 2" @click="gotoShopping">立即使用</p>
        </div>

      </div>
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
       user:{},
       code:"0002",
       boothId:null,              
       activityId:null,
       shareMemberId:null,
       token:null,
       money:50,
       phone:null,
       type:1,   //1 未分享  2 已分享
      }
    },
    mounted() {
      /*获取登录方式*/
      let platform = jsBridge.getPlatform();
      this.activityId = this.getParam('activityId');
      this.boothId = this.getParam('boothId'); //"YJ0bB09x"//
      let mmid = this.getParam('mmid');
      let shareMemberId = this.getParam('shareMemberId');  //分享者Id      
      if (mmid) {
        this.shareMemberId = mmid;
      } else if (shareMemberId) {
        this.shareMemberId = shareMemberId;
      } else {
         this.shareMemberId = null;
      }

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
      }


      //获取token 判断是否领取活动
      this.refreshToken();
      this.token = getUser('access_token');
      // 获取用户信息
      if (!this.shareMemberId) {
        this.showMessage("无效分享链接");    
      } else {
        this.loadUser();
      }

            //建立联系
      if (this.activityId && this.token) {
        this.bindActivity();
      } 
      
      //判断是否领取活动
      if (this.token) {
        if (this.activityId) {
          this.activityIsReceive();
        } else {
          this.commerIsReceive();
        }
      } else {
        if (!this.isWeiXin()) {
          this.showMessage("请使用微信打开");     
        }
      }

    },
    created() {
      document.title = "一份分享礼";
    },
    methods: {
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
        
        this.link += "?shareMemberId=" + memberId;
        if (this.activityId) {
          this.link += "&activityId=" + this.activityId;
        } 
        if (this.boothId) {
          this.link += "&boothId=" + this.boothId;
        }     
      },
      /*手机立即领取*/
      phoneReceive() {

        if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,1,3,6,7,8])|(19[7,8,9])|(166))\d{8}$/.test(this.phone)) {
          this.showError('请输入正确的电话号码');
          return false;
        }
        
        if (!this.token) {
          this.showError('请先登录!');
          return false;
        }
        
        
        if (this.activityId) {
          this.receiveActivity();
        } else {
          this.receiveCommber();
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
      receiveActivity() {
        this.http.post(this).url(this.config.activity.receive_activity).params({phone:this.phone, activityId:this.activityId,  boothId:this.boothId,shareMemberId:this.shareMemberId}).request((response) => {
          if (response.data.code != 0) {
            return;
          }
          this.type = 2;
          this.showSuccess("领取成功！");
        },(err)=>{console.log(err)})
      },
      receiveCommber() {
        this.http.post(this).url(this.config.activity.receive_commber).params({code:this.code, phone:this.phone , shareMemberId:this.shareMemberId}).request((response) => {
          if (response.data.code != 0) {
            return;
          }
          this.type = 2;
          this.showSuccess("领取成功！");
        },(err)=>{console.log(err)})
      },
      commerIsReceive() {
        this.http.get(this).url(this.config.activity.is_activityCommer).params({code: this.code }).request((response) => {
          if (response.data.code != 0) {
            return false;
          }
          var data = response.data.data;
          if(!data){
            this.type = 1;
          } else {
            this.type = 2;
            this.phone = data.phone;
          }
        },(err)=>{console.log(err)})
      },
      activityIsReceive() {
        this.http.get(this).url(this.config.activity.is_activity).params({activityId:this.activityId}).request((response) => {
          if (response.data.code != 0) {
            return false;
          }
          var data = response.data.data;
          if(!data){
            this.type = 1;
          } else {
            this.type = 2;
            this.phone = data.phone;
          }
        },(err)=>{console.log(err)})
      },
      loadUser() {
        this.http.get(this).url('/app/api/member/details/:memberId').restful({memberId:this.shareMemberId}).request(function(response) { 
          this.user = response.data.data;
        }, function(err) {
          console.log(err);
        }, function(response) {
          console.log(response);
        })
      },
      gotoShopping() {
        this.keep.go("/category2.html", false);
      },
      goHome() {
        this.keep.go("/category2.html", false);
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
      }
    }
  }
</script>

<style lang='scss'>
  html{
    background:white;
  }
  #share_Vue{
    width: 3.75rem;
    .header{
      width:3.75rem;
      height:3.12rem;
      background-image:url("../../assets/img/share_header.png");
      background-size:100%;
      position:relative;
      .logo{
        width:1.7rem;
        height:0.24rem;
        display:block;
        position:absolute;
        top:0.28rem; left:50%;
        margin-left:-0.85rem;
      }
      .sharelogo{
        width:3.6rem;
        height:1.66rem;
        display:block;
        position:absolute;
        left:50%;
        margin-left:-1.8rem;
        top:0.7rem;
      }
      .message_box{
        width:3.6rem;
        height:3.4rem;
        background-image:url("../../assets/img/share_user_bg.png");
        background-size:100%;
        position:absolute;
        left:50%;
        margin-left:-1.8rem;
        top:2.36rem;
        .user_header{
          width:100%;
          height:auto;
          margin-top:0.2rem;
          margin-bottom:0.15rem;
          >img{
            width:0.6rem; height:0.6rem;
            display:block; margin:auto;
            border-radius:50%;
          }
        }
        p.title1{
          width:3.2rem;
          height:auto;
          margin:auto;
          font-size:0.14rem;
          color:#666;
          text-align:center;
          font-weight:700;
          margin-bottom:0.03rem;
        }
        p.title2{
          font-size:0.1rem;
          text-align:center;
          color:#666;
          margin-bottom:0.08rem;
        }
        p.money{
          font-size:0.3rem;
          color:#D67279;
          text-align:center;
          font-weight:700;
        }
        div.operation_box{
          width:100%;
          height:auto;
          position:absolute;
          left:0; bottom:0.35rem;
          
          p.button{
            width:1.2rem;
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
            width:2.2rem;
            height:0.36rem;
            color:#cacaca;
            border-radius:0.05rem;
            margin:auto;
            font-size:0.14rem;
            outline:none;
            border:1px solid #cacaca;
            padding-left: 0.1rem;
            background:#f2f2f2;
            text-align:center;
          }
          input::-webkit-input-placeholder {
            font-size:0.14rem;
            color:#cacaca;
          }

        }  
      }
    }
  }
</style>
