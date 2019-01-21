<template>
  <div id="designer_Vue">
  	<div id="user">
      <img :src="data.head">
    </div>

    <h4 class="mywork">全部作品</h4>
    <div class="more" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <img v-lazy="n.cover + '?imageView2/0/w/320/h/320|imageslim'" v-for='n in moreData'  @click="gotoScene(n)">
      
      <div id="load" v-show='scorllload'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>

      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

      <div  v-show='showbottom && moreData.length' style="width:100%;background:white;padding:0.2rem 0;clear:both;">
        <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>

    </div>
    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
  </div>
</template>

<script>
  import Load from '../../components/Loading.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  export default {
    name: 'designer',
    components:{
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      Vload:Load
    },
    data() {
      return {
        showbottom:false,
        firstLoad:false,
        loadFailed:false,
        data:[],
        moreData:[],
        top:0,
        time:0,
        loading:false,
        pageIndex:1,
        dataload:true,
        scorllload:false,
        reloadflag:false
      }
    },
    created() {
      document.title = "设计师";
    },
    mounted: function() {
      this.designerId = this.getParam('designerId');
      this.data = this.keep.cache.get("designerData",null,'/learn_more.html');
      console.log(this.data)
       if(this.keep.isKeepAlive()) {
        this.firstLoad = false;
        this.dataload = false;
        this.moreData = this.keep.cache.get("moreData");
        this.pageIndex = this.keep.cache.get("pageIndex");
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      } else {
        this.firstLoad = true;
        this.keep.cache.remove("secneImgData");
        this.keep.cache.remove("secneImgData-pageIndex");
      }  
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.findImg();
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      loadMore(){
        this.loading = true;
        this.scorllload = true;
        this.findImg();
      },
      findImg(){
      this.http.get(this).url('/app/api/picture/more').params({designerId:this.designerId,loadDetail:true,pageSize:12,pageIndex:this.pageIndex}).request((req) => {
        this.firstLoad = false;
        var data = req.data.data;
        this.dataload = false;
        this.scorllload = false;
        console.log(data)
        for(var i=0;i<data.length;i++){
          data[i].imgactive = false;
          data[i].number = i;
          data[i].pageIndex = this.pageIndex;
        }
        data.forEach((n) => {
          this.moreData.push(n)
        });
        if(data.length == 0){
          this.loading = true;
          this.showbottom = true;
        } else {
          this.pageIndex++;
          this.loading = false;
        }
        this.keep.cache.push("moreData", this.moreData);
        this.keep.cache.push("pageIndex", this.pageIndex);
      },(err)=>{
        this.firstLoad = false;
        if(this.pageIndex == 1){
          this.loadFailed = true;  
        }
        this.dataload = false;
        this.scorllload = false;
        this.reloadflag = true;
        console.log(err)
      })
    },
    onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
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
         this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,pageIndex:(this.pageIndex-1),type:7,designerId:this.designerId})
        })
        
       }else{
        e.imgactive = false;
       }
    },
    gotoScene(e) {
      this.keep.scroll.save();
      this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,pageIndex:(this.pageIndex-1),type:7,designerId:this.designerId})
    },
    onCancel (e){
        e.imgactive = false;
      }
    }
   
  }
</script>

<style lang='scss'>
  #user{
    width:3.75rem;
    height:auto;
    padding:0.13rem 0;
    border-bottom: 1px solid #ddd;
    >img{
      border: 0.01rem solid #ddd;
      display:block;
      width:0.58rem;
      height:0.58rem;
      border-radius:50%;
      margin:auto;
    }
  }
  .mywork{
    margin-top: 0.15rem;
    margin-bottom:0.15rem;
    color:#343434;
    font-size:0.18rem;
    font-weight:700;
    padding-left: 0.2rem;
  }

  .more{
    width:3.35rem;
    height:auto;
    overflow: hidden;
    padding:0 0.2rem 0;
  }
  .more>img{
    display:block;
    border-radius:2px;
    width:1.08rem;
    height:1.08rem;
    margin-right:0.04rem;
    margin-bottom:0.04rem;
    float:left;
  }
  .more>img:nth-child(3n){
    margin-right: 0;
  }
  #load {
      width: 3.75rem;
      clear: both;
      padding-top: 0.1rem;
      padding-bottom:0.1rem;
  }
  #load div {
      width: 0.6rem;
      margin: auto;
      line-height: 0.6rem;
      display: flex;
      align-items: center;
  }
  #reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }
</style>