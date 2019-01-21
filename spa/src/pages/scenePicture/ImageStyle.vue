<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="风格名称" >
        <template scope="scope">
          <span >{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="风格封面" vertical="middle" width="120">
        <template scope="scope">
          <img style="width:90px;height:50px;" :src="scope.row.cover+'?imageView2/1/w/498/h/276'" class="gc_praiselist_list_img">
        </template>
      </el-table-column>

     <!--  <el-table-column label="排序" width="100" prop="sort">
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="270">
        <template scope="scope">
          <el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="d-caret" type="info" @click="onSort(scope.row)">排序</el-button>
          <el-button icon="delete" size="small" type="danger" @click="deletestyle(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible" :before-close="handleClose">
      <el-form class="small-space" :model="style" label-position="left" label-width="100px" style='width: 550px; margin-left:50px;'>
        <el-form-item class="styleName" label="风格名称">
          <el-input v-model="style.name" placeholder="请输入风格名称"></el-input>
        </el-form-item>
        <el-form-item label-width="80px" label="风格封面">
          <span style="color:#FF4949" type="text">建议尺寸为1024*568</span>
        </el-form-item>

        <el-form-item label-width="80px" label="">

          <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>

          <div v-show="style.cover && !uploading" class="el-upload el-upload--picture-card">
            <img id="uploadCover" title="点击修改图片" style="width:180%; height:100%"
                 :src="style.cover+'?imageView2/1/w/498/h/276'">
          </div>
          <div v-show="!style.cover && !uploading" style="display:inline-block;">
            <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
              <i data-v-5b37d0d4="" class="el-icon-plus"></i>
            </div>
          </div>
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
        <el-form-item label="风格名称">
          <span>{{currentstyle.name}}</span>
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
  import uploader from '@/utils/uploader'
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
        uploading: false,
        isInit: false,
        percentage: 0,
        token: null,
        sortValue:"1",
				dialogFormVisible: false,
        currentstyle:{},
        title:"",
        addDialogFormVisible: false,
        selectDialogFormVisible: false,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          condition:""
        },
        goodsQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          keyword: null
        },
        style: {
          name:"",
          cover:""
        },
        coupon: {type:1, name:"", inDate:0, totalCount:0, disCount:0, amount:0, toAmount:0},
        dataList :[
        ],
        name: null,
        couponType: null,
        state: null,
        couponTypes: [
          {type:1, name:"包邮"},
          {type:2, name:"折扣"},
          {type:3, name:"金额"}
        ],
        states: [
          {name:"启用", value:"1"},
          {name:"停用", value:"2"}
        ],
        selectedTempGoods:null,
        selectedGoods:[],
        goodsList:[]
      }
    },
    mounted:function() {
      this.findAll();

    },
    methods: {
      getUploadTokenInitUploadBtn() {
        this.http.get(this).url(this.config.image_style.image_style_token).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            uploader.initUpload(response.data.data, "uploadCover", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.style.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });

            uploader.initUpload(response.data.data, "uploadCoverBtn", (url) => {
              this.percentage = 0;
              this.uploading = false;
              this.style.cover = url;
            }, (up, err, errTip) => {
              console.log(errTip)
            }, (up, file) => {
              console.log("percent is :" + file.percent);
              this.percentage = file.percent;
            }, (up, files) => {
              this.uploading = true;
            });
            this.token = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      handleClose(done) {
        done();
        this.isInit = true;
      },
      onSort(style) {
				this.currentstyle = style;
				this.sortValue = style.sort;
				this.dialogFormVisible=true;
			},
      confirmSort() {
				this.listQuery.loading = true;
				this.http.post(this).url(this.config.image_style.sort_url).params({
					styleId: this.currentstyle.styleId,
					sort: this.sortValue
					}).request((response) => {
						if (response.data.code != 0) {
              this.listQuery.loading = false;
							this.$message({message: response.data.message, type: 'error'});
							return;
						}
						this.listQuery.loading = false;
						this.$message({type: 'success', message: '设置排序成功!'});
						this.findAll();
						this.dialogFormVisible = false;
					}, (err) => {
            this.dialogFormVisible = false;
            this.listQuery.loading = false;
          });
			},
      deletestyle(style) {
        this.$confirm('是否要删除风格"' + style.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.image_style.delete_url).restful({styleId:style.styleId})
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
        this.style = {name:""};
      },

      handleCreate() {
        this.resetEditProvider();
        this.title = "添加风格";
        this.addDialogFormVisible = true;
        //初始化一次
        if(this.isInit == false){
          this.getUploadTokenInitUploadBtn();
        }
      },
      /**
       * 查询
       */
      findAll() {
        this.http.get(this).url(this.config.image_style.list_url).request(
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
        this.isInit = true;
      },
      submitCreate() {
        //表单验证
        if (!this.style.name || !this.style.name.trim()) {
          this.$message({message: '风格名称不能为空', type: 'warning'});
          return;
        }

        if (!this.style.cover || this.style.cover.trim() == 0) {
          this.$message({
            message: '请上传风格封面',
            type: 'warning'
          });
          return;
        }

        console.log(this.style);

        this.http.postJson(this).url(this.config.image_style.save_url).params(this.style).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            this.$message({type: 'success', message: '保存成功!'});
            this.findAll();
            this.addDialogFormVisible = false;
            this.isInit = true;
          },
          (error) => {

          }
        );
      },
      onEdit(style) {
        this.resetEditProvider();
        this.title = "编辑风格";
        console.log(style)
        this.style = jQuery.extend({}, style);
        this.addDialogFormVisible = true;
        //初始化一次
        if(this.isInit == false){
          this.getUploadTokenInitUploadBtn();
        }
      }
    }
  }

</script>
<style type="text/css">
	.gc_praiselist_list_img {
    width: 100px;
    height: 100px;
    display: block;
    margin: 5px auto;
  }
  .styleName .el-form-item__label{
    width: 80px !important;
  }
  .styleName .el-form-item__content{
    margin-left: 80px !important;
  }
</style>
