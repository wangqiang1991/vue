<template>
  <div :style="{height:height+'px',zIndex:zIndex}">
    <div :class="className" :style="{top:stickyTop+'px',zIndex:zIndex,position:position,width:width,height:height+'px'}">
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 999
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      active: false,
      position: '',
      currentTop: '',
      width: 'auto',
      height: undefined,
      child: null,
      stickyHeight: 0

    }
  },
  methods: {
    sticky() {
      if (this.active) {
        return
      }
      this.position = 'fixed'
      this.active = true
      if (this.width != 0) {
        this.width = this.width + 'px'
      }
      console.log(this.width)
    },
    reset() {
      if (!this.active) {
        return
      }
      this.position = ''
      this.width = 'auto'
      this.active = false
    },
    handleScroll() {
      var w = this.$el.getBoundingClientRect().width;
      if (w != 0) {
        this.width = w;
      }
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop != 0) {
        if (offsetTop <= this.stickyTop) {
          this.sticky()
          return
        }
      }
      this.reset()
    }
  },
  mounted() {
    this.height = 50;//this.$el.getBoundingClientRect().height
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
