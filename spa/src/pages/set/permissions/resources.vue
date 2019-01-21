<template>
  <div class="gc-resource">
    <div>
      <el-button type="primary" icon="edit" @click="addNode">添加资源</el-button>
      <el-button type="primary" icon="edit" v-on:click="editNode">修改资源</el-button>
      <el-button type="danger" icon="delete" v-on:click="removeResource">删除资源</el-button>
    </div>
    <div class="gc-tree_wrapper" v-if='ztreeDataSource.length>0'>
      <vue-ztree :list.sync='ztreeDataSource' :func='nodeClick' :contextmenu='contextmenuClick'
                 :is-open='false'></vue-ztree>
    </div>
    <!--添加菜单资源-->
    <el-dialog title="添加菜单资源" :visible.sync="dialogFormVisiblemenu">
      <el-form :model="formmenu">
        <el-form-item label="资源名称" :label-width="formLabelWidth">
          <el-input v-model="formmenu.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源URL" :label-width="formLabelWidth">
          <el-input v-model="formmenu.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" :label-width="formLabelWidth">
          <el-select v-model="formmenu.type" placeholder="资源类型">
            <el-option label="菜单" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblemenu = false">取 消</el-button>
        <el-button type="primary" @click="addMenuResource">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加资源-->
    <el-dialog title="添加资源" :visible.sync="dialogFormResource">
      <el-form :model="formAddRes">
        <el-form-item label="上级资源" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="formAddRes.parentName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" :label-width="formLabelWidth">
          <el-select v-model="formAddRes.type" placeholder="资源类型">
            <el-option label="模块" value="1"></el-option>
            <el-option label="页面" value="2"></el-option>
            <el-option label="按钮" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" :label-width="formLabelWidth">
          <el-input v-model="formAddRes.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="formAddRes.type != 3" label="资源访问路径" :label-width="formLabelWidth">
          <el-input v-model="formAddRes.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="formAddRes.type == 2" label="资源文件路径" :label-width="formLabelWidth">
          <el-input v-model="formAddRes.component" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormResource = false">取 消</el-button>
        <el-button type="primary" @click="addResource">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改资源-->
    <el-dialog title="修改资源" :visible.sync="dialogFormeditResource">
      <el-form :model="formEditRes">
        <el-form-item label="上级资源" :label-width="formLabelWidth">
          <el-input v-model="formEditRes.parentName" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="资源名称" :label-width="formLabelWidth">
          <el-input v-model="formEditRes.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="formEditRes.type!='按钮'" label="资源访问路径" :label-width="formLabelWidth">
          <el-input v-model="formEditRes.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="formEditRes.type=='页面'" label="资源文件路径" :label-width="formLabelWidth">
          <el-input v-model="formEditRes.component" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" :label-width="formLabelWidth">
          <el-select v-model="formEditRes.type" placeholder="资源类型">
            <el-option label="模块" value="1"></el-option>
            <el-option label="页面" value="2"></el-option>
            <el-option label="按钮" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormeditResource = false">取 消</el-button>
        <el-button type="primary" @click="editResource">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import VJstree from '@/components/tree/index.vue'

  import vueZtree from '@/components/tree/vue-ztree.vue'

  export default {
    data() {
      return {
        ztreeDataSource: [],
        dataList: [],
        treeDeepCopy: [],
        parentNodeModel: [],//当前点击节点父亲对象
        nodeModel: null, // 当前点击节点对象
        ztreeDataSourceList: [],
        ztreeDataSourceSync: [],
        //添加菜单
        dialogFormVisiblemenu: false,
        dialogFormResource: false,
        dialogFormeditResource: false,
        pathData: [],
        componentData: [],
        IdDataSource: {},
        formmenu: {
          name: '',
          url: '',
          type: '',
          component: ''
        },
        formAddRes: {
          parentId: null,
          parentName: '',
          name: '',
          url: '',
          type: '',
          component: ''
        },
        formEditRes: {
          parentId: '',
          parentName: '',
          name: '',
          url: '',
          type: '',
          id: '',
          component: ''
        },
        formLabelWidth: '120px',
        OpId: [],
        data: [],
        asyncData: [],
        loadData: function (oriNode, resolve) {
          var id = oriNode.data.id ? oriNode.data.id : 0
          setTimeout(function () {
            var data = []
            if (id > 20) {
              data = []
            }
            else {
              data = [
                {
                  "text": "New Item 1..." + id
                },
                {
                  "text": "New Item 2..." + id
                }
              ]
            }
            resolve(data)
          }, 500)
        }
      }
    },
    methods: {
      navigateClick: function (index, item) {
        // 递归
        var recurFunc = (data, list) => {
          data.forEach((i) => {
            if (i.id == item.id) {
              i.clickNode = true;
              this.nodeModel = i;
              this.parentNodeModel = data;
            } else {
              i.clickNode = false;
            }

            if (i.children) {
              recurFunc(i.children, i);
            }
          });
        }
        recurFunc(this.treeDeepCopy, this.treeDeepCopy);


        // 导航
        var self = this;
        for (var i = 0; i < self.dataList.length; i++) {
          if (index == i) {
            self.dataList[i].clickNode = true
          } else {
            self.dataList[i].clickNode = false
          }
        }
        self.dataList.splice(index + 1, self.dataList.length - (index + 1))

        this.ztreeDataSource = this.treeDeepCopy
      },
      // 新增节点
      addNode: function () {
        if (this.nodeModel) {
          this.dialogFormResource = true;
          this.formAddRes.parentName = this.nodeModel.name;
          this.formAddRes.parentId = this.nodeModel.id;
        } else {
          this.dialogFormResource = true;
          this.formAddRes.parentName = "无";
        }
      },
      //编辑节点
      editNode: function () {
        if (this.nodeModel) {
          this.dialogFormeditResource = true;
          //根据id 获取结点数据
          var base =this.IdDataSource[this.nodeModel.id];
          var parentId=base.parentId
          var parentName=null;
          if(parentId==undefined ||parentId ==null){
            parentName="无"
          }else{
            parentName=this.IdDataSource[base.parentId].name;
          }
          this.formEditRes.parentName =parentName;
          this.formEditRes.parentId = base.parentId;
          this.formEditRes.name = base.name;
          this.formEditRes.url = base.path;
          this.formEditRes.component = base.component;
          this.formEditRes.id = this.nodeModel.id;
          this.nodeModel.type = this.IdDataSource[this.nodeModel.id].type;




          if (this.nodeModel.type == 1) {
            this.formEditRes.type = "模块"
          } else if (this.nodeModel.type == 2) {
            this.formEditRes.type = "页面"
          } else if (this.nodeModel.type == 3) {
            this.formEditRes.type = "按钮"
          }

        } else {
          this.$message('请先选中节点');
          return;
        }
      },
      // 删除节点
      delNode: function () {
        if (this.nodeModel) {
          if (this.parentNodeModel.hasOwnProperty("children")) {
            this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(this.nodeModel), 1);
          } else if (this.parentNodeModel instanceof Array) {
            // 第一级根节点处理
            this.parentNodeModel.splice(this.parentNodeModel.indexOf(this.nodeModel), 1);
          }
          this.nodeModel = null;
        } else {
          console.log("请先选中节点");
        }
      },


      findById: function (data, parentId) {
        var vm = this;

        for (var i = 0; i < data.length; i++) {
          if (parentId == data[i].id) {
            console.log(data[i])
            vm.dataList.push(data[i]);
            vm.findById(vm.ztreeDataSource, data[i].parentId)
            return data[i]
          }

          if (data[i].hasOwnProperty('children')) {
            vm.findById(data[i].children, parentId)
          }

        }
      },
      // 点击节点
      nodeClick: function (m, parent, trees) {
        this.treeDeepCopy = trees;
        this.nodeModel = m;  // 当前点击节点对象
        this.parentNodeModel = parent; //当前点击节点父亲对象
        // 导航菜单
        this.dataList = []
        this.findById(this.ztreeDataSource, m.parentId)
        this.dataList = this.dataList.reverse();
        this.dataList.push(m);
      },
      // 右击事件
      contextmenuClick: function () {

      },
      // 点击展开收起
      expandClick: function (m) {
        console.log(JSON.parse(JSON.stringify(m)));
        // 点击异步加载
        if (m.isExpand) {
          // 动态加载子节点, 模拟ajax请求数据
          // 请注意 id 不能重复哦。
          if (m.hasOwnProperty("children")) {

            m.loadNode = 1; // 正在加载节点

            setTimeout(() => {

              m.loadNode = 2; // 节点加载完毕

              m.isFolder = !m.isFolder;

              m.children.push({
                id: +new Date(),
                name: "动态加载节点1",
                path: "",
                clickNode: false,
                isFolder: false,
                isExpand: false,
                loadNode: 0,
                children: [{
                  id: +new Date() + 1,
                  name: "动态加载末节点",
                  path: "",
                  clickNode: false,
                  isExpand: false,
                  isFolder: false,
                  loadNode: 0
                }]
              })
            }, 1000);
          }
        }
      },

      //获取权限列表
      getPermissionData() {
        this.http.get(this).url(this.config.permission.list)
				.request(
					(response) => {
            var result = response;
            if (result.data.code != 0) {
              this.$message.error(result.data.message);
              return;
            }
            this.geteData(result.data.data);
				}, (err) => { });
      },

      //添加菜单资源
      addMenuResource() {
        //校验添加的菜单项目
        var data = this.formmenu;
        console.log(data);

        if (!data.name || !data.name.trim()) {
          this.$message({message: '资源名称不能为空', type: 'warning'});
          return;
        }

        if (!data.type || !data.type.trim()) {
          this.$message({message: '资源类型不能为空', type: 'warning'});
          return;
        }

        if (data.type != 3) {
          if (!data.url || !data.url.trim()) {
            this.$message({message: '资源访问路径不能为空', type: 'warning'});
            return;
          }
        }

        if (data.type == 2) {
          if (!data.component || !data.component.trim()) {
            this.$message({message: '资源页面路径不能为空', type: 'warning'});
            return;
          }
        }
        this.dialogFormVisiblemenu = false;

        var obj = {};
        obj.permissionId = null;
        obj.name = data.name;
        obj.path = data.url;
        obj.component = null;
        obj.description = data.name;
        obj.parentId = data.parentId;
        obj.type = data.type

        var that = this;
        this.opPermissionData(obj, function () {

          that.getPermissionData();
          that.nodeModel.isFolder = true;
          that.$message('添加菜单资源成功');
        });

      },
      //添加资源
      addResource() {

        //校验添加的菜单项目
        var data = this.formAddRes;
        console.log(data);
        if (data.type == "") {
          this.$message('资源类型不能为空');
          return;
        }
        if (data.name.length <= 0) {
          this.$message('资源名称不能为空');
          return;
        }

        if (data.type == 2) {
          //校验访问路径
          if (data.component == "") {
            this.$message('资源路径不能为空');
            return;
          }
          if (data.url == "") {
            this.$message('资源文件路径不能为空');
            return;
          }
        } else if (data.type == 1) {
          if (data.url == "") {
            this.$message('资源访问路径不能为空');
            return;
          }
        }

        this.dialogFormResource = false;
        var obj = {};
        obj.permissionId = null,
          obj.name = data.name;
        obj.path = data.url;
        obj.component = data.component;
        obj.description = data.name;
        obj.parentId = data.parentId;
        obj.type = data.type;

        this.formAddRes = {
          parentId: null,
          parentName: '',
          name: '',
          url: '',
          type: '',
        }
        var that = this;
        this.opPermissionData(obj, function () {

          that.getPermissionData();
          that.$message({
            type: 'success',
            message: '添加菜单资源成功!'
          });
        });
      },
      //修改资源
      editResource() {
        //校验添加的菜单项目
        var data = this.formEditRes;
        console.log(data);

        if (data.name.length <= 0) {
          this.$message('资源名称不能为空');
          return;
        }
        if (data.type == "") {
          this.$message('资源类型不能为空');
          return;
        }


        if (data.type == 2) {
          //校验访问路径
          if (data.component == "") {
            this.$message('资源路径不能为空');
            return;
          }
          if (data.url == "") {
            this.$message('资源文件路径不能为空');
            return;
          }
        } else if (data.type == 1) {
          if (data.url == "") {
            this.$message('资源访问路径不能为空');
            return;
          }
        }


        this.dialogFormeditResource = false;
        var obj = {};
        obj.name = data.name;
        obj.path = data.url;
        obj.component = data.component;
        obj.description = data.name,
        obj.parentId = data.parentId;
        obj.permissionId = data.id;
        obj.type = data.type;
        if (data.type == "模块") {
          obj.type = 1;
        } else if (data.type == "页面") {
          obj.type = 2;
        } else if (data.type == "按钮") {
          obj.type = 3;
        }

        var that = this;
        this.opPermissionData(obj, function () {

          that.getPermissionData();
          that.nodeModel.isFolder = true;
          that.$message({
            type: 'success',
            message: '修改资源成功!'
          });
        });
        console.log("修改资源");
      },
      //删除资源
      removeResource(id) {
        if (this.nodeModel) {
          var _name = this.nodeModel.name;
          this.$confirm('您确定要删除' + _name + '这个文件吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            confirmButtonClass: "el-button--danger"
          }).then(() => {
            if (this.parentNodeModel.hasOwnProperty("children")) {
              this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(this.nodeModel), 1);
            } else if (this.parentNodeModel instanceof Array) {
              // 第一级根节点处理
              this.parentNodeModel.splice(this.parentNodeModel.indexOf(this.nodeModel), 1);
            }
            var id = this.nodeModel.id;

            //调用删除 文件
            this.deleteApi(id);
            this.nodeModel = null;

            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {

          });


        } else {
          this.$message('请先选中节点');
          console.log("请先选中节点");
        }

      },
      //编辑或添加权限接口
      opPermissionData(params, callback) {
        this.http.postJson(this).url(this.config.permission.list).params(params)
				.request(
					(response) => {
            var result = response;
            if (result.data.code != 0) {
              that.$message.error(result.data.message);
              return;
            }
            callback();
				}, (err) => { });
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
        console.log(result)
        this.data = result;
        this.ztreeDataSource = result;
      },
      recursiveData(params, data, type) {
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          if (params.parentId == list.id) {
            if (list.children == undefined) {
              //新增children数组
              var childarr = [];
              var temp = {};
              temp.id = params.permissionId;
              temp.name = params.name;
              temp.path = list.path;
              temp.component = list.component;
              temp.type = list.type;
              childarr.push(temp);
              list.children = childarr;

            } else {
              var temp = {};
              temp.id = params.permissionId;
              temp.name = params.name;
              temp.path = list.path;
              temp.component = list.component;
              temp.type = list.type;
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
      //根据id返回path
      getDataPath: function (id, data) {
        var path = "";
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          for (var j in list) {
            if (id == j) {
              path = list[j];
            }
          }
        }
        return path;
      },
      //删除文件api
      deleteApi: function (id) {
        this.http.delete(this).url(this.config.permission.delete_url).restful({permissionId:id})
				.request(
					(response) => {
            var result = response;
            if (result.data.code != 0) {
              this.$message.error(result.data.message);
              return;
            }
				}, (err) => { });
      }
    },
    components: {
      'v-jstree': VJstree,
      vueZtree
    },
    mounted: function () {
      // 异步获取数据操作
      this.$nextTick(function () {
        this.getPermissionData();
      })
    }
  }
</script>
<style scoped>
  .gc-resource {
    padding: 10px 20px 20px;
  }

  .gc-tree_wrapper {
    margin-top: 15px;
  }
</style>
