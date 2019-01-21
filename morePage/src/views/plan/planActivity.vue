<template>
  <div id="planActivity_vue">
    <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <div  id="content" :class="{'showAppTip1':showAppTip}">
        <img :src="planData.cover + '?imageView2/2/w/1024|imageslim'" class="plan_cover">
        <div class="houseType_box">
          <div class="houseType_content">

            <div class="houseType">
              <p class="plan_title">{{planData.planName}}</p>
              <ul class="house_message">
                <li>
                  <img src="../../assets/img/house_type.png">
                  <p>户型</p>
                  <p class="house_detail">{{planData.houseTypeName}}</p>
                </li>
                <li>
                  <img src="../../assets/img/house_style.png">
                  <p>风格</p>
                  <p class="house_detail">{{planData.style.name}}</p>
                </li>
                <li>
                  <img src="../../assets/img/house_buildArea.png">
                  <p>建筑面积</p>
                  <p class="house_detail">{{planData.houseTypePlanRelations[0].houseType.buildArea}}m²</p>
                </li>
                <li>
                  <img src="../../assets/img/house_realityArea.png">
                  <p>价格区间</p>
                  <p class="house_detail">{{planData.priceRangeName}}</p>
                   
                </li>
              </ul>
              <img @click="preview(planData.houseTypeImage)" v-lazy="planData.houseTypeImage + '?imageView2/2/w/1024|imageslim' "  class="planImage">
              <p class="planImage_title">彩色平面布置图</p>
            </div>
            
            <div class="user_box">

              <input type="text" v-model="phone" placeholder="请输入手机号领取" maxlength="11" class="phone_input" v-if='type == 1'>
              <p class="receive_gift" v-if='type == 1' @click="receivePlan">立即领取</p>

              <p class="receive_success" v-if='type == 2'>方案领取成功！</p>
              <p class="receive_gift" v-if='type == 2' @click="seeNow">立即查看</p>

              <p class="tip">方案领取后请打开APP查看完整方案 <br> 开始你的一键全屋搭配</p>
            </div>

            <div class="bottom_logo">
              <img @click="goHome" class="logo" src="../../assets/img/plan_bottom_logo.png" style="width:1.47rem;">  
            </div>

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
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  import jsBridge from '../../commons/jsBridge.js'; 
  import {getUser} from '../../commons/tools';
  export default {
    name: 'planDetail',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      VdownLoadApp:downLoadApp
    },
    data() {
      return {
        title: '您的专属软装方案',
        desc: ' 搬新家买家具，不用东奔西跑，只需坐着就好，我们更懂您的家，赶快来领取吧！', 
        link: null,
        imgUrl:"http://appsource.goochao.com/share_logo.png",     
        type: 1,  // 1 方案未领取 2 方案已领取
        phone:'',
        state:null, // 1 ios 2 androdi 3 web 4 其他
        token:null,
        showAppTip:true,
        loadFailed:false,
        firstLoad:true,
        activityId:null,
        boothId:null,
        shareMemberId:null,
        planId:null,
        planData:{
          houseTypePlanRelations:[{
            house:{},houseType:{}
          }],
          style:{}
        },
      }
    },
    created() {
      document.title = "软装方案";
    },
    mounted: function() {
      if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }

      /*获取登录方式*/
      let platform = jsBridge.getPlatform();
      this.activityId = this.getParam('activityId');
      this.boothId = this.getParam('boothId');
      this.shareMemberId = this.getParam('shareMemberId');  //分享者Id
      this.planId = this.getParam('planId');


      //判断版本
      if(process.env.NODE_ENV == "production") {
        this.link = "https://wx.goochao.com/plan_activity.html";
      } else if(process.env.NODE_ENV == "test") {
        this.link = "http://test.wx.goochao.com/plan_activity.html";
      } else {
        this.link = "http://192.168.20.102:8080/plan_activity.html";
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


      this.refreshToken();
      this.token = getUser('access_token');
      if (this.token) {
        this.isReceived();
      }
      //建立联系
      if (this.activityId && this.token) {
        this.bindActivity();
      } 

      this.loadPlanDetail();

    },
    methods: {
      completeLink() {
        var users = this.getUserData('user');
        let memberId = JSON.parse(users).memberId;
        
        this.link += "?shareMemberId=" + memberId;
        this.link += "&planId=" + this.planId;
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
          $("html").css({'font-size':"100px"});
          $("#planActivity_vue").css({'width':"375px",'margin':"auto"});
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
      /*刷新token*/
      refreshToken() {
        if(this.state == 1 || this.state == 2) {
          let isLogin = jsBridge.invoke("isLogin",null);
          if (isLogin.data) {
            let data = jsBridge.invoke("getLoginResult",null);
            let accessToken = JSON.parse(data.data).accessToken;
            document.cookie  = "access_token=" + accessToken;
          } else {
            document.cookie = 'access_token' + '=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
          }
        } 
      },
      isReceived() {
        this.http.get(this).url(this.config.activity.is_activityPlan).params({planId:this.planId}).request((response) => {
          if (response.data.code != 0) {
            return false;
          }
          var data = response.data.data;
          
          this.type = data ? 2 : 1;

        },(err)=>{console.log(err)})
      },
      comfirmReceivePlan() {
        this.http.post(this).url(this.config.activity.receive_plan).params({planId:this.planId, phone:this.phone,activityId:this.activityId, boothId:this.boothId}).request((response) => {
          if (response.data.code != 0) {
            return;
          }
          this.type = 2;
          this.showSuccess("领取成功！");
          if (this.state == 1 || this.state == 2) {
            jsBridge.invoke("joinSuccess",null);
          }

        },(err)=>{console.log(err)})
      },
      /*立即领取*/
      receivePlan() {

        if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,1,3,6,7,8])|(19[7,8,9])|(166))\d{8}$/.test(this.phone)) {
          this.showError('请输入正确的电话号码');
          return false;
        }

        if(this.state == 1 || this.state == 2) {
          let isLogin = jsBridge.invoke("isLogin",null);
          if (isLogin.data) {
            this.comfirmReceivePlan();
          } else{
            jsBridge.invoke("toLogin",null);
          }
        } else {
          this.comfirmReceivePlan();
        }

      },
      seeNow() {
        if (this.state == 1 || this.state == 2) {
          jsBridge.invoke("toCouponList",null);
        } else{
          this.keep.go("/plan_detail.html", false,{planId:this.planId});
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
      //预览图片
      preview(currentImage) {
        let images = [];
        images.push(currentImage);

        this.wx.previewImage({
          current: currentImage, 
          urls: images 
        });
      },
      /*关闭app下载div*/
      closeTip(data){
        if(!data){
          this.showAppTip = false;
        }
      },
      reload(){
        this.loadFailed = false;
        this.loadPlanDetail();
      },
      goHome() {
        this.keep.go("/index.html",false);
      },
      loadPlanDetail() {
        this.http.get(this).url(this.config.plan.detail_url).restful({planId:this.planId}).request((res) => {
          this.firstLoad = false;
          if(res.data.code != 0){
            return ;
          }
          let data = res.data.data;
          this.planData = data; 

        },(err)=>{ 
         this.loadFailed = true;  
         this.firstLoad = false;
        }) 
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
  @import '../../assets/scss/planActivity.scss';
  #planActivity_vue{
    .showAppTip1{
      top:0.5rem !important;
    } 
  }
</style>
