<template>

  <el-tabs v-model="activeName"  @tab-click="handleClick">

      <el-tab-pane label="未发布" name="1">
        <activities :activityStatus="1" ref="activitiesUp" @added="goUnpublish()"></activities>
      </el-tab-pane>

      <el-tab-pane label="已发布" name="2">
        <activities :activityStatus="2" ref="activitiesPub" @added="goUnpublish()"></activities>
      </el-tab-pane>

      <el-tab-pane label="已结束" name="3">
        <activities :activityStatus="3" ref="activitiesEnd" @added="goUnpublish()"></activities>
      </el-tab-pane>

  </el-tabs>

</template>

<script>
  import activities from "./activities.vue"
  export default{
    data() {
      return{
        activeName:"1"
      }
    },
    components:{
      activities:activities
    },
    methods:{
      loadData() {
        console.log(12)
        this.activeName = "1";
        // this.$refs.financialAudit.loadData();
      },
      handleClick(tab, event) {
        if(this.activeName == "1") {
          this.$refs.activitiesUp.findByPage();
        } else if (this.activeName == "2") {
          this.$refs.activitiesPub.findByPage();
        } else if (this.activeName == "3") {
          this.$refs.activitiesEnd.findByPage();
        }
      },
      goUnpublish() {
        this.activeName = "1";
        this.$refs.activitiesUp.findByPage();
      }
    }
  }
</script>
