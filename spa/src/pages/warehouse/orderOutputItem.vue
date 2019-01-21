<template>       
  <div class="app-container calendar-list-container" id="orderOutPutItem_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple filter-container">

            <el-date-picker
              class="date_select filter-item"
              @change="doSearch"
              v-model="time"
              type="daterange"
              :placeholder="timePlaceholder">
            </el-date-picker>

            <el-input v-if='type == 2' @keyup.enter.native="doSearch()" v-model="listQuery.sourceOrderNumber" style="width: 186px !important;" class="filter-item" placeholder="原始主订单号">
            </el-input>

            <el-input v-if='type == 2' @keyup.enter.native="doSearch()" v-model="listQuery.sourceOrderGoodsNumber" style="width: 186px !important;" class="filter-item" placeholder="原始子订单号">
            </el-input>

            <el-input v-if='type == 2' @keyup.enter.native="doSearch()" v-model="listQuery.workNumber" style="width: 186px !important;" class="filter-item" placeholder="售后工单号">
            </el-input>

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 186px !important;" class="filter-item" :placeholder="(type == 1) ? '主订单号' : '新订单号'">
            </el-input>

            <el-input v-if='type == 1' @keyup.enter.native="doSearch()" v-model="listQuery.orderGoodsNumber" style="width: 186px !important;" class="filter-item" placeholder="子订单号">
            </el-input>


            <el-button @click="doSearch" class="filter-item" style="margin-left: 2px;" type="primary" v-waves  icon="search">筛选</el-button>

            <el-button v-if='outputStatus == 1' @click="orderOutPut" class="filter-item" style="margin-left: 2px;" type="info" v-waves >出库</el-button>

            <el-button @click="printOutPutOrder" :disabled="!multipleSelections.length" class="filter-item fontFamily icon-print" style="margin-left: 2px;" type="info"  v-if="outputStatus == 2">打印出库单</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          :data="dataList"
          border  
          ref="multiplePicTable" 
          @selection-change="handleSelectionChange"
          style="width: 100%;">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            v-if='type == 1'
            label="主订单号"
            align="center">
            <template scope="scope">
              <span>{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 1'
            align="center"
            label="子订单号">
            <template scope="scope">
              <span>{{scope.row.orderGoodsNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column
            v-if='type == 2'
            label="原始主订单号"
            align="center">
            <template scope="scope">
              <span>{{scope.row.sourceOrderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 2'
            align="center"
            label="原始子订单号">
            <template scope="scope">
              <span>{{scope.row.sourceOrderGoodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 2'
            label="售后工单号"
            align="center">
            <template scope="scope">
              <span>{{scope.row.workNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 2'
            align="center"
            label="新订单号">
            <template scope="scope">
              <span>{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column
            label="商品名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="SKU名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.styleName}}</span><span v-if='scope.row.styleSubName'>-{{scope.row.styleSubName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="SKU编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.styleNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='outputStatus == 1'
            :label="(type == 1) ? '支付日期' : '申请日期' "
            align="center">
            <template scope="scope">
              <span>{{scope.row.payDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='outputStatus == 2'
            label="出库日期"
            align="center">
            <template scope="scope">
              <span>{{scope.row.outputDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            type="selection"
            width="55">
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

  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate,setLastDay} from '@/utils'
  import session from '@/utils/session'
  export default{
    props:['type','outputStatus'], //type 1销售出库 2换货出库  outputStatus 1未出库 2已出库
    data() {
      return {
        multipleSelections:[],
        time:null,
        beginDate:null,
        endDate:null,
        dataList:[],
        timePlaceholder:'',
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          beginDate:null,
          endDate:null,
          orderNumber:'',
          orderGoodsNumber:'',
          sourceOrderNumber:'',
          sourceOrderGoodsNumber:'',
          workNumber:'',
          type:null,
          outputStatus:null
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= ( Date.now() - 8.64e6 );
          }
        },
      }
    },
    mounted() {
      this.setPlaceholder();
      this.findByPage();
    },
    methods:{
      setPlaceholder() {
        if (this.type == 1 && this.outputStatus == 1) {
          this.timePlaceholder = '支付日期';
        } else if (this.type == 2 && this.outputStatus == 1) {
          this.timePlaceholder = '申请日期';
        } else {
          this.timePlaceholder = '出库日期';
        }
      },
      orderOutPut() {
        if (this.multipleSelections && this.multipleSelections.length > 0) {
          this.$confirm('确认出库所选订单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: "el-button--danger"
          }).then(() => {
            let params = {};
            let recordIdsArray = [];
            this.multipleSelections.forEach((item)=>{
              recordIdsArray.push(item.recordId)
            })
            if (recordIdsArray.length) {
              params.recordIds = recordIdsArray.join(",")
            } else {
              return;
            }
            console.log(params)
            this.http.post(this).url(this.config.storage.set_order_output).params(params).request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '出库成功!'});
              this.findByPage();
            }, (err) => {console.log(err) });
          }).catch(() => {});
        } else {
          this.$message({message: "请选择需要出库的订单", type: 'warning'});
        }
      },

      handleSelectionChange(val) {
        this.multipleSelections = val;
      },
      /*加载数据*/
      loadData() {
        this.findByPage();
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
      /*查询列表*/
      findByPage() {
        let beginDate = null;
        let endDate = null;
        console.log(this.time)

        if (this.time && this.time[0] != null && this.time[1] != null) {
          beginDate =  toDate( this.time[0].setHours(0,0,0));
          endDate =  toDate( this.time[1].setHours(23,59,59));
        } 

        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          orderNumber:this.listQuery.orderNumber,
          orderGoodsNumber:this.listQuery.orderGoodsNumber, 
          sourceOrderNumber:this.listQuery.sourceOrderNumber,
          sourceOrderGoodsNumber:this.listQuery.sourceOrderGoodsNumber, 
          workNumber:this.listQuery.workNumber,
          type:this.type,
          outputStatus:this.outputStatus,
          beginDate:beginDate,
          endDate:endDate
        }


        this.listQuery.loading = true;

        this.http.get(this).url(this.config.storage.order_outPut_list).params(params).request((response) => {
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
      // 出库单打印
      printOutPutOrder() {
       let url = null;
       let recordIdsArray = [];
       let recordIds = null;
       this.multipleSelections.forEach((item)=>{
        recordIdsArray.push(item.recordId)
       })
       if (recordIdsArray.length) {
         recordIds = recordIdsArray.join(",")
       } else {
         return;
       }

       if(process.env.NODE_ENV == "production") {
          //线上url
           url = "/api/make-pdf/create-out-put-order/构巢出库单.pdf";
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url = "/api/make-pdf/create-out-put-order/构巢出库单.pdf";
        } else {
          //本地url
          url = "http://192.168.20.104:8888/api/make-pdf/create-out-put-order/构巢出库单.pdf";
        }

        if (session.isLogin()) {
          var user = session.getUser();

          url = url + "?access_token=" + user.accessToken + "&recordIds=" + recordIds;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
    }
  }
</script>

<style  lang="scss">
  #orderOutPutItem_vue{

  }
</style>
