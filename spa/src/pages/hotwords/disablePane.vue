<template>
  <div class="app-container calendar-list-container" style="padding:0;">
    <el-table :data="dataList" v-loading.body="listQuery.loading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column min-width="300px" label="热词">
        <template scope="scope">
          <span>{{scope.row.keyword}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="热度">
        <template scope="scope">
          <span>{{scope.row.useCount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template scope="scope">
          <el-button size="small" icon="circle-check" type="warning" @click="enableKeyWord(scope.row)">启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
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
    mounted: function () {
      this.findByPage();
    },
    created() {
      //监听通知
      this.$root.$on('action_disable',(target) => {
        this.findByPage();
      });
    },
    data() {
      return {
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          totalSize: 0
        },
        dataList: []
      }
    },
    methods: {
      findByPage() {
        this.listQuery.loading = true;
        this.http.get(this).url(config.keywords.keywords_search_save_url).params({
          enabled: false,
          pageIndex: this.listQuery.pageIndex,
          pageSize: this.listQuery.pageSize
        }).request(function(response) {
          this.listQuery.loading = false;
          console.log(response);
          if(response.data.code == 0){
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
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

      enableKeyWord(item) {
        this.$confirm('是否确认启用该搜索热词?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitEnable(item);
        }).catch(() => {

        });
      },

      submitEnable(item) {
        var loadingInstance = Loading.service({text: '启用中...'});
        this.http.post(this).url(config.keywords.keywords_enable_url).restful({
          keywordId: item.keywordId
        }).request(function(response) {
          loadingInstance.close();
          console.log(response);
          if(response.data.code == 0) {
            this.findByPage();
            //发送一个通知
            this.$root.$emit('action_enable', event.target);
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      }

    }
  }

</script>
