<template>
  <div class="app-container calendar-list-container" id="promoterSettle_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.promoterName" style="width: 200px !important;" class="filter-item" placeholder="推广商名称">
          </el-input>

          <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-table
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          :data="dataList"
          border
          style="width: 100%;">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="推广商名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.promoterName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="联系人">
            <template scope="scope">
              <span>{{scope.row.contacts}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="联系电话">
            <template scope="scope">
              <span>{{scope.row.contactsPhone}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="已结算金额"
            align="center">
            <template scope="scope">
              <span>¥{{scope.row.settleMoney}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="待结算金额"
            align="center">
            <template scope="scope">
             <span>¥{{scope.row.waitSettleMoney}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="结算&明细"
            align="center"
            width="150">
            <template scope="scope">
             <el-button size="small" class="button_detail" type="primary" @click="seeDetail(scope.row)">结算&明细</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize"
                         :current-page="listQuery.pageIndex"
                         layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
          </el-pagination>
        </div>
      </div>

      <el-dialog :title="title"  :visible.sync="orderDialog" class="promoter_dialog">
        <div class="plan_detail">

          <el-row :gutter="20">
            <el-col :span="20">
              <div class="grid-content bg-purple select_div">
                <el-date-picker
                  class="date_select"
                  @change="timeSearch"
                  v-model="time"
                  type="daterange"
                  :picker-options="pickerOptions"
                  placeholder="查询日期">
                </el-date-picker>
                <el-button class="filter-item" style="margin-left: 12px;" type="primary" icon="search" @click="timeSearch">筛选</el-button>
              </div>
            </el-col>
          </el-row>

          <div class="gc-praiselist_content_list" style="margin-top:15px;" >

            <el-row :gutter="24">
              <el-col :span="4" >
                <div class="count">
                  <p class="tip">付款订单数</p>
                  <p class="number">{{detailBoothQuery.paymentOrderCount}}</p>
                </div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="count">
                  <p class="tip">付款订单商品总金额</p>
                  <p class="number">¥{{detailBoothQuery.paymentOrderTotalMoney ? detailBoothQuery.paymentOrderTotalMoney.toFixed(2) : detailBoothQuery.paymentOrderTotalMoney}}</p>
                </div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="count">
                  <p class="tip">待结算订单商品金额</p>
                  <p class="number">¥{{detailBoothQuery.waitSettleOrderTotalMoney ? detailBoothQuery.waitSettleOrderTotalMoney.toFixed(2) : detailBoothQuery.waitSettleOrderTotalMoney}}</p>
                </div>
              </el-col> 
              <el-col :span="4" :offset="1">
                <div class="count">
                  <p class="tip">待结算支出金额</p>                               
                  <p class="number">¥{{detailBoothQuery.waitSettleOrderMoney ? detailBoothQuery.waitSettleOrderMoney.toFixed(2) : detailBoothQuery.waitSettleOrderMoney}}</p>
                </div>
              </el-col>
              <el-col :span="4" :offset="1">
                <div class="count">
                  <p class="tip">已结算支出金额</p>
                  <p class="number">¥{{detailBoothQuery.settleExpenditureOrderTotalMoney ? detailBoothQuery.settleExpenditureOrderTotalMoney.toFixed(2) : detailBoothQuery.settleExpenditureOrderTotalMoney}}</p>
                </div>
              </el-col>

            </el-row>

          </div>

          <div class="gc-praiselist_content_list" style="margin-top:15px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="待结算订单" name="1">
                <p style="text-align:right;" v-show="orderDetailData.length"><el-button class="filter-item fontFamily icon-dollar" type="info" @click="loadOrderData">结算订单</el-button></p>
                <div class="gc-praiselist_content_list" style="margin-top:15px;">

                  <el-table
                    v-loading="promoterorder.loading"
                    :data="orderDetailData"
                    element-loading-text="努力加载中..."
                    border
                    style="width: 100%;">

                    <el-table-column
                      align="center"
                      label="订单编号">
                      <template scope="scope">
                        <span>{{ scope.row.orderNumber }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单商品金额">
                      <template scope="scope">
                        <span>¥{{ scope.row.money }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="付款时间">
                      <template scope="scope">
                        <span>{{ scope.row.payDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单完成时间">
                      <template scope="scope">
                        <span>{{scope.row.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')  }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="结算预估支出">
                      <template scope="scope">
                        <span>¥{{ scope.row.settleMoney }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单状态">
                      <template scope="scope">
                        <span>待结算</span>
                      </template>
                    </el-table-column>

                  </el-table>

                  <div class="pagination-container">
                    <el-pagination
                      :page-sizes="[10,15,20,30]"
                      :page-size="promoterorder.pageSize"
                      :current-page="promoterorder.pageIndex"
                      :total="promoterorder.total"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="orderhandleSizeChange"
                      @current-change="orderhandleCurrentChange"/>
                  </div>

                </div>

              </el-tab-pane>
              <el-tab-pane label="已结算订单" name="2">
                <div class="gc-praiselist_content_list" style="margin-top:15px;">

                  <el-table
                    v-loading="promoterorder.loading"
                    :data="orderDetailData"
                    element-loading-text="努力加载中..."
                    border
                    style="width: 100%;">

                    <el-table-column
                      align="center"
                      label="订单编号">
                      <template scope="scope">
                        <span>{{ scope.row.orderNumber }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单商品金额">
                      <template scope="scope">
                        <span>¥{{ scope.row.money }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="付款时间">
                      <template scope="scope">
                        <span>{{ scope.row.payDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单完成时间">
                      <template scope="scope">
                        <span>{{scope.row.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')  }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="结算预估支出">
                      <template scope="scope">
                        <span>¥{{ scope.row.settleMoney }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单状态">
                      <template scope="scope">
                        <span>已结算</span>
                      </template>
                    </el-table-column>

                  </el-table>

                  <div class="pagination-container">
                    <el-pagination
                      :page-sizes="[10,15,20,30]"
                      :page-size="promoterorder.pageSize"
                      :total="promoterorder.total"
                      :current-page="promoterorder.pageIndex"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="orderhandleSizeChange"
                      @current-change="orderhandleCurrentChange"/>
                  </div>

                </div>
              </el-tab-pane>
              <el-tab-pane label="未完成订单" name="3">
                <div class="gc-praiselist_content_list" style="margin-top:15px;">

                  <el-table
                    v-loading="promoterorder.loading"
                    :data="orderDetailData"
                    element-loading-text="努力加载中..."
                    border
                    style="width: 100%;">

                    <el-table-column
                      align="center"
                      label="订单编号">
                      <template scope="scope">
                        <span>{{ scope.row.orderNumber }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单商品金额">
                      <template scope="scope">
                        <span>¥{{ scope.row.money }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="付款时间">
                      <template scope="scope">
                        <span>{{ scope.row.payDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="结算预估支出">
                      <template scope="scope">
                        <span>¥{{ scope.row.settleMoney }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column
                      align="center"
                      label="订单状态">
                      <template scope="scope">
                        <span>未完成</span>
                      </template>
                    </el-table-column>

                  </el-table>

                  <div class="pagination-container">
                    <el-pagination
                      :page-sizes="[10,15,20,30]"
                      :page-size="promoterorder.pageSize"
                      :current-page="promoterorder.pageIndex"
                      :total="promoterorder.total"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="orderhandleSizeChange"
                      @current-change="orderhandleCurrentChange"/>
                  </div>

                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

        </div> 

        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="orderDialog = false">关 闭</el-button>
        </div>  
      </el-dialog>


        <el-dialog  title="订单结算"  :visible.sync="payOrderDialog" class="promoter_dialog">

          <div class="plan_detail">
            <el-row :gutter="24">

              <el-col :span="12">
                <span>结算周期:</span>
                <span style="font-weight:700;color:#343434;font-size:16px;">{{payOrderDate}}</span>
              </el-col>

              <el-col :span="12">
                <span style="float:left;margin-right:4px;">结算金额:</span>
                <span style="font-weight:700;color:#343434;font-size:16px;">¥{{detailBoothQuery.waitSettleOrderMoney ? detailBoothQuery.waitSettleOrderMoney.toFixed(2) : detailBoothQuery.waitSettleOrderMoney}}</span>  
              </el-col>

            </el-row>
            <h2>结算订单明细</h2>

             <el-table
                :data="allPayOrder"
                border
                style="width: 100%;">

                <el-table-column
                  align="center"
                  label="订单编号">
                  <template scope="scope">
                    <span>{{ scope.row.orderNumber }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="订单商品金额">
                  <template scope="scope">
                    <span>¥{{ scope.row.money }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="付款时间">
                  <template scope="scope">
                    <span>{{ scope.row.payDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="订单完成时间">
                  <template scope="scope">
                    <span>{{scope.row.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')  }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="结算预估支出">
                  <template scope="scope">
                    <span>¥{{ scope.row.settleMoney }}</span>
                  </template>
                </el-table-column>

              </el-table>


          </div>    

          <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="payOrderDialog = false">关 闭</el-button>
            <el-button type="primary" @click="comfirmPayOrderDialog">确认结算</el-button>
          </div>
    
        </el-dialog>

  </div>
</template>

<script>
  import {parseTime,toDate} from '@/utils'
  export default {
    data() {
      return {
        payOrderDate:"",
        payOrderDialog:false,
        title:'',
        activeName:"1",
        orderDialog:false,
        promoterId:null,
        beginDate:null,
        endDate:null,
        time:null,
        dataList:[],
        orderDetailData:[],
        allPayOrder:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          promoterName:''
        },
        detailBoothQuery:{
          paymentOrderCount:0,  //付款订单数
          paymentOrderTotalMoney:0,  //付款订单商品总金额
          waitSettleOrderTotalMoney:0, //待结算订单商品金额
          waitSettleOrderMoney:0, // 待结算支出金额
          settleExpenditureOrderTotalMoney:0, //已结算支出金额
        },
        promoterorder:{
          loading: false,
          pageIndex: 1,
          pageSize: 8,
          total: 0,
          status:1,
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= ( Date.now() - 8.64e6 );
          }
        },
      }
    },
    mounted() {
      this.initDate();
      this.findByPage();
    },
    methods:{
      initDate() {
        this.time = [];
        let date = new Date();
        let endDate = date.setHours(23,59,59);
        let date1 = new Date();
        let beginDate = new Date(date1.setDate(1)).setHours(0,0,0);
        this.time[0] = beginDate;
        this.time[1] = endDate;
        this.beginDate = toDate(beginDate);
        this.endDate = toDate(endDate);
      },
      getSelectTime() {
        let params = {};
        if (!this.time ||this.time[0] == null || this.time[1] == null){
          params.beginDate = this.beginDate;
          params.endDate = this.endDate;
        } else {
          if (typeof( this.time[0] ) == "number") {
            params.beginDate = toDate(this.time[0]);
          } else {
            params.beginDate = toDate(this.time[0].setHours(0,0,0));
          }

          if (typeof( this.time[1] ) == "number") {
            params.endDate = toDate(this.time[1]);
          } else {
            params.endDate = toDate(this.time[1].setHours(23,59,59));
          }
        }
        console.log(params) 
        return params;
      },
      seeDetail(promoter) {
        this.promoterId = promoter.promoterId;
        this.title = promoter.promoterName + "_结算&明细";
        this.promoterorder.status = 1;
        this.activeName = "1";
        this.loadPromoterSettle(this.getSelectTime());
      },
      loadOrderData() {
        let params = this.getSelectTime();
        this.payOrderDate = params.beginDate.split(" ")[0] + "至" + params.endDate.split(" ")[0];
        this.getAllPayorder(params);
      },
      getAllPayorder(params) {
        let boothParams = {};
        boothParams.beginDate = params.beginDate;
        boothParams.endDate = params.endDate;
        boothParams.promoterId = this.promoterId;
        boothParams.pageIndex = 1;
        boothParams.pageSize = 1000;
        boothParams.status = 1;

        this.http.get(this).url(this.config.promoterSettle.order_url).params(boothParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.allPayOrder = data;
          this.payOrderDialog = true;
        },(error) => {console.log(error)});
      },
      comfirmPayOrderDialog() { 
        this.$confirm('确认结算该订单，订单结算金额  ¥' + this.detailBoothQuery.waitSettleOrderMoney + ' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          let time = this.getSelectTime();
          let params = {};
          params.beginDate = time.beginDate;
          params.endDate = time.endDate;
          params.promoterId = this.promoterId;
          this.http.postJson(this).url(this.config.promoterSettle.account_url).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '订单结算成功!'});
            this.payOrderDialog = false;
            this.timeSearch();

          }, (err) => { console.log(err)});
        }).catch(() => { });
      },
      timeSearch() {
        this.promoterorder.status = 1;
        this.activeName = "1";
        this.loadPromoterSettle(this.getSelectTime());
      },
      loadPromoterSettle(params) {
        let boothParams = {};
        boothParams.beginDate = params.beginDate;
        boothParams.endDate = params.endDate;
        boothParams.promoterId = this.promoterId;

        this.http.get(this).url(this.config.promoterSettle.statistics_url).params(boothParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data;
          this.detailBoothQuery = data;
          this.orderDialog = true;
          
          this.findByOrder(params);

        },(error) => {console.log(error)});
      },
      handleClick() {
        console.log(this.activeName)
        if (this.activeName == "1") {
          this.promoterorder.status = 1;
          this.orderDetailData = [];
          this.findByOrder(this.getSelectTime());
        } else if (this.activeName == "2") {
          this.promoterorder.status = 2;
          this.orderDetailData = [];
          this.findByOrder(this.getSelectTime());
        } else if (this.activeName == "3") {
          this.promoterorder.status = 3;
          this.orderDetailData = [];
          this.findByOrder(this.getSelectTime());
        }
      },
      orderhandleSizeChange(val) {
        this.promoterorder.pageSize = val;
        this.findByOrder(this.getSelectTime());
      },
      orderhandleCurrentChange(val) {
        this.promoterorder.pageIndex = val;
        this.findByOrder(this.getSelectTime());
      },
      findByOrder(params) {
        let boothParams = {};
        boothParams.beginDate = params.beginDate;
        boothParams.endDate = params.endDate;
        boothParams.promoterId = this.promoterId;
        boothParams.pageIndex = this.promoterorder.pageIndex;
        boothParams.pageSize = this.promoterorder.pageSize;
        boothParams.status = this.promoterorder.status;
        this.promoterorder.loading = true;

        this.http.get(this).url(this.config.promoterSettle.order_url).params(boothParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.orderDetailData = data;
          this.promoterorder.total = response.data.data.totalSize;
          this.promoterorder.loading = false;
          
        },(error) => {console.log(error)});
      },




      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.findByPage();
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage() {
        let params = {};
        params.pageIndex = this.listQuery.pageIndex;
        params.pageSize = this.listQuery.pageSize;
        params.promoterName = this.listQuery.promoterName;
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.promoterSettle.list_url).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.dataList = data;
            this.listQuery.total = response.data.data.totalSize;
            this.listQuery.loading = false;
          },(error) => {console.log(error)}
        );
      },


    }
  }
</script>

<style lang="scss">
  #promoterSettle_vue {
    p{
      margin:0;
    }
    .select_div{
      .el-range-separator{
        width:auto;
      }
    }
    .count{
      padding: 15px 8px;
      border:1px solid #ddd;
      color:#343434;
      .tip{
        font-size: 16px;
        text-align: center;
        margin-bottom:8px;
      }
      .number{
        font-size:20px;
        text-align:center;
        font-weight: 700;
      }
    }
    
    .promoter_dialog{
      >div{
        @media screen and (max-width: 1500px){
          width:85%;
        }
        @media screen and (min-width: 1500px){
          width:75%;
        }
      }
    }
  }
</style>
