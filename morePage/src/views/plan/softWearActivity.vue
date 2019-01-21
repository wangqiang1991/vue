<template>
  <div id="softWearActivity_vue">
    <div class="softWearActivity_top">
      <img src="../../assets/img/softWearTitle.png" >
    </div>
    <div class="softWearActivity_bottom">
      <div class="receive_plan">
        <p>点击按钮进入<br> 查看全套软装方案</p>
        <div class="receive" @click="morePlan">
          更多软装方案
        </div>
      </div>

      <div class="rule">
        <p style="font-size:0.14rem;font-weight:700;text-align:center;margin-bottom:0.15rem;">活动规则</p>
        <!-- <p>1.套组折扣活动与平台内其他活动不同享。</p> -->
        <p>1.通过更多按钮可以查看到更多心意的软装方案。</p>
        <p style="margin-bottom:0;">2.此活动的解释权归构巢所有。</p>
      </div>
      <img @click="goHome" class="logo" src="../../assets/img/logo_white.png" style="width:1.47rem;margin-left:-0.735rem;">  
    </div>
  </div>
  </div>
</template>

<script>
  import jsBridge from '../../commons/jsBridge.js'; 
  import {getUser, getCookie, setCookie , GetQueryString} from '../../commons/tools'
  export default {
    name: 'softWearActivity',
    data() {
      return {
       title: '您的专属软装方案',
       desc: ' 搬新家买家具，不用东奔西跑，只需坐着就好，我们更懂您的家', 
       link: null,
       imgUrl:"http://appsource.goochao.com/share_logo.png",        
       activityId:null,
       boothId:null,
       shareMemberId:null,
       token:null,
       state:null, // 1 ios 2 androdi 3 web 4 其他
      }
    },
    created() {
      document.title = "软装活动";
    },
    mounted: function() {
       /*获取登录方式*/
      let platform = jsBridge.getPlatform();
      this.activityId = this.getParam('activityId');//"Dy7Nv7VQ"//
      this.boothId = this.getParam('boothId'); //"YJ0bB09x"//
      this.shareMemberId = this.getParam('shareMemberId');  //分享者Id      

      //判断版本
      if(process.env.NODE_ENV == "production") {
        this.link = "https://wx.goochao.com/softWear_activity.html";
      } else if(process.env.NODE_ENV == "test") {
        this.link = "http://test.wx.goochao.com/softWear_activity.html";
      } else {
        this.link = "http://192.168.20.102:8080/softWear_activity.html";
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
          $("#softWearActivity_vue").css({'width':"375px",'margin':"auto"});
          return true;
        } else {
          return false;
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
      morePlan() {
        if (this.state == 4) {
          this.showMessage('扫码关注微信，查看更多软装方案');
          return false;
        }

        if (this.state == 1 || this.state == 2) {
          jsBridge.invoke("toPlanList",null);
        } else if (this.state == 3) {
          this.keep.go("/scene_list.html", false,{home_type:4});
        } else {
          this.showMessage("请使用微信打开");     
        }
      },
      goHome() {
        this.keep.go('/index.html',false);
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

<style lang="scss">
  #softWearActivity_vue{
    width: 3.75rem;
    .softWearActivity_top{
      width:3.75rem;
      height:10.78rem;
      background-image:url("../../assets/img/softWearTopbg.png");
      background-size:100%;
      position:relative;
      >img{
        display:block;
        width:3.24rem;
        height:2.26rem;
        position:absolute;
        top:.12rem; left: 0.255rem;
      }
    }
    .softWearActivity_bottom{
      width:3.75rem;
      height:7.82rem;
      background-image:url("../../assets/img/softWearBottombg.png");
      background-size:100%;
      position:relative;
      .receive_plan{
        position:absolute;
        top:2.39rem;
        right:0.16rem;
        width:1.54rem;
        height:auto;
        >p{
          font-size:0.12rem;
          height:auto;
          color:#999;
          margin-bottom:0.12rem;
          text-align:center;
          width:100%;
        }
        >div.receive{
          width:1.54rem;
          height:0.44rem;
          background-image:url("../../assets/img/softWearButtonBg.png");
          background-size:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:0.14rem;
          color:#fff;
        }
      }

      >div.rule{
        width:3.35rem;
        height:auto;
        position:absolute;
        left:0.2rem;
        bottom:1.07rem;
        >p{
          font-size:0.12rem;
          color:#fff;
          text-align:left;
          margin-bottom:0.05rem;
        }
      }
      >img.logo{
        display:block;
        width:1.7rem;
        height:0.24rem;
        position:absolute;
        left:50%; bottom:0.3rem;
        margin-left: -0.85rem;
      }
    }
  }
</style>
