<template>
  <div id="sceneimg" ref='height'>
    <link rel="stylesheet" href="/static/css/mui.min.css">
    <!-- <span id="xxxx1" style="font-size:0.1rem; position:fixed;color:red; z-index:999"></span> -->

    <div class="mui-slider mui-preview-image mui-fullscreen">
      <div class="mui-slider-group">

        <div class='mui-slider-item mui-zoom-wrapper planetmap' v-for='data in datas'>
          <div class='mui-zoom-scroller mui-zoom-id' :style="{'margin-top':data.paddingTop+'px'}">
            <img class='mui-zoom' :src="data.image + '?imageView2/2/w/2000|imageslim'" :sceneId='data.sceneId' :style="{'transform':'scale(1.3)'}"/>

            <img v-for='n in data.goodsList' :src="n.iconimg" class="icon" 
                 :style="{'top':n.locationY , 'left':n.locationX , 'transform': 'translate('+n.offSetX+'px,'+ n.offSetY+'px)'}" :id='n.goodsId' :type='n.type' :isClick='n.isClick'>

          </div>
        </div>

      </div>
    </div>

    <div class="bottomArea" :class="{'bottomIsOne':(designerId == null)}">
        <p class="learnMore" @click='learnMore' v-show='designerId != null'>
            <img src="../../assets/img/learnMore.png"  />
            了解更多 
        </p> 
        <img class="addCollect" src="../../assets/img/more.png" @click='open'/>
    </div>

    <div class="planetmap normal" id="operation" @click='close'>
      <div class="bottom">
        <p id="save" style="margin-top:0.16rem;"><img src="../../assets/img/savelocal.png">保存到本地 </p>
        <p v-if="showCollect" id="collect"><img src="../../assets/img/new_product_collect_default.png">收藏</p>
        <p v-else  id="cancelCollect"><img src="../../assets/img/new_product_collect_select.png">已收藏</p>
      </div>
    </div>

    <img src="http://appsource.goochao.com/loading_black.png" id="backgroundImg">
   
   <div class="goodsBox">
      <div id="goods">
        <div>
          <div class="banner">
            <mt-swipe :auto="4000">
              <mt-swipe-item v-for="banner in banners" :key='banner'>
                <img :src="banner + '?imageView2/0/w/1024/h/1024|imageslim' ">
              </mt-swipe-item>
            </mt-swipe>
          </div>
          <b id="title"></b>
          <p id="description"></p>
          <div class="mengban">
            <div class="comment" id="tags"></div>
            <div id="mengban"></div>
          </div>
          <div class="like_box">
            <p>
              <input type="text" id="message" maxlength="255" placeholder="喜欢我？就对我表白吧">
            </p>

            <div id="jointolike">
              <img src="../../assets/img/new_btn_like_default.png" >
              <p>加入喜欢</p>
            </div>

             <div id="like">
              <img src="../../assets/img/new_btn_like_press.png" >
              <p>已喜欢</p>
            </div>
          </div>
        </div>
        <p id="off"><img src="../../assets/img/like_box_close.png" alt=""></p>
      </div>
    </div>
    
  </div>
</template>

<script>

  export default {
    name: 'newsceneimg',
    data() {
      return {
        showCollect: true,  //收藏
        datas:[],           //渲染的数据数组
        keepData:[],       //缓存的数组
        banners:[],
        first:true,        //第一次读取缓存
        oneChange:true,
        sceneId:null,
        designerId:null,
        pageIndex:null,
        areaId:null,
        styleId:null,
        number:null,       //进入的这张图的角标
        type:null,          //判断事哪一个页面进入  
        page:null,          //第一次进入页面的角标 
        nextPageIndex:true,  //是否还有下一页
        keyword:null,
        tagType:null
      }
    },
    created() {
      document.title = "图片"
    },
    mounted: function () {

        //设置为全屏高度
        $('.planetmap').css({'height': document.documentElement.clientHeight});

        var data = []; // 当前页面的数据
        var page = 0; //  当前页面的角标


       //获取地址栏的参数
       this.pageIndex = this.getParam("pageIndex"); //分页页码
       this.sceneId = this.getParam("sceneId"); // 场景图 id
       this.number = +this.getParam("number"); // 当前点击的场景图位置
       this.type = +this.getParam("type");  //判断事哪一个页面进入  
       this.tagType = this.getParam('tagType');
       this.areaId = this.getParam("areaId");  // 区域id
       this.styleId = this.getParam("styleId"); // 风格id
       this.keyword = this.getParam('keyword');
       //type == 0 场景图列表进入的数据
       if(this.type == 0){
          this.keepData = this.keep.cache.get("data",null,'/scene_list.html');
       }
       //type == 1 场景图列表只包含点赞的图标进入的数据
       if(this.type == 1){
          this.keepData = this.keep.cache.get("secneImgData",null,'/home_sceneList.html');
       }
       //type == 2 场景图首页
       if(this.type == 2){
          this.keepData = this.keep.cache.get("pictureData",null,'/index.html');
       }
       //type == 3 场景图橱窗详情
       if(this.type == 3){
          this.keepData = this.keep.cache.get("item",null,'/shopwindowdetail2.html');
          this.nextPageIndex = false;
       }
        //type == 4 场景图收藏
       if(this.type == 4){
          this.keepData = this.keep.cache.get("sceneArr",null,'/collect.html');
          this.nextPageIndex = false;
       }
       //type == 5 场景图learn_more 上部分
       if(this.type == 5){
          this.keepData = this.keep.cache.get("imgData",null,'/learn_more.html');
          this.nextPageIndex = false;
       }
       //type == 6 场景图learn_more 下部分
       if(this.type == 6){
          this.keepData = this.keep.cache.get("likeData",null,'/learn_more.html');
          this.nextPageIndex = false;
       }
       //type == 7 场景图设计师
       if(this.type == 7){
          this.keepData = this.keep.cache.get("moreData",null,'/designer.html');
       }
       //type == 8 搜索结果场景图
       if(this.type == 8){
          this.keepData = this.keep.cache.get("picArray",null,'/pic_result.html');
       }
       
       console.log(this.keepData)
       //判断如果没有缓存 就进入到不能左右滑动的那个场景图详情
       if(!this.keepData || this.keepData.length == 0){
        this.keep.go('/scene.html',false,{sceneId:this.sceneId})
       }
      
       //循环判断找到前一个页面点击的那张场景图
       for(var i=0;i<this.keepData.length;i++){
          if(this.keepData[i].detail.sceneId == this.sceneId){
            page = i;
            this.page = page;
          }
        }
    
      //初始化数据 
      this.muiInit();
      data = this.datas[this.page];
      page = this.page;
      console.log('page='+page)

      this.sceneId = data.sceneId;
      this.designerId = data.designerId;
      this.showCollect = data.collection ? false : true;


      //修复当页码初始时从页码1到0时不执行滑动事件bug
      document.querySelector('.mui-slider').addEventListener('swiperight',function(event){
       
        var client_Width = document.documentElement.clientWidth;
        var swipe_left = $('.mui-slider-group').css("transform").slice(7, -2).split(',')[4];
        
        if( Number(swipe_left) > (-1 * client_Width) && this.oneChange && page == 1){
          console.log('+++++++++++++')
          data = this.datas[0];
          page = 0;
          this.sceneId = data.sceneId;
          this.designerId = data.designerId;
          this.showCollect = data.collection ? false : true;
          this.count(this.sceneId)
          this.oneChange = false;
        }

      }.bind(this))

      //左右滑动时执行
      document.querySelector('.mui-slider').addEventListener('slide', function(event) {

        data = [];
        page = event.detail.slideNumber;
        console.log(page)
        data = this.datas[page];
        console.log(data)
        //查询下一页条件
        if(page >= (this.datas.length -4) && this.nextPageIndex){
          this.pageIndex++;
          this.muiInit();
        }
     
        this.sceneId = data.sceneId;
        this.designerId = data.designerId;
        this.showCollect = data.collection ? false : true;
        this.count(this.sceneId)

      }.bind(this));





            var goodsId = null;  //goodsId
            var joinlikearry = []; //点击加入喜欢后返回的数据保存
            var thisIcon = null;// 保存的这个icon数据
            let that = this;
            //点击class=icon图标 展示按钮
            mui(document).off('tap', '.icon');
            mui(document).on('tap', '.icon', function () {
              //this.showgoods =true;
              var icondata = data;
              
              var goods = [];
              goodsId = $(this).attr('id');
              thisIcon = $(this);
              console.log(goodsId)
              for (var i = 0; i < icondata.goodsList.length; i++) {
                if (icondata.goodsList[i].goodsId == goodsId) {
                  goods = icondata.goodsList[i];
                }
              }
              console.log(goods)

              if ($(this).attr('type') == 2) {
                var banners = goods.goods.banner.split(",");
                if(banners.length){
                  that.banners = banners;
                } else {
                  that.banners = [];
                  that.banners.push(goods.goods.cover)  
                }  
                //console.log(icondata)
                //$('#likeimg').attr('src', goods.goods.cover)
                $('#title').html(goods.goods.title)
                $('#description').html(goods.goods.description)
                //$('#more').attr('more_url', goods.goods.detailUrl)

                if ($(this).attr('isclick') == 'false') {
                  $('#tags').html('');
                  $('#mengban').hide();
                  $('#like').hide();
                  $('#jointolike').show();
                  $('#message').val('').attr('disabled', false);
                  for (var i = 0; i < goods.goods.tags.length; i++) {
                    var p = '<p tagsId=' + goods.goods.tags[i].tagsId + '>' + goods.goods.tags[i].title + '</p>';
                    $('#tags').append(p)
                  }
                } else if (goods.comments != null && goods.comments.length != 0) {
                  $('#message').val(goods.comments[0].replayContent).attr('disabled', 'disabled');
                  $('#mengban').show();
                  $('#like').show();
                  $('#jointolike').hide();
                  $('#tags').html('');
                  if (goods.comments[0].tags != null) {
                    var backtagsarry = goods.comments[0].tags.split(',');
                    for (var i = 0; i < goods.goods.tags.length; i++) {
                      var flag = true;
                      for (var j = 0; j < backtagsarry.length; j++) {
                        if (goods.goods.tags[i].tagsId == backtagsarry[j]) {
                          var p = '<p class="choice" tagsId=' + goods.goods.tags[i].tagsId + '>' + goods.goods.tags[i].title + '</p>';
                          $('#tags').append(p);
                          flag = false;
                        }
                      }
                      if (flag) {
                        var p = '<p tagsId=' + goods.goods.tags[i].tagsId + '>' + goods.goods.tags[i].title + '</p>';
                        $('#tags').append(p)
                      }

                    }
                  }else{
                    for (var i = 0; i < goods.goods.tags.length; i++) {
                      var p = '<p tagsId=' + goods.goods.tags[i].tagsId + '>' + goods.goods.tags[i].title + '</p>';
                      $('#tags').append(p)
                    }
                  }
                } else {
                  console.log(joinlikearry)
                  var joinlikedata = [];
                  $('#tags').html('');
                  for (var i = 0; i < joinlikearry.length; i++) {
                    if (goodsId == joinlikearry[i].goodsid) {
                      joinlikedata = joinlikearry[i];
                    }
                  }
                  console.log(joinlikedata)
                  for (var i = 0; i < goods.goods.tags.length; i++) {
                    var flag = true;
                    for (var j = 0; j < joinlikedata.tags.length; j++) {
                      if (goods.goods.tags[i].tagsId == joinlikedata.tags[j]) {
                        var p = '<p class="choice" tagsId=' + goods.goods.tags[i].tagsId + '>' + goods.goods.tags[i].title + '</p>';
                        $('#tags').append(p);
                        flag = false;
                      }
                    }
                    if (flag) {
                      var p = '<p tagsId=' + goods.goods.tags[i].tagsId + '>' + goods.goods.tags[i].title + '</p>';
                      $('#tags').append(p)
                    }

                  }
                  $('#message').val(joinlikedata.content).attr('disabled', 'disabled');
                  $('#mengban').show();
                  $('#like').show();
                  $('#jointolike').hide();
                  //joinlikearry
                }

                mui(document).off('tap', '#tags p');
                mui(document).on('tap', '#tags p', function () {
                  $(this).toggleClass('choice')
                });
                $('.goodsBox').show();
              } else {
                console.log('标签2')
                that.keep.cache.push("datas",that.datas);
                that.keep.cache.push("scene_sceneId",that.sceneId)
                that.keep.cache.push("pageIndex",that.pageIndex)
                that.keep.go('/goods_detail.html',true,{goodsid:goods.goods.goodsId,showGoHome:'1'})

              }

            });
          

            

            // 提交喜欢按钮
            mui(document).off('tap', '#jointolike');
            mui(document).on('tap', '#jointolike', function () {
              var users = this.getUserData('user')  //获取微信用户id方法
              var memberId = JSON.parse(users).memberId;
              let sceneId = null
              if(this.sceneId == null){
                sceneId = this.datas[0].sceneId;
              }else{
                sceneId = this.sceneId;
              }
              var content = $('#message').val();
              var tagsarry = [];
              for (var i = 0; i < $('#tags>p').length; i++) {
                if ($('#tags>p').eq(i).attr('class') == 'choice') {
                  tagsarry.push($('#tags>p').eq(i).attr('tagsid'))
                }
              }
              var tags = tagsarry.join(',');
              //console.log(this.http.postJson)
              var obj = {};
              obj.goodsid = goodsId;
              obj.content = content;
              obj.tags = tagsarry;
              joinlikearry.push(obj);
              this.http.postJson(this).url('/app/api/praise-goods/comment').params(
                {
                  memberId: memberId,
                  goodsId: goodsId,
                  content: content,
                  tags: tags,
                  sceneId: sceneId
                }).request((data) => {
                console.log(data)
                this.showSuccess("已加入喜欢");
                var backdata = data.data.data.goodsList;
                var backicondata = [];
                for (var i = 0; i < backdata.length; i++) {
                  if (goodsId == backdata[i].goodsId) {
                    backicondata = backdata[i];
                  }
                }
                thisIcon.attr('isclick', 'true');
                console.log(backicondata.comments[0])
                var saveData = this.keepData;
                console.log(saveData)
                for(var i = 0;i<saveData.length;i++){
                  if(saveData[i].sceneId == sceneId){
                    var comments = backicondata.comments[0];
                    for(var j=0;j<saveData[i].detail.goodsList.length;j++){
                      if(saveData[i].detail.goodsList[j].goodsId == goodsId){
                        var commentsData = [];
                        commentsData.push(comments)
                        saveData[i].detail.goodsList[j].comments = commentsData;
                        saveData[i].detail.goodsList[j].isclick = "true";
                        if(this.type == 0){
                          this.keep.cache.push("data", saveData , '/scene_list.html');
                        }
                        if(this.type == 1){
                          this.keep.cache.push("secneImgData", saveData , '/home_sceneList.html');
                        }
                        if(this.type ==2){
                          this.keep.cache.push("pictureData", saveData , '/index.html');
                        }
                        if(this.type == 3){
                           this.keep.cache.push("item", saveData , '/shopwindowdetail2.html');
                        }
                        if(this.type == 4){
                           this.keep.cache.push("sceneArr", saveData , '/collect.html');
                        }
                        if(this.type == 5){
                           this.keep.cache.push("imgData", saveData , '/learn_more.html');
                        }
                        if(this.type == 6){
                           this.keep.cache.push("likeData", saveData , '/learn_more.html');
                        }
                        if(this.type == 7){
                           this.keep.cache.push("moreData", saveData , '/designer.html');
                        }
                        if(this.type == 8){
                           this.keep.cache.push("picArray", saveData , '/pic_result.html');
                        }
                        
                      }
                      
                    }
                    
                  }
                }
                for(var i = 0;i<this.datas.length;i++){
                  if(this.datas[i].sceneId == sceneId){
                    var comments = backicondata.comments[0];
                    for(var j=0;j<this.datas[i].goodsList.length;j++){
                      if(this.datas[i].goodsList[j].goodsId == goodsId){
                        var commentsData = [];
                        commentsData.push(comments)
                        this.datas[i].goodsList[j].comments = commentsData;
                        this.datas[i].goodsList[j].isClick = "true";
                        this.keep.cache.push("datas", this.datas);
                        console.log(this.datas[i])
                      }
                    }
                  }
                }

                $('#message').val(backicondata.comments[0].replayContent).attr('disabled', 'disabled');
                $('#mengban').show();
                $('#like').show();
                $('#jointolike').hide();
                if (backicondata.comments[0].tags != null) {
                  var backtagsarry = backicondata.comments[0].tags.split(',');
                  for (var i = 0; i < backtagsarry.length; i++) {
                    for (var j = 0; j < $('#tags>p').length; j++) {
                      if ($('#tags>p').eq(j).attr('tagsid') == backtagsarry[i]) {
                        $('#tags>p').eq(j).addClass('choice')
                      }
                    }
                  }
                }

              })

            }.bind(this))


        //双击 图片放大
        mui(document).on('doubletap', '.mui-zoom', function () {
          clearTimeout(TimeFn);
          var style = 300 + 'ms';
          var off =  data.off;
          console.log(off)
          if (data.doubletap) {

            for (var i = 0; i < off.length; i++) {
              
              $('.mui-slider-item').eq(page).children().children().eq(i+1).css("transform", 'translate(' + off[i].offwidth + 'px,' + off[i].offheight + 'px)');

              $('.mui-slider-item').eq(page).children().children().eq(i+1).css("webkitTransition", style);
            }

            data.doubletap = false;
          } else {
            for (var i = 0; i < off.length; i++) {


              $('.mui-slider-item').eq(page).children().children().eq(i+1).css("transform", 'translate(' + 0 + 'px,' + 0 + 'px)');
              $('.mui-slider-item').eq(page).children().children().eq(i+1).css("webkitTransition", style);

            }
            data.doubletap = true;
          }

        }.bind(this));


         //双手 拉开收缩
        mui.bindPinch(function (scale) {

          var currentDoc = $('.mui-slider-item').eq(page).children().children().eq(0);
          var trans = $(currentDoc).css("transform").slice(7, -2).split(',')[0];
          var style = 0 + 'ms';
          var off =  data.off;

          if (trans < 1) {
            trans = 1;
          }
          if (trans > 3) {
            trans = 3;
          }

          for (var i = 0; i < off.length; i++) {
           $(currentDoc).nextAll().eq(i).css("transform", 'translate(' + off[i].offwidth * (trans - 1)/2 + 'px,' + off[i].offheight * (trans - 1)/2 + 'px)');
           $(currentDoc).nextAll().eq(i).css("webkitTransition", style);
          }

          if (trans > 1) {
            data.doubletap = false;
          } else {
            data.doubletap = true;
          }

        });
          


            


        //单击叉叉 关闭
        mui(document).on('tap', '#off', function () {
          //this.showgoods =true;
          $('.goodsBox').hide();

        });




        //点击更多按钮
        mui(document).off('tap', '#more');
        mui(document).on('tap', '#more', function () {
         // window.location.href = '/praise_goods_detail.html?goodsid=' + goodsId;
          this.keep.cache.push("datas",this.datas);
          this.keep.cache.push("scene_sceneId",this.sceneId)
          this.keep.cache.push("pageIndex",this.pageIndex)
          this.keep.go('/praise_goods_detail.html',true,{goodsid:goodsId,showGoHome:'1'})
        }.bind(this));



        //单击icon所有图标隐藏/显示
        var show = true;
        var TimeFn = null;
        mui(document).on('tap', '.mui-zoom', function () {

          clearTimeout(TimeFn);
          TimeFn = setTimeout(function () {
            if (show) {
              $('.mui-zoom-id>.icon').hide();
              show = false;
            } else {
              $('.mui-zoom-id>.icon').show();
              show = true;
            }
          }, 300);

        }.bind(this));



        //阻止默认事件的进行  
        mui(document).on('tap', '#operation>div', function (e) {
          e.preventDefault();
        });


        // 保存到本地
        mui(document).off('tap', '#save');
        mui(document).on('tap', '#save', function (e) {
          console.log('save');
          this.showMessage('喜欢此图?长按可以保存哦~~')
          $('#operation').removeClass('active');
          $('.mui-zoom-id>.icon').hide();
          show = false;
        }.bind(this));
       

        // 收藏
        mui(document).off('tap', '#collect');
        mui(document).on('tap', '#collect', function (e) {
          console.log('collect')
          var sceneId = null
          if(this.sceneId == null){
            sceneId = this.datas[0].sceneId;
          }else{
            sceneId = this.sceneId;
          }
          console.log(sceneId)
          this.http.post(this).url('/app/api/scene/collection').params({
            sceneId:sceneId
          }).request(function(response){
            console.log(response)
            this.showSuccess('收藏成功')
            this.showCollect = false;
            var saveData = this.keepData;
            console.log(saveData)
            for(var i=0;i<saveData.length;i++){
              if(saveData[i].sceneId == sceneId){
                saveData[i].detail.collection = true;

                if(this.type ==0){
                  this.keep.cache.push("data", saveData , '/scene_list.html');
                }
                if(this.type ==1){
                  this.keep.cache.push("secneImgData", saveData , '/home_sceneList.html');
                }
                if(this.type ==2){
                  this.keep.cache.push("pictureData", saveData , '/index.html');
                }
                if(this.type == 3){
                   this.keep.cache.push("item", saveData , '/shopwindowdetail2.html');
                }
                if(this.type == 4){
                   this.keep.cache.push("sceneArr", saveData , '/collect.html');
                }
                if(this.type == 5){
                   this.keep.cache.push("imgData", saveData , '/learn_more.html');
                }
                if(this.type == 6){
                   this.keep.cache.push("likeData", saveData , '/learn_more.html');
                }
                if(this.type == 7){
                   this.keep.cache.push("moreData", saveData , '/designer.html');
                }
                if(this.type == 8){
                   this.keep.cache.push("picArray", saveData , '/pic_result.html');
                }
                
              }
            }
            for(var i = 0;i<this.datas.length;i++){
              if(this.datas[i].sceneId == this.sceneId){
                this.datas[i].collection = true;
                this.keep.cache.push("datas", this.datas);
              }
            }
          },function(err){
            //this.showMessage('收藏失败')
          })  
        }.bind(this));


         // 取消收藏
        mui(document).off('tap', '#cancelCollect');
        mui(document).on('tap', '#cancelCollect', function (e) {

          var sceneId = null
          if(this.sceneId == null){
            sceneId = this.datas[0].sceneId;
          }else{
            sceneId = this.sceneId;
          }

          this.http.delete(this).url(this.config.collect.cancel_scene).restful({
            sceneId:sceneId
          }).request(function(response){

            this.showSuccess('已取消收藏')
            this.showCollect = true;
            var saveData = this.keepData;
            console.log(saveData)
            for(var i=0;i<saveData.length;i++){
              if(saveData[i].sceneId == sceneId){
                saveData[i].detail.collection = false;

                if(this.type ==0){
                  this.keep.cache.push("data", saveData , '/scene_list.html');
                }
                if(this.type ==1){
                  this.keep.cache.push("secneImgData", saveData , '/home_sceneList.html');
                }
                if(this.type ==2){
                  this.keep.cache.push("pictureData", saveData , '/index.html');
                }
                if(this.type == 3){
                   this.keep.cache.push("item", saveData , '/shopwindowdetail2.html');
                }
                if(this.type == 4){
                   this.keep.cache.push("sceneArr", saveData , '/collect.html');
                }
                if(this.type == 5){
                   this.keep.cache.push("imgData", saveData , '/learn_more.html');
                }
                if(this.type == 6){
                   this.keep.cache.push("likeData", saveData , '/learn_more.html');
                }
                if(this.type == 7){
                   this.keep.cache.push("moreData", saveData , '/designer.html');
                }
                if(this.type == 8){
                   this.keep.cache.push("picArray", saveData , '/pic_result.html');
                }
                
              }
            }

            for(var i = 0;i<this.datas.length;i++){
              if(this.datas[i].sceneId == this.sceneId){
                this.datas[i].collection = false;
                this.keep.cache.push("datas", this.datas);
              }
            }
          },function(err){
            //this.showMessage('收藏失败')
          })  
        }.bind(this));


    },
    methods: {
      count(sceneId){
         //请求场景图计数
        axios.head('/app/api/picture/view-count',{
          params: {
            sceneId: sceneId
          }
        }).then(()=>{})
      },
      muiInit(){
       if(this.first){
          var data = [];
          var page = null;

         if(this.keep.isKeepAlive()) {

            console.log('iskeep++++++++++++')

            this.datas = this.keep.cache.get('datas');
            this.pageIndex = this.keep.cache.get('pageIndex');
            this.sceneId = this.keep.cache.get('scene_sceneId');
            this.keep.markNotKeepAlive();
            for(var i=0;i<this.datas.length;i++){
            if(this.datas[i].sceneId == this.sceneId){
              this.page = i;
              page = i;
            }
           }
           console.log(this.datas)

           }else{
            console.log('noKeep-----------')
            console.log(this.keepData)

            for(var i = 0; i< this.keepData.length;i++){
              data.push(this.keepData[i].detail)
            }
            page = this.page;
            this.initData(data)
            
          }

         
         console.log(page)
         this.$nextTick( ()=>{
           var mui_zomm = mui('.mui-zoom-wrapper').zoom();
           var imageLength = this.datas.length;
           var number = 0;

           $(".mui-zoom").load(()=>{
              if(number == page){
                $('#backgroundImg').hide();
              }
              number++;
           })
           
           mui('.mui-slider').slider().gotoItem(page,0);
         });
         this.first = false;
         this.count(this.sceneId);

      }else{
        var url= null;
        var params = null;
        if(this.type == 0){
          url = '/app/api/picture';
          params = {pageIndex:this.pageIndex,styleId:this.styleId,areaId:this.areaId,loadDetail:true,tagType:this.tagType}
        }
        if(this.type == 1){
          url = "/app/api/picture";
          params = {pageIndex:this.pageIndex,styleId:this.styleId,areaId:this.areaId,loadDetail:true,tagType:1}
        }
        if(this.type == 2){
          url = "/app/api/home/recommends";
          params = {pageIndex:this.pageIndex,pageSize:10}
        }
        if(this.type == 7){
          url = '/app/api/picture/more';
          params = {designerId:this.getParam('designerId'),loadDetail:true,pageSize:12,pageIndex:this.pageIndex}
        }
        if(this.type == 8){
          url = '/app/api/picture/search';
          params = { keyword:this.keyword,pageIndex:this.pageIndex, pageSize:8,loadDetail:true}
        }
       console.log('pageIndex=',this.pageIndex);
       this.http.get(this).url(url).params(params).request((req) => {
          if (req.data.code != 0) {
            //this.$toast(req.data.message);
            return;
          }
          console.log(req)
          if(req.data.data.length == 0){
            this.nextPageIndex = false;
            return ;
          }


           var data = [];
          //首页请求数据有其他数据特殊处理
          if(this.type == 2){
           
            for(var i = 0; i< req.data.data.length;i++){
               if(req.data.data[i].type == 1){
                data.push(req.data.data[i].detail)
              }
            }

          }else{
             
            for(var i = 0; i< req.data.data.length;i++){
              data.push(req.data.data[i].detail)
            }
          
          }

          this.initData(data)
          // mui点击效果初始化
          this.$nextTick( ()=>{
             var mui_zomm = mui('.mui-zoom-wrapper').zoom();
           })


          });  
        } 
      },
      learnMore(){
        if(this.designerId == null){
          this.showMessage('该场景图查无更多信息')
        }else{
          this.keep.cache.push("datas",this.datas);
          this.keep.cache.push("scene_sceneId",this.sceneId)
          this.keep.cache.push("pageIndex",this.pageIndex)
          this.keep.go('/learn_more.html',true,{designerId:this.designerId,sceneId:this.sceneId})
        }
      },
      initData(data){

        for(var j=0; j<data.length; j++){  
          var iconOffset = [];
          data[j].doubletap = true;
          //计算图标偏移量
          var width = document.documentElement.clientWidth;
          var height = (document.documentElement.clientWidth)*data[j].height/data[j].width;
          var paddingTop = (document.documentElement.clientHeight-height)/2;

          for (var i = 0; i < data[j].goodsList.length; i++) {
            var location = data[j].goodsList[i].location;

            //下面计算偏移量的初始化位置
            var obj = {};
            obj.offsetX = location.slice(location.indexOf(':') + 1, location.indexOf(','));
            obj.offsetY = location.slice(location.lastIndexOf(':') + 1, location.lastIndexOf('}'));
            //初始化设置放大倍数
            data[j].goodsList[i].offSetX= -1 * (width - obj.offsetX*width/50 - 32)*0.3/2;
            data[j].goodsList[i].offSetY= -1 * (height - obj.offsetY*height/50 - 32)*0.3/2 ;

            iconOffset.push(obj)
            
            //图标的偏移量
            var locationX = location.slice(location.indexOf(':') + 1, location.indexOf(',')) + '%';
            var locationY = location.slice(location.lastIndexOf(':') + 1, location.lastIndexOf('}')) + '%';

            data[j].goodsList[i].locationX = locationX;
            data[j].goodsList[i].locationY = locationY;

            //判断是否已经评论过了
            if (data[j].goodsList[i].comments != null && data[j].goodsList[i].comments.length != 0) {
                data[j].goodsList[i].isClick = 'true';
               } else {
                data[j].goodsList[i].isClick = 'false';
              }

              //判断图标类型
            if (data[j].goodsList[i].type == 2) {
              data[j].goodsList[i].iconimg = '/static/images/dz.png';
            }
            else {
              data[j].goodsList[i].iconimg = '/static/images/gm.png';
            }
          }


          if(paddingTop <= 0){
            data[j].paddingTop = 0;  
          }else{
            data[j].paddingTop = paddingTop;
          }

          if(data[j].goodsList.length == 0){
            data[j].off = [];
            this.datas.push(data[j]);
          }else{
             let offset = [];
             for (var i = 0; i < data[j].goodsList.length; i++) {
                var obj = {}
                var offwidth = width / 2 - iconOffset[i].offsetX*width/100 - 16;
                var offheight = height / 2 - iconOffset[i].offsetY*height/100 - 16;
                obj.offwidth = -offwidth*2;
                obj.offheight = -offheight*2; 
                offset.push(obj)
            }
            data[j].off = offset;
            this.datas.push(data[j]);
          }
        }
      },
      open(){
        $('#operation').addClass('active');
      },
      close(){
        console.log('close')
        $('#operation').removeClass('active');
      }
      
    }
  }


</script>

<style lang='scss'>
  @import '../../assets/scss/sceneimg.scss';
</style>


<style type="text/css">
  .mui-preview-image.mui-fullscreen {
    position: fixed;
    z-index: 20;
    background-color: #000;
  }
  .mui-preview-header,
  .mui-preview-footer {
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 10;
  }
  .mui-preview-header {
    height: 44px;
    top: 0;
  }
  .mui-preview-footer {
    height: 50px;
    bottom: 0px;
  }
  .mui-preview-header .mui-preview-indicator {
    display: block;
    line-height: 25px;
    color: #fff;
    text-align: center;
    margin: 15px auto 4;
    width: 70px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    font-size: 16px;
  }
  .mui-preview-image {
    -webkit-animation-duration: 0.5s;
    animation-duration: 0.5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  .mui-preview-image.mui-preview-in {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }
  .mui-preview-image.mui-preview-out {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
  }
  .mui-preview-image.mui-preview-out .mui-preview-header,
  .mui-preview-image.mui-preview-out .mui-preview-footer {
  }
  .planetmap {
    position: absolute;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    -webkit-backface-visibility: hidden;
  }
  .mui-zoom {
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }
  .mui-slider .mui-slider-group .mui-slider-item img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .mui-android-4-1 .mui-slider .mui-slider-group .mui-slider-item img {
    width: 100%;
  }
  .mui-android-4-1 .mui-slider.mui-preview-image .mui-slider-group .mui-slider-item {
    display: inline-table;
  }
  .mui-android-4-1 .mui-slider.mui-preview-image .mui-zoom-scroller img {
    display: table-cell;
    vertical-align: middle;
  }
  .mui-preview-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: none;
  }
  .mui-preview-loading.mui-active {
    display: block;
  }
  .mui-preview-loading .mui-spinner-white {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
    margin-top: -25px;
    height: 50px;
    width: 50px;
  }
  .mui-preview-image img.mui-transitioning {
    -webkit-transition: -webkit-transform 0.5s ease, opacity 0.5s ease;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }

  p img {
    max-width: 100%;
    height: auto;
  }
</style>