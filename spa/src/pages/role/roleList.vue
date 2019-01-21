<template>
  <div class="app-container calendar-list-container" id="role_vue">
    <div class="filter-container">
      <el-input @keyup.enter.native="findAll()" v-model="listQuery.name" style="width:230px;" class="filter-item" placeholder="输入角色名称"></el-input>
      <el-button @click="findAll" class="filter-item" style="margin-left: 10px;" type="primary"  icon="search">搜索 </el-button>
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>

    </div>

     <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="角色" width="200">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>


      <el-table-column label="资源">
        <template scope="scope">
          <span>{{scope.row.permissionStr}}</span>
        </template>
      </el-table-column>

      
      <el-table-column label="员工">
        <template scope="scope">
          <span>{{scope.row.systemUsersStr}}</span>
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
          <el-button v-if="scope.row.name != '系统管理员'" icon="delete" size="small" type="danger" @click="deleteRole(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="add_role" label-position="left" label-width="100px" style='width: 90%; margin-left:50px;'>

        <el-form-item label="角色名称">
          <el-input v-model="add_role.name" placeholder="请输入角色名称(必填)" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="角色资源">
          <div id="treeDiv">
            <el-tree style="padding:10px;"
              :data="permissions"
              :props="defaultProps"
              ref="tree"
              node-key="id"
              :show-checkbox="false"
              :default-expand-all="false"
              :check-strictly="true"
              :expand-on-click-node="true"
              :render-content="renderContent">
            </el-tree>
          </div>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请填写角色描述" maxlength="200"  v-model="add_role.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCreate">保 存</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>

import session from '@/utils/session'
  export default{
    data() {
      return {
        title:"",
        addDialogFormVisible: false,
        add_role:{
          name:"",
          description:"",
          permissions:[],
          roleId:null
        },
        listQuery: {
          loading: false,
          name:'',
        },
        checkeId:[],
        dataList :[],
        permissions:[],
        pathData:[],
        componentData: [],
        IdDataSource: {},
        defaultProps: {
          children: 'children',
          label: (data, node) => {
            return data;
          }
        }
      }
    },
    mounted() {
      this.findAllPermissions();
      this.findAll();      
    },
    methods:{
      nodeClick(data,checked, event) {

        event.cancelBubble = true;
        checked = !checked;
        this.setCheck(data, checked);

        var parent = data.parent;
        if (!parent) {
          return;
        }
        if (checked) {
          while(parent) {
            parent.checked = true;
            //$("#cb_" + parent.id).text("已选中");
            this.setBackgroundImage($("#cb_" + parent.id),true);
            parent = parent.parent;
          }
        } else {
          if (parent.children) {
            for (var i = 0; i < parent.children.length; i++) {
              var item = parent.children[i];
              if (item.checked) {
                return;
              }
            }
            if (parent.type == 1) {
              parent.checked = false;
              //$("#cb_" + parent.id).text("未选中");
              this.setBackgroundImage($("#cb_" + parent.id),false);
            }
          }
        }
      },
      setCheck(data, checked) {
        data.checked = checked;

        this.setBackgroundImage($("#cb_" + data.id),checked);
        //$("#cb_" + data.id).text(checked ? "已选中" : "未选中");
        if(data.children != undefined) {
          data.children.forEach((item)=>{
            item.checked = checked;
            //$("#cb_" + item.id).text(checked ? "已选中" : "未选中");
            this.setBackgroundImage($("#cb_" + item.id),checked);
            if(item.children != undefined){
              this.setCheck(item, checked)
            }
          });
        };
      },
      getPermissionId(data) {
        if( data.length ) {
          data.forEach((item)=>{
            if ( item.checked) {
              var obj = {};
              obj.permissionId = item.id;
              this.add_role.permissions.push(obj);
            }
            if(item.children != undefined){
              this.getPermissionId(item.children)
            }
          });
        };
      },
      clearCheck(data) {
        if( data.length ) {
          data.forEach((item)=>{
            item.checked  = false;
            this.setBackgroundImage($("#cb_" + item.id),item.checked);
            if(item.children != undefined){
              this.clearCheck(item.children)
            }
          });
        };
      },
      setPermissionId(data,backData) {

        for (var i = 0; i < data.length; i++){
          var item = data[i];
          for(var j = 0; j < backData.length; j++){
            var backItem = backData[j];
            item.checked = false;
            if (item.id == backItem.permissionId) {
              item.checked = true;
              this.setBackgroundImage($("#cb_" + item.id),true);
              break;
            } else {
              this.setBackgroundImage($("#cb_" + item.id),false);
            }
          }
          if(item.children != undefined){
            this.setPermissionId(item.children,backData)
          }
        };

      },
      setBackgroundImage(content,type) {
        type ? content.css("background-image","url(/static/images/check.png)") : content.css("background-image","url(/static/images/uncheck.png)");
      },
      handleCreate() {
        this.title = "添加角色";
        this.addDialogFormVisible = true;
        this.resetEditProvider();
      },
      resetEditProvider() {
        this.add_role.name = "";
        this.add_role.description = "";
        this.add_role.permissions = [];
        this.add_role.roleId = null;
        setTimeout(()=>{
          this.clearCheck(this.$refs.tree.data)
        },100)
      },
      checkeForm() {
        if (!this.add_role.name) {
          this.$message({message: '角色名称不能为空', type: 'warning'});
          return false;
        }

        if (!this.add_role.permissions.length) {
          this.$message({message: '请选择角色资源', type: 'warning'});
          return false;
        }

        return true;
      },
      submitCreate(){
        this.add_role.permissions = [];
        this.getPermissionId(this.$refs.tree.data);
        console.log(this.add_role.permissions)

        if(this.checkeForm()){
          var params = {};
          params.name = this.add_role.name;
          params.description = this.add_role.description;
          params.permissions = this.add_role.permissions;
          params.roleId = this.add_role.roleId;

          this.http.postJson(this).url(this.config.role.save).params(params).request(
            function(response) {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '保存成功!'});
              this.findAll();
              this.clearCheck(this.$refs.tree.data);
              this.addDialogFormVisible = false;
            }, function(err) { }
          );
        }
      },
      findAllPermissions() {
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.permission.list).request(
          function(response) {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            let data = response.data.data;
            data.sort(this.sortNumber)
            for(var i = 0; i < data.length-1; i++) {
              var temp = {};
              for(var j = i + 1; j < data.length; j++) {
                if (data[i].sort >  data[j].sort && data[i].type == data[j].type) {
                  temp = data[i];
                  data[i] = data[j];
                  data[j] = temp;
                }
              }
            }
            this.geteData(data);
          }, function(err) {console.log(err) }
        );
      },
      sortNumber(a,b){
       return a.type - b.type
      },
      findAll() {
        let params = {};
        params.name = this.listQuery.name;
        this.listQuery.loading = true;
        this.http.get(this).url(this.config.role.list).params(params).request(
          function(response) {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.dataList = [];
            let data = response.data.data;
            let user = session.getUser();

            if(user.reallyName != "系统管理员"){
              for(var i = 0; i < data.length; i++){
                if(data[i].name != "系统管理员"){
                  this.dataList.push(data[i]);
                }
              }
            }else{
              this.dataList = data;
            }

            this.listQuery.loading = false;
          }, function(err) { console.log(err)}
        );
      },
      onEdit(role) {
        this.title = "编辑角色";
        this.addDialogFormVisible = true;
        this.http.get(this).url(this.config.role.edit).restful({roleId:role.roleId}).request(function(response) {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.add_role = response.data.data;
          setTimeout(()=>{
            this.setPermissionId(this.$refs.tree.data,response.data.data.permissions);
          },100);
        }, function(err) { });
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
                return ;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findAll();
            }, (err) => { });
        }).catch(() => {
        });
      },
      //递归数据
      geteData(data) {
        var _arr = [];
        var result = [];
        var _obj = {};
        var listdata = {};
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          if (_arr.indexOf(list.permissionId) < 0) {
            //将所有的pemissiondId 放入数组
            _arr.push(list.permissionId);
          }
          //添加一级目录
          if (list.parentId == null && list.permissionId != null) {
            var temp = {};
            temp.id = list.permissionId;
            temp.name = list.name;
            temp.path = list.path;
            temp.component = list.component;
            temp.type = list.type;
            temp.code = list.code;
            temp.sort = list.sort;
            temp.description = list.description;
            temp.checked = false;
            temp.parent = null;
            result.push(temp);
          }
          var _path = {};
          _path[list.permissionId] = list.path;
          this.pathData.push(_path);
          var _com = {};
          _com[list.permissionId] = list.component;
          this.componentData.push(_com);
          //根据id 保存value
          this.IdDataSource[list.permissionId] = list;
        }
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          //二级目录及更多
          if (list.parentId != null && list.permissionId != null) {
            if (_arr.indexOf(list.parentId) > -1) {
              //递归查找
              this.recursiveData(list, result);
            }
          }
        }
        //console.log(result)
        this.permissions = result;
      },
      recursiveData(params, data, type) {
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          if (params.parentId == list.id) {
            //console.log(params)
            if (list.children == undefined) {
              //新增children数组
              var childarr = [];
              var temp = {};
              temp.id = params.permissionId;
              temp.name = params.name;
              temp.path = params.path;
              temp.component = params.component;
              temp.type = params.type;
              temp.sort = params.sort;
              temp.code = params.code;
              temp.description = params.description;
              temp.checked = false;
              temp.parent = list;
              // temp.path = list.path;
              // temp.component = list.component;
              // temp.type = list.type;

              childarr.push(temp);
              list.children = childarr;

            } else {
              var temp = {};
              temp.id = params.permissionId;
              temp.name = params.name;
              temp.path = params.path;
              temp.component = params.component;
              temp.type = params.type;
              temp.sort = params.sort;
              temp.code = params.code;
              temp.description = params.description;
              temp.parent = list;
              // temp.path = list.path;
              // temp.component = list.component;
              // temp.type = list.type;

              list.children.push(temp);
            }
            break;
          } else {
            if (list.children != undefined) {
              this.recursiveData(params, list.children);
            }
          }
        }
      },
      renderContent(h, {node, data, store}) {return(<span style="width:100%;height:100%;overflow:hidden;display: flex;align-items: center; ">
          <span style="height:28px;display: inline-block;">
            <i id={"cb_" + data.id} on-click={ ($event) => this.nodeClick(data, data.checked, $event) }></i>
          </span>



          <span  style="display:inline-block;width:auto;min-width:182px;margin:0 10px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-show={node.label.type == 1}>
            <icon-svg icon-class="module"  style="margin-right:6px;"></icon-svg>
            {node.label.name}
          </span>
          <span style="display:inline-block;width:auto;min-width:166px;margin:0 10px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-show={node.label.type == 2}>
            <icon-svg icon-class="page" style="margin-right:6px;"></icon-svg>
            {node.label.name}
          </span>
          <span style="display:inline-block;width:auto;min-width:150px;margin:0 10px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" v-show={node.label.type == 3}>
            <icon-svg icon-class="button" style="margin-right:6px;"></icon-svg>
            {node.label.name}
          </span>
          </span>);
      }
    }
  }
</script>

<style lang="scss">
  #role_vue{
    .el-tree-node__expand-icon {
     display:none;
   }
   #treeDiv{
      i{
        display:inline-block;
        width:18px;
        height:18px;
        background-image:url("~/static/images/uncheck.png");
        background-size:100%;
      }
   }
   .el-dialog{
    width:50%;
   }

  }
</style>
