<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.condition" style="width: 150px;" class="filter-item" placeholder="物流商名称">
      </el-input>
      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.expressCode" style="width: 150px;" class="filter-item" placeholder="物流商编码">
      </el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="物流商名称">
        <template scope="scope">
          <span @click="handleEdit(scope.row)" class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人" >
        <template scope="scope">
          <span>{{scope.row.master}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人电话" >
        <template scope="scope">
          <span>{{scope.row.masterPhone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流商编码" >
        <template scope="scope">
          <span>{{scope.row.expressCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流商电话" >
        <template scope="scope">
          <span>{{scope.row.hotPhone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流商网址" >
        <template scope="scope">
          <span @click="handleLink(scope.row)" class="link-type">{{scope.row.website}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="物流商描述" >
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="承接包裹数" >
        <template scope="scope">
          <span>{{scope.row.orderCount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="delete" type="danger" @click="deleteExpress(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加物流商 -->
    <el-dialog :title="actionMode" :visible.sync="saveDialogFormVisible">
      <el-form class="small-space" :model="add_express" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>

        <el-form-item label="物流商名称">
          <el-input v-model="add_express.name" maxlength="50" placeholder="请输入物流商名称(必填)"></el-input>
        </el-form-item>

        <el-form-item label="物流商编码">
          <el-input v-model="add_express.expressCode" maxlength="20" placeholder="请输入物流商编码(必填)"></el-input>
        </el-form-item>

        <el-form-item label="联系人">
          <el-input v-model="add_express.master" maxlength="20" placeholder="请输入联系人(必填)"></el-input>
        </el-form-item>

        <el-form-item label="联系人电话">
          <el-input v-model="add_express.masterPhone" maxlength="20" placeholder="请输入联系人电话(必填)"></el-input>
        </el-form-item>

        <el-form-item label="物流商电话">
          <el-input v-model="add_express.hotPhone" maxlength="20" placeholder="请输入物流商电话(必填)"></el-input>
        </el-form-item>

        <el-form-item label="物流商网址">
          <el-input v-model="add_express.website" maxlength="255" placeholder="请输入物流商网址(必填)"></el-input>
        </el-form-item>

        <el-form-item label="物流商描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="200" placeholder="请填写物流商描述" style="width: 500px;" v-model="add_express.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveDialogFormVisible = false">取 消</el-button>
        <el-button @click="saveExpress" type="primary">保 存</el-button>
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
    data() {
      return {
        saveDialogFormVisible: false,
        listQuery: {
          loading: false,
          condition: '',
          expressCode :''
        },
        actionMode: '添加物流商',
        dataList :[],
        add_express: {

        }
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

      findByPage() {
        this.listQuery.loading = true;
        this.http.get(this).url(config.express.express_search_save_url).params({
          name:this.listQuery.condition,
          expressCode :this.listQuery.expressCode
        }).request(function(response) {
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

      handleCreate() {
        this.add_express = {
          name: '',
          hotPhone: '',
          website: '',
          expressCode:''
        };
        this.actionMode = '添加供应商';
        this.saveDialogFormVisible = true;
      },
      handleEdit(item) {
        this.actionMode = '编辑供应商'
        this.saveDialogFormVisible = true;
        this.add_express = $.extend({},item);
      },
      handleLink(item) {
        window.open(item.website,"_blank");
      },
      saveExpress() {
        //表单验证
        if (!this.add_express.name || !this.add_express.name.trim()) {
          this.$message({message: '物流商名称不能为空', type: 'warning'});
          return;
        }
        if (!this.add_express.expressCode || !this.add_express.expressCode.trim()) {
          this.$message({message: '物流商编码不能为空', type: 'warning'});
          return;
        }
        if (!this.add_express.master || !this.add_express.master.trim()) {
          this.$message({message: '物流商联系人不能为空', type: 'warning'});
          return;
        }
        if (!this.add_express.masterPhone || !this.add_express.masterPhone.trim()) {
          this.$message({message: '物流商联系人电话不能为空', type: 'warning'});
          return;
        }
        if (!this.add_express.hotPhone || !this.add_express.hotPhone.trim()) {
          this.$message({message: '物流商电话不能为空', type: 'warning'});
          return;
        }
        if (!this.add_express.website || !this.add_express.website.trim()) {
          this.$message({message: '物流商网址不能为空', type: 'warning'});
          return;
        }

        var loadingInstance = Loading.service({text: '数据提交中...'});

        this.http.postJson(this).url(config.express.express_search_save_url).params(
          this.add_express
        ).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '添加物流商成功', type: 'success'});
            this.saveDialogFormVisible = false;
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

      /**
       * 删除供应商
       */
      deleteExpress(item) {
        this.$confirm('此操作删除供应商, 是否继续?', '提示', {
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
        this.http.delete(this).url(config.express.express_delete_url).restful({
          expressId:item.expressId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '删除物流商成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }
        },function (error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      }
    }
  }



</script>
