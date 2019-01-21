<template>

  <el-tabs v-model="activeName"  @tab-click="handleClick">

      <el-tab-pane label="未发布" name="1">
        <homeBannerItem :status="1" @success="loadData" ref="notPublish"></homeBannerItem>
      </el-tab-pane>

      <el-tab-pane label="已发布" name="2">
        <homeBannerItem :status="2" @success="loadData" ref="hasPublish"></homeBannerItem>
      </el-tab-pane>


  </el-tabs>   

</template>

<script>
  import homeBannerItem from "./homeBannerItem.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      homeBannerItem:homeBannerItem
    },
    methods:{
      loadData(){
        this.activeName = "1";
        this.$refs.notPublish.loadData();
      },
      handleClick(tab, event) {
        if(this.activeName == "1"){
          this.$refs.notPublish.loadData();
        }else if (this.activeName == "2") {
          this.$refs.hasPublish.loadData();
        }
      }
    }
  }
</script>