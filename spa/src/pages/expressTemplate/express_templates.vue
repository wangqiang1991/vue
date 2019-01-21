<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">

      <el-select @change="doSearch()" clearable style="width: 130px" class="filter-item" v-model="listQuery.status" placeholder="按状态筛选">
        <el-option v-for="item in search_status" :key="item.value" :label="item.display_name" :value="item.value">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.condition" style="width: 200px;" class="filter-item" placeholder="运费模版名称">
      </el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
      <el-button @click="handleSave(null)" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="运费模版名称">
        <template scope="scope">
          <span @click="handleSave(scope.row)" class="link-type">{{scope.row.expressTemplateName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运费模版金额" width="200">
        <template scope="scope">
          <span>￥{{scope.row.expressAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否叠加" width="100">
        <template scope="scope">
          <span v-if="scope.row.templateRepeat">是</span>
          <span v-else="!scope.row.templateRepeat">否</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="100">
        <template scope="scope">
          <span v-if="scope.row.status == 1">启用</span>
          <span v-else="scope.row.status == 1">停用</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="200">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="handleSave(scope.row)">编辑
          </el-button>
          <el-button v-if="scope.row.status == 1" size="small" icon="circle-close" type="warning" @click="disable(scope.row)">停用
          </el-button>
          <el-button v-if="scope.row.status != 1" size="small" icon="circle-check" type="success" @click="enable(scope.row)">启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
       @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>



    <!-- 添加运费模板弹出框 -->
    <el-dialog title="运费模板" :visible.sync="saveDialogFormVisible">
      <el-form class="small-space" :model="saveObject" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>

        <el-form-item label="模版名称">
          <el-input v-model="saveObject.expressTemplateName" placeholder="请输入运费模版名称(必填)"></el-input>
        </el-form-item>

        <el-form-item label="运费金额">
          <el-input-number v-model="saveObject.expressAmount" :min="0"></el-input-number>
          <!--<el-input v-model="saveObject.expressAmount" placeholder="请输入运费金额(必填)"></el-input>-->
        </el-form-item>

        <el-form-item label="是否叠加">
          <el-checkbox v-model="saveObject.templateRepeat">叠加</el-checkbox>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveDialogFormVisible = false">取 消</el-button>
        <el-button @click="saveExpressTemplate" type="primary">保 存</el-button>
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
        saveObject: {
          templateRepeat: true
        },
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          condition: '',
          status: ''
        },
        dataList :[],
        search_status:[{ value: '1', display_name: '启用' },{ value: '2', display_name: '停用' }]
      }
    },
    mounted:function() {
      this.findByPage();
    },
    methods: {

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

      findByPage() {
        this.listQuery.loading = true;
        this.http.get(this).url(config.expressTemplate.express_template_url).params({
          pageIndex: this.listQuery.pageIndex,
          pageSize: this.listQuery.pageSize,
          expressTemplateName: this.listQuery.condition.trim(),
          status: this.listQuery.status ? this.listQuery.status : 0
        }).request(function(response) {
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
      disable(item) {
        this.$confirm('是否确认停用该运费模版?', '提示', {
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
        this.http.put(this).url(config.expressTemplate.express_template_disable_url).restful({
          expressTemplateId: item.expressTemplateId
        }).request(function(response) {
          loadingInstance.close();
          console.log(response);
          if(response.data.code == 0) {
            this.$message({message: '操作成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },
      enable(item) {
        this.$confirm('是否确认启用该运费模版?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.submitEnable(item);
        }).catch(() => {

        });
      },
      submitEnable(item) {
        var loadingInstance = Loading.service({text: '启用中...'});
        this.http.put(this).url(config.expressTemplate.express_template_enable_url).restful({
          expressTemplateId: item.expressTemplateId
        }).request(function(response) {
          loadingInstance.close();
          console.log(response);
          if(response.data.code == 0) {
            this.$message({message: '操作成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },

      handleSave(item) {
        if (item) {
          this.saveObject = $.extend({},item);
        } else {
          this.saveObject = {templateRepeat: true};
        }
        this.saveDialogFormVisible = true;
      },

      saveExpressTemplate() {
//        //表单验证
//        if (!this.add_express.name.trim()) {
//          this.$message({message: '物流商名称不能为空', type: 'warning'});
//          return;
//        }
//        if (!this.add_express.hotPhone.trim()) {
//          this.$message({message: '物流商电话不能为空', type: 'warning'});
//          return;
//        }
//        if (!this.add_express.website.trim()) {
//          this.$message({message: '物流商网址不能为空', type: 'warning'});
//          return;
//        }

        var loadingInstance = Loading.service({text: '数据提交中...'});

        this.http.postJson(this).url(config.expressTemplate.express_template_url).params(
          this.saveObject
        ).request(function (response) {
          loadingInstance.close();
          console.log(response);
          if (response.data.code == 0) {
            this.$message({message: '添加运费模版成功', type: 'success'});
            this.saveDialogFormVisible = false;
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
