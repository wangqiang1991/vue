<template>
  <div id="shoppingCart_Vue">
    <!-- 头部编辑 -->
    <div v-show="!emptyShoppingCart">
      <header v-show="!loading">
        <span class="num">共{{productArray.length}}件商品</span>
        <span class="edit" v-if="isEdit" @click="submitEdit">完成</span>
        <span class="edit" v-else @click="toEdit">编辑</span>
      </header>

      <!-- 购物车列表 -->  
      <ul v-show="!loading" class="shoppingCartMain">

        <li class="productBox" v-for="product in productArray"  @click="goDetail(product)">
          <div @click="choiceOnClick(product)" class="on_check" v-show="isEdit || (!product.pulled && !product.sellout && !product.noStorage)">
            <img src="../../assets/img/checked.png" v-show="product.checked" />
            <img src="../../assets/img/unchecked.png" v-show="!product.checked" />
          </div>
          <div class="productPic">
            <span>
             <img v-lazy="product.styleCover + '?imageView2/0/w/500/h/500|imageslim' "/>
            </span>
            <img class="goods_status" src="../../assets/img/isPutaway.png" v-if="product.pulled">
            <img class="goods_status" src="../../assets/img/isPulled.png" v-else-if="product.sellout">
            <img class="goods_status" src="../../assets/img/noStorage.png" v-else-if="product.noStorage">
          </div>
          <div class="box-right" style="overflow:hidden;">
            <p class="productTitle">{{product.goodsTitle}}</p>
            <span class="productSize" style="width:5rem;"> <span>{{product.styleName}}</span><span v-if="product.subName">{{product.subName}}</span></span>
            <p style="color:#F75151;font-size:0.08rem;margin:0;padding-top:0.03rem;text-align:right;" v-show="!product.pulled && !product.sellout && product.noStorage">库存仅剩{{product.count}}件</p>


            <p class="productPrice" v-if="!product.discountType">¥{{product.price}}</p>
            <p class="productPrice" v-if="product.discountType == 2">¥{{product.discountPrice}}  
              <span class="goods_discount">{{product.price}}</span> 
            </p>
            <p class="productPrice" v-if="product.discountType == 3">¥{{product.price}}    
              <span class="goods_amount">{{product.discountTag}}</span> 
            </p>

            <p class="productNum" v-show="!isEdit">x{{product.amount}}</p>
          </div>

          <div class="num" v-show="isEdit">
            <p @click.stop="reduce(product)" class="button btn1" v-if="!product.pulled && !product.sellout">
              <img src="../../assets/img/red.png" />
            </p>

            <input @click.stop type="number" v-model="product.amount"  class="btn2" readonly="readonly" v-if="!product.pulled && !product.sellout"/>

            <p @click.stop="add(product)" class="button btn3" v-if="!product.pulled && !product.sellout">
              <img src="../../assets/img/add.png" />
            </p>
          </div>

        </li>

      </ul>

      <!-- 底部结算浮窗 -->
      <div class="shoppingCartPay" v-show="!isEdit && !loading">
        <div class="shoppingCartPay-left">
          <img @click="choiceAllOnClick" style="width:0.18rem;height:0.18rem;margin-top:0.12rem;" src="../../assets/img/checked.png" v-show="choiceAll" />
          <img @click="choiceAllOnClick" style="width:0.18rem;height:0.18rem;margin-top:0.12rem;" src="../../assets/img/unchecked.png" v-show="!choiceAll" />
          <span class="choiceAll" @click="choiceAllOnClick" style="color:#343434;">全选</span>
          
          <div class="totlePrice">
            <p>
              <span :class="{'has_coupon': couponMoney > 0}">¥ {{( (checkedAmount - couponMoney).toFixed(2) + "").replace(".00", "")}}</span>
              <span v-show="couponMoney > 0" class="coupon_money">已优惠:¥ {{couponMoney.toFixed(2)}}</span>
            </p>
          </div>

        </div>
        <div @click="findSubscribe()" class="shoppingCartPay-right">
          <button>结算 ({{checkedCount}})</button>
        </div>
      </div>

      <!-- 底部编辑浮窗 -->
      <div class="delete" v-show="isEdit && !loading">
        <div class="shoppingCartDelete-left">
          <img @click="choiceAllOnClick" style="width:0.18rem;height:0.18rem;margin-top:0.12rem;" src="../../assets/img/checked.png" v-show="choiceAll" />
          <img @click="choiceAllOnClick" style="width:0.18rem;height:0.18rem;margin-top:0.12rem;" src="../../assets/img/unchecked.png" v-show="!choiceAll" />
          <span class="choiceAll" @click="choiceAllOnClick" style="color:#343434;">全选</span>
        </div>
        <div class="shoppingCartDelete-right">
          <button @click="deleteItems()">删除 ({{checkedCount}})</button>
        </div>
      </div>

    </div>

    <!-- 购物车无数据 -->
    <div class="emptyShoppingCart" v-show="emptyShoppingCart" style="background:#Fff;">
      <img src="../../assets/img/noDataShoppingCat.png" style="margin-top:1rem;" />
      <p style="color:#ddd;font-size:0.16rem;">购物车居然是空的<br> 快去选购啦</p>
      
    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
    <wxQrcode ref='wxQrcode'></wxQrcode>
  </div>
</template>

<script>
  import LoadingView from '@/components/Loading.vue'
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  import wxQrcode from '../../components/wxQrcode.vue';
  export default {
    name: 'shoppingCart',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
      LoadingView: LoadingView,
      wxQrcode:wxQrcode
    },
    data() {
      return {
        couponMoney:0,
        firstLoad:true,
        loadFailed:false,
        emptyShoppingCart: false,
        checkedAmount: 0,
        checkedCount: 0,
        loading: true,
        choiceAll: false,
        isEdit: false,
        productArray: []
      }
    },
    mounted() {
      $('.emptyShoppingCart').css({'height': document.documentElement.clientHeight});
      this.findAll();
      var h = document.documentElement.clientHeight;
      var h1 = $('header').height();
      var h2 = $('.shoppingCartPay').height();
      var h3 = h - h1 - h2 - 10;
      $('.shoppingCartMain').css('height', h3 + 'px')



      let that = this;
      $(window).focus(function(){
        that.$refs.wxQrcode.closeQrcode();
        //that.productArray = that.keep.cache.get("productArray",[]);        
        //if (that.productArray.length) {
        that.findSubscribe();
        //}
      });

    },
    created() {
      document.title = "购物车"
    },
    methods: {
      reload(){
        this.loadFailed = false;
        this.findAll();
      },
      goDetail(e) {
        console.log(e)
        this.keep.go('/goods_detail.html', false, {
          goodsid: e.goodsId,showGoHome:'1'
        })
      },
      findAll() {
        this.loading = true;
        this.http.get(this).url("/app/api/shopping-cart/v2").params({}).request(function(response) {
          this.firstLoad = false;
          this.loading = false;
          response.data.data.forEach(function(product) {
            product.checked = false;
          });
          this.productArray = response.data.data;
          if(this.productArray.length == 0) {
            this.emptyShoppingCart = true;
          } else {
            this.emptyShoppingCart = false;
          }
        }, function(error) {
          this.firstLoad = false;
          this.loadFailed = true;
          console.log(error)
          this.loading = false;
          //this.showError("服务器繁忙")
        }, function(response) {
          this.firstLoad = false;
          this.loadFailed = true;
          this.loading = false;
          //this.showError(response.data.message);
        });
      },

      choiceOnClick(product) {
        event.stopPropagation();
        
        product.checked = !product.checked;

        /*判断选中过程中全选是否选中*/
        let hasAllChoice = true;
        this.productArray.forEach((item)=>{
          if (!item.checked) {
            hasAllChoice = false;
          }
        })
        if (hasAllChoice) {
          this.choiceAll = true;
        } else {
          this.choiceAll = false;
        }

        this.calcCheckAmount();
      },

      choiceAllOnClick() {
        this.choiceAll = !this.choiceAll;
//      let checkedValue = this.choiceAll;
        for(var i = 0;i < this.productArray.length;i++){
          if (this.isEdit || (!this.productArray[i].pulled && !this.productArray[i].sellout && !this.productArray[i].noStorage)) {
            this.productArray[i].checked = this.choiceAll;
          }
        }
//      this.productArray.forEach(function(item) {
//        item.checked = checkedValue;
//      });

        //计算选中的金额以及数量
        this.calcCheckAmount();
      },

      toEdit() {
        this.isEdit = !this.isEdit;
        this.choiceAll = false;
        this.productArray.forEach(function(item) {
          item.checked = false;
        });

        //计算选中的金额以及数量
        this.calcCheckAmount();
      },

      /**
       * 功能:提交编辑
       */
      submitEdit() {
        for(var i = 0; i < this.productArray.length; i++) {
          if(this.productArray[i].amount < 1) {
            this.showError('商品数量有误');
            return;
          }
        }
        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        this.http.postJson(this).url("/app/api/shopping-cart/saveAll").params(
          this.productArray
        ).request(function(response) {
          this.$indicator.close();
          this.isEdit = !this.isEdit;
          this.choiceAll = false;
          let data = response.data.data;
          data.forEach(function(item) {
            item.checked = false;
          });
          this.productArray = data;
          //计算选中的金额以及数量
          this.calcCheckAmount();
        }, function(error) {
          this.$indicator.close();
         // this.showError("服务器繁忙")
        }, function(response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        });
      },

      deleteItems() {
        if(this.checkedCount == 0) {
          this.showMessage('您还没有选择商品哦~');
          return;
        }
        this.submitDelete();
      },

      submitDelete() {
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
          let context = this;

          this.$indicator.open({
            spinnerType: 'fading-circle'
          });

          let cartIds = "";
          this.productArray.forEach(function(product) {
            if(product.checked) {
              cartIds += product.cartId + ",";
            }
          });
          this.http.delete(this).url("/app/api/shopping-cart/:cartIds").restful({
            cartIds: cartIds
          }).request(function(response) {
            this.$indicator.close();
            for(var i = 0;i < context.productArray.length;i++){
              if(context.productArray[i].checked){
                console.log(i)
                context.productArray.splice(i--,1)
              }
            }
            if(context.productArray.length == 0){
              this.emptyShoppingCart = true;
            }else{
              this.emptyShoppingCart = false;
            }
          }, function(error) {
            this.$indicator.close();
            //this.showError("服务器繁忙")
          }, function(response) {
            this.$indicator.close();
            //this.showError(response.data.message);
          })
        }).catch((err) => {
          return;
        });
      },

      /**
       * 计算选中的金额以及数量
       */
      calcCheckAmount() {
        this.checkedAmount = 0;
        this.checkedCount = 0;
        this.couponMoney = 0;
        let context = this;

        this.productArray.forEach(function(product) {

          if(product.checked) {
            context.checkedCount += 1;
            context.checkedAmount += product.price * product.amount;

            if (product.discountType == 3) {
              if ( product.price * product.amount >  product.coupon.toAmount) {
                context.couponMoney += product.coupon.amount;
              }
              
            } else if (product.discountType == 2) {
              context.couponMoney += (product.price - product.discountPrice) * product.amount;
            }

          }

        });
      },

      add(product) {
        //console.log(product)
        if(product.amount < 99 && !product.pulled && !product.sellout){
          product.amount++;
        }
        
      },

      reduce(product) {
        if(product.amount > 1 && !product.pulled && !product.sellout) {
          product.amount--;
        }
      },
      findSubscribe() {
        this.$indicator.open({
          spinnerType: 'fading-circle'
        });
        this.http.get(this).url(this.config.attendWx).request(function(response) {
          this.$indicator.close();
          if (response.data.data) {
            //this.keep.cache.remove("productArray");
            this.createOrder()
          } else {
            //this.keep.cache.push("productArray",this.productArray);   
            this.$refs.wxQrcode.setQrcode();
          }
        },(err)=>{
          this.$indicator.close();
          console.log(err);
        })
      },
      /**
       * 功能:创建订单
       */
      createOrder() {
        if(this.checkedCount == 0) {
          this.showMessage('您还没有选择商品哦~');
          return;
        }

        let items = [];
        this.productArray.forEach(function(product) {
          if(product.checked) {
            items.push(product);
          }
        });

        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        this.http.postJson(this).url("/app/api/order").params({
          items: items
        }).request(function(response) {
          this.$indicator.close();
          let orderId = response.data.data;
          // 页面跳转
          this.keep.go("/confirm_order.html", false, {
            orderId: orderId
          });
        }, function(error) {
          this.$indicator.close();
         // this.showError("服务器繁忙")
        }, function(response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        });
      }
    }

  }
</script>

<style lang='scss'>
  @import '../../assets/scss/shoppingCart.scss';
</style>