<template>
  <div class="createPost-container" id="saveGoodsContent_vue">
    
      <sticky :className="'sub-navbar'" style="z-index:999;">
        <template>
          <el-button type="primary" @click="save(true)" v-show='!putDataLoading'>提交至商品营销团队</el-button>
          <el-button icon="loading" type="primary" v-show="putDataLoading">商品保存中</el-button>

          <el-button type="primary" @click="save(false)">生成预览</el-button>
            <div style="position:absolute;width:88px;height:88px;right:90px;bottom:-96px;text-align:center;">
              <div id="qrcodeBox" style="width:88px;height:88px;border:1px solid #999;padding:3px;" v-show="showBarCode">
                
              </div>
              <i class="el-icon-loading" v-show="showLoading" style="position:absolute;top:40px;left:50%;margin-left:-8px;"></i>
              <i @click="showBarCode = false;" v-show="showBarCode"  id="closeCode" class="el-icon-circle-cross" style="cursor:pointer;"></i>
            </div>
          <el-button @click="cancel">取 消</el-button>
        </template>  
      </sticky>
      <el-row :gutter="20" style="margin-top:20px;position:relative;">
       <div id="goods_box">
        <div id="phone_box">
         <div  style="width:377px;height:666px;overflow:hidden;position:absolute;top:109px;left:29px;">
          <div id="goods_content">
            
            <div class="block banner" style="background:#999;" v-for="style in styles" v-if="style.bannerActive">
              <el-carousel height="320px"  trigger="click" v-if="style.banners.length > 1 || style.banners.length == 0">
                <el-carousel-item v-for="item in style.banners" :key="item">
                  <img :src="item" style="width:100%;height:100%;">
                </el-carousel-item>
              </el-carousel>
              <img :src="style.banners[0]" v-if="style.banners.length == 1" style="width:377px;height:320px;">
            </div>
            

            <p style="color:#343434;font-size:18px;font-weight:700;">{{goods.title}}</p>
            <p style="color:#999;font-size:14px;">{{goods.description}}</p>
            <p style="margin-top:20px;font-size:18px;color:#333;">￥{{currentStyle.price}}</p>
            <p style="width:350px;margin:auto;background:#ddd;height:1px;margin-top:20px;"></p>
            <p style="color:#666;margin-top:20px;">规格</p>
           
            <div style="width:375px;height:auto;padding-left:20px;padding-right:20px;overflow:hidden;margin-top:20px;">
              <div style="width:60px;height:auto;float:left;margin-right:20px;" v-for="(style,index) in styles" @click="choiceStyle(style)">
                <div v-show="style.cover" class="el-upload el-upload--picture-card" style="width:60px;height:60px;line-height:65px;" >
                  <img style="width:100%; height:100%" :src="style.cover+config.imgtmb._200">
                </div>
                <div v-show="!style.cover">
                  <div class="el-upload el-upload--picture-card" style="width:60px;height:60px;line-height:65px;background:#999;">
                  </div>
                </div>
                <p style="text-align:center;font-size:12px;">{{style.name +"-"+ style.subName}}</p>
              </div>
            </div>

            <div id="detail">
              <h3 style="padding-left:10px;">详情页栏目</h3>

              <!-- <p class="content_title">标题文字</p> -->
              <div class="title" style="text-align:center;margin-bottom:37px;height:42px;">
                  <el-input style="width:220px; text-align: center;height:42px;color:#343434;font-size:16px;" type="textarea" :rows="2"  placeholder="请输入标题" v-model="detailContent.title.title"></el-input>   
                  <!-- <el-input type="textarea"  :rows="2"  placeholder="请输入标题描述" v-model="detailContent.title.desc"></el-input>    -->
              </div>

              <!-- <p class="content_title">标题图片</p> -->
              <p style="color:#ff4949;" v-show="!detailContent.titleImage.url">1024*1034(建议为横构图)</p>
              <div v-show="detailContent.titleImage.url"  style="width:100%;height:auto;display:block;">
                <img id="detailTitleImage" title="点击修改图片" style="width:100%; height:auto"
                     :src="detailContent.titleImage.url">
              </div>
              <div v-show="!detailContent.titleImage.url" style="display:block;text-align:center">
                <div class="el-upload el-upload--picture-card"  id="detailTitleImageBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
              
              <div class="content_title" style="display:flex;align-items:center;margin:35px 0 25px 20px;"><p style="margin:0;text-align:left;font-weight:700;color:#343434;">Dimension <br>尺寸</p><el-button style="margin-left:20px;" type="primary" size="small" @click="editDim">添加尺寸</el-button> </div>
             

              <p style="color:#343434;font-size:18px;font-weight:700;margin:0 auto 16px;">{{currentDim.name}}</p>
              <img :src="currentDim.image" style="width:100%;height:200px;background:#999;">
              <div class="dimContent" style="padding-top:20px;padding-bottom:30px;">
                <div v-for="(dim,index) in detailContent.dim" @click="dimClick(dim,index)">
                  <p> <img  :src="dim.cover"></p>
                  <el-button icon="edit" size="mini" @click="onEditDim(dim,index)">编辑 </el-button>
                  <el-button style="margin-left:0;margin-top:10px;" icon="delete" size="mini" type="danger" @click="deleteDim(dim,index)">删除</el-button>
                </div>
              </div>

              <!-- <p class="content_title">详情参数规格</p> -->
               <div style="display:flex;align-items:center;margin:0 0 25px 20px;">
                <p style="margin:0;text-align:left;font-weight:700;color:#343434;">Parameter<br>详细参数规格</p>
                <el-button type="primary" size="small" style="margin-left:20px;" @click="addPar">添加</el-button>    
              </div>   

              <div style="padding-left:20px;padding-right:20px;margin-bottom:40px;">
                <p v-for="(par,index) in detailContent.parameter" style="text-align:center;overflow:hidden;border-bottom:0;position:relative;margin:0;" class="parameter">
                    <span style="color:#333;display:inline-block;width:30%;padding:0;float:left;text-align:left;">{{par.name}}</span>
                    <span style="color:#666;display:inline-block;width:40%;padding:0;float:left;text-align:left;">{{par.value}}</span>
                    <el-button style="position:absolute;top:12px;right:55px;" icon="edit" size="mini" @click="onEditPar(par,index)">编辑 </el-button>
                    <el-button style="position:absolute;top:12px;right:0;" icon="delete" size="mini" type="danger" @click="deletePar(par,index)">删除</el-button>
                 </p>
              </div>

              <!-- <p class="content_title">角度图</p> -->
              <div class="content_title" style="display:flex;align-items:center;margin:30px 0 0 20px;">
                  <p style="margin:0;text-align:left;font-weight:700;color:#343434;">Vision <br>视图</p>
              </div>

              <p style="color:#ff4949;" v-show="!detailContent.angleImage[0].url">建议尺寸1024*819</p>
              <div class="angleImage_content">

                <div v-show="detailContent.angleImage[0].url"  style="width:100%;height:auto;display:block;overflow:hidden;">
                  <img id="angleImage0" title="点击修改图片" style="width:100%; height:auto;float:left;"
                       :src="detailContent.angleImage[0].url">
                </div>
                <div v-show="!detailContent.angleImage[0].url" style="display:block;text-align:center">
                  <div class="el-upload el-upload--picture-card"  id="angleImageBtn0">
                    <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                  </div>
                </div>
<!-- 
                <div v-show="detailContent.angleImage[1].url"  style="width:100%;height:233px;display:block;">
                  <img id="angleImage1" title="点击修改图片" style="width:100%; height:100%"
                       :src="detailContent.angleImage[1].url+config.imgtmb._200">
                </div>
                <div v-show="!detailContent.angleImage[1].url" style="display:block;text-align:center">
                  <div class="el-upload el-upload--picture-card"  id="angleImageBtn1">
                    <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                  </div>
                </div>

                <div v-show="detailContent.angleImage[2].url"  style="width:100%;height:233px;display:block;">
                  <img id="angleImage2" title="点击修改图片" style="width:100%; height:100%"
                       :src="detailContent.angleImage[2].url+config.imgtmb._200">
                </div>
                <div v-show="!detailContent.angleImage[2].url" style="display:block;text-align:center">
                  <div class="el-upload el-upload--picture-card"  id="angleImageBtn2">
                    <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                  </div>
                </div>
                 -->

                 
                <div style="margin:0;">
                  <div v-for="(item,index) in detailContent.moreAngleImage" style="text-align:center;">
                    <img style="width:100%; height:300px;display:block;" :src="item.cover">
                    <el-button icon="edit" size="mini" @click="onEditAngle(item,index)">编辑</el-button>
                    <el-button style="margin-left:0;margin-top:10px;" icon="delete" size="mini" type="danger" @click="deleteAngle(item,index)">删除</el-button>
                  </div>
                </div>
                 <div style="text-align:center;">
                  <el-button  type="primary" size="small" @click="addAngle">添加更多角度图</el-button>    
                </div> 

              </div>

              <div style="display:flex;align-items:center;margin:30px 0 40px 20px;">
                <p style="margin:0;text-align:left;font-weight:700;color:#343434;">Detail<br>细节</p>
                <!-- <p style="color:#ff4949;">建议尺寸窄图640*753，宽图1024*742</p> -->
              </div>  

              <div style="padding-left:15px;padding-right:15px;overflow:hidden;" id="details">
                <div class="deatil_top">
                  <div class="left">

                    <div v-show="detailContent.detail[0].image"  style="width:100%;height:200px;display:block;">
                      <img id="detailImage0" title="点击修改图片" style="width:100%; height:100%"
                           :src="detailContent.detail[0].image">
                    </div>
                    <div v-show="!detailContent.detail[0].image" style="display:block;text-align:center">
                      <div class="el-upload el-upload--picture-card"  id="detailImageBtn0">
                        <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                      </div>
                    </div>
                    <el-input type="textarea" :rows="2"  placeholder="请输入细节标题" v-model="detailContent.detail[0].title"></el-input> 
                    <el-input type="textarea"  :rows="2"  placeholder="请输入细节描述" v-model="detailContent.detail[0].desc"></el-input> 
                  </div>
                  <div class="right">
                    <div v-show="detailContent.detail[1].image"  style="width:100%;height:200px;display:block;">
                      <img id="detailImage1" title="点击修改图片" style="width:100%; height:100%"
                           :src="detailContent.detail[1].image">
                    </div>
                    <div v-show="!detailContent.detail[1].image" style="display:block;text-align:center">
                      <div class="el-upload el-upload--picture-card"  id="detailImageBtn1">
                        <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                      </div>
                    </div>
                    <el-input type="textarea" :rows="2"  placeholder="请输入细节标题" v-model="detailContent.detail[1].title"></el-input> 
                    <el-input type="textarea"  :rows="2"  placeholder="请输入细节描述" v-model="detailContent.detail[1].desc"></el-input> 
                  </div>
                </div>  
                <div class="detail_bottom" style="margin-top:10px;">
                  <div v-show="detailContent.detail[2].image"  style="width:100%;height:250px;display:block;">
                      <img id="detailImage2" title="点击修改图片" style="width:100%; height:100%"
                         :src="detailContent.detail[2].image">
                  </div>
                  <div v-show="!detailContent.detail[2].image" style="display:block;text-align:center">
                    <div class="el-upload el-upload--picture-card"  id="detailImageBtn2">
                      <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                    </div>
                  </div>
                  <p style="text-align:center;margin-bottom:10px;"><el-input type="textarea"  placeholder="请输入细节标题" v-model="detailContent.detail[2].title"></el-input></p> 
                  <el-input class="detail3_textarea" type="textarea" style="margin-top:0;" :rows="2"  placeholder="请输入细节描述" v-model="detailContent.detail[2].desc"></el-input> 
                </div>
              </div>  

              <!-- <p class="content_title">实物场景图片</p>   -->
              <div style="display:flex;align-items:center;margin:30px 0 0 20px;">
                <p style="margin:0;text-align:left;font-weight:700;color:#343434;">实物场景展示</p>
                <!-- <p style="color:#ff4949;">建议尺寸窄图640*753，宽图1024*742</p> -->
              </div> 
              <p style="color:#ff4949;" v-show="!detailContent.sceneImage[0].url" >建议尺寸1024*764</p>
              <div>

                <div style="margin-top:20px;">
                  <div v-show="detailContent.sceneImage[0].url"  style="width:100%;height:auto;display:block;">
                      <img id="sceneImage" title="点击修改图片" style="width:100%; height:auto;"
                         :src="detailContent.sceneImage[0].url">
                  </div>
                  <div v-show="!detailContent.sceneImage[0].url" style="display:block;text-align:center">
                    <div class="el-upload el-upload--picture-card"  id="sceneImageBtn">
                      <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                    </div>
                  </div>
                  <p style="text-align:center;margin-bottom:0;"><el-input type="text"  placeholder="请输入实物场景标题" v-model="detailContent.sceneImage[0].title"></el-input></p> 
                  <el-input type="textarea"  :rows="2"  placeholder="请输入实物场景描述" v-model="detailContent.sceneImage[0].desc"></el-input> 
                </div> 

      <!--           <div style="margin-top:10px;">
                  <div v-show="detailContent.sceneImage[1].url"  style="width:100%;height:240px;display:block;">
                      <img id="sceneImage1" title="点击修改图片" style="width:100%; height:100%"
                         :src="detailContent.sceneImage[1].url+config.imgtmb._200">
                  </div>
                  <div v-show="!detailContent.sceneImage[1].url" style="display:block;text-align:center">
                    <div class="el-upload el-upload--picture-card"  id="sceneImageBtn1">
                      <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                    </div>
                  </div>
                  <p style="text-align:center;"><el-input type="text"  placeholder="请输入细节标题" v-model="detailContent.sceneImage[1].title"></el-input></p> 
                  <el-input type="textarea"  :rows="2"  placeholder="请输入细节描述" v-model="detailContent.sceneImage[1].desc"></el-input> 
                </div>  -->

               
                <div v-for="(sceneImage,index) in detailContent.moreSceneImage">
                  <p><img :src="sceneImage.url" style="width:100%;height:auto;"></p>
                  <p style="margin-bottom:0;color:#343434;width:350px;margin:auto;text-align:left;font-weight:700;">{{sceneImage.title}}</p>
                  <p style="color:#666;margin:5px auto 0;width:350px;text-align:left;">{{sceneImage.desc}}</p>
                  <p>
                    <el-button icon="edit" size="mini" @click="onEditScene(sceneImage,index)">编辑</el-button>
                    <el-button style="margin-left:0;margin-top:10px;" icon="delete" size="mini" type="danger" @click="deleteScene(sceneImage,index)">删除</el-button>
                  </p>
                </div>  

                 <div style="text-align:center;margin-top:20px;">
                  <el-button  type="primary" size="small" @click="addScene">添加更多实物场景图</el-button>    
                </div>


              </div>

            </div>
          </div>     
         </div>   
        </div>

        <div id="tip">
          <h3>编辑的内容步骤</h3>
          <p>1.设置商品封面:  <span style="color:#FF4949">建议尺寸为640*640</span> </p>  
          <div>
            <el-progress v-show="coverUpload.uploading" type="circle" :percentage="percentage"></el-progress>

            <div v-show="coverUpload.cover && !coverUpload.uploading" class="el-upload el-upload--picture-card" style="margin-right:2px;">
              <img id="uploadCover" title="点击修改图片" style="width:100%; height:100%" :src="coverUpload.cover+config.imgtmb._200">
            </div>

            <div v-show="!coverUpload.cover && !coverUpload.uploading" style="display:inline-block; margin-left:8px">
              <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
                <i data-v-5b37d0d4="" class="el-icon-plus"></i>
              </div>
            </div>
          </div>
          <p v-if="goods.firstStyleEnabledCover">设置{{goods.firstStyleItemName}}封面</p>
          <el-table :data="goods.firstStyleItems" width="100%" border v-if="goods.firstStyleEnabledCover" style="margin-bottom:20px;">

            <el-table-column prop="name" :label="goods.firstStyleItemName">
            </el-table-column>

            <el-table-column align="center" :label="goods.firstStyleItemName+'封面图'">
              <template scope="scope">
                <img :src="scope.row.cover +config.imgtmb._50" style="width:50px;height:50px;" v-if="scope.row.cover">
                <span style="color:orangered;" v-else>无</span>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="'设置'+goods.firstStyleItemName +'封面'">
              <template scope="scope">
                <div>
                  <el-button  type="text" size="large" @click="uploadStyle1(scope.row,scope.$index)">{{scope.row.cover ? "修改封面" : "上传封面"}} </el-button>
                </div>
              </template>
            </el-table-column>

          </el-table>
          <p v-if="goods.secondStyleEnabledCover">设置{{goods.secondStyleItemName}}封面</p>
          <el-table :data="goods.secondStyleItems" width="100%" border v-if="goods.secondStyleEnabledCover" style="margin-bottom:20px;">

            <el-table-column prop="name" :label="goods.secondStyleItemName">
            </el-table-column>

            <el-table-column align="center" :label="goods.secondStyleItemName+'封面图'">
              <template scope="scope">
                <img :src="scope.row.cover +config.imgtmb._50" style="width:50px;height:50px;" v-if="scope.row.cover">
                <span style="color:orangered;" v-else>无</span>
              </template>
            </el-table-column>
          
            <el-table-column align="center" :label="'设置'+goods.secondStyleItemName+'封面'">
              <template scope="scope">
                <el-button  type="text" size="large" @click="uploadStyle2(scope.row,scope.$index)">{{scope.row.cover ? "修改封面" : "上传封面"}} </el-button>
              </template>
            </el-table-column>

          </el-table>
          <p>2.编辑商品SKU封面和轮播图</p>
          <el-table :data="styles" width="100%" border>

            <el-table-column prop="name" :label="goods.firstStyleItemName">
            </el-table-column>

            <el-table-column prop="subName" :label="goods.secondStyleItemName">
            </el-table-column>

            <el-table-column label="SKU编号" align="center">
              <template scope="scope">
                <span>
                  {{scope.row.styleNumber}}
                </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="SKU封面图">
              <template scope="scope">
                <img :src="scope.row.cover +config.imgtmb._50" style="width:50px;height:50px;" v-if="scope.row.cover">
                <span style="color:orangered;" v-else>无</span>
              </template>
            </el-table-column>

            <el-table-column align="center"  label="操作">
              <template scope="scope">
                <el-button type="text" size="small" @click="onEditStyle(scope.row,scope.$index)">设置</el-button>
              </template>
            </el-table-column>

          </el-table>
          <p>3.商品详情页: <span style="color:#FF4949">请在右侧详情页栏目进行编辑</span></p>
          <p>
            4.内容备注(选填)
            <p>
               <el-input type="textarea" v-model="goods.basicModifyDesc" :rows="3" placeholder="输入内容备注" style="width:100%;"></el-input>
            </p>
          </p>
        </div>
       </div>
      </el-row>

      <el-dialog title="更多实物场景" :visible.sync="editSceneForm.dialogVisible">      
        <div>
          <div style="margin-bottom:20px;overflow:hidden;">
            <span style="margin-right:7px;">场景标题:</span>
            <el-input type="text" style="width:250px;"  placeholder="请输入场景标题" v-model="editSceneForm.title"></el-input>  
          </div>

          <div style="margin-bottom:20px;overflow:hidden;">
            <span style="float:left;margin-right:10px;">场景描述:</span>
            <el-input type="textarea" :rows="2" style="width:250px;"  placeholder="请输入场景描述" v-model="editSceneForm.desc"></el-input>  
          </div>

          <div style="margin-bottom:20px;">
            <span style="margin-right:10px;">场景图片:</span><span style="color:#ff4949;">建议尺寸为1024*764</span>
            <div v-show="editSceneForm.url" class="el-upload el-upload--picture-card" style="margin-left:55px;display:block;margin-top:10px;">
              <img id="sceneCover" title="点击修改图片" style="width:100%; height:100%"
                   :src="editSceneForm.url+config.imgtmb._200">
            </div>
            <div v-show="!editSceneForm.url" style="display:block; margin-left:55px;margin-top:10px;">
              <div class="el-upload el-upload--picture-card" id="sceneCoverBtn">
                <i data-v-5b37d0d4="" class="el-icon-plus"></i>
              </div>
            </div>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editSceneForm.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddScene">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="更多角度图" :visible.sync="editAngleForm.dialogVisible">      
        <el-form>

           <el-form-item label="尺寸大图:"><span style="color:#ff4949;">建议尺寸为1024*819</span>
            <div v-show="editAngleForm.cover" class="el-upload el-upload--picture-card" style="margin-left:55px;display:block;">
              <img id="moreAngle" title="点击修改图片" style="width:100%; height:100%"
                   :src="editAngleForm.cover+config.imgtmb._200">
            </div>
            <div v-show="!editAngleForm.cover" style="display:block; margin-left:55px">
              <div class="el-upload el-upload--picture-card" id="moreAngleBtn">
                <i data-v-5b37d0d4="" class="el-icon-plus"></i>
              </div>
            </div>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editAngleForm.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddAngle">确 定</el-button>
        </div>

      </el-dialog>

       <el-dialog title="详细规格参数" :visible.sync="editparForm.dialogVisible">      
       
        <div style="margin-bottom:20px;">
          <span style="margin-right:7px;">详细规格参数名称:</span>
          <el-input type="text" style="width:250px;"  placeholder="请输入详细规格参数名称" v-model="editparForm.name"></el-input>  
        </div>

        <div style="overflow:hidden;">
          <span style="float:left;margin-right:10px;">详细规格参数描述:</span>
          <el-input type="textarea" :rows="2" style="width:250px;"  placeholder="请输入详细规格参数描述" v-model="editparForm.value"></el-input>  
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editparForm.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddPar">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="尺寸" :visible.sync="editDimForm.dimDialogVisible">      
       
            <div style="margin-bottom:20px;">
              <span style="margin-right:10px;">尺寸标题:</span>
              <el-input type="text" style="width:250px;"  placeholder="请输入尺寸标题" v-model="editDimForm.name"></el-input>  
            </div>
         
            <div style="margin-bottom:20px;">
              <span style="margin-right:10px;">尺寸小图:</span><span style="color:#ff4949;">建议尺寸为640*640</span>
              <div v-show="editDimForm.cover" class="el-upload el-upload--picture-card" style="margin-left:70px;display:block;">
                <img id="dimCover" title="点击修改图片" style="width:100%; height:100%"
                     :src="editDimForm.cover+config.imgtmb._200">
              </div>
              <div v-show="!editDimForm.cover" style="display:block; margin-left:70px">
                <div class="el-upload el-upload--picture-card" id="dimCoverBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
            </div>
         
            <div style="margin-bottom:20px;">
              <span style="margin-right:10px;">尺寸大图:</span><span style="color:#ff4949;">建议尺寸为1024*546</span>
              <div v-show="editDimForm.image" class="el-upload el-upload--picture-card" style="margin-left:70px;display:block;">
                <img id="dimImage" title="点击修改图片" style="width:100%; height:100%"
                     :src="editDimForm.image+config.imgtmb._200">
              </div>
              <div v-show="!editDimForm.image" style="display:block; margin-left:70px">
                <div class="el-upload el-upload--picture-card" id="dimimageBtn">
                  <i data-v-5b37d0d4="" class="el-icon-plus"></i>
                </div>
              </div>
            </div>
          
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDimForm.dimDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDim">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="设置SKU" :visible.sync="dialogVisible">
        <el-form>
          <el-form-item :label="goods.firstStyleItemName">
            <span>{{editStyle.name}}</span>
          </el-form-item>
           <el-form-item :label="goods.secondStyleItemName">
            <span>{{editStyle.subName}}</span>
          </el-form-item>
          <el-form-item label="SKU编号">
            <span>{{editStyle.styleNumber}}</span>
          </el-form-item>
          <el-form-item label="SKU封面"><span style="color:#ff4949;">建议尺寸为640*640</span>
            <div v-show="editStyle.cover" class="el-upload el-upload--picture-card" style="margin-left:55px;display:block;">
              <img id="uploadCoverStyle" title="点击修改图片" style="width:100%; height:100%"
                   :src="editStyle.cover+config.imgtmb._200">
            </div>
            <div v-show="!editStyle.cover" style="display:block; margin-left:55px">
              <div class="el-upload el-upload--picture-card" id="uploadCoverStyleBtn">
                <i data-v-5b37d0d4="" class="el-icon-plus"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="轮播图">
              <span style="color:#ff4949;">建议尺寸为1024*874</span>
              <p style="margin:0;">
                <el-button id="styleBannerUpload" style="margin-top:10px;margin-bottom:10px;" type="primary" size="small" icon="plus">
                  上传图片
                </el-button>
              </p>
              <el-table :data="editBanner" width="100%"  border>
                <el-table-column
                  width="80"
                  label="图片">
                  <template scope="scope">
                      <img  :src="scope.row+config.imgtmb._50" style="width:50px; height:50px;margin-top: 10px;">
                  </template>
                </el-table-column>

                <el-table-column
                  label="图片地址">
                  <template scope="scope">
                    <a :href="scope.row" class="el-button--text link-url" target="_blank"><span>{{scope.row}}</span></a>
                  </template>
                </el-table-column>

                <el-table-column
                  align="center"
                  width="100"
                  label="操作">
                  <template scope="scope">
                    <el-button type="text" size="small" @click="deleteImages(scope.$index,scope.row)">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddStyle">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="'编辑'+goods.firstStyleItemName" :visible.sync="editstyle1.dialogVisible">
        <el-form>
          <el-form-item :label="goods.firstStyleItemName+'名称'">
            <span>{{editstyle1.name}}</span>
          </el-form-item>

          <el-form-item :label="goods.firstStyleItemName+'封面'"><span style="color:#ff4949;">建议尺寸为640*640</span>
            <div v-show="editstyle1.cover" class="el-upload el-upload--picture-card" style="margin-left:55px;display:block;">
              <img id="uploadStyle1Cover" title="点击修改图片" style="width:100%; height:100%"
                   :src="editstyle1.cover+config.imgtmb._200">
            </div>
            <div v-show="!editstyle1.cover" style="display:block; margin-left:55px">
              <div class="el-upload el-upload--picture-card" id="uploadStyle1CoverBtn">
                <i data-v-5b37d0d4="" class="el-icon-plus"></i>
              </div>
            </div>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editstyle1.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddStyle1">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="'编辑'+goods.secondStyleItemName" :visible.sync="editstyle2.dialogVisible">
        <el-form>
          <el-form-item :label="goods.secondStyleItemName+'名称'">
            <span>{{editstyle2.name}}</span>
          </el-form-item>

          <el-form-item :label="goods.secondStyleItemName+'封面'"><span style="color:#ff4949;">建议尺寸为640*640</span>
            <div v-show="editstyle2.cover" class="el-upload el-upload--picture-card" style="margin-left:55px;display:block;">
              <img id="uploadStyle2Cover" title="点击修改图片" style="width:100%; height:100%"
                   :src="editstyle2.cover+config.imgtmb._200">
            </div>
            <div v-show="!editstyle2.cover" style="display:block; margin-left:55px">
              <div class="el-upload el-upload--picture-card" id="uploadStyle2CoverBtn">
                <i data-v-5b37d0d4="" class="el-icon-plus"></i>
              </div>
            </div>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editstyle2.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddStyle2">确 定</el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import uploader from '@/utils/uploader'

  export default {
    name: 'saveGoodsContent',
    components: {Sticky},
    data() {
      return {
       putDataLoading:false,
       showLoading:false,
       showBarCode:false,
       editstyle2:{
        uploadInit:false,
        editStatus:false,
        index:0,
        dialogVisible:false,
        cover:"",
        name:"",
        goodsId:null,
        itemId:null,
        supportStyleItemId:null
       },
       editstyle1:{
        uploadInit:false,
        editStatus:false,
        index:0,
        dialogVisible:false,
        cover:"",
        name:"",
        goodsId:null,
        itemId:null,
        supportStyleItemId:null
       } ,
       editDimForm:{
          editStatus:false,
          index:0,
          initUpload:false,
          dimDialogVisible:false,
          name:"",
          cover:"",
          image:"",   
       },
       editparForm:{
        editStatus:false,
        index:0,
        dialogVisible:false,
        name:"",
        value:"",
       },
       editAngleForm:{
        uploadInit:false,
        editStatus:false,
        index:0,
        dialogVisible:false,
        cover:"",
       },
       editSceneForm:{
        uploadInit:false,
        editStatus:false,
        index:0,
        dialogVisible:false,
        url:"",
        title:"",
        desc:""
       },
       currentDim:[],
       preview:false,
       dialogVisible:false,
       token: null,
       styleInit:false,       
       goods:{},
       coverUpload:{
        cover:null,
        uploading:false,
        percentage:0,
       },
       styles:[],
       currentStyle:[],
       editStyle:{cover:''},
       editBanner:[],
       editStyleNumber:0,
       initOnce:true,
       detailContent:{
        title:{title:"", desc:""},
        titleImage:{ url:"",},
        dim:[],
        parameter:[],
        angleImage:[{ url:''}],
        moreAngleImage:[],
        detail:[{image:"",title:"",desc:""},{image:"",title:"",desc:""},{image:"",title:"",desc:""}],
        sceneImage:[{url:"",title:"",desc:""}],
        moreSceneImage:[],
       }
      }
    },
    mounted: function () {
      this.getUploadTokenInitUploadBtn();
    },
    methods: {
      getQrCode(goodsId) {
        jQuery('#qrcodeBox').html("");
        this.$nextTick(function() {
          var url;
          if(process.env.NODE_ENV == "production") {
            //线上url
            url = 'https://wx.goochao.com/goods_detail.html?goodsid=' + goodsId;
          } else if(process.env.NODE_ENV == "test") {
            url = 'http://test.wx.goochao.com/goods_detail.html?goodsid=' + goodsId;
          } else {
            //本地url
            url = 'http://192.168.20.102:8080/goods_detail.html?goodsid=' + goodsId;
          }
          jQuery('#qrcodeBox').qrcode({
            render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
            text: url, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
            width: "80", //二维码的宽度
            height: "80", //二维码的高度
            typeNumber: -1, //计算模式
            correctLevel: 2, //二维码纠错级别
            background: "#ffffff", //二维码的后景色
            foreground: "#000000", //二维码的前景色
            imgWidth: 80,
            imgHeight: 80
          })
        })
      },
      resetAllForm() {
         this.styles = [];
         this.currentStyle = [];
         this.editStyle = {cover:''};
         this.editBanner = [];
         this.currentDim = [];
         this.goods = {};
         this.coverUpload = {
          cover:null,
          uploading:false,
          percentage:0,
         };
         this.detailContent = {
          title:{title:"", desc:""},
          titleImage:{ url:"",},
          dim:[],
          parameter:[],
          angleImage:[{ url:''}],
          moreAngleImage:[],
          detail:[{image:"",title:"",desc:""},{image:"",title:"",desc:""},{image:"",title:"",desc:""}],
          sceneImage:[{url:"",title:"",desc:""}],
          moreSceneImage:[],
         };
      },
      checkAllForm() {
        if(!this.coverUpload.cover){
          this.$message({message: '请上传商品封面', type: 'warning'});
          return false;
        }
        if (this.goods.firstStyleEnabledCover) {
          for(var i = 0; i < this.goods.firstStyleItems.length; i++){
            if(!this.goods.firstStyleItems[i].cover){
              this.$message({message: '请上传'+this.goods.firstStyleItemName+'封面', type: 'warning'});
              return false;
            }
          }
        }
        if (this.goods.secondStyleEnabledCover) {
          for(var i = 0; i < this.goods.secondStyleItems.length; i++){
            if(!this.goods.secondStyleItems[i].cover){
              this.$message({message: '请上传'+this.goods.secondStyleItemName+'封面', type: 'warning'});
              return false;
            }
          }
        }
        for( var i = 0; i < this.styles.length; i++){
          if(!this.styles[i].cover){
            this.$message({message: '请上传SKU封面', type: 'warning'});
            return false;
          }
          if(!this.styles[i].banners.length){
            this.$message({message: '请上传轮播图', type: 'warning'});
            return false;
          }
        }
        if(!this.detailContent.title.title){
          this.$message({message: '请输入标题文字', type: 'warning'});
          return false;
        }  
        if(!this.detailContent.titleImage.url){
          this.$message({message: '请上传标题图片', type: 'warning'});
          return false;
        } 
        if(!this.detailContent.dim.length){
          this.$message({message: '请添加商品编辑尺寸', type: 'warning'});
          return false;
        }  
        if(!this.detailContent.parameter.length){
          this.$message({message: '请添加详细参数规格', type: 'warning'});
          return false;
        }
        for(var i = 0; i <this.detailContent.angleImage.length; i++){
          if(!this.detailContent.angleImage[i].url){
            this.$message({message: '请上传角度图封面', type: 'warning'});
            return false;
          }
        }
        for(var i = 0; i <this.detailContent.detail.length; i++){
          if(!this.detailContent.detail[i].image){
            this.$message({message: '请上传详情图封面', type: 'warning'});
            return false;
          }
          if(!this.detailContent.detail[i].title){
            this.$message({message: '请输入详情标题', type: 'warning'});
            return false;
          }
          if(!this.detailContent.detail[i].desc){
            this.$message({message: '请输入详情描述', type: 'warning'});
            return false;
          }
        }  
        for(var i = 0; i <this.detailContent.sceneImage.length; i++){
          if(!this.detailContent.sceneImage[i].url){
            this.$message({message: '请上传场景图封面', type: 'warning'});
            return false;
          }
          if(!this.detailContent.sceneImage[i].title){
            this.$message({message: '请输入场景图标题', type: 'warning'});
            return false;
          }
          if(!this.detailContent.sceneImage[i].desc){
            this.$message({message: '请输入场景图描述', type: 'warning'});
            return false;
          }
      }      
      return true; 
      },
      cancel() {
        this.$emit('cancel');
        this.resetAllForm();
      },
      callBack() {
        this.http.post(this).url(this.config.goods.callBack_content).restful({goodsId:this.goods.goodsId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '商品已撤销至初始状态可继续编辑!'});
          },
          (error) => {}
        );
      },
      save(type) {
        if(this.checkAllForm()){
        if(!type){
          jQuery('#qrcodeBox').html("");
          this.showLoading = true;
        } else {
          this.putDataLoading = true;
        }
        let params = {};
        params.goodsId = this.goods.goodsId;
        params.cover = this.coverUpload.cover;
        params.basicModifyDesc = this.goods.basicModifyDesc;
        if(this.goods.firstStyleEnabledCover){
          params.firstStyleItems = this.goods.firstStyleItems;
        }
        if(this.goods.secondStyleEnabledCover){
          params.secondStyleItems = this.goods.secondStyleItems;
        }
        this.styles.forEach((item)=>{
          item.banner = item.banners.join(",");
        })
        params.styles = this.styles;
        let content = {content:[]};
        console.log(content.content)

        var titleobj = {};
        titleobj.type = "text";
        titleobj.title = this.detailContent.title.title;
        content.content.push(titleobj);

        var titleImageObj = {};
        titleImageObj.type = "image";
        titleImageObj.url = this.detailContent.titleImage.url;
        content.content.push(titleImageObj);

        var dimObj = {};
        dimObj.type = "dim";
        dimObj.content = this.detailContent.dim;
        content.content.push(dimObj);

        var parameterObj = {};
        parameterObj.type = "parameter";
        parameterObj.content = this.detailContent.parameter;
        content.content.push(parameterObj);

        this.detailContent.angleImage.forEach((item)=>{
          var obj = {};
          obj.type = "image";
          obj.url = item.url;
          content.content.push(obj);
        })

        if(this.detailContent.moreAngleImage.length){
          this.detailContent.moreAngleImage.forEach((item)=>{
            var obj = {};
            obj.type = "image";
            obj.url = item.cover;
            content.content.push(obj);
          })
        }

        var detailObj = {};
        detailObj.type = "detail";
        detailObj.content = this.detailContent.detail;
        content.content.push(detailObj);

        this.detailContent.sceneImage.forEach((item)=>{
          var imageObj = {};

          imageObj.type = "image";
          imageObj.url = item.url;
          content.content.push(imageObj);

          var textobj = {};
          textobj.type = "text";
          textobj.title = item.title;
          textobj.desc = item.desc;
          content.content.push(textobj);
        })

        if(this.detailContent.moreSceneImage.length){
          this.detailContent.moreSceneImage.forEach((item)=>{
            var imageObj = {};

            imageObj.type = "image";
            imageObj.url = item.url;
            content.content.push(imageObj);

            var textobj = {};
            textobj.type = "text";
            textobj.title = item.title;
            textobj.desc = item.desc;
            content.content.push(textobj);
          })
        }
         console.log(content)
        params.content = JSON.stringify(content);
        params.next = type;
        
        this.http.postJson(this).url(this.config.goods.save_content).params(params).request((response) => {
          this.putDataLoading = false;
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          if(type){
            this.$message({type: 'success', message: '保存成功!'});
            this.resetAllForm();
            this.$emit('success');
          }else{
            this.getQrCode(this.goods.goodsId);
            this.showBarCode = true;
            this.showLoading = false;
          }
         
          },(error) => {
            this.putDataLoading = false;
          }
        );
       }  
      },
      loadSource(source) {
        this.showBarCode = false;
        this.showLoading = false;
        this.goods = source;
        let bannerCount = 0;
        let stylesArray = [];
        this.coverUpload.cover = source.cover;
        source.styles.forEach((item)=>{
          if(item.status == 1){
            if (item.banner) {
              item.banners = item.banner.split(",")
            }else {
              item.banners = [];
            }

            if(bannerCount == 0){
              item.bannerActive = true;
            } else{
              item.bannerActive = false;
            }

            if (!item.cover) {
              item.cover = '';
            }

            bannerCount++;
            stylesArray.push(item)
          }
        })
        this.styles = stylesArray;
        console.log(this.styles)
        this.currentStyle = this.styles[0];
        if(!source.content){
          return false;
        }
        let content = JSON.parse(source.content);
        let number = 0;
        let forNumber = 0;
        console.log(content)

        this.detailContent.title.title = content.content[0].title;
        this.detailContent.titleImage.url = content.content[1].url;
        this.detailContent.dim = content.content[2].content;
        this.currentDim = content.content[2].content[0];
        this.detailContent.parameter = content.content[3].content;

        for(var i = 4; i < content.content.length; i++){
          if( content.content[i].type == "detail") {
              number = i;
              break ;
          }
        }

        this.detailContent.angleImage[0].url = content.content[4].url;
        for(var i = 5; i < number; i++){
          content.content[i].cover = content.content[i].url;
          this.detailContent.moreAngleImage.push(content.content[i])
        }

        this.detailContent.detail = content.content[number].content;
        number++;

        for(var i = number; i < content.content.length; i+=2){
        
        if(forNumber < 1){
          this.detailContent.sceneImage[forNumber].url = content.content[i].url;
          this.detailContent.sceneImage[forNumber].title = content.content[i+1].title;
          this.detailContent.sceneImage[forNumber].desc = content.content[i+1].desc;
        } else{
          var moreSceneObj = {};
          moreSceneObj.url = content.content[i].url;
          moreSceneObj.title = content.content[i+1].title;
          moreSceneObj.desc =  content.content[i+1].desc;
          this.detailContent.moreSceneImage.push(moreSceneObj)
        }  
        
        forNumber++;
        }
      },  
      choiceStyle(style) {
        
        this.styles.forEach((item)=>{
          item.bannerActive = false;
        })
        style.bannerActive = true;
        console.log(this.styles)
        this.currentStyle = style;
      },
      checkStyle() {
        if(!this.editStyle.cover){
          this.$message({message: '请上传规格封面', type: 'warning'});
          return false;
        }
        if(!this.editBanner.length){
          this.$message({message: '请上传规格banner', type: 'warning'});
          return false;
        }
        return true;
      },
      resetStyle() {
        this.editStyle = {cover:''};
        this.editBanner = [];
      },
      deleteImages(index,data){
        this.editBanner.splice(index,1);
      },
      confirmAddStyle(){
        if(this.checkStyle()){
          this.styles.forEach((item)=>{
            item.bannerActive = false;
          })
          this.editStyle.banners = this.editBanner;
          this.editStyle.bannerActive = true;
          this.styles.splice(this.editStyleNumber,1,this.editStyle);
          this.currentStyle = this.styles[this.editStyleNumber];
          this.dialogVisible = false;
          this.resetStyle();
        }
      },
      onEditStyle(style,index) {
        this.resetStyle();
        this.editStyleNumber = index;
        let proxyItem = jQuery.extend({}, style);
        this.editStyle = proxyItem;
        proxyItem.banners.forEach((item)=>{
          this.editBanner.push(item)
        })
        this.dialogVisible = true;
        this.initStyleUpload();
      },
      resetDim() {
        this.editDimForm.name = "";
        this.editDimForm.cover = "";
        this.editDimForm.image = "";
      },
      checkDimForm() {
        if(!this.editDimForm.name){
          this.$message({message: '请输入尺寸名称', type: 'warning'});
          return false;
        }
        if(!this.editDimForm.cover){
          this.$message({message: '请上传尺寸小图', type: 'warning'});
          return false;
        }
        if(!this.editDimForm.image){
          this.$message({message: '请上传尺寸大图', type: 'warning'});
          return false;
        }
        return true;
      },
      editDim() {
        this.editDimForm.editStatus = false;
        this.editDimForm.dimDialogVisible = true;
        this.resetDim();
        this.dimInitUpload();
      },
      addDim() {
        if(this.checkDimForm()){
          let content = {};
          content.name = this.editDimForm.name;
          content.cover = this.editDimForm.cover;
          content.image = this.editDimForm.image;
          if(this.editDimForm.editStatus){
            this.detailContent.dim.splice(this.editDimForm.index,1,content);
            console.log(this.detailContent.dim)
            this.currentDim = this.detailContent.dim[this.editDimForm.index];
          }else{
            this.detailContent.dim.push(content);  
            this.currentDim = this.detailContent.dim[this.detailContent.dim.length - 1];
          }
          this.editDimForm.dimDialogVisible = false;
          this.resetDim();
        }
      },
      onEditDim(dim,index){
        console.log(dim,index);
        this.editDimForm.dimDialogVisible = true;
        this.editDimForm.editStatus = true;
        this.resetDim();
        this.dimInitUpload();
        let proxyItem = jQuery.extend({}, dim);
        this.editDimForm.name = proxyItem.name;
        this.editDimForm.cover = proxyItem.cover;
        this.editDimForm.image = proxyItem.image;
        this.editDimForm.index = index;
      },
      deleteDim(dim,index){
        console.log(index)
        this.detailContent.dim.splice(index,1);
        if(this.detailContent.dim.length){
          this.currentDim = this.detailContent.dim[0];
        } else{
          this.currentDim = [];
        }
      },
      dimClick(dim,index){
        this.currentDim = dim;
      },
      resetPar(){
        this.editparForm.name = "";
        this.editparForm.value = "";
      },
      checkParForm() {
        if(!this.editparForm.name){
          this.$message({message: '请输入详细规格参数名称', type: 'warning'});
          return false;
        }
        if(!this.editparForm.value){
          this.$message({message: '请输入详细规格参数值', type: 'warning'});
          return false;
        }
        return true;
      },
      addPar() {
        this.editparForm.editStatus = false;
        this.editparForm.dialogVisible = true;
        this.resetPar();
      },
      confirmAddPar(){
        if(this.checkParForm()){
          let obj = {};
          obj.name = this.editparForm.name;
          obj.value = this.editparForm.value;
          if(this.editparForm.editStatus){
            this.detailContent.parameter.splice(this.editparForm.index,1,obj);
          }else{
            this.detailContent.parameter.push(obj);
          }
          this.editparForm.dialogVisible = false;
          this.resetPar();
        }
      },
      onEditPar(par,index){
        console.log(index);
        this.resetPar();
        let proxyItem = jQuery.extend({}, par);
        this.editparForm.name = proxyItem.name;
        this.editparForm.value = proxyItem.value;
        this.editparForm.editStatus = true;
        this.editparForm.dialogVisible = true;
        this.editparForm.index = index;
      },
      deletePar(par,index){
        console.log(index);
        this.detailContent.parameter.splice(index,1);
      },

      resetAngleImage(){
        this.editAngleForm.cover = "";
      },
      checkAngleForm() {
        if(!this.editAngleForm.cover){
          this.$message({message: '请上传角度图封面', type: 'warning'});
          return false;
        }
        return true;
      },
      addAngle() {

        this.editAngleForm.editStatus = false;
        this.editAngleForm.dialogVisible = true;
        this.resetAngleImage();
        this.initMoreAngleUpload();
      },
      confirmAddAngle(){
        if(this.checkAngleForm()){
          let obj = {};
          obj.cover = this.editAngleForm.cover;
          if(this.editAngleForm.editStatus){
            this.detailContent.moreAngleImage.splice(this.editAngleForm.index,1,obj);
          }else{
            this.detailContent.moreAngleImage.push(obj);
          }
          this.editAngleForm.dialogVisible = false;
          console.log(this.detailContent.moreAngleImage)
          this.resetAngleImage();
        }
      },
      onEditAngle(cover,index){
        this.editAngleForm.editStatus = true;
        this.editAngleForm.dialogVisible = true;
        this.initMoreAngleUpload();
        console.log(index);
        this.resetAngleImage();
        let proxyItem = jQuery.extend({}, cover);
        console.log(proxyItem)
        this.editAngleForm.cover = proxyItem.cover;
        this.editAngleForm.index = index;
      },
      deleteAngle(cover,index){
        console.log(index);
        this.detailContent.moreAngleImage.splice(index,1);
      },

      resetScene(){
        this.editSceneForm.url = "";
        this.editSceneForm.title = "";
        this.editSceneForm.desc = "";
      },
      checkSceneForm() {
        if(!this.editSceneForm.url){
          this.$message({message: '请上传场景图封面', type: 'warning'});
          return false;
        }
        if(!this.editSceneForm.title){
          this.$message({message: '请输入场景名称', type: 'warning'});
          return false;
        }
        if(!this.editSceneForm.desc){
          this.$message({message: '请输入场景描述', type: 'warning'});
          return false;
        }
        return true;
      },
      addScene() {
        this.editSceneForm.editStatus = false;
        this.editSceneForm.dialogVisible = true;
        this.resetScene();
        this.initMoreSceneUpload();
      },
      confirmAddScene(){
        if(this.checkSceneForm()){
          let obj = {};
          obj.url = this.editSceneForm.url;
          obj.title = this.editSceneForm.title;
          obj.desc = this.editSceneForm.desc;

          if(this.editSceneForm.editStatus){
            this.detailContent.moreSceneImage.splice(this.editSceneForm.index,1,obj);
          }else{
            this.detailContent.moreSceneImage.push(obj);
          }
          this.editSceneForm.dialogVisible = false;
          console.log(this.detailContent.moreSceneImage)
          this.resetScene();
        }
      },
      onEditScene(sceneImage,index){
         this.editSceneForm.editStatus = true;
        this.editSceneForm.dialogVisible = true;
        this.initMoreSceneUpload();
        console.log(index);
        this.resetScene();
        let proxyItem = jQuery.extend({}, sceneImage);
        console.log(proxyItem)
        this.editSceneForm.url = proxyItem.url;
        this.editSceneForm.title = proxyItem.title;
        this.editSceneForm.desc = proxyItem.desc;
        this.editSceneForm.index = index;
      },
      deleteScene(cover,index){
        console.log(index);
        this.detailContent.moreSceneImage.splice(index,1);
      },

      resetStyle1(){
        this.editstyle1.name = "";
        this.editstyle1.cover = "";
        this.editstyle1.goodsId =null;
        this.editstyle1.itemId = null;
        this.editstyle1.supportStyleItemId = null;
      },
      checkStyle1() {
        if(!this.editstyle1.cover){
          this.$message({message: '请上传规格一封面', type: 'warning'});
          return false;
        }
        return true;
      },
      uploadStyle1(style,index){
        this.editstyle1.editStatus = true;
        this.editstyle1.dialogVisible = true;
        this.resetStyle1();
        this.initStyle1Upload();
        let proxyItem = jQuery.extend({}, style);
        this.editstyle1.name = proxyItem.name;
        this.editstyle1.cover = proxyItem.cover;

        this.editstyle1.goodsId = proxyItem.goodsId;
        this.editstyle1.itemId = proxyItem.itemId;
        this.editstyle1.supportStyleItemId = proxyItem.supportStyleItemId;
        
        this.editstyle1.index = index;
      },
      confirmAddStyle1(){
        if(this.checkStyle1()){
          let obj = {};
          obj.name = this.editstyle1.name;
          obj.cover = this.editstyle1.cover;
          obj.goodsId = this.editstyle1.goodsId;
          obj.itemId = this.editstyle1.itemId;
          obj.supportStyleItemId = this.editstyle1.supportStyleItemId;
          
          this.goods.firstStyleItems.splice(this.editstyle1.index,1,obj);
         
          this.editstyle1.dialogVisible = false;
         
          this.resetStyle1();
          console.log(this.goods)
        }
      },

      resetStyle2(){
        this.editstyle2.name = "";
        this.editstyle2.cover = "";
        this.editstyle2.goodsId =null;
        this.editstyle2.itemId = null;
        this.editstyle2.supportStyleItemId = null;
      },
      checkStyle2() {
        if(!this.editstyle2.cover){
          this.$message({message: '请上传规格二封面', type: 'warning'});
          return false;
        }
        return true;
      },
      uploadStyle2(style,index){
        this.editstyle2.editStatus = true;
        this.editstyle2.dialogVisible = true;
        this.resetStyle2();
        this.initStyle2Upload();
        let proxyItem = jQuery.extend({}, style);
        this.editstyle2.name = proxyItem.name;
        this.editstyle2.cover = proxyItem.cover;

        this.editstyle2.goodsId = proxyItem.goodsId;
        this.editstyle2.itemId = proxyItem.itemId;
        this.editstyle2.supportStyleItemId = proxyItem.supportStyleItemId;
        
        this.editstyle2.index = index;
      },
      confirmAddStyle2(){
        if(this.checkStyle2()){
          let obj = {};
          obj.name = this.editstyle2.name;
          obj.cover = this.editstyle2.cover;
          obj.goodsId = this.editstyle2.goodsId;
          obj.itemId = this.editstyle2.itemId;
          obj.supportStyleItemId = this.editstyle2.supportStyleItemId;
          
          this.goods.secondStyleItems.splice(this.editstyle2.index,1,obj);
         
          this.editstyle2.dialogVisible = false;
         
          this.resetStyle2();
          console.log(this.goods)
        }
      },

      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
          if (response.data.code == 0) {

            uploader.initGoodsUpload(response.data.data, "uploadCover", (url) => {
              this.coverUpload.percentage = 0;
              this.coverUpload.uploading = false;
              this.coverUpload.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.coverUpload.percentage = file.percent;
            }, (up, files) => {
              this.coverUpload.uploading = true;
            });
            uploader.initGoodsUpload(response.data.data, "uploadCoverBtn", (url) => {
              this.coverUpload.percentage = 0;
              this.coverUpload.uploading = false;
              this.coverUpload.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.coverUpload.percentage = file.percent;
            }, (up, files) => {
              this.coverUpload.uploading = true;
            });
            this.token = response.data.data;
            this.initContentUpload();
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      dimInitUpload() {
        if (!this.editDimForm.initUpload ) {
          this.$nextTick(_ => {
            this.editDimForm.initUpload = true;
            uploader.initGoodsUpload(this.token, "dimCover", (url) => {
              console.log(url)
              this.editDimForm.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initGoodsUpload(this.token, "dimCoverBtn", (url) => {
              console.log(url)
              this.editDimForm.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initGoodsUpload(this.token, "dimImage", (url) => {
             this.editDimForm.image = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initGoodsUpload(this.token, "dimimageBtn", (url) => {
             this.editDimForm.image = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
          });
        }
      },

      initContentUpload() {

        uploader.initGoodsUpload(this.token, "detailTitleImage", (url) => {
          console.log(url)
          this.detailContent.titleImage.url = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });
        uploader.initGoodsUpload(this.token, "detailTitleImageBtn", (url) => {
          console.log(url)
          this.detailContent.titleImage.url = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });

        uploader.initGoodsUpload(this.token, "angleImage0", (url) => {
          console.log(url)
         
          this.detailContent.angleImage[0].url = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });

        uploader.initGoodsUpload(this.token, "angleImageBtn0", (url) => {
          console.log(url)
          this.detailContent.angleImage[0].url = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });  

        // uploader.initGoodsUpload(this.token, "angleImage1", (url) => {
        //   console.log(url)
         
        //   this.detailContent.angleImage[1].url = url;
        // }, (up, err, errTip) => {
        //   console.log(errTip)
        // });

        // uploader.initGoodsUpload(this.token, "angleImageBtn1", (url) => {
        //   console.log(url)
        //   this.detailContent.angleImage[1].url = url;
        // }, (up, err, errTip) => {
        //   console.log(errTip)
        // });  

        // uploader.initGoodsUpload(this.token, "angleImage2", (url) => {
        //   console.log(url)
         
        //   this.detailContent.angleImage[2].url = url;
        // }, (up, err, errTip) => {
        //   console.log(errTip)
        // });

        // uploader.initGoodsUpload(this.token, "angleImageBtn2", (url) => {
        //   console.log(url)
        //   this.detailContent.angleImage[2].url = url;
        // }, (up, err, errTip) => {
        //   console.log(errTip)
        // });  

        uploader.initGoodsUpload(this.token, "detailImage0", (url) => {
          console.log(url)
         
          this.detailContent.detail[0].image = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });

        uploader.initGoodsUpload(this.token, "detailImageBtn0", (url) => {
          console.log(url)
          this.detailContent.detail[0].image = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });  

        uploader.initGoodsUpload(this.token, "detailImage1", (url) => {
          console.log(url)
         
         this.detailContent.detail[1].image = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });

        uploader.initGoodsUpload(this.token, "detailImageBtn1", (url) => {
          console.log(url)
         this.detailContent.detail[1].image = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });  

        uploader.initGoodsUpload(this.token, "detailImage2", (url) => {
          console.log(url)
         
         this.detailContent.detail[2].image = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });

        uploader.initGoodsUpload(this.token, "detailImageBtn2", (url) => {
          console.log(url)
          this.detailContent.detail[2].image = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });  

         uploader.initGoodsUpload(this.token, "sceneImage", (url) => {
          console.log(url)
         
         this.detailContent.sceneImage[0].url = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });

        uploader.initGoodsUpload(this.token, "sceneImageBtn", (url) => {
          console.log(url)
         this.detailContent.sceneImage[0].url = url;
        }, (up, err, errTip) => {
          console.log(errTip)
        });  

        // uploader.initGoodsUpload(this.token, "sceneImage1", (url) => {
        //   console.log(url)
         
        // this.detailContent.sceneImage[1].url = url;
        // }, (up, err, errTip) => {
        //   console.log(errTip)
        // });

        // uploader.initGoodsUpload(this.token, "sceneImageBtn1", (url) => {
        //   console.log(url)
        //   this.detailContent.sceneImage[1].url = url;
        // }, (up, err, errTip) => {
        //   console.log(errTip)
        // });  


      },
      initMoreAngleUpload() {
        if (!this.editAngleForm.uploadInit) {
          this.$nextTick(_ => {
            this.editAngleForm.uploadInit = true;

            uploader.initGoodsUpload(this.token, "moreAngle", (url) => {
              console.log(url)
              this.editAngleForm.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initGoodsUpload(this.token, "moreAngleBtn", (url) => {
              console.log(url)
              this.editAngleForm.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
          
          });
        }
      },
      initMoreSceneUpload() {
        if (!this.editSceneForm.uploadInit) {
          this.$nextTick(_ => {
            this.editSceneForm.uploadInit = true;

            uploader.initGoodsUpload(this.token, "sceneCover", (url) => {
              console.log(url)
              this.editSceneForm.url = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initGoodsUpload(this.token, "sceneCoverBtn", (url) => {
              console.log(url)
              this.editSceneForm.url = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
          
          });
        }
      },
      initStyleUpload() {
        if (!this.styleInit) {
          this.$nextTick(_ => {
            this.styleInit = true;
            uploader.initGoodsUpload(this.token, "uploadCoverStyleBtn", (url) => {
              console.log(url)
              this.editStyle.cover = url;
              console.log(this.editStyle.cover)
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initGoodsUpload(this.token, "uploadCoverStyle", (url) => {
              console.log(url)
              this.editStyle.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
            uploader.initGoodsUpload(this.token, "styleBannerUpload", (url) => {
              console.log(url)

              this.editBanner.push(url);
            }, (up, err, errTip) => {
              console.log(errTip)
            });
          });
        }
      },
      initStyle1Upload() {
        if (!this.editstyle1.uploadInit) {
          this.$nextTick(_ => {
            this.editstyle1.uploadInit = true;

            uploader.initGoodsUpload(this.token, "uploadStyle1Cover", (url) => {
              console.log(url)
              this.editstyle1.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initGoodsUpload(this.token, "uploadStyle1CoverBtn", (url) => {
              console.log(url)
              this.editstyle1.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
           
          });
        }
      },
      initStyle2Upload() {
        if (!this.editstyle2.uploadInit) {
          this.$nextTick(_ => {
            this.editstyle2.uploadInit = true;

            uploader.initGoodsUpload(this.token, "uploadStyle2Cover", (url) => {
              console.log(url)
              this.editstyle2.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });

            uploader.initGoodsUpload(this.token, "uploadStyle2CoverBtn", (url) => {
              console.log(url)
              this.editstyle2.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            });
           
          });
        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" >
  @import "src/styles/mixin.scss";
  #saveGoodsContent_vue{
    .sub-navbar{
      z-index: 99;
    }
    #phone_box{
      position:absolute;
      top:0;
      right:10px;
      margin:auto;
      width:435px;
      height:888px;
      background-image: url("/static/images/iphone_black.png");
      background-size: 100%;
      z-index: 0;
    }
    #goods_box{
      width:950px;
      height:888px;
      position:relative;
      margin:auto;
    }
    #goods_content{
      position:absolute;
      width: 394px;
      height:666px;
      top:0;
      left:0;
      overflow-y: scroll;
      //background: red;
      >p{
        margin-top: 5px;
        margin-bottom:5px;
        padding-left:10px; 
      }
    }
    #rightTip{
      position:absolute;
      width:400px;
      height:auto;
      overflow:hidden;
      top:0;
      right:10px;
    }
    #tip{
      position:absolute;
      width:435px;
      height:auto;
      overflow:hidden;
      top:0;
      left:10px;
    }
    .input_content>div.el-form-item__content{
      float:left;
    }
    #detail{
      padding-bottom:20px;
      #details{
        .deatil_bottom{
          input{
            width:100%;
            margin-top:10px;
          }
        }
        input{
          width:100%;
        }
        textarea{
          width:100%;
          margin-top:10px;
        }
        .detail3_textarea >textarea{
          margin-top: 0;
        }
        .deatil_top{
          height:auto;
          overflow:hidden;
          input{
            margin-top:10px;
            width:100%;
          }
          
          >.left{
            width:170px;
            float:left;
            height:auto;
            img{
              width:170px;
              height:200px;
            }
          }
          >.right{
            width:170px;
            float:right;
            img{
              width:170px;
              height:200px;
            }
          }
        }
      }  
      .content_title{
        font-size:18px;
        font-weight: 700;
      }
      .angleImage_content{
        >div{
          margin-top: 10px;
        }
      }
      .parameter{
        padding-top: 10px;
        padding-bottom:10px;
        border-bottom:1px solid #ddd;
        >span{
          padding-right:50px;
        }

      }
      h3{
        font-size:18px;
        color:#666;
      }
      p{
       font-size:14px;
       color:#333; 
       text-align:center;
      }
      input{
        margin-bottom:10px;
        width:80%;
      }
      textarea{
        width:80%;
        margin:auto;
      }
      
      .dimContent{
        padding-left:20px;
        padding-right: 20px;
        overflow:hidden;
        >div{
          float:left;
          position:relative;
          width:80px;
          height:auto;
          text-align:center;
          padding:10px;
          p{
            width: 60px;
            height: 60px;
            margin: 0;
            border: 0 solid #F2F2F2;
          }
          p.dimChoice{
            background: #F6F6F6;
            margin: 0;
            cursor: pointer;
          }
          img{
            width:85%;
            height:85%;
            display: block;
            margin: auto;
          }
        }
      }
    }
  }  
</style>
