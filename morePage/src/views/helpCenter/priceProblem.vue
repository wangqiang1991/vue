<template>
  <div id="commonProblem_vue">
    <ul>

      <li>
        <div class="question">
          <p style="width:100%;">
            划线价、参考价
          </p>
        </div>
        <div class="answer">
          <p style="width:100%;">
            商品展示的划线价或参考价可能是平台指导价、未折扣原价或该商品在构巢上曾经展示过的销售价；由于各方面的差异性和市场行情的波动，该价格仅供您参考。
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <p style="width:100%;">
            构巢售价
          </p>
        </div>
        <div class="answer">
          <p style="width:100%;">
            用户购买的商品详情页显示的售价，是您最终决定是否购买该商品的依据。
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <p style="width:100%;">
            折扣
          </p>
        </div>
        <div class="answer">
          <p style="width:100%;">
            如无特殊说明，折扣指商品在参考价或划横线价等某一价格基础上计算出的优惠比例或优惠金额；如有疑问，您可在购买前联系销售商进行咨询。 
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <p style="width:100%;">
            异常问题
          </p>
        </div>
        <div class="answer">
          <p style="width:100%;">
            因可能存在系统缓存、页面更新延迟等不确定性因素，导致价格显示异常，商品具体售价请以订单结算页价格为准。如您发现异常情况，建议购买前先联系客服，以便您能顺利购物。 
          </p>
        </div>
      </li>

    </ul>
<!--     <div class="line"></div>
    <div class="call_phone">
      <img src="../../assets/img/new_icon_service.png">
      <p  @click="tocustomerService">没有你要找的问题？可联系在线客服</p>
    </div>
    <div class="line"></div>
 -->
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
      document.title = "价格说明"
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
