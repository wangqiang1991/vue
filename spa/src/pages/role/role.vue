<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="角色" width="200">
        <template scope="scope">
          <span class="link-type">{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="资源">
        <template scope="scope">
          <span>{{scope.row.permissionStr}}</span>
        </template>
      </el-table-column>

      <el-table-column label="描述">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
          </el-button>
          <el-button icon="delete" size="small" type="danger" @click="deleteRole(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="add_role" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>

        <el-form-item label="角色名称">
          <el-input v-model="add_role.name" placeholder="请输入角色名称(必填)"></el-input>
        </el-form-item>

        <el-form-item label="角色资源">
          <ul id="treeDemo" class="ztree"></ul>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请填写角色描述" style="width: 500px;" v-model="add_role.description">
          </el-input>
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

  var selectedPermissions = [];
  var setting = {
  			check: {
  				enable: true,
          chkboxType : { "Y" : "ps", "N" : "ps" }
  			},
  			data: {
  				simpleData: {
  					enable: true
  				}
  			},
        callback:{
          onCheck:function() {
            var treeObj = jQuery.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.getCheckedNodes(true);
            var ps = [];
            for(var i=0; i<nodes.length; i++) {
              ps.push({permissionId:nodes[i].id});
            }
            selectedPermissions = ps;
            console.log(selectedPermissions);
          }
        }
  		};

  		var zNodes = [];

  function fillPermissionTree(permission, checkedPermission) {
    console.log(checkedPermission)
      var ps = [];
      permission.forEach((item) => {
          ps.push({id:item.permissionId, pId:item.parentId, name:item.name, open:true, checked:isChecked(item, checkedPermission)});
      });
      console.log(ps)
      zNodes = ps;
  }

  function isChecked(item, checkedPermission) {

    if (checkedPermission && checkedPermission.length > 0) {
      for (var i = 0; i < checkedPermission.length; i++) {
        var checked = checkedPermission[i];
        if (checked.permissionId == item.permissionId) {
          return true;
        }
      }
      return false;
    }
  }

  export default {
    directives: {
      waves
    },
    data() {
      return {
        title:"",
        addDialogFormVisible: false,
        listQuery: {
          loading: false
        },
        add_role : {},
        dataList :[
        ],
        permissions:[]
      }
    },
    mounted:function() {
      this.findAllPermissions();
    },
    methods: {

      cancel() {
        jQuery.fn.zTree.init($("#treeDemo"), setting, zNodes);
        this.addDialogFormVisible = false
      },

      /**
       * 重置add_provider
       */
      resetEditProvider() {
        this.add_role = {};
        selectedPermissions = [];
      },

      /**
       * 展示添加角色
       */
      handleCreate() {
        this.resetEditProvider();
        this.title = "添加角色";
        this.addDialogFormVisible = true;

        fillPermissionTree(this.permissions, null);
        // 必须延迟500ms才能得到dom元素
        setTimeout(function() {
          jQuery.fn.zTree.init($("#treeDemo"), setting, zNodes);
        }, 200);
      },

      /**
       * 提交添加角色
       */
      submitCreate() {
        //表单验证
        if (!this.add_role.name || !this.add_role.name.trim()) {
          this.$message({message: '角色名称不能为空', type: 'warning'});
          return;
        }
        if (selectedPermissions.length == 0) {
          this.$message({message: '请选择角色资源', type: 'warning'});
          return;
        }
        this.add_role.permissions = selectedPermissions;
        this.http.postJson(this).url(this.config.role.save).params(this.add_role).request(
          function(response) {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '保存成功!'});
            this.findAll();
            this.addDialogFormVisible = false;
          }, function(err) { }
        );

      },

      findAllPermissions() {
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.permission.list).request(
          function(response) {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.permissions = response.data.data;
            this.findAll();
          }, function(err) { }
        );
      },

      /**
       * 查询所有
       */
      findAll() {
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.role.list).request(
          function(response) {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.dataList = response.data.data;
            this.listQuery.loading = false;
          }, function(err) { }
        );
      },

      deleteRole(role) {
        this.$confirm('是否要删除角色"' + role.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.role.delete).restful({roleId:role.roleId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findAll();
            }, (err) => { });
        }).catch(() => {
        });
      },

      onEdit(role) {
        this.title = "编辑角色";
        this.http.get(this).url(this.config.role.edit).restful({roleId:role.roleId}).request(function(response) {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.add_role = response.data.data;
          this.addDialogFormVisible = true;
          selectedPermissions = this.add_role.permissions;
          fillPermissionTree(this.permissions, this.add_role.permissions);
          setTimeout(function() {
            jQuery.fn.zTree.init($("#treeDemo"), setting, zNodes);
          }, 200);
        }, function(err) { });
      }

    }
  }

</script>
