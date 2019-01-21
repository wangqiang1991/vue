<template>
  <el-dialog title="选择期刊" :visible.sync="selectDialogFormVisible" :before-close="handleClose">
    <div class="filter-container">
      <el-input @keyup.enter.native="doSearch()" v-model="subjectListQuery.title" style="width: 200px !important;" class="filter-item" placeholder="输入期刊名称"></el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛 选</el-button>
    </div>

    <div class="gc-praiselist_content_list">
      <el-table v-loading="subjectListQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="subjectDataList" border style="width: 100%" @sort-change="sortChange">

        <el-table-column align="center" label="期刊名称" width="200">
          <template scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="期刊封面" vertical="middle" width="200">
          <template scope="scope">
            <img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
          </template>
        </el-table-column>

        <el-table-column prop="viewAmount" label="浏览量" sortable="custom" align="center">
          <template scope="scope">
            <span class="link-type">{{scope.row.viewAmount}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="点赞数" width="100">
          <template scope="scope">
            <span>{{scope.row.praiseAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论数" width="100">
          <template scope="scope">
            <span>{{scope.row.commentAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  width="100">
          <template scope="scope">
            <el-button type="text" @click="onSelectedSpace(scope.row)" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" :current-page="subjectListQuery.pageIndex"
        @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]" :page-size="subjectListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="subjectListQuery.total">
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
        subjectListQuery: {
          title: "",
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          column: "",
          order: ""
        },
        subjectDataList: [],
      }
    },
    methods: {

      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.subjectListQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.subjectListQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.subjectListQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage() {
        this.subjectListQuery.loading = true;
        this.http.get(this).url(this.config.subject.list_url).params(this.subjectListQuery).request(
          (response) => {
            if(response.data.code != 0) {
              this.$message({
                message: response.data.message ? response.data.message : "系统错误",
                type: 'error'
              });
              return;
            }
            console.log(response.data);
            this.subjectDataList = [];
            response.data.data.data.forEach((item)=>{
                if(item.status == 1){
                  this.subjectDataList.push(item)
                }
            });
            
            this.subjectListQuery.total = response.data.data.totalSize;
            this.subjectListQuery.loading = false;
          },
          (error) => {

          }
        );
      },
      sortChange(column) {
        this.subjectListQuery.column = column.prop;
        this.subjectListQuery.order = column.order;
        console.log(column);
        this.findByPage();
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
