<template>
  <el-dialog title="选择商品" :visible.sync="selectDialogFormVisible" :before-close="handleClose">
    <div style="margin-bottom:10px; text-align:left;">
      <el-input @keyup.enter.native="keyEvent()" v-model="goodsQuery.keyword" style="width: 200px;" class="filter-item" placeholder="输入名称或编号">
      </el-input>
      <el-button @click="doSeachreGoods" class="filter-item" style="margin-left: 12px;" type="primary" v-waves
                 icon="search">搜索
      </el-button>
    </div>
    <el-table v-if="!multiple" :data="goodsList" @selection-change="handleSelectionChange" style="width: 100%" border>
      <el-table-column prop="goods" label="商品封面" align="center" vertical="middle" width="120">
        <template scope="scope">
          <img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="商品名称">

      </el-table-column>

      <el-table-column prop="goodsNumber" label="商品编号">
      </el-table-column>
      <el-table-column label="选择" width="80">
        <template scope="scope">
          <el-button type="text" @click="onSelectedGoods(scope.row)" size="small">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-if="multiple" :data="goodsList" @selection-change="handleSelectionChange" style="width: 100%" border>
      <el-table-column prop="goods" label="商品封面" align="center" vertical="middle" width="120">
        <template scope="scope">
          <img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="商品名称">
      </el-table-column>
      <el-table-column prop="goodsNumber" label="商品编号">
      </el-table-column>
      <el-table-column type="selection" width="55">
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChangeByGoods" :current-page="goodsQuery.pageIndex"
      @current-change="handleCurrentChangeByGoods"
                     :page-sizes="[10,15,20,30]" :page-size="goodsQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="goodsQuery.total">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer" v-if="multiple">
      <el-button @click="selectDialogFormVisible = false; close()">取 消</el-button>
      <el-button  type="primary" @click="confirmSelectedGoods">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    props: {
      selectDialogFormVisible: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        goodsQuery: {
          loading: false,
          pageIndex: 1,
          pageSize: 15,
          total: 0,
          keyword: null
        },
        goodsList: [],
        selectedTempGoods: null,
        selectedGoods: []
      }
    },
    mounted: function () {
      this.findGoodsByPage();
    },
    methods: {
      delSelectedGoods(goods) {
        this.selectedGoods.splice(this.selectedGoods.indexOf(goods), 1);
      },
      handleSelectionChange(val) {
        this.selectedTempGoods = val;
      },
      doSeachreGoods() {
        this.selectedTempGoods = null;
        this.goodsQuery.pageIndex = 1;
        this.findGoodsByPage();
      },
      findGoodsByPage() {
        var params = {
          pageSize: this.goodsQuery.pageSize,
          pageIndex: this.goodsQuery.pageIndex,
          keyword: this.goodsQuery.keyword,
          goodsStatus: 3,
        };
        this.http.get(this).url(this.config.goods.list_url_v2).params(params).request(
          (response) => {
            if (response.data.code != 0) {
              this.$message({message: response.data.message, type: 'error'});
              return;
            }

            this.goodsList = response.data.data.data;
            this.goodsQuery.total = response.data.data.totalSize;
          },
          (error) => {
          }
        );
      },
      /**
       * 分页控件每页条数改变
       */
      handleSizeChangeByGoods(val) {
        this.goodsQuery.pageSize = val;
        this.findGoodsByPage();
      },
      /**
       * 分页控件页码改变
       */
      handleCurrentChangeByGoods(val) {
        this.goodsQuery.pageIndex = val;
        this.findGoodsByPage();
      },
      confirmSelectedGoods() {
        if (this.selectedTempGoods && this.selectedTempGoods.length > 0) {
          this.selectedTempGoods.forEach((item) => {
            if (!this.isSelectedGoods(item)) {
              this.selectedGoods.push(item);
            }
          });
        }
        this.$emit('onSelected', this.selectedGoods);
      },
      isSelectedGoods(item) {
        let selected = false;
        this.selectedGoods.forEach((goods) => {
          if (item.goodsId === goods.goodsId) {
            selected = true;
            return true;
          }
        });
        return selected;
      },
      onSelectedGoods(goods) {
        this.$emit('onSelected', goods);
      },
      handleClose(done) {
        done();
        this.close();
      },
      close() {
        this.$emit('cancel');
      },
      keyEvent() {
        this.doSeachreGoods();
      }
    }
  }
</script>
