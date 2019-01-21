<template>   
  <div class="app-container calendar-list-container" id="purchaseOrderItem_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-date-picker @change="doSearch()" v-model="orderDate" :editable="false" :clearable="true"  type="daterange" class="filter-item"     align="left" placeholder="制单起止日期">
            </el-date-picker>

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 200px !important;" class="filter-item" placeholder="输入工单编号">
            </el-input>

            <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;margin-right:8px;" type="primary" v-waves  icon="search">搜索</el-button>
            
            <el-badge :value="count" class="item">
              <el-button @click="addPurchaseOrders" type="primary" icon="plus">新建采购工单</el-button>
            </el-badge>
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
            label="预计总金额"
            align="center">
            <template scope="scope">
              <span>￥{{(scope.row.totalMoney / 100).toFixed(2)}}</span>
            </template>
          </el-table-column>

           <el-table-column
            label="实际采购总金额"
            align="center">
            <template scope="scope">
              <span>￥{{(scope.row.realityMoney / 100).toFixed(2)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="工单备注"
            v-if="status != 2"
            align="center">
            <template scope="scope">
              <span>{{scope.row.description ? scope.row.description : "无" }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="驳回原因"
            v-if="status == 2"
            align="center">
            <template scope="scope">
              <span>{{scope.row.rejectDesc }}</span>
            </template>
          </el-table-column>

<!--           <el-table-column
            label="工单状态"
            align="center">
            <template scope="scope">
              <span  v-if="status == 1">财务审核中</span>
              <span  v-if="status == 2">财务审核驳回</span>
              <span  v-if="status == 3">采购中</span>
              <span  v-if="status == 4">已完成</span>
              <span  v-if="status == 0">已失效</span>
            </template>
          </el-table-column> -->

          <el-table-column
            :width="(status == 2) ? 250 : 120"
            label="操作"
            align="center">
            <template scope="scope">
              <el-button icon="edit" size="small" v-if="status == 2" @click="editPurchaseOrders(scope.row)"> 编辑采购工单 </el-button>
              <el-button type="info" size="small" @click="showDetail(scope.row)"> 工单详情 </el-button>
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

      <!-- 添加采购工单 -->
    <el-dialog  title="采购工单" :visible.sync="purchaseOrder.dialogVisible" class="purchaseOrder_dialog">
      <el-form class="small-space" label-position="right" label-width="100px">

        <el-form-item label="工单编号:">
          <!-- <el-input v-model="purchaseOrder.orderNumber" maxlength="30" style="width:70%" placeholder="请输入工单编号"></el-input> -->
          <b>{{purchaseOrder.orderNumber}}</b>
        </el-form-item>

        <el-form-item label="工单备注:">
          <el-input type="textarea" v-model="purchaseOrder.description" :rows="3" maxlength="200" style="width:70%" placeholder="请输入工单备注"></el-input>
        </el-form-item>

        <el-form-item label="驳回原因:" v-if="edit">
          <span>{{rejectDesc}}</span>
        </el-form-item>

        <el-form-item label="采购项:" style="margin-bottom:0;">
          <el-button v-if="!edit" type="text" @click="showSelectGoods()" size="small">选择采购项</el-button>
        </el-form-item>
 
        <el-table :data="purchaseOrder.purchaseOrders" style="width: 100%" border>

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

        <!--   <el-table-column
            label="商品SKU名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.styleName}}</span>
            </template>
          </el-table-column> -->

          <el-table-column
            label="商品SKU编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.skuNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="计划采购数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="实际采购单价"
            width="160"
            align="center">
            <template scope="scope">
              <el-input type='text' maxlength="11" style="width:120px;" v-model="scope.row.realityPrice" :placeholder="'成本价'+(scope.row.price / 100).toFixed(2)"></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="采购备注"
            width="200"
            align="center">
            <template scope="scope">
              <el-input type='textarea' :rows="2" maxlength="255" v-model="scope.row.purchaseSubmitDesc" placeholder="请输入采购备注"></el-input>
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
            label="申请采购备注"
            align="center">
            <template scope="scope">
              <span>{{scope.row.purchaseDesc ? scope.row.purchaseDesc : "无"}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
              <el-button v-if="!edit" type="text"  size="small" @click="removePurchaseOrder(purchaseOrder.purchaseOrders,scope.row)">移除</el-button>

              <el-button v-if="edit && (scope.row.orderStatus != 5)" size="small" icon="circle-close" type="warning" @click="rejectPurchase(scope.row)">驳回采购项</el-button>

              <span v-if="edit && (scope.row.orderStatus == 5)">采购已被驳回</span>

            </template>
          </el-table-column>

        </el-table>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="purchaseOrder.dialogVisible = false">关 闭</el-button>
        <el-button type="primary"  class="fontFamily icon-print" @click="printCheckPriceReport">下载订货核价单</el-button>
        <el-button type="primary" @click="confirmPurchaseOrders" v-if="!edit">提交财务审核</el-button>
        <el-button type="primary" @click="updatePurchaseOrders" v-if="edit">提交财务审核</el-button>
      </div>
    </el-dialog>


     <!-- 选择商品 -->
    <el-dialog title="选择采购项" :modal="false" :visible.sync="choiceGoods.dialogVisible" class="goods_dialog">

      <div class="filter-container">
        <el-input @keyup.enter.native="doSearchGoods()" v-model="choiceGoods.orderNumber" style="width: 200px !important;" class="filter-item" placeholder="输入采购项编码"></el-input>
        
        <el-select  class="filter-item"  @change="doSearchGoods()"  :filter-method="onProviderFilter"  v-model="choiceGoods.providerId" clearable filterable placeholder="选择或输入供应商" style="width:200px;margin-left:12px;">
            <el-option
              v-for="item in filterProviders"
              :key="item.providerName"
              :label="item.providerName"
              :value="item.providerId">
              <span style="float: left">{{ item.providerName }}</span>
              <span style="float: right; color: #8492a6;margin-left:16px; font-size: 13px">{{ item.providerCode }}</span>
          </el-option>
        </el-select>

        <el-button @click="doSearchGoods" class="filter-item" style="margin-left: 12px;" type="primary" v-waves  icon="search">搜索</el-button>
      </div>
      <p style="color:#f75151;margin-top:0;">注意:同一采购批次只能选择同一供应商下面的采购项!</p>
      <div class="gc-praiselist_content_list">
        <el-table  :data="goodsDatas" border style="width: 100%">

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
            label="供应商">
            <template scope="scope">
              <span>{{scope.row.providerName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品名称">
            <template scope="scope">
              <span>{{scope.row.goodsTitle}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品SKU名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.styleName}}</span>
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
            label="计划采购数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
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
            label="申请采购备注"
            align="center">
            <template scope="scope">
              <span>{{scope.row.purchaseDesc ? scope.row.purchaseDesc : "无"}}</span>
            </template>
          </el-table-column>

          <el-table-column label="选择" align="center"  width="100">
            <template scope="scope">
              <el-checkbox v-model="scope.row.checked" @change="goodsCheck(scope.row)"></el-checkbox>
            </template>
          </el-table-column>

        </el-table>

        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChangeGoods" @current-change="handleCurrentChangeGoods"
                         :page-sizes="[10,15,20,30]" :page-size="choiceGoods.pageSize"
                         :current-page="choiceGoods.pageIndex"
                         layout="total, sizes, prev, pager, next, jumper" :total="choiceGoods.total">
          </el-pagination>
        </div>
        
        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="choiceGoods.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmChoiceGoods">确 定</el-button>
        </div>
        

      </div>
    </el-dialog>

    <!-- 采购工单详情 -->  
    <el-dialog title="采购工单详情"  :visible.sync="detailDiallogVisible" class="goods_dialog">
        <div style="width:100%;height:auto;overflow:hidden;">
          <p class="detail_listP"><span>工单编号:</span>{{detailList.orderNumber}}</p>
          <p class="detail_listP"><span>预估总金额:</span>￥{{(detailList.totalMoney / 100).toFixed(2)}}</p>
          <p class="detail_listP"><span>实际采购总金额:</span>￥{{(detailList.realityMoney / 100).toFixed(2) }}</p>
          <p class="detail_listP"><span>制单人名称:</span>{{detailList.createReallyName}}</p>
          <p class="detail_listP"><span>制单日期:</span>{{detailList.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>

<!--           <p class="detail_listP" v-if="status == 1"><span>工单状态:</span>财务审核中</p>
          <p class="detail_listP" v-if="status == 2"><span>工单状态:</span>财务审核驳回</p>
          <p class="detail_listP" v-if="status == 3"><span>工单状态:</span>采购中</p>
          <p class="detail_listP" v-if="status == 4"><span>工单状态:</span>已完成</p>
          <p class="detail_listP" v-if="status == 0"><span>工单状态:</span>已失效</p> -->

          <p class="detail_listP"><span>工单备注:</span>{{detailList.description ? detailList.description : "无"}}</p>
        </div>
       <!--  <p class="detail_listP" v-if="status != 0"><span>工单下载:</span><el-button class="fontFamily icon-print"  size="small" type="primary" @click="downLoadPurchaseOrder">打印采购工单</el-button></p> -->
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
            label="计划采购数量"
            v-if="status != 0"
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
              <span v-if="scope.row.lastRealityPrice">￥{{(scope.row.lastRealityPrice / 100).toFixed(2)}} <br><b style="color:#f75151;"> (最近一次采购价) </b></span>
              <span v-else>￥{{(scope.row.price / 100).toFixed(2)}} <br><b style="color:#f75151;">(SKU成本价)</b> </span>
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
            v-if="(status != 0 && status == 3) || (status != 0 && status == 4)"
            align="center">
            <template scope="scope">
              <span>{{scope.row.realityCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="驳回备注"
            v-if="status == 0"
            align="center">
            <template scope="scope">
              <span>{{scope.row.rejectDesc}}</span>
            </template>
          </el-table-column>        

          <el-table-column
            label="采购期限"
            align="center">
            <template scope="scope">
              <span>{{scope.row.deadline | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

<!--           <el-table-column
            label="采购状态"
            align="center">
            <template scope="scope">
              <span  v-if="scope.row.orderStatus == 1">未受理</span>
              <span  v-if="scope.row.orderStatus == 2">受理中</span>
              <span  v-if="scope.row.orderStatus == 3">采购中</span>
              <span  v-if="scope.row.orderStatus == 4">已完成</span>
              <span  v-if="scope.row.orderStatus == 5">采购驳回</span>
            </template>
          </el-table-column> -->

          <el-table-column 
          label="操作" 
          align="center"  
          :width="(status == 3 || status == 4) ? 290 : 150"
          v-if="status != 0">
            <template scope="scope">
              <el-button type="primary"  size="small" class="fontFamily icon-print" @click="downLoadOrder(scope.row)">打印入库单</el-button>
              <el-button v-if="status == 3 || status == 4" size="small" class="fontFamily icon-browse"  type="primary" @click="seeHistory(scope.row)">查看入库明细</el-button>   
            </template>
          </el-table-column>

        </el-table>

    </el-dialog>

     <el-dialog title="入库明细"   :visible.sync="historyVisible" >

       <el-steps class="expressSteps" :space="60" direction="vertical" :active="100">
          <div v-for="item in historyData" style="width:100%;height:auto;overflow:hidden;">
            <el-step :title="item.createdAt  | parseTime('{y}-{m}-{d} {h}:{i}')" :description="'入库数量'+item.count+',采购单价'+(item.price / 100)+',合计'+(item.money / 100)" style="float:left;">
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
        detail:[],
        detailList:{},
        detailDiallogVisible:false,
        rejectDesc:'',
        orderDate: null,
        count:0,
        edit:false,
        goodsDatas:[],
        dataList:[],
        choiceDatas:[],
        providers: [],
        filterProviders: [],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          orderStatus:null,
          orderNumber:''
        },
        choiceGoods:{
          dialogVisible:false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          orderStatus:1,
          orderNumber: "",
          providerId:''
        },
        purchaseOrder:{
          dialogVisible:false,
          purchaseBatchOrderId:null,
          orderNumber:'',
          description:'',
          purchaseOrders:[]
        },
        historyData:[],
        historyVisible:false
      }
    },
    mounted() {
      this.findAllProvider();
      console.log(this.status)
      if(this.status == 1){
        this.findByPage();
        this.findCount();
      }
    },
    methods:{
      findAllProvider() {
        this.http.get(this).url(this.config.provider.provider_all_url).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.providers = response.data.data;
          this.filterProviders = response.data.data;
          }, (err) => {console.log(err)}
        );
      }, 
      onProviderFilter(keyword) {
        if (!keyword) {
          this.filterProviders = this.providers;
          return;
        }
        keyword = keyword.toLowerCase();
        var filterArr = [];
        this.providers.forEach((item)=> {
          var provideName = item.providerName.toLowerCase();
          var providerCode = item.providerCode.toLowerCase();
          if (provideName.indexOf(keyword) != -1 || providerCode.indexOf(keyword) != -1) {
            filterArr.push(item);
          }
        })
        this.filterProviders = filterArr;
      },
      seeHistory(data) {
        if (!data.details) {
          this.$message({message: '暂无入库明细', type: 'warning'});
          return false;
        }
        this.historyVisible = true;
        this.historyData = data.details;
      },
      loadData() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
        this.findCount();
      },
      reset() {
        this.purchaseOrder.purchaseBatchOrderId = null;
        this.purchaseOrder.orderNumber = '';
        this.purchaseOrder.description = '';
        this.purchaseOrder.purchaseOrders = [];
      },
      checkForm() {

         if (!this.purchaseOrder.orderNumber || !this.purchaseOrder.orderNumber.trim()) {
          this.$message({message: '工单编号不能为空', type: 'warning'});
          return false;
        }

        if (!this.purchaseOrder.purchaseOrders.length) {
          this.$message({message: '请选择采购项', type: 'warning'});
          return false;
        }
        
        for(var i = 0; i < this.purchaseOrder.purchaseOrders.length; i++){

          if (!this.purchaseOrder.purchaseOrders[i].realityPrice) {
            this.$message({message:'采购项编码' + this.purchaseOrder.purchaseOrders[i].orderNumber +  '的实际采购单价不能为0或空', type: 'warning'});
            return;
          }

          if (!this.validate.validatPrice(this.purchaseOrder.purchaseOrders[i].realityPrice)) {
             this.$message({message:'采购项编码' + this.purchaseOrder.purchaseOrders[i].orderNumber + '单价为2位小数或整数', type: 'warning'});
            return;
          }

          if (!this.purchaseOrder.purchaseOrders[i].purchaseSubmitDesc) {
            this.$message({message:'采购项编码' + this.purchaseOrder.purchaseOrders[i].orderNumber +  '采购备注不能为空', type: 'warning'});
            return;
          }

        }

        return true;
      },
      addPurchaseOrders() {
        this.reset();
        this.edit = false;
        this.setOrderNumber();
      },
      editPurchaseOrders(purchaseOrders){
        this.reset();
        this.edit = true;
        this.purchaseOrder.purchaseBatchOrderId = purchaseOrders.purchaseBatchOrderId;
        this.loadDetail(0);
      },
      showDetail(purchaseOrders) {
        this.purchaseOrder.purchaseBatchOrderId = purchaseOrders.purchaseBatchOrderId;
        this.detailList = purchaseOrders;
        this.loadDetail(1);
      },
      loadDetail(type) {
        this.http.get(this).url(this.config.storage.purchase_detail).restful({purchaseBatchOrderId:this.purchaseOrder.purchaseBatchOrderId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            let data = response.data.data;
            let financialAuditData = [];
            if (this.status != 0) {
              for(var i = 0; i < data.purchaseOrders.length; i++){
                if (data.purchaseOrders[i].realityPrice) {
                  data.purchaseOrders[i].realityPrice = (data.purchaseOrders[i].realityPrice / 100).toFixed(2);
                }

                
                if(data.purchaseOrders[i].orderStatus != 5){
                  financialAuditData.push(data.purchaseOrders[i]);
                }
              }
            }


            if(type == 1){
              if (this.status != 0) {
                this.detail = financialAuditData;
              } else {
                this.detail = data.purchaseOrders;
              }
              
              this.detailDiallogVisible = true;
              return;
            }

            if (this.status != 0) {
              this.purchaseOrder.purchaseOrders = financialAuditData;
            } else {
              this.purchaseOrder.purchaseOrders = data.purchaseOrders;
            }

            this.purchaseOrder.dialogVisible = true;
            this.purchaseOrder.orderNumber = data.orderNumber;
            this.purchaseOrder.description = data.description;
            this.rejectDesc = data.rejectDesc;

          },(error) => {console.log(error)}
        );
      },
      confirmPurchaseOrders() {
        if(this.checkForm()){
          let params = {};
          let purchaseOrders = [];
          params.purchaseBatchOrderId = this.purchaseOrder.purchaseBatchOrderId;
          params.orderNumber = this.purchaseOrder.orderNumber;
          params.description = this.purchaseOrder.description;
          this.purchaseOrder.purchaseOrders.forEach((item)=>{
            var obj = {};
            obj.purchaseOrderId = item.purchaseOrderId;
            obj.realityPrice = item.realityPrice * 100;
            obj.purchaseSubmitDesc = item.purchaseSubmitDesc;
            purchaseOrders.push(obj);
          });
          params.purchaseOrders = purchaseOrders;

          this.http.postJson(this).url(this.config.storage.create_purchase).params(params).request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '采购工单创建成功!'});
              this.purchaseOrder.dialogVisible = false;
              this.$emit('success');
            },
            (error) => {console.log(error)}
          );

        }
      },
      showSelectGoods() {
        this.choiceDatas = this.purchaseOrder.purchaseOrders.concat();
        this.choiceGoods.orderNumber = "";
        this.choiceGoods.providerId = '';
        this.findByGoods();
      },
      goodsCheck(data) {
        if(data.checked) {
          this.pushPurchaseOrder(data);
        } else {
          this.removePurchaseOrder(this.choiceDatas,data);
        }
      },
      pushPurchaseOrder(data) {
        if (!this.choiceDatas.length) {
          this.choiceDatas.push(data)
        } else {
          let flag = true;
          for(var i = 0; i < this.choiceDatas.length; i++){
            if (this.choiceDatas[i].providerId != data.providerId) {
              flag = false;
              this.$message({type: 'warning', message: '同一采购批次只能选择同一供应商下面的采购项!'});
              data.checked = false;
              return ;
            }
          }
          if (flag) {
            this.choiceDatas.push(data)
          }
        }
      },
      removePurchaseOrder(array,data) {
        for(var i = 0; i < array.length; i++) {
          if(array[i].purchaseOrderId == data.purchaseOrderId){
             console.log(i)
             array.splice(i, 1);
             break;
          }
        }
      },
      confirmChoiceGoods() {
        if (!this.choiceDatas.length) {
          this.$message({message: '请选择采购项', type: 'warning'});
          return false;
        }
        
        this.choiceDatas.forEach((item)=>{
          item.realityPrice = item.realityPrice ? item.realityPrice : '';
          item.purchaseSubmitDesc = item.purchaseSubmitDesc ? item.purchaseSubmitDesc : '';
        });

        this.purchaseOrder.purchaseOrders = this.choiceDatas;
        
        this.choiceGoods.dialogVisible = false
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
      findCount() {
        this.http.get(this).url(this.config.storage.purchase_order_count).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            this.count = response.data.data;

          },(error) => {console.log(error)}
        );
      },
      setOrderNumber() {
        this.http.get(this).url(this.config.storage.set_orderNumber).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            this.purchaseOrder.orderNumber = response.data.data;
            this.purchaseOrder.dialogVisible = true;

          },(error) => {console.log(error)}
        );
      },
      handleSizeChangeGoods(val) {
        this.choiceGoods.pageSize = val;
        this.findByGoods();
      },
      handleCurrentChangeGoods(val) {
        this.choiceGoods.pageIndex = val;
        this.findByGoods();
      },
      doSearchGoods() {
        this.choiceGoods.pageIndex = 1;
        this.findByGoods();
      },
      findByGoods() {

        this.http.get(this).url(this.config.storage.list_purchase_order).params(this.choiceGoods).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;
            
            data.forEach((item)=>{
              var flag = false;
              this.choiceDatas.forEach((goodsItem)=>{
                if (goodsItem.purchaseOrderId == item.purchaseOrderId) {
                  flag = true;
                }
              })

              if (flag) {
                item.checked = true;
              } else {
                item.checked = false;
              }

            });

            this.goodsDatas = data;
            this.choiceGoods.total = response.data.data.totalSize;
            this.choiceGoods.dialogVisible = true;
        
          },(error) => {console.log(error)}
        );
      },
      rejectPurchase(purchaseOrder) {
        this.$prompt('请输入驳回原因(100个字符以内)', '驳回采购', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: ''
        }).then(({value}) => {
          if (value != null && value.trim() && value.length <= 100) {
            
            let params = {};
            params.purchaseBatchOrderId = this.purchaseOrder.purchaseBatchOrderId;
            params.purchaseOrderId = purchaseOrder.purchaseOrderId;
            params.rejectReason = value;

            this.http.post(this).url(this.config.storage.reject_purchase).params(params).request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
                return;
              }

              
              purchaseOrder.orderStatus = 5;  

              //判断全部采购被驳回
              var flag = true;
              this.purchaseOrder.purchaseOrders.forEach((item)=>{
                if(item.orderStatus != 5) {
                  flag = false;
                }
              });

              if (flag) {
                this.purchaseOrder.dialogVisible = false;
                this.findByPage();
                this.$message({type: 'success', message: '已驳回全部采购项，工单已失效'});
              } else {
                this.$message({type: 'success', message: '已驳回采购!'});
              }


              },(error) => {console.log(error)}
            );
          } else {
            this.$message({type: 'warning', message: '驳回原因不能为空且在100字以内' });
          }
        }).catch(() => {});
      },
      updatePurchaseOrders() {
        if(this.checkForm()){

          let flag = false;

          this.purchaseOrder.purchaseOrders.forEach((item)=>{
            if (item.orderStatus != 5) {
              flag = true;
            }
          });

          if (!flag) {
            this.$message({type: 'warning', message: '所有采购项已被驳回不能在编辑' });
            return ;
          }

          let params = {};
          let purchaseOrders = [];
          params.purchaseBatchOrderId = this.purchaseOrder.purchaseBatchOrderId;
          params.orderNumber = this.purchaseOrder.orderNumber;
          params.description = this.purchaseOrder.description;

          this.purchaseOrder.purchaseOrders.forEach((item)=>{
            var obj = {};
            obj.purchaseOrderId = item.purchaseOrderId;
            obj.realityPrice = item.realityPrice * 100;
            obj.purchaseSubmitDesc = item.purchaseSubmitDesc;
            purchaseOrders.push(obj);
          });
          params.purchaseOrders = purchaseOrders;

          this.http.postJson(this).url(this.config.storage.update_purchase).params(params).request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '采购工单已重新更新!'});
              this.purchaseOrder.dialogVisible = false;
              this.$emit('success');
            },
            (error) => {console.log(error)}
          );

        }
      },
      /*打印采购工单*/
      downLoadPurchaseOrder(){
          let url = null;

          if(process.env.NODE_ENV == "production") {
            //线上url
             url = "/api/make-pdf/create-pdf-purchase-batch/构巢商品采购工单.pdf";
          } else if(process.env.NODE_ENV == "test") {
            //测试
             url = "/api/make-pdf/create-pdf-purchase-batch/构巢商品采购工单.pdf";
          } else {
            //本地url
            url = "http://192.168.20.104:8888/api/make-pdf/create-pdf-purchase-batch/构巢商品采购工单.pdf";
          }
        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?purchaseBatchOrderId=" + this.detailList.purchaseBatchOrderId + "&access_token=" + user.accessToken;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
      /*打印入库单*/
      downLoadOrder(data) {
        let url = null;

        if(process.env.NODE_ENV == "production") {
            //线上url
             url = "/api/make-pdf/create-pdf-single-purchase/构巢商品采购入库单.pdf";
          } else if(process.env.NODE_ENV == "test") {
            //测试
             url = "/api/make-pdf/create-pdf-single-purchase/构巢商品采购入库单.pdf";
          } else {
            //本地url
            url = "http://192.168.20.104:8888/api/make-pdf/create-pdf-single-purchase/构巢商品采购入库单.pdf";
          }

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?purchaseId=" + data.purchaseOrderId + "&access_token=" + user.accessToken;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
      /*打印商品采购核价单*/
      printCheckPriceReport() {
        let url = null;

        if(process.env.NODE_ENV == "production") {
            //线上url
             url = "/api/provider-check-excel/check-price-report";
          } else if(process.env.NODE_ENV == "test") {
            //测试
             url = "/api/provider-check-excel/check-price-report";
          } else {
            //本地url
            url = "http://192.168.20.103:8888/api/provider-check-excel/check-price-report";
          }

        if (session.isLogin()) {
          var user = session.getUser();
          let numbers = [];
          let numberStr = null;
          this.purchaseOrder.purchaseOrders.forEach((item)=>{
            if (item.orderStatus != 5) {
              numbers.push(item.orderNumber);
            }
          }) 
          if (!numbers.length) {
            this.$message({type: 'warning', message: '请先选择采购项!'});
            return ;
          }
          numberStr = numbers.join(',');
          url = url + "?numbers=" + numberStr + "&access_token=" + user.accessToken;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }

      }
    }
  }
</script>

<style  lang="scss">
#purchaseOrderItem_vue{
  .goods_dialog{
    >div{
      width:90%;
    }
  }
  .purchaseOrder_dialog{
    >div{
      width:90%;
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
