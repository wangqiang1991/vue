import vue from 'vue'
import router from './router'
import http from '@/utils/http'
import config from '@/commons/config'
import { Message } from 'element-ui'

router.afterEach((transition) => {

 if (transition.path == '/login') {

 } else if (transition.path == '/home') {
  setTimeout(()=>{
    setTip();  
  },300)
 } else {
  setTip();
 }

})


function setTip() {
  http.get(vue).url(config.tip.toDo).request(function(response) {
    if (response.data.code != 0) {
      Message({
        message: response.data.message,
        type: 'error'
      });
      return;
    }
    setData(response.data.data);
    }, function(err) { console.log(err)}
  );
}


//改变提示数字
function setData(data) {
  for(var i = 0; i < $("#goochaoSidebar span").length; i++){
    let url =  $("#goochaoSidebar span").eq(i).attr('uid');


     //商品仓储管理
    if (url == '/wareHouse') {  
      if ( data.purchaseApplyCount + data.purchasePutInCount + data.saleOutputCount + data.exchageOutoutCount  ) {
        $("#goochaoSidebar span").eq(i).addClass('showSidebarTip');
      } else {
        $("#goochaoSidebar span").eq(i).removeClass('showSidebarTip');
      }
    } else if (url == '/wareHouse/storageGoods') { //商品仓储

      if ( data.purchaseApplyCount ) {
        $("#goochaoSidebar span").eq(i).text(data.purchaseApplyCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }      

    }  else if (url == '/wareHouse/procurementItem') { //商品采购项

      if ( data.purchasePutInCount ) {
        $("#goochaoSidebar span").eq(i).text(data.purchasePutInCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }      

    } else if (url == '/wareHouse/orderOutPut') { //商品销售出库

      if ( data.saleOutputCount ) {
        $("#goochaoSidebar span").eq(i).text(data.saleOutputCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }      

    }  else if (url == '/wareHouse/orderExchangeOutPut') { //商品换货出库

      if ( data.exchageOutoutCount ) {
        $("#goochaoSidebar span").eq(i).text(data.exchageOutoutCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }      

    }       



     //商品采购管理
    if (url == '/storageRegion') {  
      if (data.waitAuditCount + data.purchaseAcceptCount) {
        $("#goochaoSidebar span").eq(i).addClass('showSidebarTip');
      } else {
        $("#goochaoSidebar span").eq(i).removeClass('showSidebarTip');
      }
    } else if (url == '/storageRegion/index') { //商品采购工单

      if ( data.purchaseAcceptCount ) {
        $("#goochaoSidebar span").eq(i).text(data.purchaseAcceptCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }      

    }  else if (url == '/storageRegion/financialAudit') { //财务审核工单

      if ( data.waitAuditCount ) {
        $("#goochaoSidebar span").eq(i).text(data.waitAuditCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }      

    }


     //订单管理
    if (url == '/order') {  
      if (data.refundCount + data.exchageCount + data.refundExchageCount + data.waitDeliverCount + data.waitReceivingCount + data.waitRefundCount) {
        $("#goochaoSidebar span").eq(i).addClass('showSidebarTip');
      } else {
        $("#goochaoSidebar span").eq(i).removeClass('showSidebarTip');
      }
    } else if (url == '/order/pending') { //待发货订单

      if ( data.waitDeliverCount ) {
        $("#goochaoSidebar span").eq(i).text(data.waitDeliverCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }      

    } else if (url == '/order/refund') { //售后退款
      if ( data.refundCount ) {
        $("#goochaoSidebar span").eq(i).text(data.refundCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }       
    }  else if (url == '/order/exchangeGoods') { //售后换货
      if ( data.exchageCount ) {
        $("#goochaoSidebar span").eq(i).text(data.exchageCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }       
    }  else if (url == '/order/returnGoods') { //售后退货
      if ( data.refundExchageCount ) {
        $("#goochaoSidebar span").eq(i).text(data.refundExchageCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }       
    }  else if (url == '/order/merchantReceipt') { //平台待发货
      if ( data.waitReceivingCount ) {
        $("#goochaoSidebar span").eq(i).text(data.waitReceivingCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }       
    } else if (url == '/order/waitingRefund') { //平台待退款
      if ( data.waitRefundCount ) {
        $("#goochaoSidebar span").eq(i).text(data.waitRefundCount).addClass('showTipNumber');
      } else {
        $("#goochaoSidebar span").eq(i).text(' ').removeClass('showTipNumber');
      }       
    }





  }
}
