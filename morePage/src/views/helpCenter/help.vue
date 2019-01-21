<template>
  <div id="help">
    <ul>
      <li @click="gotoProblem('send_problem.html')">
        <p>配送和安装问题</p>
        <img src="../../assets/img/arrow_right_help.png"/>
      </li>
      <li @click="gotoProblem('order_problem.html')">
        <p>订单与退款</p>
        <img src="../../assets/img/arrow_right_help.png"/>
      </li>
      <li @click="gotoProblem('aftersale_problem.html')">
        <p>关于售后</p>
        <img src="../../assets/img/arrow_right_help.png"/>
      </li>
      <li @click="gotoProblem('price_problem.html')">
        <p>价格说明</p>
        <img src="../../assets/img/arrow_right_help.png"/>
      </li>
      <!-- <li @click="gotoProblem('order_problem.html')">
        <p>促销问题</p>
        <img src="../../assets/img/arrow_right_help.png"/>
      </li> -->
      <li @click="gotoProblem('normal_problem.html')">
        <p>平台常见问题</p>
        <img src="../../assets/img/arrow_right_help.png"/>
      </li>
    </ul>

    <div class="fix-div">
      <div >
        <img src="../../assets/img/new_icon_service.png">
        <p  @click="tocustomerService">
          在线客服
        </p>
      </div>

      <div class="line"></div>

      <div>

        <img src="../../assets/img/phone.png">
        <p v-if="state == 3"> <a  href="tel:028-85678699">电话客服</a></p>
        <p v-else  @click="callPhone">电话客服</p>

      </div>

    </div>

  </div>
</template>

<script>
  import jsBridge from '../../commons/jsBridge.js'; 
  export default {
    name: 'help',
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
      document.title = "帮助中心"
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
      gotoProblem(linkUrl) {
        let url = null;
        if(process.env.NODE_ENV == "production") {
          url = "https://wx.goochao.com/" + linkUrl;
        } else if(process.env.NODE_ENV == "test") {
          url = "http://test.wx.goochao.com/" + linkUrl;
        } else {
          url = "http://192.168.20.102:8080/" + linkUrl;
        }

        if (this.state == 1 || this.state == 2) {
          let obj = {};
          obj.url = url;
          jsBridge.invoke("openUrl",obj);
        } else if (this.state == 3) {
           this.keep.go(url,false)
        } else {
          this.showMessage("请使用微信打开");     
        }
      },

    }
  }
</script>

<style lang='scss'>
  html, body {
    background-color: white;
    width:3.75rem;
    height:100%;
  }
  #help {
    width: 3.75rem;
    ul {
      padding: 0;
      margin: auto;
      width: 3.35rem;
      li {
        height: 0.63rem;
        width: 100%;
        border-bottom: 1px solid #dddddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 0.24rem;
          height: 0.24rem;
          display: block;
        }
      }
      li:last-child {
        border-bottom-style: none;
      }
    }
    p {
      font-size: 0.16rem;
      font-weight: 700;
      color:#343434;
    }
    .fix-div {
      height: 0.57rem;
      position: fixed;
      bottom: 0px;
      width: 100%;
      border-top: 1px solid #dddddd;
      font-size: 0.16rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      background:white;
      div {
        display: flex;
        width: 50%;
        height:100%;
        justify-content: center;
        align-items: center;
      }
      .line {
        width: 1px;
        height: 0.3rem;
        background: #dddddd;
      }
      img {
        width: 0.24rem;
        height: 0.24rem;
        margin-right: 0.07rem;
      }
      a{
        color: #343434;
        text-decoration: none;
      }
    }
  }

</style>
