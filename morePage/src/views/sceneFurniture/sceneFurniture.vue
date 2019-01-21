<template>
  <div id="sceneFurniture_vue">
    <div class="top">
      <h4>热门风格</h4>
      <div class="swiper_div">
       <div class="swiper-container" id="swiper-container">
            <div class="swiper-wrapper">
                <div  v-for="n in styledata" class="swiper-slide"  @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n,1)' :class="{'imgactive':n.imgactive}">
                  <img :src="n.cover + '?imageView2/0/w/512/h/286|imageslim'" v-show='n.cover != null'>
                  <p v-show='n.cover == null'></p>
                  <span>{{n.name}}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
    <div class="recommends" 
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="20">
      <li  v-for="n in spacedata"  @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n,2)' >
        <p>{{n.name}}<span>{{n.styleNames}}</span></p>
        <div :class="{'imgactive':n.imgactive}">
          <img v-lazy="n.cover+ '?imageView2/0/w/1024/h/1024|imageslim'">
          <!-- <div><p>123</p><p class="biaoqian"><img src="../../assets/img/biaoqian.png">2</p></div> -->
        </div>
       </li>

       <div id="load" v-show='loaddata'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

    </div>

    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
import swiper from 'swiper';
import loadFailed from '../../components/loadFailed.vue';


export default{
  name:'sceneFurniture',
  components: {
    loadFailed:loadFailed
  },
  data(){
    return{
      top:0,
      time:0,
      pageIndex:1,
      loading:false,
      loaddata:false,
      loadFailed:false,
      reloadflag:false,
      styledata:[],
      spacedata:[]
    }
  },
  created(){
    document.title="家居场景"
  },
  mounted:function(){

     if(this.keep.isKeepAlive()) {
        this.initLayer();
        this.spacedata = this.keep.cache.get('spacedata');
        this.pageIndex = this.keep.cache.get('pageIndex');
        this.styledata = this.keep.cache.get('styledata');
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.keep.cache.remove("spacedata");
        this.keep.cache.remove("pageIndex"); 
        this.keep.cache.remove('styledata') 
        this.findStyle();
        this.initLayer();
      }
  },
  methods:{
    reloadData(){
      this.reloadflag = false;
      this.loading = false;
    },
    reload(){
      this.spacesearch(this.pageIndex);
      this.findStyle();
      this.initLayer();
      this.loadFailed = false;
    },
      findStyle(){
         this.http.get(this).url("/app/api/picture/styles").request(
          (res) => {
            console.log(res)
            if (res.data.code != 0) {
              return;
            }
            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].imgactive = false;
            }

            this.styledata = res.data.data;
            this.keep.cache.push("styledata", this.styledata);
          },
          (err) => {
            console.log(err);
          }
        );
      },
    spacesearch:function(pageIndex){
      console.log('pageIndex='+pageIndex)
      let pageSize = 11;
      if (pageIndex != 1) {
        pageSize = 10;
      }
      this.http.get(this).url('/app/api/space').params({pageIndex:pageIndex,pageSize:10}).request((data) => {
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
      initLayer() {

      this.$nextTick(() => {
        new swiper('#swiper-container', {
              slidesPerView: 'auto',
              paginationClickable: true,
              //spaceBetween: 10,
              observer:true,
              observeParents:true,
              freeMode:true,
              freeModeFluid:true
          });
      });

    },
    onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.styledata.length;i++){
          this.styledata[i].imgactive = false;
        }
        for(var i = 0 ;i<this.spacedata.length;i++){
          this.spacedata[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onTouchend:function(e,type){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          if(type == 1){
            this.keep.go("/shopwindowlist.html",true,{name:e.name,styleId:e.styleId});  
          }else if(type == 2){
            this.keep.go("/shopwindowdetail2.html",true,{spaceId:e.spaceId,showGoHome:'1',cover:e.cover});  
          }
          //this.keep.go("/goods_list2.html",true,{firstCategoryId:e.categoryId});
        })
       }else{
        e.imgactive = false;
       }
      },
    onCancel (e){
        e.imgactive = false;
    },
  }

}


</script>

<style lang="scss">
  @import '../../assets/scss/sceneFurniture.scss';
</style>
