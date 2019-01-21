<template>
  <div id="logistical_vue">

      <div class="goods_message">
        <div class="goods_box">
          <div class="left">
            <img :src="goods.cover + '?imageView2/0/w/500/h/500|imageslim'" >
          </div>
          <div class="right" style="overflow:hidden;">
            <p class="title">{{goods.title}}</p>
            <p class="style" style="width:5rem;max-width:5rem;"><span>{{goods.styleName}}</span><span v-if="goods.subName">{{goods.subName}}</span></p>
            <p class="price"><span>¥{{goods.stylePrice}} {{goods.expressMoney ? "(含运费 ¥"+goods.expressMoney+")" : "(免运费)"}}</span><span>x{{goods.amount}}</span></p>
          </div>
        </div>
      </div>

      <!-- <div class="box"> -->
       <!--  <div class="productPic">
          <span>
              <img :src="goods.cover" />
            </span>
        </div> -->

<!--         <div class="box-right">
          <p class="productTitle">
            商品正在配送中...
          </p>
          <p class="productSize">{{expressName}}</p>
          <p id="orderNumber_p" class="productSize" style="height: 0.2rem;">订单编号：
            <input readonly type="text" :value="orderNumber" id="copy_content" style="width:120px;">  -->
           <!--  <span data-clipboard-target="#copy_content" id="copy_btn" @click='copyOrderNumber()' style="width: 0.28rem;
    height: 0.12rem;
    line-height: 0.12rem;
    text-align: center;
    font-size: 0.08rem;
    border: 1px solid #999999;
    color: #999999;">
             复制 
            </span> -->
<!--            <img src="../../assets/img/copy_image_btn.png" data-clipboard-target="#copy_content" id="copy_btn" @click='copyOrderNumber()'>

          </p>
          <p id="orderNumber_p1" class="productSize" style="height: 0.2rem;">
          运单号:
          <input readonly type="text" :value="expressNumber" id="copy_content1" style="width:120px;"> 
          <img src="../../assets/img/copy_image_btn.png" data-clipboard-target="#copy_content1" id="copy_btn1" @click='copyOrderNumber1()'>
          </p>
        </div>
      </div> -->
      <!-- <div class="top">
        <p>订单号:{{orderNumber}}</p>
        <p>运单号:{{expressNumber}}</p>
        <p>快递公司:{{expressName}}</p>
      </div> -->

      <div class="orderNumber_box">
        <div class="left">
            <img src="../../assets/img/new_car.png" >  
        </div>
        <div class="right">
            <p class="title">等待收货</p>
            <p class="desc">{{goods.expressName}}</p>
            <p class="order"> 
              <span>运单编号:</span>
              <input readonly type="text" :value="goods.expressNumber" id="copy_content">
              <img src="../../assets/img/copy_image_btn.png" data-clipboard-target="#copy_content" id="copy_btn" @click='copyOrderNumber()'>
            </p>
        </div>
      </div>

      <div class="logistical" v-show='!loading'>

        <div class="content" v-for='n in data'>
          <p class="line">
          <span class="line_top"></span>
          <i></i>
          <span class="line_bottom"></span>
          </p>
          <div>
            <p>{{n.context}}</p>
            <time>{{n.ftime}}</time>
          </div>
        </div>
        
    

      </div>
  
  

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

    <!-- <LoadingView v-bind:dataload="loading"></LoadingView> -->
  </div>
</template>

<script>
import LoadingView from '@/components/Loading.vue'

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name:'logistical',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    created (){
      document.title="物流信息"
    },
    data(){
      return {
        firstLoad:true,
        loadFailed:false,
        data:[],
        orderNumber:null,
        expressName:null,
        expressNumber:null,
        loading :true,
        goods:{}
      }
    },
    mounted (){
      let orderNumber = this.getParam('orderNumber');
      this.orderNumber = orderNumber
      this.loadOrderDetail();
    },
    methods:{
      reload(){
        this.loadFailed =false;
        this.loadOrderDetail();
      },
      loadOrderDetail(){
        this.http.get(this).url('/app/api/order/detail/:orderNumber').restful({orderNumber:this.orderNumber}).request((req)=>{
            this.firstLoad = false;
            if (req.data.code != 0) {
                return;
            }
            //console.log(req);
            var data = req.data.data;
            this.goods = data.orderGoodsRelationDetail;
            this.expressName = data.orderGoodsRelationDetail.expressName;
            this.orderNumber = data.orderGoodsRelationDetail.orderNumber;
            this.expressNumber = data.orderGoodsRelationDetail.expressNumber;
            this.loadExpress();
          },(err)=>{
            this.firstLoad =false;
            this.loadFailed = true;
            console.log(err)
         })          
      },
      loadExpress(){
        this.http.get(this).url('/app/api/order/express/track/:orderNumber').restful({orderNumber:this.orderNumber}).request((req)=>{
            if (req.data.code != 0) {
                return;
            }
            console.log(req);
            var data = req.data.data.data;
            this.data = data;
            this.loading = false;
          },(err)=>{
            this.loadFailed = true;
            this.loading = false;
            console.log(err)
        })
      },
      copyOrderNumber(){
          var clipboard  = new Clipboard('#copy_btn');
          clipboard.on('success', (e)=> {
              this.showMessage('运单号复制成功')
              e.clearSelection();
              clipboard.destroy();
          });
          clipboard.on('error', (e)=> {
              this.showError('运单号复制失败,请手动复制')
             clipboard.destroy();
          });
      },
      copyOrderNumber1(){
          var clipboard  = new Clipboard('#copy_btn1');
          clipboard.on('success', (e)=> {
              this.showMessage('运单号复制成功')
              e.clearSelection();
              clipboard.destroy();
          });
          clipboard.on('error', (e)=> {
              this.showError('运单号复制失败,请手动复制')
             clipboard.destroy();
          });
      },
    }
  }
</script>

<style lang="scss">
  body, html {
    background: #F2F2F2;
    height: 100%;
    width: 100%;
  }
  #logistical_vue{
    width:3.55rem;
    padding-top:0.15rem;
    padding-left:0.1rem;
    padding-right:0.1rem;
    font-size:0.14rem;
    color:#333;
    .top{
      background:#fff;
      padding:0.1rem 0;
      >P{
        margin-left:0.16rem;
        margin-bottom:0.1rem;
      }
    }
    .logistical{
      width:100%;
      margin:0.16rem auto 0;
      padding-bottom:0.16rem;
    }
    .content{
      width:3.43rem;
      height:auto;
      padding-left: 0.06rem;
      padding-right:0.06rem;
      position:relative;
      overflow:hidden;
      >div{
        margin-left:0.22rem;
        width: 3.21rem;
        height: auto;
        color:#666;
        p{
          height:auto;
          width:100%;  
          padding-top: 0.1rem;
          line-height:0.25rem;
          padding-bottom:0.05rem;
          font-size: 0.14rem;
          color: #666666;
         
        }
        time{
          width:100%;
          font-size: 0.12rem;
          color: #666666;
          display: inline-block;
          float: left;
        }
      }
    }
     .line{
      position:absolute;
      width:0.12rem;
      height:100%;
      top:0;
      left:0.06rem;
      >span{
        display:block;
        width:1px;
        background:#75cb53;
        margin-left:0.05rem;
      }
      span.line_top{
        height:0.18rem;
      }
      span.line_bottom{
        height:100%;
      }
      >i{
        display:block;
        width:0.12rem; 
        height:0.12rem;
        border-radius: 50%;
        background-image:url("../../assets/img/logistical_image.png");
        background-size: 100%;
      }
    }
    .content:first-child{
      span.line_top{
        background:none;
      }
    }
    .content:last-child{
      span.line_bottom{
        background:none;
      }
    }
    
    .box{
        width: 3.75rem;
        height: 1.4rem;
        background: #FFFFFF;
        position: relative;
        left: 0;
        margin-bottom: 0.1rem;
        /*box-shadow: 0 1px 4px 0 rgba(0,0,0,0.10);*/
    }
    .productPic {
        background: #F2F2F2;
        /*border-radius: 4px;*/
        width: 1.08rem;
        height: 1.08rem;
        top: 0.16rem;
        left: 0.16rem;
        position: absolute;
        text-align: center;
        display: table-cell;
    }
    .productPic span{
        width: 1.08rem;
        height: 1.08rem;
        position: absolute;
        left: 0;
    }
    .productPic img {
        width: 85%;
        height: 85%;
        position: absolute;  
        margin: auto;  
        top: 0;  
        right: 0;  
        bottom: 0;  
        left: 0;
//      display: inline-block;
    }
    .box-right{
        width: 2.3rem;
        height: 1.08rem;
        float: right;
        margin-top: 0.18rem;
        position: relative;
    }
    .productTitle {
        font-size: 0.16rem;
        height: auto;
        margin-bottom:0.06rem;
        color:#333333;
        max-width: 2.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .productSize {
        left: 1.40rem;
        color: #999999;
        font-size: 0.14rem;
        height: auto;
        margin-top: 0.08rem;
        max-width: 2.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .productPrice {
        color: #333333;
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 0.14rem;
    }
    .productNum {
        position: absolute;
        bottom: 0;
        right: 0.16rem;
        font-size: 0.14rem;
    }
    #orderNumber_p,#orderNumber_p1{
        display:flex;
        align-items:center;
        height:0.3rem
    }
    #copy_content,#copy_content1{
        width:130px;
        border:none;
        outline:none;
        background:#fff;
        color:#666;
        font-size:0.14rem;
        overflow:hidden;
        height:0.24rem;
        line-height:0.24rem;
    }
    #copy_btn,#copy_btn1{
      
        width:0.24rem;
        height:0.24rem;
      
    }
    .goods_message{
      background:white;
      width:3.35rem;
      height:auto;
      margin:0 auto 0;
      padding-top:0.2rem;
      padding-bottom:0.2rem;
      padding-left:0.1rem;
      padding-right:0.1rem;
     
      >div.goods_box{
          width:3.35rem;
          height:0.8rem;
          overflow:hidden;
          >.left{
              width:0.8rem;
              height:0.8rem;
              //background:#F2F2F2;
              margin-right:0.15rem;
              float:left;
              position:relative;
              >img{
                  width:85%;
                  height:85%;
                  display:block;
                  position: absolute;
                  margin: auto;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
              }
          }
          >.right{
              float:left;
              width:2.4rem;
              height:0.8rem;
              position:relative;
              font-size:0.14rem;
              color:#343434;
              >.title{
                 margin-bottom:0.04rem; 
                 font-weight:700;
              }
              >.style{
                  overflow:hidden;
                  color: #999999;
                  font-size: 0.12rem;
                  >span{
                      display:block;
                      padding:0.03rem 0.08rem;
                      float: left;
                      background:#f6f6f6;
                      margin-right:0.06rem;
                  }
              }
              >.price{
                  overflow:hidden;
                  position:absolute;
                  left:0;
                  bottom:0;
                  width:100%;
                  >span:first-child{
                      float:left;
                      color:#343434;    
                  }   
                  >span:last-child{
                      float:right;
                      color:#999;
                  }
              }
          }
      }
    }
    .orderNumber_box{
      width:100%;
      height:auto;
      padding-top:0.15rem;
      padding-bottom:0.15rem;
      background:white;
      margin-top:0.15rem;
      margin-bottom:0.15rem;
      overflow:hidden;
      img{
        width:.24rem;
        height:.24rem;
        display:block;
      }
      >.left{
        display:flex;
        width:0.24rem;
        height:0.74rem;
        padding-left:0.15rem;
        padding-right:0.15rem;
        align-items:center;
        float:left;
      }
      >.right{
        width:2.86rem;
        height:auto;
        float:left;
        padding-right: 0.15rem;
        color:#343434;
        >p.title{
          font-size:0.18rem;
          font-weight:700;
          margin-bottom:0.05rem;
        }
        >p.desc{
          font-size:0.16rem;
        }
        >p.order{
          height:0.24rem;
          display:flex;
          
          align-items:center;
          color:#666;
          font-size:0.14rem;
          span{
            display:block;
            width:auto;
            height:0.24rem;
            margin-right:0.05rem;
            line-height:0.24rem;

          }
        }
      }
    }
  }
</style>