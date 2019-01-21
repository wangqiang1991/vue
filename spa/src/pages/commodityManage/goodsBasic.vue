<template>
  <div>
    <goodsList :listType="listType"></goodsList>
  </div>
</template>
<script>
  import goodsListV2 from './goodsListV2.vue'
  export default {
    data() {
      return {
        listType:1 
      }
    },
    components:{
      goodsList:goodsListV2
    },
    methods: {
     
    }
  };
</script>