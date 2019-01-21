<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加</el-button>
    </div>

    <el-table :data="dataList" v-loading="listQuery.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="65">
      </el-table-column>

      <el-table-column label="区域名称" >
        <template scope="scope">
          <span >{{scope.row.name}}</span>
        </template>
      </el-table-column>

     <!--  <el-table-column align="center" label="排序" width="100" prop="sort">
      </el-table-column>
 -->
      <el-table-column align="center" label="操作" width="270">
        <template scope="scope">
          <el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
          </el-button>
          <el-button size="small" icon="d-caret" type="info" @click="onSort(scope.row)">排序</el-button>
          <el-button icon="delete" size="small" type="danger" @click="deleteRoom(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加 -->
    <el-dialog :title="title" :visible.sync="addDialogFormVisible">
      <el-form class="small-space" :model="room" label-position="left" label-width="100px" style='width: 550px; margin-left:50px;'>
        <el-form-item label="区域名称">
          <el-input v-model="room.name" placeholder="请输入区域名称"></el-input>
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
        <el-form-item label="区域名称">
          <span>{{currentRoom.name}}</span>
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
        currentRoom:{},
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
        room: {name:""},
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
      onSort(room) {
				this.currentRoom = room;
				this.sortValue = room.sort;
				this.dialogFormVisible=true;
			},
      confirmSort() {
				this.listQuery.loading = true;
				this.http.post(this).url(this.config.room_area.sort_url).params({
					areaId: this.currentRoom.areaId,
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
					}, (err) => { });
			},
      deleteRoom(room) {
        this.$confirm('是否要删除区域"' + room.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.delete(this).url(this.config.room_area.delete_url).restful({areaId:room.areaId})
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
        this.room = {name:""};
      },

      handleCreate() {
        this.resetEditProvider();
        this.title = "添加区域";
        this.addDialogFormVisible = true;
      },
      /**
       * 查询
       */
      findAll() {
        this.http.get(this).url(this.config.room_area.list_url).request(
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
        if (!this.room.name || !this.room.name.trim()) {
          this.$message({message: '区域名称不能为空', type: 'warning'});
          return;
        }

        console.log(this.room);

        this.http.postJson(this).url(this.config.room_area.save_url).params(this.room).request(
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
      onEdit(room) {
        this.resetEditProvider();
        this.title = "编辑区域";
        this.room = jQuery.extend({}, room);
        this.addDialogFormVisible = true;
      }
    }
  }

</script>
