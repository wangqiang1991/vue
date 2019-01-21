<template>
  <div id="loading_vue" v-show="dataload">
    <div id="loademoreimg"  class="loademoreimg" style="text-align: center;">
      <mt-spinner type="triple-bounce" color="#333333" :size='30'></mt-spinner>
    </div>
  </div>
</template>

<script>
export default{
  props:['dataload'],
  data(){
    return {
      
    }
  },
  mounted(){
     $('#loading_vue').css({'height': document.documentElement.clientHeight})
  }
} 


</script>


<style lang='scss'>
  #loading_vue{
    position:absolute;
    top:0; left:0;
    width:3.75rem; height:6.03rem;
    z-index:999;

  #loademoreimg{
    position:absolute;
    top:50%; left:0;
    margin-top:-0.25rem;
    width:100%; height:0.5rem;
  }
  #loademoreimg div{
    width:0.5rem;
    margin:auto;
    height:0.5rem;
    display:flex;
    align-items: center;
  }
}


</style>