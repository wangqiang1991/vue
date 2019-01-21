<template>
  <div class="createPost-container" style="padding:20px;" id="findOrder_vue">

    <div class="filter-container" style="padding-bottom: 0px !important;">
      <el-input @keyup.enter.native="doSearch()" v-model="orderNumber" style="width: 500px;" class="filter-item"
                placeholder="订单编号（主订单号、子订单号、售后换货新订单号）"></el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 10px;" type="primary" v-waves icon="search">
        查询
      </el-button>
    </div>

    <p style="font-size: 14px;color: #6B7170;margin-top: 5px;">温馨提示：订单全局查询可能耗时较长，查询的时候请耐心等待...</p>

    <el-table v-show="masterOrderList.length > 0" :data="masterOrderList" border fit highlight-current-row style="width: 100%">
      <el-table-column label="订单类型">
        <template scope="scope">
          <span>正常售卖主订单</span>
        </template>
      </el-table-column>

      <el-table-column label="主订单号">
        <template scope="scope">
          <span>{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单商品金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.settlementMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单运费金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单合计金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.settlementMoney + scope.row.expressMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态">
        <template scope="scope">
          <span>{{scope.row.orderStatusText}}</span>
        </template>
      </el-table-column>
    </el-table>


    <el-table v-show="subOrderList.length > 0" :data="subOrderList" border fit highlight-current-row style="width: 100%">
      <el-table-column label="订单类型">
        <template scope="scope">
          <span>正常售卖子订单</span>
        </template>
      </el-table-column>

      <el-table-column label="主订单号">
        <template scope="scope">
          <span>{{scope.row.goodsOrder.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="子订单号">
        <template scope="scope">
          <span>{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单商品金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.money}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单运费金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单合计金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.money + scope.row.expressMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态">
        <template scope="scope">
          <span>{{scope.row.orderStatusText}}</span>
        </template>
      </el-table-column>
    </el-table>


    <el-table v-show="afterSaleOrderList.length > 0" :data="afterSaleOrderList" border fit highlight-current-row style="width: 100%">
      <el-table-column label="订单类型">
        <template scope="scope">
          <span>售后换货新订单</span>
        </template>
      </el-table-column>

      <el-table-column label="原始主订单号">
        <template scope="scope">
          <span>{{scope.row.sourceOrderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="原始子订单号">
        <template scope="scope">
          <span>{{scope.row.sourceOrderGoodsNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="售后换货新订单号">
        <template scope="scope">
          <span>{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单商品金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.settlementMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单运费金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单合计金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.settlementMoney + scope.row.expressMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态">
        <template scope="scope">
          <span>{{scope.row.orderStatusText}}</span>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'

  export default {
    data() {
      return {
        orderNumber: '',
        masterOrderList: [],    // 主订单
        subOrderList: [],       // 子订单
        afterSaleOrderList: [] // 售后订单
      }
    },
    methods: {
      doSearch() {
        if (!this.orderNumber || !this.orderNumber.trim()) {
          this.$message({type: 'warning', message: '请输入你要查询的订单编号！'});
          return;
        }
        this.findOrder();
      },

      findOrder() {
        // 加载菊花转起来
        var loadingInstance = Loading.service({text: '订单查询中...'});
        this.http.get(this).url(config.order.order_global_search).restful({orderNumber: this.orderNumber}).request(function (response) {
          loadingInstance.close();
          this.masterOrderList = [];
          this.subOrderList = [];
          this.afterSaleOrderList = [];

          if (response.data.code == 0) {
            let data = response.data.data;
            if (data.detail) {
              // 判断订单类型
              if (data.type == 1) {
                data.detail.orderStatusText = this.getMainOrderStatusText(data.detail);
                this.masterOrderList.push(data.detail);
              } else if (data.type == 2) {
                data.detail.orderStatusText = this.getSubOrderStatusText(data.detail);
                this.subOrderList.push(data.detail);
              } else if (data.type == 3) {
                data.detail.orderStatusText = this.getAfterSaleOrderStatus(data.detail.orderStatus);
                this.afterSaleOrderList.push(data.detail);
              }
              console.log(data)



            } else {
              this.$message({type: 'warning', message: '系统未查询到你要找的订单！'});
            }
          } else {
            this.$message.error(response.data.message ? response.data.message : "服务器繁忙，请稍后再试");

          }
        }, function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        })

      },

      /**
       * 获取主订单状态
       **/
      getMainOrderStatusText(detail) {
        let orderStatus = detail.orderStatus;
        if (orderStatus == 0) {
          return "待确认";
        } else if (orderStatus == 1) {
          return "待付款";
        } else if (orderStatus == 2) {
          if (detail.transactionAbort) {
            return "已关闭";
          } else {
            return "待发货";  
          }
        } else if (orderStatus == 3) {
          return "待收货";
        } else if (orderStatus == 4) {
          return "已取消";
        } else if (orderStatus == 5) {
          return "已完成";
        }
      },

      /**
       *  获取子订单状态
       **/
      getSubOrderStatusText(detail) {
        let orderStatus = detail.orderStatus;

        if (detail.applyStatus && detail.afterSaleType) {

          if (detail.afterSaleType == 1 && detail.applyStatus == 1) {
            
            return "售后退款-未受理";
            
          }
          if (detail.afterSaleType == 1 && detail.applyStatus == 2) {
            
           return "售后退款-拒绝受理";
            
          }
          if (detail.afterSaleType == 1 && detail.applyStatus == 3) {
            
            return "售后退款-退款中";
            
          }
          if (detail.afterSaleType == 1 && detail.applyStatus == 4) {
            
            return "售后退款-退款成功";
            
          }
          if (detail.afterSaleType == 1 && detail.applyStatus == 5) {
            
            return "售后退款-退款失败";
            
          }
          if (detail.afterSaleType == 1 && detail.applyStatus == 6) {
            
            return "售后退款-财务待退款";
          }


          if (detail.afterSaleType == 2 && detail.applyStatus == 1) {
            
            return "售后换货-未受理";
          }
          if (detail.afterSaleType == 2 && detail.applyStatus == 2) {
            
            return "售后换货-拒绝受理";
          }
          if (detail.afterSaleType== 2 && detail.applyStatus == 3) {
            
            return "售后换货-平台待收货";
          }
          if (detail.afterSaleType == 2 && detail.applyStatus == 4) {
            
            return "售后换货-拒绝换货";
          }
          if (detail.afterSaleType == 2 && detail.applyStatus == 5) {
            
            return "售后换货-平台待发货";
          }
          if (detail.afterSaleType == 2 && detail.applyStatus == 6) {
            
            return "售后换货-用户待收货";
          }
          if (detail.afterSaleType == 2 && detail.applyStatus == 7) {
            
            return "售后换货-用户确认收货";
          }


          if (detail.afterSaleType == 3 && detail.applyStatus == 1) {
            
            return "售后退货-未受理";
          }
          if (detail.afterSaleType == 3 && detail.applyStatus == 2) {
            
            return "售后退货-拒绝受理";
          }
          if (detail.afterSaleType == 3 && detail.applyStatus == 3) {
            
            return "售后退货-平台待收货";
          }
          if (detail.afterSaleType == 3 && detail.applyStatus == 4) {
            
            return "售后退货-拒绝退款";
          }
          if (detail.afterSaleType == 3 && detail.applyStatus == 5) {
            
            return "售后退货-财务待退款";
          }
          if (detail.afterSaleType == 3 && detail.applyStatus == 6) {
            
            return "售后退货-退款中";
          }
          if (detail.afterSaleType == 3 && detail.applyStatus == 7) {
            
            return "售后退货-退款成功";
          }
          if (detail.afterSaleType == 3 && detail.applyStatus == 8) {
            
            return "售后退货-退款失败";
          }

        } else {
          if (orderStatus == 0) {
            return "待确认";
          } else if (orderStatus == 1) {
            return "待付款";
          } else if (orderStatus == 2) {
            return "待发货";
          } else if (orderStatus == 3) {
            return "待收货";
          } else if (orderStatus == 4) {
            return "已失效";
          } else if (orderStatus == 5) {
            return "已完成";
          }
        }
      },
      /*获取新订单状态*/
      getAfterSaleOrderStatus(orderStatus) {
        if (orderStatus == 0) {
          return "待确认";
        } else if (orderStatus == 1) {
          return "待付款";
        } else if (orderStatus == 2) {
          return "售后换货待发货";
        } else if (orderStatus == 3) {
          return "售后换货待收货";
        } else if (orderStatus == 4) {
          return "已失效";
        } else if (orderStatus == 5) {
          return "售后换货已完成";
        }
      },



      setStatus() {
        if (!this.afterSaleWorkOrder.workType) {

          if (this.order.orderStatus == 2 && this.goodsOrder.orderType != 4) {
            this.status = '02';
            this.orderTypeTitle = "待发货订单";
          }
          if (this.order.orderStatus == 2 && this.goodsOrder.orderType == 4) {
            this.status = '42';
            this.orderTypeTitle = "待发货(换货)";
          }

          if (this.order.orderStatus == 3 && this.goodsOrder.orderType != 4) {
            this.status = '03';
            this.orderTypeTitle = "待收货订单";
          }
          if (this.order.orderStatus == 3 && this.goodsOrder.orderType == 4) {
            this.status = '43';
            this.orderTypeTitle = "待收货(换货)";
          }

          if (this.order.orderStatus == 5 && this.goodsOrder.orderType != 4) {
            this.status = '05';
            this.orderTypeTitle = "已完成订单";
          }
          if (this.order.orderStatus == 5 && this.goodsOrder.orderType == 4) {
            this.status = '45';
            this.orderTypeTitle = "已完成(换货)";
          }

        } else {

          if (this.afterSaleWorkOrder.workType == 1 && this.afterSaleWorkOrder.applyStatus == 1) {
            this.status = '11';
            this.orderTypeTitle = "售后退款-未受理";
            this.stepActive = 1;
          }
          if (this.afterSaleWorkOrder.workType == 1 && this.afterSaleWorkOrder.applyStatus == 2) {
            this.status = '12';
            this.orderTypeTitle = "售后退款-已拒绝";
            this.stepActive = 2;
          }
          if (this.afterSaleWorkOrder.workType == 1 && this.afterSaleWorkOrder.applyStatus == 3) {
            this.status = '13';
            this.orderTypeTitle = "售后退款-退款中";
            this.stepActive = 2;
          }
          if (this.afterSaleWorkOrder.workType == 1 && this.afterSaleWorkOrder.applyStatus == 4) {
            this.status = '14';
            this.orderTypeTitle = "售后退款-退款成功";
            this.stepActive = 3;
          }
          if (this.afterSaleWorkOrder.workType == 1 && this.afterSaleWorkOrder.applyStatus == 5) {
            this.status = '15';
            this.orderTypeTitle = "售后退款-退款失败";
            this.stepActive = 3;
          }
          if (this.afterSaleWorkOrder.workType == 1 && this.afterSaleWorkOrder.applyStatus == 6) {
            this.status = '16';
            this.orderTypeTitle = "售后退款-平台待退款";
          }


          if (this.afterSaleWorkOrder.workType == 2 && this.afterSaleWorkOrder.applyStatus == 1) {
            this.status = '21';
            this.orderTypeTitle = "售后换货-未受理";
          }
          if (this.afterSaleWorkOrder.workType == 2 && this.afterSaleWorkOrder.applyStatus == 2) {
            this.status = '22';
            this.orderTypeTitle = "售后换货-已拒绝";
          }
          if (this.afterSaleWorkOrder.workType == 2 && this.afterSaleWorkOrder.applyStatus == 3) {
            this.status = '23';
            this.orderTypeTitle = "售后换货-商家待收货";
          }
          if (this.afterSaleWorkOrder.workType == 2 && this.afterSaleWorkOrder.applyStatus == 4) {
            this.status = '24';
            this.orderTypeTitle = "售后换货-拒绝换货";
          }
          if (this.afterSaleWorkOrder.workType == 2 && this.afterSaleWorkOrder.applyStatus == 5) {
            this.status = '25';
            this.orderTypeTitle = "售后换货-商家确认收货";
          }
          if (this.afterSaleWorkOrder.workType == 2 && this.afterSaleWorkOrder.applyStatus == 6) {
            this.status = '26';
            this.orderTypeTitle = "售后换货-买家待收货";
          }
          if (this.afterSaleWorkOrder.workType == 2 && this.afterSaleWorkOrder.applyStatus == 7) {
            this.status = '27';
            this.orderTypeTitle = "售后换货-买家确认收货";
          }


          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 1) {
            this.status = '31';
            this.orderTypeTitle = "售后退货-未受理";
          }
          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 2) {
            this.status = '32';
            this.orderTypeTitle = "售后退货-已拒绝";
          }
          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 3) {
            this.status = '33';
            this.orderTypeTitle = "售后退货-商家待收货";
          }
          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 4) {
            this.status = '34';
            this.orderTypeTitle = "售后退货-拒绝退款";
          }
          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 5) {
            this.status = '35';
            this.orderTypeTitle = "售后退货-商家确认收货";
          }
          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 6) {
            this.status = '36';
            this.orderTypeTitle = "售后退货-退款中";
          }
          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 7) {
            this.status = '37';
            this.orderTypeTitle = "售后退货-退款成功";
          }
          if (this.afterSaleWorkOrder.workType == 3 && this.afterSaleWorkOrder.applyStatus == 8) {
            this.status = '38';
            this.orderTypeTitle = "售后退货-退款失败";
          }


        }
        this.setSteps()
      },
      setSteps() {
        this.stepData = [];
        this.orderStep = [];
        this.problemOrderStep1 = [];
        this.problemOrderStep2 = [];
        this.problemOrderStep3 = [];
        //换货订单
        if (this.status == '42' || this.status == "43" || this.status == "45") {
          var stepArry = [];
          stepArry.push({title: '商家发货', date: this.goodsOrder.deliveredDate});
          stepArry.push({title: '客户收货', date: this.goodsOrder.completedDate});
          this.findWorkOrder(this.goodsOrder.sourceOrder, this.goodsOrder.sourceWorkId, stepArry);
        }

        //正常订单
        if (this.status == "02" || this.status == "03" || this.status == "05") {
          this.orderStep.push({title: "订单确认", date: this.goodsOrder.confirmDate});
          this.orderStep.push({title: "已支付", date: this.goodsOrder.payDate});
          this.orderStep.push({title: "已发货", date: this.goodsOrder.deliveredDate});
          this.orderStep.push({title: "已完成", date: this.goodsOrder.completedDate});
          if (this.status == "02") {
            this.stepActive = 2;
          } else if (this.status == "03") {
            this.stepActive = 3;
          } else {
            this.stepActive = 4;
          }
        }

        //售后退款
        if (this.afterSaleWorkOrder.workType == 1) {
          this.problemOrderStep1.push({title: '已申请', date: (this.afterSaleWorkOrder.createdAt)});
          this.problemOrderStep1.push({title: '已拒绝', date: (this.afterSaleWorkOrder.rejectDate)});
          this.problemOrderStep1.push({title: '待处理', date: (this.afterSaleWorkOrder.refundingDate)});
          this.problemOrderStep1.push({title: '退款中', date: (this.afterSaleWorkOrder.refundingDate)});
          this.problemOrderStep1.push({title: '退款成功', date: (this.afterSaleWorkOrder.refundDate)});
          this.problemOrderStep1.push({title: '退款失败', date: (this.afterSaleWorkOrder.refundFailureDate)});

          if (this.afterSaleWorkOrder.applyStatus == 1) { //未受理
            this.removeItemFromSteps1("已拒绝");
            this.removeItemFromSteps1("退款失败");
            this.removeItemFromSteps1("退款中");
          } else if (this.afterSaleWorkOrder.applyStatus == 2) {   //被拒绝
            this.removeItemFromSteps1("待处理");
            this.removeItemFromSteps1("退款成功");
            this.removeItemFromSteps1("退款失败");
            this.removeItemFromSteps1("退款中");

          } else if (this.afterSaleWorkOrder.applyStatus == 3) {   //退款中
            this.removeItemFromSteps1("已拒绝");
            this.removeItemFromSteps1("待处理");
            this.removeItemFromSteps1("退款失败");
            this.stepActive = 2;
          } else if (this.afterSaleWorkOrder.applyStatus == 4) {   //退款成功
            this.removeItemFromSteps1("已拒绝");
            this.removeItemFromSteps1("待处理");
            this.removeItemFromSteps1("退款失败");
          } else if (this.afterSaleWorkOrder.applyStatus == 5) {   //退款失败
            this.removeItemFromSteps1("已拒绝");
            this.removeItemFromSteps1("待处理");
            this.removeItemFromSteps1("退款成功");
          } else if (this.afterSaleWorkOrder.applyStatus == 6) {   //执行退款
            this.removeItemFromSteps1("已拒绝");
            this.removeItemFromSteps1("退款失败");
            this.removeItemFromSteps1("退款中");
            this.removeItemFromSteps1("退款成功");
            this.problemOrderStep1.push({title: '退款中'});
            this.problemOrderStep1.push({title: '退款成功'});

            this.stepActive = 2;
          }
        }

        //售后换货
        if (this.afterSaleWorkOrder.workType == 2) {
          this.problemOrderStep2.push({title: '已申请', date: (this.afterSaleWorkOrder.createdAt)});
          this.problemOrderStep2.push({title: '已拒绝', date: (this.afterSaleWorkOrder.rejectDate)});
          this.problemOrderStep2.push({title: '待收货', date: (this.afterSaleWorkOrder.deliveredDate)});
          this.problemOrderStep2.push({title: '拒绝收货', date: (this.afterSaleWorkOrder.deliveryRejectDate)});
          this.problemOrderStep2.push({title: '商家已确认收货', date: (this.afterSaleWorkOrder.deliveryCompleteDate)});
          this.problemOrderStep2.push({title: '客户待收货', date: (this.afterSaleWorkOrder.clientDeliveredDate)});
          this.problemOrderStep2.push({title: '客户已确认收货', date: (this.afterSaleWorkOrder.clientDeliveryCompleteDate)});
          if (this.afterSaleWorkOrder.applyStatus == 1) {
            this.stepActive = 1;
            this.removeItemFromSteps2("已拒绝");
            this.removeItemFromSteps2("拒绝收货");
          } else if (this.afterSaleWorkOrder.applyStatus == 2) {
            this.stepActive = 2;
            this.removeItemFromSteps2("待收货");
            this.removeItemFromSteps2("拒绝收货");
            this.removeItemFromSteps2("商家已确认收货");
            this.removeItemFromSteps2("客户待收货");
            this.removeItemFromSteps2("客户已确认收货");
          } else if (this.afterSaleWorkOrder.applyStatus == 3) {
            this.stepActive = 2;
            this.removeItemFromSteps2("已拒绝");
            this.removeItemFromSteps2("拒绝收货");
          } else if (this.afterSaleWorkOrder.applyStatus == 4) {
            this.stepActive = 3;
            this.removeItemFromSteps2("已拒绝");
            this.removeItemFromSteps2("商家已确认收货");
            this.removeItemFromSteps2("客户待收货");
            this.removeItemFromSteps2("客户已确认收货");
          } else if (this.afterSaleWorkOrder.applyStatus == 5) {
            this.stepActive = 3;
            this.removeItemFromSteps2("已拒绝");
            this.removeItemFromSteps2("拒绝收货");
          } else if (this.afterSaleWorkOrder.applyStatus == 6) {
            this.stepActive = 4;
            this.removeItemFromSteps2("已拒绝");
            this.removeItemFromSteps2("拒绝收货");
          } else if (this.afterSaleWorkOrder.applyStatus == 7) {
            this.stepActive = 5;
            this.removeItemFromSteps2("已拒绝");
            this.removeItemFromSteps2("拒绝收货");
          }
        }

        //售后退货
        if (this.afterSaleWorkOrder.workType == 3) {
          this.problemOrderStep3.push({title: '已申请', date: (this.afterSaleWorkOrder.createdAt)});
          this.problemOrderStep3.push({title: '已拒绝', date: (this.afterSaleWorkOrder.rejectDate)});
          this.problemOrderStep3.push({title: '待收货', date: (this.afterSaleWorkOrder.deliveredDate)});
          this.problemOrderStep3.push({title: '拒绝退款', date: (this.afterSaleWorkOrder.refundRejectDate)});
          this.problemOrderStep3.push({title: '商家已确认收货', date: (this.afterSaleWorkOrder.deliveryCompleteDate)});
          this.problemOrderStep3.push({title: '退款中', date: (this.afterSaleWorkOrder.refundingDate)});
          this.problemOrderStep3.push({title: '退款成功', date: (this.afterSaleWorkOrder.refundDate)});
          this.problemOrderStep3.push({title: '退款失败', date: (this.afterSaleWorkOrder.refundFailureDate)});
          if (this.afterSaleWorkOrder.applyStatus == 1) {
            this.stepActive = 1;
            this.removeItemFromSteps3("已拒绝");
            this.removeItemFromSteps3("拒绝退款");
            this.removeItemFromSteps3("退款失败");
          } else if (this.afterSaleWorkOrder.applyStatus == 2) {
            this.stepActive = 2;
            this.removeItemFromSteps3("待收货");
            this.removeItemFromSteps3("拒绝退款");
            this.removeItemFromSteps3("商家已确认收货");
            this.removeItemFromSteps3("退款中");
            this.removeItemFromSteps3("退款成功");
            this.removeItemFromSteps3("退款失败");
          } else if (this.afterSaleWorkOrder.applyStatus == 3) {
            this.stepActive = 2;
            this.removeItemFromSteps3("已拒绝");
            this.removeItemFromSteps3("拒绝退款");
            this.removeItemFromSteps3("退款失败");
          } else if (this.afterSaleWorkOrder.applyStatus == 4) {
            this.stepActive = 3;
            this.removeItemFromSteps3("已拒绝");
            this.removeItemFromSteps3("商家已确认收货");
            this.removeItemFromSteps3("退款中");
            this.removeItemFromSteps3("退款成功");
            this.removeItemFromSteps3("退款失败");

          } else if (this.afterSaleWorkOrder.applyStatus == 5) {
            this.stepActive = 3;
            this.removeItemFromSteps3("已拒绝");
            this.removeItemFromSteps3("拒绝退款");
            this.removeItemFromSteps3("退款失败");
          } else if (this.afterSaleWorkOrder.applyStatus == 6) {
            this.stepActive = 4;
            this.removeItemFromSteps3("已拒绝");
            this.removeItemFromSteps3("拒绝退款");
            this.removeItemFromSteps3("退款失败");
          } else if (this.afterSaleWorkOrder.applyStatus == 7) {
            this.stepActive = 5;
            this.removeItemFromSteps3("已拒绝");
            this.removeItemFromSteps3("拒绝退款");
            this.removeItemFromSteps3("退款失败");
          } else if (this.afterSaleWorkOrder.applyStatus == 8) {
            this.stepActive = 5;
            this.removeItemFromSteps3("已拒绝");
            this.removeItemFromSteps3("拒绝退款");
            this.removeItemFromSteps3("退款成功");
          }
        }

      },
      removeItemFromSteps1(title) {
        this.problemOrderStep1.forEach((stepItem, index) => {
          if (stepItem.title == title) {
            this.problemOrderStep1.splice(index, 1);
          }
        })
      },
      removeItemFromSteps2(title) {
        this.problemOrderStep2.forEach((stepItem, index) => {
          if (stepItem.title == title) {
            this.problemOrderStep2.splice(index, 1);
          }
        })
      },
      removeItemFromSteps3(title) {
        this.problemOrderStep3.forEach((stepItem, index) => {
          if (stepItem.title == title) {
            this.problemOrderStep3.splice(index, 1);
          }
        })
      },
      /*查询原始订单详情*/
      findOrderdDetail(orderId, workId, stepArry) {
        this.http.get(this).url(config.order.order_detail_url).restful({orderId: orderId}).request(function (response) {
          if (response.data.code == 0) {
            let order = response.data.data;
            stepArry.unshift({title: '客户收货', date: order.completedDate});
            stepArry.unshift({title: '已发货', date: order.deliveredDate});
            stepArry.unshift({title: '已付款', date: order.payDate});
            stepArry.unshift({title: '订单确认', date: order.confirmDate});
            this.stepData = stepArry;
            if (this.status == '42') {
              this.stepActive = 6;
            } else if (this.status == '43') {
              this.stepActive = 7;
            } else if (this.status == '45') {
              this.stepActive = 8;
            }
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      /*查询原始售后详情*/
      findWorkOrder(orderId, workId, stepArry) {
        this.http.get(this).url(config.problemOrder.detail_url).restful({workId: workId}).request(function (response) {
          if (response.data.code == 0) {
            let order = response.data.data;
            stepArry.unshift({title: '商家收货', date: order.deliveryCompleteDate});
            stepArry.unshift({title: '申请换货', date: order.createdAt});
            this.findOrderdDetail(orderId, workId, stepArry);
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      viewImage(imageUrl) {
        window.open(imageUrl, "_blank");
      },
      showExpressSteps(orderPackage) {
        this.orderPackage = orderPackage;
        var loadingInstance = Loading.service({text: '加载物流信息中...'});
        this.http.get(this).url(config.order.order_express_info).restful({
          subOrderId: orderPackage.subOrderId
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.expressStepVisible = true;
            this.expressInfoArray = response.data.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
      findChangeGoodsMessage() {
        this.http.get(this).url(config.order.chang_goods_message).restful({workId: this.afterSaleWorkOrder.workOrderId}).request(function (response) {
          if (response.data.code == 0) {
            this.changeGoodsDatas = response.data.data;
            this.changeGoodsVisible = true;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
    }

  }

</script>


<style rel="stylesheet/scss" lang="scss">
  #findOrder_vue {

  .el-col {
    margin-top: 15px;
  }

  .orderStepContainer {
    border: solid 1px #f2f2f2;
    padding: 18px;
    margin-top: 20px;
  }

  .orderStep {
    display: block;
    margin: auto;
    width: 100%;
  }

  .orderInfo {
    padding: 18px;
    margin-top: 10px;
    border: solid 1px #f2f2f2;
  }

  .expressSteps .el-step__title {
    margin-top: -10px !important;
    color: black !important;
  }

  .expressSteps .el-step__description {
    color: #3e3e42 !important;
  }

  .orderExpress {

  > div {
    height: auto;

  > div {
    width: 80%;
    height: auto !important;
    padding-bottom: 16px;
  }

  }
  .el-step__main {
    width: 90%;
  }

  }
  }
</style>
