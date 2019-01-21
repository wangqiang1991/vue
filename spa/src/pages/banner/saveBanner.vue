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
            <el-form-item label-width="80px" label="活动标题:">
              <el-input type="text" size="large" class="article-textarea" autosize placeholder="请输入活动标题"
                        v-model="banner.title">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="活动摘要:">
              <el-input v-model="banner.description" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请填写活动摘要">
              </el-input>
            </el-form-item>

            <el-form-item label-width="80px" label="活动封面:">
              <span style="color:#FF4949" type="text">建议尺寸为1024*546</span>
            </el-form-item>


            <el-form-item label-width="70px">
              <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>
              <div v-show="banner.cover && !uploading" class="el-upload el-upload--picture-card" style="margin-right:2px;">
                <img id="uploadCover" title="点击修改图片" style="width:292%; height:100%" :src="banner.cover+'?imageView2/1/w/750/h/256'">
              </div>
              <div v-show="!banner.cover && !uploading" style="display:inline-block; margin-left:8px">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
            </el-form-item>

            <el-form-item label-width="80px" label="活动内容:">
              <el-button type="text" @click="editDetailInfo">编辑活动内容</el-button>
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
    mounted: function () {
      this.getUploadTokenInitUploadBtn();
    },
    data() {
      return {
        percentage:0,
        uploading:false,
        token: null,
        loading: false,
        banner: {cover : ""}
      }
    },
    methods:{
      cancel() {
        this.$emit('cancel');
        this.reset();
      },

      reset() {
        this.banner = {cover : ""};
      },

      loadSource(item) {
        this.banner = $.extend({},item);
      },

      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            uploader.initUpload(response.data.data, "uploadCover", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.banner.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            },(up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });
            uploader.initUpload(response.data.data, "uploadCoverBtn", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.banner.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            },(up, file) => {
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
        if (!this.banner.detailId) {
          let params = {
            title:"活动详情",
            type:1
          };
          this.http.postJson(this).url(this.config.articles.save_url).params(params).request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.banner.detailId = response.data.data.articleId;
              window.open("/editor/editor.html?articleId=" + this.banner.detailId, "_blank");
            },
            (error) => {}
          );
        } else {
          window.open("/editor/editor.html?articleId=" + this.banner.detailId, "_blank");
        }
      },

      save() {
        var validate = this.saveValidate();
        if (validate) {     //表单验证通过

          var loadingInstance = Loading.service({text: '数据提交中...'});

          this.http.postJson(this).url(config.banner.banner_save_url).params(
            this.banner
          ).request(function (response) {
            loadingInstance.close();
            console.log(response);
            if (response.data.code == 0) {
              this.$message({message: '保存活动成功', type: 'success'});
              this.reset();
              this.$emit('success');
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

        if (!this.banner.title || !this.banner.title.trim()) {
          this.$message({message: '活动标题不能为空', type: 'warning'});
          return false;
        }

        if (!this.banner.description || !this.banner.description.trim()) {
          this.$message({message: '活动摘要不能为空', type: 'warning'});
          return false;
        }

        if (!this.banner.cover || !this.banner.cover.trim()) {
          this.$message({message: '请上传活动封面', type: 'warning'});
          return false;
        }

        if (!this.banner.detailId || !this.banner.detailId.trim()) {
          this.$message({message: '请编辑活动详情', type: 'warning'});
          return false;
        }
        return true;
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
