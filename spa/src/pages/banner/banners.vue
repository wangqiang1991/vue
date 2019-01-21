<template>
  <div class="app-container calendar-list-container">
    <div v-show="state=='list'" class="gc-praiselist_content">
      <div class="filter-container">
        <el-select @change="statusChanged()" clearable style="width: 130px" class="filter-item" v-model="listQuery.status" placeholder="活动状态">
          <el-option v-for="item in searchStatus" :key="item.key" :label="item.display_name" :value="item.key">
          </el-option>
        </el-select>

        <el-input @keyup.enter.native="keyEvent()" v-model="listQuery.title" style="width: 200px;" class="filter-item" placeholder="活动标题">
        </el-input>
        <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
        <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加</el-button>
      </div>

      <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
        <el-table-column type="index" align="center" label="序号" width="65">
        </el-table-column>

        <el-table-column label="活动标题">
          <template scope="scope">
            <span @click="handleEdit(scope.row)" class="link-type">{{scope.row.title}}</span>
          </template>
        </el-table-column>

        <el-table-column label="活动封面" align="center" width="200">
          <template scope="scope">
            <img style="width:146px;height:50px;margin-top:10px;" :src="scope.row.cover + '?imageView2/1/w/375/h/128'" class="gc_praiselist_list_img">
          </template>
        </el-table-column>


        <el-table-column align="center" label="浏览次数" width="200">
          <template scope="scope">
            <span>{{scope.row.viewAmount}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态" width="200">
          <template scope="scope">
            <span v-if="scope.row.status === 1" style="color:#cacaca;">未发布</span>
            <span v-if="scope.row.status === 2" style="color:#86c055">已发布</span>
          </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="300">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-if="scope.row.status === 1" size="small" icon="circle-check" type="success" @click="publish(scope.row)">发布
            </el-button>
            <el-button v-if="scope.row.status === 2" size="small" icon="circle-close" type="warning" @click="cancelPublish(scope.row)">取消发布
            </el-button>
            <el-button size="small" icon="delete" type="danger" @click="deleteBanner(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageIndex"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
        </el-pagination>
      </div>

    </div>

    <save-banner ref="banners" @success="createSuccess()" @cancel="state='list'" v-show="state=='create'">
    </save-banner>


  </div>
</template>
<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import { Loading } from 'element-ui'
  import SaveBanner from './saveBanner.vue'

  const searchStatus = [
    { key: '1', display_name: '未发布' },
    { key: '2', display_name: '已发布' }
  ]

  export default {
    components: {
      SaveBanner
    },
    directives: {
      waves
    },
    data() {
      return {
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          status: '',
          title: ''
        },
        searchStatus,
        dataList: [],
        state:"list"
      }
    },
    mounted:function() {
      this.findByPage();
    },
    methods: {

      doSearch() {
        this.listQuery.pageIndex = 1;
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


      /**
       * 分页查询Banner
       */
      findByPage() {
        this.listQuery.loading = true;
        this.http.get(this).url(config.banner.banner_list_url).params(
          this.listQuery
        ).request(function(response) {
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
       * 删除供应商
       */
      deleteBanner(item) {
        this.$confirm('确认删除当前活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitDelete(item);
        }).catch(() => {
        });
      },

      submitDelete(item) {
        var loadingInstance = Loading.service({text: '删除中...'});
        this.http.delete(this).url(config.banner.banner_delete_url).restful({
          bannerId:item.bannerId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '删除活动成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }

        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },


      publish(item) {
        this.$confirm('确认发布当前活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitPublish(item);
        }).catch(() => {
        });
      },

      submitPublish(item) {
        var loadingInstance = Loading.service({text: '发布中...'});
        this.http.put(this).url(config.banner.banner_publish_url).restful({
          bannerId:item.bannerId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '发布活动成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }

        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },


      cancelPublish(item) {
        this.$confirm('确认取消当前活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitCancelPublish(item);
        }).catch(() => {
        });
      },

      submitCancelPublish(item) {
        var loadingInstance = Loading.service({text: '取消中...'});
        this.http.put(this).url(config.banner.banner_cancelPublish_url).restful({
          bannerId:item.bannerId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '取消活动成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }

        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },


      createSuccess() {
        this.state = "list";
        this.findByPage();
      },

      handleEdit(item) {
        this.state = "create";
        this.$refs.banners.loadSource(item);
      },

      handleCreate() {
        this.state = "create";
      },

      keyEvent() {
        this.doSearch();
      },

      statusChanged() {
        this.doSearch();
      }

    }
  }


</script>
