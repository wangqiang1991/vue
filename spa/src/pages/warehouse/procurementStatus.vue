<template>   
  <div class="app-container calendar-list-container" id="procurementStatus_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 200px !important;" class="filter-item" placeholder="输入采购项编码">
            </el-input>

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.skuNumber" style="width: 200px !important;" class="filter-item" placeholder="输入商品SKU编码">
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
            label="采购项编码"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品名称">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.goodsTitle}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品SKU名称"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.styleName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品SKU编码"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.skuNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="计划采购数量"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.count}}</span>
            </template>
          </el-table-column>

           <el-table-column
            label="已完成采购数量"
            v-if="status == 4 || status == 3"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.realityCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="采购期限"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.deadline | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="申请采购备注"
            v-if="status != 5"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.purchaseDesc ? scope.row.purchaseDesc : "无"}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="驳回备注"
            v-if="status == 5"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}">{{scope.row.rejectDesc ? scope.row.rejectDesc : "无"}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="采购状态"
            align="center">
            <template scope="scope">
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}" v-if="status == 1">未受理</span>
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}" v-if="status == 2">受理中</span>
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}" v-if="status == 3">采购中</span>
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}" v-if="status == 4">已完成</span>
              <span :class="{'isExpire':(scope.row.expire && ( (status == 1)||(status == 2)||(status == 3)))}" v-if="status == 5">采购驳回</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="status == 1"
            label="操作"
            align="center"
            width="120">
            <template scope="scope">
              <el-button icon="circle-close"  type="warning"  size="small" @click="returnPurchase(scope.row)">撤回采购</el-button>
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

  </div>
</template>

<script>
  export default{
    props:['status'],
    data() {
      return {
        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          orderStatus:null,
          skuNumber: "",
          orderNumber:''
        },
      }
    },
    mounted() {
      console.log(this.status)
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
      returnPurchase(data) {
        this.$confirm('确定撤回 '+data.styleName+' 的采购申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.storage.return_purchase).restful({purchaseOrderId:data.purchaseOrderId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '已撤销采购申请!'});
            this.findByPage();
            },(error) => {console.log(error)}
          );
        }).catch(() => {});
      },
      findByPage() {
        this.listQuery.loading = true;
        this.listQuery.orderStatus = this.status;

        this.http.get(this).url(this.config.storage.list_purchase_order).params(this.listQuery).request((response) => {
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
      }
    }
  }
</script>

<style  lang="scss">
  #procurementStatus_vue{
    .isStorage{
      color:#f75151;
    }
    .isExpire{
      color:#e7b45f;
    }
  }
</style>
