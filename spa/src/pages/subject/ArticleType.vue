<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="分类名称" >
        <template scope="scope">
          <span >{{scope.row.typeName}}</span>
        </template>
      </el-table-column>

     <!--  <el-table-column label="排序" width="100" prop="sort">
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="270">
        <template scope="scope">
          <el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="d-caret" type="info" @click="onSort(scope.row)">排序</el-button>
          <el-button icon="delete" size="small" type="danger" @click="deleteType(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="type" label-position="left" label-width="100px" style='width: 550px; margin-left:50px;'>
        <el-form-item label="分类名称">
          <el-input v-model="type.typeName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submitCreate">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 排序设置 -->
    <el-dialog title="排序设置" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="分类名称">
          <span>{{currentType.typeName}}</span>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number class="el-number-cus" v-model="sortValue" :min="1" :max="100000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSort">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import md5 from 'js-md5'
  import {formatDate} from '@/commons/date.js'

  export default {
    directives: {
      waves
    },
    filters:{
      formatDate(time){
        if (!time) {
          return "无";
        }
        let date = new Date(time);
        //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
        return formatDate(date, 'yyyy-MM-dd');
      }
    },
    data() {
      return {
        sortValue:"1",
				dialogFormVisible: false,
        currentType:{},
        title:"",
        addDialogFormVisible: false,
        loading: false,
        type: {typeName:""},
        dataList :[
        ],
      }
    },
    mounted:function() {
      this.findAll();
    },
    methods: {
      onSort(type) {
				this.currentType = type;
				this.sortValue = type.sort;
				this.dialogFormVisible=true;
			},
      confirmSort() {
				this.loading = true;
				this.http.post(this).url(this.config.article_type.sort_url).params({
					typeId: this.currentType.typeId,
					sort: this.sortValue
					}).request((response) => {
						if (response.data.code != 0) {
              this.loading = false;
							this.$message({message: response.data.message, type: 'error'});
							return;
						}
						this.loading = false;
						this.$message({type: 'success', message: '设置排序成功!'});
						this.findAll();
						this.dialogFormVisible = false;
					}, (err) => {
            this.dialogFormVisible = false;
            this.loading = false;
          });
			},
      deleteType(type) {
        this.$confirm('是否要删除期刊分类"' + type.typeName + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.article_type.delete_url).restful({typeId:type.typeId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
								return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findAll();
            }, (err) => { });
        }).catch(() => {
        });
      },
      /**
       * 重置add_provider
       */
      resetEditProvider() {
        this.type = {typeName:""};
      },

      handleCreate() {
        this.resetEditProvider();
        this.title = "添加分类";
        this.addDialogFormVisible = true;
      },
      /**
       * 查询
       */
      findAll() {
        this.http.get(this).url(this.config.article_type.list_url).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.dataList = response.data.data;
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
        if (!this.type.typeName || !this.type.typeName.trim()) {
          this.$message({message: '分类名称不能为空', type: 'warning'});
          return;
        }
        this.http.postJson(this).url(this.config.article_type.save_url).params(this.type).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '保存成功!'});
            this.findAll();
            this.addDialogFormVisible = false;
          },
          (error) => {

          }
        );
      },
      onEdit(type) {
        this.resetEditProvider();
        this.title = "编辑分类";
        this.type = jQuery.extend({}, type);
        this.addDialogFormVisible = true;
      }
    }
  }

</script>
