<template>
  <div>
    <iframe id="content" ref="content" width="100%" height="0" frameborder="0" scrolling="no"></iframe>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      };
    },
    mounted() {

    },
    methods: {
      loadContent(articleId) {
        this.$refs.content.src="/editor/show.html?articleId=" + articleId;
        var counter = 0;
        var upHeight = 0;
        // 监控高度并设置
        var w = setInterval(() => {
          var h = $(this.$refs.content.contentWindow.document).height();
          $(this.$refs.content).height(h);
          if (h != 0 && h == upHeight) {
            console.log("高度不变,计数加一")
            counter ++;
          }
          if (counter > 60) {
            console.log("满足条件释放setInterval")
            clearInterval(w);
           
          }
          upHeight = h;
        }, 500);

      }
    }

  }
</script>
