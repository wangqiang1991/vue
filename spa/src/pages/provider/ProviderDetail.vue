<template>
  <div class="createPost-container" id="detailProvider_vue">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <template>
          <el-button @click="cancel">返 回</el-button>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <!-- <h1 style="margin-bottom:20px;font-size:18px;color:#666;">商品供应商详情</h1> -->

        <el-row style='margin-bottom:20px;margin-top:20px;'>
          <el-col :span="8">
            <div class="block">
                <span class="title">供应商订单数</span>
                <span class="content">{{providerOrder.orderNumber}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="block">
                <span class="title">供应商订单商品数量</span>
                <span class="content">{{providerOrder.orderGoodsNumber}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="block">
                <span class="title">供应商订单总金额</span>
                <span class="content" style="color:#FF9800;">￥{{providerOrder.orderPrice}}</span>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="供应商名称:">
              <el-input type="text"  readonly class="providerInput"  maxlength="50" v-model="provider.providerName">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="供应商编码:">
              <el-input type="text"  readonly class="providerInput" maxlength="20" v-model="provider.providerCode">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="联系人:">
              <el-input type="text"  readonly class="providerInput" maxlength="10" v-model="provider.contacts">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="供应商性质:">
              <el-input type="text" readonly class="providerInput" minlength="5" maxlength="11" v-model="provider.providerNatureName">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="联系电话:">
              <el-input type="text" readonly class="providerInput" minlength="5" maxlength="11" v-model="provider.phone">
              </el-input>
            </el-form-item>

            <el-form-item label-width="120px" label="详细地址:">
              <el-input type="text" readonly  class="providerInput" maxlength="50" v-model="provider.address">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
           <el-form-item label-width="120px" label="供应商描述:">
             <el-input type="textarea" readonly  class="providerInput" :autosize="{ minRows: 4, maxRows: 4}" maxlength="100" style="width: 400px;" v-model="provider.description">
             </el-input>
           </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label-width="120px" label="">
              <div class="hr">
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="微信:">
              <el-input type="text"  readonly class="providerInput"  maxlength="100" v-model="provider.wechat">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
           <el-form-item label-width="120px" label="发货地:">
             <el-input type="text"  readonly class="providerInput" maxlength="50" v-model="provider.deliver">
             </el-input>
           </el-form-item>
         </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="邮箱地址:">
              <el-input type="text"  readonly class="providerInput" maxlength="100" v-model="provider.email">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="承运方:">
              <el-input type="text" readonly  class="providerInput" maxlength="50" v-model="provider.shipper">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="结算政策:">
              <el-input type="text" readonly  class="providerInput" maxlength="50" v-model="provider.policy">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="运输周期:">
              <el-input type="text" readonly  class="providerInput" maxlength="20" v-model="provider.shipperCycle">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="供应商链接:">
              <a style="margin-left:10px;" :href="provider.providerWebsite" target="_blank" title="点击打开" class="link-type">{{provider.providerWebsite}}</a>
            </el-form-item>
          </el-col>

           <el-col :span="12">
            <el-form-item label-width="120px" label="运费说明:">
              <el-input type="text" readonly  class="providerInput" maxlength="50" v-model="provider.expressDescription">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="备货周期:">
              <el-input type="text" readonly class="providerInput" maxlength="20" v-model="provider.prepareCycle">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>


      </div>
    </el-form>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件

  export default {
    name: 'saveProvider',
    components: {
      Sticky
    },
    data() {
      return {
       provider_natures:[],
       editData:true,
       providerOrder:{
        orderNumber:0,
        orderGoodsNumber:0,
        orderPrice:0
       },
       provider:{
        providerId:null,
        providerNatureId:null,
        providerCode:"",
        providerName:"",
        contacts:"",
        phone:"",
        email:"",
        address:"",
        description:"",
        wechat:"",
        deliver:"",
        shipper:"",
        expressDescription:"",
        shipperCycle:"",
        prepareCycle:"",
        policy:"",
        providerWebsite:""
      }
     }
    },
    mounted: function () {

    },
    methods: {
      loadProvinceOrder(providerId) {
        this.http.get(this).url(this.config.provider.provider_order).restful({providerId:providerId}).request((response)=>{
          if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
          }

          this.provider = response.data.data;
          this.providerOrder.orderNumber = response.data.data.orderCount;
          this.providerOrder.orderGoodsNumber = response.data.data.orderGoodsCount;
          this.providerOrder.orderPrice = response.data.data.totalMoney;
          },
          (error) => {console.log(error)}
        )
      },
      cancel() {
        this.$emit('cancel');
      },
      loadSource(naturesData,source) {
        console.log(source)
        this.provider_natures = naturesData;
        this.loadProvinceOrder(source.providerId);
        this.editData = true;
      },

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  #detailProvider_vue{
    .providerInput{
      max-width: 400px;
      input {
        border-style: none;
      }
      textarea {
        border-style: none;
        resize:none;
      }
    }
    .hr {
      border-top: 1px solid #dddddd
    }
    .el-form-item__label {
      color:#999999;
    }
    .block {
      border:1px solid #ddd;
      width: 298px;
      height: 142px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      .title {
        font-size:20px;
        color:#4b5768;
        font-weight:600;
        padding-top:30px;
        display:block;
      }
      .content {
        font-size:30px;
        color:#343434;
        font-weight:600;
        padding-top:20px;
        display:block;
      }
    }
  }
</style>
