<template>
  <div id="messageCenterDetail">

    <div class="loadMoreData"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50">
        
        <div v-for='item in datas'>
          
          <!-- 期刊 -->
          <div class="box" v-if='item.messageType == 2' @click='viewCount(item,1)'>
            <p class="time">{{item.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>      
            <div class="messageBox">
              <p class="top">{{item.messageTitle}}</p>
              <div class="subject">
                <img v-lazy="item.messageCover + '?imageView2/0/w/1024/h/520|imageslim' " alt="文章封面">
                <p>{{item.messageDesc}}</p>
              </div>
              <p class="bottom">阅读全文 <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头"></p>
            </div>
          </div>

          <!-- 商品 -->
          <div class="box" v-if='item.messageType == 1' @click='viewCount(item,2)'>
            <p class="time">{{item.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>      
            <div class="messageBox">
              <p class="top" style="color:#343434">精选好货推荐</p>
              <div class="goods">
                <img v-lazy="item.detail.cover + '?imageView2/0/w/640/h/640|imageslim' " alt="商品封面">
                <div class="goodsMsg">
                  <p class="title">{{item.detail.title}}</p>
                  <p class="desc">{{item.detail.description}}</p>
                  <p class="price" v-if="item.detail.discountType == 2"> ¥{{item.detail.discountPrice}}  <span>¥{{item.detail.minPrice}}</span> </p>
                  <p class="price" v-else>¥{{item.detail.minPrice}} </p>
                </div>
              </div>
              <p class="bottom">查看详情 <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头"></p>
            </div>
          </div>

          <!-- 活动 -->
          <div class="box" v-if='item.messageType == 3' @click='viewCount(item,3)'>
            <p class="time">{{item.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>      
            <div class="messageBox">
              <p class="top" style="color:#343434">{{item.messageTitle}}</p>
              <div class="active">
                <img v-lazy="item.messageCover + '?imageView2/0/w/1024/h/520|imageslim'" alt="活动封面">
                <p>{{item.messageDesc}}</p>
              </div>
              <p class="bottom">查看活动详情 <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头"></p>
            </div>
          </div>

          <!-- 系统 -->
          <div class="box" v-if='!item.messageType' @click="toOrder(item)">
            <p class="time">{{item.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>      
            <div class="messageBox">
              <p class="top" style="color:#343434">订单状态提醒</p>
              <div class="order">
                <img v-if='item.detail' :src="item.detail.cover" alt="订单封面">
                <p>{{item.content}}</p>
              </div>
              <p class="bottom">查看详情 <img class="toRight" src="../../assets/img/arrow_right_help.png" alt="箭头"></p>
            </div>
          </div>



        </div>

        <div id="loademoreimg" v-show='isLoadData' style="padding:0;">
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

        <div id="reload" v-show='reloadflag' @click='reloadData()'>
            加载失败,点击重新加载
        </div>

        <div class="end" v-show="!firstLoad && datas.length">
          <img src="../../assets/img/dataEnd.png" alt="end">
        </div>

        <div class="end" v-show="!firstLoad && !datas.length">
          <img id="nodataImage" src="../../assets/img/nodate_message_noData.png" alt="缺省图">   
          <p id="nodataMeaaage">暂时没有消息通</p>   
        </div>        

    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import axios from 'axios';

  export default {
    name: 'messageCenterDetail',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        isLoadData: false, //加载数据
        reloadflag:false, //加载数据失败
        loading:false, // 是否加载数据
        noMoreData:false, //数据加载完成
        pageIndex:1,
        pageSize:10,
        datas:[],
        firstLoad:true,
        loadFailed:false,
        type:null // 1构巢精选 2 活动通知 3 系统消息
      }
    },
    mounted() {
      if (this.keep.isKeepAlive()) {
        this.firstLoad = false;
        // 读缓存
        this.datas = this.keep.cache.get("message-datas", []);
        this.pageIndex = this.keep.cache.get("message-pageIndex", 1);
        this.pageSize = this.keep.cache.get("message-pageSize", 10);
        // 标记不keep-alive
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });

      } else {
        // 删除缓存
        this.keep.cache.remove("message-datas");
        this.keep.cache.remove("message-pageIndex");
        this.keep.cache.remove("message-pageSize");

        this.firstLoad = true;
        this.clearUnread();
      }

    },
    created() {
      this.type = this.getParam('type');
      if (this.type == 1) {
        document.title = "构巢精选";
      } else if (this.type == 2) {
        document.title = "活动通知";
      } else {
        document.title = "系统消息"; 
      }
    },
    methods: {
      viewCount(item,type) {

        let url = '/app/api/message-center/view/' + item.messageId;
        axios.head(url, {}).then(()=>{
          if (type == 1) {
            this.toSubject(item.objectId);
          } else if (type == 2) {
            this.toGoodsDetail(item.objectId);
          } else if (type == 3) {
            this.toActivity(item);
          }
        })
      },
      toGoodsDetail(goodsid) {
        this.keep.scroll.save();
        this.keep.go("/goods_detail.html",true,{goodsid:goodsid,showGoHome:'1'});
      },
      toSubject(subjectArticleId) {
        this.keep.scroll.save();
        this.keep.go("/article.html",true,{subjectArticleId:subjectArticleId,showGoHome:'1'});
      },
      toOrder(order) {
        if (!order.params) {
          return;
        } 
        let params = JSON.parse(order.params);

        if (params.messageType == 1) {
          this.keep.scroll.save();
          this.keep.go("/order_list.html",true,{activated:2});
        } else if (params.messageType == 2) {
          this.keep.scroll.save();
          this.keep.go("/order_list.html",true,{activated:3});
        } else {
          this.keep.scroll.save();
          this.keep.go("/afterSale_information.html",true,{relationId:order.detail.relationId,orderNumber:order.detail.orderNumber});
        }

      },
      toActivity(activity) {
        this.keep.scroll.save();
        this.keep.go(activity.detail.url,true,{activityId:activity.detail.activityId});
      },
      reloadData(){
        this.loading = false;
        this.reloadflag = false;
        // this.loadData();
      },
      reload (){
        this.loading = false;
        this.loadFailed = false;
        this.loadData();
      },
      loadMore() {
        this.loading = true;
        this.isLoadData = true;
        this.loadData();
      },
      loadData() {
        if (this.type == 1) {
          this.findByPage(4,this.config.message.notice_message);
        } else if (this.type == 2) {
          this.findByPage(3,this.config.message.notice_message);
        } else {
          this.findByPage(null,this.config.message.sys_message);
        }
      },
      findByPage(type,url) {
        let params = {};
        params.pageIndex = this.pageIndex;
        params.pageSize = this.pageSize;
        params.messageType = type;
        this.http.get(this).url(url).params(params).request(
          (response) => {
            this.firstLoad = false;
            this.isLoadData = false;
            this.reloadflag = false;

            var data = response.data.data;
            if (data.length == 0) {
              this.loading = true;
              this.noMoreData = true;
              return;
            }else{
              this.loading = false;
              this.noMoreData = false;
            }

            data.forEach((item) => {
              this.datas.push(item);
            });

            this.pageIndex ++;
            // 缓存首页推荐数据和分页数据
            this.keep.cache.push("message-datas", this.datas);
            this.keep.cache.push("message-pageIndex", this.pageIndex);
            this.keep.cache.push("message-pageSize", this.pageSize);

          },(err) => {
            console.log(err);
            this.isLoadData = false;
            this.loading = true;
            this.firstLoad = false;
            if(this.pageIndex == 1){
               this.loadFailed = true;
            }else{
              this.reloadflag = true;
            }
          }
        )
      },
      clearUnread() {
        let params = {};
        if (this.type == 1) {
          params.messageType = 4;
        } else if (this.type == 2) {
          params.messageType = 3;
        } else {
          params.messageType = 5;
        }
        this.http.get(this).url(this.config.message.clear_url).params(params).request((response) => {

          },(err) => {console.log(err)}
        )
      }
    }
  }
</script>

<style lang='scss'>
  html, body {
    background-color: #f2f2f2;
    width:3.75rem;
    height:100%;
  }
  #messageCenterDetail{
    width:3.75rem;
    height:auto;
    overflow: hidden;
    #nodataImage{
      display:block;
      width: 1.1rem;
      height:1.1rem;
      margin:1rem auto 0.08rem;
    }
    #nodataMeaaage{
      text-align:center;
      font-size:0.14rem;
      color:#ddd;
      font-weight:500;
    }
    #loademoreimg{
      width:100%;
      height:auto;
      text-align:center;


      span{
        display:block;
        margin:auto;
      }
       span div{
        margin:auto;
         display: flex;
        align-items: center;
        height:0.5rem;
        width:0.6rem;
      }
       p{
        color:#999;
        font-size:0.14rem;
        text-align:center;
      }
    }
    #reload{
      width:100%;
      height:auto;
      font-size:0.14rem;
      padding:0.2rem 0;
      color:#333;
      text-align: center;
    }
    div.box{
      width:3.55rem;
      height:auto;
      overflow: hidden;
      margin: auto;
      >p.time{
        font-size:0.12rem;
        color:#999;
        text-align:center;
        margin-top:0.1rem ;
        margin-bottom: 0.1rem;
      }
    }
    div.end{
      width:100%;
      height:auto;
      overflow: hidden;
      padding-top: 0.15rem;
      padding-bottom: 0.15rem;
      text-align:center;
      font-size:0.14rem;
      color:#999;
      >img{
        width:0.95rem;
        height:0.17rem;
        display:block;
        margin:auto;
      }
    }
    div.messageBox{
      width:100%;
      height:auto;
      background:white;
      border-radius:5px;
      overflow: hidden;
      p.top{
        margin:0.15rem;
        width:3.25rem;
        height:auto;
        font-size:0.16rem;
        color:#333;
        font-weight:700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;        
      }
      p.bottom{
        border-top: 1px solid #ddd;
        width:3.25rem;
        height:0.44rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        font-size:0.12rem;
        color:#343434;
        padding-left:0.15rem;
        padding-right: 0.15rem;
        >img{
          display:block;
          width:0.24rem;
          height:0.24rem;
        }
      }
      div.subject{
        width:3.25rem;
        height:auto;   
        overflow: hidden;     
        padding-left:0.15rem;
        padding-right: 0.15rem;   
        >img{
          display:block;
          width:100%;
          height:1.65rem;
        }     
        p{
          width:100%;
          height:auto;
          margin:0.1rem 0;
          font-size:0.14rem;
          color:#666;
        }
      }
      div.goods{
        width:3.25rem;
        height:auto;   
        overflow: hidden;     
        padding-left:0.15rem;
        padding-right: 0.15rem;   
        padding-top: 0.05rem;
        padding-bottom: 0.1rem;      
        >img{
          width:0.8rem;
          height:0.8rem;
          float: left;
          display:block;
        } 
        >div.goodsMsg{
          width:2.35rem;
          height:auto;
          float:right;;
          p{
            width:100%;
            height:0.2rem;
            line-height: 0.2rem;
            margin-top: 0.05rem;
          }
          p.title{
            font-size:0.14rem;
            color:#343434;
            font-weight:700;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p.desc{
            margin-top: 0.02rem;
            font-size:0.12rem;
            color:#666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p.price{
            margin-top: 0.08rem;
            font-size:0.14rem;
            color:#f75151;
            font-weight:700;
            span{
              font-size: 0.12rem;
              color: #999;
              text-decoration: line-through;
            }
          }
        }
      }
      div.active{
        width:3.25rem;
        height:auto;   
        overflow: hidden;     
        padding-left:0.15rem;
        padding-right: 0.15rem;   
        >img{
          display:block;
          width:100%;
          height:1.65rem;
        }     
        p{
          width:100%;
          height:auto;
          margin:0.1rem 0;
          font-size:0.14rem;
          color:#666;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:3;
          overflow:hidden;
        }       
      }
      div.order{
        width:3.25rem;
        height:auto;   
        overflow: hidden;     
        padding-left:0.15rem;
        padding-right: 0.15rem;   
        padding-bottom: 0.1rem;
        >img{
          display:block;
          width:0.8rem;
          height:0.8rem;
          float:left;
        }     
        p{
          width:2.35rem;
          height:auto;
          font-size:0.14rem;
          color:#666;
          float:right;
        }       
      }
    }
  }

</style>
