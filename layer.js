export default {
  props: {
    'animation': {
      'type': String,
      'default': 'slide:up'
    },
    'delay': {
      'type': Number,
      'default': 0
    },
    'fast': {
      'type': Boolean,
      'default': false
    },
    'slow': {
      'type': Boolean,
      'default': false
    },
    'left': {
      'type': Number,
      'default': 0
    },
    'top': {
      'type': Number,
      'default': 0
    },
    'rotate': {
      'type': Number,
      'default': 0
    },
    'scale': {
      'type': Number,
      'default': 1
    },
    'counterClockwise': {
      'type': Boolean,
      'default': false
    }
  },
  data () {
    return {
      childHeight: 0,
      childWidth: 0
    }
  },
  computed: {
    calcLeft () {
      if (!this.$parent.animated) return this.left
      if (this.$parent.show) return this.left

      let movement = this.left
      let splitAnimation = this.animation.split(',')

      for (let index = 0; index < splitAnimation.length; index++) {
        let animationValue = splitAnimation[index].trim().split(':')

        if (animationValue[0].search(/slide/i) >= 0) {
          if (animationValue[1].search(/left/i) >= 0) movement = 100
          if (animationValue[1].search(/right/i) >= 0) movement = this.childWidth * -1
        }
      }

      return movement * this.calcScale
    },
    calcTop () {
      if (!this.$parent.animated) return this.top
      if (this.$parent.show) return this.top

      let movement = this.top
      let splitAnimation = this.animation.split(',')

      for (let index = 0; index < splitAnimation.length; index++) {
        let animationValue = splitAnimation[index].trim().split(':')

        if (animationValue[0].search(/slide/i) >= 0) {
          if (animationValue[1].search(/up/i) >= 0) movement = 100
          if (animationValue[1].search(/down/i) >= 0) movement = this.childHeight * -1
        }
      }

      return movement * this.calcScale
    },
    calcRotation () {
      if (!this.$parent.animated) return this.rotate * (this.counterClockwise ? -1 : 1)
      if (this.$parent.show) return this.rotate * (this.counterClockwise ? -1 : 1)

      let movement = this.rotate
      let splitAnimation = this.animation.split(',')

      for (let index = 0; index < splitAnimation.length; index++) {
        let animationValue = splitAnimation[index].trim().split(':')

        if (animationValue[0].search(/rotate/i) >= 0) {
          movement = parseFloat(animationValue[1].replace(/[^0-9-.]+/i, ''))
        }
      }

      return movement * (this.counterClockwise ? -1 : 1)
    },
    calcScale () {
      if (!this.$parent.animated) return this.scale
      if (this.$parent.show) return this.scale

      let movement = this.scale
      let splitAnimation = this.animation.split(',')

      for (let index = 0; index < splitAnimation.length; index++) {
        let animationValue = splitAnimation[index].trim().split(':')

        if (animationValue[0].search(/scale/i) >= 0) {
          if (animationValue[1].search(/up/i) >= 0) movement = 1.0 / parseFloat(animationValue[1].replace(/[^0-9.]+/i, ''))
          if (animationValue[1].search(/down/i) >= 0) movement = parseFloat(animationValue[1].replace(/[^0-9.]+/i, ''))
        }
      }

      return movement
    },
    calcOrigin () {
      return (this.childWidth / 2) + 'px ' + (this.childHeight / 2) + 'px 0px'
    },
    calcDelay () {
      if (!this.$parent.animated) return '0ms'
      if (this.$parent.show) return this.delay + 'ms'

      return '0ms'
    }
  },
  ready () {
    for (let index = 0; index < this.$el.childNodes.length; index++) {
      let element = this.$el.childNodes[index]
      if (typeof element.offsetHeight !== 'undefined') {
        this.childHeight += element.offsetHeight + element.offsetTop
        this.childWidth += element.offsetWidth + element.offsetLeft
      }
    }
  },
  render (createElement) {
    return createElement(
      'div',
      {
        'class': {
          'layer-slide': true,
          'transition-fast': this.fast,
          'transition-slow': this.slow
        },
        'style': {
          'transform': 'translate3d(' + this.calcLeft + '%, ' + this.calcTop + '%, 0) rotate(' + this.calcRotation + 'deg) scale(' + this.calcScale + ')',
          'transition-delay': this.calcDelay,
          'transform-origin': this.calcOrigin
        }
      },
      [
        createElement('div')
      ]
    )
  }
}
