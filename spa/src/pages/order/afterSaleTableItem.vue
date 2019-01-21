<template>

    <el-table :data="goodsData" border fit highlight-current-row style="width: 100%">

      <el-table-column label="商品封面" align="center" vertical="middle" >
        <template scope="scope">
          <img style="width:50px;height:50px;margin-top: 5px !important;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
        </template>
      </el-table-column>

      <el-table-column prop="name" label="商品名称">
        <template scope="scope">
          <span >{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="商品编码">
        <template scope="scope">
          <span >{{scope.row.goodsNumber}}</span>
        </template>
      </el-table-column>


      <el-table-column prop="name" label="SKU名称" >
        <template scope="scope">
          <span >{{scope.row.styleName}}<span v-if="scope.row.subName">-{{scope.row.subName}}</span> </span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="SKU编码">
        <template scope="scope">
          <span >{{scope.row.styleNumber}}</span>
        </template>
      </el-table-column>
     

      <el-table-column prop="name" label="售后工单号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.workNumber}}</span>
        </template>
      </el-table-column>


      <el-table-column prop="name" label="退款金额" v-if='type != 5'>
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.refundMoney}}</span>
        </template>
      </el-table-column>     


      <el-table-column prop="name" label="退货数量" v-if='type == 6'>
        <template scope="scope">
          <span>{{scope.row.applyCount}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="换货数量" v-if='type == 5'>
        <template scope="scope">
          <span>{{scope.row.applyCount}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="商品原总金额"  v-if='type != 5'>
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.money}}</span>
        </template>
      </el-table-column>


      <el-table-column prop="name" label="申请日期" >
        <template scope="scope">
          <span >{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>


      <el-table-column prop="name" label="售后状态" v-if='type == 4'>
        <template scope="scope">
          <span v-if='scope.row.applyStatus == 1'>未受理</span>
          <span v-else-if='scope.row.applyStatus == 2'>拒绝受理</span>
          <span v-else-if='scope.row.applyStatus == 3'>退款中</span>
          <span v-else-if='scope.row.applyStatus == 4'>退款成功</span>
          <span v-else-if='scope.row.applyStatus == 5'>退款失败</span>
          <span v-else-if='scope.row.applyStatus == 6'>财务待退款</span>
          <span v-else>无</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="售后状态" v-if='type == 5'>
        <template scope="scope">
          <span v-if='scope.row.applyStatus == 1'>未受理</span>
          <span v-else-if='scope.row.applyStatus == 2'>拒绝受理</span>
          <span v-else-if='scope.row.applyStatus == 3'>平台待收货</span>
          <span v-else-if='scope.row.applyStatus == 4'>拒绝换货</span>
          <span v-else-if='scope.row.applyStatus == 5'>平台待发货</span>
          <span v-else-if='scope.row.applyStatus == 6'>用户待收货</span>
          <span v-else-if='scope.row.applyStatus == 7'>用户确认收货</span>
          <span v-else>无</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="售后状态" v-if='type == 6'>
        <template scope="scope">
          <span v-if='scope.row.applyStatus == 1'>未受理</span>
          <span v-else-if='scope.row.applyStatus == 2'>拒绝受理</span>
          <span v-else-if='scope.row.applyStatus == 3'>平台待收货</span>
          <span v-else-if='scope.row.applyStatus == 4'>拒绝退款</span>
          <span v-else-if='scope.row.applyStatus == 5'>财务待退款</span>
          <span v-else-if='scope.row.applyStatus == 6'>退款中</span>
          <span v-else-if='scope.row.applyStatus == 7'>退款成功</span>
          <span v-else-if='scope.row.applyStatus == 8'>退款失败</span>
          <span v-else>无</span>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  export default {
    props: ["type"], //4 售后退款列表 5售后换货列表 6售后退货列表
    data() {
      return {
        goodsData:[],
        order:{}
      }
    },
    methods: {
      setGoodsData(data) {
        console.log(data.orderListType)
        this.order = data;
        if (this.type == 4) {
          this.goodsData = data.orderDoodsData4; 
        } else if (this.type == 5) {
          this.goodsData = data.orderDoodsData5;
        } else if (this.type == 6) {
          this.goodsData = data.orderDoodsData6;
        }
      },
    }
  }
</script>
