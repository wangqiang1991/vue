<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加
      </el-button>

      <span style="color:#FF4949;margin-left: 10px;" type="text">最多添加3条</span>

    </div>

    <el-table :data="dataList" v-loading.body="listQuery.loading" border fit highlight-current-row style="width: 100%" id="spaceTable1">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column min-width="300" label="商品名称">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="封面">
        <template scope="scope">
          <img style="width:50px;height:50px;margin-top: 10px;" :src="scope.row.cover+'?imageView2/1/w/512/h/512'" class="gc_praiselist_list_img">
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

      <el-table-column align="center" label="拖拽排序" width="95">
        <template scope="scope">
          <icon-svg class='drag-handler' icon-class="drag"></icon-svg>
        </template>
      </el-table-column>
    </el-table>


    <!-- 保存首页设置 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form :model="form">
<!-- 
        <el-form-item label="集攒优选封面:" :label-width="formLabelWidth">
          <span style="color:#FF4949" type="text">建议尺寸:640*640</span>
        </el-form-item>

        <el-form-item label="" :label-width="formLabelWidth">
          <el-progress style="margin-left: 15px;" v-show="uploading" type="circle" :percentage="percentage"></el-progress>

          <div v-show="homeTop.cover && !uploading" class="el-upload el-upload--picture-card" style="margin-left:23px;">
            <img id="uploadCover3" title="点击修改图片" style="width:100%; height:100%" :src="homeTop.cover+config.imgtmb._200">
          </div>
          <div v-show="!homeTop.cover && !uploading" style="display:inline-block; margin-left:23px">
            <div class="el-upload el-upload--picture-card" id="uploadCoverBtn3">
              <i data-v-5b37d0d4="" class="el-icon-plus"></i>
            </div>
          </div>
        </el-form-item>
 -->
        <el-form-item label="指定集赞商品">
          <el-button type="text" @click="showSelectSpace()" size="small">选择商品</el-button>
          <el-table :data="spaceList" style="width: 100%" border>

            <el-table-column label="商品封面"  align="center" width="150">
              <template scope="scope">
                <img :src="scope.row.cover" style="margin-top:6px;width:50px;height:50px;">
              </template>
            </el-table-column>

            <el-table-column label="商品名称">
              <template scope="scope">
                <span >{{scope.row.title}}</span>
              </template>
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


    <!-- 选择空间 -->
    <el-dialog title="选择商品" :visible.sync="selectDialogFormVisible">

      <div class="filter-container">
        <el-input @keyup.enter.native="doSearch()" v-model="spaceListQuery.keyword" style="width: 200px;" class="filter-item" placeholder="商品名称或编码">
        </el-input>
        <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                   icon="search">搜 索
        </el-button>
      </div>

      <div class="gc-praiselist_content_list">
        <el-table v-loading="spaceListQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="spaceDataList" border style="width: 100%">
          <el-table-column label="商品封面"  align="center">
            <template scope="scope">
              <img :src="scope.row.cover+config.imgtmb._50" style="margin-top:6px;">
            </template>
          </el-table-column>

          <el-table-column label="商品名称">
            <template scope="scope">
              <span >{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column  label="商品编码"  align="center">
            <template scope="scope">
              <span >{{scope.row.goodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="商品集赞数量" >
            <template scope="scope">
              <span>{{scope.row.praiseCount}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="商品点击数量" >
            <template scope="scope">
              <span>{{scope.row.clickCount}}</span>
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
        spaceListQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          keyword: "",
          column: "",
          order: ""
        },
        spaceDataList: [],
        dataList: [],
        olderList: [],
        newList: [],
        sortable: null,
        homeTop: {
          type: 4,
          cover: ""
        },
        spaceList: []
      }
    },
    methods: {
      findAll() {
        this.dataList = [];
        this.olderList = [];
        this.newList = [];

        this.listQuery.loading = true;
        this.http.get(this).url(config.home.home_top_praise).request(function (response) {
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
        const el = document.querySelectorAll('#spaceTable1>.el-table__body-wrapper > table > tbody')[0];
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

      createSuccess() {
        this.findAll();
      },

      handleEdit(item) {
        this.title = "编辑积攒商品";
        this.addDialogFormVisible = true;
        this.homeTop = $.extend({},item);
        this.homeTop.type = 4;


        this.spaceList = [];
        this.spaceList.push(this.homeTop);
        //this.initCoverUpload();

      },

      handleCreate() {
        this.reset();
        this.title = "新增积攒商品";
        this.addDialogFormVisible = true;
        //this.initCoverUpload();
      },

      showSelectSpace() {
        this.selectDialogFormVisible = true;
      },

      onSelectedSpace(item) {
        
        this.selectDialogFormVisible = false;
        this.homeTop.title = item.title;
        this.homeTop.objectId = item.goodsId;
        this.homeTop.cover = item.cover;

        this.spaceList = [];
        this.spaceList.push(this.homeTop);

        //console.log(this.spaceList);
      },

      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.spaceListQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.spaceListQuery.pageIndex = val;
        this.findByPage();
      },

      sortChange(column) {
        this.spaceListQuery.column = column.prop;
        this.spaceListQuery.order = column.order;
        this.findByPage();
      },

      removeSpace() {
        this.spaceList = [];
        this.homeTop.title = "";
        this.homeTop.objectId = "";
      },

      reset() {
        this.homeTop =  {
          type: 4,
          cover:""
        };
        this.spaceList = [];
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
        params.keyword = this.spaceListQuery.keyword.trim();

        this.http.get(this).url(config.picture.praiseGoods_list).params(
          params
        ).request(function(response) {
          this.spaceListQuery.loading = false;
          //console.log(response);
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
        // if (!this.homeTop.cover || !this.homeTop.cover.trim()) {
        //   this.$message({type: 'warning',message: '请上传商品封面'});
        //   return;
        // }

        if (!this.homeTop.title || !this.homeTop.title.trim()) {
          this.$message({type: 'warning',message: '请选择集赞商品'});
          return;
        }

        if (!this.homeTop.objectId || !this.homeTop.objectId.trim()) {
          this.$message({type: 'warning',message: '请选择积攒商品'});
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

      initCoverUpload() {
        if (!this.uploaderInited){
          this.$nextTick(_ => {
            this.uploaderInited = true;
            uploader.initUpload(this.token, "uploadCoverBtn3", (url) => {
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
            uploader.initUpload(this.token, "uploadCover3", (url) => {
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
          //console.log(response);
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
