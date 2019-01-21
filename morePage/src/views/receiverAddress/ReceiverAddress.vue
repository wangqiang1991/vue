<template>
  <div id="shippingAddress">
    <!-- <LoadingView v-bind:dataload="loading"></LoadingView> -->
    <div v-show="!noAddress">
      <div @click="choiceAddress(address)" v-show="!loading" :class="choice ? 'choiceContent' : 'content'" v-for="address in addressArray">
        <div class="contentInformation">
          <p class="contentTitle">
            <span>{{address.reallyName}}</span>
            <span>{{address.phone}}</span>
          </p>
          <p class="address" style="word-break:break-all">{{address.province}}{{address.city}}{{address.county}}{{address.address}}</p>
        </div>
        <div v-show="!choice" class="contentOperation">
          <div class="choiceBtn" @click="setDefaultAddress(address)">
            <img src="../../assets/img/checked.png" v-show="address.defaultUse"/>
            <img src="../../assets/img/unchecked.png" v-show="!address.defaultUse"/>
            <p>设为默认</p>
          </div>
          <div class="addressOperation">
            <div class="addressEdit" @click="showDetail(address)">
              <img src="../../assets/img/editAddress.png"/>
              <span>编辑</span>
            </div>
            <div class="addressDelet" @click="deleteItem(address)">
              <img src="../../assets/img/deleteAddress.png"/>
              <span>删除</span>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!loading" class="spacing"></div>

    </div>
    <div v-show="!loading" class="fixedArea" :class="{'btnNoaddress':noAddress}">
      <div @click="toAddAddress()" class="addBtn">
        <p>新建地址</p>
      </div>
    </div>
    <div class="noAddress" v-show="noAddress" style="background:white;">
      <img  src="../../assets/img/noAddress.png"/>
      <p style="font-size:0.16rem;color:#ddd;">这位巢客 <br> 您还没有添加收货地址呢</p>
    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>

  import LoadingView from '@/components/Loading.vue'
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'ReceiverAddress',
    components: {
      firstLoad:firstLoad,
      LoadingView: LoadingView,
      loadFailed:loadFailed,
    },
    type:true,
    beforeDestroy() {
      clearInterval(this.intervalRefresh);
    },

    mounted() {
      $('.noAddress').css({'height': document.documentElement.clientHeight});
      this.choice = this.getParam("choice");
      if (this.keep.isKeepAlive()) {
        this.firstLoad = false;
        //读取缓存
        this.addressArray = this.keep.cache.get("ReceiverAddress");
        //滚动到指定位置
        this.keep.markNotKeepAlive();
        this.$nextTick(() => {
          this.keep.scroll.recoverAndClear();
        });

      } else {
        this.firstLoad = true;
        this.findAll();
      }

      this.intervalRefresh = setInterval(() => {
        //判断是否选择了地址
        let refreshAddress = this.keep.cache.get("RefreshAddress",null,'/add_receiver_address.html');
        if (!refreshAddress) {
          refreshAddress = this.keep.cache.get("RefreshAddress",null,'/edit_receiver_address.html');
        }

        if (refreshAddress) {
          this.findAll();
          //清楚刷新缓存标记
          this.keep.cache.removeByPathname("/add_receiver_address.html","RefreshAddress");
          this.keep.cache.removeByPathname("/edit_receiver_address.html","RefreshAddress");
        }
      }, 500)
    },
    activated() {
      document.title = "收货地址";
    },
    created() {
      document.title = "收货地址";
    },

    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        noAddress: false,
        loading: false,
        addressArray: [],
        choice:false
      }
    },
    methods: {
      reload() {
        this.loadFailed = false;
        this.findAll();
      },
      findAll() {

        if (!this.addressArray || this.addressArray.length == 0) {
          this.loading = true;
        }

        this.http.get(this).url("/app/api/address").params({}).request(function (response) {
          this.firstLoad = false;
          this.loading = false;
          console.log(response)
          this.addressArray = response.data.data;

          if (!this.addressArray || this.addressArray.length == 0) {
            this.noAddress = true;
          } else {
            this.noAddress = false;
          }

          this.keep.cache.push("ReceiverAddress", this.addressArray);

        }, function (error) {
          this.loadFailed = true;
          this.firstLoad = false;
          this.loading = false;
          //this.showError("服务器繁忙")
        }, function (response) {
          this.loadFailed = true;
          this.firstLoad = false;
          this.loading = false;
          //this.showError(response.data.message);
        });
      },


      /**
       * 设置默认收货地址
       */
      setDefaultAddress(address) {
        if (address.defaultUse) {
           this.cancelDefaultAddress(address); 
          return;
        }
        this.$indicator.open({
          text: '设置中...',
          spinnerType: 'fading-circle'
        });

        let context = this;
        this.http.post(this).url("/app/api/address/use/:addressId").restful({
          addressId: address.addressId
        }).request(function (response) {
          this.$indicator.close();
          address.defaultUse = true;
          context.addressArray.forEach(function (addressObject) {
            if (addressObject.addressId != address.addressId) {
              addressObject.defaultUse = false;
            }
          });
        }, function (error) {
          this.$indicator.close();
        }, function (response) {
          this.$indicator.close();
        });
      },
      cancelDefaultAddress(address){
         this.$indicator.open({
          text: '设置中...',
          spinnerType: 'fading-circle'
        });
        this.http.post(this).url(this.config.address.cancelDefaultAddress).restful({
          addressId: address.addressId
        }).request(function (response) {
          this.$indicator.close();
          address.defaultUse = false;
          this.addressArray.forEach(function (addressObject) {
            if (addressObject.addressId != address.addressId) {
              addressObject.defaultUse = false;
            }
          });
        }, function (error) {
          this.$indicator.close();
        }, function (response) {
          this.$indicator.close();
        });
      },

      deleteItem(address) {

        let context = this;

        this.$messagebox({
         message: '确定删除当前地址吗？',
         cancelButtonText:"取消",
         showCancelButton:true,
         confirmButtonText:"删除",
         showConfirmButton:true
        }).then((action) => {
          if(action == "cancel"){
            return ;
          }
          if (action === 'confirm') {
            context.submitDelete(address);
          }
        });
      },

      submitDelete(address) {
        this.$indicator.open({
          text: '删除中...',
          spinnerType: 'fading-circle'
        });

        let context = this;

        this.http.post(this).url("/app/api/address/delete/:addressId").restful({
          addressId: address.addressId
        }).request(function (response) {
          this.$indicator.close();
          this.findAll();
        }, function (error) {
          this.$indicator.close();
        }, function (response) {
          this.$indicator.close();
        });
      },

      toAddAddress() {
        // 保存当前滚动位置,下次刷新恢复该位置
        
        this.keep.scroll.save();
        // 页面跳转    
        	 this.keep.go("/add_receiver_address.html",true); 
         
      },

      showDetail(address) {
        // 保存当前滚动位置,下次刷新恢复该位置
        this.keep.scroll.save();
        // 页面跳转
        this.keep.go("/edit_receiver_address.html",true,{addressId:address.addressId})
      },

      // 选择了地址
      choiceAddress(address) {
        if (this.choice) {
          console.log(address)
          this.keep.cache.push("addressId", address.addressId ,"/confirm_order.html");
          this.keep.cache.push("ChoiceAddress", address);
          this.keep.back();
        }
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/ReceiverAddress.scss';

</style>