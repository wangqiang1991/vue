<template>
  <div class="app-container calendar-list-container" style="padding-top:10px;">

    <div class="filter-container">

      <el-date-picker
        class="date_select"
        @change="listdoSearch"
        v-model="time"
        type="daterange"
        :picker-options="pickerOptions"
        placeholder="查询日期">
      </el-date-picker>  

      <el-input @keyup.enter.native="listdoSearch()" v-model="listQuery.articleTitle" style="width: 180px;margin:0 10px;" placeholder="期刊标题或编码"></el-input>   
      <el-button type="primary"   icon="search" @click="listdoSearch">筛选</el-button>
      <el-button @click="handleCreate" type="primary" icon="plus">新建推送</el-button>

    </div>

    <el-table           
      v-loading="listQuery.loading"
      element-loading-text="努力加载中..."
      :data="dataList"
      border
      style="width: 100%">

      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column width="200" align="center" label="封面">
        <template scope="scope">
          <img style="width:102.4px;height:52px;margin-top: 10px;" :src="scope.row.cover">
        </template>
      </el-table-column>

      <el-table-column label="期刊名称" align="center" >
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>



      <el-table-column align="center" label="推送描述">
        <template scope="scope">
          <span>{{scope.row.messageDesc}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="推送用户数" >
        <template scope="scope">
          <span>{{scope.row.sentCount}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="点击用户数" >
        <template scope="scope">
          <span>{{scope.row.clickCount}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="阅读用户数" >
        <template scope="scope">
          <span>{{scope.row.viewCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="推送时间" >
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>


    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="listhandleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="listhandleCurrentChange"
                     :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>

    <!-- 保存首页设置 -->
    <el-dialog title="新建期刊推送" :visible.sync="addDialogFormVisible">

      <el-form :model="form">  

        <el-form-item label="指定推送期刊">
          <el-button type="text" @click="showSelectSpace()" size="small">选择期刊</el-button>

          <el-table :data="spaceList" style="width: 100%" border>

            <el-table-column label="期刊封面"  align="center" > 
              <template scope="scope">
                <img :src="scope.row.cover" style="width:auto;height:50px;margin-top:5px;">
              </template>
            </el-table-column>

            <el-table-column label="期刊名称"  align="center" width="250">
              <template scope="scope">
                <span >{{scope.row.title}}</span>
              </template>
            </el-table-column>

            <el-table-column label="浏览量"  align="center" width="250">
              <template scope="scope">
                <span >{{scope.row.viewAmount}}</span>
              </template>
            </el-table-column>

            <el-table-column width="100px" label="操作">
              <template scope="scope">
                <el-button type="text" size="small" @click="removePlan()">移除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-form-item>
     

        <p v-show='show' style="margin-bottom:5px;margin-top:0;"><span>推送封面 </span><span style="color:#FF4949;margin-left:10px;" type="text">建议尺寸1024*520</span></p>
        <uploadImage  v-show='show' style='margin-bottom:22px;padding-left:68px;' :id="'planUpload2'" :width="275.7" :height="140" ref="planUpload" @uploadSuccess="uploadSuccess"></uploadImage>
        
        <el-form-item  v-show='show' label="推送标题">
            <el-input type="text"  maxlength="20" style="width:50%;"  placeholder="请输入推送标题" v-model="homeTop.title"></el-input>
        </el-form-item>

        <el-form-item  v-show='show' label="推送描述">
            <el-input type="textarea" :autosize="{ minRows:2, maxRows:3}"  style="width:50%;" maxlength="50"   placeholder="请输入推送描述" v-model="homeTop.description"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确定推送</el-button>
      </div>
    </el-dialog>



    <!-- 选择空间 -->
    <el-dialog title="选择推送期刊" :visible.sync="selectDialogFormVisible">

      <div class="filter-container">
        <el-input @keyup.enter.native="doSearch()" v-model="spaceListQuery.title" style="width: 200px;" class="filter-item" placeholder="期刊名称">
        </el-input>
        <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" icon="search">搜 索</el-button>
      </div>

      <div class="gc-praiselist_content_list">
        <el-table 
          v-loading="spaceListQuery.loading" 
          element-loading-text="努力加载中..." 
          ref="multipleTable" 
          :data="spaceDataList"
          border 
          style="width: 100%">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="期刊封面"
            align="center">
            <template scope="scope">
              <img :src="scope.row.cover" style="width:auto;height:50px;margin-top:5px;">
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="期刊名称">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="浏览量">
            <template scope="scope">
              <span>{{scope.row.viewAmount}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center"  width="100">
            <template scope="scope">
              <el-button type="text" @click="onSelectedSpace(scope.row)" size="small">选择</el-button>
            </template>
          </el-table-column>

        </el-table>

        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChange" :current-page="spaceListQuery.pageIndex"
          @current-change="handleCurrentChange"
                         :page-sizes="[10,15,20,30]" :page-size="spaceListQuery.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="spaceListQuery.total">
          </el-pagination>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {parseTime , toDate ,getAllDate,setLastDay} from '@/utils'
  import uploader from "../../utils/uploader"
  import {Loading} from 'element-ui'
  import uploadImage from '@/components/Upload/index'
  export default {
    components:{
      uploadImage:uploadImage
    },
    mounted: function () {
      this.initDate();
    },
    data() {
      return {
        addDialogFormVisible: false,
        selectDialogFormVisible: false,
        time:null,
        beginDate:null,
        endDate:null,
        title: "",
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          articleTitle: ""
        },
        spaceListQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          title: ""
        },
        spaceDataList: [],
        dataList: [],
        homeTop: {
          messageType: 2,
          cover:"",
          objectId:null,
          title:'',
          goodsNumber:'',
          description:''
        },
        show:false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= ( Date.now() - 8.64e6 );
          }
        },
        spaceList: []
      }
    },
    methods: {
      initDate() {
        this.time = [];
        let date = new Date();
        let endDate = date.setHours(23,59,59);

        let date1 = new Date();
        let beginDate = new Date(date1.setDate(1)).setHours(0,0,0);

        this.time[0] = beginDate;
        this.time[1] = endDate;

        this.beginDate = toDate(beginDate);
        this.endDate = toDate(endDate);
        let defaultTime = this.beginDate.split(" ")[0] + " - " + this.endDate.split(" ")[0];
        setTimeout(()=>{
          $(".date_select>input").val(defaultTime)
        },200);

        this.findAll();
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
      uploadSuccess(data) {
        this.homeTop.cover = data.cover;
      },

      listhandleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.findAll();
      },
      listhandleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        this.findAll();
      },
      listdoSearch() {
        this.listQuery.pageIndex = 1;
        this.findAll();
      },
      findAll() {
        this.listQuery.loading = true;

        let time = this.getSelectTime();
        let params = {};
        params.beginDate = time.beginDate;
        params.endDate = time.endDate;
        params.pageSize = this.listQuery.pageSize;
        params.pageIndex = this.listQuery.pageIndex;
        params.articleTitle = this.listQuery.articleTitle;

        this.http.get(this).url(this.config.propel.subject_list).params(params).request(function (response) {
          this.listQuery.loading = false;
          if (response.data.code == 0) {
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },

      handleCreate() {
        this.reset();

        this.addDialogFormVisible = true;

      },

      showSelectSpace() {
        this.selectDialogFormVisible = true;
        this.spaceListQuery.title = '';
        this.doSearch();
      },
      /*选择期刊*/
      onSelectedSpace(item) {
        this.show = true;
        this.selectDialogFormVisible = false;
        this.homeTop.objectId = item.subjectArticleId;
        this.homeTop.title = item.title;
        this.homeTop.description = item.description;
        this.homeTop.cover = item.cover;
        this.homeTop.viewAmount = item.viewAmount;
        //this.$refs.planUpload.setImage(item.cover); 

        setTimeout(()=>{
          this.$refs.planUpload.initUploadBtn(item.cover);  
        },50)

        let obj = $.extend({},this.homeTop);
        this.spaceList = []; 
        this.spaceList.push(obj);
        // this.homeTop.title = '';   
        // this.homeTop.description = '';
      },
      removePlan() {
        this.homeTop.objectId = null;
        this.spaceList = [];
      },

      reset() {
        this.homeTop =  {
          messageType: 2,
          cover:"",
          objectId:null,
          title:'',
          goodsNumber:'',
          description:''
        };
        this.show = false;
        this.spaceList = [];
      },
      handleSizeChange(val) {
        this.spaceListQuery.pageSize = val;
        this.findByPage();
      },
      handleCurrentChange(val) {
        this.spaceListQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.spaceListQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage() {
        this.spaceListQuery.loading = true;
        var params = {};
        params.pageSize = this.spaceListQuery.pageSize;
        params.pageIndex = this.spaceListQuery.pageIndex;
        params.title = this.spaceListQuery.title;
        params.status = 1;
        this.http.get(this).url(this.config.subject.list_url).params(params).request(function(response) {
          this.spaceListQuery.loading = false;
          if(response.data.code == 0){
            this.spaceDataList = response.data.data.data;
            this.spaceListQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.spaceListQuery.loading = false;
          this.$message.error(error);
        });
      },

      save() {

        if (!this.homeTop.objectId || !this.homeTop.objectId.trim()) {
          this.$message({type: 'warning',message: '请指定推送期刊'});
          return;
        }

        if (!this.homeTop.cover || !this.homeTop.cover.trim()) {
          this.$message({type: 'warning',message: '请上传封面'});
          return;
        }

        if (!this.homeTop.title || !this.homeTop.title.trim()) {
          this.$message({type: 'warning',message: '请输入推送标题'});
          return;
        }

        if (!this.homeTop.description || !this.homeTop.description.trim()) {
          this.$message({type: 'warning',message: '请输入推送描述'});
          return;
        }

        console.log(this.homeTop)
        let params = {};
        params.messageType = this.homeTop.messageType;
        params.objectId = this.homeTop.objectId;
        params.messageCover = this.homeTop.cover;
        params.messageTitle = this.homeTop.title;
        params.messageDesc = this.homeTop.description;
        var loadingInstance = Loading.service({text: '数据提交中...'});

        this.http.postJson(this).url(this.config.propel.save_url).params(params).request(function (response) {
          loadingInstance.close();
          if (response.data.code == 0) {
            this.$message({message: '推送成功', type: 'success'});
            this.reset();
            this.findAll();
            this.addDialogFormVisible = false;
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
