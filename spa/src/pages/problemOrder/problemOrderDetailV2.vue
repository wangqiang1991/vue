<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <el-button @click="cancel">返 回</el-button>
      </sticky>
      <!-- 头部流程图 -->
      <div class="createPost-main-container">
        <el-col class="problemOrderStepContainer" span="24" style=" border:1px solid #f2f2f2;padding:18px;margin-top: 20px;">
          <el-steps class="problemOrderStep" span="22" :active="order.newApplyStatus" center="true" style="display: block; margin:auto;width:100%;">
            <el-step :key="step" v-for="step in steps" :title="step.title" :description="step.date"></el-step>
          </el-steps>
        </el-col>
      </div>
      <!-- 订单基本信息 -->
      <el-col class="problemOrderInfo" span="24">

        <el-col span="8" class="infoItem">
          <div style="height:32px;line-height:32px;">
            <span>原始主订单号:</span>
            <span style="color:#337ab7;">{{order.sourceOrderNumber || order.masterOrderNumber}}</span>
            <el-button size="small" @click='seeOriginDetail' type="primary">订单信息</el-button>
          </div>
        </el-col>

        <el-col span="8" class="infoItem">
          <div style="height:32px;line-height:32px;">
            <span>原始子订单编号:</span>
            <span style="color:#337ab7;">{{order.sourceOrderGoodsNumber || order.orderNumber}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem">
          <div style="height:32px;line-height:32px;">
            <span>售后工单编号:</span>
            <span style="color:#337ab7;">{{order.workNumber}}</span>
          </div>
        </el-col>


        <el-col span="8" class="infoItem">
          <div>
            <span>订单商品金额:</span>
            <span style="color: #FF9800;">￥{{order.detail.money}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem">
          <div>
            <span>订单运费金额:</span>
            <span style="color: #FF9800;">￥{{order.detail.expressMoney}}</span>
          </div>
        </el-col>
        
        <el-col span="8" class="infoItem"  v-if='order.workType == 1'>
          <div>
            <span>退款金额:</span>
            <span style="color: #FF9800;">￥{{order.refundMoney}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem"  v-if='order.workType != 1'>
          <div>
            <span>合计金额:</span>
            <span style="color: #FF9800;">￥{{((order.detail.money + order.detail.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
          </div>
        </el-col>



        <el-col span="8" class="infoItem">
          <div>
            <span>支付方式:</span>
            <span v-if="!order.orderDetail.orderType">未支付</span>
            <span v-else-if="order.orderDetail.orderType == 1">贷款支付</span>
            <span v-else-if="order.orderDetail.orderType == 2">微信支付</span>
            <span v-else-if="order.orderDetail.orderType == 3">支付宝</span>
            <span v-else-if="order.orderDetail.orderType == 4">退换货</span>
            <span v-else-if="order.orderDetail.orderType == 5">APP微信付款</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem">
          <div>
            <span>优惠券:</span>
            <span v-if='order.detail.couponName'>{{order.detail.couponName}}</span>
            <span v-else>无</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem" >
          <div>
            <span>优惠金额:</span>
            <span style="color: #FF9800;">￥{{(( (order.detail.amount * order.detail.stylePrice  + order.detail.expressTotalMoney) - (order.detail.money + order.detail.expressMoney)).toFixed(2) + "").replace(".00", "")}}</span>
          </div>
        </el-col>


        <el-col span="8" class="infoItem" v-if='order.workType != 1'>
          <div>
            <span>{{(order.exchangeCount >= 2 && order.workType == 2) ? '上次换货数量' : '购买数量'}}:</span>
            <span>{{order.detail.amount}}</span>
          </div>
        </el-col>


        <el-col span="8" class="infoItem" v-if='order.workType == 2'>
          <div>
            <span>{{(order.exchangeCount >= 2) ? '本次换货数量' : '换货数量'}}:</span>
            <span>{{order.applyCount}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem" v-if='order.workType == 3'>
          <div>
            <span>退货数量:</span>
            <span>{{order.applyCount}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem"  v-if='order.workType == 3'>
          <div>
            <span>退货金额:</span>
            <span style="color: #FF9800;">￥{{order.refundMoney}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem" v-if='order.workType == 2 && (order.applyStatus == 5 || order.applyStatus == 6 ||order.applyStatus == 7)'>
          <div>
            <span>新订单号:</span>
            <span style="color:#337ab7;">{{order.newOrderNumber}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem">
          <div>
            <span>申请售后原因:</span>
            <span>{{order.refundReason}}</span>
          </div>
        </el-col>


        <el-col span="8" class="infoItem" v-if='order.workType == 1'>
          <div>
            <span>申请退款时间:</span>
            <span>{{order.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </div>
        </el-col>


        <el-col span="8" class="infoItem" v-if='order.workType == 2'>
          <div>
            <span>申请换货时间:</span>
            <span>{{order.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </div>
        </el-col>


        <el-col span="8" class="infoItem" v-if='order.workType == 3'>
          <div>
            <span>申请退货时间:</span>
            <span>{{order.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem" >
          <div>
            <span>联系方式:</span>
            <span>{{order.reallyName}} &nbsp;&nbsp;&nbsp; ( {{order.phone}} )</span>
          </div>
        </el-col>

        <el-col span="24" class="infoItem">
          <div>
            <span>申请售后描述:</span>
            <span>{{order.remark}}</span>
          </div>
        </el-col>

        <el-col span="24" class="infoItem">
          <div>
            <div v-for="image in order.imageArray" class="el-upload el-upload--picture-card" style="margin-right:10px;">
              <img @click="viewImage(image)" style="width:100%; height:100%" :src="image+config.imgtmb._200">
            </div>
          </div>
        </el-col>

      </el-col>


      <!-- 退款对应的操作按钮 -->
      <div v-if="orderWorkType == 1">
        <h2 style="margin-left: 10px;display: inline-block;">售后退款商品</h2>
        <el-button @click="agreeApply" size="small" v-if="order.applyStatus == 1 || order.applyStatus == 5" style="margin-left: 5px;"
                   type="primary">同意受理
        </el-button>
        <el-button @click="rejectApply" size="small" v-if="order.applyStatus == 1" style="margin-left: 5px;"
                   type="danger">拒绝受理
        </el-button>
        <el-button class="el-icon-document" size="small" style="margin-left: 5px;" v-if="order.applyStatus != 1"  type="primary" v-waves @click="findChangeGoodsMessage"> 查看流程经办信息</el-button>
        <el-button v-if="order.applyStatus == 3 || order.applyStatus == 5 " 
         class="el-icon-time"  @click="syncPayment()" size="small" style="margin-left: 5px;" type="primary" v-waves> 同步退款信息 </el-button>
      </div>

      <!-- 换货对应的操作按钮 -->
      <div v-else-if="orderWorkType == 2">
        <h2 style="margin-left: 10px;display: inline-block;">售后换货商品</h2>
        <el-button @click="agreeApply" size="small" v-if="order.applyStatus == 1" style="margin-left: 5px;"
                   type="primary">同意受理
        </el-button>
        <el-button @click="rejectApply" size="small" v-if="order.applyStatus == 1" style="margin-left: 5px;"
                   type="danger">拒绝受理
        </el-button>

        <el-button class="el-icon-document" size="small" style="margin-left: 5px;" v-if="order.applyStatus != 1"  type="primary" v-waves @click="findChangeGoodsMessage"> 查看流程经办信息</el-button>

    <el-button @click="toEditExpress" size="small" v-show="(order.applyStatus != 1  && order.applyStatus != 2 && !order.expressId && !order.expressNumber)" style="margin-left: 5px;" type="primary" icon="icon">填写物流单号
        </el-button>
    <el-button @click="showExpressSteps" size="small" v-show="(order.applyStatus != 1  && order.applyStatus != 2 && order.expressId && order.expressNumber)" style="margin-left: 5px;" type="primary" icon="icon">平台物流信息
        </el-button>

        <el-button @click="showUserExpressSteps" size="small" v-if="(order.applyStatus == 6  || order.applyStatus == 7)" style="margin-left: 5px;" type="info" icon="icon">用户物流信息 </el-button>
        
      </div>

      <!-- 退货退款对应的操作按钮 -->
      <div v-else-if="orderWorkType == 3">
        <h2 style="margin-left: 10px;display: inline-block;">售后退货商品</h2>
        <el-button @click="agreeApply" size="small" v-if="order.applyStatus == 1" style="margin-left: 5px;"
                   type="primary">同意受理
        </el-button>
        <el-button @click="rejectApply" size="small" v-if="order.applyStatus == 1" style="margin-left: 5px;"
                   type="danger">拒绝受理
        </el-button>
        <el-button class="el-icon-document" size="small" style="margin-left: 5px;" v-if="order.applyStatus != 1"  type="primary" v-waves @click="findChangeGoodsMessage"> 查看流程经办信息</el-button>
    <el-button @click="toEditExpress" size="small" v-show="(order.applyStatus != 1  && order.applyStatus != 2 && !order.expressId && !order.expressNumber)" style="margin-left: 5px;" type="primary" icon="icon">填写物流单号
        </el-button>
    <el-button @click="showExpressSteps" size="small" v-show="(order.applyStatus != 1  && order.applyStatus != 2 && order.expressId && order.expressNumber)" style="margin-left: 5px;" type="primary" icon="icon">平台物流信息
        </el-button>
        <el-button v-if="order.applyStatus == 6 || order.applyStatus == 8 " 
         class="el-icon-time"  @click="syncPayment()" size="small" style="margin-left: 5px;" type="primary" v-waves> 同步退款信息 </el-button>
      </div>

      <!-- 平台待收货对应的操作按钮 -->
      <div v-else-if="orderWorkType == 4">
        <h2 style="margin-left: 10px;display: inline-block;">售后商品</h2>
        <el-button @click="confirmReceive" size="small" v-if="!disableComfirm" style="margin-left: 5px;"
                   type="primary">确认收货
        </el-button>

        <el-button @click="rejectExchange" size="small" v-if="!disableComfirm" style="margin-left: 5px;"
                   type="danger">{{order.workType == 3 ? '拒绝退货' : '拒绝换货'}}
        </el-button>

        <el-button class="filter-item fontFamily icon-print" size="small" v-if="disableComfirm" @click="printExchangeOrder" style="margin-left: 5px;" type="info">
          {{order.workType == 3 ? '打印退货入库单' : '打印换货入库单'}}
        </el-button>

        <el-button class="el-icon-document" size="small" style="margin-left: 5px;" v-if="order.applyStatus != 1"  type="primary" v-waves @click="findChangeGoodsMessage"> 查看流程经办信息</el-button>
      </div>

      <!-- 平台待退款对应的操作按钮 -->
      <div v-else-if="orderWorkType == 5">
        <h2 style="margin-left: 10px;display: inline-block;">售后商品</h2>
        <el-button @click="executeRefundMoney" size="small" v-if="(order.workType == 1 && order.applyStatus == 6) || (order.workType == 3 && order.applyStatus == 5)" style="margin-left: 5px;" type="primary">执行退款
        </el-button>

        <el-button class="filter-item fontFamily icon-print" size="small" v-if="(order.workType == 1 && order.applyStatus == 4) || (order.workType == 3 && order.applyStatus == 7)" @click='printMoneyRecord'  style="margin-left: 5px;" type="info">
         打印退款凭证
        </el-button>

        <el-button class="el-icon-document" size="small" style="margin-left: 5px;" v-if="order.applyStatus != 1"  type="primary" v-waves @click="findChangeGoodsMessage"> 查看流程经办信息</el-button>        
      </div>

      <!-- 商品基本信息 --> 
      <el-table :data="order.goodsArray" border style="width: 100%;margin-top: 10px;">

        <el-table-column label="商品封面" align="center" vertical="middle" width="120">
          <template scope="scope">
            <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200"
                 class="gc_praiselist_list_img">
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品名称">
          <template scope="scope">
            <span >{{scope.row.title}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品编码">
          <template scope="scope">
            <span >{{scope.row.goodsNumber}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="SKU名称" >
          <template scope="scope">
            <span>{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span></span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="SKU编号">
          <template scope="scope">
            <span >{{scope.row.styleNumber}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="子订单号">
          <template scope="scope">
            <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="单价">
          <template scope="scope">
            <span style="color: #FF9800;">￥{{scope.row.stylePrice}}</span>
          </template>
        </el-table-column>

         <el-table-column prop="name" :label="(order.exchangeCount >= 2 && order.workType == 2) ? '上次换货数量' : '购买数量'" >
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

        <el-table-column prop="name" label="商品运费" >
          <template scope="scope">
            <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="合计">
          <template scope="scope">
            <span style="color: #FF9800;">￥{{((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="(order.exchangeCount >= 2) ? '本次换货数量' : '换货数量'" v-if='order.workType == 2'>
          <template scope="scope">
            <span>{{order.applyCount}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="累计换货次数" v-if='order.workType == 2'>
          <template scope="scope">
            <span>{{order.exchangeCount}}</span>
          </template>
        </el-table-column>


        <el-table-column prop="name" label="退货数量" v-if='order.workType == 3'>
          <template scope="scope">
            <span>{{order.applyCount}}</span>
          </template>
        </el-table-column>


        <el-table-column prop="name" label="退款金额" v-if='order.workType == 1'>
          <template scope="scope">
            <span style="color: #FF9800;">￥{{order.refundMoney}}</span>
          </template>
        </el-table-column>


        <el-table-column prop="name" label="退货金额" v-if='order.workType == 3'>
          <template scope="scope">
            <span style="color: #FF9800;">￥{{order.refundMoney}}</span>
          </template>
        </el-table-column>

        <el-table-column width="150" align='center' prop="name" label="操作"  v-if="(order.workType == 1 && order.applyStatus == 1) || (order.workType == 3 && order.applyStatus == 1)">
          <template scope="scope">
            <el-button @click="toEditMoney()" size="small" type="primary" v-waves icon="edit">修改退款金额</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </el-form>

    <!-- 修改订单金额弹出框 -->
    <el-dialog title="修改退款金额" :visible.sync="editOrderMoneyVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>
        <p v-if="order.workType == 1">
          商品实际付款金额: <span style="color:#FF9800;margin-right:16px;">￥{{order.detail.money}}</span>
          商品运费金额: <span style="color:#FF9800;margin-right:16px;">￥{{order.detail.expressMoney}}</span>
          合计金额: <span style="color:#FF9800;">￥{{((order.detail.money + order.detail.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
        </p>        

        <p v-else-if="order.workType == 3" style="line-height:25px;">
          购买数量: <span style="margin-right:16px;">{{order.detail.amount}}</span>
          商品实际付款金额: <span style="color:#FF9800;margin-right:16px;">￥{{order.detail.money}}</span>
          商品运费金额: <span style="color:#FF9800;margin-right:16px;">￥{{order.detail.expressMoney}}</span>
          合计金额: <span style="color:#FF9800;">￥{{((order.detail.money + order.detail.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
          <br>
          退货数量: <span style="margin-right:16px;">{{order.applyCount}}</span>
          退货金额: <span style="color:#FF9800;margin-right:16px;">￥{{((order.detail.money / order.detail.amount * order.applyCount).toFixed(2)+ "").replace(".00", "")}}</span>
          退货运费: <span style="color:#FF9800;margin-right:16px;">￥{{((order.detail.expressMoney / order.detail.amount * order.applyCount).toFixed(2)+ "").replace(".00", "")}}</span>
          合计: <span style="color:#FF9800;">￥{{(((order.detail.money + order.detail.expressMoney)/ order.detail.amount * order.applyCount).toFixed(2) + "").replace(".00", "")}}</span>
        </p>  

        <el-form-item label="是否退还运费">
         <el-radio-group v-model="returnExpress" @change="returnExpressChange">
          <el-radio class="radio"  label="1">是</el-radio>
          <el-radio class="radio"  label="2">否</el-radio>
         </el-radio-group>
        </el-form-item>

        <el-form-item label="编辑退款金额">
          <el-input style="width:200px;" type="number" v-model="editMoneyValue"></el-input>
        </el-form-item>

        <p style="padding-left:96px;"><span style="color: #000;">当不退还运费的时候，退款金额不得大于商品实际付款金额/退货金额</span></p>
        <p  style="padding-left:96px;"><span style="color: #000;">当退还运费的时候，退款金额不得大于商品实际付款金额 + 商品运费金额/退货金额 + 退货运费</span></p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderMoneyVisible = false">取 消</el-button>
        <el-button @click="submitEditMoney" type="primary">确认修改</el-button>
      </div>
    </el-dialog>


    <!-- 填写运单号弹出框 -->
    <el-dialog size="tiny" title="填写物流单号" :visible.sync="expressEditVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="物流公司:">
          <el-select style="width: 300px;" clearable class="filter-item" v-model="expressId" placeholder="物流公司">
            <el-option v-for="item in expressCompanies" :key="item.expressId" :label="item.name"
                       :value="item.expressId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="快递单号:">
          <el-input v-model="expressNumber" style="width:300px;" class="filter-item" placeholder="请准确填写快递单号">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="expressEditVisible = false">取 消</el-button>
        <el-button @click="submitExpress()" type="primary">确认修改</el-button>
      </div>
    </el-dialog>

     <!-- 查看商品换货信息 -->
    <el-dialog title="各流程经办信息" :visible.sync="changeGoodsVisible">
       <el-steps class="expressSteps" :space="60" direction="vertical" :active="100" finish-status="success">
        <div v-for="changeGoodsData in changeGoodsDatas" style="width:100%;height:auto;overflow:hidden;">
          <el-step :title="changeGoodsData.createdAt  | parseTime('{y}-{m}-{d} {h}:{i}')" :description="changeGoodsData.systemUserRoleName+'/'+changeGoodsData.systemUserName +'/'+changeGoodsData.desc" style="float:left;">
          </el-step>
        </div>
      </el-steps>
    </el-dialog>

    <!-- 订单包裹物流信息 -->
    <el-dialog title="平台物流信息" :visible.sync="expressStepVisible">

      <el-steps class="problemExpressSteps" :space="60" direction="vertical" :active="100" finish-status="success">
        <el-step v-for="expressInfo in expressInfoArray" :title="expressInfo.ftime" :key="expressInfo"
                 :description="expressInfo.context"></el-step>
      </el-steps>

      <div slot="footer" class="dialog-footer">
        <el-button @click="expressStepVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 用户物流信息 -->
    <el-dialog title="用户物流信息" :visible.sync="expressStepVisible1">

      <el-steps class="problemExpressSteps" :space="60" direction="vertical" :active="100" finish-status="success">
        <el-step v-for="expressInfo in expressInfoArray1" :title="expressInfo.ftime" :key="expressInfo"
                 :description="expressInfo.context"></el-step>
      </el-steps>

      <div slot="footer" class="dialog-footer">
        <el-button @click="expressStepVisible1 = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 确认收货弹框 -->
    <el-dialog title="平台确认收货" :visible.sync="comfirmReciveGoodVisible">

      <div>
        <span style="color:#343434;margin-right:10px;display:inline-block;width:92px;text-align: right;">售后运费选项:</span>
        <el-select style="width: 50%;" class="filter-item" v-model="receiveData.assumeType" placeholder="请选择售后运费选项">
          <el-option v-for="item in expressTypeData" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </div>

      <p v-show='receiveData.assumeType == 1'>
        <span style="color:#343434;margin-right:10px;display:inline-block;width:92px;text-align: right;">运费金额:</span>
        <el-input style='width:50%;' v-model="receiveData.expressMoney" placeholder="请填写运费金额" type='number'></el-input>
      </p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="comfirmReciveGoodVisible = false">取 消</el-button>
        <el-button @click="submitReceiveGoods()" type="primary">确 认</el-button>
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

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import session from '@/utils/session'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import originOrder from './originOrder.vue'
  export default {

    mounted() {
      this.loadExpressCompanies();
    },
    components: {
      originOrder:originOrder,
      Sticky
    },
    data() {
      return {
        receiveData:{
          expressMoney:0,
          assumeType:1
        },
        expressTypeData:[{name:'平台承担',key:1},{name:'用户承担',key:2}],
        orderWorkType:null, //1退款 2换货 3退货 4平台待收货 5平台待退款
        order: {
          newApplyStatus: null,
          workType: null,
          orderDetail:{
            orderType:null
          },
          detail:{

          }
        },
        changeGoodsDatas:[],
        changeGoodsVisible:false,
        steps: [],
        badValue:"2",
        receiveCount:0,
        comfirmReciveGoodVisible:false,
        disableEditMoneyButton: false,
        editOrderMoneyVisible: false,
        syncPaymentVisible: false,
        expressId: null,
        expressName: null,
        expressNumber: null,
        expressInfoArray: [],
        expressInfoArray1: [],
        expressCompanies: [],
        expressEditVisible: false,
        expressStepVisible: false,
        expressStepVisible1: false,
        disableMoney:false,
        disableComfirm:false,
        returnExpress:"2",
        editMoneyValue:0,
        originOrderVisible:false,
        originOrderData:{couponVo:[]}
      }
    },
    methods: {
      cancel() {
        $('.problemOrder_tabs>.el-tabs__header').show();
        this.$emit('cancel');
      },

      loadSource(order, orderWorkType) {
        this.orderWorkType = orderWorkType;
        this.returnExpress = order.refundExpressMoney ? "1" : "2";
        this.steps = [];
        if( (order.workType == 3 && order.applyStatus == 5) || (order.workType == 1 && order.applyStatus == 6) ){
          this.disableMoney = false;
        } else {
          this.disableMoney = true;
        }

        if( (order.workType == 2 && order.applyStatus == 3) || (order.workType == 3 && order.applyStatus == 3) ){
          this.disableComfirm = false;
        } else {
          this.disableComfirm = true;
        }

        order.newApplyStatus = order.applyStatus;

        order.imageArray = [];

        if (order.images) {
          order.imageArray = order.images.split(",");
        }

        order.expressMoney = order.detail.expressMoney;
        order.goodsArray = [order.detail];
        this.order = order;
        
        if (this.order.workType == 1) {
          this.calcNewApplyStatus1();
        } else if (this.order.workType == 2) {
          this.calcNewApplyStatus2();
        } else {
          this.calcNewApplyStatus3();
        }

        //设置是否需要展示"修改退款金额按钮"
        //his.setEditMoneyButtonEnable();
        //this.setSyncPaymentEnable();

      },

      // 退款:1已申请 2拒绝 3退款中 4退款成功 5退款失败
      calcNewApplyStatus1() {

        this.steps.push({title: '已申请', date: parseTime(this.order.createdAt)});
        this.steps.push({title: '已拒绝', date: parseTime(this.order.rejectDate)});
        this.steps.push({title: '待处理', date: parseTime(this.order.refundingDate)});
        this.steps.push({title: '退款中', date: parseTime(this.order.refundingDate)});
        this.steps.push({title: '退款成功', date: parseTime(this.order.refundDate)});
        this.steps.push({title: '退款失败', date: parseTime(this.order.refundFailureDate)});

        if (this.order.applyStatus == 1) {
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("退款失败");
          this.removeItemFromSteps("退款中");
        } else if (this.order.applyStatus == 2) {   //被拒绝
          this.removeItemFromSteps("待处理");
          this.removeItemFromSteps("退款成功");
          this.removeItemFromSteps("退款失败");
          this.removeItemFromSteps("退款中");

        } else if (this.order.applyStatus == 3) {   //退款中
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("待处理");
          this.removeItemFromSteps("退款失败");
           this.order.newApplyStatus = 2;
        } else if (this.order.applyStatus == 4) {   //退款成功
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("待处理");
          this.removeItemFromSteps("退款失败");
        } else if (this.order.applyStatus == 5) {   //退款失败
           this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("待处理");
          this.removeItemFromSteps("退款成功");
        } else if (this.order.applyStatus == 6) {   //执行退款
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("退款失败");
          this.removeItemFromSteps("退款中");
          this.removeItemFromSteps("退款成功");
          this.steps.push({title: '退款中'});
          this.steps.push({title: '退款成功'});
         
          this.order.newApplyStatus = 2;
        } 
      },


      // 换货:1已申请 2拒绝 3待收货 4拒绝换货 5已确认收货 6客户待收货 7客户已确认收货
      calcNewApplyStatus2() {
        this.steps.push({title: '已申请', date: parseTime(this.order.createdAt)});
        this.steps.push({title: '已拒绝', date: parseTime(this.order.rejectDate)});
        this.steps.push({title: '待收货', date: parseTime(this.order.deliveredDate)});
        this.steps.push({title: '拒绝收货', date: parseTime(this.order.deliveryRejectDate)});
        this.steps.push({title: '商家已确认收货', date: parseTime(this.order.deliveryCompleteDate)});
        this.steps.push({title: '客户待收货', date: parseTime(this.order.clientDeliveredDate)});
        this.steps.push({title: '客户已确认收货', date: parseTime(this.order.clientDeliveryCompleteDate)});
        if (this.order.applyStatus == 1) {
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝收货");
        } else if (this.order.applyStatus == 2) {
          this.removeItemFromSteps("待收货");
          this.removeItemFromSteps("拒绝收货");
          this.removeItemFromSteps("商家已确认收货");
          this.removeItemFromSteps("客户待收货");
          this.removeItemFromSteps("客户已确认收货");
        } else if (this.order.applyStatus == 3) {
          this.order.newApplyStatus = 2;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝收货");
        } else if (this.order.applyStatus == 4) {
          this.order.newApplyStatus = 3;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("商家已确认收货");
          this.removeItemFromSteps("客户待收货");
          this.removeItemFromSteps("客户已确认收货");
        } else if (this.order.applyStatus == 5) {
          this.order.newApplyStatus = 3;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝收货");
        } else if (this.order.applyStatus == 6) {
          this.order.newApplyStatus = 4;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝收货");
        } else if (this.order.applyStatus == 7) {
          this.order.newApplyStatus = 5;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝收货");
        }
      },

      // 退货:1已申请 2拒绝 3待收货 4拒绝退款 5已确认收货 6退款中 7退款成功 8退款失败
      calcNewApplyStatus3() {
        this.steps.push({title: '已申请', date: parseTime(this.order.createdAt)});
        this.steps.push({title: '已拒绝', date: parseTime(this.order.rejectDate)});
        this.steps.push({title: '待收货', date: parseTime(this.order.deliveredDate)});
        this.steps.push({title: '拒绝退款', date: parseTime(this.order.refundRejectDate)});
        this.steps.push({title: '商家已确认收货', date: parseTime(this.order.deliveryCompleteDate)});
        this.steps.push({title: '退款中', date: parseTime(this.order.refundingDate)});
        this.steps.push({title: '退款成功', date: parseTime(this.order.refundDate)});
        this.steps.push({title: '退款失败', date: parseTime(this.order.refundFailureDate)});
        if (this.order.applyStatus == 1) {
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝退款");
          this.removeItemFromSteps("退款失败");
        } else if (this.order.applyStatus == 2) {
          this.removeItemFromSteps("待收货");
          this.removeItemFromSteps("拒绝退款");
          this.removeItemFromSteps("商家已确认收货");
          this.removeItemFromSteps("退款中");
          this.removeItemFromSteps("退款成功");
          this.removeItemFromSteps("退款失败");
        } else if (this.order.applyStatus == 3) {
          this.order.newApplyStatus = 2;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝退款");
          this.removeItemFromSteps("退款失败");
        } else if (this.order.applyStatus == 4) {
          this.order.newApplyStatus = 3;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("商家已确认收货");
          this.removeItemFromSteps("退款中");
          this.removeItemFromSteps("退款成功");
          this.removeItemFromSteps("退款失败");

        } else if (this.order.applyStatus == 5) {
          this.order.newApplyStatus = 3;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝退款");
          this.removeItemFromSteps("退款失败");
        } else if (this.order.applyStatus == 6) {
          this.order.newApplyStatus = 4;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝退款");
          this.removeItemFromSteps("退款失败");
        } else if (this.order.applyStatus == 7) {
          this.order.newApplyStatus = 5;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝退款");
          this.removeItemFromSteps("退款失败");
        } else if (this.order.applyStatus == 8) {
          this.order.newApplyStatus = 5;
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("拒绝退款");
          this.removeItemFromSteps("退款成功");
        }
      },


      removeItemFromSteps(title) {
        this.steps.forEach((stepItem, index) => {
          if (stepItem.title == title) {
            this.steps.splice(index, 1);
          }
        })
      },

      viewImage(imageUrl) {
        window.open(imageUrl, "_blank");
      },

      /**
       * 根绝工单状态来判断是否禁用修改退款金额按钮
       */
      setEditMoneyButtonEnable() {
        if (this.order.workType == 1) {         //退款
          if (this.order.applyStatus != 1) {
            this.disableEditMoneyButton = true;
          }
        } else if (this.order.workType == 2) {   //换货
          this.disableEditMoneyButton = true;
        } else if (this.order.workType == 3) {   //退货退款
          if (this.order.applyStatus != 5) {
            this.disableEditMoneyButton = true;
          }
        } else {
          this.disableEditMoneyButton = false;
        }
      },

      /**
       * 判断是否禁用同步付款信息按钮
       */
      setSyncPaymentEnable() {
        if (this.order.workType == 1) {
          if (this.order.applyStatus != 3) {
            this.syncPaymentVisible = true;
          }
        } else if (this.order.workType == 2) {
          this.syncPaymentVisible = true;
        } else if (this.order.workType == 3) {
          if (this.order.applyStatus != 6) {
            this.syncPaymentVisible = true;
          }
        } else {
          this.syncPaymentVisible = false;
        }
      },


      toEditMoney() {
        this.editOrderMoneyVisible = true;
        this.returnExpress = this.order.refundExpressMoney ? "1" : "2";

        if (this.order.workType == 1) {

          if (this.order.refundExpressMoney) { 
            this.editMoneyValue = (this.order.detail.money + this.order.detail.expressMoney).toFixed(2);  
          } else {
            this.editMoneyValue = this.order.detail.money;
          }  

        } else if (this.order.workType == 3) {
          if (this.order.refundExpressMoney) { 
            this.editMoneyValue = (((this.order.detail.money + this.order.detail.expressMoney) / this.order.detail.amount * this.order.applyCount)).toFixed(2);
          } else {
            this.editMoneyValue = (this.order.detail.money / this.order.detail.amount * this.order.applyCount).toFixed(2);
          } 
        }
        
      },
      returnExpressChange(value) {
        if(value == "1"){

          if (this.order.workType == 1) {
            this.editMoneyValue = (this.order.detail.money + this.order.detail.expressMoney).toFixed(2);  
          } else if (this.order.workType == 3) {
            this.editMoneyValue = (((this.order.detail.money + this.order.detail.expressMoney) / this.order.detail.amount * this.order.applyCount)).toFixed(2);
          }

        }else if (value == "2") {

          if (this.order.workType == 1) {
            this.editMoneyValue = this.order.detail.money;
          } else if (this.order.workType == 3) {
            this.editMoneyValue = (this.order.detail.money / this.order.detail.amount * this.order.applyCount).toFixed(2);
          }

        }


      },
      submitEditMoney() {
        let refundExpressMoney = (this.returnExpress == "1") ? true : false;

        if (+this.editMoneyValue <= 0) {
          this.$message({message: '退款金额不得小于等于0', type: 'warning'});
          return;
        }

        if (!this.validate.validatPrice( this.editMoneyValue+'' )) {
          this.$message({message: "退款金额为2位小数或整数", type: 'warning'});
          return;
        }


        if(refundExpressMoney) {
          if (this.order.workType == 1) {
            if (+this.editMoneyValue > +(this.order.detail.money + this.order.detail.expressMoney ).toFixed(2) ) {
              this.$message({message: '退款金额不得大于商品实际付款金额 + 商品运费金额', type: 'warning'});
              return;
            }
          } else {
            if (+this.editMoneyValue > +(((this.order.detail.money + this.order.detail.expressMoney) / this.order.detail.amount * this.order.applyCount)).toFixed(2) ) {
              this.$message({message: '退款金额不得大于退货金额 + 退货运费', type: 'warning'});
              return;
            }
          }
        } else {
          if (this.order.workType == 1) {
            if (+this.editMoneyValue > this.order.detail.money) {
              this.$message({message: '退款金额不得大于商品实际付款金额', type: 'warning'});
              return;
            }
           } else {
            if (+this.editMoneyValue > +(this.order.detail.money / this.order.detail.amount * this.order.applyCount).toFixed(2)) {
              this.$message({message: '退款金额不得大于退货金额', type: 'warning'});
              return;
            }
          }
        }

        this.$confirm('确认修改退款金额吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          var loadingInstance = Loading.service({text: '修改中...'});
          this.http.post(this).url(config.problemOrder.edit_money_url).restful({
            workId: this.order.workOrderId
          }).params({
            amount: +this.editMoneyValue,
            refundExpressMoney:refundExpressMoney
          }).request(function (response) {
            loadingInstance.close();
            if (response.data.code == 0) {
              this.editOrderMoneyVisible = false;
              this.$message({message: '修改金额成功', type: 'success'});
              this.refreshDetail(this.order);
              this.refreshList();
            } else {
              this.$message.error(response.data.message);
            }
          }, function (error) {
            loadingInstance.close();
            this.$message.error("服务器繁忙,请稍后再试");
          });
        }).catch(() => {
        });
      },


      /**
       * 同意售后申请
       */
      agreeApply() {
        let message;
        if (this.order.workType == 1 || (this.order.workType == 3 && this.order.applyStatus == 8) ) {
          message = "确认同意该退款申请吗?";
        } else if (this.order.workType == 2) {
          message = "确认同意该换货申请吗?";
        } else if (this.order.workType == 3) {
          message = "确认同意该退换货申请吗?";
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          var loadingInstance = Loading.service({text: '操作执行中...'});
          this.http.post(this).url(config.problemOrder.agree_apply).restful({
            workId: this.order.workOrderId
          }).request(function (response) {
            loadingInstance.close();
            if (response.data.code == 0) {
              this.$message({message: '操作执行成功', type: 'success'});
              this.refreshDetail(this.order);
              //发送一个通知刷新列表
              this.refreshList();
            } else {
              this.$message.error(response.data.message);
            }
          }, function (error) {
            loadingInstance.close();
            this.$message.error("服务器繁忙,请稍后再试");
          });
        }).catch(() => {
        });
      },

      /**
       * 拒绝售后申请
       */
      rejectApply() {
        this.$prompt('请输入退回售后申请原因', '退回申请', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: ''
        }).then(({value}) => {
          if (value != null && value.trim()) {
            var loadingInstance = Loading.service({text: '操作执行中...'});
            this.http.post(this).url(config.problemOrder.reject_apply).restful({
              workId: this.order.workOrderId
            }).params({
              reason: value
            }).request(function (response) {
              loadingInstance.close();
              if (response.data.code == 0) {
                this.$message({message: '操作执行成功', type: 'success'});
                this.refreshDetail(this.order);
                //发送一个通知刷新列表
                this.refreshList();
              } else {
                this.$message.error(response.data.message);
              }
            }, function (error) {
              loadingInstance.close();
              this.$message.error("服务器繁忙,请稍后再试");
            });

          } else {
            this.$message({
              type: 'warning',
              message: '退回申请原因不能为空'
            });
          }
        }).catch(() => {
        });

      },

      /**
       * 确认收货
       */
      
        // receiveData:{
        //   expressMoney:0,
        //   assumeType:1
        // },
        // expressTypeData:[{name:'平台承当',key:1},{name:'用户承当',key:2}],

      confirmReceive() {
        this.comfirmReciveGoodVisible = true;
        this.receiveData.expressMoney = 0;
        this.receiveData.assumeType = 1;
      },
      submitReceiveGoods() {

        let params = {};
        params.assumeType = this.receiveData.assumeType;
        if (this.receiveData.assumeType == 1) {
         if (+this.receiveData.expressMoney != 0 && !this.validate.validatPrice( this.receiveData.expressMoney )) {
            this.$message({message: "运费金额为2位小数或整数", type: 'warning'});
            return;
          }         
          params.expressMoney = parseInt(this.receiveData.expressMoney * 100)
        } else {  
          params.expressMoney = 0;
        }
        console.log(params)
        var loadingInstance = Loading.service({text: '操作执行中...'});
        this.http.post(this).url(config.problemOrder.confirm_receive).restful({
          workId: this.order.workOrderId
        }).params(params).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.comfirmReciveGoodVisible = false;
            this.$message({message: '平台确认收货成功', type: 'success'});
           
            this.refreshDetail(this.order);
            //发送一个通知刷新列表
            this.refreshList();
            //this.cancel();
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙,请稍后再试");
        });
      },
      //退换货入库单
      printExchangeOrder() {
        let url = null;

         if(process.env.NODE_ENV == "production") {
            //线上url
             url = "/api/make-pdf/create-pdf-voucher/构巢销售退货入库单.pdf";
          } else if(process.env.NODE_ENV == "test") {
            //测试
             url = "/api/make-pdf/create-pdf-voucher/构巢销售退货入库单.pdf";
          } else {
            //本地url
            url = "http://192.168.20.103:8888/api/make-pdf/create-pdf-voucher/构巢销售退货入库单.pdf";
          }

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?afterSaleWorkOrderId=" + this.order.workOrderId + "&access_token=" + user.accessToken;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
      //打印退款凭证
      printMoneyRecord() {
         let url = null;
         let type = (this.order.workType == 1) ? 1 : 2;
         if(process.env.NODE_ENV == "production") {
            //线上url
             url = "/api/make-pdf/create-after-sale/构巢退款凭证单.pdf";
          } else if(process.env.NODE_ENV == "test") {
            //测试
             url = "/api/make-pdf/create-after-sale/构巢退款凭证单.pdf";
          } else {
            //本地url
            url = "http://192.168.20.103:8888/api/make-pdf/create-after-sale/构巢退款凭证单.pdf";
          }

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?workNumber=" + this.order.workNumber + "&access_token=" + user.accessToken + "&kind=" + type;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
      /**
       * 拒绝换货并关闭工单
       */
      rejectExchange() {
        this.$prompt('请输入拒绝退换货原因', '拒绝退换货', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: ''
        }).then(({value}) => {
          if (value != null && value.trim()) {
            var loadingInstance = Loading.service({text: '操作执行中...'});
            this.http.post(this).url(config.problemOrder.reject_exchange).restful({
              workId: this.order.workOrderId
            }).params({
              reason: value
            }).request(function (response) {
              loadingInstance.close();
              if (response.data.code == 0) {
                this.$message({message: '操作执行成功', type: 'success'});
                this.refreshDetail(this.order);
                //发送一个通知刷新列表
                this.refreshList();
                //this.cancel();
              } else {
                this.$message.error(response.data.message);
              }
            }, function (error) {
              loadingInstance.close();
              this.$message.error("服务器繁忙,请稍后再试");
            });

          } else {
            this.$message({
              type: 'warning',
              message: '退回申请原因不能为空'
            });
          }
        }).catch(() => {
        });
      },


      /**
       * 拒绝退款并关闭工单
       */
      rejectRefund() {
        this.$prompt('请输入拒绝退款原因', '拒绝退款', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: ''
        }).then(({value}) => {
          if (value != null && value.trim()) {
            var loadingInstance = Loading.service({text: '操作执行中...'});
            this.http.post(this).url(config.problemOrder.reject_refund).restful({
              workId: this.order.workOrderId
            }).params({
              reason: value
            }).request(function (response) {
              loadingInstance.close();
              if (response.data.code == 0) {
                this.$message({message: '操作执行成功', type: 'success'});
                this.refreshDetail(this.order);
                //发送一个通知刷新列表
                this.refreshList();
              } else {
                this.$message.error(response.data.message);
              }
            }, function (error) {
              loadingInstance.close();
              this.$message.error("服务器繁忙,请稍后再试");
            });

          } else {
            this.$message({
              type: 'warning',
              message: '退回申请原因不能为空'
            });
          }
        }).catch(() => {
        });
      },


      /**
       * 执行退款操作
       */
      executeRefundMoney() {
        let message = "该操作将执行该订单的退款操作,退款金额为:¥" + this.order.refundMoney + ",确认继续吗?";
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          var loadingInstance = Loading.service({text: '操作执行中...'});
          this.http.post(this).url(config.problemOrder.execute_refund_money).restful({
            workId: this.order.workOrderId
          }).request(function (response) {
            loadingInstance.close();
            if (response.data.code == 0) {
              this.$message({message: '操作执行成功', type: 'success'});
              this.refreshDetail(this.order);
              //发送一个通知刷新列表
              this.refreshList();
              //this.cancel();
            } else {
              this.$message.error(response.data.message);
            }
          }, function (error) {
            loadingInstance.close();
            this.$message.error("服务器繁忙,请稍后再试");
          });
        }).catch(() => {
        });
      },

      toEditExpress() {
        this.expressEditVisible = true;
        this.expressId = this.order.expressId;
        this.expressName = this.order.expressName;
        this.expressNumber = this.order.expressNumber;
      },

      submitExpress() {
        if (!this.expressId) {
          this.$message({message: "请选择快递公司", type: 'warning'});
          return;
        }

        if (!this.expressNumber) {
          this.$message({message: "请填写运单号", type: 'warning'});
          return;
        }

        var loadingInstance = Loading.service({text: '保存物流信息中...'});
        this.http.postJson(this).url(config.problemOrder.edit_express_url).restful({
          workId: this.order.workOrderId
        }).params({
          expressId: this.expressId,
          expressNumber: this.expressNumber,
          workId: this.order.workOrderId
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.expressEditVisible = false;
            this.$message({message: '保存成功!', type: 'success'});
            this.refreshDetail(this.order);
            //发送一个通知刷新列表
            this.refreshList();
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙,请稍后再试");
        })
      },


      /**
       * 刷新订单详情
       * @param order
       */
      refreshDetail(order) {
        var loadingInstance = Loading.service({text: '正在获取订单详情...'});
        this.http.get(this).url(config.problemOrder.detail_url).restful({
          workId: order.workOrderId
        }).request(function (response) {
          console.log(response);
          loadingInstance.close();
          if (response.data.code == 0) {
            this.loadSource(response.data.data,this.orderWorkType);
          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },


      refreshList() {
        //发送一个通知刷新列表
        this.$emit('refreshOrderList', event.target);
      },

      /**
       * 加载所有快递公司
       */
      loadExpressCompanies() {
        this.http.get(this).url(config.express.express_search_save_url).params({}).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            this.expressCompanies = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },

      /*展示用户物流信息*/
      showUserExpressSteps() {
        var loadingInstance = Loading.service({text: '加载物流信息中...'});
        this.http.get(this).url(config.order.order_express_info).restful({
          relationId:this.order.nextGoodsOrderRelation.relationId
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            
            this.expressStepVisible1 = true;
            this.expressInfoArray1 = response.data.data.data;
            
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
      /*展示平台物流*/
      showExpressSteps() {
        if (this.order.expressId && this.order.expressNumber) {
          var loadingInstance = Loading.service({text: '加载物流信息中...'});
          this.http.get(this).url(config.problemOrder.express_info_url).restful({
            workId: this.order.workOrderId
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
        } else {
          this.$message({message: '未找到物流单号,请先填写运单号!', type: 'warning'});
        }

      },
      findChangeGoodsMessage() {
         this.http.get(this).url(config.order.chang_goods_message).restful({ workId:this.order.workOrderId}).request(function (response) {
          if (response.data.code == 0) {
            this.changeGoodsDatas = response.data.data;
            this.changeGoodsVisible = true;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },

      /**
       * 功能：同步退款信息，该方法用于退款过后微信回调服务器失败的时候调用
       */
      syncPayment() {
        var loadingInstance = Loading.service({text: '同步退款信息中...'});
        this.http.post(this).url(config.problemOrder.sync_payment).restful({
          workId: this.order.workOrderId
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.$message({message: '同步成功', type: 'success'});
            this.refreshDetail(this.order);
            //发送一个通知刷新列表
            this.refreshList();
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
      /*查看原订单信息*/
      seeOriginDetail() {
        let orderId = this.order.sourceOrderId ? this.order.sourceOrderId : this.order.orderDetail.orderId;

        var loadingInstance = Loading.service({text: '订单信息加载中...'});
        this.http.get(this).url(config.order.order_detail_url).restful({
           orderId: orderId
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

  .problemOrderStepContainer {
    border: solid 1px #f2f2f2;
    padding:18px;
    margin-top: 20px;
  }

  .problemOrderStep {
    display: block;
    margin:auto;
    width:100%;
  }

  .problemOrderInfo {
    padding: 18px;
    margin-top: 10px;
    border: solid 1px #f2f2f2;
  }

  .problemExpressSteps .el-step__title {
    margin-top: -10px !important;
    color: black !important;
  }

  .problemExpressSteps .el-step__description {
    color: #3e3e42 !important;
  }

  .infoItem {
    padding-top: 15px;
  }

  .expressSteps .el-step__title {
    margin-top: -10px !important;
    color: black !important;
  }

  .expressSteps .el-step__description {
    color: #3e3e42 !important;
  }

  .originOrder_box{
    >div{
      width: 85%;
    }
  }

</style>
