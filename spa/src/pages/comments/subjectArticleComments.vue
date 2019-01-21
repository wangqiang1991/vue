<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" v-if="!listQuery.subjectArticleId">
      <el-input @keyup.enter.native="keyEvent()" v-model="listQuery.condition" style="width: 300px;" class="filter-item" placeholder="按期刊标题搜索">
      </el-input>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>

    </div>

    <el-table :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="评论时间" width="150">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="评论内容">
        <template scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论用户">
        <template scope="scope">
          <span v-if="scope.row.memberVo == null">无</span>
          <span v-else>{{scope.row.memberVo.nickName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="期刊标题" >
        <template scope="scope">{{scope.row.subjectArticleVo.title}}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template scope="scope">
          <el-button icon="delete" size="small" type="danger" @click="deleteComments(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]"
                     :page-size="listQuery.pageSize" :current-page="listQuery.pageIndex" layout="total, sizes, prev, pager, next, jumper"
                     :total="listQuery.total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'

  export default {
    props:["loadData"],
    directives: {
      waves
    },
    data() {
      return {
        loading: false,
        listQuery: {
          condition: null,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          subjectArticleId:null
        },
        dataList:[]

      }
    },
    mounted() {
      //console.log(this.loadData)
      if(!this.loadData){
        this.findByPage();
      }
    },
    methods: {
      loadComment(subjectArticleId) {
        this.listQuery.pageIndex = 1;
        this.listQuery.subjectArticleId = subjectArticleId;
        this.findByPage();
      },
      findByPage() {
        this.loading = true;
        this.http.get(this).url(config.subjectArticleComments.list_url).params(
          this.listQuery
        ).request(function (response) {
          this.loading = false;
          if (response.data.code == 0) {
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          this.loading = false;
          this.$message.error("服务器繁忙,请稍后再试");
        })
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

      deleteComments(item) {
        this.$confirm('确认要删除该评论吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(config.subjectArticleComments.delete_url).restful({commentId: item.commentId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {
        });
      },

      keyEvent() {
        this.doSearch();
      }

    }
  }

</script>
