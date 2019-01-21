<template>
  <el-dialog title="集赞内容展示" size="large" :visible.sync="show" :before-close="handleClose">
    <div class="gc-praiselist_content_list">
      <el-table
        v-loading="queryPrams.loading"
        element-loading-text="努力加载中..."
        ref="multipleTable"
        :data="dataList"
        border
        style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="65">
        </el-table-column>
        <el-table-column
          label="用户头像"
          align="center"
          width="100"
          vertical="middle">
          <template scope="scope">
            <img style="width:50px;height:50px;" :src="scope.row.memberHead+config.imgtmb._200" class="gc_praiselist_list_img">
          </template>
        </el-table-column>
        <el-table-column
          prop="memberNickName"
          width="150"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          label="标签"
          align="center"
          width="150">
          <template scope="scope">
            <el-tag type="gray" :key='tag' v-for="tag in scope.row.tagVos">{{tag}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="内容"
          align="center">
          <template scope="scope">
            <span>{{scope.row.replayContent}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="发布时间"
          align="center">
          <template scope="scope">
            <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div  class="pagination-container">
        <el-pagination @size-change="handleSizeChange" :current-page="queryPrams.pageIndex"
         @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="queryPrams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="queryPrams.total">
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
      show: {
        type: Boolean,
        default: true
      }
    },

    directives: {
      waves
    },
    mounted: function () {

    },
    data() {
      return {
        queryPrams: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          areaId:"",
          styleId:"",
          keyword: "",
          column: "",
          order: "",
          putaway: true,
          goodsId: null
        },
       dataList: [],
       imageStyles:[],
       roomAreas:[],
      }
    },
    methods: {
      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.queryPrams.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.queryPrams.pageIndex = val;
        this.findByPage();
      },
      findByPage (){
        this.queryPrams.loading = true;
        this.http.get(this).url(this.config.praise_goods.comments).restful({goodsId: this.goodsId}).params(this.queryPrams).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            console.log(response.data);
            this.dataList = response.data.data.data;
            this.queryPrams.total = response.data.data.totalSize;
            this.queryPrams.loading = false;
          },
          (error) => {

          }
        );
      },
      handleClose(done) {
        done();
        this.close();
      },
      close() {
        this.$emit('cancel');
      },
      loadCommentByGoodsId(goodsId) {
        this.goodsId = goodsId;
        this.queryPrams.pageSize = 1;
        this.findByPage();
      }
    }

  }


</script>
