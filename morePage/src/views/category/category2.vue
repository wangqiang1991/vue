<template>
  <div id="category2_Vue">
   <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader :showAppTip = "showAppTip" type="1" :class="{'showAppTip1':showAppTip}"></Vheader>
    <div class="spaceArea"></div>
    <ul class="navUl" :class="{'showAppTip2':showAppTip}">
      <li v-for="n in name">
        <div class="contentBox"  @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)'>
          <img :src="n.image + '?imageView2/0/w/512/h/512|imageslim'" :class="{'imgactive':n.imgactive}" />
          <p>{{n.name}}</p>
        </div>
      </li>
    </ul>
    <div class="bottomArea" v-show="recommendedArr.lenght == 0"></div>
    <p class="title">— 为您推荐 —</p>
    <div class="recommended" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" v-show="recommendedArr.lenght != 0">
    	<ul>
    		<li v-for="n in recommendedArr">
    		  <div class="contentBox1"  @touchcancel='onCancel(n)' @touchstart='onTouchstart1(n)' @touchend='onTouchend1(n)'>
    		  	<img :src="n.cover + '?imageView2/0/w/512/h/512|imageslim'"  :class="{'imgactive':n.imgactive}" />
           <div>
             <p class="goodTitle" style="height:0.2rem;line-height: 0.2rem;">{{n.title}}</p>
             <p class="style">{{n.description}}</p>
             <p class="goodsPrice">¥{{n.minPrice}}</p>
           </div> 
          </div>
    		</li>
    		<div id="load" v-if='loadingMore'>
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>
        <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
        </div>
    	</ul>
    </div>
    <!--<div class="spaceArea">

    </div>-->
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <Vmenu thisChoice='sc'></Vmenu>
  </div>
</template>

<script>
  import Header from '../../components/Header.vue';
  import Menu from '../../components/Menu.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import downLoadApp from '../../components/tipDownLoadApp.vue';
//import axios from 'axios';
  //import {getCookie} from '../tools.js';
  export default {
    name: 'category2',
    components: {
      Vheader: Header,
      Vmenu: Menu,
      loadFailed:loadFailed,
      VdownLoadApp:downLoadApp
    },
    created() {
      document.title = "商品类目"
    },
    activated() {
      document.title = "商品类目";
    },

    data() {
      return {
        showAppTip:true,
        reloadflag:false,
        loadFailed:false,
        thisVueName: 'class',
        name: [], //分类数据
        list1name: '', //传参名字
        list1id: '', //传参id
        show: false, //提醒数据是否有
        pageIndex: 1,
        pageSize: 10,
        recommendedArr:[],
        loading: false,
        loadingMore: false,
        top:0,
        time:0,
        tabName:[]
      }
    },
    mounted: function() {
      var categoryid = this.getParam('categoryId');
      if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }
      if(this.keep.isKeepAlive()){
        this.recommendedArr = this.keep.cache.get('recommendedArr',[]);
        this.pageIndex = this.keep.cache.get('pageIndex',1);
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.keep.cache.remove('recommendedArr');
        this.keep.cache.remove('pageIndex');
      }
      this.getcategory();
    },
    methods: {
      closeTip(data){
      if(!data){
          this.showAppTip = false;
        }
      },
      reloadData(){
        this.loading =  false;
        this.reloadflag = false;
      },
      reload(){
        this.loadFailed = false;
        this.loadMore();
        this.getcategory();
      },
      gotolist2:function(e){
       console.log(e,this.list1name,this.list1id)
       this.keep.scroll.save();
       this.keep.go("/goods_list2.html",true,{fatherid:e.parentId,firstCategoryId:e.categoryId});
      },
      //一级分类动画
      onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.name.length;i++){
          this.name[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onTouchend:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          console.log(e)
          this.keep.go("/goods_list2.html",true,{firstCategoryId:e.categoryId});
        })

       }else{
        e.imgactive = false;
       }
      },
    onCancel (e){
        e.imgactive = false;
    },



      gotoGoods(e){
        console.log(e)
        this.keep.scroll.save();
        this.keep.go("/goods_detail.html",true,{goodsid:e.goodsId,showGoHome:'1'})
      },
      //商品列表动画
      onTouchstart1 (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.recommendedArr.length;i++){
          this.recommendedArr[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
    onTouchend1:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();

          this.keep.go("/goods_detail.html",true,{goodsid:e.goodsId,showGoHome:'1'});
        })

       }else{
        e.imgactive = false;
       }
      },
      getcategory(){
        this.http.get(this).url('/app/api/category').request(function(response){
          var data = response.data.data;
              for(var i=0;i<data.length;i++){
                data[i].imgactive = false;
                this.tabName.push(data[i])
              }
              console.log(data)
              console.log(this.tabName)
              this.name = data;
              this.keep.cache.push("tabName", this.tabName);
        },(err)=>{
          this.loadFailed = true;
        })
      },
      loadMore(){
        this.loading = true;
        this.loadingMore = true;
        this.http.get(this).url('/app/api/goods/recommend').params({
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        }).request(function(response){
          var data = response.data.data;
          for(var i=0;i<data.length;i++){
              data[i].imgactive = false;
          }
          console.log(data)
          data.forEach((n) => {
            this.recommendedArr.push(n);
          })
          
          if(data.length){
            this.pageIndex++;
            this.loading = false;
            
          }else{
            this.loading = true;
            
          }
          this.loadingMore = false;
          this.keep.cache.push('recommendedArr',this.recommendedArr);
          this.keep.cache.push('pageIndex',this.pageIndex);
        },(err)=>{
          if(this.pageIndex == 1){
            this.loadFailed = true;    
          }else{
            this.reloadflag = true;
          }
          this.loadingMore = false;
          console.log('++++++++++++')
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/category2.scss';
  #reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
    clear: both;
  }
   .showAppTip1{
      top:0.5rem !important;
    }
    .showAppTip2{
      margin-top:0.5rem !important;
    }
</style>
