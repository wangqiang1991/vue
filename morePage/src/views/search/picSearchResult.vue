<template>
  <div id="picSearchResult_vue">
    <Vheader type="4" v-bind:word="keyword" @keyword='picSearchResult'></Vheader>
    <div class="spaceArea"></div>


    <div v-show="!emptyResult">
      <div class="content" v-infinite-scroll="getPic" infinite-scroll-disabled="loading" infinite-scroll-distance="10" >
  
        <img v-for="pic in picArray"  v-lazy="pic.detail.cover+ '?imageView2/0/w/500/h/500|imageslim'" @click="gotoScene(pic)">
        <!-- @touchcancel='onCancel(pic)' @touchstart='onTouchstart(pic)' @touchend='onTouchend(pic)' :class="{'imgactive':pic.imgactive}"> -->
  
      </div>


      <div id="load" v-show='loadingMore'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>
      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>
      
       <div v-show="showMore" style="width:100%;background:white;padding:0.2rem 0;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>

    </div>

    <div class="emptyArea" v-show="emptyResult">
      <div>
        <img src="../../assets/img/find_noData.png" class="noResult"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
        <p style="font-size:0.16rem;color:#ddd;text-align:center;">世界上最遥远的距离<br> 莫过于你知道我而我不知道你</p>
      </div>
    </div>

    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <firstLoad :firstLoad='firstLoad'></firstLoad>

  </div>
</template>

<script>
  import Header from '../../components/Header.vue';
  import Load from '../../components/Loading.vue';

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'picSearchResult',
    components: {
      Vheader: Header,
      Vload: Load,
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
       firstLoad:true,
       loadFailed:false,
       reloadflag:false,
       picArray:[],
        keyword:'',
        loading: false,
        dataload: false,
        scorllload: false,
        time:0,
        top:0,
        pageIndex:1,
        pageSize:8,
        loadingMore:false,
        emptyResult:false,
        showMore:false
      }
    },
    created() {
      document.title = "搜索结果"
    },
    mounted: function() {
      $('.emptyArea').css({'height': document.documentElement.clientHeight});
      this.keyword = this.getParam('keyword');
      if(this.keep.isKeepAlive()){
        this.firstLoad = false;
        this.picArray = this.keep.cache.get('picArray');
        this.pageIndex = this.keep.cache.get('pageIndex');
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.firstLoad = true;
        this.keep.cache.remove('picArray');
        this.keep.cache.remove('pageIndex');
      }
     
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.getPic();
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      picSearchResult(data){
        console.log('------------')
        console.log(data);
        this.picArray = [];
        for(var i = 0;i < data.length-1;i++){
          this.picArray.push(data[i]);
        }
        this.keyword = data[data.length-1].keyword;
        console.log(this.keyword);
        this.pageIndex = 2;
        this.loading = false;
//      data.forEach((n) => {
//        this.productArray.push(n);
//      })
        console.log(this.picArray)
        if(this.picArray.length == 0 && data.length == 1) {
          this.emptyResult = true;
        }else{
          this.emptyResult = false;
        }
      },
      getPic(){
         this.loading = true;
         this.loadingMore = true;
       
        this.http.get(this).url(this.config.find.picture).params({
          keyword:this.keyword,
          pageIndex:this.pageIndex,
          pageSize:this.pageSize,
          loadDetail:true
        }).request(function(response){
          this.firstLoad = false;
          if(response.data.code != 0){
            return;
          }
          console.log(response)
          var data = response.data.data;

          this.loadingMore = false;

          if(data.length == 0){
            this.loading = true;
            this.showMore = true;

          }else{
            this.loading = false;
            this.pageIndex++;
          }

          for(var i = 0;i < data.length;i++){
            data[i].imgactive = false;
          }
          data.forEach((n) => {
            this.picArray.push(n);
          })

           if(this.picArray.length == 0 && data.length == 0){
            this.emptyResult = true;
          }

          this.keep.cache.push('picArray',this.picArray);
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
      onTouchstart (e){
        var top =  window.event.changedTouches[0].clientY
       // var top = document.body.scrollTop || document.documentElement.scrollTop;
       // console.log(top)
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.picArray.length;i++){
          this.picArray.imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)

        // setTimeout(function(){
        //    this.time = 200;
           
        // }.bind(this),200)
      },
      onTouchend:function(e){
        console.log(window.event)
       // var top = document.body.scrollTop || document.documentElement.scrollTop;
       // console.log(top)
        var top =  window.event.changedTouches[0].clientY
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
//        this.keep.scroll.save();
          console.log(e)
          this.keep.scroll.save();
          this.keep.go('/newscene.html',true,{sceneId:e.detail.sceneId,keyword:this.keyword,pageIndex:this.pageIndex-1,type:8})
        })
        
       }else{
        e.imgactive = false;
       }
      },
      gotoScene(e) {
        console.log(e)
        this.keep.scroll.save();
        this.keep.go('/newscene.html',true,{sceneId:e.detail.sceneId,keyword:this.keyword,pageIndex:this.pageIndex-1,type:8})
      },
      onCancel (e){
        e.imgactive = false;
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/picSearchResult.scss';
  #picSearchResult_vue{
     #header_vue{
    .logo{
      opacity:0;
      display:none;
    }
    .shopcat{
      opacity:0;
      display:none;
    }
    .searchArea{
      //border-radius:0.15rem;
      position:absolute;
      width:3.4rem;
      left:0.175rem;
    }

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