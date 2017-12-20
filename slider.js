export default {
  props: {
    animated: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      index: 0,
      hide: false,
      show: false,
      prev: false,
      next: false
    }
  },
  computed: {
    totalDelay () {
      let delayVal = 0

      this.$children.map(
        (child) => {
          if (typeof child.delay === 'number') {
            let modifier = 2000

            if (child.fast) modifier /= 2
            if (child.slow) modifier *= 4
            if (this.$parent.fast) modifier /= 2
            if (this.$parent.slow) modifier *= 4

            delayVal = Math.max(delayVal, child.delay + modifier)
          }
        }
      )

      return delayVal
    }
  },
  mounted () {
    this.index = [...this.$parent.$children].indexOf(this)
    this.$parent.indicator.push(this.index)

    this.$on(
      'slide',
      (index) => {
        this.show = index === this.index
        this.prev = index > this.index
        this.next = index < this.index
      }
    )
  },
  render (createElement) {
    return createElement(
      'transition',
      {
        'props': {
          'name': 'slide'
        }
      },
      [
        createElement(
          'div',
          {
            'class': {
              'item': true,
              'prev left': this.prev && !this.animated,
              'next right': this.next && !this.animated,
              'active': this.show && !this.animated,
              'runEnter': this.show && this.animated,
              'runLeave': !this.show && this.animated,
              'item-animated': this.animated
            }
          },
          this.$slots.default
        )
      ]
    )
  }
}
