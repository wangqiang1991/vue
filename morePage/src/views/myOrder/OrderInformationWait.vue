<template>
  <div id="orderInformationWait_Vue">
    <div class="waitAppraise">
      <div class="waitAppraiseContent">
        <p style="font-size:0.18rem;color:#fff;font-weight:700;" v-show="data.orderType != 4">等待发货</p>
        <p style="font-size:0.18rem;color:#fff;font-weight:700;" v-show="data.orderType == 4">等待发货(换货)</p>
         <!-- <p>订单将在付款后48小时内发出</p>  -->
         <p>如有疑问请联系客服</p>
      </div>
      <p class="sureBtn"  v-show="data.orderType != 4"  @click="applyRefund">申请退款</p>
      <!--<p class="sureBtn" v-show='afterSaleStatus == 1' @click='goAfterSaleInformation(n)'>售后详情</p>
      <p class="sureBtn" v-show='afterSaleStatus == 2' @click='goAfterSaleInformation(n)'>售后详情</p>-->
      <p class="sureBtn" :style="{'right':(data.orderType != 4) ? '0.98rem' : '0.16rem' }" @click="tocustomerService">联系客服</p>
    </div>
   <!--  <div class="consigneeInformation">
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
      <div class="goods_message">
        <div class="goods_box"  @click="goDetal(n)">
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

<!--     <div class="parcel">
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
 -->

<!-- 
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

    </div> -->

<!--     <div class="orderInformation">
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
      <p>支付时间：{{data.payDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
    </div> -->

  
    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  export default {
    name: 'orderInformationWait',
    created (){
      document.title="订单详情"
    },
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
        afterSaleStatus:null,
        first:true,
        saleMonry:0
      }
    },
    mounted(){
    let orderNumber = this.getParam('orderNumber');
     this.loadOrderDetail(orderNumber);
    },
    methods:{
      reload(){
      let orderNumber = this.getParam('orderNumber');
     this.loadOrderDetail(orderNumber);
     this.loadFailed = false;
      },
      loadOrderDetail(orderNumber) {
         this.http.get(this).url('/app/api/order/detail/:orderNumber').restful({orderNumber:orderNumber}).request((req)=>{
          this.firstLoad = false;
            if (req.data.code != 0) {
                return;
            }
             console.log(req);
             var data = req.data.data;
             this.afterSaleStatus = data.orderGoodsRelationDetail.afterSaleStatus;
             this.data = data;
             this.goods = data.orderGoodsRelationDetail;
             this.relationId = data.orderGoodsRelationDetail.relationId;
          },(err)=>{
            this.firstLoad = false;
            this.loadFailed = true;
            console.log(err)
         })
      },
      tocustomerService(){
        this.goToRobot({'customField1':this.getParam('orderNumber')});
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
      goDetal(e){
        console.log(this)  
        this.keep.go('/goods_detail.html', true, {goodsid: this.goods.goodsId,showGoHome:'1'});
      },
//    goAfterSaleInformation(e) {
//      console.log(e)
//      this.keep.go("afterSale_information.html", false, {
//        relationId: this.data.orderGoodsRelationDetail.relationId,
//        orderNumber: this.data.orderGoodsRelationDetail.orderNumber
//      });
//    },
      
      applyRefund(){
        console.log(this)
        this.keep.go('/return_goods.html', true, {
          orderNumber: this.goods.orderNumber,
          relationId: this.relationId,
          orderStatus: this.goods.orderStatus
        });
//      console.log(this.relationId)
//      this.$messagebox.confirm('订单已经生成,是否确认退款？').then((action)=> {
//       this.$indicator.open({
//          spinnerType: 'fading-circle'
//        });
//      this.http.postJson(this).url("/app/api/work/apply").params({
//        workType: 1,relationId:this.relationId
//      }).request( (response)=> {
//
//        this.$indicator.close();
//        //this.$messagebox.alert('退款申请提交成功').then(action => {});
//        this.showMessage('退款申请提交成功')
//        this.afterSaleStatus = 1;
//        console.log(response)
//      },(err)=>{
//         this.$indicator.close();
//         console.log(err)
//      },(req)=>{
//        this.$indicator.close();
//         console.log(req)
//      })
//     }).catch( (err)=> {
//        console.log('取消订单',err)
//        return ;
//      });

      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/orderInformationWait.scss';
</style>