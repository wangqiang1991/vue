<template>
  <div id="coupons_Vue">

    <div class="coupons" v-show="!noCoupons">

      <!-- <p class="couponTip">促销活动</p> -->
      <p style="width:100%;height:0.2rem;"></p>
      <div class="coupon_div" style="padding-bottom:0.5rem;">
        <div class="couponsBox1" v-for="coupon in coupons" :class="{'disableConpou':coupon.cmrStatus == 3}">
          <div class="box">

            <p class="coupon_title">{{coupon.name}}</p>
            <p class="time"><span class="expire">{{coupon.expireDescription}}</span><span class="coupon_type">{{coupon.typeStr}}</span></p>
            <p class="desc"><span>{{coupon.description}}</span></p>

          </div>
        </div>
      </div>

      <p class="coupon_bottom"><span>结算时可选择有效优惠券使用</span></p>

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

  export default {
    name: 'coupons',
    mounted() {
      this.getCoupons();
    },
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    created (){
      document.title="优惠券"
    },
    activated () {
      document.title="优惠券";
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        coupons:[],
        noCoupons:false,
      }
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.getCoupons();
      },
      getCoupons() {
        this.http.get(this).url("app/api/coupon").request((response) => {
            this.firstLoad = false;
            this.coupons = response.data.data;
            if(this.coupons.length){
              this.noCoupons = false;
            }else{
              this.noCoupons = true;
            }
          },(err)=>{
            this.loadFailed = true;
            this.firstLoad = false;
            console.log(err)
          }
        )
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/coupons.scss';
</style>