<template>
  <div class="gc-praiselist" id="memberDetail_vue">
    <div class="gc-praiselist_content">
     <!--  <sticky :className="'sub-navbar'">
        <el-button @click="cancel">返回会员列表</el-button>
      </sticky> -->
      
      <sticky :className="'sub-navbar'">
        <template>
          <el-button @click="cancel">返 回</el-button>
        </template>
      </sticky>

      <div>
        <h3 style="font-size:20px;color:rgb(102,102,102);">会员基本信息</h3>
        
         <el-row v-if="memberData.head">
           <el-col :span="24">
              <h3 style="text-align:center;">   <img  :src="memberData.head" style="width:100px;height:100px;border-radius:10px;"> </h3>
           </el-col>
         </el-row>

        <el-row>
           <el-col :span="8" v-if="memberData.nickName">
              <h3 class="messageCenter">昵称:<span style="color:#337ab7;">{{memberData.nickName}}</span></h3>
            </el-col>
            <el-col :span="8" v-if="memberData.birthday">
              <h3 class="messageCenter">生日:<span>{{ memberData.birthday | formatDate}}</span></h3>
            </el-col>
           
            <el-col :span="8" v-if="memberData.gender">
              <h3 class="messageCenter">性别:<span>{{ (memberData.gender == 1) ? "男" : "女"}}</span></h3>
            </el-col>
            <el-col :span="8" v-if="memberData.phone">
              <h3 class="messageCenter">手机号:<span>{{memberData.phone}}</span></h3>
            </el-col>
            <el-col :span="8" v-if="memberData.score">
              <h3 class="messageCenter">积分:<span>{{memberData.score}}</span></h3>
            </el-col>
             <el-col :span="8" v-if="memberData.createdAt">
              <h3 class="messageCenter">注册日期:<span>{{memberData.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span></h3>
            </el-col>
            <el-col :span="8" v-if="memberData.lastLoginDate">
              <h3 class="messageCenter">最后登录时间:<span>{{memberData.lastLoginDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span></h3>
            </el-col>
            <el-col :span="8">
              <h3 class="messageCenter">总订单数:<span>{{memberData.orderCount}}</span></h3>
            </el-col>

            <el-col :span="8">
              <h3 class="messageCenter">最近1个月订单数:<span>{{memberData.latelyOrderCount}}</span></h3>
            </el-col>
            
            <el-col :span="8" v-if="memberData.province">
              <h3 class="messageCenter">所属省份:<span>{{memberData.province}}</span></h3>
            </el-col>
             <el-col :span="8" v-if="memberData.city">
              <h3 class="messageCenter">所属城市:<span>{{memberData.city}}</span></h3>
             </el-col>
        </el-row>

         <el-row  class="showInfo">
            <h3 style="font-size:20px;color:rgb(102,102,102);">会员最近浏览商品类别</h3>

            <el-table
            :data="goodsCategory"
            border>
            
            <el-table-column type="index" align="center" label="序号" width="65">
            </el-table-column>

             <el-table-column
                align="center"
                label="类别名称">
                <template scope="scope">
                  <span >{{scope.row.name}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="类别图片">
                <template scope="scope">
                  <img :src="scope.row.image" class="imageStyle">
                </template>
              </el-table-column>

            </el-table>
         </el-row>

         <el-row  class="showInfo">
            <h3 style="font-size:20px;color:rgb(102,102,102);">会员最近浏览场景风格</h3>

            <el-table
            :data="sceneStyle"
            border>
            
            <el-table-column type="index" align="center" label="序号" width="65">
            </el-table-column>
             <el-table-column
                align="center"
                label="场景名称">
                <template scope="scope">
                  <span >{{scope.row.name}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="场景图片">
                <template scope="scope">
                  <img :src="scope.row.cover" class="imageStyle">
                </template>
              </el-table-column>

            </el-table>
         </el-row>

         <el-row  class="showInfo">
            <h3 style="font-size:20px;color:rgb(102,102,102);">会员最近浏览空间风格</h3>

            <el-table
            :data="spaceStyle"
            border>
            
            <el-table-column type="index" align="center" label="序号" width="65">
            </el-table-column>
             <el-table-column
                align="center"
                label="空间名称">
                <template scope="scope">
                  <span >{{scope.row.name}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="空间图片">
                <template scope="scope">
                  <img :src="scope.row.cover" class="imageStyle">
                </template>
              </el-table-column>

            </el-table>
         </el-row>


         <el-row  class="showInfo">
            <h3 style="font-size:20px;color:rgb(102,102,102);">会员最近浏览方案户型</h3>

            <el-table
            :data="planHouseTypes"
            border>
            
            <el-table-column type="index" align="center" label="序号" width="65">
            </el-table-column>

             <el-table-column
                align="center"
                label="方案户型名称">
                <template scope="scope">
                  <span >{{scope.row.name}}</span>
                </template>
              </el-table-column>


            </el-table>
         </el-row>


         <el-row  class="showInfo">
            <h3 style="font-size:20px;color:rgb(102,102,102);">会员最近浏览方案风格</h3>

            <el-table
            :data="planStyles"
            border>
            
            <el-table-column type="index" align="center" label="序号" width="65">
            </el-table-column>
             <el-table-column
                align="center"
                label="方案风格名称">
                <template scope="scope">
                  <span >{{scope.row.name}}</span>
                </template>
              </el-table-column>

              <el-table-column
                align="center"
                label="方案风格图片">
                <template scope="scope">
                  <img :src="scope.row.cover" class="imageStyle">
                </template>
              </el-table-column>

            </el-table>
         </el-row>

      </div>
    </div>
  </div>
</template>

<script>
  import {formatDate} from '@/commons/date.js'
  import {parseTime} from '@/utils'
  import Sticky from '@/components/Sticky' // 粘性header组件
  export default{
    components: {Sticky},
    data(){
      return{
        listQuery:{
          loading: false,
          pageIndex:1,
          pageSize:15,
          nickName:null,
          total: 0,
          phone:null
        },
        goodsCategory:[],
        sceneStyle:[],
        spaceStyle:[],
        planStyles:[],
        planHouseTypes:[],
        memberData:{}
      }
    },
    filters:{
      formatDate(time){
        if (!time) {
          return "无";
        }
        let date = new Date(time);
        //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        return formatDate(date, 'yyyy-MM-dd');
      },
    },
    mounted:function(){
      
    },
    methods:{
     cancel() {
        this.reset();
        this.$emit('cancel');
      },
      reset() {
        this.memberData = {};
        this.goodsCategory = [];
        this.spaceStyle = [];
        this.sceneStyle = [];
        this.planHouseTypes = [];
        this.planStyles = [];
      },
      loadProvinceData(memberId) {
        this.http.get(this).url(this.config.members.detail_url).restful({memberId:memberId}).request(function(response){
          let data = response.data.data;
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          data.detail.latelyOrderCount = data.latelyOrderCount;
          if(data.detail.head == null){
            data.detail.head = "/static/images/defalt_uer_image.png";
          }
          //this.memberData = data.detail;
          this.memberData.latelyOrderCount = data.latelyOrderCount;
          this.goodsCategory = data.latelyCategories ? data.latelyCategories : [];
          this.spaceStyle = data.latelySpaceStyles ? data.latelySpaceStyles : [];
          this.sceneStyle = data.latelyImageStyles ? data.latelyImageStyles : [];
          
          this.planHouseTypes = data.planHouseTypes ? data.planHouseTypes : [];
          this.planStyles = data.planStyles ? data.planStyles : [];

        },(error) => {console.log(error)});
      },
      loadSource(data) {
        console.log(data)
        this.memberData = data;
        this.loadProvinceData(data.memberId);
      }
    }
  }
</script>

<style lang="scss">
    #memberDetail_vue{
      h3{
        color:#333;
        font-size:18px;
        >span{
          margin-left:10px;
          font-size:16px;
        }
      }

      .imageStyle{
        width:auto;
        height:60px;  
        margin-top:10px;
      }
      .messageCenter{
        text-align:center;
      }
    }
</style>