import {getUser, parseTime, getCookie,GetQueryString,getAngle1} from './tools'  //tools 文件有调用就引入
import keep from './keep'  //缓存文件
import http from './http'  // http的请求文件
import config from '../../config/config'  //v-lazy 加载文件
import wx from 'weixin-js-sdk'    //wxSDK

export default {
  install(vue) {
    // 注入公用部分
    vue.prototype.getUserData = getUser;
    vue.prototype.getCookie = getCookie;
    Vue.prototype.getParam = GetQueryString;
    Vue.prototype.config = config;
    Vue.prototype.wx = wx;
    vue.filter("parseTime", parseTime);
    vue.use(keep);
    vue.use(VueLazyload, {
      loading: config.image.loading_image
    })
    vue.prototype.http = http;
    vue.http = http;
    vue.config.productionTip = false;
    // 监听内容详情里点击场景图的点击事件回调
    window.showScene = function(data) {
      keep.go("/scene.html", false, {sceneId:data.sceneId,showGoHome:'1'});
    }
    // 监听内容详情里点击优惠券的点击事件回调
    window.receiveCouponMessage = function(data) {
      vue.$indicator.open({
        spinnerType: 'fading-circle'
      });
      vue.http.post(vue).url("/app/api/coupon/:couponId").restful({couponId: data.couponId}).request(
        (response) => {
          vue.showMessage("优惠券领取成功，请在个人中心查看。");
          vue.$indicator.close();
        },
        (error) => {
          //vue.showError("服务器繁忙");
          vue.$indicator.close();
        },
        (response) => {
          //vue.showError(response.data.message);
          vue.$indicator.close();
        }
      );
    }
    // 监听内容详情里点击商品的点击事件回调
    window.receiveGoodsMessage = function(data) {
      keep.go("/goods_detail.html", false, {goodsid: data.goodsId,showGoHome:'1'});
    }
    // 监听内容详情里点击图片的点击事件回调
    window.preview = function(images, currentImage) {
      wx.previewImage({
        current: currentImage, // 当前显示图片的http链接
        urls: images // 需要预览的图片http链接列表
      });
    }
    // 弹出默认消息
    vue.showMessage = vue.prototype.showMessage = (text) => {
      vue.$toast({message: text, iconClass: 'icon icon-defeat'});
    }
    // 弹出成功消息
    vue.showSuccess = vue.prototype.showSuccess = (text) => {
      vue.$toast({message: text, iconClass: 'icon icon-success'});
    }
    // 弹出错误消息
    vue.showError = vue.prototype.showError = (text) => {
      vue.$toast({message: text, iconClass: 'icon icon-error'});
    }
    //到智齿客服
    vue.goToRobot = vue.prototype.goToRobot = (params) =>{
       var user =  JSON.parse(getUser('user'));
       var url = 'https://www.sobot.com/chat/h5/index.html?sysNum=2c71dc6beb1a4afd94381adb33357251';
       url+= '&partnerId='+encodeURIComponent(user.memberId);   //用户id
       url+= '&face='+encodeURIComponent(user.head);   //用户头像
       url+= '&uname='+encodeURIComponent(user.nickName); //用户昵称
       url+= '&realname='+encodeURIComponent(user.nickName); //用户真实姓名
       url+= '&customerFields='+encodeURIComponent(JSON.stringify(params)); //传递的参数
       window.location.href = url;
    }
    //初始化微信
    http.get(vue).url('/app/api/auth/wx-config').request(function (response) {
      var res = response.data.data;
      wx.config({
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名,
        jsApiList: ["chooseImage", "previewImage", "uploadImage", "onMenuShareTimeline", "onMenuShareAppMessage"]
      });
    });
  }
}

// 强制解决锤子手机点击img标签会出现预览界面，return false来阻止事件传播到微信预览
$(function() {
  $(document).on("click", "img", function(){
    return false;
  });
});
