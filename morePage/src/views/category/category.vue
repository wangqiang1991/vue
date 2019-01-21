<template>
  <div id="category_Vue">
    <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader :showAppTip = "showAppTip" type="1" :class="{'showAppTip1':showAppTip}"  @cacheCategory="cacheCategory"></Vheader>

    <div class="category_box" :class="{'showAppTip2':showAppTip}">

      <div class="first_category" :class="{'showAppTip2':showAppTip}">
        <p v-for='category in categoryData' @click='choiceCategory(category)' :class="{'active':category.show}">
          <span>{{category.name}}</span>
        </p>
      </div>

      <div class="second_category" :class="{'showAppTip2':showAppTip}">
        <div v-for='category in categoryData' v-show='category.show'>
          <div class="normal_second" v-if='category.type == 1'>
              <img :src="goodsItem.image + '?imageView2/0/w/1024/h/390|imageslim' " v-if='!goodsItem.categoryId' @click='gotolist2(goodsItem)'  v-for='goodsItem in category.children'>
              <div  v-if='goodsItem.categoryId' @click='gotolist2(goodsItem)'  v-for='goodsItem in category.children'>
                <img :src="goodsItem.image + '?imageView2/0/w/640/h/640|imageslim' " >
                <p>{{goodsItem.name}}</p>
              </div>
          </div>  

          <div class="space_second" v-if='category.type == 2'>
            <img v-if='goodsItem.categoryId' :src="goodsItem.image + '?imageView2/0/w/1024/h/390|imageslim' " @click='gotolist2(goodsItem)' v-for='goodsItem in category.children'>
          </div>
        </div>  
      </div>

    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <Vmenu thisChoice='sc'  @cacheCategory="cacheCategory"></Vmenu>
  </div>
</template>

<script>
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  import Header from '../../components/Header.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import Menu from '../../components/Menu.vue';

  export default {
    name: 'category',
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
      this.setHeight();


      if(this.keep.isKeepAlive()){
        this.firstLoad = false;
        this.categoryData = this.keep.cache.get('categoryData',[]);
        this.categoryName = this.keep.cache.get("categoryName",'' );
        this.tabName = this.keep.cache.get("tabName", []);
        this.firstCategoryId = this.keep.cache.get("firstCategoryId",null );
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.firstLoad = true;
        this.keep.cache.remove('categoryData');
        this.keep.cache.remove('categoryName');
        this.keep.cache.remove('tabName');
        this.keep.cache.remove('firstCategoryId');
        this.getcategory();
      }

    },
    methods: {
      setHeight() {
        let cHeight =  document.documentElement.clientHeight;
        let boxHeiht = null;
        if (this.showAppTip) {
          boxHeiht = cHeight - $("#downLoadApp_vue").height() - $("#header_vue").outerHeight() - $("#menu_vue").height();
        } else {
          boxHeiht = cHeight - $("#header_vue").outerHeight() - $("#menu_vue").height();
        }
        $(".category_box").height(boxHeiht)
        $(".first_category").height(boxHeiht)
        $(".second_category").height(boxHeiht)
      },
      closeTip(data){
      if(!data){
          this.showAppTip = false;
          this.setHeight();
        }
      },
      reload(){
        this.loadFailed = false;
        this.getcategory();
      },
      choiceCategory(category) {
        this.categoryData.forEach((item)=>{
          item.show = false;
        })
        category.show = true;
        this.categoryName = category.name;
        this.tabName = category.children;
        this.firstCategoryId = category.categoryId;
      },
      gotolist2:function(category2){
       console.log(this.categoryName)
       this.cacheCategory();
       this.keep.go("/goods_list2.html",true,{firstCategoryId:this.firstCategoryId,secondCategoryId:category2.categoryId,showGoHome:'1'});
      },
      cacheCategory() {
       this.keep.cache.push("categoryName", this.categoryName);
       this.keep.cache.push("tabName", this.tabName);
       this.keep.cache.push("categoryData", this.categoryData );
       this.keep.cache.push("firstCategoryId", this.firstCategoryId );
       this.keep.scroll.save();       
      },
      getcategory(){
        this.http.get(this).url(this.config.category.list_v2).request(function(response){
          this.firstLoad = false;
          if (response.data.code != 0) {
            return ; 
          }  

          var data = response.data.data;
          this.firstCategoryId = data[0].categoryId;
          this.categoryName = data[0].name;
          this.tabName = data[0].children;

          data.forEach((item)=>{
            if (item.categoryId == this.firstCategoryId) {
              item.show = true;
            } else {
              item.show = false;
            }

            // item.type = 1;

            if(item.children){
              var obj = {};
              obj.name = "全部";
              obj.parentId = item.categoryId;
              obj.categoryId = null;
              obj.image = item.image;
              obj.all = true;
              item.children.unshift(obj);
            } else {
              item.children = [];
              var obj = {};
              obj.name = "全部";
              obj.parentId = item.categoryId;
              obj.categoryId = null;
              obj.image = item.image;
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
  @import '../../assets/scss/category.scss';
  .showAppTip1{
    top:0.5rem !important;
  }
  .showAppTip2{
    top:1rem !important;
  }
</style>
