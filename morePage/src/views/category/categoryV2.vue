<template>
  <div id="category2_Vue">
    <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader :showAppTip = "showAppTip" type="1" :class="{'showAppTip1':showAppTip}"></Vheader>
    <div class="spaceArea"></div>

    <ul class="navUl" :class="{'showAppTip2':showAppTip}" style="padding-bottom:0.64rem;">
      <b class="categoryTitle">商品品类</b>
      <div class="category1" v-for="(category,index) in categoryData">
        <img v-lazy="category.image + '?imageView2/0/w/1024/h/390|imageslim'" @click="showCategory2List(category,index)">
        <div class="category2" :class="{'showCategory2':category.showCategory2}">
           <p style="font-weight:700;" @click="gotolist2(category2)" v-for="category2 in category.children">{{category2.name}}</p>
        </div>
      </div>
    </ul>
    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <Vmenu thisChoice='sc'></Vmenu>
  </div>
</template>

<script>
  import Header from '../../components/Header.vue';
  import Menu from '../../components/Menu.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  import firstLoad from '../../components/firstLoad.vue';
  export default {
    name: 'category2',
    components: {
      Vheader: Header,
      Vmenu: Menu,
      loadFailed:loadFailed,
      firstLoad:firstLoad,
      VdownLoadApp:downLoadApp
    },
    created() {
      document.title = "商品类目"
    },
    data() {
      return {
        firstLoad:false,
        showAppTip:true,
        reloadflag:false,
        loadFailed:false,
        thisVueName: 'class',
        name: [], //分类数据
        categoryData:[],
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
        tabName:[],
        firstCategoryId:null,
        secondCategoryId:null,
        categoryName:""
      }
    },
    mounted: function() {
      //判断app提示信息是否显示
      if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }

      if(this.keep.isKeepAlive()){
        this.firstLoad = false;
        this.categoryData = this.keep.cache.get('categoryData',[]);
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.firstLoad = true;
        this.keep.cache.remove('categoryData');
        this.getcategory();
      }
    },
    methods: {
      showCategory2List(category,index){
        this.tabName = category.children;
        this.categoryName = category.name;
        this.firstCategoryId = category.categoryId;
        this.categoryData.forEach((item)=>{
          if(item.categoryId == category.categoryId){
             category.showCategory2 = !category.showCategory2;
          }else{
            item.showCategory2 = false;
          }
        })

        //点击最后一张全部弹窗
        if( ( (index + 1) == this.categoryData.length ) && category.showCategory2) {
          setTimeout(()=>{
            let top = document.body.scrollTop || document.documentElement.scrollTop;
            window.scrollTo(0,top+$(".showCategory2").height())
          },20)
        }
        

      },
      closeTip(data){
      if(!data){
          this.showAppTip = false;
        }
      },
      reload(){
        this.loadFailed = false;
        this.getcategory();
      },
      gotolist2:function(category2){
       console.log(this.categoryName)
       this.keep.cache.push("categoryName", this.categoryName);
       this.keep.cache.push("tabName", this.tabName);
       this.keep.scroll.save();
       this.keep.go("/goods_list2.html",true,{firstCategoryId:this.firstCategoryId,secondCategoryId:category2.categoryId,showGoHome:'1'});
      },
      getcategory(){
        this.http.get(this).url(this.config.category.list_v2).request(function(response){
              this.firstLoad = false;
              if (response.data.code != 0) {
                 return ; 
              }  
              var data = response.data.data;
              data.forEach((item)=>{
                item.showCategory2 = false;
                if(item.children){
                  var obj = {};
                  obj.name = "全部";
                  obj.parentId = item.categoryId;
                  obj.categoryId = null;
                  obj.all = true;
                  item.children.unshift(obj);
                }else{
                  item.children = [];
                  var obj = {};
                  obj.name = "全部";
                  obj.parentId = item.categoryId;
                  obj.categoryId = null;
                  obj.all = true;
                  item.children.unshift(obj);
                }
              });
              this.categoryData = data;
              this.keep.cache.push("categoryData", data);
        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
        })
      },
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
