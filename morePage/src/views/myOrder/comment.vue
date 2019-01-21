<template>
  <div id="orderList_Vue">

    <div class="widget-title inline-block tabs" id="tabs">
      <ul>
        <li class="all " :class="{'li_active':type}" @click='choiceStyle(0)'>
          <label for="all">待评价</label>
        </li>
        <li class="waitPay" :class="{'li_active':!type}" @click='choiceStyle(1)'>
          <label for="waitPay">已评价</label>
        </li>
      </ul>
    </div>

     <!--  待评论 -->
      <div class="service_content" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" v-show='type'>
      
        <div class="contentBox" v-for='n in commentData'>
          <div class="contentBoxMain" @click="goCommentDetal(n,0)">
            
            <div>
              <span class="productPic">
                  <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
                </span>
              <div class="productIntr"  style="overflow:hidden;">
                <p class="productTitle">
                  {{n.title}}
                </p>
                <p class="productSize" style="width:5rem;max-width:5rem;"><span>{{n.styleName}}</span><span v-if="n.subName">{{n.subName}}</span></p>
                <div class="priceDiv">
                  <p class="productPrice">¥{{n.stylePrice}}</p>
                  <p class="productNum">x{{n.amount}}</p>
                </div>
              </div>
            </div>
          </div>
         <!--  <div class="contentBoxService">
            <div class="contentBoxService1" v-show='n.stylePrice*n.amount-n.money+n.expressTotalMoney-n.expressMoney!=0'>
              <span style="float: left;">优惠金额:</span>
              <span style="float: right;">-¥{{ (n.stylePrice*n.amount-n.money) + (n.expressTotalMoney-n.expressMoney) }}</span>
            </div>
            <div class="contentBoxService1">
              <span style="float: left;">运费:</span>
              <span style="float: right;">¥{{n.expressMoney}}</span>
            </div>
          </div> -->
          <div class="productNum2">
            <span class="productNumber">共{{n.amount}}件商品  &nbsp; 共计<span>{{n.expressMoney ? "(含运费 ¥"+n.expressMoney+")" : "(免运费)"}}</span></span>
            <span class="productPrice2">¥{{((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "") }}</span>
          </div>
          <div class="contentBoxBtn">
            <div>
              <p class="contentBoxTitle">等待评价</p>
            </div>
            <p class="appraiseBtn" @click="goPublish(n)">评价</p>
            <!-- <p class="afterSaleBtn" @click='customerService(n)' v-show='n.afterSaleStatus == null'>申请售后</p> -->
            
          </div>
        </div>

        <div class="load" v-show='loadData'>
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

        <div class="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
        </div>

         <div v-show='commentData.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
        </div>
        
        <div class="end" v-show='noMore'>
          <!-- <p v-if='commentData.length != 0'>没有更多了</p> -->
          <div class="emptyOrder" v-show='!firstLoad && (commentData.length == 0)'>
            <img src="../../assets/img/noDataorder.png"/>
            <p>此类订单暂无内容</p>
          </div>
        </div>

    </div>

      <!-- 已评论 -->
     <div class="service_content" v-infinite-scroll="loadMore1" infinite-scroll-disabled="loading1" infinite-scroll-distance="10" v-show='!type'>

        <div class="contentBox" v-for='n in commentData1'>
          <div class="contentBoxMain" @click="goCommentDetal(n,1)">
            
            <div>
              <span class="productPic">
                  <img :src="n.cover + '?imageView2/0/w/500/h/500|imageslim'" />
                </span>
              <div class="productIntr" style="overflow:hidden;">
                <p class="productTitle">
                  {{n.title}}
                </p>
                <p class="productSize" style="width:5rem;max-width:5rem;"><span>{{n.styleName}}</span><span v-if="n.subName">{{n.subName}}</span></p>
                <div class="priceDiv">
                  <p class="productPrice">¥{{n.stylePrice}}</p>
                  <p class="productNum">x{{n.amount}}</p>
                </div>
              </div>
            </div>
          </div>
         <!--  <div class="contentBoxService">
            <div class="contentBoxService1" v-show='n.stylePrice*n.amount-n.money+n.expressTotalMoney-n.expressMoney!=0'>
              <span style="float: left;">优惠金额:</span>
              <span style="float: right;">-¥{{ (n.stylePrice*n.amount-n.money) + (n.expressTotalMoney-n.expressMoney) }}</span>
            </div>
            <div class="contentBoxService1">
              <span style="float: left;">运费:</span>
              <span style="float: right;">¥{{n.expressMoney}}</span>
            </div>
          </div> -->
          <div class="productNum2">
            <span class="productNumber">共{{n.amount}}件商品  &nbsp; 共计<span>{{n.expressMoney ? "(含运费 ¥"+n.expressMoney+")" : "(免运费)"}}</span></span>
            <span class="productPrice2">¥{{ ((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "")  }}</span>
          </div>
          <div class="contentBoxBtn">
            <div>
              <p class="contentBoxTitle">已评价</p>
            </div>
            <p class="appraiseBtn" @click="goCommentContent(n)">我的评价</p>
            <!-- <p class="afterSaleBtn" @click='customerService(n)' v-show='n.afterSaleStatus == null'>申请售后</p> -->
          </div>
        </div>

        <div class="load" v-show='loadData1'>
          <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
        </div>

        <div class="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
        </div>

         <div v-show='commentData1.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
          <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
        </div>
        
        <div class="end" v-show='noMore1'>
          <!-- <p v-if='commentData1.length != 0'>没有更多了</p> -->
          <div class="emptyOrder" v-show='!firstLoad && (commentData1.length == 0)'>
            <img src="../../assets/img/noDataorder.png"/>
            <p>此类订单暂无内容</p>
          </div>
        </div>
      
    </div>


    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>


  </div>
</template>

<script>

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'service',
    created() {
      document.title = "商品评价"
    },
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        reloadflag:false,
        type:true,

        loading:false,
        loadData:false,
        noMore:false,
        pageIndex:1,
        commentData:[],

        loading1:true,
        loadData1:false,
        noMore1:false,
        pageIndex1:1,
        commentData1:[]
      }
    },
    mounted() {
      if(this.keep.isKeepAlive()){
        if(this.keep.cache.get('active') == 'active'){
          this.type = false;
          this.loading = true;
          this.loading1 = false;
        }else{
          this.type = true;
          this.loading = false;
          this.loading1 = true;
        }
        this.keep.markNotKeepAlive();
      }else{
        this.keep.cache.remove('active');       
      }
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.loading = false;
        this.loading1 = false;
      },
      reloadData(){
        this.reloadflag = false;
        this.loading = false;
        this.loading1 = false;
      },
      choiceStyle(e){
        if(e == 0){
          this.loading = false;
          this.loading1 = true;
          this.noMore = false;
          this.type = true;
        }else if(e == 1){
          this.loading = true;
          this.loading1 = false;
          this.noMore1 = false;
          this.type = false;
        }
      },
      loadMore(){
        this.loading = true;
        this.loadData = true;
        this.findNoComment(this.pageIndex);
      },
      loadMore1(){
        this.loading1 = true;
        this.loadData1 = true;
        this.findAlreadyComment(this.pageIndex1);
      },
      goCommentDetal(e,n) {
        if(this.type == false){
          this.keep.cache.push('active','active');
        }else{
          this.keep.cache.push('active','unActive');
        }
        this.keep.go('/appraise_wait.html', true, {
          orderNumber: e.orderNumber,
          afterSaleStatus: e.afterSaleStatus,
          orderStatus: 3
        });
      },
      customerService(e) {
        console.log(e.orderNumber)
        this.keep.go("/return_goods.html", false, {
          relationId: e.relationId,
          orderNumber: e.orderNumber,
          orderStatus: e.orderStatus
        });
      },
      goPublish(e) {
        if(this.type == false){
          this.keep.cache.push('active','active');
        }else{
          this.keep.cache.push('active','unActive');
        }
        this.keep.go("/publish_commentaries.html", true, {
          orderGoodsId: e.relationId,
          goodsId: e.goodsId,
          styleId: e.styleId
        });
      },
      goCommentContent(e){
        console.log(e)
        if(this.type == false){
          this.keep.cache.push('active','active');
        }else{
          this.keep.cache.push('active','unActive');
        }
        this.keep.go('/comment_content.html',true,{'relationId':e.relationId})
      },
      findNoComment(pageIndex){
        this.http.get(this).url('/app/api/order/list/no-comment').params({
          pageIndex:pageIndex
        }).request((req) => {
          this.firstLoad = false;
          this.loadData = false;
          if(req.data.code != 0) {
            //this.showError(req.data.message)
            return;
          }
          console.log(req);
          var data = req.data.data;
            if(data.length == 0){
              this.loading = true;
              this.noMore = true;
            }else{
              this.loading = false;
              this.pageIndex++;
            }
            for(var i= 0;i<data.length;i++){
              this.commentData.push(data[i])
            }
            
        },(err)=>{
          this.loadFailed = true;
          this.firstLoad = false;
          this.loadData = false;
          this.reloadflag = true;
          console.log(err)
        })
      },
      findAlreadyComment(pageIndex){
        this.http.get(this).url('/app/api/order/list/comment').params({
          pageIndex:pageIndex
        }).request((req) => {
          this.firstLoad = false;
          this.loadData1 = false;
          if(req.data.code != 0) {
            //this.showError(req.data.message)
            return;
          }
          console.log(req);
          var data = req.data.data;
            if(data.length == 0){
              this.loading1 = true;
              this.noMore1 = true;
            }else{
              this.loading1 = false;
              this.pageIndex1++;
            }
            for(var i= 0;i<data.length;i++){
              this.commentData1.push(data[i])
            }
            
        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
          this.reloadflag = true;
          this.loadData1 = false;
          console.log(err)
        })
      }


    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/orderList.scss';
</style>
<style lang="scss">
#orderList_Vue{
  .service_content{
    background:#fff;
    padding-top:0.44rem;
  }
  #tabs{
    ul{
      display:flex;
      justify-content:center;
    }
    li{
      width:auto;
      padding-left:0.1rem;
      padding-right: 0.1rem;
    }
    li.li_active{
      border-bottom: 2px solid #333333;
      color: #333333;
      font-weight: bold;
    }
  }
  div.reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
  }
}
</style>