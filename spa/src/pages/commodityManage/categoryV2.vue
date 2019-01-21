<template>
  <div id="categoryV2_vue">
      <el-row style="margin-top:40px;">
        <el-col :span="11" :offset="1">
          <div style="margin-bottom:20px;">
            <el-button type="primary" icon="plus" @click="addFirstCategory">添加一级类目</el-button>
          </div>

          <el-tree
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :expand-on-click-node="true"
            :render-content="renderContent">
          </el-tree>
        </el-col>
        
      </el-row>  
       
      <div style="width:450px;height:auto;position:fixed;top:100px;right:50px;">
        <p style="font-size:24px;height:36px;text-align:left;color:#343434;margin:0 auto 20px;;">类目详情</p>
        <div id="categoryV2_desc" >
          <p><span>{{descData.parentId ? '商品二级类目' : '商品一级类目'}}</span></p>
          <p><span>上级类目: </span>{{descData.parentName ? descData.parentName : '无'}}</p>
          <p><span>类目名称: </span>{{descData.name}}</p>
          <p><span>类目关键词: </span>{{descData.keywords ? descData.keywords : '无'}}</p>
          <p><span>类目序号: </span>{{descData.sort}}</p>
          <p><span>类目类型: </span>{{(descData.type == 1) ? '品类' : '区域'}}</p>
          <p style="overflow:hidden;" v-show="!(descData.type == 2 && !descData.parentId)"><span style="float:left;margin-right:5px;">类目图片:</span>
            <img :src="descData.image" v-if='descData.type == 1 && descData.parentId' style="width:120px;height:120px;">
            <img :src="descData.image" v-if='descData.type == 1 && !descData.parentId' style="width:315px;height:120px;">
            <img :src="descData.image" v-if='descData.type == 2 && descData.parentId' style="width:315px;height:120px;">
          </p>
        </div>
      </div>
      <!--添加和编辑弹框-->
    <el-dialog :title="title" :visible.sync="dialogForm">
      <el-form :model="categroy">

        <el-form-item label="上级类目:" >
          <el-input v-model="categroy.parentName" maxlength="30" auto-complete="off" placeholder="上级类目" :disabled='true'></el-input>
        </el-form-item>

        <el-form-item label="类目名称:" >
          <el-input v-model="categroy.name" :maxlength="categroy.parentId ? 10 : 5" auto-complete="off" placeholder="类目名称"></el-input>
        </el-form-item>

        <el-form-item label="关键词:">
            <el-tag :key="tag" v-for="tag in categroy.keywordsArray"
             type="primary"
             closable 
             style="margin-left: 10px;" 
             :disable-transitions="false" 
             @close="handleCloseTag(tag)">
              {{tag}}
            </el-tag>

            <el-input class="input-new-tag" v-if="inputVisible" maxlength='10' v-model="inputValue" ref="saveTagInput" size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm" style="width: 100px;">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput" v-show='categroy.keywordsArray.length < 6'> + 添加</el-button>
        </el-form-item>

        <el-form-item label="类目序号:" v-show='editFlag'>
           <el-input-number v-model="categroy.sort" :min="1" :max="1000"></el-input-number>
        </el-form-item>

        <el-form-item label="类目类型:" >
          <el-radio class="radio" :disabled="editFlag || categroy.parentId" v-model="categroy.type" label="1">品类</el-radio>
          <el-radio class="radio" :disabled="editFlag || categroy.parentId" v-model="categroy.type" label="2">区域</el-radio>
        </el-form-item>
        
        <el-form-item label="类目图片:" v-show="(categroy.type == '1' ||  categroy.type == 1) && categroy.parentId">
          <p style="margin-bottom:5px;margin-top:0;"><span style="color:#FF4949;" type="text">建议尺寸640*640</span></p>
          <uploadImage :id="'planUpload'" :width="200" :height="200" ref="planUpload" @uploadSuccess="uploadSuccess"></uploadImage>
        </el-form-item>

        <el-form-item label="类目图片:" v-show="((categroy.type == '1' ||  categroy.type == 1) && !categroy.parentId)||( (categroy.type == '2' || categroy.type == 2) && categroy.parentId)">
          <p style="margin-bottom:5px;margin-top:0;"><span style="color:#FF4949;" type="text">建议尺寸1024*390</span></p>
          <uploadImage :id="'planUpload1'" :width="315" :height="120" ref="planUpload1" @uploadSuccess="uploadSuccess1"></uploadImage>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="addMenuResource">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import uploadImage from '@/components/Upload/index'
export default{
  components:{
    uploadImage:uploadImage
  },
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
      descData:{},
      categroy:{
        categoryId: null,
        parentId:null,
        parentName:'无',
        name: "",
        type: '1',
        image: '',
        keywords: "",
        keywordsArray:[],
        sort: 1
      },
      editFlag:false,
      inputVisible: false,
      inputValue: '',
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
    this.loadData();
  },
  methods:{
      resetForm(){
        this.categroy = {
          categoryId: null,
          parentId:null,
          parentName:'无',
          name: "",
          type: '1',
          image: '',
          keywords: "",
          keywordsArray:[],
          sort: 1
        }
      },
      checkForm(){
        if (!this.categroy.name || !this.categroy.name.trim()) {
          this.$message({message: '类目名称不能为空', type: 'warning'});
          return false;
        }

        if (this.categroy.type == 1 || (this.categroy.type == 2 && this.categroy.parentId) ){
          if (!this.categroy.image) {
            this.$message({message: '请上传类目图片', type: 'warning'});
            return false;
          }
        }
        return true;
      },
      showDesc(store, data,event) {
        console.log(data)
        this.name = data.name;
        this.description = data.description;
        this.descData = data;
      },

      handleCloseTag(tag) {
        this.categroy.keywordsArray.splice(this.categroy.keywordsArray.indexOf(tag), 1);
        console.log(this.categroy.keywordsArray)
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          let flag = true;
          this.categroy.keywordsArray.forEach((item)=>{
            if(item == inputValue){
              flag = false;
            }
          })
          if (flag) {
            this.categroy.keywordsArray.push(inputValue)
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      initUploaded() {
        setTimeout(()=>{
          this.$refs.planUpload.initUploadBtn(this.categroy.image);  
          this.$refs.planUpload1.initUploadBtn(this.categroy.image);  
        },50)
      },
      uploadSuccess(data) {
        this.categroy.image = data.cover;
      },
      uploadSuccess1(data) {
        this.categroy.image = data.cover;
      },
      add(store, data,event) {
        console.log(data)
        event.cancelBubble = true;
        this.resetForm();

        this.categroy.parentId = data.categoryId;
        this.categroy.parentName = data.name;
        this.categroy.type = data.type + '';

        this.dialogForm = true;
        this.editFlag = false;
        this.title = '添加二级类目';
        this.initUploaded();
      },
      addFirstCategory() {
        this.resetForm();
        this.dialogForm = true;
        this.editFlag = false;
        this.title = '添加一级类目';
        this.initUploaded();
      },
      /*修改*/
      edit(store, data,event) {
        console.log(data)
        event.cancelBubble = true;
        this.editFlag = true;
      
        if (data.parentId) {
          this.title = '修改二级类目';
        } else {
          this.title = '修改一级类目';
          data.parentName = '无';
        }

        data.type = data.type + '';      

        if (data.keywords) {
          data.keywordsArray = data.keywords.split(',');
        } else {
          data.keywordsArray = [];
        }

        this.categroy = jQuery.extend({},data);
        this.dialogForm = true;
        this.initUploaded();

      },
      addMenuResource(){
        console.log(this.categroy)
        if(this.checkForm()){
          let params = jQuery.extend({},this.categroy)
          if (params.keywordsArray.length) {
            params.keywords = params.keywordsArray.join(',');
          } else {
            params.keywords = '';  
          }
          
          if (params.type == '1') {
            params.type  = 1;
          } else {
            params.type  = 2;
          }

          this.comfirmAddCategory(params);
        }
      },
      /*添加编辑接口*/
      comfirmAddCategory(params) {
        this.http.postJson(this).url(this.config.categroy.categroy_list_url).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message.error(response.data.message);
            return;
          }
          this.dialogForm = false;
          let message = this.editFlag ? '修改成功' : "添加成功";
          this.$message({message: message, type: 'success'});
          this.loadData();

        }, (err) => { console.log(err)});
      },

      remove(store,data,event) {
        event.cancelBubble = true;
        console.log(store,data)
        this.removeResource(data);
      },
      removeResource(data) {
        this.$confirm("确定要删除类目 '" + data.name+"' ?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:"warning",
            confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.categroy.categroy_delete_url).restful({categoryId: data.categoryId}).request((response) => {
              if (response.data.code != 0) {
                this.$message.error(response.data.message);
                return;
              }
              this.$message({message:'删除成功!',type:"success"});
              this.loadData();
          }, (err) => { console.log(err)});
        }).catch(() => {});
      },

      //获取分类列表
      loadData() {
        this.http.get(this).url(this.config.categroy.categroy_list_url).request((response) => {
            if (response.data.code != 0) {
              this.$message.error(response.data.message);
              return;
            }
            let data = response.data.data;
            this.setSort(data);
        }, (err) => { console.log(err)});
      },
      setSort(data) {
        let resultData = [];
        //提取一级类目数据
        for (var i = 0; i < data.length; i++) {
          if (!data[i].parentId) {
            if (resultData.length) {
              let isend = true;
              let number = null;             
              for (var j = 0; j < resultData.length; j++) {
                if (data[i].sort < resultData[j].sort) {
                  isend = false;
                  number = j;
                }
              }

              if (isend) {
                data[i].children = [];
                resultData.push(data[i]);
              } else {
                data[i].children = [];
                resultData.splice(number,0,data[i]);
              }
            } else {
              data[i].children = [];
              resultData.push(data[i]);
            }
          }
        }
        //提取二级类目数据
        for (var m = 0; m < data.length; m++) {
          if (data[m].parentId) {
            for (var n = 0; n < resultData.length; n++) {
              if(resultData[n].categoryId == data[m].parentId){

                if (resultData[n].children.length) {
                  let isend = true;
                  let number = null;  

                  for (var k = 0; k < resultData[n].children.length; k++) {
                    if (data[m].sort < resultData[n].children[k].sort) {
                      isend = false;
                      number = k;
                    }
                  }

                  if (isend) {
                    data[m].parentName = resultData[n].name;
                    resultData[n].children.push(data[m]);
                  } else {
                    data[m].parentName = resultData[n].name;
                    resultData[n].children.splice(number,0,data[m]);
                  }

                } else {
                  data[m].parentName = resultData[n].name;
                  resultData[n].children.push(data[m]);
                }

                break ;
              }
            }
          }
        }

        console.log(resultData)
        this.treeData = resultData;
      },  
      renderContent(h, {node, data, store}) {return(<span style="width:92%;overflow:hidden;display:inline-block;vertical-align: top;" on-click={($event)=> this.showDesc(store, data,event)}>

            <span style="height:36px;display:inline-block;line-height:36px;width:50%;">
              <span  style="display:inline-block;width:auto;min-width:182px;margin:0 10px;" v-show={!node.label.parentId}>
                <icon-svg icon-class="firstCategory"  style="margin-right:6px;"></icon-svg>
                {node.label.name}
              </span>
              <span style="display:inline-block;width:auto;min-width:166px;margin:0 10px;" v-show={node.label.parentId}>
                <icon-svg icon-class="secondCategory" style="margin-right:6px;"></icon-svg>
                {node.label.name}
              </span>
            </span>

            <span style="height:34px;display:inline-block;vertical-align: top;padding-top: 4px;">
              <img src="/static/images/web_icon_add.png" alt="添加二级类目" title="添加二级类目" style="margin-left:20px;width:20px;height:20px;" v-show={!node.label.parentId} on-click={ ($event) => this.add(store, data,event) } />
              <img src="/static/images/web_icon_edit.png" alt="编辑一级类目" title="编辑一级类目" style="margin-left:20px;width:20px;height:20px;"v-show={!node.label.parentId} on-click={ ($event) => this.edit(store, data,event) } />
              <img src="/static/images/web_icon_del.png" alt="删除一级类目" title="删除一级类目" style="margin-left:20px;width:20px;height:20px;"v-show={!node.label.parentId} on-click={ ($event) => this.remove(store, data,event) } />


              <img src="/static/images/edit_gray.png" alt="编辑二级类目" title="编辑二级类目"  style="margin-left:12px;width:20px;height:20px;"v-show={node.label.parentId} on-click={ ($event) => this.edit(store, data,event) } />
              <img src="/static/images/del_gray.png" alt="删除二级类目" title="删除二级类目"  style="margin-left:20px;width:20px;height:20px;"v-show={node.label.parentId} on-click={ ($event) => this.remove(store, data,event) } />

            </span>

          </span>);
      }
  },
}

</script>

<style lang="scss">
  #categoryV2_vue{
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
   #categoryV2_desc{
    width:100%;
    height:400px;
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
