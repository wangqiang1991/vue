<template>
<div>
  <p>修改页面</p>
  <p>{{prop}}</p>
</div>
</template>

<script>
  export default {
    props:['thisChoice'],
    data() {
       return {
          user:'',
          pwd:'',
          tip:'',
          prop:0
      }
    },
    mounted :function(){
      //console.log(this.user == '')
     //this.prop =  this.$store.getters.getApp;
     //let data =  this.$store.getters.getData;
     //console.log(data[0].age)
     console.log(this.thisChoice == true)
    }
  }
</script>

<style>
  
 
</style>