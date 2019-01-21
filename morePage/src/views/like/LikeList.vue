<template>
  <div id="LikeList_Vue" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <div class="likeBox" @click="goDetails(praise)" v-for="praise in praiseArr" v-show="!showEmpty">
    	<p class="time">{{praise.praiseCommentsVos[0].createdAt | parseTime('{y}.{m}.{d}')}}</p>
    	<div class="contentBox">
    		<img :src="praise.cover + '?imageView2/0/w/500/h/500|imageslim'"/>
    		<div class="right">
    			<p class="contentTitle">{{praise.title}}</p>
    			<p class="contentProduce">{{praise.description}}</p>
    		</div>
    	</div>
    	<div class="labelBox">
    	  <p class="label" v-for="tag in praise.praiseCommentsVos[0].tagVos" v-if="praise.praiseCommentsVos[0].tagVos.length != 0">{{tag.title}}</p>
    	  <div class="clear"></div>
    	</div>
    	<p class="comments" v-if="praise.praiseCommentsVos[0].replayContent != ''">“{{praise.praiseCommentsVos[0].replayContent}}”</p>
    	<p class="likeNum">已有{{praise.praiseCount}}人喜欢</p>
    </div>

      <div id="load" v-if='loadingMore'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>
      
      <div  v-show='noMoreData && praiseArr.length' style="width:100%;padding:0.2rem 0;">
        <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>


      <div class="noLike" v-show="!firstLoad && !praiseArr.length">
        <div>
        	<img src="../../assets/img/noDataLike.png"/>
        	<p style="color:#ddd;font-size:0.16rem;">没有喜欢何来的爱</p>
        </div>
      </div>

      <div class="spaceArea"></div>

      <firstLoad :firstLoad='firstLoad'></firstLoad>
      <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>
<script>
  
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'LikeList',
    created() {
      document.title="我的喜欢"
    },
    data() {
      return {
        noMoreData:false,
        firstLoad:true,
        reloadflag:false,
        praiseArr:[],
        pageIndex:1,
        pageSize:3,
        loading: false,
        loadingMore: false,
        showEmpty:false
      }
    },
    mounted: function () {
      if(this.keep.isKeepAlive()){
        this.firstLoad = false;
        this.praiseArr = this.keep.cache.get('praiseArr');
        var tags = this.keep.cache.get('tags');
        this.pageIndex = this.keep.cache.get('pageIndex');
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear(LikeList_Vue);
        });
      }else{
        this.firstLoad = true;
        this.keep.cache.remove('tags');
        this.keep.cache.remove('tagsArr');
        this.keep.cache.remove('pageIndex');
        //this.laodDetail();
      }
    },
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.loadMore(); 
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      loadMore(){
        this.loading = true;
        this.loadingMore = true;
        this.http.get(this).url('/app/api/praise-goods/find-by-comment').params({
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        }).request(function(response){
          this.firstLoad = false;
          var data = response.data.data;
          data.forEach((n) => {
            this.praiseArr.push(n)
            this.keep.cache.push('praiseArr',this.praiseArr)
            var tags = [];
            if(n.praiseCommentsVos[0].tagVos.length == 0){
              tags = [];
            }else{
              tags = n.praiseCommentsVos[0].tagVos;
            }
            this.keep.cache.push('tags',tags)
          })
          if(data.length){
            this.pageIndex++;
            this.loading = false;
            this.loadingMore = false;
            
          }else{
            this.noMoreData = true;
            this.loading = true;
            this.loadingMore = false;
          }
          this.keep.cache.push('pageIndex',this.pageIndex);
        },(err)=>{
          if(this.pageIndex == 1){
            this.loadFailed = true;
          }
          this.firstLoad = false;
          this.reloadflag = true;
          this.loadingMore = false;
        })
      },
      goDetails(e){
        console.log(this.keep)
        console.log(e)
        this.keep.scroll.save(LikeList_Vue);
        this.keep.go('/like_details.html',true,{goodsid:e.goodsId})
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/LikeList.scss';
   #reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }
</style>