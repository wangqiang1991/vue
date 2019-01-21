<template>
  <div class="app-container calendar-list-container">
    <div v-show="state=='list'" class="filter-container">

      <el-date-picker @change="doSearch()" v-model="listQuery.orderDate" :editable="false" :clearable="true" type="daterange"
                      class="filter-item" align="left" placeholder="申请起止日期">
      </el-date-picker>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 200px;" class="filter-item" placeholder="订单号(子订单号)">
      </el-input>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.workNumber" style="width: 200px;" class="filter-item" placeholder="售后工单编号">
      </el-input>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>

    </div>

    <el-table v-show="state=='list'" :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="原始主订单编号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.sourceOrderNumber || scope.row.masterOrderNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="原始子订单编号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.sourceOrderGoodsNumber || scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="售后订单号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="工单编号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.workNumber}}</span>
        </template>
      </el-table-column>
      

      <el-table-column align="center" label="新订单号" v-if='orderWorkType == 2 && (status == 5 || status == 6 || status == 7)'>
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.newOrderNumber}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="订单商品金额">
        <template scope="scope">
          <span style="color: #FF9800;">¥{{scope.row.money}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单运费金额">
        <template scope="scope">
          <span style="color: #FF9800;">¥{{scope.row.expressMoney ? scope.row.expressMoney : 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="合计">
        <template scope="scope">
          <span style="color: #FF9800;">¥{{ ((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "")  }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="购买数量" v-if="orderWorkType != 1">
        <template scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="换货数量" v-if="orderWorkType == 2">
        <template scope="scope">
          <span>{{scope.row.applyCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="退货数量" v-if="orderWorkType == 3">
        <template scope="scope">
          <span>{{scope.row.applyCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="退款金额" v-if="orderWorkType != 2">
        <template scope="scope">
          <span style="color: #FF9800;">¥{{scope.row.refundMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人">
        <template scope="scope">
          <span>{{scope.row.reallyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系电话" width="130">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请时间">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="退款原因" v-if="orderWorkType == 1">
        <template scope="scope">
          <span>{{scope.row.refundReason}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="换货原因" v-if="orderWorkType == 2">
        <template scope="scope">
          <span>{{scope.row.refundReason}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="退货原因" v-if="orderWorkType == 3">
        <template scope="scope">
          <span>{{scope.row.refundReason}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="150">
        <template scope="scope">

          <el-button  class="fontFamily icon-browse" size="small" type="primary" @click="showDetail(scope.row)">查看详情</el-button>

        </template>
      </el-table-column>

    </el-table>

    <div v-show="state=='list'" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>


    <problem-order-detail ref="detail" @refreshOrderList='findByPage' @success="modifySuccess()" v-on:cancel="state='list'" v-show="state=='detail'">
    </problem-order-detail>

  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime,toDate} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import ProblemOrderDetail from './problemOrderDetailV2.vue'

  export default {
    props:["orderWorkType",'status','type'],  //orderWorkType 1退款 2换货 3退货 
    directives: {
      waves
    },
    components:{
      ProblemOrderDetail
    },
    mounted() {
      console.log(this.orderWorkType,this.status,this.type)
      this.findByPage();
    },
    data() {
      return {
        loading: false,
        showSelect:true,
        listQuery: {
          orderDate: null,
          beginDate: null,
          endDate: null,
          orderNumber: null,
          orderStatus: null,
          workType: null,
          workNumber:"",
          status: "",
          pageIndex: 1,
          pageSize: 15,
          total: 0,
        },
        workTypeArray:[],
        dataList: [],
        state: "list", // list | detail
        workTypes: [],
        statusList: [],
      }
    },
    methods: {
      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        
        this.findByPage();
      },
      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage() {
        this.loading = true;
        //判断是否选择了时间查询条件
        if (this.listQuery.orderDate && this.listQuery.orderDate[0] != null && this.listQuery.orderDate[1] != null) {
          this.listQuery.beginDate =  toDate( this.listQuery.orderDate[0].setHours(0,0,0));
          this.listQuery.endDate =  toDate( this.listQuery.orderDate[1].setHours(23,59,59));
        }  else {
          this.listQuery.beginDate =  null;
          this.listQuery.endDate =  null;
        }

        this.listQuery.workType = this.orderWorkType;


        if (this.orderWorkType == 3 && this.status == 0) {
          this.listQuery.status = null;
          this.listQuery.queryRefundExchangeDelivery = true;
        } else if (this.orderWorkType == 2 && this.status == 0) {
          this.listQuery.status = null;
          this.listQuery.queryExchangeDelivery = true;
        } else {
          this.listQuery.status = this.status;
        }

        this.http.get(this).url(config.problemOrder.problem_order_list).params(
          this.listQuery
        ).request(function (response) {
          //console.log(response);
          this.loading = false;
          if (response.data.code == 0) {
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }

        },function (error) {
          this.loading = false;
          this.$message.error(error);
        });

      },
      /*查看详情*/
      showDetail(order) {
        var loadingInstance = Loading.service({text: '正在获取订单详情...'});
        this.http.get(this).url(config.problemOrder.detail_url).restful({
          workId:order.workOrderId
        }).request(function (response) {
          console.log(response);
          loadingInstance.close();
          if (response.data.code == 0) {
            this.state = "detail";
            $('.problemOrder_tabs>.el-tabs__header').hide();
            this.$refs.detail.loadSource(response.data.data,this.type);
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      }
    }
  }
</script>
