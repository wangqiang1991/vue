<template>
  <div class="createPost-container" id="saveExpress_vue">
      <sticky :className="'sub-navbar'" style="z-index:100;">
        <template>
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="cancel">取 消</el-button>
        </template>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-form :model="expressTemplate">
            <el-col :span="21">
              <h3 style="margin-bottom:20px;font-size:18px;color:#666;">模板基本信息</h3>
            </el-col>

            <el-col :span="21" class="bascTemplate">
              <el-form-item label="模板名称:">
                <el-input type="text" size="large" style="width:600px" maxlength="50" class="article-textarea" autosize placeholder="请输入模板名称" @change="checkNameInput" v-model="expressTemplate.name">
                </el-input>
              </el-form-item>
              <div style="width:100%;overflow:hidden;">

                <el-form-item label="运送方式:" style="float:left;"> 
                  <el-select v-model="expressTemplate.expressMethod"  filterable placeholder="请选择运送方式">
                    <el-option
                      v-for="item in expressMethod"
                      :key="item.type"
                      :label="item.name"
                      :value="item.type">
                    </el-option>
                  </el-select>
                </el-form-item>

                 <el-form-item label="计费方式:"  style="float:left;" id="moneySelect"> <span style="color: rgb(255, 73, 73);font-size:14px;" v-if="!expressDisable">注意计费方式只能选择一次</span>
                  <el-select v-model="expressTemplate.templateType" :disabled="expressDisable"  @change="expressChange"  filterable placeholder="请选择计费方式">
                    <el-option
                      v-for="item in templateType"
                      :key="item.type"
                      :label="item.name"
                      :value="item.type">
                    </el-option>
                  </el-select>
                </el-form-item>

              </div>
              <div style="width:100%;overflow:hidden;" v-show="expressTemplate.templateType != 1 && expressTemplate.templateType ">
              <el-form-item label="计价设置:" style="width:100%;">
                数量在
                <el-input v-model="expressTemplate.startCount" @change="checkStartCountInput" placeholder="请输入数量" :min="0" :max="1000000"></el-input>
                  <span style="margin-left:10px;">{{label}}内， </span>
                  价格为
                  <el-input v-model="expressTemplate.innerPrice" @change="checkInnerPriceInput" placeholder="请输入价格" :min="0" :max="1000000"></el-input>
                 <span style="margin-left:10px;">元</span>
                 。超出后，每
                 <el-input v-model="expressTemplate.increaseCount" @change="checkIncreaseCountInput" placeholder="请输入数量" :min="0" :max="1000000"></el-input>
                <span style="margin-left:10px;">{{label}} </span>
                 价格追加
                <el-input v-model="expressTemplate.externalPrice" @change="checkExternalPriceInput" placeholder="请输入追加价格" :min="0" :max="1000000"></el-input>
                <span style="margin-left:10px;">元。</span>
              </el-form-item>
              </div>
              
            
            </el-col>
            
            <el-col :span="21">
              <h3 style="margin-bottom:20px;font-size:18px;color:#666;">配送省份<span style="color: rgb(255, 73, 73);font-size:14px;margin-left:10px;">{{complateBase ? "" : "请先填写完模板基本信息后才能选择省份"}}</span></h3>

            </el-col>
  
            <el-col :span="22" class="provincelayout">
              <div v-for="province in provinces" class="provinceDiv">
               <!-- <el-checkbox :checked="province.checkd" :disabled="province.checkBoxDisable"  @change="checkedProvince(province)"></el-checkbox>  -->
               <el-button :type="province.checkd ? 'primary' : '' " :disabled="province.checkBoxDisable" @click="showCity(province)">{{province.name}}</el-button>
              </div> 
            </el-col>

            <el-col :span="21" v-show="complateBase">
              <h3 style="margin-bottom:20px;font-size:18px;color:#666;">配送城市</h3>

            <el-tabs v-model="tabValue" type="card" closable  @tab-remove="removeTab">
              <el-tab-pane v-for="(item, index) in cityData" :key="item.name" :label="item.name" :name="item.name">
                  
                  <el-col :span="21">
                    <el-button v-if="expressTemplate.templateType != 1" style="margin-bottom:10px;" size="small" type="primary"  @click="editAllTemplateItem(item)">批量编辑</el-button>
                    <el-button  style="margin-bottom:10px;" size="small" type="info"  @click="checkAllItem(item)">选中全部</el-button>
                    <el-button  style="margin-bottom:10px;" size="small" type="info"  @click="cancelAllItem(item)">取消全选</el-button>
                  </el-col>

                  <el-col :span="21">
                    <el-table  :data="item.districts"  border fit highlight-current-row style="width: 100%">

                      <el-table-column align="center" label="选择城市" width="100">
                        <template scope="scope">
                          <el-checkbox v-model="scope.row.checked"   @change="cityClick"></el-checkbox>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="城市名称">
                        <template scope="scope">
                          <span>
                           <span >{{scope.row.name}}</span>
                          </span>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="计费方式">
                        <template scope="scope">
                          <span >{{scope.row.tableItemName}}</span>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="操作" width = "150" v-if="expressTemplate.templateType != 1">
                        <template scope="scope">
                          <el-button size="small" type="primary" icon="edit" :disabled="!scope.row.checked" @click="editTemplateItem(scope.row)">编辑</el-button>
                        </template>
                      </el-table-column>

                    </el-table>
                  </el-col>

                </el-tab-pane>
              </el-tabs>
            </el-col>

          </el-form>
        </el-row>

        <!-- 编辑城市列表弹出框 -->
        <el-dialog :title="cityForm.title" :visible.sync="dialog" class="bascTemplate">
          <el-form :model="cityForm">

              <el-form-item :label="cityForm.labelName" style="overflow:hidden;width:100%;">
                <span>{{cityForm.name}}</span>
              </el-form-item>

              <el-form-item label="计价设置:" style="overflow:hidden;">
                <div style="overflow:hidden;width:100%;margin-bottom:10px;margin-left:70px;">
                数量在
                <el-input v-model="cityForm.startCount" placeholder="请输入数量" :min="0" :max="1000000"></el-input>
                  <span style="margin-left:10px;">{{label}}内， </span>
                  价格为
                  <el-input v-model="cityForm.innerPrice" placeholder="请输入价格" :min="0" :max="1000000"></el-input>
                 <span style="margin-left:10px;">元。 </span>
                </div>
                <div style="margin-left:70px;">
                 超出后，每
                 <el-input v-model="cityForm.increaseCount" placeholder="请输入数量" :min="0" :max="1000000"></el-input>
                <span style="margin-left:10px;">{{label}}</span>
                价格追加
                <el-input v-model="cityForm.externalPrice" placeholder="请输入追加价格" :min="0" :max="1000000"></el-input>
                <span style="margin-left:10px;">元。</span>
                </div>
              </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer" style="clear:both;">
            <el-button @click="dialog = false">取 消</el-button>
            <el-button type="primary" @click="comfirmEdit">确 定</el-button>
          </div>
        </el-dialog>

      </div>
  </div>
</template>

<script>

  import Sticky from '@/components/Sticky'

  export default {
    components: {
      Sticky
    },
    data() {
      return {
        expressMethod:[{type:1,name:"快递"},{type:2,name:"物流"},{type:3,name:"EMS"},{type:4,name:"平邮"}],
        templateType:[{type:1,name:"免运费"},{type:2,name:"按重量"},{type:3,name:"计件"},{type:4,name:"按体积"}],
        cityData:[],
        provinces:[],
        dialog:false,
        complateBase:false,
        changeType:true,
        expressDisable:false,
        tabValue:"",
        label:"Kg",
        cityForm:{
          provinceCode:"",
          provinceName:"",
          cityCode:"",
          cityName:"",
          title:"",
          labelName:"",
          name:"",
          startCount:0,
          increaseCount:0,
          innerPrice:0,
          externalPrice:0,
          allEdit:true,
        },
        expressTemplate:{
          templateId:null,
          name:"",
          expressMethod:1,
          templateType:"",
          startCount:'',
          increaseCount:'',
          innerPrice:'',
          externalPrice:'',
          edit:false,
        }  
      }
    },
    mounted() {
      this.loadProvinceData();
    },
    methods: {
      cancel() {
        this.reset();
        this.$emit('cancel');
      },
      checkNameInput(value) {
        //console.log(value);
        this.expressTemplate.name = value;
        this.complateBaseMessage();
      },
      checkStartCountInput(value) {
        //console.log(value);
        this.expressTemplate.startCount = value;
        this.complateBaseMessage();
      },
      checkIncreaseCountInput(value) {
        //console.log(value);
        this.expressTemplate.increaseCount = value;
        this.complateBaseMessage();
      },
      checkInnerPriceInput(value) {
        //console.log(value);
        this.expressTemplate.innerPrice = value;
        this.complateBaseMessage();
      },
      checkExternalPriceInput(value) {
        //console.log(value);
        this.expressTemplate.externalPrice = value;
        this.complateBaseMessage();
      },
      complateBaseMessage() {
        if (this.expressTemplate.name && this.expressTemplate.templateType == 1 ) {
          this.cancelDisable();
        }else if(this.expressTemplate.name && this.expressTemplate.templateType && this.expressTemplate.templateType != 1 && this.expressTemplate.startCount && this.expressTemplate.increaseCount && this.expressTemplate.innerPrice && this.expressTemplate.externalPrice){
          this.cancelDisable();
        }else {
          this.provinces.forEach((item)=>{
             item.checkBoxDisable = true;
          }) 
           this.complateBase = false;
        }
      },
      cancelDisable(){
         this.provinces.forEach((item)=>{
             item.checkBoxDisable = false;
         }) 
         this.complateBase = true;
      },
      setChangType(){
        this.changeType = true;
      },
      expressChange(value){
       //console.log(value)
       if (this.changeType) {
         this.changeType = false;
         this.expressDisable = true;
         this.expressTemplate.templateType = value;
         if (value == 2) {
          this.label = "Kg";
         } else if (value == 3) {
           this.label = "件";  
         } else if (value == 4) {
            this.label = "m³";
         }
         this.complateBaseMessage();
       }
      },
      checkedProvince(province) {
       //console.log(province)
       this.expressTemplate.edit = false;
       province.checkd = !province.checkd;
       province.checkd ? province.type = "primary" : province.type = "";
       if(province.checkd) {
         this.loadCityData(province.adcode,null) 
       } else {
        this.removeTab(province.name)
       }
      },
      showCity(province) {
        console.log(province)
        this.expressTemplate.edit = false;
        if(province.checkd){
          this.removeTab(province.name)
        } else {
          province.checkd = !province.checkd;
          this.loadCityData(province.adcode,null);
        }
        //this.loadCityData(province.adcode);
      },
      editTemplateItem(data) {
        //console.log(this.tabValue)
        //console.log(data)
        this.restCityForm();
        this.dialog = true;
        this.cityForm.allEdit = false;
        this.cityForm.title = "城市编辑";
        this.cityForm.labelName = "城市名称:";
        this.cityForm.name = data.name;
        this.cityForm.cityCode = data.adcode;
        this.cityForm.startCount = data.startCount;
        this.cityForm.increaseCount = data.increaseCount;
        this.cityForm.innerPrice = data.innerPrice;
        this.cityForm.externalPrice = data.externalPrice;
      },
      checkAllItem(data) {

        data.districts.forEach((item)=>{
          item.checked = true;
        })

      },
      cancelAllItem(data) {
        data.districts.forEach((item)=>{
          item.checked = false;
        })

      },
      cityClick(value) {
        //console.log(this.cityData)
        //console.log(value)
        //scope.row.checked = !scope.row.checked
      },
      editAllTemplateItem(data) {
        this.restCityForm();
        this.dialog = true;
        this.cityForm.allEdit = true;
        //console.log(data);
        this.cityForm.title = "批量编辑";
        this.cityForm.labelName = "省份名称:";
        this.cityForm.name = data.name;
        this.cityForm.provinceCode = data.adcode;
        this.cityForm.startCount = this.expressTemplate.startCount;
        this.cityForm.increaseCount = this.expressTemplate.increaseCount;
        this.cityForm.innerPrice = this.expressTemplate.innerPrice;
        this.cityForm.externalPrice = this.expressTemplate.externalPrice;
      },
      restCityForm(){
          this.cityForm.startCount = 0;
          this.cityForm.increaseCount = 0;
          this.cityForm.innerPrice = 0;
          this.cityForm.externalPrice = 0;
      },
      checkCityForm(){
         if (!this.cityForm.startCount  || (+this.cityForm.startCount == 0)) {
            this.$message({message: '起始数量不能为空', type: 'warning'});
            return false;
          }
          if(this.expressTemplate.templateType == 4){
            if (!this.validate.validatPrice(this.cityForm.startCount) ) {
              this.$message({message: '起始数量最多2位小数', type: 'warning'});
              return false;
            }
          } else{
            if (!this.validate.validatNumber(this.cityForm.startCount) ) {
              this.$message({message: '起始数量不能为小数', type: 'warning'});
              return false;
            }
          }


          if (!this.cityForm.innerPrice || (+this.cityForm.innerPrice == 0)) {
            this.$message({message: '起始价格不能为空', type: 'warning'});
            return false;
          }
          if (!this.validate.validatPrice(this.cityForm.innerPrice) ) {
            this.$message({message: '起始价格最多2位小数', type: 'warning'});
            return false;
          }


          if (!this.cityForm.increaseCount || (+this.cityForm.increaseCount == 0) ) {
            this.$message({message: '追加数量不能为空', type: 'warning'});
            return false;
          }
          if(this.expressTemplate.templateType == 4){
            if (!this.validate.validatPrice(this.cityForm.increaseCount) ) {
              this.$message({message: '追加数量最多2位小数', type: 'warning'});
              return false;
            }
          } else{
            if (!this.validate.validatNumber(this.cityForm.increaseCount) ) {
              this.$message({message: '追加数量不能为小数', type: 'warning'});
              return false;
            }
          }


          if (!this.cityForm.externalPrice ) {
            this.$message({message: '追加价格不能为空', type: 'warning'});
            return false;
          }
          if (!this.validate.validatPrice(this.cityForm.externalPrice) ) {
            this.$message({message: '追加价格最多2位小数', type: 'warning'});
            return false;
          }

          return true;
      },
      editCityData(data){
         data.startCount = this.cityForm.startCount;
         data.increaseCount = this.cityForm.increaseCount;
         data.innerPrice = this.cityForm.innerPrice;
         data.externalPrice = this.cityForm.externalPrice;
         data.tableItemName = this.setTable(data.startCount, data.innerPrice, data.increaseCount, data.externalPrice);
      },
      comfirmEdit(){
        if(this.checkCityForm()){
        //console.log(this.cityData)
        this.cityData.forEach((item)=>{
          if (item.adcode == this.cityForm.provinceCode && this.cityForm.allEdit) {
            item.districts.forEach((childrenItem)=>{
              this.editCityData(childrenItem);  
            })
          } else if(item.name == this.tabValue && !this.cityForm.allEdit){
            item.districts.forEach((childrenItem)=>{
              if(childrenItem.adcode == this.cityForm.cityCode) {
                 this.editCityData(childrenItem);  
              }
            })
          }
        })
        //console.log(this.cityData);
        this.dialog = false;
        }
      },
      removeTab(targetName) {
        this.$confirm('确定移除当前城市吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          //console.log(targetName)
          let number = null;
          for( let i = 0; i < this.cityData.length; i++) {
            if(this.cityData[i].name == targetName){
              number = i;
              break ;
            }
          }
          this.provinces.forEach((item)=>{
            if(item.name == targetName){
              item.checkd = false;
            }
          })
          //console.log(number)
          //console.log(this.provinces)
          if (number != null) {
            this.cityData.splice(number,1);
            this.tabValue = this.cityData[this.cityData.length - 1].name;
          }
          
        }).catch(() => {

        });
      },
      setTable(startCount,innerPrice,increaseCount,externalPrice) {
        let returnTitle = "";
        if( this.expressTemplate.templateType == 1){
           returnTitle = "免运费"; 
        } else if (this.expressTemplate.templateType == 2) {
          returnTitle = startCount + "kg内，" + innerPrice +"元，超出后" + externalPrice + "元/" + increaseCount + "kg";
        }else if (this.expressTemplate.templateType == 3) {
          returnTitle = startCount + "件内，" + innerPrice +"元，超出后" + externalPrice + "元/" + increaseCount + "件";
        }else if (this.expressTemplate.templateType == 4) {
          returnTitle = startCount + "m³内，" + innerPrice +"元，超出后" + externalPrice + "元/" + increaseCount + "m³";
        }
        return returnTitle;
      },
      loadCityData(adcode,editData) {
        this.http.get(this).url(this.config.area.city).params({adcode:adcode}).request(function (response) {
          //console.log(response);
          let data = response.data.data;
          if (response.data.code == 0) {
              if(this.expressTemplate.edit){
                data.districts[0].districts.forEach((item)=>{
                  var editFlag = true;
                  //console.log(editData)
                  editData.forEach((childItem)=>{
                    //console.log(childItem)
                    if(item.adcode == childItem.cityCode){
                      editFlag = false;
                      if(this.expressTemplate.templateType == 4) {
                        item.startCount = childItem.startCount / 100;
                        item.increaseCount = childItem.increaseCount / 100;
                      } else {
                        item.startCount = childItem.startCount;
                        item.increaseCount = childItem.increaseCount;
                      }
                      item.innerPrice = childItem.innerPrice / 100;
                      item.externalPrice = childItem.externalPrice / 100;
                      item.useParent = false;
                      item.checked = true;
                      item.tableItemName = this.setTable(item.startCount, item.innerPrice, item.increaseCount, item.externalPrice);
                    }
                  })
                  if (editFlag) {
                    item.startCount = this.expressTemplate.startCount;
                    item.increaseCount = this.expressTemplate.increaseCount;
                    item.innerPrice = this.expressTemplate.innerPrice;
                    item.externalPrice = this.expressTemplate.externalPrice;
                    item.useParent = false;
                    item.checked = false;
                    item.tableItemName = this.setTable(item.startCount, item.innerPrice, item.increaseCount, item.externalPrice);
                  }
                })
              } else {
                data.districts[0].districts.forEach((item)=>{
                  item.startCount = this.expressTemplate.startCount;
                  item.increaseCount = this.expressTemplate.increaseCount;
                  item.innerPrice = this.expressTemplate.innerPrice;
                  item.externalPrice = this.expressTemplate.externalPrice;
                  item.useParent = false;
                  item.checked = true;
                  item.tableItemName = this.setTable(item.startCount, item.innerPrice, item.increaseCount, item.externalPrice);
                })
              }
              let flag = true;
              this.cityData.forEach( (item)=>{
                if(item.adcode == data.districts[0].adcode){
                  flag = false;
                }
              })
              if (flag) {
                this.cityData.push(data.districts[0]); 
                this.tabValue = this.cityData[this.cityData.length - 1].name; 
              }

          } else {
            this.$message.error(response.data.message);
          }
        }, (error)=> {console.log(error)}); 
      },
      loadProvinceData() {
        this.http.get(this).url(this.config.area.provinces).request(function (response) {
          //console.log(response);
          let data = response.data.data;
          if (response.data.code == 0) {
              data.districts[0].districts.forEach((item)=>{
                item.type = "";
                item.checkd = false;
                item.checkBoxDisable = true;
              })
              this.provinces = data.districts[0].districts;
          } else {
            this.$message.error(response.data.message);
          }
        }, (error)=> {console.log(error)});  
      },
      checkForm(){
        if (!this.expressTemplate.name || !this.expressTemplate.name.trim()) {
          this.$message({message: '模板名称不能为空', type: 'warning'});
          return false;
        }
        if (!this.expressTemplate.templateType) {
          this.$message({message: '请选择计费方式', type: 'warning'});
          return false;
        }
        if(this.expressTemplate.templateType != 1){

          if (!this.expressTemplate.startCount || (+this.expressTemplate.startCount == 0) ) {
            this.$message({message: '起始数量不能为空或0', type: 'warning'});
            return false;
          }
          if(this.expressTemplate.templateType == 4){
            if (!this.validate.validatPrice(this.expressTemplate.startCount) ) {
              this.$message({message: '起始数量最多2位小数', type: 'warning'});
              return false;
            }
          } else{
            if (!this.validate.validatNumber(this.expressTemplate.startCount) ) {
              this.$message({message: '起始数量不能为小数', type: 'warning'});
              return false;
            }
          }


          if (!this.expressTemplate.innerPrice || (+this.expressTemplate.innerPrice == 0) ) {
            this.$message({message: '起始价格不能为空或0', type: 'warning'});
            return false;
          }
          if (!this.validate.validatPrice(this.expressTemplate.innerPrice) ) {
            this.$message({message: '起始价格最多2位小数', type: 'warning'});
            return false;
          }


         if (!this.expressTemplate.increaseCount || (+this.expressTemplate.increaseCount == 0) ) {
            this.$message({message: '追加数量不能为空或0', type: 'warning'});
            return false;
         }
         if(this.expressTemplate.templateType == 4){
            if (!this.validate.validatPrice(this.expressTemplate.increaseCount) ) {
              this.$message({message: '追加数量最多2位小数', type: 'warning'});
              return false;
            }
          } else{
            if (!this.validate.validatNumber(this.expressTemplate.increaseCount) ) {
              this.$message({message: '追加数量不能为小数', type: 'warning'});
              return false;
            }
          }


          if (!this.expressTemplate.externalPrice) {
            this.$message({message: '追加价格不能为空', type: 'warning'});
            return false;
          }
          if (!this.validate.validatPrice(this.expressTemplate.externalPrice) ) {
            this.$message({message: '追加价格最多2位小数', type: 'warning'});
            return false;
          }


        }
        if (!this.cityData || this.cityData.length == 0) {
          this.$message({message: '配送城市不能为空', type: 'warning'});
          return false;
        }

        for(var i = 0; i < this.cityData.length; i++){
          var choiceFlag = false;
          for(var j = 0; j < this.cityData[i].districts.length; j++){
            
            if(this.cityData[i].districts[j].checked){
              choiceFlag = true;
            }
          }
          if(!choiceFlag){
            this.$message({message: '配送城市下必须有一个被选中', type: 'warning'});
            return false;
          }
        }
      
        return true;
      },
      save() {
        if(this.checkForm()){
          let params = {};
          let cities = [];
          params.name = this.expressTemplate.name;
          params.expressMethod = this.expressTemplate.expressMethod;
          params.templateType = this.expressTemplate.templateType;
          if (params.templateType == 4) {
            params.startCount = parseInt(this.expressTemplate.startCount * 100);
            params.increaseCount = parseInt(this.expressTemplate.increaseCount * 100);
          } else {
            params.startCount = parseInt(this.expressTemplate.startCount);
            params.increaseCount = parseInt(this.expressTemplate.increaseCount);
          }
          params.innerPrice = this.expressTemplate.innerPrice * 100;
          params.externalPrice = this.expressTemplate.externalPrice * 100;
          params.templateId = this.expressTemplate.templateId;
          
          this.cityData.forEach((item)=>{
            item.districts.forEach((childItem)=>{
              if (childItem.checked) {
                var obj = {};
                obj.provinceName = item.name;
                obj.provinceCode = item.adcode;
                obj.cityName = childItem.name;
                obj.cityCode = childItem.adcode;
                if (params.templateType == 4) {
                  obj.startCount = parseInt(childItem.startCount * 100);
                  obj.increaseCount = parseInt(childItem.increaseCount * 100);
                } else {
                  obj.startCount = parseInt(childItem.startCount);
                  obj.increaseCount = parseInt(childItem.increaseCount);
                }
                
                obj.innerPrice = childItem.innerPrice * 100;
                obj.externalPrice = childItem.externalPrice * 100;
                obj.useParent = childItem.useParent;
                obj.templateId = this.expressTemplate.templateId;
                cities.push(obj);
              }
            })
          })
          params.cities = cities;
          if(this.expressTemplate.templateId){
            this.http.get(this).url(this.config.expressTemplate.express_template_check).restful({templateId:this.expressTemplate.templateId}).request(
              (response) => {
                if (response.data.code != 0) {
                  this.$message({message: response.data.message, type: 'error'});
                  return;
                }
                if(response.data.data){
                  this.$confirm('改运费模板在商品存在引用是否继续?', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    confirmButtonClass: "el-button--danger"
                  }).then(() => {
                    this.saveExpressTemplate(params);
                  }).catch(() => {});
                }else{
                  this.saveExpressTemplate(params);
                }
              },
              (error) => {console.log(error)}
            );
          }else{
            this.saveExpressTemplate(params);
          }
        }
      },
      saveExpressTemplate(params){
        this.http.postJson(this).url(this.config.goodsExpressTemplate.list_url).params(params).request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '保存成功!'});
              this.reset();
              this.$emit('success');
            },
            (error) => {
            }
          );
      },
      reset(){
        this.expressTemplate.name = "";
        this.expressTemplate.templateType = "";
        this.expressTemplate.startCount = '';
        this.expressTemplate.increaseCount = '';
        this.expressTemplate.innerPrice = '';
        this.expressTemplate.externalPrice = '';
        this.expressTemplate.templateId = null;
        this.expressTemplate.edit = false;
        this.complateBase = false;
        this.expressDisable= false;
        this.cityData = [];
        this.provinces.forEach((item)=>{
          item.checkd = false;
          item.checkBoxDisable = true;
        })

      },
      loadSource(data) {
        console.log(data)
        this.expressTemplate.templateId = data.templateId;
        this.expressTemplate.name = data.name;
        this.expressTemplate.expressMethod = data.expressMethod;
        this.expressTemplate.templateType = data.templateType;
        this.expressTemplate.edit = true;
        if(data.templateType == 4) {
          this.expressTemplate.startCount = data.startCount / 100;
          this.expressTemplate.increaseCount = data.increaseCount / 100;
        } else{
          this.expressTemplate.startCount = data.startCount;
          this.expressTemplate.increaseCount = data.increaseCount;
        }
        this.expressTemplate.innerPrice = data.innerPrice / 100;
        this.expressTemplate.externalPrice = data.externalPrice / 100;
        if (data.templateType == 2) {
          this.label = "Kg";
         } else if (data.templateType == 3) {
           this.label = "件";  
         } else if (data.templateType == 4) {
            this.label = "m³";
        }
        this.complateBase = true;
        this.expressDisable= true;
        this.cityData = [];
        let cityArray = [];
        let n = 0;
        if(data.cities.length == 1){
          var arrry = [];
          arrry.push(data.cities[0]);
          cityArray.push(arrry);
        } else {
          for (var i = 0; i < data.cities.length-1; i++) {
            //console.log(data.cities[i].provinceCode)
              if (data.cities[i].provinceCode != data.cities[i + 1].provinceCode) {
                  cityArray.push(data.cities.slice(n, i + 1))
                  n = i + 1;
              }
          }
         cityArray.push(data.cities.slice(n))
       }
       console.log(cityArray)
       //console.log(cityArray[0][0])
       this.provinces.forEach((item)=>{
        item.checkBoxDisable = false;
         for(var i = 0; i < cityArray.length; i++){
          if(item.adcode == cityArray[i][0].provinceCode){
            item.checkd = true;
            this.loadCityData(item.adcode,cityArray[i]);
          }
         }
       });
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  #saveExpress_vue{
    .sub-navbar{
      z-index:100 !important;
    }
    button.is-disabled{
        color:#333;
    }
    .el-select{
      .is-disabled{
        input{
          color: #333;
        }
      }
    }
    #moneySelect{
      .el-input{
        width: 145px;
      }
    }
    .bascTemplate{
      .el-form-item{
        float:left;
        margin-right:30px;
        .el-form-item__label{
          text-align:left;
        }
        .el-input{
          display: inline-block;
          width: 120px;
        }
      }
    }
    .provincelayout{
      overflow: hidden;
      >div{
        float:left;
        margin-right:20px;
        margin-bottom:20px;
        position:relative;
        >.el-checkbox{
          position:absolute;
          top:9px;
          left:3px;
        }
        >button{
          padding-top: 10px;
          padding-bottom: 10px;
          padding-right: 15px;
          padding-left: 15px;
        }
       
      }
    }
  }
</style>