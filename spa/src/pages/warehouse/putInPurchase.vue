<template>
  <div class="app-container calendar-list-container" id="ptuInPurchase_vue">
     <el-row :gutter="20">
        <el-col :span="20">

          <el-date-picker @change="doSearch()" v-model="orderDate" :editable="false" :clearable="true"  type="daterange" class="filter-item"  align="left" placeholder="入库起止日期">
          </el-date-picker>

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.orderNumber" style="width: 200px !important;" class="filter-item" placeholder="输入采购项编码">
          </el-input>


          <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                     icon="search">搜索
          </el-button>
          
          <el-button @click="showStorageDialog" class="filter-item" style="margin-right: 12px;" type="primary" >商品入库</el-button>

          <el-badge :value="choiceDatas.length" class="item">
            <el-button @click="printHistory" :disabled="!choiceDatas.length" type="primary" class="fontFamily icon-print">打印入库凭证</el-button>
          </el-badge>
         
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-table
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          ref="multipleTable"
          :data="dataList"
          border
          style="width: 100%">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label=" 采购项编码"
            align="center">
            <template scope="scope">
              <span >{{scope.row.orderNumber ? scope.row.orderNumber : "无"}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label=" 商品名称"
            align="center">
            <template scope="scope">
              <span >{{scope.row.goodsTitle}}</span>
            </template>
          </el-table-column>

           <el-table-column
            label=" 商品编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="规格名称">
            <template scope="scope">
              <span>{{scope.row.skuName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label=" 规格编码"
            align="center">
            <template scope="scope">
              <span>{{scope.row.skuNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column 
            label="入库数量"
            align="center"
            vertical="middle">
            <template scope="scope">
             <span style="color:orangered;">{{scope.row.count}}</span>
            </template>
          </el-table-column>

          <el-table-column 
            label="采购单价"
            align="center"
            vertical="middle">
            <template scope="scope">
             <span style="color:orangered;">{{scope.row.price / 100}}</span>
            </template>
          </el-table-column>

           <el-table-column 
            label="入库人员"
            align="center">
            <template scope="scope">
              <span>{{scope.row.systemUserName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="入库时间"
            align="center">
            <template scope="scope">
             <span> {{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
            </template>
          </el-table-column>

          <el-table-column label="打印选择" align="center"  width="150">
            <template scope="scope">
              <!-- <el-button type="primary" v-if="scope.row.orderNumber" size="small" @click="printBarCode(scope.row)">打印条码</el-button> -->
               <el-checkbox v-model="scope.row.checked" @change="goodsCheck(scope.row)"></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label="补打条码" align="center"  width="150">
            <template scope="scope">
              <el-button class="fontFamily icon-print" type="primary" v-if="scope.row.orderNumber" size="small" @click="printBarCode(scope.row)">打印条码</el-button>
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

      <el-dialog  title="商品入库" :before-close="closeDialog" :show-close="false" :visible.sync="addStorageForm.dialogVisible" id="dialog">
        <el-row :gutter="24">
          <el-col :span="24" style="margin-bottom:20px;">
          <p style="text-align:left;">
            <span style="color:#343434;display:inline-block;width:100px;text-align:right;">采购项编码:</span> 
            <el-input @blur="findGoodsDetail" @keyup.enter.native="findGoodsDetail" style="width:70%;" v-model="addStorageForm.skuValue" type="text" placeholder="请输入采购项编码" ></el-input>
          </p> 
          <p  style="text-align:left;">
            <span style="color:#343434;display:inline-block;width:100px;text-align:right;">入库数量:</span> 
            <el-input type="text"  style="width:70%;" v-model="addStorageForm.count" maxlength="3" :placeholder="placeholder1"></el-input>
          </p>
        <!--   <p  style="text-align:left;">
            <span style="color:#343434;display:inline-block;width:100px;text-align:right;">采购单价:</span> 
            <el-input type="text" style="width:280px;" v-model="addStorageForm.price" :placeholder="placeholder2"></el-input>
          </p> -->
          </el-col>
          <el-col :span="18" id="goodsDetail" v-show="showGoodsDetail" :offset="3" >
              <div class="styleMessage">
                <p>规格封面图: <br>
                  <img v-if="goods.styleVo.cover" :src="goods.styleVo.cover" style="width:80px;height:80px;">
                  <span v-else style="color:orangered;font-size:25px;">无</span>
                </p>
                <p>商品封面图: <br>
                  <img v-if="goods.goodsVo.cover" :src="goods.goodsVo.cover" style="width:80px;height:80px;">
                  <span v-else style="color:orangered;font-size:25px;">无</span>
                </p>  
              </div>
              <div class="styleMessage">
                <p>规格名称:{{goods.styleVo.name + "-" + goods.styleVo.subName}}</p>
                <p>商品名称:{{goods.goodsVo.title}}</p>
              </div>
              <div class="styleMessage">
                 <p>SKU编码:{{goods.styleVo.styleNumber}}</p>
                 <p>商品编码:{{goods.goodsVo.goodsNumber}}</p>
              </div>
              <div class="styleMessage">
                <p>规格总库存:{{goods.styleVo.totalCount}}</p>
                <p>规格剩余库存:{{goods.styleVo.count}}</p>
              </div>
              <div class="styleMessage">
                <p>规格售卖价格:{{goods.styleVo.price}}</p>
                <p>规格成本价格:{{goods.styleVo.costPrice}}</p>
              </div>
          </el-col>
          <el-col :span="18" id="goodsMessage" v-show="showGoods" :offset="3">
            <div>
              <div class="left">
                 <div class="leftTop">
                    <div class="content">
                      <div>
                        <p class="title">商品名称<br>NAME</p>
                        <p class="styleText">{{goods.goodsVo.title}}</p>
                      </div>
                      <div>
                         <p class="title">商品规格名称<br>SKU</p>
                         <p class="styleText">{{goods.styleVo.name +"-"+goods.styleVo.subName}}</p>
                      </div> 
                    </div>
                    <div class="content">
                      <div>
                        <p class="styleColor title">商品{{goods.style1.name}}<br>{{goods.style1.English}}</p>
                        <p class="styleText">{{goods.styleVo.name}}</p>
                      </div>
                      <div>
                        <p class="styleColor title">商品{{goods.style2.name}}<br>{{goods.style2.English}}</p>
                        <p class="styleText">{{goods.styleVo.subName}}</p>
                      </div> 
                    </div>
                 </div>
                 <div class="leftBottom">
                    <p class="title">商品编码<br>CODE</p>
                    <p class="code"><canvas id="barcode"></canvas></p>
                 </div> 
              </div>
              <div class="right">
                <div id="qrcodeBox" style="text-align: center;"></div>
                <p style="font-size:16px;color:#030000;margin-bottom:100px;font-family: STHeitiSC-Medium;text-align:center;">扫一扫了解更多</p>
                <img src="/static/images/goochaoLogo.bmp">
              </div>            
            </div>  
          </el-col> 

        </el-row> 
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="addStorageForm.dialogVisible = false">关 闭</el-button>
          <el-button type="primary" @click="comfirmAddStorage" v-show="!showPrintBtn && surplusCount != 0 && !putDisible">商品入库</el-button>
          <el-button icon="loading" type="primary" v-show="!showPrintBtn && surplusCount != 0 && putDisible"></el-button>
          <el-button type="danger" @click="comfirmAndPrint" v-show="showPrintBtn">打印条码</el-button>
        </div>
    </el-dialog>

      <el-dialog  title="打印入库凭证" :visible.sync="purchaseVisible">
         <span style="float:left;margin-right:12px;">打印备注:</span>
         <el-input v-model="purchaseDesc" type="textarea" :rows="3" style="width:50%;" maxlength="100" placeholder="请输入打印入库凭证备注" ></el-input>     
  
        <div slot="footer" class="dialog-footer">
          <el-button @click="purchaseVisible = false">关 闭</el-button>
          <el-button type="primary" @click="comfirmHistoryPrint">打印</el-button>
        </div>

    </el-dialog>

  </div>  
</template>

<script>
  import {parseTime} from '@/utils'
  import JsBarcode  from "jsbarcode"
  import session from '@/utils/session'
  export default{
    data(){
      return{
        putDisible:false,
        orderNumber:null,
        dataList:[],
        styleArray:[{name:"颜色",English:"COLOR"},{name:"材质",English:"MATERIA"},{name:"尺寸",English:"SIZE"},{name:"款式",English:"PATTERN"},{name:"外框",English:"FRAME"},{name:"规格",English:"STYLE"}],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          orderNumber:''
        },
        orderDate: null,
        showGoodsDetail:false,
        showGoods:false,
        showPrintBtn:false,
        goods:{
          goodsVo:{cover:null},
          styleVo:{cover:null},
          style1:{name:""},
          style2:{name:""}
        },
        addStorageForm:{
          dialogVisible:false,
          count:0,
          skuValue:"",
          // price:0
        },
        choiceDatas:[],
        purchaseVisible:false,
        purchaseDesc:"",
        placeholder1:'',
        placeholder2:'',
        surplusCount:0
      }
    },
    mounted(){
      this.findByPage();
    },
    methods:{
      printHistory() {
        this.purchaseVisible = true;
        this.purchaseDesc = "";
      },
      comfirmHistoryPrint() {
        if (!this.purchaseDesc || !this.purchaseDesc.trim()) {
          this.$message({message: '打印入库凭证备注不能为空', type: 'warning'});
          return false;
        }
        let purchaseOrderIdData = [];
        this.choiceDatas.forEach((item)=>{
          purchaseOrderIdData.push(item.recordId);
        })
        let purchaseOrderIds = purchaseOrderIdData.join(",");
        console.log(purchaseOrderIds)

         let url = null;

         if(process.env.NODE_ENV == "production") {
            //线上url
             url = "/api/make-pdf/create-pdf-receipt/构巢商品采购入库凭证.pdf";
          } else if(process.env.NODE_ENV == "test") {
            //测试
             url = "/api/make-pdf/create-pdf-receipt/构巢商品采购入库凭证.pdf";
          } else {
            //本地url
            url = "http://192.168.20.104:8888/api/make-pdf/create-pdf-receipt/构巢商品采购入库凭证.pdf";
          }

        if (session.isLogin()) {
          var user = session.getUser();
          url = url + "?recordIds=" + purchaseOrderIds +"&desc="+ this.purchaseDesc + "&access_token=" + user.accessToken;
          window.open(url, "_blank");
          this.purchaseVisible = false;
          this.choiceDatas = [];
          this.findByPage();
        } else {
          this.$message.error("未登录");
        }


      },
      goodsCheck(data) {
        if(data.checked) {
          this.choiceDatas.push(data)
        } else {
          this.removePurchaseOrder(this.choiceDatas,data);
        }
        console.log(this.choiceDatas)
      },
      removePurchaseOrder(array,data) {
        for(var i = 0; i < array.length; i++) {
          if(array[i].recordId == data.recordId){
             console.log(i)
             array.splice(i, 1);
             break;
          }
        }
      },
      closeDialog(){
        return ;
      },
      getQrCode(goodsId) {
          var url;
          if(process.env.NODE_ENV == "production") {
            //线上url
            url = 'https://wx.goochao.com/goods_detail.html?goodsid=' + goodsId ;
          } else if(process.env.NODE_ENV == "test") {
            url = 'http://test.wx.goochao.com/goods_detail.html?goodsid=' + goodsId ;
          } else {
            //本地url
            url = 'http://192.168.20.102:8080/goods_detail.html?goodsid=' + goodsId;
          }

          jQuery('#qrcodeBox').qrcode({
            render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
            text: url, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
            width: "80", //二维码的宽度
            height: "80", //二维码的高度
            typeNumber: -1, //计算模式
            correctLevel: 2, //二维码纠错级别
            background: "#ffffff", //二维码的后景色
            foreground: "#000000", //二维码的前景色
            //src: logo, //中间的logo
            imgWidth: 80,
            imgHeight: 80
          })
      },
      setBarCode(barCodeStr) {
         JsBarcode("#barcode",barCodeStr, {
            lineColor: "#000",
            width:2,
            height:70,
            displayValue: true
        });
      },
      showStorageDialog() {
        this.resetForm();
        this.placeholder1 = "";
        this.placeholder2 = "";
        this.addStorageForm.dialogVisible = true;
      },
      resetForm() {
        this.showPrintBtn = false;
        this.showGoods = false;
        this.showGoodsDetail = false;
        this.goods = {
          goodsVo:{cover:null},
          styleVo:{cover:null},
          style1:{name:""},
          style2:{name:""}
        };
        this.addStorageForm.count = '';
        // this.addStorageForm.price = '';
        this.addStorageForm.skuValue = "";
      },
      checkForm() {
        if (!this.addStorageForm.skuValue) {
          this.$message({message: '请输入采购项编码', type: 'warning'});
          return false;
        }
        if( !this.showGoodsDetail){
          this.$message({message: '请输入正确的采购项编码', type: 'warning'});
          return false;
        }
        if (!this.addStorageForm.count) {
          this.$message({message: '请输入入库商品数量', type: 'warning'});
          return false;
        }

        if (!this.validate.validatNumber(this.addStorageForm.count)) {
          this.$message({message: '请输入入库商品数量', type: 'warning'});
          return false;
        }

        if (this.addStorageForm.count > 999) {
          this.$message({message: '一次最多入库255件', type: 'warning'});
          return false;
        }

        // if (!this.addStorageForm.price) {
        //   this.$message({message: '请输入入库采购单价', type: 'warning'});
        //   return false;
        // }
        // if (!this.validate.validatPrice(this.addStorageForm.price)) {
        //   this.$message({message:'入库采购价为2位小数或整数', type: 'warning'});
        //   return false;
        // }
        
        return true;
      },

      comfirmAddStorage() {
        if(this.checkForm()){
          let params={};

          params.orderNumber = this.addStorageForm.skuValue;
          params.count = this.addStorageForm.count;
          // params.price = parseInt(this.addStorageForm.price * 100);

          const h = this.$createElement;
          this.$confirm( '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger",
          message: h('p', null, [
              h('span', null, '确认商品入库数量为 '),
              h('span', {style: 'color: red;'}, params.count),
              // h('span', null,' 采购单价为 '),
              // h('span', {style: 'color: red;'},this.addStorageForm.price),
              h('span', null," ?"),
            ]),
          }).then(() => {
            this.putDisible = true;
            this.http.post(this).url(this.config.storage.putin_purchase).params(params).request( (response) => {
              this.putDisible = false;
              if (response.data.code != 0) {
                this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
                return;
              }
              
              this.$message({message: '商品入库成功', type: 'success'});
              this.showPrintBtn = true;
              this.showGoodsDetail = false;
              this.showGoods = true;
              this.addStorageForm.count = '';
              // this.addStorageForm.price = '';
              this.orderNumber = this.addStorageForm.skuValue;
              this.addStorageForm.skuValue = "";
              //this.addStorageForm.dialogVisible = false;
              this.findByPage();
              },(error) => {
                this.putDisible = false;
                console.log(error)
              }
            )
          }).catch(() => { });
        }
      },
      comfirmAndPrint() {
        let url = "goochaoprint://barcode?";
        url = url+"goodsId=" + this.goods.goodsVo.goodsId;
        url = url + "&code=" + this.orderNumber;
        url = url + "&goodsName=" + this.goods.goodsVo.title;
        url = url + "&style1Name=" + this.goods.goodsVo.firstStyleItemName;
        url = url + "&style2Name=" + this.goods.goodsVo.secondStyleItemName;
        url = url + "&style1EName=" + this.goods.style1.English;
        url = url + "&style2EName=" + this.goods.style2.English;
        url = url + "&style1Value=" + this.goods.styleVo.name;
        url = url + "&style2Value=" + this.goods.styleVo.subName;

        window.open(url, "_self");
      },
      printBarCode(data) {
        let firstEnglish = null;
        let secondEnglish = null;
        let skuName = data.skuName.split(" ");
        let name = skuName[0];
        let subName = skuName[1];
        this.styleArray.forEach((item)=>{
          if(item.name == data.firstStyleItemName){
            firstEnglish = item.English;
          }
          if(item.name == data.secondStyleItemName) {
            secondEnglish = item.English;
          }
        })
        let url = "goochaoprint://barcode?";
        url = url+"goodsId=" + data.goodId;
        url = url + "&code=" + data.orderNumber;
        url = url + "&goodsName=" + data.goodsTitle;
        url = url + "&style1Name=" + data.firstStyleItemName;
        url = url + "&style2Name=" + data.secondStyleItemName;
        url = url + "&style1EName=" + firstEnglish;
        url = url + "&style2EName=" + secondEnglish;
        url = url + "&style1Value=" + name;
        url = url + "&style2Value=" + subName;

        window.open(url, "_self");
      },
      findGoodsDetail(event){
        if (!this.addStorageForm.skuValue) {
          this.$message({message: '请输入采购项编码', type: 'warning'});
          return false;
        }

       jQuery('#qrcodeBox').html("");
       this.http.get(this).url(this.config.storage.find_goods).restful({orderNumber:this.addStorageForm.skuValue}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            this.setBtnShow();
            return;
          }
          let data = response.data.data;
          if(data == null){
            this.setBtnShow();
          }else{
            let skuNumber = data.goodsVo.goodsNumber + data.styleVo.styleNumber;

            this.placeholder1 = "请填写入库数量，未入库数量为" + (data.purchase.count - data.purchase.realityCount);
            this.surplusCount = data.purchase.count - data.purchase.realityCount;
            this.placeholder2 = "请填写入库价格，SKU成本价为" + (data.purchase.price / 100.0).toFixed(2) ;
            this.setBtnShow();
            this.showGoodsDetail = true;
            this.setBarCode(skuNumber);
            this.getQrCode(data.goodsVo.goodsId);
            this.styleArray.forEach((item)=>{
              if(item.name == data.goodsVo.firstStyleItemName){
                data.style1 = item;
              }
              if(item.name == data.goodsVo.secondStyleItemName){
                data.style2 = item;
              }
            })
            console.log(data)
            this.goods = data;
          }
          },(error) => {
            this.setBtnShow();
            console.log(error)
          }
        )
      },
      setBtnShow() {
        this.showGoodsDetail = false;
        this.showGoods = false;
        this.showPrintBtn =false;
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
          orderNumber:this.listQuery.orderNumber,
        };

        if (this.orderDate && this.orderDate[0] && this.orderDate[1]) {
          params.beginDate = parseTime(this.orderDate[0]);
          params.endDate = parseTime(this.orderDate[1].setHours(23,59,59));
        } else {
          params.beginDate = null;
          params.endDate = null;
        }

        this.listQuery.loading = true;

        this.http.get(this).url(this.config.storage.storage_history).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }


            response.data.data.data.forEach((item)=>{
              var flag = false;
              this.choiceDatas.forEach((goodsItem)=>{
                if (goodsItem.recordId == item.recordId) {
                  flag = true;
                }
              })

              if (flag) {
                item.checked = true;
              } else {
                item.checked = false;
              }

            });

            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
            this.listQuery.loading = false;
          },
          (error) => {
            console.log(error)
          }
        );
      },
    }
  }
</script>

<style lang="scss">
  #ptuInPurchase_vue{
    #dialog{
      top:-11%;
      >div{
        width:50%;
      }
    }
    .styleMessage{
      width:100%;
      height:auto;
      overflow:hidden;
      >p{
        width:50%;
        float:left;
      }
    }
    #goodsMessage{
      >div{
        color: #040706;
        background: white;
        width:100%;
       
        height: auto;
        border-radius: 25px;
        border: solid 2px #1f262a;
        overflow: hidden;
        .title{
          font-size:18px;
          color:#030000;
        }
        .styleText{
          font-size:25px;
          color:#030000;
          padding-left:20px;
        }
        .leftTop{
          padding-bottom: 20px;
          border-bottom: 2px solid #333434;
        }
        .left{
          width:80%;
          float:left;
          border-right: 2px solid #333434;
          .content{
            margin-top: 20px;
            overflow:hidden;
            >div{
              width:50%;
              float:left;
              padding-left: 20px;
            }
          }
          .leftBottom{
            overflow:hidden;
            .title{
              text-align:center;
              width:20%;
              float:left;
            }
            .code{
              width:80%;
              float:right;
              text-align:center;
              canvas{
                width:85%;
              }
            }
          }
        }
        .right{
          float:right;
          width:20%;
          #qrcodeBox{
            margin-top:50px;
           
          }
          img{
            width:60%;
            height:auto;
            display:block;
            margin:auto;
          }
        }
      }
    }
  }
</style>