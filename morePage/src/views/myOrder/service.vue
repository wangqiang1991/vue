<template>
  <div id="orderList_Vue">

    <div class="widget-title inline-block tabs" id="tabs">
      <ul>
        <li class="all " :class="{'li_active':type}" @click='choiceStyle(0)'>
          <label for="all">处理中</label>
        </li>
        <li class="waitPay" :class="{'li_active':!type}" @click='choiceStyle(1)'>
          <label for="waitPay">已完成</label>
        </li>
      </ul>
    </div>

      <!-- 处理中 -->
      <div class="service_content" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" v-show='type'>
      <div class="contentBox" v-for='n in afterSaleData'>
        <div class="contentBoxMain" @click='goAfterSaleInformation(n)'>
         
          <div>
            <span class="productPic">
                <img :src="n.cover+ '?imageView2/0/w/500/h/500|imageslim'" />
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
          <span class="productPrice2">共计：¥{{((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "") }}</span>
        </div>
        <div class="contentBoxBtn">
          <div>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==1">已申请退款</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==2">商家拒绝退款</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==3">退款中</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==4">退款成功</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==5">退款失败</p>

              <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==1">已申请换货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==2">商家拒绝换货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==3">商家待收货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==4">商家拒绝换货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==5">商家已确认收货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==6">客户待收货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==7">客户已确认收货</p>

              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==1">已申请退货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==2">商家拒绝退货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==3">商家待收货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==4">商家拒绝退款</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==5">商家已确认收货</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==6">退款中</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==7">退款成功</p>
              <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==8">退款失败</p>
          </div>
          <p class="checkAfterSaleBtn" @click='goAfterSaleInformation(n)'>售后详情</p>
        </div>
      </div>

      <div class="load" v-show='loadData'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>
      <div class="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>

     <div v-show='noMoreData && afterSaleData.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
        <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>

      <div class="end" v-show='noMore'>
        <!-- <p v-if='afterSaleData.length != 0'>没有更多了</p> -->
        <div class="emptyOrder" v-show='!firstLoad && (afterSaleData.length == 0)'>
          <img src="../../assets/img/noDataorder.png"/>
          <p>此类订单暂无内容</p>
        </div>
      </div>

    </div>

      <!-- 已完成 -->
     <div class="service_content" v-infinite-scroll="loadMore1" infinite-scroll-disabled="loading1" infinite-scroll-distance="10" v-show='!type'>
      <div class="contentBox" v-for='n in afterSaleData1'>
        <div class="contentBoxMain" @click='goAfterSaleInformation(n)'>
          
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
          <span class="productPrice2">共计：¥{{((n.expressMoney+n.money).toFixed(2) + "").replace(".00", "") }}</span>
        </div>
        <div class="contentBoxBtn">
          <div>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==1">已申请退款</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==2">商家拒绝退款</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==3">退款中</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==4">退款成功</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 1&&n.applyStatus ==5">退款失败</p>

            <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==1">已申请换货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==2">商家拒绝换货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==3">商家待收货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==4">商家拒绝换货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==5">商家已确认收货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==6">客户待收货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 2&&n.applyStatus ==7">客户已确认收货</p>

            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==1">已申请退货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==2">商家拒绝退货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==3">商家待收货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==4">商家拒绝退款</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==5">商家已确认收货</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==6">退款中</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==7">退款成功</p>
            <p class="contentBoxTitle" v-show="n.afterSaleType == 3&&n.applyStatus ==8">退款失败</p>
          </div>
          <p class="checkAfterSaleBtn" @click='goAfterSaleInformation(n)'>售后详情</p>
        </div>
      </div>

      <div class="load" v-show='loadData1'>
        <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
      </div>
      <div class="reload" v-show='reloadflag' @click='reloadData()'>
          加载失败,点击重新加载
      </div>
       <div v-show='noMoreData1 && afterSaleData1.length' style="width:100%;background:#f2f2f2;padding:0.2rem 0;">
        <img src="../../assets/img/end.png"  style="display:block;width:0.95rem;height:0.17rem;margin:auto;">
      </div>

      <div class="end" v-show='noMore1'>
        <!-- <p v-if='afterSaleData1.length != 0'>没有更多了</p> -->
        <div class="emptyOrder" v-show='!firstLoad && (afterSaleData1.length == 0)'>
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
      document.title = "我的售后"
    },
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        noMoreData:false,
        noMoreData1:false,
        type:true,
        reloadflag:false,
        loading:false,
        loadData:false,
        noMore:false,
        pageIndex:1,
        afterSaleData:[],

        loading1:true,
        loadData1:false,
        noMore1:false,
        pageIndex1:1,
        afterSaleData1:[]
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
        let activated = this.getParam('activated');
        if(activated == 1){
          this.type = false;
          this.loading = true;
          this.loading1 = false;
        }else{
          this.type = true;
          this.loading = false;
          this.loading1 = true;
        }
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
        this.find(this.pageIndex,false);
      },
      loadMore1(){
        this.loading1 = true;
        this.loadData1 = true;
        this.find(this.pageIndex1,true);
      },
      goAfterSaleInformation(e) {
        console.log(e)
        if(this.type == false){
          this.keep.cache.push('active','active');
        }else{
          this.keep.cache.push('active','unActive');
        }
        this.keep.go("/afterSale_information.html", true, {
          relationId: e.relationId,
          orderNumber: e.orderNumber
        });
      },
      find(pageIndex,type){
        this.http.get(this).url('/app/api/order/after-sale').params({
          pageIndex:pageIndex,queryCompletedAfterSale:type
        }).request((req) => {
          this.firstLoad = false;
          this.loadData = false;
          this.loadData1 = false;
          if(req.data.code != 0) {
            //this.showError(req.data.message)
            return;
          }
          console.log(req);
          var data = req.data.data;

          if(!type){
            if(data.length == 0){
              this.loading = true;
              this.noMore = true;
              this.noMoreData = true;
            }else{
              this.loading = false;
              this.pageIndex++;
            }
            for(var i= 0;i<data.length;i++){
              this.afterSaleData.push(data[i])
            }
            
          }else{
            if(data.length == 0){
              this.loading1 = true;
              this.noMore1 = true;
              this.noMoreData1 = true;
            }else{
              this.loading1 = false;
              this.pageIndex1++;
            }
            for(var i= 0;i<data.length;i++){
              this.afterSaleData1.push(data[i])
            }
          }


        },(err)=>{
          this.firstLoad = false;
          this.loadFailed = true;
          this.loadData1 = false;
          this.loadData = false;
          this.reloadflag = true;
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
  .reload{
    width:100%;
    height:auto;
    font-size:0.14rem;
    padding:0.2rem 0;
    color:#333;
    text-align:center;
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
}
</style>