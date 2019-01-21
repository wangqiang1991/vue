<template>
  <div class="app-container calendar-list-container" style="padding-left:0;padding-right:0;">

    <div class="filter-container">

      <el-select @change="doSearch()" v-model="couponType" clearable style="width: 130px" class="filter-item" placeholder="优惠券类型">
        <el-option v-for="item in couponTypes" :key="item.type" :label="item.name" :value="item.type">
        </el-option>
      </el-select>

      <el-select @change="doSearch()" clearable style="width: 130px" class="filter-item" v-model="state" placeholder="状态">
        <el-option v-for="item in states" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="keyEvent()" v-model="name" style="width: 200px;" class="filter-item" placeholder="优惠券名称">
      </el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
      <el-button  @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="优惠券名称" width="200">
        <template scope="scope">
          <span >{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠券类型">
        <template scope="scope">
          <span v-if="scope.row.type == 1">包邮</span>
          <span v-else-if="scope.row.type == 2">折扣</span>
          <span v-else-if="scope.row.type == 3">金额</span>
          <span v-else-if="scope.row.type == 4">让利</span>
        </template>
      </el-table-column>

       <el-table-column label="优惠内容">

        <template scope="scope">
          <span v-if="scope.row.type==4">
            商品让利{{scope.row.salesPromotion}}%
          </span>
          <span v-if="scope.row.type==3">
            商品满{{scope.row.toAmount}}减{{scope.row.amount}}
          </span>
          <span v-if="scope.row.type==2">
            商品折扣{{scope.row.disCount}}折 
          </span>
        </template>

      </el-table-column>

      <el-table-column label="有效期">
        <template scope="scope">
          <div v-if="scope.row.inDate">
            <span>{{scope.row.inDate}}天</span>
          </div>
          <div v-else>
            <span>{{scope.row.beginDate | formatDate}}</span>
            <span>-</span>
            <span>{{scope.row.endDate | formatDate}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="数量" v-if="global">
        <template scope="scope">
          <span>{{scope.row.totalCount}}</span>
        </template>
      </el-table-column>

      <el-table-column label="领取">
        <template scope="scope">
          <span>{{scope.row.collectCount}}</span>
        </template>
      </el-table-column>

      <el-table-column label="使用">
        <template scope="scope">
          <span>{{scope.row.useCount}}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠券状态">
        <template scope="scope">
          <span v-if="scope.row.status == 0">未启用</span>
          <span v-if="scope.row.status == 1">已启用</span>
          <span v-if="scope.row.status == 2">已停用</span>
          <span v-if="scope.row.status == 3">已删除</span>
          <span v-if="scope.row.status == 4">已过期</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" >
        <template scope="scope">
            <el-button v-if="scope.row.status == 1" size="small" icon="circle-close" type="warning" @click="disable(scope.row)">停用
            </el-button>
            <el-button v-if="scope.row.status == 2 || scope.row.status == 0" size="small" icon="circle-check" type="success" @click="enable(scope.row)">启用
            </el-button>
            <el-button v-if="scope.row.status != 3" size="small"  icon="delete"  type="danger" @click="deleteCoupon(scope.row)">删除
            </el-button>
            <el-button icon="edit" size="small" @click="onEdit(scope.row)" :disabled="scope.row.status == 3 || scope.row.status == 4">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
       @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>

    <!-- 添加优惠券 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="coupon" label-position="left" label-width="100px" style='width: 550px; margin-left:50px;'>
        <el-form-item label="名称">
          <el-input :disabled="coupon.couponId != null" maxlength="16" v-model="coupon.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>

        <el-form-item label="优惠券描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="40" placeholder="请填写优惠券描述" v-model="coupon.description">
          </el-input>
        </el-form-item>

        <el-form-item label="数量" v-if="global">
          <el-input-number v-model="coupon.totalCount" placeholder="请输入优惠券数量" :min="0" :max="100000"></el-input-number>
        </el-form-item>

        <el-form-item label="优惠形式">
          <el-select :disabled="coupon.couponId != null" v-model="coupon.type" style="width: 130px" class="filter-item" placeholder="优惠券类型">
            <el-option v-for="item in couponTypes" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="coupon.type==2" label="折扣">
          <el-input  type="number" style="width:150px" :disabled="coupon.couponId != null" v-model="coupon.disCount" placeholder="请输入1-10" :min="0" :max="10"></el-input>
        </el-form-item>

        <el-form-item v-if="coupon.type==3" label="金额">
         <el-input  type="number" style="width:150px"  :disabled="coupon.couponId != null" v-model="coupon.amount" placeholder="请输入正整数" :min="0" :max="100000"></el-input>
        </el-form-item>

        <el-form-item v-if="coupon.type==3" label="使用门槛">
         <el-input  type="number" style="width:150px"  :disabled="coupon.couponId != null" v-model="coupon.toAmount" placeholder="商品金额" :min="0" :max="100000"></el-input>
          <span style="color:#FF4949"> 使用门槛必须大于金额才能使用优惠券。</span>
        </el-form-item>

        <el-form-item v-if="coupon.type==4 && global" label="让利率">
          <el-input-number :disabled="coupon.couponId != null" v-model="coupon.salesPromotion" placeholder="请输入1-99" :min="1" :max="99"></el-input-number>
        </el-form-item>

        <el-form-item label="使用时间">
          <el-checkbox :disabled="coupon.couponId != null" v-model="useDate" v-show="global">按起止期限</el-checkbox>
          <div v-if="useDate">
            <el-date-picker
              :disabled="coupon.couponId != null"
              v-model="useDateValue"
              type="daterange"
              align="right"
              :picker-options="pickerOptions"
              placeholder="选择日期范围">
            </el-date-picker>
          </div>
          <div v-show="global" v-else>
            <el-input-number :disabled="coupon.couponId != null" v-model="coupon.inDate" placeholder="输入有效期天数" :min="0" :max="100000">
            </el-input-number>
            <span style="color:#FF4949">按领取后计算有效期天数</span>
          </div>
        </el-form-item>


        <el-form-item v-if="!global" label="指定商品">
          <el-button type="text" @click="showSelectGoods" size="small">选择商品</el-button>
          <el-table border
            :data="selectedGoods"
            style="width: 100%">
            <el-table-column
              prop="title"
              label="商品名称">
            </el-table-column>
            <el-table-column
              prop="goodsNumber"
              label="商品编码">
            </el-table-column>
            <el-table-column
              label="操作">
              <template scope="scope">
               <el-button type="text" size="small" @click="delSelectedGoods(scope.row)">移除</el-button>
             </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitCreate">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 选择商品 -->
    <el-dialog title="选择商品" :visible.sync="selectDialogFormVisible">
      <div style="margin-bottom:10px; text-align:right;">

          <el-select v-model="firstCategory" style="width:150px" clearable @change="onFirstCategoryChange" filterable
                   placeholder="请选择一级分类">
          <el-option  
            v-for="item in firstCategorys"
            :key="item.name"
            :label="item.name"
            :value="item.categoryId">
          </el-option>
         </el-select>

        <el-select @change="doSeachreGoods()" v-model="secondCategory" style="width:150px" clearable filterable placeholder="请选择二级分类">
          <el-option
            v-for="item in secondCategorys"
            :key="item.name"
            :label="item.name"
            :value="item.categoryId">
          </el-option>
        </el-select>

        <el-input v-model="goodsQuery.keyword" style="width: 200px;" class="filter-item" placeholder="输入名称或编码">
        </el-input>

        <el-button @click="doSeachreGoods" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
      </div>
      <el-table border  
        :data="goodsList"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="goodsNumber"
          label="商品编码">
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
      </el-table>
      <div  class="pagination-container">
        <el-pagination @size-change="handleSizeChangeByGoods" :current-page="goodsQuery.pageIndex"
         @current-change="handleCurrentChangeByGoods"  :page-sizes="[10,15,20,30]" :page-size="goodsQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="goodsQuery.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectedGoods">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import {formatDate} from '@/commons/date.js'

  export default {
    directives: {
      waves
    },
    filters:{
      formatDate(time){
        if (!time) {
          return "无";
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    },
    props: ['global'],
    data() {
      return {
        useDate: true,
        useDateValue: '',
        title:"",
        addDialogFormVisible: false,
        selectDialogFormVisible: false,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          condition:""
        },
        goodsQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          keyword: null
        },
        firstCategorys: [],
        secondCategorys: [],
        firstCategory: "",
        secondCategory: "",
        coupon: {
          type:"",
          description:'',
          name:"", 
          inDate:0, 
          totalCount:0, 
          disCount:0, 
          amount:0, 
          toAmount:0,
          salesPromotion:1
        },
        dataList :[],
        name: null,
        couponType: null,
        state: null,
        couponTypes: [
          {type:2, name:"折扣"},
          {type:3, name:"金额"},
          {type:4, name:"让利"}
        ],
        states: [
          {name:"未启用", value:"0"},
          {name:"已启用", value:"1"},
          {name:"已停用", value:"2"},
          {name:"已过期", value:"4"}
        ],
        selectedTempGoods:null,
        selectedGoods:[],
        goodsList:[],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    mounted:function() {
      if(!this.global){
        this.couponTypes.pop();  
      }

      this.findByPage();
      this.findCategroy();
    },
    methods: {
      delSelectedGoods(goods) {
        this.selectedGoods.splice(this.selectedGoods.indexOf(goods), 1);
      },
      handleSelectionChange(val) {
        this.selectedTempGoods = val;
      },
      isSelectedGoods(item) {
        let selected = false;
        this.selectedGoods.forEach((goods) => {
          if (item.goodsId === goods.goodsId) {
            selected = true;
            return true;
          }
        });
        return selected;
      },
      confirmSelectedGoods() {
        if (this.selectedTempGoods && this.selectedTempGoods.length > 0) {
          this.selectedTempGoods.forEach((item) => {
            if (!this.isSelectedGoods(item)) {
              this.selectedGoods.push(item);
            }
          });
        }
        this.selectDialogFormVisible = false;
      },
      /**
       * 重置add_provider
       */
      resetEditProvider() {
        this.coupon = {type:"", name:"",description:'', inDate:0, totalCount:0, disCount:0, amount:0, toAmount:0,salesPromotion:1};
        this.selectedGoods = [];
        this.selectedTempGoods = null;
        this.useDate = true;
        this.useDateValue = "";
      },

      handleCreate() {
        this.resetEditProvider();
        this.title = "添加优惠券";
        this.addDialogFormVisible = true;
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
      /**
       * 分页控件每页条数改变
       */
      handleSizeChangeByGoods(val) {
        this.goodsQuery.pageSize = val;
        this.findGoodsByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChangeByGoods(val) {
        this.goodsQuery.pageIndex = val;
        this.findGoodsByPage();
      },
      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },

      /**
       * 分页查询系统账号
       */
      findByPage() {
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          name: this.name,
          type: this.couponType,
          status: this.state,
          global:this.global
        };
        this.http.get(this).url(this.config.coupon.list_url).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          },
          (error) => {console.log(error)}
        );
      },
      showSelectGoods() {
        this.selectDialogFormVisible = true;
        this.goodsQuery.keyword = "";
        this.doSeachreGoods();
      },
      doSeachreGoods() {
        this.selectedTempGoods = null;
        this.goodsQuery.pageIndex = 1;
        this.findGoodsByPage();
      },
      onFirstCategoryChange(categoryId) {
        this.secondCategorys = [];
        this.secondCategory = null;
        this.categorys.forEach((item) => {
          if (item.parentId === categoryId) {
            this.secondCategorys.push(item);
          }
        });

        this.doSeachreGoods();
      },
      findCategroy() {
        this.http.get(this).url(this.config.categroy.categroy_list_url).request((response) => {
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
      findGoodsByPage() {
        var params = {
          pageSize: this.goodsQuery.pageSize,
          pageIndex: this.goodsQuery.pageIndex,
          keyword: this.goodsQuery.keyword,
          goodsStatus:3
        };
        if (this.firstCategory) {
          params.firstCategoryId = this.firstCategory;
        }
        if (this.secondCategory) {
          params.secondCategoryId = this.secondCategory;
        }
        this.http.get(this).url(this.config.goods.list_url_v2).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.goodsList = response.data.data.data;
            this.goodsQuery.total = response.data.data.totalSize;
          },
          (error) => {console.log(error) }
        );
      },
      cancel() {
        this.resetEditProvider();
        this.addDialogFormVisible = false;
      },
      submitCreate() {
        //表单验证
        if (!this.coupon.name || !this.coupon.name.trim()) {
          this.$message({message: '优惠券名称不能为空', type: 'warning'});
          return;
        }

        if (!this.coupon.description || !this.coupon.description.trim()) {
          this.$message({message: '优惠券描述不能为空', type: 'warning'});
          return;
        }

        if ((!this.coupon.totalCount || this.coupon.totalCount <= 0) && this.global) {
          this.$message({message: '优惠券数量不能小于等于0', type: 'warning'});
          return;
        }

        if (!this.validate.validatNumber(this.coupon.totalCount) && this.global) {
          this.$message({message: '优惠券数量不能为小数或者负数', type: 'warning'});
          return;
        }

        if (!this.coupon.type) {
          this.$message({message: '请选择优惠券类型', type: 'warning'});
          return;
        }

        if (this.coupon.type == 2) {
          // 折扣
          if (!this.coupon.disCount || this.coupon.disCount <= 0) {
            this.$message({message: '优惠券折扣不能小于等于0', type: 'warning'});
            return;
          }

          if (!this.coupon.disCount || this.coupon.disCount >= 10) {
            this.$message({message: '优惠券折扣不能超过或等于10', type: 'warning'});
            return;
          }
          if (!this.validate.validatNumber1( this.coupon.disCount ) ) {
            this.$message({message: '优惠券折扣只能位1位小数或者正数', type: 'warning'});
            return;
          }
          this.coupon.amount = null;
          this.coupon.toAmount = null;
          this.coupon.goodsRelations = null;
          this.coupon.salesPromotion = null;
        } else if (this.coupon.type == 3) {
          
          if (!this.coupon.amount || this.coupon.amount <= 0) {
            this.$message({message: '优惠券金额不能小于等于0', type: 'warning'});
            return;
          }
          if (!this.validate.validatPrice( this.coupon.amount ) ) {
            this.$message({message: '优惠券金额只能为正数或者2位小数', type: 'warning'});
            return;
          }

          if (!this.coupon.toAmount || this.coupon.toAmount <= 0) {
            this.$message({message: '使用门槛不能小于等于0', type: 'warning'});
            return;
          }
          if (!this.validate.validatPrice( this.coupon.toAmount ) ) {
            this.$message({message: '使用门槛只能为正数或者2位小数', type: 'warning'});
            return;
          }



          if (+this.coupon.amount >= +this.coupon.toAmount) {
            this.$message({message: '使用门槛必须大于金额', type: 'warning'});
            return;
          }

          this.coupon.disCount = null;
          this.coupon.salesPromotion = null;
        } else if (this.coupon.type == 4) {
          if (!this.coupon.salesPromotion || this.coupon.salesPromotion < 0) {
            this.$message({message: '让利率不能小于0', type: 'warning'});
            return;
          }

          if (!this.coupon.salesPromotion || this.coupon.salesPromotion > 99) {
            this.$message({message: '让利率不能超过99', type: 'warning'});
            return;
          }
          if (!this.validate.validatNumber(this.coupon.salesPromotion) && this.global) {
            this.$message({message: '让利率不能为小数或者负数', type: 'warning'});
            return;
          }

          this.coupon.amount = null;
          this.coupon.toAmount = null;
          this.coupon.goodsRelations = null;
          this.coupon.disCount = null;
        }


        if (this.useDate) {
          if (!this.useDateValue || this.useDateValue[0] == null || this.useDateValue[1] == null) {
            this.$message({message: '优惠券使用时间不能为空', type: 'warning'});
            return;
          }
          this.coupon.beginDate = this.useDateValue[0];
          this.coupon.endDate = this.useDateValue[1];
          this.coupon.inDate = null;
        } else {
          if (!this.coupon.inDate || this.coupon.inDate <= 0) {
            this.$message({message: '优惠券有效天数不能为0', type: 'warning'});
            return;
          }
          this.coupon.beginDate = null;
          this.coupon.endDate = null;
        }


        this.coupon.goodsRelations = [];
        this.selectedGoods.forEach((item) => {
          this.coupon.goodsRelations.push({couponId:this.coupon.couponId, goodsId:item.goodsId});
        });
        if(!this.coupon.goodsRelations.length && !this.global){
          this.$message({message: '请指定该优惠劵对应的商品', type: 'warning'});
          return;
        }

        if(this.coupon.endDate && !this.coupon.couponId){
          this.coupon.endDate.setHours(23,59,59);
        }
        console.log(this.coupon);
        this.coupon.global = this.global;

        this.http.postJson(this).url(this.config.coupon.save_url).params(this.coupon).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '保存成功!'});
            this.findByPage();
            this.addDialogFormVisible = false;
          },
          (error) => {

          }
        );
      },
      onEdit(coupon) {
        this.resetEditProvider();
        this.title = "编辑优惠券";
        this.http.get(this).url(this.config.coupon.detail_url).restful({couponId:coupon.couponId}).request(function(response) {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.coupon = response.data.data;

          if (this.coupon.inDate) {
            this.useDate = false;
          } else {
            this.useDateValue = [];
            this.useDateValue[0] = this.coupon.beginDate;
            this.useDateValue[1] = this.coupon.endDate;
            this.useDate = true;
          }
      
          this.selectedGoods = this.coupon.goodsRelations;

          this.addDialogFormVisible = true;
        }, function(err) { });
      },
      disable(coupon) {
        this.$confirm('是否要停用优惠券"' + coupon.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.coupon.disable_url).restful({couponId:coupon.couponId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '停用成功!'});
              this.findByPage();
            }, (err) => { });
        }).catch(() => {
        });
      },
      enable(coupon) {
        this.$confirm('是否要启用优惠券"' + coupon.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.coupon.enable_url).restful({couponId:coupon.couponId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '启用成功!'});
              this.findByPage();
            }, (err) => { });
        }).catch(() => {
        });
      },
      /*删除优惠券*/
      deleteCoupon(coupon) {
        this.$confirm('是否要删除优惠券"' + coupon.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.coupon.delete_url).restful({couponId:coupon.couponId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => { });
        }).catch(() => {
        });
      },
      keyEvent() {
        this.doSearch();
      },
      onSelected(coupon) {
        this.$emit('onSelected', coupon);
      }
    }
  }

</script>
