<template>
    <div id="putStorageStatistics_vue" class="app-container calendar-list-container">
 
      <el-row :gutter="20">
        <el-col :span="20">

          <div class="grid-content bg-purple select_div">

            <el-date-picker
              class="date_select"
              @change="findData"
              v-model="endTime"
              type="date"
              :picker-options="pickerOptions"
              placeholder="查询日期">
            </el-date-picker>

            <el-button class="filter-item" style="margin-left: 12px;" type="primary" icon="search" @click="findData">查询</el-button>
            <el-button style="margin-left: 12px;" type="primary" class="filter-item fontFamily icon-print" @click="printTotal()">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">

        <el-row :gutter="24">
          <el-col :span="7">
            <div class="count">
              <p class="tip">累计库存SKU数量</p>
              <p class="number">{{allData.skuCount}}个</p>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">累计库存结余总件数</p>
              <p class="number">{{allData.count}}件</p>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">累计库存结余总额</p>
              <p class="number">¥{{(allData.money / 100).toFixed(2)}}元</p>
            </div>
          </el-col> 
        </el-row>

      </div>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">

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
          label="结存单价">
          <template scope="scope">
            <span v-if="!scope.row.count">¥ 0</span>
            <span v-else>¥{{Math.floor( ((scope.row.totalMoney / 100) / scope.row.count) * 100 ) /100}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="结存数量">
          <template scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="结存合计">
          <template scope="scope">
            <span>¥{{ (scope.row.totalMoney/ 100).toFixed(2) }}</span>
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
        endTime:null,
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
      this.initDate(true);
    },
    methods:{
      initDate(type) {

        let date = new Date();
        let lastMonth = new Date(setLastDay(date)).setHours(23,59,59);;
        this.endTime = toDate(lastMonth);

        this.findByTotal();
        this.findAllData();

        if (type) {
          let endTime =  toDate(lastMonth).split(" ")[0];
          setTimeout(()=>{
            $(".date_select>input").val(endTime)
          },200);
        }
       
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
      findData() {
       this.totalQuery.pageIndex = 1;
       if (!this.endTime) {
          this.initDate(false); 
        } else {
          if(typeof( this.endTime ) == 'object'){
            let lastMonth = this.endTime.setHours(23,59,59);;
            this.endTime = toDate(lastMonth);
            this.findByTotal();
            this.findAllData();
          }
        }

      },
      totalhandleSizeChange(val) {
        this.totalQuery.pageSize = val;
        if (!this.endTime) {
          let date = new Date();
          let lastMonth = new Date(setLastDay(date)).setHours(23,59,59);;
          this.endTime = toDate(lastMonth);
        } 
        this.findByTotal();
      },
      totalhandleCurrentChange(val) {
        this.totalQuery.pageIndex = val;
        if (!this.endTime) {
          let date = new Date();
          let lastMonth = new Date(setLastDay(date)).setHours(23,59,59);;
          this.endTime = toDate(lastMonth);
        } 
        this.findByTotal();
      },
      findByTotal() {
        console.log(this.endTime)
        let params = {};
        
        params.endDate = this.endTime;
        params.pageIndex = this.totalQuery.pageIndex;
        params.pageSize = this.totalQuery.pageSize;
      
        this.totalQuery.loading = true;
        this.http.get(this).url(this.config.statistics.storageBalance_detail).params(params).request((response) => {
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


      findAllData() {
       
        let params = {};
        
        params.endDate = this.endTime;
        this.http.get(this).url(this.config.statistics.storageBalance_total).params(params).request((response) => {
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
      //打印库存结余表
      printTotal() {
        if (!this.endTime) {
          let date = new Date();
          let lastMonth = new Date(setLastDay(date)).setHours(23,59,59);;
          this.endTime = toDate(lastMonth);
        } 
        
        let url = "/api/report-pdf/stock-remain/库存结余表.pdf";
        let params = {};
        params.endDate = this.endTime;
        params.economy = false;
        this.printPdf(url,params);
      },
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
