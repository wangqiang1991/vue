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
            <h1 style="margin-bottom:20px">商品详情</h1>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="编辑时间:">
              <span>&nbsp;&nbsp;{{goods.updatedAt | formatDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="上架时间:">
              <span>&nbsp;&nbsp;{{goods.pushTime | formatDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="下架时间:">
              <span>&nbsp;&nbsp;{{goods.pullTime | formatDate}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">基本信息</h1>
          </el-col>
          <el-col :span="21">
            <el-form-item label-width="80px" label="商品标题:">
              <el-input type="text" size="large" style="width:600px" class="article-textarea" autosize
                        placeholder="请输入商品标题" v-model="goods.title">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="商品编码:">
              <el-input type="text" class="article-textarea" autosize placeholder="请输入商品编码" v-model="goods.goodsNumber">
              </el-input>
            </el-form-item>

            <!--<el-form-item label-width="80px" label="规格编号:">
              <el-input type="text" class="article-textarea" autosize placeholder="请输入规格编号" v-model="goods.styles[0].styleNumber">
              </el-input>
            </el-form-item>-->

            <el-form-item label-width="80px" label="商品简介:">
              <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入简介内容"
                        v-model="goods.description">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="分类选择:">
              <div style="padding-bottom:5px" class="grid-content bg-purple"
                   v-for="(selItem, index) in selectedCategorys">
                <el-select v-model="selItem.firstCategoryId" clearable @change="onFirstCategoryChange(selItem)"
                           filterable placeholder="请选择一级分类">
                  <el-option
                    v-for="item in selItem.firstCategorys"
                    :key="item.categoryId"
                    :label="item.name"
                    :value="item.categoryId">
                  </el-option>
                </el-select>
                <el-select v-model="selItem.secondCategoryId" clearable filterable placeholder="请选择二级分类"
                           style="margin-right:10px">
                  <el-option
                    v-for="item in selItem.secondCategorys"
                    :key="item.categoryId"
                    :label="item.name"
                    :value="item.categoryId">
                  </el-option>
                </el-select>
                <el-button @click="delCategory(selItem)" v-show="selectedCategorys.length > 1" type="primary"
                           size="small" icon="minus"></el-button>
                <el-button style="margin-left:0px" @click="addCategory" v-show="index == selectedCategorys.length - 1"
                           type="primary" size="small" icon="plus"></el-button>
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
              <el-button  class="button-new-tag" size="small" @click="choiceKeywords" > + 选择</el-button>
            </el-form-item>


            <el-form-item label-width="80px" label="供应商:">
              <el-select v-model="goods.providerId" clearable filterable placeholder="请选择供应商">
                <el-option
                  v-for="item in providers"
                  :key="item.providerName"
                  :label="item.providerName"
                  :value="item.providerId">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label-width="80px" label="封面:">
              <span style="color:#FF4949" type="text">建议尺寸为640*771</span>
            </el-form-item>

            <el-form-item label-width="80px" label="封面:">
              <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>

              <div v-show="cover && !uploading" class="el-upload el-upload--picture-card" style="margin-right:2px;">
                <img id="uploadCover" title="点击修改图片" style="width:100%; height:100%" :src="cover+config.imgtmb._200">
              </div>
              <div v-show="!cover && !uploading" style="display:inline-block; margin-left:8px">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">款式</h1>
          </el-col>
          <el-col :span="12">
            <el-table :data="styles" width="100%" border>
              <el-table-column prop="name" label="款式名称">
              </el-table-column>
              <el-table-column width="80" label="款式图">
                <template scope="scope">
                  <img :src="scope.row.cover+config.imgtmb._50" :alt="scope.row.cover" style="margin-top: 10px;">
                </template>
              </el-table-column>
              <el-table-column prop="price" label="款式价格">
              </el-table-column>
              <el-table-column label="规格编号">
                <template scope="scope">
                  <span>
                    {{scope.row.styleNumber}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="款式数量">
                <template scope="scope">
                  <span style="color: red;">
                    总共:{{scope.row.totalCount}}件
                  </span><br>
                  <span style="color: red;">
                    剩余:{{scope.row.count}}件
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="expressTemplateName" label="运费模板">
              </el-table-column>
              <el-table-column align="center" width="100" label="操作">
                <template scope="scope">
                  <el-button type="text" size="small" @click="onEditStyle(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="delStyle(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="3" :offset="21">
              <el-button @click="onAddStyle" style="margin-top:10px;margin-bottom:10px;" type="primary" size="small"
                         icon="plus">
                添加款式
              </el-button>
            </el-col>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">展示内容</h1>
          </el-col>
          <el-col :span="21">
            <el-form-item label-width="80px" label="banner图:">
              <span style="color:#FF4949" type="text">建议尺寸为1024*887</span>
            </el-form-item>

            <el-form-item>
              <!-- <div v-for="banner in banners" class="el-upload el-upload--picture-card" style="margin-right:2px;">
                <img @click="removeBanner(banner)" title="点击移除图片" style="width:115%; height:100%"
                     :src="banner+config.imgtmb._200">
              </div>

              <el-progress style="display:inline-block" v-show="bannerUploading" type="circle"
                           :percentage="percentage"></el-progress>

              <div v-show="!bannerUploading" style="display:inline-block">
                <div class="el-upload el-upload--picture-card" id="goodsUploadBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div> -->
              <upload-image-view ref="uiv" style="width: 813px;"></upload-image-view>
            </el-form-item>

            <el-form-item label-width="80px" label="详情描述:">
              <el-button type="text" @click="editDetailInfo">点击编辑详情</el-button>
            </el-form-item>

          </el-col>
        </el-row>


        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">优惠券</h1>
          </el-col>
          <el-col :span="21">
            <el-form-item>
              <coupon-list :dataList="goods.coupons" style="width: 813px;"></coupon-list>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <el-dialog title="款式" :visible.sync="dialogFormVisible">
      <el-form style="width: 500px; margin-left: 50px;">
        <el-form-item label="款式名称">
          <el-input v-model="currentStyle.name" style="width:280px" placeholder="请输入款式名称"></el-input>
        </el-form-item>
        <el-form-item label="款式图"><span style="color:#ff4949;">建议尺寸为640*771</span>
          <div v-show="currentStyle.cover" class="el-upload el-upload--picture-card" style="margin-left:55px;display:block;">
            <img id="uploadCoverStyle" title="点击修改图片" style="width:100%; height:100%"
                 :src="currentStyle.cover+config.imgtmb._200">
          </div>
          <div v-show="!currentStyle.cover" style="display:block; margin-left:55px">
            <div class="el-upload el-upload--picture-card" id="uploadCoverStyleBtn">
              <i data-v-5b37d0d4="" class="el-icon-plus"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="款式价格">
          <el-input v-model="currentStyle.price" style="width:180px" min="0" type="number"
                    placeholder="请输入款式价格"></el-input>
        </el-form-item>
        <el-form-item label="规格编号">
          <el-input v-model="currentStyle.styleNumber" style="width:280px" placeholder="请输入规格编号"></el-input>
        </el-form-item>
        <el-form-item label="款式数量">
          <el-input-number class="el-number-cus" v-model="currentStyle.totalCount" :min="1"
                           :max="100000"></el-input-number>
        </el-form-item>
        <el-form-item label="运费模板">
          <el-select v-model="currentStyle.expressTemplateId" clearable filterable placeholder="请选择运费模板">
            <el-option
              v-for="item in expressTemplates"
              :key="item.expressTemplateName"
              :label="item.expressTemplateName"
              :value="item.expressTemplateId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="banner图"><span style="color:#ff4949;">建议尺寸为1024*887</span>
          <upload-image-view ref="style_uiv" idPrefix="style_" style="width: 813px;"></upload-image-view>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddStyle">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择关键词" :visible.sync="choiceDialogFormVisible" :before-close="keywordHandleClose">
      <el-form>
        <div v-for="item in firstKeywordsArray" >
          <el-form-item :label="item.title" style="margin-bottom: 10px;">
          </el-form-item>
          <el-checkbox-group :key="keyword" v-for="keyword in item.keywords" v-model="checkedList" @change="changeFunc">
            <el-checkbox :label="keyword" :key="keyword" style="float: left;margin-left: 10px;margin-bottom: 10px;">{{keyword}}</el-checkbox>
          </el-checkbox-group>
          <div class="" v-show="item.keywords.length == 0" style="color: #1f2d3d;margin-bottom: 10px;">
          	该分类暂无关键词
          </div>
          <div style="clear: both;"></div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChoice">取 消</el-button>
        <el-button type="primary" @click="confirmChoice">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import Sticky from '@/components/Sticky' // 粘性header组件
  import uploader from '@/utils/uploader'
  import {formatDate} from '@/commons/date.js'
  import UploadImageView from '@/pages/commons/UploadImageView.vue'
  import CouponList from './CouponList.vue'

  export default {
    name: 'saveGoods',
    components: {Sticky, UploadImageView, CouponList},
    filters: {
      formatDate(time) {
        if (!time) {
          return "无";
        }
        let date = new Date(time);
        //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    data() {
      return {
        showChoiceBox: false,
        checkedList: [],
        checkedVal: [],
        firstArray: [],
        firstKeywordsArray: [],
        choiceDialogFormVisible: false,
        percentage: 0,
        uploading: false,
        bannerUploading: false,
        initLoadSource: false,
        styleInit: false,
        token: null,
        dialogFormVisible: false,
        currentStyle: {
          styles:[{styleNumber:""}]
        },
        cover: "",
        loading: false,
        goods: {
          providerId: "",
          coupons:[],
          styles:[{styleNumber:""}]
        },
        keywordsArray: [],
        banners: [],
        styles: [],
        categorys: [],
        providers: [],
        expressTemplates: [],
        selectedCategorys: [{firstCategoryId: null, secondCategoryId: null, firstCategorys: [], secondCategorys: []}],
        inputVisible: false,
        inputValue: null

      }
    },
    mounted: function () {
      this.findCategroy();
      this.findExpressTemplates();
      this.findAllProvider();
      this.getUploadTokenInitUploadBtn();
    },
    methods: {
      changeFunc(val){
        this.checkedVal = val;
      },
      choiceKeywords() {
        this.choiceDialogFormVisible = true;
        for(var i = 0;i < this.selectedCategorys.length;i++){
          for(var j = 0;j < this.selectedCategorys[i].firstCategorys.length;j++){
            if(this.selectedCategorys[i].firstCategoryId == this.selectedCategorys[i].firstCategorys[j].categoryId){
              var firstArray = this.selectedCategorys[i].firstCategorys[j];
              this.firstArray = firstArray;
              if(!this.selectedCategorys[i].firstCategorys[j].keywords){
                this.firstKeywordsArray.push({title:this.selectedCategorys[i].firstCategorys[j].title, keywords:[]});
              } else {
                this.firstKeywordsArray.push({title:this.selectedCategorys[i].firstCategorys[j].title, keywords:this.firstArray.keywords.split(",")});
              }
            }
          }
        }
      },
      keywordHandleClose(done) {
        done();
        this.firstKeywordsArray = [];
        this.checkedList = [];
      },
      cancelChoice(){
        this.choiceDialogFormVisible = false;
        this.firstKeywordsArray = [];
        this.checkedList = [];
      },
      confirmChoice() {
        this.choiceDialogFormVisible = false;
        var newKeywordsArray = this.keywordsArray.concat(this.checkedVal);
        var tmp = [];
        for(var i = 0;i < newKeywordsArray.length;i++){
          if(tmp.indexOf(newKeywordsArray[i]) == -1){
            tmp.push(newKeywordsArray[i]);
          }
        }
        this.keywordsArray = tmp;
        this.firstKeywordsArray = [];
        this.checkedList = [];
      },
      reset() {
        this.goods.styles = [];
        this.goods.categorys = [];
        this.goods.providerId = null;
        this.goods.goodsId = null;
        this.goods.title = "";
        this.goods.goodsNumber = "";
        this.goods.description = "";
        this.goods.coupons = [];
        this.goods.banner = "";
        this.goods.detailUrl = "";
        this.keywordsArray = [];
        this.banners = [];
        this.styles = [];
        this.cover = "";
        this.selectedCategorys = [];
        this.inputVisible = false;
        this.inputValue = null;
        this.addCategory();
        this.$refs.uiv.setUrls([]);
        this.checkedList = [];
      },
      cancel() {
        this.$emit('cancel');
        this.reset();
      },
      loadSource(source) {
        this.initLoadSource = true;
        this.goods = source;
        if (this.goods.keywords && this.goods.keywords.length > 0) {
          this.keywordsArray = this.goods.keywords.split(",");
        } else {
          this.keywordsArray = [];
        }

        this.banners = source.banner.split(",");
        this.$refs.uiv.setUrls(this.banners);
        let selectedCategorys = source.categorys;
        selectedCategorys.forEach((item) => {
          this.fillFirstCategory(item);
          this.fillSecondFirstCategory(item);
        });
        this.selectedCategorys = selectedCategorys;
        this.firstKeywordsArray = [];


        this.selectedCategorys = source.categorys;
        this.styles = source.styles;
        this.cover = source.cover;
      },
      saveAndPush() {
        this.goods.push = true;
        this.submit();
      },
      save() {
        this.goods.push = false;
        this.submit();
      },
      submit() {
        let urls = this.$refs.uiv.getUrls();
        this.banners = urls;
        //表单验证
        if (!this.goods.title || !this.goods.title.trim()) {
          this.$message({message: '商品标题不能为空', type: 'warning'});
          return;
        }
        if (!this.goods.goodsNumber || !this.goods.goodsNumber.trim()) {
          this.$message({message: '商品编号不能为空', type: 'warning'});
          return;
        }
        if (!this.goods.description || !this.goods.description.trim()) {
          this.$message({message: '商品简介不能为空', type: 'warning'});
          return;
        }

        var categroyValidate = true;
        this.selectedCategorys.forEach((item) => {
          if (!item.firstCategoryId || !item.secondCategoryId) {
            categroyValidate = false;
            return;
          }
        });

        if (!categroyValidate) {
          this.$message({message: '请选择商品分类', type: 'warning'});
          return;
        }

        this.goods.categorys = this.selectedCategorys;

        if (!this.goods.providerId || this.goods.providerId.trim() == 0) {
          this.$message({message: '请选择供应商', type: 'warning'});
          return;
        }

        this.goods.cover = this.cover;
        if (!this.goods.cover || this.goods.cover.trim() == 0) {
          this.$message({message: '请上传商品封面', type: 'warning'});
          return;
        }

        if (this.styles.length == 0) {
          this.$message({message: '款式不能为空', type: 'warning'});
          return;
        }

        this.goods.styles = this.styles;

        if (!this.banners || this.banners.length == 0) {
          this.$message({message: '请上传banner图', type: 'warning'});
          return;
        }

        if(!this.goods.styles[0].styleNumber || this.goods.styles[0].styleNumber.length == 0){
          this.goods.styles[0].styleNumber = "";
        }
        this.goods.banner = this.banners.join();
        this.goods.keywords = this.keywordsArray.join(",");

        this.http.postJson(this).url(this.config.goods.save_url).params(this.goods).request(
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

      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          if (response.data.code == 0) {

            uploader.initUpload(response.data.data, "uploadCover", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.cover = url;
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
              this.cover = url;
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
      removeBanner(banner) {
        this.$confirm('是否要移除图片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          let index = this.banners.indexOf(banner);
          if (index != -1) {
            this.banners.splice(index, 1);
          }
        }).catch(() => {
        });

      },
      editDetailInfo() {
        if (!this.goods.detailUrl) {
          let params = {
            title: "点赞商品详情",
            type: 1
          };
          this.http.postJson(this).url(this.config.articles.save_url).params(params).request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.goods.detailUrl = response.data.data.articleId;
              window.open("/editor/editor.html?articleId=" + this.goods.detailUrl, "_blank");
            },
            (error) => {
            }
          );
        } else {
          window.open("/editor/editor.html?articleId=" + this.goods.detailUrl, "_blank");
        }
      },
      findExpressTemplates() {
        this.http.get(this).url(this.config.expressTemplate.express_template_all_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.expressTemplates = response.data.data;
            }, (err) => {
            });
      },
      findCategroy() {
        this.http.get(this).url(this.config.categroy.categroy_list_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.categorys = response.data.data;
              this.selectedCategorys.forEach((selItem) => {
                this.fillFirstCategory(selItem);
              });
            }, (err) => {
            });
      },
      onFirstCategoryChange(selItem) {
        if (!this.initLoadSource) {
          selItem.secondCategoryId = null;
          this.fillSecondFirstCategory(selItem);
        }
        this.initLoadSource = false;
      },
      addCategory() {
        let newItem = {firstCategoryId: null, secondCategoryId: null, firstCategorys: [], secondCategorys: []};
        this.fillFirstCategory(newItem);
        this.selectedCategorys.push(newItem);
      },
      fillFirstCategory(selItem) {
        selItem.firstCategorys = [];
        this.categorys.forEach((item) => {
          if (item.parentId == null) {
            selItem.firstCategorys.push(item);
          }
        });
      },
      fillSecondFirstCategory(selItem) {
        selItem.secondCategorys = [];
        this.categorys.forEach((item) => {
          if (item.parentId == selItem.firstCategoryId) {
            selItem.secondCategorys.push(item);
          }
        });
      },
      delCategory(selItem) {
        let index = this.selectedCategorys.indexOf(selItem);
        this.selectedCategorys.splice(index, 1);
      },
      findAllProvider() {
        this.http.get(this).url(this.config.provider.provider_all_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.providers = response.data.data;
            }, (err) => {
            });
      },
      initStyleUpload() {
        if (!this.styleInit) {
          this.$nextTick(_ => {
            this.styleInit = true;
            uploader.initUpload(this.token, "uploadCoverStyleBtn", (url) => {
              console.log(url)
              this.currentStyle.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverStyle", (url) => {
              console.log(url)
              this.currentStyle.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
          });
        }
      },
      onAddStyle() {
        this.dialogFormVisible = true;
        this.currentStyle = {
          totalCount: "1",
          cover: "",
          name: "",
          price: "0",
          styles: [{styleNumber:""}],
          expressTemplateId: null,
          expressTemplateName: null
        };
        this.initStyleUpload();
      },
      confirmAddStyle() {
        if (!this.currentStyle.name || this.currentStyle.name.trim() == 0) {
          this.$message({message: '款式名称不能为空', type: 'warning'});
          return;
        }
        // if (!this.currentStyle.cover || this.currentStyle.cover.trim()==0) {
        //   this.$message({message: '请上传款式图片', type: 'warning'});
        //   return;
        // }
        if (this.currentStyle.price == "") {
          this.$message({message: '价格不能为空或格式错误', type: 'warning'});
          return;
        }
        if (this.currentStyle.price <= 0) {
          this.$message({message: '价格必须大于0', type: 'warning'});
          return;
        }
        if (!this.currentStyle.totalCount) {
          this.$message({message: '库存量不能为空', type: 'warning'});
          return;
        }
        if (this.currentStyle.totalCount <= 0) {
          this.$message({message: '库存量必须大于0', type: 'warning'});
          return;
        }
        if (!this.currentStyle.expressTemplateId || this.currentStyle.expressTemplateId.trim() == 0) {
          this.$message({message: "请选择运费模板", type: 'warning'});
          return;
        }
        var temps = this.expressTemplates.filter((item) => {
          return item.expressTemplateId === this.currentStyle.expressTemplateId;
        });
        this.currentStyle.expressTemplateName = temps.length > 0 ? temps[0].expressTemplateName : "--";

        let banners = this.$refs.style_uiv.getUrls();
        let banner = banners.join();
        this.currentStyle.banner = banner;

        // 是否是编辑状态
        if (this.currentStyle.state === "edit") {
          let source = this.currentStyle.source;
          source.name = this.currentStyle.name;
          source.cover = this.currentStyle.cover;
          source.price = this.currentStyle.price;
          source.styleNumber = this.currentStyle.styleNumber;
          source.totalCount = this.currentStyle.totalCount;
          source.expressTemplateId = this.currentStyle.expressTemplateId;
          source.expressTemplateName = this.currentStyle.expressTemplateName;
          source.banner = this.currentStyle.banner;
        } else {
          this.styles.push(this.currentStyle);
        }
        this.currentStyle = {};
        this.dialogFormVisible = false;
      },
      delStyle(style) {
        this.styles.splice(this.styles.indexOf(style), 1);
      },
      onEditStyle(style) {
        let proxyItem = jQuery.extend({}, style);
        proxyItem.source = style;
        proxyItem.state = "edit";
        this.currentStyle = proxyItem;
        this.$nextTick(_ => {
          let banner = this.currentStyle.banner;
          let banners = banner ? banner.split(",") : [];
          this.$refs.style_uiv.setUrls(banners);
        });
        this.dialogFormVisible = true;
        this.initStyleUpload();
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
