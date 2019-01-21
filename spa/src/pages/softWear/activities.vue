<template>
  <div class="app-container calendar-list-container" id="activities_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.title" style="width: 200px !important;" class="filter-item" placeholder="活动标题">
          </el-input>

          <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          <el-button @click="showAddActivity" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="plus">新增</el-button>

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
            label="活动封面"
            width="140"
            align="center">
            <template scope="scope">
              <img :src="scope.row.cover+'?imageView2/1/w/276/h/276'" style="width:100px;height:100px;margin-top:5px;">
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="活动标题">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="活动优惠券">
            <template scope="scope">

              <div v-if="scope.row.activityCouponRelations.length ">
                <div v-for="item in scope.row.activityCouponRelations">
                 <p v-if="item.coupon">{{item.coupon.name}}</p>
                 <p v-else>无</p>
                </div>
              </div>

              <span v-else>未指定优惠券</span>
              
            </template>
          </el-table-column>

          <el-table-column
            label="活动覆盖楼盘"
            align="center">
            <template scope="scope">
              <div v-if="scope.row.activityHouseRelations.length > 0">
                <div v-for="item in scope.row.activityHouseRelations">{{item.house.houseName}}</div>
              </div>
              <span v-else>未指定楼盘</span>
            </template>
          </el-table-column>

          <el-table-column
            label="活动状态"
            width="120"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.activityStatus==1">未发布</span>
              <span v-if="scope.row.activityStatus==2">已发布</span>
              <span v-if="scope.row.activityStatus==3">已结束</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
             <el-button class="fontFamily icon-browse button_detail" size="small" type="primary" @click="seeDetail(scope.row)">
             <!-- <icon-svg icon-class="icon_eyes"></icon-svg> -->
             查看详情</el-button>
             <!-- <el-button v-if="scope.row.activityStatus==1 || scope.row.activityStatus==3" size="small" icon="circle-check" type="success" @click="publishActivity(scope.row)">发布活动</el-button>
             <el-button v-if="scope.row.activityStatus==2" size="small" icon="circle-close" type="warning" @click="endActivity(scope.row)">结束活动</el-button>
             <el-button icon="delete" size="small" type="danger" @click="deleteActivity(scope.row)">删除</el-button> -->
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
          @current-change="handleCurrentChange"
                         :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
          </el-pagination>
        </div>
      </div>

      <el-dialog :title="dialogTitle"  :visible.sync="activity.dialogVisible">
        <div class="house_detail">
         <el-row :gutter="24">
            <el-col :span="12">
              <span class="span">活动标题:</span>
              <el-input :disabled="activity.activityStatus!=1" type="text" v-model="activity.title" style="width:70%;" placeholder="请输入活动标题" maxlength="50"> </el-input>
            </el-col>

            <el-col :span="12">
              <span class="span">活动链接:</span>
              
              <el-input v-show="checked" :disabled="activity.activityStatus != 1" type="text" v-model="activity.url" style="width:50%;" placeholder="请输入活动链接" maxlength="255"> </el-input>
              
              <el-select v-show="!checked"  clearable style="width:50%;" class="filter-item" v-model="activity.url" placeholder="请选择活动链接">
                <el-option
                  v-for="item in urlLinkData"
                  :key="item.url"
                  :label="item.name"
                  :value="item.url">
                </el-option>
              </el-select>

              <el-checkbox v-if="activity.activityStatus == 1"  v-model="checked">手动输入</el-checkbox>

            </el-col>

            <el-col :span="12">
              <span class="span">活动封面:</span>
              <div style="display:inline-block">
                <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>

                <div v-show="activity.cover && !uploading" class="el-upload el-upload--picture-card">
                  <img :id="'uploadCover' + activityStatus" title="点击修改封面图" style="width:100%; height:100%"
                       v-show="activity.activityStatus==1"
                       :src="activity.cover+'?imageView2/1/w/276/h/276'">

                  <img title="封面图" style="width:100%; height:100%"
                       v-show="activity.activityStatus!=1"
                       :src="activity.cover+'?imageView2/1/w/276/h/276'">
                </div>
                <div v-show="!activity.cover && !uploading" style="display:inline-block;">
                  <div class="el-upload el-upload--picture-card" :id="'uploadCoverBtn' + activityStatus">
                    <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                  </div>
                </div>
              </div>
            </el-col>

            <el-col :span="12">
              <span class="span" style="float:left; margin-right:3px;">活动描述:</span>
              <el-input :disabled="activity.activityStatus!=1" v-model="activity.description" maxlength="100" style="display:inline-block; width:70%" type="textarea" :autosize="{ minRows: 7, maxRows: 7}"
                        placeholder="请填写文章摘要">
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <span class="span">开始日期:</span>
              <el-date-picker
                style="width:70%"
                :disabled="activity.activityStatus!=1"
                v-model="activity.beginDate"
                :picker-options="pickerOptions"
                type="date"
                placeholder="开始日期">
              </el-date-picker>
            </el-col>

            <el-col :span="12">
              <span class="span">结束日期:</span>
              <el-date-picker
              :disabled="activity.activityStatus!=1"
                style="width:70%"
                v-model="activity.endDate"
                :picker-options="pickerOptions"
                type="date"
                placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24" style="margin-bottom:10px; padding-right:50px;">
              <span class="el-dialog__title span" style="padding-top:5px">覆盖楼盘</span>
              <el-button v-show="activity.activityStatus==1" size="small" style="float:right;" class="button" @click="deleteHouse" type="danger" icon="delete">删除</el-button>
              <el-button v-show="activity.activityStatus==1" size="small" style="float:right; margin-right:10px" class="button" @click="showHouse" type="primary" icon="plus">新增</el-button>
            </el-col>

            <el-col :span="24" style="padding-left:40px; padding-right:50px;">
              <el-table
                @selection-change="onDeleteHouse"
                empty-text="未选择楼盘"
                :data="activity.activityHouseRelations"
                border
                style="width: 100%">
                <el-table-column type="index" align="center" label="序号" width="65">
                </el-table-column>
                <el-table-column
                  prop="house.houseName"
                  label="楼盘名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  label="所在地区"
                  width="180">
                  <template scope="scope">
                    <span>{{scope.row.house.province}}/{{scope.row.house.city}}/{{scope.row.house.county}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="house.address"
                  label="楼盘地址">
                </el-table-column>
                

                <el-table-column
                  label="操作"
                  align="center"
                  width="120">
                  <template scope="scope">
                    <el-button size="small"  type="primary" @click="seePlanList(scope.row)">查看软装方案</el-button>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="activity.activityStatus==1"
                  type="selection"
                  width="55">
                </el-table-column>

              </el-table>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="24" style="margin-bottom:10px; padding-right:50px;">
              <span class="el-dialog__title span" style="padding-top:5px">优惠券</span>
              <el-button v-show="activity.activityStatus==1" size="small" style="float:right;" class="button" @click="deleteCoupon" type="danger" icon="delete">删除</el-button>
              <el-button v-show="activity.activityStatus==1" size="small" style="float:right; margin-right:10px" class="button" @click="showCoupon" type="primary" icon="plus">新增</el-button>
            </el-col>

            <el-col :span="24" style="padding-left:40px; padding-right:50px;">
              <el-table
                @selection-change="onDeleteCoupon"
                empty-text="未选择优惠券"
                :data="activity.activityCouponRelations"
                border
                style="width: 100%">
                <el-table-column type="index" align="center" label="序号" width="65">
                </el-table-column>
                <el-table-column
                  prop="coupon.name"
                  label="优惠券名称"
                  width="150">
                </el-table-column>
                <el-table-column
                  label="优惠券类型"
                  width="120">
                  <template scope="scope">
                    <span v-if="scope.row.coupon.type==1">包邮</span>
                    <span v-else-if="scope.row.coupon.type==2">折扣</span>
                    <span v-else-if="scope.row.coupon.type==3">金额</span>
                    <span v-else-if="scope.row.coupon.type==4">让利</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="有效期">
                  <template scope="scope">
                    <div v-if="scope.row.coupon.inDate">
                      <span>{{scope.row.coupon.inDate}}天</span>
                    </div>
                    <div v-else>
                      <span>{{scope.row.coupon.beginDate | formatDate}}</span>
                      <span>-</span>
                      <span>{{scope.row.coupon.endDate | formatDate}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="70"
                  prop="coupon.totalCount"
                  label="发行数量">
                </el-table-column>
                <el-table-column
                  width="70"
                  prop="coupon.collectCount"
                  label="领取数量">
                </el-table-column>
                <el-table-column
                  width="70"
                  prop="coupon.useCount"
                  label="使用数量">
                </el-table-column>
                <el-table-column
                  v-if="activity.activityStatus==1"
                  type="selection"
                  width="55">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>

        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="activity.dialogVisible = false">取消</el-button>

          <el-button v-if="activity.activityId" type="danger" @click="deleteActivity(activity)">删除活动</el-button>
          <el-button v-if="activity.activityId && activity.activityStatus==2" type="danger" @click="endActivity(activity)">结束活动</el-button>
          <el-button v-if="activity.activityId && activity.activityStatus==1" type="success" @click="publishActivity(activity)">发布活动</el-button>
          <el-button v-if="activity.activityStatus==1" type="primary" @click="doSave">
            <span v-if="activity.activityId">确认修改</span>
            <span v-else="activity.activityId">新增</span>
          </el-button>
        </div>

      </el-dialog>

      <el-dialog  title="选择楼盘"  :visible.sync="houseVisible">
          <div>
            <el-input @keyup.enter.native="searchHouse()" v-model="houseQueryList.houseName" style="width: 200px !important;" class="filter-item" placeholder="楼盘名称">
            </el-input>

            <el-select @change="citySearch" filterable clearable style="width: 120px" class="filter-item" v-model="houseQueryList.provinceCode" placeholder="省份">
              <el-option
                v-for="item in provinces"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>

            <el-select @change="areaSearch" filterable clearable style="width: 120px" class="filter-item" v-model="houseQueryList.cityCode" placeholder="地级市">
              <el-option
                v-for="item in citys"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>

            <el-select @change="searchHouse()" filterable clearable style="width: 120px" class="filter-item" v-model="houseQueryList.countyCode" placeholder="区/县">
              <el-option
                v-for="item in areas"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>

            <el-button @click="searchHouse()" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>

          <div class="gc-praiselist_content_list" style="margin-top:15px;">
            <el-table
              :data="houseData"
              ref="houseTable"
              @selection-change="handleHouseSelectionChange"
              border
              style="width: 100%;">

              <el-table-column type="index" align="center" label="序号" width="65">
              </el-table-column>

              <el-table-column
                align="center"
                label="楼盘名称">
                <template scope="scope">
                  <span>{{scope.row.houseName}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="省/区/县">
                <template scope="scope">
                  <span>{{scope.row.province}}/{{scope.row.city}}/{{scope.row.county}}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="楼盘地址"
                align="center">
                <template scope="scope">
                  <span>{{scope.row.address}}</span>
                </template>
              </el-table-column>

              <el-table-column
                type="selection"
                width="55">
              </el-table-column>

            </el-table>
            <div class="pagination-container">
              <el-pagination @size-change="houseHandleSizeChange" :current-page="houseQueryList.pageIndex"
              @current-change="houseHandleCurrentChange"
                             :page-sizes="[10,15,20,30]" :page-size="houseQueryList.pageSize"
                             layout="total, sizes, prev, pager, next, jumper" :total="houseQueryList.total">
              </el-pagination>
            </div>
          </div>

        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="houseVisible = false">关 闭</el-button>
          <el-button type="primary" @click="comfirmSelectedHouse">确 定</el-button>
        </div>

      </el-dialog>

      <el-dialog  title="选择优惠券"  :visible.sync="couponVisible">
          <div>
            <el-input @keyup.enter.native="searchCoupon()" v-model="couponQueryList.name" style="width: 200px !important;" class="filter-item" placeholder="优惠券名称">
            </el-input>
            <el-button @click="searchCoupon()" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>

          <div class="gc-praiselist_content_list" style="margin-top:15px;">
            <el-table
              :data="couponData"
              ref="couponTable"
              @selection-change="handleCouponSelectionChange"
              border
              style="width: 100%;">

              <el-table-column type="index" align="center" label="序号" width="65">
              </el-table-column>

              <el-table-column
                prop="name"
                label="优惠券名称"
                width="150">
              </el-table-column>
              <el-table-column
                prop="name"
                label="优惠券类型"
                width="120">
                <template scope="scope">
                  <span v-if="scope.row.type==1">包邮</span>
                  <span v-else-if="scope.row.type==2">折扣</span>
                  <span v-else-if="scope.row.type==3">金额</span>
                  <span v-else-if="scope.row.type==4">让利</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                label="有效期">
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
              <el-table-column
                width="70"
                prop="totalCount"
                label="发行数量">
              </el-table-column>
              <el-table-column
                width="70"
                prop="collectCount"
                label="领取数量">
              </el-table-column>
              <el-table-column
                width="70"
                prop="useCount"
                label="使用数量">
              </el-table-column>

              <el-table-column
                type="selection"
                width="55">
              </el-table-column>

            </el-table>
            <div class="pagination-container">
              <el-pagination @size-change="couponHandleSizeChange" :current-page="couponQueryList.pageIndex"
              @current-change="couponHandleSizeChange"
                             :page-sizes="[10,15,20,30]" :page-size="couponQueryList.pageSize"
                             layout="total, sizes, prev, pager, next, jumper" :total="couponQueryList.total">
              </el-pagination>
            </div>
          </div>

        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="couponVisible = false">关 闭</el-button>
          <el-button type="primary" @click="comfirmSelectedCoupon">确 定</el-button>
        </div>

      </el-dialog>

        <el-dialog  title="软装方案"  :visible.sync="planDialog">
          <el-table
          :data="palnDatas"
          border
          style="width: 100%;">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="方案封面"
            align="center">
            <template scope="scope">
              <img :src="scope.row.cover" style="width:auto;height:50px;margin-top:5px;">
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="方案名称">
            <template scope="scope">
              <span>{{scope.row.planName}}</span>
            </template>
          </el-table-column>

         <!--  <el-table-column
            align="center"
            label="方案风格">
            <template scope="scope">
              <span>{{scope.row.style.name}}</span>
            </template>
          </el-table-column> -->

          <el-table-column
            label="方案适用户型"
            align="center">
            <template scope="scope">
              <p style="margin-top:5px;margin-bottom:5px;" v-for="plan in scope.row.houseTypePlanRelations">
                <span>{{plan.house.houseName}} / </span><span>{{plan.houseType.typeName}}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            label="商品数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsCount}}件</span>
            </template>
          </el-table-column>

          </el-table>  

          <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="planDialog = false">关 闭</el-button>
          </div>

        </el-dialog>

  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import uploader from '@/utils/uploader'
  import {formatDate} from '@/commons/date.js'

  export default {
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
    props:['activityStatus'],
    data() {
      return {
        planDialog:false,
        palnDatas:[],
        seeDetailtype:true, // 是否查看详情
        tabValue:'',
        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          dialogTitle:''
        },
        houseQueryList: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          houseName: null,
          provinceCode: '',
          cityCode: '',
          countyCode: ''
        },
        couponQueryList: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          status:1,
          name:"",
          global:true
        },
        activity: {
          dialogVisible: false,
          activityId: null,
          title: null,
          beginDate: null,
          endDate: null,
          url: null,
          cover: null,
          description: null,
          beginDate: null,
          endDate: null,
          activityHouseRelations: [],
          activityCouponRelations: [],
          activityStatus:1
        },
        token: null,
        uploading: false,
        houseVisible: false,
        houseData: [],
        tempSelectedHouse: [],
        tempDeleteHouse: [],
        couponData:[],
        couponVisible:false,
        tempSelectedCoupon: [],
        tempDeleteCoupon: [],
        title: "",
        provinces: [],
        citys: [],
        areas: [],
        urlLinkData:[],
        checked:false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    mounted() {
      this.findByPage();
      this.findByProvince();
      this.setUrlLink();
    },
    methods:{
      setUrlLink() {  
        let data = [{name:'新人有礼',url:"/newcomers_gift.html"},{name:'软装推广活动',url:"/softWear_activity.html"},{name:'分享有礼',url:"/share_to_friend.html"},{name:'首页',url:"/index.html"},{name:'酒店活动',url:'/hotel.html'},{name:'合作公众号推广活动',url:'/bank_activity.html'}];
        
        let urlLink = null;
        if(process.env.NODE_ENV == "production") {
          urlLink = "https://wx.goochao.com";
        } else if(process.env.NODE_ENV == "test") {
          urlLink = "http://test.wx.goochao.com";
        } else {
          urlLink = "http://192.168.20.102:8080";
        }

        data.forEach((item)=>{
          item.url = urlLink + item.url ;
        })

        this.urlLinkData = data;
      },
      reset() {
        this.checked = false;
        this.activity.activityId = null;
        this.activity.title = null;
        this.activity.beginDate = null;
        this.activity.endDate = null;
        this.activity.url = null;
        this.activity.cover = null;
        this.activity.description = null;
        this.activity.beginDate = null;
        this.activity.endDate = null;
        this.activity.activityHouseRelations = [];
        this.activity.activityCouponRelations = [];
        this.activity.activityStatus = 1;
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
        this.listQuery.loading = true;
        this.listQuery.activityStatus = this.activityStatus;
        this.http.get(this).url(this.config.softWear.activities).params(this.listQuery).request((response) => {
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
      seeDetail(data){
        this.seeDetailtype = true;
        this.http.get(this).url(this.config.softWear.activities_detail).restful({activityId:data.activityId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data;
            $.extend(this.activity, data);
            if (!this.token) {
              this.getUploadTokenInitUploadBtn();
            }
            this.dialogTitle = "活动详情";
            this.activity.dialogVisible = true;
            this.checked = true;
          },(error) => {
            this.$message({message: "查询详情失败", type: 'warning'});
          });
      },
      endActivity(data) {
        this.$confirm('提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          message: "是否要结束\"" + data.title + "\"？结束活动后该活动会立即失效。"
        }).then(() => {
          this.http.post(this).url(this.config.softWear.activities_end).restful({
              activityId: data.activityId
            })
            .request((response) => {
              if(response.data.code != 0) {
                this.$message({
                  message: response.data.message,
                  type: 'error'
                });
                return;
              }
              this.$message({
                type: 'success',
                message: '活动结束成功!'
              });
              this.findByPage();
              this.activity.dialogVisible = false;
            }, (err) => {});
        }).catch(() => {});
      },
      publishActivity(data) {
        this.$confirm('提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          message: "是否要发布\"" + data.title + "\"？发布活动后按照活动实际开始日期生效。"
        }).then(() => {
          this.http.post(this).url(this.config.softWear.activities_publish).restful({
              activityId: data.activityId
            })
            .request((response) => {
              if(response.data.code != 0) {
                this.$message({
                  message: response.data.message,
                  type: 'error'
                });
                return;
              }
              this.$message({
                type: 'success',
                message: '活动发布成功!'
              });
              this.findByPage();
              this.activity.dialogVisible = false;
            }, (err) => {});
        }).catch(() => {});
      },
      deleteActivity(data) {
        this.$confirm('提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger",
          message: "是否要删除\"" + data.title + "\"？删除活动将不可恢复并且活动会立即失效。"
        }).then(() => {
          this.http.delete(this).url(this.config.softWear.activities_delete).restful({
              activityId: data.activityId
            })
            .request((response) => {
              if(response.data.code != 0) {
                this.$message({
                  message: response.data.message,
                  type: 'error'
                });
                return;
              }
              this.$message({
                type: 'success',
                message: '活动删除成功!'
              });
              this.findByPage();
              this.activity.dialogVisible = false;
            }, (err) => {});
        }).catch(() => {});
      },
      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          if (response.data.code == 0) {
            uploader.initUpload(response.data.data, "uploadCoverBtn" + this.activityStatus, (url) => {
              this.uploading = false;
              this.activity.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });

            uploader.initUpload(response.data.data, "uploadCover" + this.activityStatus, (url) => {
              this.uploading = false;
              this.activity.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });

            this.token = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      showAddActivity() {
        if (!this.token) {
          this.getUploadTokenInitUploadBtn();
        }
        this.reset();
        this.dialogTitle = "新增活动";
        this.activity.dialogVisible = true;
      },
      showHouse() {
        this.houseVisible = true;
        this.houseQueryList.houseName = '';
        this.houseQueryList.provinceCode = '';
        this.houseQueryList.cityCode = '';
        this.houseQueryList.countyCode = '';
        this.searchHouse();
      },

      citySearch() {
        this.houseQueryList.pageIndex = 1;
        this.citys = [];
        this.houseQueryList.cityCode = '';
        this.areas = [];
        this.houseQueryList.countyCode = '';
        if (this.houseQueryList.provinceCode) {
          this.loadCity(this.houseQueryList.provinceCode);
        }
        this.findHouse();
      },

       areaSearch() {
        this.areas = [];
        this.houseQueryList.countyCode = '';
        if(this.houseQueryList.cityCode){
          this.loadArea(this.houseQueryList.cityCode);
        }
        this.findHouse();
      },

      searchHouse() {
        this.houseQueryList.pageIndex = 1;
        this.findHouse();
      },
      houseHandleSizeChange(val) {
        this.houseQueryList.pageSize = val;
        this.findHouse();
      },
      houseHandleCurrentChange(val) {
        this.houseQueryList.pageIndex = val;
        this.findHouse();
      },
      findHouse() {
        this.houseQueryList.loading = true;
        this.http.get(this).url(this.config.softWear.house_list).params(this.houseQueryList).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.houseData = data;
            this.houseQueryList.total = response.data.data.totalSize;
            this.houseQueryList.loading = false;
            this.$nextTick(() => {
              this.houseData.forEach((item) => {
                if (this.isHouseSelected(item)) {
                  this.$refs.houseTable.toggleRowSelection(item);
                }
              });
            })
          },(error) => {console.log(error)});
      },
      isHouseSelected(house) {
        for (let relation of this.activity.activityHouseRelations) {
          if (relation.houseId === house.houseId) {
            return true;
          }
        }
        return false;
      },
      handleHouseSelectionChange(val) {
        this.tempSelectedHouse = val;
      },
      comfirmSelectedHouse() {
        var houseRelations = this.activity.activityHouseRelations;
        if (this.tempSelectedHouse && this.tempSelectedHouse.length > 0) {
          this.tempSelectedHouse.forEach((item) => {
            if (!this.containHouse(houseRelations, item)) {
              houseRelations.push({houseId:item.houseId, house:item});
            }
          });
        }
        this.houseVisible = false;
      },
      containHouse(houseRelations, house) {
        for (let relation of houseRelations) {
          if (relation.houseId === house.houseId) {
            return true;
          }
        }
        return false;
      },
      onDeleteHouse(val) {
        this.tempDeleteHouse = val;
      },
      deleteHouse() {
        var relations = this.activity.activityHouseRelations;
        this.tempDeleteHouse.forEach((item) => {
          let index = relations.indexOf(item);
          relations.splice(index, 1);
        });
      },
      showCoupon() {
        this.couponVisible = true;
        this.couponQueryList.name = '';
        this.searchCoupon();
      },
      searchCoupon() {
        this.couponQueryList.pageIndex = 1;
        this.findCoupon();
      },
      couponHandleSizeChange(val) {
        this.couponQueryList.pageSize = val;
        this.findCoupon();
      },
      couponHandleCurrentChange(val) {
        this.couponQueryList.pageIndex = val;
        this.findCoupon();
      },
      findCoupon() {
        this.couponQueryList.loading = true;
        this.http.get(this).url(this.config.coupon.list_url).params(this.couponQueryList).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.couponData = data;
            this.couponQueryList.total = response.data.data.totalSize;
            this.couponQueryList.loading = false;
            this.$nextTick(() => {
              this.couponData.forEach((item) => {
                if (this.isCouponSelected(item)) {
                  this.$refs.couponTable.toggleRowSelection(item);
                }
              });
            });
          },(error) => {console.log(error)});
      },
      isCouponSelected(coupon) {
        for (let relation of this.activity.activityCouponRelations) {
          if (relation.couponId === coupon.couponId) {
            return true;
          }
        }
        return false;
      },
      handleCouponSelectionChange(val) {
        this.tempSelectedCoupon = val;
      },
      comfirmSelectedCoupon() {
        var couponRelations = this.activity.activityCouponRelations;
        if (this.tempSelectedCoupon && this.tempSelectedCoupon.length > 0) {
          this.tempSelectedCoupon.forEach((item) => {
            if (!this.containCoupon(couponRelations, item)) {
              couponRelations.push({couponId:item.couponId, coupon:item});
            }
          });
        }
        this.couponVisible = false;
      },
      containCoupon(couponRelations, coupon) {
        for (let relation of couponRelations) {
          if (relation.couponId === coupon.couponId) {
            return true;
          }
        }
        return false;
      },
      onDeleteCoupon(val) {
        this.tempDeleteCoupon = val;
      },
      deleteCoupon() {
        var relations = this.activity.activityCouponRelations;
        this.tempDeleteCoupon.forEach((item) => {
          let index = relations.indexOf(item);
          relations.splice(index, 1);
        });
      },
      doSave() {
        if(!this.activity.title || !this.activity.title.trim()){
          this.$message({type: 'warning', message: '活动标题不能为空' });
          return false;
        }

        if(!this.activity.cover || !this.activity.cover.trim()){
          this.$message({type: 'warning', message: '活动封面不能为空' });
          return false;
        }

        if(!this.activity.url || !this.activity.url.trim()){
          this.$message({type: 'warning', message: '活动链接不能为空' });
          return false;
        }

        if(!this.activity.beginDate){
          this.$message({type: 'warning', message: '请选择活动开始日期' });
          return false;
        }

        if(!this.activity.endDate){
          this.$message({type: 'warning', message: '请选择活动结束日期' });
          return false;
        }
         
        if (typeof(this.activity.endDate ) != 'number'){
          this.activity.endDate.setHours(23, 59, 59);
        }

        this.http.postJson(this).url(this.config.softWear.activities).params(this.activity).request( (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '活动保存成功!'});
            this.findByPage();
            this.activity.dialogVisible = false;
            this.$emit("added");
          },
          (error) => {
            this.$message({type: 'success', message: '活动保存失败!'});
          }
        );
      },
      findByProvince() {
        this.http.get(this).url(this.config.area.provinces).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.provinces = response.data.data.districts[0].districts;
          },(error) => {console.log(error)}
        );
      },
      loadCity(code) {
        if (!code) {
          return;
        }
        this.http.get(this).url(this.config.area.city).params({adcode:code}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.citys = response.data.data.districts[0].districts;
          },(error) => {console.log(error)}
        );
      },
      loadArea(code) {
        if (!code) {
          return;
        }
        this.http.get(this).url(this.config.area.city).params({adcode:code}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            this.areas = response.data.data.districts[0].districts;

          },(error) => {console.log(error)}
        );
      },
      seePlanList(house){
        let params = {};
        params.pageSize = 1000;
        params.pageIndex = 1;
        params.houseId = house.houseId;
        this.http.get(this).url(this.config.softWear.house_plan).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.palnDatas = response.data.data.data;
            this.planDialog = true;
          },(error) => {console.log(error)}
        );  
      },
    }
  }
</script>

<style lang="scss">
  #activities_vue {
    .button_detail{
      svg{
        width:16px;
        height:16px;
        margin-right: 5px;
      }
    }
    .house_detail{
      .el-col{
        margin-bottom: 20px;
        .span {
          width:90px;
          text-align: right;
          font-weight:700;
          display: inline-block;
        }
      }
      .button {
        span {
          width:auto;
          text-align: right;
          font-weight:700;
          display: inline-block;
        }
      }
    }

  }
</style>
