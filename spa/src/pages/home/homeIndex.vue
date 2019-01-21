<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;'>
      <el-tab-pane label="集赞优选">
        <keep-alive>
          <praise-goods-index></praise-goods-index>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane  label="空间搭配">
        <keep-alive>
          <space-index></space-index>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane  label="期刊">
        <keep-alive>
          <subject-index></subject-index>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane  label="软装案例">
        <keep-alive>
          <HomePlanItem></HomePlanItem>
        </keep-alive>
      </el-tab-pane>

      <el-tab-pane  label="热卖商品">
        <keep-alive>
          <hotGoodsItem></hotGoodsItem>
        </keep-alive>
      </el-tab-pane>


    </el-tabs>


  </div>
</template>

<script>

  import praiseGoodsIndex from './praiseGoodsIndex'
  import SpaceIndex from '../space/spaceIndex.vue'
  import SubjectIndex from '../subject/subjectIndex.vue'
  import homePlanItem from './homePlanItem.vue'
  import hotGoodsItem from './hotGoodsItem.vue'
  export default {
    components: {
      praiseGoodsIndex,
      SpaceIndex,
      SubjectIndex,
      HomePlanItem:homePlanItem,
      hotGoodsItem:hotGoodsItem
    }
  }


</script>
