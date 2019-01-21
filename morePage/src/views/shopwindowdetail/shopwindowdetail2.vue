<template>
  <div id="ccdetail2_vue">
    <div class="shopwindowBanner">
    	<img class="windowBg" :src="img"/>
    	<p class="bannerTitle">{{name}}</p>
    	<p class="bannerIntroduceTitle">场景介绍</p>
    	<p class="bannerIntroduce">{{description}}</p>
      <p class="learnMore" @click="more()">查看完整介绍</p>
    </div>
    <div class="mengban"></div>
    <img @click="backHome" v-if="showGoHome" id="backHome" src="../../assets/img/icon_home_@3x.png"/>
    <ul class="picList">

      <li v-for='n in item' @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)' :class="{'imgactive':n.imgactive}">
        <img v-lazy="n.cover + '?imageView2/0/w/1024/h/1024|imageslim'" />
         <div>
           <p>{{n.name}}</p>
           <p class='biaoqian'><img src="../../assets/img/biaoqian.png" alt="标签">{{n.goodsCount}}</p>
         </div>
      </li>

    </ul>
  <Vload :dataload="dataload"></Vload>
  <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
  </div>
</template>

<script>
import Load from '../../components/Loading.vue';
import loadFailed from '../../components/loadFailed.vue';
export default{
  name:'ccdetails2',
  components :{
    Vload:Load,
    loadFailed:loadFailed
  },
  created(){
    document.title = '场景详情'
  },
  data(){
    return{
      showGoHome: false,
      loadFailed:false,
      name:'',
      img:'',
      description:'',
      spaceId:'',
      dataload:true,
      item:[],
      bannerCover:'',
      top:0,
      time:0
    }
  },
  mounted:function(){

    var bannerCover = this.getParam('cover');
    this.bannerCover = bannerCover;
    var source = this.getParam('source');
    var spaceId = this.getParam('spaceId');
    this.spaceId = spaceId;
    console.log(source);
    if(source == "qrcode"){
      this.showGoHome = true;
    }else{
      this.showGoHome = false;
    }
    console.log(this.bannerCover)

    // if(this.bannerCover){
    //   $('.shopwindowBanner .windowBg').attr('src',this.bannerCover);
    // }

    if(this.keep.isKeepAlive()){
     console.log(123)
    this.dataload = false;
    this.item = this.keep.cache.get('item');
    this.name = this.keep.cache.get('name');
    this.img = this.keep.cache.get('img');
    this.description = this.keep.cache.get('description');
    this.keep.markNotKeepAlive();
    this.$nextTick(() => {
        this.keep.scroll.recoverAndClear();
   });
   }else{
    this.keep.cache.remove("item");
    this.keep.cache.remove("name");
    this.keep.cache.remove("img");
    this.keep.cache.remove("description");
    this.finddata(spaceId)
   }
  },
  methods:{
    backHome(){
      this.keep.go("/index.html",false);
    },
    reload(){
      this.loadFailed =false;
      this.finddata(this.getParam('spaceId'));
    },
    goBuy(goodsid){
          this.keep.scroll.save();
          //console.log(e)
          this.keep.go("/goods_detail.html",true,{goodsid:goodsid,showGoHome:'1'});
    },
    more:function(){
      this.keep.scroll.save();
      console.log(this.spaceId)
      //return ;
      this.keep.go("/space_detail.html",true,{spaceId:this.spaceId});
    },

    onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.item.length;i++){
          this.item[i].imgactive = false;
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
      this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,type:3});
        })

       }else{
        e.imgactive = false;
       }
      },
    onCancel (e){
        e.imgactive = false;
    },

    goto:function(e){
      this.keep.scroll.save();
      this.keep.go('/scene.html',true,{sceneId:e.sceneId});
    },
    finddata (spaceId){
      this.http.get(this).url('/app/api/space/:spaceId').restful({spaceId:spaceId}).request((data) => {
                  this.dataload = false;
                  var req = data.data.data;
                  console.log(req)
                  this.spaceId = req.spaceId;
                  this.name = req.name;
                  this.description =req.description;
                  this.img = req.cover;
                  var itemdata = [];
                  for(var i = 0; i<req.items.length; i++){
                    for(var j = 0; j< req.items[i].picItems.length; j++){
                        itemdata.push(req.items[i].picItems[j])
                    }
                  }
                  for(var i=0;i<itemdata.length;i++){
                    itemdata[i].imgactive = false;
                    itemdata[i].number = i;
                  }
                  this.item = itemdata;
                  this.keep.cache.push("item",this.item);
                  this.keep.cache.push("name",req.name);
                  this.keep.cache.push("img",req.cover);
                  this.keep.cache.push("description",req.description);
          },(err)=>{
            this.loadFailed = true;
            this.dataload = false;
          });
      }
  }

}

</script>


<style lang='scss'>
  @import '../../assets/scss/ccdetail2.scss';
</style>
