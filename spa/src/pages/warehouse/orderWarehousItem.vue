<template>       
  <div class="app-container calendar-list-container" id="orderWarehouse_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.workNumber" style="width: 200px !important;" class="filter-item" :placeholder="(type == 2) ? '换货工单编号' : '退货工单编号'">
            </el-input>

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.recordNumber" style="width: 200px !important;" class="filter-item" :placeholder="(type == 2) ? '换货入库工单编号' : '退货入库工单编号'">
            </el-input>


            <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves  icon="search">搜索</el-button>

            <el-badge :value="count" class="item" v-if='workStatus == 1'>
              <el-button v-if='type == 2' @click="exchangeGoodsPut" class="filter-item" style="margin-left: 12px;" type="primary" >换货入库</el-button>
              <el-button v-else @click="returnGoodsPut" class="filter-item" style="margin-left: 12px;" type="primary" >退货入库</el-button>
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
            v-if='type == 2'
            label="换货工单编号"
            align="center">
            <template scope="scope">
              <span>{{scope.row.workNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 2'
            align="center"
            label="换货入库工单编号">
            <template scope="scope">
              <span>{{scope.row.recordNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 3'
            label="退货工单编号"
            align="center">
            <template scope="scope">
              <span>{{scope.row.workNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 3'
            align="center"
            label="退货入库工单编号">
            <template scope="scope">
              <span>{{scope.row.recordNumber}}</span>
            </template>
          </el-table-column>


          <el-table-column
            label="商品名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsTitle}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.skuNumber.slice(0,-2)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品SKU"
            align="center">
            <template scope="scope">
              <span>{{scope.row.styleName}}</span><span v-if='scope.row.styleSubName'>-{{scope.row.styleSubName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="SKU编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.skuNumber.slice(-2)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 2'
            label="换货数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='type == 3'
            label="退货数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='workStatus == 1'
            label="待入库数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='workStatus == 2'
            label="正常入库数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.normalCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='workStatus == 2'
            label="报损数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.badCount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='workStatus == 1'
            label="平台收货时间"
            align="center">
            <template scope="scope">
              <span>{{scope.row.receiveDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if='workStatus == 2'
            label="入库时间"
            align="center">
            <template scope="scope">
              <span>{{scope.row.putDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
             <el-button v-if='workStatus == 1' size="small" type="primary" class="fontFamily icon-browse" @click="seeDetail(scope.row)">查看详情</el-button>
             <el-button v-if='workStatus == 2' size="small" type="primary" class="fontFamily icon-browse" @click="loadDetailData(scope.row)">查看详情</el-button>
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
      
      <!-- 未入库详情弹窗 -->
      <el-dialog  :title="title"  :visible.sync="dialogVisible" >
        <el-row :gutter="24">

          <el-col :span="24" v-show='!showOrderDetail'>
            <p style="text-align:left;">
              <span style="color:#343434;display:inline-block;width:120px;margin-right:6px;text-align:right;">售后{{(type == 2) ? '换货' : '退货'}}工单号:</span> 

              <el-input @keyup.enter.native="findOrder" style="width:380px;" v-model="workNumber" type="text" placeholder="请输入条码" maxlength='20' ></el-input>
              <el-button type="primary" @click="findOrder">{{(type == 2) ? '换货' : '退货'}}入库</el-button>

            </p> 
            <p style="padding-left:130px">您可以使用条码扫描枪扫描入库单条形码快捷入库</p>
          </el-col>

          <div  v-show="showOrderDetail" class="storageMessage">
            <el-col :span="8">
              {{(type == 2) ? '换货' : '退货'}}工单编号:  <span>  {{orderData.workNumber}} </span>
            </el-col>
            <el-col :span="8">
              {{(type == 2) ? '换货' : '退货'}}入库工单编号:<span> {{orderData.recordNumber}}</span>
            </el-col>
            <el-col :span="8">
              平台收货时间:<span> {{orderData.receiveDate  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>

            <el-col :span="8">
              商品名称:<span> {{orderData.goodsTitle}}</span>
            </el-col>
            <el-col :span="8">
              商品编码:<span> {{orderData.goodsNumber}}</span>
            </el-col>
            <el-col :span="8">
              SKU名称:<span> {{orderData.styleName +'-'+orderData.styleSubName}}</span>
            </el-col>

            <el-col :span="8">
              商品SKU编码:<span> {{orderData.styleNumber}}</span>
            </el-col>
            <el-col :span="8">
              {{(type == 2) ? '换货' : '退货'}}数量:<span> {{orderData.count}}</span>
            </el-col>
            <el-col :span="8">
              待入库数量:<span> {{orderData.count}}</span>
            </el-col>

            <el-col :span="24">
              <h3 style="margin-top:0;">{{(type == 2) ? '换货' : '退货'}}入库明细 <el-button icon='plus' type="primary" size="small" style="margin-left:10px;"  @click="showDetailFrom">添加入库明细</el-button></h3>
              <el-table
               :data="details"
                border
                style="width: 100%;">

                <el-table-column type="index" align="center" label="序号" width="65">
                </el-table-column>

                <el-table-column
                  width='120'
                  align="center"
                  label="入库选项">
                  <template scope="scope">
                    <span v-if="scope.row.type == 1">正常入库</span>
                    <span v-if="scope.row.type == 2">损坏入库</span>
                  </template>
                </el-table-column>

                <el-table-column
                  width='120'
                  label="入库数量"
                  align="center">
                  <template scope="scope">
                    <span>{{scope.row.count}}</span>
                  </template>
                </el-table-column>

                <el-table-column

                  label="入库备注"
                  align="center">
                  <template scope="scope">
                    <span v-if="scope.row.type == 1">正常入库({{scope.row.description}})</span>
                    <span  v-if="scope.row.type == 2">{{scope.row.damageDegree}}({{scope.row.description}})</span>
                  </template>
                </el-table-column>

                <el-table-column
                  width='120'
                  label="操作"
                  align="center">
                  <template scope="scope">
                   
                   <el-button  type="danger" size="small" @click="remove(scope.row,scope.$index)">移除</el-button>
                  </template>
                </el-table-column>

                </el-table>

            </el-col>

          </div>
          
        </el-row>      

        <div slot="footer" class="dialog-footer">
          <el-button v-show="showOrderDetail" @click="dialogVisible = false">关 闭</el-button>
          <el-button type="primary" @click="comfirmPutin" v-show="showOrderDetail">确认入库</el-button>
        </div>

      </el-dialog>

      <!-- 添加退换货入库弹窗 -->
      <el-dialog  title="添加入库明细" :modal="false" :visible.sync="detailItemDialogVisible">
        <el-form class="small-space" label-position="right" label-width="120px">
          
          <el-form-item label="入库选项:">
             <el-select v-model="detailItem.type" filterable placeholder="请选择入库类型">
                <el-option
                  v-for="item in detailType"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type">
                </el-option>
              </el-select>
          </el-form-item>  

          <el-form-item label="损坏程度:" v-show="detailItem.type == 2">
             <el-select v-model="detailItem.damageDegree" filterable placeholder="请选择破损程度">
                <el-option
                  v-for="item in damageDegree"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
          </el-form-item>  

          <el-form-item label="入库数量:">
            <el-input-number  v-model="detailItem.count" :min="1" :max="99999"></el-input-number>
          </el-form-item> 

          <el-form-item label="备注:">
            <el-input type="textarea" v-model="detailItem.description" style="width:50%;" placeholder="请输入入库备注" maxlength="100" :rows="3"> </el-input> 
          </el-form-item>  

        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="detailItemDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddDetail">确 定</el-button>
        </div>
        
      </el-dialog>

      <!-- 已入库详情弹窗 -->
      <el-dialog  :title="(type == 2) ? '换货入库单详情':'退货入库单详情' "  :visible.sync="detailVisible" class="detailDialog">
         <el-row :gutter="24" class="storageMessage">

          <el-col :span="8">
            {{(type == 2) ? '换货' : '退货'}}工单编号:  <span>  {{exchangeDataDetail.workNumber}} </span>
          </el-col>

          <el-col :span="8">
            {{(type == 2) ? '换货' : '退货'}}入库工单编号:<span> {{exchangeDataDetail.recordNumber}}</span>
          </el-col>

          <el-col :span="8">
            平台收货时间:<span> {{exchangeDataDetail.receiveDate  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-col>

          <el-col :span="8">
            商品名称:<span> {{exchangeDataDetail.goodsTitle}}</span>
          </el-col>
          <el-col :span="8">
            商品编码:<span> {{exchangeDataDetail.goodsNumber}}</span>
          </el-col>
          <el-col :span="8">
            SKU名称:<span> {{exchangeDataDetail.styleName +'-'+exchangeDataDetail.styleSubName}}</span>
          </el-col>

          <el-col :span="8">
            商品SKU编码:<span> {{exchangeDataDetail.styleNumber}}</span>
          </el-col>
          <el-col :span="8">
            {{(type == 2) ? '换货' : '退货'}}数量:<span> {{exchangeDataDetail.count}}</span>
          </el-col>
          <el-col :span="8">
            已入库数量:<span> {{exchangeDataDetail.count}}</span>
          </el-col>
          <el-col :span="8">
            正常入库数量:<span> {{exchangeDataDetail.normalCount}}</span>
          </el-col>
          <el-col :span="8">
            报损入库数量:<span> {{exchangeDataDetail.badCount}}</span>
          </el-col>
          <el-col :span="8">
            入库时间:<span> {{exchangeDataDetail.putDate  | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </el-col>

          <el-col :span="24">
            <h3 style="margin-top:0;">{{(type == 2) ? '换货' : '退货'}}入库明细
              <el-button class="filter-item fontFamily icon-print" size='small' style="margin-left: 10px;" type="primary" @click="printPutStorage">打印入库凭证</el-button>
            </h3>
            <el-table
             :data="exchangeDataDetail.details"
              border
              style="width: 100%;">

              <el-table-column type="index" align="center" label="序号" width="65">
              </el-table-column>

              <el-table-column
                width='120'
                align="center"
                label="入库选项">
                <template scope="scope">
                  <span v-if="scope.row.type == 1">正常入库</span>
                  <span v-if="scope.row.type == 2">损坏入库</span>
                </template>
              </el-table-column>

              <el-table-column
                width='120'
                label="入库数量"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.count}}</span>
                </template>
              </el-table-column>

              <el-table-column

                label="入库备注"
                align="center">
                <template scope="scope">
                  <span v-if="scope.row.type == 1">正常入库({{scope.row.description}})</span>
                  <span  v-if="scope.row.type == 2">{{scope.row.damageDegree}}({{scope.row.description}})</span>
                </template>
              </el-table-column>

              </el-table>

          </el-col>
          
        </el-row>      
        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="detailVisible = false">关 闭</el-button>
        </div>

      </el-dialog>


  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import session from '@/utils/session'
  export default{
    props:['type','workStatus'], //type 2换货 3退货  workStatus 1未入库 2已入库
    data() {
      return {
        title:'',
        count:0,
        allCount:0,
        detailType:[{type:1,name:"正常入库"},{type:2,name:'报损入库'}],
        damageDegree:[{name:"轻微折损"},{name:"一般折损"},{name:"严重折损"},{name:"完全折损"}],
        details:[],
        detailItem:{
          count:0,
          description:'',
          type:'',
          damageDegree:''
        },
        detailItemDialogVisible:false,
        workNumber:'',
        dialogVisible:false,
        showOrderDetail:false,
        showInput:false,
        searchBtn:true,
        orderData:{detail:{}},
        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          workNumber:'',
          recordNumber:''
        },
        detailVisible:false,
        orderDate:null,
        exchangeDataDetail:{}
      }
    },
    mounted() {
      if (this.workStatus == 1) {
        this.findByPage();  
        this.findCount();
      }
    },
    methods:{
      restForm() {
        this.details = [];
        this.allCount = 0;
        this.orderData = {detail:{}};
      },
      /*换货入库*/
      exchangeGoodsPut() {
        this.restForm();
        this.title = '扫描换货入库单';
        this.workNumber = '';
        this.showOrderDetail = false;
        this.dialogVisible = true;
      },
      /*退货入库*/
      returnGoodsPut() {
        this.restForm();
        this.title = '扫描退货入库单';
        this.workNumber = '';
        this.showOrderDetail = false;
        this.dialogVisible = true;
      },
      /*加载数据*/
      loadData() {
        this.findByPage();
        if (this.workStatus == 1) {
          this.findCount();
        }
      },
      checkForm() {
        if (!this.validate.validatNumber(this.detailItem.count) ) {
          this.$message({message: '入库数量不能为小数', type: 'warning'});
          return false;
        }

        if (!this.detailItem.description &&  !this.detailItem.description.trim()) {
          this.$message({message: '备注不能为空', type: 'warning'});
          return false;
        }

        if (!this.detailItem.type)  {
          this.$message({message: '请选择入库类型', type: 'warning'});
          return false;
        }

        if(this.detailItem.type == 2) {
          if (!this.detailItem.damageDegree)  {
            this.$message({message: '请选择入库损坏程度', type: 'warning'});
            return false;
          }
        }

        if(this.detailItem.count > this.orderData.count){
          this.$message({message: '入库库存不能大于待入库数量', type: 'warning'});
          return false;
        }

        this.allCount += this.detailItem.count;
        if(this.allCount > this.orderData.count){
          this.$message({message: '入库库存总计不能大于待入库数量', type: 'warning'});
          this.allCount = this.allCount - this.detailItem.count;
          return false;
        } 

        return true;

      },

      reset() {
        this.detailItem = {
          count:0,
          description:'',
          type:'',
          damageDegree:''
        }
      },
      confirmAddDetail() {
        if(this.checkForm()) {
          this.detailItemDialogVisible = false;
          this.details.push(this.detailItem)
        }
      },
      remove(data,index){
        this.allCount = this.allCount - data.count;
        this.details.splice(index,1);
      },
      showDetailFrom() {
        this.reset();
        this.detailItemDialogVisible = true;
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
      /*入库*/
      comfirmPutin() {
        if(!this.details.length){
          this.$message({message: '请添加入库明细', type: 'warning'});
          return false;
        }

        if(this.allCount != this.orderData.count){
          this.$message({message: '入库明细总计数量不等于待入库数量', type: 'warning'});
          return false;
        }

        let params = {};
        params.workNumber = this.workNumber;
        params.details = this.details;

        this.http.postJson(this).url(this.config.storage.put_in).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.$message({message: '入库成功', type: 'success'});
            this.dialogVisible = false;
            this.findByPage();
            if (this.workStatus == 1) {
              this.findCount();
            }
          },(error) => {console.log(error)}
        );
      },
      /*查询列表*/
      findByPage() {
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          workNumber:this.listQuery.workNumber,
          recordNumber:this.listQuery.recordNumber,
          type:this.type,
          workStatus:this.workStatus
        };

        this.listQuery.loading = true;

        this.http.get(this).url(this.config.storage.putIn_workStorage).params(params).request((response) => {
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
      /*根据workNumber查询详情*/
      findOrder() {

        if (!this.workNumber && !this.workNumber.trim()) {
          this.$message({message:((this.type == 2) ? '售后换货' : '售后退货' ) + '工单编码不能为空', type: 'warning'});
          return false;
        }

        this.http.get(this).url(this.config.storage.workNumber_storage_detail).restful({workNumber:this.workNumber}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
          
          }
          let data = response.data.data;
          console.log(data)
          if(!data) {
            this.showOrderDetail = false;
            this.$message({message: '系统没有查询到相关售后工单信息，请确认工单编号是否正确!', type: 'warning'});
          } else {
            if (data.type != this.type) {
              if (this.type == 2) {
                this.$message({message: '工单编号不是换货工单!', type: 'warning'});
                return ;
              } else if (this.type == 3) {
                this.$message({message: '工单编号不是退货工单!', type: 'warning'});
                return ;
              }
            }
            data.styleNumber = data.skuNumber.slice(-2);
            this.orderData = data;
            if (this.type == 2) {
              this.title = '换货入库详情';
            } else {
              this.title = '退货入库详情';
            }
            this.showOrderDetail = true;
          }

          },(error) => {console.log(error)}
        )
      },
      /*查询详情*/
      seeDetail(data) {
        this.http.get(this).url(this.config.storage.work_storage_detail).restful({recordId:data.recordId}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
           this.restForm();
           let data = response.data.data;
           data.styleNumber = data.skuNumber.slice(-2);
           this.workNumber = data.workNumber;
           this.orderData = data;

            if (this.type == 2) {
              this.title = '换货入库详情';
            } else {
              this.title = '退货入库详情';
            }
            this.showOrderDetail = true;
            this.dialogVisible = true;
          },(error) => {console.log(error)}
        )
      },
      /*查询详情*/
      loadDetailData(data) {
        this.http.get(this).url(this.config.storage.work_storage_detail).restful({recordId:data.recordId}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
           let data = response.data.data;
           data.styleNumber = data.skuNumber.slice(-2);
           
           this.exchangeDataDetail = data;
           this.detailVisible = true;
          },(error) => {console.log(error)}
        )
      },
      /*查询代办数量*/
      findCount() {
        let params = {};
        params.type = this.type;
        this.http.get(this).url(this.config.storage.putIn_count).restful(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }

          this.count = response.data.data;

          },(error) => {console.log(error)}
        );
      },
      // 入库凭证打印
      printPutStorage() {
       let url = null;

       if(process.env.NODE_ENV == "production") {
          //线上url
           url = "/api/make-pdf/create-after-sale-record/构巢入库凭证.pdf";
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url = "/api/make-pdf/create-after-sale-record/构巢入库凭证.pdf";
        } else {
          //本地url
          url = "http://192.168.20.104:8888/api/make-pdf/create-after-sale-record/构巢入库凭证.pdf";
        }

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken + "&recordId=" + this.exchangeDataDetail.recordId;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      },
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
    .storageMessage{
      >div{
        margin-bottom: 20px;
        color: #343434;
        >span{
          color:#343434;
          margin-left: 6px;
          font-weight:700;
        }
      }
    }
  }
</style>
