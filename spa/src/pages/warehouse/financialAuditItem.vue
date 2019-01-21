<template>   
  <div class="app-container calendar-list-container" id="financialAuditItem_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">  
            <el-date-picker @change="doSearch()" v-model="orderDate" :editable="false" :clearable="true"  type="daterange" class="filter-item"     align="left" placeholder="制单起止日期">
            </el-date-picker>

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 200px !important;" class="filter-item" placeholder="输入工单编号">
            </el-input>

            <el-select v-model="status" @change="doSearch" v-if="status != 1" filterable placeholder="请选择商品规格类型" style="width:150px;">
                <el-option
                  v-for="item in selectData"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type">
                </el-option>
              </el-select>


            <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;margin-right:8px;" type="primary" v-waves  icon="search">搜索</el-button>

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
            label="工单编号"
            align="center">
            <template scope="scope">
              <span>{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="制单人名称">
            <template scope="scope">
              <span>{{scope.row.createReallyName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="制单日期"
            align="center">
            <template scope="scope">
              <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="预计总价格"
            align="center">
            <template scope="scope">
              <span>￥{{(scope.row.totalMoney / 100).toFixed(2)}}</span>
            </template>
          </el-table-column>

           <el-table-column
            label="实际采购总金额"
            align="center">
            <template scope="scope">             
              <span>￥{{(scope.row.realityMoney / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="工单备注"
            align="center">
            <template scope="scope">
              <span>{{scope.row.description ? scope.row.description : "无" }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="工单状态"
            align="center">
            <template scope="scope">
              <span  v-if="scope.row.orderStatus == 1">待审核</span>
              <span  v-if="scope.row.orderStatus == 2">财务审核驳回</span>
              <span  v-if="scope.row.orderStatus == 3">采购中</span>
              <span  v-if="scope.row.orderStatus == 4">已完成</span>
              <span  v-if="scope.row.orderStatus == 0">已失效</span>
            </template>
          </el-table-column>

          <el-table-column
            width="120"
            label="操作"
            align="center">
            <template scope="scope">
              
              <el-button type="info" size="small"  @click="showDetail(scope.row)"> 工单详情 </el-button>
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

       <!-- 采购驳回弹框 -->
      <el-dialog title="采购驳回" :modal="true" :visible.sync="rejectPurchase.dialogVisible" >
      
        <el-form class="small-space" label-position="right" label-width="130px">

           <el-form-item label="采购驳回原因:">
            <el-input type="textarea" :rows="3" v-model="rejectPurchase.rejectReason" maxlength="100" style="width:70%" placeholder="请输采购驳回原因"></el-input>
          </el-form-item>

        </el-form>
      
        
        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="rejectPurchase.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmRejectPurchase">保 存</el-button>
        </div>
        
    </el-dialog>


    <!-- 采购工单详情 -->  
      <el-dialog title="采购工单详情"  :visible.sync="detailDiallogVisible" class="goods_dialog">
        <div>
          <p class="detail_listP"><span>工单编号:</span>{{detailList.orderNumber}}</p>
          <p class="detail_listP"><span>预估总金额:</span>￥{{(detailList.totalMoney / 100).toFixed(2)}}</p>
          <p class="detail_listP"><span>实际总金额:</span>￥{{(detailList.realityMoney / 100).toFixed(2)}}</p>
          <p class="detail_listP"><span>制单人名称:</span>{{detailList.createReallyName}}</p>
          <p class="detail_listP"><span>制单日期:</span>{{detailList.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>

          <p class="detail_listP" v-if="detailList.orderStatus == 1"><span>工单状态:</span>待审核</p>
          <p class="detail_listP" v-if="detailList.orderStatus == 2"><span>工单状态:</span>财务审核驳回</p>
          <p class="detail_listP" v-if="detailList.orderStatus == 3"><span>工单状态:</span>采购中</p>
          <p class="detail_listP" v-if="detailList.orderStatus == 4"><span>工单状态:</span>已完成</p>
          <p class="detail_listP" v-if="detailList.orderStatus == 0"><span>工单状态:</span>已失效</p>

          <p class="detail_listP"><span>工单备注:</span>{{detailList.description ? detailList.description : "无"}}</p>
        </div>
          <p class="detail_listP"   v-if="detailList.orderStatus != 0" ><span>操作:</span>
            <el-button  v-if="status == 1"  size="small" icon="circle-check" type="success" @click="agree(detailList)">同意采购</el-button>
            <el-button  v-if="status == 1"  size="small" icon="circle-close" type="warning" @click="disagree(detailList)">驳回采购</el-button>
            <el-button class="fontFamily icon-print" size="small" type="primary" @click="printOrder(detailList)">打印工单详情</el-button>
          </p>

        <el-table  :data="detail" border style="width: 100%;margin-top:15px;">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="采购项编码"
            align="center">
            <template scope="scope">
              <span >{{scope.row.orderNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品名称 / SKU名称">
            <template scope="scope">
              <span>{{scope.row.goodsTitle}} / {{scope.row.styleName}}</span>
            </template>
          </el-table-column>
          

          <el-table-column
            label="商品SKU编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.skuNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="detailList.orderStatus != 0"
            label="计划采购数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="最近一次采购价/SKU成本价"
            v-if="status != 0"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.lastRealityPrice">￥{{(scope.row.lastRealityPrice / 100).toFixed(2)}}<br><b style="color:#f75151;"> (最近一次采购价) </b></span>
              <span v-else>￥{{(scope.row.price / 100).toFixed(2)}}<br><b style="color:#f75151;">(SKU成本价)</b> </span>
            </template>
          </el-table-column>          

          <el-table-column
            label="实际采购单价"
            v-if="status != 0"
            align="center">
            <template scope="scope">
              <span>￥{{scope.row.realityPrice}}</span>
            </template>
          </el-table-column>
          
          <el-table-column
            label="实际采购总价"
            v-if="status != 0"
            align="center">
            <template scope="scope">
              <span>￥{{(scope.row.realityMoney / 100).toFixed(2)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="采购备注"
            align="center">
            <template scope="scope">
              <span>{{scope.row.purchaseSubmitDesc ? scope.row.purchaseSubmitDesc : "无"}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="已完成采购数量"
            v-if="detailList.orderStatus == 3 || detailList.orderStatus == 4"
            align="center">
            <template scope="scope">
              <span>{{scope.row.realityCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="采购期限"
            align="center">
            <template scope="scope">
              <span>{{scope.row.deadline | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="采购状态"
            align="center">
            <template scope="scope">
              <span  v-if="scope.row.orderStatus == 1">未受理</span>
              <span  v-if="scope.row.orderStatus == 2">受理中</span>
              <span  v-if="scope.row.orderStatus == 3">采购中</span>
              <span  v-if="scope.row.orderStatus == 4">已完成</span>
              <span  v-if="scope.row.orderStatus == 5">采购驳回</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="detailList.orderStatus == 3 || detailList.orderStatus == 4"
            label="操作"
            width="150"
            align="center">
            <template scope="scope">
                <el-button  size="small" class="fontFamily icon-browse" type="primary" @click="seeHistory(scope.row)">查看入库明细</el-button>   
            </template>
          </el-table-column>


        </el-table>

       </el-dialog>

       <el-dialog title="查看入库明细"   :visible.sync="historyVisible" >

         <el-steps class="expressSteps" :space="60" direction="vertical" :active="100">
            <div v-for="item in historyData" style="width:100%;height:auto;overflow:hidden;">
              <el-step :title="item.createdAt  | parseTime('{y}-{m}-{d} {h}:{i}')"  :description="'入库数量'+item.count+',采购单价'+(item.price / 100)+',合计'+(item.money / 100)"  style="float:left;">
              </el-step>
            </div>
          </el-steps>

       </el-dialog>



  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import session from '@/utils/session'
  export default{
    props:['status'],
    data() {
      return {
        selectData:[{type:2,name:'财务审核驳回'},{type:3,name:'采购中'},{type:4,name:'已完成'},{type:0,name:'已失效'},{type:5,name:'所有工单'}],
        detail:[],
        detailList:{},
        detailDiallogVisible:false,
        dataList:[],
        orderDate: null,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          orderStatus:null,
          orderNumber: "",
          beginDate:null,
          endDate:null,
        },
        rejectPurchase:{
          purchaseBatchOrderId:null,
          rejectReason:"",
          dialogVisible:false
        },
        historyData:[],
        historyVisible:false
      }
    },
    mounted() {
      console.log(this.status)
      this.findByPage();
    },
    methods:{
      seeHistory(data) {
        if (!data.details) {
          this.$message({message: '暂无入库明细', type: 'warning'});
          return false;
        }
        this.historyVisible = true;
        this.historyData = data.details;
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
      findByPage() {
        this.listQuery.loading = true;
        this.listQuery.orderStatus = this.status;

        if (this.orderDate && this.orderDate[0] && this.orderDate[1]) {
          this.listQuery.beginDate = parseTime(this.orderDate[0]);
          this.listQuery.endDate = parseTime(this.orderDate[1].setHours(23,59,59));
        } else {
          this.listQuery.beginDate = null;
          this.listQuery.endDate = null;
        }

        this.http.get(this).url(this.config.storage.purchase_batch_order_list).params(this.listQuery).request((response) => {
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
      showDetail(purchaseOrders) {
        this.detailList = purchaseOrders;
        this.loadDetail( purchaseOrders.purchaseBatchOrderId);
      },
      loadDetail(purchaseBatchOrderId) {
        this.http.get(this).url(this.config.storage.purchase_detail).restful({purchaseBatchOrderId:purchaseBatchOrderId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            let data = response.data.data;
            let financialAuditData = [];
            if (data.orderStatus != 0) {
              for(var i = 0; i < data.purchaseOrders.length; i++){
                if (data.purchaseOrders[i].realityPrice) {
                  data.purchaseOrders[i].realityPrice = (data.purchaseOrders[i].realityPrice / 100).toFixed(2);
                }

                if(data.purchaseOrders[i].orderStatus != 5){
                  financialAuditData.push(data.purchaseOrders[i]);
                }
              }
              this.detail = financialAuditData;
            } else {
              this.detail = data.purchaseOrders;
            }

            this.detailDiallogVisible = true;
             
          },(error) => {console.log(error)}
        );
      },
      agree(data) {
        this.$confirm('同意工单编号'+data.orderNumber+'的采购申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.storage.agree_purchase).restful({purchaseBatchOrderId:data.purchaseBatchOrderId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.detailDiallogVisible = false;
            this.$message({type: 'success', message: '已同意采购!'});
            this.findByPage();
            },(error) => {console.log(error)}
          );
        }).catch(() => {});
      },
      disagree(data) {
        this.rejectPurchase.purchaseBatchOrderId = data.purchaseBatchOrderId;
        this.rejectPurchase.rejectReason = '';
        this.rejectPurchase.dialogVisible = true;
      },
      confirmRejectPurchase() {
        if (!this.rejectPurchase.rejectReason || !this.rejectPurchase.rejectReason.trim()) {
          this.$message({message: '采购驳回原因不能为空', type: 'warning'});
          return false;
        }

        this.http.post(this).url(this.config.storage.disagree_purchase).restful({purchaseBatchOrderId:this.rejectPurchase.purchaseBatchOrderId}).params({rejectReason:this.rejectPurchase.rejectReason}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          this.$message({type: 'success', message: '已驳回采购!'});
          this.rejectPurchase.dialogVisible = false;
          this.detailDiallogVisible = false;
          this.findByPage();
          },(error) => {console.log(error)}
        );
      },
      /*打印工单详情*/
      printOrder(data) {
        let url = null;

        if(process.env.NODE_ENV == "production") {
          //线上url
           url = "/api/make-pdf/export-purchase-order/构巢采购工单详情.pdf";
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url = "/api/make-pdf/export-purchase-order/构巢采购工单详情.pdf";
        } else {
          //本地url
          url = "http://192.168.20.104:8888/api/make-pdf/export-purchase-order/构巢采购工单详情.pdf";
        }

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?purchaseBatchOrderId=" + this.detailList.purchaseBatchOrderId + "&access_token=" + user.accessToken;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }

      },
    }
  }
</script>

<style  lang="scss">
  #financialAuditItem_vue{
    .isStorage{
      color:#f75151;
    }
    .isExpire{
      color:#e7b45f;
    }
    .goods_dialog{
    >div{
      width:90%;
    }
  }
  .purchaseOrder_dialog{
    >div{
      width:65%;
    }
  }
  .detail_listP{
    width:50%;
    float:left;
    word-break: break-all;
    >span{
      display: inline-block;
      width:auto;
      font-weight: 700;
      margin-right: 6px;
      text-align: right;
      color:#343434;
    }
  }
  }
</style>
