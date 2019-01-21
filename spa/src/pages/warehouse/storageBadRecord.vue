<template>
  <div class="app-container calendar-list-container" id="orderWarehouse_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">  
          <div class="grid-content bg-purple">

          <el-date-picker @change="doSearch()" v-model="orderDate" :editable="false" :clearable="true"  type="daterange" class="filter-item"  align="left" placeholder="报损起止日期">
          </el-date-picker>

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.recordNumber" style="width: 200px !important;" class="filter-item" placeholder="请输入报损单编码">
          </el-input>

          <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves  icon="search">搜索</el-button>

          </div>
        </el-col>
      </el-row>
      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-table
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          :data="dataList"
          border
          style="width: 100%;">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="报损单编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.recordNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品SKU名称">
            <template scope="scope">
              <span>{{scope.row.goodsTitle}}-{{scope.row.styleName}}-{{scope.row.styleSubName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品SKU编码">
            <template scope="scope">
              <span>{{scope.row.skuNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="报损数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="报损程度"
            align="center">
            <template scope="scope">
              <span>{{scope.row.damageDegree}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="报损来源">
            <template scope="scope">
              <span v-if="scope.row.type == 1">仓库报损</span>
              <span v-else-if="scope.row.type == 3">退换货报损</span>
              <span v-else-if="scope.row.type == 2">借出报损</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="报损时间"
            align="center">
            <template scope="scope">
              <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
             <el-button size="small" class="fontFamily icon-browse" type="primary" @click="seeDetail(scope.row)">查看详情</el-button>
            </template>
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

      <el-dialog  title="报损单详情"  :visible.sync="detailVisible" class="detailDialog">
        <div class="exchangeGoods_div">
          <p class="orderWarehouse_detail">报损单编号:<span>{{exchangeDataDetail.recordNumber}}</span></p>
          <p class="orderWarehouse_detail" style="overflow:hidden;" ><span style="float:left;font-weight:400;">商品SKU封面:</span><span><img :src="exchangeDataDetail.skuCover" style="width:80px;height:80px;"></span></p>
          <p class="orderWarehouse_detail">商品编号:<span>{{exchangeDataDetail.goodsNumber}}</span></p>
          <p class="orderWarehouse_detail">商品名称:<span>{{exchangeDataDetail.goodsTitle}}</span></p>
          <p class="orderWarehouse_detail">SKU编号:<span>{{exchangeDataDetail.skuNumber}}</span></p>
          <p class="orderWarehouse_detail">SKU名称:<span>{{exchangeDataDetail.styleName + '-' + exchangeDataDetail.styleSubName}}</span></p>
          <p class="orderWarehouse_detail">报损数量:<span>{{exchangeDataDetail.count}}</span></p>
          <p class="orderWarehouse_detail">报损程度:<span>{{exchangeDataDetail.damageDegree}}</span></p>
          <p class="orderWarehouse_detail">报损来源:

            <span v-if="exchangeDataDetail.type == 1">仓库报损</span>
            <span v-else-if="exchangeDataDetail.type == 3">退换货报损</span>
            <span v-else-if="exchangeDataDetail.type == 2">借出报损</span>
            <span v-else>无</span>
            
          </p>

          <p class="orderWarehouse_detail">报损时间:<span>{{exchangeDataDetail.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span></p>
          <p class="orderWarehouse_detail">报损备注:<span>{{exchangeDataDetail.description}}</span></p>

        </div>
      </el-dialog>


  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  export default{
    data() {
      return {
        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          recordNumber:'',
          goodsNumber:''
        },
        detailVisible:false,
        orderDate:null,
        exchangeDataDetail:{}
      }
    },
    mounted() {
      this.findByPage();
    },
    methods:{
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
      findByPage() {
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          recordNumber:this.listQuery.recordNumber,
        };

        this.listQuery.loading = true;

        if (this.orderDate && this.orderDate[0] && this.orderDate[1]) {
          params.beginDate = parseTime(this.orderDate[0]);
          params.endDate = parseTime(this.orderDate[1].setHours(23,59,59));
        } else {
          params.beginDate = null;
          params.endDate = null;
        }

        this.http.get(this).url(this.config.storage.storageBad_list).params(params).request((response) => {
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
      seeDetail(data) {
        this.exchangeDataDetail = data;
        this.detailVisible = true;
      }
    }
  }
</script>

<style  lang="scss">
  #orderWarehouse_vue{
    .styleMessage{
      width:100%;
      height:auto;
      overflow:hidden;
      >p{
        width:50%;
        float:left;
        >span{
          font-weight:700;
          margin-left:4px;
        }
      }
    }
    .exchangeGoods_div{
      overflow:hidden;
      >p{
        float:left;
        width:50%;
        span{
          font-weight:700;
          margin-left: 4px;
        }
      }
    }
  }
</style>
