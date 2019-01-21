<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <template>
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="cancel">取 消</el-button>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">基本信息</h1>
          </el-col>
          <el-col :span="21">
            <el-form-item label-width="80px" label="空间名称:">
              <el-input type="text" size="large" class="article-textarea" maxlength="20" autosize placeholder="请输入空间名称"
                        v-model="space.name">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="空间简介:">
              <el-input v-model="space.description" type="textarea" maxlength="255" :autosize="{ minRows: 3, maxRows: 4}"
                        placeholder="请填写空间简介">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="空间风格:">
              <el-select style="width:250px;margin-right:10px" v-model="styleId" filterable
                         placeholder="请选择风格">
                <el-option
                  v-for="item in styles"
                  :key="item.name"
                  :label="item.name"
                  :value="item.styleId">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="80px" label="空间封面:">

              <span style="color:#FF4949" type="text">建议尺寸为1024*611,图片上有一层遮罩,透明度15%,title位于边角</span>
            </el-form-item>

            <el-form-item label-width="70px">
              <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>

              <div v-show="space.cover && !uploading" class="el-upload el-upload--picture-card"
                   style="margin-right:2px;">
                <img id="uploadCover" title="点击修改图片" style="width:100%; height:100%"
                     :src="space.cover+config.imgtmb._200">
              </div>
              <div v-show="!space.cover && !uploading" style="display:inline-block; margin-left:8px">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>

            </el-form-item>


            <el-form-item label-width="80px" label="关键词:">
              <el-tag :key="tag" v-for="tag in keywordsArray" type="primary" closable style="margin-left: 10px;"
                      :disable-transitions="false" @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm" style="width: 100px;">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 添加</el-button>
            </el-form-item>


            <el-form-item label-width="80px" label="详情描述:">
              <el-button type="text" @click="editDetailInfo">点击编辑详情</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">空间栏目</h1>
          </el-col>
          <el-col>
            <div style="margin-bottom: 20px;">
              <el-button size="small" type="primary" icon="edit" @click="addTab()">添加栏目</el-button>
            </div>
            <el-tabs v-model="tabValue" type="card" closable @tab-click="tabClick" @tab-remove="removeTab">
              <el-tab-pane v-for="(item, index) in spaceItems" :key="item.name" :label="item.name" :name="item.name">

                <div class="filter-container" align="center">
                  <el-button @click="toSelectPic()" class="filter-item el-icon-plus" style="margin-left: 10px;"
                             type="primary" size="small"> 添加图片
                  </el-button>
                  <el-button @click="handleEditItem(item)" class="filter-item el-icon-edit" style="margin-left: 10px;"
                             type="primary" size="small"> 编辑栏目
                  </el-button>
                </div>

                <el-table :data="currentItemPictures" border style="width: 100%">

                  <el-table-column type="index" align="center" label="序号" width="65">
                  </el-table-column>

                  <el-table-column label="图片" align="center" vertical="middle" width="120">
                    <template scope="scope">
                      <img style="width:50px;height:50px;margin-top: 5px !important;"
                           :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
                    </template>
                  </el-table-column>

                  <el-table-column prop="name" label="图片名称">
                    <template scope="scope">
                      <span class="link-type">{{scope.row.name}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="标签类型" align="center">
                    <template scope="scope">
                      <span v-if="scope.row.tagType == 1">无</span>
                      <span v-if="scope.row.tagType == 2">点赞标签</span>
                      <span v-if="scope.row.tagType == 3">混合标签</span>
                      <span v-if="scope.row.tagType == 4">购买标签</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="区域" align="center">
                    <template scope="scope">
                      <span>{{scope.row.roomNames}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="风格" align="center">
                    <template scope="scope">
                      <span>{{scope.row.styleNames}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="center" width="100">
                    <template scope="scope">
                      <el-button icon="delete" size="small" type="danger" @click="removePicItem(scope.row)">移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

              </el-tab-pane>
            </el-tabs>

          </el-col>

        </el-row>
      </div>
    </el-form>


    <el-dialog size="large" title="选择图片" :visible.sync="choicePicDialogVisible">
      <div style="margin-bottom:10px;">
        <el-input @keyup.enter.native="doSearch()" v-model="picQuery.name" style="width: 200px !important;"
                  class="filter-item" placeholder="输入图片名称">
        </el-input>

        <el-select @change="doSearch()" v-model="picQuery.areaId" style="width:130px" clearable filterable
                   placeholder="请选择区域">
          <el-option
            v-for="item in roomAreas"
            :key="item.name"
            :label="item.name"
            :value="item.areaId">
          </el-option>
        </el-select>

        <el-select @change="doSearch()" v-model="picQuery.styleId" style="width:130px" clearable filterable
                   placeholder="请选择风格">
          <el-option
            v-for="item in imageStyles"
            :key="item.name"
            :label="item.name"
            :value="item.styleId">
          </el-option>
        </el-select>

        <el-select @change="doSearch()" v-model="picQuery.tagType" style="width:130px" clearable filterable
                   placeholder="标签类型">
          <el-option
            v-for="item in tagTypes"
            :key="item.name"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>


        <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                   icon="search">搜索
        </el-button>

      </div>
      <el-table :data="picList" ref="multiplePicTable" @selection-change="handleSelectionChange" style="width: 100%"
                border>
        <el-table-column label="图片" align="center" width="120">
          <template scope="scope">
            <img style="width:50px;height:50px;margin-top: 5px;" :src="scope.row.cover+config.imgtmb._200"
                 class="gc_praiselist_list_img">
          </template>
        </el-table-column>

        <el-table-column prop="name" label="图片名称 ">
        </el-table-column>

        <el-table-column prop="tagType" label="标签类型" align="center">
          <template scope="scope">
            <span v-if="scope.row.tagType == 1">无</span>
            <span v-if="scope.row.tagType == 2">点赞标签</span>
            <span v-if="scope.row.tagType == 3">混合标签</span>
            <span v-if="scope.row.tagType == 4">购买标签</span>
          </template>
        </el-table-column>

        <el-table-column prop="roomNames" label="区域" align="center">
        </el-table-column>
        <el-table-column prop="styleNames" label="风格" align="center">
        </el-table-column>

        <el-table-column type="selection" width="55">
        </el-table-column>

      </el-table>
      <div  class="pagination-container">
        <el-pagination @size-change="handleSizeChange" :current-page="picQuery.pageIndex"
        @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]"
                       :page-size="picQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="picQuery.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="choicePicDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSelectedPic">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import Sticky from '@/components/Sticky' // 粘性header组件
  import uploader from '@/utils/uploader'
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'


  export default {
    directives: {
      waves
    },
    components: {
      Sticky
    },
    data() {
      return {
        token: null,
        percentage: 0,
        styleId: '',
        uploading: false,
        currentStyle: {},
        loading: false,
        space: {
          cover: ""
        },
        keywordsArray: [],
        spaceItems: [],                 //空间栏目
        tabValue: "",                  //当前选中的栏目名称
        currentItemPictures: [],        //当前选中栏目对应的图片
        multipleSelections: [],         //临时选中的
        choicePicDialogVisible: false,

        picQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          keyword: "",
          column: "",
          order: "",
          areaId: "",
          styleId: "",
          tagType: null,
          putaway: true
        },
        tagTypes: [
          {name: "无", value: 1},
          {name: "点赞标签", value: 2},
          {name: "混合标签", value: 3},
          {name: "购买标签", value: 4}
        ],

        picList: [],
        roomAreas: [],
        imageStyles: [],
        inputVisible: false,
        inputValue: null
      }
    },
    mounted: function () {
      this.getUploadTokenInitUploadBtn();
      this.findByPage();
      this.findRoomAreas();
      this.findImageStyles();
    },
    methods: {
      findImageStyles() {
        this.http.get(this).url(this.config.image_style.list_url).request(
          (response) => {
            console.log('----------')
            console.log(response)
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.styles = response.data.data;
            this.imageStyles = response.data.data;
            console.log(this.styles)
          },
          (error) => {
          }
        );
      },
      reset() {
        this.space = {
          cover: ""
        };
        this.keywordsArray = [];
        this.tabValue = "";
        this.spaceItems = [];
        this.space.styleRelations = [];
      },
      cancel() {
        this.$emit('cancel');
        this.reset();
      },
      loadSource(source) {
        console.log('======')
        console.log(source)
        this.space = source;
        this.spaceItems = this.space.items;
        this.tabValue = this.spaceItems[0].name;
        this.tabClick();
        if(source.styleRelations.length != 0){
          this.styleId = source.styleRelations[0].styleId;
        }else{
          this.styleId = "";
        }

        if (this.space.keywords && this.space.keywords.length > 0) {
          this.keywordsArray = this.space.keywords.split(",");
        } else {
          this.keywordsArray = [];
        }
      },

      save() {
        var validate = this.saveValidate();
        if (validate) {     //表单验证通过
          //组装参数
          this.space.items = this.spaceItems;

          this.space.keywords = this.keywordsArray.join(",");

          var loadingInstance = Loading.service({text: '数据提交中...'});

          this.http.postJson(this).url(config.space.save_url).params(
            this.space
          ).request(function (response) {
            loadingInstance.close();
            console.log(response);
            if (response.data.code == 0) {
              this.$message({message: '保存成功', type: 'success'});
              this.reset();
              this.$emit('success');
            } else {
              this.$message.error(response.data.message);
            }
          }, function (error) {
            loadingInstance.close();
            this.$message.error(error);
          });
        }
      },

      /**
       * 保存的时候表单验证
       */
      saveValidate() {

        if (!this.space.name || !this.space.name.trim()) {
          this.$message({message: '空间名称不能为空', type: 'warning'});
          return false;
        }

        // if (!this.space.description || !this.space.description.trim()) {
        //   this.$message({message: '空间简介不能为空', type: 'warning'});
        //   return false;
        // }

        if (!this.space.cover || !this.space.cover.trim()) {
          this.$message({message: '请上传空间封面', type: 'warning'});
          return false;
        }

         if (!this.styleId || this.styleId.trim() == 0) {
          this.$message({message: '空间风格不能为空', type: 'warning'});
          return;
        }

        if (!this.space.detailId || !this.space.detailId.trim()) {
          this.$message({message: '请编辑空间详情', type: 'warning'});
          return false;
        }

        //判断栏目是否为空
        if (!this.spaceItems || this.spaceItems.length == 0) {
          this.$message({message: '空间栏目数量不能为0', type: 'warning'});
          return false;
        }

        //判断是否有栏目没有添加场景图
        let that = this;
        for (let i = 0; i < this.spaceItems.length; i++) {
          let spaceItem = this.spaceItems[i];
          if (!spaceItem.picItems || spaceItem.picItems.length == 0) {
            let msg = "空间栏目:“" + spaceItem.name + "”图片数量不能为0";
            that.$message({message: msg, type: 'warning'});
            return false;
          }
        }
//      this.space.styleRelations = [];
        console.log(this.space)
        if(this.space.styleRelations && this.space.styleRelations.length != 0){
          this.space.styleRelations[0].styleId = this.styleId;
        }
        if(!this.space.styleRelations || this.space.styleRelations.length == 0){
          this.space.styleRelations = [];
          this.space.styleRelations.push({styleId:this.styleId})
        }
        return true;
      },


      tabClick() {
        let activityName = this.tabValue;
        let spaceItem;
        this.spaceItems.forEach(function (item) {
          if (activityName === item.name) {
            spaceItem = item;
          }
        });
        this.currentItemPictures = spaceItem.picItems;
        console.log(this.currentItemPictures);
      },

      addTab() {
        this.$prompt('请输入栏目名称', '新增栏目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          if (value != null && value.trim()) {
            //判断栏目名称是否重复
            let existsCount = 0;
            this.spaceItems.forEach((tab, index) => {
              if (tab.name === value) {
                existsCount += 1;
              }
            });
            if (existsCount > 0) {
              this.$message({
                type: 'warning',
                message: '当前空间存在相同的栏目名称'
              });
            } else {
              this.spaceItems.push({
                name: value.trim(),
                picItems: []
              });
              this.tabValue = value;
              this.currentItemPictures = [];
            }
          } else {
            this.$message({
              type: 'warning',
              message: '栏目名称不能为空'
            });
          }
        }).catch(() => {
        });
      },

      removePicItem(object) {
        let activityName = this.tabValue;
        let spaceItem;
        this.spaceItems.forEach(function (item) {
          if (activityName === item.name) {
            spaceItem = item;
          }
        });

        spaceItem.picItems.forEach(function (picItem, index) {
          if (picItem.sceneId === object.sceneId) {
            spaceItem.picItems.splice(index, 1);
          }
        });
        this.currentItemPictures = spaceItem.picItems;
      },

      removeTab(targetName) {
        this.$confirm('确定移除当前栏目吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          let tabs = this.spaceItems;
          let activeName = this.tabValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }

          this.tabValue = activeName;
          this.spaceItems = tabs.filter(tab => tab.name !== targetName);
        }).catch(() => {

        });
      },

      /**
       * 功能:取消选择
       */
      toggleSelection() {
        if (this.$refs.multiplePicTable) {
          this.$refs.multiplePicTable.clearSelection();
        }
      },

      toSelectPic() {
        this.choicePicDialogVisible = true;
        this.toggleSelection();
      },

      /**
       * 确认选择图片
       */
      onSelectedPic() {
        if (this.multipleSelections && this.multipleSelections.length > 0) {
          //找出当前选中的tabItem对象
          let spaceItem;
          let activityName = this.tabValue;
          this.spaceItems.forEach(function (item) {
            if (item.name === activityName) {
              spaceItem = item;
            }
          });

          this.multipleSelections.forEach((item) => {
            if (!this.isSelectedGoods(item, spaceItem)) {
              spaceItem.picItems.push(item);
            }
          });
          this.currentItemPictures = spaceItem.picItems;
        }
        this.choicePicDialogVisible = false;
      },

      /**
       * 判断是否选中
       */
      isSelectedGoods(item, spaceItem) {
        let spaceItemPics = spaceItem.picItems;
        let selected = false;
        spaceItemPics.forEach((pic) => {
          if (item.sceneId === pic.sceneId) {
            selected = true;
            return true;
          }
        });
        return selected;
      },


      handleSelectionChange(val) {
        this.multipleSelections = val;
      },

      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.picQuery.pageSize = val;
        this.findByPage();
      },

      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.picQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.picQuery.pageIndex = 1;
        this.findByPage();
      },

      findByPage() {
        this.picQuery.loading = true;
        this.http.get(this).url(this.config.picture.list_url).params(this.picQuery).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            console.log(response.data);
            this.picList = response.data.data.data;
            this.picQuery.total = response.data.data.totalSize;
            this.picQuery.loading = false;
          },
          (error) => {

          }
        );
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
            }, (err) => {
            });
      },

//    findImageStyles() {
//      this.http.get(this).url(this.config.image_style.list_url)
//        .request(
//          (response) => {
//            if (response.data.code != 0) {
//              this.$message({message: response.data.message, type: 'error'});
//              return;
//            }
//            this.imageStyles = response.data.data;
//          }, (err) => {
//          });
//    },

      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            uploader.initUpload(response.data.data, "uploadCover", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.space.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });
            uploader.initUpload(response.data.data, "uploadCoverBtn", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.space.cover = url;
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

      /**
       * 编辑详情
       */
      editDetailInfo() {
        if (!this.space.detailId) {
          let params = {
            title: "空间详情",
            type: 1
          };
          this.http.postJson(this).url(this.config.articles.save_url).params(params).request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.space.detailId = response.data.data.articleId;
              window.open("/editor/editor.html?articleId=" + this.space.detailId, "_blank");
            },
            (error) => {
            }
          );
        } else {
          window.open("/editor/editor.html?articleId=" + this.space.detailId, "_blank");
        }
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.keywordsArray.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleClose(tag) {
        this.keywordsArray.splice(this.keywordsArray.indexOf(tag), 1);
      },

      handleEditItem(item) {

        this.$prompt('请输入栏目名称', '编辑栏目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: item.name
        }).then(({value}) => {

          if (value != null && value.trim()) {
            if (item.name != value) {

              //判断栏目名称是否重复
              let existsCount = 0;
              this.spaceItems.forEach((tab, index) => {
                if (tab.name === value) {
                  existsCount += 1;
                }
              });
              if (existsCount > 0) {
                this.$message({
                  type: 'warning',
                  message: '当前空间存在相同的栏目名称'
                });
              } else {
                item.name = value;
                this.tabValue = value;
              }
            }
          } else {
            this.$message({
              type: 'warning',
              message: '栏目名称不能为空'
            });
          }
        }).catch(() => {
        });

      }


    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .title-prompt {
    position: absolute;
    right: 0px;
    font-size: 12px;
    top: 10px;
    color: #ff4949;
  }

  .createPost-main-container h1 {
    font-size: 18px;
    color: #666;
    line-height: normal;
    margin: 0;
  }

  .createPost-container {
    position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

  .postInfo-container {
    position: relative;
  @include clearfix;
    margin-bottom: 10px;

  .postInfo-container-item {
    float: left;
  }

  }
  .editor-container {
    min-height: 500px;
    margin: 0 0 30px;

  .editor-upload-btn-container {
    text-align: right;
    margin-right: 10px;

  .editor-upload-btn {
    display: inline-block;
  }

  }
  }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }

  }
</style>
