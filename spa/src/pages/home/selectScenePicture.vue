<template>
  <el-dialog title="选择图片" :visible.sync="selectDialogFormVisible" :before-close="handleClose">
    <div class="filter-container" style="overflow:hidden;">
      <el-input @keyup.enter.native="doSearch()" v-model="sceneListQuery.name" style="width: 200px !important;float:left;margin-right:12px;" class="filter-item" placeholder="输入图片名称">
      </el-input>

      <el-select @change="doSearch()" v-model="sceneListQuery.areaId" style="width:130px;float:left;margin-right:12px;" clearable filterable placeholder="请选择区域">
        <el-option
          v-for="item in roomAreas"
          :key="item.name"
          :label="item.name"
          :value="item.areaId">
        </el-option>
      </el-select>

      <el-select @change="doSearch()" v-model="sceneListQuery.styleId" style="width:130px;float:left;" clearable filterable placeholder="请选择风格">
        <el-option
          v-for="item in imageStyles"
          :key="item.name"
          :label="item.name"
          :value="item.styleId">
        </el-option>
      </el-select>

      <el-button @click="doSearch" class="filter-item" style="margin-left: 12px;float:left;" type="primary" v-waves icon="search">筛选</el-button>

    </div>

    <div class="gc-praiselist_content_list">
      <el-table
        v-loading="sceneListQuery.loading"
        element-loading-text="努力加载中..."
        ref="multipleTable"
        :data="sceneDataList"
        border
        style="width: 100%"
        @sort-change = "sortChange">
        <el-table-column type="index" align="center" label="序号" width="65">
        </el-table-column>
        <el-table-column
          sortable="custom"
          prop="viewCount"
          label="浏览量"
          align="center"
          vertical="middle">
        </el-table-column>
        <el-table-column
          prop="name"
          label="图片名称">
        </el-table-column>
        <el-table-column
          label="图片"
          align="center"
          width="120">
          <template scope="scope">
            <img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
          </template>
        </el-table-column>
        <el-table-column
          label="优先级"
          align="center">
          <template scope="scope">
            <span>{{scope.row.level}}级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="roomNames"
          label="区域"
          align="center">
        </el-table-column>
        <el-table-column
          prop="styleNames"
          label="风格"
          align="center">
        </el-table-column>
        <el-table-column
          prop="tagType"
          label="标签类型"
          align="center">
          <template scope="scope">
            <span v-if="scope.row.tagType == 1">无</span>
            <span v-if="scope.row.tagType == 2">点赞标签</span>
            <span v-if="scope.row.tagType == 3">混合标签</span>
            <span v-if="scope.row.tagType == 4">购买标签</span>
          </template>
        </el-table-column>
        <el-table-column
          label="首页"
          align="center">
          <template scope="scope">
            <span v-if="scope.row.toHome">上</span>
            <span v-else>下</span>
          </template>
        </el-table-column>

        <el-table-column  label="操作" align="center"  width="100">
          <template scope="scope">
            <el-button type="text" @click="onSelectedScene(scope.row)" size="small">选择</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div  class="pagination-container">
        <el-pagination @size-change="handleSizeChange" :current-page="sceneListQuery.pageIndex"
        @current-change="handleCurrentChange"  :page-sizes="[10,15,20,30]" :page-size="sceneListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="sceneListQuery.total">
        </el-pagination>
      </div>


    </div>
  </el-dialog>
</template>

<script>

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'

  export default {
    props: {
      selectDialogFormVisible: {
        type: Boolean,
        default: true
      }
    },

    directives: {
      waves
    },
    mounted: function () {
      this.findByPage();
      this.findRoomAreas();
      this.findImageStyles();
    },
    data() {
      return {
        sceneListQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 10,
          total: 0,
          areaId:"",
          styleId:"",
          keyword: "",
          column: "",
          order: "",
          putaway: true
        },
       sceneDataList: [],
       imageStyles:[],
       roomAreas:[],
      }
    },
    methods: {
      /**
       * 分页控件每页条数改变
       */
      handleSizeChange(val) {
        this.sceneListQuery.pageSize = val;
        this.findByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChange(val) {
        this.sceneListQuery.pageIndex = val;
        this.findByPage();
      },
      doSearch() {
        this.sceneListQuery.pageIndex = 1;
        this.findByPage();
      },
      findByPage (){
        console.log(this.sceneListQuery);
        this.sceneListQuery.loading = true;
        this.http.get(this).url(this.config.picture.list_url).params(this.sceneListQuery).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message ? response.data.message : "系统错误", type: 'error'});
              return;
            }
            console.log(response.data);
            this.sceneDataList = response.data.data.data;
            this.sceneListQuery.total = response.data.data.totalSize;
            this.sceneListQuery.loading = false;
          },
          (error) => {

          }
        );
      },

      findRoomAreas() {
        this.http.get(this).url(this.config.room_area.list_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.roomAreas = response.data.data;
            }, (err) => { });
      },
      findImageStyles() {
        this.http.get(this).url(this.config.image_style.list_url)
          .request(
            (response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.imageStyles = response.data.data;
            }, (err) => { });
      },
      sortChange(column) {
        this.sceneListQuery.column = column.prop;
        this.sceneListQuery.order = column.order;
        console.log(column);
        this.findByPage();
      },

      onSelectedScene(item) {
        this.$emit('onSelected', item);
      },

      handleClose(done) {
        done();
        this.close();
      },
      close() {
        this.$emit('cancel');
      }
    }

  }


</script>
