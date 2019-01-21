<template>
  <div id="commonProblem_vue">
    <ul>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我如何申请售后？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>
            登录您的构巢账号，在“我的-我的订单”，选择需要申请售后的订单，进入“订单详情”，点击“申请退款”。申请时候需要填写：退货数量、退货原因。发起申请之后，构巢于1-3个工作日进行审核，订单页面会更新退款状态，如有疑问，可咨询在线客服。
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我的售后商品何时能收到退款？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>申请售后之后，客服人员审核通过之后，退款于3-5个工作日退回原支付账户。 </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我的投诉与建议？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>若构巢平台的商品品或服务出现任何问题，我们深表歉意，同时请您第一时间与我们取得联系并反馈问题。我们将在收到反馈后一个工作日之内与您联系，沟通后续的处理方法及时限，解决您的问题 。

          <span>人工客服热线：
            <a href="tel:028-85678699" v-if="state == 3">028-85678699</a>
            <span  @click="callPhone" v-else class="phone">028-85678699</span>
          </span>
          </p>
        </div>
      </li>


      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我怎么联系客服？ </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>您可以通过手机拨打号码028-85678699联系构巢电话客服。<br>
          将您的问题告与构巢在线客服，客服将为您解答，电话客服热线服务时间为： 
            <span style="margin-top:0.02rem;">9:00 - 18:00（周一至周五）</span>
            <span style="margin-top:0.02rem;">10:00-18:00（周六至周日及正常节假日）</span>
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
      document.title = "关于售后"
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
