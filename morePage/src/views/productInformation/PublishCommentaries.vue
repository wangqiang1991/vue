<template>
  <div id="PublishCommentaries_Vue">
    <div class="lightUpStar">
      <p class="title">对该商品是否满意？</p>
      <p class="content">轻点星星进行评分</p>
      <div class="starBox">
        <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" track-by="index" @click="starClick(index)"></span>
        <!--性能优化 track-by 数据不改变时不会重新渲染-->
      </div>
    </div>
    <div class="commentArea">
      <textarea placeholder="写点什么？让更多的人关注这件商品…（选填）" maxlength="300" v-model="content"></textarea>
    </div>
    <div class="addPic">
      <ul>
        <li v-for="pic in pics" class="picBox">
          <img :src="pic" />
          <i @click="deleteImg(pic)">
            <img src="../../assets/img/delete.png" alt="删除图标">
          </i>
        </li>
      </ul>
      <div class="editPic" v-show="pics.length < 3">
        <img src="../../assets/img/add_img_btn.png" class="addPicBtn" @click="addPic" />
      </div>
    </div>
    <p class="maxPic">*最多可上传3张照片</p>
    <p class="submitBtn" @click="publishCommentaries">提交评价</p>
  </div>
</template>

<script>
  /** 
   * 从 file 域获取 本地图片 url 
   */
  import wx from 'weixin-js-sdk';

  function getFileUrl(obj) {
    let url;
    url = window.URL.createObjectURL(obj.files.item(0));
    return url;
  }

  export default {
    name: 'PublishCommentaries',
    data() {
      return {
        score: 5,
        content: '',
        localIds: [],
        uploadIndex: 0,
        pics: []
      }
    },
    created() {
      document.title = "发布评论"
    },
    mounted: function() {
      this.http.get(this).url('/app/api/auth/wx-config').request(function(response) {
        console.log(response.data.data)
        var res = response.data.data;
        wx.config({
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名,
          jsApiList: ["chooseImage", "previewImage", "uploadImage"]
        })
      });
      wx.ready(function() {});
      wx.error(function(res) {});
    },
    methods: {
      starClick(index) {
        console.log(index)
        this.score = index + 1;
      },
      deleteImg(pic) {
        var that  = this;
        for(var i = 0;i < this.pics.length;i++){
          if(that.pics[i] == pic){
            that.pics.splice(i,1)
          }
        }
      },
      //评论
      publishCommentaries() {
        var orderGoodsId = this.getParam('orderGoodsId');
        var goodsId = this.getParam('goodsId');
        var styleId = this.getParam('styleId')
        var user = JSON.parse(this.getUserData('user'));
        var memberId = user.memberId;
        //alert(this.pics[1])
        var imgstr = this.pics.join(',');
        //alert(imgstr)
        console.log(memberId)
        // if (!this.content || this.content.trim().length == 0) {
        //   this.$toast('评论不能为空');
        //   return;
        // };
        this.$indicator.open({
          spinnerType: 'fading-circle'
        });
        this.http.postJson(this).url('/app/api/order-comments').params({
          orderGoodsId: orderGoodsId,
          goodsId: goodsId,
          memberId: memberId,
          content: this.content,
          images: imgstr,
          star : this.score,
          styleId : styleId
        }).request(function(response) {
          this.$indicator.close();
          this.showSuccess('评论成功')
          console.log(response)
//        this.keep.go('/order_list.html',false);
          window.location.replace('/comment.html');
//        alert(response.data.data.images)
        }, function(err) {
          this.$indicator.close();
         // this.showMessage('评论失败')
        })
      },
      upload() {
        var that = this;
        wx.getLocalImgData({
          localId: this.localIds[this.uploadIndex], // 图片的localID
          success: function(res) {
            that.$indicator.open({
              spinnerType: 'fading-circle'
            });
            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            var base64Index = localData.indexOf("base64,");
            
            that.http.postJson(that).url('/app/api/uploader').params({
              fileStr: base64Index == -1 ? localData : localData.substr(base64Index + 7)
            }).request(function(response) {
              that.$indicator.close();
              //alert(response.data.data)
              that.pics.push(response.data.data);
              this.uploadIndex++;
              if(this.uploadIndex < this.localIds.length) {
                this.upload();
              } else {
                // 所有上传完
              }
            }, function(err) {
              that.$indicator.close();
              //that.showError('服务器繁忙')
            }, function(response) {
              that.$indicator.close();
              //that.showError(response.data.message);
            })
          }

        });
      },
      addPic() {
        var that = this;
        wx.chooseImage({
          count: 3 - that.pics.length, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
//          alert(localIds)
            that.localIds = localIds;
            that.uploadIndex = 0;
            that.upload();
          }
        });
      }
    },
    computed: { //计算属性
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for(let i = 0; i < integer; i++) {
          result.push("on");
        }
        while(result.length < 5) {
          result.push("off");
        }
        return result;
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/PublishCommentaries.scss';
</style>