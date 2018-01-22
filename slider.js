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
    let self = this
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
              'prev left': self.prev && !self.animated,
              'next right': self.next && !self.animated,
              'active': self.show && !self.animated,
              'runEnter': self.show && self.animated,
              'runLeave': !self.show && self.animated,
              'item-animated': self.animated
            }
          },
          self.$slots.default
        )
      ]
    )
  }
}
