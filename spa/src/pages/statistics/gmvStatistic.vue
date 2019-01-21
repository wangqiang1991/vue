<template>  
    <div id="gmvData_vue" class="app-container calendar-list-container">

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
            <el-button class="fontFamily icon-browse filter-item"  style="margin-left: 12px;"  type="info" @click='deSearch'>查看订单明细</el-button>

          </div>
        </el-col>
      </el-row>
      <h2 style="margin-top:15px;margin-bottom:10px;">数据总览</h2>
      <div class="gc-praiselist_content_list" style="margin-top:15px;">

        <el-row :gutter="24" class='box_row'>
          <el-col :span="8">
            <div class="count">
              <p class="tip">订单总量</p>
              <p class="number">{{allData.orderCount}}单</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">同比增长率</p>
              <p class="number">{{((allData.orderCountUpYearRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">环比增长率</p>
              <p class="number">{{((allData.orderCountUpCycleRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="count">
              <p class="tip">下单人数</p>
              <p class="number">{{allData.memberCount}}人</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">同比增长率</p>
              <p class="number">{{((allData.memberCountUpYearRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">环比增长率</p>
              <p class="number">{{((allData.memberCountUpCycleRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="count">
              <p class="tip">订单总额</p>
              <p class="number">¥{{((allData.orderMoney / 100).toFixed(2) + "").replace(".00", "")}}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">同比增长率</p>
              <p class="number">{{((allData.orderMoneyUpYearRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">环比增长率</p>
              <p class="number">{{((allData.orderMoneyUpCycleRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="count">
              <p class="tip">订单总毛利润</p>
              <p class="number">¥{{((allData.orderProfit / 100).toFixed(2) + "").replace(".00", "")}}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">同比增长率</p>
              <p class="number">{{((allData.orderProfitUpYearRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">环比增长率</p>
              <p class="number">{{((allData.orderProfitUpCycleRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="count">
              <p class="tip">订单总毛利润率</p>
              <p class="number">{{((allData.orderProfitRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">同比增长率</p>
              <p class="number">{{((allData.orderProfitUpYearRateRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="count">
              <p class="tip">环比增长率</p>
              <p class="number">{{((allData.orderProfitUpCycleRateRiseRate / 100).toFixed(2) + "").replace(".00", "")}}%</p>
            </div>
          </el-col>

        </el-row>

      </div>
      <h2>数据趋势总览</h2>
      <div class="gc-praiselist_content_list chart_box" style="margin-top:15px;">
        
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单总量" name="1">
            <div id="chart1" class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="下单人数" name="2">
            <div id="chart2"  class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="订单总额" name="3">
            <div id="chart3"  class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="订单总毛利润" name="4">
            <div id="chart4"  class="chart_div"></div>
          </el-tab-pane>
        </el-tabs>
      </div>

      
     <el-dialog
      class="promoter_dialog"
      title="总体成交额(GMV)订单明细"
      :visible.sync="dialogVisible">  
      
      <el-button @click="printOrderDetail" class="filter-item fontFamily icon-print" type="primary">打印订单明细</el-button>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">

        <el-table
        v-loading="gmvTableListQuery.loading"
        :data="gmvTableData"
        element-loading-text="努力加载中..."
        border
        style="width: 100%;height:auto;">
          
          <el-table-column
            label="订单类型"
            align="center">
            <template scope="scope">
              <span v-if='scope.row.type == 1'>正常订单</span>
              <span v-if='scope.row.type == 2'>售后订单</span>
              <span v-if='scope.row.type == 3'>换货订单</span>
            </template>
          </el-table-column>        

          <el-table-column
            label="订单编号/子订单编号"
            width="150"
            align="center">
            <template scope="scope">
              <span style="font-size:12px;">{{ scope.row.orderNumber}}</span>
              <br>
              <span v-if="scope.row.type == 2" style="font-size:12px;">{{ scope.row.orderGoodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单收入">
            <template scope="scope">
              <span style='color:#FF9800'>¥{{ ((scope.row.orderMoney / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单成本">
            <template scope="scope">
              <span  style='color:#FF9800'>¥{{  ((scope.row.orderCostMoney / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单毛利润">
            <template scope="scope">
              <span  style='color:#FF9800'>¥{{ ((scope.row.orderProfit / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="订单毛利润率">
            <template scope="scope">
              <span>{{ ((scope.row.orderProfitRate / 100).toFixed(2) + "").replace(".00", "") }}%</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品收入">
            <template scope="scope">
              <span style='color:#FF9800'>¥{{ ((scope.row.goodsMoney / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品成本">
            <template scope="scope">
              <span  style='color:#FF9800'>¥{{ ((scope.row.goodsCostMoney / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品毛利润">
            <template scope="scope">
              <span  style='color:#FF9800'>¥{{ ((scope.row.goodsProfit / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品毛利润率">
            <template scope="scope">
              <span>{{ ((scope.row.goodsProfitRate / 100).toFixed(2) + "").replace(".00", "") }}%</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="运费收入">
            <template scope="scope">
              <span style='color:#FF9800'>¥{{ ((scope.row.expressMoney / 100).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="运费成本">
            <template scope="scope">
              <span  style='color:#FF9800'>¥{{ ((scope.row.expressCostMoney / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="运费毛利润">
            <template scope="scope">
              <span  style='color:#FF9800'>¥{{ ((scope.row.expressProfit / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="运费毛利润率">
            <template scope="scope">
              <span>{{ ((scope.row.expressProfitRate / 100).toFixed(2) + "").replace(".00", "") }}%</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="下单时间">
            <template scope="scope">
              <span>{{ scope.row.confirmDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

        </el-table>

        <div class="pagination-container" style="height:auto;width:100%;margin-top:30px;">
          <el-pagination
            :page-sizes="[10,15,20,30]"
            :page-size="gmvTableListQuery.pageSize"
            :total="gmvTableListQuery.total"
            :current-page="gmvTableListQuery.pageIndex"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>

      </div>   

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>

    </el-dialog>  


  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate,setLastDay} from '@/utils'
  import echarts from "echarts"
  import session from '@/utils/session'
  export default {
    data() {
      return {
        gmvTableData:[],
        dialogVisible:false,
        gmvTableListQuery:{
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,         
        },
        allData:{
          memberCount: 0,
          memberCountUpCycleRiseRate: 0,
          memberCountUpYearRiseRate: 0,
          orderCount: 0,
          orderCountUpCycleRiseRate:0,
          orderCountUpYearRiseRate: 0,
          orderMoney: 0,
          orderMoneyUpCycleRiseRate:0,
          orderMoneyUpYearRiseRate:0,
          orderProfit:0,
          orderProfitRate:0,
          orderProfitUpCycleRateRiseRate:0,
          orderProfitUpCycleRiseRate:0,
          orderProfitUpYearRateRiseRate:0,
          orderProfitUpYearRiseRate:0
        },
        myChart1:null,
        myChart2:null,
        myChart3:null,
        myChart4:null,
        memberCountList:{},
        orderCountList:{},
        orderMoneyList:{},
        orderProfitList:{},
        allDate:[],
        activeName:'1',
        time:null,
        beginDate:null,
        endDate:null,
        nowTime:null,
        upTime:null,
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

        this.findData();
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
      timeSearch() {
        console.log(this.time)
        if (!this.time ||this.time[0] == null || this.time[1] == null){
          this.findData();
        } else {
          let beginDate = this.time[0].setHours(0,0,0);
          let endDate = this.time[1].setHours(23,59,59);
          if(endDate - beginDate > 2678399000){
            this.$message({message: '查询日期时间间隔最多31天', type: 'warning'});
          } else {
            this.findData();
          }
        }
      },
      findData() {
        let time = this.getSelectTime();

        var nowTime = time.beginDate.split(" ")[0].split("-")[0];
        this.nowTime = nowTime;
        this.upTime = (+nowTime - 1) + '';

        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.queryGMV = true;
        this.http.get(this).url(this.config.statistics.gmv_dash).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data;
          this.allData = data;

          let memberCountList = {
            time:[],
            value:[],
            upValue:[],
          };
          let orderCountList ={
            time:[],
            value:[],
            upValue:[],
          };
          let orderMoneyList ={
            time:[],
            value:[],
            upValue:[],
          };
          let orderProfitList ={
            time:[],
            value:[],
            upValue:[],
          };

          data.memberCountList.forEach((item)=>{
            memberCountList.time.push(parseTime(item.date,'{y}-{m}-{d}'))
            memberCountList.value.push(item.value)
            memberCountList.upValue.push(item.upValue)
          })

          data.orderCountList.forEach((item)=>{
            orderCountList.time.push(parseTime(item.date,'{y}-{m}-{d}'))
            orderCountList.value.push(item.value)
            orderCountList.upValue.push(item.upValue)
          })

          data.orderMoneyList.forEach((item)=>{
            orderMoneyList.time.push(parseTime(item.date,'{y}-{m}-{d}'))
            orderMoneyList.value.push(item.value / 100)
            orderMoneyList.upValue.push(item.upValue / 100)
          })

          data.orderProfitList.forEach((item)=>{
            orderProfitList.time.push(parseTime(item.date,'{y}-{m}-{d}'))
            orderProfitList.value.push(item.value / 100)
            orderProfitList.upValue.push(item.upValue / 100)
          })                    

          this.memberCountList = memberCountList;
          this.orderCountList = orderCountList;
          this.orderMoneyList = orderMoneyList;
          this.orderProfitList = orderProfitList;

          this.setChartTable();
        },(error) => {console.log(error)});
      },
      handleClick() {
        this.setChartTable();
      },
      setChartTable() {
        if (this.activeName == '1') {
          if (!this.myChart1) {
            setTimeout(()=>{
              this.myChart1 = echarts.init(document.getElementById('chart1'))
              console.log('no chart1')
              this.setChart(1,this.orderCountList);
            },20)
          } else {
            console.log('has chart1')
            this.setChart(1,this.orderCountList);
          }
          
        } else if (this.activeName == '2') {
         if (!this.myChart2) {
            setTimeout(()=>{
              this.myChart2 = echarts.init(document.getElementById('chart2'))
              this.setChart(2,this.memberCountList);
            },20)
          } else {
            this.setChart(2,this.memberCountList);
          }
        } else if (this.activeName == '3') {
          if (!this.myChart3) {
            setTimeout(()=>{
              this.myChart3 = echarts.init(document.getElementById('chart3'))
              this.setChart(3,this.orderMoneyList);
            },20)
          } else {
            this.setChart(3,this.orderMoneyList);
          }
        } else if (this.activeName == '4') {
        if (!this.myChart4) {
            setTimeout(()=>{
              this.myChart4 = echarts.init(document.getElementById('chart4'))
              this.setChart(4,this.orderProfitList);
            },20)
          } else {
            this.setChart(4,this.orderProfitList);
          }
        } 
      },
      setChart(type,data) {

        var nowTime = this.nowTime;
        var upTime = this.upTime;
        var myChart = null;
        var yName = '';
        if (type == 1) {
          myChart = this.myChart1;
          yName = '单';
        } else if (type == 2) {
          myChart = this.myChart2;
          yName = '人';
        } else if (type == 3) {
          myChart = this.myChart3;
          yName = '金额';
        } else if (type == 4) {
          myChart = this.myChart4;
          yName = '金额';
        }

        
        if (myChart != null && myChart != "" && myChart != undefined) {
          myChart.clear();
        }

      
        myChart.setOption( {
          color: ['#4cabce', '#e5323e'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: [upTime, nowTime]
          },
          xAxis: [
            {
              name:'日期',
              type: 'category',
              axisTick: {show: false},
              data: data.time
            }
          ],
          yAxis: [
            { 
              name:yName,
              type: 'value'
            }
          ],
          series: [
            {
                name: upTime,
                type: 'bar',
                data: data.upValue,
                label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
                }
            },
            {
                name: nowTime,
                type: 'bar',
                data: data.value,
                label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
                }
            },
          ]
        },true)
      },
      handleSizeChange(val) {
        this.gmvTableListQuery.pageSize = val;
        this.findByDetail();
      },
      handleCurrentChange(val) {
        this.gmvTableListQuery.pageIndex = val;
        this.findByDetail();
      },
      deSearch() {
        this.gmvTableListQuery.pageIndex = 1;
        this.dialogVisible = true;
        this.findByDetail();
      },
      findByDetail() {
        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.pageIndex = this.gmvTableListQuery.pageIndex;
        params.pageSize = this.gmvTableListQuery.pageSize;
        
        this.gmvTableListQuery.loading = true;
        this.http.get(this).url(this.config.statistics.gmv_order_detail).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.gmvTableData = data;
          this.gmvTableListQuery.total = response.data.data.totalSize;
          this.gmvTableListQuery.loading = false;
          
        },(error) => {console.log(error)});
      },
      printOrderDetail() {
        let url = null;

        if(process.env.NODE_ENV == "production") {
          //线上url
           url =  "/api/statistics-pdf/create-statistics/总体成交额(GMV)订单明细.pdf";
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url =  "/api/statistics-pdf/create-statistics/总体成交额(GMV)订单明细.pdf";
        } else {
          //本地url
          url = "http://192.168.20.104:8888/api/statistics-pdf/create-statistics/总体成交额(GMV)订单明细.pdf";
        }

        let time = this.getSelectTime();
        let beginDate = time.beginDate;
        let endDate = time.endDate;

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken + "&beginDate=" + beginDate + "&endDate=" + endDate + "&kind=" + 1;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      }
    }
  }
</script>

<style lang="scss">
  #gmvData_vue {
    p{
      margin:0;
    }
    h2{
      margin-top: 5px;
      margin-bottom:5px;
    }
    .box_row{
      >div{
        margin-bottom: 16px;
      }
    }
    .count{
      padding: 15px 8px;
      border:1px solid #ddd;
      color:#343434;
      .tip{
        font-size: 18px;
        text-align: center;
        margin-bottom:8px;
        font-weight:700;
      }
      .number{
        font-size:14px;
        text-align:center;
        color: #FF9800;
        font-weight:700;
      }
    }
    .el-tab-pane{
      >div{
        width:100%;
        margin:auto;
        
         @media screen and (max-width: 1500px){
          height: 500px;
        }
        @media screen and (min-width: 1500px){
          height: 650px;
        }
      }
    }
    .promoter_dialog{
      >div{
        width:85%;
      }
    }
  }
</style>
