<template>
  <div class="app-container calendar-list-container" id="houseType_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.houseName" style="width: 200px !important;" class="filter-item" placeholder="楼盘名称">
          </el-input>

          <el-select @change="citySearch" clearable style="width: 120px" class="filter-item" v-model="listQuery.provinceCode" placeholder="省份">
            <el-option
              v-for="item in provinces"
              :key="item.adcode"
              :label="item.name"
              :value="item.adcode">
            </el-option>
          </el-select>

          <el-select @change="areaSearch" clearable style="width: 120px" class="filter-item" v-model="listQuery.cityCode" placeholder="地级市">
            <el-option
              v-for="item in citys"
              :key="item.adcode"
              :label="item.name"
              :value="item.adcode">
            </el-option>
          </el-select>

          <el-select @change="doSearch" clearable style="width: 120px" class="filter-item" v-model="listQuery.countyCode" placeholder="区/县">
            <el-option
              v-for="item in areas"
              :key="item.adcode"
              :label="item.name"
              :value="item.adcode">
            </el-option>
          </el-select>

          <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          <el-button @click="addHouse" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="plus">新增</el-button>

          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list" style="margin-top:15px;">
        <el-table
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          :data="dataList"
          border
          style="width: 100%;">

          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="楼盘名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.houseName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="所在地区">
            <template scope="scope">
              <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.county}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="详细地址">
            <template scope="scope">
              <span>{{scope.row.address}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="户型数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.houseTypeCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="方案数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.planCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="220">
            <template scope="scope">
             <el-button size="small" class="fontFamily icon-browse button_detail" type="primary" @click="seeDetail(scope.row)">
             <!-- <icon-svg icon-class="icon_eyes"></icon-svg> -->
             查看详情</el-button>
             <el-button icon="delete" size="small" type="danger" @click="deleteHouse(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
          @current-change="handleCurrentChange"
                         :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
          </el-pagination>
        </div>
      </div>

        <el-dialog  title="楼盘详情"  :visible.sync="house.dialogVisible">
          <div class="house_detail">
           <el-row :gutter="24">
              <el-col :span="12">
                <span>楼盘名称:</span>
                <el-input type="text" v-model="house.houseName" style="width:70%;" placeholder="请输入楼盘名称" maxlength="15"> </el-input>
              </el-col>

              <el-col :span="12">
                <span>楼盘地区:</span>

                 <el-select @change="houseCityChange" clearable style="width: 100px" class="filter-item" v-model="house.provinceCode" placeholder="省份">
                  <el-option
                    v-for="item in house.provinces"
                    :key="item.adcode"
                    :label="item.name"
                    :value="item.adcode">
                  </el-option>
                </el-select>

                <el-select @change="houseAreaChange" clearable style="width: 100px" class="filter-item" v-model="house.cityCode" placeholder="地级市">
                  <el-option
                    v-for="item in house.citys"
                    :key="item.adcode"
                    :label="item.name"
                    :value="item.adcode">
                  </el-option>
                </el-select>

                <el-select  clearable style="width: 100px" class="filter-item" v-model="house.countyCode" placeholder="区/县">
                  <el-option 
                    v-for="item in house.areas" 
                    :key="item.adcode" 
                    :label="item.name" 
                    :value="item.adcode">
                  </el-option>
                </el-select>
              </el-col>

              <el-col :span="12">
                <span>开发商:</span>
                <el-input type="text" v-model="house.developers" style="width:70%;" placeholder="请输入楼盘开发商" maxlength="50"> </el-input>
              </el-col>

              <el-col :span="12">
                <span>物业商:</span>
                <el-input type="text" v-model="house.management" style="width:70%;" placeholder="请输入楼盘物业商" maxlength="50"> </el-input>
              </el-col>
              
              <el-col :span="24">
                <span>楼盘地址:</span>
                <el-input type="text" v-model="house.address" style="width:80%;" placeholder="请输入楼盘地址" maxlength="100"> </el-input>
              </el-col>

              <el-col :span="24" style='margin-bottom:0;'>
                <span>楼盘封面:</span><b style="color:#FF4949;">建议尺寸640*480</b>
                <uploadImage style='margin-top:10px;padding-left:88px;'  :id="'houseCover'" :width="160" :height="120" ref="houseUpload" @uploadSuccess="uploadSuccess"></uploadImage>
              </el-col>

            </el-row>
            <el-row :gutter="24">
              <p style="text-align:center;"><el-button @click="addHouseType" class="filter-item" type="primary" icon="plus">新增户型</el-button></p>
              <el-tabs v-model="tabValue" type="card" closable  @tab-remove="removeTab">
               <el-tab-pane v-for="(item, index) in house.houseTypes" :key="item.typeCode" :label="item.typeCode" :name="item.typeCode">
                  <el-row :gutter="24">

                    <el-col :span="12">
                      <span>户型名称:</span>
                      <!-- <el-input type="text" @change="typeNameChange" v-model="item.typeName" style="width:70%;" placeholder="请输入户型名称" maxlength="15"> </el-input> -->
                      <el-input type="text" v-model="item.typeName" style="width:70%;" placeholder="请输入户型名称" maxlength="15"> </el-input>
                      <!-- <b style="color:#f75151;">{{item.typeName}}</b> -->
                    </el-col>

                    <el-col :span="12">
                      <span>户型编码:</span>
                      <el-input type="text" v-model="item.typeCode" :disabled="true" style="width:70%;" placeholder="请输入户型编码" maxlength="3"> </el-input>
                      <!-- <b style="color:#f75151;">{{item.typeCode}}</b> -->
                    </el-col>

                    <el-col :span="12">
                      <span>建筑面积(㎡):</span>
                      <el-input type="number" v-model="item.buildArea" style="width:70%;" placeholder="请输入建筑面积" maxlength="10000"> </el-input>
                    </el-col>

                    <el-col :span="12">
                      <span>实际面积(㎡):</span>
                      <el-input type="number" v-model="item.realityArea" style="width:70%;" placeholder="请输入实际面积" maxlength="10000"> </el-input>
                    </el-col>


                    <el-col :span="12">
                      <span>户型类型:</span>

                      <el-select clearable class="filter-item" v-model="item.houseType" placeholder="户型类型:">
                        <el-option
                          v-for="houseTypeItem in planHouseTypeData"
                          :key="houseTypeItem.value"
                          :label="houseTypeItem.name"
                          :value="houseTypeItem.value">
                        </el-option>
                      </el-select>

                    </el-col>

                  </el-row>
               </el-tab-pane>
              </el-tabs>

            </el-row>

          </div>

          <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="house.dialogVisible = false">关 闭</el-button>
            <el-button type="primary" @click="comfirmAddHouse">保 存</el-button>
            
          </div>

        </el-dialog>
        

        <el-dialog  title="新增户型"  :visible.sync="addHouseTypeDialog">
          <el-row :gutter="24">
            <el-col :span="24">
              <span style="font-weight:700;color:#343434;">户型编码:</span>
              <el-input type="text" v-model="houseTypeName" style="width:50%;" placeholder="请输入户型编码(3个字符以内)" maxlength="3"> </el-input>
            </el-col> 
          </el-row>

          <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="addHouseTypeDialog = false">取 消</el-button>
            <el-button type="primary" @click="comfirmAddHouseType">确 定</el-button>
          </div>

        </el-dialog>

  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import uploadImage from '@/components/Upload/index'
  export default{
    components:{
      uploadImage:uploadImage
    },
    data() {
      return {
        addHouseTypeDialog:false,
        houseTypeName:'',
        seeDetailtype:true, // 是否查看详情
        tabValue:'',
        provinces:[],
        citys:[],
        areas:[],
        dataList:[],
        planHouseTypeData:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          houseName:'',
          provinceCode:'',
          cityCode:'',
          countyCode:''
        },
        house:{
          houseId:null,
          dialogVisible:false,
          houseName:"",
          province:'',
          provinceCode:'',
          city:'',
          cityCode:'',
          county:'',
          countyCode:'',
          address:'',
          developers:"",
          management:'',
          houseTypes:[],
          provinces:[],
          citys:[],
          areas:[],
        },
      }
    },
    mounted() {
      this.findByPage();
      this.findByProvince();
      this.findPlanHouseType();
    },
    methods:{
      uploadSuccess(data) {
        this.house.cover = data.cover;
      },
      reset() {
        this.house = {
          cover:'',
          houseId:null,
          dialogVisible:false,
          houseName:"",
          province:'',
          provinceCode:'',
          city:'',
          cityCode:'',
          county:'',
          countyCode:'',
          address:'',
          developers:"",
          management:'',
          houseTypes:[],
          provinces:[],
          citys:[],
          areas:[],
        };
      },
      checkFrom() {

        if(!this.house.houseName || !this.house.houseName.trim()){
          this.$message({type: 'warning', message: '楼盘名称不能为空' });
          return false;
        }

        if(!this.house.provinceCode){
          this.$message({type: 'warning', message: '请选择省份' });
          return false;
        }

        if(!this.house.cityCode){
          this.$message({type: 'warning', message: '请选择地级市' });
          return false;
        }

        if(!this.house.countyCode){
          this.$message({type: 'warning', message: '请选择区/县' });
          return false;
        }

        if(!this.house.developers || !this.house.developers.trim()){
          this.$message({type: 'warning', message: '开发商不能为空' });
          return false;
        }

        if(!this.house.management || !this.house.management.trim()){
          this.$message({type: 'warning', message: '物业商不能为空' });
          return false;
        }

        if(!this.house.address || !this.house.address.trim()){
          this.$message({type: 'warning', message: '楼盘地址不能为空' });
          return false;
        }

        if(!this.house.cover){
          this.$message({type: 'warning', message: '请上传楼盘封面' });
          return false;
        }


        if(!this.house.houseTypes.length){
          this.$message({type: 'warning', message: '楼盘户型至少添加1个' });
          return false;
        }

        for (var i = 0; i < this.house.houseTypes.length; i++) {
          let data  = this.house.houseTypes[i];
          if (!data.typeName || !data.typeName.trim()) {
            this.$message({type: 'warning', message:'户型编码"' + data.typeCode + '"名称不能为空' });
            return false;
          }

          if (!data.typeCode || !data.typeCode.trim()) {
            this.$message({type: 'warning', message:'户型编码"' + data.typeCode + '"编码不能为空' });
            return false;
          }

          if (!data.buildArea) {
            this.$message({type: 'warning', message:'户型编码"' + data.typeCode + '"建筑面积不能为空' });
            return false;
          }

          if (!this.validate.validatPrice(data.buildArea)) {
            this.$message({type: 'warning', message:'户型编码"' + data.typeCode + '"建筑面积只能为整数或者2位小数' });
            return false;
          }

          if (!data.realityArea) {
            this.$message({type: 'warning', message:'户型编码"' + data.typeCode + '"实际面积不能为空' });
            return false;
          }

          if (!this.validate.validatPrice(data.realityArea)) {
            this.$message({type: 'warning', message:'户型编码"' + data.typeCode + '"实际面积只能为整数或者2位小数' });
            return false;
          }

          if (!data.houseType) {
            this.$message({type: 'warning', message:'请选择户型编码"' + data.typeCode + '"的户型类型' });
            return false;
          }

        }

        return true;

      },
      addHouse() {
        this.reset();
        this.seeDetailtype = false;
        this.house.dialogVisible = true;
        this.house.provinces = this.provinces;
        setTimeout(()=>{
          this.$refs.houseUpload.initUploadBtn(this.house.cover);  
        },50)
      },
      comfirmAddHouse() {
        if(this.checkFrom()){
          let params = {};
          params.houseId = this.house.houseId;
          params.houseName = this.house.houseName;
          params.provinceCode = this.house.provinceCode;
          this.house.provinces.forEach((item)=>{
            if(item.adcode == this.house.provinceCode){
              params.province = item.name;
            }
          });
          params.cityCode = this.house.cityCode;
          this.house.citys.forEach((item)=>{
            if(item.adcode == this.house.cityCode){
              params.city = item.name;

            }
          });
          params.countyCode = this.house.countyCode;
          this.house.areas.forEach((item)=>{
            if(item.adcode == this.house.countyCode){
              params.county = item.name;
            }
          });

          params.address = this.house.address;
          params.cover = this.house.cover;
          params.developers = this.house.developers;
          params.management = this.house.management;
          params.houseTypes = this.house.houseTypes;

          console.log(params)

          this.http.postJson(this).url(this.config.softWear.house_list).params(params).request( (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '楼盘保存成功!'});
              this.findByPage();
              this.house.dialogVisible = false;
            },
            (error) => {
            }
          );

        }
      },
      comfirmAddHouseType() {
        if(!this.houseTypeName || !this.houseTypeName.trim()){
          this.$message({ type: 'warning',message: '户型编码不能为空'});
          return false;
        }
        let value = this.houseTypeName;
        let existsCount = 0;
        this.house.houseTypes.forEach((tab, index) => {
          if (tab.typeCode == value) {
            existsCount += 1;
          }
        });

        if (existsCount > 0) {
          this.$message({ type: 'warning', message: '户型编码不能重复'});
          return ;
        } else {
          let obj = {};
          obj.typeId = null;
          obj.typeName = '';
          obj.typeCode = value;
          obj.buildArea = '';
          obj.realityArea = '';
          obj.houseType = '';
          this.house.houseTypes.push(obj);
          this.tabValue = value;
          this.addHouseTypeDialog = false;
        }

      },
      addHouseType() {
        this.addHouseTypeDialog = true;
        this.houseTypeName = '';
       
        // this.$prompt('请输入户型编码(2个字符以内)', '新增户型', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        // }).then(({value}) => {
        //   if (value != null && value.trim()) {
        //     if(value.length > 2){
        //       this.$message({type: 'warning', message: '户型编码最多2个字符' });
        //       return ;
        //     }

        //     let existsCount = 0;
        //     this.house.houseTypes.forEach((tab, index) => {
        //       if (tab.typeCode == value) {
        //         existsCount += 1;
        //       }
        //     });

        //     if (existsCount > 0) {
        //       this.$message({ type: 'warning', message: '户型编码不能重复'});
        //       return ;
        //     } else {
        //       let obj = {};
        //       obj.typeId = null;
        //       obj.typeName = '';
        //       obj.typeCode = value;
        //       obj.buildArea = '';
        //       obj.realityArea = '';
        //       this.house.houseTypes.push(obj);
        //       this.tabValue = value;
        //     }

        //   } else {
        //     this.$message({ type: 'warning',message: '户型编码不能为空'});
        //   }
        // }).catch(() => { });
      },
      removeTab(val) {
        let houseTypeItem = {};
        let number = null;
        for(var i = 0; i < this.house.houseTypes.length; i++){
          if(this.house.houseTypes[i].typeCode == val){
            number = i;
            houseTypeItem = this.house.houseTypes[i];
          }
        }
        if(number != null){
          if (houseTypeItem.typeId) {
            this.comfirmRemoveTab(houseTypeItem,number)
          } else{
            this.house.houseTypes.splice(number,1);
            this.tabValue = this.house.houseTypes[0].typeCode;
          }
        }
      },
      comfirmRemoveTab(houseData,number){
        this.http.get(this).url(this.config.softWear.can_delete).restful({houseTypeId:houseData.typeId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            if (response.data.data) {
              this.house.houseTypes.splice(number,1);
              this.tabValue = this.house.houseTypes[0].typeCode;
            } else {
              this.$message({message:"该户型关联有软装方案，不能移除", type: 'warning'});
            }

          },(error) => {console.log(error)}
        );
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.findByPage();
      },
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },
      citySearch() {
        this.listQuery.pageIndex = 1;
        this.citys = [];
        this.listQuery.cityCode = '';
        this.areas = [];
        this.listQuery.countyCode = '';
        if (this.listQuery.provinceCode) {
          this.loadCity(this.listQuery.provinceCode,0);
        }
        this.findByPage();
      },
      houseCityChange() {
        if(!this.seeDetailtype){
          this.house.citys = [];
          this.house.cityCode = '';
          this.house.areas = [];
          this.house.countyCode = '';
        }
        if (this.house.provinceCode && !this.seeDetailtype) {
          this.loadCity(this.house.provinceCode,1);
        }
      },
      areaSearch() {
        this.areas = [];
        this.listQuery.countyCode = '';
        if(this.listQuery.cityCode){
          this.loadArea(this.listQuery.cityCode,0);
        }
        this.findByPage();
      },
      houseAreaChange() {
        if(!this.seeDetailtype){
          this.house.areas = [];
          this.house.countyCode = '';
        }
        if(this.house.cityCode && !this.seeDetailtype){
          this.loadArea(this.house.cityCode,1);
        }
      },
      findByProvince() {
        this.http.get(this).url(this.config.area.provinces).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            this.provinces = response.data.data.districts[0].districts;
            this.house.provinces = response.data.data.districts[0].districts;

          },(error) => {console.log(error)}
        );
      },
      loadCity(code,type) {
        this.http.get(this).url(this.config.area.city).params({adcode:code}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            if(type == 0){
              this.citys = response.data.data.districts[0].districts;
            } else if (type == 1) {
              this.house.citys = response.data.data.districts[0].districts;
            }

          },(error) => {console.log(error)}
        );
      },
      loadArea(code,type) {
        this.http.get(this).url(this.config.area.city).params({adcode:code}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            if(type == 0){
              this.areas = response.data.data.districts[0].districts;
            } else if (type == 1) {
              this.house.areas = response.data.data.districts[0].districts;
            }

          },(error) => {console.log(error)}
        );
      },
      findByPage() {
        this.listQuery.loading = true;

        this.http.get(this).url(this.config.softWear.house_list).params(this.listQuery).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.dataList = data;
            this.listQuery.total = response.data.data.totalSize;
            this.listQuery.loading = false;
          },(error) => {console.log(error)}
        );
      },
      findPlanHouseType() {
        let params = {};
        params.type = 1;
        this.http.get(this).url(this.config.softWear.plan_type).restful(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.planHouseTypeData = response.data.data;
          },(error) => {console.log(error)}
        );
      },
      seeDetail(data){
        this.seeDetailtype = true;
        this.reset();

        this.http.get(this).url(this.config.softWear.house_list).params(this.listQuery).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            var  houseData = response.data.data.data;
            houseData.forEach((item)=>{
              if(item.houseId == data.houseId){
                this.house.houseId = item.houseId;
                this.house.houseName = item.houseName;

                this.house.province = item.province;
                this.house.provinceCode = item.provinceCode;
                this.house.city = item.city;
                this.house.cityCode = item.cityCode;
                this.house.county = item.county;
                this.house.countyCode = item.countyCode;
                
                this.house.address = item.address;
                this.house.cover = item.cover;
                this.house.developers = item.developers;
                this.house.management = item.management;
                this.house.houseTypes = item.houseTypes;
                this.house.provinces = this.provinces;
                setTimeout(()=>{
                  this.$refs.houseUpload.initUploadBtn(item.cover);  
                },50)
                item.houseTypes.forEach((houseTypeItme)=>{
                  houseTypeItme.houseType =  houseTypeItme.houseType + "";
                })
                
                this.detailCityLoad(item.provinceCode,item.cityCode);

                this.tabValue = item.houseTypes[0].typeCode;
              }
            })

          },(error) => {console.log(error)}
        );
      },
      detailCityLoad(provinceCode,cityCode){
        this.http.get(this).url(this.config.area.city).params({adcode:provinceCode}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            this.house.citys = response.data.data.districts[0].districts;
            this.detailAreaLoad(cityCode);

          },(error) => {console.log(error)}
        );
      },
      detailAreaLoad(code) {
        this.http.get(this).url(this.config.area.city).params({adcode:code}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
           
            this.house.areas = response.data.data.districts[0].districts;
            this.house.dialogVisible = true;
            this.seeDetailtype = false;

          },(error) => {console.log(error)}
        );
      },
      deleteHouse(house) {
        this.$confirm('是否要删除楼盘"' + house.houseName + '"，删除后将不能恢复，是否确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.softWear.house_delete).restful({houseId:house.houseId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => { });
        }).catch(() => {
        });
      }
    }
  }
</script>

<style  lang="scss">
  #houseType_vue{
    .button_detail{
      svg{
        width:16px;
        height:16px;
        margin-right: 5px;
      }
    }
    .house_detail{
      .el-col{
        margin-bottom: 20px;
        span{
          width:90px;
          text-align: right;
          font-weight:700;
          display: inline-block;
        }
      }
    }
  }
</style>
