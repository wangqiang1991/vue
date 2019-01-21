<template>
  <div class="dashboard-editor-container" id="home_index_page_vue">
    <!-- <div class=" clearfix"> -->
      <!-- <pan-thumb style="float: left" :image="avatar"> 你的权限:
        <span class="pan-info-roles" :key='item' v-for="item in roles">{{item}}</span>
      </pan-thumb>
      <github></github>
      <div class="info-container">
        <span class="display_name">{{name}}</span>
        <span style='font-size:20px;padding-top:20px;display:inline-block;'>普通编辑dashboard</span>
      </div> -->
    <!-- </div> -->


    <div class="workLog">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>重要代办事项提醒</h3>
      </div>
      <div class="text item">
        <el-row :gutter="24">
          <el-col :span="8">
            <p>待处理订单数: <span>{{tipData.waitRefundCount + tipData.waitReceivingCount + tipData.waitDeliverCount + tipData.refundCount + tipData.exchageCount + tipData.refundExchageCount  }}</span></p>              
          </el-col>
          <el-col :span="8">
            <p>待申请采购数量: <span>{{tipData.purchaseApplyCount}}</span></p>         
          </el-col>
          <el-col :span="8">
            <p>已申请采购项数量: <span>{{tipData.purchaseAcceptCount}}</span></p>         
          </el-col>
          <el-col :span="8">
            <p>待入库采购项数量: <span>{{tipData.purchasePutInCount}}</span></p>                   
          </el-col>
          <el-col :span="8">
            <p>待出库商品数量: <span>{{tipData.saleOutputCount + tipData.exchageOutoutCount}}</span></p>                   
          </el-col>
          <el-col :span="8">
            <p>待审核采购工单数量: <span>{{tipData.waitAuditCount}}</span></p>         
          </el-col>
        </el-row>
      </div>
    </el-card>
    </div>

    <div class="downLoad_word">

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="/static/images/downLoad_image.png" >
          <h3>构巢后台操作手册</h3>
        </div>
        <div class="text item">
          
          <a target="_blank" href="http://appsource.goochao.com/%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx"><img src="/static/images/wordIcon.png">Word格式 下载</a>
          <a target="_blank" href="http://appsource.goochao.com/%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf"><img src="/static/images/pdfIcon.png">PDF格式 下载</a>

        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="/static/images/downLoad_image.png" >
          <h3>APP操作手册</h3>
        </div>
        <div class="text item">
         
          <a target="_blank" href="http://appsource.goochao.com/%E6%9E%84%E5%B7%A2App%E5%8A%9F%E8%83%BD%E8%AF%B4%E6%98%8E%E4%B9%A6.docx"><img src="/static/images/wordIcon.png">Word格式 下载</a>
          <a target="_blank" href="http://appsource.goochao.com/%E6%9E%84%E5%B7%A2App%E5%8A%9F%E8%83%BD%E8%AF%B4%E6%98%8E%E4%B9%A6.pdf"><img src="/static/images/pdfIcon.png">PDF格式 下载</a>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <img src="/static/images/downLoad_image.png" >
          <h3>推广商后台操作手册</h3>
        </div>
        <div class="text item">
         
          <a target="_blank" href="http://appsource.goochao.com/%E6%8E%A8%E5%B9%BF%E5%95%86%E5%90%8E%E5%8F%B0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx"><img src="/static/images/wordIcon.png">Word格式 下载</a>
          <a target="_blank" href="http://appsource.goochao.com/%E6%8E%A8%E5%B9%BF%E5%95%86%E5%90%8E%E5%8F%B0%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf"><img src="/static/images/pdfIcon.png">PDF格式 下载</a>

        </div>
      </el-card>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Github from '@/components/Github'

export default {
  name: 'dashboard-editor',
  components: { PanThumb, Github },
  data() {
    return {
      tipData:{},
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  mounted() {
    this.findTip();      
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  methods:{
    findTip() {
      this.http.get(this).url(this.config.tip.toDo).request(function(response) {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.tipData = response.data.data;
        }, function(err) { console.log(err)}
      );
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
#home_index_page_vue{
  .workLog{
    width:960px;
    height:auto;
    margin: 20px auto 30px;
    .el-card__header{
      border-bottom: none !important;
      padding:20px 0 12px;
      h3{
        text-align:center;
        margin:0;
      }
    }
    .el-card__body{
      padding-top: 0;
      span{
        font-weight:700;
        font-size:24px;
        color:red;
      }
    }
  }
  .downLoad_word{
    display:flex;
    justify-content:center;
    .box-card{
      width:300px;
      margin-right: 20px;
      .clearfix img{
        width:100px;
        height:100px;
        display:block;
        margin:auto;
      }
      h3{
        text-align: center;
      }
      a{
        img{
          width:32px;
          height:32px;
          margin-right:8px;
        }
        display:flex;
        align-items:center;
        justify-content:center;
        width:100%;
        border: 1px solid #ccc;
        background: white;
        padding:8px 0;
        margin-bottom: 10px;
        border-radius: 5px;
      }
      a:last-child{
        margin-bottom:0;
      }
      a:hover{
        background:#f0f0f0;
      }
    }
    .box-card:last-child{
      margin-right:0;
    }
  }
	.emptyGif {
		display: block;
		width: 45%;
		margin: 0 auto;
	}

	.dashboard-editor-container {
		background-color: #e3e3e3;
		min-height: 100vh;
		margin-top: -50px;
		padding: 100px 60px 0px;
		.pan-info-roles {
			font-size: 12px;
			font-weight: 700;
			color: #333;
			display: block;
		}
		.info-container {
			position: relative;
			margin-left: 190px;
			height: 150px;
			line-height: 200px;
			.display_name {
				font-size: 48px;
				line-height: 48px;
				color: #212121;
				position: absolute;
				top: 25px;
			}
		}
	}
}  
</style>
