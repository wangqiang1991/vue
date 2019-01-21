<template>
    <div>
    <p style="text-align:left;margin-top:0;" v-if='type == 1 && order.orderListType == 2'><el-button  type="primary" @click='getSelectOrdre'>发货</el-button></p>

    <el-table :data="goodsData" border  highlight-current-row style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column
      v-if='type == 1 && order.orderListType == 2'
        type="selection"
        width="55">
      </el-table-column>             


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
     

      <el-table-column prop="name" label="子订单号" >
        <template scope="scope">
          <span style="color:#337ab7;">{{scope.row.orderNumber}}</span>
        </template>
      </el-table-column>

  

      <el-table-column prop="name" label="商品单价" >
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.stylePrice}}</span>
        </template>
      </el-table-column>

          <el-table-column prop="name" label="购买数量" >
        <template scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="商品原总金额">
        <template scope="scope">
          <span style="color: #FF9800;">￥{{((scope.row.stylePrice * scope.row.amount).toFixed(2) + "").replace(".00", "")}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="商品实际支付金额" >
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.money}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="运费" >
        <template scope="scope">
          <span style="color: #FF9800;">￥{{scope.row.expressMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="合计" >
        <template scope="scope">
          <span style="color: #FF9800;">￥{{((scope.row.money + scope.row.expressMoney).toFixed(2) + "").replace(".00", "")}}</span>
        </template>
      </el-table-column>


     <el-table-column prop="name" label="平台运费" v-if='type == 2 || type == 3'>
        <template scope="scope">
          <span style="color: #FF9800;" v-if="scope.row.realityExpressMoney">￥{{((scope.row.realityExpressMoney / 100).toFixed(2) + "").replace(".00", "")}}</span>
          <span style="color: #FF9800;" v-else>￥0</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作"  width="110" v-if='type == 2 || type == 3'>
        <template scope="scope">

          <el-button size="small" style='margin-top:10px;' type="primary" @click='expressDetail(scope.row)'>查看物流</el-button>
          <br>
          <el-button style='margin-top:10px;margin-bottom:10px;' @click='editExpress(scope.row)' size="small" type="primary" v-if='type == 2 && order.orderListType == 3'>修改物流</el-button>

        </template>

      </el-table-column>


    </el-table>

    </div>
</template>

<script>

  export default {
    props: ["type"], //1 待发货列表 2待收货列表 3 已完成列表
    data() {
      return {
        multipleSelections:[],
        goodsData:[],
        order:{}
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelections = val;
      },
      getSelectOrdre() {
        if (this.multipleSelections && this.multipleSelections.length > 0) {
          this.$emit('onSelectedOrder', this.multipleSelections);
        } else {
          this.$message({message: "请选择需要发货的商品", type: 'warning'});
        }
      },
      editExpress(data) {
        this.$emit('onEditExpress', data);
      },
      expressDetail(data) {
        this.$emit('expressDetail', data);
      },
      setGoodsData(data) {
        console.log(data.orderListType)
        this.order = data;
        if (this.type == 1) {
          this.goodsData = data.orderDoodsData1; 
        } else if (this.type == 2) {
          this.goodsData = data.orderDoodsData2;
        } else if (this.type == 3) {
          this.goodsData = data.orderDoodsData3;
        }
      },
    }
  }
</script>
