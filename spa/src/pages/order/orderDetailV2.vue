<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <el-button @click="cancel">返 回</el-button>
      </sticky>
      <div class="createPost-main-container">

        <!-- 头部流程图 -->
        <el-row>
          <el-col class="orderStepContainer" span="24" style=" border:1px solid  #f2f2f2;padding:18px;margin-top: 20px;">
            
            <!-- 正常流程图 -->
            <el-steps v-if="(status == 1 && order.orderListType == 1) || status == 2" class="orderStep" span="22" :active="orderStepActive" center="true" style="display: block; margin:auto;width:100%;">
              <el-step title="订单确认" :description="order.confirmDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
              <el-step title="订单支付" :description="order.payDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
              <el-step title="订单发货" :description="order.deliveredDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
              <el-step title="订单完成" :description="order.completedDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
            </el-steps>

            <!-- 取消订单流程图 -->
            <el-steps v-if="status == 1 && order.orderListType == 4" class="orderStep" span="22" :active="3" center="true" style="display: block; margin:auto;width:100%;">
              <el-step title="订单确认" :description="order.confirmDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
              <el-step title="订单取消" :description="order.invalidDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
            </el-steps>    
            
            <!-- 订单关闭流程图 -->
            <el-steps v-if="status == 1 && order.orderListType == 6" class="orderStep" span="22" :active="3" center="true" style="display: block; margin:auto;width:100%;">
              <el-step title="订单确认" :description="order.confirmDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
              <el-step title="订单支付" :description="order.payDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
              <el-step title="交易关闭" :description="order.cancelDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
            </el-steps>            
             
             <!-- 换货流程图 --> 
            <el-steps v-if="status == 3" class="orderStep" span="22" :active="stepActive" center="true" style="display: block; margin:auto;width:100%;">
              <el-step :key="step" v-for="step in steps" :title="step.title" :description="step.date"></el-step>
            </el-steps>

          </el-col>
        </el-row>

        <!-- 正常流程订单金额基本信息 -->
        <el-row class="orderInfo order_message" v-if='status == 1 || status == 2'>
          <el-col span="8">
            <div>
              <span>订单编号:</span>
              <span style="color:#337ab7;">{{order.orderNumber}}</span>
            </div>
          </el-col>

          <el-col span="8">
            <div>
              <span>下单时间:</span>
              <span>{{order.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </div>
          </el-col>

          <el-col span="8">
            <div>
              <span>支付方式:</span>
              <span v-if="!order.orderType">未支付</span>
              <span v-else-if="order.orderType == 1">贷款支付</span>
              <span v-else-if="order.orderType == 2">微信支付</span>
              <span v-else-if="order.orderType == 3">支付宝</span>
              <span v-else-if="order.orderType == 4">售后换货</span>
              <span v-else-if="order.orderType == 5">APP微信支付</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单商品原总金额:</span>
              <span style="color: #FF9800;">￥{{order.totalMoney}}</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单原总运费:</span>
              <span style="color: #FF9800;">￥{{order.expressTotalMoney}}</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单原总金额:</span>
              <span style="color: #FF9800;">￥{{((order.totalMoney + order.expressTotalMoney).toFixed(2) + "").replace(".00", "")}}</span>
            </div>
          </el-col>


          <el-col :span="8" style="margin-top: 15px;">
            <div>
              <span>订单商品实际金额:</span>
              <span style="color: #FF9800;">￥{{order.settlementMoney}}</span>

              <el-button class="el-icon-time"  @click="findMoneyChange('1')" size="small"  type="primary" v-waves>查看改价记录</el-button>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单实际运费:</span>
              <span style="color: #FF9800;">￥{{order.expressMoney}}</span>

              <el-button class="el-icon-time"  @click="findMoneyChange('2')" size="small"  type="primary" v-waves>查看改价记录</el-button>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单实际支付金额:</span>
              <span style="color: #FF9800;">￥{{((order.settlementMoney + order.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>

              <el-button class="el-icon-upload" v-if="order.orderListType == 1" @click="syncPayment()" size="small"  type="primary" v-waves> 同步付款信息</el-button>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单优惠券:</span>
              <span v-if="order.couponVo">{{order.couponVo.name}}</span>
              <span v-else>无</span>
            </div>
          </el-col>

           <el-col span="16" style="margin-top: 15px;">
            <div>
              <span>订单优惠金额:</span>
              <span style="color: #FF9800;">￥{{(( (order.totalMoney + order.expressTotalMoney) - (order.settlementMoney + order.expressMoney) ).toFixed(2) + "").replace(".00", "")}}</span>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>收货人:</span>
              <span>{{order.reallyName}}&nbsp;&nbsp;&nbsp;({{order.phone}})&nbsp;&nbsp;&nbsp;{{order.address}}</span>

              <el-button v-if="order.orderListType == 1 || order.orderListType == 2" @click="toEditAddress()" size="small" style="margin-left: 12px;" type="primary" v-waves icon="edit">编辑收货人地址</el-button>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>买家留言:</span>
              <span v-if="order.message">{{order.message}}</span>
              <span v-else>无</span>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;height:auto;word-break:break-all;" >
            <div>
              <span>平台备注:</span>
              <span v-if="order.remark">{{order.remark}}</span>
              <span v-else>无</span>

              <el-button v-if='order.orderListType == 2 || order.orderListType == 3 || order.orderListType == 1' @click="toEditRemark()" size="small" style="margin-left: 12px;" type="primary" v-waves icon="edit">编辑备注</el-button>
            </div>
          </el-col>
        </el-row>


        <!-- 换货工单基本信息 -->
        <el-row class="orderInfo order_message" v-if='status == 3'>
          <el-col span="8">
            <div style="height:32px;line-height:32px;">
              <span>原始主订单号:</span>
              <span style="color:#337ab7;">{{order.sourceOrderNumber}}</span> 
              <el-button size="small"  @click='seeOriginDetail' type="primary">订单信息</el-button> 
            </div>
          </el-col>

          <el-col span="8">
             <div style="height:32px;line-height:32px;">
              <span>原始子订单号:</span>
              <span style="color:#337ab7;">{{order.sourceOrderGoodsNumber}}</span>
            </div>
          </el-col>

          <el-col span="8">
            <div style="height:32px;line-height:32px;">
              <span>新订单号:</span>
              <span style="color:#337ab7;">{{order.orderNumber}}</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>售后工单号:</span>
              <span style="color:#337ab7;">{{order.sourceWorkNumber}}</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>售后申请日期:</span>
              <span>{{order.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>支付方式:</span>
              <span v-if="!order.orderType">未支付</span>
              <span v-else-if="order.orderType == 1">贷款支付</span>
              <span v-else-if="order.orderType == 2">微信支付</span>
              <span v-else-if="order.orderType == 3">支付宝</span>
              <span v-else-if="order.orderType == 4">售后换货</span>
              <span v-else-if="order.orderType == 5">APP微信支付</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单商品金额:</span>
              <span style="color: #FF9800;">￥{{order.settlementMoney}}</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单运费金额:</span>
              <span style="color: #FF9800;">￥{{order.expressMoney}}</span>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单合计金额:</span>
              <span style="color: #FF9800;">￥{{((order.settlementMoney + order.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>收货人:</span>
              <span>{{order.reallyName}}&nbsp;&nbsp;&nbsp;({{order.phone}})&nbsp;&nbsp;&nbsp;{{order.address}}</span>

              <el-button v-if="order.orderListType == 2" @click="toEditAddress()" size="small" style="margin-left: 12px;" type="primary" v-waves icon="edit">编辑收货人地址</el-button>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>申请换货原因:</span>
              <span>{{workSourceOrder.refundReason}}( {{workSourceOrder.remark}} )</span>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;height:auto;" v-if=' workSourceOrder.imageArray.length'>
            <div>
              <div v-for="image in workSourceOrder.imageArray" class="el-upload el-upload--picture-card" style="margin-right:10px;">
                <img @click="viewImage(image)" style="width:100%; height:100%" :src="image+config.imgtmb._200">
              </div>
            </div>
          </el-col>
        </el-row>


      
        <!-- 待付款商品列表 -->
        <h2 style="margin:16px 0;" v-if="status == 1">
          <p v-if="order.orderListType == 1">待付款订单商品</p>
          <p v-else>订单商品列表</p>
        </h2>

        <el-table v-if="status == 1"  :data="order.orderGoodsRelations" border style="width: 100%;margin-top: 10px;!important;" >

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品名称">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品编码">
            <template scope="scope">
              <span>{{scope.row.goodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU名称" >
            <template scope="scope">
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span>{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="子订单号" v-if="order.orderListType == 6">
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="商品单价" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.stylePrice}}</span>
            </template>
          </el-table-column>

           <el-table-column prop="name" :label="order.orderListType == 1 ? '下单数量': '数量' " >
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="商品原总金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.stylePrice * scope.row.amount).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品实际支付金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.money}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="运费">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="合计金额">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{ ((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="退款金额"  v-if="order.orderListType == 6">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{ scope.row.refundMoney }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="退款原因(备注)"  v-if="order.orderListType == 6">
            <template scope="scope">
              <span >{{scope.row.refundReason}}({{scope.row.remark}})</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作"  v-if="order.orderListType == 1" width="240">
            <template scope="scope">

              <el-button :disabled='disabledEditMoney'  @click="toEditGoodsMoney(scope.row)" size="small"  type="primary" v-waves >修改商品金额</el-button>
              <el-button :disabled='disabledEditExpress'  @click="toEditExpress(scope.row)" size="small" style="margin-left: 8px;" type="primary" v-waves >修改运费金额</el-button>

            </template>

          </el-table-column>
        </el-table>

        <!-- 正常待收货 待发货 已完成订单 -->
        <el-tabs id='orderGoodsTabs' v-model="goodsRelationsActiveName" v-show="status == 2">

          <el-tab-pane label="待发货商品列表" name="1">
            <tableItem :type="1" ref="orderDoodsData1" @onSelectedOrder='onSelectedOrder'></tableItem>
          </el-tab-pane>

          <el-tab-pane label="待收货商品列表" name="2">
            <tableItem :type="2" ref="orderDoodsData2" @expressDetail='expressDetail' @onEditExpress='onEditExpress'></tableItem>
          </el-tab-pane>

          <el-tab-pane label="已完成商品列表" name="3">
            <tableItem :type="3" ref="orderDoodsData3" @expressDetail='expressDetail' ></tableItem>
          </el-tab-pane>

          <el-tab-pane label="售后退款商品记录" name="4">
            <afterSaleTableItem :type="4" ref="orderDoodsData4"></afterSaleTableItem>
          </el-tab-pane>

          <el-tab-pane label="售后换货商品记录" name="5">
            <afterSaleTableItem :type="5" ref="orderDoodsData5"></afterSaleTableItem>
          </el-tab-pane>

          <el-tab-pane label="售后退货商品记录" name="6">
            <afterSaleTableItem :type="6" ref="orderDoodsData6"></afterSaleTableItem>
          </el-tab-pane>

        </el-tabs>   

      
        <!-- 换货商品列表 -->
        <h2 style="margin:16px 0;" v-if="status == 3">
          售后换货商品
          <el-button  type="primary" v-if='order.orderListType == 2' @click='exChangeSend'>发货</el-button>
        </h2>

        <el-table v-if="status == 3"  :data="order.orderGoodsRelations" border style="width: 100%;margin-top: 10px;!important;" >

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品名称">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品编码">
            <template scope="scope">
              <span>{{scope.row.goodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU名称" >
            <template scope="scope">
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span>{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="子订单号">
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="购买数量" >
            <template scope="scope">
              <span>{{workSourceOrder.detail.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="换货数量" >
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品单价" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.stylePrice}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品原总金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.stylePrice * scope.row.amount).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品实际支付金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.money}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="运费">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="合计金额">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{ ((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>


          <el-table-column align="center" label="操作"  width="110" v-if='order.orderListType == 5 || order.orderListType == 3'>
            <template scope="scope">

              <el-button size="small" style='margin-top:10px;' type="primary" @click='showExpressSteps(scope.row)'>查看物流</el-button>
              <br>
              <el-button style='margin-top:10px;margin-bottom:10px;' size="small" @click='onEditExpress(scope.row)' type="primary" v-if='order.orderListType == 3'>修改物流</el-button>

            </template>

          </el-table-column>


        </el-table>


      </div>
    </el-form>


    <!-- 查看金额修改日志弹出框 -->
    <el-dialog title="改价历史记录" :visible.sync="changeMoneyVisible">
      <el-tabs v-model="changeActiveName">
        <el-tab-pane label="订单商品改价记录" name="1">

          <el-table  :data="moneyChangeRecordData"  border  highlight-current-row style="width: 100%">

           <el-table-column align="center" label="改价类型" >
              <template scope="scope">
                <span style='color:green;'  v-if="scope.row.to > scope.row.from">商品-加价</span>
                <span style='color:red;' v-else-if='scope.row.to < scope.row.from'>商品-减价</span>
                <span v-else>未变动</span>
              </template>
            </el-table-column>
            
           <el-table-column align="center" label="商品名称" >
              <template scope="scope">
                <span> {{scope.row.goodsTitle}}</span>
              </template>
            </el-table-column>       

           <el-table-column align="center" label="SKU名称" >
              <template scope="scope">
                <span> {{scope.row.styleName + '-' + scope.row.styleSubName}}</span>
              </template>
            </el-table-column>       

            <el-table-column align="center" label="修改前原始总金额">
              <template scope="scope">
                <span style="color:#337ab7;">￥{{((scope.row.sourceMoney).toFixed(2) + "").replace(".00", "")}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="修改后实际总金额" >
              <template scope="scope">
                <span style="color:#FF9800;">￥{{((scope.row.to).toFixed(2) + "").replace(".00", "")}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作人" >
              <template scope="scope">
                <span>{{scope.row.systemUserName}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作时间" >
              <template scope="scope">
                <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="改价备注" >
              <template scope="scope">
                <span>{{(scope.row.desc==null) ? "无" : scope.row.desc}}</span>
              </template>
            </el-table-column>

          </el-table>

        </el-tab-pane>
        <el-tab-pane label="订单运费改价记录" name="2">

          <el-table  :data="expressChangeRecordData"  border  highlight-current-row style="width: 100%">

           <el-table-column align="center" label="改价类型" >
              <template scope="scope">
                <span style='color:green;'  v-if="scope.row.to > scope.row.from">运费-加价</span>
                <span style='color:red;' v-else-if='scope.row.to < scope.row.from'>运费-减价</span>
                <span v-else>未变动</span>
              </template>
            </el-table-column>
            
           <el-table-column align="center" label="商品名称" >
              <template scope="scope">
                <span > {{scope.row.goodsTitle}}</span>
              </template>
            </el-table-column>       

           <el-table-column align="center" label="SKU名称" >
              <template scope="scope">
                <span > {{scope.row.styleName + '-' + scope.row.styleSubName}}</span>
              </template>
            </el-table-column>       

            <el-table-column align="center" label="修改前原始运费">
              <template scope="scope">
                <span style="color:#337ab7;">￥{{((scope.row.sourceMoney).toFixed(2) + "").replace(".00", "")}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="修改后实际运费" >
              <template scope="scope">
                <span style="color:#FF9800;">￥{{((scope.row.to).toFixed(2) + "").replace(".00", "")}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作人" >
              <template scope="scope">
                <span>{{scope.row.systemUserName}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作时间" >
              <template scope="scope">
                <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="改价备注" >
              <template scope="scope">
                <span>{{(scope.row.desc==null) ? "无" : scope.row.desc}}</span>
              </template>
            </el-table-column>

          </el-table>

        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="changeMoneyVisible = false">关 闭</el-button>
      </div>
    </el-dialog>


    <!-- 修改运费弹出框 -->
    <el-dialog title="修改订单运费金额" :visible.sync="editExpressVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="订单运费原始金额:">
          <el-input type="number" :disabled='true' style="width:70%;" placeholder='请输入订单运费原始金额' v-model="editExpress.expressTotalMoney"></el-input>
        </el-form-item>

        <el-form-item label="订单运费实际金额:">
          <el-input type="number" style="width:70%;"  placeholder='请输入修改过后的实际运费金额' v-model="editExpressValue"></el-input>
        </el-form-item>

        <el-form-item label="订单运费改价备注:">
          <el-input type="textarea" style="width:70%;"  maxlength='100' :rows="3" v-model="editExpressDesc" placeholder="请输入改价备注"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editExpressVisible = false">取 消</el-button>
        <el-button @click="submitEditExpress" type="primary">确认修改</el-button>
      </div>
    </el-dialog>



    <!-- 修改商品金额弹出框 -->
    <el-dialog title="修改订单商品金额" :visible.sync="editGoodsMoneyVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="订单商品原始金额:">
          <el-input type="number" :disabled='true' style="width:70%;" placeholder='请输入订单商品原始金额' v-model="editMoney.oldMoney"></el-input>
        </el-form-item>

        <el-form-item label="订单商品实际金额:">
          <el-input type="number" style="width:70%;"  placeholder='请输入修改过后的实际商品金额' v-model="editGoodsValue"></el-input>
        </el-form-item>

        <el-form-item label="订单商品改价备注:">
          <el-input type="textarea" style="width:70%;"  maxlength='100' :rows="3" v-model="editGoodsDesc" placeholder="请输入改价备注"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodsMoneyVisible = false">取 消</el-button>
        <el-button @click="submitGoodsEditMoney" type="primary">确认修改</el-button>
      </div>
    </el-dialog>


    <!-- 修改订单收货地址 -->
    <el-dialog title="修改收货信息" :visible.sync="editOrderAddressVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="收货人姓名:">
          <el-input v-model="editAddressUser" style="width:70%;" maxlength='30' placeholder="请输入订单收货人姓名(必填)"></el-input>
        </el-form-item>

        <el-form-item label="收货人电话:">
          <el-input v-model="editAddressPhone" style="width:70%;" maxlength='11' placeholder="请输入订单收货人电话(必填)"></el-input>
        </el-form-item>

        <el-form-item label="收货人地址:">
          <el-input v-model="editAddressValue" style="width:70%;" maxlength='40' placeholder="请输入订单收货人地址(必填)"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderAddressVisible = false">取 消</el-button>
        <el-button @click="submitEditAddress" type="primary">确认修改</el-button>
      </div>
    </el-dialog>


    <!-- 修改订单备注 -->
    <el-dialog title="编辑订单备注" :visible.sync="editOrderRemarkVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="订单平台备注">
          <el-input v-model="editRemarkValue" maxlength="200" type="textarea" :rows="3" style="width:80%;" placeholder="请输入订单平台备注"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderRemarkVisible = false">取 消</el-button>
        <el-button @click="submitEditRemark" type="primary">确认修改</el-button>
      </div>
    </el-dialog>

    <!-- 发货弹出框 -->
    <el-dialog size="tiny" :title="relationId ? '修改物流' : '订单发货'" :visible.sync="deliverGoodsVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>
        
        <el-form-item label="收货人:">
          <span>{{order.reallyName}}</span>
        </el-form-item>

        <el-form-item label="联系电话:">
          <span>{{order.phone}}</span>
        </el-form-item>

        <el-form-item label="收货地址:">
          <span>{{order.address}}</span>
        </el-form-item>

        <el-form-item label="物流公司:">
          <el-select style="width: 300px;" clearable class="filter-item" v-model="expressCompany" placeholder="物流公司">
            <el-option v-for="item in expressCompanies" :key="item.expressId" :label="item.name" :value="item.expressId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="物流单号:">
          <el-input v-model="expressNumber" style="width:300px;" class="filter-item"   placeholder="请准确填写快递单号">
          </el-input>
        </el-form-item>

        <el-form-item label="运费选项:" v-if='order.orderType == 4'>
          <el-select style="width: 300px;" class="filter-item" v-model="assumeType" placeholder="请选择运费选项">
            <el-option v-for="item in expressTypeData" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="实际运费:" v-if='assumeType == 1'>
          <el-input v-model="expressMoney" type="number" style="width:300px;" class="filter-item"   placeholder="请准确填写实际运费">
          </el-input>
        </el-form-item>
        
        <p><span style="color:#FF9800">请准确填写实际运费，如果一个包裹同时发货多件商品，那么运费将根据商品运费权重分摊到每个商品上</span></p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliverGoodsVisible = false">取 消</el-button>
        <el-button v-if="relationId" @click="confirmEditExpress()" type="primary">确 定</el-button>
        <el-button v-else @click="submitDeliverGoods()" type="primary">确认发货</el-button>
      </div>
    </el-dialog>


    <!-- 订单包裹物流信息 -->
    <el-dialog title="物流信息查看" :visible.sync="expressStepVisible" class="express_step_dialog">

      <el-row :gutter="20" style='margin-bottom:30px;'>
        <el-col :span="24" style='color:#333;'>
        快递/物流公司: <span style="margin-right:30px;color:#000">{{orderPackage.expressName}}</span>
        物流单号: <span style="color:#000;">{{orderPackage.expressNumber}}</span>
        </el-col>
      </el-row>

      <div class="expressSteps" style="padding-bottom:30px;">
        <el-row :gutter="20">
          <el-col :span="15">
            <el-input v-model="expressContent" maxlength='100' placeholder="请详细填写物流信息"></el-input>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="expressTime"
              editable=false
              type="datetime"
              placeholder="选择物流时间">
            </el-date-picker>
            <el-button style='margin-left:6px;' type="primary" size="default" @click="addExpress">确认新增</el-button>
          </el-col>
        </el-row>
      </div>

      <el-steps class="expressSteps orderExpress" :space="60" direction="vertical" :active="100" finish-status="success">
        <div v-for="expressInfo in expressInfoArray" style="width:100%;height:auto;overflow:hidden;">
          <el-step :title="expressInfo.ftime" :description="expressInfo.context" style="float:left;"></el-step>
          <el-button type="danger" size="small" style="margin-left:20px;" v-show="expressInfo.trackId" @click="delExpress(expressInfo.trackId)">删除</el-button>
        </div>
      </el-steps>

      <div slot="footer" class="dialog-footer">
        <el-button @click="expressStepVisible = false">关 闭</el-button>
      </div>

    </el-dialog>


    <!-- 原订单信息 -->
    <el-dialog title="原订单信息" :visible.sync="originOrderVisible" class='originOrder_box'>
      <originOrder ref="originOrder"></originOrder>

      <div slot="footer" class="dialog-footer">
        <el-button @click="originOrderVisible = false">关 闭</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import originOrder from '../problemOrder/originOrder.vue'
  import tableItem from "./tableItem.vue"
  import afterSaleTableItem from "./afterSaleTableItem.vue"
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime,searchBtnPermission} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import Sticky from '@/components/Sticky' // 粘性header组件
  export default {
    components: {
      Sticky,
      originOrder:originOrder,
      tableItem:tableItem,
      afterSaleTableItem:afterSaleTableItem
    },
    data() {
      return {
        assumeType:1,
        expressTypeData:[{name:'平台承担',key:1},{name:'用户承担',key:2}],
        originOrderVisible:false,
        workSourceOrder:{ imageArray:[] ,detail:{}},
        status:null, //1待付款 已取消 已关闭  2 待发货 待收货 已完成 3 售后换货
        orderListType:null, 
        orderStepActive:1,
        order: {
          orderListType:null,
          newApplyStatus: null,
          orderType: 4,
          disabledRelations: [],
          orderNumber:''
        },
        steps: [],
        stepActive:null,
        relationId:null,
        changeGoodsVisible:false,
        changeGoodsDatas:[],
        changeMoneyVisible:false,
        changeMoneyData:[],
        editOrderAddressVisible: false,
        editOrderRemarkVisible: false,
        deliverGoodsVisible: false,
        expressStepVisible: false,
        showInputExpress:false,
        editAddressValue: '',
        editAddressUser: '',
        editAddressPhone: '',
        editRemarkValue: '',
        selectedTempGoods: null,
        expressCompanies:[],
        expressCompany:null,
        expressNumber:null,
        expressContent:null,
        expressTime:"",
        expressInfoArray:[],
        orderPackage:{},
        expressMoney:null,
        goodsRelationId:null,
        disabledEditMoney:false, //是否能修改商品金额  code 10000
        disabledEditExpress:false, //是否能修改运费     code 10001
        //修改商品金额
        editMoney:{},             //订单改价
        editGoodsValue: 0,
        editGoodsDesc: "",
        editGoodsMoneyVisible: false,
        //修改运费
        editExpress:{}, 
        editExpressValue: 0,
        editExpressDesc: "",
        editExpressVisible: false,
        /*查询改价记录*/
        changeActiveName:'1',
        moneyChangeRecordData:[],
        expressChangeRecordData:[],
        goodsRelationsActiveName:'1',
        expressDetailData:{},
      }
    },

    mounted() {
      this.loadExpressCompanies();
    },

    methods: {
      cancel() {
        $('.order_tabs>.el-tabs__header').show();
        this.$emit('cancel');
      },
      loadSource(order) {
        console.log(order.orderListType)
        if (order.orderType != 4) { 
          this.orderListType = order.orderListType;
        } else {
          this.orderListType = order.orderStatus;  
        }
        
        this.disabledEditMoney =  searchBtnPermission('10000');
        this.disabledEditExpress =  searchBtnPermission('10001');
        console.log(this.disabledEditMoney,this.disabledEditExpress);

        let orderDoodsData1 = []; //待发货
        let orderDoodsData2 = []; //待收货
        let orderDoodsData3 = []; //已完成
        let orderDoodsData4 = []; //售后退款
        let orderDoodsData5 = []; //售后换货
        let orderDoodsData6 = []; //售后退货
        let afterSaleCount = 0; //判断申请售后子订单数量
        /*筛选分类商品*/
        let goodsRelations = order.orderGoodsRelations;
        let afterSaleWorkOrders = order.afterSaleWorkOrders;
        let cancelDate = 0; //取消时间
        let deliveredDate = 0; //发货时间
        let completedDate = 0; //发货时间

        goodsRelations.forEach(function (relation) {
          if (relation.afterSaleStatus && relation.afterSaleType) {
            afterSaleCount++;
            afterSaleWorkOrders.forEach((item)=>{
              if (item.orderNumber == relation.orderNumber) {
                relation.refundMoney = item.refundMoney;
                relation.refundReason = item.refundReason;
                relation.remark = item.remark;
                if (item.createdAt > cancelDate) {
                  cancelDate = item.createdAt;
                }
              }
            })
          }
          

          if (relation.orderStatus == 2 && !relation.afterSaleStatus && !relation.afterSaleType) {
            orderDoodsData1.push(relation);
          } else if (relation.orderStatus == 3) {
            console.log(relation.deliveredDate)
            if (relation.deliveredDate > deliveredDate) {
              deliveredDate = relation.deliveredDate;
            }
            orderDoodsData2.push(relation);
          } else if (relation.orderStatus == 5) {
            if (relation.receiveDate > completedDate) {
              completedDate = relation.receiveDate;
            }
            orderDoodsData3.push(relation);
          }
          

        });

        order.cancelDate = cancelDate;
       
        if (order.orderListType == 3) {
          order.deliveredDate = deliveredDate;
        }
        if (order.orderListType == 5) {
          order.completedDate = completedDate;
        }

        afterSaleWorkOrders.forEach((item)=>{
          goodsRelations.forEach((originOrder)=>{
            if (item.orderNumber == originOrder.orderNumber) {
              item.cover = originOrder.cover;
              item.title = originOrder.title;
              item.goodsNumber = originOrder.goodsNumber;
              item.styleName = originOrder.styleName;
              item.subName = originOrder.subName;
              item.styleNumber = originOrder.styleNumber;
            }
          })

          if (item.workType == 1) {
            orderDoodsData4.push(item);
          } else if (item.workType == 2) {
            orderDoodsData5.push(item);
          } else if (item.workType == 3) {
            orderDoodsData6.push(item);
          }
        })

        order.orderDoodsData1 = orderDoodsData1;
        order.orderDoodsData2 = orderDoodsData2;
        order.orderDoodsData3 = orderDoodsData3;
        order.orderDoodsData4 = orderDoodsData4;
        order.orderDoodsData5 = orderDoodsData5;
        order.orderDoodsData6 = orderDoodsData6;

        //判断是否全部申请售后
        if (goodsRelations.length == afterSaleCount) {
          order.allAfterSale = true;
        } else {
          order.allAfterSale = false;
        }


        //判断订单状态 正常2 3 5  付款 取消 关闭 1 4 6 换货 orderType = 4 
        if (order.orderType != 4 && ( order.orderListType == 1  || order.orderListType == 4 || order.orderListType == 6))  {
          this.status = 1;
          if (order.orderListType == 1) {
            this.orderStepActive = 1;
          }else if (order.orderListType == 6) {

          }
        }else if(order.orderType != 4 &&  ( order.orderListType == 2  || order.orderListType == 3 || order.orderListType == 5) ){
          this.status = 2;
          setTimeout(()=>{

            if (order.orderListType == 2) {
              this.goodsRelationsActiveName = '1';
              this.orderStepActive = 2;
            } else if (order.orderListType == 3) {
              this.goodsRelationsActiveName = '2';
              this.orderStepActive = 3;
            } else {
              this.goodsRelationsActiveName = '3';
              this.orderStepActive = 4;
            }

            this.$refs.orderDoodsData1.setGoodsData(order);
            this.$refs.orderDoodsData2.setGoodsData(order);
            this.$refs.orderDoodsData3.setGoodsData(order);
            this.$refs.orderDoodsData4.setGoodsData(order);
            this.$refs.orderDoodsData5.setGoodsData(order);
            this.$refs.orderDoodsData6.setGoodsData(order);
          },100)
        }else if(order.orderType == 4){
          this.status = 3;
          this.setSteps(order);
        }

        this.order = order;

      },
      findOrderdDetail(orderId,workId,orderStatus,stepArry) {
        this.http.get(this).url(config.order.order_detail_url).restful({ orderId:orderId}).request(function (response) {
          if (response.data.code == 0) {
              let order = response.data.data;
              stepArry.unshift({title: '订单完成', date: parseTime(order.completedDate)});
              stepArry.unshift({title: '订单发货', date: parseTime(order.deliveredDate)});
              stepArry.unshift({title: '订单付款', date: parseTime(order.payDate)});
              stepArry.unshift({title: '订单确认', date: parseTime(order.confirmDate)});
              this.steps = stepArry;
              //console.log(stepArry)
              if(orderStatus == 2){
                this.stepActive = 6;
              } else if (orderStatus == 3) {
                this.stepActive = 7;
              } else if (orderStatus == 5) {
                this.stepActive = 8;
              }
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          this.$message.error(error);
        });
      },
      findWorkOrder(orderId,workId,orderStatus,stepArry) {
        this.http.get(this).url(config.problemOrder.detail_url).restful({workId:workId}).request(function (response) {
          if (response.data.code == 0) {
             let order = response.data.data;
             if (order.images) {
               order.imageArray = order.images.split(",");
             } else {
               order.imageArray = [];
             }
             this.workSourceOrder = order;
             stepArry.unshift({title: '平台确认收货', date: parseTime(order.deliveryCompleteDate)});
             stepArry.unshift({title: '同意换货申请', date: parseTime(order.deliveredDate)});
             stepArry.unshift({title: '申请售后换货', date: parseTime(order.createdAt)});
              this.steps = stepArry;
              if(orderStatus == 2){
                this.stepActive =3;
              } else if (orderStatus == 3) {
                this.stepActive = 4;
              } else if (orderStatus == 5) {
                this.stepActive = 6;
              }
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          this.$message.error(error);
        });
      },
      setSteps(order) {
       //this.steps = [];
        var stepArry = [];
        stepArry.push({title: '平台发货', date: parseTime(order.deliveredDate)});
        stepArry.push({title: '客户确认收货', date: parseTime(order.completedDate)});
        stepArry.push({title: '已完成', date: parseTime(order.completedDate)});
        this.findWorkOrder(order.sourceOrder,order.sourceWorkOrderId,order.orderListType,stepArry);
      },
      /*修改运费*/
      toEditExpress(data) {
        this.editExpress = data; 
        this.editExpressValue = '';
        this.editExpressDesc =  "";
        this.editExpressVisible = true;
      },
      /*修改运费*/
      submitEditExpress() {
        console.log(+this.editExpressValue)
        if(+this.editExpressValue < 0) {
          this.$message({message: "运费实际金额必须大于0", type: 'warning'});
          return false;
        }

        if((+this.editExpressValue != 0) && !this.validate.validatEditPrice(this.editExpressValue + '')) {
          this.$message({message: "运费实际金额为最多为2位小数", type: 'warning'});
          return false;
        }

        if(!this.editExpressDesc || !this.editExpressDesc.trim()) {
          this.$message({message: "运费改价备注不能为空", type: 'warning'});
          return false;
        }
        var loadingInstance = Loading.service({text: '修改中...'});
        this.http.put(this).url(config.order.edit_express_money).restful({relationId:this.editExpress.relationId}).params({
          orderId:this.editExpress.orderId,
          money:+this.editExpressValue,
          desc:this.editExpressDesc
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            //发送一个通知
            this.$emit('refreshOrderList', event.target);
            this.refreshDetail(this.order);
            this.editExpressVisible = false;
            this.editExpressValue = 0;
            this.editExpressDesc = "";
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
      /*修改订单商品金额*/
      toEditGoodsMoney(data) {
        data.oldMoney = (data.stylePrice * data.amount).toFixed(2);
        this.editMoney = data;
        this.editGoodsValue = '',
        this.editGoodsDesc = '',
        this.editGoodsMoneyVisible = true;
      },
      /*修改订单商品金额*/
      submitGoodsEditMoney(){
        console.log(+this.editGoodsValue)
        if(+this.editGoodsValue <= 0) {
          this.$message({message: "商品实际金额必须大于0", type: 'warning'});
          return false;
        }
        if(!this.validate.validatEditPrice(this.editGoodsValue+'')) {
          this.$message({message: "商品实际金额为最多为2位小数", type: 'warning'});
          return false;
        }

        if(!this.editGoodsDesc || !this.editGoodsDesc.trim()) {
          this.$message({message: "商品改价备注不能为空", type: 'warning'});
          return false;
        }

        var loadingInstance = Loading.service({text: '修改中...'});
        this.http.put(this).url(config.order.order_goods_money_modify).restful({relationId:this.editMoney.relationId}).params({
          orderId:this.editMoney.orderId,
          amount:+this.editGoodsValue,
          desc:this.editGoodsDesc
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            //发送一个通知
            this.$emit('refreshOrderList', event.target);
            this.refreshDetail(this.order);
            this.editGoodsMoneyVisible = false;
            this.editGoodsValue = 0;
            this.editGoodsDesc = "";
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
      /*编辑订单备注*/
      toEditRemark() {
        this.editOrderRemarkVisible = true;
        this.editRemarkValue = this.order.remark;
      },
      submitEditRemark() {
        var loadingInstance = Loading.service({text: '修改中...'});
        this.http.put(this).url(config.order.order_remark_modify).params({
          orderId:this.order.orderId,
          remark:this.editRemarkValue
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            //发送一个通知
            this.$emit('refreshOrderList', event.target);
            this.editOrderRemarkVisible = false;
            this.refreshDetail(this.order);
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        })
      },

      /*编辑收货人信息*/
      toEditAddress() {
        this.editOrderAddressVisible = true;
        this.editAddressUser = this.order.reallyName;
        this.editAddressPhone = this.order.phone;
        this.editAddressValue = this.order.address;

      },
      /*修改收货人信息*/
      submitEditAddress() {
        if(!this.editAddressUser || !this.editAddressUser.trim()) {
          this.$message({message: "收货人姓名不能为空", type: 'warning'});
          return false;
        }
        if(!this.editAddressPhone || !this.editAddressPhone.trim()) {
          this.$message({message: "收货人电话不能为空", type: 'warning'});
          return false;
        }

        if(!this.validate.validatPhone( this.editAddressPhone )){
          this.$message({type: 'warning', message: '收货人电话格式不正确' });
          return false;
        }

        if(!this.editAddressValue || !this.editAddressValue.trim()) {
          this.$message({message: "收货人地址不能为空", type: 'warning'});
          return false;
        }

        var loadingInstance = Loading.service({text: '修改中...'});
        this.http.put(this).url(config.order.order_address_modify).params({
          orderId:this.order.orderId,
          address:this.editAddressValue,
          phone:this.editAddressPhone,
          reallyName:this.editAddressUser
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            //发送一个通知
            this.$emit('refreshOrderList', event.target);
            this.editOrderAddressVisible = false;
            this.refreshDetail(this.order);
            this.editAddressUser ='';
            this.editAddressPhone = '';
            this.editAddressValue = '';
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });

      },
      /*刷新订单*/
      refreshDetail(order) {
        var loadingInstance = Loading.service({text: '正在刷新订单详情...'});
        this.http.get(this).url(config.order.order_detail_url).restful({
          orderId:order.orderId
        }).request(function (response) {
          //console.log(response);
          loadingInstance.close();
          if (response.data.code == 0) {
            console.log(response.data.data)
            if (response.data.data.orderType != 4) { 
              response.data.data.orderListType = this.orderListType;
            } else {
              response.data.data.orderListType = response.data.data.orderStatus;
            }
            this.loadSource(response.data.data);
          } else {
            this.$message.error(response.data.message);
          }

        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

      /**
       * 功能：发货
       */
      deliverGoods() {
        //判断是否选择发货的商品
        if (this.selectedTempGoods && this.selectedTempGoods.length > 0) {
          this.deliverGoodsVisible = true;
          this.assumeType = 1;
        } else {
          this.$message({message: "请选择需要发货的商品", type: 'warning'});
        }
      },
      /*换货发货*/
      exChangeSend() {
        this.selectedTempGoods = this.order.orderGoodsRelations;
        this.relationId = null;
        this.deliverGoodsVisible = true;
        this.assumeType = 1;
      },
      /*发货子组件回调*/
      onSelectedOrder(data) {
        console.log(data)
        this.selectedTempGoods = data;
        this.relationId = null;
        this.deliverGoods();
      },
      /*修改物流*/
      onEditExpress(data) {
        console.log(data)
        this.relationId = data.relationId;
        this.deliverGoodsVisible = true;
        this.assumeType = 1;
      },
      /*修改物流*/
      confirmEditExpress () {
        //判断是否选择了物流公司
        if (!this.expressCompany) {
          this.$message({message: "请选择快递公司", type: 'warning'});
          return;
        }
        //判断是否输入了运单号
        if (!this.expressNumber) {
          this.$message({message: "请填写运单号", type: 'warning'});
          return;
        }

        if (!/^[A-Za-z0-9]{4,40}$/.test(this.expressNumber)) {
          this.$message({message: "请输入正常的快递单号", type: 'warning'});
          return;
        }

        if (this.assumeType == 1) {
          if ( this.expressMoney != 0 && !this.expressMoney) {
            this.$message({message: "请填写实际运费", type: 'warning'});
            return;
          }

          
          if ( this.expressMoney != 0 && !this.validate.validatPrice( this.expressMoney )) {
            this.$message({message: "实际运费为2位小数或整数", type: 'warning'});
            return;
          }
        } else {
          this.expressMoney = 0;
        }
        var loadingInstance = Loading.service({text: '数据提交中...'});
        this.http.postJson(this).url(config.order.edit_express).restful({relationId:this.relationId}).params({
          expressId:this.expressCompany,
          expressNumber:this.expressNumber,
          assumeType:this.assumeType,
          expressMoney:parseInt(this.expressMoney * 100)
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.$message({message: "修改物流成功", type: 'success'});
            this.deliverGoodsVisible = false;
            this.expressCompany = null;
            this.expressNumber = null;
            this.expressMoney = null;
            //发送一个通知
            this.$emit('refreshOrderList', event.target);
            this.refreshDetail(this.order);
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });

      },

      /*发货*/
      submitDeliverGoods() {
        //判断是否选择了物流公司
        if (!this.expressCompany) {
          this.$message({message: "请选择快递公司", type: 'warning'});
          return;
        }
        //判断是否输入了运单号
        if (!this.expressNumber) {
          this.$message({message: "请填写运单号", type: 'warning'});
          return;
        }

        if (!/^[A-Za-z0-9]{4,40}$/.test(this.expressNumber)) {
          this.$message({message: "请输入正常的快递单号", type: 'warning'});
          return;
        }


        if (this.assumeType == 1) {
          if (this.expressMoney != 0 && !this.expressMoney) {
            this.$message({message: "请填写实际运费", type: 'warning'});
            return;
          }

          if (this.expressMoney != 0 && !this.validate.validatPrice( this.expressMoney )) {
            this.$message({message: "实际运费为2位小数或整数", type: 'warning'});
            return;
          }
        } else {
          this.expressMoney = 0;
        }

        let relationIds = [];
        this.selectedTempGoods.forEach(function (item) {
          relationIds.push(item.relationId);
        });

        //console.log(this.expressCompany)

        var loadingInstance = Loading.service({text: '数据提交中...'});
        this.http.postJson(this).url(config.order.order_deliver).params({
          orderId:this.order.orderId,
          expressId:this.expressCompany,
          assumeType:this.assumeType,
          expressNumber:this.expressNumber,
          expressMoney:parseInt(this.expressMoney * 100),
          relationIds:relationIds
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.$message({message: "发货操作成功", type: 'success'});
            this.deliverGoodsVisible = false;
            this.expressCompany = null;
            this.expressNumber = null;
            this.selectedTempGoods = null;
            this.expressMoney = null;
            //发送一个通知
            this.$emit('refreshOrderList', event.target);
            this.refreshDetail(this.order);
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });

      },

      /**
       * 加载所有快递公司
       */
      loadExpressCompanies() {
        this.http.get(this).url(config.express.express_search_save_url).params({
        }).request(function(response) {
          //console.log(response);
          if(response.data.code == 0){
            this.expressCompanies = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
      /*子组件查看物流回调*/
      expressDetail(data) {
        this.showExpressSteps(data);
      },
      /*展示物流信息*/
      showExpressSteps(orderPackage) {
        this.orderPackage = orderPackage;
        var loadingInstance = Loading.service({text: '加载物流信息中...'});
        this.http.get(this).url(config.order.order_express_info).restful({
          relationId:orderPackage.relationId
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            
            this.expressStepVisible = true;
            this.expressInfoArray = response.data.data.data;
            
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },

      /**
       * 功能：同步付款信息（用以针对付款过后回调失败的订单）
       */
      syncPayment() {
        var loadingInstance = Loading.service({text: '付款信息同步中...'});
        this.http.post(this).url(config.order.sync_payment).restful({
          orderId: this.order.orderId
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.$message({message: '同步成功', type: 'success'});
            //发送一个通知
            this.$emit('refreshOrderList', event.target);
            this.refreshDetail(this.order);
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },

      /*
      添加物流信息接口
      */
      addExpressContent(expressContext,expressTime,expressNumber) {

        var loadingInstance = Loading.service({text: '数据提交中...'});
        this.http.postJson(this).url(config.order.add_express).params({
          expressNumber: expressNumber,
          nodeContent: expressContext,
          nodeDate: expressTime,
          orderId: this.orderPackage.relationId
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.$message({message: '添加成功', type: 'success'});
            this.showExpressSteps(this.orderPackage)
            this.expressContent = "";
            this.expressTime = "";
            this.showInputExpress = false;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });

      },

      /*删除添加的物流信息*/
      delExpress(trackId) {
        this.$confirm('是否确认删除订单物流节点?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(config.order.delete_express).restful({
            trackId: trackId
          }).request(function (response) {
            if (response.data.code == 0) {
              this.$message({message: '删除成功', type: 'success'});
              this.showExpressSteps(this.orderPackage)
            } else {
              this.$message.error(response.data.message);
            }
          },function (error) {
            this.$message.error("服务器繁忙，请稍后再试");
          });
        }).catch(() => {});
      },

      /**
      *添加物流信息
      **/
      addExpress() {
        //console.log(this.expressContent)
        if( !this.validate.validatNull(this.expressContent) || this.expressContent == null) {
          this.$message({message: '物流信息不能为空', type: 'warning'});
          return;
        }else if(!this.validate.validatNull(this.expressTime)) {
          this.$message({message: '请选择物流时间', type: 'warning'});
          return;
        } else {
          this.addExpressContent(this.expressContent,this.expressTime,this.orderPackage.expressNumber);
        }
      },

      /*查询改价记录*/
      findMoneyChange(type) {
        this.changeActiveName = type;
        this.moneyChangeRecord(1);
        this.moneyChangeRecord(2);
      },
      moneyChangeRecord(type) {
        let params = {};
        params.orderId = this.order.orderId;
        params.type = type;
        this.http.get(this).url(config.order.money_change).restful({ orderId:this.order.orderId}).params(params).request(function (response) {
          if (response.data.code == 0) {
            if (type == 1) {
              this.moneyChangeRecordData = response.data.data;  
            } else {
              this.expressChangeRecordData = response.data.data;  
            }
            this.changeMoneyVisible = true;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          this.$message.error("服务器繁忙，请稍后再试");
        });

      },
      /*图片浏览*/
      viewImage(imageUrl) {
        window.open(imageUrl, "_blank");
      },
      /*查询原始订单*/
      seeOriginDetail() {
        var loadingInstance = Loading.service({text: '订单信息加载中...'});
        this.http.get(this).url(config.order.order_detail_url).restful({
           orderId: this.order.sourceOrder
        }).request(function (response) {
           loadingInstance.close();
          if (response.data.code == 0) {
            this.originOrderVisible = true;
            setTimeout(()=>{
              this.$refs.originOrder.loadSource(response.data.data);
            },200)
          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      }
    }

  }

</script>


<style rel="stylesheet/scss" lang="scss">

  @import "src/styles/mixin.scss";
  .express_step_dialog{
    >div{
      width:75%;  
    }
    
  }
  .orderStepContainer {
    border: solid 1px #f2f2f2;
    padding:18px;
    margin-top: 20px;
  }

  .orderStep {
    display: block;
    margin:auto;
    width:100%;
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
  .order_message{
    >div{
      height:32px;
    }
  }

  .orderExpress {
    >div{
      height:auto;
      >div{
        width:80%;
        height:auto !important;
        padding-bottom: 16px;
      }
    }
    .el-step__main{
      width:90%;
    }
  }

  #orderGoodsTabs .el-table--hidden{
    visibility:visible;
  }

  .originOrder_box{
    >div{
      width: 85%;
    }
  }

</style>
