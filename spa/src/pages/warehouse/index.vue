<template>
  <div class="app-container calendar-list-container" id="warehouse_vue">  
   <el-row style="margin-top:40px;">
      <el-col :span="11" :offset="1">
        <el-input placeholder="输入仓库区域名称查询" v-model="filterText" style="margin-bottom:10px;width:250px;"></el-input>
         <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            default-expand-all 
            :filter-node-method="filterNode"
            ref="tree"
            :expand-on-click-node="true"
            :render-content="renderContent">
          </el-tree>
     </el-col>
      <el-col :span="10" :offset="1">
          <div>
            <p style="font-size:24px;height:36px;text-align:left;color:#343434;margin:0 auto 10px;;">仓库区域描述</p>
            <div id="permission_desc" ><span v-show="name">{{name}}: </span>{{description}}</div>
          </div>
      </el-col>
    </el-row>      


    <el-dialog :title="title" :visible.sync="dialogForm">
      <el-form :model="warehouse">

        <el-form-item label="仓库区域名称:" >
          <el-input v-model="warehouse.name" maxlength="50" placeholder="请输入仓库区域名称"></el-input>
        </el-form-item>

        <el-form-item label="仓库区域描述:" >
          <el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 4}" maxlength="200" placeholder="请输入仓库区域描述"  v-model="warehouse.description">
              </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="saveWareHouse">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template> 

<script>

  export default{
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data(){
      return{
        name:'',
        description:'',
        filterText: "",
        title:"新增仓库区域",
        dialogForm:false,
        warehouse:{
          regionId:null,
          name:"",
          description:"",
          parentId:null
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
      this.findByPage();
    },
    methods:{
      filterNode(value, data) {
        //console.log(value,data)
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      reset(){
        this.warehouse.regionId = null;
        this.warehouse.parentId = null;
        this.warehouse.name = "";
        this.warehouse.description = "";
      },
      add(store, data,event) {
        event.cancelBubble = true;
        //console.log(store,data)
        this.dialogForm = true;
        this.reset();
        this.title = "新增仓库区域";
        this.warehouse.parentId = data.id;
        this.warehouse.regionId = null;
      },
      edit(store, data,event) {
        event.cancelBubble = true;
        //console.log(store,data)
        this.dialogForm = true;
        this.reset();
        this.title = "编辑仓库区域";
        this.warehouse.regionId = data.id;
        this.warehouse.parentId = data.parentId;
        this.warehouse.name = data.name;
        this.warehouse.description = data.description;
      },
      remove(store,data,event) {
        event.cancelBubble = true;
        //console.log(store,data)
         this.$confirm('您确定要删除仓库区域 ' + data.name + ' ？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:"warning",
            confirmButtonClass: "el-button--danger"
       }).then(() => {
          this.http.delete(this).url(this.config.storage.delete_url).restful({regionId:data.id}).request((response) => {
                var result = response;
                if (result.data.code != 0) {
                  this.$message.error(result.data.message);
                  return;
                }
                this.findByPage();
            }, (err) => {console.log(err) });
        }).catch(() => {});
      },
      checkForm() {
        if (!this.warehouse.name || !this.warehouse.name.trim()) {
          this.$message({message: '仓库区域名称不能为空', type: 'warning'});
          return false;
        }

        if (!this.warehouse.description || !this.warehouse.description.trim()) {
          this.$message({message: '仓库区域描述不能为空', type: 'warning'});
          return false;
        }
        return true;
      },
      showDesc(store, data,event) {
        this.name = data.name;
        this.description = data.description;
      },
      saveWareHouse() {
        if(this.checkForm()) {
          let params = {};
          params.name = this.warehouse.name;
          params.description = this.warehouse.description;
          params.parentId = this.warehouse.parentId;
          params.regionId = this.warehouse.regionId;
          this.http.postJson(this).url(this.config.storage.save_url).params(params).request((response) => {
            var result = response;
            if (result.data.code != 0) {
              this.$message.error(result.data.message);
              return;
            }
            this.dialogForm = false;
            this.findByPage();
          }, (err) => { console.log(err)});
        }
      },
      findByPage() {
        this.http.get(this).url(this.config.storage.list_url).request((response) => {
            var result = response;
            if (result.data.code != 0) {
              this.$message.error(result.data.message);
              return;
            }
            //console.log(result)
            this.geteData(result.data.data);
            this.name = '';
            this.description = '';
        }, (err) => {console.log(err)});
      },
      //递归数据
      geteData(data) {
        var _arr = [];
        var result = [];
        var _obj = {};
        var listdata = {};
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          if (_arr.indexOf(list.regionId) < 0) {
            //将所有的pemissiondId 放入数组
            _arr.push(list.regionId);
          }
          //添加一级目录
          if (list.parentId == null && list.regionId != null) {
            var temp = {};
            temp.id = list.regionId;
            temp.name = list.name;
            temp.description = list.description;
            temp.parentId = list.parentId;
            // temp.component = list.component;
            // temp.type = list.type;
            // temp.code = list.code;
            // temp.sort = list.sort;
            result.push(temp);
          }
          // var _path = {};
          // _path[list.regionId] = list.path;
          // this.pathData.push(_path);
          // var _com = {};
          // _com[list.regionId] = list.component;
          // this.componentData.push(_com);
          //根据id 保存value
          this.IdDataSource[list.regionId] = list;
        }
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          //二级目录及更多
          if (list.parentId != null && list.regionId != null) {
            if (_arr.indexOf(list.parentId) > -1) {
              //递归查找
              
              this.recursiveData(list, result,1);
            }
          }
        }
        //console.log(result)
        //console.log(this.IdDataSource)
        this.treeData = result;
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
              temp.id = params.regionId;
              temp.name = params.name;
              temp.description = params.description;
              temp.parentId = params.parentId;
              // temp.component = params.component;
               //temp.type = type;
              // temp.sort = params.sort;
              // temp.code = params.code;
              // temp.path = list.path;
              // temp.component = list.component;
              // temp.type = list.type;

              childarr.push(temp);
              list.children = childarr;

            } else {
              var temp = {};
              temp.id = params.regionId;
              temp.name = params.name;
              temp.description = params.description;
              temp.parentId = params.parentId;
              // temp.component = params.component;
               //temp.type = type;
              // temp.sort = params.sort;
              // temp.code = params.code;
              // temp.path = list.path;
              // temp.component = list.component;
              // temp.type = list.type;

              list.children.push(temp);
            }
            break;
          } else {
            if (list.children != undefined) {
              //let numberType = type++;
              this.recursiveData(params, list.children );
            }
          }
        }
      },
       renderContent(h, {node, data, store}) {return(<span style="width:92%;overflow:hidden;display:inline-block;vertical-align: top;height:36px;" on-click={($event)=> this.showDesc(store, data,event)}>

            <span style="height:36px;display:inline-block;line-height:36px;width:50%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
              <icon-svg icon-class="fatherHouse" v-show={node.label.parentId == null}  style="margin-right:6px;"></icon-svg>
              <icon-svg icon-class="childHouse" v-show={node.label.parentId != null}  style="margin-right:6px;"></icon-svg>
              {node.label.name}
            </span>


            <span  style="height:34px;display:inline-block;vertical-align: top;padding-top: 4px;float:right;">

              <img src="/static/images/web_icon_add.png" alt="添加仓库区域" title="添加仓库区域" style="margin-right:80px;width:20px;height:20px;" v-show={node.label.parentId == null}  on-click={ ($event) => this.add(store, data,event) } />
          
              <img src="/static/images/web_icon_add.png" alt="添加仓库区域" title="添加仓库区域" style="margin-left:20px;width:20px;height:20px;" v-show={node.label.parentId != null}  on-click={ ($event) => this.add(store, data,event) } />

              <img src="/static/images/web_icon_edit.png" alt="编辑仓库区域" title="编辑仓库区域" style="margin-left:20px;width:20px;height:20px;" v-show={node.label.parentId != null} on-click={ ($event) => this.edit(store, data,event) } />

              <img src="/static/images/web_icon_del.png" alt="删除仓库区域" title="删除仓库区域" style="margin-left:20px;width:20px;height:20px;"v-show={node.label.parentId != null} on-click={ ($event) => this.remove(store, data,event) } />

            </span>

          </span>);
      }
    }
  }
</script>

<style lang="scss">
  #warehouse_vue{
    .el-form-item__content{
      float:left;
      width:75%;
    }
    .el-tree-node__expand-icon{
      display:none;
    }
    .el-tree{
      padding:5px;
    }
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