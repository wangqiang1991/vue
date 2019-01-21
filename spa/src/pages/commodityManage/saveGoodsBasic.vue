<template>
  <div class="createPost-container" id="saveGoodsBasic_vue">
    <el-form class="form-container" id="basicInform">
      <sticky :className="'sub-navbar'"  style="z-index:999;" v-if="!seeGoodsDetail">
        <template>
          <el-button type="primary" @click="save">提交至商品内容团队</el-button>
          <!-- <el-button type="primary" @click="callBack" v-if="goods.goodsId">撤回编辑</el-button> -->
          <el-button @click="cancel">取 消</el-button>
        </template>
      </sticky>
      <div v-else>
        <el-button @click="cancel">返回商品列表</el-button>
      </div>

      <div class="createPost-main-container" style="padding:10px;">

        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px;font-size:18px;color:#666;">基本信息</h1>
          </el-col>
          <el-col :span="21">
            <el-form-item label-width="80px" label="商品标题:">
              <el-input v-if="!seeGoodsDetail" type="text" size="large" style="width:600px" maxlength="17" class="article-textarea" autosize
                        placeholder="请输入商品标题" v-model="goods.title">
              </el-input>
              <span v-else>{{goods.title}}</span>
            </el-form-item>

            <el-form-item label-width="80px" label="商品编码:">
              <el-input  v-if="!seeGoodsDetail" :disabled="goodsReloadEdit" type="text" style="width:600px;" class="article-textarea" maxlength="45" autosize placeholder="请输入商品编码" v-model="goods.goodsNumber">
              </el-input>
              <span v-else>{{goods.goodsNumber}}</span>
            </el-form-item>

            <!--<el-form-item label-width="80px" label="规格编号:">
              <el-input type="text" class="article-textarea" autosize placeholder="请输入规格编号" v-model="goods.styles[0].styleNumber">
              </el-input>
            </el-form-item>-->

            <el-form-item label-width="80px" label="商品简介:">
              <el-input v-if="!seeGoodsDetail" type="textarea"  maxlength="50" style="width:750px;" class="article-textarea" :rows="1" autosize placeholder="请输入简介内容"
                        v-model="goods.description">
              </el-input>
              <span v-else>{{goods.description}}</span>
            </el-form-item>

            <el-form-item label-width="80px" label="分类选择:">
              <div style="padding-bottom:5px" class="grid-content bg-purple"
                   v-for="(selItem, index) in selectedCategorys">
                <el-select :disabled="seeGoodsDetail" v-model="selItem.firstCategoryId" clearable @change="onFirstCategoryChange(selItem)"
                           filterable placeholder="请选择一级分类">
                  <el-option
                    v-for="item in selItem.firstCategorys"
                    :key="item.categoryId"
                    :label="item.name"
                    :value="item.categoryId">
                  </el-option>
                </el-select>
                <el-select :disabled="seeGoodsDetail" v-model="selItem.secondCategoryId" @change="onSecondCategoryChange(selItem)" clearable filterable placeholder="请选择二级分类"
                           style="margin-right:10px">
                  <el-option
                    v-for="item in selItem.secondCategorys"
                    :key="item.categoryId"
                    :label="item.name"
                    :value="item.categoryId">
                  </el-option>
                </el-select>
                <el-button v-if="!seeGoodsDetail" @click="delCategory(selItem)" v-show="selectedCategorys.length > 1" type="primary"
                           size="small" icon="minus"></el-button>
                <el-button v-if="!seeGoodsDetail" style="margin-left:0px" @click="addCategory" v-show="index == selectedCategorys.length - 1"
                           type="primary" size="small" icon="plus"></el-button>
              </div>
            </el-form-item>

            <el-form-item label-width="80px" label="关键词:">
              <el-tag :key="tag" v-for="tag in keywordsArray" type="primary" :closable="!seeGoodsDetail" style="margin-left: 10px;"
                      :disable-transitions="false" @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm" style="width: 100px;">
              </el-input>
              <el-button v-show="!seeGoodsDetail" v-else class="button-new-tag" size="small" @click="showInput"> + 添加</el-button>
              <el-button v-show="!seeGoodsDetail" class="button-new-tag" size="small" @click="choiceKeywords" > + 选择</el-button>
            </el-form-item>


            <el-form-item label-width="80px" label="服务标签:">
              <el-tag :key="tag" v-for="tag in serviceTagArray" type="primary" :closable="!seeGoodsDetail" style="margin-left: 10px;"
                      :disable-transitions="false" @close="serviceHandleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input class="input-new-tag" v-if="serviceInputVisible" v-model="serviceInputValue" ref="serviceTagInput" size="small"
                        maxlength="10"
                        @keyup.enter.native="handleServiceInputConfirm"
                        @blur="handleServiceInputConfirm" style="width: 100px;">
              </el-input>
              <el-button v-show="!seeGoodsDetail" v-else class="button-new-tag" size="small" @click="showServiceInput"> + 添加</el-button>
            </el-form-item>


            <el-form-item label-width="80px" label="供应商:">
              <el-select :filter-method="onProviderFilter" :disabled="seeGoodsDetail" v-model="goods.providerId" clearable filterable placeholder="请选择供应商" style="width:250px;">
                <el-option
                  v-for="item in filterProviders"
                  :key="item.providerName"
                  :label="item.providerName"
                  :value="item.providerId">
                  <span style="float: left">{{ item.providerName }}</span>
                  <span style="float: right; margin-left:16px; color: #8492a6; font-size: 13px">{{ item.providerCode }}</span>
                </el-option>
              </el-select>
              <span style="margin-left:10px;">可以输入名称检索</span>
            </el-form-item>

            <el-form-item label-width="80px" label="退货期限:">
              <el-input-number v-if="!seeGoodsDetail" :min="1" :max="365" placeholder="请输入售后退货期限" v-model="goods.refundDeadline">
              </el-input-number>
               <span v-else>{{goods.refundDeadline}}</span>
               <span style="color:orangered;">天</span>
            </el-form-item>

            <el-form-item label-width="80px" label="换货期限:">
              <el-input-number v-if="!seeGoodsDetail" :min="1" :max="365" placeholder="请输入售后换货期限" v-model="goods.exchangeDeadline"></el-input-number>
               <span v-else>{{goods.exchangeDeadline}}</span>
               <span style="color:orangered;">天</span>
            </el-form-item>

            <el-form-item label-width="80px" label="维修期限:">
              <el-input-number v-if="!seeGoodsDetail" :min="1" :max="999" placeholder="请输入售后维修期限" v-model="goods.afterSaleDeadline"></el-input-number>
               <span v-else>{{goods.afterSaleDeadline}}</span>
               <span style="color:orangered;" v-show="goods.afterSaleDeadlineType == 1">天</span>
               <span style="color:orangered;" v-show="goods.afterSaleDeadlineType == 2">月</span>
               <span style="color:orangered;" v-show="goods.afterSaleDeadlineType == 3">年</span>
               <el-button type="text" @click="choiceSaleDeadlineFormVisible = true">选择其他</el-button>
            </el-form-item>

             <el-form-item label-width="80px" label="规格一:">

              <el-select :disabled="goodsReloadEdit" v-model="goodsColor.itemId" @change="styleChange" clearable filterable placeholder="请选择商品规格类型" style="width:250px;">
                <el-option
                  v-for="item in styleItem"
                  :key="item.name"
                  :label="item.name"
                  :value="item.itemId">
                </el-option>
              </el-select>

              <el-checkbox style="margin-left:10px;" v-model="goodsColor.checked">是否上传预览图</el-checkbox>

              <br>
              
              <span class="el-tag el-tag--primary" style="margin-right: 10px;cursor:pointer;" @click="editSkuStyleName(tabName,1)" v-for="tabName in style1TagDisbaled">{{tabName.name}}</span>
              
              <el-tag :key="color.name" v-for="color in style1Tagabled" type="primary" :closable="!seeGoodsDetail" style="margin-right: 10px;cursor:pointer;"
                      :disable-transitions="false" @close="colorClose(color,$event)" @click.native="editSkuStyleName(color,1)" @click.stop>
                {{color.name}}
              </el-tag>

              <el-input class="input-new-tag" v-if="goodsColor.showInput" maxlength="17" v-model="goodsColor.inputValue" ref="colorInput" size="small"
                        @keyup.enter.native="colorInputConfirm"
                        @blur="colorInputConfirm" style="width: 100px;">
              </el-input>

              <el-button v-show="!seeGoodsDetail" v-else class="button-new-tag" size="small" @click="addColor"> + 添加</el-button>
              
              <span style="color:orangered">建议中文11个字符以内,英文17个字符以内</span>

            </el-form-item>

            <el-form-item label-width="80px" label="规格二:">

              <el-select :disabled="goodsReloadEdit" v-model="style2.itemId" @change="style1Change" clearable filterable placeholder="请选择商品规格类型" style="width:250px;">
                <el-option
                  v-for="item in styleItem"
                  :key="item.name"
                  :label="item.name"
                  :value="item.itemId">
                </el-option>
              </el-select>

              <el-checkbox style="margin-left:10px;" v-model="style2.checked">是否上传预览图</el-checkbox>
              <br>

              <span class="el-tag el-tag--primary" style="margin-right: 10px;cursor:pointer;"  @click="editSkuStyleName(tabName,2)"  v-for="tabName in style2TagDisbaled">{{tabName.name}}</span>

              <el-tag :key="style.name" v-for="style in style2Tagabled" type="primary" :closable="!seeGoodsDetail" style="margin-right: 10px;cursor:pointer;"
                      :disable-transitions="false" @close="colorClose1(style,$event)" @click.native="editSkuStyleName(style,2)" @click.stop>
                {{style.name}}
              </el-tag>
              <el-input class="input-new-tag" v-if="style2.showInput" v-model="style2.inputValue" maxlength="17" ref="styleInput" size="small"
                        @keyup.enter.native="colorInputConfirm1"
                        @blur="colorInputConfirm1" style="width: 100px;">
              </el-input>
              <el-button v-show="!seeGoodsDetail" v-else class="button-new-tag" size="small" @click="addColor1"> + 添加</el-button>
              <span style="color:orangered">建议中文11个字符以内,英文17个字符以内</span>

            </el-form-item>

          </el-col>
        </el-row>
      </div>
    </el-form>
     
        <h1 style="margin-bottom:10px;font-size:18px;color:#666;">商品SKU</h1>

          <el-tabs v-model="activeName">

           <el-tab-pane label="上架" name="1">
            
              <el-table :data="styleStatus1Array" width="100%" border @select-all="checkAll" >

                <el-table-column prop="name" :label="goodsColor.name ? goodsColor.name : '规格1'">
                </el-table-column>

                <el-table-column prop="subName" :label="style2.name ? style2.name : '规格2'">
                </el-table-column>

                <el-table-column  label="规格售卖价格">
                   <template scope="scope">
                      <el-input v-model="scope.row.price"  min="0" type="number" placeholder="请输入规格售卖价格"></el-input>
                   </template>
                </el-table-column>

                <el-table-column  label="规格初始成本价">
                   <template scope="scope">
                      <el-input v-model="scope.row.costPrice" min="0" type="number" placeholder="请输入规格初始成本价"></el-input>
                   </template>
                </el-table-column>

                <el-table-column label="SKU编号">
                  <template scope="scope">
                    <el-input v-model="scope.row.styleNumber"  :disabled="scope.row.styleId ? true : false" placeholder="请输入2位规格编号(0-9a-zA-Z)"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="运费模板" align="center">
                  <template scope="scope">

                    <el-select v-model="scope.row.templateId" @change="expressChange(scope.row)"  clearable filterable placeholder="请选择运费模板">
                      <el-option
                        v-for="item in expressTemplates.data"
                        :key="item.templateId"
                        :label="item.name"
                        :value="item.templateId">
                      </el-option>
                    </el-select>

                  </template>
                </el-table-column>

                 <el-table-column  label="包装重量(kg)">
                   <template scope="scope">
                       <el-input v-model="scope.row.weight"  min="0"  type="number" placeholder="SKU重量(kg)"></el-input>
                   </template>
                </el-table-column>

                <el-table-column label="包装体积(m³)">
                  <template scope="scope">
                    <el-input v-model="scope.row.volume"  min="0" type="number" placeholder="SKU体积(m³)"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="上下架状态改变" width="145"  align="center">
                  <template scope="scope">
                    <div class="skuChangeBox">
                      <el-button type="warning" size="small" @click="skuStateClick(scope.row,2)">临时下架</el-button>
                      <el-button type="danger" size="small" @click="skuStateClick1(scope.row,4)">永久下架</el-button>
                    </div>
                  </template>
                </el-table-column>

<!--                 <el-table-column label="上架状态" width="145" align="center">
                  <template scope="scope">
                       
                    <el-select v-model="scope.row.status" @change="skuStateChange(scope.row)"   filterable placeholder="请选择是否上架">
                      <el-option
                        v-for="item in skuStates"
                        :key="item.status"
                        :label="item.name"
                        :value="item.status">
                      </el-option>
                    </el-select>
                    
                   </template>
                </el-table-column>
 -->

              </el-table>
            
            
          </el-tab-pane>

          <el-tab-pane label="临时下架" name="2">
            
              <el-table :data="styleStatus2Array" width="100%" border @select-all="checkAll" >

                <el-table-column prop="name" :label="goodsColor.name ? goodsColor.name : '规格1'">
                </el-table-column>

                <el-table-column prop="subName" :label="style2.name ? style2.name : '规格2'">
                </el-table-column>

                <el-table-column  label="规格售卖价格">
                   <template scope="scope">
                      <!-- <el-input v-model="scope.row.price"  min="0" type="number" placeholder="请输入规格售卖价格"></el-input> -->
                      <span>{{scope.row.price}}</span>
                   </template>
                </el-table-column>

                <el-table-column  label="规格初始成本价">
                   <template scope="scope">
                      <!-- <el-input v-model="scope.row.costPrice" min="0" type="number" placeholder="请输入规格初始成本价"></el-input> -->
                      <span>{{scope.row.costPrice}}</span>
                   </template>
                </el-table-column>

                <el-table-column label="SKU编号">
                  <template scope="scope">
                    <el-input v-model="scope.row.styleNumber" :disabled="true" placeholder="请输入2位规格编号(0-9a-zA-Z)"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="运费模板" align="center">
                  <template scope="scope">

                    <el-select v-model="scope.row.templateId" :disabled='true' @change="expressChange(scope.row)"  clearable filterable placeholder="请选择运费模板">
                      <el-option
                        v-for="item in expressTemplates.data"
                        :key="item.templateId"
                        :label="item.name"
                        :value="item.templateId">
                      </el-option>
                    </el-select>

                  </template>
                </el-table-column>

                 <el-table-column  label="包装重量(kg)">
                   <template scope="scope">
                       <!-- <el-input v-model="scope.row.weight"  min="0"  type="number" placeholder="SKU重量(kg)"></el-input> -->
                       <span>{{scope.row.weight}}</span>
                   </template>
                </el-table-column>

                <el-table-column label="包装体积(m³)">
                  <template scope="scope">
                    <!-- <el-input v-model="scope.row.volume"  min="0" type="number" placeholder="SKU体积(m³)"></el-input> -->
                    <span>{{scope.row.volume}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="上下架状态改变" width="145"  align="center">
                  <template scope="scope">
                    <div class="skuChangeBox">
                       <el-button type="success" size="small" @click="skuStateClick(scope.row,1)">上架</el-button>
                       <el-button type="danger" size="small" @click="skuStateClick1(scope.row,4)">永久下架</el-button>
                    </div>
                  </template>
                </el-table-column>

<!--                 <el-table-column label="上架状态" width="145" align="center">
                  <template scope="scope">
                       
                    <el-select v-model="scope.row.status" @change="skuStateChange(scope.row)"   filterable placeholder="请选择是否上架">
                      <el-option
                        v-for="item in skuStates"
                        :key="item.status"
                        :label="item.name"
                        :value="item.status">
                      </el-option>
                    </el-select>
                    
                   </template>
                </el-table-column>
 -->

              </el-table>
            
            
            </el-tab-pane>

            <el-tab-pane label="永久下架" name="4">
            
              <el-table :data="styleStatus4Array" width="100%" border @select-all="checkAll">

                <el-table-column prop="name" :label="goodsColor.name ? goodsColor.name : '规格1'">
                </el-table-column>

                <el-table-column prop="subName" :label="style2.name ? style2.name : '规格2'">
                </el-table-column>

                <el-table-column  label="规格售卖价格">
                   <template scope="scope">
                      <!-- <el-input v-model="scope.row.price"  min="0" type="number" placeholder="请输入规格售卖价格"></el-input> -->
                      <span>{{scope.row.price}}</span>
                   </template>
                </el-table-column>

                <el-table-column  label="规格初始成本价">
                   <template scope="scope">
                      <!-- <el-input v-model="scope.row.costPrice" min="0" type="number" placeholder="请输入规格初始成本价"></el-input> -->
                      <span>{{scope.row.costPrice}}</span>
                   </template>
                </el-table-column>

                <el-table-column label="SKU编号">
                  <template scope="scope">
                    <el-input v-model="scope.row.styleNumber" :disabled="true" placeholder="请输入2位规格编号(0-9a-zA-Z)"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="运费模板" align="center">
                  <template scope="scope">

                    <el-select v-model="scope.row.templateId" :disabled='true' @change="expressChange(scope.row)"  clearable filterable placeholder="请选择运费模板">
                      <el-option
                        v-for="item in expressTemplates.data"
                        :key="item.templateId"
                        :label="item.name"
                        :value="item.templateId">
                      </el-option>
                    </el-select>

                  </template>
                </el-table-column>

                 <el-table-column  label="包装重量(kg)">
                   <template scope="scope">
                       <!-- <el-input v-model="scope.row.weight"  min="0"  type="number" placeholder="SKU重量(kg)"></el-input> -->
                       <span>{{scope.row.weight}}</span>
                   </template>
                </el-table-column>

                <el-table-column label="包装体积(m³)">
                  <template scope="scope">
                    <!-- <el-input v-model="scope.row.volume"  min="0" type="number" placeholder="SKU体积(m³)"></el-input> -->
                    <span>{{scope.row.volume}}</span>
                  </template>
                </el-table-column>

                <el-table-column label="上下架状态改变" width="145"  align="center">
                  <template scope="scope">
                  <div class="skuChangeBox">
                   <el-button type="success" size="small" :disabled="scope.row.disabled" @click="skuStateClick(scope.row,1)">上架</el-button> 
                   <el-button type="warning" size="small" :disabled="scope.row.disabled" @click="skuStateClick(scope.row,2)">临时下架</el-button>
                  </div> 
                  </template>
                </el-table-column>

<!--                 <el-table-column label="上架状态" width="145" align="center">
                  <template scope="scope">
                       
                    <el-select v-model="scope.row.status" @change="skuStateChange(scope.row)" :disabled="scope.row.disabled"  filterable placeholder="请选择是否上架">
                      <el-option
                        v-for="item in skuStates"
                        :key="item.status"
                        :label="item.name"
                        :value="item.status">
                      </el-option>
                    </el-select>
                    
                   </template>
                </el-table-column>
 -->

              </el-table>
            
          </el-tab-pane>
        </el-tabs>
 
        <el-row>
          <el-col :span="24">

            <h1 style="margin-bottom:20px;font-size:18px;color:#666;">商品类目&商品SKU对应关系
              <span style='font-size:14px;color:#FF9800;'>(同一个商品SPU在不同的商品类目下面展示不同的封面以及价格)</span>
            </h1>

            <div style="margin-bottom:16px;" v-if='item.firstCategoryId && item.secondCategoryId' v-for='item in selectedCategorys'>
              
              <span style="margin-right:8px;">{{item.firstCategoryName}}-{{item.secondCategoryName}}:</span>
              <el-select v-model="item.styleNumber" @change="categoryStyleChange" clearable filterable placeholder="请选择商品SKU">
                <el-option
                  v-for="styleItem in styleStatus1Array"
                  v-if="styleItem.styleNumber"
                  :key="styleItem.styleNumber"
                  :label="styleItem.name + styleItem.subName"
                  :value="styleItem.styleNumber">
                </el-option>
              </el-select>

            </div>
            
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="21">
            <h1 style="margin-bottom:20px;font-size:18px;color:#666;">基本信息备注(选填)</h1>
            <el-input type="textarea" v-model="goods.basicModifyDesc" :rows="3" placeholder="输入基本信息备注" style="width:50%;"></el-input>
          </el-col>
        </el-row>

    <el-dialog title="规格" :visible.sync="dialogFormVisible">
      <el-form style="width: 500px; margin-left: 50px;">

        <el-form-item label="规格名称">
          <el-input v-model="currentStyle.name" style="width:280px" placeholder="请输入规格名称"></el-input>
        </el-form-item>

         <el-form-item label="规格编号">
          <el-input v-model="currentStyle.styleNumber" style="width:280px" placeholder="请输入规格编号"></el-input>
        </el-form-item>

        <el-form-item label="售卖价格">
          <el-input v-model="currentStyle.price" style="width:180px" min="0" type="number"
                    placeholder="请输入规格售卖价格"></el-input>
        </el-form-item>

        <el-form-item label="成本价格">
          <el-input v-model="currentStyle.costPrice" style="width:180px" min="0" type="number"
                    placeholder="请输入规格初始成本价"></el-input>
        </el-form-item>


        <el-form-item label="运费模板">
          <el-select v-model="currentStyle.templateId" clearable filterable placeholder="请选择运费模板">
            <el-option
              v-for="item in expressTemplates.data"
              :key="item.templateId"
              :label="item.name"
              :value="item.templateId">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddStyle">确 定</el-button>
      </div>

    </el-dialog>

    <el-dialog title="选择其他计量单位" :visible.sync="choiceSaleDeadlineFormVisible">
     <el-radio-group v-model="goods.afterSaleDeadlineType" @change="choiceSaleDeadlineFormVisible = false;">
        <el-radio :label="1">按天</el-radio>
        <!-- <el-radio :label="2">按月</el-radio> -->
        <el-radio :label="3">按年</el-radio>
      </el-radio-group>
    </el-dialog>

    <el-dialog title="选择关键词" :visible.sync="choiceDialogFormVisible" :before-close="keywordHandleClose">
      <el-form>
        <div v-for="item in firstKeywordsArray" >
          <el-form-item :label="item.title" style="margin-bottom: 10px;">
          </el-form-item>
          <el-checkbox-group  :key="keyword" v-for="keyword in item.keywords" v-model="checkedList" @change="changeFunc">
            <el-checkbox :label="keyword" :key="keyword" style="float: left;margin-left: 10px;margin-bottom: 10px;">{{keyword}}</el-checkbox>
          </el-checkbox-group>
          <div class="" v-show="item.keywords.length == 0" style="color: #1f2d3d;margin-bottom: 10px;">
          	该分类暂无关键词
          </div>
          <div style="clear: both;"></div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChoice">取 消</el-button>
        <el-button type="primary" @click="confirmChoice">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改规格名称" :visible.sync="skuNameDialogVisible" >

      <el-form>

          <el-form-item label="规格名称">

            <el-input v-model="editSkuName.newName" placeholder="建议中文11个字符以内,英文17个字符以内" style="width:180px" type="text" maxlength="17"></el-input>

        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="skuNameDialogVisible = false;">取 消</el-button>
        <el-button type="primary" @click="confirmEditSkuName">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>

  import Sticky from '@/components/Sticky' // 粘性header组件
  import uploader from '@/utils/uploader'
  import {formatDate} from '@/commons/date.js'
  import UploadImageView from '@/pages/commons/UploadImageView.vue'
  import CouponList from './CouponList.vue'

  export default {
    name: 'saveGoods',
    components: {Sticky, UploadImageView, CouponList},
    filters: {
      formatDate(time) {
        if (!time) {
          return "无";
        }
        let date = new Date(time);
        //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    data() {
      return {
        goodsStyleCategoryRelations:[],
        activeName:'1',
        skuStates:[{status:1,name:"上架"},{status:2,name:"临时下架"},{status:4,name:"永久下架"}],
        choiceSaleDeadlineFormVisible:false,
        showChoiceBox: false,
        checkedList: [],
        checkedVal: [],
        firstArray: [],
        firstKeywordsArray: [],
        choiceDialogFormVisible: false,
        percentage: 0,
        uploading: false,
        bannerUploading: false,
        initLoadSource: false,
        styleInit: false,
        token: null,
        dialogFormVisible: false,
        currentStyle: {
          styles:[{styleNumber:""}],
          checked:true
        },
        cover: "",
        loading: false,
        goods: {
          description:'',
          afterSaleDeadlineType:3,
          basicModifyDesc:"",
          refundDeadline:7,
          exchangeDeadline:15,
          afterSaleDeadline:1,
          providerId: "",
          styles:[{styleNumber:""}]
        },
        goodsColor:{
          array:[],
          showInput:false,
          inputValue:"",
          checked:true,
          itemId:null,
          name:"",
        },
        style2:{
          array:[],
          showInput:false,
          inputValue:"",
          checked:false,
          itemId:null,
          name:"",
        },
        editAllStyle:{
          name:"",
          price:"",
          costPrice:"",
          styleNumber:"",
          templateId:null
        },
        editSkuName:{
          historyName:"",
          newName:"",
          type:null
        },
        skuNameDialogVisible:false,
        keywordsArray: [],
        serviceTagArray: [],
        cacheStyle:[],
        banners: [],
        styles: [],
        categorys: [],
        providers: [],
        filterProviders: [],
        expressTemplates: [],
        styleItem:[], 
        selectedCategorys: [{firstCategoryId: null, secondCategoryId: null,firstCategorys: [], secondCategorys: [],styleNumber:'', firstCategoryName:'',secondCategoryName:''}],
        inputVisible: false,
        serviceInputVisible: false,
        inputValue: null,
        serviceInputValue: null,
        seeGoodsDetail:false,
        styleFirstChange:true,
        style1FirstChange:true,
        goodsReloadEdit:false,
        style1Tagabled:[],
        style1TagDisbaled:[],
        style2Tagabled:[],
        style2TagDisbaled:[],
        styleStatus1Array:[],
        styleStatus2Array:[],
        styleStatus4Array:[],
      }
    },
    mounted: function () {
      this.findCategroy();
      this.findExpressTemplates();
      this.findAllProvider();
      this.findStyleItem();
    },
    methods: {
      onProviderFilter(keyword) {
        if (!keyword) {
          this.filterProviders = this.providers;
          return;
        }
        keyword = keyword.toLowerCase();
        var filterArr = [];
        this.providers.forEach((item)=> {
          var provideName = item.providerName.toLowerCase();
          var providerCode = item.providerCode.toLowerCase();
          if (provideName.indexOf(keyword) != -1 || providerCode.indexOf(keyword) != -1) {
            filterArr.push(item);
          }
        })
        this.filterProviders = filterArr;
      },
      loadData() {

        this.goodsReloadEdit = false;
      },
      callBack() {
        this.http.post(this).url(this.config.goods.callBack_base).restful({goodsId:this.goods.goodsId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '商品已撤销至初始状态可继续编辑!'});
          },
          (error) => {}
        );
      },
      changeFunc(val){
        this.checkedVal = val;
      },
      choiceKeywords() {
        //console.log(this.selectedCategorys)
        this.choiceDialogFormVisible = true;
        for(var i = 0;i < this.selectedCategorys.length;i++){

          for(var j = 0;j < this.selectedCategorys[i].firstCategorys.length;j++){
            if(this.selectedCategorys[i].firstCategoryId == this.selectedCategorys[i].firstCategorys[j].categoryId){
              var firstArray = this.selectedCategorys[i].firstCategorys[j];
              this.firstArray = firstArray;
              if(!this.selectedCategorys[i].firstCategorys[j].keywords){
                this.firstKeywordsArray.push({title:this.selectedCategorys[i].firstCategorys[j].title, keywords:[],id:this.selectedCategorys[i].firstCategorys[j].categoryId});
              } else {
                this.firstKeywordsArray.push({title:this.selectedCategorys[i].firstCategorys[j].title, keywords:this.firstArray.keywords.split(","),id:this.selectedCategorys[i].firstCategorys[j].categoryId});
              }
            }
          }

          for(var j = 0;j < this.selectedCategorys[i].secondCategorys.length;j++){
            if(this.selectedCategorys[i].secondCategoryId == this.selectedCategorys[i].secondCategorys[j].categoryId){
              var firstArray = this.selectedCategorys[i].secondCategorys[j];
              this.firstArray = firstArray;

              if(!this.selectedCategorys[i].secondCategorys[j].keywords){

              } else {
                this.firstKeywordsArray.forEach((item)=>{
                  if(item.id == this.selectedCategorys[i].secondCategorys[j].parentId){
                    this.firstArray.keywords.split(",").forEach((keyWordItem)=>{
                      item.keywords.push(keyWordItem)
                    })
                  }
                })
              }

            }
          }

        }
        //console.log(this.firstKeywordsArray)
      },
      keywordHandleClose(done) {
        done();
        this.firstKeywordsArray = [];
        this.checkedList = [];
      },
      cancelChoice(){
        this.choiceDialogFormVisible = false;
        this.firstKeywordsArray = [];
        this.checkedList = [];
      },
      confirmChoice() {
        this.choiceDialogFormVisible = false;
        var newKeywordsArray = this.keywordsArray.concat(this.checkedVal);
        var tmp = [];
        for(var i = 0;i < newKeywordsArray.length;i++){
          if(tmp.indexOf(newKeywordsArray[i]) == -1){
            tmp.push(newKeywordsArray[i]);
          }
        }
        this.keywordsArray = tmp;
        this.firstKeywordsArray = [];
        this.checkedList = [];
      },
      reset() {
        this.activeName = '1';
        this.filterProviders = this.providers;
        this.styleFirstChange = true;
        this.style1FirstChange = true;

        this.goods.styles = [];
        this.cacheStyle = [];
        this.goods.categorys = [];
        this.goods.providerId = null;
        this.goods.goodsId = null;
        this.goods.title = "";
        this.goods.goodsNumber = "";
        this.goods.description = "";
        this.goods.banner = "";
        this.goods.detailUrl = "";
        this.goods.basicModifyDesc = "";
        this.goods.refundDeadline = 7;
        this.goods.exchangeDeadline = 15;
        this.goods.afterSaleDeadline = 1;
        this.goods.afterSaleDeadlineType = 3;
        this.goods.content = null;
        this.goods.cover = null;
        this.goods.coupons = null;
        this.keywordsArray = [];
        this.serviceTagArray = [];
        this.style1Tagabled = [];
        this.style1TagDisbaled = [];
        this.style2Tagabled = [];
        this.style2TagDisbaled = [];
        this.styleStatus1Array = [];
        this.styleStatus2Array = [];
        this.styleStatus4Array = [];
        this.banners = [];
        this.styles = [];
        this.cover = "";
        this.selectedCategorys = [];
        this.inputVisible = false;
        this.inputValue = null;
        this.addCategory();
        //this.$refs.uiv.setUrls([]);
        this.checkedList = [];
        this.goodsColor = {
          array:[],
          showInput:false,
          inputValue:"",
          checked:true,
          itemId:null,
          name:"",
        }
        this.style2 = {
          array:[],
          showInput:false,
          inputValue:"",
          checked:false,
          itemId:null,
          name:"",
        }
      },
      cancel() {
        this.$emit('cancel');
        this.reset();
      },
      loadSource(source,type) {
        this.goodsReloadEdit = true;
        this.styleFirstChange = true;
        this.style1FirstChange = true;
        this.initLoadSource = true;
        this.seeGoodsDetail = type;
        if (source.keywords && source.keywords.length > 0) {
          this.keywordsArray = source.keywords.split(",");
        } else {
          this.keywordsArray = [];
        }
        if (source.serviceTags && source.serviceTags.length > 0) {
          this.serviceTagArray = source.serviceTags.split(",");
        } else {
          this.serviceTagArray = [];
        }
        let selectedCategorys = source.categorys;
        selectedCategorys.forEach((item) => {
          this.fillFirstCategory(item);
          this.fillSecondFirstCategory(item);
        });
        
        if (source.goodsStyleCategoryRelations) {
          this.setCategorySku(selectedCategorys,source.goodsStyleCategoryRelations)
        }
        this.setCategoryName(selectedCategorys)
        this.selectedCategorys = selectedCategorys;
        this.firstKeywordsArray = [];

        
        source.styles.forEach((item)=>{
          item.disabled = true;
          item.templateId = item.expressTemplateId;
          item.templateName = item.expressTemplateName;
          item.checked = (item.status == 1) ? true : false;
          this.expressTemplates.data.forEach((expressItem)=>{
            if(expressItem.templateId == item.expressTemplateId){
              item.type = expressItem.templateType;
            }
          })
        });

        this.goodsColor.checked = source.firstStyleEnabledCover;
        this.style2.checked = source.secondStyleEnabledCover;

        this.goodsColor.array = source.firstStyleItems;
        this.setStyle1Tag(source.firstStyleItems);
        this.style2.array = source.secondStyleItems;
        this.setStyle2Tag(source.secondStyleItems);
        this.goodsColor.itemId = source.firstStyleItemId;
        this.style2.itemId = source.secondStyleItemId;

        if(!source.afterSaleDeadlineType){
          source.afterSaleDeadlineType = 3;
        }
        if(!source.refundDeadline){
          source.refundDeadline = 7;
        }
        if(!source.exchangeDeadline){
          source.exchangeDeadline = 15;
        }
        if(!source.afterSaleDeadline){
          source.afterSaleDeadline = 1;
        }


        this.goods = source;
        this.styles = source.styles;
        this.setStyleStatus(source.styles);
        this.cacheStyleData(this.goodsColor.itemId,this.goodsColor.array,this.style2.itemId,this.style2.array,this.styles);

      },
      setStyleStatus(styles) {
        console.log(styles)
        let style1 = [];
        let style2 = [];
        let style3 = [];
        styles.forEach((item)=>{
          if (item.status == 1) {
            style1.push(item);
          } else if (item.status == 2) {
            style2.push(item);
          } else if (item.status == 4) {
            style3.push(item);
          }
        })

        
          
        this.selectedCategorys.forEach((categoryItem)=>{
          let flag = true;
          style1.forEach((styleItem)=>{
            if (styleItem.styleNumber == categoryItem.styleNumber) {
              flag = false;
            }
          })
          if (flag) {
            categoryItem.styleNumber = '';
          }
        })

        this.styleStatus1Array = style1;
        this.styleStatus2Array = style2;
        this.styleStatus4Array = style3;
      },
      setStyle1Tag(tagArray) {
        this.style1Tagabled = [];
        this.style1TagDisbaled = [];
        tagArray.forEach((item)=>{
          if (item.itemId) {
            this.style1TagDisbaled.push(item);
          } else {
            this.style1Tagabled.push(item);
          }
        });
      },
      setStyle2Tag(tagArray) {
        this.style2Tagabled = [];
        this.style2TagDisbaled = [];
        tagArray.forEach((item)=>{
          if (item.itemId) {
            this.style2TagDisbaled.push(item);
          } else {
            this.style2Tagabled.push(item);
          }
        });
      },
      save() {
        this.$confirm('规格和编码和永久下架的商品保存后不能被修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submit();
        }).catch(() => {
        });  
       
      },
      submit() {
        console.log(this.goods)
        //表单验证
        if (!this.goods.title) {
          this.$message({message: '商品标题不能为空', type: 'warning'});
          return;
        }
        if (!this.goods.goodsNumber) {
          this.$message({message: '商品编号不能为空', type: 'warning'});
          return;
        }
        // if (!this.goods.description) {
        //   this.$message({message: '商品简介不能为空', type: 'warning'});
        //   return;
        // }

        var categroyValidate = true;
        this.selectedCategorys.forEach((item) => {
          if (!item.firstCategoryId || !item.secondCategoryId) {
            categroyValidate = false;
            return;
          }
        });

        if (!categroyValidate) {
          this.$message({message: '请选择商品分类', type: 'warning'});
          return;
        }

        this.goods.categorys = this.selectedCategorys;

        if (!this.goods.providerId || this.goods.providerId.trim() == 0) {
          this.$message({message: '请选择供应商', type: 'warning'});
          return;
        }

        if (this.styles.length == 0) {
          this.$message({message: '商品SKU不能为空', type: 'warning'});
          return;
        }

        let flag = false;
        this.styles.forEach((item)=>{
          if (item.status == 1) {
            flag = true;
          }
        })
        if (!flag) {
          this.$message({message: '上架SKU数量不能为空', type: 'warning'});
          return;
        }

        for(var i = 0; i < this.styles.length; i++){
         this.styles[i].expressTemplateId = this.styles[i].templateId;
         if (!this.styles[i].name || this.styles[i].name.trim() == 0) {
            this.$message({message:this.styles[i].name + this.styles[i].subName +  '规格名称不能为空', type: 'warning'});
            return;
          }

          if (this.styles[i].styleNumber == '') {
            this.$message({message:this.styles[i].name + this.styles[i].subName +  'SKU编号不能为空', type: 'warning'});
            return;
          }

          if (!/^[0-9a-zA-Z]{2}$/.test(this.styles[i].styleNumber) ){
            this.$message({message:this.styles[i].name + this.styles[i].subName +  'SKU编号只能位2位数子字母', type: 'warning'});
            return;
          }

          if (this.styles[i].price == "") {
            this.$message({message:this.styles[i].name + this.styles[i].subName +  '售卖价格不能为空或格式错误', type: 'warning'});
            return;
          }
          if (this.styles[i].price <= 0) {
            this.$message({message:this.styles[i].name + this.styles[i].subName +  '售卖价格必须大于0', type: 'warning'});
            return;
          }
          if (!this.validate.validatPrice(this.styles[i].price)) {
             this.$message({message: this.styles[i].name + this.styles[i].subName + '售卖价格为2位小数或整数', type: 'warning'});
            return;
          }
          if (this.styles[i].costPrice == "") {
            this.$message({message:this.styles[i].name + this.styles[i].subName +  '成本价格不能为空或格式错误', type: 'warning'});
            return;
          }
          if (this.styles[i].costPrice <= 0) {
            this.$message({message: this.styles[i].name + this.styles[i].subName + '成本价格必须大于0', type: 'warning'});
            return;
          }
          if (!this.validate.validatPrice(this.styles[i].costPrice)) {
             this.$message({message:this.styles[i].name + this.styles[i].subName +  '成本价格为2位小数或整数', type: 'warning'});
            return;
          }

          if(+this.styles[i].price <= (+this.styles[i].costPrice)){
             this.$message({message:this.styles[i].name + this.styles[i].subName + "成本价不能大于等于售卖价", type: 'warning'});
             return;
          }

          if (!this.styles[i].templateId ) {
            this.$message({message:this.styles[i].name + this.styles[i].subName +  "请选择运费模板", type: 'warning'});
            return;
          }
          if (this.styles[i].type == 2 ) {
            if (!this.styles[i].weight) {
               this.$message({message:this.styles[i].name + this.styles[i].subName + '包装重量不能为空', type: 'warning'});
              return;
            }

            if (!this.validate.validatPrice(+(this.styles[i].weight))) {
               this.$message({message:this.styles[i].name + this.styles[i].subName +  '包装重量为2位小数或整数', type: 'warning'});
              return;
            }
          }

          if (this.styles[i].type == 4 ) {
            if (!this.styles[i].volume) {
               this.$message({message:this.styles[i].name + this.styles[i].subName +  '包装体积不能为空', type: 'warning'});
              return;
            }
            if (!this.validate.validatPrice(+(this.styles[i].volume))) {
               this.$message({message:this.styles[i].name + this.styles[i].subName +  '包装体积为2位小数或整数', type: 'warning'});
              return;
            }
          }

        }

        let styles = []
        this.styles.forEach((item)=>{
          //item.status = item.checked ? 1 : 2;
          styles.push(item)
        })

        this.goods.styles = styles;

        this.goods.firstStyleItems = this.goodsColor.array;
        this.goods.secondStyleItems = this.style2.array;

        this.goods.firstStyleItemId = this.goodsColor.itemId;
        this.goods.firstStyleItemName = this.goodsColor.name;
        this.goods.firstStyleEnabledCover = this.goodsColor.checked;

        this.goods.secondStyleItemId = this.style2.itemId;
        this.goods.secondStyleItemName = this.style2.name;
        this.goods.secondStyleEnabledCover = this.style2.checked;

        //console.log(this.keywordsArray)
        this.goods.keywords = this.keywordsArray.join(",");
        this.goods.serviceTags = this.serviceTagArray.join(",");
        // this.goods.styles.forEach((item)=>{
        //   item.expressTemplateId = item.templateId;
        // })
        
        let goodsStyleCategoryRelations = [];
        this.goods.categorys.forEach((item)=>{
          let obj = {};
          obj.categoryId = item.secondCategoryId;
          obj.styleNumber = item.styleNumber;
          goodsStyleCategoryRelations.push(obj)
        })
        this.goods.goodsStyleCategoryRelations = goodsStyleCategoryRelations;

        this.http.postJson(this).url(this.config.goods.save_url_v2).params(this.goods).request(
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

      findExpressTemplates() {
        this.http.get(this).url(this.config.goodsExpressTemplate.list_url).params({pageIndex:1,pageSize:1000}).request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }

              this.expressTemplates = response.data.data;
            }, (err) => {
            });
      },
      findCategroy() {
        this.http.get(this).url(this.config.categroy.categroy_list_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.categorys = response.data.data;
              this.selectedCategorys.forEach((selItem) => {
                this.fillFirstCategory(selItem);
              });
            }, (err) => {
            });
      },
      onFirstCategoryChange(selItem) {
        if (!this.initLoadSource) {
          selItem.secondCategoryId = null;
          this.fillSecondFirstCategory(selItem);
        }
        this.initLoadSource = false;
        this.setCategoryName(this.selectedCategorys)
        console.log(this.selectedCategorys)

      },
     onSecondCategoryChange(selItem) {
      this.setCategoryName(this.selectedCategorys)
      //console.log(selItem)
      console.log(this.selectedCategorys)
     },
     addCategory() {
        let newItem = {firstCategoryId: null, secondCategoryId: null, firstCategorys: [], secondCategorys: [],styleNumber:'',firstCategoryName:'',secondCategoryName:''};
        this.fillFirstCategory(newItem);
        this.selectedCategorys.push(newItem);
        console.log(this.selectedCategorys)
      },
      fillFirstCategory(selItem) {
        selItem.firstCategorys = [];
        this.categorys.forEach((item) => {
          if (item.parentId == null) {
            selItem.firstCategorys.push(item);
          }
        });
      },
      fillSecondFirstCategory(selItem) {
        selItem.secondCategorys = [];
        this.categorys.forEach((item) => {
          if (item.parentId == selItem.firstCategoryId) {
            selItem.secondCategorys.push(item);
          }
        });
      },
      setCategorySku(categorys,goodsStyleCategoryRelations) {
        categorys.forEach((item)=>{
          let flag = true;
          goodsStyleCategoryRelations.forEach((goodsStyleCategoryItem)=>{
            if (item.secondCategoryId == goodsStyleCategoryItem.categoryId) {
              item.styleNumber = goodsStyleCategoryItem.styleNumber;
              flag = false;
            }
          })
          if (flag) {
            item.styleNumber = '';
          }
        })
      },
      setCategoryName(categorys) {
        categorys.forEach((item)=>{
          let firstFlag = true;
          let secondFlag = true;
          item.firstCategorys.forEach((firstCategoryItem)=>{
            if (firstCategoryItem.categoryId == item.firstCategoryId) {
              item.firstCategoryName = firstCategoryItem.name;
              firstFlag = false;
            }
          })
          item.secondCategorys.forEach((secondCategoryItem)=>{
            if (secondCategoryItem.categoryId == item.secondCategoryId) {
              item.secondCategoryName = secondCategoryItem.name;
              secondFlag = false;
            }
          })
          if (firstFlag) {
            item.firstCategoryName = '';
          }
          if (secondFlag) {
            item.secondCategoryName = '';
          }
        })
      },
      categoryStyleChange(value) {
        if (value) {
          let number = 0;
          this.selectedCategorys.forEach((item)=>{
            if (item.styleNumber && (item.styleNumber == value)) {
              number++;
            }
          })
          if (number > 1) {
            this.$message({message:'注意! 存在多个商品类目和同一个商品SKU相对应情况',type:"warning"})
          }
        }
      },
      delCategory(selItem) {
        
        let index = this.selectedCategorys.indexOf(selItem);
        this.selectedCategorys.splice(index, 1);
        
      },
      findAllProvider() {
        this.http.get(this).url(this.config.provider.provider_all_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.filterProviders = this.providers = response.data.data;
            }, (err) => {
            });
      },
      findStyleItem() {
        this.http.get(this).url(this.config.goods.style_item).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.styleItem = response.data.data;
          }, (err) => {});
      },
      onAddStyle() {
        this.dialogFormVisible = true;
        this.currentStyle = {
          styleId:null,
          name: "",
          price: 0,
          costPrice: 0,
          styleNumber:"",
          templateName:"",
          expressTemplateName:"",
          templateId:null,
          expressTemplateId:null
        };

      },
      confirmAddStyle() {

        if (!this.currentStyle.name || this.currentStyle.name.trim() == 0) {
          this.$message({message: '规格名称不能为空', type: 'warning'});
          return;
        }

        if (this.currentStyle.styleNumber == '') {
          this.$message({message: '规格编号不能为空', type: 'warning'});
          return;
        }

        if (this.currentStyle.price == "") {
          this.$message({message: '售卖价格不能为空或格式错误', type: 'warning'});
          return;
        }
        if (this.currentStyle.price <= 0) {
          this.$message({message: '售卖价格必须大于0', type: 'warning'});
          return;
        }

        if (this.currentStyle.costPrice == "") {
          this.$message({message: '成本价格不能为空或格式错误', type: 'warning'});
          return;
        }
        if (this.currentStyle.costPrice <= 0) {
          this.$message({message: '成本价格必须大于0', type: 'warning'});
          return;
        }

        if (!this.currentStyle.templateId ) {
          this.$message({message: "请选择运费模板", type: 'warning'});
          return;
        }

        console.log(this.currentStyle.templateId)

        this.expressTemplates.data.forEach((item)=>{
          if(item.templateId == this.currentStyle.templateId){
            this.currentStyle.templateName = item.name;
            this.currentStyle.expressTemplateId = item.templateId;
            this.currentStyle.expressTemplateName = item.expressTemplateName
            //console.log(this.currentStyle.templateName,this.currentStyle.templateId)
          }
        })

        if (this.currentStyle.state === "edit") {
          let source = this.currentStyle.source;
          source.styleId = this.currentStyle.styleId;
          source.name = this.currentStyle.name;
          source.price = this.currentStyle.price;
          source.costPrice = this.currentStyle.costPrice;
          source.styleNumber = this.currentStyle.styleNumber;
          source.templateId = this.currentStyle.templateId;
          source.expressTemplateId = this.currentStyle.expressTemplateId;
          source.expressTemplateName = this.currentStyle.expressTemplateName;
          source.templateName = this.currentStyle.templateName;
        } else {
          this.styles.push(this.currentStyle);
        }
        console.log(this.currentStyle,this.styles)
        this.currentStyle = {};
        this.dialogFormVisible = false;
      },
      delStyle(style) {
        this.styles.splice(this.styles.indexOf(style), 1);
      },
      onEditStyle(style) {
        let proxyItem = jQuery.extend({}, style);
        proxyItem.source = style;
        proxyItem.state = "edit";
        this.currentStyle = proxyItem;
        this.dialogFormVisible = true;
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      showServiceInput() {
        this.serviceInputVisible = true;
        this.$nextTick(_ => {
          this.$refs.serviceTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.keywordsArray.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleClose(tag) {
        this.keywordsArray.splice(this.keywordsArray.indexOf(tag), 1);
      },
      handleServiceInputConfirm() {
        let serviceInputValue = this.serviceInputValue;
        if (serviceInputValue) {
          this.serviceTagArray.push(serviceInputValue);
        }
        this.serviceInputVisible = false;
        this.serviceInputValue = '';
      },
      serviceHandleClose(tag) {
        this.serviceTagArray.splice(this.serviceTagArray.indexOf(tag), 1);
      },
      addColor() {
        if(!this.goodsColor.itemId){
          this.$message({message:"请先选择规格",type:"warning"});
          return ;
        }
        this.goodsColor.showInput = true;
         this.$nextTick(_ => {
          this.$refs.colorInput.$refs.input.focus();
        });
      },
      colorClose(color,event){
        event.cancelBubble = true;

        if(this.goodsColor.array.length == 1){
          this.$message({message: "规格一标签不能为空", type: 'warning'});
          return ;
        }
        this.goodsColor.array.splice(this.goodsColor.array.indexOf(color), 1);
        for(var i = 0; i < this.styles.length; i++) {
          if(this.styles[i].name == color.name){
            this.styles.splice(i,1);
            i--;
          }
        }
        this.setStyle1Tag(this.goodsColor.array);
        this.setStyleStatus(this.styles);
        this.cacheStyleData(this.goodsColor.itemId,this.goodsColor.array,this.style2.itemId,this.style2.array,this.styles);
        console.log()

        //this.setStyle();
      },
      colorInputConfirm() {
        let inputValue = this.goodsColor.inputValue;
        //console.log(this.goodsColor.array)
        let flag = true;
        this.goodsColor.array.forEach((item)=>{
          if(item.name == inputValue){
            flag = false;
          }
        })
        if (inputValue && flag) {
          var obj = {};
          obj.name = inputValue;
          this.goodsColor.array.push(obj);
          this.setStyle1Tag(this.goodsColor.array);
          if(this.style2.array.length){
            this.style2.array.forEach((item)=>{
              //console.log(inputValue+"-"+item.name)
              var obj = {};
              //obj.name = "";//(inputValue+"-"+item.name);
              obj.price = "";
              obj.costPrice = "";
              obj.styleNumber = "";
              obj.templateId = null;
              obj.checked = true;
              obj.weight = "";
              obj.volume = "";
              obj.type = 0;
              obj.status = 1;
              obj.name = inputValue;
              obj.subName = item.name;
              this.styles.push(obj);
            })
            this.setStyleStatus(this.styles);
            this.cacheStyleData(this.goodsColor.itemId,this.goodsColor.array,this.style2.itemId,this.style2.array,this.styles);
          }
        }
        this.goodsColor.showInput = false;
        this.goodsColor.inputValue = '';
        //this.setStyle();
      },
      addColor1() {
        if(!this.style2.itemId){
          this.$message({message:"请先选择规格",type:"warning"});
          return ;
        }
        this.style2.showInput = true;
        this.$nextTick(_ => {
          this.$refs.styleInput.$refs.input.focus();
        });
      },
      colorClose1(style,event){
        event.cancelBubble = true;

        if(this.style2.array.length == 1){
          this.$message({message: "规格二标签不能为空", type: 'warning'});
          return ;
        }
        this.style2.array.splice(this.style2.array.indexOf(style), 1);
        for(var i = 0; i < this.styles.length; i++) {
          if(this.styles[i].subName == style.name){
            this.styles.splice(i,1);
            i--;
          }
        }
        this.setStyle2Tag(this.style2.array);
        this.setStyleStatus(this.styles);
        this.cacheStyleData(this.goodsColor.itemId,this.goodsColor.array,this.style2.itemId,this.style2.array,this.styles);
        //this.setStyle();
      },
      colorInputConfirm1() {
        let inputValue = this.style2.inputValue;
        //console.log(inputValue)
        let flag = true;
        this.style2.array.forEach((item)=>{
          if(item.name == inputValue){
            flag = false;
          }
        })
        if (inputValue && flag) {
          var obj = {};
          obj.name = inputValue;
          this.style2.array.push(obj);
          this.setStyle2Tag(this.style2.array);
          //console.log(this.style2)
          if(this.goodsColor.array.length){
            this.goodsColor.array.forEach((item)=>{
              var obj = {};
              //obj.name = "";//(item.name+"-"+inputValue);
              obj.price = "";
              obj.costPrice = "";
              obj.styleNumber = "";
              obj.templateId = null;
              obj.checked = true;
              obj.weight = "";
              obj.volume = "";
              obj.type = 0;
              obj.status = 1;
              obj.name = item.name;
              obj.subName = inputValue;
              this.styles.push(obj);
            })
            this.setStyleStatus(this.styles);
            this.cacheStyleData(this.goodsColor.itemId,this.goodsColor.array,this.style2.itemId,this.style2.array,this.styles);
          }
        }
        this.style2.showInput = false;
        this.style2.inputValue = '';
        //this.setStyle();
      },
      cacheStyleData(firstStyleItemId,firstStyleArray,secondStyleItemId,secondStyleArray,style) {
        console.log(this.cacheStyle)
        var flag = true;
        var obj = {};
        obj.firstStyleItemId = firstStyleItemId;
        obj.firstStyleArray = firstStyleArray;
        obj.secondStyleItemId = secondStyleItemId;
        obj.secondStyleArray = secondStyleArray;
        obj.style = style;
        for(var i = 0; i < this.cacheStyle.length; i++){

          if(this.cacheStyle[i].firstStyleItemId == firstStyleItemId && this.cacheStyle[i].secondStyleItemId == secondStyleItemId ){
            this.cacheStyle.splice(i,1,obj);
            //console.log("+++-----+")
            flag = false;
          }
        }
        if(flag){
          this.cacheStyle.push(obj);
        }
        //console.log(this.cacheStyle)
      },
      getCacheStyle(firstStyleItemId,secondStyleItemId,type) {
        var flag = true;
        for(var i = 0; i < this.cacheStyle.length; i++){
          if(this.cacheStyle[i].firstStyleItemId == firstStyleItemId && this.cacheStyle[i].secondStyleItemId == secondStyleItemId ){
            this.styles = this.cacheStyle[i].style;
            this.setStyleStatus(this.styles);
            this.goodsColor.array = this.cacheStyle[i].firstStyleArray;
            this.setStyle1Tag(this.goodsColor.array);
            this.style2.array = this.cacheStyle[i].secondStyleArray;
            this.setStyle2Tag(this.style2.array);
            flag = false;
          }
        }
        if(flag) {
          this.styles = [];
          this.setStyleStatus(this.styles);
          if (type) {
            this.goodsColor.array = [];
            this.setStyle1Tag(this.goodsColor.array);
          }else{
            this.style2.array = [];
            this.setStyle2Tag(this.style2.array);
          }
        }
      },
      styleChange(value){
        console.log(value)
        if(this.styleFirstChange){
          this.styleFirstChange = false;
        }else{
          //this.goodsColor.array = [];
          this.getCacheStyle(value,this.style2.itemId,true);
          //this.styles = [];
        }
        if(value){
          if(value == this.style2.itemId){
            this.$message({message: "两规格名称不能相同", type: 'warning'});
            this.goodsColor.itemId = null;
            this.goodsColor.name = "";
          }else{
            this.goodsColor.name = this.findStyleName(value);
            if(this.goodsColor.array.length && this.goodsColor.name) {

            }
          }
        }else {
          this.goodsColor.name = "";
        }
      },
      style1Change(value){
        console.log(value)
        if(this.style1FirstChange){
          this.style1FirstChange = false;
        }else{
        this.getCacheStyle(this.goodsColor.itemId,value,false);
         //this.style2.array = [];
         //this.styles = [];
        }

        if(value){
          if(value == this.goodsColor.itemId){
            this.$message({message: "两规格名称不能相同", type: 'warning'});
            this.style2.itemId = null;
            this.style2.name = "";
          }else{
            this.style2.name = this.findStyleName(value);
            if(this.style2.name && this.style2.array.length){

            }
          }
        }else{
          this.style2.name = "";
        }
      },
      findStyleName(value) {
        for (var i = 0; i < this.styleItem.length; i++){
          if(this.styleItem[i].itemId == value){
            return this.styleItem[i].name;
          }
        }
      },
      editStyleAll() {
        console.log(this.styles)
        if (!this.editAllStyle.name || this.editAllStyle.name.trim() == 0) {
          this.$message({message: '规格名称不能为空', type: 'warning'});
          return;
        }

        if (this.editAllStyle.styleNumber == '') {
          this.$message({message: '规格编号不能为空', type: 'warning'});
          return;
        }

        if (this.editAllStyle.price == "") {
          this.$message({message: '售卖价格不能为空或格式错误', type: 'warning'});
          return;
        }
        if (this.editAllStyle.price <= 0) {
          this.$message({message: '售卖价格必须大于0', type: 'warning'});
          return;
        }

        if (this.editAllStyle.costPrice == "") {
          this.$message({message: '成本价格不能为空或格式错误', type: 'warning'});
          return;
        }
        if (this.editAllStyle.costPrice <= 0) {
          this.$message({message: '成本价格必须大于0', type: 'warning'});
          return;
        }

        if (!this.editAllStyle.templateId ) {
          this.$message({message: "请选择运费模板", type: 'warning'});
          return;
        }
        this.styles.forEach((item)=>{
          item.name = this.editAllStyle.name;
          item.styleNumber = this.editAllStyle.styleNumber;
          item.price = this.editAllStyle.price;
          item.costPrice = this.editAllStyle.costPrice;
          item.templateId = this.editAllStyle.templateId;
        });

      },
      setStyle() {
        this.styles = [];
        if (this.goodsColor.array.length && this.style2.array.length){
          for(var i = 0; i < this.goodsColor.array.length; i++){
            for(var j = 0; j < this.style2.array.length; j++){
              var obj = {};
              obj.name = this.goodsColor.array[i].name+"-"+this.style2.array[j].name;
              obj.price = 0;
              obj.costPrice = 0;
              obj.styleNumber = "";
              obj.templateId = null;
              obj.checked = true;
              obj.status = 1;
              obj.name = this.goodsColor.array[i].name;
              obj.subName = this.style2.array[j].name;
              this.styles.push(obj);
            }
          }
        }
      },
      checkAll(selection){
        if (selection.length) {
          this.styles.forEach((item)=>{
            item.checked = true;
          })
        }else{
          this.styles.forEach((item)=>{
            item.checked = false;
          })
        }
      },
      expressChange(data){
        //data.volume = "";
        //data.weight = "";
        this.expressTemplates.data.forEach((item)=>{
          if(item.templateId == data.templateId){
            data.type = item.templateType
          }
        })
        console.log(data)
      },
      editSkuStyleName(skuNme,type){
         console.log(skuNme);
         this.editSkuName = {
          historyName:"",
          newName:"",
          type:null,
        };
        this.editSkuName.historyName = skuNme.name;
        this.editSkuName.newName = skuNme.name;
        this.editSkuName.type = type;
        this.skuNameDialogVisible = true;
      },
      eidtStyleName(styleArray,type) {
          let style1Number = 0;
          let style1Flage = true;
          for(var i = 0; i < styleArray.length; i++){
            if(styleArray[i].name == this.editSkuName.historyName){
              style1Number = i;
            }
            if(styleArray[i].name == this.editSkuName.newName){
              style1Flage = false;
            }
          }

          if(style1Flage) {
            styleArray[style1Number].name = this.editSkuName.newName;
            if (type == 1) {
              this.setStyle1Tag(styleArray);
            } else {
              this.setStyle2Tag(styleArray);
            }
            return true;
          } else {
            this.$message({message: "规格名称不能和原名称或者已有重复", type: 'warning'});
            return false;
          }
      },
      confirmEditSkuName() {
        //console.log(this.editSkuName)
        if(this.editSkuName.type == 1){
          let type = this.eidtStyleName(this.goodsColor.array,this.editSkuName.type);
          if(!type){
            return;
          }
        } else {
          let type1 = this.eidtStyleName(this.style2.array,this.editSkuName.type);
          if(!type1){
            return;
          }
        }

        this.styles.forEach((item)=>{
          if(this.editSkuName.type == 1){
              if(item.name == this.editSkuName.historyName){
                item.name = this.editSkuName.newName;
              }
            } else {
              if(item.subName == this.editSkuName.historyName){
                item.subName = this.editSkuName.newName;
              }
            }
          });
        this.setStyleStatus(this.styles);
        this.skuNameDialogVisible = false;
      },
      skuStateChange(data){
        if (data.styleId) {
          this.http.get(this).url(this.config.goods.check_sku).restful({styleId:data.styleId}).request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              let res = response.data.data;
              if (res.planRef) {
                this.$message({message:'该SKU被方案所引用不能改变', type: 'error'});
                data.status = 1;
              } else {
                data.disabled = false;
                this.setStyleStatus(this.styles);
              }
            },(error) => {console.log(error)}
          );
        } else {
          data.disabled = false;
          this.setStyleStatus(this.styles);
        }
      },
      skuStateClick1(data,type){
        this.$confirm('SKU永久下架保存后不能被修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.skuStateClick(data,type);
        }).catch(() => {});  
      },
      skuStateClick(data,type){
        if (data.styleId) {
          this.http.get(this).url(this.config.goods.check_sku).restful({styleId:data.styleId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            let res = response.data.data;
            if (res.planRef) {
              this.$message({message:'该SKU被方案所引用不能改变', type: 'error'});
            } else {
              data.status = type;
              data.disabled = false;
              this.setStyleStatus(this.styles);
            }
          },(error) => {console.log(error)}
          );
        } else {
          data.disabled = false;
          data.status = type;
          this.setStyleStatus(this.styles);
        }
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" >
  @import "src/styles/mixin.scss";
  #saveGoodsBasic_vue{
    #basicInform{
      .sub-navbar{
        z-index: 999;
      }
    .el-select{
        .is-disabled{
          input{
            color: #333;
          }
        }
      }
    }
    .title-prompt {
      position: absolute;
      right: 0px;
      font-size: 12px;
      top: 10px;
      color: #ff4949;
    }
    .createPost-container {
      position: relative;

      .createPost-main-container {
        padding: 40px 45px 20px 50px;

        .postInfo-container {
          position: relative;
          @include clearfix;
          margin-bottom: 10px;

          .postInfo-container-item {
            float: left;
          }

        }
        .editor-container {
          min-height: 500px;
          margin: 0 0 30px;
          .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
              display: inline-block;
            }
          }
        }
      }
      .word-counter {
        width: 40px;
        position: absolute;
        right: -10px;
        top: 0px;
      }

    }
    .skuChangeBox{
      padding:8px 0;
      >button{
        width:70px;
        margin-bottom:5px;
      }
      >button:last-child{
        margin-bottom:0;
        margin-left: 0;
      }
    }
  }
</style>
