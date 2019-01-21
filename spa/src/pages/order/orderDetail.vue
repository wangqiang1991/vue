<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <el-button @click="cancel">返回订单列表</el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-col class="orderStepContainer" span="24">
          <el-steps v-if="order.orderStatus != 4" class="orderStep" span="15" :active="order.orderStatus" center="true">
            <el-step title="订单确认" :description="order.confirmDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
            <el-step title="已付款" :description="order.payDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
            <el-step title="已发货" :description="order.deliveredDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
            <el-step title="已完成" :description="order.completedDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
          </el-steps>
          <el-steps v-else class="orderStep" span="15" :active="order.orderStatus" center="true">
            <el-step title="已取消" :description="order.invalidDate | parseTime('{y}-{m}-{d} {h}:{i}')"></el-step>
          </el-steps>
        </el-col>

        <el-col class="orderInfo" span="24">
          <el-col span="8">
            <div>
              <span>订单编号:</span>
              <span class="link-type">{{order.orderNumber}}</span>
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
              <span v-else-if="order.orderType == 4">退换货</span>
              <span v-else-if="order.orderType == 5">APP微信支付</span>
            </div>
          </el-col>


          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>订单付款总金额:</span>
              <span>￥{{order.settlementMoney + order.expressMoney}}元</span>
              <el-button :disabled="order.orderStatus != 1" @click="toEditMoney()" size="small" style="margin-left: 12px;" type="primary" v-waves icon="edit">修改金额</el-button>
              <el-button class="el-icon-time" :disabled="order.orderStatus != 1" @click="syncPayment()" size="small" style="margin-left: 12px;" type="primary" v-waves> 同步付款信息</el-button>
            </div>
          </el-col>

          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>实际商品总金额:</span>
              <span>￥{{order.totalMoney}}元</span>
            </div>
          </el-col>


          <el-col span="8" style="margin-top: 15px;">
            <div>
              <span>优惠券:</span>
              <span v-if="order.couponVo">{{order.couponVo.name}}</span>
              <span v-else>无</span>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>运费:</span>
              <span>￥{{order.expressMoney}}元</span>
            </div>
          </el-col>


          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>收货人:</span>
              <span>{{order.reallyName}}({{order.phone}})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收货地址:{{order.address}}</span>
              <el-button :disabled="order.orderStatus != 1" @click="toEditAddress()" size="small" style="margin-left: 12px;" type="primary" v-waves icon="edit">编辑收货人地址</el-button>

            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>买家留言:</span>
              <span v-if="order.message">{{order.message}}</span>
              <span v-else>无</span>
            </div>
          </el-col>

          <el-col span="24" style="margin-top: 15px;">
            <div>
              <span>平台备注:</span>
              <span v-if="order.remark">{{order.remark}}</span>
              <span v-else>无</span>
              <el-button @click="toEditRemark()" size="small" style="margin-left: 12px;" type="primary" v-waves icon="edit">编辑备注</el-button>
            </div>
          </el-col>
        </el-col>

        <div>
          <h2 style="margin-left: 10px;display: inline-block;">待发货商品</h2>
          <el-button @click="deliverGoods()" :disabled="order.orderStatus != 2" style="margin-left: 12px;" type="primary">发货</el-button>
        </div>

        <el-table @selection-change="handleSelectionChange" :data="order.enableRelations" border style="width: 100%;margin-top: 10px;!important;">

          <el-table-column type="selection" width="55">
          </el-table-column>

          <el-table-column label="商品封面" align="center" vertical="middle" width="120">
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200"
                   class="gc_praiselist_list_img">
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品名称">
            <template scope="scope">
              <span class="link-type">{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="款式" width="250">
            <template scope="scope">
              <span class="link-type">{{scope.row.styleName}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="购买数量" width="150">
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="单价" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.stylePrice}}元</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="原价" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.stylePrice * scope.row.amount}}元</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="实付款" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.money}}元</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="运费" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.expressMoney}}元</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="状态" width="150">
            <template scope="scope">
              <div v-show="!scope.row.afterSaleStatus && !scope.row.afterSaleType">
                <span v-if="scope.row.orderStatus == 1">待付款</span>
                <span v-else-if="scope.row.orderStatus == 2">待发货</span>
                <span v-else-if="scope.row.orderStatus == 3">待收货</span>
                <span v-else-if="scope.row.orderStatus == 4">已失效</span>
                <span v-else-if="scope.row.orderStatus == 5">已完成</span>
              </div>
              <div v-show="scope.row.afterSaleStatus || scope.row.afterSaleType">
                <span class="el-tag el-tag--danger el-tag--medium">已申请售后</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
          <template scope="scope">
  
            <el-button :disabled="order.orderStatus != 1" @click="toEditGoodsMoney()" size="small" style="margin-left: 12px;" type="primary" v-waves icon="edit">修改金额</el-button>
  
          </template>
        </el-table-column>

        </el-table>

        <div v-if="order.disabledRelations.length > 0">
          <h2 style="margin-left: 10px;display: inline-block;">进入售后的商品</h2>
        </div>
        <el-table v-if="order.disabledRelations.length > 0" @selection-change="handleSelectionChange" :data="order.disabledRelations" border style="width: 100%;margin-top: 10px;!important;">

          <el-table-column label="商品封面" align="center" vertical="middle" width="120">
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200"
                   class="gc_praiselist_list_img">
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品名称">
            <template scope="scope">
              <span class="link-type">{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="款式" width="250">
            <template scope="scope">
              <span class="link-type">{{scope.row.styleName}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="购买数量" width="150">
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="单价" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.stylePrice}}元</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="原价" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.stylePrice * scope.row.amount}}元</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="实付款" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.money}}元</span>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="运费" width="150">
            <template scope="scope">
              <span style="color: orangered;">￥{{scope.row.expressMoney}}元</span>
            </template>
          </el-table-column>


          <el-table-column prop="name" label="状态" width="150">
            <template scope="scope">
              <div v-show="!scope.row.afterSaleStatus && !scope.row.afterSaleType">
                <span v-if="scope.row.orderStatus == 1">待付款</span>
                <span v-else-if="scope.row.orderStatus == 2">待发货</span>
                <span v-else-if="scope.row.orderStatus == 3">待收货</span>
                <span v-else-if="scope.row.orderStatus == 4">已失效</span>
                <span v-else-if="scope.row.orderStatus == 5">已完成</span>
              </div>
              <div v-show="scope.row.afterSaleStatus || scope.row.afterSaleType">
                <span class="el-tag el-tag--danger el-tag--medium">已申请售后</span>
              </div>
            </template>
          </el-table-column>

        </el-table>



        <div v-for="(orderPackage,index) in order.subOrders">
          <div>
            <h2 style="margin-left: 10px;display: inline-block;">包裹{{index + 1}}(已发货)</h2>
            <!-- <span style="margin-left: 10px;">包裹号:{{orderPackage.orderNumber}}</span> -->
            <span style="margin-left: 20px;">运单号:{{orderPackage.expressNumber}}({{orderPackage.expressName}})</span>
            <el-button @click="showExpressSteps(orderPackage)" style="margin-left: 12px;" type="primary">查看物流</el-button>
          </div>

          <el-table :data="orderPackage.orderGoodsRelations" border style="width: 100%;margin-top: 10px;!important;">

            <el-table-column label="商品封面" align="center" vertical="middle" width="120">
              <template scope="scope">
                <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200"
                     class="gc_praiselist_list_img">
              </template>
            </el-table-column>

            <el-table-column prop="name" label="商品名称">
              <template scope="scope">
                <span class="link-type">{{scope.row.title}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="款式" width="250">
              <template scope="scope">
                <span class="link-type">{{scope.row.styleName}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="订单号" width="250">
              <template scope="scope">
                <span class="link-type">{{scope.row.orderNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="购买数量" width="150">
              <template scope="scope">
                <span class="link-type">{{scope.row.amount}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="单价" width="150">
              <template scope="scope">
                <span style="color: orangered;">￥{{scope.row.stylePrice}}元</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="原价" width="150">
              <template scope="scope">
                <span style="color: orangered;">￥{{scope.row.stylePrice * scope.row.amount}}元</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="实付款" width="150">
              <template scope="scope">
                <span style="color: orangered;">￥{{scope.row.money}}元</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="运费" width="150">
              <template scope="scope">
                <span style="color: orangered;">￥{{scope.row.expressMoney}}元</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="状态" width="150">
              <template scope="scope">
                <span v-if="scope.row.orderStatus == 1">待付款</span>
                <span v-else-if="scope.row.orderStatus == 2">待发货</span>
                <span v-else-if="scope.row.orderStatus == 3">待收货</span>
                <span v-else-if="scope.row.orderStatus == 4">已失效</span>
                <span v-else-if="scope.row.orderStatus == 5">已完成</span>
              </template>
            </el-table-column>

          </el-table>

        </div>
      </div>
    </el-form>



    <!-- 修改订单金额弹出框 -->
    <el-dialog title="修改订单金额" :visible.sync="editOrderMoneyVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="请输入优惠或者溢价金额">
          <el-input type="number" v-model="editMoneyValue"></el-input>
        </el-form-item>

        <span style="color: red;">值为负数代表减价，为正数代表加价</span>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderMoneyVisible = false">取 消</el-button>
        <el-button @click="submitEditMoney" type="primary">确认修改</el-button>
      </div>
    </el-dialog>
    
    <!-- 修改商品金额弹出框 -->
    <el-dialog title="修改商品金额" :visible.sync="editGoodsMoneyVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="请输入优惠或者溢价金额">
          <el-input type="number" v-model="editGoodsValue"></el-input>
        </el-form-item>

        <span style="color: red;">值为负数代表减价，为正数代表加价</span>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodsMoneyVisible = false">取 消</el-button>
        <el-button @click="submitGoodsEditMoney" type="primary">确认修改</el-button>
      </div>
    </el-dialog>


    <!-- 修改订单收货地址 -->
    <el-dialog title="编辑收货地址" :visible.sync="editOrderAddressVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="订单收货地址">
          <el-input v-model="editAddressValue" placeholder="请输入新的订单收货地址(必填)"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderAddressVisible = false">取 消</el-button>
        <el-button @click="submitEditAddress" type="primary">确认修改</el-button>
      </div>
    </el-dialog>


    <!-- 修改订单备注 -->
    <el-dialog title="修改订单备注" :visible.sync="editOrderRemarkVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="订单备注">
          <el-input v-model="editRemarkValue" placeholder="请输入订单备注"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderRemarkVisible = false">取 消</el-button>
        <el-button @click="submitEditRemark" type="primary">确认修改</el-button>
      </div>
    </el-dialog>

    <!-- 发货弹出框 -->
    <el-dialog size="tiny" title="商品发货" :visible.sync="deliverGoodsVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="收货地址:">
          <span>{{order.address}}</span>
        </el-form-item>

        <el-form-item label="物流公司:">
          <el-select style="width: 300px;" clearable class="filter-item" v-model="expressCompany" placeholder="物流公司">
            <el-option v-for="item in expressCompanies" :key="item.expressId" :label="item.name" :value="item.expressId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="快递单号:">
          <el-input v-model="expressNumber" style="width:300px;" class="filter-item"  maxlength = "15" placeholder="请准确填写快递单号">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliverGoodsVisible = false">取 消</el-button>
        <el-button @click="submitDeliverGoods()" type="primary">确认发货</el-button>
      </div>
    </el-dialog>


    <!-- 订单包裹物流信息 -->
    <el-dialog title="包裹物流信息" :visible.sync="expressStepVisible">
      <el-steps class="expressSteps" style="padding-bottom:30px;">
        <el-button type="primary" size="small" @click="showInputExpress=true;">添加物流信息</el-button>
      </el-steps> 
      <el-steps class="expressSteps" style="padding-bottom:10px;" v-show="showInputExpress">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-input v-model="expressContent" placeholder="请详细填写物流信息"></el-input>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="expressTime"
              editable=false
              type="datetime"
              placeholder="选择物流时间">
            </el-date-picker>  
          </el-col>
        </el-row>
         <el-row :gutter="20" style="margin-top:10px;">
          <el-col :offset="18" :span="6">
            <el-button type="default" size="default" @click="showInputExpress=false;">取 消</el-button>
            <el-button type="primary" size="default" @click="addExpress">添 加</el-button>
          </el-col>
        </el-row>  
      </el-steps> 
      <el-steps class="expressSteps" :space="60" direction="vertical" :active="100" finish-status="success">
        <div v-for="expressInfo in expressInfoArray" style="width:100%;height:auto;overflow:hidden;">
          <el-step :title="expressInfo.ftime" :description="expressInfo.context" style="float:left;"></el-step>
          <el-button type="primary" size="default" style="margin-left:20px;" v-show="expressInfo.trackId" @click="delExpress(expressInfo.trackId)">删除</el-button>
        </div>
      </el-steps>
      <div slot="footer" class="dialog-footer">
        <el-button @click="expressStepVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

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
        order: {
          orderType: 0,
          disabledRelations: []
        },
        editOrderMoneyVisible: false,
        editGoodsMoneyVisible: false,
        editOrderAddressVisible: false,
        editOrderRemarkVisible: false,
        deliverGoodsVisible: false,
        expressStepVisible: false,
        showInputExpress:false,
        editMoneyValue: 0,
        editGoodsValue: 0,
        editAddressValue: '',
        editRemarkValue: '',
        selectedTempGoods: null,
        expressCompanies:[],
        expressCompany:null,
        expressNumber:null,
        expressContent:null,
        expressTime:"",
        expressInfoArray:[],
        orderPackage:null
      }
    },

    mounted() {
      this.loadExpressCompanies();
      //console.log( this.validate.validatNull)
    },

    methods: {
      cancel() {
        this.$emit('cancel');
      },
      loadSource(order) {
        
        console.log('-----------')
        console.log(order)
        
        let goodsRelations = order.orderGoodsRelations;
        let enableRelations = [];
        let disabledRelations = [];
        goodsRelations.forEach(function (relation) {
          if (relation.afterSaleStatus && relation.afterSaleType) {
            disabledRelations.push(relation);
          } else {
            enableRelations.push(relation);
          }

        });
        order.enableRelations = enableRelations;
        order.disabledRelations = disabledRelations;
        this.order = order;
      },
      toEditMoney() {
        this.editOrderMoneyVisible = true;
      },
      toEditGoodsMoney() {
        this.editGoodsMoneyVisible = true;
      },

      submitEditMoney() {

        var loadingInstance = Loading.service({text: '修改中...'});
        this.http.put(this).url(config.order.order_money_modify).params({
          orderId:this.order.orderId,
          amount:this.editMoneyValue
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            //发送一个通知
            this.$root.$emit('refresh_order_list', event.target);
            this.editOrderMoneyVisible = false;
            this.refreshDetail(this.order);
            this.editMoneyValue = 0;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },
      submitGoodsEditMoney(){
        var loadingInstance = Loading.service({text: '修改中...'});
        console.log(this)
        this.http.put(this).url("/api/order/money/:relationId").restful({
          relationId:this.order.enableRelations[0].relationId
        }).params({
          orderId:this.order.orderId,
          amount:this.editGoodsValue
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            //发送一个通知
            this.$root.$emit('refresh_order_list', event.target);
            this.editGoodsMoneyVisible = false;
            this.refreshDetail(this.order);
            this.editGoodsValue = 0;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },

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
            this.$root.$emit('refresh_order_list', event.target);
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


      toEditAddress() {
        this.editOrderAddressVisible = true;
        this.editAddressValue = this.order.address;
      },

      submitEditAddress() {
        var loadingInstance = Loading.service({text: '修改中...'});
        this.http.put(this).url(config.order.order_address_modify).params({
          orderId:this.order.orderId,
          address:this.editAddressValue
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            //发送一个通知
            this.$root.$emit('refresh_order_list', event.target);
            this.editOrderAddressVisible = false;
            this.refreshDetail(this.order);
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });

      },

      refreshDetail(order) {
        var loadingInstance = Loading.service({text: '正在刷新订单详情...'});
        this.http.get(this).url(config.order.order_detail_url).restful({
          orderId:order.orderId
        }).request(function (response) {
          console.log(response);
          loadingInstance.close();
          if (response.data.code == 0) {
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
        } else {
          this.$message({message: "请选择需要发货的商品", type: 'warning'});
        }
      },

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
 
        let relationIds = [];
        this.selectedTempGoods.forEach(function (item) {
          relationIds.push(item.relationId);
        });

        console.log(this.expressCompany)


        var loadingInstance = Loading.service({text: '数据提交中...'});
        this.http.postJson(this).url(config.order.order_deliver).params({
          orderId:this.order.orderId,
          expressId:this.expressCompany,
          expressNumber:this.expressNumber,
          relationIds:relationIds
        }).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.$message({message: "发货操作成功", type: 'success'});
            this.deliverGoodsVisible = false;
            this.expressCompany = null;
            this.expressNumber = null;
            this.selectedTempGoods = null;

            //发送一个通知
            this.$root.$emit('refresh_order_list', event.target);
            this.refreshDetail(this.order);
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error("服务器繁忙，请稍后再试");
        });

      },

      handleSelectionChange(val) {
        this.selectedTempGoods = val;
      },


      /**
       * 加载所有快递公司
       */
      loadExpressCompanies() {
        this.http.get(this).url(config.express.express_search_save_url).params({
        }).request(function(response) {
          console.log(response);
          if(response.data.code == 0){
            this.expressCompanies = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.$message.error("服务器繁忙，请稍后再试");
        });
      },

      showExpressSteps(orderPackage) {
        this.orderPackage = orderPackage;
        var loadingInstance = Loading.service({text: '加载物流信息中...'});
        this.http.get(this).url(config.order.order_express_info).restful({
          subOrderId:orderPackage.subOrderId
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
            this.$root.$emit('refresh_order_list', event.target);
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
          nodeDate: expressTime
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
      },

      /**  
      *添加物流信息
      **/
      addExpress() {
        console.log(this.expressContent)
        if( !this.validate.validatNull(this.expressContent) || this.expressContent == null) {
          this.$message.error("物流信息不能为空");
          return;
        }else if(!this.validate.validatNull(this.expressTime)) {
          this.$message.error("请选择物流时间");
          return;
        } else {
          this.addExpressContent(this.expressContent,this.expressTime,this.orderPackage.expressNumber);
        }
      }

    }

  }

</script>


<style rel="stylesheet/scss" lang="scss">

  @import "src/styles/mixin.scss";

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




</style>
