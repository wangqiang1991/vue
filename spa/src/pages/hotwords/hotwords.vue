<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;'>
      <el-tab-pane label="可用热词">
        <keep-alive>
          <enable-pane>

          </enable-pane>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane  label="停用热词">
        <keep-alive>
          <disable-pane></disable-pane>
        </keep-alive>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>

  import enablePane from './enablePane.vue';
  import disablePane from './disablePane.vue';

  export default {
    components: {
      enablePane,
      disablePane
    }
  }

</script>


<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
