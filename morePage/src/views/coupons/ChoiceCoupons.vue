<template>
  <div id="coupons_Vue">

    <div class="coupons" v-show="!noCoupons">

      <!-- <p class="couponTip">促销活动</p> -->
      <p style="width:100%;height:0.2rem;"></p>
      <div class="coupon_div">
        <div style="position:relative" class="couponsBox1" v-for="(coupon,index) in couponsArray" :class="{'couponNouse':!coupon.use}" @click="choice(coupon,index)">
          <div class="box">
          
            <p class="coupon_title">{{coupon.name}}</p>
            <p class="time"><span class="expire">{{coupon.expireDescription}}</span><span class="coupon_type">{{coupon.typeStr}}</span></p>
            <p class="desc"><span>{{coupon.description}}</span></p>

          </div>
          <img v-if="coupon.choice" src="../../assets/img/checked.png" class="checkBtn">
          <img v-else-if="coupon.use" src="../../assets/img/unchecked.png" class="checkBtn">
        </div>
      </div>
      <p style="width:100%;height:0.2rem;"></p>
      <!-- <p class="coupon_bottom">结算时将自动为您选择最优惠的折扣方式</p> -->

    </div>
    

    <div class="noCoupons" v-show="noCoupons" style="background:#fff">
      <div class="">
        <img src="../../assets/img/noDataCoupon.png"/>
        <p class="content" style="font-size:0.16rem;color:#ddd;">暂无可用优惠券</p>
      </div>
    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>


  </div>
</template>

<script>
   import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import LoadingView from '@/components/Loading.vue'

  export default {
    name: 'coupons',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      LoadingView: LoadingView,
    },
    created (){
      document.title="选择优惠券"
    },
    activated () {
      document.title="选择优惠券";
    },
    mounted() {
      let orderId = this.getParam("orderId");
      this.couponId = this.getParam("couponId");
      this.getCoupons(orderId);
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        couponsArray: [],
        loading: false,
        couponId:'',
        noCoupons: false,
        choiceIndex:null,
      }
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.getCoupons(this.getParam("orderId"))
      },
      getCoupons(orderId) {
        this.loading = true;
        this.http.get(this).url("app/api/coupon/mapping/order").params({orderId: orderId}).request(function (response) {
          this.firstLoad = false;
          this.loading = false;
          var coupons = response.data.data;
          let flag = true;
          for (var i = 0; i < coupons.length; i++) {
            if (coupons[i].couponId == this.couponId && coupons[i].use && flag) {
              coupons[i].choice = true;
              this.choiceIndex = i;
              flag = false;
            } else {
              coupons[i].choice = false;
            }
            
          }

          this.couponsArray = coupons;

          let context = this;

          this.couponsArray.forEach(function (coupon) {
            if (coupon.couponId == context.couponId) {
              context.keep.cache.push("ChoiceCoupon", coupon);
            }
          });

          if(this.couponsArray.length == 0){
            this.noCoupons = true;
          }else{
            this.noCoupons = false;
          }
        }, function (error) {
          this.loadFailed = true;
          this.firstLoad = false;
          this.loading = false;
        },function (response) {
          this.firstLoad = false;
          this.loadFailed = true;
          this.loading = false;
        })
      },
      choice(coupon,index) {
        if (!coupon.use) {
          return;
        }

        if (coupon.choice) {
          this.keep.cache.push("ChoiceCoupon", "null");
        } else {
          this.keep.cache.push("ChoiceCoupon", coupon);  
        }
        
        // this.couponsArray.forEach((item) =>{
        //   item.choice = false;
        // })
        
        coupon.choice = !coupon.choice;   
        if (this.choiceIndex != null && index != this.choiceIndex) {
          this.couponsArray[this.choiceIndex].choice = false;
        }

        setTimeout(()=>{
          this.keep.back();
        },200);
      }

    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/coupons.scss';
</style>