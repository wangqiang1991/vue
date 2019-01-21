<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <el-button @click="cancel">返回订单列表</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-col class="problemOrderStepContainer" span="24">
          <el-steps class="problemOrderStep" span="15" :active="order.newApplyStatus" center="true">
            <el-step :key="step" v-for="step in steps" :title="step.title" :description="step.date"></el-step>
          </el-steps>
        </el-col>
      </div>

      <el-col class="problemOrderInfo" span="24">
        <el-col span="8" class="infoItem">
          <div>
            <span>订单编号:</span>
            <span class="link-type">{{order.orderNumber}}</span>
          </div>
        </el-col>
        <el-col span="8" class="infoItem">
          <div>
            <span>工单编号:</span>
            <span class="link-type">{{order.workNumber}}</span>
          </div>
        </el-col>
        <el-col span="8" class="infoItem">
          <div>
            <span>工单类型:</span>
            <span v-if="order.workType == 1">退款</span>
            <span v-else-if="order.workType == 2">换货</span>
            <span v-else-if="order.workType == 3">退货退款</span>
          </div>
        </el-col>

        <el-col span="8" class="infoItem">
          <div>
            <span>订单金额:</span>
            <span style="color: orangered;">￥{{order.money}}元</span>
          </div>
        </el-col>


        <el-col span="8" class="infoItem">
          <div>
            <span>退款金额:</span>
            <span style="color: orangered;">￥{{order.refundMoney}}元</span>
            <el-button :disabled="disableEditMoneyButton" @click="toEditMoney()" size="small" style="margin-left: 12px;"
                       type="primary" v-waves icon="edit">修改退款金额
            </el-button>
            <el-button :disabled="syncPaymentVisible" class="el-icon-time" @click="syncPayment()" size="small"
                       style="margin-left: 12px;" type="primary" v-waves> 同步退款信息
            </el-button>
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
        <el-col span="24" class="infoItem">
          <div>
            <span>联系人:</span>
            <span>{{order.reallyName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话:{{order.phone}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;申请时间:{{order.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </div>
        </el-col>

        <el-col span="24" class="infoItem">
          <div>
            <span>申请售后原因:</span>
            <span>{{order.refundReason}}</span>
          </div>
        </el-col>

        <el-col span="24" class="infoItem">
          <div>
            <span>申请售后备注:</span>
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
      <div v-if="order.workType == 1">
        <h2 style="margin-left: 10px;display: inline-block;">售后商品</h2>
        <el-button @click="agreeApply" size="small" :disabled="order.applyStatus != 1" style="margin-left: 30px;"
                   type="primary">执行退款
        </el-button>
        <el-button @click="rejectApply" size="small" :disabled="order.applyStatus != 1" style="margin-left: 5px;"
                   type="danger">拒绝退款
        </el-button>
      </div>

      <!-- 换货对应的操作按钮 -->
      <div v-else-if="order.workType == 2">
        <h2 style="margin-left: 10px;display: inline-block;">售后商品</h2>
        <el-button @click="agreeApply" size="small" :disabled="order.applyStatus != 1" style="margin-left: 30px;"
                   type="primary">同意换货
        </el-button>
        <el-button @click="rejectApply" size="small" :disabled="order.applyStatus != 1" style="margin-left: 10px;"
                   type="danger">拒绝换货
        </el-button>
        <el-button @click="confirmReceive" size="small" :disabled="order.applyStatus != 3" style="margin-left: 10px;"
                   type="primary">确认收货
        </el-button>
        <el-button @click="rejectExchange" size="small" :disabled="order.applyStatus != 3" style="margin-left: 10px;"
                   type="danger">拒绝换货并关闭工单
        </el-button>
        <el-button @click="toEditExpress" size="small" style="margin-left: 10px;" type="primary" icon="icon">填写运单号
        </el-button>
        <el-button @click="showExpressSteps" size="small" style="margin-left: 10px;" type="primary" icon="icon">查看物流
        </el-button>
      </div>

      <!-- 退货退款对应的操作按钮 -->
      <div v-else-if="order.workType == 3">
        <h2 style="margin-left: 10px;display: inline-block;">售后商品</h2>
        <el-button @click="agreeApply" size="small" :disabled="order.applyStatus != 1" style="margin-left: 30px;"
                   type="primary">同意退款
        </el-button>
        <el-button @click="rejectApply" size="small" :disabled="order.applyStatus != 1" style="margin-left: 10px;"
                   type="danger">拒绝退款
        </el-button>
        <el-button @click="confirmReceive" size="small" :disabled="order.applyStatus != 3" style="margin-left: 10px;"
                   type="primary">确认收货
        </el-button>
        <el-button @click="rejectRefund" size="small" :disabled="order.applyStatus != 3" style="margin-left: 10px;"
                   type="danger">拒绝退款并关闭工单
        </el-button>
        <el-button @click="executeRefundMoney" size="small" :disabled="order.applyStatus != 5"
                   style="margin-left: 10px;" type="primary">执行退款
        </el-button>
        <el-button @click="toEditExpress" size="small" style="margin-left: 10px;" type="primary" icon="icon">填写运单号
        </el-button>
        <el-button @click="showExpressSteps" size="small" style="margin-left: 10px;" type="primary" icon="icon">查看物流
        </el-button>
      </div>


      <el-table :data="order.goodsArray" border style="width: 100%;margin-top: 10px;!important;">
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
      </el-table>
    </el-form>

    <!-- 修改订单金额弹出框 -->
    <el-dialog title="修改退款金额" :visible.sync="editOrderMoneyVisible">
      <el-form class="small-space" label-position="left" style='margin-left:10px;'>

        <el-form-item label="编辑退款金额">
          <el-input-number v-model="editMoneyValue"></el-input-number>
        </el-form-item>

        <span style="color: red;">退款金额最大不超过订单金额,最小为0,请谨慎操作</span>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrderMoneyVisible = false">取 消</el-button>
        <el-button @click="submitEditMoney" type="primary">确认修改</el-button>
      </div>
    </el-dialog>


    <!-- 填写运单号弹出框 -->
    <el-dialog size="tiny" title="填写运单号" :visible.sync="expressEditVisible">
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


    <!-- 订单包裹物流信息 -->
    <el-dialog title="商品物流信息" :visible.sync="expressStepVisible">

      <el-steps class="problemExpressSteps" :space="60" direction="vertical" :active="100" finish-status="success">
        <el-step v-for="expressInfo in expressInfoArray" :title="expressInfo.ftime" :key="expressInfo"
                 :description="expressInfo.context"></el-step>
      </el-steps>

      <div slot="footer" class="dialog-footer">
        <el-button @click="expressStepVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 确认收货弹框 -->
    <el-dialog title="确认收货" :visible.sync="comfirmReciveGoodVisible">
      <p>
        <span style="color:#343434;margin-right:10px">商品是否损坏:</span>
        <el-radio class="radio" v-model="badValue" label="1">是</el-radio>
        <el-radio class="radio" v-model="badValue" label="2">否</el-radio>
      </p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="comfirmReciveGoodVisible = false">取 消</el-button>
        <el-button @click="submitReceiveGoods()" type="primary">确 认</el-button>
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

    mounted() {
      this.loadExpressCompanies();
    },

    data() {
      return {
        order: {
          newApplyStatus: null,
          workType: null,
          orderDetail:{
            orderType:null
          }
        },
        steps: [],
        badValue:"2",
        comfirmReciveGoodVisible:false,
        disableEditMoneyButton: false,
        editOrderMoneyVisible: false,
        syncPaymentVisible: false,
        expressId: null,
        expressName: null,
        expressNumber: null,
        expressInfoArray: [],
        expressCompanies: [],
        expressEditVisible: false,
        expressStepVisible: false
      }
    },
    methods: {
      cancel() {
        this.$emit('cancel');
      },

      loadSource(order) {
        this.steps = [];
        order.newApplyStatus = order.applyStatus;
        order.imageArray = [];
        if (order.images) {
          order.imageArray = order.images.split(",");
        }
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
        this.setEditMoneyButtonEnable();
        this.setSyncPaymentEnable();

      },

      // 退款:1已申请 2拒绝 3退款中 4退款成功 5退款失败
      calcNewApplyStatus1() {

        this.steps.push({title: '已申请', date: parseTime(this.order.createdAt)});
        this.steps.push({title: '已拒绝', date: parseTime(this.order.rejectDate)});
        this.steps.push({title: '退款中', date: parseTime(this.order.refundingDate)});
        this.steps.push({title: '退款成功', date: parseTime(this.order.refundDate)});
        this.steps.push({title: '退款失败', date: parseTime(this.order.refundFailureDate)});

        if (this.order.applyStatus != 2 && this.order.applyStatus != 5) {

          if (this.order.applyStatus == 3) {
            this.order.newApplyStatus = 2;
          }
          if (this.order.applyStatus == 4) {
            this.order.newApplyStatus = 3;
          }
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("退款失败");

        } else if (this.order.applyStatus == 2) {   //被拒绝
          this.removeItemFromSteps("退款中");
          this.removeItemFromSteps("退款成功");
          this.removeItemFromSteps("退款失败");

        } else if (this.order.applyStatus == 5) {   //退款失败
          if (this.order.applyStatus == 3) {
            this.order.newApplyStatus = 2;
          }
          if (this.order.applyStatus == 4) {
            this.order.newApplyStatus = 3;
          }
          this.removeItemFromSteps("已拒绝");
          this.removeItemFromSteps("退款成功");
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
        this.editMoneyValue = this.order.refundMoney;
        this.editOrderMoneyVisible = true;
      },

      submitEditMoney() {
        if (this.editMoneyValue <= 0) {
          this.$message({message: '退款金额不得小于0', type: 'warning'});
          return;
        }

        if (this.editMoneyValue > this.order.money) {
          this.$message({message: '退款金额不得大于订单金额', type: 'warning'});
          return;
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
            amount: this.editMoneyValue
          }).request(function (response) {
            loadingInstance.close();
            if (response.data.code == 0) {
              this.editOrderMoneyVisible = false;
              this.$message({message: '修改金额成功', type: 'success'});
              this.refreshDetail(this.order);
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
        if (this.order.workType == 1) {
          message = "该操作将执行该订单的退款操作,退款金额为:¥" + this.order.refundMoney + ",确认继续吗?";
        } else if (this.order.workType == 2) {
          message = "确认同意该换货申请吗?";
        } else if (this.order.workType == 3) {
          message = "确认同意该退货退款申请吗?";
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
      
      confirmReceive() {
        this.comfirmReciveGoodVisible = true;
      },
      submitReceiveGoods() {
        let goodBad = false;
        if(this.badValue == "1"){
          goodBad = true;
        }else{
          goodBad = false;
        }
        var loadingInstance = Loading.service({text: '操作执行中...'});
        this.http.post(this).url(config.problemOrder.confirm_receive).restful({
          workId: this.order.workOrderId
        }).params({bad:goodBad}).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.comfirmReciveGoodVisible = false;
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
      },


      /**
       * 拒绝换货并关闭工单
       */
      rejectExchange() {
        this.$prompt('请输入拒绝换货原因', '拒绝换货', {
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
            this.loadSource(response.data.data);
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
        this.$root.$emit('refresh_problem_order_list', event.target);
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
      }


    }
  }

</script>


<style rel="stylesheet/scss" lang="scss">

  @import "src/styles/mixin.scss";

  .problemOrderStepContainer {
    border: solid 1px #f2f2f2;
    padding-bottom: 20px;
    margin-top: 20px;
  }

  .problemOrderStep {
    margin-top: 20px;
    margin-left: 10%;
    margin-right: 10%;
    display: block;
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


</style>
