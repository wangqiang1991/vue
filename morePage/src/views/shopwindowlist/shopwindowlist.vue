<template>
  <div id="cclist_vue">

  <!--   <div id="content"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="0">
      <div v-for='n in spacedata'  @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)'>
        <img v-lazy="n.cover" :alt="n.name" :class="{'imgactive':n.imgactive}">
      </div>
      <div id="load" v-show='loaddata'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>
      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>
    </div>
 -->

     <div class="recommends" 
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="20">
      <li  v-for="n in spacedata"  @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)' >
        <p>{{n.name}}<span>{{n.styleNames}}</span></p>
        <div :class="{'imgactive':n.imgactive}">
          <img v-lazy="n.cover+ '?imageView2/0/w/1024/h/1024|imageslim'">
        </div>
       </li>
        
       <div id="load" v-show='loaddata'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

      <div v-show='noData' id="noData">
        <img src="../../assets/img/photo_default.png">
          更多优质场景,敬请期待~
      </div>
    </div>

    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
import loadFailed from '../../components/loadFailed.vue';

export default{
  name:'cclist',
  data(){
    return{
      noData:false,
      reloadflag:false,
      loadFailed:false,
      thisVueName:'cclist',
      styleId:null,
      spacedata:[],
      loading:false,
      loaddata:false,
      pageSize:10,
      pageIndex:1,
      top:0,
      time:0
    }
  },
  components:{
    loadFailed:loadFailed
  },
  created(){
    document.title=this.getParam('name')
  },
  mounted:function(){
    //this.spacesearch(1)
    this.styleId = this.getParam('styleId');
    if(this.keep.isKeepAlive()) {
        this.spacedata = this.keep.cache.get('spacedata');
        this.pageIndex = this.keep.cache.get('pageIndex');
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.keep.cache.remove("spacedata");
        this.keep.cache.remove("pageIndex");  
      }
  },
  methods:{
    reloadData(){
      this.reloadflag = false;
      this.loading = false;
    },
    reload(){
      this.spacesearch(this.pageIndex);
      this.loadFailed = false;
    },
    spacesearch:function(pageIndex){
      console.log('pageIndex='+pageIndex)
      this.http.get(this).url('/app/api/space').params({pageIndex:pageIndex,pageSize:this.pageSize,styleId:this.styleId}).request((data) => {
          var req = data.data.data;
          this.loaddata = false;
          for(var i=0;i<req.length;i++){
            req[i].imgactive = false;
          }
          console.log(req)
          if(req.length == 0){
            this.loading = true;
          }else{
            this.pageIndex++;
            this.loading = false;
          }
          req.forEach( (n) => {
              this.spacedata.push(n)
          })
          if(this.spacedata.length == 0){
            this.noData = true;
          }else{
            this.noData = false;
          }
          this.keep.cache.push("pageIndex",this.pageIndex);
          this.keep.cache.push("spacedata",this.spacedata);
        },(err)=>{
          if(pageIndex == 1){
            this.loadFailed = true;
          }else{
            this.reloadflag = true;
          }
          this.loaddata = false;
        })
    },
    loadMore() {
       this.loading = true;
       this.loaddata = true;
       this.spacesearch(this.pageIndex);
     },
     onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.spacedata.length;i++){
          this.spacedata[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onTouchend:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
        this.keep.go('/shopwindowdetail2.html',true,{spaceId:e.spaceId,showGoHome:'1',cover:e.cover})
        })
        
       }else{
        e.imgactive = false;
       }
      },
    onCancel (e){
        e.imgactive = false;
    },
     gotodetail:function(e){
       // this.keep.go("/shopwindowdetail.html",true,{spaceId:e.spaceId});
        this.keep.scroll.save();
        this.keep.go('/shopwindowdetail2.html',true,{spaceId:e.spaceId,showGoHome:'1',cover:e.cover})
     }

  }

}


</script>

<style lang="scss">
  @import '../../assets/scss/ccList.scss';
  #cclist_vue #content {
   #reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
    margin:0;
    clear: both;
    float: none;
  }  }
</style>
