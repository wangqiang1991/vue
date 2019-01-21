<template>
  <div id="collect_Vue">
    <div class="content">
      <div class="widget widget-tab">
       <input type="radio" name="widget-tab" id="pro"  checked="checked"/>
        <input type="radio" name="widget-tab" id="pic"  />
        <input type="radio" name="widget-tab" id="art" />
       
        <div class="widget-title inline-block tabs">
          <ul style="float: left;">

            <li class="pro">
              <label for="pro">商品</label>
            </li>

            <li class="pic">
              <label for="pic">图片</label>
            </li>

            <li class="art">
              <label for="art">期刊</label>
            </li>

          </ul>
        </div>
        <div class="spaceArea">

        </div>

        <div class="widget-box">

          <!-- 收藏场景图 -->
          <ul class="pic-list" id="picture_box">
            <li v-if="sceneArr.length != 0">
              <img  v-for="n in sceneArr"  :src="n.scenePictureVo.cover + '?imageView2/0/w/512/h/512|imageslim'" class="collectPic" @click="gotoScene(n)"/>
              <!--<p class="editPic" @click="editPic1" v-if="this.showEdit">编辑</p>
              <p class="editPic" @click="editPic2" v-else>完成</p>-->
              <!--<p class="editPic">完成</p>-->
             <!--  <div class="picture">
                <div class="picture1" v-for="n in sceneArr" :class="{'imgactive':n.imgactive}">
                  <div class="pictureBox"> -->
                   <!--  <img :src="n.scenePictureVo.cover + '?imageView2/0/w/512/h/512|imageslim'" class="collectPic" @touchcancel='onCancel(n)' @touchstart='onTouchstart(n)' @touchend='onTouchend(n)' /> -->
                    <!-- <img :src="n.scenePictureVo.cover + '?imageView2/0/w/512/h/512|imageslim'" class="collectPic" @click="gotoScene(n)"/> -->
                   <!--  <div class="deletePicArea">
                      <img src="../../assets/img/icon_del_background.png" class="deletePicBtn" @click="deletePic(n)" />
                    </div> -->
                 <!--  </div>
                </div>
              </div> -->
            </li>
            <div class="emptyArea" v-show="!firstLoad && !sceneArr.length">
              <img src="../../assets/img/noDataCollect.png" class="emptyPic" />
              <p style="color:#ddd;font-size:0.16rem;">收藏空空如也<br>快去逛逛图片吧</p>
            </div>
          </ul>
  
          <!-- 收藏商品 -->
          <ul class="pro-list">
            <li v-if="GoodsArr.length != 0">
              <div class="product" >
                <div class="product1" v-for="n in GoodsArr">

                  <div style="background:#fff;" class="productBox">
                   <!--  <img :src="n.goodsSimpleDetailVo.cover+ '?imageView2/0/w/512/h/512|imageslim'"  @touchcancel='onCancel(n)' @touchstart='onTouchstart1(n)' @touchend='onTouchend1(n)' class="productPic" :class="{'imgactive':n.imgactive}"/> -->
                      <img :src="n.goodsSimpleDetailVo.cover+ '?imageView2/0/w/512/h/512|imageslim'" @click="gotoGoods(n)"/>
                    <div>
                      <p class="productName" style="height:0.2rem;line-height: 0.2rem;font-size:0.16rem;color:#343434;">{{n.goodsSimpleDetailVo.title}}</p>
                      <p class="style" style="color:#999;height:0.18rem;line-height: 0.18rem;">{{n.goodsSimpleDetailVo.description ? n.goodsSimpleDetailVo.description : '无'}}</p>

                      <p class="productPrice goodsPrice" v-show="!n.goodsSimpleDetailVo.discountType">￥{{n.goodsSimpleDetailVo.minPrice}}</p>

                      <div class="goods_discount" v-show="n.goodsSimpleDetailVo.discountType == 2">
                        <p>¥{{n.goodsSimpleDetailVo.discountPrice}}  <span>¥{{n.goodsSimpleDetailVo.minPrice}}</span></p> 
                        <div class="goods_tag">{{n.goodsSimpleDetailVo.discountTag}}</div>
                      </div>

                      <div class="goods_amount" v-show="n.goodsSimpleDetailVo.discountType == 3">
                        <p>¥{{n.goodsSimpleDetailVo.minPrice}}</p> 
                        <div class="goods_tag">{{n.goodsSimpleDetailVo.discountTag}}</div>
                      </div>

                      <!-- <img src="../../assets/img/icon_del.png" class="deletePro" @click="deleteGood(n)" /> -->
                    </div>
                  </div>
                
                </div>
              </div>
            </li>
            <div class="emptyArea" v-show="!firstLoad && !GoodsArr.length">
              <img src="../../assets/img/noDataCollect.png" class="emptyPic" />
              <p style="color:#ddd;font-size:0.16rem;">收藏空空如也<br>快去逛逛商品吧</p>
            </div>
          </ul>

          <!-- 收藏文章 -->
          <ul class="art-list">
            <li v-if="articleArr.length != 0" style="padding-top:0.16rem;">
              <div class="articles" v-for="n in articleArr">

                <div class="articlesBox">
                  <div class="articlePicBox">
                    <img  @click="articledetail(n)" :src="n.subjectArticleDetailVo.cover+ '?imageView2/0/w/512/h/260|imageslim'" />
                    <p>{{n.subjectArticleDetailVo.typeName}}</p>
                  </div>
                  <p class="artTitle">{{n.subjectArticleDetailVo.title}}</p>
                  <!-- <p class="artContent">{{n.subjectArticleDetailVo.description}}</p> -->
                </div>

               <!--  <div class="deleteArea" @click="deleteArt(n)">
                  <img src="../../assets/img/icon_del.png" class="deleteArtBtn"/>
                	
                </div> -->
              </div>
            </li>
            <div class="emptyArea" v-show="!firstLoad && !articleArr.length">
              <img src="../../assets/img/noDataCollect.png" class="emptyPic" />
              <p style="color:#ddd;font-size:0.16rem;">收藏空空如也<br>快去逛逛期刊吧</p>
            </div>
          </ul>

        </div>
      </div>
    </div>
  <!-- <Vload :dataload="dataload"></Vload> -->
    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
  import Load from '../../components/Loading.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  export default {
    name: 'collect',
    components:{
      Vload:Load,
      firstLoad:firstLoad,
      loadFailed:loadFailed
    },
    created() {
      document.title = "我的收藏"
    },
    activated() {
      document.title = "我的收藏";
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        articleArr: [],
        GoodsArr: [],
        sceneArr: [],
        showEdit: true,
        dataload:true,
        top:0,
        time:0,
        type:1
      }
    },
    mounted: function() {

      if(this.keep.isKeepAlive()){
        this.dataload = false;
        this.firstLoad = false;
        this.articleArr = this.keep.cache.get('articleArr');
        this.GoodsArr = this.keep.cache.get('GoodsArr');
        this.sceneArr = this.keep.cache.get('sceneArr');
        this.type = this.keep.cache.get('type');
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });
        if(this.type == 1){
          $('#pic').attr('checked','checked');
        }else if(this.type == 2){
          $('#art').attr('checked','checked');
        }else{
          $('#pro').attr('checked','checked');
        }
      }else{
        this.firstLoad = true;
        this.keep.cache.remove('articleArr');
        this.keep.cache.remove('GoodsArr');
        this.keep.cache.remove('sceneArr');
        this.keep.cache.remove('type');
        this.findGoods();
        this.findScene();
        this.findSubject();
        
      }
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.findGoods();
        this.findScene();
        this.findSubject();
       
      },
      findScene() {
        //查询场景图
        this.http.get(this).url('/app/api/scene/collection').params({loadDetail:true}).request(function(response) {
          console.log(response)
          this.dataload = false;
          //this.firstLoad = false;
          var data = response.data.data;
          for(var i=0;i<data.length;i++){
            data[i].imgactive = false;
            data[i].number = i;
          }
          console.log(data.length)
          this.sceneArr = [];
          data.forEach((n) => {
            this.sceneArr.push(n)
          })
          console.log(this.sceneArr)
          this.keep.cache.push('sceneArr',this.sceneArr);
          
          
        },(err)=>{
          this.loadFailed = true;
          this.firstLoad = false;
        })
      },
      findSubject() {
        //查询专题期刊
        this.http.get(this).url('/app/api/subject/collection').request(function(response) {
          //this.firstLoad = false;
          console.log('期刊')
          console.log(response)
          var data = response.data.data;
          console.log(data.length)
          this.articleArr = [];
          data.forEach((n) => {
            this.articleArr.push(n)
          })
          this.keep.cache.push('articleArr',this.articleArr);
        },(err)=>{
          this.loadFailed = true;
          this.firstLoad = false;
        })
      },
      findGoods() {
        //查询商品
        this.http.get(this).url('/app/api/goods/collection').request(function(response) {
          this.firstLoad = false;
          console.log('商品')
          console.log(response)
          var data = response.data.data;
          //      console.log(data[0].goodsSimpleDetailVo)
          for(var i=0;i<data.length;i++){
            data[i].imgactive = false;
          }
          console.log(data.length)
          this.GoodsArr = [];
          data.forEach((n) => {
            this.GoodsArr.push(n)
          })
          this.keep.cache.push('GoodsArr',this.GoodsArr);
        },(err)=>{
          this.loadFailed = true;
          this.firstLoad = false;
        })
      },
      //删除期刊
      deleteArt(n) {
         this.$messagebox({
           message: '是否删除该期刊？',
           cancelButtonText:"取消",
           showCancelButton:true,
           confirmButtonText:"删除",
           showConfirmButton:true
          }).then((action) => {
          if(action == "cancel"){
            return ;
          }
          let that = this;
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          console.log(n)
          this.http.delete(this).url('/app/api/subject/collection/:collectionId').restful({
            collectionId: n.collectionId
          }).request(function(response) {
            this.$indicator.close();
            this.showSuccess('删除成功')
            console.log(response)
            for(var i = 0; i < that.articleArr.length; i++) {
              console.log(that.articleArr[i].collectionId)
              if(that.articleArr[i].collectionId == n.collectionId) {
                that.articleArr.splice(i, 1)
              }
            }
          }, function(err) {
            this.$indicator.close();
            //this.showMessage('删除失败')
          })
        }).catch((err) => {
          console.log(err)
        });
      },
      //删除图片
      deletePic(n) {
        this.$messagebox({
           message: '是否删除该图片？',
           cancelButtonText:"取消",
           showCancelButton:true,
           confirmButtonText:"删除",
           showConfirmButton:true
          }).then((action) => {
          if(action == "cancel"){
            return ;
          }
          let that = this;
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          this.http.delete(this).url('/app/api/scene/collection/:collectionId').restful({
            collectionId: n.collectionId
          }).request(function(response) {
            this.$indicator.close();
            this.showSuccess('删除成功')
            console.log(n.collectionId)
            for(var i = 0; i < that.sceneArr.length; i++) {
              console.log(that.sceneArr[i].collectionId)
              if(that.sceneArr[i].collectionId == n.collectionId) {
                that.sceneArr.splice(i, 1)
              }
            }
            console.log(that.sceneArr)
            console.log(response)
          }, function(err) {
            this.$indicator.close();
            //this.showMessage('删除失败')
          })
        }).catch((err) => {
          return;
        });
      },

      //删除商品
      deleteGood(n) {
        this.$messagebox({
           message: '是否删除该商品？',
           cancelButtonText:"取消",
           showCancelButton:true,
           confirmButtonText:"删除",
           showConfirmButton:true
          }).then((action) => {
          if(action == "cancel"){
            return ;
          }
          let that = this;
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
          console.log(n)
          this.http.delete(this).url('app/api/goods/collection/:collectionId').restful({
            collectionId: n.collectionId
          }).request(function(response) {
            this.$indicator.close();
            this.showSuccess('删除成功')
            for(var i = 0; i < that.GoodsArr.length; i++) {
              console.log(that.GoodsArr[i].collectionId)
              if(that.GoodsArr[i].collectionId == n.collectionId) {
                that.GoodsArr.splice(i, 1);
              }
            }
            console.log(response)
          }, function(err) {
            this.$indicator.close();
            //this.showMessage('删除失败')
          })
        }).catch((err) => {
          return;
        });
      },
       onTouchstart1 (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.GoodsArr.length;i++){
          this.GoodsArr[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
     onTouchend1(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 )){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          this.keep.cache.push("type",3);
          console.log(e);
          this.keep.go("/goods_detail.html",true,{goodsid:e.goodsId,showGoHome:'1'});
        })
        
       }else{
        e.imgactive = false;
       }
      },
      gotoGoods(e){
        this.keep.scroll.save();
        this.keep.cache.push("type",3);
        console.log(e);
        this.keep.go("/goods_detail.html",true,{goodsid:e.goodsId,showGoHome:'1'});
      },
      onCancel (e){
          e.imgactive = false;
      },
      articledetail(n) {
        console.log(n)
        this.keep.scroll.save();
        this.keep.cache.push("type",2);
        this.keep.go("/article.html",true,{subjectArticleId:n.subjectId,showGoHome:'1'});
      },
      onTouchstart (e){
        var top =  window.event.changedTouches[0].clientX
        this.top = top;
        this.time = 0;
        for(var i = 0 ;i<this.sceneArr.length;i++){
          this.sceneArr[i].imgactive = false;
        }
        e.imgactive =true;
        setTimeout( () =>{
          this.time = 200;
        },200)
      },
     onTouchend(e){
      var top =  window.event.changedTouches[0].clientX
      if(this.time<200 && this.top >= (top - 3) && this.top <= ( top + 3 ) ){
        e.imgactive = false;
        setTimeout( ()=>{
          this.keep.scroll.save();
          this.keep.cache.push("type",1);
          console.log(e)
          this.keep.go("/newscene.html",true,{sceneId:e.sceneId,number:e.number,type:4});
        })
        
       }else{
        e.imgactive = false;
       }
      },
      gotoScene(e) {
        this.keep.scroll.save();
        this.keep.cache.push("type",1);
        console.log(e)
        this.keep.go("/newscene.html",true,{sceneId:e.sceneId,number:e.number,type:4});
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/collect.scss';
</style>