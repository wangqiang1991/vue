<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加
      </el-button>

      <span style="color:#FF4949;margin-left: 10px;" type="text">最多添加1条</span>

    </div>

    <el-table :data="dataList" v-loading.body="listQuery.loading" border fit highlight-current-row style="width: 100%" id="subjectTable">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column min-width="300" label="期刊标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="期刊封面">
        <template scope="scope">
          <img style="width:104px;height:50px;margin-top: 10px;" :src="scope.row.cover+'?imageView2/1/w/512/h/240'" class="gc_praiselist_list_img">
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="浏览量">
        <template scope="scope">
          <span>{{scope.row.viewAmount}}</span>
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

      <!-- <el-table-column align="center" label="拖拽排序" width="95">
        <template scope="scope">
          <icon-svg class='drag-handler' icon-class="drag"></icon-svg>
        </template>
      </el-table-column> -->
    </el-table>


    <!-- 保存首页设置 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form :model="form">

       <!--  <el-form-item label="首页封面:" :label-width="formLabelWidth">
          <span style="color:#FF4949" type="text">建议尺寸为1024*479</span>
        </el-form-item> -->

       <!--  <el-form-item label=""  :label-width="formLabelWidth">

          <el-progress style="margin-left: 15px;" v-show="uploading" type="circle" :percentage="percentage"></el-progress>

          <div v-show="homeTop.cover && !uploading" class="el-upload el-upload--picture-card" style="margin-left:23px;">
            <img id="uploadCover2" title="点击修改图片" style="width:208%; height:100%" :src="homeTop.cover+'?imageView2/1/w/512/h/240'">
          </div>
          <div v-show="!homeTop.cover && !uploading" style="display:inline-block; margin-left:23px">
            <div class="el-upload el-upload--picture-card" id="uploadCoverBtn2">
              <i data-v-5b37d0d4="" class="el-icon-plus"></i>
            </div>
          </div>
        </el-form-item> -->

        <el-form-item label="指定期刊">
          <el-button type="text" @click="showSelectSpace()" size="small">选择期刊</el-button>
          <el-table :data="subjectList" style="width: 100%" border>
           <el-table-column label="期刊封面"  align="center" width="150">
            <template scope="scope">
              <img :src="scope.row.cover" style="margin-top:6px;width:104px;height:50px;">
            </template>
           </el-table-column>

            <el-table-column prop="title" label="期刊标题">
            </el-table-column>
            <el-table-column width="100px" label="操作">
              <template scope="scope">
                <el-button type="text" size="small" @click="removeSpace()">移除</el-button>
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


    <!-- 选择期刊 -->
    <el-dialog title="选择期刊" :visible.sync="selectDialogFormVisible">

      <div class="filter-container">
        <el-input @keyup.enter.native="doSearch()" v-model="subjectListQuery.title" style="width: 200px !important;" class="filter-item" placeholder="输入期刊文章标题"></el-input>
        <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛 选</el-button>
      </div>

      <div class="gc-praiselist_content_list">
        <el-table v-loading="subjectListQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="subjectDataList" border style="width: 100%" @sort-change="sortChange">

          <el-table-column label="期刊封面"  align="center">
            <template scope="scope">
              <img :src="scope.row.cover" style="margin-top:6px;width:104px;height:50px;">
            </template>
          </el-table-column>

          <el-table-column align="center" label="期刊标题" width="200">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="viewAmount" label="浏览量" sortable="custom" align="center">
            <template scope="scope">
              <span style="color:orangered;">{{scope.row.viewAmount}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="点赞数" width="100">
            <template scope="scope">
              <span>{{scope.row.praiseAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="评论数" width="100">
            <template scope="scope">
              <span>{{scope.row.commentAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  width="100">
            <template scope="scope">
              <el-button type="text" @click="onSelectedSpace(scope.row)" size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChange" :current-page="subjectListQuery.pageIndex"
          @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]" :page-size="subjectListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="subjectListQuery.total">
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

  export default {
    directives: {
      waves
    },
    mounted: function () {
      this.findAll();
      this.findByPage();
      this.getUploadToken();
    },
    data() {
      return {
        percentage:0,
        uploading:false,
        token: null,
        addDialogFormVisible: false,
        selectDialogFormVisible: false,
        uploaderInited:false,
        title: "",
        listQuery: {
          loading: false
        },
        subjectListQuery: {
          title: "",
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          column: "",
          order: ""
        },

        subjectDataList: [],
        dataList: [],
        olderList: [],
        newList: [],
        sortable: null,
        homeTop: {
          type: 3,
          cover: ""
        },
        subjectList: []
      }
    },
    methods: {
      findAll() {
        this.dataList = [];
        this.olderList = [];
        this.newList = [];

        this.listQuery.loading = true;
        this.http.get(this).url(config.home.home_top_subject_list).params({}).request(function (response) {
          this.listQuery.loading = false;
          console.log(response);
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
        const el = document.querySelectorAll('#subjectTable>.el-table__body-wrapper > table > tbody')[0];
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
            this.newList.splice(evt.newIndex, 0, tempIndex);
            console.log(this.newList);
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
          console.log(response);
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
          console.log(response);
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

      createSuccess() {
        this.findAll();
      },

      handleEdit(item) {
        this.title = "编辑首页期刊";
        this.addDialogFormVisible = true;
        this.homeTop = $.extend({},item);
        this.homeTop.type = 3;

        this.subjectList = [];
        this.subjectList.push(this.homeTop);
        //this.initCoverUpload();

      },

      handleCreate() {
        this.reset();
        this.title = "新增期刊";
        this.addDialogFormVisible = true;
        //this.initCoverUpload();
      },

      showSelectSpace() {
        this.selectDialogFormVisible = true;
      },

      onSelectedSpace(item) {
        this.selectDialogFormVisible = false;
        this.homeTop.title = item.title;
        this.homeTop.objectId = item.subjectArticleId;
        this.homeTop.cover = item.cover;

        this.subjectList = [];
        this.subjectList.push(this.homeTop);

        console.log(this.subjectList);
      },

      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.subjectListQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.subjectListQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.subjectListQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage() {
        this.subjectListQuery.loading = true;
        this.http.get(this).url(this.config.subject.list_url).params(this.subjectListQuery).request(
          (response) => {
            if(response.data.code != 0) {
              this.$message({
                message: response.data.message ? response.data.message : "系统错误",
                type: 'error'
              });
              return;
            }
            console.log(response.data);
            //this.subjectDataList = response.data.data.data;
            this.subjectDataList = [];
            response.data.data.data.forEach((item)=>{
                if(item.status == 1){
                  this.subjectDataList.push(item)
                }
            });
            this.subjectListQuery.total = response.data.data.totalSize;
            this.subjectListQuery.loading = false;
          },
          (error) => {

          }
        );
      },
      sortChange(column) {
        this.subjectListQuery.column = column.prop;
        this.subjectListQuery.order = column.order;
        console.log(column);
        this.findByPage();
      },

      removeSpace() {
        this.subjectList = [];
        this.homeTop.title = "";
        this.homeTop.objectId = "";
      },

      reset() {
        this.homeTop =  {
          type: 3,
          cover:""
        };
        this.subjectList = [];
      },

      save() {
        // if (!this.homeTop.cover || !this.homeTop.cover.trim()) {
        //   this.$message({type: 'warning',message: '请上传首页封面'});
        //   return;
        // }

        if (!this.homeTop.title || !this.homeTop.title.trim()) {
          this.$message({type: 'warning',message: '请选择首页期刊'});
          return;
        }

        if (!this.homeTop.objectId || !this.homeTop.objectId.trim()) {
          this.$message({type: 'warning',message: '请选择首页期刊'});
          return;
        }
        

        var loadingInstance = Loading.service({text: '数据提交中...'});

        this.http.postJson(this).url(config.home.home_top_save_url).params(
          this.homeTop
        ).request(function (response) {
          loadingInstance.close();
          console.log(response);
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

      initCoverUpload() {
        if (!this.uploaderInited){
          this.$nextTick(_ => {
            this.uploaderInited = true;
            uploader.initUpload(this.token, "uploadCoverBtn2", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.homeTop.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            },(up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });
            uploader.initUpload(this.token, "uploadCover2", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.homeTop.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            },(up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });
          });
        }
      },

      getUploadToken() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            this.token = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },

    }
  }
</script>
