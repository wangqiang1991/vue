<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="keyEvent()" v-model="listQuery.goodsCondition" style="width: 200px;" class="filter-item" placeholder="商品名称或编码">
      </el-input>

      <el-select @change="selectChanged" clearable style="width: 130px" class="filter-item" v-model="listQuery.star" placeholder="星级">
        <el-option v-for="item in starArray" :key="item.star" :label="item.name" :value="item.star">
        </el-option>
      </el-select>

      <el-select @change="selectChanged()" clearable style="width: 130px" class="filter-item" v-model="listQuery.havePic" placeholder="评论图片">
        <el-option v-for="item in picArray" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
      <!-- <el-button @click="reset" class="filter-item" style="margin-left: 10px;" type="primary">重置</el-button> -->

    </div>

    <el-table :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">
      <el-table-column align="center" label="评论时间">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="评论内容">
        <template scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论图片">
        <template scope="scope">
          <span v-if='!scope.row.images'>无</span>
          <img v-else v-for="image in scope.row.imageArray" @click="viewImage(image)" style="width:50px;height:50px;margin-top: 10px;margin-left: 5px;" :src="image+config.imgtmb._200">
        </template>
      </el-table-column>

      <el-table-column align="center" label="星级" >
        <template scope="scope">
          <icon-svg v-for="n in scope.row.star" icon-class="star" class="meta-item__icon" :key="n"></icon-svg>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论用户" >
        <template scope="scope">{{scope.row.memberVo.nickName}}</template>
      </el-table-column>


      <el-table-column align="center" label="商品名称" >
        <template scope="scope">{{scope.row.goodsVo.title}}</template>
      </el-table-column>

      <el-table-column align="center" label="商品编码" >
        <template scope="scope">{{scope.row.goodsVo.goodsNumber}}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template scope="scope">
          <el-button icon="delete" size="small" type="danger" @click="deleteComments(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]"
      :current-page="listQuery.pageIndex"
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
          goodsCondition: null,
          star: null,
          picModel: 0,
          havePic: null,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
        },
        starArray: [
          {star: 1, name: '一星'},
          {star: 2, name: '二星'},
          {star: 3, name: '三星'},
          {star: 4, name: '四星'},
          {star: 5, name: '五星'}
        ],
        picArray: [
          {value: 1, name: "有图"},
          {value: 2, name: "无图"}
        ],
        dataList: []
      }
    },
    mounted() {
      this.findByPage();
    },
    methods: {
      findByPage() {
        this.loading = true;
        if (this.listQuery.havePic) {
          this.listQuery.picModel = this.listQuery.havePic;
        } else {
          this.listQuery.picModel = 0;
        }

        this.http.get(this).url(config.goodsComments.list_url).params(
          this.listQuery
        ).request(function (response) {
          this.loading = false;
          if (response.data.code == 0) {

            response.data.data.data.forEach(function (item) {
              if (item.images && item.images.length > 0) {
                item.imageArray = item.images.split(",");
              }
            });
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          this.loading = false;
          this.$message.error("服务器繁忙,请稍后再试");
        });
      },

      deleteComments(item) {
        this.$confirm('确认要删除该评论吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(config.goodsComments.delete_url).restful({commentId: item.commentId})
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

      reset() {
        this.listQuery.goodsCondition = null;
        this.listQuery.star = null;
        this.listQuery.existsPic = null;
      },

      viewImage(imageUrl) {
        window.open(imageUrl, "_blank");
      },

      keyEvent(){
        this.doSearch();
      },

      selectChanged(value) {
        //console.log(value)
        if(!value){
          this.listQuery.star = null;
        }
        this.doSearch();
      }
    }
  }

</script>
