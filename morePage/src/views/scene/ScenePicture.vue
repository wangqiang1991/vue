<template>
  <div id="sceneimg" ref='height'>
    <link rel="stylesheet" href="/static/css/mui.min.css">
    <!-- <span id="xxxx" style="font-size:0.1rem; position:fixed; z-index:999"></span> -->
  
    <a id="gohome" v-if = "showGoHome"><img src="../../assets/img/go_to_home_icon.png"></a>  

    <div class='mui-zoom-wrapper' id="planetmap">
      <div class='mui-zoom-scroller' id="mui-zoom">

        <img class='mui-zoom' id="zoom" :src="image + '?imageView2/2/w/2000|imageslim'" alt="img" style="opacity:0;transform:scale(1.3)"  />

        <img v-for='n in goodsList' :src="n.iconimg" class="icon" 
             :style="{'top':n.locationY , 'left':n.locationX ,'transform': 'translate('+n.offSetX+'px,'+ n.offSetY+'px)'}" :id='n.goodsId' :type='n.type' :isClick='n.isClick'>

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
        <p v-else id="cancelCollect"><img src="../../assets/img/new_product_collect_select.png">已收藏</p>
      </div>
    </div>

    <img src="http://appsource.goochao.com/loading_black.png" id="backgroundImg">
    <div class="goodsBox">
      <div id="goods">
        <div>
         <!--  <p>喜欢这款商品？ <a id="more">更多</a></p>
          <p class="dingzhi">达到目标人数，我们帮您定制！</p> -->
         <!--  <div class="goodsdiv">
            <div class="left">
              <img id="likeimg" src="" alt="goodsimg">
            </div>
            <div class="right">
              <p id="title">撞色抱枕 </p>
              <p id="description">极简北欧风，运用鲜艳的颜色碰撞在一起，制造简约而不简单的视觉效果。</p>
            </div>
          </div> -->

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

          <!-- <textarea id="message" cols="30" rows="10" placeholder="留下你的期望(选填)"></textarea> -->
          
          
         <!--  <p class="join" id="jointolike">加入喜欢</p>
          <p class="join" style="display:none;background:#666" id="like">已加入喜欢</p> -->

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
    name: 'sceneimg',
    data() {
      return {
        like1: false,
        like2: false,
        like3: false,
        image: null,
        loading: true,
        goodsList: [],
        banners:[],
        sceneId:'',
        showCollect: true,
        designerId:null,
        showHomeIcon:true,
        historyLength:1,
        showGoHome:true,
      }
    },
    created() {
      document.title = "图片";
    },
    mounted: function () {
      //设置为全屏高度
      $('#planetmap').css({'height': document.documentElement.clientHeight})
      $('.planetmap').css({'height': document.documentElement.clientHeight})
      let context = this;
      this.showGoHome = this.getParam('showGoHome') == '1' ? false : true;
      //是否展示回到首页的图标判断历史长度
      
      this.historyLength = this.keep.cache.get("historyLength") == null ? window.history.length : this.keep.cache.get("historyLength");
      this.showHomeIcon = this.historyLength == 1 ? true : false;

      let sceneId = this.getParam("sceneId");

      //请求场景图计数
      axios.head('/app/api/picture/view-count',{
        params: {
          sceneId: sceneId
        }
      }).then(()=>{})


      this.http.get(this).url('/app/api/picture/detail/:sceneId').restful({sceneId: sceneId})
        .request((data) => {
          if (data.data.code != 0) {
            //this.$toast(data.data.message);
            return;
          }
          var data = data.data.data;
          if(data.collection == true){
            this.showCollect = false;
          }else{
            this.showCollect = true;
          }
          var iconOffset = [];
          console.log(data)
          this.image = data.image;
          this.designerId = data.designerId;
          var width = document.documentElement.clientWidth;
          var height = (document.documentElement.clientWidth)*data.height/data.width;
          for (var i = 0; i < data.goodsList.length; i++) {
            var location = data.goodsList[i].location
            var obj = {};
            obj.offsetX = location.slice(location.indexOf(':') + 1, location.indexOf(','));
            obj.offsetY = location.slice(location.lastIndexOf(':') + 1, location.lastIndexOf('}'));

            //初始化设置放大倍数
            data.goodsList[i].offSetX= -1 * (width - obj.offsetX*width/50 - 32)*0.3/2;
            data.goodsList[i].offSetY= -1 * (height - obj.offsetY*height/50 - 32)*0.3/2 ;

            iconOffset.push(obj)
            var locationX = location.slice(location.indexOf(':') + 1, location.indexOf(',')) + '%';
            var locationY = location.slice(location.lastIndexOf(':') + 1, location.lastIndexOf('}')) + '%';

            data.goodsList[i].locationX = locationX;
            data.goodsList[i].locationY = locationY;
            if (data.goodsList[i].comments != null && data.goodsList[i].comments.length != 0) {
              data.goodsList[i].isClick = 'true';
            } else {
              data.goodsList[i].isClick = 'false';
            }

            if (data.goodsList[i].type == 2) {
              data.goodsList[i].iconimg = '/static/images/dz.png';
            }
            else {
              data.goodsList[i].iconimg = '/static/images/gm.png';
            }
          }


          this.goodsList = data.goodsList;


          var getlist1data = new Promise(function (resolve, reject) {
            //获取高度 宽度 数组
            var timer = setInterval(function () {
              if (data.goodsList.length == 0) {
                clearInterval(timer);
                var obj = {};
                obj.off = [];
                obj.data = data;
                resolve(obj);
              } else {
                var width = document.documentElement.clientWidth;
                var height = (document.documentElement.clientWidth)*data.height/data.width;

                if (width != 0 && height != 0 && data.goodsList.length != 0) {

                  var off = [];
                  for (var i = 0; i < data.goodsList.length; i++) {
                    var obj = {}
                    var offwidth = width / 2 - iconOffset[i].offsetX*width/100  - 16;
                    var offheight = height / 2 - iconOffset[i].offsetY*height/100 - 16;
                    obj.offwidth = -offwidth*2;
                    obj.offheight = -offheight*2;
                    off.push(obj)
                  }

                  clearInterval(timer)
                  var obj = {};
                  obj.off = off;
                  obj.data = data;
                  resolve(obj)
                }
              }

            }, 300)


          })

          getlist1data.then(function (obj) {

            mui.init({
              gestureConfig: {
                pinch: true,
                doubletap: true,
                drag: true
              }
            });

            // mui点击效果初始化
            var mui_zomm = mui('.mui-zoom-wrapper').zoom();
            $('#zoom').animate({"opacity": 1},500)
            $('#backgroundImg').hide();


            console.log(obj)
            var off = obj.off;
            var icondata = obj.data;
            var goodsId = null;
            var joinlikearry = [];
            let context = this;  


            //图标点击展示
            mui(document).off('tap', '.icon');
            mui(document).on('tap', '.icon', function () {
              var goods = [];
              goodsId = $(this).attr('id');
              console.log(goodsId)
              for (var i = 0; i < icondata.goodsList.length; i++) {
                if (icondata.goodsList[i].goodsId == goodsId) {
                  goods = icondata.goodsList[i];
                }
              }
              console.log(goods)

              if ($(this).attr('type') == 2) {
                //$('#likeimg').attr('src', goods.goods.cover)
                var banners = goods.goods.banner.split(",");
                console.log(banners)
                if(banners.length){
                  context.banners = banners;
                } else {
                  context.banners = [];
                  context.banners.push(goods.goods.cover)  
                }  


                $('#title').html(goods.goods.title)
                $('#description').html(goods.goods.description)
                $('#more').attr('more_url', goods.goods.detailUrl)

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
                } else if (goods.comments != null  && goods.comments.length != 0) {
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
                context.keep.cache.push('historyLength',context.historyLength);
                context.keep.go('/goods_detail.html',false,{goodsid:goods.goods.goodsId,showGoHome:'1'});
                
              }

            });


            //点击更多按钮
            mui(document).off('tap', '#more');
            mui(document).on('tap', '#more', function () {
              //window.location.href = '/praise_goods_detail.html?goodsid=' + goodsId;
              context.keep.cache.push('historyLength',context.historyLength);
              context.keep.go('/praise_goods_detail.html',false,{goodsid:goodsId,showGoHome:'1'});
            });

            // 提交喜欢按钮
            mui(document).off('tap', '#jointolike');
            mui(document).on('tap', '#jointolike', function () {
              var users = this.getUserData('user')  //获取微信用户id方法
              if(!users) {
                  context.showError("请先登录!");
                  return ;    
              }
              var memberId = JSON.parse(users).memberId;
              console.log(memberId)
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
                context.showSuccess("已加入喜欢");
                var backdata = data.data.data.goodsList;
                var backicondata = [];
                for (var i = 0; i < backdata.length; i++) {
                  if (goodsId == backdata[i].goodsId) {
                    backicondata = backdata[i];
                  }
                }
                for (var j = 0; j < $('.icon').length; j++) {
                  if ($('.icon').eq(j).attr('id') == backicondata.goodsId) {
                    $('.icon').eq(j).attr('isclick', 'true');
                  }
                }
                console.log(backicondata.comments[0])
                $('#message').val(backicondata.comments[0].replayContent).attr('disabled', 'disabled');
                $('#mengban').show();
                $('#like').show();
                $('#jointolike').hide();
               // $('.goodsBox').hide();
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
            var topdouble = true;
            mui(document).on('doubletap', '#mui-zoom', function () {
              clearTimeout(TimeFn);
              var style = 300 + 'ms';

              if (topdouble) {


                for (var i = 0; i < off.length; i++) {

                  $('.icon').eq(i).css("transform", 'translate(' + off[i].offwidth + 'px,' + off[i].offheight + 'px)');

                  $('.icon').eq(i).css("webkitTransition", style);
                }

                topdouble = false;
              } else {
                for (var i = 0; i < off.length; i++) {

                  $('.icon').eq(i).css("transform", 'translate(' + 0 + 'px,' + 0 + 'px)');
                  $('.icon').eq(i).css("webkitTransition", style);

                }
                topdouble = true;
              }

            }.bind(this));

            //双手 拉开收缩
            mui.bindPinch(function (scale) {
              var trans = $('#zoom').css("transform").slice(7, -2).split(',')[0];
              var style = 0 + 'ms';
              if (trans < 1) {
                trans = 1;
              }
              if (trans > 3) {
                trans = 3;
              }
              for (var i = 0; i < off.length; i++) {
               $('.icon').eq(i).css("transform", 'translate(' + off[i].offwidth * (trans - 1)/2 + 'px,' + off[i].offheight * (trans - 1)/2 + 'px)');
               $('.icon').eq(i).css("webkitTransition", style);
              }
              if (trans > 1) {
                topdouble = false;
              } else {
                topdouble = true;
              }
            });


          //单击叉叉 消失
          mui(document).on('tap', '#off', function () {
            $('.goodsBox').hide();
          });

          //单击icon隐藏/显示
          var show = true;
          var TimeFn = null;
          mui(document).on('tap', '.mui-zoom', function () {

            clearTimeout(TimeFn);
            TimeFn = setTimeout(function () {
              if (show) {
                $('#mui-zoom>.icon').hide();
                $('#back').hide();
                show = false;
              } else {
                $('#mui-zoom>.icon').show();
                $('#back').show();
                show = true;
              }
            }, 300);

          }.bind(this));



        //阻止默认事件的进行  
        mui(document).on('tap', '#operation>div', function (e) { 
          e.preventDefault();
        });
        
        //回到首页
        mui(document).on('tap' , '#gohome' ,function(){
          window.location.href = '/category2.html'
        })

        // 保存到本地
        mui(document).off('tap', '#save');
        mui(document).on('tap', '#save', function (e) {
          console.log('save');
          this.showMessage('喜欢此图?长按可以保存哦~~')
          $('#operation').removeClass('active');
          $('#mui-zoom>.icon').hide();
          show = false;
        }.bind(this));


        // 收藏
        mui(document).off('tap', '#collect');
        mui(document).on('tap', '#collect', function (e) {
          console.log('collect')
          let sceneId = this.getParam("sceneId");
          this.http.post(this).url('/app/api/scene/collection').params({
            sceneId:sceneId
          }).request(function(response){
            console.log(response)
            this.showSuccess('收藏成功')
            this.showCollect = false;
          },function(err){
            //this.showMessage('收藏失败')
          })  
        }.bind(this));

         // 取消收藏
        mui(document).off('tap', '#cancelCollect');
        mui(document).on('tap', '#cancelCollect', function (e) {
          let sceneId = this.getParam("sceneId");

          this.http.delete(this).url(this.config.collect.cancel_scene).restful({
            sceneId:sceneId
          }).request(function(response){
            this.showSuccess('已取消收藏')
            this.showCollect = true;
          },function(err){
            //this.showMessage('收藏失败')
          })  
        }.bind(this));



          }.bind(this))

        });

    },
    methods: {
      learnMore(){
        if(this.designerId == null){
          this.showMessage('该场景图查无更多信息')
        }else{
          this.keep.cache.push('historyLength',this.historyLength);
          this.keep.go('/learn_more.html',false,{designerId:this.designerId,sceneId:this.getParam("sceneId")})
        }
      },
      open(){
        $('#operation').addClass('active');
      },
      close(){
        $('#operation').removeClass('active');
      }
    }
  }


</script>

<style lang='scss'>
  @import '../../assets/scss/sceneimg.scss';
</style>
