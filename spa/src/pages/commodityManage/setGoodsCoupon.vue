<template>
  <div>
   <el-col :span="21" >
      <p style="color:#343434;margin-top:0;">无库存是否可售卖:  <el-checkbox style="margin-left:10px;" v-model="goodsSaleStatus" @change="checkChange">是</el-checkbox></p>
      <el-button style="margin-top:10px;margin-bottom:10px;" @click="onAdd" type="info" size="small" icon="plus">
        选择优惠券
      </el-button>
      <el-button style="margin-top:10px;margin-bottom:10px;" @click="addCoupon" type="primary" size="small" icon="plus">
        添加优惠券
      </el-button>
    </el-col>
    <el-table :data="dataList" border fit highlight-current-row style="width: 100%">

      <el-table-column label="优惠券名称" width="150">
        <template scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠券类型">
        <template scope="scope">
          <span v-if="scope.row.type==1">包邮</span>
          <span v-else-if="scope.row.type==2">折扣</span>
          <span v-else-if="scope.row.type==3">金额</span>
          <span v-else-if="scope.row.type==4">让利</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠内容">
        <template scope="scope">
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

      <el-table-column label="优惠券状态">
        <template scope="scope">
          <span v-if="scope.row.status == 0">未启用</span>
          <span v-if="scope.row.status == 1">已启用</span>
          <span v-if="scope.row.status == 2">已停用</span>
          <span v-if="scope.row.status == 3">已删除</span>
          <span v-if="scope.row.status == 4">已过期</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button type="text" size="small" @click="deleteCoupon(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加优惠券 -->
    <el-dialog  title="添加优惠券" :modal="false" :visible.sync="editCoupon.editCouponDialogVisible">
      <el-form class="small-space" :model="coupon" label-position="left" label-width="100px" style='width: 550px; margin-left:50px;'>
        <el-form-item label="名称">
          <el-input v-model="coupon.name" maxlength="16" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>

        <el-form-item label="优惠券描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}"   maxlength="40" placeholder="请填写优惠券描述" v-model="coupon.description">
          </el-input>
        </el-form-item>

        <el-form-item label="优惠形式">
          <el-select  v-model="coupon.type" style="width: 130px" class="filter-item" placeholder="优惠券类型">
            <el-option v-for="item in couponTypes" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="coupon.type==3" label="金额">
          <el-input type="number" style="width:150px" v-model="coupon.amount" placeholder="请输入正整数" :min="0" :max="100000"></el-input>
        </el-form-item>

        <el-form-item v-if="coupon.type==2" label="折扣">
          <el-input  type="number" style="width:150px"  v-model="coupon.disCount" placeholder="请输入1-10" :min="0" :max="10"></el-input>
        </el-form-item>

        <el-form-item v-if="coupon.type==3" label="使用门槛">
          <el-input  type="number" style="width:150px"   v-model="coupon.toAmount" placeholder="商品金额" :min="0" :max="100000"></el-input>
          <span style="color:#FF4949"> 使用门槛必须大于金额才能使用优惠券。</span>
        </el-form-item>

        <el-form-item label="使用时间">
          <div>
            <el-date-picker
              v-model="useDateValue"
              type="daterange"
              align="right"
              :picker-options="pickerOptions"
              placeholder="选择日期范围">
            </el-date-picker>
          </div>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editCoupon.editCouponDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCreate">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 选择优惠券 -->
    <el-dialog  title="选择优惠券" :modal="false" :visible.sync="selectDialogFormVisible">
      <div style="margin-bottom:10px;">
        <el-input  v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="优惠券名称"></el-input>
        <el-button @click="findCouponByPage" class="filter-item" style="margin-left: 12px;" type="primary" icon="search">搜索</el-button>
      </div>
      <el-table :data="couponDataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="优惠券名称" width="200">
        <template scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠券类型">
        <template scope="scope">
          <span v-if="scope.row.type==1">包邮</span>
          <span v-else-if="scope.row.type==2">折扣</span>
          <span v-else-if="scope.row.type==3">金额</span>
          <span v-else-if="scope.row.type==4">让利</span>
          <span v-else>-</span>
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

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button type="text" size="small" @click="onSelected(scope.row)">选择</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>
    </el-dialog>

  </div>
</template>
<script>

  import {formatDate} from '@/commons/date.js'
  import Coupon from '@/pages/coupon/Coupon.vue'

  export default {
    components: {Coupon},
    filters:{
      formatDate(time){
        if (!time) {
          return "无";
        }
        let date = new Date(time);
        //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        return formatDate(date, 'yyyy-MM-dd');
      }
    },
    data() {
      return {
        goodsSaleStatus:true,
        useDate: true,
        useDateValue: '',
        goods:{},
        couponTypes: [
          {type:2, name:"折扣"},
          {type:3, name:"满减"}
        ],
        dataList:[],
        selectDialogFormVisible: false,
        couponDataList:[],
        editCoupon:{
          editCouponDialogVisible:false,
        },
        coupon: {
          description:"",
          type:2, 
          name:"", 
          inDate:0,
          totalCount:0,
          disCount:0, 
          amount:0,
          toAmount:0
        },
        listQuery: {
          status:1,
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          name:"",
          global:false
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },

      }
    },
    mounted() {
      this.findCouponByPage();
    },
    methods: {
      checkChange() {
        console.log(this.goodsSaleStatus)
        this.http.post(this).url(this.config.goods.goods_sale).params({noStorageSale:this.goodsSaleStatus}).restful({goodsId:this.goods.goodsId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '设置成功!'});
            //this.findByPage();
          },
          (error) => {}
        );
      },
      getGoodsId(goods){
        this.goods = goods;
        this.findGoodsDetail(this.goods);
      },
      resetForm() {
        this.useDateValue = "";
        this.coupon = {
          description:"",
          type:2, 
          name:"", 
          inDate:0,
          totalCount:0,
          disCount:0, 
          amount:0,
          toAmount:0
        };
      },
      addCoupon() {
        this.editCoupon.editCouponDialogVisible = true;
        this.resetForm();
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

        if (this.coupon.type == 2) {
          // 折扣
          if (!this.coupon.disCount || this.coupon.disCount <= 0 ) {
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
        } else if (this.coupon.type == 3) {
         
          
          if (!this.coupon.amount || this.coupon.amount <= 0) {
            this.$message({message: '优惠券金额不能为小于等于0', type: 'warning'});
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
        }

        
        if (!this.useDateValue || this.useDateValue[0] == null || this.useDateValue[1] == null) {
          this.$message({message: '优惠券使用时间不能为空', type: 'warning'});
          return;
        }
        this.coupon.beginDate = this.useDateValue[0];
        this.coupon.endDate = this.useDateValue[1];
        if(this.coupon.endDate){
          this.coupon.endDate.setHours(23,59,59);
        }
        console.log(this.coupon);
        this.comfirmAddCoupon(this.coupon,this.goods);

      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.findCouponByPage();
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        this.findCouponByPage();
      },
      findCouponByPage() {
        this.http.get(this).url(this.config.coupon.list_url).params(this.listQuery).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.couponDataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          },
          (error) => {
            console.log(error)
          }
        );
      },
      findGoodsDetail(goods) {
        this.http.get(this).url(this.config.goods.delete_url_v2).restful({goodsId: goods.goodsId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            console.log(response.data.data.coupons)
            this.goodsSaleStatus = response.data.data.noStorageSale;
            this.dataList = response.data.data.coupons;
          }, (err) => {
          });
      },
      deleteCoupon(coupon) {
        console.log(coupon)
        this.$confirm('是否要移除优惠券"' + coupon.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.removeCoupon(coupon,this.goods);
        }).catch(() => {});
      },
      removeCoupon(coupon,goods){
         this.http.post(this).url(this.config.goods.delete_coupon).params({couponId:coupon.couponId}).restful({goodsId:goods.goodsId}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.findGoodsDetail(this.goods);
          this.$message({message: "已删除优惠券", type: 'success'});
        }, (err) => {
        });
      },
      onAdd() {
        this.selectDialogFormVisible = true;
      },
      comfirmAddCoupon(coupon,goods) {
        this.http.postJson(this).url(this.config.goods.add_coupon).params(coupon).restful({goodsId:goods.goodsId}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.findGoodsDetail(this.goods);
          this.$message({message: "已成功添加优惠券", type: 'success'});
          this.editCoupon.editCouponDialogVisible = false;
           this.selectDialogFormVisible = false;
        }, (err) => {
        });
      },
      setCoupon(goods,coupon) {
        let params = {};
        params.goodsId = goods.goodsId;
        params.couponId = coupon.couponId;
        this.http.post(this).url(this.config.goods.set_coupon).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.findGoodsDetail(this.goods);
            this.$message({message: "已成功添加优惠券", type: 'success'});
            this.selectDialogFormVisible = false;
          }, (err) => {
          });
      },
      onSelected(coupon) {
        console.log(coupon,this.dataList)
        let exists = false;
        if(this.dataList)
        this.dataList.forEach((item) => {
          if (coupon.couponId == item.couponId) {
            exists = true;
          }
        });
        if (exists) {
          this.$message({message: "您选择的优惠券已存在！", type: 'warning'});
          return;
        }
        this.comfirmAddCoupon(coupon,this.goods);
        
      }
    }
  }
</script>
