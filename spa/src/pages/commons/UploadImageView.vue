<template>
  <div :id="idPrefix + 'upload_images'">
    <el-table
      :data="images"
      width="100%"
      border>
      <el-table-column
        width="80"
        prop="name"
        label="图片">
        <template scope="scope">
          <div style="position: relative;">
            <img v-if="scope.row.result" :src="scope.row.result" :alt="scope.row.cover" style="width:50px; height:50px;margin-top: 10px;">
            <img v-else :src="scope.row.path+config.imgtmb._50" :alt="scope.row.cover" style="width:50px; height:50px;margin-top: 10px;">
            <el-progress v-show="!scope.row.path"
                         style="display:inline-block;position: absolute; left: 0px; top: 0px; z-index: 100;"
                         type="circle" width="50"
                         :percentage="scope.row.percent"></el-progress>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="图片地址">
        <template scope="scope">
          <span v-if="!scope.row.path">正在上传...</span>
          <a v-else :href="scope.row.path" class="el-button--text link-url"
             target="_blank"><span>{{scope.row.path}}</span></a>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        label="操作">
        <template scope="scope">
          <el-button type="text" size="small" @click="deleteImages(scope.row)">移除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拖拽排序" width="95">
        <template scope="scope">
          <icon-svg class='drag-handler' icon-class="drag"></icon-svg>
        </template>
      </el-table-column>
    </el-table>

    <el-col :span="3" :offset="21">
      <el-button :id="idPrefix + 'uploadImagesBtn'" style="margin-top:10px;margin-bottom:10px;" type="primary"
                 size="small" icon="plus">
        上传图片
      </el-button>
    </el-col>


  </div>
</template>
<script>
  import uploader from '@/utils/uploader'
  import Sortable from 'sortablejs'

  export default {
    props: {
      idPrefix: {
        type: String,
        default: "___"
      }
    },
    data() {
      return {
        images: [],
        sortable: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getUploadTokenInitUploadBtn();
      });
      this.setSort();
    },
    methods: {
      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            uploader.initMultiUpload(response.data.data, this.idPrefix + "uploadImagesBtn", (up, file, url) => {
              file.path = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
            }, (up, files) => {
              console.log("选择文件：", files);
              files.forEach((item, index) => {
                var reader = new FileReader();
                var self = this;
                reader.onload = (function (file) {
                  item.result = this.result;
                  item.path = null;
                  self.images.push(item);
                });
                reader.readAsDataURL(item.getNative());
              });
            });
            this.token = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      deleteImages(image) {
        let index = this.images.indexOf(image);
        this.images.splice(index, 1);
      },
      swapPosition(rootDom, oldIndex, newIndex) {
        if (oldIndex == newIndex) {
          return;
        }

        console.log("还原", oldIndex, newIndex)

        var oldDom = rootDom.children().eq(oldIndex);
        var newDom = rootDom.children().eq(newIndex);

        console.log(oldDom[0], newDom[0])

        if (oldIndex - newIndex > 0) {
          // 向上
          oldDom.insertBefore(newDom);
        } else {
          // 向下
          oldDom.insertAfter(newDom);
        }
      },
      setSort() {
        this.$nextTick(() => {
          const el = document.querySelectorAll('#' + this.idPrefix + 'upload_images .el-table__body-wrapper > table > tbody')[0];
          this.sortable = Sortable.create(el, {
            scroll: false,
            onEnd: evt => {
              console.log("交换", evt.oldIndex, evt.newIndex)
              this.swapPosition($(evt.from), evt.newIndex, evt.oldIndex);
              const tempIndex = this.images.splice(evt.oldIndex, 1)[0];
              this.images.splice(evt.newIndex, 0, tempIndex);
            }
          });
        });
      },
      getUrls() {
        let urls = [];
        this.images.forEach((item) => {
          urls.push(item.path);
        });
        return urls;
      },
      setUrls(urls) {
        this.images = [];
        urls.forEach((item) => {
          this.images.push({path: item});
        });
      }
    }
  }
</script>
