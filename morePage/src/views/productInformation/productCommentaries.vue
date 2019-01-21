<template>
  <div id="productCommentaries_Vue">
    <div class="content">
      <div class="widget widget-tab">
        <input type="radio" name="widget-tab" id="allAppraise" checked="checked" />
        <input type="radio" name="widget-tab" id="contentAppraise" />
        <input type="radio" name="widget-tab" id="picAppraise" />
        <div class="widget-title inline-block tabs">
          <ul style="float: left;">
            <li class="allAppraise" @click = "showTable(0)">
              <label for="allAppraise">全部评价({{allCommentNumber}})</label>
            </li>
            <li class="picAppraise" @click = "showTable(1)">
              <label for="picAppraise">带图评价({{pictureCommentNumber}})</label>
            </li>
          </ul>
        </div>
        <div class="widget-box">

          <ul class="allAppraise-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <div v-show="!firstLoad && !commentsArray.length" style="width:100%;background:white;padding:1rem 0 0;">
              <img src="../../assets/img/noGoodsComment.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
              <p style="font-size:0.16rem;color:#ddd;text-align:center;">此商品还没有巢客晒单哦</p>
            </div>
            <li>
              <div class="mainContent" v-for="n in commentsArray">
                <img :src="n.memberVo.head ? n.memberVo.head+ '?imageView2/0/w/320/h/320|imageslim' : '/static/images/defalt_uer_image.png'" class="head" />
                <p class="userName">{{n.memberVo.nickName}}</p>
                <div class="starBox">
                  <span v-for="(itemClass,index) in itemClasses(n.star)" :class="itemClass" class="star-item" track-by="index"></span>
                </div>
                <p class="information">
                  <span class="time">{{n.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                  <!-- <span class="size">{{n.goodsStyleVo.name}} </span> -->
                </p>
                <p class="appraiseContent">
                  {{n.content}}
                </p>
                <div class="appraisePic" v-show="n.imgData.length != 0">
                  <img v-for='img in n.imgData' :src="img + '?imageView2/2/w/500/h/500|imageslim'" @click="preview(n.imgData, img)" />
                </div>
              </div>
            </li>

            <div class="load" v-show = "commentLoad">
                <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
            </div>

            <div class="reload" v-show='reloadflag' @click='reloadData()'>
              加载失败,点击重新加载
            </div>

            <div v-show="noCommentaries && commentsArray.length" style="width:100%;background:white;padding:0.2rem 0;">
              <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
            </div>

          </ul>

          <ul class="picAppraise-list" v-infinite-scroll="loadMore1" infinite-scroll-disabled="loading1" infinite-scroll-distance="10">
            <div v-show="!firstLoad && !havePicArr.length"  style="width:100%;background:white;padding:1rem 0 0;">
              <img src="../../assets/img/noGoodsComment.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
              <p style="font-size:0.16rem;color:#ddd;text-align:center;">此商品还没有巢客晒图哦</p>
            </div>

            <li>
              <div class="mainContent" v-for="n in havePicArr" v-show="n.imgData.length !== 0">
                <img :src="n.memberVo.head ? n.memberVo.head+ '?imageView2/0/w/320/h/320|imageslim' : '/static/images/defalt_uer_image.png'" class="head" />
                <p class="userName">{{n.memberVo.nickName}}</p>
                <div class="starBox">
                  <span v-for="(itemClass,index) in itemClasses(n.star)" :class="itemClass" class="star-item" track-by="index"></span>
                </div>
                <p class="information">
                  <span class="time">{{n.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                  <!-- <span class="size">{{n.goodsStyleVo.name}} </span> -->
                </p>
                <p class="appraiseContent">
                  {{n.content}}
                </p>
                <div class="appraisePic" v-show="n.imgData.length != 0">
                  <img v-for='img in n.imgData' :src="img+ '?imageView2/0/w/500/h/500|imageslim'" @click="preview(n.imgData, img)"/>
                </div>
              </div>
            </li>

            <div class="load" v-show = "pictureLoad">
                <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
            </div>
            
            <div class="reload" v-show='reloadflag1' @click='reloadData1()'>
                加载失败,点击重新加载
            </div>

            <div v-show="noPicData && havePicArr.length" style="width:100%;background:white;padding:0.2rem 0;">
              <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
            </div>

          </ul>


        </div>
      </div>
    </div>

    
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad'></firstLoad>  

  </div>
</template>

<script>

import loadFailed from '../../components/loadFailed.vue';
import firstLoad from '../../components/firstLoad.vue';

  export default {
    created() {
      document.title = "商品评价"
    },
    activated() {
      document.title = "商品评价";
    },
    components: {
     loadFailed:loadFailed,
     firstLoad:firstLoad,
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        commentLoad:false,
        pictureLoad:false,
        reloadflag:false,
        reloadflag1:false,
        pageSize: 10,
        pageIndex: 1,
        pageIndex1:1,
        commentsArray: [],
        noCommentsArray:false,
        imageArray: [],
        score: 0,
        loading: false,
        loading1:true,
        noCommentaries: false,
        noPicData:false,
        havePicArr:[],
        noHavePicArr:false,
        noPicCommentaries:false,
        typeFirstLoad:true,
        allCommentNumber:0,
        pictureCommentNumber:0,
      }
    },
    mounted: function() {
      this.getPicture();
    },
    methods: {
      reload(){
        this.loadFailed = false;
        this.getPicture();
        this.getCommentaries()
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      reloadData1(){
        this.reloadflag1 = false;
        this.loading1 = false;
      },
      preview(imgData, img) {
        this.wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: imgData // 需要预览的图片http链接列表
        });
      },
      showTable(type) {
        if(type == 0){
          this.loading = false;
          this.loading1 = true;
        }else{
          this.loading1 = false;
          this.loading = true;
          this.typeFirstLoad = false;
        }
        this.firstLoad = true;
      },
      getCommentaries() {
      
        let goodsId = this.getParam('goodsid');
        this.goodsId = goodsId;
        this.http.get(this).url(this.config.goods.goods_comment).restful({
          goodsId: this.goodsId
        }).params({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          image:false
        }).request(function(response) {
          this.firstLoad = false;
          this.commentLoad = false;
          var data = response.data.data;
          if(data.totalSize > 999) {
            this.allCommentNumber = "999+";
          } else {
            this.allCommentNumber = data.totalSize;
          }
          
          if(data.data.length == 0){
            this.noCommentaries = true;
            this.loading = true;
          }else{
            this.loading = false;
            this.pageIndex++;
          }

          for(var i = 0; i < data.data.length; i++) {
            if(data.data[i].images != '' && data.data[i].images != null) {
            data.data[i].imgData = data.data[i].images.split(',');
            } else {
               data.data[i].imgData = [];
            }
            //data.data[i].name = this.nameVisblity(data.data[i].memberVo.nickName);
            this.commentsArray.push(data.data[i]);
            }
            if(this.commentsArray.length == 0){
              this.noCommentsArray = true;
            }
        },(err)=>{
          if(this.pageIndex == 1){
            this.loadFailed = true;
          }
          this.firstLoad = false;
          this.reloadflag = true;
          this.commentLoad = false;
        })
      },
      getPicture () {
         this.http.get(this).url(this.config.goods.goods_comment).restful({
          goodsId: this.getParam('goodsid')
        }).params({
          pageIndex: this.pageIndex1,
          pageSize: this.pageSize,
          image:true
        }).request(function(response) {
          this.firstLoad = false;
          var data = response.data.data;
          if(data.totalSize > 999){
            this.pictureCommentNumber = "999+"
          } else {
            this.pictureCommentNumber = data.totalSize;
          }
          
          this.pictureLoad = false;  
          if(data.data.length == 0){
            this.noPicData = true;
            this.loading1 = true;
          }else{
            this.pageIndex1++;
            if(this.typeFirstLoad){
              this.loading1 = true;
            }else{
              this.loading1 = false;  
            }
          }
        
          for(var i = 0; i < data.data.length; i++) {
              if(data.data[i].images != '' && data.data[i].images != null) {
              data.data[i].imgData = data.data[i].images.split(',');
              } else {
                 data.data[i].imgData = [];
              }
              //data.data[i].name = this.nameVisblity(data.data[i].memberVo.nickName)
              this.havePicArr.push(data.data[i]);
            }
            if(this.havePicArr.length == 0){
              this.noHavePicArr = true;
            }
          
        },(err)=>{
          if(this.pageIndex1 == 1){
            this.loadFailed = true;
          }
          this.firstLoad = false;
          this.reloadflag1 = true;
          this.pictureLoad = false;
        })
      },
      loadMore() {
        this.loading = true;
        this.getCommentaries();
        this.commentLoad = true;
        this.noCommentsArray = false;
      },
      loadMore1() {
        this.noHavePicArr = false;
        this.pictureLoad = true;
        this.loading1 = true;
        this.getPicture();
      },
      nameVisblity(name) {
            var name = name;
            var _name = '';
            var nameLength = name.length;
            if(nameLength > 2) {
              var nameLength = nameLength - 2;
              while(nameLength > 0) {
                _name += "*";
                nameLength--;
              }
              name = name.substr(0, 1) + _name + name.substr(name.length - 1, name.length);
            }
           return name;
      },
      itemClasses(star) {
        let result = [];
        let score = Math.floor(star * 2) / 2;
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
    },
    computed: { //计算属性

    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/productCommentaries.scss';
   .reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }
  .load{
    width:100%; 
    height:0.5rem;
    display:flex;
    align-items: center;
    >span{
        width:100%;
        display:block;
        text-align:center;
    }
    div{
      width:0.5rem;
      margin:auto;
      height:0.5rem;
      display:flex;
      align-items: center;
    }
  }
</style>
