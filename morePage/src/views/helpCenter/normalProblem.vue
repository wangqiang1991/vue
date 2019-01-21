<template>
  <div id="commonProblem_vue">
    <ul>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>忘记密码怎么办？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>
            1.在登陆页面点击“忘记密码”，进入重置密码界面。 
            <br>2.按照提示输入您的原手机号码、验证码，再重新输入您需要设置的新密码。<br>
             3.密码重置成功。
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>如何修改个人信息? </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>1.进入“个人中心”界面。<br> 2.点击头像，即可对个人信息进行修改。 </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>个别商品与实物存在色差问题？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>
           由于平台的商品图片颜色经设计师校对，由于不同的显示器、光线、亮度都有差异，造成轻微色差难以避免，请谅解。  
          </p>
        </div>
      </li>



    </ul>
    <div class="line"></div>
    <div class="call_phone">
      <img src="../../assets/img/new_icon_service.png">
      <p  @click="tocustomerService">没有你要找的问题？可联系在线客服</p>
    </div>
    <div class="line"></div>

  </div>
</template>

<script>
  import jsBridge from '../../commons/jsBridge.js'; 
  export default {
    name: 'sendProblem',
    data() {
      return {
        state:null,
      }
    },
    mounted() {
      let platform = jsBridge.getPlatform();
      if (platform == 'ios') {
        this.state = 1;
      } else if (platform == 'android') {
        this.state = 2;
      } else if ( this.isWeiXin() ){
        this.state = 3;
      } else {
        this.state = 4;
        this.showMessage("请使用微信打开");     
      }
    },
    created() {
      document.title = "平台常见问题"
    },
    methods: {
      isWeiXin(){ 
        var ua = window.navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
          return true; 
        } else { 
          return false; 
        }
      },
      tocustomerService(){
        if (this.state == 1 || this.state == 2) {
          jsBridge.invoke("toCustomerService",null);
        } else if (this.state == 3) {
          this.goToRobot({});  
        } else {
          this.showMessage("请使用微信打开");     
        }
        
      },
      callPhone() {
        if (this.state == 1 || this.state == 2) {
          let obj = {};
          obj.phone = '028-85678699';
          jsBridge.invoke("callPhone",obj);
        } else if (this.state == 3) {
          
        } else {
          this.showMessage("请使用微信打开");     
        }
      },

    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/commonProblem.scss';
</style>
