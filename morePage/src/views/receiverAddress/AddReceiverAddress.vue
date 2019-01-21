<template>
  <div id="addShippingAddress_Vue">
    <div class="box1">
      <div class="addName">
        <p>收货人</p>
        <input type="text" v-model="address.reallyName" maxlength="16" />
      </div>
      <img src="../../assets/img/line.png"/>
    </div>
    <div class="box1">
      <div class="addTel">
        <p>联系电话</p>
        <input type="tel" v-model="address.phone" maxlength="11" />
      </div>
      <img src="../../assets/img/line.png"/>
    </div>
    <div class="box2">
      <div class="addArea" @click="choiceAddress()">
        <p class="showArea" @click="showArea">
          省、市、区县
          <span v-show="provinceObject && cityObject && countyObject" class="addressInformation">{{provinceObject ? provinceObject.name : ''}} {{cityObject ? cityObject.name : ''}} {{countyObject ? countyObject.name : ''}}</span>
        </p>
        <img src="../../assets/img/right.png" class="right"/>
      </div>
    </div>
    <div class="box3">
      <img src="../../assets/img/line.png" />
      <div class="detailedAddress">
        <p>详细地址</p>
        <textarea maxlength="70" rows="4"  placeholder="请务必填写并确认详细地址" v-model="address.address"></textarea>
      </div>
      <img src="../../assets/img/line.png"/>
    </div>
    <div class="setDefault">
      <p>设为默认</p>
      <mt-switch v-model="address.defaultUse"></mt-switch>
    </div>
    <!--居住地址三级联动选项-->
    <section class="showChose cd-popup2">
      <section class="spaceArea"></section>
      <section class="address cd-popup-container2">
        <section class="title">
          <p>
            所在地区
            <!--<span class="cancel">×</span>-->
            <img src="../../assets/img/closePic.png" class="cancel"/>
          </p>
        </section>
        <section class="areaTitle">
          <div class="area1" @click="provinceSelected()" >
            <p class="areaText" :class="showProvince ? 'active' : ''">{{provinceObject ? provinceObject.name : '请选择' }}</p>
          </div>
          <div class="area2" @click="citySelected()" v-show="provinceObject">
            <p class="areaText" :class="showCity ? 'active' : ''">{{cityObject ? cityObject.name : '请选择'}}</p>
          </div>
          <div class="area3" @click="countySelected()" v-show="cityObject">
            <p class="areaText" :class="showCounty ? 'active' : ''">{{countyObject ? countyObject.name : '请选择'}}</p>
          </div>
        </section>
        <ul>
          <!-- 省份列表 -->
          <li class="addList" v-for="province in provinceArray" @click="loadCityByProvinceId(province,false)"
              v-show="showProvince" :class="province.selected ? 'active' : ''">
            {{province.name}}
            <img v-show="provinceObject && provinceObject.adcode == province.adcode" src="../../assets/img/choice.png" style="margin-left: 0.1rem;width: 0.16rem;height: 0.11rem;"/>
          </li>

          <!-- 地级市列表 -->
          <li class="addList" v-for="cityItem in cityArray" @click="loadCountyByCity(cityItem,false)" v-show="showCity"
              :class="cityItem.selected ? 'active' : ''">
            {{cityItem.name}}
            <img v-show="cityObject && cityObject.adcode == cityItem.adcode" src="../../assets/img/choice.png" style="margin-left: 0.1rem;width: 0.16rem;height: 0.11rem;"/>
          </li>

          <!-- 区县列表 -->
          <li class="addList" v-for="county in countyArray" @click="choiceCounty(county)"
              v-show="showCounty" :class="county.selected ? 'active' : ''">
            {{county.name}}
            <img v-show="countyObject &&  county.imgchoice" src="../../assets/img/choice.png" style="margin-left: 0.1rem;width: 0.16rem;height: 0.11rem;"/>
          </li>
        </ul>
      </section>
    </section>
    <div class="spacing">

    </div>
    <div class="fixedArea">
      <div class="sureBtn" @click="preservation(onceType)">
        <p>保 存</p>
      </div>
    </div>

  </div>
</template>

<script>
  import {Picker, Switch} from 'mint-ui';

  export default {
    name: 'addReceiverAddress',
    components: {
      Picker,
      Switch,
      'mt-picker': Picker
    },
    props: {},
    data() {
      return {
        address: {
          reallyName: '',
          phone: '',
          address: '',
          defaultUse: false,
          province: '',
          provinceCode: '',
          city: '',
          cityCode: '',
          county: '',
          countyCode: ''
        },
        onceType:true,
        provinceObject: null,
        cityObject: null,
        countyObject: null,

        provinceArray: [],
        cityArray: [],
        countyArray: [],

        showProvince: true,
        showCity: false,
        showCounty: false,

        showChose: false

      };
    },
    created() {
      document.title = "新增地址"
    },
    activated() {
      document.title = "新增地址";
    },
    mounted:function(){
    },
    methods: {
      showArea() {
        event.preventDefault();
        $('.cd-popup2').addClass('is-visible2');
        //关闭弹框
        $(".cd-popup2").click(function (event) {
          if ($(event.target).is('.cancel') || $(event.target).is('.spaceArea')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        })
      },
      choiceAddress: function () {
        //如果省,市,区县都不为空,那么就需要加载省,市,区县的数据
        if (this.provinceObject != null && this.cityObject != null && this.countyObject != null) {
          this.loadProvinceData(true);
        } else {  //加载省级数据
          this.loadProvinceData(false);
        }
      },

      showChoiceDialog() {
        let context = this;
        context.showChose = true;
        $('.address').show();
        $('.address').animate({bottom: '0'}, 200, function () {
          $(this).show();
        });
      },

      preservation(){
        if(this.onceType){
        	this.onceType=false;  
          this.save();       	
        }
      },
      save() {
       
        if (!this.address.reallyName || this.address.reallyName.trim().length == 0) {
        	this.onceType=true;        	
          this.showError('收货人不能为空');
          return;
        }
        // if (!/^[\u4e00-\u9fa5a-zA-Z0-9\-_]{2,10}$/.test(this.address.reallyName)) {
        //   this.$toast('请输入2-10个字符，可由中英文、数字、"_"、"-"组成');
        //   return;
        // }
        if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,1,3,6,7,8])|(19[7,8,9])|(166))\d{8}$/.test(this.address.phone)) {
        	this.onceType=true; 
          this.showError('请输入正确的电话号码');
          return;
        }

        if (!this.provinceObject || !this.cityObject || !this.countyObject) {
        	this.onceType=true; 
          this.showError('请选择省、市、区县');
          return;
        }

        if (!this.address.address || this.address.address.trim().length == 0) {
        	this.onceType=true; 
          this.showError('收货人详细地址不能为空');
          return;
        }

        this.address.province = this.provinceObject.name;
        this.address.provinceCode = this.provinceObject.adcode;
        this.address.city = this.cityObject.name;
        this.address.cityCode = this.cityObject.adcode;
        this.address.county = this.countyObject.name;
        this.address.countyCode = this.countyObject.adcode;

        this.$indicator.open({
          text: '保存中...',
          spinnerType: 'fading-circle'
        });

        this.http.postJson(this).url("/app/api/address").params(
          this.address
        ).request(function (response) {
          console.log(this.address.phone)
          this.$indicator.close();
          this.showSuccess("添加成功");
          //使收货地址缓存无效
          this.keep.invalidKeepAlive('/receiver_address.html');
          //缓存一个数据,标记地址列表页面需要刷新
          this.keep.cache.push("RefreshAddress", "RefreshAddress");
          this.keep.back();
          this.onceType=true;
        }, function (error) {
          this.onceType=true;
          this.$indicator.close();
          //this.showError("服务器繁忙")
        }, function (response) {
          this.onceType=true;
          this.$indicator.close();
          //this.showError(response.data.message)
        });

      },


      loadProvinceData(loadAll) {

        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        this.http.get(this).url("/app/api/region/provinces").params({}).request(function (response) {
          console.log(response)
          this.provinceArray = response.data.data.districts[0].districts;
          if (!loadAll) {
            this.$indicator.close();
            this.showChoiceDialog();
          } else {
            this.loadCityByProvinceId(this.provinceObject, true);
          }
          console.log(response)
        }, function (error) {
          this.$indicator.close();
          //this.showError("服务器繁忙")
        }, function (response) {
          this.$indicator.close();
         // this.showError(response.data.message);
        });
      },

      /**
       * 功能:根据省查询地级市
       * @param province
       */
      loadCityByProvinceId(province, loadAll) {

        if (!loadAll) {
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
        }

        this.provinceObject = province;

        this.http.get(this).url("/app/api/region/city").params({
          adcode: province.adcode
        }).request(function (response) {
          if (!loadAll) {
            this.$indicator.close();
          }
          this.cityArray = response.data.data.districts[0].districts;
          this.showProvince = false;
          this.showCity = true;
          this.showCounty = false;

          if (loadAll) {
            this.loadCountyByCity(this.cityObject, loadAll);
          }

        }, function (error) {
          this.$indicator.close();
         // this.showError("服务器繁忙")
        }, function (response) {
          this.$indicator.close();
          //this.showError(response.data.message);
        });
      },

      /**
       * 功能:地级市查询区县
       * @param city
       */
      loadCountyByCity(city, loadAll) {
        if (!loadAll) {
          this.$indicator.open({
            spinnerType: 'fading-circle'
          });
        }
        this.cityObject = city;
        this.http.get(this).url("/app/api/region/city").params({
          adcode: city.adcode
        }).request(function (response) {
          this.$indicator.close();
           var data = response.data.data.districts[0].districts;
           
          if (loadAll) { 
            for(var i = 0;i<data.length;i++){
              if(data[i].adcode == this.countyObject.adcode && data[i].name == this.countyObject.name){
                data[i].imgchoice = true;
              }else{
                data[i].imgchoice = false;
              }
            }
          }else{
             for(var i = 0;i<data.length;i++){
               data[i].imgchoice = false;
             }
          }  

          // console.log(data)
          this.countyArray = data;
          this.showProvince = false;
          this.showCity = false;
          this.showCounty = true;

          this.showChoiceDialog();
        }, function (error) {
          this.$indicator.close();
         // this.showError("服务器繁忙")
        }, function (response) {
          this.$indicator.close();
         // this.showError(response.data.message);
        });
      },


      choiceCounty(county) {
        for(var i = 0;i<this.countyArray.length;i++){
            if(this.countyArray[i].center == county.center){
              this.countyArray[i].imgchoice = true;
            }else{
              this.countyArray[i].imgchoice = false;
            }
        }
        this.countyObject = county;
        $('.cd-popup2').removeClass('is-visible2');
      },

      provinceSelected: function () {
        this.cityArray = [];
        this.countyArray = [];
        this.cityObject = null;
        this.countyObject = null;

        // 选项页面的切换
        this.showProvince = true;
        this.showCity = false;
        this.showCounty = false;
      },


      citySelected: function () {
        this.countyArray = [];
        this.countyObject = null;

        this.showProvince = false;
        this.showCity = true;
        this.showCounty = false;
      },

      countySelected: function () {
        this.showProvince = false;
        this.showCity = false;
        this.showCounty = true;
      }

    }

  }
</script>

<style lang='scss'>
  @import '../../assets/scss/AddReceiverAddress.scss';
</style>