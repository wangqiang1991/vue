<template>
    <div id="inventory_vue" class="app-container calendar-list-container">
 
      <el-row :gutter="20">
        <el-col :span="20">

          <div class="grid-content filter-container bg-purple select_div">

            <el-date-picker
              class="date_select filter-item"
              @change="doSearch"
              v-model="time"
              type="daterange"
              :picker-options="pickerOptions"
              placeholder="查询日期">
            </el-date-picker>

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.goodsName" style="width: 220px !important;margin-left:12px;" class="filter-item"  placeholder="商品名称">
            </el-input>

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.goodsNumber" style="width: 220px !important;margin-left:12px;" class="filter-item"  placeholder="商品编码">
            </el-input>

            <el-button class="filter-item" style="margin-left: 12px;" type="primary" icon="search" @click="doSearch">筛选</el-button>

          </div>

        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">

        <el-table
        v-loading="listQuery.loading"
        :data="dataList"
        element-loading-text="努力加载中..."
        border
        style="width: 100%;">

        <el-table-column type="index" align="center" label="序号" width="65"/>

        <el-table-column
          align="center"
          label="商品名称">
          <template scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="商品编码">
          <template scope="scope">
            <span>{{ scope.row.goodsNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="规格名称">
          <template scope="scope">
            <span>{{ scope.row.name +'-'+scope.row.subName  }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="规格编码">
          <template scope="scope">
            <span>{{ scope.row.styleNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column 
          align="center"
          label="采购">

          <el-table-column
            align="center"
            label="采购数量">
            <template scope="scope">
              <span>{{ scope.row.purchaseCount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="采购金额">
            <template scope="scope">
              <span style='color:#FF9800;'>￥{{ ((scope.row.purchaseMoney /100).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

        </el-table-column>

        <el-table-column 
          align="center"
          label="销售">

          <el-table-column
            align="center"
            label="销售数量">
            <template scope="scope">
              <span>{{ scope.row.saleCount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="销售金额">
            <template scope="scope">
              <span style='color:#FF9800;'>￥{{ ((scope.row.saleMoney/100).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="type == 1"
            align="center"
            label="进销差额">
            <template scope="scope">
              <span style='color:#FF9800;'>￥{{ ((scope.row.differMoney / 100 ).toFixed(2) + "").replace(".00", "")}}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="type == 1"
            align="center"
            label="销售毛利">
            <template scope="scope">
              <span style='color:#FF9800;'>￥{{ ((scope.row.profitMoney / 100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            v-if="type == 1"
            align="center"
            label="销售毛利率">
            <template scope="scope">
              <span>{{ ((scope.row.rate / 100).toFixed(2) + "").replace(".00", "")}}%</span>
            </template>
          </el-table-column>

        </el-table-column>

        <el-table-column 
          align="center"
          label="库存">

          <el-table-column
            align="center"
            label="库存数量">
            <template scope="scope">
              <span>{{ scope.row.storageCount }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="库存金额">
            <template scope="scope">
              <span style='color:#FF9800;'>￥{{ ((scope.row.storageMoney/100).toFixed(2) + "").replace(".00", "") }}</span>
            </template>
          </el-table-column>

        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="150">
          <template scope="scope">
            <el-button size="small" class="button_detail fontFamily icon-browse" type="primary" @click="seeDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>

        </el-table>

        <div class="pagination-container">
          <el-pagination
            :page-sizes="[10,15,20,30]"
            :page-size="listQuery.pageSize"
            :total="listQuery.total"
            :current-page="listQuery.pageIndex"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>

      </div>

    <el-dialog
      class="promoter_dialog"
      title="单据明细"
      :visible.sync="dialogVisible">   

      <el-button @click="printDetail" class="filter-item fontFamily icon-print" type="primary">打印单据明细</el-button>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">

        <el-table
        v-loading="detailLoading"
        :data="detailData"
        element-loading-text="努力加载中..."
        border
        style="width: 100%;height:auto;">
          
          <el-table-column
            label="单据类型"
            align="center">
            <template scope="scope">
              <span v-if='scope.row.type == 1'>采购入库</span>
              <span v-if='scope.row.type == 2'>销售出库</span>
              <span v-if='scope.row.type == 3'>退货入库</span>
              <span v-if='scope.row.type == 4'>换货入库</span>
              <span v-if='scope.row.type == 5'>换货出库</span>
              <span v-if='scope.row.type == 6'>调拨出库</span>
              <span v-if='scope.row.type == 7'>借出出库</span>
              <span v-if='scope.row.type == 8'>借还入库</span>
              <span v-if='scope.row.type == 9'>商品报损</span>
            </template>
          </el-table-column>        

          <el-table-column
            label="单据编号"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.number}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="单据日期"
            align="center">
            <template scope="scope">
              <span>{{ scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column 
            align="center"
            label="采购">

            <el-table-column
              align="center"
              label="数量">
              <template scope="scope">
                <span v-if="scope.row.type == 1">{{ scope.row.inCount }}</span>
                <span v-else>/</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="单价">
              <template scope="scope">
                <span v-if="scope.row.type == 1" style='color:#FF9800;'>￥{{ ((scope.row.inPrice/100).toFixed(2) + "").replace(".00", "") }}</span>
                <span v-else>/</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="金额">
              <template scope="scope">
                <span v-if="scope.row.type == 1" style='color:#FF9800;'>￥{{ ((scope.row.inMoney/100).toFixed(2) + "").replace(".00", "") }}</span>
                <span v-else>/</span>
              </template>
            </el-table-column>

          </el-table-column>

          <el-table-column 
            align="center"
            label="发出">

            <el-table-column
              align="center"
              label="数量">
              <template scope="scope">
                <span v-if="scope.row.type == 1">/</span>
                <span v-else>{{ scope.row.outCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="单价">
              <template scope="scope">
                <span v-if="scope.row.type == 1">/</span>
                <span v-else style='color:#FF9800;'>￥{{ ((scope.row.outPrice/100).toFixed(2) + "").replace(".00", "") }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="金额">
              <template scope="scope">
                <span v-if="scope.row.type == 1">/</span>
                <span v-else style='color:#FF9800;'>￥{{ ((scope.row.outMoney/100).toFixed(2) + "").replace(".00", "") }}</span>
              </template>
            </el-table-column>

          </el-table-column>

          <el-table-column 
            align="center"
            label="结存">

            <el-table-column
              align="center"
              label="数量">
              <template scope="scope">
                <span>{{ scope.row.storageCount }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="平均单价">
              <template scope="scope">
                <span style='color:#FF9800;'>￥{{ ((scope.row.storageAvgPrice/100).toFixed(2) + "").replace(".00", "") }}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="金额">
              <template scope="scope">
                <span style='color:#FF9800;'>￥{{ ((scope.row.storageMoney/100).toFixed(2) + "").replace(".00", "") }}</span>
              </template>
            </el-table-column>

          </el-table-column>

        </el-table>
      </div>    

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate,setLastDay} from '@/utils'
  import session from '@/utils/session'
  export default {
    props:['type'], //1进销存统计 2库存台账统计
    data() {
      return {
        dialogVisible:false,
        detailData:[],
        lineData:{},
        detailLoading:false,
        time:null,
        beginDate:null,
        endDate:null,
        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          goodsNumber: "",
          goodsName:''
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= ( Date.now() - 8.64e6 );
          }
        },
      }
    },
    mounted() {
      this.initDate();
    },
    methods:{
      initDate() {
        this.time = [];
        let date = new Date();
        let lastMonth = new Date(setLastDay(date));
        let endDate = lastMonth.setHours(23,59,59);

        let date1 = new Date();
        let lastMonth1 = new Date(setLastDay(date1));
        let beginDate = new Date(lastMonth1.setDate(1)).setHours(0,0,0);
        this.time[0] = beginDate;
        this.time[1] = endDate;

        this.beginDate = toDate(beginDate);
        this.endDate = toDate(endDate);
        let defaultTime = this.beginDate.split(" ")[0] + " - " + this.endDate.split(" ")[0];
        setTimeout(()=>{
          $(".date_select>input").val(defaultTime)
        },200);
        
        this.findByPage();
      },
      getSelectTime() {
        let params = {};
        if (!this.time ||this.time[0] == null || this.time[1] == null){
          params.beginDate = this.beginDate;
          params.endDate = this.endDate;

          let defaultTime = this.beginDate.split(" ")[0] + " - " + this.endDate.split(" ")[0];
          setTimeout(()=>{
            $(".date_select>input").val(defaultTime)
          },200);

        } else {
          if (typeof( this.time[0] ) == "number") {
            params.beginDate = toDate(this.time[0]);
          } else {
            params.beginDate = toDate(this.time[0].setHours(0,0,0));
          }

          if (typeof( this.time[1] ) == "number") {
            params.endDate = toDate(this.time[1]);
          } else {
            params.endDate = toDate(this.time[1].setHours(23,59,59));
          }
        }
        console.log(params) 
        return params;
      },
      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.findByPage();
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        this.findByPage();
      },
      findByPage() {
        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.pageIndex = this.listQuery.pageIndex;
        params.pageSize = this.listQuery.pageSize;
        params.goodsName = this.listQuery.goodsName;
        params.goodsNumber = this.listQuery.goodsNumber;
      
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.statistics.inventory_lit_url).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data.data;
          this.dataList = data;
          this.listQuery.total = response.data.data.totalSize;
          this.listQuery.loading  = false;
          
        },(error) => {console.log(error)});
      },
      seeDetail(data) {
        this.lineData = data;
        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.styleId = data.styleId;
        params.goodsId = data.goodsId;
        
        this.detailLoading = true;
        this.http.get(this).url(this.config.statistics.inventory_detail_url).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          let data = response.data.data;
          this.detailData = data;
          this.detailLoading = false;
          this.dialogVisible = true;
        },(error) => {console.log(error)});
      },
      //打印单据细表
      printDetail() {
        let url = null;

        if(process.env.NODE_ENV == "production") {
          //线上url
           url =  "/api/statistics-pdf/create-bill/单据明细.pdf";
        } else if(process.env.NODE_ENV == "test") {
          //测试
           url =  "/api/statistics-pdf/create-bill/单据明细.pdf";
        } else {
          //本地url
          url = "http://192.168.20.104:8888/api/statistics-pdf/create-bill/单据明细.pdf";
        }

        let time = this.getSelectTime();
        let beginDate = time.beginDate;
        let endDate = time.endDate;
        let styleId = this.lineData.styleId;
        let goodsId = this.lineData.goodsId;

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?access_token=" + user.accessToken + "&beginDate=" + beginDate + "&endDate=" + endDate + "&goodsId=" + goodsId + "&styleId=" + styleId + "&kind=" + this.type;
          window.open(url, "_blank");
        } else {
          this.$message.error("未登录");
        }
      }
    }
  }
</script>

<style lang="scss">
  #inventory_vue {
    .promoter_dialog{
      >div{
        width:85%;
      }
    }
  }
</style>
