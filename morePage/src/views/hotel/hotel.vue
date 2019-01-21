<template>
  <div id="hotel_vue">
    <p class="des1">甄选精梳长绒棉，纱线长而细密 <br> 轻薄贡缎面料，精工细织，<br> 触感更加细腻，面料更加柔顺亲肤。 </p>
    <p class="des2"> 我们选取优质天然棉花 <br> 以贡缎精工织法织就 <br> 每英寸高达331根纱线 <br> 以满足床品的高质量表 </p>
    <div class="operation">
      <p>享受 舒适轻奢</p>
      <p style="font-weight:700;">light luxury</p>
      <span @click='toGoodsList'>进入优选专区</span>
    </div>
    <img class="logo" src="../../assets/img/hotelLogo.png" alt="logo">
  </div>
</template>

<script>
  import jsBridge from '../../commons/jsBridge.js'; 
  import {getUser, getCookie, setCookie , GetQueryString} from '../../commons/tools'

  export default {
    name: 'hotel',
    created() {
      document.title = "酒店专区";
    },
    mounted() {

      let platform = jsBridge.getPlatform();
      this.activityId = this.getParam('activityId');//"Dy7Nv7VQ"//
      this.boothId = this.getParam('boothId'); //"YJ0bB09x"//
      this.shareMemberId = this.getParam('shareMemberId');  //分享者Id    

      //判断版本
      if(process.env.NODE_ENV == "production") {
        this.link = "https://wx.goochao.com/hotel.html";
      } else if(process.env.NODE_ENV == "test") {
        this.link = "http://test.wx.goochao.com/hotel.html";
      } else {
        this.link = "http://192.168.20.102:8080/hotel.html";
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

      if (this.state == 3) {
        this.getcategory();
      }
    },
    data() {
      return {
        title: '星级睡眠,亲肤体验',
        desc: '享受 舒适 轻奢,体验不一样的舒适睡眠', 
        link: null,
        imgUrl:"http://appsource.goochao.com/share_logo.png",       
        state:null,
        activityId:null,
        boothId:null,
        token:null,
        shareMemberId:null,
        firstCategoryId:'15Wkx0gE',//'MX0l97KQ',
        secondCategoryId:'kQWMXyPY', //'kz7glP1x'
        categoryData:[]
      }
    },
    methods: {
      toGoodsList() {
        if(this.state == 1 || this.state == 2) {
          let obj = {};
          obj.firstCategoryId = this.firstCategoryId;
          obj.secondCategoryId = this.secondCategoryId;
          jsBridge.invoke("toGoodsList",obj);
        } else if (this.state == 3) {
          this.gotolist2();
        } else {
          this.showMessage("请使用微信打开"); 
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
          $("#hotel_vue").css({'width':"375px",'margin':"auto"});
          return true;
        } else {
          return false;
        }
      },
      completeLink() {
        var users = this.getUserData('user');
        if (!users) {
          return ;
        }
        let memberId = JSON.parse(users).memberId;
        
        this.link += "?shareMemberId=" + memberId; 
        if (this.activityId) {
          this.link += "&activityId=" + this.activityId;
        } 
        if (this.boothId) {
          this.link += "&boothId=" + this.boothId;
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
      gotolist2() {
        this.keep.go("/goods_list2.html",false,{firstCategoryId:this.firstCategoryId,secondCategoryId:this.secondCategoryId});
      },
      getcategory(){
        this.http.get(this).url(this.config.category.list_v2).request(function(response){
              if (response.data.code != 0) {
                 return ; 
              }  
              var data = response.data.data;
              data.forEach((item)=>{
                item.showCategory2 = false;
                if(item.children){
                  var obj = {};
                  obj.name = "全部";
                  obj.parentId = item.categoryId;
                  obj.categoryId = null;
                  obj.all = true;
                  item.children.unshift(obj);
                }else{
                  item.children = [];
                  var obj = {};
                  obj.name = "全部";
                  obj.parentId = item.categoryId;
                  obj.categoryId = null;
                  obj.all = true;
                  item.children.unshift(obj);
                }


                if (item.categoryId == this.firstCategoryId) {
                    this.keep.cache.push("categoryName", item.name, '/category2.html');
                    this.keep.cache.push("tabName", item.children ,'/category2.html');
                }
              });
              console.log(data)
              this.categoryData = data;

        },(err)=>{console.log(err)})
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
  #hotel_vue {
    width: 3.75rem;
    height: 9.34rem;
    background-image: url('../../assets/img/hotelBg.png');
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    p.des1{
      width: 2.8rem;
      height:auto;
      font-size: 0.15rem;
      color:#555;
      line-height:0.26rem;
      font-weight: 700;
      position: absolute;
      top: 2.72rem; left: 0.3rem;
    }
    p.des2{
      width: 1.8rem;
      height:auto;
      text-align: center;
      font-size: 0.15rem;
      color:#555;
      line-height:0.26rem;
      font-weight: 700;
      position: absolute;
      top: 5.05rem; right: 0.45rem;
    }
    div.operation{
      width: 1.5rem;
      height:auto;
      position: absolute;
      bottom:0.85rem;
      right:0.35rem;
      p{
        font-size:0.22rem;
        color:#666;
        text-align:center;
      }
      span{
        display:block;
        width: 1.5rem;
        height:0.4rem;
        background: #343434;
        color:#fff;
        border-radius: 0.2rem;
        text-align:center;
        line-height:0.4rem;
        font-weight:700;
        margin-top: 0.15rem;
        font-size:0.16rem;
      }
    }
    .logo{
      width: 1.58rem;
      height:0.29rem;
      display: block;;
      position: absolute;
      left:50%; margin-left: -0.79rem;
      bottom: 0.11rem;
    }
  }
</style>
