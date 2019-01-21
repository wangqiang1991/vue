<template>
  <div class="app-container calendar-list-container">
  <div v-show="state=='list'">
    <div class="filter-container">

      <el-select @change="doSearch()" v-model="listQuery.provider_nature_id" clearable style="width: 130px" class="filter-item" placeholder="经营性质">
        <el-option v-for="item in provider_natures" :key="item.providerNatureId" :label="item.providerNatureName" :value="item.providerNatureId">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="doSearch()"  v-model="listQuery.providerName" style="width: 150px;" clearable class="filter-item" placeholder="供应商名称">
      </el-input>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.providerCode" style="width: 150px;" class="filter-item" placeholder="供应商编码">
      </el-input>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="供应商名称">
        <template scope="scope">
          <span>{{scope.row.providerName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="供应商编码">
        <template scope="scope">
          <span>{{scope.row.providerCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="经营性质">
        <template scope="scope">
          <span>{{scope.row.providerNatureName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系人" >
        <template scope="scope">
          <span>{{scope.row.contacts}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系电话" >
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="285">
        <template scope="scope">
          <el-button size="small" type="primary" class="fontFamily icon-browse" @click="handleDetail(scope.row)">查看详情
          </el-button>
          <el-button size="small" icon="edit" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="delete" type="danger" @click="deleteProvider(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>

    <!-- 添加供应商弹出框 -->
    <el-dialog title="添加供应商" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="add_provider" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>

        <el-form-item label="供应商名称">
          <el-input v-model="add_provider.providerName" placeholder="请输入供应商名称(必填)"></el-input>
        </el-form-item>

        <el-form-item label="供应商编码">
          <el-input v-model="add_provider.providerCode" placeholder="请输入供应商编码(必填)"></el-input>
        </el-form-item>

        <el-form-item label="经营性质">
          <el-select class="filter-item" v-model="add_provider.providerNatureId" placeholder="经营性质(必选)">
            <el-option v-for="item in provider_natures" :key="item.providerNatureId" :label="item.providerNatureName" :value="item.providerNatureId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系人">
          <el-input v-model="add_provider.contacts" placeholder="请填写供应商联系人(必填)"></el-input>
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="add_provider.phone" placeholder="请填写联系电话(必填)"></el-input>
        </el-form-item>

        <el-form-item label="联系邮箱">
          <el-input v-model="add_provider.email" placeholder="请填写邮箱"></el-input>
        </el-form-item>

        <el-form-item label="详细地址">
          <el-input v-model="add_provider.address" placeholder="请填写供应商详细地址"></el-input>
        </el-form-item>

        <el-form-item label="供应商描述">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请填写供应商描述" style="width: 500px;" v-model="add_provider.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button @click="addProvider" type="primary">新 增</el-button>
      </div>
    </el-dialog>


    <!-- 编辑供应商 -->
    <el-dialog title="编辑供应商" :visible.sync="editDialogFormVisible">
      <el-form class="small-space" :model="edit_provider" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>

        <el-form-item label="供应商名称">
          <el-input v-model="edit_provider.providerName" placeholder="请输入供应商名称(必填)"></el-input>
        </el-form-item>

        <el-form-item label="供应商编码">
          <el-input v-model="edit_provider.providerCode" placeholder="请输入供应商编码(必填)"></el-input>
        </el-form-item>

        <el-form-item label="经营性质">
          <el-select class="filter-item" v-model="edit_provider.providerNatureId" placeholder="经营性质(必选)">
            <el-option v-for="item in provider_natures" :key="item.providerNatureId" :label="item.providerNatureName" :value="item.providerNatureId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="联系人">
          <el-input v-model="edit_provider.contacts" placeholder="请填写供应商联系人(必填)"></el-input>
        </el-form-item>

        <el-form-item label="联系电话">
          <el-input v-model="edit_provider.phone" placeholder="请填写联系电话(必填)"></el-input>
        </el-form-item>

        <el-form-item label="联系邮箱">
          <el-input v-model="edit_provider.email" placeholder="请填写邮箱"></el-input>
        </el-form-item>

        <el-form-item label="详细地址">
          <el-input v-model="edit_provider.address" placeholder="请填写供应商详细地址"></el-input>
        </el-form-item>

        <el-form-item label="供应商描述">
          <el-input v-model="edit_provider.description" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请填写供应商描述" style="width: 500px;">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button @click="editProvider" type="primary">修 改</el-button>
      </div>
    </el-dialog>

  </div>
  <save-Provider ref="saveProvider" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='edit'">
  </save-Provider>

  <provider-detail ref="providerDetail" v-on:cancel="state='list'" v-show="state=='detail'">
  </provider-detail>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import { Loading } from 'element-ui'
  import saveProvider from "./saveProvider.vue"
  import providerDetail from "./ProviderDetail.vue"

  const search_ways = [
    { key: 'name', display_name: '供应商名称' },
    { key: 'code', display_name: '供应商编码' }
  ]

  export default {
    components:{
      saveProvider,
      providerDetail
    },
    directives: {
      waves
    },
    data() {
      return {
        state:"list",
        add_loading: false,
        addDialogFormVisible: false,
        editDialogFormVisible: false,
        search_ways,
        provider_natures: [],
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          provider_nature_id: '',
          providerName:"",
          providerCode:""
        },
        add_provider : {
          providerNatureId:'',
          providerName:'',
          providerCode:'',
          contacts:'',
          phone:'',
          email:'',
          address:'',
          description:''

        },
        edit_provider: {
        },
        dataList :[],

      }
    },
    mounted:function() {
      this.findProviderNatures();
      this.findByPage();
    },
    methods: {
      /**
       * 重置add_provider
       */
      resetEditProvider() {
        this.add_provider.providerName = '';
        this.add_provider.providerCode = '';
        this.add_provider.providerNatureId = '';
        this.add_provider.contacts = '';
        this.add_provider.phone = '';
        this.add_provider.email = '';
        this.add_provider.address = '';
        this.add_provider.description = '';
      },

      /**
       * 展示添加供应商
       */
      handleCreate() {
        // this.resetEditProvider();
        // this.addDialogFormVisible = true;
        this.state = "edit";
        this.$refs.saveProvider.loadProvinceNature(this.provider_natures);
      },
      goWebSite(provider) {
        if(provider.providerWebsite) {
          window.open(provider.providerWebsite)
        }
      },
      handleEdit(data) {

        this.state = "edit";
        this.$refs.saveProvider.loadSource(this.provider_natures,data);
        // this.edit_provider = $.extend({},editItem);
        // this.editDialogFormVisible = true;
      },
      handleDetail(data) {
        this.state = "detail";
        this.$refs.providerDetail.loadSource(this.provider_natures, data);
      },

      /**
       * 提交添加供应商
       */
      addProvider() {
        //表单验证
        if (!this.add_provider.providerName.trim()) {
          this.$message({message: '供应商名称不能为空', type: 'warning'});
          return;
        }

        if (!this.add_provider.providerCode.trim()) {
          this.$message({message: '供应商编码不能为空', type: 'warning'});
          return;
        }

        if (!this.add_provider.providerNatureId.trim()) {
          this.$message({message: '请选择供应商经营性质', type: 'warning'});
          return;
        }

        if (!this.add_provider.contacts.trim()) {
          this.$message({message: '供应商联系人不能为空', type: 'warning'});
          return;
        }

        if (!this.add_provider.phone.trim()) {
          this.$message({message: '联系电话不能为空', type: 'warning'});
          return;
        }

        var loadingInstance = Loading.service({text: '数据提交中...'});

        this.http.postJson(this).url(config.provider.provider_save_url).params(
          this.add_provider
        ).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '添加供应商成功', type: 'success'});
            this.addDialogFormVisible = false;
            this.resetEditProvider();
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
       * 编辑供应商
       */
      editProvider() {

        //表单验证
        if (!this.edit_provider.providerName.trim()) {
          this.$message({message: '供应商名称不能为空', type: 'warning'});
          return;
        }

        if (!this.edit_provider.providerCode.trim()) {
          this.$message({message: '供应商编码不能为空', type: 'warning'});
          return;
        }

        if (!this.edit_provider.providerNatureId.trim()) {
          this.$message({message: '请选择供应商经营性质', type: 'warning'});
          return;
        }

        if (!this.edit_provider.contacts.trim()) {
          this.$message({message: '供应商联系人不能为空', type: 'warning'});
          return;
        }

        if (!this.edit_provider.phone.trim()) {
          this.$message({message: '联系电话不能为空', type: 'warning'});
          return;
        }

        var loadingInstance = Loading.service({text: '数据提交中...'});

        this.http.postJson(this).url(config.provider.provider_save_url).params(
          this.edit_provider
        ).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '编辑供应商成功', type: 'success'});
            this.editDialogFormVisible = false;
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
       * 查询所有供应商经营性质
       */
      findProviderNatures() {
        this.http.get(this).url(config.provider.provider_natures_url).params({
        }).request(function(response) {
          console.log(response);
          if(response.data.code == 0){
            this.provider_natures = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.$message.error(error);
        });
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

      doSearch() {
        this.listQuery.pageIndex = 1;
        this.findByPage();
      },

      createSuccess() {
        this.state = "list";
        this.findByPage();
      },
      /**
       * 分页查询供应商
       */
      findByPage() {
        this.listQuery.loading = true;

        var params = {};
        params.pageSize = this.listQuery.pageSize;
        params.pageIndex = this.listQuery.pageIndex;
        params.providerCode = this.listQuery.providerCode;
        params.providerName = this.listQuery.providerName;
        params.providerNatureId = this.listQuery.provider_nature_id;


        this.http.get(this).url(config.provider.providers_url).params(
          params
        ).request(function(response) {
          this.listQuery.loading = false;
          console.log(response);
          if(response.data.code == 0){
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          this.listQuery.loading = false;
          this.$message.error(error);
        });
      },

      /**
       * 删除供应商
       */
      deleteProvider(item) {
        this.$confirm('此操作将删除供应商, 是否继续?', '提示', {
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
        this.http.delete(this).url(config.provider.provider_delete_url).restful({
          providerId:item.providerId
        }).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '删除供应商成功', type: 'success'});
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
