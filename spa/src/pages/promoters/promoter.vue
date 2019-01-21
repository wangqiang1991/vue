<template>
  <div class="app-container calendar-list-container" id="promoters_vue" style="padding-top:10px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

          <el-input @keyup.enter.native="doSearch()" v-model="listQuery.promoterName" style="width: 200px !important;" class="filter-item" placeholder="推广商名称">
          </el-input>

          <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          <el-button @click="addPromoter" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="plus">新增</el-button>

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
            label="推广商名称"
            align="center">
            <template scope="scope">
              <span>{{scope.row.promoterName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="联系人">
            <template scope="scope">
              <span>{{scope.row.contacts}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="联系电话">
            <template scope="scope">
              <span>{{scope.row.contactsPhone}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="经营性质">
            <template scope="scope">
              <span v-if="scope.row.nature == 1">个人</span>
              <span v-if="scope.row.nature == 2">企业</span>
            </template>
          </el-table-column>

          <el-table-column
            label="推广商品数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.goodsCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="推广活动数量"
            align="center">
            <template scope="scope">
              <span>{{scope.row.activityCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="推广位数量"
            align="center">
            <template scope="scope">
             <span>{{scope.row.boothCount}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template scope="scope">
             <el-button size="small" class="button_detail fontFamily icon-browse" type="primary" @click="seeDetail(scope.row)">查看详情</el-button>
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

      <el-dialog :title="title"  :visible.sync="detailDialogVisible">
        <div class="plan_detail">
          <el-row :gutter="24">

            <el-col :span="12">
              <span>推广商名称:</span>
              <el-input type="text" v-model="promoter.promoterName" style="width:70%;" placeholder="请输入推广商名称" maxlength="50"> </el-input>
            </el-col>

            <el-col :span="12">
              <span>经营性质:</span>

              <el-select clearable class="filter-item" v-model="promoter.nature" placeholder="经营性质:">
                <el-option
                  v-for="item in natures"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type">
                </el-option>
              </el-select>

            </el-col>

            <el-col :span="12">
              <span>联系人:</span>
              <el-input type="text" v-model="promoter.contacts" style="width:70%;" placeholder="请输入联系人" maxlength="15"> </el-input>
            </el-col>

            <el-col :span="12">
              <span>联系电话:</span>
              <el-input type="text" v-model="promoter.contactsPhone" style="width:70%;" placeholder="请输入联系电话" maxlength="11"> </el-input>
            </el-col>

            <el-col :span="12">
              <span>登录账号:</span>
              <el-input type="text" v-model="promoter.account" style="width:70%;" placeholder="请输入登录账号" maxlength="20"> </el-input>
            </el-col>

            <el-col :span="12">
              <span>登录密码:</span>
              <el-input type="password" v-model="promoter.password" style="width:70%;" placeholder="请输入登录密码" maxlength="12"> </el-input>
            </el-col>

            <el-col :span="12">
              <span>返点比利:</span>
              <el-input-number  v-model="promoter.settleRatio" style="width:150px;" placeholder="请输入返点比利"  :min="1" :max="10"> </el-input-number>
              <b style="color:#f75151;">%</b>
            </el-col>

          </el-row>    

          <el-tabs  v-model="activeName">

            <el-tab-pane label="推广位" name="1">  
              <el-button @click="addPromoterBooth"  size="small" type="primary"  icon="plus">新增推广位</el-button>
              <el-button icon="delete" size="small" type="danger" @click="deletePromoterBooth">删除所选</el-button>
                <el-table
                :data="promoter.promoterBooths"
                ref="multiplePicTable" 
                @selection-change="handleSelectionChange"
                border
                style="width: 100%;margin-top:15px;">

                  <el-table-column type="index" align="center" label="序号" width="65">
                  </el-table-column>

                  <el-table-column
                    label="推广位名称"
                    align="center">
                    <template scope="scope">
                      <span>{{scope.row.boothName}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="推广位描述">
                    <template scope="scope">
                      <span>{{scope.row.description}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>

                </el-table>


            </el-tab-pane>

            <el-tab-pane label="推广活动" name="2">
              <el-button @click="addPromoterActive"  size="small" type="primary"  icon="plus">新增推广活动</el-button>
              <el-button icon="delete" size="small" type="danger" @click="deletePromoterActive">删除所选</el-button>
                <el-table
                :data="promoter.promoterActivityRelations"
                ref="multiplePicTable2" 
                @selection-change="handleSelectionChange2"
                border
                style="width: 100%;margin-top:15px;">

                  <el-table-column type="index" align="center" label="序号" width="65">
                  </el-table-column>

                  <el-table-column
                    label="活动封面"
                    align="center"
                    vertical="middle">
                    <template scope="scope">
                      <span v-if="!scope.row.cover" style="color:orangered">未编辑封面</span>
                      <img v-else style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200"
                           class="gc_praiselist_list_img">
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="name"
                    label="活动标题">
                    <template scope="scope">
                      <span>{{scope.row.title}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>

                </el-table>

            </el-tab-pane>

            <el-tab-pane label="推广商品" name="3">
              <el-button @click="addPromoterGoods"  size="small" type="primary"  icon="plus">新增推广商品</el-button>
              <el-button icon="delete" size="small" type="danger" @click="deletePromoterGoods">删除所选</el-button>
                <el-table
                :data="promoter.promoterGoodsRelations"
                ref="multiplePicTable30" 
                @selection-change="handleSelectionChange30"
                border
                style="width: 100%;margin-top:15px;">

                  <el-table-column type="index" align="center" label="序号" width="65">
                  </el-table-column>

                  <el-table-column
                    label="商品封面"
                    align="center"
                    vertical="middle">
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
                    prop="name"
                    label="商品编码">
                    <template scope="scope">
                      <span>{{scope.row.goodsNumber}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>

                </el-table>

            </el-tab-pane>

          </el-tabs>

        </div> 

        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button @click="detailDialogVisible = false">取消</el-button>
          <el-button v-show="edit"  type="danger" @click="deletePromoter(promoter)">删 除</el-button>
          <el-button type="primary" @click="comfirmAddPromoter">{{edit ? "确认修改" : "新 增" }}</el-button>
        </div>

      </el-dialog>


    <el-dialog  title="新增推广位"  :visible.sync="promoterBooth.dialogVisible">

      <div class="plan_detail">
        <el-row :gutter="24">

          <el-col :span="24">
            <span>推广位名称:</span>
            <el-input type="text" v-model="promoterBooth.boothName" style="width:70%;" placeholder="请输入推广位名称" maxlength="50"> </el-input>
          </el-col>

          <el-col :span="24">
            <span style="float:left;margin-right:4px;">推广位描述:</span>
            <el-input type="textarea" :rows="3" v-model="promoterBooth.description" style="width:70%;" placeholder="请输入推广位描述" maxlength="100"> </el-input>
          </el-col>

        </el-row>

      </div>    

      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button @click="promoterBooth.dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="comfirmAddPromoterBooth">确 定</el-button>
      </div>

    </el-dialog>

    <!-- 选择活动 -->
    <el-dialog title="活动选择" :visible.sync="activeVisible">

      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-input @keyup.enter.native="activedoSearch()" v-model="activelistQuery.title" style="width: 200px !important;" class="filter-item" placeholder="输入活动标题"></el-input>
            <el-button @click="activedoSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table  
        :data="activeData"
         ref="multiplePicTable3" 
        @selection-change="handleSelectionChange3"
         border style="width: 100%;margin-top:15px;">

         <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="活动封面"
            align="center">
            <template scope="scope">
              <img :src="scope.row.cover" style="width:auto;height:50px;margin-top:5px;">
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="活动标题">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="活动起止日期">
            <template scope="scope">
              <span>{{scope.row.beginDate| parseTime('{y}-{m}-{d} {h}:{i}')}} ~ {{scope.row.endDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
            </template>
          </el-table-column>

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          
        </el-table>
        <div  class="pagination-container">
          <el-pagination 
          @size-change="activehandleSizeChange" 
          @current-change="activehandleCurrentChange" 
          :page-sizes="[10,15,20,30]" 
          :page-size="activelistQuery.pageSize" 
          :current-page="activelistQuery.pageIndex"
          layout="total, sizes, prev, pager, next, jumper" 
          :total="activelistQuery.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="activeVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmChoiceActive">确 定</el-button>
      </div>

    </el-dialog>


    <!-- 选择商品 -->
    <el-dialog title="商品选择" :visible.sync="goodsVisible">

      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-input @keyup.enter.native="goodsdoSearch()" v-model="goodslistQuery.keyword" style="width: 200px !important;" class="filter-item" placeholder="输入商品标题或编码"></el-input>
            <el-button @click="goodsdoSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="gc-praiselist_content_list">
        <el-table  
        :data="goodsData"
        ref="multiplePicTable31" 
        @selection-change="handleSelectionChange31"
         border style="width: 100%;margin-top:15px;">

         <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            label="商品封面"
            align="center">
            <template scope="scope">
              <img :src="scope.row.cover" style="width:auto;height:50px;margin-top:5px;">
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品标题">
            <template scope="scope">
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="商品编码">
            <template scope="scope">
              <span>{{scope.row.goodsNumber}}</span>
            </template>
          </el-table-column>

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          
        </el-table>
        <div  class="pagination-container">
          <el-pagination 
          @size-change="goodshandleSizeChange" 
          @current-change="goodshandleCurrentChange" 
          :page-sizes="[10,15,20,30]" 
          :page-size="goodslistQuery.pageSize" 
          :current-page="goodslistQuery.pageIndex"
          layout="total, sizes, prev, pager, next, jumper" 
          :total="goodslistQuery.total">
          </el-pagination>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmChoiceGoods">确 定</el-button>
      </div>

    </el-dialog>


  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import md5 from 'js-md5'
  export default {
    data() {
      return {
        activeName:"1",
        natures:[{type:1,name:"个人"},{type:2,name:"企业"}],
        detailDialogVisible:false,
        title:'',
        edit:false,
        dataList:[],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          promoterName:''
        },
        activeVisible:false,
        activeData:[],
        activelistQuery: {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          activityStatus: 2,
          title: "",
        },
        goodsVisible:false,
        goodsData:[],
        goodslistQuery: {
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          goodsStatus: 3,
          keyword: "",
        },       
        promoter:{
          promoterId:null,
          promoterName:'',
          contacts:'',
          contactsPhone:'',
          nature:'',
          account:'',
          password:'',
          settleRatio:1,
          promoterBooths:[],
          promoterActivityRelations:[],
          promoterGoodsRelations:[]
        },
        promoterBooth:{
          dialogVisible:false,
          boothId:null,
          boothName:'',
          description:'',
        },
        multipleSelections:[],
        multipleSelections2:[],
        multipleSelections3:[],
        multipleSelections4:[],
        multipleSelections5:[],
        oldpassword:null
      }
    },
    mounted() {
      this.findByPage();
      this.findByactive();
      this.findByGoods();
    },
    methods:{
      reset() {
        this.activeName = "1";
        this.promoter = {
          promoterId:null,
          promoterName:'',
          contacts:'',
          contactsPhone:'',
          nature:'',
          account:'',
          password:'',
          settleRatio:1,
          promoterBooths:[],
          promoterActivityRelations:[],
          promoterGoodsRelations:[]
        };
      },
      checkFrom() {
        if(!this.promoter.promoterName || !this.promoter.promoterName.trim()){
          this.$message({type: 'warning', message: '推广商名称不能为空' });
          return false;
        }

        if(!this.promoter.nature){
          this.$message({type: 'warning', message: '请选择经营性质' });
          return false;
        }

        if(!this.promoter.contacts || !this.promoter.contacts.trim()){
          this.$message({type: 'warning', message: '联系人不能为空' });
          return false;
        }

        if(!this.promoter.contactsPhone || !this.promoter.contactsPhone.trim()){
          this.$message({type: 'warning', message: '联系电话不能为空' });
          return false;
        }

        if(!this.validate.validatPhone( this.promoter.contactsPhone )){
          this.$message({type: 'warning', message: '联系电话格式不正确' });
          return false;
        }

        if(!this.promoter.account || !this.promoter.account.trim()){
          this.$message({type: 'warning', message: '登录账号不能为空' });
          return false;
        }

        if(this.promoter.account.length < 5 ){
          this.$message({type: 'warning', message: '登录账号字符在5 - 20 个之间' });
          return false;
        }

        if(!this.promoter.password || !this.promoter.password.trim()){
          this.$message({type: 'warning', message: '登录密码不能为空' });
          return false;
        }

        if(this.promoter.password.length < 6 ){
          this.$message({type: 'warning', message: '登录密码字符在6 - 12 个之间' });
          return false;
        }

        if(this.promoter.password.length > 12 &&  this.promoter.password.length != 32){
          this.$message({type: 'warning', message: '登录密码字符在6 - 12 个之间' });
          return false;
        }

        if(!this.validate.validatNumber(this.promoter.settleRatio)){
          this.$message({type: 'warning', message: '返点比利不能为小数' });
          return false;
        }

        if(this.promoter.settleRatio < 1 ){
          this.$message({type: 'warning', message: '返点比利最小为1%' });
          return false;
        }

        if(this.promoter.settleRatio > 10 ){
          this.$message({type: 'warning', message: '返点比利最大为10%' });
          return false;
        }

        if(!this.promoter.promoterBooths.length){
          this.$message({type: 'warning', message: '请添加推广位' });
          return false;
        }

        // if(!this.promoter.promoterActivityRelations.length){
        //   this.$message({type: 'warning', message: '请添加推广活动' });
        //   return false;
        // }

        return true;
      },
      addPromoter() {
        this.reset();
        this.title = "新增推广商";
        this.edit = false;
        this.detailDialogVisible = true;
      },
      seeDetail(promoterdata) {
        this.reset();
        this.title = "推广商详情";
        this.edit = true;
        this.loadPromoterDetail(promoterdata)

      },
      loadPromoterDetail(promoterdata) {
        this.http.get(this).url(this.config.promoter.detail_url).restful({promoterId:promoterdata.promoterId}).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            console.log(response.data.data.password)
            this.oldpassword = response.data.data.password;
            if (!response.data.data.promoterGoodsRelations) {
              response.data.data.promoterGoodsRelations = [];
            }
            this.promoter = response.data.data;
            this.detailDialogVisible = true;

          },(error) => {console.log(error)}
        );
      },
      deletePromoter(promoter) {
       this.$confirm('是否要删除推广商"' + promoter.promoterName + '"，删除后将不能恢复，是否确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.promoter.detail_url).restful({promoterId:promoter.promoterId}).request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.detailDialogVisible = false;
              this.$message({type: 'success', message: '推广商删除成功!'});
              this.findByPage();
            }, (err) => {console(err)});
        }).catch(() => {});
      },
      comfirmAddPromoter() {
        if (this.checkFrom()) {

        if (this.edit && (this.oldpassword == this.promoter.password) ) {
          console.log('password not md5')
          this.promoter.password = this.oldpassword;
        } else {
          console.log('password md5')
          this.promoter.password = md5(this.promoter.password);
        }

          console.log(this.promoter)
          this.http.postJson(this).url(this.config.promoter.list_url).params(this.promoter).request( (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '推广商保存成功!'});
              this.findByPage();
              this.detailDialogVisible = false;
            },
            (error) => {}
          );
        }
      },
      resetPromoterBooth() {
        this.promoterBooth = {
          dialogVisible:false,
          boothId:null,
          boothName:'',
          description:'',
        }
      },
      addPromoterBooth() {
        this.resetPromoterBooth();
        this.promoterBooth.dialogVisible = true;
      },
      comfirmAddPromoterBooth() {
        if(!this.promoterBooth.boothName || !this.promoterBooth.boothName.trim()){
          this.$message({type: 'warning', message: '推广位名称不能为空' });
          return false;
        }
        // if(!this.promoterBooth.description || !this.promoterBooth.description.trim()){
        //   this.$message({type: 'warning', message: '推广位描述不能为空' });
        //   return false;
        // }

        for (var i = 0; i < this.promoter.promoterBooths.length; i++) {
          if(this.promoter.promoterBooths[i].boothName == this.promoterBooth.boothName){
            this.$message({type: 'warning', message: '推广位名称不能重复' });
            return false;
          }
        }
        this.promoter.promoterBooths.push(this.promoterBooth);
        this.promoterBooth.dialogVisible = false;
      },
      handleSelectionChange(val) {
        this.multipleSelections = val;
      },
      deletePromoterBooth() {
       if (this.multipleSelections && this.multipleSelections.length > 0) {

          for(var i = 0; i < this.multipleSelections.length; i++){
            for(var j = 0; j < this.promoter.promoterBooths.length; j++){
              if (this.promoter.promoterBooths[j].boothName == this.multipleSelections[i].boothName) {
                this.promoter.promoterBooths.splice(j,1);
                break ;
              }
            }
          }

        } else {
          this.$message({message: "请先选择要删除推广位", type: 'warning'});
        }
      },
      handleSelectionChange2(val) {
        this.multipleSelections2 = val;
      },
      handleSelectionChange30(val) {
        this.multipleSelections5 = val;
      },
      deletePromoterActive() {
       if (this.multipleSelections2 && this.multipleSelections2.length > 0) {

          for(var i = 0; i < this.multipleSelections2.length; i++){
            for(var j = 0; j < this.promoter.promoterActivityRelations.length; j++){
              if (this.promoter.promoterActivityRelations[j].activityId == this.multipleSelections2[i].activityId) {
                this.promoter.promoterActivityRelations.splice(j,1);
                break ;
              }
            }
          }
        } else {
          this.$message({message: "请先选择活动", type: 'warning'});
        }
      },
      deletePromoterGoods() {
       if (this.multipleSelections5 && this.multipleSelections5.length > 0) {

          for(var i = 0; i < this.multipleSelections5.length; i++){
            for(var j = 0; j < this.promoter.promoterGoodsRelations.length; j++){
              if (this.promoter.promoterGoodsRelations[j].goodsId == this.multipleSelections5[i].goodsId) {
                this.promoter.promoterGoodsRelations.splice(j,1);
                break ;
              }
            }
          }
        } else {
          this.$message({message: "请先选择商品", type: 'warning'});
        }
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
      findByPage() {
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.promoter.list_url).params(this.listQuery).request((response) => {
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
      addPromoterActive() {
        this.activeVisible = true;
        this.activelistQuery.title = '';
        this.activedoSearch();
        setTimeout(()=>{
          this.$refs.multiplePicTable3.clearSelection();
        },50)
      },
      addPromoterGoods() {

        this.goodsVisible = true;
        this.goodslistQuery.keyword = '';
        this.goodsdoSearch();
        setTimeout(()=>{
          this.$refs.multiplePicTable31.clearSelection();
        },50)

      },
      handleSelectionChange3(val) {
        this.multipleSelections3 = val;
      },
      handleSelectionChange31(val) {
        this.multipleSelections4 = val;
      },
      comfirmChoiceActive(data) {
        if (this.multipleSelections3 && this.multipleSelections3.length > 0) {
          
          this.multipleSelections3.forEach((item)=>{

            var flag = true;

            this.promoter.promoterActivityRelations.forEach((promoterItem)=>{
              if(promoterItem.activityId == item.activityId){
                flag = false;
              }
            })

            if (flag) {
              this.promoter.promoterActivityRelations.push(item);
            }

          })

          this.activeVisible = false;

        } else {
          this.$message({message: "请先选择活动", type: 'warning'});
        }
      },
      comfirmChoiceGoods() {
        if (this.multipleSelections4 && this.multipleSelections4.length > 0) {
          
          this.multipleSelections4.forEach((item)=>{

            var flag = true;

            this.promoter.promoterGoodsRelations.forEach((promoterItem)=>{
              if(promoterItem.goodsId == item.goodsId){
                flag = false;
              }
            })
            
            if (flag) {
              this.promoter.promoterGoodsRelations.push(item);
            }

          })
          
          this.goodsVisible = false;

        } else {
          this.$message({message: "请先选择商品", type: 'warning'});
        }        
      },
      activehandleSizeChange(val) {
        this.activelistQuery.pageSize = val;
        this.findByactive();
      },
      activehandleCurrentChange(val) {
        this.activelistQuery.pageIndex = val;
        this.findByactive();
      },
      activedoSearch() {
        this.activelistQuery.pageIndex = 1;
        this.findByactive();
      },
      findByactive(){
        this.http.get(this).url(this.config.softWear.activities).params(this.activelistQuery).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.activeData = data;
            this.activelistQuery.total = response.data.data.totalSize;
            
          },(error) => {console.log(error)}
        );
      },
      goodshandleSizeChange(val) {
        this.goodslistQuery.pageSize = val;
        this.findByGoods();
      },
      goodshandleCurrentChange(val) {
        this.goodslistQuery.pageIndex = val;
        this.findByGoods();
      },
      goodsdoSearch() {
        this.goodslistQuery.pageIndex = 1;
        this.findByGoods();
      },
      findByGoods(){
        this.http.get(this).url(this.config.goods.list_url_v2).params(this.goodslistQuery).request((response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            let data = response.data.data.data;

            this.goodsData = data;
            this.goodslistQuery.total = response.data.data.totalSize;
            
          },(error) => {console.log(error)}
        );
      },

    }
  }
</script>

<style lang="scss">
  #promoters_vue {
     .plan_detail{
      .el-col{
        margin-bottom: 20px;
        >span{
          width:90px;
          text-align: right;
          font-weight:700;
          display: inline-block;
        }
      }
    } 
  }
</style>
