<template>   
  <div class="app-container calendar-list-container" id="homeBnaner_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.title" style="width: 150px !important;" class="filter-item" placeholder="banner名称">
            </el-input>

            <el-select @change="doSearch" clearable style="width: 150px" class="filter-item" v-model="listQuery.type" placeholder="banner类型">
              <el-option
                v-for="item in bannerType"
                :key="item.type"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>

            <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
            <el-button @click="addBnaner" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="plus">新增</el-button>

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
            label="banner封面"
            align="center">
            <template scope="scope">
                <img :src="scope.row.cover" style="width:auto;height:54.6px;margin-top:6px;" >
            </template>
          </el-table-column>

          <el-table-column
            label="banner名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="banner类型"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.type == 1">期刊</span>
              <span v-if="scope.row.type == 2">商品</span>
              <span v-if="scope.row.type == 3">空间搭配</span>
              <span v-if="scope.row.type == 4">软装方案</span>
              <span v-if="scope.row.type == 5">活动</span>
              <span v-if="scope.row.type == 6">第三方链接</span>
              <span v-if="scope.row.type == 7">H5网页</span>
            
            </template>
          </el-table-column>

          <el-table-column
            label="banner状态"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.status == 1">未发布</span>
              <span v-if="scope.row.status == 2">已发布</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
              <el-button class="fontFamily icon-browse" type="primary" @click="seeBannerDetail(scope.row)" size="small">查看详情</el-button>
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

      <!-- 添加或者保存首页推荐数据 -->
    <el-dialog :title="title" :visible.sync="bannerDialogVisible">

      <div class="banner_detail">
        <el-row :gutter="24">

          <el-col :span="12">
            <span>banner名称:</span>
            <el-input type="text" v-model="banner.title" :disabled="edit && (status == 2)" style="width:70%;" placeholder="请输入banner名称" maxlength="50"> </el-input>
          </el-col>

          <el-col :span="12">
            <span>banner类型:</span>
            <el-select clearable class="filter-item" :disabled="edit" v-model="banner.type" @change="typeChange" placeholder="请选择banner类型:">
              <el-option
                v-for="item in bannerType"
                :key="item.type"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </el-col>
          
          <el-col :span="12">
            <span>banner封面:</span><span style="color:#FF4949;width:auto;" type="text">建议尺寸为1024*546</span>
             
            <div v-show="banner.cover && !uploading" class="el-upload el-upload--picture-card" style="display:block;margin-left:90px;margin-top:10px;">
              <img v-show="edit && (status == 2)"  title="点击修改图片" style="width:100%; height:100%" :src="banner.cover+'?imageView2/1/w/750/h/256'">
              <img v-show="(status == 1) || !edit" :id="'uploadCover'+status" title="点击修改图片" style="width:100%; height:100%" :src="banner.cover+'?imageView2/1/w/750/h/256'">
            </div>

            <div v-show="!banner.cover && !uploading" style="display:block;margin-left:90px;margin-top:10px;">
              <div class="el-upload el-upload--picture-card" :id="'uploadCoverBtn'+status">
                <i data-v-5b37d0d4="" class="el-icon-plus"></i>
              </div>
            </div> 


          </el-col>  

          <el-col :span="12">
            <span style="float:left; margin-right:5px;">banner描述:</span>
            <el-input type="textarea" :rows="3" :disabled="edit && (status == 2)" v-model="banner.description" style="width:70%;" placeholder="请输入banner描述" maxlength="100"> </el-input>
          </el-col>

        </el-row>

        <!-- 期刊选择 -->
        <el-row :gutter="24" v-if="banner.type == 1">
          <el-col :span="24" v-show="(status == 1) || !edit">
            <span style="margin-right:5px;">指定期刊:</span> 
            <el-button class="filter-item" type="text" @click="subjectVisible = true;">点击选择期刊</el-button>
          </el-col>

          <el-col :span="24"  v-if="currentBanner.title">
            <span style="margin-right:5px;">期刊标题:</span> 
            <b style="color:#343434;">{{currentBanner.title}}</b>
          </el-col>

          <el-col :span="24" v-if="currentBanner.cover">
            <span style="margin-right:10px;float:left;">期刊封面:</span> 
            <img :src="currentBanner.cover" style="width:256px;height:130px;">
          </el-col>

        </el-row>

        <!-- 期刊选择 -->
        <el-row :gutter="24" v-if="banner.type == 2">
          <el-col :span="24" v-show="(status == 1) || !edit">
            <span style="margin-right:5px;">指定商品:</span> 
            <el-button class="filter-item" type="text" @click="goodsVisible = true;">点击选择商品</el-button>
          </el-col>

          <el-col :span="24"  v-if="currentBanner.title">
            <span style="margin-right:5px;">商品名称:</span> 
            <b style="color:#343434;">{{currentBanner.title}}</b>
          </el-col>

          <el-col :span="24" v-if="currentBanner.cover">
            <span style="margin-right:10px;float:left;">商品封面:</span> 
            <img :src="currentBanner.cover" style="width:100px;height:100px;">
          </el-col>

        </el-row>

        <!-- 空间选择 -->
        <el-row :gutter="24" v-if="banner.type == 3">
          <el-col :span="24" v-show="(status == 1) || !edit">
            <span style="margin-right:5px;">指定空间:</span> 
            <el-button class="filter-item" type="text" @click="spaceVisible = true;">点击选择空间</el-button>
          </el-col>

          <el-col :span="24"  v-if="currentBanner.title">
            <span style="margin-right:5px;">空间名称:</span> 
            <b style="color:#343434;">{{currentBanner.title}}</b>
          </el-col>

          <el-col :span="24" v-if="currentBanner.cover">
            <span style="margin-right:10px;float:left;">空间封面:</span> 
            <img :src="currentBanner.cover" style="width:256px;height:152.75px;">
          </el-col>

        </el-row>

          <!-- 软装方案选择 -->
        <el-row :gutter="24" v-if="banner.type == 4">
          <el-col :span="24" v-show="(status == 1) || !edit">
            <span style="margin-right:5px;">指定软装方案:</span> 
            <el-button class="filter-item" type="text" @click="planVisible = true;">点击选择软装方案</el-button>
          </el-col>

          <el-col :span="24"  v-if="currentBanner.title">
            <span style="margin-right:5px;">方案名称:</span> 
            <b style="color:#343434;">{{currentBanner.title}}</b>
          </el-col>

          <el-col :span="24" v-if="currentBanner.cover">
            <span style="margin-right:10px;float:left;">方案封面:</span> 
            <img :src="currentBanner.cover" style="width:100px;height:auto;">
          </el-col>

        </el-row>

            <!-- 软装活动 -->
        <el-row :gutter="24" v-if="banner.type == 5">
          <el-col :span="24" v-show="(status == 1) || !edit">
            <span style="margin-right:5px;">指定活动:</span> 
            <el-button class="filter-item" type="text" @click="activeVisible = true;">点击选择活动</el-button>
          </el-col>

          <el-col :span="24"  v-if="currentBanner.title">
            <span style="margin-right:5px;">活动名称:</span> 
            <b style="color:#343434;">{{currentBanner.title}}</b>
          </el-col>

          <el-col :span="24" v-if="currentBanner.cover">
            <span style="margin-right:10px;float:left;">活动封面:</span> 
            <img :src="currentBanner.cover" style="width:100px;height:auto;">
          </el-col>

        </el-row>

         <!-- 链接地址 -->
         <el-row :gutter="24" v-if="banner.type == 6">
          <el-col :span="24">
            <span style="margin-right:5px;">链接地址:</span> 
            <el-input type="text" :disabled="edit && (status == 2)"  v-model="currentBanner.url"  style="width:70%;" placeholder="请输入第三方链接URL" maxlength="255"> </el-input>
          </el-col>

        </el-row>

        <!-- H5页面 -->
         <el-row :gutter="24" v-if="banner.type == 7">
          <el-col :span="24">
            <span style="margin-right:5px;">H5页面:</span> 
            <el-button class="filter-item" type="text" @click="editDetailInfo">编辑活动内容</el-button>
          </el-col>

        </el-row>



      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="bannerDialogVisible = false">取 消</el-button>
        
        <el-button v-if=" edit  && banner.status === 1 "  type="success" @click="publish(banner)">保存并发布</el-button>

        <el-button v-if="edit && banner.status === 2  "  type="danger" @click="cancelPublish(banner)">取消发布</el-button>

        <el-button v-if="!(edit && (status == 2))" @click="comfirmAddBanner(false,null)" type="primary">{{ edit ? "修 改" : "新 增"}}</el-button>
      </div>

    </el-dialog>


    <!-- 选择期刊 -->
    <el-dialog title="期刊选择" :visible.sync="subjectVisible">

      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-input @keyup.enter.native="subjectdoSearch()" v-model="subjectlistQuery.title" style="width: 200px !important;" class="filter-item" placeholder="输入文章名称"></el-input>
            <el-button @click="subjectdoSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table  :data="subjectData" border style="width: 100%;margin-top:15px;">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column align="center" label="文章名称">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="文章封面" vertical="middle" >
            <template scope="scope">
              <img style="width:90px;height:50px;margin-top:5px;" :src="scope.row.cover+'?imageView2/1/w/498/h/276'" class="gc_praiselist_list_img">
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="120">
            <template scope="scope">
              <el-button size="small"  @click="comfirmChoiceSubject(scope.row)" type="text">选择</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination 
          @size-change="subjecthandleSizeChange" 
          @current-change="subjecthandleCurrentChange" 
          :page-sizes="[10,15,20,30]" 
          :current-page="subjectlistQuery.pageIndex"
          :page-size="subjectlistQuery.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="subjectlistQuery.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="subjectVisible = false">取 消</el-button>
      </div>

    </el-dialog>


        <!-- 选择商品 -->
    <el-dialog title="商品选择" :visible.sync="goodsVisible">

      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-input @keyup.enter.native="goodsdoSearch()" v-model="goodslistQuery.keyword" style="width: 200px !important;" class="filter-item" placeholder="输入商品名称或编码"></el-input>
            <el-button @click="goodsdoSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table  :data="goodsData" border style="width: 100%;margin-top:15px;">

           <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="商品封面"
            align="center"
            vertical="middle"
            >
            <template scope="scope">
              <span v-if="!scope.row.cover" style="color:orangered">未编辑封面</span>
              <img v-else style="width:50px;height:50px;margin-top:6px;" :src="scope.row.cover+config.imgtmb._200"
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

          <el-table-column label="操作" align="center" width="120">
            <template scope="scope">
              <el-button size="small"  @click="comfirmChoiceGoods(scope.row)" type="text">选择</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination 
          @size-change="goodshandleSizeChange" 
          @current-change="goodshandleCurrentChange" 
          :current-page="goodslistQuery.pageIndex"
          :page-sizes="[10,15,20,30]" 
          :page-size="goodslistQuery.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="goodslistQuery.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsVisible = false">取 消</el-button>
      </div>

    </el-dialog>



          <!-- 选择空间 -->
    <el-dialog title="空间选择" :visible.sync="spaceVisible">

      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-input @keyup.enter.native="spacedoSearch()" v-model="spacelistQuery.name" style="width: 200px !important;" class="filter-item" placeholder="输入空间名称"></el-input>
            <el-button @click="spacedoSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table  :data="spaceData" border style="width: 100%;margin-top:15px;">

           <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column prop="goods" label="空间封面" align="center" vertical="middle" width="120">
            <template scope="scope">
              <img style="width:50px;height:50px;margin-top:6px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
            </template>
          </el-table-column>

          <el-table-column prop="name" label="空间名称">
            <template scope="scope">
              <span >{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="120">
            <template scope="scope">
              <el-button size="small"  @click="comfirmChoiceSpace(scope.row)" type="text">选择</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination 
          @size-change="spacehandleSizeChange" 
          @current-change="spacehandleCurrentChange" 
          :current-page="spacelistQuery.pageIndex"
          :page-sizes="[10,15,20,30]" 
          :page-size="spacelistQuery.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="spacelistQuery.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="spaceVisible = false">取 消</el-button>
      </div>

    </el-dialog>


           <!-- 选择方案 -->
    <el-dialog title="方案选择" :visible.sync="planVisible">

      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-input @keyup.enter.native="plandoSearch()" v-model="planlistQuery.planName" style="width: 200px !important;" class="filter-item" placeholder="输入方案名称"></el-input>
            <el-button @click="plandoSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table  :data="planData" border style="width: 100%;margin-top:15px;">

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

          <el-table-column label="操作" align="center" width="120">
            <template scope="scope">
              <el-button size="small"  @click="comfirmChoicePlan(scope.row)" type="text">选择</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination 
          @size-change="planhandleSizeChange" 
          @current-change="planhandleCurrentChange" 
          :current-page="planlistQuery.pageIndex"
          :page-sizes="[10,15,20,30]" 
          :page-size="planlistQuery.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="planlistQuery.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="planVisible = false">取 消</el-button>
      </div>

    </el-dialog>


             <!-- 选择活动 -->
    <el-dialog title="方案选择" :visible.sync="activeVisible">

      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-input @keyup.enter.native="activedoSearch()" v-model="activelistQuery.title" style="width: 200px !important;" class="filter-item" placeholder="输入方案名称"></el-input>
            <el-button @click="activedoSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table  :data="activeData" border style="width: 100%;margin-top:15px;">

         <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="活动封面"
            width="150"
            align="center">
            <template scope="scope">
              <img :src="scope.row.cover" style="width:100px;height:auto;margin-top:5px;">
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="活动标题">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="120">
            <template scope="scope">
              <el-button size="small"  @click="comfirmChoiceActive(scope.row)" type="text">选择</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination 
          @size-change="activehandleSizeChange" 
          @current-change="activehandleCurrentChange" 
          :current-page="activelistQuery.pageIndex"
          :page-sizes="[10,15,20,30]" 
          :page-size="activelistQuery.pageSize" 
          layout="total, sizes, prev, pager, next, jumper" 
          :total="activelistQuery.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="activeVisible = false">取 消</el-button>
      </div>

    </el-dialog>




  </div>
</template>

<script>

  import uploader from '@/utils/uploader'
  import { Loading } from 'element-ui'

  export default{
    props:['status'],
    data() {
      return {
        bannerType:[{type:1,name:"期刊"},{type:2,name:"商品"},{type:3,name:"空间搭配"},{type:4,name:"软装方案"},{type:5,name:"活动"},{type:6,name:"第三方链接"},{type:7,name:"H5网页"}],
        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          title: "",
          type:null
        },

        subjectVisible:false,
        subjectData:[],
        subjectlistQuery: {
          title: "",
          pageIndex: 1,
          pageSize: 10,
          total: 0,
        },

        goodsVisible:false,
        goodsData:[],
        goodslistQuery: {
          keyword: "",
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          goodsStatus: 3
        },

        spaceVisible:false,
        spaceData:[],
        spacelistQuery: {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          name: "",
        },

        planVisible:false,
        planData:[],
        planlistQuery: {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          planName: "",
        },

        activeVisible:false,
        activeData:[],
        activelistQuery: {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          activityStatus: 2,
          title: "",
        },

        banner:{
          bannerId:null,
          title:'',
          cover:'',
          type:null,
          detailId:null,
          description:'',
          url:'http://'
        },
        currentBanner:{
          title:'',
          cover:'',
          id:'',
          url:'http://'
        },
        edit:false,
        bannerDialogVisible:false,
        title:'',
        percentage:0,
        uploading:false,
        token: null,
        initUpload:false,
      }
    },
    mounted() {
      console.log(this.status)
      this.findByPage();
      this.findBysubject();
      this.findBygoods();
      this.findBySpace();
      this.findByPlan();
      this.findByactive();
    },
    methods:{
      typeChange() {
        if (!this.edit) {
          this.currentBanner = {
            title:'',
            cover:'',
            id:'',
            url:'http://'
          };
        }
      },
      reset() {
        this.banner = {
          bannerId:null,
          title:'',
          cover:'',
          type:null,
          detailId:null,
          description:'',
          url:'http://'
        };
        this.currentBanner = {
          title:'',
          cover:'',
          id:'',
          url:'http://'
        };
      },
      checkFrom() {
         if (!this.banner.title || !this.banner.title.trim()) {
          this.$message({message: '活动标题不能为空', type: 'warning'});
          return false;
        }

        if (!this.banner.type) {
          this.$message({message: '请选择活动类型', type: 'warning'});
          return false;
        }

        if (!this.banner.cover || !this.banner.cover.trim()) {
          this.$message({message: '请上传活动封面', type: 'warning'});
          return false;
        }

        if (this.banner.type == 1) {
          if (!this.currentBanner.id) {
            this.$message({message: '请选择期刊', type: 'warning'});
            return false;
          }
        }

        if (this.banner.type == 2) {
          if (!this.currentBanner.id) {
            this.$message({message: '请选择商品', type: 'warning'});
            return false;
          }
        }

        if (this.banner.type == 3) {
          if (!this.currentBanner.id) {
            this.$message({message: '请选择空间', type: 'warning'});
            return false;
          }
        }

        if (this.banner.type == 4) {
          if (!this.currentBanner.id) {
            this.$message({message: '请选择方案', type: 'warning'});
            return false;
          }
        }

        if (this.banner.type == 5) {
          if (!this.currentBanner.id) {
            this.$message({message: '请选择活动', type: 'warning'});
            return false;
          }
        }

        if (this.banner.type == 6) {
          if (!this.currentBanner.url  || !this.banner.url.trim()) {
            this.$message({message: '链接地址不能为空', type: 'warning'});
            return false;
          }
        }

        if (this.banner.type == 7) {
          if (!this.currentBanner.id) {
            this.$message({message: '请编辑活动详情', type: 'warning'});
            return false;
          }
        }

        return true;
      },
      comfirmAddBanner(type,item) {
        if (this.checkFrom()) {

          let params = {};
          params.bannerId = this.banner.bannerId;
          params.title = this.banner.title;
          params.cover = this.banner.cover;
          params.type = this.banner.type;
          params.description = this.banner.description;
          
          if (this.banner.type == 6) {
            params.detailId = null;
            params.url = this.currentBanner.url;
          } else {
            params.detailId = this.currentBanner.id;
            params.url = null;
          }
          

          this.http.postJson(this).url(this.config.banner.save_banner).params(params).request(function (response) {
           if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            
            if (type) {
              this.submitPublish(item);
            } else {
              this.$message({type: 'success', message: 'banner保存成功!'});
              this.findByPage();
              this.bannerDialogVisible = false;
            }
            
            this.$emit('success');
          
            },(error) =>{ console.log(error)}
          );
        }
      },
      addBnaner() {
        this.reset();
        this.edit = false;
        this.bannerDialogVisible = true;
        this.title = '新增banner';
        this.getUploadTokenInitUploadBtn();
      },
      seeBannerDetail(data) {
        this.reset();
        this.edit = true;
        this.title = 'banner详情';
        this.loadDetail(data.bannerId);
      },
      loadData() {
        this.findByPage();
      },
      loadDetail(bannerId) {
        this.http.get(this).url(this.config.banner.banner_detail).restful({bannerId:bannerId}).request(function (response) {
           if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            let data = response.data.data;
        
            this.banner = data;

            if (data.type == 1) {
              this.currentBanner.title = data.detail.title;
              this.currentBanner.cover = data.detail.cover;
              this.currentBanner.id = data.detail.subjectArticleId;
              this.currentBanner.url = 'http://';
            }
            if (data.type == 2) {
              this.currentBanner.title = data.detail.title;
              this.currentBanner.cover = data.detail.cover;
              this.currentBanner.id = data.detail.goodsId;
              this.currentBanner.url = 'http://';
            }
            if (data.type == 3) {
              this.currentBanner.title = data.detail.name;
              this.currentBanner.cover = data.detail.cover;
              this.currentBanner.id = data.detail.spaceId;
              this.currentBanner.url = 'http://';
            }
            if (data.type == 4) {
              this.currentBanner.title = data.detail.planName;
              this.currentBanner.cover = data.detail.cover;
              this.currentBanner.id = data.detail.planId;
              this.currentBanner.url = 'http://';
            }
            if (data.type == 5) {
              this.currentBanner.title = data.detail.title;
              this.currentBanner.cover = data.detail.cover;
              this.currentBanner.id = data.detail.activityId;
              this.currentBanner.url = 'http://';
            }
            if (data.type == 6) {
              this.currentBanner.title ='';
              this.currentBanner.cover ='';
              this.currentBanner.id = '';
              this.currentBanner.url = data.url;
            }

            if (data.type == 7) {
               this.currentBanner.title ='';
              this.currentBanner.cover ='';
              this.currentBanner.id = data.detailId;
              this.currentBanner.url = 'http://';
            }

            this.bannerDialogVisible = true;
            this.getUploadTokenInitUploadBtn();

            },(error) =>{ console.log(error)}
          );
      },
      editDetailInfo() {
        if (!this.currentBanner.id) {
          let params = {
            title:"活动详情",
            type:1
          };
          this.http.postJson(this).url(this.config.articles.save_url).params(params).request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.currentBanner.id = response.data.data.articleId;
              window.open("/editor/editor.html?articleId=" + this.currentBanner.id, "_blank");
            },(error) => {}
          );
        } else {
          window.open("/editor/editor.html?articleId=" + this.currentBanner.id, "_blank");
        }
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
        if (this.listQuery.type == '') {
          this.listQuery.type == null;
        }
        this.listQuery.loading = true;
        this.listQuery.status = this.status;

        this.http.get(this).url(this.config.banner.banner_list_url).params(this.listQuery).request((response) => {
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

      comfirmChoiceSubject(data) {
         this.currentBanner = {
          title:data.title,
          cover:data.cover,
          id:data.subjectArticleId,
          url:''
        };
        this.subjectVisible = false;
      },
      subjecthandleSizeChange(val) {
        this.subjectlistQuery.pageSize = val;
        this.findBysubject();
      },
      subjecthandleCurrentChange(val) {
        this.subjectlistQuery.pageIndex = val;
        this.findBysubject();
      },
      subjectdoSearch() {
        this.subjectlistQuery.pageIndex = 1;
        this.findBysubject();
      },
      findBysubject() {
        this.http.get(this).url(this.config.subject.list_url).params(this.subjectlistQuery).request(
          (response) => {
            if(response.data.code != 0) {
              this.$message({
                message: response.data.message ? response.data.message : "系统错误",
                type: 'error'
              });
              return;
            }
            this.subjectData = response.data.data.data;
            this.subjectlistQuery.total = response.data.data.totalSize;
          },(error) => {console.log(error)}
        );
      },


      comfirmChoiceGoods(data) {
         this.currentBanner = {
          title:data.title,
          cover:data.cover,
          id:data.goodsId,
          url:''
        };
        this.goodsVisible = false;
      },
      goodshandleSizeChange(val) {
        this.goodslistQuery.pageSize = val;
        this.findBygoods();
      },
      goodshandleCurrentChange(val) {
        this.goodslistQuery.pageIndex = val;
        this.findBygoods();
      },
      goodsdoSearch() {
        this.goodslistQuery.pageIndex = 1;
        this.findBygoods();
      },
      findBygoods() {
       this.http.get(this).url(this.config.goods.list_url_v2).params(this.goodslistQuery).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            
            this.goodsData = response.data.data.data;
            this.goodslistQuery.total = response.data.data.totalSize;
            
          }, (error) => {console.log(error)}
        );
      },


      comfirmChoiceSpace(data) {
         this.currentBanner = {
          title:data.name,
          cover:data.cover,
          id:data.spaceId,
          url:''
        };
        this.spaceVisible = false;
      },
      spacehandleSizeChange(val) {
        this.spacelistQuery.pageSize = val;
        this.findBySpace();
      },
      spacehandleCurrentChange(val) {
        this.spacelistQuery.pageIndex = val;
        this.findBySpace();
      },
      spacedoSearch() {
        this.spacelistQuery.pageIndex = 1;
        this.findBySpace();
      },
      findBySpace() {
        this.http.get(this).url(this.config.space.list_url).params(this.spacelistQuery).request(function(response) {
          if(response.data.code == 0) {
            this.spaceData = response.data.data.data;
            this.spacelistQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.$message.error(error);
        });
      },


      comfirmChoicePlan(data) {
         this.currentBanner = {
          title:data.planName,
          cover:data.cover,
          id:data.planId,
          url:''
        };
        this.planVisible = false;
      },
      planhandleSizeChange(val) {
        this.planlistQuery.pageSize = val;
        this.findByPlan();
      },
      planhandleCurrentChange(val) {
        this.planlistQuery.pageIndex = val;
        this.findByPlan();
      },
      plandoSearch() {
        this.planlistQuery.pageIndex = 1;
        this.findByPlan();
      },
      findByPlan() {

        this.http.get(this).url(this.config.softWear.plan_list).params(this.planlistQuery).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.planData = data;
            this.planlistQuery.total = response.data.data.totalSize;
            
          },(error) => {console.log(error)}
        );
      },

      comfirmChoiceActive(data) {
         this.currentBanner = {
          title:data.title,
          cover:data.cover,
          id:data.activityId,
          url:''
        };
        this.activeVisible = false;
      },
      activehandleSizeChange(val) {
        this.activelistQuery.pageSize = val;
        this.findByactive();
      },
      activehandleCurrentChange(val) {
        this.activelistQuery.pageIndex = val;
        this.findByactive();
      },
      activedoSearch() {
        this.activelistQuery.pageIndex = 1;
        this.findByactive();
      },
      findByactive(){
        this.http.get(this).url(this.config.softWear.activities).params(this.activelistQuery).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.activeData = data;
            this.activelistQuery.total = response.data.data.totalSize;
            
          },(error) => {console.log(error)}
        );
      },

      getUploadTokenInitUploadBtn() {
        if (!this.initUpload ) {
          this.$nextTick(_ => {
            this.initUpload = true;
            this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
              if (response.data.code == 0) {
                uploader.initUpload(response.data.data, "uploadCover"+this.status, (url) => {
                  this.percentage = 0;
                  this.uploading = false;
                  this.banner.cover = url;
                }, (up, err, errTip) => {
                  console.log(errTip)
                },(up, file) => {
                  console.log("percent is :" + file.percent);
                  this.percentage = file.percent;
                }, (up, files) => {
                  this.uploading = true;
                });
                uploader.initUpload(response.data.data, "uploadCoverBtn"+this.status, (url) => {
                  this.percentage = 0;
                  this.uploading = false;
                  this.banner.cover = url;
                }, (up, err, errTip) => {
                  console.log(errTip)
                },(up, file) => {
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
         })
        }     
      },
      publish(item) {
        this.$confirm('确认发布banner活动'+item.title+'吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.comfirmAddBanner(true,item);
          //this.submitPublish(item);
        }).catch(() => {
        });
      },

      submitPublish(item) {
        var loadingInstance = Loading.service({text: '发布中...'});
        this.http.put(this).url(this.config.banner.banner_publish_url).restful({
          bannerId:item.bannerId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: 'banner活动发布成功', type: 'success'});
            this.bannerDialogVisible = false;
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }

        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

      cancelPublish(item) {
        this.$confirm('确认取消发布banner活动'+item.title+'吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitCancelPublish(item);
        }).catch(() => {
        });
      },

      submitCancelPublish(item) {
        var loadingInstance = Loading.service({text: '取消中...'});
        this.http.put(this).url(this.config.banner.banner_cancelPublish_url).restful({
          bannerId:item.bannerId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: 'banner活动已取消发布', type: 'success'});
            //this.loadDetail(item.bannerId);
            this.bannerDialogVisible = false;
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }

        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

    }
  }
</script>

<style  lang="scss">
  #homeBnaner_vue{
    .banner_detail{
      .el-col{
        margin-bottom: 20px;
        >span{
          width:90px;
          text-align: right;
          font-weight:700;
          display: inline-block;
        }
      }
      .el-upload--picture-card{
        width:256px;
        height: 136.5px;
      }  
    }
  }
</style>
