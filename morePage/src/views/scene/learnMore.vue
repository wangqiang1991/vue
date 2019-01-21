<template>
  <div id="learnMore_Vue">

  	<div class="designersBox">
      <div class="userMeg">
        <div class="userNmae">
          <p>{{data.nickName}}</p>
          <div class="starBox">
            <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" track-by="index"></span>
          </div>
        </div>
        <div class="designersHeader">
          <img :src="data.head"/>
        </div>        
      </div>

      <div class="designersInformation" v-show='tags.length'>
        <span style="height:0.2rem;line-height:0.2rem;">擅长</span>
        <ul>
          <li v-for='tag in tags'>{{tag}}</li>
        </ul>
      </div>

  		<div class="designersInformation">
        <span>简介</span>
        <p>{{data.description}}</p>
      </div>

  	</div>
    
    <div style="width:3.75rem;height:0.12rem;background:#f2f2f2;"></div>


  	<div class="imgBox">
  		<p class="myWorkTitle">作品</p>
  		<ul>
  			<li v-for='img in imgData'>
  			  <img v-lazy="img.cover + '?imageView2/0/w/320/h/320|imageslim'" @click="gotoScene(img,5)" >
          <div  @click='allMore' style="font-size:0.13rem;font-weight:700;">
            查看全部作品
          </div>
  			</li>
  		</ul>
      <p class="line" style="width:3.35rem;height:1px;background:#ddd;"></p>
  	</div>

    <div class="imgBox">
      <p class="myWorkTitle">你可能喜欢</p>
      <ul>
        <li v-for='img in likeData'>
          <img v-lazy="img.cover + '?imageView2/0/w/320/h/320|imageslim'"  @click="gotoScene(img,6)" >
        </li>
      </ul>
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
    name: 'learnMore',
    components:{
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      Vload:Load
    },
    data() {
      return {
        firstLoad:false,
        loadFailed:false,
        dataload:true,
        score:0,
        data:[],
        tags:[],
        designerId:null,
        sceneId:null,
        imgData:[],
        likeData:[],
        less:true,
        top:0,
        time:0
      }
    },
    created() {
      document.title = "设计师";
    },
    mounted: function() {
      this.designerId = this.getParam('designerId');
      this.sceneId = this.getParam('sceneId');
      if(this.keep.isKeepAlive()) {
        this.dataload = false;
        this.firstLoad = false;
        this.imgData = this.keep.cache.get('imgData');
        this.likeData = this.keep.cache.get('likeData');
        this.data = this.keep.cache.get('designerData');
        this.score = this.data.level;
        this.tags = this.data.tag ? this.data.tag.split(',') : [];
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
      }else{
        this.firstLoad = true;
        this.keep.cache.remove("imgData");
        this.keep.cache.remove("likeData");
        this.keep.cache.remove("designerData");
        //this.findImg();
        //this.alsoLike();
        this.finddesigner();
      }
     

    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.finddesigner();
      },
      seeMore(){
        this.less = !this.less;
      },
      allMore(){
        this.keep.scroll.save();
        this.keep.go('/designer.html',true,{designerId:this.designerId})
      },
      finddesigner(){
         this.http.get(this).url('/app/api/picture/designer/detail/:designerId').restful({designerId:this.designerId}).request((req) => {
          this.firstLoad = false;
          var data = req.data.data;
          console.log(data);
          this.keep.cache.push("designerData", data);
          this.score = data.level;
          this.tags =  data.tag ? data.tag.split(',') : [];
          console.log(this.tags)
          this.data = data;
          this.findImg();
        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
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
     gotoScene(e,type) {
      this.keep.scroll.save();
      console.log(e.number)
      this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,type:type}); 
     },
    onTouchend:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          console.log(e.number)
        this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,type:5}); 
        })
        
       }else{
        e.imgactive = false;
       }
      },
      onTouchend1:function(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 )  ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          console.log(e.number)
           this.keep.go('/newscene.html',true,{sceneId:e.sceneId,number:e.number,type:6}); 
        })
        
       }else{
        e.imgactive = false;
       }
      },
    onCancel (e){
        e.imgactive = false;
    },
    goSceneDetail(e){
      this.keep.go('/scene.html',false,{sceneId:e.sceneId})
    },
    findImg(){
      this.http.get(this).url('/app/api/picture/more').params({designerId:this.designerId,loadDetail:true,pageSize:9}).request((req) => {
        var data = req.data.data;
        console.log(data)
        for(var i=0;i<data.length;i++){
          data[i].imgactive = false;
          data[i].number = i;
        }
        // data.forEach((n) => {
        //   this.imgData.push(n)
        // });
        this.imgData = data;
        this.keep.cache.push("imgData", this.imgData);
        this.alsoLike();
      },(err)=>{
        this.loadFailed = true;
        console.log(err)
      })
    },
    alsoLike(){
      this.http.get(this).url('/app/api/picture/like').params({sceneId:this.sceneId,loadDetail:true,count:21}).request((req) => {
        var data = req.data.data;
        this.dataload = false;
        console.log(data)
        if(data.length <= 6){
           console.log(data.length)
           $('#seeMoreBox').addClass('showAll');
           console.log($('.seeMore'))
           $('.seeMore').hide();
        }
        for(var i=0;i<data.length;i++){
          data[i].imgactive = false;
          data[i].number = i;
        }
        // data.forEach((n) => {
        //   this.likeData.push(n)
        // });
        this.likeData = data;
         this.keep.cache.push("likeData", this.likeData);
      },(err)=>{
        console.log(err)
      })
     }
    },
    computed: { //计算属性
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for(let i = 0; i < integer; i++) {
          result.push("on");
        }
        while(result.length < 5) {
          result.push("off");
        }
        return result;
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/learnMore.scss';
</style>