<template>
  <div class="app-container calendar-list-container">

    <el-table :data="dataList" v-loading="loading" element-loading-text="努力加载中..." border fit highlight-current-row
              style="width: 100%">
      <el-table-column prop="goods" label="商品" align="center" vertical="middle" width="120">
        <template scope="scope">
          <img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200"
               class="gc_praiselist_list_img">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称">
        <template scope="scope">
          <span class="link-type">{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsNumber" label="商品编码" align="center">
        <template scope="scope">
          <span>{{scope.row.goodsNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="praiseCount" label="点赞数" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

  import waves from '@/directive/waves/index.js' // 水波纹指令
  import {parseTime} from '@/utils'
  import config from '@/commons/config'
  import {Loading} from 'element-ui'

  export default {
    data() {
      return {
        loading: false,
        space: null,
        dataList: []
      }
    },
    methods: {
      loadSource(space) {
        this.space = space;
        this.findAllPraiseGoods();
      },

      findAllPraiseGoods() {
        this.loading = true;
        this.http.get(this).url(config.space.praise_goods_url).restful({
          spaceId: this.space.spaceId
        }).request(function (response) {
          this.loading = false;
          if (response.data.code == 0) {
            this.dataList = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }

        }, function (error) {
          this.loading = false;
          this.$message.error(error);
        });
      }

    }
  }

</script>
