<template>
  <div class="app-container calendar-list-container">
    <div v-show="state=='list'" class="filter-container">

      <el-date-picker @change="doSearch()" v-model="listQuery.orderDate" :editable="false" :clearable="true"
                      type="daterange"
                      class="filter-item" align="left" placeholder="售后申请起止日期">
      </el-date-picker>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 235px;"
                class="filter-item" placeholder="原始主订单，原始子订单，新订单">
      </el-input>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.reallyName" style="width: 130px;"
                class="filter-item" placeholder="收货人姓名">
      </el-input>
      <el-input @keyup.enter.native="doSearch()" maxlength='11' v-model="listQuery.phone" style="width: 130px;" class="filter-item"
                placeholder="收货人手机号码">
      </el-input>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">
        筛选
      </el-button>

      <el-badge :value="choiceDatas.length" class="item">
        <el-button @click="exportOrders" :disabled="!choiceDatas.length" class="filter-item fontFamily icon-print" style="margin-left: 10px;" type="primary"  v-if="afterSaleType == 2">打印换货单</el-button>
      </el-badge>

     <!--  <el-badge :value="choiceDatas.length" class="item">
        <el-button @click="exportDelivery" :disabled="!choiceDatas.length" class="filter-item fontFamily icon-print" style="margin-left: 10px;" type="primary"  v-if="afterSaleType == 2">打印发货单</el-button>
      </el-badge> -->

    </div>

    <el-table v-show="state=='list'" :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">

      <el-table-column align="center" label="原始主订单号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.sourceOrderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="原始子订单号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.sourceOrderGoodsNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="新订单号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="售后工单编号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.sourceWorkNumber}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="订单商品金额" >
        <template scope="scope">
          <span style="color: #FF9800;">¥{{scope.row.settlementMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单运费金额" >
        <template scope="scope">
          <span style="color: #FF9800;">¥{{scope.row.expressMoney}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="收货人" >
        <template scope="scope">
          <span>{{scope.row.reallyName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收货人电话" width="130">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="售后申请时间" >
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="150">
        <template scope="scope">

          <el-button  class="fontFamily icon-browse" size="small" type="primary" @click="showDetail(scope.row)">查看详情</el-button>

        </template>
      </el-table-column>

      <el-table-column label="打印选择" align="center"   v-if="afterSaleType == 2">
        <template scope="scope">
           <el-checkbox v-model="scope.row.checked" @change="goodsCheck(scope.row)"></el-checkbox>
        </template>
      </el-table-column>


    </el-table>

    <div v-show="state=='list'" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]"
                     :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="listQuery.total">
      </el-pagination>
    </div>


    <order-detail-V2 ref="detail" @refreshOrderList='findByPage' @success="modifySuccess()" v-on:cancel="state='list'" v-show="state=='detail'">
    </order-detail-V2>

  </div>
</template>

<script>

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime,toDate} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import orderDetailV2 from './orderDetailV2.vue'
  import session from '@/utils/session'
  export default {
    props: ["afterSaleType"],
    directives: {
      waves
    },
    components: {
      orderDetailV2
    },
    mounted() {
      this.findByPage();
    },
    data() {
      return {
        loading: false,
        workTpeArray: [{type: 0, name: "订单类型"}, {type: 1, name: "正常售卖"},{type: 2, name: "售后换货"}],
        listQuery: {
          orderDate: null,
          beginDate: null,
          endDate: null,
          orderNumber: null,
          reallyName: null,
          phone: null,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          queryType: 2
        },
        choiceDatas:[],
        dataList: [],
        state: "list", // list | detail
      }
    },
    methods: {
      /*打印选项*/
      goodsCheck(data) {
        if(data.checked) {
          this.choiceDatas.push(data)
        } else {
          this.removePurchaseOrder(this.choiceDatas,data);
        }
        console.log(this.choiceDatas)
      },
      removePurchaseOrder(array,data) {
        for(var i = 0; i < array.length; i++) {
          if(array[i].orderId == data.orderId){
             console.log(i)
             array.splice(i, 1);
             break;
          }
        }
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
      /*查询订单*/
      findByPage() {
        this.loading = true;
        this.listQuery.orderStatus = this.afterSaleType;
        //this.listQuery.workType = 2;
        //判断是否选择了时间查询条件
        if (this.listQuery.orderDate && this.listQuery.orderDate[0] != null && this.listQuery.orderDate[1] != null) {
          this.listQuery.beginDate =  toDate( this.listQuery.orderDate[0].setHours(0,0,0));
          this.listQuery.endDate =  toDate( this.listQuery.orderDate[1].setHours(23,59,59));
        }  else {
          this.listQuery.beginDate =  null;
          this.listQuery.endDate =  null;
        }

        this.http.get(this).url(config.order.order_list_url).params(
          this.listQuery
        ).request(function (response) {
          //console.log(response);
          this.loading = false;
          if (response.data.code == 0) {
            response.data.data.data.forEach((item)=>{
              var flag = false;
              this.choiceDatas.forEach((goodsItem)=>{
                if (goodsItem.orderId == item.orderId) {
                  flag = true;
                }
              })

              if (flag) {
                item.checked = true;
              } else {
                item.checked = false;
              }

            }); 

            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          this.loading = false;
          this.$message.error(error);
        });
      },
      /*监听通知回调*/
      modifySuccess() {
        this.findByPage();
      },
      // 加载订单详情
      showDetail(order) {
        var loadingInstance = Loading.service({text: '正在获取订单详情...'});
        this.http.get(this).url(config.order.order_detail_url).restful({
          orderId: order.orderId
        }).request(function (response) {
          //console.log(response);
          loadingInstance.close();
          if (response.data.code == 0) {
            this.state = "detail";
            $('.order_tabs>.el-tabs__header').hide();
            response.data.data.orderListType = this.afterSaleType;
            this.$refs.detail.loadSource(response.data.data);
          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },
      // 换货单
      exportOrders() {
       let url = null;

       if(process.env.NODE_ENV == "production") {
          //线上url
           url = "/api/make-pdf/create-pdf-exchange/构巢订单换货单.pdf";
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url = "/api/make-pdf/create-pdf-exchange/构巢订单换货单.pdf";
        } else {
          //本地url
          url = "http://192.168.20.104:8888/api/make-pdf/create-pdf-exchange/构巢订单换货单.pdf";
        }

        let orderIds = [];
        this.choiceDatas.forEach((item)=>{
          orderIds.push(item.orderId);
        })

        let Ids = orderIds.join(",");
        console.log(Ids)

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken + "&orderIds=" + Ids;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
      // 发货单
      exportDelivery() {
        let url = null;

        if(process.env.NODE_ENV == "production") {
          //线上url
           url =  "/api/make-pdf/create-after-sale-sent/构巢订单发货单.pdf";
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url =  "/api/make-pdf/create-after-sale-sent/构巢订单发货单.pdf";
        } else {
          //本地url
          url = "http://192.168.20.104:8888/api/make-pdf/create-after-sale-sent/构巢订单发货单.pdf";
        }

        let orderIds = [];
        this.choiceDatas.forEach((item)=>{
          orderIds.push(item.orderId);
        })

        let Ids = orderIds.join(",");
        console.log(Ids)

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken + "&orderIds=" + Ids;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      }
    }

  }
</script>
