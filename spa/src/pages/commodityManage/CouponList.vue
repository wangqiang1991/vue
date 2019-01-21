<template>
  <div class="">
   <el-col :span="21" >
      <el-button style="margin-top:10px;margin-bottom:10px;" @click="onAdd" type="primary" size="small" icon="plus">
        选择优惠券
      </el-button>
    </el-col>
    <el-table :data="dataList" border fit highlight-current-row style="width: 100%">
      <el-table-column label="优惠券名称" width="150">
        <template scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠券类型" width="110">
        <template scope="scope">
          <span v-if="scope.row.type==1">包邮</span>
          <span v-else-if="scope.row.type==2">折扣</span>
          <span v-else-if="scope.row.type==3">金额</span>
          <span v-else-if="scope.row.type==4">让利</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="有效期" width="210">
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

      <el-table-column label="发行">
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

      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button type="text" size="small" @click="deleteCoupon(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :size="'large'" title="选择优惠券" :visible.sync="selectDialogFormVisible">
      <coupon selectModel="true" @onSelected="onSelected"></coupon>
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
    props: ['dataList'],
    data() {
      return {
        //dataList: []
        selectDialogFormVisible: false,

      }
    },
    methods: {
      deleteCoupon(coupon) {
        let index = this.dataList.indexOf(coupon);
        this.dataList.splice(index, 1);
      },
      onAdd() {
        this.selectDialogFormVisible = true;
      },
      onSelected(coupon) {
        let exists = false;
        this.dataList.forEach((item) => {
          if (coupon.couponId == item.couponId) {
            exists = true;
          }
        });
        if (exists) {
          alert("您选择的优惠券已存在！")
          return;
        }
        this.dataList.push(coupon);
        this.selectDialogFormVisible = false;
      }
    }
  }
</script>
