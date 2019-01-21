<template>
  <div id="imgdetails_vue">
      <VdownLoadApp @showAppTip="closeTip" v-show = "showAppTip"></VdownLoadApp>
    <Vheader type="2" :showAppTip = "showAppTip" :class="{'showAppTip1':showAppTip}"></Vheader>
    <div class="pic_tit" :class="{'showAppTip2':showAppTip}">
      <div id="all" @click="list1('all')" v-bind:class="{'active':all }">
        <span > {{allname}} </span>
        <img src="../../assets/img/down.png" class="downPic1"/>
        <img src="../../assets/img/up.png" class="upPic1"/>
      </div>
      <div @click="list1('area')" :class="{'active':area }">
        <span > {{areaname}} </span>
        <img src="../../assets/img/down.png" class="downPic"/>
        <img src="../../assets/img/up.png" class="upPic"/>
      </div>
      <div @click="list1('style')" :class="{'active':style }">
        <span > {{stylename}} </span>
        <img src="../../assets/img/down.png" class="downPic2"/>
        <img src="../../assets/img/up.png" class="upPic2"/>
      </div>
    </div>


    <div class="spaceArea"></div>

    <div class="content" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" :class="{'showAppTip3':showAppTip}">

      <img v-for='n in dataitem' v-lazy="n.cover+ '?imageView2/0/w/512/h/512|imageslim'"  @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)' :class="{'imgactive':n.imgactive}">
      <p id="showNoData" v-show='noData'> 更多优质设计，正在接近中~</p>
      <div id="load" v-show='scorllload'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>
      <div id="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>
    </div>


    <Vmenu thisChoice='img'></Vmenu>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <Vload v-bind:dataload="dataload"></Vload>
    <div id="mengban">
      <div class="choicediv">
        <p class="cancelBtn" @click='cancel()'><img src="../../assets/img/down.png"/></p>
        <p class="choicename"> {{choicename}}
          <!-- <span @click='sure()'>确定</span> --></p>

        <ul>
          <li v-for='n in choiceitem' @click='choice(n)' :class="{'choice':n.show}">
            <span>{{n.name}}</span>
            <img v-if='n.show' src="../../assets/img/choice.png">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../../components/Header.vue';
  import Menu from '../../components/Menu.vue';
  import Load from '../../components/Loading.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import downLoadApp from '../../components/tipDownLoadApp.vue';
  export default {
    name: 'imgdetails',
    components: {
      Vheader: Header,
      Vmenu: Menu,
      Vload: Load,
      loadFailed:loadFailed,
      VdownLoadApp:downLoadApp
    },
    data() {
      return {
        showAppTip:true,
        reloadflag:false, 
        loadFailed:false,
        thisVueName: 'imgdetails',
        all: true,
        area: false,
        style: false,
        areadata: [],
        styledata: [],
        allData:[],
        pageIndex: 1,
        styleId: '',
        areaId: '',
        allid:'',
        choiceitem: [],
        choicename: '',
        allname:'全部',
        stylename: '风格',
        areaname: '区域',
        dataitem: [],
        loading: false,
        dataload: false,
        scorllload: false,
        time:0,
        top:0,
        isLoading: false,
        noData:false,
        controlScroll:false
      }
    },
    created() {
      document.title = "图片"
    },
    mounted: function() {
      //console.log(document.documentElement.clientHeight)
      $('#mengban').css({
        'height': document.documentElement.clientHeight
      })
       if (this.getCookie("showAppTip") == "false") {
        this.showAppTip = false;
      }
      //初始化全部的数据
      this.allData = [{'name':'全部','show':true,'allid':''},{'name':'集赞定制','show':false,'allid':1},{'name':'可售卖','show':false,'allid':2}];

      $('.upPic').css('display','none');
       $('.upPic1').css('display','none');
      $('.upPic2').css('display','none');
      if(this.keep.isKeepAlive()) {
        this.dataitem = this.keep.cache.get("secneImgData");
        this.pageIndex = this.keep.cache.get("secneImgData-pageIndex");
        this.styledata = this.keep.cache.get('styleData');
        this.areadata = this.keep.cache.get('areaData');
        this.styleId =  this.keep.cache.get('styleId');
        this.areaId =  this.keep.cache.get('areaId');
        this.allid =  this.keep.cache.get('tagType');
        this.allid = (this.allid == null) ? '' : this.allid;
        this.styleId = (this.styleId == null) ? '' : this.styleId;
        this.areaId = (this.areaId == null) ? '' : this.areaId;
        console.log(this.styleId,this.areaId)
        for(var i = 0;i <this.allData.length;i++){
          this.allData[i].show = false;
          if(this.allData[i].allid == this.allid){
            this.allname = this.allData[i].name;
            this.allData[i].show = true
          }
        }
        for(var i = 0;i<this.styledata.length;i++){
          this.styledata[i].show = false;
          if(this.styledata[i].styleId == this.styleId){
            this.stylename = (this.styledata[i].name == '全部') ? '风格' : this.styledata[i].name;
            this.styledata[i].show = true;
          }
        }
        for(var i = 0;i<this.areadata.length;i++){
          this.areadata[i].show = false;
          if(this.areadata[i].areaId == this.areaId){
            this.areaname = (this.areadata[i].name == '全部') ? '区域' : this.areadata[i].name;
            this.areadata[i].show = true;
          }
        }

        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      } else {
        this.keep.cache.remove("secneImgData");
        this.keep.cache.remove("secneImgData-pageIndex");
        this.keep.cache.remove('styleId');
        this.keep.cache.remove('areaId');
        this.keep.cache.remove('tagType');
        this.findStyle();
        this.findArea();  
        this.loading = true;
        this.dataload = true;
        this.find(this.pageIndex, this.styleId, this.areaId);
      }
    },
    methods: {
      closeTip(data){
      if(!data){
          this.showAppTip = false;
        }
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
      },
      reload(){
        this.loadFailed = false;
        this.find(this.pageIndex, this.styleId, this.areaId);
        this.findStyle();
        this.findArea();
      },
      findArea(){
       this.http.get(this).url("/app/api/picture/areas").request(
          (res) => {
            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].show = false;
            }
            var area={'name':'全部','show':true,areaId:''};
            res.data.data.unshift(area)
            this.areadata = res.data.data;
            this.keep.cache.push("areaData", this.areadata);
            //console.log(this.areadata)
          }
        );
      },
      findStyle(){
        this.http.get(this).url("/app/api/picture/styles").request(
          (res) => {

            for(var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].show = false;
            }
            var style={'name':'全部','show':true,styleId:''};
            res.data.data.unshift(style)
            this.styledata = res.data.data;
            this.keep.cache.push("styleData", this.styledata);
            //console.log(this.styledata)
          },
          (err) => {
            console.log(err);
          }
        );
      },
      list1: function(e) {
        this.controlScroll = true;
        //this.loading = false;
        let context = this;
        if(e == 'all') {
          this.choiceitem = this.allData;
          this.choicename = '标签类型选择';
          $('#mengban').addClass('is-visible2');
          $('.content').addClass('setheight');
          $('.downPic1').css('display','none');
          $('.upPic1').css('display','inline');
          $("#mengban").click(function(event) {
            if($(event.target).is('#mengban') || $(event.target).is('.cancelBtn')) {
              context.controlScroll = false;
              context.loading = false;
              event.preventDefault();
              $('#mengban').removeClass('is-visible2');
              $('.content').removeClass('setheight');
              $('.upPic1').css('display','none');
              $('.downPic1').css('display','inline');
            }
          })
        }
        if(e == 'area') {
          this.choiceitem = this.areadata;
          console.log(this.choiceitem)
          this.choicename = '区域选择';
          $('#mengban').addClass('is-visible2');
          $('.content').addClass('setheight');
          $('.downPic').css('display','none');
          $('.upPic').css('display','inline');
          $("#mengban").click(function(event) {
            if($(event.target).is('#mengban') || $(event.target).is('.cancelBtn')) {
              context.controlScroll = false;
              context.loading = false;
              event.preventDefault();
              $('#mengban').removeClass('is-visible2');
              $('.content').removeClass('setheight');
              $('.upPic').css('display','none');
              $('.downPic').css('display','inline');
            }
          })
          //        $('#mengban').fadeIn();
          //        $('.choicediv').animate({'bottom':0},200).show();
        }
        if(e == 'style') {
          this.choiceitem = this.styledata;
          console.log(this.choiceitem)
          this.choicename = '风格选择';
          $('#mengban').addClass('is-visible2');
          $('.content').addClass('setheight');
          $('.downPic2').css('display','none');
          $('.upPic2').css('display','inline');
//        this.arrow = false;

          $("#mengban").click(function(event) {
            if($(event.target).is('#mengban') || $(event.target).is('.cancelBtn')) {
              context.controlScroll = false;
              context.loading = false;
              event.preventDefault();
              $('#mengban').removeClass('is-visible2');
              $('.content').removeClass('setheight');
              $('.upPic2').css('display','none');
              $('.downPic2').css('display','inline');
//            this.arrow = true;
            }
          })
          //        $('#mengban').fadeIn();
          //        $('.choicediv').animate({'bottom':0},200).show();

        }
      },
      choice: function(e) {
        console.log(e.allid)

        if (this.isLoading) {
            this.showMessage("您操作过于频繁");
            return;
        }
        //this.loading = false;
        if(e.allid !== undefined){
          this.all = true;
          this.style = false;
          this.area = false;
          this.areaId = '';
          this.styleId = '';
          this.areaname = '区域';
          this.stylename = '风格';
          for(var i = 0; i < this.areadata.length; i++) {
            if(i == 0){
              this.areadata[i].show = true;
            }else{
              this.areadata[i].show = false;
            }
          }
          for(var i = 0; i < this.styledata.length; i++) {
            if(i == 0){
              this.styledata[i].show = true;
            }else{
              this.styledata[i].show = false;
            }
          }
          for(var i = 0;i < this.allData.length;i++){
            this.allData[i].show =false;
          }
          this.allid = e.allid;
          this.allname = e.name;
          $('.upPic1').css('display','none');
          $('.downPic1').css('display','inline');
        }
        if(e.areaId != undefined) {
         // this.all = false;
          for(var i = 0; i < this.areadata.length; i++) {
            this.areadata[i].show = false;
          }
          //this.choiceitem = this.areadata;
          this.areaId = e.areaId;
          if(e.name == '全部'){
            this.areaname = '区域';
            this.area = false;
          }else{
             this.areaname = e.name;
             this.area = true;
          }

          $('.upPic').css('display','none');
          $('.downPic').css('display','inline');
        }
        if(e.styleId != undefined) {
         // this.all = false;
          for(var i = 0; i < this.styledata.length; i++) {
            this.styledata[i].show = false;
          }
         // this.choiceitem = this.styledata;
          this.styleId = e.styleId;
          if(e.name == '全部'){
            this.stylename = '风格';
            this.style = false;
          }else{
             this.style = true;
             this.stylename = e.name;
          }

          $('.upPic2').css('display','none');
          $('.downPic2').css('display','inline');
        }
        e.show = true;
        console.log(this.styleId, this.areaId)
        this.controlScroll = false;
        this.dataload = true;
        this.pageIndex = 1;
        this.dataitem = [];
        this.find(this.pageIndex, this.styleId, this.areaId)
        //$('#mengban').removeClass('is-visible2');
        $('#mengban').removeClass('is-visible2');
        $('.content').removeClass('setheight');
      },
      detail: function (e,event) {
       // console.log(e,event)

        // setTimeout(()=>{
        //   this.keep.scroll.save();
        //   this.keep.go('/scene.html',true,{sceneId:e.sceneId})
        // },1000)

      },
      onTouchstart (e){
        var top =  window.event.changedTouches[0].clientY
       // var top = document.body.scrollTop || document.documentElement.scrollTop;
       // console.log(top)
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.dataitem.length;i++){
          this.dataitem.imgactive = false;
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
       // console.log(window.event)
       // var top = document.body.scrollTop || document.documentElement.scrollTop;
       // console.log(top)
      // console.log(this.pageIndex,this.styleId,this.areaId);
        var top =  window.event.changedTouches[0].clientY
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          this.keep.go('/newscene.html',true,{sceneId:e.sceneId,pageIndex:this.pageIndex-1,styleId:this.styleId,areaId:this.areaId,tagType:this.allid,number:e.imgNumber,type:0})
        })

       }else{
        e.imgactive = false;
       }
      },
      onCancel (e){
        e.imgactive = false;
      },
      cancel(){
        $('#mengban').removeClass('is-visible2');
        $('.content').removeClass('setheight');
        $('.upPic').css('display','none');
        $('.downPic').css('display','inline');
        $('.upPic1').css('display','none');
        $('.downPic1').css('display','inline');
        $('.upPic2').css('display','none');
        $('.downPic2').css('display','inline');
      },
      loadMore() {
        this.loading = true;
        this.scorllload = true;
        console.log(this.pageIndex)
        this.find(this.pageIndex, this.styleId, this.areaId);
      },
      find: function(pageIndex, styleId, areaId) {
        this.isLoading = true;
        var styleId = styleId ? styleId : '';
        var areaId = areaId ? areaId : '';
        var data = {
          pageIndex: pageIndex,
          styleId: styleId,
          areaId: areaId,
          loadDetail:true,
          tagType:this.allid
        };
        this.noData = false;
        console.log(data);
        this.http.get(this).url("/app/api/picture").params(data).request(
          (res) => {
            this.dataload = false;
            this.scorllload = false;
            var req = res.data.data;
            for(var i = 0 ;i<req.length;i++){
              req[i].imgactive = false;
              req[i].pageIndex = this.pageIndex;
              req[i].imgNumber = i;
            }
            console.log(req)
            req.forEach((n) => {
              this.dataitem.push(n)
            });
            if(this.dataitem.length == 0){
              this.noData = true;
            }

            if(req.length == 0) {
              this.loading = true;

            } else {
              this.pageIndex++;
              this.loading = this.controlScroll;
            }
            this.isLoading = false;
            console.log(styleId,areaId)


            if(styleId == ''){
              this.keep.cache.remove('styleId');
            }else{
              this.keep.cache.push('styleId',styleId);
            }

            if(areaId == ''){
              this.keep.cache.remove('areaId');
            }else{
              this.keep.cache.push('areaId',areaId);
            }
            
            if(this.allid == ''){
              this.keep.cache.remove('tagType');
            }else{
              this.keep.cache.push('tagType',this.allid);
            }
            
            
            this.keep.cache.push("secneImgData", this.dataitem);
            this.keep.cache.push("secneImgData-pageIndex", this.pageIndex);
          },(err)=>{
            if(pageIndex == 1){
              this.loadFailed = true;  
            }else{
              this.reloadflag = true;
            }
            this.scorllload = false;
            this.dataload = false;
          }
        )
      }

    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/imgdetail.scss';
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
      top:1rem !important;
    }
    .showAppTip3{
      margin-top:0.5rem !important;
    }
</style>
