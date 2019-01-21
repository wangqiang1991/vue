<template>
  <div id="messageCenter">

    <div class="layout_item" @click='toMessageDetail(1)'>
      <div class="title">
        <img class="logo" src="../../assets/img/icon_good.png" alt="图标">
        <p>构巢精选</p>
  
        <b class="tip" v-if='goodGoochao.goodsUnreadCount + goodGoochao.subjectUnreadCount'></b>
        <b class="noTip" v-else></b>
        <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头">
      </div>
      <p class="message">
        {{goodGoochao.message}}
      </p>
      <p class="time" v-if='goodGoochao.time'>{{goodGoochao.time | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
    </div>

    <div class="layout_item"  @click='toMessageDetail(2)'>
      <div class="title">
        <img class="logo" src="../../assets/img/icon_activity.png" alt="图标">
        <p>活动通知</p>
  
        <b class="tip" v-if='activity.activityUnreadCount'></b>
        <b class="noTip" v-else></b>
        <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头">
      </div>
      <p class="message">
        {{activity.activityMessage}}
      </p>
      <p class="time" v-if='activity.time'>{{activity.time | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
    </div>

    <div class="layout_item" style="border-bottom:none"  @click='toMessageDetail(3)'>
      <div class="title">
        <img class="logo" src="../../assets/img/icon_sound.png" alt="图标">
        <p>系统消息</p>
  
        <b class="tip" v-if='sys.sysUnreadCount'></b>
        <b class="noTip" v-else></b>
        <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头">
      </div>
      <p class="message">
        {{sys.sysMessage}}
      </p>
      <p class="time" v-if='sys.time'>{{sys.time | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
    </div> 

    <div style="width:100%;height:0.15rem;background:#f2f2f2;"></div>   

    <div class="layout_item" style="border-bottom:none" @click="tocustomerService">
      <div class="title">
        <img class="logo" src="../../assets/img/icon_service.png" alt="图标" style="width:0.24rem;height:0.24rem;margin:0 0.04rem;">
        <p>客服</p>
  
        <b  v-if='messageCount != 0' class="tip"></b>
        <b v-else class="noTip"></b>
        <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头">
      </div>
    </div>     
     
    <div class="zhiCustomBtn" style="display:none !important;"></div>  

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'messageCenter',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        messageCount:0,
        goodGoochao:{
          goodsMessage:'',
          goodsUnreadCount:0,
          subjectMessage:'',
          subjectUnreadCount:0,
          message:'',
          time:null
        },
        activity:{
          activityMessage:'',
          activityUnreadCount:0,
          time:null
        },
        sys:{
          sysMessage:'',
          sysUnreadCount:0,
          time:null
        }
      }
    },
    mounted() {
      this.initzhichi();
      this.loadData();
    },
    created() {
      document.title = "消息中心"
    },
    methods: {
      loadData() {
        this.http.get(this).url(this.config.message.last_message).request(function(response){
          let data = response.data.data;
          this.goodGoochao.goodsUnreadCount = data.goodsUnreadCount;
          this.goodGoochao.subjectUnreadCount = data.subjectUnreadCount;
          this.activity.activityUnreadCount = data.activityUnreadCount;
          this.sys.sysUnreadCount = data.sysUnreadCount;

          //构巢精选
          if (data.subjectUnreadCount + data.goodsUnreadCount) {
            if (data.subjectMessage && data.goodsMessage) {
              if (data.subjectMessage.createdAt > data.goodsMessage.createdAt) {
                this.goodGoochao.message = data.subjectMessage.messageDesc;
                this.goodGoochao.time = data.subjectMessage.createdAt;
              } else {
                this.goodGoochao.message = data.goodsMessage.messageDesc;
                this.goodGoochao.time = data.goodsMessage.createdAt;
              }
            } else if (data.subjectMessage) {
              this.goodGoochao.message = data.subjectMessage.messageDesc;
              this.goodGoochao.time = data.subjectMessage.createdAt;
            } else if (data.goodsMessage) {
              this.goodGoochao.message = data.goodsMessage.messageDesc;
              this.goodGoochao.time = data.goodsMessage.createdAt;
            } else {
              this.goodGoochao.message = '为你推送优质期刊与商品';
              this.goodGoochao.time = null;
            }
          } else {
            this.goodGoochao.message = '为你推送优质期刊与商品';
          }

          //活动通知
          if (data.activityUnreadCount ) {
            if (data.activityMessage) {
              this.activity.activityMessage = data.activityMessage.messageDesc;
              this.activity.time = data.activityMessage.createdAt;
            } else {
              this.activity.activityMessage = '官方活动消息将在这里通知你';
            }
          } else {
            this.activity.activityMessage = '官方活动消息将在这里通知你';
          }          

         //系统消息
          if (data.sysUnreadCount ) {
            if (data.sysMessage) {
              this.sys.sysMessage = data.sysMessage.content;
              this.sys.time = data.sysMessage.createdAt;
            } else {
              this.sys.sysMessage = '系统与订单的消息在这里展示';
            }
          } else {
            this.sys.sysMessage = '系统与订单的消息在这里展示';
          }          

          this.firstLoad = false;
        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
        })
      },  
      reload() {
        this.loadFailed = false;
        this.loadData();
      },
      initzhichi() {
        var user =  JSON.parse(this.getUserData('user'));
        let that = this;
        var zhiManager = (getzhiSDKInstance());
        // 设置参数
        zhiManager.set('color','000000'); //设置颜色
        zhiManager.set('customBtn', 'true'); //不使用智齿咨询按钮
        zhiManager.set('partnerId', user.memberId); //设置uid
        //手动初始化时 通过 load 方法调用 js 组件
        zhiManager.on("load", function() {
          zhiManager.initBtnDOM();
        });

        /*未读消息*/
        zhiManager.on("receivemessage", function(ret) {    
          console.log(ret);
          that.messageCount += ret.data.length;
        });

        /*离线消息*/
        zhiManager.on("unread.count",function(data){
          console.log(data);
          that.messageCount = data;
        });

      },
      tocustomerService() {
        this.goToRobot({});
      },
      toMessageDetail(type) {
        this.keep.go('/message_center_detail.html',false,{type:type});
      }
    }
  }
</script>

<style lang='scss'>
  html, body {
    background-color: #f2f2f2;
    width:100%;
    height:100%;
  }
  #messageCenter{
    width:100%;
    height:auto;
    overflow: hidden;
    div.layout_item{
      width:3.4rem;
      height:auto;
      padding: 0.1rem 0.2rem 0.1rem 0.15rem;
      overflow: hidden;
      background: white;
      border-bottom: 1px solid #f2f2f2;
      div.title{
        display: flex;
        align-items:center;
        img.logo{
          display:block;
          width:0.32rem;
          height:0.32rem;
        }
        p{
          width:2.66rem;
          padding-left: 0.1rem;
          color:#343434;
          font-size: 0.16rem;
          font-weight: 700;
        }
        b{
          width:0.08rem;
          height:0.08rem;
        }
        b.tip{
          background:#f75151;
          border-radius: 50%; 
        }
        img.toRight{
          display:block;
          width:0.24rem;
          height:0.24rem;          
        }
      }
      p.message{
        width:2.98rem;
        padding-left: 0.42rem;
        height:auto;
        margin-top: 0.05rem;
        margin-bottom: 0.1rem;
        font-size:0.14rem;
        color:#666;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        overflow:hidden;
      }
      p.time{
        width:2.98rem;
        padding-left: 0.42rem;
        height:auto;
        font-size:.1rem;
        color:#999;
      }
    }
  }

</style>
