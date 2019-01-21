<template>
  <div id="commonProblem_vue">
    <ul>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我能指定物流发送吗？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>
            非常抱歉，目前构巢暂不提供指定快递配送的服务，系统会根据当前的派送地址选择配置最优的物流公司。 
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我购买的商品如何配送？包邮吗？ </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>购买产品后，小件商品构巢直接发货，快递包邮服务范围以快递公司服务网点正常配送区域为主，物流包邮服务范围以物流公司服务网点正常配送区域为准，超出配送区域的，将为您免费发至最近的服务网点，由您自行提货。 构巢大件家具会在客服联系后，根据您的具体情况进行最优配置物流。具体物流信息可在下单成功之后在“我的订单-查看物流”中查看。 <br>商品包邮情况会在商品购买详情页面具体显示。 </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>下单之后多久发货？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>
            我们会在订单支付成功后1-3天内发货（节假日顺延，部分特殊商品七天内发货），送达时间视快递配送时间而定。 <br>若您购买了大件家具，构巢会与您联系，约定发货时间并告知您大致到货时间。大件家具的物流周期通常为3-10天，还望理解。  
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>如果在安装时发现大件家具尺寸太大，无法通过楼道或进不了电梯怎么办？</p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>因电梯空间问题造成大件产品无法上楼，相关额外费用需要由您承担。请您在购买前熟悉大尺寸产品入户的现场通道条件，并仔细核对电梯空间大小，确保产品可以顺利送达;如您仍有疑问，请向客服咨询： 

          <span>构巢在线客服 
            <a href="tel:028-85678699" v-if="state == 3">028-85678699</a>
            <span  @click="callPhone" v-else class="phone">028-85678699</span>
          </span>
          </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>如果因为装修原因，我可以推迟大件产品收货时间吗？ </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>大件家具下单后，构巢会跟您联系确认送货时间，此时可跟客服预约送货时间。 <br>若大件家具发货后需要更改收货时间，构巢可为您提供3个自然日的免费仓储，超过3个工作日开始收取仓储费，收费为15元/天/m³(具体以当地市场价格为准)，该笔费用将由服务公司直接向您收取，请您支付前仔细核对。<br> 请您预估合理的收货时间，避免因到货后无法收货而产生的仓储费用。  </p>
        </div>
      </li>

      <li>
        <div class="question">
          <img src="../../assets/img/answer_icoon.png" >
          <p>我的物流为什么没有更新？ </p>
        </div>
        <div class="answer">
          <img src="../../assets/img/question_icon.png">
          <p>一般情况下，物流只有到了站点才会更新，72小时内更新物流信息是正常现象，建议您耐心等待。如果订单已发货，无跟踪物流，原因可能是物流信息暂时未录入。物流不更新≥3天，你可咨询在线客服，工作人员会为您核实最新动态。 </p>
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
      document.title = "配送和安装问题"
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
