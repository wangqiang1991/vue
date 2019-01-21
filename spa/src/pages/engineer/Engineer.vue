<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="doSearch()" v-model="listQuery.condition" style="width: 200px;" class="filter-item"
                placeholder="输入设计师名称">
      </el-input>

      <el-select class="filter-item" v-model="listQuery.type" placeholder="设计师类型">
        <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">
        搜索
      </el-button>

      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加
      </el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit
              highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="昵称" width="200">
        <template scope="scope">
          <span class="link-type">{{scope.row.nickName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="头像" align="center">
        <template scope="scope">
          <img style="width:50px;height:50px;margin-top: 10px;" :src="scope.row.head+config.imgtmb._200">
        </template>
      </el-table-column>

      <el-table-column label="设计师类型" align="center">
        <template scope="scope">
          <span v-if="scope.row.type == 1">场景设计</span>
          <span v-else-if="scope.row.type == 2">商品设计</span>
          <span v-else-if="scope.row.type == 3">全栈设计</span>
        </template>
      </el-table-column>

      <el-table-column label="经营性质" align="center">
        <template scope="scope">
          <span v-if="scope.row.nature == 1">个人</span>
          <span v-else-if="scope.row.nature == 2">工作室</span>
          <span v-else-if="scope.row.nature == 3">企业</span>
        </template>
      </el-table-column>


      <el-table-column label="星级">
        <template scope="scope">
          <icon-svg v-for="n in scope.row.level" icon-class="star" class="meta-item__icon" :key="n"></icon-svg>
        </template>
      </el-table-column>

      <el-table-column label="性别">
        <template scope="scope">
          <span v-if="scope.row.gender == 1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号">
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column label="擅长">
        <template scope="scope">
          <span>{{scope.row.tag}}</span>
        </template>
      </el-table-column>

      <el-table-column label="个人主页">
        <template scope="scope">
          <span class="link-type" @click="openHomePage(scope.row.homePage)">{{scope.row.homePage}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="handleEdit(scope.row)">编辑
          </el-button>
          <el-button icon="delete" size="small" type="danger" @click="deleteSystemUser(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div  class="pagination-container">
      <el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
       @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]"
                     :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="listQuery.total">
      </el-pagination>
    </div>

    <!-- 添加设计师 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="systemUserDetail" label-position="left" label-width="100px"
               style='width: 500px; margin-left:50px;'>

        <el-form-item label="名称">
          <el-input v-model="designer.nickName" placeholder="请输入设计师名称(必填)"></el-input>
        </el-form-item>

        <el-form-item label="头像">
          <el-progress v-show="uploading" type="circle" :percentage="percentage"></el-progress>
          <div v-show="designer.head && !uploading" class="el-upload el-upload--picture-card" style="margin-right:2px;">
            <img id="uploadCover" title="点击修改图片" style="width:100%; height:100%"
                 :src="designer.head + config.imgtmb._200">
          </div>
          <div v-show="!designer.head && !uploading" style="display:inline-block; margin-left:8px">
            <div class="el-upload el-upload--picture-card" id="uploadCoverBtn">
              <i data-v-5b37d0d4="" class="el-icon-plus"></i>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="设计师类型">
          <el-select class="filter-item" v-model="designer.type" placeholder="设计师类型(必选)">
            <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="经营性质">
          <el-select class="filter-item" v-model="designer.nature" placeholder="经营性质(必选)">
            <el-option v-for="item in natures" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="星级">
          <el-rate style="margin-top:8px;" v-model="designer.level"
                   :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio v-model="designer.gender" label="1">男</el-radio>
          <el-radio v-model="designer.gender" label="2">女</el-radio>
        </el-form-item>


        <el-form-item label="手机">
          <el-input v-model="designer.phone" placeholder="联系电话"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="designer.email" placeholder="联系邮箱"></el-input>
        </el-form-item>

        <el-form-item label="个人主页">
          <el-input v-model="designer.homePage" placeholder="个人主页"></el-input>
        </el-form-item>

        <el-form-item label="擅长领域">
          <el-tag :key="tag" v-for="tag in designer.tags" type="primary" closable style="margin-left: 10px;"
                  :disable-transitions="false" @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 添加</el-button>
        </el-form-item>


        <el-form-item label="设计师简介">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请填写供应商描述"
                    v-model="designer.description">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="save()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import md5 from 'js-md5'
  import uploader from '@/utils/uploader'
  import {Loading} from 'element-ui'

  export default {
    directives: {
      waves
    },
    data() {
      return {
        title: "添加设计师",
        addDialogFormVisible: false,
        listQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          condition: "",
          type:''
        },
        dataList: [],
        uploading: false,
        inputVisible: false,
        designer: {
          nickName: '',
          head: '',
          level: 1,
          gender: "1",
          tag: '',
          tags: [],
          phone: '',
          email: '',
          homePage: '',
          description: '',
          type: '',
          nature: ''
        },
        uploading: false,
        percentage: 0,
        token: null,
        styleInit: false,
        types: [{value: '1', name: '场景设计'}, {value: '2', name: '商品设计'}, {value: '3', name: '全栈设计'}],
        natures: [{value: '1', name: '个人'}, {value: '2', name: '工作室'},{value: '3', name: '企业'}]
      }
    },
    mounted() {
      this.findByPage();
    },
    methods: {
      /**
       * 重置add_provider
       */
      resetEdit() {
        this.designer = {
          nickName: '',
          head: '',
          level: 1,
          gender: "1",
          tag: '',
          tags: [],
          phone: '',
          email: '',
          homePage: '',
          description: '',
          type: '',
          nature: ''
        }
      },

      handleCreate() {
        this.resetEdit();
        this.title = "添加设计师";
        this.addDialogFormVisible = true;
        this.initStyleUpload();
      },

      handleEdit(designer) {
        this.title = "编辑设计师";
        this.addDialogFormVisible = true;
        this.resetEdit();
        this.initStyleUpload();
        this.designer = $.extend({}, designer);

        if (this.designer.type == 0) {
          this.designer.type = '';
        } else {
          this.designer.type = this.designer.type + '';
        }

        if (this.designer.nature == 0) {
          this.designer.nature = '';
        } else {
          this.designer.nature = this.designer.nature + '';
        }

        this.designer.gender = this.designer.gender + "";
        if (this.designer.tag && this.designer.tag.trim().length > 0) {
          this.designer.tags = this.designer.tag.split(",");
        } else {
          this.designer.tags = [];
        }
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

      /**
       * 分页查询系统账号
       */
      findByPage() {
        var params = {
          pageSize: this.listQuery.pageSize,
          pageIndex: this.listQuery.pageIndex,
          nickName: this.listQuery.condition
        };
        if (this.listQuery.type) {
          params.type = this.listQuery.type;
        }



        this.http.get(this).url(this.config.designer.list_url).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }
            this.dataList = response.data.data.data;
            this.listQuery.total = response.data.data.totalSize;
          },
          (error) => {
            this.$message({message: "服务器繁忙,请稍后再试", type: 'error'});
          }
        );
      },
      cancel() {
        this.addDialogFormVisible = false;
      },

      save() {

        //表单验证
        if (!this.designer.nickName || !this.designer.nickName.trim()) {
          this.$message({message: '设计师名称不能为空', type: 'warning'});
          return;
        }
        if (!this.designer.head || !this.designer.head.trim()) {
          this.$message({message: '头像不能为空', type: 'warning'});
          return;
        }
        if (!this.designer.type || !this.designer.type.trim()) {
          this.$message({message: '请选择设计师类型', type: 'warning'});
          return;
        }
        if (!this.designer.nature || !this.designer.nature.trim()) {
          this.$message({message: '请选择经营性质', type: 'warning'});
          return;
        }

        this.designer.tag = this.designer.tags.join(",");
        console.log(this.designer.tag);

        var loadingInstance = Loading.service({text: '数据提交中...'});
        this.http.postJson(this).url(this.config.designer.save_url).params(this.designer).request(
          (response) => {
            loadingInstance.close();
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
            } else {
              this.$message({type: 'success', message: '保存成功!'});
              this.findByPage();
              this.addDialogFormVisible = false;
            }
          },
          (error) => {
            loadingInstance.close();
            this.$message.error('服务器繁忙,请稍后再试');
          }
        );
      },

      deleteSystemUser(systemUser) {
        this.$confirm('是否要删除该设计师吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.designer.delete_url).restful({designerId: systemUser.designerId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {
        });
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.designer.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleClose(tag) {
        this.designer.tags.splice(this.designer.tags.indexOf(tag), 1);
      },

      openHomePage(linkUrl) {
        window.open(linkUrl, "_blank");
      },

      initStyleUpload() {
        if (!this.styleInit) {
          this.$nextTick(_ => {
            this.styleInit = true;
            this.http.get(this).url(this.config.categroy.categroy_token).request(function (response) {
              console.log(response);
              if (response.data.code == 0) {
                uploader.initUpload(response.data.data, "uploadCover", (url) => {
                  this.percentage = 0;
                  this.uploading = false;
                  this.designer.head = url;
                }, (up, err, errTip) => {
                  console.log(errTip)
                }, (up, file) => {
                  this.percentage = file.percent;
                }, (up, files) => {
                  this.uploading = true;
                });

                uploader.initUpload(response.data.data, "uploadCoverBtn", (url) => {
                  this.percentage = 0;
                  this.uploading = false;
                  this.designer.head = url;
                }, (up, err, errTip) => {
                  console.log(errTip)
                }, (up, file) => {
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

          });
        }
      }

    }
  }

</script>
