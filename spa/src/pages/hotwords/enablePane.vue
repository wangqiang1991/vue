<template>
  <div class="app-container calendar-list-container" style="padding:0;">
    <div class="filter-container">
      <el-button @click="handleCreate()" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

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

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="circle-close" type="warning" @click="disableKeyWord(scope.row)">停用
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

  export default {
    directives: {
      waves
    },
    mounted: function () {
      // this.$notify.info({
      //   title: '温馨提示',
      //   message: '亲，您可以对表格内容进行拖动排序哦~'
      // });

      this.findAll();
    },
    created() {
      //监听通知
      this.$root.$on('action_enable',(target) => {
        this.findAll();
      });
    },
    data() {
      return {
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 100,
        },
        dataList: [],
        olderList: [],
        newList: [],
        sortable: null
      }
    },
    methods: {
      findAll() {

        this.dataList = [];
        this.olderList = [];
        this.newList = [];

        this.listQuery.loading = true;
        this.http.get(this).url(config.keywords.keywords_search_save_url).params({
          enabled: true,
          pageIndex: this.listQuery.pageIndex,
          pageSize: this.listQuery.pageSize
        }).request(function(response) {
          this.listQuery.loading = false;
          console.log(response);
          if(response.data.code == 0){
            this.dataList = response.data.data.data;
            this.olderList = this.dataList.map(v => v.keywordId)
            this.newList = this.olderList.slice()
            this.$nextTick(() => {
              this.setSort();
            })
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
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
      disableKeyWord(item) {
        this.$confirm('是否确认停用该搜索热词?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitDisable(item);
        }).catch(() => {

        });
      },

      submitDisable(item) {
        var loadingInstance = Loading.service({text: '停用中...'});
        this.http.post(this).url(config.keywords.keywords_disable_url).restful({
          keywordId: item.keywordId
        }).request(function(response) {
          loadingInstance.close();
          console.log(response);
          if(response.data.code == 0) {
            this.findAll();
            //发送一个通知
            this.$root.$emit('action_disable', event.target);
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

      submitSort() {
        var newIds = "";
        this.newList.forEach(function (item) {
          newIds = newIds + item + ",";
        });
        this.http.post(this).url(config.keywords.keywords_sort_url).params({
          keywordIds: newIds
        }).request(function(response) {
          this.listQuery.loading = false;
          console.log(response);
          if(response.data.code == 0) {
            this.findAll();
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },

      handleEdit(item) {
        this.$prompt('请输入搜索热词', '编辑热词', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: item.keyword
        }).then(({ value }) => {
          if (value != null && value.trim()) {
            this.submitSave(item.keywordId,value);
          } else {
            this.$message({
              type: 'warning',
              message: '搜索热词不能为空'
            });
          }
        }).catch(() => {
        });
      },

      handleCreate() {
        this.$prompt('请输入搜索热词', "添加热词", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if (value != null && value.trim()) {
            this.submitSave(null,value);
          } else {
            this.$message({
              type: 'warning',
              message: '搜索热词不能为空'
            });
          }
        }).catch(() => {
        });
      },

      submitSave(keywordId,value) {
        var loadingInstance = Loading.service({text: '保存中...'});
        var params = {};
        if (keywordId) {
          params["keywordId"] = keywordId;
        }
        params["keyword"] = value;

        this.http.postJson(this).url(config.keywords.keywords_save_url).params(
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
