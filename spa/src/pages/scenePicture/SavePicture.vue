<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <template>
          <el-button type="primary" @click="saveAndPush">保存并上架</el-button>
          <el-button type="primary" @click="save">仅保存</el-button>
          <el-button @click="cancel">取 消</el-button>
        </template>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">场景图详情</h1>
          </el-col>
          <el-col :span="21">
            <el-form-item label-width="80px" label="图片名称:">
              <el-input v-model="picture.name" type="text" size="large" style="width:600px" class="article-textarea"
                        autosize placeholder="请输入图片名称">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="属性:">
              <div style="padding-bottom:5px" class="grid-content bg-purple">
                <el-select style="width:250px" v-model="areaIds" multiple filterable placeholder="房间,可以多选">
                  <el-option
                    v-for="item in roomAreas"
                    :key="item.name"
                    :label="item.name"
                    :value="item.areaId">
                  </el-option>
                </el-select>
                <el-select style="width:250px;margin-right:10px" v-model="styleIds" multiple filterable
                           placeholder="风格,可以多选">
                  <el-option
                    v-for="item in styles"
                    :key="item.name"
                    :label="item.name"
                    :value="item.styleId">
                  </el-option>
                </el-select>
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


            <el-form-item label-width="80px" label="设计师:">
              <el-select class="filter-item" style="width: 250px;" v-model="picture.designerId" placeholder="指定设计师">
                <el-option v-for="item in designers" :key="item.designerId" :label="item.nickName"
                           :value="item.designerId">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="80px" label="封面:">
              <span style="color:#FF4949" type="text">建议尺寸为640*640</span>
            </el-form-item>

            <el-form-item label-width="80px" label="">

              <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>

              <div v-show="picture.cover && !uploading" class="el-upload el-upload--picture-card"
                   style="margin-right:2px;">
                <img id="uploadCover" title="点击修改图片" style="width:100%; height:100%"
                     :src="picture.cover+config.imgtmb._200">
              </div>
              <div v-show="!picture.cover && !uploading" style="display:inline-block; ">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
            </el-form-item>


            <el-form-item label-width="80px" label="图片详情:">
              <span style="color:#FF4949" type="text">建议尺寸1080*1920</span>
            </el-form-item>

            <el-form-item label-width="80px" label="">

              <el-progress v-show="detail_uploading" type="circle" :percentage="detail_percentage"></el-progress>

              <div v-show="!picture.image && !detail_uploading" class="xx">
                <div class="el-upload el-upload--picture-card" id="uploadImage">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
              <div v-show="picture.image">
                <el-radio-group v-model="goodsType" @change="goodsTypeChange" size="small">
                  <el-radio-button label="购买商品"></el-radio-button>
                  <el-radio-button label="点赞商品"></el-radio-button>
                </el-radio-group>
                <div>
                  <div style="display:inline-block; float:left" id="canvas" unselectable="on"
                       onselectstart="return false;">
                    <img id="content" :src="picture.image">
                  </div>
                  <div v-if="currentGoods" class="transition-box"
                       style="display:inline-block; float:left; padding-left: 20px; min-width:200px">
                    <code>
                      <p>
                        商品名称：{{currentGoods.title}}
                      </p>
                      <p>
                        商品编号：{{currentGoods.goodsNumber}}
                      </p>
                    </code>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <goods-selector :multiple="multiple" :selectDialogFormVisible="selectDialogFormVisible"
                      @onSelected="onGoodsSelected" @cancel="cancelGoodsSelector">
      </goods-selector>

      <praise-goods-selector :multiple="multiple" :selectDialogFormVisible="selectPraiseDialogFormVisible"
                             @onSelected="onGoodsSelected" @cancel="cancelGoodsSelector">
      </praise-goods-selector>

    </el-form>
  </div>
</template>
<script type="text/javascript">

  import '@/styles/dragtag.css'
  import dragtag from '@/utils/dragtag'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import uploader from '@/utils/uploader'
  import GoodsSelector from '../commons/GoodsSelector'
  import PraiseGoodsSelector from '../commons/PraiseGoodsSelector'

  export default {
    components: {
      Sticky, GoodsSelector, PraiseGoodsSelector
    },
    data() {
      return {

        percentage: 0,
        uploading: false,

        detail_percentage: 0,
        detail_uploading: false,

        multiple: false,
        selectDialogFormVisible: false,
        selectPraiseDialogFormVisible: false,
        goodsType: "购买商品",
        roomAreas: [],
        styles: [],
        picture: {
          cover: "",
          image: "",
          designerId: ''
        },
        keywordsArray: [],
        areaIds: [],
        styleIds: [],
        currentDot: null,
        currentGoods: null,
        designers: [],
        inputVisible: false,
        inputValue: null
      }
    },
    mounted() {
      this.findRoomAreas();
      this.findImageStyles();
      this.initUpload();
      this.findDesigners();
      this.$nextTick(() => {
        dragtag.startDrag();
        dragtag.startClick();
        dragtag.tagCallback = (dot) => {
          this.currentDot = dot;
          let tagType = dot.data("tagType");
          if (tagType == "gm") {
            this.openGoodsSelector();
          } else {
            this.openPraiseGoodsSelector();
          }
        };
        dragtag.itemClick = (dot) => {
          let tagType = dot.data("tagType");
          let goodsId = dot.data("goods").goodsId;
          this.findGoodsDetail(goodsId, tagType == "dz");
        };
      });
    },
    methods: {
      findGoodsDetail(goodsId, praiseGoods) {
        this.http.get(this).url(praiseGoods ? this.config.praise_goods.detail_url : this.config.goods.detail_url)
          .restful({goodsId: goodsId}).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.currentGoods = response.data.data;
          }, (err) => {
          });
      },
      reset() {
        this.currentGoods = null;
        this.picture.sceneId = null;
        this.picture.name = "";
        this.picture.cover = "";
        this.picture.image = "";
        this.picture.roomAreaRelations = [];
        this.picture.styleRelations = [];
        this.picture.goodsRelations = [];
        this.goodsType = "购买商品";
        this.currentDot = null;
        this.areaIds = [];
        this.styleIds = [];
        this.picture.designerId = '';
        this.keywordsArray = [];
        this.push = null;
        dragtag.clear();
      },
      cancel() {
        this.$emit('cancel');
        this.reset();
      },
      goodsTypeChange() {
        dragtag.tagType = (this.goodsType == "购买商品" ? "gm" : "dz");
      },
      findRoomAreas() {
        this.http.get(this).url(this.config.room_area.list_url).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.roomAreas = response.data.data;
          },
          (error) => {
          }
        );
      },
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
          },
          (error) => {
          }
        );
      },
      initUpload() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          if (response.data.code == 0) {
            this.$nextTick(_ => {
              uploader.initSceneUpload(response.data.data, "uploadImage", (url) => {
                this.detail_percentage = 0;
                this.detail_uploading = false;
                this.picture.image = url;
              }, (up, err, errTip) => {
                console.log(errTip)
              }, (up, file) => {
                console.log("percent is :" + file.percent);
                this.detail_percentage = file.percent;
              }, (up, files) => {
                this.detail_uploading = true;
              });

              uploader.initUpload(response.data.data, "uploadCover", (url) => {
                this.percentage = 0;
                this.uploading = false;
                this.picture.cover = url;
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
                this.picture.cover = url;
              }, (up, err, errTip) => {
                console.log(errTip)
              }, (up, file) => {
                console.log("percent is :" + file.percent);
                this.percentage = file.percent;
              }, (up, files) => {
                this.uploading = true;
              });
            });
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      saveAndPush() {
        this.picture.push = true;
        this.save();
      },
      save() {

        if (!this.picture.name || !this.picture.name.trim()) {
          this.$message({message: '图片名称不能为空', type: 'warning'});
          return;
        }

        if (this.areaIds.length == 0) {
          this.$message({message: '图片属性房间不能为空', type: 'warning'});
          return;
        }

        if (this.styleIds.length == 0) {
          this.$message({message: '图片属性风格不能为空', type: 'warning'});
          return;
        }

        if (!this.picture.cover || !this.picture.cover.trim()) {
          this.$message({message: '图片封面不能为空', type: 'warning'});
          return;
        }

        if (!this.picture.image || !this.picture.image.trim()) {
          this.$message({message: '场景图片不能为空', type: 'warning'});
          return;
        }

        this.picture.roomAreaRelations = [];
        this.areaIds.forEach((areaId) => {
          this.picture.roomAreaRelations.push({areaId});
        });

        this.picture.styleRelations = [];
        this.styleIds.forEach((styleId) => {
          this.picture.styleRelations.push({styleId});
        });

        this.picture.keywords = this.keywordsArray.join(",");

        this.picture.goodsRelations = [];

        let dots = dragtag.getDots();
        let goodsRelations = this.picture.goodsRelations;
        dots.each(function (index, dot) {
          let dote = $(dot);
          let relation = {
            goodsId: dote.data("goods").goodsId,
            type: dote.data("tagType") == "gm" ? 1 : 2,
            location: JSON.stringify({
              x: dote.data("left"),
              y: dote.data("top")
            })
          };
          goodsRelations.push(relation);
        });

        console.log(this.picture);

        this.http.postJson(this).url(this.config.picture.list_url)
          .params(this.picture)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '保存成功!'});
              this.reset();
              this.$emit('success');
            },
            (error) => {
            }
          );
      },
      openGoodsSelector() {
        this.selectDialogFormVisible = false;
        this.selectDialogFormVisible = true;
      },
      openPraiseGoodsSelector() {
        this.selectPraiseDialogFormVisible = false;
        this.selectPraiseDialogFormVisible = true;
      },
      onGoodsSelected(goods) {
        this.selectDialogFormVisible = false;
        this.selectPraiseDialogFormVisible = false;
        this.currentDot.data("goods", goods);
      },
      cancelGoodsSelector() {
        if (this.currentDot) {
          this.currentDot.remove();
        }
        this.selectDialogFormVisible = false;
        this.selectPraiseDialogFormVisible = false;
      },

      loadSource(detail) {
        this.reset();
        this.picture = detail;
        console.log(detail)
        if (this.picture.keywords && this.picture.keywords.length > 0) {
          this.keywordsArray = this.picture.keywords.split(",");
        } else {
          this.keywordsArray = [];
        }

        this.areaIds = [];
        this.styleIds = [];
        detail.roomAreaRelations.forEach((item) => {
          this.areaIds.push(item.areaId);
        });
        detail.styleRelations.forEach((item) => {
          this.styleIds.push(item.styleId);
          console.log('====')
          console.log(this.styleIds)
        });

        let dotInfos = [];
        detail.goodsRelations.forEach((item) => {
          let dotInfo = {};
          let location = JSON.parse(item.location);
          dotInfo.data = {goods: {goodsId: item.goodsId}},
            dotInfo.tagType = item.type == 1 ? "gm" : "dz";
          dotInfo.left = location.x;
          dotInfo.top = location.y;
          dotInfos.push(dotInfo);
        });
        // 恢复标签
        dragtag.recover(dotInfos);
      },

      findDesigners() {

        var params = {
          pageSize: 1000,
          pageIndex: 1
        };
        this.http.get(this).url(this.config.designer.scene_list_url).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message.error(response.data.message);
            } else {
              this.designers = response.data.data.data;
            }
          },
          (error) => {
            this.$message.error("服务器繁忙,请稍后再试");
          }
        );
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
