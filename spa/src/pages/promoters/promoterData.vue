<template>
    <div id="promoterData_vue" class="app-container calendar-list-container">

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

            <el-button class="filter-item" style="margin-left: 12px;" type="primary" icon="search" @click="findData">筛选</el-button>

          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">

        <el-row :gutter="24">
          <el-col :span="4">
            <div class="count">
              <p class="tip">新增用户数</p>
              <p class="number">{{newMemberCount}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">活跃用户数</p>
              <p class="number">{{activeMemberCount}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">付款订单数</p>
              <p class="number">{{paymentOrderCount}}</p>
            </div>
          </el-col> 
          <el-col :span="4">
            <div class="count">
              <p class="tip">付款订单商品总金额</p>                               
              <p class="number">¥{{paymentOrderTotalMoney ? paymentOrderTotalMoney.toFixed(2) : paymentOrderTotalMoney}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">已完成商品总金额</p>
              <p class="number">¥{{waitSettleAccountOrderTotalMoney ? waitSettleAccountOrderTotalMoney.toFixed(2) : waitSettleAccountOrderTotalMoney}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">待结算支出金额</p>
              <p class="number">¥{{waitSettleAccountOrderMoney ? waitSettleAccountOrderMoney.toFixed(2) : waitSettleAccountOrderMoney}}</p>
            </div>
          </el-col>
         
        </el-row>

      </div>

      <div class="gc-praiselist_content_list chart_box" style="margin-top:15px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="新增用户数" name="1">
            <div id="chart1" class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="活跃用户数" name="2">
            <div id="chart2"  class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="付款订单数" name="3">
            <div id="chart3"  class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="付款订单商品总金额" name="4">
            <div id="chart4"  class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="已完成商品总金额" name="5">
            <div id="chart5"  class="chart_div"></div>
          </el-tab-pane>
          <el-tab-pane label="待结算支出金额" name="6">
            <div id="chart6"  class="chart_div"></div>
          </el-tab-pane>
        </el-tabs>
      </div>

     <div class="gc-praiselist_content_list" style="margin-top:15px;">
 
        <el-table
        v-loading="boothQuery.loading"
        :data="boothData"
        element-loading-text="努力加载中..."
        border
        style="width: 100%;">

        <el-table-column type="index" align="center" label="序号" width="65"/>

        <el-table-column
          align="center"
          label="推广商名称">
          <template scope="scope">
            <span>{{ scope.row.promoterName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="新增用户数">
          <template scope="scope">
            <span>{{ scope.row.newMemberCount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="活跃用户数">
          <template scope="scope">
            <span>{{ scope.row.activeMemberCount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="付款订单数">
          <template scope="scope">
            <span>{{ scope.row.paymentOrderCount }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="付款订单商品总金额">
          <template scope="scope">
            <span>¥{{ scope.row.paymentOrderTotalMoney }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="已完成商品总金额">
          <template scope="scope">
            <span>¥{{ scope.row.waitSettleAccountOrderTotalMoney }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="待结算支出金额">
          <template scope="scope">
            <span>¥{{ scope.row.waitSettleAccountOrderMoney }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="150">
          <template scope="scope">
            <el-button size="small" class="button_detail fontFamily icon-browse" type="primary" @click="boothDetail(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>

        </el-table>

        <div class="pagination-container">
          <el-pagination
            :page-sizes="[10,15,20,30]"
            :page-size="boothQuery.pageSize"
            :current-page="boothQuery.pageIndex"
            :total="boothQuery.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="boothhandleSizeChange"
            @current-change="boothhandleCurrentChange"/>
        </div>

      </div>
    


     <el-dialog
      class="promoter_dialog"
      :title="title + '推广数据'"
      :visible.sync="boothDialog">  
      <div class="gc-praiselist_content_list">

        <el-row :gutter="24">
          <el-col :span="4">
            <div class="count">
              <p class="tip">新增用户数</p>
              <p class="number">{{detailBoothQuery.newMemberCount}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">活跃用户数</p>
              <p class="number">{{detailBoothQuery.activeMemberCount}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">付款订单数</p>
              <p class="number">{{detailBoothQuery.paymentOrderCount}}</p>
            </div>
          </el-col> 
          <el-col :span="4">
            <div class="count">
              <p class="tip">付款订单商品总金额</p>                               
              <p class="number">¥{{detailBoothQuery.paymentOrderTotalMoney ? detailBoothQuery.paymentOrderTotalMoney.toFixed(2) : detailBoothQuery.paymentOrderTotalMoney}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">已完成商品总金额</p>
              <p class="number">¥{{detailBoothQuery.waitSettleAccountOrderTotalMoney ? detailBoothQuery.waitSettleAccountOrderTotalMoney.toFixed(2) : detailBoothQuery.waitSettleAccountOrderTotalMoney}}</p>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="count">
              <p class="tip">待结算支出金额</p>
              <p class="number">¥{{detailBoothQuery.waitSettleAccountOrderMoney ? detailBoothQuery.waitSettleAccountOrderMoney.toFixed(2) : detailBoothQuery.waitSettleAccountOrderMoney}}</p>
            </div>
          </el-col>
         
        </el-row>

      </div>

      <div class="gc-praiselist_content_list chart_box1" style="margin-top:15px;">
        <el-tabs v-model="activeName1" @tab-click="handleClick1">
          <el-tab-pane label="新增用户数" name="1">
            <div id="chart10" class="chart_div1"></div>
          </el-tab-pane>
          <el-tab-pane label="活跃用户数" name="2">
            <div id="chart20"  class="chart_div1"></div>
          </el-tab-pane>
          <el-tab-pane label="付款订单数" name="3">
            <div id="chart30"  class="chart_div1"></div>
          </el-tab-pane>
          <el-tab-pane label="付款订单商品总金额" name="4">
            <div id="chart40"  class="chart_div1"></div>
          </el-tab-pane>
          <el-tab-pane label="已完成商品总金额" name="5">
            <div id="chart50"  class="chart_div1"></div>
          </el-tab-pane>
          <el-tab-pane label="待结算支出金额" name="6">
            <div id="chart60"  class="chart_div1"></div>
          </el-tab-pane>
        </el-tabs>
      </div>


      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-tabs v-model="activePromoteName">
          <el-tab-pane label="活动推广数据" name="1">
            <el-table
            v-loading="detailBoothQuery.loading"
            :data="boothDetailData"
            element-loading-text="努力加载中..."
            border
            style="width: 100%;height:auto;">

            <el-table-column type="index" align="center" label="序号" width="65"/>

            <el-table-column
              label="活动封面"
              align="center">
              <template scope="scope">
                <img :src="scope.row.cover" style="height:auto;width:100px;" >
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="活动名称">
              <template scope="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="新增用户数">
              <template scope="scope">
                <span>{{ scope.row.newMemberCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="活跃用户数">
              <template scope="scope">
                <span>{{ scope.row.activeMemberCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="付款订单数">
              <template scope="scope">
                <span>{{ scope.row.paymentOrderCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="付款订单商品总金额">
              <template scope="scope">
                <span>¥{{ scope.row.paymentOrderTotalMoney }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="已完成商品总金额">
              <template scope="scope">
                <span>¥{{ scope.row.waitSettleAccountOrderTotalMoney }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="待结算支出金额">
              <template scope="scope">
                <span>¥{{ scope.row.waitSettleAccountOrderMoney }}</span>
              </template>
            </el-table-column>
            </el-table>

            <div class="pagination-container" style="height:auto;width:100%;margin-top:30px;">
              <el-pagination
                :page-sizes="[10,15,20,30]"
                :page-size="detailBoothQuery.pageSize"
                :total="detailBoothQuery.total"
                :current-page="detailBoothQuery.pageIndex"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="boothDetailhandleSizeChange"
                @current-change="boothDetailhandleCurrentChange"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品推广数据" name="2">
            <el-table
            v-loading="goodsQuery.loading"
            :data="goodsData"
            element-loading-text="努力加载中..."
            border
            style="width: 100%;height:auto;">

            <el-table-column type="index" align="center" label="序号" width="65"/>

            <el-table-column
              label="商品封面"
              align="center">
              <template scope="scope">
                <img :src="scope.row.cover" style="height:auto;width:100px;" >
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="商品名称">
              <template scope="scope">
                <span>{{ scope.row.title }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="商品编码">
              <template scope="scope">
                <span>{{ scope.row.goodsNumber }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="新增用户数">
              <template scope="scope">
                <span>{{ scope.row.newMemberCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="活跃用户数">
              <template scope="scope">
                <span>{{ scope.row.activeMemberCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="付款订单数">
              <template scope="scope">
                <span>{{ scope.row.paymentOrderCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="付款订单商品总金额">
              <template scope="scope">
                <span>¥{{ scope.row.paymentOrderTotalMoney }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="已完成商品总金额">
              <template scope="scope">
                <span>¥{{ scope.row.waitSettleAccountOrderTotalMoney }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="待结算支出金额">
              <template scope="scope">
                <span>¥{{ scope.row.waitSettleAccountOrderMoney }}</span>
              </template>
            </el-table-column>
            </el-table>

            <div class="pagination-container" style="height:auto;width:100%;margin-top:30px;">
              <el-pagination
                :page-sizes="[10,15,20,30]"
                :page-size="goodsQuery.pageSize"
                :total="goodsQuery.total"
                :current-page="goodsQuery.pageIndex"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="goodshandleSizeChange"
                @current-change="goodshandleCurrentChange"/>
            </div>

          </el-tab-pane>
        </el-tabs>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="boothDialog = false">关 闭</el-button>
      </div>

    </el-dialog>  


  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate} from '@/utils'
  import echarts from "echarts"
  export default {
    data() {
      return {
        title:'',
        promoterId:null,
        boothDialog:false,
        chartName:null,
        chartName1:null,
        allDate:[],
        activeName:'1',
        activeName1:'1',
        activePromoteName:'1',
        newMemberCount:0,  //新增用户数
        activeMemberCount:0,  //活跃用户数
        paymentOrderCount:0,  //付款订单数
        paymentOrderTotalMoney:0,  //付款订单商品总金额
        waitSettleAccountOrderTotalMoney:0,  //已完成商品总金额
        waitSettleAccountOrderMoney:0,  //待结算支出金额
        time:null,
        beginDate:null,
        endDate:null,
        boothChartData:{},
        boothChartData:{},
        boothData:[],
        boothDetailData:[],
        boothQuery:{
          activityId:null,
          loading: false,
          pageIndex: 1,
          pageSize: 8,
          total: 0,
        },
        goodsData:[],
        goodsQuery:{
          promoterId:null,
          loading: false,
          pageIndex: 1,
          pageSize: 8,
          total: 0,
        },
        detailBoothQuery:{
          activityId:null,
          loading: false,
          pageIndex: 1,
          pageSize: 8,
          total: 0,
          newMemberCount:0,  //新增用户数
          activeMemberCount:0,  //活跃用户数
          paymentOrderCount:0,  //付款订单数
          paymentOrderTotalMoney:0,  //付款订单商品总金额
          waitSettleAccountOrderTotalMoney:0,  //已完成商品总金额
          waitSettleAccountOrderMoney:0,  //待结算支出金额
        },
        listQuery: {
          loading: false
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
      this.findData();
    },
    methods:{
      boothDetail(booth) {
        this.promoterId = booth.promoterId;
        this.activeName1 = "1";
        this.activePromoteName = '1';
        this.title = booth.promoterName;
        let params = this.getSelectTime();
        this.boothFindAll(params);
        this.findGoods(params);
      },
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
       
        let defaultTime = this.beginDate.split(" ")[0] + " - " + this.endDate.split(" ")[0];
        setTimeout(()=>{
          $(".date_select>input").val(defaultTime)
        },200);
        
      },
      handleClick() {
        this.setChartTable();
      },
      handleClick1() {
        this.setChartTable1();
      },
      setChart(id,type,data) {
        var xData = this.allDate;
        var seriesData = [];
        var name = this.chartName;
        var Yname = '';
        if (id == 1 || id == 2 || id == 3) {
          Yname = '数量';
        } else {
          Yname = '金额';
        }
        $('.chart_div').css({'width': $(".chart_box").width() });
        for (var i = 0; i < this.allDate.length; i++) {
          var flag = false;
          for (var j = 0; j < data.length; j++) {
           if (this.allDate[i] == data[j].date) {
              if (type == 1) {
                seriesData.push(data[j].count)
              } else if (type == 2) {
                seriesData.push(data[j].money)
              } 
              flag = true;
              break ;
           }
          }

          if (!flag) {
            if (type == 1) {
              seriesData.push(0)
            } else if (type == 2) {
              seriesData.push(0)
            } 
          }
        }


        var myChart;
        if (myChart != null && myChart != "" && myChart != undefined) {
          myChart.dispose();
        }
        myChart = echarts.init(document.getElementById('chart' + id))

        myChart.setOption({
          tooltip : {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            name:'日期',
            data: xData
          },
          yAxis: {
            name:Yname,
            type: 'value'
          },
          series: [{
            name:name,
            data: seriesData,
            type: 'line'
          }]
        })
      },
      setChart1(id,type,data) {
        var xData = this.allDate;
        var seriesData = [];
        var name = this.chartName1;
        var Yname = '';
        if (id == 10 || id == 20 || id == 30) {
          Yname = '数量';
        } else {
          Yname = '金额';
        }
        $('.chart_div1').css({'width':  $(".chart_box1").width() });
        for (var i = 0; i < this.allDate.length; i++) {
          var flag = false;
          for (var j = 0; j < data.length; j++) {
           if (this.allDate[i] == data[j].date) {
              if (type == 1) {
                seriesData.push(data[j].count)
              } else if (type == 2) {
                seriesData.push(data[j].money)
              } 
              flag = true;
              break ;
           }
          }

          if (!flag) {
            if (type == 1) {
              seriesData.push(0)
            } else if (type == 2) {
              seriesData.push(0)
            } 
          }
        }


        var myChart1;
        if (myChart1 != null && myChart1 != "" && myChart1 != undefined) {
          myChart1.dispose();
        }
        myChart1 = echarts.init(document.getElementById('chart' + id))

        myChart1.setOption({
          tooltip : {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            name:'日期',
            data: xData
          },
          yAxis: {
            name:Yname,
            type: 'value'
          },
          series: [{
            name:name,
            data: seriesData,
            type: 'line'
          }]
        })
      },
      findData() {
        let params = this.getSelectTime();
        var start = params.beginDate.split(" ")[0];
        var end = params.endDate.split(" ")[0];
        this.allDate = getAllDate(start,end);

        this.findAll(params)
        this.findBooth(params);
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

      boothDetailhandleSizeChange(val) {
        this.detailBoothQuery.pageSize = val
        this.loadBoothDetail(this.getSelectTime());
      },
      boothDetailhandleCurrentChange(val) {
        this.detailBoothQuery.pageIndex = val
        this.loadBoothDetail(this.getSelectTime());
      },
      loadBoothDetail(params) {
        let boothParams = {};
        boothParams.beginDate = params.beginDate;
        boothParams.endDate = params.endDate;
        boothParams.promoterId = this.promoterId;
        boothParams.pageIndex = this.detailBoothQuery.pageIndex;
        boothParams.pageSize = this.detailBoothQuery.pageSize;
        this.detailBoothQuery.loading = true;

        this.http.get(this).url(this.config.statistics.activities_list).params(boothParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.boothDetailData = data;
          this.detailBoothQuery.total = response.data.data.totalSize;
          this.detailBoothQuery.loading = false;
          
        },(error) => {console.log(error)});
      },
      boothFindAll(params) {
        let allParams = {};
        allParams.beginDate = params.beginDate;
        allParams.endDate = params.endDate;
        allParams.promoterId = this.promoterId;
        this.http.get(this).url(this.config.statistics.all_list).params(allParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data;
          this.detailBoothQuery.newMemberCount = 0;
          this.detailBoothQuery.activeMemberCount = data.activeMemberTotalCount;
          this.detailBoothQuery.paymentOrderCount = 0;
          this.detailBoothQuery.paymentOrderTotalMoney = 0;
          this.detailBoothQuery.waitSettleAccountOrderMoney = 0;
          this.detailBoothQuery.waitSettleAccountOrderTotalMoney = 0;

          data.newMemberCount.forEach((item)=>{
            this.detailBoothQuery.newMemberCount += item.count;
          });
          // data.activeMemberCount.forEach((item)=>{
          //   this.detailBoothQuery.activeMemberCount += item.count;
          // });
          data.paymentOrderCount.forEach((item)=>{
            this.detailBoothQuery.paymentOrderCount += item.count;
          });
          data.paymentOrderTotalMoney.forEach((item)=>{
            this.detailBoothQuery.paymentOrderTotalMoney += item.money;
          });
          data.waitSettleAccountOrderMoney.forEach((item)=>{
            this.detailBoothQuery.waitSettleAccountOrderMoney += item.money;
          });
          data.waitSettleAccountOrderTotalMoney.forEach((item)=>{
            this.detailBoothQuery.waitSettleAccountOrderTotalMoney += item.money;
          });

          this.boothChartData = data;
          this.boothDialog = true;
          this.loadBoothDetail(params);
          setTimeout(()=>{
            this.setChartTable1();
          },200)
          
        },(error) => {console.log(error)});
      },





      boothhandleSizeChange(val) {
        this.boothQuery.pageSize = val
        this.findBooth(this.getSelectTime());
      },
      boothhandleCurrentChange(val) {
        this.boothQuery.pageIndex = val
        this.findBooth(this.getSelectTime());
      },
      findBooth(params) {
        let boothParams = {};
        boothParams.beginDate = params.beginDate;
        boothParams.endDate = params.endDate;
        boothParams.activityId = this.boothQuery.activityId;
        boothParams.pageIndex = this.boothQuery.pageIndex;
        boothParams.pageSize = this.boothQuery.pageSize;
        this.boothQuery.loading = true;

        this.http.get(this).url(this.config.statistics.booths_list).params(boothParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.boothData = data;
          this.boothQuery.total = response.data.data.totalSize;
          this.boothQuery.loading = false;

        },(error) => {console.log(error)});
      },


      goodshandleSizeChange(val) {
        this.goodsQuery.pageSize = val
        this.findGoods(this.getSelectTime());
      },
      goodshandleCurrentChange(val) {
        this.goodsQuery.pageIndex = val
        this.findGoods(this.getSelectTime());
      },
      findGoods(params) {
        let boothParams = {};
        boothParams.beginDate = params.beginDate;
        boothParams.endDate = params.endDate;
        boothParams.promoterId = this.promoterId;
        boothParams.pageIndex = this.goodsQuery.pageIndex;
        boothParams.pageSize = this.goodsQuery.pageSize;
        this.goodsQuery.loading = true;

        this.http.get(this).url(this.config.statistics.goods_list).params(boothParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.goodsData = data;
          this.goodsQuery.total = response.data.data.totalSize;
          this.goodsQuery.loading = false;

        },(error) => {console.log(error)});
      },


      findAll(params) {
        let allParams = {};
        allParams.beginDate = params.beginDate;
        allParams.endDate = params.endDate;
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.statistics.all_list).params(allParams).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data;
          this.newMemberCount = 0;
          this.activeMemberCount = data.activeMemberTotalCount;
          this.paymentOrderCount = 0;
          this.paymentOrderTotalMoney = 0;
          this.waitSettleAccountOrderMoney = 0;
          this.waitSettleAccountOrderTotalMoney = 0;

          data.newMemberCount.forEach((item)=>{
            this.newMemberCount += item.count;
          });
          // data.activeMemberCount.forEach((item)=>{
          //   this.activeMemberCount += item.count;
          // });
          data.paymentOrderCount.forEach((item)=>{
            this.paymentOrderCount += item.count;
          });
          data.paymentOrderTotalMoney.forEach((item)=>{
            this.paymentOrderTotalMoney += item.money;
          });
          data.waitSettleAccountOrderMoney.forEach((item)=>{
            this.waitSettleAccountOrderMoney += item.money;
          });
          data.waitSettleAccountOrderTotalMoney.forEach((item)=>{
            this.waitSettleAccountOrderTotalMoney += item.money;
          });

          this.promoterData = data;
          this.listQuery.loading = false;
          this.setChartTable();
        },(error) => {console.log(error)});
      },
      setChartTable() {
        if (this.activeName == '1') {
          this.chartName = "新增用户数量";
          this.setChart(1,1,this.promoterData.newMemberCount);
        } else if (this.activeName == '2') {
          this.chartName = "活跃用户数量";
          this.setChart(2,1,this.promoterData.activeMemberCount);
        } else if (this.activeName == '3') {
          this.chartName = "付款订单数量";
          this.setChart(3,1,this.promoterData.paymentOrderCount);
        } else if (this.activeName == '4') {
          this.chartName = "付款订单商品总金额";
          this.setChart(4,2,this.promoterData.paymentOrderTotalMoney);
        } else if (this.activeName == '5') {
          this.chartName = "已完成商品总金额";
          this.setChart(5,2,this.promoterData.waitSettleAccountOrderTotalMoney);
        } else if (this.activeName == '6') {
          this.chartName = "待结算支出金额";
          this.setChart(6,2,this.promoterData.waitSettleAccountOrderMoney);
        }
      },
      setChartTable1() {
        if (this.activeName1 == '1') {
          this.chartName1 = "新增用户数量";
          this.setChart1(10,1,this.boothChartData.newMemberCount);
        } else if (this.activeName1 == '2') {
          this.chartName1 = "活跃用户数量";
          this.setChart1(20,1,this.boothChartData.activeMemberCount);
        } else if (this.activeName1 == '3') {
          this.chartName1 = "付款订单数量";
          this.setChart1(30,1,this.boothChartData.paymentOrderCount);
        } else if (this.activeName1 == '4') {
          this.chartName1 = "付款订单商品总金额";
          this.setChart1(40,2,this.boothChartData.paymentOrderTotalMoney);
        } else if (this.activeName1 == '5') {
          this.chartName1 = "已完成商品总金额";
          this.setChart1(50,2,this.boothChartData.waitSettleAccountOrderTotalMoney);
        } else if (this.activeName1 == '6') {
          this.chartName1 = "待结算支出金额";
          this.setChart1(60,2,this.boothChartData.waitSettleAccountOrderMoney);
        }
      },

    }
  }
</script>

<style lang="scss">
  #promoterData_vue {
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
    .el-tab-pane{
      >div{
        width:600px;
        margin:auto;
        
         @media screen and (max-width: 1500px){
          height: 400px;
        }
        @media screen and (min-width: 1500px){
          height: 550px;
        }
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
