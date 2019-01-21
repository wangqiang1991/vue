<template>
  <mt-tabbar id='menu_vue'>
    <mt-tab-item id="gc" @click.native="link('gc')" :class="{'active':gcimg==true}">
      <img slot="icon" v-if='gcimg' src="../assets/img/tabbars_icon_goochao_select.png">
      <img slot="icon" v-else src="../assets/img/tabbars_icon_goochao_default.png">
      构巢
    </mt-tab-item>
    <mt-tab-item id="sc" @click.native="link('sc')" :class="{'active':scimg==true}">
      <img slot="icon" v-if='scimg' src="../assets/img/tabbars_icon_shop_select.png">
      <img slot="icon" v-else src="../assets/img/tabbars_icon_shop_default.png">
       商城
    </mt-tab-item>
    <mt-tab-item id="img" @click.native="link('img')" :class="{'active':imgimg==true}">
      <img slot="icon" v-if='imgimg' src="../assets/img/tabbar_icon_discover_select.png">
      <img slot="icon" v-else src="../assets/img/tabbar_icon_discover_default.png">
      发现
    </mt-tab-item>
    <mt-tab-item id="my" @click.native="link('my')" :class="{'active':myimg==true}">
      <img slot="icon" v-if='myimg' src="../assets/img/tabbars_icon_personal_select.png">
      <img slot="icon" v-else src="../assets/img/tabbars_icon_personal_default.png">
      我的
    </mt-tab-item>
  </mt-tabbar>
</template>


<script>
export default {
  name: 'menu',
  props:['thisChoice'],
  data () {
    return {
      gcimg:false,
      scimg:false,
      imgimg:false,
      myimg:false,

    }
  },
  mounted:function(){
    if(this.thisChoice=='gc'){
      this.gcimg = true;
    }
    if(this.thisChoice=='sc'){
      this.scimg = true;
    }
    if(this.thisChoice=='img'){
      this.imgimg = true;
    }
    if(this.thisChoice=='my'){
      this.myimg = true;
    }
  },
  methods:{
    link:function (e) {
      if(e=='gc'){
        // 保存当前滚动位置,下次刷新恢复该位置
        if (!this.gcimg) {
          this.keep.scroll.save();
          this.$emit("setCache")
          this.$emit("cacheCategory")
          this.keep.go("/index.html", true, null, true);
        }
      }
      if(e=='sc'){
        // 保存当前滚动位置,下次刷新恢复该位置
        if(!this.scimg){
          this.keep.scroll.save();
          this.$emit("setCache")
          this.$emit("cacheCategory")
          this.keep.go("/category2.html", true, null, true);
        } 
      }
      if(e=='img'){
        if(!this.imgimg){
          this.keep.scroll.save();
          this.$emit("setCache")
          this.$emit("cacheCategory")
          this.keep.go("/scene_list.html", true, null, true);
        }
      }
      if(e=='my'){
        if(!this.myimg){
          this.keep.scroll.save();
          this.$emit("setCache");
          this.$emit("cacheCategory")
          this.keep.go("/personal_center.html", true, null, true);
        }
      }
    }
  }
}
</script>


<style  lang="scss">
   @import '../assets/scss/menu.scss';
</style>
