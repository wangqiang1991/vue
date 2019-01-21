<template>
  <div id="appraiseWait_Vue">

    <div class="waitAppraise">
      <div class="waitAppraiseContent">
        <p v-if = "data.orderType != 4">订单已完成</p>
        <p v-if = "data.orderType == 4" style="color:white;font-size:0.18rem;font-weight:700;float:left">订单已完成(换货)</p>
        <!-- <p class="content" v-if="orderStatus == 0">该订单正在等待您的评价</p> -->
        <!-- <p class="content" v-if="orderStatus == 1">该订单已评价</p> -->
        <p class="content" >如有疑问可以质询客服</p>
      </div>
      <!-- <p class="appraise" @click="goPublish" v-show="orderStatus == 0">评价</p> -->
      <!-- <p class="appraise" @click="goCommentContent" v-show="orderStatus == 1">我的评价</p> -->
      <p class="appraise" style="right:0.98rem;" @click="customerService" v-show="(goods.amount > goods.afterApplyCount)">申请售后</p>
      <!-- <p class="appraise" @click="goAfterSaleInformation" v-show="orderStatus == 3 && afterSaleStatus != 'null' ">售后详情</p> -->
      <p class="appraise"  @click="tocustomerService" >联系客服</p>
    </div>

<!--     <div class="consigneeInformation">
      <p>
        <span>收货人：{{data.reallyName}}</span>
        <span style="float: right;">{{data.phone}}</span>
      </p>
      <p>
        收货地址：{{data.address}}
      </p>
      <img class="line" src="../../assets/img/Rectangle_3.png" />
      <img class="order_line" src="../../assets/img/xx.png"/>
    </div> -->
  
    
    <div  class="addressMessage">
    
       <div style="height:1.37rem;">
          <img src="../../assets/img/location.png" >
          <div>
            <b style="overflow:hidden;">
              <span style="display:block;float:left;width:1.58rem">{{data.reallyName}}</span> 
              <span style="display:block;float:right;">{{data.phone}}</span>
            </b>
            <span style="word-break: break-all;">{{data.address}}</span>
          </div>
      </div>
      
    </div>

    <div class="remark" v-if="data.message">
      <img src="../../assets/img/remarks.png" >
      <p>{{data.message}} </p>
    </div>
    
    <div class="content_box">
      <div class="goods_message"  @click="goDetal(n)">
        <div class="goods_box">
          <div class="left">
            <img :src="goods.cover + '?imageView2/0/w/500/h/500|imageslim'" >
          </div>
          <div class="right" style="overflow:hidden;">
            <p class="title">{{goods.title}}</p>
            <p class="style" style="width:5rem;max-width:5rem;"><span>{{goods.styleName}}</span><span v-if="goods.subName">{{goods.subName}}</span></p>
            <p class="price"><span>¥{{goods.stylePrice}}</span><span>x{{goods.amount}}</span></p>
          </div>
        </div>
      </div>
      
      <div class="goods_pay_message">
        <p class="goods_amount">
          <span>{{goods.amount}} 件商品总价</span>
          <span>¥ {{((goods.stylePrice * goods.amount).toFixed(2) + "").replace(".00", "") }}</span>
        </p>
        <p>
          <span>订单编号：</span>
          <span>
            <img src="../../assets/img/copy_image_btn.png" data-clipboard-target="#copy_content" id="copy_btn" @click='copyOrderNumber()'>
            <input readonly type="text" :value="goods.orderNumber" id="copy_content">
          </span>
        </p>
        <p>
          <span> 下单时间：</span>
          <span>{{data.payDate | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
        </p>
        <p>
          <span>发货时间：</span>
          <span>{{goods.deliveredDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </p>
        <p>
          <span>配送方式：</span>
          <span>{{goods.expressName}}</span>
        </p>
         <p>
          <span>运单编号：</span>
          <span>
            <img src="../../assets/img/copy_image_btn.png" data-clipboard-target="#copy_content1" id="copy_btn1" @click='copyOrderNumber1()'>
            <input readonly type="text" :value="goods.expressNumber" id="copy_content1">
          </span>
        </p>
         <p>
          <span>收货时间：</span>
          <span>{{goods.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </p>
      </div>
    </div>

    <div class="goods_money_message">
      <p>
        <span>运费</span>
        <span>¥{{data.orderGoodsRelationDetail.expressMoney}}</span>
      </p>
      <p>
        <span>优惠券</span>
        <span>-¥{{ data.orderGoodsRelationDetail.deductionMoney }}</span>
      </p>
      <p>
        <span>订单总价</span>
        <span>¥{{ ((data.orderGoodsRelationDetail.money + data.orderGoodsRelationDetail.expressMoney).toFixed(2) + "").replace(".00", "")  }}</span>
      </p>
    </div>


<!-- 

     <div class="parcel">
      <div class="widget widget-tab">
        <input type="radio" name="widget-tab" id="parcel1" checked="checked" />
        <input type="radio" name="widget-tab" id="parcel2" />
        <div class="widget-box">
          <ul class="parcel1-list">
            <li>
              <div class="box" @click="goDetal(n)">
                <div class="productPic">
                  <span>
                  <img :src="goods.cover" />
                </span>

                </div>

                <div class="box-right">
                  <p class="productTitle">
                    {{goods.title}}
                  </p>
                  <p class="productSize">{{goods.styleName}}</p>
                  <p class="productPrice">¥{{goods.stylePrice}}</p>
                  <p class="productNum">x{{goods.amount}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

     <div class="pay">
      <div class="payInformation">
        <p>
          <span>商品总额</span>
          <span>¥{{data.orderGoodsRelationDetail.money}}</span>
        </p>
        <p>
          <span>运费</span>
          <span>¥{{data.orderGoodsRelationDetail.expressMoney}}</span>
        </p>
        <p v-show=' data.orderGoodsRelationDetail.deductionMoney != 0 '>
          <span>优惠金额</span>
          <span>¥{{ data.orderGoodsRelationDetail.deductionMoney }}</span>
        </p>
        <p>
          <span>订单总价</span>
          <span>¥{{ data.orderGoodsRelationDetail.money + data.orderGoodsRelationDetail.expressMoney }}</span>
        </p>
      </div>

    </div>

    <div class="orderInformation">
      <p>快递公司：{{goods.expressName}}</p>
      <p id="orderNumber_p" style="height: 0.2rem;">订单编号：
        <input readonly type="text" :value="goods.orderNumber" id="copy_content"> 
        <span data-clipboard-target="#copy_content" id="copy_btn" @click='copyOrderNumber()' style="width: 0.28rem;
    height: 0.12rem;
    line-height: 0.12rem;
    text-align: center;
    font-size: 0.08rem;
    border: 1px solid #999999;
    color: #999999;">
          复制<img src="/static/images/copyImg.png" alt="copyImg">
        </span>
      </p>
      <p>运单编号：{{goods.expressNumber}}</p>
      <p>支付时间：{{data.payDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
      <p>发货时间：{{goods.deliveredDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
      <p>收货时间：{{goods.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
    </div>
 -->

     <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
  </div>

</template>

<script>

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'appraiseWait',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        data:{"orderGoodsRelationDetail":{"money":0}},
        goods:{},
        relationId:null,
        orderNumber:null,
        orderStatus:null,
        afterSaleStatus:null
      }
    },
    mounted(){
      let orderNumber = this.getParam('orderNumber');
      this.afterSaleStatus = this.getParam('afterSaleStatus');
      console.log(this.afterSaleStatus)
      //console.log(typeof(this.afterSaleStatus))
      this.orderNumber = orderNumber;
      this.loadOrderDetail(orderNumber);
    },
    methods:{
      reload() {
        this.loadFailed = false;
        let orderNumber = this.getParam('orderNumber');
        this.loadOrderDetail(orderNumber);
      },
      loadOrderDetail(orderNumber){
        this.http.get(this).url('/app/api/order/detail/:orderNumber').restful({orderNumber:orderNumber}).request((req)=>{
          this.firstLoad = false;
            if (req.data.code != 0) {
                return;
            }
             console.log(req);
             var data = req.data.data;
             this.data = data;
             this.goods = data.orderGoodsRelationDetail;
             this.relationId = data.orderGoodsRelationDetail.relationId;
          },(err)=>{
            this.firstLoad = false;
            this.loadFailed =true;
            console.log(err)
         })
      },
      copyOrderNumber(){
          var clipboard  = new Clipboard('#copy_btn');
          clipboard.on('success', (e)=> {
              this.showMessage('订单号复制成功')
              e.clearSelection();
              clipboard.destroy();
          });
          clipboard.on('error', (e)=> {
              this.showError('订单号复制失败,请手动复制')
             clipboard.destroy();
          });
      },
      copyOrderNumber1() {
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
      tocustomerService(){
         this.goToRobot({'customField1':this.getParam('orderNumber'),'customField2':this.goods.title,'customField4':this.goods.goodsNumber});
      },
      goAfterSaleInformation(e) {
        console.log(e)
        this.keep.go("/afterSale_information.html", false, {
          relationId: this.relationId,
          orderNumber: this.orderNumber
        });
      },
      goPublish(){
        this.keep.go("/publish_commentaries.html", false ,{orderGoodsId:this.relationId,goodsId:this.goods.goodsId});
      },
      goCommentContent(){
          this.keep.go('/comment_content.html',false,{relationId:this.relationId})
      },
      customerService(){
        this.keep.go("/return_goods.html", false , {relationId:this.relationId,orderNumber:this.orderNumber});
      },
      goDetal(e){
        if (this.orderStatus == 3) {
           this.keep.go('/goods_detail.html', true, {goodsid: this.data.orderGoodsRelationDetail.goodsId,showGoHome:'1'});
        }
      }
    },
    created() {
      var orderStatus = this.getParam('orderStatus');
      this.orderStatus = orderStatus;
      if(orderStatus == 1){
        document.title = "订单详情";
      }else if(orderStatus == 0){
        document.title = "订单详情";
      }else{
        document.title = "订单详情";
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/appraiseWait.scss';
</style>