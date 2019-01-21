<template>
  <div id="PublishCommentaries_Vue">

    <div class="lightUpStar"  style="height:0.5rem">
      <p class="title">我的评论</p>
      <div class="starBox" style="top:0.16rem;">
        <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" track-by="index"></span>
      </div>
    </div>

    <div class="commentArea">
      <textarea  :value='content' disabled="disabled" style="background: #FFFFFF;height: 1.1rem;"></textarea>
    </div>

    <div class="addPic" v-show='imgData.length != 0' style="position: relative;">
      <ul style="overflow: hidden;position: absolute;margin: auto;top: 0;left: 0.1rem;right: 0;bottom: 0;height: 0.58rem;">
        <li  class="picBox" id="picBox"> 
          <img :src="img + '?imageView2/0/w/500/h/500|imageslim'" v-for='img in imgData' @click='previewImage(img)'/>
        </li>
      </ul>
    </div>
  

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
 
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'CommentContent',
     components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
       score:5,
       content:'',
       relationId:null,
       imgData:[]
      }
    },
    created() {
      document.title = "我的评论"
    },
    mounted: function() {
      let relationId = this.getParam('relationId');
      this.relationId = relationId;
      this.loadOrderDetail();
    },
    methods:{
      reload() {
        this.loadFailed =false;
        this.loadOrderDetail();
      },
      loadOrderDetail() {
        this.http.get(this).url("/app/api/order-comments/detail/:orderGoodsId").restful({
          orderGoodsId:this.relationId
        }).request( (req)=> {
          this.firstLoad =false;
          console.log(req)
          if(req.data.code != 0){
            //this.showError(req.data.message);
            return ;
          }
          let data = req.data.data;
          this.score = data.star;
          this.content = data.content;
          if(data.images != ''){
            this.imgData = data.images.split(',');
          }
          console.log(this.imgData)

        },(err)=>{
          this.loadFailed = true;
          this.firstLoad =false;
          //this.showError(err)
        })  
      },
      previewImage(img){
        this.wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: this.imgData // 需要预览的图片http链接列表
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
<style lang='scss'>
  #PublishCommentaries_Vue{
    #picBox{
    width:100%;
    margin:0;
    overflow:hidden;
    >img{
      width:0.58rem;
      height:0.58rem;
      margin-right:0.1rem;
    }
  }
  } 
</style>