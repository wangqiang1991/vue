<template>
  <div>
    <inventoryItem :type="type"></inventoryItem>
  </div>
</template>

<script>
  import inventoryItem from './inventoryItem.vue'
  export default {
    data() {
      return {
        type:2
      }
    },
    components:{
      inventoryItem:inventoryItem
    }
  };
</script>