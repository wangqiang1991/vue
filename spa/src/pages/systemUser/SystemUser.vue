<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.condition" style="width: 200px;" class="filter-item" placeholder="输入用户昵称">
      </el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>

      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="用户昵称" width="200">
        <template scope="scope">
          <span class="link-type">{{scope.row.reallyName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色">
        <template scope="scope">
          <span>{{scope.row.roleStr}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
          </el-button>
          <el-button icon="delete" size="small" type="danger" @click="deleteSystemUser(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>

    <!-- 添加系统账号 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="systemUserDetail" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="登录名">
          <el-input :disabled="systemUserDetail.systemUserId != null" v-model="systemUserDetail.loginName" placeholder="请输入登录名(必填)"></el-input>
        </el-form-item>

        <el-form-item label="账号昵称">
          <el-input v-model="systemUserDetail.reallyName" placeholder="请输入账号昵称(必填)"></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="systemUserDetail.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="账号密码">
          <el-input v-model="systemUserDetail.password" type="password" placeholder="请输入账号密码(必填)"></el-input>
        </el-form-item>

        <el-form-item label="关联角色">
          <div style="max-height:200px; overflow-y: auto;">
            <div v-for="role in roles">
              <template>
                <el-checkbox v-model="role.checked">{{role.name}}</el-checkbox>
              </template>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitCreate">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import md5 from 'js-md5'

  export default {
    directives: {
      waves
    },
    data() {
      return {
        title:"",
        addDialogFormVisible: false,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          condition:""
        },
        systemUserDetail : {},
        dataList :[
        ],
        roles:[],
        permissions:[],
        oldPassword:""
      }
    },
    mounted:function() {
      this.findByPage();
      this.findRoles();
    },
    methods: {
      /**
       * 重置add_provider
       */
      resetEditProvider() {
        this.oldPassword = "";
        this.systemUserDetail = {};
        this.roles.forEach((item) => {
          item.checked = false;
        });
      },

      handleCreate() {
        this.resetEditProvider();
        this.title = "添加系统账号";
        this.addDialogFormVisible = true;
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
      findRoles() {
        this.http.get(this).url(this.config.role.list).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.roles = [];
            response.data.data.forEach((item) => {
              this.roles.push({name:item.name, roleId:item.roleId, checked:false});
            });
          },
          (error) => {

          }
        );
      },

      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },

      /**
       * 分页查询系统账号
       */
      findByPage() {
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          reallyName: this.listQuery.condition
        };
        this.http.get(this).url(this.config.system_user.search_save_url).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          },
          (error) => {

          }
        );
      },
      cancel() {
        this.resetEditProvider();
        this.addDialogFormVisible = false;
      },
      submitCreate() {
        //表单验证
        if (!this.systemUserDetail.loginName || !this.systemUserDetail.loginName.trim()) {
          this.$message({message: '登录名不能为空', type: 'warning'});
          return;
        }
        if (!this.systemUserDetail.reallyName || !this.systemUserDetail.reallyName.trim()) {
          this.$message({message: '昵称不能为空', type: 'warning'});
          return;
        }
        if (!this.systemUserDetail.password || !this.systemUserDetail.password.trim()) {
          this.$message({message: '密码不能为空', type: 'warning'});
          return;
        }

        this.systemUserDetail.roleVos = [];
        this.roles.forEach((item) => {
          if (item.checked) {
            this.systemUserDetail.roleVos.push(item);
          }
        });

        if (!this.systemUserDetail.roleVos || this.systemUserDetail.roleVos.length == 0) {
          this.$message({message: '请选择角色', type: 'warning'});
          return;
        }

        var submitParams = jQuery.extend({}, this.systemUserDetail);


        if (submitParams.password != this.oldPassword) {
          submitParams.password = md5(submitParams.password);
        } else {
          submitParams.password = null;
        }

        this.http.postJson(this).url(this.config.system_user.search_save_url).params(
        	submitParams
        ).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '保存成功!'});
            this.findByPage();
            this.addDialogFormVisible = false;
          },
          (error) => {

          }
        );
      },
      onEdit(systemUser) {
        this.resetEditProvider();
        this.title = "编辑系统账号";
        this.http.get(this).url(this.config.system_user.detail).restful({systemUserId:systemUser.systemUserId}).request(function(response) {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.systemUserDetail = response.data.data;
          this.oldPassword = this.systemUserDetail.password;
          var selectedRoles = this.systemUserDetail.roleVos;
          this.roles.forEach((item) => {
            for (var i = 0; i < selectedRoles.length; i++) {
              if (selectedRoles[i].roleId === item.roleId) {
                item.checked = true;
                break;
              }
            }
          });
          this.addDialogFormVisible = true;

        }, function(err) { });
      },
      deleteSystemUser(systemUser) {
        this.$confirm('是否要删除账号"' + systemUser.reallyName + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.system_user.delete).restful({systemUserId:systemUser.systemUserId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => { });
        }).catch(() => {
        });
      },
    }
  }

</script>
