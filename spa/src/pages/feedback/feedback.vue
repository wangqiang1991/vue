<template>
  <div class="app-container calendar-list-container">
    <el-table :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="反馈时间" width="200">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="反馈内容">
        <template scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人" width="200">
        <template scope="scope">{{scope.row.contact}}</template>
      </el-table-column>

      <el-table-column align="center" label="联系电话" width="200">
        <template scope="scope">{{scope.row.phone}}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template scope="scope">
          <el-button icon="delete" size="small" type="danger" @click="deleteFeedBack(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]"
                     :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
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
    directives: {
      waves
    },
    data() {
      return {
        loading: false,
        listQuery: {
          pageIndex: 1,
          pageSize: 15,
          total: 0,
        },
        dataList:[]
      }
    },
    mounted() {
      this.findByPage();
    },
    methods: {
      findByPage() {
        this.loading = true;
        this.http.get(this).url(config.feedBack.list_url).params(
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

      /**
       * 功能:删除反馈内容
       * @param feedBack
       */
      deleteFeedBack(feedBack) {
        this.$confirm('确认要删除该内容吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(config.feedBack.delete_url).restful({feedBackId: feedBack.feedBackId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => {
              this.$message({type: 'error', message: '服务器繁忙!'});
            });
        }).catch(() => {
        });
      }

    }


  }


</script>
