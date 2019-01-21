<template>
  <div class="app-container calendar-list-container" id="storageGoods_vue">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-select v-model="firstCategory" style="width:150px" clearable @change="onFirstCategoryChange" filterable
                       placeholder="请选择一级分类">
              <el-option
                v-for="item in firstCategorys"
                :key="item.name"
                :label="item.name"
                :value="item.categoryId">
              </el-option>
            </el-select>

            <el-select @change="selectChanged()" v-model="secondCategory" style="width:150px" clearable filterable placeholder="请选择二级分类">
              <el-option
                v-for="item in secondCategorys"
                :key="item.name"
                :label="item.name"
                :value="item.categoryId">
              </el-option>
            </el-select>

            <el-select  @change="selectChanged()" v-model="listQuery.storage" style="width:180px" clearable filterable placeholder="商品仓储区域状态">
              <el-option
                v-for="item in statusItems"
                :key="item.name"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

            <el-input @keyup.enter.native="keyEvent()" v-model="listQuery.keyword" style="width: 200px !important;" class="filter-item"
                      placeholder="输入商品名称或编码">
            </el-input>
            <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                       icon="search">搜索
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 列表 -->
      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-table
         :row-class-name="tableRowClassName"
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          ref="multipleTable"
          :data="dataList"
          :highlight-current-row="true"
          border
          style="width: 100%"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange">

          <el-table-column type="expand" label="展开">
            <template scope="props" >
               <p class="goods_style_message" :class="{'show_no_storage':(style.storageType == 2),'is_storage':(style.storageType == 3)}"  v-for="style in props.row.styleVos">
                 <span>
                    <b v-if='style.status == 2' style="color:#28ffff;">(临时下架SKU)</b>
                    <b v-if='style.status == 4' style="color:#1313ff;">(永久下架SKU)</b> 
                    规格名称: <b>{{style.name+"-"+style.subName}} </b></span>
                 <span>规格编码:  <b>{{style.styleNumber}} </b></span>
                 <span>库存:  <b>{{style.count}}件 </b> <b v-if="style.purchaseCount">(已发起采购数量: {{style.purchaseCount}})</b></span>
                 <span>销量:  <b>{{style.totalCount - style.count}}件 </b></span>
               </p>
            </template>
          </el-table-column>

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="商品封面"
            align="center"
            vertical="middle"
            width="120">
            <template scope="scope">
              <span v-if="!scope.row.cover" style="color:orangered">未编辑封面</span>
              <img v-else style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200"
                   class="gc_praiselist_list_img">
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="商品名称">
            <template scope="scope">
              <span >{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="goodsNumber"
            label="商品编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsNumber}}</span>
            </template>
          </el-table-column>

           <el-table-column
            label="商品分类"
            align="center">
            <template scope="scope">
              <p style="margin-top:5px;margin-bottom:5px;"  v-for="category in scope.row.categories"><span>{{category.firstCategoryName}}/</span><span>{{category.secondCategoryName}}</span></p>
            </template>
          </el-table-column>

         <!--  <el-table-column
            label="规格信息(名称/编码/剩余库存/销量)"
            align="center">
            <template scope="scope">
              <p style="margin-top:5px;margin-bottom:5px;" :class="{'show_no_storage':(style.count < 0)}"  v-for="style in scope.row.styleVos"><span>{{style.name+"-"+style.subName}} /</span><span> {{style.styleNumber}} /</span><span> {{style.count}}件 /</span><span> {{style.totalCount - style.count}}件 </span></p>
            </template>
          </el-table-column>
 -->
          <el-table-column
            label="存放仓库"
            align="center">
            <template scope="scope">
              <span style="color:orangered;" v-if="scope.row.storageRegion == null">未设置</span>
              <p v-else><span v-for="(name,index) in scope.row.storageRegion.fullName"><i v-if="index != 0"> / </i>  {{name}}</span> </p>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="250">
            <template scope="scope">

                <el-button v-if="scope.row.storage"   type="primary" size="small" @click="setStorage(scope.row)">修改商品仓储</el-button>
                <el-button v-if="!scope.row.storage" type="primary" size="small" @click="setStorage(scope.row)">设置商品仓储</el-button>

                <el-dropdown  trigger="click">
                <el-button type="primary" size="small" style="margin-left:10px;">更多操作<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
                  <el-dropdown-menu slot="dropdown" class="storage_goods_dropdown">
                    <el-dropdown-item><el-button type="primary" size="small" @click="addPurchaseOrder(scope.row)">发起采购</el-button></el-dropdown-item>
                    <el-dropdown-item><el-button type="primary" size="small" @click="addloanGoods(scope.row)">商品借出</el-button></el-dropdown-item>
                    <el-dropdown-item><el-button type="primary" size="small" @click="addOutsideGoods(scope.row)">商品调拨</el-button></el-dropdown-item>
                    <el-dropdown-item><el-button type="primary" size="small" @click="addBadGoods(scope.row)">商品报损</el-button></el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>

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

     <!-- 设置商品仓储区域弹框 -->
      <el-dialog  title="设置商品仓储区域" :visible.sync="setStorageDialog">
        <span><span style="color:#343434;display:inline-block;width:120px;text-align:right;margin-right:16px;">商品名称: </span>{{goodsName}}</span>
        <p><span><span style="color:#343434;display:inline-block;width:120px;text-align:right;margin-right:16px;">商品编码: </span>{{goodsNumber}}</span></p>
        <span style="color:#343434;display:inline-block;width:120px;text-align:right;margin-right:16px;">设置仓储区域: </span>
          <el-cascader placeholder="可搜索仓储区域"
            :options="storageData"
            :props="defaultProps"
            change-on-select
            clearable
            style="width:260px;"
            v-model="storageIds"
            filterable>
          </el-cascader>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setStorageDialog = false">取 消</el-button>
          <el-button type="primary" @click="addStorage">确 定</el-button>
      </div>
    </el-dialog>


    <!--     发起商品采购弹框 -->
     <el-dialog  title="发起商品采购" :visible.sync="purchaseOrder.dialogVisible" class="storage_goods_dialog">
        <p><span>商品名称:</span>{{purchaseOrder.title}}</p>
        <p><span>商品编码:</span>{{purchaseOrder.goodsNumber}}</p>
        <p style="color:orangered;"><span style="color:orangered;">已发起采购数量:</span>{{purchaseOrder.purchaseCount}}</p>
        <p><span>采购数量:</span><el-input-number v-model="purchaseOrder.count" :min="1" :max="99999"></el-input-number> </p>
        <p>
          <span>选择商品SKU:</span>
          <el-select @change="styleChanged" v-model="purchaseOrder.styleId" style="width:192px;margin-left:-4px" clearable filterable placeholder="请选择商品SKU">
            <el-option
              v-for="item in purchaseOrder.styles"
              :key="item.styleId"
              :label="item.name+'-'+item.subName"
              :value="item.styleId">
            </el-option>
          </el-select>
        </p>
        <p>
          <span>采购截止日期:</span>
          <el-date-picker
            style="margin-left:-4px"
            v-model="purchaseOrder.deadline"
            type="date"
            align="right"
            :picker-options="pickerOptions"
            placeholder="选择截止日期">
          </el-date-picker>
        </p>
        <p>
          <span style="float:left;">商品采购备注:</span>
          <el-input v-model="purchaseOrder.description" type="textarea" style="width:50%;" class="filter-item" placeholder="商品采购备注" maxlength="100"></el-input>
        </p>

        <div slot="footer" class="dialog-footer">
          <el-button @click="purchaseOrder.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmAddPurchaseOrder">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 商品借出 -->
     <el-dialog  title="商品借出" :visible.sync="loanGoods.dialogVisible" class="storage_goods_dialog">

        <p><span>商品名称:</span>{{loanGoods.title}}</p>
        <p><span>商品编码:</span>{{loanGoods.goodsNumber}}</p>
        <p><span>借出数量:</span><el-input-number v-model="loanGoods.count" :min="1" :max="99999"></el-input-number> </p>
        <p>
          <span>借出商品SKU:</span>
          <el-select v-model="loanGoods.styleNumber" style="width:192px;margin-left:-4px" clearable filterable placeholder="请选择商品SKU">
            <el-option
              v-for="item in loanGoods.styles"
              :key="item.styleNumber"
              :label="item.name+'-'+item.subName"
              :value="item.styleNumber">
              <span style="float: left">{{ item.name+'-'+item.subName }}</span>
              <span v-if='item.status == 2' style="float: right; color: #28ffff;margin-left:16px; font-size: 13px">临时下架SKU</span>   
              <span v-if='item.status == 4' style="float: right; color: #1313ff;margin-left:16px; font-size: 13px">永久下架SKU</span>   
            </el-option>

                <el-option
                  v-for="item in filterProviders"
                  :key="item.providerName"
                  :label="item.providerName"
                  :value="item.providerId">
                  <span style="float: left">{{ item.name+'-'+item.subName }}</span>
                  <span v-if='item.status == 2' style="float: right; color: #28ffff;margin-left:16px; font-size: 13px">临时下架SKU</span>   
                  <span v-if='item.status == 4' style="float: right; color: #1313ff;margin-left:16px; font-size: 13px">永久下架SKU</span>  
              </el-option>

          </el-select>
        </p>
        <p>
          <span style="float:left;">借出用途:</span>
          <el-input v-model="loanGoods.purpose" type="textarea" style="width:75%;" :rows="3" class="filter-item" placeholder="输入借出用途" maxlength="100"></el-input>
        </p>
        <p>
          <span style="float:left;">借出备注:</span>
          <el-input v-model="loanGoods.description" type="textarea" style="width:75%;" :rows="3" class="filter-item" placeholder="输入借出备注" maxlength="100"></el-input>
        </p>


        <div slot="footer" class="dialog-footer">
          <el-button @click="loanGoods.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmLoanGoods">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 商品调拨 -->
     <el-dialog  title="商品调拨" :visible.sync="outside.dialogVisible" class="storage_goods_dialog">

        <p><span>商品名称:</span>{{outside.title}}</p>
        <p><span>商品编码:</span>{{outside.goodsNumber}}</p>
        <p><span>调拨数量:</span><el-input-number v-model="outside.count" :min="1" :max="99999"></el-input-number> </p>
        <p>
          <span>调拨商品SKU:</span>
          <el-select v-model="outside.styleNumber" style="width:200px; margin-left:-4px" clearable filterable placeholder="请选择商品SKU">
            <el-option
              v-for="item in outside.styles"
              :key="item.styleNumber"
              :label="item.name+'-'+item.subName"
              :value="item.styleNumber">
              <span style="float: left">{{ item.name+'-'+item.subName }}</span>
              <span v-if='item.status == 2' style="float: right; color: #28ffff;margin-left:16px; font-size: 13px">临时下架SKU</span>   
              <span v-if='item.status == 4' style="float: right; color: #1313ff;margin-left:16px; font-size: 13px">永久下架SKU</span>  
            </el-option>
          </el-select>
        </p>
        <p>
          <span>调拨用途:</span>
          <el-select v-model="outside.purpose" style="width:200px; margin-left:-4px" clearable filterable placeholder="请选择调拨用途">
            <el-option
              v-for="item in purposeList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </p>
        <p>
          <span style="float:left;">调拨备注:</span>
          <el-input v-model="outside.description" type="textarea" style="width:75%;" :rows="3" class="filter-item" placeholder="输入调拨备注" maxlength="100"></el-input>
        </p>


        <div slot="footer" class="dialog-footer">
          <el-button @click="outside.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmOutside">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 商品报损 -->
    <el-dialog  title="商品报损" :visible.sync="badGoods.dialogVisible" class="storage_goods_dialog">

        <p><span>商品名称:</span>{{badGoods.title}}</p>
        <p><span>商品编码:</span>{{badGoods.goodsNumber}}</p>
        <p><span>报损数量:</span><el-input-number v-model="badGoods.count" :min="1" :max="99999"></el-input-number> </p>
        <p>
          <span>报损商品SKU:</span>
          <el-select v-model="badGoods.styleNumber" style="width:200px; margin-left:-4px" clearable filterable placeholder="请选择商品SKU">
            <el-option
              v-for="item in badGoods.styles"
              :key="item.styleNumber"
              :label="item.name+'-'+item.subName"
              :value="item.styleNumber">
              <span style="float: left">{{ item.name+'-'+item.subName }}</span>
              <span v-if='item.status == 2' style="float: right; color: #28ffff;margin-left:16px; font-size: 13px">临时下架SKU</span>   
              <span v-if='item.status == 4' style="float: right; color: #1313ff;margin-left:16px; font-size: 13px">永久下架SKU</span>  
            </el-option>
          </el-select>
        </p>
        <p>
          <span>报损程度:</span>
          <el-select v-model="badGoods.damageDegree" style="width:200px; margin-left:-4px" clearable filterable placeholder="请选择报损程度">
            <el-option
              v-for="item in damageDegree"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </p>
        <p>
          <span style="float:left;">报损备注:</span>
          <el-input v-model="badGoods.description" type="textarea" style="width:75%;" :rows="3" class="filter-item" placeholder="输入报损备注" maxlength="100"></el-input>
        </p>


        <div slot="footer" class="dialog-footer">
          <el-button @click="badGoods.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmBad">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default{
    data() {
      return {
        purposeList:["办公室固定资产","民宿样板间固定资产","卖场固定资产","其他"],
        damageDegree:["轻微折损","一般折损","严重折损","完全折损"],
        badGoods:{  //报损
          skuNumber:null,
          count:1,
          damageDegree:"",
          description:"",
          dialogVisible:false,
          title:'',
          goodsNumber:'',
          styleNumber:'',
          styles:[],
        },
        loanGoods:{    //商品借出
          skuNumber:null,
          count:1,
          purpose:"",
          description:"",
          dialogVisible:false,
          title:'',
          goodsNumber:'',
          styleNumber:'',
          styles:[],
        },
        outside:{    //商品借出
          skuNumber:null,
          count:1,
          purpose:"",
          description:"",
          dialogVisible:false,
          title:'',
          goodsNumber:'',
          styleNumber:'',
          styles:[],
        },
        purchaseOrder:{    //采购对象数据
          dialogVisible:false,
          title:"",
          goodsNumber:"",
          count:1,
          styles:[],
          styleId:null,
          goodsId:null,
          deadline:"",
          description:'',
          purchaseCount:0,
        },
        storageIds:[],
        setStorageDialog:false,
        goodsName:"",
        goodsNumber:"",
        goodsId:"",
        statusItems:[{name:"已设置",value:true},{name:"未设置",value:false}],
        dataList:[],
        categorys: [],
        firstCategorys: [],
        secondCategorys: [],
        firstCategory: null,
        secondCategory: null,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          keyword: "",
          column: "",
          order: "",
          storage:null,
        },
        storageData:[],
        nameArray:[],
        IdDataSource: {},
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        defaultProps: {
          value:"id",
          children:"children",
          label: "name"
        }
      }
    },
    mounted() {
      this.findCategroy();
      this.findByStorage();
    },
    methods:{
      tableRowClassName(row,index) {
        console.log(row,index)
        let flag = true;
        
        if (!row.styleVos) {
          flag = true;
        } else {
          row.styleVos.forEach((item)=>{
            if (item.count < 0 ) {
              flag = false;
            }
          });
        }

        if (flag) {
          return "isNormal";
        } else {
          return "isWarning";
        }
      },
      resetloan() {
         this.loanGoods = {
          skuNumber:null,
          count:1,
          purpose:"",
          description:"",
          dialogVisible:false,
          title:'',
          goodsNumber:'',
          styleNumber:'',
          styles:[],
        }
      },
      resetOutside() {
         this.outside = {
          skuNumber:null,
          count:1,
          purpose:"",
          description:"",
          dialogVisible:false,
          title:'',
          goodsNumber:'',
          styleNumber:'',
          styles:[],
        }
      },
      resetBad() {
        this.badGoods = {  
          skuNumber:null,
          count:1,
          damageDegree:"",
          description:"",
          dialogVisible:false,
          title:'',
          goodsNumber:'',
          styleNumber:'',
          styles:[],
        }
      },
      checkLoanFrom() {
        if (!this.validate.validatNumber(this.loanGoods.count) ) {
          this.$message({message: '借出数量不能为小数', type: 'warning'});
          return false;
        }

        if (!this.loanGoods.styleNumber) {
          this.$message({message: '请选择借出商品SKU', type: 'warning'});
          return false;
        }

        if (!this.loanGoods.purpose || !this.loanGoods.purpose.trim() ) {
          this.$message({message: '借出用途不能为空', type: 'warning'});
          return false;
        }

        return true;

      },
      checkOutside() {
        if (!this.validate.validatNumber(this.outside.count) ) {
          this.$message({message: '调拨数量不能为小数', type: 'warning'});
          return false;
        }

        if (!this.outside.styleNumber) {
          this.$message({message: '请选商品SKU', type: 'warning'});
          return false;
        }

        if (!this.outside.purpose || !this.outside.purpose.trim() ) {
          this.$message({message: '调拨用途不能为空', type: 'warning'});
          return false;
        }

        return true;

      },
      checkBadFrom() {
        if (!this.validate.validatNumber(this.badGoods.count) ) {
          this.$message({message: '报损数量不能为小数', type: 'warning'});
          return false;
        }

        if (!this.badGoods.styleNumber) {
          this.$message({message: '请选商品SKU', type: 'warning'});
          return false;
        }

        if (!this.badGoods.damageDegree || !this.badGoods.damageDegree.trim() ) {
          this.$message({message: '报损程度不能为空', type: 'warning'});
          return false;
        }

        return true;
      },
      addloanGoods(goods) {
        this.resetloan();
        this.loanGoods.dialogVisible = true;
        this.loanGoods.title = goods.title;
        this.loanGoods.goodsNumber = goods.goodsNumber;
        this.loanGoods.styles = goods.styleVos;
      },
      addOutsideGoods(goods) {
        this.resetOutside();
        this.outside.dialogVisible = true;
        this.outside.title = goods.title;
        this.outside.goodsNumber = goods.goodsNumber;
        this.outside.styles = goods.styleVos;
      },
      addBadGoods(goods) {
        this.resetBad();
        this.badGoods.dialogVisible = true;
        this.badGoods.title = goods.title;
        this.badGoods.goodsNumber = goods.goodsNumber;
        this.badGoods.styles = goods.styleVos;
      },
      comfirmLoanGoods() {
        if(this.checkLoanFrom()){
          let params = {};
          params.skuNumber = this.loanGoods.goodsNumber + this.loanGoods.styleNumber;
          params.count = this.loanGoods.count;
          params.purpose = this.loanGoods.purpose;
          params.description = this.loanGoods.description;
          console.log(params)
          this.http.postJson(this).url(this.config.storage.create_loan).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({message:"商品借出提交成功!", type: 'success'});
            this.findByPage();
            this.loanGoods.dialogVisible = false;
            }, (err) => {console.log(err)}
          );
        }
      },
      comfirmOutside() {
        if(this.checkOutside()){
          let params = {};
          params.skuNumber = this.outside.goodsNumber + this.outside.styleNumber;
          params.count = this.outside.count;
          params.purpose = this.outside.purpose;
          params.description = this.outside.description;
          console.log(params)
          this.http.postJson(this).url(this.config.storage.create_outside).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({message:"商品调拨提交成功!", type: 'success'});
            this.findByPage();
            this.outside.dialogVisible = false;
            }, (err) => {console.log(err)}
          );
        }
      },
      comfirmBad() {
        if(this.checkBadFrom()){
          let params = {};
          params.skuNumber = this.badGoods.goodsNumber + this.badGoods.styleNumber;
          params.count = this.badGoods.count;
          params.type = 1;
          params.damageDegree = this.badGoods.damageDegree;
          params.description = this.badGoods.description;
          console.log(params)
          this.http.postJson(this).url(this.config.storage.create_storageBad).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({message:"商品报损提交成功!", type: 'success'});
            this.findByPage();
            this.badGoods.dialogVisible = false;
            }, (err) => {console.log(err)}
          );
        }
      },
      resetPurchaseOrder() {
        this.purchaseOrder = {
          dialogVisible:false,
          title:"",
          goodsNumber:"",
          count:1,
          styles:[],
          styleId:null,
          goodsId:null,
          deadline:"",
          purchaseCount:0,
          description:''
        };
      },
      checkPurchaseOrder() {

        if (!this.validate.validatNumber(this.purchaseOrder.count) ) {
          this.$message({message: '采购数量不能为小数', type: 'warning'});
          return false;
        }

        if (!this.purchaseOrder.styleId) {
          this.$message({message: '请选择商品SKU', type: 'warning'});
          return false;
        }
        if (!this.purchaseOrder.deadline) {
          this.$message({message: '请选择日期', type: 'warning'});
          return false;
        }
        return true;
      },
      styleChanged(val) {
        console.log(val)
        if (val) {
          this.purchaseOrder.styles.forEach((item)=>{
            if (item.styleId == val) {
              if (item.purchaseCount) {
                this.purchaseOrder.purchaseCount = item.purchaseCount;
              } else {
                this.purchaseOrder.purchaseCount = 0;
              }
            }
          })
        } else {
          this.purchaseOrder.purchaseCount = 0;
        }
      },
      addPurchaseOrder(goods) {
        this.resetPurchaseOrder();
        this.purchaseOrder.dialogVisible = true;
        this.purchaseOrder.title = goods.title;
        this.purchaseOrder.goodsNumber = goods.goodsNumber;
        this.purchaseOrder.goodsId = goods.goodsId;
        this.purchaseOrder.styles = [];

        goods.styleVos.forEach((item)=>{
          if (item.status == 1) {
            this.purchaseOrder.styles.push(item);
          }
        })
      },
      comfirmAddPurchaseOrder() {
        if(this.checkPurchaseOrder()){
          let params = {};
          params.count = this.purchaseOrder.count;
          params.goodsId = this.purchaseOrder.goodsId;
          params.styleId = this.purchaseOrder.styleId;
          params.purchaseDesc = this.purchaseOrder.description;
          params.deadline = new Date(this.purchaseOrder.deadline.setHours(23,59,59));

          this.http.postJson(this).url(this.config.storage.save_purchase_order).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({message:"已提交申请采购该商品", type: 'success'});
            this.resetPurchaseOrder();
            this.findByPage();
            }, (err) => {}
          );
        }
      },
      addStorage() {
        //console.log(this.storageIds)
        if(!this.storageIds.length){
          this.$message({message: '请选择仓储区域', type: 'warning'});
          return false;
        }
        let params = {};
        params.goodsId = this.goodsId;
        params.regionId = this.storageIds[this.storageIds.length - 1];
        this.http.postJson(this).url(this.config.storage.set_goods_storage).params(params).request( function(response) {
          if(response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.storageIds = [];
          this.setStorageDialog = false;
          this.findByPage();
          },function(err) {}
        );
      },
      setStorage(goods) {
        if(goods.storageRegion != null){
          this.findEdidStorage(goods.storageRegion,this.IdDataSource);
        }else{
          this.storageIds = [];
        }
        this.goodsName = goods.title;
        this.goodsNumber = goods.goodsNumber;
        this.goodsId = goods.goodsId;
        this.setStorageDialog = true;
      },
      findEdidStorage(storageRegion,storageData) {
        this.storageIds.unshift(storageRegion.regionId);
        if(storageRegion.parentId){
          for(var item in storageData){
            if(storageData[item].regionId == storageRegion.parentId){
              this.findEdidStorage(storageData[item],storageData);
            }
          }
        }
      },
      findStorageAllName(storageRegion,storageData) {
        this.nameArray.unshift(storageRegion.name);
        if(storageRegion.parentId){
          for(var item in storageData){
            if(storageData[item].regionId == storageRegion.parentId){
              this.findStorageAllName(storageData[item],storageData);
            }
          }
        }
      },
      onFirstCategoryChange(categoryId) {
        this.secondCategorys = [];
        this.secondCategory = null;
        this.categorys.forEach((item) => {
          if (item.parentId === categoryId) {
            this.secondCategorys.push(item);
          }
        });

        this.doSearch();
      },
      sortChange(column) {
        this.listQuery.column = column.prop;
        this.listQuery.order = column.order;
        console.log(column);
        this.findByPage();
      },
      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },
      selectChanged() {
        this.doSearch();
      },
      keyEvent() {
        this.doSearch();
      },
      findByStorage() {
        this.http.get(this).url(this.config.storage.list_url).request((response) => {
            var result = response;
            if (result.data.code != 0) {
              this.$message.error(result.data.message);
              return;
            }
            //console.log(result)
            this.geteData(result.data.data);
        }, (err) => {console.log(err)});
      },
      findByPage() {
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          reallyName: this.listQuery.condition,
          column: this.listQuery.column,
          order: this.listQuery.order,
          keyword: this.listQuery.keyword,
          storage: this.listQuery.storage
        };

        if (this.firstCategory) {
          params.firstCategoryId = this.firstCategory;
        }
        if (this.secondCategory) {
          params.secondCategoryId = this.secondCategory;
        }
        if (this.statusItem != null) {
          params.goodsStatus = this.statusItem;
        }

        this.listQuery.loading = true;

        this.http.get(this).url(this.config.storage.storage_list).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            //console.log(response.data);
            let data = response.data.data.data;
            data.forEach((item)=>{
              this.nameArray = [];
              if(item.storageRegion){
                this.findStorageAllName(item.storageRegion,this.IdDataSource);
              }

              if(this.nameArray.length){
                item.storageRegion.fullName = this.nameArray;
              }

              item.styleVos.forEach((childItem)=>{
                if (childItem.count >= 0) {
                  childItem.storageType = 1;
                } else {
                  if (childItem.purchaseCount) {
                    if((childItem.purchaseCount + childItem.count) >= 0){
                      childItem.storageType = 3;
                    }else {
                      childItem.storageType = 2;
                    }
                  } else {
                    childItem.storageType = 2;
                  }
                }
              })

            })
            this.dataList = data;
            //console.log(this.dataList)
            this.listQuery.total = response.data.data.totalSize;
            this.listQuery.loading = false;
          },
          (error) => {
            console.log(error)
          }
        );
      },
      findCategroy() {
        this.http.get(this).url(this.config.categroy.categroy_list_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.categorys = response.data.data;
              this.categorys.forEach((item) => {
                if (!item.parentId) {
                  this.firstCategorys.push(item);
                }
              });
            }, (err) => {
            });
      },
      geteData(data) {
        var _arr = [];
        var result = [];
        var _obj = {};
        var listdata = {};
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          if (_arr.indexOf(list.regionId) < 0) {
            //将所有的pemissiondId 放入数组
            _arr.push(list.regionId);
          }
          //添加一级目录
          if (list.parentId == null && list.regionId != null) {
            var temp = {};
            temp.id = list.regionId;
            temp.name = list.name;
            temp.description = list.description;
            temp.parentId = list.parentId;
            // temp.component = list.component;
            // temp.type = list.type;
            // temp.code = list.code;
            // temp.sort = list.sort;
            result.push(temp);
          }
          // var _path = {};
          // _path[list.regionId] = list.path;
          // this.pathData.push(_path);
          // var _com = {};
          // _com[list.regionId] = list.component;
          // this.componentData.push(_com);
          //根据id 保存value
          this.IdDataSource[list.regionId] = list;
        }
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          //二级目录及更多
          if (list.parentId != null && list.regionId != null) {
            if (_arr.indexOf(list.parentId) > -1) {
              //递归查找

              this.recursiveData(list, result,1);
            }
          }
        }
        //console.log(result)
        //console.log(this.IdDataSource)
        this.findByPage();
        this.storageData = result;
      },
      recursiveData(params, data, type) {
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          if (params.parentId == list.id) {
            //console.log(params)
            if (list.children == undefined) {
              //新增children数组
              var childarr = [];
              var temp = {};
              temp.id = params.regionId;
              temp.name = params.name;
              temp.description = params.description;
              temp.parentId = params.parentId;
              // temp.component = params.component;
               //temp.type = type;
              // temp.sort = params.sort;
              // temp.code = params.code;
              // temp.path = list.path;
              // temp.component = list.component;
              // temp.type = list.type;

              childarr.push(temp);
              list.children = childarr;

            } else {
              var temp = {};
              temp.id = params.regionId;
              temp.name = params.name;
              temp.description = params.description;
              temp.parentId = params.parentId;
              // temp.component = params.component;
               //temp.type = type;
              // temp.sort = params.sort;
              // temp.code = params.code;
              // temp.path = list.path;
              // temp.component = list.component;
              // temp.type = list.type;

              list.children.push(temp);
            }
            break;
          } else {
            if (list.children != undefined) {
              //let numberType = type++;
              this.recursiveData(params, list.children );
            }
          }
        }
      },
    }
  }
</script>

<style  lang="scss">
  #storageGoods_vue{
    .el-table .isNormal {
      background: #fff;
    }
    .el-table .isWarning {
      background: #ffffcc;
    }

    .el-table__body .isWarning:hover>td{
      background:#ffffcc;
    }

    .el-table__body .isWarning.current-row td{
      background:#ffffcc;
    }


    .show_no_storage{

     color:#ff4500;

    }
    .is_storage{
      color:#674545;
    }
    .storage_goods_dialog{
      p{
        >span{
          color:#343434;
          display:inline-block;
          width:120px;
          text-align:right;
          margin-right:16px;
        }
      }
    }
    .goods_style_message{
      margin-top: 15px;
      margin-bottom: 15px;
      overflow:hidden;
      >span{
        display:block;
        width:25%;
        float:left;
        text-align:left;
        img{
          width:15px;
          height:15px;
        }
      }
    }

  }
  .storage_goods_dropdown{
    .el-dropdown-menu__item{
      text-align: center;
    }
  }
</style>
