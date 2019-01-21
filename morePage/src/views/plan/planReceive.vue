<template>
  <div id="planReceive_vue">

    <div  v-if="!allData || !allData.length" style="width:100%;background:white;padding:1rem 0;">
      <img src="../../assets/img/no_plan _data.png"  style="display:block;margin:auto;width:1.1rem;height:1.1rem;" />
      <p style="font-size:0.16rem;color:#ddd;text-align:center;">你还没有关注软装方案哦</p>
    </div>

    <div v-else class="plan_item" v-for="plan in allData">
        <img v-lazy="plan.cover" @click="gotoPlanDetail(plan)">
        <p class="title">{{plan.planName}}</p>
        <p class="house">{{plan.houseTypeName}} | {{plan.style.name}}</p>
    </div>

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>

  </div>
</template>

<script>
  
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
  
  export default {
    name: 'planReceive',
    components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
    data() {
      return {
        loadFailed:false,
        firstLoad:true,
        allData:[]
      }
    },
    created() {
      document.title = "我领取&关注的软装方案";
    },
    mounted: function() {
   
    if (this.keep.isKeepAlive()) {
      this.firstLoad = false;
      this.allData = this.keep.cache.get("planData",[]);
      this.keep.markNotKeepAlive();
      this.$nextTick(() => {
        this.keep.scroll.recoverAndClear();
      });
    } else {
      this.keep.cache.remove("planData");
      this.firstLoad = true;
      this.laodData();
    }
    
    },
    methods: {
      reload(){
        this.loadFailed = false;
        this.laodData();
      },
      gotoPlanDetail(plan) {
        this.keep.scroll.save();
        this.keep.go("/plan_detail.html",true,{planId:plan.planId,showGoHome:'1'});
      },
      laodData() {
        this.http.get(this).url(this.config.plan.list_url).request((res) => {
          this.firstLoad = false;
          if(res.data.code != 0){
            return ;
          }
          let data = res.data.data;
          this.allData = data;
          this.keep.cache.push("planData", data);
          },(err)=>{ 
          this.loadFailed = true;  
          this.firstLoad = false;}
        ) 
      },
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/planReceive.scss';
</style>
