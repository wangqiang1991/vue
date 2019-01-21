<template>
  <div id="commonProblem_vue">
    <ul>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>为什么我的订单被拆分成多个订单？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>
            由于商品存放仓库位置不同，一个订单中的商品可能会被拆分为多个包裹配送。不同的包裹配送时间会略有不同。
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>下单后，我还可以更改订单信息吗？ </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>很抱歉，暂时不能修改订单信息。若您需要修改订单中信息，比如收货人姓名，联系电话，送货地址等，请联系构巢客服为您更改。另外，若新收货地址超出构巢所承诺的“送货上门及组装”服务区域，由此导致的额外费用需由您承担，该笔费用将由服务公司直接向您收取，请您支付前仔细核对。 </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我购买的商品是否支持七天无理由退换货？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>
            构巢承诺商品七日内且商品无人为质量损坏，可申请无理由退货。 <br>退换货要求具备商品收到时完整的外包装、配件、吊牌等；购买物品被洗过、人为破坏或标牌拆卸的不予退换；所有预定或订制特殊尺码的不予退换。 
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>退换货时运费由谁承担？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>若因商品质量问题产生的退换货，所有邮费有构巢承担，七非商品质量问题的退换货，需由您承担往返运费。 

          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>退货过程中产生产品损坏，谁来承担这个责任呢？ </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>我们在收到您寄回的产品后，将确定货物情况，与您确认换货或退货完成，如因您包装不善造成的货损，需由您承担；   </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>退货完成后，我去哪里接收我的退款呢？ </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>因退换货产生退款时，现金部分将通过您支付的方式退回。未发货的订单，优惠券将退回您的构巢账户，原有效期不变。若为退货退款，优惠券视为已使用。  </p>
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
      document.title = "订单与退款"
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
