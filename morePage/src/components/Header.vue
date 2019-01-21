<template>
  <div id="header_vue">
    <div class="header">
      <li class="logo">
        <img v-if="head" :src="head+'?imageView2/1/w/100/h/100'" @click="goToCollect" alt="收藏">
      </li>
      <!--<input id="search" type="text" placeholder="搜索商品﹑图片">-->
      <p class="searchArea" @click="doSearch">
        <img src="../assets/img/search.png" class="searchBtn" /> {{getLabel()}}
      </p>
      <li class="shopcat" @click="goShoppingCart">
        <img src="../assets/img/new_icon_cart.png" alt="shopcat">
        <!-- <p>购物车</p> -->
        <mt-badge size="small" v-show='showCart'>{{count}}</mt-badge>
      </li>
    </div>

    <div class="search" :class="{'showAppTip1':showAppTip}" style="background:#fff;">
      <div class="searchBox" style="border-bottom:1px solid #EEE;">
        <p class="cancel" @click="cancleSearch">取消</p>
        <form action="" target="id_iframe">
          <input type="text" value="" :placeholder="getLabel()" maxlength="10" class="searchInput" id="searchInput" v-model="val" v-on:input="inputFunc" @keyup.13="goSearch" />
        </form>
        <iframe id="id_iframe" name="id_iframe" style="display:none;"></iframe>
        <img src="../assets/img/search.png" class="searchBtn1" />
        <img src="../assets/img/off_btn.png" class="offBtn" @click="deleteContent" v-show="val !== ''" />
        <p class="sureBtn" @click='goSearch'>搜索</p>
      </div>
      <div class="productSearch" v-show="val !== '' && goodsArr.length != 0">
        <p class="result_title">商品</p>
        <div class="content">
          <!--<p v-if="this.goodsArr.length == 0">没有找到该商品</p>-->
          <p @click="goGoodsResult(goodResult)" v-for="goodResult in goodsArr">
            <span v-html="goodsHtml(goodResult.keyword)">
              <!--{{this.goodsKeyword}}-->
            </span>
          </p>
        </div>
      </div>
      <div class="productPic" v-show="val !== '' && picArr.length != 0">
        <p class="result_title">图片</p>
        <div class="content">
          <p @click="goPicResult" v-for="picResult in picArr">
            <span class="picSpan" v-html="picHtml(picResult.keyword)">
            </span>
          </p>
        </div>
      </div>
      <div class="searchHistory" v-show="searchHistory.length != 0" style="padding-bottom:0;">
        <p class="title" style="text-align: left;">搜索历史</p>
        <img src="../assets/img/deleteAddress.png" @click="deleteHistory" />
        <p class="searchContent" v-for="history in searchHistory" @click="historyGoResult(history)">{{history}}</p>
        <div class="clear"></div>
      </div>
      <div class="hotSearch" >
        <p class="title" style="text-align: left;">热门搜索</p>
        <p class="searchContent" v-for="hotKeyword in hotKeywordArr" @click="hotKeywordGoResult(hotKeyword)">{{hotKeyword.keyword}}</p>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Badge } from 'mint-ui';
  export default {
    name: 'header',
    props: ["type","word","active","showAppTip"],
    data() {
      return {
        val: '',
        count: '',
        showCart: false,
        head:null,
        goodsArr: [],
        picArr: [],
        searchHistory: [],
        picKeyword: '',
        goodsKeyword: '',
        hotKeywordArr: [],
        str: '',
        str1: '',
        str2: [],
        dataArr: [],
        pageIndex: 1,
        pageSize: 8,
        showHotSearch:true
      }
    },
    mounted: function() {
      $('.search').css('display', 'none');
      this.str = window.location.href;
      this.str1 = window.location.pathname.replace("/", ""); //this.str.replace('http://wxtest.goochao.com:8080/','')
      this.str2 = this.str1.split('.');
      //在图片列表和图片搜索结果页面不出现热门搜索
      if(this.str2[0] == 'pic_result' || this.str2[0] == 'scene_list'){
        this.showHotSearch = false;
      }else{
        this.showHotSearch = true;
      }
      var users = this.getUserData('user');
      var user = users ? JSON.parse(users) : {};
      this.user = user;
      this.head = user.head;
      this.$nextTick(function() {
        $(".search").on("touchmove", function() {
          event.preventDefault();
        });
      });
      this.showShoppingCartCount();
      //从localStorage获取搜索历史
      var searchHistory = localStorage.getItem("searchHistory");
      this.searchHistory = searchHistory ? searchHistory.split(',') : [];
      this.searchHistory = this.searchHistory.slice(0,5);
      //限制展示5条搜索历史
      this.searchHistory.length <= 5;
      for(var i = 0; i < this.searchHistory.length; i++) {
        //移除第一项null
        if(this.searchHistory[i] == 'null') {
          this.searchHistory.splice(i, 1)
        }
      }
    },
    methods: {
      cacheData(){
        if(this.type == 2){
          this.$emit("setCache");
        }
      },
      //设置搜索商品结果关键字标红
      goodsHtml: function(goodsKeyword){
        var replaceReg = new RegExp(this.val, 'g');
        var replaceString = '<span class="search-text">' + this.val + '</span>';
        this.keyword = goodsKeyword.replace(replaceReg, replaceString);
        return this.keyword;
      },
      //设置搜索图片结果关键字标红
      picHtml: function(picKeyword){
        var replaceReg = new RegExp(this.val, 'g');
        var replaceString = '<span class="search-text">' + this.val + '</span>';
        this.keyword = picKeyword.replace(replaceReg, replaceString);
        return this.keyword;
      },
      //设置搜索结果存入Locallstarage
      setLocallstarage(parameter){
        var lastHistory = localStorage.getItem('searchHistory');
        var searchContent = parameter + ',' + lastHistory;
        var searchContentArr = searchContent ? searchContent.split(',') : [];
        var tmp = [];
        for(var i = 0; i < searchContentArr.length; i++) {
          if(tmp.indexOf(searchContentArr[i]) == -1) {
            tmp.push(searchContentArr[i]);
          }
        }
        searchContentArr = tmp;
        searchContentArr = searchContentArr.slice(0,11);
        searchContent = searchContentArr.join(',');
        localStorage.setItem("searchHistory", searchContent);
      },
      //根据状态来控制搜索框的placeholder
      getLabel() {
        //在首页
        if(!this.type) {
          return "搜索商品、图片";
        }
        //在商品类目或商品列表
        else if(this.type == 1) {
          return "搜索商品";
        }
        //在场景图列表
        else if(this.type == 2){
          return "搜索图片";
        }
        //在商品搜索结果页面
        else if(this.type == 3){
          //当有商品搜索结果时
          if(this.word){
            return this.word;
          }else{
            //当没有商品搜索结果时
            return "搜索商品";
          }
          //在图片搜索结果页面
        }else if(this.type == 4){
          //当有图片搜索结果时
          if(this.word){
            return this.word;
          }else{
            //当没有图片搜索结果时
            return "搜索图片";
          }
        }
      },
      //查询搜索热词
      getHotKeyword() {
        this.http.get(this).url('app/api/hot-keywords').request(function(response) {
          var data = response.data.data;
          data.forEach((n) => {
            this.hotKeywordArr.push(n);
          })
        })
      },
      //点击热词跳转搜索结果
      hotKeywordGoResult(e) {
        this.http.post(this).url('app/api/hot-keywords/count-increase/:keywordId').restful({
          keywordId:e.keywordId
        }).request(function(response){
        })
        this.setLocallstarage(e.keyword);
        this.val = e.keyword;
        this.inputFunc();
        this.picArr = [];
        this.goodsArr = [];
        this.http.get(this).url('/app/api/keyword/search').params({
          keyword: this.val
        }).request(function(response) {
          //当查询到的关键字结果为空时
          if(response.data.data.length == 0) {
            //在首页时
            if(this.str2[0] == '' || this.str2[0] == 'index') {
              this.keep.go("/search_result.html", true, {
                keyword: e.keyword
              });
              //在商品类目时
            } else if(this.str2[0] == 'category2') {
              this.keep.go("/search_result.html", true, {
                keyword: e.keyword
              });
              //在商品列表页面时
            } else if(this.str2[0] == 'goods_list2') {
              this.keep.cache.push("active", this.active);
              this.val = e.keyword;
              this.keep.go("/search_result.html", true, {
                keyword: e.keyword
              });
              //在搜索商品结果页面时，不跳转
            } else if(this.str2[0] == 'search_result') {
              $('.search').css('display', 'none');
              this.hotKeywordArr = [];
              this.http.get(this).url('/app/api/goods/search').params({
                keyword: e.keyword,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
              }).request(function(response) {
                if(response.data.code != 0) {
                  //this.showError(response.data.message);
                  return;
                } else {
                  var data = response.data.data;
                  for(var i = 0; i < data.length; i++) {
                    data[i].productPicBoxActive = false;
                  }
                  var parm = {
                    'keyword': this.val
                  };
                  data.push(parm);
                  this.$emit('keyword', data);
                }
              })
              //在搜索图片结果页面时，不跳转
            } else if(this.str2[0] == 'pic_result') {
              $('.search').css('display', 'none');
              this.hotKeywordArr = [];
              this.http.get(this).url('/app/api/picture/search').params({
                keyword: e.keyword,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                loadDetail: true
              }).request(function(response) {
                if(response.data.code != 0) {
                  //this.showError(response.data.message);
                  return;
                } else {
                  var data = response.data.data;
                  for(var i = 0; i < data.length; i++) {
                    data[i].imgactive = false;
                  }
                  var parm = {
                    'keyword': this.val
                  };
                  data.push(parm);
                  this.$emit('keyword', data);
                }
              })

            } else {
              this.cacheData();
              this.keep.go("/pic_result.html", true, {
                keyword: this.val
              });
            }
            //当查询关键字结果不为空时
          } else {
            //在搜索商品结果页面时，并且商品关键字数组为空时，不跳转
             if(this.str2[0] == 'search_result') {
               if(this.goodsArr.length == 0){

                 $('.search').css('display', 'none');
                 this.hotKeywordArr = [];
                 this.http.get(this).url('/app/api/goods/search').params({
                   keyword: e.keyword,
                   pageIndex: this.pageIndex,
                   pageSize: this.pageSize
                 }).request(function(response) {
                   if(response.data.code != 0) {
                     //this.showError(response.data.message);
                     return;
                   } else {
                     var data = response.data.data;
                     for(var i = 0; i < data.length; i++) {
                       data[i].productPicBoxActive = false;
                     }
                     var parm = {
                       'keyword': this.val
                     };
                     data.push(parm);
                     this.$emit('keyword', data);
                   }
                 })
               }
               //在搜索图片结果页面时，并且图片关键字数字为空时，不跳转
            } else if(this.str2[0] == 'pic_result') {
              if(this.picArr.length == 0){

                $('.search').css('display', 'none');
                this.hotKeywordArr = [];
                this.http.get(this).url('/app/api/picture/search').params({
                  keyword: e.keyword,
                  pageIndex: this.pageIndex,
                  pageSize: this.pageSize,
                  loadDetail: true
                }).request(function(response) {
                  if(response.data.code != 0) {
                    //this.showError(response.data.message);
                    return;
                  } else {
                    var data = response.data.data;
                    for(var i = 0; i < data.length; i++) {
                      data[i].imgactive = false;
                    }
                    var parm = {
                      'keyword': this.val
                    };
                    data.push(parm);
                    this.$emit('keyword', data);
                  }
                })
              }
             //在图片列表页面时，并且图片关键字数字为空时
            }else if(this.str2[0] == 'scene_list'){
              if(this.picArr.length == 0){
                this.cacheData();
                this.keep.go("/pic_result.html", true, {
                  keyword: this.val
                });
              }
              //在商品类目页面时，并且商品关键字数组为空时
            }else if(this.str2[0] == 'category2'){
               if(this.goodsArr.length == 0){
                 this.keep.go("/search_result.html", true, {
                  keyword: e.keyword
                });

               }
            }
            //在商品列表页面时，并且商品关键字数组为空时
            else if(this.str2[0] == 'goods_list2'){
               if(this.goodsArr.length == 0){
                 this.keep.cache.push("active", this.active);
                 this.keep.go("/search_result.html", true, {
                  keyword: e.keyword
                });

               }
            }
          }
        })
//      this.keep.go("/search_result.html", true, {
//        keyword: e.keyword
//      });
      },
      //搜索历史跳转搜索结果
      historyGoResult(e) {
        this.val = e;
        this.inputFunc();
        this.setLocallstarage(e);
        this.picArr = [];
        this.goodsArr = [];
        this.http.get(this).url('/app/api/keyword/search').params({
          keyword: this.val
        }).request(function(response) {
          //当查询到的关键字结果为空时
          if(response.data.data.length == 0) {
            //在首页时
            if(this.str2[0] == '' || this.str2[0] == 'index') {
              this.keep.go("/search_result.html", true, {
                keyword: e
              });
              //在商品类目时
            } else if(this.str2[0] == 'category2') {
              this.keep.go("/search_result.html", true, {
                keyword: e
              });
              //在商品列表页面时
            } else if(this.str2[0] == 'goods_list2') {
              this.keep.cache.push("active", this.active);
              this.val = e;
              this.keep.go("/search_result.html", true, {
                keyword: e
              });
              //在搜索商品结果页面时，不跳转
            } else if(this.str2[0] == 'search_result') {
              $('.search').css('display', 'none');
              this.hotKeywordArr = [];
              this.http.get(this).url('/app/api/goods/search').params({
                keyword: e,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
              }).request(function(response) {
                if(response.data.code != 0) {
                  //this.showError(response.data.message);
                  return;
                } else {
                  var data = response.data.data;
                  for(var i = 0; i < data.length; i++) {
                    data[i].productPicBoxActive = false;
                  }
                  var parm = {
                    'keyword': this.val
                  };
                  data.push(parm);
                  this.$emit('keyword', data);
                }
              })
              //在搜索图片结果页面时，不跳转
            } else if(this.str2[0] == 'pic_result') {
              $('.search').css('display', 'none');
              this.hotKeywordArr = [];
              this.http.get(this).url('/app/api/picture/search').params({
                keyword: e,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                loadDetail: true
              }).request(function(response) {
                if(response.data.code != 0) {
                 // this.showError(response.data.message);
                  return;
                } else {
                  var data = response.data.data;
                  for(var i = 0; i < data.length; i++) {
                    data[i].imgactive = false;
                  }
                  var parm = {
                    'keyword': this.val
                  };
                  data.push(parm);
                  this.$emit('keyword', data);
                }
              })

            } else {
              this.cacheData();
              this.keep.go("/pic_result.html", true, {
                keyword: this.val
              });
            }
            //当查询关键字结果不为空时
          } else {
            //在搜索商品结果页面时，并且商品关键字数组为空时，不跳转
             if(this.str2[0] == 'search_result') {
               if(this.goodsArr.length == 0){

                 $('.search').css('display', 'none');
                 this.hotKeywordArr = [];
                 this.http.get(this).url('/app/api/goods/search').params({
                   keyword: e,
                   pageIndex: this.pageIndex,
                   pageSize: this.pageSize
                 }).request(function(response) {
                   if(response.data.code != 0) {
                     //this.showError(response.data.message);
                     return;
                   } else {
                     var data = response.data.data;
                     for(var i = 0; i < data.length; i++) {
                       data[i].productPicBoxActive = false;
                     }
                     var parm = {
                       'keyword': this.val
                     };
                     data.push(parm);
                     this.$emit('keyword', data);
                   }
                 })
               }
               //在搜索图片结果页面时，并且图片关键字数组为空时，不跳转
            } else if(this.str2[0] == 'pic_result') {
              if(this.picArr.length == 0){

                $('.search').css('display', 'none');
                this.hotKeywordArr = [];
                this.http.get(this).url('/app/api/picture/search').params({
                  keyword: e,
                  pageIndex: this.pageIndex,
                  pageSize: this.pageSize,
                  loadDetail: true
                }).request(function(response) {
                  if(response.data.code != 0) {
                    //this.showError(response.data.message);
                    return;
                  } else {
                    var data = response.data.data;
                    for(var i = 0; i < data.length; i++) {
                      data[i].imgactive = false;
                    }
                    var parm = {
                      'keyword': this.val
                    };
                    data.push(parm);
                    this.$emit('keyword', data);
                  }
                })
              }
             //在图片列表页面时，并且图片关键字数组为空时
            }else if(this.str2[0] == 'scene_list'){
              if(this.picArr.length == 0){
                this.cacheData();
                this.keep.go("/pic_result.html", true, {
                  keyword: this.val
                });
              }
              //在商品类目页面时，并且商品关键字数组为空时
            }else if(this.str2[0] == 'category2'){
               if(this.goodsArr.length == 0){
                 this.keep.go("/search_result.html", true, {
                  keyword: e
                });

               }
            }
            //在商品列表页面时，并且商品关键字数组为空时
            else if(this.str2[0] == 'goods_list2'){
              this.keep.cache.push("active", this.active);
               if(this.goodsArr.length == 0){
                 this.keep.go("/search_result.html", true, {
                  keyword: e
                });

               }
            }
          }
        })
      },
      //跳转搜索商品结果页面
      goGoodsResult(item) {
        this.val = item.keyword;
        this.keep.go("/search_result.html", true, {
          keyword: item.keyword
        });
        this.setLocallstarage(item.keyword);
      },
      //跳转搜索图片结果页面
      goPicResult(item) {
        this.val = this.picKeyword;
        this.setLocallstarage(this.picKeyword);
        this.cacheData();
        this.keep.go("/pic_result.html", true, {
          keyword: this.picKeyword
        });
      },
      //清空搜索历史，删除localStorage里的数据
      deleteHistory() {
         this.$messagebox({
         message: '是否清空搜索历史？',
         cancelButtonText:"取消",
         showCancelButton:true,
         confirmButtonText:"确定",
         showConfirmButton:true
        }).then((action) => {
          if(action == "cancel"){
            return ;
          }
          this.searchHistory = [];
          var searchContent = '';
          localStorage.removeItem("searchHistory");
        }).catch((err) => {
          console.log(err)
        });
      },
      //关键字查询
      keyWordsSearch() {
        if(this.val == '') {
          return;
        } else {
          this.http.get(this).url('/app/api/keyword/search').params({
            keyword: this.val
          }).request(function(response) {
            this.goodsArr = [];
            this.picArr = [];
            var data = response.data.data;
            this.data = data;
            data.forEach((n) => {
            if(n.type == 2) {
                this.picArr.push(n)
                var tmp = [];
                for(var i = 0; i < this.picArr.length; i++) {
                  if(tmp.indexOf(this.picArr[i]) == -1) {
                    tmp.push(this.picArr[i]);
                  }
                }
                this.picArr = tmp;
                this.picKeyword = n.keyword;
              } else {
                this.goodsArr.push(n);
                var tmp = [];
                for(var i = 0; i < this.goodsArr.length; i++) {
                  if(tmp.indexOf(this.goodsArr[i]) == -1) {
                    tmp.push(this.goodsArr[i]);
                  }
                }
                this.goodsArr = tmp;
                this.goodsKeyword = n.keyword;
              } 
              
              if(this.type == 1) {
                // 搜索商品
                this.picArr = [];
              } else if(this.type == 2) {
                // 搜索图片
                this.goodsArr = [];
              } else {
                // 首页搜索，同时搜索商品和场景图
              }
            })
          })
        }
      },
      //当搜索框内值改变触发事件
      inputFunc() {
        if(this.val != '') {
          this.keyWordsSearch();
        } else {
          this.picArr = [];
          this.goodsArr = [];
          if(this.type == 3){
            $('input').attr('placeholder','搜索商品');
          }else if(this.type == 4){
            $('input').attr('placeholder','搜索图片');
          }
        }
      },
      //搜索按钮点击事件
      goSearch() {
        if(this.val == '') {
          this.$toast('请输入搜索内容');
          return;
        }
        this.setLocallstarage(this.val);
        //在首页时
        if(this.str2[0] == '' || this.str2[0] == 'index') {
          //当搜索结果为空时时，直接跳转商品搜索结果
          if(this.data.length == 0) {
            this.keep.go("/search_result.html", true, {
              keyword: this.val
            });
          } else {
            //当搜索结果只有图片时，直接跳转到图片搜索结果页面
            if(this.goodsArr.length == 0) {
              this.cacheData();
              this.keep.go("/pic_result.html", true, {
                keyword: this.val
              });
            } else {
              //否则直接跳转到商品搜索结果页面
              this.keep.go("/search_result.html", true, {
                keyword: this.val
              });
            }
          }
          //在商品类目页面时，跳转商品搜索结果
        } else if(this.str2[0] == 'category2') {
          this.keep.go("/search_result.html", true, {
            keyword: this.val
          });
          //在商品列表页面时，跳转商品搜索结果
        } else if(this.str2[0] == 'goods_list2') {
          this.keep.cache.push("active", this.active);
          this.keep.go("/search_result.html", true, {
            keyword: this.val
          });
          //在商品搜索结果页面时，不跳转，重新加载
        } else if(this.str2[0] == 'search_result') {
          $('.search').css('display', 'none');
          this.hotKeywordArr = [];
          this.http.get(this).url('/app/api/goods/search').params({
            keyword: this.val,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }).request(function(response) {
            if(response.data.code != 0) {
              //this.showError(response.data.message);
              return;
            } else {
              var data = response.data.data;
              for(var i = 0; i < data.length; i++) {
                data[i].productPicBoxActive = false;
              }
              var parm = {
                'keyword': this.val
              };
              data.push(parm);
              this.$emit('keyword', data);
            }
          })
          //在图片搜索结果页面时，不跳转，重新加载
        } else if(this.str2[0] == 'pic_result') {
          $('.search').css('display', 'none');
          this.hotKeywordArr = [];
          this.http.get(this).url('/app/api/picture/search').params({
            keyword: this.val,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            loadDetail: true
          }).request(function(response) {
            if(response.data.code != 0) {
             // this.showError(response.data.message);
              return;
            } else {
              var data = response.data.data;
              for(var i = 0; i < data.length; i++) {
                data[i].imgactive = false;
              }
              var parm = {
                'keyword': this.val
              };
              data.push(parm);
              this.$emit('keyword', data);
            }
          })
          //否则，跳转到图片搜索结果页面
        } else {
          this.cacheData();
          this.keep.go("/pic_result.html", true, {
            keyword: this.val
          });
        }
      },
      //跳转到我的收藏
      goToCollect() {
        this.$emit("cacheCategory")
        this.keep.go("/collect.html", true)
      },
      //点击搜索框执行事件
      doSearch() {
        this.$emit("cacheCategory")
        $('.search').css('display', 'block');
        $('#searchInput').focus();
        if(this.word){
          this.val = this.word;
        }
        event.preventDefault();

        this.getLocalHistory();
        this.keyWordsSearch();
        this.getHotKeyword();
      },
      /*获取历史搜索记录*/
      getLocalHistory() {
          var searchHistory = localStorage.getItem("searchHistory");
          this.searchHistory = searchHistory ? searchHistory.split(',') : [];
          this.searchHistory = this.searchHistory.slice(0,5);
          //限制展示5条搜索历史
          this.searchHistory.length <= 5;
          for(var i = 0; i < this.searchHistory.length; i++) {
            //移除第一项null
            if(this.searchHistory[i] == 'null') {
              this.searchHistory.splice(i, 1)
            }
          }
      },
      //取消搜索执行事件
      cancleSearch() {
        $('.search').css('display', 'none');
        var content = $('.searchInput').val();
        if(content !== "") {
          $('.searchInput').val("")
          this.val = ''
        }
        this.hotKeywordArr = [];
        this.picArr = [];
        this.goodsArr = [];
      },
      //当搜索框内有内容时，点击删除图标执行清空搜索框
      deleteContent() {
        this.picArr = [];
        this.goodsArr = [];
        $('#searchInput').focus();
        var content = $('.searchInput').val();
        if(content !== "") {
          $('.searchInput').val("")
          this.val = ''
        }
        if(this.type == 3){
          $('input').attr('placeholder','搜索商品')
        }
        if(this.type == 4){
          $('input').attr('placeholder','搜索图片')
        }
      },
      goShoppingCart() {
        this.$emit("cacheCategory")
        this.keep.go("/shopping_cart.html", false);
      },
      //展示购物车内商品数量
      showShoppingCartCount() {
        $('.mint-badge').hide();
        this.http.get(this).url('app/api/shopping-cart/count').request(function(response) {
          this.count = response.data.data;
          if(this.count > 99) {
            this.count = '99+';
          }
           if(this.count == 0) {
            this.showCart = false;
            $('.mint-badge').hide();
           }else{
              this.showCart = true;
              $('.mint-badge').show();
           }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/header.scss';
  .showAppTip1{
    top:0.5rem !important;
  }
</style>
