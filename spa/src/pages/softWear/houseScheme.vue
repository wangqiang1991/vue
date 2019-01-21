<template>
  <div class="app-container calendar-list-container" id="houseScheme_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.planName" style="width: 200px !important;" class="filter-item" placeholder="方案名称">
          </el-input>

          <el-select @change="doSearch" clearable style="width: 120px" class="filter-item" v-model="listQuery.styleId" placeholder="风格">
            <el-option
              v-for="item in styleData"
              :key="item.styleId"
              :label="item.name"
              :value="item.styleId">
            </el-option>
          </el-select>

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
          <el-button @click="addPlan" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="plus">新增</el-button>

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
            label="方案封面"
            align="center">
            <template scope="scope">
              <img :src="scope.row.cover" style="width:auto;height:50px;margin-top:5px;">
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="方案名称">
            <template scope="scope">
              <span>{{scope.row.planName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="方案风格">
            <template scope="scope">
              <span>{{scope.row.style.name}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="方案适用户型"
            align="center">
            <template scope="scope">
              <p style="margin-top:5px;margin-bottom:5px;" v-for="plan in scope.row.houseTypePlanRelations">
                <span>{{plan.house.houseName}} / </span><span>{{plan.houseType.typeName}}</span>
              </p>
            </template>
          </el-table-column>

          <el-table-column
            label="商品数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsCount}}件</span>
            </template>
          </el-table-column>

        <!--   <el-table-column
            label="方案说明"
            align="center">
            <template scope="scope">
              <span>{{scope.row.designExplain}}</span>
            </template>
          </el-table-column> -->

          <el-table-column
            label="操作"
            align="center"
            width="320">
            <template scope="scope">
             <el-button size="small" class="fontFamily icon-browse button_detail" type="primary" @click="loadPlanDetail(scope.row)">
             <!-- <icon-svg icon-class="icon_eyes"></icon-svg> -->
             查看详情</el-button>
             <el-button icon="delete" size="small" type="danger" @click="deletePlan(scope.row)">删除</el-button>
             <el-button class="fontFamily"  type="info" size="small" @click='copyGoodsUrl(scope.row,$event)'> 复制链接 </el-button>
            </template>
          </el-table-column>

        </el-table>
        <div  class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize"
                         :current-page="listQuery.pageIndex"
                         layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
          </el-pagination>
        </div>
      </div>

        <el-dialog  title="软装方案"  :visible.sync="planDialogVisible">
          <div class="plan_detail">
              <el-row :gutter="24">
                <el-col :span="12">
                  <span>方案名称:</span>
                  <el-input type="text" v-model="plan.planName" style="width:70%;" placeholder="请输入方案名称" maxlength="15"> </el-input>
                </el-col>

                <el-col :span="12">
                  <span>方案风格:</span>

                  <el-select clearable class="filter-item" v-model="plan.styleId" placeholder="方案风格:">
                    <el-option
                      v-for="item in styleData"
                      :key="item.styleId"
                      :label="item.name"
                      :value="item.styleId">
                    </el-option>
                  </el-select>

                </el-col>


                 <el-col :span="12">
                  <span>价格区间:</span>

                  <el-select clearable class="filter-item" v-model="plan.priceRange" placeholder="价格区间:">
                    <el-option
                      v-for="item in planPriceData"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>

                </el-col>


                <el-col :span="12">
                  <span>方案适用户型:</span>
                  <el-tag
                    v-for="tag in plan.houseTypePlanRelations"
                    :key="tag.typeId"
                    :closable="true"
                    type="primary"
                    @close="handleClose(tag)"
                  >
                  {{tag.houseName + " / " + tag.typeCode}}
                  </el-tag>

                  <el-button style="margin-top:5px;" class="button_add" size="small" @click="addHouseType" icon="plus">选择</el-button>

                </el-col>
                

                <el-col :span="24">
                  <span style="float:left;margin-right:4px;">方案说明:</span>
                  <el-input type="textarea" :rows="5" v-model="plan.designExplain" style="width:70%;" placeholder="请输入方案说明" maxlength="500"> </el-input>
                </el-col>



              </el-row>

             <el-row :gutter="24">
              <el-col :span="24" style="overflow:hidden;">
                <span style="float:left;margin-right:4px">方案首页图:</span>
                <div style="float:left;width:70%;padding:10px; border:1px solid #bfcbd9;">
                    <div style="width:50%;float:left;padding:5px;">
                      <p style="text-align:center;">封面图 <span style="color:#f75151;width:auto;">尺寸为1024*611</span> </p>
                      <div v-show="plan.cover" class="el-upload el-upload--picture-card" style="display:block;margin:auto;">
                        <img id="uploadCover" title="点击修改图片" style="width:100%; height:100%" :src="plan.cover">
                      </div>

                      <div v-show="!plan.cover" >
                        <div class="el-upload el-upload--picture-card" id="uploadCoverBtn" style="display:block;margin:auto;">
                          <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                        </div>
                      </div>

                    </div>
                    
                    <div style="width:50%;float:left;padding:5px;">
                      <p style="text-align:center;">户型图</p>
                      <div v-show="plan.houseTypeImage" class="el-upload el-upload--picture-card" style="display:block;margin:auto;">
                        <img id="uploadCover1" title="点击修改图片" style="width:100%; height:100%" :src="plan.houseTypeImage">
                      </div>

                      <div v-show="!plan.houseTypeImage" >
                        <div class="el-upload el-upload--picture-card" id="uploadCoverBtn1" style="display:block;margin:auto;">
                          <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                        </div>
                      </div>

                    </div>

                    <div style="width:50%;float:left;padding:5px;">
                      <p style="text-align:center;">色彩关系图</p>
                      <div v-show="plan.colorRelationImage" class="el-upload el-upload--picture-card" style="display:block;margin:auto;">
                        <img id="uploadCover2" title="点击修改图片" style="width:100%; height:100%" :src="plan.colorRelationImage">
                      </div>

                      <div v-show="!plan.colorRelationImage" >
                        <div class="el-upload el-upload--picture-card" id="uploadCoverBtn2" style="display:block;margin:auto;">
                          <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                        </div>
                      </div>

                    </div>

                    <div style="width:50%;float:left;padding:5px;">
                      <p style="text-align:center;">材料搭配图</p>
                      <div v-show="plan.materialImage" class="el-upload el-upload--picture-card" style="display:block;margin:auto;">
                        <img id="uploadCover3" title="点击修改图片" style="width:100%; height:100%" :src="plan.materialImage">
                      </div>

                      <div v-show="!plan.materialImage" >
                        <div class="el-upload el-upload--picture-card" id="uploadCoverBtn3" style="display:block;margin:auto;">
                          <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                        </div>
                      </div>

                    </div>

                    <div style="width:100%;float:left;padding:5px;">
                      <p style="text-align:center;">方案原件(只能上传PDF格式)</p>

                      <div style="text-align:center;margin-bottom:10px;">
                        <el-button class="button_add" icon="upload2" size="small" type="info" id="uploadCoverBtn0">上传原件</el-button>
                      </div>

                      <el-progress v-show="uploading"  :text-inside="true" :stroke-width="18" :percentage="percentage" :status="(percentage >=100) ? 'success' : '' "></el-progress>

                      <div style="text-align:center;">
                        <a v-show="plan.original && !uploading" :href="plan.original" target="_blank"><span class="link-type">点我查看原件</span></a>
                      </div>

                    </div>

                </div>
              </el-col>

            </el-row>  
<!-- 
              <p style="text-align:center;"><el-button @click="addPlanImage" class="filter-item" type="primary" icon="plus">方案图</el-button></p>
              
              <el-table
              :data="imageArray"
              border
              style="width: 100%;">

                <el-table-column
                  label="封面"
                  align="center">
                  <template scope="scope">
                    <span style="color:#f75151;text-align:center;" v-if="!scope.row.cover">无</span>
                    <img :src="scope.row.cover" v-else style="width:auto;height:50px;margin-top:5px;">
                  </template>
                </el-table-column>

                <el-table-column
                  label="户型图"
                  align="center">
                  <template scope="scope">
                  <span style="color:#f75151;text-align:center;" v-if="!scope.row.houseTypeImage">无</span>
                    <img :src="scope.row.houseTypeImage" v-else  style="width:auto;height:50px;margin-top:5px;">
                  </template>
                </el-table-column>

                <el-table-column
                  label="色彩关系图"
                  align="center">
                  <template scope="scope">
                   <span style="color:#f75151;text-align:center;" v-if="!scope.row.colorRelationImage">无</span>
                    <img :src="scope.row.colorRelationImage" v-else  style="width:auto;height:50px;margin-top:5px;">
                  </template>
                </el-table-column>

                <el-table-column
                  label="材料搭配图"
                  align="center">
                  <template scope="scope">
                  <span style="color:#f75151;text-align:center;" v-if="!scope.row.materialImage">无</span>
                    <img :src="scope.row.materialImage" v-else  style="width:auto;height:50px;margin-top:5px;">
                  </template>
                </el-table-column>

              </el-table> -->

              <p style="text-align:center;"><el-button @click="addDetails" class="filter-item" type="primary" icon="plus">新增细节</el-button></p>
                <el-tabs v-model="tabValue" type="card" closable  @tab-remove="removeTab">
                 <el-tab-pane v-for="(item, index) in plan.details" :key="item.detailName" :label="item.detailName" :name="item.detailName">
                    <el-row :gutter="24">
                      
                      <el-col :span="24">
                        <span style="width:70px;">细节名称:</span>
                        <b style="color:#f75151;">{{item.detailName}}</b>
                      </el-col>

                      <el-col :span="24">
                        <p style="margin-top:0;"> 
                          <span style="width:70px;">细节图:</span>
                          <el-button @click="editDetail(item,index)" icon="edit" class="button_add" style="margin-left:5px;" type="primary" size="small">修改细节</el-button>
                        </p>

                        <el-table
                          :data="item.imageArray"
                          border
                          style="width: 100%;">

                            <el-table-column
                              label="平面布置图"
                              align="center">
                              <template scope="scope">
                                <span style="color:#f75151;text-align:center;" v-if="!scope.row.planImage">无</span>
                                <img :src="scope.row.planImage" v-else style="width:auto;height:50px;margin-top:5px;">
                              </template>
                            </el-table-column>

                            <el-table-column
                              label="效果示意图"
                              align="center">
                              <template scope="scope">
                              <span style="color:#f75151;text-align:center;" v-if="!scope.row.effectImage">无</span>
                                <img :src="scope.row.effectImage" v-else  style="width:auto;height:50px;margin-top:5px;">
                              </template>
                            </el-table-column>

                            <el-table-column
                              label="色彩关系图"
                              align="center">
                              <template scope="scope">
                               <span style="color:#f75151;text-align:center;" v-if="!scope.row.colorRelationImage">无</span>
                                <img :src="scope.row.colorRelationImage" v-else  style="width:auto;height:50px;margin-top:5px;">
                              </template>
                            </el-table-column>

                            <el-table-column
                              label="软装搭配详案图"
                              align="center">
                              <template scope="scope">
                              <span style="color:#f75151;text-align:center;" v-if="!scope.row.matchImage">无</span>
                                <img :src="scope.row.matchImage" v-else  style="width:auto;height:50px;margin-top:5px;">
                              </template>
                            </el-table-column>

                          </el-table>

                      </el-col>

                       <el-col :span="24" style="margin-bottom:0;">
                        <h3 style="float:left;margin-top:0;">商品列表:</h3>
                        <p style="float:right;margin-top:0;">
                          <el-button @click="addGoods(index)" class="button_add" size="small" type="primary" icon="plus">新增商品</el-button>
                          <el-button @click="deleteGoods(index)" icon="delete" class="button_add" size="small" type="danger">删除所选</el-button>
                        </p>

                      </el-col>

                       <el-table
                        :data="item.planDetailGoodsRelations"
                        ref="multiplePicTable2" 
                        @selection-change="handleSelectionChange2"
                        border
                        style="width: 100%;">

                          <el-table-column type="index" align="center" label="序号" width="65">
                          </el-table-column>

                          <el-table-column
                            prop="name"
                           
                            label="商品名称">
                            <template scope="scope">
                              <span>{{scope.row.title}}</span>
                            </template>
                          </el-table-column>

                          <el-table-column
                            label="sku封面"
                            align="center"
                            vertical="middle"
                            >
                            <template scope="scope">
                              <span v-if="!scope.row.skuCover" style="color:orangered">未编辑封面</span>
                              <img v-else style="width:50px;height:50px;" :src="scope.row.skuCover+config.imgtmb._200"
                                   class="gc_praiselist_list_img">
                            </template>
                          </el-table-column>

                          <el-table-column
                            prop="name"
                           
                            label="SKU名称">
                            <template scope="scope">
                              <span>{{scope.row.choiceSku.name + '-' + scope.row.choiceSku.subName}}</span>
                            </template>
                          </el-table-column>

                          <el-table-column
                            prop="goodsNumber"
                            label="商品编码"
                            
                            align="center">
                            <template scope="scope">
                              <span>{{scope.row.goodsNumber}}</span>
                            </template>
                          </el-table-column>

                          <el-table-column
                            prop="goodsNumber"
                            label="SKU编码"
                            
                            align="center">
                            <template scope="scope">
                              <span>{{scope.row.choiceSku.styleNumber}}</span>
                            </template>
                          </el-table-column>
  
                            <el-table-column
                              type="selection"
                              width="55">
                            </el-table-column>

                        </el-table>

                    </el-row>
                 </el-tab-pane>
                </el-tabs> 

              
          </div>

          <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="planDialogVisible = false">关 闭</el-button>
            <el-button type="primary" @click="comfirmAddPlan" v-show="!loading">保 存</el-button>
            <el-button icon="loading" type="primary" v-show="loading"></el-button>
          </div>

        </el-dialog>

        <el-dialog  title="选择适用户型"  :visible.sync="houseTypeVisible">
            <div>
              <el-input @keyup.enter.native="houseTypeSearch()" v-model="houseType.typeCode" style="width: 200px !important;" class="filter-item" placeholder="户型编码">
              </el-input>
               
              <el-select @change="houseTypeSearch" clearable style="width: 120px" class="filter-item" v-model="houseType.houseType" placeholder="户型类型">
                <el-option
                  v-for="item in planHouseTypeData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>  

              <el-button @click="houseTypeSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
            </div>

            <div class="gc-praiselist_content_list" style="margin-top:15px;">

              <el-table
                :data="houseTypeData"
                ref="multiplePicTable" 
                @selection-change="handleSelectionChange"
                border
                style="width: 100%;">

                <el-table-column type="index" align="center" label="序号" width="65">
                </el-table-column>


                <el-table-column
                  align="center"
                  label="楼盘名称">
                  <template scope="scope">
                    <span>{{scope.row.houseName}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="户型编码">
                  <template scope="scope">
                    <span>{{scope.row.typeCode}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  label="户型类型">
                  <template scope="scope">
                    <span>{{scope.row.houseTypeName}}</span>
                  </template>
                </el-table-column>


                <el-table-column
                  label="户型名称"
                  align="center">
                  <template scope="scope">
                    <span>{{scope.row.typeName}}</span>
                  </template>
                </el-table-column>
                
                <el-table-column
                  align="center"
                  label="省/区/县">
                  <template scope="scope">
                    <span>{{scope.row.province}}/{{scope.row.city}}/{{scope.row.county}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  label="楼盘地址"
                  align="center">
                  <template scope="scope">
                    <span>{{scope.row.address}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  label="操作"
                  align="center">
                  <template scope="scope">
                    <el-button type="text" @click="choiceHousType(scope.row)">选择</el-button>

                  </template>
                </el-table-column>

               <!--  <el-table-column
                  type="selection"
                  width="55">
                </el-table-column> -->


              </el-table>
              <div  class="pagination-container">
                <el-pagination @size-change="houseHandleSizeChange" @current-change="houseHandleCurrentChange"
                               :page-sizes="[10,15,20,30]" :page-size="houseType.pageSize" :current-page.sync="houseType.pageIndex"
                               layout="total, sizes, prev, pager, next, jumper" :total="houseType.total">
                </el-pagination>
              </div>
            </div> 

         <!--  <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="houseTypeVisible = false">关 闭</el-button>
            <el-button type="primary" @click="comfirmAddHouseType">确 定</el-button>
          </div> -->
    
        </el-dialog>


         <el-dialog  title="选择商品"  :visible.sync="goodsVisible">
            <div>
              <el-input @keyup.enter.native="goodsSearch()" v-model="goods.keyword" style="width: 200px !important;" class="filter-item" placeholder="商品名称或编码">
              </el-input>

              <el-button @click="goodsSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
            </div>

            <div class="gc-praiselist_content_list" style="margin-top:15px;">

              <el-table
                :data="goodsData"
                border
                style="width: 100%;">

                <el-table-column type="index" align="center" label="序号" width="65">
                </el-table-column>

                <el-table-column
                  label="商品封面"
                  align="center"
                  vertical="middle"
                  width="120">
                  <template scope="scope">
                    <span v-if="!scope.row.cover" style="color:orangered">未编辑封面</span>
                    <img v-else style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200"
                         class="gc_praiselist_list_img">
                  </template>
                </el-table-column>

                <el-table-column
                  prop="name"
                  
                  label="商品名称">
                  <template scope="scope">
                    <span>{{scope.row.title}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="goodsNumber"
                  label="商品编码"
                  
                  align="center">
                  <template scope="scope">
                    <span>{{scope.row.goodsNumber}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  label="供应商"
                  align="center">
                  <template scope="scope">
                    <span>{{scope.row.provider.providerName}}</span>
                  </template>
                </el-table-column>

            <!--     <el-table-column
                  label="选择商品SKU"
                  align="center">
                  <template scope="scope"> 
                   <span style="color:#4db3ff;cursor: pointer;" @click="selectSku(scope.row)" v-if="scope.row.choiceSku">{{scope.row.choiceSku.name + '-' + scope.row.choiceSku.subName}}</span>
                   <span style="color:#4db3ff;cursor: pointer;" @click="selectSku(scope.row)" v-else>无</span>
                  </template>
                </el-table-column> -->

                <!-- <el-table-column
                  label="选择商品"
                  align="center">
                  <template scope="scope">
                    <el-checkbox v-model="scope.row.checked" @change="goodsCheck(scope.row)"></el-checkbox>
                  </template>
                </el-table-column> -->

                <el-table-column
                  label="操作"
                  align="center">
                  <template scope="scope">
                    <el-button type="text" @click="choiceGoods(scope.row)">选择</el-button>
                  </template>
                </el-table-column>


               <!--  <el-table-column
                  type="selection"
                  width="55">
                </el-table-column> -->


              </el-table>
              <div  class="pagination-container goods_page_box">
                <el-pagination @size-change="goodsHandleSizeChange" @current-change="goodsHandleCurrentChange"
                               :page-sizes="[10,15,20,30]" :page-size="goods.pageSize" :current-page.sync="goods.pageIndex"
                               layout="total, sizes, prev, pager, next, jumper" :total="goods.total">
                </el-pagination>
              </div>
            </div> 

         <!--  <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="goodsVisible = false">关 闭</el-button>
            <el-button type="primary" @click="comfirmAddGoods">确 定</el-button>
          </div> -->
    
        </el-dialog> 

        <el-dialog  title="软装细节"  :visible.sync="detailsVisible">
          <el-form class="small-space" label-position="right" style="overflow:hidden;">

            <el-form-item label="细节名称" style="width:100%;float:left;"> 
                <el-input v-if="!editDetailtFlag" v-model="currentDetail.detailName" style="width:30%" maxlength="5" class="filter-item" placeholder="细节名称"> </el-input>
                <b v-else>{{currentDetail.detailName}}</b>
            </el-form-item>

            <el-form-item label="平面布置图" style="width:50%;float:left;"> 

              <div v-show="currentDetail.planImage" class="el-upload el-upload--picture-card" style="margin-left:85px;display:block;">
                <img id="uploadCover4" title="点击修改图片" style="width:100%; height:100%" :src="currentDetail.planImage">
              </div>

              <div v-show="!currentDetail.planImage" style="display:block; margin-left:85px">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn4">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>

             </el-form-item>

             <el-form-item label="效果示意图(可选)" class="effect_image" style="width:50%;float:left;"> 

              <div v-show="currentDetail.effectImage" class="el-upload el-upload--picture-card" style="margin-left:118px;display:block;">
                <img id="uploadCover5" title="点击修改图片" style="width:100%; height:100%" :src="currentDetail.effectImage">
              </div>

              <div v-show="!currentDetail.effectImage" style="display:block; margin-left:118px">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn5">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>

             </el-form-item>

             <el-form-item label="色彩关系图" style="width:50%;float:left;"> 

              <div v-show="currentDetail.colorRelationImage" class="el-upload el-upload--picture-card" style="margin-left:85px;display:block;">
                <img id="uploadCover6" title="点击修改图片" style="width:100%; height:100%" :src="currentDetail.colorRelationImage">
              </div>

              <div v-show="!currentDetail.colorRelationImage" style="display:block; margin-left:85px">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn6">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>

             </el-form-item>

             <el-form-item label="软装搭配详案图" style="width:50%;float:left;"> 

              <div v-show="currentDetail.matchImage" class="el-upload el-upload--picture-card" style="margin-left:118px;display:block;">
                <img id="uploadCover7" title="点击修改图片" style="width:100%; height:100%" :src="currentDetail.matchImage">
              </div>

              <div v-show="!currentDetail.matchImage" style="display:block; margin-left:118px">
                <div class="el-upload el-upload--picture-card" id="uploadCoverBtn7">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>

             </el-form-item>

          </el-form>

          <div slot="footer" class="dialog-footer" style="text-align:right;">
            <el-button @click="detailsVisible = false">关 闭</el-button>
            <el-button type="primary" @click="comfirmAddDetail">确 定</el-button>
          </div>

        </el-dialog>


        <el-dialog  title="选择商品SKU"  :visible.sync="showGoodsSKU" >

          <div class="gc-praiselist_content_list">

            <el-table
              :data="goodsSkuData"
              @selection-change="handleSelectionChange3"
              border
              style="width: 100%;">

              <el-table-column type="index" align="center" label="序号" width="65">
              </el-table-column>

              <el-table-column
                label="SKU封面"
                align="center"
                vertical="middle"
                width="120">
                <template scope="scope">
                  <img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200"  class="gc_praiselist_list_img">
                </template>
              </el-table-column>

              <el-table-column
                label="SKU名称">
                <template scope="scope">
                  <span>{{scope.row.name + "-" + scope.row.subName}}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="goodsNumber"
                label="SKU编码"
                
                align="center">
                <template scope="scope">
                  <span>{{scope.row.styleNumber}}</span>
                </template>
              </el-table-column>

<!--               <el-table-column
                label="操作"
                align="center">
                <template scope="scope">
                   <el-button type="text" @click="choiceSku(scope.row)">选择</el-button>
                </template>
              </el-table-column> -->

                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>             

              </el-table>

            </div>

            <div slot="footer" class="dialog-footer" style="text-align:right;">
              <el-button @click="showGoodsSKU = false">关 闭</el-button>
              <el-button type="primary" @click="comfirmAddGoodsSku">确 定</el-button>
            </div>

          </el-dialog> 

    <el-dialog  title="复制方案链接" :visible.sync="qrcodeVisible">
      <el-tabs v-model="qrcodeActive" >
        <el-tab-pane label="链接地址" name="1">
          <el-input v-model="qrcodeUrl" :disabled="true" placeholder="请输入内容" style="width:50%;"/>
          <el-button type="primary" icon="el-icon-document" @click="handleCopy(qrcodeUrl,$event)">复制</el-button>       
        </el-tab-pane>
        <el-tab-pane label="地址二维码" name="2">
          <div id="qrcodeBox" style="text-align: center;"></div>
          <p style="color:#343434;text-align:center;">右键点击二维码，选择‘图片另存为’，保存到本地</p>         
        </el-tab-pane>
      </el-tabs>
    </el-dialog>


  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import clip from '@/utils/copyText'
  import uploader from '@/utils/uploader'
  export default{
    data() {
      return {
        qrcodeActive:'1',
        qrcodeVisible:false,
        qrcodeUrl:null,
        isChoiceSku:false,
        checkeGoodsData:{},
        showGoodsSKU:false,
        loading:false,
        uploading:false,
        percentage:0,
        goodsIndex:0,
        goodsVisible:false,
        editDetailtFlag:false,
        initUpload1:false,
        initUpload:false,
        token:null,
        detailsVisible:false,
        imageVisible:false,
        houseTypeVisible:false,
        planDialogVisible:false,
        tabValue:'',
        goodsSkuData:[],
        provinces:[],
        citys:[],
        areas:[],
        dataList:[],
        styleData:[],
        houseTypeData:[],
        multipleSelections:[],
        multipleSelections1:[],
        multipleSelections2:[],
        multipleSelections3:[],
        goodsData:[],
        planHouseTypeData:[],
        planPriceData:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          planName:'',
          styleId:null,
          provinceCode:'',
          cityCode:'',
          countyCode:''
        },
        houseType:{
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          typeCode:'',
          houseType:'',
        },
        goods:{
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          keyword: "",
        },
        plan:{
          planId:null,
          planName:'',
          styleId:'',
          priceRange:'',
          cover:"",
          houseTypeImage:"",
          designExplain:'',
          colorRelationImage:'',
          materialImage:'',
          original:'',
          houseTypePlanRelations:[],
          details:[],
        },
        imageArray:[{
          cover:"",
          houseTypeImage:"",
          colorRelationImage:'',
          materialImage:'',
        }],
        currentDetail:{
          detailId:null,
          planImage:'',
          effectImage:'',
          colorRelationImage:'',
          matchImage:'',
          detailName:'',
          imageArray:[],
          planDetailGoodsRelations:[]
        }
      }
    },
    mounted() {
      this.getUploadToken();
      this.findByPage();
      this.findByProvince();
      this.findStyle();
      this.findPlanHouseType();
      this.findPlanPrice();
      
    },
    methods:{
      copyGoodsUrl(data,event) {
        this.restCode();  
        let url = "https://wx.goochao.com/plan_detail.html?planId=" + data.planId;
        let params = {};
        params.url = url;
        this.http.get(this).url(this.config.toShortUrl).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.qrcodeVisible = true;
          this.qrcodeUrl = response.data.data;
          setTimeout(()=>{
            this.setCode(response.data.data);
          },20)

          }, (err) => {console.log(err)}
        );
      },
      restCode() {
        this.qrcodeActive = '1';
        jQuery('#qrcodeBox').html("");
        this.qrcodeUrl= null;
      },
      handleCopy(qrcodeUrl,event) {
        clip(qrcodeUrl,event,'方案链接');
      },
      setCode(url) {
        jQuery('#qrcodeBox').qrcode({
          render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
          text: url, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
          width: "160", //二维码的宽度
          height: "160", //二维码的高度
          typeNumber: -1, //计算模式
          correctLevel: 2, //二维码纠错级别
          background: "#ffffff", //二维码的后景色
          foreground: "#000000", //二维码的前景色
          imgWidth: 80,
          imgHeight: 80
        })
      },
      reset() {
        this.imageArray = [{
          cover:"",
          houseTypeImage:"",
          colorRelationImage:'',
          materialImage:'',
        }];
        this.plan = {
          planId:null,
          planName:'',
          styleId:'',
          priceRange:'',
          cover:"",
          houseTypeImage:"",
          designExplain:'',
          colorRelationImage:'',
          materialImage:'',
          original:'',
          houseTypePlanRelations:[],
          details:[],
        };
      },
      checkFrom() {

        if(!this.plan.planName || !this.plan.planName.trim()){
          this.$message({type: 'warning', message: '方案名称不能为空' });
          return false;
        }

        if(!this.plan.styleId){
          this.$message({type: 'warning', message: '请选择风格' });
          return false;
        }


        if(!this.plan.priceRange){
          this.$message({type: 'warning', message: '请选择价格区间' });
          return false;
        }

        if(!this.plan.designExplain || !this.plan.designExplain.trim()){
          this.$message({type: 'warning', message: '方案说明不能为空' });
          return false;
        }

        if(this.plan.designExplain.length < 50){
          this.$message({type: 'warning', message: '方案说明在50-500之间' });
          return false;
        }

        if(!this.plan.houseTypePlanRelations.length){
          this.$message({type: 'warning', message: '请添加方案适用户型' });
          return false;
        }

        // this.plan.houseTypePlanRelations.forEach((item)=>{
        //   item.houseTypeId = item.typeId;
        // })

        let houseTypes = [];
        this.plan.houseTypePlanRelations.forEach((item)=>{
          var params = {};
          params.houseTypeId = item.typeId;
          params.address = item.address;
          params.houseId = item.houseId;
          params.houseName = item.houseName;
          params.houseTypeName = item.houseTypeName;
          params.typeCode = item.typeCode;
          params.typeId = item.typeId;
          params.typeName = item.typeName;
          houseTypes.push(params)
        })
        this.plan.houseTypePlanRelations = houseTypes;


        if(!this.plan.cover){
          this.$message({type: 'warning', message: '请上传方案图封面' });
          return false;
        } 

        if(!this.plan.houseTypeImage){
          this.$message({type: 'warning', message: '请上传方案图户型图' });
          return false;
        } 

        if(!this.plan.colorRelationImage){
          this.$message({type: 'warning', message: '请上传方案图色彩关系图' });
          return false;
        } 


        if(!this.plan.materialImage){
          this.$message({type: 'warning', message: '请上传方案图材料搭配图' });
          return false;
        } 

        if(!this.plan.original){
          this.$message({type: 'warning', message: '请上传方案原件' });
          return false;
        } 


        if(!this.plan.details.length){
          this.$message({type: 'warning', message: '请添加方案细节' });
          return false;
        }

        // for (var i = 0; i < this.plan.details.length; i++) {
        //   if (!this.plan.details[i].planDetailGoodsRelations.length) {
        //     this.$message({type: 'warning', message: '请添加细节商品' });
        //     return false;
        //   }
        // }

        return true;

      },
      comfirmAddPlan() {
        if(this.checkFrom()){
          console.log(this.plan)
          this.loading = true;
          this.http.postJson(this).url(this.config.softWear.plan_list).params(this.plan).request( (response) => {
              this.loading = false;
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '方案保存成功!'});
              this.findByPage();
              this.planDialogVisible = false;
            },
            (error) => {
              this.loading = false;
            }
          );
        }
      },
      addPlan() {
        this.reset();

        this.planDialogVisible = true;

        this.imageInitUpload();
      }, 

      addPlanImage() {
        this.imageVisible = true;
        this.imageInitUpload();
      },
      editDetail(detailItme,index) {
        console.log(detailItme,index)
        this.editDetailtFlag = true;
        let detail = $.extend(true,{},detailItme);
        this.detailsVisible = true;
        // this.currentDetail = {};
        // this.currentDetail.detailId = detail.detailId;
        // this.currentDetail.planImage = detail.planImage;
        // this.currentDetail.effectImage = detail.effectImage;
        // this.currentDetail.colorRelationImage = detail.colorRelationImage;
        // this.currentDetail.matchImage = detail.matchImage;
        // this.currentDetail.detailName = detail.detailName;
        // this.currentDetail.planDetailGoodsRelations = detail.planDetailGoodsRelations;
        
        this.currentDetail = {
          detailId:detail.detailId,
          planImage:detail.planImage,
          effectImage:detail.effectImage,
          colorRelationImage:detail.colorRelationImage,
          matchImage:detail.matchImage,
          detailName:detail.detailName,
          imageArray:[],
          planDetailGoodsRelations:detail.planDetailGoodsRelations
        };

        this.detailInitUpload();
      },
      addDetails() {
        this.editDetailtFlag = false;
        this.detailsVisible = true;
        this.currentDetail = {
          detailId:null,
          planImage:'',
          effectImage:'',
          colorRelationImage:'',
          matchImage:'',
          detailName:'',
          imageArray:[],
          planDetailGoodsRelations:[]
        };
        this.detailInitUpload();
      },
      removeTab(val) {

        this.$confirm('是否要移除该细节？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
        
          for(var i = 0; i  < this.plan.details.length; i++) {
            if (this.plan.details[i].detailName == val) {
              this.plan.details.splice(i,1);
            }
          }
          this.tabValue = this.plan.details[0].detailName;
        }).catch(() => {});

      },
      comfirmAddDetail() {
       
        if(!this.currentDetail.detailName && !this.currentDetail.detailName.trim()){
          this.$message({type: 'warning', message: '细节名称不能为空' });
          return false;
        }
        if(!this.currentDetail.planImage ){
          this.$message({type: 'warning', message: '请上传平面布置图' });
          return false;
        }

        if(!this.currentDetail.colorRelationImage){
          this.$message({type: 'warning', message: '请上传色彩关系图' });
          return false;
        }

        if(!this.currentDetail.matchImage){
          this.$message({type: 'warning', message: '请上传软装搭配详案图' });
          return false;
        }

        let flag = true;
        this.plan.details.forEach((item)=>{
          if(item.detailName == this.currentDetail.detailName){
            flag = false;
          }
        })
       

        if (flag) {
          this.setDetailData(true);
        } else {
          if (this.editDetailtFlag) {
            this.setDetailData(false);
          } else {
            this.$message({ type: 'warning', message: '细节名称不能重复'});
          }

        }

      },
      setDetailData(type) {
          var obj = {};
          let arr = [];
          obj.planImage = this.currentDetail.planImage;
          obj.effectImage = this.currentDetail.effectImage;
          obj.colorRelationImage = this.currentDetail.colorRelationImage;
          obj.matchImage = this.currentDetail.matchImage;
          arr.push(obj);
          this.currentDetail.imageArray = arr;
         
          if (type) {
            this.plan.details.push(this.currentDetail);
           
          } else {
         
            let number = null;
            for (var i = 0; i < this.plan.details.length; i++){
              if (this.plan.details[i].detailName == this.currentDetail.detailName) {
             
                number = i;
              }
            }
            if (number != null) {
              this.plan.details.splice(number,1,this.currentDetail);  
            }
          }

          this.tabValue = this.currentDetail.detailName;
          this.detailsVisible = false;
      },
      addGoods(index) {
        this.goods.keyword = "";
        this.goodsIndex = index;
        this.goodsVisible = true;
        
        this.goodsSearch();  
      },
      /*选择商品*/
      choiceGoods(data) {
        let goodsData = $.extend({},data);
        this.checkeGoodsData = goodsData;
        this.isChoiceSku = true;
        this.showGoodsSKULayout(goodsData,true);
      },
      /*选择商品SKU*/
      // goodsCheck(data) {
      //   this.checkeGoodsData = data;
      //   if(data.checked) {
      //     this.showGoodsSKULayout(data,false);
      //     //this.plan.details[this.goodsIndex].planDetailGoodsRelations.push(data)
      //   } else {
      //     this.removePurchaseOrder(this.plan.details[this.goodsIndex].planDetailGoodsRelations,data);
      //   }
       
      // },
      selectSku(data) {
        this.checkeGoodsData = data;
        this.isChoiceSku = true;
        this.showGoodsSKULayout(data,true);
      },
      showGoodsSKULayout(goodsData,type) {
        this.goodsSkuData = [];
        if (!goodsData.styleVos) {
          this.$message({message: "该商品暂无上架SKU！", type: 'warning'});
          goodsData.checked = false;
          return ;
        }

        goodsData.styleVos.forEach((item)=>{
          if (item.status == 1) {
            this.goodsSkuData.push(item);
          }
        });

        if (this.goodsSkuData.length) {
          this.showGoodsSKU = true;
          if (!type) {
            this.isChoiceSku = false;
          }
        } else {
         this.$message({message: "该商品暂无上架SKU！", type: 'warning'});
         goodsData.checked = false;
        }

        console.log(this.plan.details[this.goodsIndex].planDetailGoodsRelations,this.checkeGoodsData)
      },
      closeSku(done) {
        if (!this.isChoiceSku) {
          this.checkeGoodsData.checked = false;
        }
        done();
      },
      handleSelectionChange3(val) {
        this.multipleSelections3 = val;
      },
      comfirmAddGoodsSku() {
        if (this.multipleSelections3 && this.multipleSelections3.length > 0) {
          this.multipleSelections3.forEach((item)=>{
              let obj = $.extend({},this.checkeGoodsData);
              obj.choiceSku = item;
              obj.styleId = item.styleId;
              obj.checked = true;
              obj.skuCover = item.cover;  
              let flag = false;
              this.plan.details[this.goodsIndex].planDetailGoodsRelations.forEach((planGoodsItem)=>{
                if (item.styleId == planGoodsItem.styleId) {
                  flag = true;
                }
              });  
              if (!flag) {
                this.plan.details[this.goodsIndex].planDetailGoodsRelations.push(obj);
              }
          })
          this.showGoodsSKU = false;
        } else {
          this.$message({message: "请选择商品SKU", type: 'warning'});
        }
      },
      choiceSku(skuData) {
        this.isChoiceSku = true;
        this.checkeGoodsData.choiceSku = skuData;
        this.checkeGoodsData.styleId = skuData.styleId;
        this.checkeGoodsData.checked = true;
        this.checkeGoodsData.skuCover = skuData.cover;

        // for(var i = 0; i < this.goodsData.length; i++){
        //   if (this.goodsData[i].goodsId == this.checkeGoodsData.goodsId) {
        //     this.goodsData.splice(i,1,this.checkeGoodsData);
        //   }
        // }
        console.log(this.plan.details[this.goodsIndex].planDetailGoodsRelations,this.checkeGoodsData)
        let number = null;
        this.plan.details[this.goodsIndex].planDetailGoodsRelations.forEach((item,index)=>{
          if (item.styleId == this.checkeGoodsData.styleId) {
            number = index;
          }
        });

        if (number == null) {
          let obj = {};
          obj = this.checkeGoodsData;
          
          this.plan.details[this.goodsIndex].planDetailGoodsRelations.push(obj);
          this.showGoodsSKU = false;
          //this.plan.details[this.goodsIndex].planDetailGoodsRelations.push(this.checkeGoodsData);  
        } else {
          this.$message({message: "细节已选择该商品SKU,不能重复选择!", type: 'warning'});
          //this.plan.details[this.goodsIndex].planDetailGoodsRelations.splice(number,1,this.checkeGoodsData);  
        }
        
      },
      removePurchaseOrder(array,data) {
        this.checkeGoodsData.choiceSku = null;
        this.checkeGoodsData.styleId = null;

        //初始化商品选择
        for(var i = 0; i < this.goodsData.length; i++){
          if (this.goodsData[i].goodsId == this.checkeGoodsData.goodsId) {
            this.goodsData.splice(i,1,this.checkeGoodsData);
          }
        }
        /*细节里面移除该项*/
        for(var i = 0; i < array.length; i++) {
          if(array[i].goodsId == data.goodsId){
             console.log(i)
             array.splice(i, 1);
             break;
          }
        }
      },
      comfirmAddGoods() {
        if (this.multipleSelections1 && this.multipleSelections1.length > 0) {
          
          this.multipleSelections1.forEach((item)=>{

            var flag = true;
            this.plan.details[this.goodsIndex].planDetailGoodsRelations.forEach((planItem)=>{
              if(planItem.goodsId == item.goodsId){
                flag = false;
              }
            })

            if (flag) {
              this.plan.details[this.goodsIndex].planDetailGoodsRelations.push(item);
            }

          })

          this.goodsVisible = false;

        } else {
          this.$message({message: "请选择商品", type: 'warning'});
        }
      },
      handleSelectionChange1(val) {
        this.multipleSelections1 = val;
      },
      handleSelectionChange2(val) {
        this.multipleSelections2 = val;
      },
      deleteGoods(index) {
       if (this.multipleSelections2 && this.multipleSelections2.length > 0) {
          this.$confirm('是否要删除所选商品？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: "el-button--danger"
          }).then(() => {

          for(var i = 0; i < this.multipleSelections2.length; i++){
            for(var j = 0; j < this.plan.details[index].planDetailGoodsRelations.length; j++){
              if (this.multipleSelections2[i].goodsId == this.plan.details[index].planDetailGoodsRelations[j].goodsId && this.multipleSelections2[i].styleId == this.plan.details[index].planDetailGoodsRelations[j].styleId) {
                this.plan.details[index].planDetailGoodsRelations.splice(j,1);
                break ;
              }
            }
          }

          }).catch(() => {});

        } else {
          this.$message({message: "请先选择要删除商品", type: 'warning'});
        }
      },
      addHouseType() {
        this.houseTypeVisible = true;
        this.houseType.typeCode = '';
        this.houseType.houseType = '';
        this.houseTypeSearch();
        setTimeout(()=>{
          this.$refs.multiplePicTable.clearSelection();
        },50)
      },
      handleClose(tag) {
        for(var i = 0; i < this.plan.houseTypePlanRelations.length; i++){
          if(this.plan.houseTypePlanRelations[i].typeId == tag.typeId){
            this.plan.houseTypePlanRelations.splice(i,1);
            break ;
          }
        }
      },
      handleSelectionChange(val) {
        this.multipleSelections = val;
      },

      comfirmAddHouseType() {
        if (this.multipleSelections && this.multipleSelections.length > 0) {

          this.multipleSelections.forEach((item)=>{
            var flag = true;
            this.plan.houseTypePlanRelations.forEach((planItem)=>{
              if(planItem.typeId == item.typeId){
                flag = false;
              }
            })
            if (flag) {
              this.plan.houseTypePlanRelations.push(item);
            }
          })

          this.houseTypeVisible = false;

        } else {
          this.$message({message: "请选择适用户型", type: 'warning'});
        }
      },
      choiceHousType(houseType) {
        console.log(houseType);
        let array = [];
        array.push(houseType);
        this.plan.houseTypePlanRelations = array;
        this.houseTypeVisible = false;
      },


      goodsHandleSizeChange(val) {
        this.goods.pageSize = val;
        this.findByGoods();
      },
      goodsHandleCurrentChange(val) {
        this.goods.pageIndex = val;
        this.findByGoods();
      },
      goodsSearch() {
        this.goods.pageIndex = 1;
        this.findByGoods();
      },
      findByGoods() {
        var params = {
          pageSize: this.goods.pageSize,
          pageIndex: this.goods.pageIndex,
          keyword: this.goods.keyword,
          goodsStatus: 3
        };

        this.http.get(this).url(this.config.goods.list_url_v2).params(params).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            
            response.data.data.data.forEach((item)=>{
              var flag = false;
              var number = null;
              this.plan.details[this.goodsIndex].planDetailGoodsRelations.forEach((goodsItem,index)=>{
                if (goodsItem.goodsId == item.goodsId) {
                  flag = true;
                  number = index;

                }
              })

              if (flag) {

                item.checked = true;
                let styleId = this.plan.details[this.goodsIndex].planDetailGoodsRelations[number].styleId;
                let hasSku = false;
                item.styleVos.forEach((styleItem)=>{
                  if (styleItem.styleId == styleId) {
                    item.choiceSku = styleItem;
                    item.styleId = styleId;
                    hasSku = true;
                  }
                });

                if (!hasSku) {
                  for(var i = 0; i < item.styleVos.length; i++){
                    if (item.styleVos[i].status == 1) {
                      item.choiceSku = item.styleVos[i];
                      item.styleId = item.styleVos[i].styleId;
                      break;
                    }
                  }
                }

              } else {
                item.checked = false;
                item.choiceSku = null;
                item.styleId = null;
              }

            });
            
            this.goodsData = response.data.data.data;
            this.goods.total = response.data.data.totalSize;
            


          },(error) => {console.log(error)}
        );
      },


      houseHandleSizeChange(val) {
        this.houseType.pageSize = val;
        this.findHouseType();
      },
      houseHandleCurrentChange(val) {
        this.houseType.pageIndex = val;
        this.findHouseType();
      },
      houseTypeSearch() {
        this.houseType.pageIndex = 1;
        this.findHouseType();
      },
      findHouseType() {
        this.http.get(this).url(this.config.softWear.house_type).params(this.houseType).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.houseTypeData = data;
            this.houseType.total = response.data.data.totalSize;
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
          this.loadCity(this.listQuery.provinceCode);
        }
        this.findByPage();
      },
      areaSearch() {
        this.areas = [];
        this.listQuery.countyCode = '';
        if(this.listQuery.cityCode){
          this.loadArea(this.listQuery.cityCode);
        }
        this.findByPage();
      },
      findByProvince() {
        this.http.get(this).url(this.config.area.provinces).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            this.provinces = response.data.data.districts[0].districts;

          },(error) => {console.log(error)}
        );
      },
      loadCity(code,type) {
        this.http.get(this).url(this.config.area.city).params({adcode:code}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }

            this.citys = response.data.data.districts[0].districts;
            
          },(error) => {console.log(error)}
        );
      },
      loadArea(code,type) {
        this.http.get(this).url(this.config.area.city).params({adcode:code}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
           
            this.areas = response.data.data.districts[0].districts;

          },(error) => {console.log(error)}
        );
      },
      findByPage() {
        this.listQuery.loading = true;

        this.http.get(this).url(this.config.softWear.plan_list).params(this.listQuery).request((response) => {
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
      findStyle() {
        this.http.get(this).url(this.config.image_style.list_url).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.styleData = response.data.data;
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
      findPlanPrice() {
        let params = {};
        params.type = 2;
        this.http.get(this).url(this.config.softWear.plan_type).restful(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.planPriceData = response.data.data;
          },(error) => {console.log(error)}
        );
      },
      loadPlanDetail(plan) {
        this.http.get(this).url(this.config.softWear.plan_detail).restful({planId:plan.planId}).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
            this.reset();
            let data = response.data.data;
            data.houseType = data.houseType + "";
            data.priceRange = data.priceRange + "";

            data.houseTypePlanRelations.forEach((item)=>{
              item.typeName = item.houseType.typeName;
              item.typeId = item.houseTypeId;
              item.houseName = item.house.houseName;
              item.typeCode = item.houseType.typeCode;
            })
            this.imageArray = [{
              cover:data.cover,
              houseTypeImage:data.houseTypeImage,
              colorRelationImage:data.colorRelationImage,
              materialImage:data.materialImage,
            }];
            data.details.forEach((item)=>{
              var obj = {};
              var imageArray = [];
              obj.colorRelationImage = item.colorRelationImage;
              obj.effectImage = item.effectImage;
              obj.matchImage = item.matchImage;
              obj.planImage = item.planImage;
              imageArray.push(obj);
              item.imageArray = imageArray;
              item.planDetailGoodsRelations.forEach((childItem)=>{
                childItem.choiceSku = childItem.goodsStyle;
                childItem.skuCover = childItem.goodsStyle.cover;
              })
            })

            this.plan = response.data.data;
            this.tabValue = this.plan.details[0].detailName;
            this.planDialogVisible = true;
            this.imageInitUpload();
          }, (err) => {console(err)}
        );
      },
      deletePlan(plan) {
        this.$confirm('是否要删除方案"' + plan.planName + '"，删除后将不能恢复，是否确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.softWear.plan_detail).restful({planId:plan.planId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => {console(err)});
        }).catch(() => {});
      },
      getUploadToken() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          if (response.data.code == 0) {
            this.token = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      imageInitUpload() {
        if (!this.initUpload ) {
          this.$nextTick(_ => {
            this.initUpload = true;
            uploader.initUpload(this.token, "uploadCover", (url) => {
              console.log(url)
              this.plan.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn", (url) => {
              console.log(url)
              this.plan.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initUpload(this.token, "uploadCover1", (url) => {
              console.log(url)
              this.plan.houseTypeImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn1", (url) => {
              console.log(url)
              this.plan.houseTypeImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initUpload(this.token, "uploadCover2", (url) => {
              console.log(url)
              this.plan.colorRelationImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn2", (url) => {
              console.log(url)
              this.plan.colorRelationImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initUpload(this.token, "uploadCover3", (url) => {
              console.log(url)
              this.plan.materialImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn3", (url) => {
              console.log(url)
              this.plan.materialImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initPdfUpload(this.token, "uploadCoverBtn0", (url) => {
              console.log(url)
              this.plan.original = url;
              this.percentage = 0;
              this.uploading = false;
            }, (up, err, errTip) => {
               this.$message({message: errTip,type: 'error'});
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });

          });
        }
      },
      detailInitUpload() {
        if (!this.initUpload1 ) {
          this.$nextTick(_ => {
            this.initUpload1 = true;
            uploader.initUpload(this.token, "uploadCover4", (url) => {
              console.log(url)
              this.currentDetail.planImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn4", (url) => {
              console.log(url)
              this.currentDetail.planImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initUpload(this.token, "uploadCover5", (url) => {
              console.log(url)
              this.currentDetail.effectImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn5", (url) => {
              console.log(url)
              this.currentDetail.effectImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initUpload(this.token, "uploadCover6", (url) => {
              console.log(url)
              this.currentDetail.colorRelationImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn6", (url) => {
              console.log(url)
              this.currentDetail.colorRelationImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initUpload(this.token, "uploadCover7", (url) => {
              console.log(url)
              this.currentDetail.matchImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initUpload(this.token, "uploadCoverBtn7", (url) => {
              console.log(url)
              this.currentDetail.matchImage = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

          });
        }
      }
    }
  }
</script>

<style  lang="scss">
  #houseScheme_vue{
    .plan_detail{
      .el-col{
        margin-bottom: 20px;
        span{
          width:90px;
          text-align: right;
          font-weight:700;
          display: inline-block;
        }
        .button_add{
          span{
            width:auto;
          }
        }
        .el-tag{
          width:auto;
          margin-right:10px;
          margin-bottom:10px;
        }
      }
    }
    .effect_image{
      .el-form-item__label{
        padding-right: 0;
      }
    }
  }
</style>
