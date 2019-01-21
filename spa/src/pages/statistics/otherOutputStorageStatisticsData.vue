<template>
    <div id="putStorageStatistics_vue" class="app-container calendar-list-container">
 
      <el-row :gutter="20">
        <el-col :span="20">

          <div class="grid-content bg-purple select_div">

            <el-date-picker
              class="date_select"
              @change="findData"
              v-model="time"
              type="daterange"
              :picker-options="pickerOptions"
              placeholder="查询日期">
            </el-date-picker>

            <el-button class="filter-item" style="margin-left: 12px;" type="primary" icon="search" @click="findData">查询</el-button>

          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">

        <el-row :gutter="24">
          <el-col :span="7">
            <div class="count">
              <p class="tip">累计其他出库SKU数量</p>
              <p class="number">{{allData.skuCount}}个</p>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">累计其他出库商品数量</p>
              <p class="number">{{allData.count}}件</p>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">累计其他出库总额</p>
              <p class="number">¥{{(allData.money / 100).toFixed(2)}}元</p>
            </div>
          </el-col> 
        </el-row>

      </div>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="商品其他出库汇总表" name="1">
            <p style="text-align:right;margin-bottom:15px;"><el-button  type="primary" class="fontFamily icon-print" @click="printTotal()">打印汇总表</el-button></p>
            <el-table
            v-loading="totalQuery.loading"
            :data="totalData"
            element-loading-text="努力加载中..."
            border
            style="width: 100%;">

            <el-table-column type="index" align="center" label="序号" width="65"/>

            <el-table-column
              align="center"
              label="商品SKU名称">
              <template scope="scope">
                <span>{{ scope.row.title + '-' +scope.row.styleName + scope.row.styleSubName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="商品SKU编码">
              <template scope="scope">
                <span>{{ scope.row.goodsNumber }}{{ scope.row.styleNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="出库数量">
              <template scope="scope">
                <span>{{ scope.row.count }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="合计">
              <template scope="scope">
                <span>¥{{ (scope.row.money/ 100).toFixed(2) }}</span>
              </template>
            </el-table-column>

            </el-table>

            <div class="pagination-container">
              <el-pagination
                :page-sizes="[10,15,20,30]"
                :page-size="totalQuery.pageSize"
                :total="totalQuery.total"
                :current-page="totalQuery.pageIndex"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="totalhandleSizeChange"
                @current-change="totalhandleCurrentChange"/>
            </div>

          </el-tab-pane>

          <el-tab-pane label="商品其他出库明细表" name="2">
            <p style="text-align:right;margin-bottom:15px;"><el-button type="primary" class="fontFamily icon-print" @click="printDetail()">打印明细表</el-button></p>
            <el-table
            v-loading="detailQuery.loading"
            :data="detailData"
            element-loading-text="努力加载中..."
            border
            style="width: 100%;">

            <el-table-column type="index" align="center" label="序号" width="65"/>

            <el-table-column
              align="center"
              label="调拨单/借出单编码">
              <template scope="scope">
                <span>{{ scope.row.orderNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="出库类型">
              <template scope="scope">
                <span v-if="scope.row.type == 2">借出出库</span>
                <span v-if="scope.row.type == 3">调拨出库</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="商品SKU名称">
              <template scope="scope">
                <span>{{ scope.row.title + '-' +scope.row.styleName + scope.row.styleSubName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="商品SKU编码">
              <template scope="scope">
                <span>{{ scope.row.goodsNumber }}{{ scope.row.styleNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="出库数量">
              <template scope="scope">
                <span>{{ scope.row.count }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="出库单价">
              <template scope="scope">
                <span>¥{{ (scope.row.price/ 100).toFixed(2) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="合计">
              <template scope="scope">
                <span>¥{{ (scope.row.totalCostMoney/ 100).toFixed(2) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="出库时间">
              <template scope="scope">
                <span>{{ scope.row.outputDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>

            </el-table>

            <div class="pagination-container">
              <el-pagination
                :page-sizes="[10,15,20,30]"
                :page-size="detailQuery.pageSize"
                :total="detailQuery.total"
                :current-page="detailQuery.pageIndex"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="detailhandleSizeChange"
                @current-change="detailhandleCurrentChange"/>
            </div>

          </el-tab-pane>
        </el-tabs>
      </div>

  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate,setLastDay} from '@/utils'
  import session from '@/utils/session'
  export default {
    data() {
      return {
        activeName:'1',
        totalData:[],
        detailData:[],
        allData:{
          count:0,
          money:0,
          skuCount:0,
        },
        time:null,
        beginDate:null,
        endDate:null,
        totalQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
        },
        detailQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
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
    },
    methods:{
      initDate() {
        this.time = [];
        let date = new Date();
        let lastMonth = new Date(setLastDay(date));
        let endDate = lastMonth.setHours(23,59,59);

        let date1 = new Date();
        let lastMonth1 = new Date(setLastDay(date1));
        let beginDate = new Date(lastMonth1.setDate(1)).setHours(0,0,0);
        this.time[0] = beginDate;
        this.time[1] = endDate;

        this.beginDate = toDate(beginDate);
        this.endDate = toDate(endDate);
       
        let defaultTime = this.beginDate.split(" ")[0] + " - " + this.endDate.split(" ")[0];
        setTimeout(()=>{
          $(".date_select>input").val(defaultTime)
        },200);
        
        this.findByTotal();
        this.findByDetail();
        this.findAllData();
      },
      getSelectTime() {
        let params = {};
        if (!this.time ||this.time[0] == null || this.time[1] == null){
          params.beginDate = this.beginDate;
          params.endDate = this.endDate;

          let defaultTime = this.beginDate.split(" ")[0] + " - " + this.endDate.split(" ")[0];
          setTimeout(()=>{
            $(".date_select>input").val(defaultTime)
          },200);
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
      findData() {
        this.totalQuery.pageIndex = 1;
        this.detailQuery.pageIndex = 1;
        this.findByTotal();
        this.findByDetail();
        this.findAllData();
      },

      totalhandleSizeChange(val) {
        this.totalQuery.pageSize = val;
        this.findByTotal();
      },
      totalhandleCurrentChange(val) {
        this.totalQuery.pageIndex = val;
        this.findByTotal();
      },
      findByTotal() {
        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.types = '2,3';
        params.pageIndex = this.totalQuery.pageIndex;
        params.pageSize = this.totalQuery.pageSize;
      
        this.totalQuery.loading = true;
        this.http.get(this).url(this.config.statistics.outputStorageStatistics_items).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.totalData = data;
          this.totalQuery.total = response.data.data.totalSize;
          this.totalQuery.loading  = false;
          
        },(error) => {console.log(error)});
      },

      detailhandleSizeChange(val) {
        this.detailQuery.pageSize = val;
        this.findByDetail();
      },
      detailhandleCurrentChange(val) {
        this.detailQuery.pageIndex = val;
        this.findByDetail();
      },
      findByDetail() {
        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.types = '2,3';
        params.pageIndex = this.detailQuery.pageIndex;
        params.pageSize = this.detailQuery.pageSize;
        
        this.detailQuery.loading = true;
        this.http.get(this).url(this.config.statistics.outputStorageStatistics_details).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.detailData = data;
          this.detailQuery.total = response.data.data.totalSize;
          this.detailQuery.loading = false;
          
        },(error) => {console.log(error)});
      },

      findAllData() {
        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.types = '2,3';
        this.http.get(this).url(this.config.statistics.outputStorageStatistics_total).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data;
          this.allData = data;
        },(error) => {console.log(error)});
      },
      /*打印PDF接口*/
      printPdf(configUrl,params) {
        let url = null;

        if(process.env.NODE_ENV == "production") {
          //线上url
           url = configUrl;
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url = configUrl;
        } else {
          //本地url
          url = "http://192.168.20.104:8888" + configUrl;
        }

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken;
          for(var key in params){
            url = url + "&" + key + "=" + params[key];
          }    
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
      //打印汇总表
      printTotal() {
        let time = this.getSelectTime();
        let url = "/api/report-pdf/sale-summary/商品其他出库汇总表.pdf";
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.types = '2,3';
        params.kind = 2;
        params.economy = false;
        this.printPdf(url,params);
      },
      //打印明细表
      printDetail() {
        let time = this.getSelectTime();
        let url = "/api/report-pdf/sale-details/商品其他出库明细表.pdf";
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.types = '2,3';
        params.kind = 2;
        params.economy = false;
        this.printPdf(url,params);
      }
    }
  }
</script>

<style lang="scss">
  #putStorageStatistics_vue {
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
  }
</style>
