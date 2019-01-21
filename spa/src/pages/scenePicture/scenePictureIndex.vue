<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加
      </el-button>

      <span style="color:#FF4949;margin-left: 10px;" type="text">最多添加6条,数量建议偶数,前端呈现效果最佳</span>

    </div>

    <el-table :data="dataList" v-loading.body="listQuery.loading" border fit highlight-current-row style="width: 100%" id="pictureTable">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>
        <el-table-column min-width="300" label="标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="封面">
        <template scope="scope">
          <img style="width:50px;height:50px;margin-top: 10px;" :src="scope.row.cover+'?imageView2/1/w/300/h/300'" class="gc_praiselist_list_img">
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

        <el-form-item label="首页封面:" :label-width="formLabelWidth">
          <span style="color:#FF4949" type="text">建议尺寸为1029*1029</span>
        </el-form-item>

        <el-form-item label="" :label-width="formLabelWidth">
          <el-progress style="margin-left: 15px;" v-show="uploading" type="circle" :percentage="percentage"></el-progress>
          <div v-show="homeTop.cover && !uploading" class="el-upload el-upload--picture-card" style="margin-left:23px;">
            <img id="uploadCover" title="点击修改图片" style="width:100%; height:100%" :src="homeTop.cover+config.imgtmb._200">
          </div>
          <div v-show="!homeTop.cover && !uploading" style="display:inline-block; margin-left:23px">
            <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
              <i data-v-5b37d0d4="" class="el-icon-plus"></i>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="指定图片">
          <el-button type="text" @click="showSelectSpace()" size="small">选择图片</el-button>
          <el-table :data="sceneList" style="width: 100%">
            <el-table-column prop="title" label="图片名称">
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


    <!-- 选择图片 -->
    <el-dialog :size="'large'" title="选择图片" :visible.sync="selectDialogFormVisible">

      <div class="filter-container" style="overflow:hidden;">
        <el-input v-model="sceneListQuery.name" style="width: 200px !important;float:left;margin-top:0;margin-right:12px;" class="filter-item" placeholder="输入图片名称">
        </el-input>

        <el-select v-model="sceneListQuery.areaId" style="width:130px;float:left;margin-right:12px;" clearable filterable placeholder="请选择区域">
          <el-option
            v-for="item in roomAreas"
            :key="item.name"
            :label="item.name"
            :value="item.areaId">
          </el-option>
        </el-select>

        <el-select v-model="sceneListQuery.styleId" style="width:130px;float:left;" clearable filterable placeholder="请选择风格">
          <el-option
            v-for="item in imageStyles"
            :key="item.name"
            :label="item.name"
            :value="item.styleId">
          </el-option>
        </el-select>

        <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;float:left;" type="primary" v-waves icon="search">筛选</el-button>

      </div>

      <div class="gc-praiselist_content_list">
        <el-table
          v-loading="sceneListQuery.loading"
          element-loading-text="努力加载中..."
          ref="multipleTable"
          :data="sceneDataList"
          border
          style="width: 100%"
          @sort-change = "sortChange">
          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="viewCount"
            label="浏览量"
            align="center"
            vertical="middle">
          </el-table-column>
          <el-table-column
            prop="name"
            label="图片名称">
          </el-table-column>
          <el-table-column
            label="图片"
            align="center"
            width="120">
            <template scope="scope">
              <img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
            </template>
          </el-table-column>
          <el-table-column
            label="优先级"
            align="center">
            <template scope="scope">
              <span>{{scope.row.level}}级</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="roomNames"
            label="区域"
            align="center">
          </el-table-column>
          <el-table-column
            prop="styleNames"
            label="风格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="tagType"
            label="标签类型"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.tagType == 1">无</span>
              <span v-if="scope.row.tagType == 2">点赞标签</span>
              <span v-if="scope.row.tagType == 3">混合标签</span>
              <span v-if="scope.row.tagType == 4">购买标签</span>
            </template>
          </el-table-column>
          <el-table-column
            label="首页"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.toHome">上</span>
              <span v-else>下</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" align="center"  width="100">
            <template scope="scope">
              <el-button type="text" @click="onSelectedSpace(scope.row)" size="small">选择</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChange" :current-page="sceneListQuery.pageIndex" 
           @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="sceneListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="sceneListQuery.total">
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
      this.findImageStyles();
      this.findRoomAreas();
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
        sceneListQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          areaId: "",
          styleId: "",
          keyword: "",
          column: "",
          order: "",
          putaway: true
        },
        sceneDataList: [],
        dataList: [],
        olderList: [],
        newList: [],
        sortable: null,
        homeTop: {
          type: 1,
          cover: ""
        },
        sceneList: [],
        roomAreas: [],
        imageStyles: [],
      }
    },
    methods: {
      findAll() {
        this.dataList = [];
        this.olderList = [];
        this.newList = [];

        this.listQuery.loading = true;
        this.http.get(this).url(config.home.home_top_scene_list).params({}).request(function (response) {
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
        const el = document.querySelectorAll('#pictureTable>.el-table__body-wrapper > table > tbody')[0];
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
        this.title = "编辑首页图片";
        this.addDialogFormVisible = true;
        this.homeTop = $.extend({},item)
        this.homeTop.type = 1;

        this.sceneList = [];
        this.sceneList.push(this.homeTop);
        this.initCoverUpload();

      },

      handleCreate() {
        this.reset();
        this.title = "新增首页图片";
        this.addDialogFormVisible = true;
        this.initCoverUpload();
      },

      showSelectSpace() {
        this.selectDialogFormVisible = true;
      },

      onSelectedSpace(item) {
        this.selectDialogFormVisible = false;
        this.homeTop.title = item.name;
        this.homeTop.objectId = item.sceneId;

        this.sceneList = [];
        this.sceneList.push(this.homeTop);

        console.log(this.sceneList);
      },

      sortChange(column) {
        this.sceneListQuery.column = column.prop;
        this.sceneListQuery.order = column.order;
        console.log(column);
        this.findByPage();
      },
      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.sceneListQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.sceneListQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.sceneListQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage (){
        console.log(this.sceneListQuery);
        this.sceneListQuery.loading = true;
        this.http.get(this).url(this.config.picture.list_url).params(this.sceneListQuery).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            console.log(response.data);
            this.sceneDataList = response.data.data.data;
            this.sceneListQuery.total = response.data.data.totalSize;
            this.sceneListQuery.loading = false;
          },
          (error) => {

          }
        );
      },

      removeSpace() {
        this.sceneList = [];
        this.homeTop.title = "";
        this.homeTop.objectId = "";
      },

      reset() {
        this.homeTop =  {
          type: 1,
          cover:""
        };
        this.sceneList = [];
      },

      save() {
        if (!this.homeTop.cover || !this.homeTop.cover.trim()) {
          this.$message({type: 'warning',message: '请上传首页封面'});
          return;
        }

        if (!this.homeTop.title || !this.homeTop.title.trim()) {
          this.$message({type: 'warning',message: '请选择首页图片'});
          return;
        }

        if (!this.homeTop.objectId || !this.homeTop.objectId.trim()) {
          this.$message({type: 'warning',message: '请选择首页图片'});
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
            uploader.initUpload(this.token, "uploadCoverBtn", (url) => {
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
            uploader.initUpload(this.token, "uploadCover", (url) => {
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

      findRoomAreas() {
        this.http.get(this).url(this.config.room_area.list_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.roomAreas = response.data.data;
            }, (err) => { });
      },
      findImageStyles() {
        this.http.get(this).url(this.config.image_style.list_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.imageStyles = response.data.data;
            }, (err) => { });
      }

    }
  }
</script>
