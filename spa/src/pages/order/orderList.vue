<template>
  <div class="app-container calendar-list-container">
    <div v-show="state=='list'" class="filter-container">

      <el-date-picker @change="doSearch()" v-model="listQuery.orderDate" :editable="false" :clearable="true" type="daterange"
                      class="filter-item" align="left" placeholder="下单起止日期">
      </el-date-picker>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 200px;" class="filter-item" placeholder="订单编号">
      </el-input>

      <el-select @change="doSearch()" clearable style="width: 130px" class="filter-item" v-model="listQuery.orderStatus" placeholder="订单状态">
        <el-option v-for="item in orderStatus" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.reallyName" style="width: 150px;" class="filter-item" placeholder="收货人姓名">
      </el-input>
      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.phone" style="width: 150px;" class="filter-item" placeholder="收货人手机号码">
      </el-input>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
      <el-button @click="reset" class="filter-item" style="margin-left: 10px;" type="primary">重置</el-button>

      <el-button @click="previewOrders" class="filter-item" style="margin-left: 10px;" type="primary">预览出库单</el-button>
      <el-button @click="exportOrders" class="filter-item" style="margin-left: 10px;" type="primary">下载出库单</el-button>

    </div>

    <el-table v-show="state=='list'" :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="订单编号" width="200" fixed>
        <template scope="scope">
          <span class="link-type">{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="订单金额" width="120">
        <template scope="scope">
          <span style="color: orangered;">¥{{scope.row.settlementMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运费金额" width="120">
        <template scope="scope">
          <span style="color: orangered;">¥{{scope.row.expressMoney}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="收货人" width="120">
        <template scope="scope">
          <span>{{scope.row.reallyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收货人电话" width="120">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="收货地址">
        <template scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单时间" width="150">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态" width="150">
        <template scope="scope">
          <span v-if="scope.row.orderStatus == 1">待付款</span>
          <span v-else-if="scope.row.orderStatus == 2">待发货</span>
          <span v-else-if="scope.row.orderStatus == 3">待收货</span>
          <span v-else-if="scope.row.orderStatus == 4">已失效</span>
          <span v-else-if="scope.row.orderStatus == 5">已完成</span>
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


    <order-detail ref="detail" @success="modifySuccess()" v-on:cancel="state='list'" v-show="state=='detail'">
    </order-detail>

  </div>
</template>

<script>

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import OrderDetail from './orderDetail.vue'
  import session from '@/utils/session'

  export default {
    directives: {
      waves

    },
    components:{
      OrderDetail
    },

    mounted() {
      this.findByPage();
    },
    created() {
      //监听通知
      this.$root.$on('refresh_order_list',(target) => {
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
          reallyName: null,
          phone: null,
          orderStatus: null,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
        },
        orderStatus: [
          {key: 1, name: "待付款"},
          {key: 2, name: "待发货"},
          {key: 3, name: "待收货"},
          {key: 4, name: "已失效"},
          {key: 5, name: "已完成"}
        ],
        dataList: [],
        state: "list", // list | detail
      }
    },
    methods: {

      reset() {
        this.listQuery.orderDate = null;
        this.listQuery.beginDate = null;
        this.listQuery.endDate = null;
        this.listQuery.orderNumber = null;
        this.listQuery.reallyName = null;
        this.listQuery.phone = null;
        this.listQuery.orderStatus = null;
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

      findByPage() {
        this.loading = true;

        //判断是否选择了时间查询条件
        if (this.listQuery.orderDate) {
          this.listQuery.beginDate =  parseTime(this.listQuery.orderDate[0]);
          this.listQuery.endDate = parseTime(this.listQuery.orderDate[1]);
        }

        this.http.get(this).url(config.order.order_list_url).params(
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

      modifySuccess() {
        this.findByPage();
      },

      showDetail(order) {

        var loadingInstance = Loading.service({text: '正在获取订单详情...'});
        this.http.get(this).url(config.order.order_detail_url).restful({
          orderId:order.orderId
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
      },
      exportOrders() {
        var url;
        /*if (process.env.API_HOST) {
          url = "/api/api/order/export/delivery";
        } else {
          url = "/api/order/export/delivery";
        }*/
        url = "/api/order/export/delivery";
        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken;
          window.open(url, "_blank");
        } else {
          alert("未登录");
        }
      },
      previewOrders() {
        var url;
        /*if (process.env.API_HOST + "") {
          url = "/api/api/order/export/delivery/preview";
        } else {
          url = "/api/order/export/delivery/preview";
        }*/
        url = "/api/order/export/delivery/preview";
        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken;
          window.open(url, "_blank");
        } else {
          alert("未登录");
        }
      }


    }

  }
</script>
