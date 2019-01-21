<template>
  <div id="preview_vue">
   <!--  <div>
      <el-button @click="cancel">返回商品列表</el-button>
    </div> -->

    <sticky :className="'sub-navbar'">
      <template>
        <el-button @click="cancel">返 回</el-button>
      </template>
    </sticky>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品基本信息" name="1">
        <div class="goods_table1">
          <div>
          <p>商品名称: <span>{{goods.title}}</span></p>
          <p>商品编码: <span>{{goods.goodsNumber}}</span></p>
          <p>商品简介: <span>{{goods.description}}</span></p>
          <p>商品分类: <span :key="category.firstCategoryId" type="text" v-for="category in goods.categoryName">{{category.firstCategoryName}} / {{category.secondCategoryName}}</span>
          </p>
          <p>服务标签:  <span>{{goods.serviceTags}}</span></p>
          <p>关键词:  <span>{{goods.keywords}}</span></p>
          <p>供应商: <span>{{goods.provider.providerName}}</span></p>
          </div>
          <div>
          <p>退货期限: <span>{{goods.refundDeadline}}天</span></p>
          <p>换货期限: <span>{{goods.exchangeDeadline}}天</span></p>

          <p v-if="goods.afterSaleDeadlineType == 1">维修期限: <span>{{goods.afterSaleDeadline}}天</span></p>
          <p v-if="goods.afterSaleDeadlineType == 2">维修期限: <span>{{goods.afterSaleDeadline}}月</span></p>
          <p v-if="goods.afterSaleDeadlineType == 3">维修期限: <span>{{goods.afterSaleDeadline}}年</span></p>

          </div>
          <h3 style="clear:both;">商品规格</h3>
           <el-table :data="styles" width="100%" border>

            <el-table-column prop="name" :label="goods.firstStyleItemName">
              <template scope="scope">
                <span>
                  {{scope.row.name }}
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="name" :label="goods.secondStyleItemName">
              <template scope="scope">
                <span>
                  {{scope.row.subName}}
                </span>
              </template>
            </el-table-column>


            <el-table-column prop="price" label="规格售卖价格">
            </el-table-column>

            <el-table-column prop="costPrice" label="规格成本价格" v-if="type == 1">
            </el-table-column>

            <el-table-column label="规格编号">
              <template scope="scope">
                <span>
                  {{scope.row.styleNumber}}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="运费模板">
              <template scope="scope">
                <span>
                  {{scope.row.expressTemplateName}}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="包装重量(kg)">
              <template scope="scope">
                <span>
                  {{scope.row.weight}}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="包装体积(m³)">
              <template scope="scope">
                <span>
                  {{scope.row.volume}}
                </span>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2" style="width:100%;height;auto;overflow:hidden;">
        <div style="height:auto;float:left;margin-right:100px;color:#999;">
          <p>商品名称: <span style="color:#343434;margin-left:20px;">{{goods.title}}</span></p>
          <p>商品编码: <span style="color:#343434;margin-left:20px;">{{goods.goodsNumber}}</span></p>
          <p style="height:200px;line-height:200px;"> <span style="float:left;margin-right:20px;">商品封面:</span>
            <img :src="goods.cover" style="width:200px;height:200px;border:1px solid #c2c2c2;">
          </p>
          <el-table :data="goods.firstStyleItems" width="100%" border v-if="goods.firstStyleEnabledCover">

            <el-table-column :label="goods.firstStyleItemName" align="center">
              <template scope="scope">
                <span>
                  {{scope.row.name}}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="封面" align="center">
              <template scope="scope">
                <img :src="scope.row.cover +config.imgtmb._50" style="width:50px;height:50px;" v-if="scope.row.cover">
                <span style="color:orangered;" v-else>
                  无
                </span>
              </template>
            </el-table-column>

          </el-table>

           <el-table :data="goods.secondStyleItems" width="100%" border v-if="goods.secondStyleEnabledCover" style="margin-top:20px;">

            <el-table-column :label="goods.secondStyleItemName" align="center">
              <template scope="scope">
                <span>
                  {{scope.row.name}}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="封面" align="center">
              <template scope="scope">
                <img :src="scope.row.cover +config.imgtmb._50" style="width:50px;height:50px;" v-if="scope.row.cover">
                <span style="color:orangered;" v-else>
                  无
                </span>
              </template>
            </el-table-column>

          </el-table>

        </div>
        <div id="phone_box">
          <div  style="width:377px;height:666px;overflow:hidden;position:absolute;top:109px;left:29px;">
            <div id="goods_content">

              <div class="block banner" style="background:#999;" v-for="style in styles" v-if="style.bannerActive">
                <el-carousel height="320px"  trigger="click">
                  <el-carousel-item v-for="item in currentStyle.banners" :key="item">
                    <img :src="item" style="width:100%;height:100%;">
                  </el-carousel-item>
                </el-carousel>
              </div>

              <div class="goods_detail">
                <p style="font-weight:700;">{{goods.title}}</p>
                <span>{{goods.description}}</span>
                <p>￥{{currentStyle.price}}</p>
              </div>

              <div class="goods_style">
                 <h3>规格</h3>
                 <div class="choice_style">
                   <p v-for="style in styles" @click="choiceStyle(style)">
                     <img :src="style.cover" >
                     <span>{{style.name +"-"+ style.subName}}</span>
                   </p>
                 </div>

              </div>

              <div v-if="goods.content != null">
                <h3 style="margin-left:20px;">详情</h3>
                <div class="detail_title">
                  <p style="width:200px;margin:20px auto 25px;font-size:16px;color:#343434;text-align:center;font-weight:700;">
                    {{detailContent.title.title}}
                  </p>
                  <img :src="detailContent.titleImage.url" style="width:100%; height:auto;">
                </div>
                <div class="dim">
                   <p style="margin-top:40px;font-size:14px;color:#343434;margin-bottom:0;font-weight:700;">Dimension</p>
                   <p style="font-weight:700;color:#343434;font-size:14px;margin-top:0;">尺寸</p>
                   <p class="dim_title" style="text-align:center;font-weight:700;color:#343434;margin-bottom:11px;margin-top:25px;margin-left:0;">{{currentDim.name}}</p>
                   <img :src="currentDim.image" style="width:100%;height:200px;margin-bottom:35px;">
                   <div>
                     <img @click="choiceDim(dim)" :src="dim.cover" v-for="dim in detailContent.dim" style="width:60px;height:60px;margin-left:20px;">
                   </div>
                </div>
                <div class="Parameter" style="padding-top:50px;">
                  <p class="title" style="margin:0;"> Parameter </p>
                  <p class="title" style="margin:0;">详细参数规格</p>
                  <div>
                    <p v-for="par in detailContent.parameter">
                      <span style="color:#333;font-weight:700;">{{par.name}}</span>
                      <span style="color:#666;">{{par.value}}</span>
                    </p>
                  </div>
                </div>
                <div style="width:100%;height:auto;overflow:hidden;">
                  <p class="title" style="margin:0 20px;"> Vision </p>
                  <p class="title" style="margin:0 20px 30px;">视图</p>
                  <img :src="angle.url" v-for="angle in detailContent.angleImage" style="width:100%;height:auto;float:left">
                </div>
                 <div v-if="detailContent.moreAngleImage.length" style="width:100%;height:auto;overflow:hidden;">
                  <img :src="angle.url" v-for="angle in detailContent.moreAngleImage" style="width:100%;height:auto;float:left;">
                </div>
                <div class="details">
                  <p style="height:auto;margin-top:40px;margin-bottom:0" class="title">Detail </p>
                  <p class="title" style="margin-top:0;margin-bottom:30px;height:auto;">细节</p>
                  <div style="overflow:hidden;">
                    <div class="left">
                      <img :src="detailContent.detail[0].image" style="width:100%;height:200px;">
                      <p style="white-space:pre-wrap;">{{detailContent.detail[0].title}}</p>
                      <span>{{detailContent.detail[0].desc}}</span>
                    </div>
                    <div class="right">
                      <img :src="detailContent.detail[1].image" style="width:100%;height:200px;">
                      <p>{{detailContent.detail[1].title}}</p>
                      <span>{{detailContent.detail[1].desc}}</span>
                    </div>
                  </div>
                  <div style="margin-top:35px;">
                     <img :src="detailContent.detail[2].image" style="width:100%;height:250px;">
                     <p style="height:auto;">{{detailContent.detail[2].title}}</p>
                     <span>{{detailContent.detail[2].desc}}</span>
                  </div>
                </div>
                <div class="scene_image" v-for=" sceneImage in detailContent.sceneImage ">
                   <img :src="sceneImage.url"  style="height:auto;">
                   <p>{{sceneImage.title}}</p>
                   <span>{{sceneImage.desc}}</span>
                </div>
                 <div v-if="detailContent.moreSceneImage.length" class="scene_image" v-for=" sceneImage in detailContent.moreSceneImage ">
                   <img :src="sceneImage.url" style="height:auto;">
                   <p>{{sceneImage.title}}</p>
                   <span>{{sceneImage.desc}}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品营销" name="3">
        <p style="color:#999">商品名称: <span style="color:#343434">{{goods.title}}</span></p>
        <p style="color:#999">商品编码: <span style="color:#343434">{{goods.goodsNumber}}</span></p>
        <el-table :data="goods.coupons" border fit highlight-current-row style="width: 100%">

          <el-table-column label="优惠券名称" width="150">
            <template scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠券类型">
            <template scope="scope">
              <span v-if="scope.row.type==1">包邮</span>
              <span v-else-if="scope.row.type==2">折扣</span>
              <span v-else-if="scope.row.type==3">金额</span>
              <span v-else-if="scope.row.type==4">让利</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠内容">

            <template scope="scope">
              <span v-if="scope.row.type==4">
                商品让利{{scope.row.salesPromotion}}%
              </span>
              <span v-if="scope.row.type==3">
                商品满{{scope.row.toAmount}}减{{scope.row.amount}}
              </span>
              <span v-if="scope.row.type==2">
                商品折扣{{scope.row.disCount}}折 
              </span>
            </template>

          </el-table-column>

          <el-table-column label="有效期">
            <template scope="scope">
              <div v-if="scope.row.inDate">
                <span>{{scope.row.inDate}}天</span>
              </div>
              <div v-else>
                <span>{{scope.row.beginDate | formatDate}}</span>
                <span>-</span>
                <span>{{scope.row.endDate | formatDate}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="优惠券状态">
            <template scope="scope">
              <span v-if="scope.row.status == 0">未启用</span>
              <span v-if="scope.row.status == 1">已启用</span>
              <span v-if="scope.row.status == 2">已停用</span>
              <span v-if="scope.row.status == 3">已删除</span>
              <span v-if="scope.row.status == 4">已过期</span>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
   import {formatDate} from '@/commons/date.js'
   import Sticky from '@/components/Sticky' // 粘性header组件
  export default {
     filters:{
      formatDate(time){
        if (!time) {
          return "无";
        }
        let date = new Date(time);
        //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        return formatDate(date, 'yyyy/MM/dd');
      }
    },
    components: {Sticky},
    data() {
      return {
        activeName: "",
        type:0,
        goods:{
          provider:{providerName:""},
          categoryName:[]
        },
        styles:[],
        currentStyle:{},
        currentDim:{
          image:"",
          title:"",
        },
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
      };
    },
    methods: {
       resetAllForm() {
         this.styles = [];
         this.currentStyle = [];
         this.currentDim = [];
         this.goods = {
           provider:{providerName:""},
           categoryName:[]
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
      choiceDim(dim) {
        this.currentDim = dim;
      },
      choiceStyle(style) {
        this.styles.forEach((item)=>{
          item.bannerActive = false;
        })
        style.bannerActive = true;
        console.log(style)
        this.currentStyle = style;
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      cancel() {
        this.resetAllForm();
        this.$emit('cancel');
      },
      loadSource(source,type) {
        console.log(source,type)
        this.goods = source;
        this.type = type;
        this.activeName = type + "";
        let bannerCount = 0;
        let stylesArray = [];
        source.styles.forEach((item)=>{
          if(item.status == 1){
            if(item.banner){
              item.banners = item.banner.split(",");
            }else{
              item.banners = [];
            }

            if(bannerCount == 0){
              item.bannerActive = true;
            } else{
              item.bannerActive = false;
            }
            bannerCount++;
            stylesArray.push(item)

            //this.styles.push(item);
          }
        })
        this.styles = stylesArray;
        //this.styles = source.styles;
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


      }
    }
  };
</script>

<style lang="scss">
  #preview_vue{
    .el-carousel__indicators{
      width:100%;
      text-align:center;
    }
    #phone_box{
    position:relative;
    top:0;
    right:10px;
    margin:auto;
    width:435px;
    height:888px;
    background-image: url("/static/images/iphone_black.png");
    background-size: 100%;
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
        font-size:14px;
        color:#343434;
        margin-left:20px;
      }
      .goods_detail{
        width:335px;
        height:auto;
        margin:auto;
        font-size:18px;
        color:#343434;
        padding-bottom:20px;
        border-bottom:1px solid #ddd;
        p{
          margin-bottom:5px;
        }
        span{
          color:#999;
          font-size:14px;
          margin-bottom:10px;
        }
      }
      .goods_style{
        width:335px;
        height:auto;
        margin:auto;
        padding-top:25px;
        padding-bottom:40px;
        border-bottom:1px solid #ddd;
        .choice_style{
          width:100%;
          height:auto;
          overflow:hidden;
          >p{
            width:60px;
            height:auto;
            float:left;
            margin-right: 20px;
            text-align:center;
            cursor: pointer;
            >img{
              width:60px;
              height:60px;
            }
            >span{
              font-size:12px;
              color:#999;
              margin-top:10px;
            }
          }
        }
      }

      .dim{
        p{
          font-size:14px;
          color:#343434;
          margin-left:20px;
        }
        >div{
          img{
            cursor:pointer;
          }
        }
      }
      .Parameter{
        width:335px;
        height:auto;
        margin:auto;
        padding-top:25px;
        padding-bottom:40px;
        >div{
          margin-top:35px;
          p{
            overflow:hidden;
            margin:0;
            padding-top:10px;
            padding-bottom:10px;
            border-bottom:1px solid #ddd;
            span{
              display:inline-block;
              width:50%;
              float:left;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              }
          }
          p:last-child{
            border-bottom:0;
          }
        }
      }
      .details{
        width:100%;
        height:auto;
        padding-left:15px;
        padding-right:15px;
       p{
          font-size:14px;
          color:#343434;
          height:35px;
        }
        span{
          font-size:12px;
          color:#666;
        }
        .left{
          width:170px;
          height:auto;
          float:left;

        }
        .right{
          width:170px;
          height:auto;
          float:right;
        }
        >div{
          p{
            font-size:14px;
            color:#343434;
            margin-top:20px;
            font-weight:700;
            margin-bottom:4px;
          }
        }

      }
      .scene_image{
        margin-top: 35px;

        img{
          width:100%;
          height:280px;

        }
        p{
          width:340px;
          font-weight:700;
          color:#343434;
          font-size:16px;
          margin: 20px auto 5px;
        }
        span{
          font-size:14px;
          color:#666;
          margin:5px auto;
          display:block;
          width:340px;
        }
      }



     }
    }
    .goods_table1{
       width:100%;
        height:auto;
        overflow:hidden;
        >div{
          width:50%;
          float:left;
          height:auto;
          p{
            color:#999;
            margin-bottom: 20px;
            >span{
              color:#343434;
              margin-left:16px;
            }
          }
        }
        div.el-table{
          width:75%;
        }
    }
    .title{
      color:#343434;
      font-size:14px;
      font-weight: 700;
    }
  }
</style>
