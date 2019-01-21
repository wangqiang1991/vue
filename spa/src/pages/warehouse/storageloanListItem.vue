<template>       
  <div class="app-container calendar-list-container" id="storageloanListItem_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

          <el-date-picker @change="doSearch()" v-model="orderDate" :editable="false" :clearable="true"  type="daterange" class="filter-item"  align="left" placeholder="借出起止日期">
          </el-date-picker>

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.recordNumber" style="width: 200px !important;" class="filter-item" placeholder="请输入借出单编码">
          </el-input>

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.skuNumber" style="width: 200px !important;" class="filter-item" placeholder="请输入商品SKU编码">
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
            label="借出单编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.recordNumber}}</span>
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
            label="商品名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsTitle}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品SKU名称">
            <template scope="scope">
              <span>{{scope.row.styleName + '-' + scope.row.styleSubName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="借出数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.count}}</span>
            </template>
          </el-table-column>

  <!--         <el-table-column
            label="借出状态"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.loanStatus == 1">借出中</span>
              <span v-if="scope.row.loanStatus == 2">已完成</span>
              <span v-if="scope.row.bad">已报损</span>
              <span v-if="scope.row.outside">借转调</span>
            </template>
          </el-table-column> -->

          <el-table-column
            label="借出原因"
            align="center">
            <template scope="scope">
              <span>{{scope.row.purpose}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="借出时间"
            align="center">
            <template scope="scope">
              <span>{{scope.row.loanDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
             <el-button size="small" class="fontFamily icon-browse" type="primary" @click="seeDetail(scope.row.recordId)">查看详情</el-button>
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

      <el-dialog  title="借出单详情"  :visible.sync="detailVisible" class="detailDialog" :before-close="dialogClose">
        
        <p v-if="status == 1 && haseNoCount">
          <b style="margin-right:10px;">操作:</b>
          <el-button @click="addBackItem" class="filter-item" type="primary" size="small" >商品归还</el-button>
          <el-button @click="addLoanItem" class="filter-item" type="primary" size="small" >商品报损</el-button>
          <el-button @click="addOutSideItem" class="filter-item" type="primary" size="small" >商品借转调</el-button>
        </p> 

        <div class="exchangeGoods_div">
          <p class="orderWarehouse_detail">借出单编码:<span>{{exchangeDataDetail.recordNumber}}</span></p>
          <p class="orderWarehouse_detail">商品SKU编码:<span>{{exchangeDataDetail.skuNumber}}</span></p>  
          <p class="orderWarehouse_detail">商品名称:<span>{{exchangeDataDetail.goodsTitle}}</span></p>
          <p class="orderWarehouse_detail">规格名称:<span>{{exchangeDataDetail.styleName + '-' + exchangeDataDetail.styleSubName}}</span></p>
          <p class="orderWarehouse_detail">商品编号:<span>{{exchangeDataDetail.goodsNumber}}</span></p>
          <p class="orderWarehouse_detail">规格编号:<span>{{exchangeDataDetail.styleNumber}}</span></p>

          <p class="orderWarehouse_detail">借出状态:
            <span v-if="status == 1">借出中</span>
            <span v-if="status == 2">已完成</span>
            <span v-if="status == 3">已报损</span>
            <span v-if="status == 4">借转调</span>
          </p>

          <p class="orderWarehouse_detail">借出数量:<span>{{exchangeDataDetail.count}}</span></p>
          <p class="orderWarehouse_detail">借出时间:<span>{{exchangeDataDetail.loanDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span></p>
          
          <p class="orderWarehouse_detail">借出原因:<span>{{exchangeDataDetail.purpose }}</span></p>
          <p class="orderWarehouse_detail">借出备注:<span>{{exchangeDataDetail.description ? exchangeDataDetail.description : "无" }}</span></p>



          <p class="orderWarehouse_detail" style="overflow:hidden;" ><span style="float:left;font-weight:400;">商品SKU封面:</span><span><img :src="exchangeDataDetail.cover" style="width:80px;height:80px;"></span></p>

            <h3 v-if="status != 3 && status != 4 && showarray1">归还明细 </h3>
            <el-table v-if="status != 3 && status != 4 && showarray1"
             :data="exchangeDataDetail.normalBack"
              border
              style="width: 100%;">

              <el-table-column type="index" align="center" label="序号" width="65">
              </el-table-column>

              <el-table-column
                label="归还数量"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.count}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="归还备注"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.description}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="归还时间"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.backDte | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>

            </el-table>



            <h3 v-if="status != 4 && showarray2">报损明细 </h3>
            <el-table v-if="status != 4 && showarray2"
             :data="exchangeDataDetail.badBack"
              border
              style="width: 100%;">

              <el-table-column type="index" align="center" label="序号" width="65">
              </el-table-column>

              <el-table-column
                label="报损数量"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.count}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="报损程度">
                <template scope="scope">
                  <span >{{scope.row.damageDegree}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="报损备注"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.description}}</span>
                </template>
              </el-table-column>

               <el-table-column
                label="报损时间"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.backDte | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>

            </el-table>


             <h3 v-if="status != 3 && showarray3">结转调明细 </h3>
            <el-table v-if="status != 3 && showarray3"
             :data="exchangeDataDetail.purposeBack"
              border
              style="width: 100%;">

              <el-table-column type="index" align="center" label="序号" width="65">
              </el-table-column>

              <el-table-column
                label="结转调数量"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.count}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="结转调用途">
                <template scope="scope">
                  <span>{{scope.row.purpose}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="结转调备注"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.description}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="结转调时间"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.backDte | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
              </el-table-column>

            </el-table>


        </div>     

      </el-dialog>

      <el-dialog  :title="backLoanDataItem.title" :visible.sync="loanDataItemVisible">
        <el-form class="small-space" label-position="right" label-width="120px">

          <el-form-item label="未归还数量:">
            <b>{{haseNoCount}}</b>
          </el-form-item> 

          <el-form-item label="数量:">
            <el-input-number  v-model="backLoanDataItem.count" :min="1" :max="99999"></el-input-number>
          </el-form-item> 

          <el-form-item label="备注:">
            <el-input type="textarea" v-model="backLoanDataItem.description" style="width:50%;" placeholder="请输入备注" maxlength="100" :rows="3"> </el-input> 
          </el-form-item>  

          <el-form-item label="报损程度:" v-show="backLoanDataItem.type == 2">
             <el-select v-model="backLoanDataItem.damageDegree" filterable placeholder="请选择报损程度">
                <el-option
                  v-for="item in damageDegree"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
          </el-form-item>  

          <el-form-item label="借转调用途:" v-show="backLoanDataItem.type == 3">
             <el-select v-model="backLoanDataItem.purpose" filterable placeholder="请选择借转调用途">
                <el-option
                  v-for="item in purposeData"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
          </el-form-item>  


        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="loanDataItemVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddLoanItem">确 定</el-button>
        </div>
        
      </el-dialog>


  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  export default{
    props:['loanStatus','queryBad','queryOutside','status'],
    data() {
      return {
        detailType:[{type:1,name:"正常"},{type:2,name:'损坏'},{type:3,name:'借转调'}],
        damageDegree:[{name:"轻微折损"},{name:"一般折损"},{name:"严重折损"},{name:"完全折损"}],
        purposeData:[{name:"办公室固定资产"},{name:"民宿样板间固定资产"},{name:"卖场固定资产"},{name:"其他"}],
        surplusCount:0,
        backLoanDataItem:{
          type:'',
          count:1,
          description:'',
          purpose:'',
          damageDegree:'',
          title:'',
        },
        loanDataItemVisible:false,

        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          skuNumber:'',
          recordNumber:''
        },
        recordId:null,
        orderDate:null,
        exchangeDataDetail:{},
        detailVisible:false,
        showarray1:false,
        showarray2:false,
        showarray3:false,
        haseNoCount:0
      }
    },
    mounted() {
      this.findByPage();
    },
    methods:{
      loadData() {
        this.findByPage();
      },
      dialogClose() {
        this.findByPage();
        this.detailVisible = false;
      },
      addBackItem() {
        this.resetLoanDataItem();
        this.backLoanDataItem.title = "归还明细";
        this.backLoanDataItem.type = 1;
        this.loanDataItemVisible = true;
      },
      addLoanItem() {
        this.resetLoanDataItem();
        this.backLoanDataItem.title = "报损明细";
        this.backLoanDataItem.type = 2;
        this.loanDataItemVisible = true;
      },
      addOutSideItem() {
        this.resetLoanDataItem();
        this.backLoanDataItem.title = "借转调明细";
        this.backLoanDataItem.type = 3;
        this.loanDataItemVisible = true;
      },
      resetLoanDataItem() {
        this.backLoanDataItem = {
          type:'',
          count:1,
          description:'',
          purpose:'',
          damageDegree:'',
          title:""
        }
      },
      checkForm() {

        if (!this.validate.validatNumber(this.backLoanDataItem.count) ) {
          this.$message({message: '数量不能为小数', type: 'warning'});
          return false;
        }

        if (!this.backLoanDataItem.description &&  !this.backLoanDataItem.description.trim()) {
          this.$message({message: '备注不能为空', type: 'warning'});
          return false;
        }

        if(this.backLoanDataItem.type == 2) {
          if (!this.backLoanDataItem.damageDegree)  {
            this.$message({message: '请选择报损程度', type: 'warning'});
            return false;
          }
        }

        if(this.backLoanDataItem.type == 3) {
          if (!this.backLoanDataItem.purpose)  {
            this.$message({message: '请选择借转调用途', type: 'warning'});
            return false;
          }
        }


        if(this.backLoanDataItem.count > this.exchangeDataDetail.count){
          this.$message({message: '归还数量不能大于借出数量', type: 'warning'});
          return false;
        }


        return true;

      },

      confirmAddLoanItem() {
        console.log(this.recordId)
        
        if(this.checkForm()){
          let params = {};
          params.recordNumber = this.exchangeDataDetail.recordNumber;
          let details = [];
          var obj = {};
          obj.type = this.backLoanDataItem.type;
          obj.count = this.backLoanDataItem.count;
          obj.damageDegree = this.backLoanDataItem.damageDegree;
          obj.purpose = this.backLoanDataItem.purpose;
          obj.description = this.backLoanDataItem.description;
          details.push(obj);

          params.details = details;

          this.http.postJson(this).url(this.config.storage.back_loan).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            if (this.backLoanDataItem.type == 1) {
              this.$message({message: '商品归还成功', type: 'success'});
            } else if (this.backLoanDataItem.type == 2) {
              this.$message({message: '商品报损成功', type: 'success'});
            } else if (this.backLoanDataItem.type == 3) {
              this.$message({message: '商品借转调成功', type: 'success'});
            }
           

            this.loanDataItemVisible = false;
            this.seeDetail(this.recordId);
            },(error) => {console.log(error)}
          );
        }
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
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          skuNumber:this.listQuery.skuNumber,
          recordNumber:this.listQuery.recordNumber,
        };

        params.loanStatus = this.loanStatus;
        params.queryBad = this.queryBad;
        params.queryOutside = this.queryOutside;

        this.listQuery.loading = true;

        if (this.orderDate && this.orderDate[0] && this.orderDate[1]) {
          params.beginDate = parseTime(this.orderDate[0]);
          params.endDate = parseTime(this.orderDate[1].setHours(23,59,59));
        } else {
          params.beginDate = null;
          params.endDate = null;
        }

        this.http.get(this).url(this.config.storage.loan_list).params(params).request((response) => {
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
      seeDetail(recordId) {
        this.http.get(this).url(this.config.storage.loan_detail).restful({recordId:recordId}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }

          this.recordId = recordId;
          let data = response.data.data;
         
          let normalBack = [];
          let badBack = []
          let purposeBack = [];

          data.details.forEach((item)=>{
            if(item.type == 1){
              normalBack.push(item)
            }
            if(item.type == 2){
              badBack.push(item)
            }
            if(item.type == 3){
              purposeBack.push(item)
            }
          });
          this.showarray1 =  normalBack.length ? true :false;
          this.showarray2 =  badBack.length ? true :false;
          this.showarray3 =  purposeBack.length ? true :false;
          data.normalBack = normalBack;
          data.badBack = badBack;
          data.purposeBack = purposeBack;
          this.exchangeDataDetail = data;
          this.haseNoCount = data.count - data.normalCount - data.badCount - data.outsideCount;
          this.detailVisible = true; 
          },(error) => {console.log(error)}
        )
      },
    }
  }
</script>

<style  lang="scss">
  #storageloanListItem_vue{
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
