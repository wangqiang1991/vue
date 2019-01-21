<template>
  <div id="article_vue">
    
    <!-- 加载动画 -->
    <!-- <div id="loademoreimg" v-show="loading" class="loademoreimg" style="text-align: center; margin-top: 70%;position:fixed;top:0;left:0;">
      <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
    </div> -->
  
    <img src="../../assets/img/go_to_home_icon.png" alt="go_to_home" id="goHome" @click="goToHome" v-if="showGoHome" style="position:fixed;bottom:0.6rem;right:0.15rem;width:0.64rem;height:0.64rem;">

    <div class="main" v-show="!loading">

      <div class="header">
          <img :src="subjectArticle.cover+ '?imageView2/0/w/1024/h/568|imageslim'" >
          <b>{{subjectArticle.title}}</b>
          <p>发布于{{subjectArticle.createdAt | parseTime('{y}-{m}-{d}')}}</p>
      </div> 

      <article-content ref="articleContent" class="content"></article-content>

      <div class="collect" @click="addCollect" v-if="showCollect" v-show="timeoutShow">
      	<img src="../../assets/img/new_product_collect_default.png"/>
      	<p>收藏</p>
      </div>
      <div class="collect" @click="cancelCollect"  v-else  v-show="timeoutShow">
        <img src="../../assets/img/new_product_collect_select.png"/>
        <p>已收藏</p>
      </div>

    </div>

    <p style="width:100%;height:0.1rem;background:#F2f2f2;" v-show="timeoutShow"></p>
    
    <div class="comment" v-show="!loading && timeoutShow">
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="noMore" infinite-scroll-distance="20">

        <p class="comment_title">{{commentariesNum}}条评论 </p>

        <div v-for="n in CommentariesContent">
          <div class="user_comment">
            <img :src="n.head ? n.head+ '?imageView2/0/w/320/h/320|imageslim' : '/static/images/defalt_uer_image.png'">
            <div class="right">
              <p class="user_head">{{n.nickName}}</p>
              <time>{{n.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</time>
              <p class="user_content"> {{n.content}} </p>
            </div>
          </div>
        </div>

        <div id="load" v-if='loadingMore'>
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

         <div id="reload" v-show='reloadflag' @click='reloadData()'>
            加载失败,点击重新加载
        </div>

        <div  v-show='noData && CommentariesContent.length' style="width:100%;background:white;padding:0.2rem 0;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
        </div>

        <div id="nogoogs" v-show="!firstLoad && !CommentariesContent.length"  style="width:100%;background:white;padding:0.16rem 0 0.16rem;">
          <img src="../../assets/img/noGoodsComment.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
          <p style="font-size:0.12rem;color:#ddd;text-align:center;">还没有评论 <br> 快来互动吧</p>
        </div>

      </div>
    </div>

    <div id="release">
      <input type="text" maxlength="300" placeholder="写评论" @focus="inputFocus" @blur="inputBlur" id="comment_input" v-model="content" >
      <p @click="surePublish">发布</p>
    </div>

    <firstLoad :firstLoad='firstLoad' :type="1"></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>

  import firstLoad from '../../components/firstLoadNormal.vue';
  import ArticleContent from '../../components/contentV2.vue'
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'article',
    components: {
      loadFailed:loadFailed,
      ArticleContent,
      firstLoad:firstLoad
    },
    created() {
      document.title = "期刊详情";
    },
    mounted() {
      this.showGoHome = this.getParam('showGoHome') == '1' ? false : true;
      var subjectArticleId = this.getParam('subjectArticleId');
      if (subjectArticleId) {
        this.loadDetail(subjectArticleId);
        this.subjectArticleId = subjectArticleId;
      }
      // var timer = setInterval(function () {
      //   if ($('.main').height() != 0) {
      //     clearInterval(timer);
      //     $(document).scroll(function () {
      //       let top = document.body.scrollTop || document.documentElement.scrollTop;
      //       if (top > $('.main').height() - 1000) {
      //         $("#release").css("display", "block");
      //       } else {
      //         $("#release").css("display", "none");
      //       }
      //     })
      //   }
      // }, 500)
    },
    data() {
      return {
        showGoHome:true,
        timeoutShow:false,
        noData:false,
        loadFailed:false,
        firstLoad:true,
        reloadflag:false,
        subjectArticle: {},
        loading: true,
        loadingMore: false,
        publish: false,
        content: "",
        subjectArticleId: "",
        pageIndex: 1,
        pageSize: 10,
        commentariesData: [],
        CommentariesContent: [],
        noMore: false,
        commentariesNum: "",
        showCollect: true,
        scrollTop:0,
        showIframe:false,
      }
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.loadDetail(this.getParam('subjectArticleId'));
        this.initCommentaries(this.subjectArticleId, this.pageIndex, 10);
      },
      goToHome() {
        this.keep.go('/category2.html',false);
      },
      inputFocus() {
        this.scrollTop = document.body.scrollTop;
        document.body.scrollTop = document.body.scrollHeight;
      },
      inputBlur() {
        document.body.scrollTop = this.scrollTop;
      },
      reloadData(){
        this.noMore = false;
        this.reloadflag = false;
      },
      /*收藏*/
      addCollect(){
        let subjectId = this.getParam("subjectArticleId");
        this.http.post(this).url(this.config.subject.addCollect).params({
          subjectId:subjectId
        }).request(function(response){
          console.log(response)
          this.showSuccess('收藏成功')
          this.showCollect = false;
        },function(err){
         console.log(err);
        })
      },
      /*取消收藏*/
      cancelCollect() {
        let subjectId = this.getParam("subjectArticleId");

        this.http.delete(this).url(this.config.collect.cancel_subject).restful({ subjectId:subjectId}).request(function(response) {
          this.showSuccess('已取消收藏')
          this.showCollect = true;
          }, function(err) {console.log(err)}
        )

      },
      loadDetail(subjectArticleId) {
        this.loading = true;
        this.http.get(this).url(this.config.subject.load_url).restful({
          subjectArticleId: subjectArticleId
        }).request((response) => {
          this.loading = false;
          this.firstLoad = false;
          this.commentariesNum = response.data.data.commentAmount;
          var data = response.data.data;
          if(data.collection == true){
            this.showCollect = false
          }else{
            this.showCollect = true;
          }
          if (response.data.code != 0) {
            return;
          }
          var that = this;
          setTimeout(function () {
            that.timeoutShow = true;
          }, 1500);
          this.subjectArticle = response.data.data;
          this.$refs.articleContent.loadContent(this.subjectArticle.article.articleId);
        },(err)=>{
          this.loadFailed = true;
          this.firstLoad = false;
        });
      },
      initCommentaries(subjectArticleId, pageIndex, pageSize) {
        this.loadingMore = true;
        this.http.get(this).url(this.config.subject.subject_comment).restful({
          subjectArticleId: subjectArticleId
        }).params({
          pageIndex: pageIndex,
          pageSize: pageSize
        }).request((response) => {
          var req = response.data.data;
          req.forEach((n) => {
            this.CommentariesContent.push(n);
          })
          this.loadingMore = false;
          if (req.length != 0) {
            this.pageIndex++;
            this.noMore = false;
          } else {
            this.noData = true;
            this.noMore = true;
          }
        },(err)=>{
          if(pageIndex == 1){
            this.loadFailed = true;
          }
          this.reloadflag = true;
          this.loadingMore = false;
        })

      },
      submitCommentaries(subjectArticleId) {
        if(!this.getUserData("user")){
          this.showError("请先登录");
          return ;
        }
        var memberId = JSON.parse(this.getUserData("user")).memberId;
        this.http.postJson(this).url(this.config.subject.submiit_comment).params({
          memberId: memberId,
          subjectArticleId: this.subjectArticleId,
          content: this.content
        }).request( (data) => {
          if (data.data.data != 0) {
            this.showSuccess("评论成功")
            this.CommentariesContent.unshift(data.data.data);
            this.content = "";
            this.commentariesNum++;
            var y1 = $(".comment").offset().top;
            $(window).scrollTop(y1);
          }
        },(err)=>{console.log(err) })
      },
      loadMore() {
        this.noMore = true;
        this.initCommentaries(this.subjectArticleId, this.pageIndex, 10);
      },
      choice() {
        this.publish = !this.publish;
        $("#release").css("margin-bottom", "1.2rem");
        $(".comment").css("margin-bottom", "1.8rem");
        $('textarea').focus();
      },
      cancelPublish() {
        this.publish = !this.publish;
        $("#release").css("margin-bottom", "0");
        $(".comment").css("margin-bottom", "0.8rem");
        $('textarea').blur();
      },
      surePublish() {
        if (this.content == "") {
          this.showError("评论的内容不能为空");
          return;
        }
        this.submitCommentaries();
      },
    }

  }
</script>

<style lang='scss'>
  @import '../../assets/scss/article.scss';
  #article_vue {
  .header{
    width:3.75rem;
    height:auto;
    margin-bottom:0.2rem;
    >img{
      width:100%;
      display:block;
      height:2.08rem;
      margin-bottom:0.2rem;
    }
    >b{
      width:3.35rem;
      display:block;
      margin:auto;
      font-size:0.2rem;
      color:#343434;
    }
    >p{
      width:3.35rem;
      margin:0.05rem auto 0;
      padding-bottom:0.2rem;
      color:#cacaca;
      font-size:0.12rem;
      border-bottom:1px solid #ddd;
    }
  }
  #loademoreimg {
    width: 100%;
    height: auto;
    text-align: center;
  }

  .show {
    display: none;
  }

  .loademoreimg {
    display: block;
  }

  #loademoreimg span {
    display: block;
    margin: auto;
  }

  #loademoreimg span div {
    margin: auto;
    display: flex;
    align-items: center;
    height: 0.5rem;
    width: 0.6rem;
  }

  #loademoreimg p {
    color: #999;
    font-size: 0.14rem;
    text-align: center;
  }
  #reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }

  }
</style>
