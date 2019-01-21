<template>
  <div id="ccdetail2_vue">
    <!-- cover -->
    <div class="shopwindowBanner">
    	<img class="windowBg" :src="img+ '?imageView2/0/w/1024/h/611|imageslim'"/>
    	<!-- <img @click="backHome" v-if="showGoHome" id="backHome" src="../../assets/img/icon_home_@3x.png"/> -->
    </div>
    <img src="../../assets/img/go_to_home_icon.png" alt="go_to_home" style="position: fixed;bottom: 0.4rem;right: 0.15rem;display: block;width: .64rem;height: .64rem;cursor: pointer;z-index:999;" @click="goToHome" v-if="showGoHome">
    <!-- content -->
    <div class="content">
      <b class="title">{{name}}</b>
      <p class="desc">{{description}}</p>
      <p class="learnMore" @click="more()" style="font-weight:700;">
        查看完整介绍
        <img src="../../assets/img/new_btn_more.png">
      </p>
      <p class="line"></p>

      <!-- 场景图列表 -->
      <div class="sceneBox">
        <div v-for='n in item' @click="gotoScene(n)" >
        <!-- @touchcancel='onCancel(n)' @touchstart='onTouchstart(n,item)' @touchend='onTouchend(n,0)' :class="{'imgactive':n.imgactive}"> -->
          <img v-lazy="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
          <div>
            <span>{{n.name}}</span>
            <p>
              <img src="../../assets/img/new_icon_tag_white_line.png">
              {{n.goodsCount}}
            </p>
          </div>

        </div>
      </div>

      <p class="goodsLine" v-if="goodsData.length">— 场景组合单品 —</p>
      
      <!-- 场景图商品 -->
      <div class="sceneGoods" id="sceneGoods">
        <div v-for="goods in goodsData"  @click="gotoGoods(goods)">
        <!-- @touchcancel='onCancel(goods)' @touchstart='onTouchstart(goods,goodsData)' @touchend='onTouchend(goods,1)'> -->
          <img :src="goods.goods.cover + '?imageView2/0/w/400/h/400|imageslim'"   :class="{'imgactive':goods.imgactive}">
          <div>
            <p class="goodsTitle" style="font-weight:700;">{{goods.goods.title}}</p>
            <p class="goodsDesc" >{{goods.goods.description}}</p>

            <p class="goodsPrice" v-show="!goods.goods.discountType" style="font-weight:700;">¥{{goods.goods.minPrice}}</p>
            <div class="goods_discount" v-show="goods.goods.discountType == 2">
             <p>¥{{goods.goods.discountPrice}}  <span>¥{{goods.goods.minPrice}}</span></p> 
             <div class="goods_tag">{{goods.goods.discountTag}}</div>
            </div>
            <div class="goods_amount" v-show="goods.goods.discountType == 3">
             <p>¥{{goods.goods.minPrice}}</p> 
             <div class="goods_tag">{{goods.goods.discountTag}}</div>
            </div>

          </div>
        </div>
      </div>

    </div>  

  <!-- <Vload :dataload="dataload"></Vload> -->

  <firstLoad :firstLoad='firstLoad' :type="3"></firstLoad>
  <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
  </div>
</template>

<script>
import Load from '../../components/Loading.vue';
import loadFailed from '../../components/loadFailed.vue';
import firstLoad from '../../components/firstLoadNormal.vue';
export default{
  name:'ccdetails2',
  components :{
    Vload:Load,
    firstLoad:firstLoad,
    loadFailed:loadFailed
  },
  created(){
    document.title = '场景详情'
  },
  data(){
    return{
      showGoHome:true,
      firstLoad:false,
      loadFailed:false,
      name:'',
      img:'',
      description:'',
      spaceId:'',
      dataload:true,
      item:[],
      goodsData:[],
      bannerCover:'',
      top:0,
      time:0
    }
  },
  mounted:function(){
    this.showGoHome = this.getParam('showGoHome') == '1' ? false : true;
    var source = this.getParam('source');
    //this.showGoHome = (source == "qrcode") ? true : false;
  
    this.spaceId = this.getParam('spaceId');

    if(this.keep.isKeepAlive()){
    this.firstLoad = false;
    this.dataload = false;
    this.item = this.keep.cache.get('item');
    this.goodsData = this.keep.cache.get('goodsData');
    this.name = this.keep.cache.get('name');
    this.img = this.keep.cache.get('img');
    this.description = this.keep.cache.get('description');
    this.keep.markNotKeepAlive();
    this.$nextTick(() => {
        this.keep.scroll.recoverAndClear();
    });
   } else {
      this.firstLoad = true;
      this.keep.cache.remove("item");
      this.keep.cache.remove("goodsData");
      this.keep.cache.remove("name");
      this.keep.cache.remove("img");
      this.keep.cache.remove("description");
      this.finddata(this.spaceId)
   }
  },
  methods:{
    goToHome() {
      this.keep.go('/category2.html',false);
    },
    backHome(){
      this.keep.go("/index.html",false);
    },
    reload(){
      this.loadFailed =false;
      this.finddata(this.getParam('spaceId'));
    },
    goBuy(goodsid){
      this.keep.scroll.save();
      this.keep.go("/goods_detail.html",true,{goodsid:goodsid,showGoHome:'1'});
    },
    more:function(){
      this.keep.scroll.save();
      this.keep.go("/space_detail.html",true,{spaceId:this.spaceId});
    },
    onTouchstart (e,data){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<data.length;i++){
          data[i].imgactive = false;
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
    
          this.keep.scroll.save();
          if (type == 0) {
            this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,type:3});
          } else if (type == 1) {
             this.keep.go("/goods_detail.html",true,{goodsid:e.goods.goodsId,showGoHome:'1'});
          }

       }else{
        e.imgactive = false;
       }
    },
    gotoScene(e) {
      this.keep.scroll.save();
          
      this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,type:3});
    },
    gotoGoods(e) {
      this.keep.scroll.save();

      this.keep.go("/goods_detail.html",true,{goodsid:e.goods.goodsId,showGoHome:'1'});
      
    },
    onCancel (e){
      e.imgactive = false;
    },
    finddata (spaceId){
      this.http.get(this).url(this.config.space.url).restful({spaceId:spaceId}).request((data) => {
        this.firstLoad = false;
        this.dataload = false;
        var req = data.data.data;

        this.name = req.name;
        this.description =req.description;
        this.img = req.cover;

        var itemdata = [];
        var goodsData = [];
        var checkObj = {};
        for(var i = 0; i<req.items.length; i++){
          for(var j = 0; j< req.items[i].picItems.length; j++){
              itemdata.push(req.items[i].picItems[j]);
          }
        }
        for (var i = 0; i < itemdata.length; i++) {
           for (var j = 0; j < itemdata[i].detail.goodsList.length; j++) {
             if(itemdata[i].detail.goodsList[j].type == 1 && !checkObj[itemdata[i].detail.goodsList[j].goodsId]){
              checkObj[itemdata[i].detail.goodsList[j].goodsId] = 1;
              itemdata[i].detail.goodsList[j].imgactive = false;
              goodsData.push(itemdata[i].detail.goodsList[j]);
             }
           }
        }  
        for(var i=0;i<itemdata.length;i++){
          itemdata[i].imgactive = false;
          itemdata[i].number = i;
        }

        this.item = itemdata;
        this.goodsData = goodsData;

        if(this.getParam('scrollTo') == "goto"){
          setTimeout(()=>{
            $(window.document).scrollTop($("#sceneGoods").offset().top - 70)
          },200)
        }

        this.keep.cache.push("item",this.item);
        this.keep.cache.push("goodsData",this.goodsData);
        this.keep.cache.push("name",req.name);
        this.keep.cache.push("img",req.cover);
        this.keep.cache.push("description",req.description);
        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
          this.dataload = false;
        });
    }
  }

}

</script>


<style lang='scss'>
  @import '../../assets/scss/spaceDetail.scss';
</style>
