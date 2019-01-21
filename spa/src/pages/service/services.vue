<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select @change="findAll()" v-model="listQuery.categoryId" clearable style="width: 130px" class="filter-item" placeholder="帮助类型">
        <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.name" :value="item.categoryId">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="findAll()" v-model="listQuery.title" style="width: 200px;" class="filter-item" placeholder="帮助标题">
      </el-input>
      <el-button @click="findAll" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">

      <el-table-column label="标题">
        <template scope="scope">
          <span @click="handleEdit(scope.row)" class="link-type">{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" width="200">
        <template scope="scope">
          <span>{{scope.row.categoryName}}</span>
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

    </el-table>


    <!-- 保存设置 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form :model="form" style="margin-right: 50px;">

        <el-form-item label="帮助标题">
          <el-input v-model="service.title"  style="width:50%;" placeholder="请输入标题(必填)"></el-input>
        </el-form-item>

        <el-form-item label="帮助类型">
          <el-select v-model="service.categoryId" clearable style="width: 300px" class="filter-item" placeholder="帮助类型">
            <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.name" :value="item.categoryId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="详情内容">
          <el-button type="text" @click="editDetailInfo">点击编辑帮助内容</el-button>
        </el-form-item>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>



  </div>
</template>
<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import { Loading } from 'element-ui'

  export default {
    directives: {
      waves
    },
    mounted: function () {
      this.findCategory();
      this.findAll();
    },
    data() {
      return {
        title:'新增帮助信息',
        addDialogFormVisible: false,
        categoryList: [],
        listQuery:{
          loading:false,
          categoryId:'',
          title:''
        },
        service: {cover:'',title:'',detailId:'',categoryId:''},
        dataList: []

      }
    },
    methods: {
      findCategory() {
        this.http.get(this).url(config.service.category_list_url).params({
        }).request(function (response) {
          if (response.data.code == 0) {
            this.categoryList = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          this.$message.error(error);
        });
      },


      findAll() {
        this.listQuery.loading = true;
        this.http.get(this).url(config.service.service_list_url).params(
          this.listQuery
        ).request(function(response) {
          this.listQuery.loading = false;
          console.log(response);
          if(response.data.code == 0){
            this.dataList = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },

      deleteItem(item) {
        this.$confirm('确认删除该条记录吗?', '提示', {
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
        this.http.delete(this).url(config.service.service_delete_url).restful({
          serviceId: item.serviceId
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

      reset() {
        this.service = {cover:'',title:'',detailId:'',categoryId:''};
      },

      handleCreate() {
        this.reset();
        this.addDialogFormVisible = true;
        this.title = "新增帮助信息";
      },

      handleEdit(item) {
        this.addDialogFormVisible = true;
        this.title = "编辑帮助信息";
        this.service = item;
      },

      save() {
        let validate = this.saveValidate();
        if (validate) {
          var loadingInstance = Loading.service({text: '数据提交中...'});

          this.http.postJson(this).url(config.service.service_save_url).params(
            this.service
          ).request(function (response) {
            loadingInstance.close();
            console.log(response);
            if (response.data.code == 0) {
              this.$message({message: '保存信息成功', type: 'success'});
              this.addDialogFormVisible = false;
              this.reset();
              this.findAll();
            } else {
              this.$message.error(response.data.message);
            }
          },function (error) {
            loadingInstance.close();
            this.$message.error(error);
          });
        }

      },


      /**
       * 保存的时候表单验证
       */
      saveValidate() {

        if (!this.service.title || !this.service.title.trim()) {
          this.$message({message: '帮助标题不能为空', type: 'warning'});
          return false;
        }

        if (!this.service.categoryId || !this.service.categoryId.trim()) {
          this.$message({message: '请选择帮助类型', type: 'warning'});
          return false;
        }

        if (!this.service.detailId || !this.service.detailId.trim()) {
          this.$message({message: '请编辑帮助内容', type: 'warning'});
          return false;
        }
        return true;
      },


      /**
       * 编辑详情
       */
      editDetailInfo() {
        if (!this.service.detailId) {
          let params = {
            title:"帮助内容详情",
            type:1
          };
          this.http.postJson(this).url(this.config.articles.save_url).params(params).request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.service.detailId = response.data.data.articleId;
              window.open("/editor/editor.html?articleId=" + this.service.detailId, "_blank");
            },
            (error) => {}
          );
        } else {
          window.open("/editor/editor.html?articleId=" + this.service.detailId, "_blank");
        }
      }



    }

  }


</script>
