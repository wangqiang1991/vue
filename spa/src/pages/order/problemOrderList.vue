<template>
  <div class="app-container calendar-list-container">
    <div v-show="state=='list'" class="filter-container">

      <el-date-picker @change="doSearch()" v-model="listQuery.orderDate" :editable="false" :clearable="true" type="daterange"
                      class="filter-item" align="left" placeholder="申请起止日期">
      </el-date-picker>
      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 200px;" class="filter-item" placeholder="订单编号">
      </el-input>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.workNumber" style="width: 200px;" class="filter-item" placeholder="工单编号">
      </el-input>

      <el-select clearable @change="onTypeChange" style="width: 130px" class="filter-item" v-model="workType" placeholder="工单类型">
        <el-option v-for="item in workTypes" :key="item.workType" :label="item.typeName" :value="item.workType">
        </el-option>
      </el-select>

      <el-select @change="doSearch()" clearable style="width: 130px" class="filter-item" v-model="status" placeholder="工单状态">
        <el-option v-for="item in statusList" :key="item.status" :label="item.statusName" :value="item.status">
        </el-option>
      </el-select>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
      <el-button @click="reset" class="filter-item" style="margin-left: 10px;" type="primary">重置</el-button>

    </div>

    <el-table v-show="state=='list'" :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="订单编号" width="200" fixed>
        <template scope="scope">
          <span class="link-type">{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="工单编号" width="200">
        <template scope="scope">
          <span class="link-type">{{scope.row.workNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="工单类型" width="150">
        <template scope="scope">
          <span v-if="scope.row.workType == 1">退款</span>
          <span v-else-if="scope.row.workType == 2">换货</span>
          <span v-else-if="scope.row.workType == 3">退货退款</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="订单金额" width="120">
        <template scope="scope">
          <span style="color: orangered;">¥{{scope.row.money}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="退款金额" width="120">
        <template scope="scope">
          <span style="color: orangered;">¥{{scope.row.refundMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人" width="120">
        <template scope="scope">
          <span>{{scope.row.reallyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系电话" width="120">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请时间" width="150">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请售后原因">
        <template scope="scope">
          <span>{{scope.row.refundReason}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="工单状态" width="150">
        <template scope="scope">
          <!-- 退款操作对应的状态 -->
          <span v-if="scope.row.workType == 1 && scope.row.applyStatus == 1">已申请</span>
          <span v-else-if="scope.row.workType == 1 && scope.row.applyStatus == 2">已拒绝</span>
          <span v-else-if="scope.row.workType == 1 && scope.row.applyStatus == 3">退款处理中</span>
          <span v-else-if="scope.row.workType == 1 && scope.row.applyStatus == 4">退款成功</span>
          <span v-else-if="scope.row.workType == 1 && scope.row.applyStatus == 5">退款失败</span>

          <!-- 换货操作对应的状态 -->
          <span v-else-if="scope.row.workType == 2 && scope.row.applyStatus == 1">已申请</span>
          <span v-else-if="scope.row.workType == 2 && scope.row.applyStatus == 2">已拒绝</span>
          <span v-else-if="scope.row.workType == 2 && scope.row.applyStatus == 3">待收货</span>
          <span v-else-if="scope.row.workType == 2 && scope.row.applyStatus == 4">拒绝收货</span>
          <span v-else-if="scope.row.workType == 2 && scope.row.applyStatus == 5">商家已确认收货</span>
          <span v-else-if="scope.row.workType == 2 && scope.row.applyStatus == 6">客户待收货</span>
          <span v-else-if="scope.row.workType == 2 && scope.row.applyStatus == 7">客户已确认收货</span>

          <!-- 退款退货对应的状态 -->
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 1">已申请</span>
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 2">已拒绝</span>
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 3">待收货</span>
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 4">拒绝退款</span>
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 5">商家已确认收货</span>
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 6">退款处理中</span>
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 7">退款成功</span>
          <span v-else-if="scope.row.workType == 3 && scope.row.applyStatus == 8">退款失败</span>

        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150" fixed="right">
        <template scope="scope">

          <el-button size="small" type="primary" icon="edit" @click="showDetail(scope.row)">查看详情</el-button>

        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>


    <problem-order-detail ref="detail" @success="modifySuccess()" v-on:cancel="state='list'" v-show="state=='detail'">
    </problem-order-detail>

  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import ProblemOrderDetail from './problemOrderDetail.vue'


  export default {
    directives: {
      waves
    },
    components:{
      ProblemOrderDetail
    },
    mounted() {
      this.findByPage();
      this.findTypes();
    },
    created() {
      //监听通知
      this.$root.$on('refresh_problem_order_list',(target) => {
        this.findByPage();
      });
    },
    data() {
      return {
        loading: false,
        listQuery: {
          orderDate: null,
          beginDate: null,
          endDate: null,
          orderNumber: null,
          orderStatus: null,
          workType: null,
          status: null,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
        },
        dataList: [],
        state: "list", // list | detail
        workTypes: [],
        statusList: [],

        workType: null,
        status: null
      }
    },
    methods: {
      findByPage() {
        this.loading = true;
        //判断是否选择了时间查询条件
        if (this.listQuery.orderDate) {
          this.listQuery.beginDate =  parseTime(this.listQuery.orderDate[0]);
          this.listQuery.endDate = parseTime(this.listQuery.orderDate[1]);
        }

        // if (this.status) {
          this.listQuery.status = this.status;
        // }

        // if (this.workType) {
          this.listQuery.workType = this.workType;
        // }


        this.http.get(this).url(config.problemOrder.problem_order_list).params(
          this.listQuery
        ).request(function (response) {
          console.log(response);
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

      reset() {
        this.listQuery.orderDate = null;
        this.listQuery.beginDate = null;
        this.listQuery.endDate = null;
        this.listQuery.orderNumber = null;
        this.listQuery.orderStatus = null;
        this.listQuery.workType = null;
        this.listQuery.status = null;
        this.workType = null;
        this.status = null;
      },

      // 退款:1已申请 2拒绝 3退款中 4退款成功 5退款失败
      // 换货:1已申请 2拒绝 3待收货 4拒绝换货 5已确认收货 6客户待收货 7客户已确认收货
      // 退货:1已申请 2拒绝 3待收货 4拒绝退款 5已确认收货 6退款中 7退款成功 8退款失败
      findTypes() {
        this.http.get(this).url(config.problemOrder.find_status).params({
        }).request(function (response) {
          if (response.data.code == 0) {
            this.workTypes = response.data.data;
            console.log(this.workTypes);
          }
        },function (error) {
        });
      },

      onTypeChange(value) {

        this.statusList = [];
        this.status = null;

        if (value) {
          let context = this;
          this.workTypes.forEach(function (type) {
            if (type.workType == value) {
              context.statusList = type.statusList;
            }
          });
        }

        this.doSearch();
      },

      showDetail(order) {
        var loadingInstance = Loading.service({text: '正在获取订单详情...'});
        this.http.get(this).url(config.problemOrder.detail_url).restful({
          workId:order.workOrderId
        }).request(function (response) {
          console.log(response);
          loadingInstance.close();
          if (response.data.code == 0) {
            this.state = "detail";
            this.$refs.detail.loadSource(response.data.data);
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
