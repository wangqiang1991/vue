<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <el-select @change="doSearch()" v-model="listQuery.type" clearable style="width: 130px" class="filter-item" placeholder="推荐类型">
        <el-option v-for="item in recommend_types" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <!-- <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button> -->
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">


      <el-table-column label="推荐封面" align="center" width="200">
        <template scope="scope">
          <img v-if="scope.row.type ===1" style="width:50px;height:50px;margin-top:10px;" :src="scope.row.cover+'?imageView2/1/w/300/h/300'" class="gc_praiselist_list_img">
          <img v-else-if="scope.row.type === 2" style="width:50px;height:50px;margin-top:10px;" :src="scope.row.cover+'?imageView2/1/w/300/h/300'" class="gc_praiselist_list_img">
          <img v-else-if="scope.row.type === 3" style="width:90px;height:50px;margin-top:10px;" :src="scope.row.cover+'?imageView2/1/w/498/h/276'" class="gc_praiselist_list_img">
          <img v-else-if="scope.row.type === 4" style="width:50px;height:50px;margin-top:10px;" :src="scope.row.cover+'?imageView2/1/w/300/h/300'" class="gc_praiselist_list_img">
        </template>
      </el-table-column>


      <el-table-column label="推荐信息">
        <template scope="scope">
          <!-- 展示图片名称 -->
          <span v-if="scope.row.type === 1">{{scope.row.object.name}}</span>
          <!-- 展示空间名称 -->
          <span v-if="scope.row.type === 2">{{scope.row.object.name}}</span>
          <!-- 展示期刊标题 -->
          <span v-if="scope.row.type === 3">{{scope.row.object.title}}</span>
          <!-- 展示商品 -->
          <span v-if="scope.row.type === 4">{{scope.row.object.title}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="推荐类型" width="200">
        <template scope="scope">
          <span v-if="scope.row.type === 1">场景图</span>
          <!--<span v-if="scope.row.type === 2">空间</span>-->
          <span v-if="scope.row.type === 3">期刊</span>
          <span v-if="scope.row.type === 4">商品</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="排序序号" width="200">
        <template scope="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="delete" type="danger" @click="deleteItem(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>

    <!-- 添加或者保存首页推荐数据 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="recommend" label-position="left" label-width="100px" style='margin-left:20px;'>
        <el-form-item label="推荐类型">
          <el-select class="filter-item" v-model="recommend.type" placeholder="推荐类型(必选)">
            <el-option v-for="item in recommend_types" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="指定序号">
          <el-input-number v-model="recommend.orderNo" :min="1"></el-input-number>
        </el-form-item>


        <!--<el-form-item label="推荐封面" :label-width="formLabelWidth">-->
          <!--<span v-show="recommend.type == 0" style="color:#FF4949" type="text">建议尺寸为0*0</span>-->
          <!--<span v-show="recommend.type == 1" style="color:#FF4949" type="text">建议尺寸为640*640</span>-->
          <!--<span v-show="recommend.type == 2" style="color:#FF4949" type="text">建议尺寸为1024*1024</span>-->
          <!--<span v-show="recommend.type == 3" style="color:#FF4949" type="text">建议尺寸为1024*479</span>-->
          <!--<span v-show="recommend.type == 4" style="color:#FF4949" type="text">建议尺寸为640*771</span>-->
        <!--</el-form-item>-->


        <!--<el-form-item label="" :label-width="formLabelWidth">-->

          <!--<el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>-->

          <!--<div v-show="recommend.cover && !uploading" class="el-upload el-upload&#45;&#45;picture-card" style="margin-left:5px;">-->
            <!--<img v-if="recommend.type == 1" id="uploadCover" title="点击修改图片" style="width:100%; height:100%" :src="recommend.cover+'?imageView2/1/w/320/h/320'">-->
            <!--<img v-else-if="recommend.type == 2" id="uploadCover" title="点击修改图片" style="width:100%; height:100%" :src="recommend.cover+'?imageView2/1/w/320/h/320'">-->
            <!--<img v-else-if="recommend.type == 3" id="uploadCover" title="点击修改图片" style="width:210%; height:100%" :src="recommend.cover+'?imageView2/1/w/498/h/276'">-->
            <!--<img v-else-if="recommend.type == 4" id="uploadCover" title="点击修改图片" style="width:100%; height:100%" :src="recommend.cover+'?imageView2/1/w/320/h/320'">-->
          <!--</div>-->
          <!--<div v-show="!recommend.cover && !uploading" style="display:inline-block; margin-left:5px">-->
            <!--<div class="el-upload el-upload&#45;&#45;picture-card" id="uploadCoverBtn">-->
              <!--<i data-v-5b37d0d4="" class="el-icon-plus"></i>-->
            <!--</div>-->
          <!--</div>-->
        <!--</el-form-item>-->

        <el-form-item v-if="recommend.type === 1" label="指定图片">
          <el-button type="text" @click="showSelectModel(1)" size="small">点击选择图片</el-button>
          <el-table :data="objectList" style="width: 100%">
            <el-table-column prop="name" label="图片名称">
            </el-table-column>
            <el-table-column width="100px" label="操作">
              <template scope="scope">
                <el-button type="text" size="small" @click="removeObject()">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <!--<el-form-item v-if="recommend.type === 2" label="指定空间">-->
          <!--<el-button type="text" @click="showSelectModel(2)" size="small">点击选择空间</el-button>-->
          <!--<el-table :data="objectList" style="width: 100%">-->
            <!--<el-table-column prop="name" label="空间名称">-->
            <!--</el-table-column>-->
            <!--<el-table-column width="100px" label="操作">-->
              <!--<template scope="scope">-->
                <!--<el-button type="text" size="small" @click="removeObject()">移除</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        <!--</el-form-item>-->

        <el-form-item v-if="recommend.type === 3" label="指定期刊">
          <el-button type="text" @click="showSelectModel(3)" size="small">点击选择期刊</el-button>
          <el-table :data="objectList" style="width: 100%">
            <el-table-column prop="title" label="期刊标题">
            </el-table-column>
            <el-table-column width="100px" label="操作">
              <template scope="scope">
                <el-button type="text" size="small" @click="removeObject()">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item v-if="recommend.type === 4" label="指定商品">
          <el-button type="text" @click="showSelectModel(4)" size="small">点击选择商品</el-button>
          <el-table :data="objectList" style="width: 100%">
            <el-table-column prop="title" label="商品标题">
            </el-table-column>
            <el-table-column width="100px" label="操作">
              <template scope="scope">
                <el-button type="text" size="small" @click="removeObject()">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button @click="save" type="primary">保 存</el-button>
      </div>

    </el-dialog>

    <!-- 选择图片 -->
    <select-scene-picture :selectDialogFormVisible="selectDialogFormVisible && state === 1" @onSelected="onObjectSelected" @cancel="cancelObjectSelected">
    </select-scene-picture>
    <!--&lt;!&ndash; 选择空间 &ndash;&gt;-->
    <!--<select-space :selectDialogFormVisible="selectDialogFormVisible && state === 2" @onSelected="onObjectSelected" @cancel="cancelObjectSelected">-->
    <!--</select-space>-->
    <!-- 选择期刊 -->
    <select-subject :selectDialogFormVisible="selectDialogFormVisible && state === 3" @onSelected="onObjectSelected" @cancel="cancelObjectSelected">
    </select-subject>
    <!-- 选择商品 -->
    <goods-selector :multiple="multiple" :selectDialogFormVisible="selectDialogFormVisible && state === 4" @onSelected="onObjectSelected" @cancel="cancelObjectSelected">
    </goods-selector>

  </div>
</template>

<script>

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import { Loading } from 'element-ui'
  import uploader from "../../utils/uploader";
  import SelectScenePicture from './selectScenePicture.vue';
  import SelectSpace from './selectSpace.vue';
  import SelectSubject from './selectSubject.vue';
  import GoodsSelector from '../commons/GoodsSelector'



  const recommend_types = [
    { key: 1, display_name: '场景图' },
//    { key: 2, display_name: '空间' },
    { key: 3, display_name: '期刊' },
    { key: 4, display_name: '商品' }
  ]

  export default {
    components: {
      SelectScenePicture,
      SelectSpace,
      SelectSubject,
      GoodsSelector
    },
    directives: {
      waves
    },
    mounted:function() {
      this.findByPage();
      this.getUploadToken();
    },
    data() {
      return {
        percentage:0,
        uploading:false,
        recommend_types,
        addDialogFormVisible:false,
        selectDialogFormVisible: false,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          type: ''
        },
        title: "添加首页推荐",
        recommend: {
          type:'',
          cover:'',
          objectId:'',
          orderNo:0
        },
        state:0,
        objectList:[],
        token: null,
        uploaderInited:false,
        multiple:false
      }
    },
    methods: {
      /**
       * 分页查询供应商
       */
      findByPage() {
        this.listQuery.loading = true;
        this.http.get(this).url(config.recommend.recommend_list_url).params(
          this.listQuery
        ).request(function(response) {
          this.listQuery.loading = false;
          console.log(response);
          if(response.data.code == 0){
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },

      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },

      deleteItem(item) {
        this.$confirm('你是否确认删除该条内容?', '提示', {
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
        this.http.delete(this).url(config.recommend.recommend_delete_url).restful({
          recommendId: item.recommendId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '删除成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

      reset() {
        this.recommend = {
          type:'',
          cover:'',
          objectId:'',
          orderNo:0
        };
        this.objectList = [];
      },

      handleCreate() {
        this.title = "添加首页推荐";
        this.reset();
        this.addDialogFormVisible = true;
        //this.initCoverUpload();
      },

      handleEdit(item) {
        this.title = "编辑首页推荐";
        this.reset();
        this.recommend = $.extend({},item);
        this.objectList = [];
        this.objectList.push(this.recommend.object);
        this.addDialogFormVisible = true;
        //this.initCoverUpload();
        console.log(this.objectList);
      },

      initCoverUpload() {
        if (!this.uploaderInited){
          this.$nextTick(_ => {
            this.uploaderInited = true;
            uploader.initUpload(this.token, "uploadCoverBtn", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.recommend.cover = url;
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
              this.recommend.cover = url;
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


      showSelectModel(state) {
        this.selectDialogFormVisible = true;
        this.state = state;

        console.log(this.state);
      },

      onObjectSelected(object) {
        this.selectDialogFormVisible = false;
        this.recommend.object = object;
        this.objectList = [];
        this.objectList.push(this.recommend.object);


        console.log(object);
      },

      cancelObjectSelected() {
        this.selectDialogFormVisible = false;
      },

      removeObject() {
        this.objectList = [];
      },

      save() {
        let validate = this.saveValidate();
        if (validate) {
          if (this.recommend.type == 1) {
            this.recommend.objectId = this.objectList[0].sceneId;
          } else if(this.recommend.type == 2) {
            this.recommend.objectId = this.objectList[0].spaceId;
          } else if(this.recommend.type == 3) {
            this.recommend.objectId = this.objectList[0].subjectArticleId;
          } else if(this.recommend.type == 4) {
            this.recommend.objectId = this.objectList[0].goodsId;
          }

          console.log(this.recommend);

          var loadingInstance = Loading.service({text: '数据提交中...'});
          this.http.postJson(this).url(config.recommend.recommend_save_url).params(
            this.recommend
          ).request(function (response) {
            loadingInstance.close();
            console.log(response);
            if (response.data.code == 0) {
              this.$message({message: '保存成功', type: 'success'});
              this.addDialogFormVisible = false;
              this.findByPage();
            } else {
              this.$message.error(response.data.message);
            }
          },function (error) {
            loadingInstance.close();
            this.$message.error(error);
          });

        }
      },

      /**
       * 保存的时候表单验证
       */
      saveValidate() {

        if (!this.recommend.type) {
          this.$message({message: '请选择推荐类型', type: 'warning'});
          return false;
        }
//
//        if (!this.recommend.cover || !this.recommend.cover.trim()) {
//          this.$message({message: '请上传封面图片', type: 'warning'});
//          return false;
//        }

        if (!this.objectList || this.objectList.length == 0) {
          this.$message({message: '请指定推荐对象', type: 'warning'});
          return false;
        }
        return true;
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

    }
  }

</script>
