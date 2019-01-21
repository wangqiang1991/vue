<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
      <span style="color:#FF4949;margin-left: 10px;" type="text">最多添加5条</span>
    </div>

    <el-table :data="dataList" v-loading.body="listQuery.loading" border fit highlight-current-row style="width: 100%" id="spaceTable10">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column min-width="300" label="标题">
        <template scope="scope">
          <span>{{scope.row.detail.planName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="封面">
        <template scope="scope">
          <img style="width:50px;height:50px;margin-top: 10px;" :src="scope.row.cover+'?imageView2/1/w/512/h/512'" class="gc_praiselist_list_img">
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="浏览量">
        <template scope="scope">
          <span>{{scope.row.viewAmount ? scope.row.viewAmount : 0 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="delete" type="danger" @click="deleteTop(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="拖拽排序" width="95">
        <template scope="scope">
          <icon-svg class='drag-handler' icon-class="drag"></icon-svg>
        </template>
      </el-table-column>
    </el-table>


    <!-- 保存首页设置 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form :model="form">
        <p style="margin-bottom:5px;margin-top:0;">封面:<span style="color:#FF4949;" type="text">建议尺寸1024*963</span></p>
        <uploadImage :id="'planUpload'" :width="223" :height="210" ref="planUpload" @uploadSuccess="uploadSuccess"></uploadImage>
        <el-form-item label="指定软装方案">
          <el-button type="text" @click="showSelectSpace()" size="small">选择方案</el-button>
          <el-table :data="spaceList" style="width: 100%" border>

            <el-table-column label="方案名称"  align="center" width="250">
              <template scope="scope">
                <span >{{scope.row.title}}</span>
              </template>
            </el-table-column>

            <el-table-column label="方案封面"  align="center" > 
              <template scope="scope">
                <img :src="scope.row.planCover" style="width:auto;height:50px;margin-top:5px;">
              </template>
            </el-table-column>

            <el-table-column width="100px" label="操作">
              <template scope="scope">
                <el-button type="text" size="small" @click="removePlan()">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 选择空间 -->
    <el-dialog title="选择方案" :visible.sync="selectDialogFormVisible">

      <div class="filter-container">
        <el-input @keyup.enter.native="doSearch()" v-model="spaceListQuery.planName" style="width: 200px;" class="filter-item" placeholder="方案名称">
        </el-input>
        <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                   icon="search">搜 索
        </el-button>
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

          <el-table-column
            align="center"
            label="方案风格">
            <template scope="scope">
              <span>{{scope.row.style.name}}</span>
            </template>
          </el-table-column>

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
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import Sortable from 'sortablejs'
  import uploader from "../../utils/uploader";
  import uploadImage from '@/components/Upload/index'
  export default {
    directives: {
      waves
    },
    components:{
      uploadImage:uploadImage
    },
    mounted: function () {
      this.findAll();
      this.findByPage();
    },
    data() {
      return {
        addDialogFormVisible: false,
        selectDialogFormVisible: false,

        title: "",
        listQuery: {
          loading: false
        },
        spaceListQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          column: "",
          order: "",
          planName:'',
        },
        spaceDataList: [],
        dataList: [],
        olderList: [],
        newList: [],
        sortable: null,
        homeTop: {
          type: 5,
          cover: "",
          objectId:null
        },
        spaceList: []
      }
    },
    methods: {
      uploadSuccess(data) {
        this.homeTop.cover = data.cover;
      },
      findAll() {
        this.dataList = [];
        this.olderList = [];
        this.newList = [];

        this.listQuery.loading = true;
        this.http.get(this).url(config.home.home_top_plan).request(function (response) {
          this.listQuery.loading = false;
          //console.log(response);
          if (response.data.code == 0) {
            this.dataList = response.data.data;
            this.olderList = this.dataList.map(v => v.homeTopId)
            this.newList = this.olderList.slice()
            this.$nextTick(() => {
              this.setSort();
            })
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },

      setSort() {
        const el = document.querySelectorAll('#spaceTable10>.el-table__body-wrapper > table > tbody')[0];
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
            this.newList.splice(evt.newIndex, 0, tempIndex);
            //console.log(this.newList);
            this.submitSort();
          }
        });
      },
      submitSort() {
        var newIds = "";
        this.newList.forEach(function (item) {
          newIds = newIds + item + ",";
        });
        this.http.put(this).url(config.home.home_top_sort_url).params({
          homeTopIds: newIds
        }).request(function (response) {
          this.listQuery.loading = false;
          //console.log(response);
          if (response.data.code == 0) {
            this.findAll();
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },

      deleteTop(item) {
        this.$confirm('你是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitDelete(item);
        }).catch(() => {
        });
      },

      submitDelete(item) {
        var loadingInstance = Loading.service({text: '删除中...'});
        this.http.delete(this).url(config.home.home_top_delete_url).restful({
          homeTopId: item.homeTopId
        }).request(function (response) {
          loadingInstance.close();
          //console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '删除成功', type: 'success'});
            this.findAll();
          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

      handleEdit(item) {
        this.reset();
        this.title = "编辑首页软装方案";
        this.addDialogFormVisible = true;
        let data = $.extend({},item);
        this.homeTop = data;
        this.homeTop.type = 5;
        this.homeTop.title = data.detail.planName;
        this.homeTop.planCover = data.detail.cover;

        this.spaceList.push(this.homeTop);
        setTimeout(()=>{
          this.$refs.planUpload.initUploadBtn(this.homeTop.cover);  
        },50)
       
      },

      handleCreate() {
        this.reset();
        this.title = "新增首页软装方案";
        this.addDialogFormVisible = true;
        setTimeout(()=>{
          this.$refs.planUpload.initUploadBtn(this.homeTop.cover);  
        },50)
      },

      showSelectSpace() {
        this.selectDialogFormVisible = true;
        this.spaceListQuery.planName = '';
        this.doSearch();
      },
      /*选择方案*/
      onSelectedSpace(item) {
        
        this.selectDialogFormVisible = false;
        this.homeTop.objectId = item.planId;
        this.homeTop.title = item.planName;
        this.homeTop.planCover = item.cover;

        this.spaceList = [];
        this.spaceList.push(this.homeTop);
      },
      removePlan() {
        this.homeTop.objectId = null;
        this.spaceList = [];
      },
      reset() {
        this.homeTop =  {
          type: 5,
          cover:"",
          objectId:null
        };
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
        params.planName = this.spaceListQuery.planName;

        this.http.get(this).url(this.config.softWear.plan_list).params(
          params
        ).request(function(response) {
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
        if (!this.homeTop.cover || !this.homeTop.cover.trim()) {
          this.$message({type: 'warning',message: '请上传封面'});
          return;
        }

        if (!this.homeTop.objectId || !this.homeTop.objectId.trim()) {
          this.$message({type: 'warning',message: '请选择软装方案'});
          return;
        }

        var loadingInstance = Loading.service({text: '数据提交中...'});

        this.http.postJson(this).url(config.home.home_top_save_url).params(
          this.homeTop
        ).request(function (response) {
          loadingInstance.close();
          //console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '操作成功', type: 'success'});
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
