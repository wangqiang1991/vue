<template>
  <div class="createPost-container" id="saveProvider_vue">
    <el-form class="form-container">
      <sticky :className="'sub-navbar'">
        <template>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancel">取 消</el-button>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <h1 style="margin-bottom:20px;font-size:18px;color:#666;">供应商基本信息</h1>
          </el-col>
          <el-col :span="12">
            <el-form-item required="true" label-width="120px" label="供应商名称:">
              <el-input type="text"  class="providerInput"  maxlength="50"  placeholder="请输入供应商名称" v-model="provider.providerName">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required="true" label-width="120px" label="供应商编码:">
              <el-input type="text"   class="providerInput" maxlength="20"   placeholder="请输入供应商编码" v-model="provider.providerCode">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required="true" label-width="120px" label="联系人:">
              <el-input type="text"   class="providerInput" maxlength="10"   placeholder="请输入联系人" v-model="provider.contacts">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required="true" label-width="120px" label="供应商性质:">
              <el-select v-model="provider.providerNatureId" clearable style="width: 400px" class="filter-item" placeholder="请选择经营性质">
              <el-option v-for="item in provider_natures" :key="item.providerNatureId" :label="item.providerNatureName" :value="item.providerNatureId">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item required="true" label-width="120px" label="联系电话:">
              <el-input type="text"   class="providerInput" minlength="5" maxlength="11"   placeholder="请输入联系电话" v-model="provider.phone">
              </el-input>
            </el-form-item>

            <el-form-item required="true" label-width="120px" label="详细地址:">
              <el-input type="text"   class="providerInput" maxlength="50"   placeholder="请输入供应商详细地址" v-model="provider.address">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
           <el-form-item label-width="120px" label="供应商描述:">
             <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" maxlength="100" placeholder="请填写供应商描述" style="width: 400px;" v-model="provider.description">
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
              <el-input type="text"   class="providerInput"  maxlength="100" placeholder="请输入微信号或者微信手机号" v-model="provider.wechat">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
           <el-form-item label-width="120px" label="发货地:">
             <el-input type="text"   class="providerInput" maxlength="50"  placeholder="请输入供应商发货地" v-model="provider.deliver">
             </el-input>
           </el-form-item>
         </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="邮箱地址:">
              <el-input type="text"   class="providerInput" maxlength="100" placeholder="请输入联系邮箱" v-model="provider.email">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="承运方:">
              <el-input type="text"   class="providerInput" maxlength="50"   placeholder="请输入供应商承运方" v-model="provider.shipper">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="结算政策:">
              <el-input type="text"   class="providerInput" maxlength="50"   placeholder="请输入提供的结算政策" v-model="provider.policy">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="运输周期:">
              <el-input type="text"   class="providerInput" maxlength="20" placeholder="请输入供应商运输周期" v-model="provider.shipperCycle">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="供应商链接:">
              <el-input type="text" class="providerInput" maxlength="100" style='margin-right:10px' placeholder="请输入供应商完整网站链接" v-model="provider.providerWebsite">
              </el-input>
              <el-button v-show="provider.providerWebsite"  size="mini" type="info" icon="edit" @click="editWeb()">点我跳转</el-button>
            </el-form-item>
          </el-col>

           <el-col :span="12">
            <el-form-item label-width="120px" label="运费说明:">
              <el-input type="text"   class="providerInput" maxlength="50" placeholder="请输入供应商运费说明" v-model="provider.expressDescription">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label-width="120px" label="备货周期:">
              <el-input type="text"   class="providerInput" maxlength="20"   placeholder="请输入供应商备货周期" v-model="provider.prepareCycle">
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
      reset(){
        this.provider.providerId = null;
        this.provider.providerNatureId = null;
        this.provider.providerCode = "";
        this.provider.providerName = "";
        this.provider.contacts = "";
        this.provider.phone = "";
        this.provider.email = "";
        this.provider.address = "";
        this.provider.description = "";
        this.provider.wechat = "";
        this.provider.deliver = "";
        this.provider.shipper = "";
        this.provider.expressDescription = "";
        this.provider.shipperCycle = "";
        this.provider.prepareCycle = "";
        this.provider.policy = "";
        this.provider.providerWebsite = "";
        this.providerOrder.orderNumber = 0;
        this.providerOrder.orderGoodsNumber = 0;
        this.providerOrder.orderPrice = 0;

      },
      checkForm() {
        if (!this.provider.providerName.trim()) {
          this.$message({message: '供应商名称不能为空', type: 'warning'});
          return false;
        }

        if (!this.provider.providerCode.trim()) {
          this.$message({message: '供应商编码不能为空', type: 'warning'});
          return false;
        }

        if (!this.provider.providerNatureId) {
          this.$message({message: '请选择供应商经营性质', type: 'warning'});
          return false;
        }

        if (!this.provider.contacts.trim()) {
          this.$message({message: '供应商联系人不能为空', type: 'warning'});
          return false;
        }

        if (!this.provider.phone.trim()) {
          this.$message({message: '联系电话不能为空', type: 'warning'});
          return false;
        }
        if (!this.provider.address.trim()) {
          this.$message({message: '详细地址不能为空', type: 'warning'});
          return false;
        }

        return true;
      },
      loadProvinceNature(data){
        this.provider_natures = data;
        this.editData = false;
      },
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
      editWeb() {
        window.open(this.provider.providerWebsite);
      },
      save() {
        if (this.checkForm()) {
          this.http.postJson(this).url(this.config.provider.provider_save_url).params(this.provider).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '保存成功!'});
            this.reset();
            this.$emit('success');
            },
            (error) => {console.log(error)}
          );
        }
      },
      cancel() {
        this.reset();
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

<style rel="stylesheet/scss" lang="scss" >
  #saveProvider_vue{
    .providerInput{
      max-width: 400px;
    }
    .hr {
      border-top: 1px solid #dddddd
    }
  }
</style>
