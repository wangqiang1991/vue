<template>
  <div class="gc-praiselist">

    <div class="gc-praiselist_content" v-show="state=='list'">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">

            <el-input @keyup.enter.native="doSearch()" v-model="listQuery.nickName" style="width: 200px !important;" class="filter-item"
                      placeholder="请输入会员昵称">
            </el-input>

            <el-input @keyup.enter.native="doSearch()" maxlength='11' v-model="listQuery.phone" style="width:150px"   placeholder="请输入手机号码">

            </el-input>
            <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                       icon="search">搜索
            </el-button>
          </div>
        </el-col>

      </el-row>
      <div class="gc-praiselist_content_list">
        <el-table
          v-loading="listQuery.loading"
          element-loading-text="努力加载中..."
          ref="multipleTable"
          :data="dataList"
          border
          style="width: 100%"
          @sort-change="sortChange">
          <el-table-column type="index" align="center" label="序号" width="65">
          </el-table-column>

          <el-table-column
            align="center"
            label="昵称">
            <template scope="scope">
              <span style="color:#337ab7;">{{scope.row.nickName}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="生日">
            <template scope="scope">
              <span>{{scope.row.birthday | formatDate}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="头像"
            align="center"
            width="120">
            <template scope="scope">
              <img style="width:50px;height:50px;" :src="scope.row.head+'?imageView2/1/w/320/h/320'"
                   class="gc_praiselist_list_img">
            </template>
          </el-table-column>
          <el-table-column
            label="性别"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.gender == 1">男</span>
              <span v-if="scope.row.gender == 2">女</span>
            </template>
          </el-table-column>

          <el-table-column
            label="手机号"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.phone">{{scope.row.phone}}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="注册日期"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.createdAt">{{scope.row.createdAt  | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="积分"
            sortable="custom"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.score">{{scope.row.score}}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="最后登录时间"
            sortable="custom"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.lastLoginDate">{{scope.row.lastLoginDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="总订单数"
            sortable="custom"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.orderCount">{{scope.row.orderCount}}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

         <!--  <el-table-column
            label="省份"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.province">{{scope.row.province}}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="城市"
            align="center">
            <template scope="scope">
              <span v-if="scope.row.city">{{scope.row.city}}</span>
              <span v-else>无</span>
            </template>
          </el-table-column> -->

          <el-table-column label="操作" align="center" width="150" >
            <template scope="scope">
              <el-button  class="fontFamily icon-browse" size="small" type="primary" @click="detail(scope.row)">查看详情
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="pagination-container">
          <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
          @current-change="handleCurrentChange"
                         :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
          </el-pagination>
        </div>

      </div>
    </div>

    <member-detail ref="memberDetail" v-on:cancel="state='list'" v-show="state=='detail'">
    </member-detail>

  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {formatDate} from '@/commons/date.js'
  import {parseTime} from '@/utils'
  import memberDetail from './memberDetail.vue'

  export default{
    directives: {
      waves
    },
    components:{
      memberDetail
    },
    data(){
      return{
        state:"list",
        listQuery:{
          loading: false,
          pageIndex:1,
          pageSize:15,
          nickName:null,
          total: 0,
          phone:null,
          column: "",
          order: ""
        },
        dataList:[]
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
      this.findByPage();
    },
    methods:{
      detail(data) {
        this.state = "detail";
        this.$refs.memberDetail.loadSource(data);
      },
      sortChange(column) {
        this.listQuery.column = column.prop;
        this.listQuery.order = column.order;
        console.log(column);
        this.findByPage();
      },
      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.listQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage(){
        console.log(this.listQuery);
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.members.list_url).params(this.listQuery).request(function(response){
          if (response.data.code != 0) {
            this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
            return;
          }
          response.data.data.data.forEach((item)=>{
            //console.log(item)
            if(item.head == null){
              item.head = "/static/images/defalt_uer_image.png";
            }
          })
          console.log(response)
          this.dataList = response.data.data.data;
          this.listQuery.total = response.data.data.totalSize;
          this.listQuery.loading = false;
          console.log(this.dataList)
        },
        (error) => {

        });
      }
    }
  }
</script>

<style>
  .gc-praiselist {

  }

  .gc-praiselist_title {
    padding: 5px 15px 15px;
    border-bottom: 1px solid #dcdcdc;
  }

  .gc-praiselist h1 {
    font-size: 18px;
    color: #666;
    line-height: normal;
    margin: 0;
  }

  .gc-praiselist_content {
    margin-top: 10px;
    padding: 0 15px;
  }

  /*.el-input {
      width: 250px;
      margin-left:10px;
  }*/
  .gc-praiselist_content_list {
    margin-top: 15px;
  }

  .gc_praiselist_list_img {
    width: 100px;
    height: 100px;
    display: block;
    margin: 5px auto;
  }

  .gc-praiselist_pagination {
    margin-top: 15px;
  }

  .el-number-cus {

  }
</style>
