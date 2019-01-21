<template>
  <el-dialog title="选择图片" :visible.sync="selectDialogFormVisible" :before-close="handleClose">
    <div class="filter-container">
      <el-input v-model="spaceListQuery.keyword" style="width: 200px;" class="filter-item" placeholder="空间名称">
      </el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                 icon="search">搜 索
      </el-button>
    </div>

    <div class="gc-praiselist_content_list">
      <el-table v-loading="spaceListQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="spaceDataList" border style="width: 100%" @sort-change="sortChange">
        <el-table-column prop="name" label="空间名称">
          <template scope="scope">
            <span class="link-type">{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="viewAmount" label="浏览量" sortable="custom" align="center">
          <template scope="scope">
            <span class="link-type">{{scope.row.viewAmount}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="栏目数量" width="150">
          <template scope="scope">
            <span>{{scope.row.itemCount}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="图片数量" width="150">
          <template scope="scope">
            <span>{{scope.row.picCount}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center"  width="100">
          <template scope="scope">
            <el-button type="text" @click="onSelectedSpace(scope.row)" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div  class="pagination-container">
        <el-pagination @size-change="handleSizeChange" :current-page="spaceListQuery.pageIndex"
        @current-change="handleCurrentChange"
                       :page-sizes="[10,15,20,30]" :page-size="spaceListQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="spaceListQuery.total">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'

  export default {
    props: {
      selectDialogFormVisible: {
        type: Boolean,
        default: true
      }
    },

    directives: {
      waves
    },
    mounted: function () {
      this.findByPage();
    },
    data() {
      return {
        spaceListQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          keyword: "",
          column: "",
          order: ""
        },
        spaceDataList: [],
      }
    },
    methods: {

      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.spaceListQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.spaceListQuery.pageIndex = val;
        this.findByPage();
      },

      sortChange(column) {
        this.spaceListQuery.column = column.prop;
        this.spaceListQuery.order = column.order;
        this.findByPage();
      },

      doSearch() {
        this.spaceListQuery.pageIndex = 1;
        this.findByPage();
      },

      findByPage() {
        this.spaceListQuery.loading = true;
        var params = {};
        params.pageSize = this.spaceListQuery.pageSize;
        params.pageIndex = this.spaceListQuery.pageIndex;
        params.name = this.spaceListQuery.keyword.trim();
        params.order = this.spaceListQuery.order;
        params.column = this.spaceListQuery.column;

        this.http.get(this).url(config.space.list_url).params(
          params
        ).request(function(response) {
          this.spaceListQuery.loading = false;
          console.log(response);
          if(response.data.code == 0){
            this.spaceDataList = response.data.data.data;
            this.spaceListQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.spaceListQuery.loading = false;
          this.$message.error(error);
        });
      },



      onSelectedSpace(item) {
        this.$emit('onSelected', item);
      },

      handleClose(done) {
        done();
        this.close();
      },
      close() {
        this.$emit('cancel');
      }
    }

  }


</script>
