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
            <el-button  style="margin-left: 12px;" type="primary" class="filter-item fontFamily icon-print" @click="printTotal()">打印</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">

        <el-row :gutter="24" style="margin-bottom:10px;">
          <el-col :span="7">
            <div class="count">
              <p class="tip">累计采购入库总额</p>
              <p class="number">¥{{(allData.putStorageMoney / 100).toFixed(2)}}元</p>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">累计其他入库总额</p>
              <p class="number">¥{{(allData.otherPutStorageMoney / 100).toFixed(2)}}元</p>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">累计销售出库总额</p>
              <p class="number">¥{{(allData.outputStorageMoney / 100).toFixed(2)}}元</p>
            </div>
          </el-col> 
        </el-row>


        <el-row :gutter="24" style="margin-bottom:10px;">
          <el-col :span="7">
            <div class="count">
              <p class="tip">累计其他出库总额</p>
              <p class="number">¥{{(allData.otherOutputStorageMoney / 100).toFixed(2)}}元</p>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">结余</p>
              <p class="number">¥{{(allData.goodsStorageMoney / 100).toFixed(2)}}元</p>
            </div>
          </el-col>

          <el-col :span="7" :offset="1">
            <div class="count">
              <p class="tip">报损总额</p>
              <p class="number">¥{{(allData.badStorageMoney / 100).toFixed(2)}}元</p>
            </div>
          </el-col>

        </el-row>

      </div>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="采购入库汇总表" name="1">
            <itemPutStorageTotal ref="itemPutStorageTotal" :types="1"> </itemPutStorageTotal>
          </el-tab-pane>

          <el-tab-pane label="采购入库明细表" name="2">
            <itemPutStorageDetail ref="itemPutStorageDetail" :types="1"> </itemPutStorageDetail>
          </el-tab-pane>

          <el-tab-pane label="其他入库汇总表" name="3">
            <itemPutStorageTotal ref="itemPutStorageTotal1" :types="'2,3'"> </itemPutStorageTotal>
          </el-tab-pane>

          <el-tab-pane label="其他入库明细表" name="4">
            <itemPutStorageDetail ref="itemPutStorageDetail1" :types="'2,3'"> </itemPutStorageDetail>
          </el-tab-pane>

          <el-tab-pane label="销售出库汇总表" name="5">
            <itemOutputStorageTotal ref="itemOutputStorageTotal" :types="1"> </itemOutputStorageTotal>
          </el-tab-pane>

          <el-tab-pane label="销售出库明细表" name="6">
            <itemOutputStorageDetail ref="itemOutputStorageDetail" :types="1"> </itemOutputStorageDetail>
          </el-tab-pane>

          <el-tab-pane label="其他出库汇总表" name="7">
            <itemOutputStorageTotal ref="itemOutputStorageTotal1" :types="'2,3'"> </itemOutputStorageTotal>
          </el-tab-pane>

          <el-tab-pane label="其他出库明细表" name="8">
            <itemOutputStorageDetail ref="itemOutputStorageDetail1" :types="'2,3'"> </itemOutputStorageDetail>
          </el-tab-pane>

          <el-tab-pane label="库存结余表" name="9">
            <itemBalance ref="itemBalance"> </itemBalance>
          </el-tab-pane>

          <el-tab-pane label="商品销售数据汇总表" name="10">
            <itemgoodsSalesTotal ref="itemgoodsSalesTotal"> </itemgoodsSalesTotal>
          </el-tab-pane>

          <el-tab-pane label="商品销售数据明细表" name="11">
            <itemgoodsSalesDetail ref="itemgoodsSalesDetail"> </itemgoodsSalesDetail>
          </el-tab-pane>

          <el-tab-pane label="商品报损数据汇总表" name="12">
            <itemBadStorageTotal ref="itemBadStorageTotal"> </itemBadStorageTotal>
          </el-tab-pane>

          <el-tab-pane label="商品报损数据明细表" name="13">
            <itemBadStorageDetail ref="itemBadStorageDetail"> </itemBadStorageDetail>
          </el-tab-pane>

        </el-tabs>
      </div>

  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate,setLastDay} from '@/utils'
  import session from '@/utils/session'
  import itemPutStorageTotal from './itemPutStorageTotal.vue'
  import itemPutStorageDetail from './itemPutStorageDetail.vue'
  import itemOutputStorageTotal from './itemOutputStorageTotal.vue'
  import itemOutputStorageDetail from './itemOutputStorageDetail.vue'
  import itemBalance from './itemBalance.vue'
  import itemgoodsSalesTotal from './itemgoodsSalesTotal.vue'
  import itemgoodsSalesDetail from './itemgoodsSalesDetail.vue'
  import itemBadStorageTotal from './itemBadStorageTotal.vue'
  import itemBadStorageDetail from './itemBadStorageDetail.vue'
  export default {
    components: {
      itemPutStorageTotal:itemPutStorageTotal,
      itemPutStorageDetail:itemPutStorageDetail,
      itemOutputStorageTotal:itemOutputStorageTotal,
      itemOutputStorageDetail:itemOutputStorageDetail,
      itemBalance:itemBalance,
      itemgoodsSalesTotal:itemgoodsSalesTotal,
      itemgoodsSalesDetail:itemgoodsSalesDetail,
      itemBadStorageTotal:itemBadStorageTotal,
      itemBadStorageDetail:itemBadStorageDetail,
    },
    data() {
      return {
        activeName:'1',
        allData:{
          count:0,
          money:0,
          skuCount:0,
        },
        time:null,
        beginDate:null,
        endDate:null,

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
      findData() {
        let time = this.getSelectTime();
        this.findAllData();
        this.$refs.itemPutStorageTotal.loadData(time);
        this.$refs.itemPutStorageTotal1.loadData(time);
        this.$refs.itemPutStorageDetail.loadData(time);
        this.$refs.itemPutStorageDetail1.loadData(time);
        this.$refs.itemOutputStorageTotal.loadData(time);
        this.$refs.itemOutputStorageTotal1.loadData(time);
        this.$refs.itemOutputStorageDetail.loadData(time);
        this.$refs.itemOutputStorageDetail1.loadData(time);
        this.$refs.itemBalance.loadData(time);
        this.$refs.itemgoodsSalesTotal.loadData(time);
        this.$refs.itemgoodsSalesDetail.loadData(time);
        this.$refs.itemBadStorageTotal.loadData(time);
        this.$refs.itemBadStorageDetail.loadData(time);
      },
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
      findAllData() {
        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        this.http.get(this).url(this.config.statistics.financeStorageStatistics_total).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data;
          console.log(data)
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
        
        let time = this.getSelectTime();
        let url = null;
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.economy = true;
        if (this.activeName == '1') {
          url = "/api/report-pdf/storage-summary/商品采购入库汇总表.pdf";
          params.types = '1';
          params.kind = 1;
        } else if (this.activeName == '2') {
          url = "/api/report-pdf/storage-details/商品采购入库明细表.pdf";
          params.types = '1';
          params.kind = 1;
        } else if (this.activeName == '3') {
          url = "/api/report-pdf/storage-summary/商品其他入库汇总表.pdf";

          params.types = '2,3';
          params.kind = 2;
        } else if (this.activeName == '4') {
          url = "/api/report-pdf/storage-details/商品其他入库明细表.pdf";

          params.types = '2,3';
          params.kind = 2;
        } else if (this.activeName == '5') {
         url = "/api/report-pdf/sale-summary/商品销售出库汇总表.pdf";

        params.types = '1';
        params.kind = 1;
        } else if (this.activeName == '6') {
         url = "/api/report-pdf/sale-details/商品销售出库明细表.pdf";

        params.types = '1';
        params.kind = 1;
        } else if (this.activeName == '7') {
         url = "/api/report-pdf/sale-summary/商品其他出库汇总表.pdf";

        params.types = '2,3';
        params.kind = 2;
        } else if (this.activeName == '8') {
         url = "/api/report-pdf/sale-details/商品其他出库明细表.pdf";

        params.types = '2,3';
        params.kind = 2;
        } else if (this.activeName == '9') {
         url = "/api/report-pdf/stock-remain/库存结余表.pdf";

        } else if (this.activeName == '10') {
          url = "/api/report-pdf/sale-report-summary/商品销售数据汇总表.pdf";

        } else if (this.activeName == '11') {
          url = "/api/report-pdf/sale-report-details/商品销售数据明细表.pdf";

        } else if (this.activeName == '12') {
          url = "/api/report-pdf/report-damage-summary/商品报损数据汇总表.pdf";

        } else if (this.activeName == '13') {
          url = "/api/report-pdf/report-damage-details/商品报损数据明细表.pdf";

        }



        if (!url) {
          this.$message.error("打印路径不正确");
        } else {
          this.printPdf(url,params);  
        }
        
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

  .goods_style_message{
    margin-top: 15px;
    margin-bottom: 15px;
    overflow:hidden;
  }
  .goods_style_message>span{
    display:block;
    width:25%;
    float:left;
    text-align:left;
  }
  }
</style>
