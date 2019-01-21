<template>
  <div class="app-container calendar-list-container">
    <div v-show="state=='list'">
      <el-row :gutter="24">
        <el-col :span="24">
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

            <el-select  @change="selectChanged()" v-model="statusItem" style="width:105px" clearable filterable placeholder="商品状态">
              <el-option
                v-for="item in statusItems"
                :key="item.name"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>

            <el-select @change="doSearch()"  :filter-method="onProviderFilter"  v-model="providerId" clearable filterable placeholder="选择或输入供应商" style="width:160px;">
                <el-option
                  v-for="item in filterProviders"
                  :key="item.providerName"
                  :label="item.providerName"
                  :value="item.providerId">
                  <span style="float: left">{{ item.providerName }}</span>
                  <span style="float: right; color: #8492a6;margin-left:16px; font-size: 13px">{{ item.providerCode }}</span>
              </el-option>
            </el-select>

            <el-input @keyup.enter.native="keyEvent()" v-model="listQuery.keyword" style="width: 140px !important;" class="filter-item"
                      placeholder="商品名称或编码">
            </el-input>
            <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                       icon="search">搜索
            </el-button>
            <el-button @click="onCreate" type="primary" icon="plus" v-if="listType == 1">新建商品</el-button>
          </div>
        </el-col>

      </el-row>
      <div class="gc-praiselist_content_list">
        <el-table
          :row-class-name="tableRowClassName"
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          ref="multipleTable"
          :data="dataList"
          border
          style="width: 100%"
          @sort-change="sortChange"
          @selection-change="handleSelectionChange">
           
           <el-table-column type="expand" label="展开" v-if="listType == 1">
            <template scope="props" >

               <p class="goods_style_message"  v-for="style in props.row.styleVos" v-if="style.status == 1">
                <span>规格名称: <b>{{style.name +"-"+ style.subName}}</b> </span>
                <span>规格编码: <b>{{style.styleNumber}}</b> </span>
                <span style="color: 666;">规格成本价格 <b>￥{{style.costPrice}}</b></span>
                <span style="color: #343434;">规格售卖价格 <b>￥{{style.price}}</b></span>
              </p>

            </template>
          </el-table-column> 

          <el-table-column type="expand" label="展开" v-if="listType == 2">
            <template scope="props" >

              <p class="goods_style_message" v-for="style in props.row.styleVos" v-if="style.status == 1">
                <span style="height:53px;line-height:53px;">规格名称: <b>{{style.name +"-"+ style.subName}}</b> </span>
                <span style="height:53px;line-height:53px;">规格编码: <b>{{style.styleNumber}}</b> </span>
                
                <span v-if="!style.cover" style="color:orangered;height:53px;line-height:53px;">规格封面: <b>未编辑规格封面</b></span>
                <span v-else><h5 style="float:left;margin-right:10px;"> 规格封面:</h5><img  class="gc_praiselist_list_img" style="width:50px;height:50px;display:inline-block;margin:0;" :src="style.cover+config.imgtmb._50" ></span>
              </p>

            </template>
          </el-table-column> 

          <el-table-column type="expand" label="展开" v-if="listType == 3">
            <template scope="props" >
               <p class="goods_style_message"  v-for="style in props.row.styleVos" v-if="style.status == 1" :class="{'goods_noStorage':(style.count < 0)}">
                  <span>规格名称 <b>{{style.name +"-"+ style.subName}} </b></span>
                  <span>售卖价格 <b>￥{{style.price}}</b> </span>
                  <span>库存<b>{{style.count}}件</b></span>
                  <span>销量<b>{{style.totalCount - style.count}}件</b></span>
              </p>
            </template>
          </el-table-column> 


          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="商品封面"
            align="center"
            vertical="middle">
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
              <span>{{scope.row.title}}</span>
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

         <!--   <el-table-column v-if="listType == 2"
            label="商品规格(名称/封面)"
            align="center">
            <template scope="scope">

              <p style="margin-top:5px;margin-bottom:5px;display:flex;align-items:center;justify-content:center;" v-for="style in scope.row.styleVos" v-if="style.status == 1">
              <span style="margin-right:5px;">{{style.name +"-"+ style.subName}} </span>
              <span v-if="!style.cover" style="color:orangered">未编辑规格封面</span>
              <img v-else class="gc_praiselist_list_img" style="width:50px;height:50px;display:inline-block;margin:0;" :src="style.cover+config.imgtmb._50" >
              </p>

            </template>
          </el-table-column> -->

          <el-table-column 
            label="分类"
            align="center">
            <template scope="scope">

              <p style="margin-top:5px;margin-bottom:5px;"  v-for="category in scope.row.categories"><span>{{category.firstCategoryName}}/</span><span>{{category.secondCategoryName}}</span></p>
            </template>
          </el-table-column>

           <el-table-column
            label="供应商"
            align="center">
            <template scope="scope">
              <span>{{scope.row.provider.providerName}}</span>
            </template>
          </el-table-column>

         <!--  <el-table-column v-if="listType == 1"
            width="250"
            label="商品规格(名称/价格)"
            align="center">
            <template scope="scope">
              <p style="margin-top:5px;margin-bottom:5px;"  v-for="style in scope.row.styleVos" v-if="style.status == 1"><span>{{style.name +"-"+ style.subName}} </span><span style="color: orangered;">￥{{style.price}}元</span></p>
            </template>
          </el-table-column> -->

          <!-- <el-table-column v-if="listType == 3"
            label="优惠活动"
            align="center">
            <template scope="scope">
              <p v-if="!scope.row.couponVos.length">无</p>
              <p v-else v-for="coupon in scope.row.couponVos ">
                <span>{{coupon.name}} / </span>
                <span style="color:orangered">{{(coupon.type == 2) ? "折扣劵" : "满减劵"}} </span>
                <span v-if="coupon.type == 2">/ 商品{{coupon.disCount}}折</span>
                <span v-if="coupon.type == 3">/ 商品满{{coupon.toAmount}}减{{coupon.amount}}</span>
                <br>
              </p>
            </template>
          </el-table-column> -->

           <!-- <el-table-column v-if="listType == 3"
            label="商品规格(名称/价格/剩余库存/销量)"
            align="center">
            <template scope="scope">
              <p v-for="style in scope.row.styleVos" v-if="style.status == 1" :class="{'goods_noStorage':(style.count < 0)}">
                <span>{{style.name +"-"+ style.subName}} /</span><span>￥{{style.price}}元 </span><span>/{{style.count}}件</span><span>/{{style.totalCount - style.count}}件</span>
              </p>
            </template>
          </el-table-column> -->

          <el-table-column
            label="状态"
            align="center">
            <template scope="scope">
             <span style="color:#666666;" v-if="scope.row.goodsStatus == 0">基本信息待完善</span>
             <span style="color:#F9DD82;" v-if="scope.row.goodsStatus == 1">内容待生成</span>
             <span style="color:#EEB541;" v-if="scope.row.goodsStatus == 2">待上架</span>
             <span style="color:#86C055;" v-if="scope.row.goodsStatus == 3">已上架</span>
             <span style="color:#cacaca;" v-if="scope.row.goodsStatus == 4">已下架</span>
            </template>
          </el-table-column>

          <el-table-column
            label="备注"
            align="center">
            <template scope="scope">
             <span style="color:#666666;" v-if="scope.row.basicModifyDesc != null">{{scope.row.basicModifyDesc}}</span>
             <span style="color:#cacaca;" v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            :width="listType == 3 ? 330 : 240"
             >
            <template scope="scope">

              <el-button v-if="(scope.row.goodsStatus == 4 && listType == 3) || (scope.row.goodsStatus == 2 && listType == 3)" size="small" icon="circle-check" type="success"
                         @click="putaway(scope.row)">上架
              </el-button>
              <el-button v-if="scope.row.goodsStatus == 3 && listType == 3" size="small" icon="circle-close" type="warning"
                         @click="pulled(scope.row)">下架
              </el-button>

              <el-button icon="circle-close" v-if="listType == 1 && scope.row.goodsStatus == 1 || listType == 2 && scope.row.goodsStatus == 2" type="warning"  size="small" @click="callBackEdit(scope.row)">撤回编辑</el-button>

              <el-button icon="edit" v-if="listType == 1 && scope.row.goodsStatus == 0 || listType == 1 && scope.row.goodsStatus == 4 || listType == 2 && scope.row.goodsStatus == 1"  size="small" @click="onEdit(scope.row,false)">编辑</el-button>

              <el-button icon="edit" size="small" @click="setActive(scope.row)" v-if="(scope.row.goodsStatus == 4 && listType == 3) || (scope.row.goodsStatus == 3 && listType == 3) || (scope.row.goodsStatus == 2 && listType == 3)" >营销活动</el-button>


              <el-dropdown trigger="click" v-if="listType != 3">
                <el-button type="primary" size="small" style="margin-left:10px;">
                  更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" >   
                  <el-dropdown-item>           
                    <el-button class="fontFamily icon-browse"  type="info" size="small" @click="onEdit(scope.row,true)"> 查看商品
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>           
                    <el-button class="fontFamily"  type="info" size="small" @click='copyGoodsUrl(scope.row,$event)'> 复制商品链接 </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-dropdown v-if="listType == 3" trigger="click">
                <el-button type="primary" size="small" style="margin-left:10px;">
                  更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item>
                      <el-button v-if=" listType == 3 && scope.row.top" size="small" icon="circle-close" type="warning" @click="cancelTop(scope.row)">取消置顶</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                      <el-button v-if=" listType == 3 && !scope.row.top" size="small" icon="circle-check" type="success" @click="topGoods(scope.row)">置顶商品</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                     <el-button class="fontFamily icon-browse"  type="info" size="small" @click="onEdit(scope.row,true)"> 查看商品 </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>           
                    <el-button class="fontFamily"  type="info" size="small" @click='copyGoodsUrl(scope.row,$event)'> 复制商品链接 </el-button>
                  </el-dropdown-item>
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
    </div>
    <!-- <save-goods ref="goods" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='create'">
    </save-goods> -->
    <save-goods-basic v-if="listType == 1" ref="goodsBasic" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='edit'"></save-goods-basic>

    <save-goods-content v-if="listType == 2" ref="goodsContent" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='edit'"></save-goods-content>

    <goods-preview ref="goodsPreview" v-on:cancel="state='list'" v-show="state=='preview'"></goods-preview>

    <el-dialog  v-if="listType == 3" title="设置商品优惠政策" :visible.sync="couponDialogFormVisible">
      <el-button type="text"><span style="color:#343434;">商品名称:</span>{{goodsName}}</el-button>
      <p><el-button type="text"><span style="color:#343434;">商品编码:</span>{{goodsNumber}}</el-button></p>
      <set-goods-coupon ref="setGoodsCoupon"></set-goods-coupon>
    </el-dialog>


    <el-dialog  title="复制商品链接" :visible.sync="qrcodeVisible">
      <el-tabs v-model="qrcodeActive" >
        <el-tab-pane label="链接地址" name="1">
          <el-input v-model="qrcodeUrl" :disabled="true" placeholder="请输入内容" style="width:50%;"/>
          <el-button type="primary" icon="el-icon-document" @click="handleCopy(qrcodeUrl,$event)">复制</el-button>       
        </el-tab-pane>
        <el-tab-pane label="地址二维码" name="2">
          <div id="goodsQrcode" style="text-align: center;"></div>
          <p style="color:#343434;text-align:center;">右键点击二维码，选择‘图片另存为’，保存到本地</p>         
        </el-tab-pane>
      </el-tabs>
    </el-dialog>


  </div>
</template>
<script>
  import SaveGoods from './saveGoods'
  import SaveGoodsBasic from "./saveGoodsBasic.vue"
  import SaveGoodsContent from "./saveGoodsContent.vue"
  import SetGoodsCoupon from "./setGoodsCoupon.vue"
  import GoodsPreview from "./goodsPreview.vue"
  import clip from '@/utils/copyText'
  import waves from '@/directive/waves/index.js' // 水波纹指令

  export default {
    props:["listType"],  //1商品基本信息  2商品内容 3商品营销 
    components: {
      SaveGoods,
      SaveGoodsBasic,
      SaveGoodsContent,
      SetGoodsCoupon,
      GoodsPreview
    },
    directives: {
      waves
    },
    data() {
      return {
        qrcodeActive:'1',
        qrcodeVisible:false,
        qrcodeUrl:null,
        providerId:null,
        providers: [],
        filterProviders: [],
        goodsSaleStatus:true,
        sortValue: "1",
        goodsName:"",
        goodsNumber:"",
        goodsId:null,
        couponDialogFormVisible:false,
        dialogFormVisible: false,
        currentGoods: {},
        formLabelWidth: '120px',
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          keyword: "",
          column: "",
          order: ""
        },
        dataList: [],
        multipleSelection: [],
        detail: null,
        state: "list", // list | create | edit
        categorys: [],
        firstCategorys: [],
        secondCategorys: [],
        firstCategory: "",
        secondCategory: "",
        statusItems: [
          {name: "基本信息待完善", value: 0, type: 0},
          {name: "内容待生成", value: 1 , type:1},
          {name: "待上架", value: 2, type:2},
          {name: "已上架", value: 3, type:3},
          {name: "已下架", value: 4, type:4}
        ],
        statusItem: ""
      }
    },
    methods: {
      copyGoodsUrl(goods,event) {
        this.restCode(); 
        let url = "https://wx.goochao.com/goods_detail.html?goodsid=" + goods.goodsId;
        let params = {};
        params.url = url;
        this.http.get(this).url(this.config.toShortUrl).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.qrcodeVisible = true;
          this.qrcodeUrl = response.data.data;
          setTimeout(()=>{
            this.setCode(response.data.data);
          },20)

          }, (err) => {console.log(err)}
        );
      },
      restCode() {
        this.qrcodeActive = '1';
        jQuery('#goodsQrcode').html("");
        this.qrcodeUrl= null;
      },
      handleCopy(qrcodeUrl,event) {
        clip(qrcodeUrl,event,'商品链接');
      },
      setCode(url) {
        jQuery('#goodsQrcode').qrcode({
          render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
          text: url, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
          width: "160", //二维码的宽度
          height: "160", //二维码的高度
          typeNumber: -1, //计算模式
          correctLevel: 2, //二维码纠错级别
          background: "#ffffff", //二维码的后景色
          foreground: "#000000", //二维码的前景色
          imgWidth: 80,
          imgHeight: 80
        })
      },
      tableRowClassName(row,index) {
        // console.log(row,index)
        let flag = true;
        
        if (!row.styleVos || this.listType != 3) {
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
      findAllProvider() {
        this.http.get(this).url(this.config.provider.provider_all_url).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
            this.providers = response.data.data;
            this.filterProviders = response.data.data;
          }, (err) => {console.log(err)}
        );
      },
      onProviderFilter(keyword) {
        if (!keyword) {
          this.filterProviders = this.providers;
          return;
        }
        keyword = keyword.toLowerCase();
        var filterArr = [];
        this.providers.forEach((item)=> {
          var provideName = item.providerName.toLowerCase();
          var providerCode = item.providerCode.toLowerCase();
          if (provideName.indexOf(keyword) != -1 || providerCode.indexOf(keyword) != -1) {
            filterArr.push(item);
          }
        })
        this.filterProviders = filterArr;
      },
      dialogClose() {
        this.couponDialogFormVisible = false;
        this.findByPage();
      },
      callBackEdit(goods) {
        this.$confirm('是否撤回\"' + goods.title + '\"重新编辑?', '提示', {
          confirmButtonText: '撤回',
          cancelButtonText: '取消',
          type: 'info',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          if (this.listType == 1) {
            this.callBackBase(goods.goodsId);
          } else if (this.listType == 2) {
            this.callBackContent(goods.goodsId);
          }
        }).catch(() => {
        });

      },
      callBackBase(goodsId) {
        this.http.post(this).url(this.config.goods.callBack_base).restful({goodsId:goodsId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '商品已撤销至初始状态可继续编辑!'});
            this.findByPage();
          },
          (error) => {}
        );
      },
      callBackContent(goodsId) {
        this.http.post(this).url(this.config.goods.callBack_content).restful({goodsId:goodsId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '商品已撤销至初始状态可继续编辑!'});
            this.findByPage();
          },
          (error) => {}
        );
      },
      checkChange() {
        console.log(this.goodsSaleStatus)
        this.http.post(this).url(this.config.goods.goods_sale).params({noStorageSale:this.goodsSaleStatus}).restful({goodsId:this.goodsId}).request((response) => {
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
      setActive(goods) {
        this.couponDialogFormVisible = true;
        this.goodsName = goods.title;
        this.goodsNumber = goods.goodsNumber;
        this.goodsId = goods.goodsId;
        this.goodsSaleStatus = goods.noStorageSale;
        setTimeout(()=>{
          this.$refs.setGoodsCoupon.getGoodsId(goods);
        },200)
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
      findByPage() {
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          reallyName: this.listQuery.condition,
          column: this.listQuery.column,
          order: this.listQuery.order,
          keyword: this.listQuery.keyword
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
        if(this.providerId != null && this.providerId){
          params.providerId = this.providerId;
        }

        this.listQuery.loading = true;

        this.http.get(this).url(this.config.goods.list_url_v2).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            //console.log(response.data);
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
            this.listQuery.loading = false;
          },
          (error) => {
            console.log(error)
          }
        );
      },
      handleIconClick(ev) {
        console.log(ev);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteGoods(goods) {
        this.$confirm('是否要删除商品"' + goods.title + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.goods.batch_del_url).params({goodsIds: goods.goodsId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {
        });
      },
      onCreate() {
        //this.$router.push({ path: '/goods/savePraiseGoods' })
        this.state = "edit";
        this.$refs.goodsBasic.loadData();
      },
      onEdit(goods,type) {
        console.log(goods)
        let params = {};
        if (this.listType == 1 && !type) {
          params.loadPullSku = true;
        } else {
          params.loadPullSku = false;
        }
        
        this.http.get(this).url(this.config.goods.delete_url_v2).restful({goodsId: goods.goodsId}).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            response.data.data.categoryName = goods.categories;
            response.data.data.provider = goods.provider;

            if(type){
              this.state = "preview";
              this.$refs.goodsPreview.loadSource(response.data.data,this.listType);
            }else{
              this.state = "edit";
              if (this.listType == 1) {
                this.$refs.goodsBasic.loadSource(response.data.data,type);
              } else if (this.listType == 2) {
                this.$refs.goodsContent.loadSource(response.data.data,type);
              }
            }
          }, (err) => {
          });
      },
      createSuccess() {
        this.state = "list";
        this.findByPage();
      },
      /**
       * 编辑列
       */

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
      pulled(goods) {
        this.http.get(this).url(this.config.validateGoods.goodsData).restful({goodsId: goods.goodsId}).request( (response) => {
            if(response.data.code != 0) {
              this.$message({
                message: response.data.message ? response.data.message : "系统错误",
                type: 'error'
              });
              return;
            }
            let data = response.data.data;
            this.showPullMessage( goods, data);
          }, (error) => {}
        );
      },
      showPullMessage(goods,data) {
        if (data) {
          const h = this.$createElement;
          this.$confirm('提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            message: h('p', null, [
              h('span', null, null),
              h('span', {
                style: 'color: red'
              }, "该商品\"" + goods.title + "\"在首页推荐中存在使用，是否要继续下架?")
            ]),
          }).then(() => {
            this.pullGoods(goods.goodsId)
          }).catch(() => {});
        } else {
          this.$confirm("是否要下架商品 " + goods.title + " ?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
             this.pullGoods(goods.goodsId)
          }).catch(() => {});
        }
      },
      pullGoods(goodsId) {
         this.http.post(this).url(this.config.goods.goods_pullaway).params({goodsId: goodsId}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.$message({type: 'success', message: '下架成功!'});
          this.findByPage();
        }, (err) => {});
      },

      putaway(goods) {
        this.$confirm('是否要上架商品"' + goods.title + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.goods.goods_putaway).params({goodsId: goods.goodsId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '上架成功!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {
        });
      },
      topGoods(goods) {
        this.$confirm('是否要置顶商品"' + goods.title + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.goods.top_goods).restful({goodsId: goods.goodsId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '商品置顶成功!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {
        });
      },
      cancelTop(goods) {
        this.$confirm('是否取消置顶商品"' + goods.title + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.goods.cancel_top).restful({goodsId: goods.goodsId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '已成功取消置顶商品!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {
        });
      },
      onSort(goods) {
        this.currentGoods = goods;
        this.sortValue = goods.sort;
        this.dialogFormVisible = true;
      },


      selectChanged() {
        this.doSearch();
      },

      keyEvent() {
        this.doSearch();
      }
    },
    mounted() {
      this.findAllProvider();
      this.findByPage();
      this.findCategroy();
      console.log(this.listType+"++++-+-+-+-+-")
    }
  }
</script>
<style>
  /*.bg-purple .el-input {
    width: 130px !important;
  }*/
  .gc-praiselist {

  }
  
  .el-table .isNormal {
    background: #fff;
  }
  .el-table .isWarning {
    background: #ffffcc;
  }  
  
  .el-table__body .isWarning:hover td{
    background:#ffffcc !important;
  }

  .el-table__body .isWarning.current-row td{
    background:#ffffcc !important;
  }

  .goods_style_message{
    margin-top: 15px;
    margin-bottom: 15px;
    overflow:hidden;
  }
  .goods_style_message>span{
    display:block;
    width:25%;
    float:left;
    text-align:left;
  }

  .goods_noStorage{
    color:orangered;
  }
  .gc-praiselist_title {
    padding: 5px 15px 15px;
    border-bottom: 1px solid #dcdcdc;
  }

  .gc-praiselist h1 {
    font-size: 18px;
    color: #666;
    line-height: normal;
    margin: 0;
  }

  .gc-praiselist_content {
    margin-top: 10px;
    padding: 0 15px;
  }

  /*.el-input {
      width: 250px;
      margin-left:10px;
  }*/
  .gc-praiselist_content_list {
    margin-top: 15px;
  }

  .gc_praiselist_list_img {
    width: 100px;
    height: 100px;
    display: block;
    margin: 5px auto;
  }

  .gc-praiselist_pagination {
    margin-top: 15px;
  }

  .el-number-cus {

  }
  .el-dropdown-menu__item{
    text-align: center;
  }

  /*.el-number-cus .el-input {
    width: 181px !important;
    margin-left: 0px !important;
  }*/
</style>
