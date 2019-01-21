<template>
  <div>

    <el-table
    v-loading="listQuery.loading"
    :data="dataList"
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
        :page-size="listQuery.pageSize"
        :total="listQuery.total"
        :current-page="listQuery.pageIndex"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate,setLastDay} from '@/utils'
  import session from '@/utils/session'
  export default {
    data() {
      return {
        time:null,
        beginDate:null,
        endDate:null,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
        },
        dataList:[],
      }
    },
    mounted() {
      this.initDate();
    },
    methods:{
      loadData(params) {
        this.listQuery.pageIndex = 1;
        this.beginDate = params.beginDate;
        this.endDate = params.endDate;
        this.findByPage();
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
       
        this.findByPage();
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        if (!this.endDate) {
          let date = new Date();
          let lastMonth = new Date(setLastDay(date)).setHours(23,59,59);;
          this.endDate = toDate(lastMonth);
        } 
        this.findByPage();
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        if (!this.endDate) {
          let date = new Date();
          let lastMonth = new Date(setLastDay(date)).setHours(23,59,59);;
          this.endDate = toDate(lastMonth);
        } 
        this.findByPage();
      },
      findByPage() {

        let params = {};
        // params.types = this.types;
        // params.beginDate = this.beginDate;
        params.endDate = this.endDate;
        params.pageIndex = this.listQuery.pageIndex;
        params.pageSize = this.listQuery.pageSize;

        this.listQuery.loading = true;
        this.http.get(this).url(this.config.statistics.storageBalance_detail).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.dataList = data;
          this.listQuery.total = response.data.data.totalSize;
          this.listQuery.loading  = false;
          
        },(error) => {console.log(error)});
      }

    }
  }
</script>
