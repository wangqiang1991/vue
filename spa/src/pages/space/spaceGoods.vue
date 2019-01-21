<template>
  <el-dialog title="空间商品" :visible.sync="spaceGoodsFormVisible" :before-close="handleClose">
    <div class="tab-container">
      <el-tabs>
        <el-tab-pane label="购买商品">
          <sell-goods ref="sell_goods"></sell-goods>
        </el-tab-pane>
        <el-tab-pane label="集赞热词">
          <praise-goods ref="praise_goods"></praise-goods>
        </el-tab-pane>

      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
  import SellGoods from './sellGoods.vue';
  import PraiseGoods from './praiseGoods.vue';

  export default {
    props: {
      spaceGoodsFormVisible: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        space: null
      }
    },
    components: {
      SellGoods,
      PraiseGoods
    },
    methods: {
      loadSource(space) {
        this.space = space;
        setTimeout(()=> {
          this.$refs.sell_goods.loadSource(this.space);
          this.$refs.praise_goods.loadSource(this.space);
        },200);
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
