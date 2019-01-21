<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加
      </el-button>

    </div>

    <el-table :data="dataList" v-loading.body="listQuery.loading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column min-width="300" label="标题">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>


      <el-table-column width="200" align="center" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="delete" type="danger" @click="deleteItem(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="拖拽排序" width="95">
        <template scope="scope">
          <icon-svg class='drag-handler' icon-class="drag"></icon-svg>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'
  import Sortable from 'sortablejs'
  import uploader from "../../utils/uploader";

  export default {
    directives: {
      waves
    },
    mounted: function () {
      this.findAll();
    },
    data() {
      return {
        listQuery: {
          loading: false
        },
        dataList:[]
      }
    },
    methods: {
      findAll() {
        this.dataList = [];
        this.olderList = [];
        this.newList = [];

        this.listQuery.loading = true;
        this.http.get(this).url(config.service.category_list_url).params({}).request(function (response) {
          this.listQuery.loading = false;
          console.log(response);
          if (response.data.code == 0) {
            this.dataList = response.data.data;
            this.olderList = this.dataList.map(v => v.categoryId)
            this.newList = this.olderList.slice()
            this.$nextTick(() => {
              this.setSort();
            })
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },


      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
        this.sortable = Sortable.create(el, {
          onEnd: evt => {
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
            this.newList.splice(evt.newIndex, 0, tempIndex);
            console.log(this.newList);
            this.submitSort();
          }
        });
      },

      submitSort() {
        var newIds = "";
        this.newList.forEach(function (item) {
          newIds = newIds + item + ",";
        });
        this.http.put(this).url(config.service.category_sort_url).params({
          categoryIds: newIds
        }).request(function (response) {
          this.listQuery.loading = false;
          console.log(response);
          if (response.data.code == 0) {
            this.findAll();
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },


      deleteItem(item) {
        this.$confirm('删除该类别的同时,将删除该类别下的所有内容,确认继续吗?', '提示', {
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
        this.http.delete(this).url(config.service.category_delete_url).restful({
          categoryId: item.categoryId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '删除成功', type: 'success'});
            this.findAll();
          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },



      handleCreate() {
        this.$prompt('请输入类型名称', '新增服务类型', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if (value != null && value.trim()) {
            this.submitSave(null,value);
          } else {
            this.$message({
              type: 'warning',
              message: '服务类型名称不能为空'
            });
          }
        }).catch(() => {
        });
      },


      handleEdit(item) {
        this.$prompt('请输入类型名称', '新增服务类型', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: item.name
        }).then(({ value }) => {
          if (value != null && value.trim()) {
            this.submitSave(item.categoryId,value);
          } else {
            this.$message({
              type: 'warning',
              message: '服务类型名称不能为空'
            });
          }
        }).catch(() => {
        });
      },

      submitSave(categoryId,value) {
        var loadingInstance = Loading.service({text: '保存中...'});
        var params = {};
        if (categoryId) {
          params["categoryId"] = categoryId;
        }
        params["name"] = value;

        this.http.postJson(this).url(config.service.category_save_url).params(
          params
        ).request(function (response) {
          loadingInstance.close();
          if(response.data.code == 0) {
            this.findAll();
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
        });
      }



    }

  }


</script>
