<template>
  <div class="createPost-container">

    <el-row class="orderInfo order_message">
      <el-col span="8">
        <div>
          <span>原始订单编号:</span>
          <span style="color:#337ab7;">{{order.sourceOrderNumber || order.orderNumber}}</span>
        </div>
      </el-col>

      <el-col span="8">
        <div>
          <span>支付时间:</span>
          <span>{{order.payDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
          <span style="color: #FF9800;">￥{{( ((order.totalMoney + order.expressTotalMoney) - (order.settlementMoney + order.expressMoney) ).toFixed(2) + "").replace(".00", "")}}</span>
        </div>
      </el-col>

      <el-col span="24" style="margin-top: 15px;">
        <div>
          <span>收货人:</span>
          <span>{{order.reallyName}}&nbsp;&nbsp;&nbsp;({{order.phone}})&nbsp;&nbsp;&nbsp;{{order.address}}</span>
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

        </div>
      </el-col>
    </el-row>

    <h2 style="margin:16px 0;">原始订单商品列表</h2>
    <!-- 正常待收货 待发货 已完成订单 -->
    <el-tabs v-model="originActiveName" id='originOrderGoodsTabs'>

      <el-tab-pane label="待发货商品列表" name="1">

        <el-table :data="order.orderDoodsData1" border  highlight-current-row style="width: 100%" >      

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
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
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span >{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="子订单号" >
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品单价" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.stylePrice}}</span>
            </template>
          </el-table-column>

              <el-table-column prop="name" label="购买数量" >
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品原总金额">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.stylePrice * scope.row.amount).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品实际支付金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.money}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="运费" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="合计" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>

      <el-tab-pane label="待收货商品列表" name="2">

        <el-table :data="order.orderDoodsData2" border  highlight-current-row style="width: 100%" >      

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
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
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span >{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="子订单号" >
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品单价" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.stylePrice}}</span>
            </template>
          </el-table-column>

              <el-table-column prop="name" label="购买数量" >
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品原总金额">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.stylePrice * scope.row.amount).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品实际支付金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.money}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="运费" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="合计" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>

      <el-tab-pane label="已完成商品列表" name="3">

        <el-table :data="order.orderDoodsData3" border  highlight-current-row style="width: 100%" >      

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
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
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span >{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="name" label="子订单号" >
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品单价" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.stylePrice}}</span>
            </template>
          </el-table-column>

              <el-table-column prop="name" label="购买数量" >
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品原总金额">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.stylePrice * scope.row.amount).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品实际支付金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.money}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="运费" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="合计" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>

      <el-tab-pane label="售后退款商品记录" name="4">
        <el-table :data="order.orderDoodsData4" border  highlight-current-row style="width: 100%" >      

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
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
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span >{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="售后工单号" >
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.workNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="退款金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.refundMoney}}</span>
            </template>
          </el-table-column>     


          <el-table-column prop="name" label="退款数量">
            <template scope="scope">
              <span>{{scope.row.applyCount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品原总金额">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.money}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="申请日期" >
            <template scope="scope">
              <span >{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="售后状态">
            <template scope="scope">
              <span v-if='scope.row.applyStatus == 1'>未受理</span>
              <span v-else-if='scope.row.applyStatus == 2'>拒绝受理</span>
              <span v-else-if='scope.row.applyStatus == 3'>退款中</span>
              <span v-else-if='scope.row.applyStatus == 4'>退款成功</span>
              <span v-else-if='scope.row.applyStatus == 5'>退款失败</span>
              <span v-else-if='scope.row.applyStatus == 6'>财务待退款</span>
              <span v-else>无</span>
            </template>
          </el-table-column>


        </el-table>

      </el-tab-pane>

      <el-tab-pane label="售后换货商品记录" name="5">
        <el-table :data="order.orderDoodsData5" border  highlight-current-row style="width: 100%" >      

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
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
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span >{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="售后工单号" >
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.workNumber}}</span>
            </template>
          </el-table-column>



          <el-table-column prop="name" label="换货数量">
            <template scope="scope">
              <span>{{scope.row.applyCount}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="申请日期" >
            <template scope="scope">
              <span >{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="售后状态" >
            <template scope="scope">
              <span v-if='scope.row.applyStatus == 1'>未受理</span>
              <span v-else-if='scope.row.applyStatus == 2'>拒绝受理</span>
              <span v-else-if='scope.row.applyStatus == 3'>平台待收货</span>
              <span v-else-if='scope.row.applyStatus == 4'>拒绝换货</span>
              <span v-else-if='scope.row.applyStatus == 5'>平台待发货</span>
              <span v-else-if='scope.row.applyStatus == 6'>用户待收货</span>
              <span v-else-if='scope.row.applyStatus == 7'>用户确认收货</span>
              <span v-else>无</span>
            </template>
          </el-table-column>


        </el-table>

      </el-tab-pane>

      <el-tab-pane label="售后退货商品记录" name="6">
        <el-table :data="order.orderDoodsData6" border  highlight-current-row style="width: 100%" >      

          <el-table-column label="商品封面" align="center" vertical="middle" >
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
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
              <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="SKU编码">
            <template scope="scope">
              <span >{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="售后工单号" >
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.workNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="退款金额" >
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.refundMoney}}</span>
            </template>
          </el-table-column>     


          <el-table-column prop="name" label="退货数量">
            <template scope="scope">
              <span>{{scope.row.applyCount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品原总金额">
            <template scope="scope">
              <span style="color: #FF9800;">￥{{scope.row.money}}</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="申请日期" >
            <template scope="scope">
              <span >{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="售后状态">
            <template scope="scope">
              <span v-if='scope.row.applyStatus == 1'>未受理</span>
              <span v-else-if='scope.row.applyStatus == 2'>拒绝受理</span>
              <span v-else-if='scope.row.applyStatus == 3'>平台待收货</span>
              <span v-else-if='scope.row.applyStatus == 4'>拒绝退款</span>
              <span v-else-if='scope.row.applyStatus == 5'>财务待退款</span>
              <span v-else-if='scope.row.applyStatus == 6'>退款中</span>
              <span v-else-if='scope.row.applyStatus == 7'>退款成功</span>
              <span v-else-if='scope.row.applyStatus == 8'>退款失败</span>
              <span v-else>无</span>
            </template>
          </el-table-column>


        </el-table>

      </el-tab-pane>

    </el-tabs>   


    <!-- 查看金额修改日志弹出框 -->
    <el-dialog title="改价历史记录" :modal='false' :visible.sync="changeMoneyVisible">
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

  </div>
</template>
<script>
  import {parseTime} from '@/utils'
  export default {
    data() {
      return { 
        changeActiveName:'1',
        moneyChangeRecordData:[],
        expressChangeRecordData:[],
        changeMoneyVisible:false,

        originActiveName:'1',
        order: {
          orderListType:null,
          newApplyStatus: null,
          orderType: 4,
          disabledRelations: [],
          orderNumber:''
        },
      }
    },
    methods: {
      loadSource(order){
        this.originActiveName = '1';

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
        console.log(order)
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

        this.order = order;
        
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
        this.http.get(this).url(this.config.order.money_change).restful({ orderId:this.order.orderId}).params(params).request(function (response) {
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
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  #originOrderGoodsTabs .el-table--hidden{
    visibility:visible;
  }
  #originOrderGoodsTabs .el-table__header{
    width: 100%;
  }
</style>
