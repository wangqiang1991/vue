<template>
  <div  class="upload_image_box">
    <el-progress v-show="imageUpload.uploading" type="circle" :percentage="imageUpload.percentage"></el-progress>

    <div v-show="imageUpload.cover && !imageUpload.uploading" class="el-upload el-upload--picture-card" :style="{'width':width+'px','height':height+'px'}">
      <img :id="id" title="点击修改图片" style="width:100%;height:100%;" :src="imageUpload.cover">
    </div>

    <div v-show="!imageUpload.cover && !imageUpload.uploading" >
      <div class="el-upload el-upload--picture-card" :style="{'width':width+'px','height':height+'px','line-height':height+'px'}"  :id="id + 'Btn'">
        <i class="el-icon-plus"></i>
      </div>
    </div>

  </div>
</template>

<script>
import uploader from '@/utils/uploader'
export default {
  name: 'uploadImageIndex',
  props:['id','width','height'],
  data() {
    return {
      imageUpload:{
        init:false,
        cover:null,
        uploading:false,
        percentage:0,
      },
    }
  },
  methods: {
    initUploadBtn(cover){
      this.imageUpload.cover = cover;
      this.initUpload();
    },
    setImage(cover) {
      this.imageUpload.cover = cover;
    },
    initUpload() {
      if (!this.imageUpload.init ) {
        this.$nextTick(_ => {
          this.imageUpload.init = true;
          this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
            if (response.data.code == 0) {
              let id = this.id;
              let btnId = this.id + 'Btn';
              
              uploader.initUpload(response.data.data, id, (url) => {
                this.imageUpload.percentage = 0;
                this.imageUpload.uploading = false;
                this.imageUpload.cover = url;
                this.$emit('uploadSuccess',{cover:url});
              }, (up, err, errTip) => {
                this.$message({message: errTip,type: 'error'});
                console.log(errTip)
              }, (up, file) => {
                console.log("percent is :" + file.percent);
                this.imageUpload.percentage = file.percent;
              }, (up, files) => {
                this.imageUpload.uploading = true;
              });

              uploader.initUpload(response.data.data, btnId, (url) => {
                this.imageUpload.percentage = 0;
                this.imageUpload.uploading = false;
                this.imageUpload.cover = url;
                this.$emit('uploadSuccess',{cover:url});
              }, (up, err, errTip) => {
                this.$message({message: errTip,type: 'error'});
                console.log(errTip)
              }, (up, file) => {
                console.log("percent is :" + file.percent);
                this.imageUpload.percentage = file.percent;
              }, (up, files) => {
                this.imageUpload.uploading = true;
              });
             
            } else {
              this.$message.error(response.data.message);
            }
          }, function (error) {
            this.$message.error(error);
          });

        });
      }
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.upload_image_box{
  
}
</style>
