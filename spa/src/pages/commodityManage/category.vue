<template>
  <div class="gc-category" id="categroy_vue">
    <div class="gc_left_area">
      <div class="gc-category_header">
        <el-button type="primary" icon="plus" @click="addColumn(null)">添加父类目</el-button>
        <el-button type="danger" icon="delete" @click="delColumn"></el-button>
      </div>
      <div class="tree_div">
        <ul id="ztreeWrapper" class="ztree">
        </ul>
      </div>

    </div>
    <div class="gc_right_area">
      <div class="gc-category_content">
        <div class="gc-msg_area">分类信息</div>
        <el-form :model="editform" class="gc-edit_msg_area">
          <el-form-item label="上级类目" :label-width="formLabelWidth">
            <el-input
              v-model="editform.parentName"
              auto-complete="off"
              class="gc_deitform_parentName"
              disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="类目名称" :label-width="formLabelWidth">
            <el-input v-model="editform.name" maxlength="10" auto-complete="off" class="gc_deitform_name"></el-input>
          </el-form-item>

          <el-form-item v-show="currentCategory.parentName == '无'" :label-width="formLabelWidth" label="类目图:">
            <span style="color:#FF4949" type="text">建议尺寸为1024*390</span>
          </el-form-item>

          <el-form-item v-show="currentCategory.parentName == '无'" label="" :label-width="formLabelWidth">
            <div class="el-upload el-upload--picture-card" id="uploadBtn">
              <i data-v-5b37d0d4="" class="el-icon-plus"></i>
            </div>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth" label="关键词:" >
            <el-tag :key="tag" v-for="tag in editform.keywordsArray" type="primary" closable style="margin-left: 10px;"
                    :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm" style="width: 100px;">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput"> + 添加</el-button>
          </el-form-item>
          <el-form-item label="类目序号" :label-width="formLabelWidth">
            <el-input-number v-model="editform.sort" :min="1" :max="1000000"></el-input-number>
          </el-form-item>
          <el-form-item label="首页序号" :label-width="formLabelWidth">
            <el-input-number v-model="editform.topSort" :min="1" :max="1000000"></el-input-number>
          </el-form-item>
          <el-form-item v-if="false" label="是否上首页" :label-width="formLabelWidth"
                        class="gc-form_index">
            <el-checkbox v-model="boxStatus">上首页</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="editColumn">保 存</el-button>
        </div>
      </div>
    </div>
    <!-- Form -->
    <el-dialog title="添加类目" :visible.sync="dialogAddColum" @close='closeDialog'>
      <el-form :model="form">
        <el-form-item label="上级类目" :label-width="formLabelWidth">
          <el-input v-model="form.parentName" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="类目名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" maxlength="10" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="关键词:" >
          <el-tag :key="tag" v-for="tag in addform.keywordsArray" type="primary" closable style="margin-left: 10px;"
                  :disable-transitions="false" @close="handleCloseTag(tag)">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="tagVisible" v-model="tagValue" ref="saveTag" size="small"
                    @keyup.enter.native="addTags"
                    @blur="addTags" style="width: 100px;">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showTagsInput"> + 添加</el-button>
        </el-form-item>

        <el-form-item v-show="form.parentName == '无'" :label-width="formLabelWidth" label="类目图:">
          <span style="color:#FF4949" type="text">建议尺寸为1024*390</span>
        </el-form-item>

        <el-form-item v-show="form.parentName == '无'" label="" :label-width="formLabelWidth">
          <div class="el-upload el-upload--picture-card" id="uploadBtn1">
            <i data-v-5b37d0d4="" class="el-icon-plus"></i>
          </div>
        </el-form-item>
        <!-- <el-form-item label="序号" :label-width="formLabelWidth">
          <el-input-number v-model="form.sort" type="number" auto-complete="off" :min="1" :max="1000000"></el-input-number>
        </el-form-item> -->
        <el-form-item v-if="false" label="是否上首页" :label-width="formLabelWidth" class="gc-form_index">
          <el-checkbox v-model="form.topHome">上首页</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogAddColum = false">取 消</el-button>
        <el-button type="primary" @click="addLevelcolumn">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  var uptoken = null;
  /**
   * 初始化上传组件,设置相关的回调函数
   * @param  {[type]} uptoken [description]
   * @return {[type]}         [description]
   */
  function initUpload(uptoken, button, callback) {
    Qiniu.uploader({
      runtimes: 'html5,flash,html4',
      browse_button: button,
      max_file_size: '2mb',
      flash_swf_url: 'static/upload/plupload/Moxie.swf',
      dragdrop: true,
      chunk_size: '4mb',
      uptoken: uptoken.uptoken,
      domain: uptoken.domain,
      get_new_uptoken: false,
      unique_names: true,
      auto_start: false,
      // 单选文件
      multi_selection: false,
      // 过滤选择的文件类型
      filters: {
        mime_types: [
          //只允许上传图片和zip文件
          {title: "所有图片", extensions: "jpg,png,jpeg"},
        ],
        // 最大只能上传2MB的文件
        max_file_size: '2048kb',
        // 不允许选取重复文件
        prevent_duplicates: !true
      },
      init: {
        'FilesAdded': function (up, files) {
          console.log(up, files);
          up.start();
        },
        'BeforeUpload': function (up, file) {
          console.log("BeforeUpload");
          console.log(up, file);
        },
        'UploadProgress': function (up, file) {
          console.log("UploadProgress");
          console.log(file.percent);
        },
        'UploadComplete': function () {
          console.log("UploadComplete");
        },
        'FileUploaded': function (up, file, info) {
          var url = up.getOption('domain') + $.parseJSON(info.response).key;
          callback(url);
        },
        'Error': function (up, err, errTip) {
          alert(errTip);
        }
      }
    });
  };

  import config from '@/commons/config'

  var clickObj = [];
  var vobj = false;

  var setting = {
    view: {
      addHoverDom: addHoverDom,
      removeHoverDom: removeHoverDom,
      selectedMulti: false
    },
    edit: {
      enable: true,
      showRemoveBtn: false,
      showRenameBtn: false
    },
    data: {
      percentage:0,
      uploading:false,
      simpleData: {
        enable: true
      }
    },
    callback: {
      beforeClick: beforeClick,
      onClick: onClick,
      beforeDrag: beforeDrag,
      beforeRemove: beforeRemove,
      onRemove: onRemove
    }
  };

  var zNodes = [];
  var dataSource = {};
  var currSource = {};
  var log, className = "dark";
  function beforeClick(treeId, treeNode, clickFlag) {
    //添加到点击对象中
    clickObj[0] = treeNode.id;
    jsEdit(treeNode.id);
    className = (className === "dark" ? "" : "dark");
    return (treeNode.click != false);
  }

  function onClick(event, treeId, treeNode, clickFlag) {

  }

  function beforeDrag(treeId, treeNodes) {
    return false;
  }

  function beforeEditName(treeId, treeNode) {

  }

  /**
   *删除前调用
   */
  function beforeRemove(treeId, treeNode) {
    vobj.delColumn(treeNode.id);
    return false;
  }

  function onRemove(e, treeId, treeNode) {
  }
  var newCount = 1;

  function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    //子级目录无添加按钮
    if (treeNode.pId == null) {
      if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
      var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='添加' onfocus='this.blur();'></span>";
      sObj.after(addStr);
      var btn = $("#addBtn_" + treeNode.tId);
      if (btn) btn.bind("click", function () {
        console.log(vobj);
        //调用vue 里添加方法
        vobj.addColumn(treeNode.id, "children");
      });
    }
  };

  function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
  };

  function selectAll() {
    var zTree = $.fn.zTree.getZTreeObj("ztreeWrapper");
    zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
  }


  //原生js修改更新
  function jsEdit(id) {
    var getData = dataSource[id];
    var getparentid = getData.parentId;
    var _parentname = "无";
    if (getparentid != null) {
      _parentname = dataSource[getparentid].name;
      $(".gc-form_index").hide();
    } else {
      $(".gc-form_index").show();
      //调用vue改变状态
      vobj.changeBoxStatus(getData.topHome);
    }
    currSource = {
      categoryId: getData.categoryId,
      name: getData.name,
      title: getData.title,
      image: getData.image,
      sort: getData.sort,
      parentId: getparentid,
      parentName: _parentname,
      topHome: getData.topHome,
      topSort: getData.topSort,
      keywords: getData.keywords
    }
    console.log(currSource.parentId)
    if(currSource.parentId == null){
      vobj.editform.showKeywords = true;
    }else{
      vobj.editform.showKeywords = false;
    }
    $("#uploadBtn").html("<img style='width:100%;height:100%' src='" + getData.image + vobj.config.imgtmb._200 + "'>");
    $(".gc_deitform_parentName input").val(_parentname);
    vobj.currentCategory.parentName = _parentname;
    $(".gc_deitform_name input").val(getData.name);
    vobj.editform.sort=getData.sort;
    vobj.editform.topSort=getData.topSort;
    vobj.editform.keywords=getData.keywords;
    console.log(vobj.editform)
    if (vobj.editform.keywords && vobj.editform.keywords.length > 0) {
      vobj.editform.keywordsArray = vobj.editform.keywords.split(",");
    } else {
      vobj.editform.keywordsArray = [];
    }
    //$(".gc_deitform_sort input").val(getData.sort);
  }

  export default {
    data() {
      return {
        showKeywords: false,
        keywordsArray: [],
        inputVisible: false,
        tagVisible: false,
        tagValue:"",
        categoryData: [],
        dialogAddColum: false,
        form: {
          categoryId: null,
          name: '',
          title: '',
          image: '',
          sort: '',
          parentId: null,
          parentName: null,
          topHome: true,
          keywords: ''
        },
        addform:{
          keywordsArray:[]
        },
        editform: {
          sort:null,
          keywordsArray:[]
        },
        categoryParams: {
          categoryId: null,
          name: '',
          title: '',
          image: '',
          sort: '',
          parentId: null,
          keywords: ''
        },
        formLabelWidth: '120px',
        //图片上传参数
        dialogImageUrl: '',
        dialogUploadImg: false,
        boxStatus: false,
        tokenobj: {},
        initUploaded: false,
        currentCategory:{
          parentName:'无'
        }
      }
    },
    methods: {
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      showTagsInput() {
        this.tagVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTag.$refs.input.focus();
        });
      },
      addTags() {
         let inputValue = this.tagValue;
        if (inputValue) {
          this.addform.keywordsArray.push(inputValue);
          var tmp = [];
          for(var i = 0;i < this.addform.keywordsArray.length;i++){
            if(tmp.indexOf(this.addform.keywordsArray[i]) == -1){
              tmp.push(this.addform.keywordsArray[i])
            }
          }
          this.addform.keywordsArray = tmp;
        }
        this.tagVisible = false;
        this.tagValue = '';
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          vobj.editform.keywordsArray.push(inputValue);
          var tmp = [];
          for(var i = 0;i < vobj.editform.keywordsArray.length;i++){
            if(tmp.indexOf(vobj.editform.keywordsArray[i]) == -1){
              tmp.push(vobj.editform.keywordsArray[i])
            }
          }
          vobj.editform.keywordsArray = tmp;
          console.log(vobj.editform.keywordsArray);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleCloseTag(tag) {
        this.addform.keywordsArray.splice(this.addform.keywordsArray.indexOf(tag), 1);
      },
      handleClose(tag) {
        vobj.editform.keywordsArray.splice(vobj.editform.keywordsArray.indexOf(tag), 1);
      },
      userpppp: function () {
      },
      changeBoxStatus: function (b) {
        this.boxStatus = b;
      },
      //添加栏目按钮逻辑
      addColumn: function (id, type) {
        if (!this.initUploaded) {
          console.log(this.tokenobj);
          this.getUploadToken("uploadBtn1", function (data) {
            $("#uploadBtn1").html("<img style='width:100%;height:100%' src='" + data + config.imgtmb._200 + "'>");
            console.log("上传成功" + data);
          });
          this.initUploaded = true;
        }

        if (id != undefined) {
          var currid = clickObj[0];
          if (type == "children") {
            currid = id;
          }
          if (currid != undefined) {
            //添加目录

            var _list = dataSource[currid];
            //判断是否是二级目录
            if (_list.parentId != null) {
              //不能添加三级目录
              this.$message.error("不能再添加子目录");
              return;
            } else {
              //判断是否根目录
              if (_list.categoryId != null) {
                //添加二级目录
                this.form = {
                  parentId: _list.categoryId,
                  parentName: dataSource[_list.categoryId].name,
                  topHome: dataSource[_list.categoryId].topHome
                }
              } else {
                //根目录
                console.log("添加根目录");
                this.form = {
                  parentName: "无",
                  categoryId: null,
                  name: '',
                  title: '',
                  image: '',
                  sort: '',
                  parentId: null
                }
              }
            }
          } else {
            //添加根目录
            console.log("添加根目录");
            this.form = {
              parentName: "无",
              categoryId: null,
              name: '',
              title: '',
              image: '',
              sort: '',
              parentId: null,
              topHome: false
            }

          }
        } else {
          //添加根目录
          console.log("添加根目录");

          this.form = {
            parentName: "无",
            categoryId: null,
            name: '',
            title: '',
            image: '',
            sort: '',
            parentId: null,
            topHome: false
          }
        }
        this.dialogAddColum = true;
      },
      closeDialog() {
        this.addform.keywordsArray = [];
        this.tagVisible = false;
      },
      //获取列表
      getcategoryList: function (callback) {
        this.http.get(this).url(config.categroy.categroy_list_url).params({}).request(function (response) {
          console.log('------')
          console.log(response);

          if (response.data.code == 0) {
            callback.apply(this, [response.data.data])

          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      },
      //修改目录文件
      editColumn: function () {

        var _curr = currSource;
        var name = $(".gc_deitform_name input").val();
        var sort = this.editform.sort;
        var topSort = this.editform.topSort;
        var tophome = this.boxStatus;
        if (name.length <= 0) {
          this.$message({message: '类目名称不能为空', type: 'warning'});
          return;
        }
        if (sort.length <= 0) {
          this.$message({message: '序号不能为空', type: 'warning'});
          return;
        }
        var _src = $("#uploadBtn img").attr("src");
        if (!_src && !_curr.parentId) {
          this.$message({message: '类目图不能为空', type: 'warning'});
          return;
        }
        var _keywords = vobj.editform.keywordsArray.join(',');
        if (_src) {
          var index = _src.indexOf("?");
          _src = _src.substr(0, index);
        }
        this.categoryParams = {
          categoryId: _curr.categoryId,
          name: name,
          title: name + "分类",
          image: _src,
          sort: sort,
          topSort: topSort,
          parentId: _curr.parentId,
          topHome: tophome,
          keywords: _keywords
        }
        this.opColumen(function () {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.clearParams();
        });

      },
      delColumn: function () {
        if (currSource.categoryId == undefined) {
          this.$message({message: '请选择要删除的文件', type: 'warning'});
          return;
        }
        var _name = currSource.name;
        this.$confirm('您确定要删除' + _name + '这个文件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.categroy.categroy_delete_url).restful({categoryId: currSource.categoryId})
            .request((response) => {
              if (response.data.code != 0) {

                this.$message({message: response.data.message, type: 'error'});
                return ;
              }
              this.$message({type: 'success', message: '删除成功!'});
              this.getcategoryList(function (data) {
                jQuery.fn.zTree.init($("#ztreeWrapper"), setting, this.getDataSource(data));
              });
            }, (err) => {
            });
        }).catch(() => {
          return false;
        });
      },
      //添加栏目方法
      addLevelcolumn: function () {

        //参数检验
        var _data = this.form;
        if (_data.name.length <= 0) {
          this.$message({message: '类目名称不能为空', type: 'warning'});
          return;
        }
        // if (_data.sort.length <= 0) {
        //   this.$message({message: '序号不能为空', type: 'warning'});
        //   return;
        // }
        var _src = $("#uploadBtn1 img").attr("src");
        //判断 是否上传图片
        if (!_src && !_data.parentId) {
          this.$message({message: '类目图不能为空', type: 'warning'});
          return;
        }
        if (_src) {
          var index = _src.indexOf("?");
          _src = _src.substr(0, index);
        }
        var _keywords = this.addform.keywordsArray.join(",");
        this.dialogAddColum = false;
        this.categoryParams = {
          categoryId: null,
          name: _data.name,
          title: _data.name + "分类",
          image: _src,
          sort: _data.sort,
          parentId: _data.parentId,
          topHome: _data.topHome,
          keywords: _keywords
        }
        this.opColumen(function () {
          this.$message({
            type: 'success',
            message: '类目添加成功!'
          });
          this.clearParams();
        });
      },
      opColumen: function (callback) {
        console.log(this.categoryParams)
        this.http.postJson(this).url(config.categroy.categroy_list_url).params(
          this.categoryParams
        ).request(function (response) {
          console.log(response);
          this.clearParams();
          if (response.data.code == 0) {
            callback.call(this);
            this.getcategoryList(function (data) {
              jQuery.fn.zTree.init($("#ztreeWrapper"), setting, this.getDataSource(data));
            });

          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          this.clearParams();
          this.$message.error(error);
        });
      },
      //重置数据
      clearParams: function () {
        this.categoryParams = {
          categoryId: null,
          name: '',
          title: '',
          image: '',
          sort: '',
          parentId: null
        }
        this.form = {
          categoryId: null,
          name: '',
          title: '',
          image: '',
          sort: '',
          parentId: null,
          parentName: null,
          index: 1
        }
        this.addform.keywordsArray = [];
        $("#uploadBtn1").html('<i data-v-5b37d0d4="" class="el-icon-plus"></i>');
      },
      getDataSource: function (data) {
        var _arr = [];
        var _obj = {};
        for (var i = 0; i < data.length; i++) {
          var list = data[i];
          dataSource[list.categoryId] = list;
          _arr.push(this.exchangeData(list));
        }
        return _arr;
      },
      exchangeData(data) {
        var _obj = {};
        _obj.id = data.categoryId;
        _obj.pId = data.parentId;
        _obj.name = data.name;
        if (data.categoryId != null && data.parentId == null) {
          _obj.open = true;
        }
        return _obj;
      },
      //操作图片
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogUploadImg = true;
      },
      getUploadToken(btn, callback) {
        this.http.get(this).url(config.categroy.categroy_token).params({}).request(function (response) {
          console.log(response);
          if (response.data.code == 0) {
            var result = response.data.data;
            this.tokenobj.uptoken = result.token;
            this.tokenobj.domain = result.domain;
            initUpload.call(window, this.tokenobj, btn, function (data) {
              callback(data);
            });
          } else {
            this.$message.error(response.data.message);
          }
        }, function (error) {
          this.$message.error(error);
        });
      }

    },
    mounted: function () {
      vobj = this;
      this.$nextTick(function () {
        this.getUploadToken("uploadBtn", function (data) {
          $("#uploadBtn").html("<img style='width:100%;height:100%' src='" + data + config.imgtmb._200 + "'>");
          console.log("上传成功" + data);
        });
        $(".tree_div").height($(window).height() - 125);
        this.getcategoryList(function (data) {
          //console.log(dataSource+"+++-------++++++++++");
          jQuery.fn.zTree.init($("#ztreeWrapper"), setting, this.getDataSource(data));
          jsEdit(Object.keys(dataSource)[0]);
          //console.log($("#ztreeWrapper"))
        });
//      this.findKeywords();
      })

    }

  }
</script>
<style rel="stylesheet/scss" lang="scss" >
#categroy_vue{
  
    width: 100%;
    padding: 15px 20px;
    position: relative;
  

  .gc-category_header {
    margin-bottom: 20px;
  }

  .gc_left_area {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    z-index: 2;
    height: calc(100% - 50px);
    padding: 15px 0 0 15px;
  }

  .gc_right_area {
    margin-left: 180px;
    border-left: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    padding-bottom: 50px;
  }

  .dialog-footer {
    text-align: center;
  }

  .gc-msg_area {
    padding: 15px;
    border-bottom: 1px solid #dcdcdc;
  }

  .gc-edit_msg_area {
    padding-top: 15px;
  }

  #uploadBtn1, #uploadBtn {
    width: 148px;
    height: 56px;
    line-height: 62px;
  }

  #uploadBtn1 img, #uploadBtn img {
    width: 100%;
    height: 100%;
  }

  .tree_div {
    height: 700px;
    overflow: auto;
    .test-1::-webkit-scrollbar {/*滚动条整体样式*/
        width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
  }


  /* 设置滚动条的样式 */
  .tree_div::-webkit-scrollbar {
    width:12px;
  }
  /* 滚动槽 */
  .tree_div::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #FFFFFF;
  }
  /* 滚动条滑块 */
  .tree_div::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #535353;
  }
  #ztreeWrapper li {
    line-height: 28px;
    >a{
      margin-top:6px;
      span.node_name{
        vertical-align: top;
      }
    }
  }
}
</style>
