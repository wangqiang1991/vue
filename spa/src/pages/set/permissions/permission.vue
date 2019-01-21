<template>
  <div id="permission_vue">
      <el-row style="margin-top:40px;">
        <el-col :span="11" :offset="1">
          <div style="margin-bottom:20px;">
            <el-button type="primary" icon="plus" @click="add(null,modelData,$event)">添加模块</el-button>
          </div>

          <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :expand-on-click-node="true"
            :render-content="renderContent">
          </el-tree>
        </el-col>
        <el-col :span="10" :offset="1">
            <div>
              <p style="font-size:24px;height:36px;text-align:left;color:#343434;margin:0 auto 20px;;">权限描述</p>
              <div id="permission_desc" ><span v-show="name">{{name}}: </span>{{description}}</div>
            </div>
        </el-col>
      </el-row>  

      <!--添加和编辑弹框-->
    <el-dialog :title="title" :visible.sync="dialogForm">
      <el-form :model="formmenu">

        <el-form-item :label="label.name" >
          <el-input v-model="formmenu.name" maxlength="30" auto-complete="off" placeholder="左侧导航栏的菜单名称"></el-input>
        </el-form-item>

        <el-form-item :label="label.url" v-if = "type != 3">
          <el-input v-model="formmenu.url" maxlength="200" auto-complete="off" placeholder="地址栏url的跳转地址如 role"></el-input>
        </el-form-item>

        <el-form-item :label="label.path" v-if = "type == 2">
          <el-input v-model="formmenu.path" maxlength="200" auto-complete="off" placeholder="资源文件的存放目录如 role/role"></el-input>
        </el-form-item>

        <el-form-item :label="label.code" v-if = "type == 3">
          <el-input v-model="formmenu.code" maxlength="30" auto-complete="off" placeholder="按钮的编码"></el-input>
        </el-form-item>

        <el-form-item label="权限描述">
          <el-input v-model="formmenu.description" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="255" auto-complete="off" placeholder="请输入权限描述"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="addMenuResource">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 排序弹出框 -->
    <el-dialog :title="sortTitle" :visible.sync="sortDialog">
      <el-form>

        <el-form-item label="上级名称">
          <span>{{permissionSort.parentName}}</span>
        </el-form-item>

        <el-form-item :label="sortLabelName">
          <span>{{permissionSort.name}}</span>
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number class="el-number-cus" v-model="permissionSort.number" :min="1" :max="10000"></el-input-number>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmSort">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default{
  data(){
    return{
      name:"",
      description:'',
      modelData:{
        type:0,
        permissionId:null,
        parentId:null
      },
      title:"",
      sortTitle:"",
      sortLabelName:"",
      dialogForm:false,
      sortDialog:false,
      type:null,
      permissionSort:{
        name:"",
        parentName:"",
        number:1,
        permissionId:null
      },
      label:{
        name:"",
        url:"",
        path:"",
        code:"",
        description:''
      },
      formmenu:{
        permissionId:null,
        name:"",
        path:"",
        code:"",
        url:"",
        component:null,
        description:"",
        parentId:null,
        type:1
      },
      treeData:[],
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
  mounted(){
    this.getPermissionData();
  },
  methods:{
      resetForm(){
        this.formmenu.code = "";
        this.formmenu.description = "";
        this.formmenu.url = "";
        this.formmenu.permissionId = null;
        this.formmenu.name = "";
        this.formmenu.path = "";
        this.formmenu.component = null;
        this.formmenu.description = "";
        this.formmenu.parentId = null;
        this.formmenu.type = 1;
      },
      setFormMessage(data,type,dataType){
        if (dataType == 1) {
          this.title =  type ? "添加模块" : "编辑模块";
          this.label.name = "模块名称";
          this.label.url = "模块访问路径";
        }else if(dataType == 2) {
          this.title = type ? "添加页面" : "编辑页面";
          this.label.name = "页面名称";
          this.label.url = "页面访问路径";
          this.label.path = "页面文件路径";
        }else if(dataType == 3) {
          this.title = type ? "添加按钮" : "编辑按钮";
          this.label.name = "按钮名称";
          this.label.code = "按钮编码";
        }
      },
      checkForm(){
        if (!this.formmenu.name) {
          this.$message({message: '名称不能为空', type: 'warning'});
          return false;
        }

        if (!this.formmenu.url && this.type != 3) {
          this.$message({message: '访问路径不能为空', type: 'warning'});
          return false;
        }

        if (!this.formmenu.path && this.type == 2) {
          this.$message({message: '页面文件路径不能为空', type: 'warning'});
          return false;
        }

        if (!this.formmenu.code && this.type == 3) {
          this.$message({message: '按钮编码不能为空', type: 'warning'});
          return false;
        }

        if (!this.formmenu.description) {
          this.$message({message: '权限描述不能为空', type: 'warning'});
          return false;
        }
        return true;
      },
      showDesc(store, data,event) {
        this.name = data.name;
        this.description = data.description;
      },
      add(store, data,event) {
        event.cancelBubble = true;
        //console.log(store,data)
        let permissionId = data.id;
        let type = data.type;
        this.resetForm();
        this.dialogForm = true;
        type++;
        this.setFormMessage(data,true,type);
        this.type = type;
        this.formmenu.parentId = permissionId;
        this.formmenu.permissionId = null;
      },
      addMenuResource(){
        if(this.checkForm()){
          let params = {};
          params.name = this.formmenu.name;
          params.description = this.formmenu.description;
          params.permissionId = this.formmenu.permissionId;
          params.code = this.formmenu.code;
          params.path = this.formmenu.url;
          params.component = this.formmenu.path;
          params.parentId = this.formmenu.parentId;
          params.type = this.type;

          //console.log(params)
          this.opPermissionData(params);
        }
      },
      /*添加编辑接口*/
      opPermissionData(params) {
        this.http.postJson(this).url(this.config.permission.list).params(params).request((response) => {
          var result = response;
          if (result.data.code != 0) {
            this.$message.error(result.data.message);
            return;
          }
          this.dialogForm = false;
          let message = params.permissionId ? "编辑成功" : "添加成功";
          this.$message({message: message, type: 'success'});
          this.getPermissionData();
        }, (err) => { });
      },
      edit(store, data,event) {
        event.cancelBubble = true;
        console.log(store,data)
        this.formmenu.name = data.name;
        this.formmenu.description = data.description;
        this.type = data.type;
        this.formmenu.code = data.code;
        this.formmenu.url = data.path;
        this.formmenu.path =  data.component;
        this.formmenu.permissionId = data.id;
        this.formmenu.parentId = this.IdDataSource[data.id].parentId;
        this.dialogForm = true;
        this.setFormMessage(data,false,data.type);
      },
      remove(store,data,event) {
        event.cancelBubble = true;
        //console.log(store,data)
        this.removeResource(data.name,data.id,data.type);
      },
      removeResource(name,id,type) {
        let message = "";
        if(type == 1){
          message = '您确定要删除模块 ' + name + ' ？';
        } else if (type == 2) {
          message = '您确定要删除页面 ' + name + ' ？';
        } else if(type == 3) {
          message = '您确定要删除按钮 ' + name + ' ？';
        }
        this.$confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:"warning",
            confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.permission.delete_url).restful({permissionId:id}).request((response) => {
                var result = response;
                if (result.data.code != 0) {
                  this.$message.error(result.data.message);
                  return;
                }
                this.$message({message:'删除成功!',type:"success"});
                this.getPermissionData();
            }, (err) => { });
        }).catch(() => {});
      },
      sort(store,data,event) {
        event.cancelBubble = true;
        this.sortDialog = true;
        this.permissionSort.name = data.name;
        this.permissionSort.number = data.sort;
        this.permissionSort.permissionId = data.id;
        //console.log(this.IdDataSource[data.id])
        this.permissionSort.parentName = (data.type == 1) ? "无" : this.IdDataSource[this.IdDataSource[data.id].parentId].name;
        if (data.type == 1) {
          this.sortLabelName = "模块名称";
          this.sortTitle = "模块排序";
        } else if (data.type == 2) {
          this.sortLabelName = "页面名称";
          this.sortTitle = "页面排序";
        } else if (data.type == 3) {
          this.sortLabelName = "按钮名称";
          this.sortTitle = "按钮排序";
        }
      },
      confirmSort() {
        let params = {};
        params.permissionId = this.permissionSort.permissionId;
        params.sort = this.permissionSort.number;
        this.http.post(this).url(this.config.permission.sort).params(params).request((response) => {
          var result = response;
          if (result.data.code != 0) {
            this.$message.error(result.data.message);
            return;
          }
          this.sortDialog = false;
          this.$message({message:'排序成功!',type:'success'})
          this.getPermissionData();
        }, (err) => { });
      },
      //获取权限列表
      getPermissionData() {
        this.http.get(this).url(this.config.permission.list)
        .request((response) => {
            var result = response;
            if (result.data.code != 0) {
              this.$message.error(result.data.message);
              return;
            }
            let data = result.data.data;
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
            this.name = '';
            this.description = '';
        }, (err) => { });
      },
      sortNumber(a,b){
       return a.type - b.type
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
        //console.log(this.IdDataSource)
        this.treeData = result;
      },
      recursiveData(params, data) {
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
      renderContent(h, {node, data, store}) {return(<span style="width:92%;overflow:hidden;display:inline-block;vertical-align: top;" on-click={($event)=> this.showDesc(store, data,event)}>
            <span style="height:36px;display:inline-block;line-height:36px;width:50%;">
              <span  style="display:inline-block;width:auto;min-width:182px;margin:0 10px;" v-show={node.label.type == 1}>
                <icon-svg icon-class="module"  style="margin-right:6px;"></icon-svg>
                {node.label.name}
              </span>
              <span style="display:inline-block;width:auto;min-width:166px;margin:0 10px;" v-show={node.label.type == 2}>
                <icon-svg icon-class="page" style="margin-right:6px;"></icon-svg>
                {node.label.name}
              </span>
              <span style="display:inline-block;width:auto;min-width:150px;margin:0 10px;" v-show={node.label.type == 3}>
               
                {node.label.name}
              </span>
            </span>

            <span style="height:34px;display:inline-block;vertical-align: top;padding-top: 4px;">
              <img src="/static/images/web_icon_add.png" alt="添加页面" title="添加页面" style="margin-left:20px;width:20px;height:20px;" v-show={node.label.type == 1} on-click={ ($event) => this.add(store, data,event) } />
              <img src="/static/images/web_icon_edit.png" alt="编辑模块" title="编辑模块" style="margin-left:20px;width:20px;height:20px;"v-show={node.label.type == 1} on-click={ ($event) => this.edit(store, data,event) } />
              <img src="/static/images/web_icon_sort.png" alt="模块排序" title="模块排序" style="margin-left:20px;width:20px;height:20px;" v-show={node.label.type == 1} on-click={ ($event) => this.sort(store, data,event) } />
              <img src="/static/images/web_icon_del.png" alt="删除模块" title="删除模块" style="margin-left:20px;width:20px;height:20px;"v-show={node.label.type == 1} on-click={ ($event) => this.remove(store, data,event) } />

       
              <img src="/static/images/add_gray.png" alt="添加按钮" title="添加按钮"   style="margin-left:12px;width:20px;height:20px;" v-show={node.label.type == 2} on-click={ ($event) => this.add(store, data,event) } />
              <img src="/static/images/edit_gray.png" alt="编辑页面" title="编辑页面"  style="margin-left:20px;width:20px;height:20px;"v-show={node.label.type == 2} on-click={ ($event) => this.edit(store, data,event) } />
              <img src="/static/images/sort_gray.png" alt="页面排序" title="页面排序"  style="margin-left:20px;width:20px;height:20px;" v-show={node.label.type == 2} on-click={ ($event) => this.sort(store, data,event) } />
              <img src="/static/images/del_gray.png" alt="删除页面" title="删除页面"  style="margin-left:20px;width:20px;height:20px;"v-show={node.label.type == 2} on-click={ ($event) => this.remove(store, data,event) } />

                
             
              <img src="/static/images/edit_gray.png" alt="编辑按钮" title="编辑按钮"  style="margin-left:42px;width:20px;height:20px;" v-show={node.label.type == 3} on-click={ ($event) => this.edit(store, data,event) } />
              <img src="/static/images/sort_gray.png" alt="按钮排序" title="按钮排序"  style="margin-left:20px;width:20px;height:20px;"v-show={node.label.type == 3} on-click={ ($event) => this.sort(store, data,event) } />
              <img src="/static/images/del_gray.png" alt="删除按钮" title="删除按钮"  style="margin-left:20px;width:20px;height:20px;" v-show={node.label.type == 3} on-click={ ($event) => this.remove(store, data,event) } />

            </span>

          </span>);
      }
  },
}

</script>

<style lang="scss">
  #permission_vue{
    padding: 10px 20px 20px;
    .el-form-item__label{
      width:120px;
      text-align: right;
    }
    .el-form-item__content{
      float: left;
      width:75%;
    }
   // .el-tree-node__expand-icon {
   //   display:none;
   // }
   #permission_desc{
    width:100%;
    height:200px;
    border:1px solid #d1dbe5;
    padding:10px;
    color:#666;
    font-size:16px;
    span{
      color:#343434;
    }
   }
  }
</style>
