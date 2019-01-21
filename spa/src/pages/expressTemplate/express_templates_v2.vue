<template>
  <div class="app-container calendar-list-container">
    <div v-show="state=='list'">
    <div class="filter-container">
      <el-select @change="doSearch()" clearable style="width: 180px" class="filter-item" v-model="listQuery.expressMethod" placeholder="按运送方式筛选">
        <el-option v-for="item in expressMethodArr" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>

      <el-select @change="doSearch()" clearable style="width: 180px" class="filter-item" v-model="listQuery.templateType" placeholder="按计费方式筛选">
        <el-option v-for="item in templateTypeArr" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>

      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.condition" style="width: 200px;" class="filter-item" placeholder="模版名称">
      </el-input>
      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
      <el-button @click="addExpress()" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
      
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="模版名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容摘要">
        <template scope="scope">
          <span v-if="scope.row.templateType == 1">免运费</span>
          <span v-else-if="scope.row.templateType == 4">{{scope.row.startCount / 100}}{{scope.row.templateType | getMeasureUnit}}内，{{scope.row.innerPrice / 100.0}}元，超过后{{scope.row.externalPrice / 100.0}}元/{{scope.row.increaseCount / 100}}{{scope.row.templateType | getMeasureUnit}}</span>
           <span v-else>{{scope.row.startCount}}{{scope.row.templateType | getMeasureUnit}}内，{{scope.row.innerPrice / 100.0}}元，超过后{{scope.row.externalPrice / 100.0}}元/{{scope.row.increaseCount}}{{scope.row.templateType | getMeasureUnit}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="运送方式" width="150">
        <template scope="scope">
          {{scope.row.expressMethod | getExpressMethodName(expressMethodArr)}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="计费方式" width="150">
        <template scope="scope">
          {{scope.row.templateType | getTemplateTypeName(templateTypeArr)}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="200">
        <template scope="scope">
          <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="editExpress(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="delete" type="danger" @click="onDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
      @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
      </el-pagination>
    </div>

    </div>
    <save-express-templates ref="expressTemplate" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='detail'">
    </save-express-templates>
  </div>

</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import { Loading } from 'element-ui'
  import saveExpressTemplates from './save_express_templates.vue'

  export default {
    directives: {
      waves
    },
    components:{
      saveExpressTemplates
     },
    filters:{
      getExpressMethodName(value, expressMethodArr) {
        for (var item of expressMethodArr) {
          if (value == item.value) {
            return item.name;
          }
        }
        return "-";
      },
      getTemplateTypeName(value, templateTypeArr) {
        for (var item of templateTypeArr) {
          if (value == item.value) {
            return item.name;
          }
        }
        return "-";
      },
      getMeasureUnit(value) {
        if (value == 2) {
          return "kg"
        }
        if (value == 3) {
          return "件"
        }
        if (value == 4) {
          return "m³"
        }
      }
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
          expressMethod: '',
          templateType: ''
        },
        dataList :[],
        expressMethodArr:[{value:1, name:"快递"}, {value:2, name:"物流"}, {value:3, name:"EMS"}, {value:4, name:"平邮"}],
        state: "list", // list | detail
        templateTypeArr:[{value:1, name:"免运费"}, {value:2, name:"按重量"}, {value:3, name:"按计件"}, {value:4, name:"按体积"}]
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
      createSuccess() {
        this.state = "list";
        this.findByPage();
      },
      findByPage() {
        this.listQuery.loading = true;
        this.http.get(this).url(config.goodsExpressTemplate.list_url).params({
          pageIndex: this.listQuery.pageIndex,
          pageSize: this.listQuery.pageSize,
          name: this.listQuery.condition.trim(),
          expressMethod: this.listQuery.expressMethod,
          templateType: this.listQuery.templateType
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
      onDelete(item) {
        this.$confirm('是否确认删除该运费模板"'+ item.name + '"?', '提示', {
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
        this.http.delete(this).url(config.goodsExpressTemplate.delete_url).restful({
          templateId: item.templateId
        }).request(function(response) {
          loadingInstance.close();
          if(response.data.code == 0) {
            this.$message({message: '删除成功', type: 'success'});
            this.findByPage();
          } else {
            this.$message.error(response.data.message);
          }
        }, function(error) {
          loadingInstance.close();
          this.$message.error(error);
        });
      },
      addExpress(){
        this.state = "detail";
        this.$refs.expressTemplate.setChangType();
      },
      editExpress(data) {
        this.state = "detail";
        this.$refs.expressTemplate.loadSource(data);
      },
      
    }
  }



</script>
