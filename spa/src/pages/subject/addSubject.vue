<template>
  <div class="createPost-container">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <template>
          <el-button type="primary" @click="saveAndPush">保存并发布</el-button>
          <el-button v-if='!subject.subjectArticleId || (subject.subjectArticleId && subject.status == 2)' type="primary" @click="save">仅保存</el-button>
          <el-button @click="cancel">取 消</el-button>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px">基本信息</h1>
          </el-col>
          <el-col :span="21">
            <el-form-item label-width="80px" label="期刊标题:">
              <el-input type="text" size="large" style="width:600px" class="article-textarea" autosize
                        placeholder="请输入期刊标题" v-model="subject.title">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="期刊摘要:">
              <el-input v-model="subject.description" type="textarea" :autosize="{ minRows: 3, maxRows: 4}"
                        placeholder="请填写期刊摘要">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="期刊分类:">
              <el-select v-model="subject.articleTypeId" clearable filterable placeholder="请选择期刊分类">
                <el-option
                  v-for="item in articleTypes"
                  :key="item.typeName"
                  :label="item.typeName"
                  :value="item.typeId">
                </el-option>
              </el-select>
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


            <el-form-item label-width="80px" label="期刊封面:">
              <span style="color:#FF4949" type="text">建议尺寸为1024*520</span>
            </el-form-item>

            <el-form-item label-width="80px" label="">

              <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>

              <div v-show="subject.cover && !uploading" class="el-upload el-upload--picture-card">
                <img id="uploadCover" title="点击修改图片" style="width:180%; height:100%"
                     :src="subject.cover+'?imageView2/1/w/498/h/276'">
              </div>
              <div v-show="!subject.cover && !uploading" style="display:inline-block;">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="21">
            <el-form-item label-width="80px" label="详情描述:">
              <el-button type="text" @click="editDetailInfo">点击编辑详情</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </div>
    </el-form>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import uploader from '@/utils/uploader'
  import {formatDate} from '@/commons/date.js'

  export default {
    name: 'addSubject',
    components: {
      Sticky
    },
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
        percentage: 0,
        uploading: false,
        styleInit: false,
        token: null,
        dialogFormVisible: false,
        currentStyle: {},
        cover: "",
        loading: false,
        subject: {
          title: '',
          description: '',
          cover: '',
          detailId: '',
          articleTypeId: '',
          subjectArticleId:null
        },
        keywordsArray: [],
        inputVisible: false,
        inputValue: null,
        articleTypes: []
      }
    },
    mounted: function () {
      this.getUploadTokenInitUploadBtn();
      this.findArticleTypes();
    },
    methods: {
      reset() {
        this.subject = {
          title: '',
          description: '',
          cover: '',
          detailId: '',
          articleTypeId: '',
          subjectArticleId:null
        };

        this.keywordsArray = [];
      },
      cancel() {
        this.$emit('cancel');
        this.reset();
      },
      loadSource(source) {
        this.subject = $.extend({}, source);
        if (this.subject.keywords && this.subject.keywords.length > 0) {
          this.keywordsArray = this.subject.keywords.split(",");
        } else {
          this.keywordsArray = [];
        }
      },
      saveAndPush() {
        this.subject.push = true;
        this.submit(1);
      },
      save() {
        this.subject.push = false;
        this.submit(2);
      },
      submit(status) {
        //表单验证
        if (!this.subject.title || !this.subject.title.trim()) {
          this.$message({
            message: '期刊标题不能为空',
            type: 'warning'
          });
          return;
        }

        if (!this.subject.description || !this.subject.description.trim()) {
          this.$message({
            message: '期刊摘要不能为空',
            type: 'warning'
          });
          return;
        }

        if (!this.subject.detailId || !this.subject.detailId.trim()) {
          this.$message({
            message: '请编辑期刊期刊详情',
            type: 'warning'
          });
          return;
        }

        if (!this.subject.cover || this.subject.cover.trim() == 0) {
          this.$message({
            message: '请上传主题封面',
            type: 'warning'
          });
          return;
        }

        this.subject.keywords = this.keywordsArray.join(",");

        this.subject.status = status;
        this.http.postJson(this).url(this.config.subject.save_url).params(this.subject).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({
                message: response.data.message,
                id: response.data.id,
                type: 'error'
              });
              return;
            }

            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.reset();
            this.$emit('success');
          },
          (error) => {
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
      },

      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            uploader.initUpload(response.data.data, "uploadCover", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.subject.cover = url;
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
              this.subject.cover = url;
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

      editDetailInfo() {
        if (!this.subject.detailId) {
          let params = {
            title: "期刊期刊详情",
            type: 1
          };
          this.http.postJson(this).url(this.config.articles.save_url).params(params).request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({
                  message: response.data.message,
                  type: 'error'
                });
                return;
              }
              this.subject.detailId = response.data.data.articleId;
              window.open("/editor/editor.html?articleId=" + this.subject.detailId, "_blank");
            },
            (error) => {
            }
          );
        } else {
          window.open("/editor/editor.html?articleId=" + this.subject.detailId, "_blank");
        }
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
      findArticleTypes() {
        this.http.get(this).url(this.config.article_type.list_url).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.articleTypes = response.data.data;
          },
          (error) => {

          }
        );
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
