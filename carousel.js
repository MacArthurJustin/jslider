export default {
  computed: {
    timeOffset () {
      let childOffset = 0

      for (let index = 0; index < this.$children.length; index++) {
        if (typeof this.$children[index].totalDelay === 'number') {
          let childTime = this.$children[index].totalDelay
          if (childTime > childOffset) childOffset = childTime
        }
      }

      return childOffset
    },
    slider () {
      return this.$refs.inner.querySelectorAll('.item')
    }
  },
  data () {
    return {
      indicator: [],
      activeIndex: -1,
      isAnimating: false,
      intervalID: null,
      active: false
    }
  },
  methods: {
    nextClick () {
      this.activeIndex + 1 < this.slider.length ? this.activeIndex += 1 : this.activeIndex = 0
    },
    prevClick () {
      this.activeIndex === 0 ? this.activeIndex = this.slider.length - 1 : this.activeIndex -= 1
    },
    handleIndicatorClick (index) {
      this.activeIndex = index
      this.active = false
      this.intervalManager(false)
    },
    StartSlideShow () {
      this.active = true
      this.intervalManager(true, this.nextClick, this.interval + this.timeOffset)
    },
    PauseSlideShow () {
      this.active = false
      this.intervalManager(false)
    },
    intervalManager (flag, func, time) {
      flag ? this.intervalID = window.setInterval(func, time) : window.clearInterval(this.intervalID)
    }
  },
  mounted () {
    this.active = !!this.slideShow
    if (this.active) this.intervalManager(true, this.nextClick, this.interval + this.timeOffset)

    this.$nextTick(() => { this.activeIndex = 0 })
  },
  props: {
    'indicators': {
      'type': Boolean,
      'default': false
    },
    'playPause': {
      'type': Boolean,
      'default': false
    },
    'infinite': {
      'type': Boolean,
      'default': false
    },
    'bootstrap': {
      'type': Boolean,
      'default': false
    },
    'controls': {
      'type': Boolean,
      'default': false
    },
    'fast': {
      'type': Boolean,
      'default': false
    },
    'slow': {
      'type': Boolean,
      'default': false
    },
    'interval': {
      'type': Number,
      'default': 5000
    },
    'height': {
      'type': Number,
      'default': 500
    },
    'slideShow': {
      'type': Boolean,
      'default': false
    }
  },
  render (createElement) {
    var self = this
    let childElements = []

    if (self.indicators || self.playPause) {
      let olChildren = []

      if (self.playPause) {
        olChildren.push(
          createElement(
            'li',
            {
              'class': {
                'carousel-slideshow-control': true,
                'running': self.active
              },
              on: {
                click (event) {
                  self.StartSlideShow()
                }
              }
            },
            [
              createElement(
                'i',
                {
                  'class': {
                    'play-button': true
                  }
                }
              )
            ]
          )
        )
      }

      if (self.indicators) {
        self.indicator.map(
          (item, index) => {
            olChildren.push(
              createElement(
                'li',
                {
                  'class': {
                    'active': index === self.activeIndex
                  },
                  on: {
                    click (event) {
                      self.handleIndicatorClick(index)
                    }
                  }
                },
                []
              )
            )
          }
        )
      }

      if (self.playPause) {
        olChildren.push(
          createElement(
            'li',
            {
              'class': {
                'carousel-slideshow-control': true,
                'running': !self.active
              },
              on: {
                click (event) {
                  self.PauseSlideshow()
                }
              }
            },
            [
              createElement(
                'i',
                {
                  'class': {
                    'pause-button': true
                  }
                }
              )
            ]
          )
        )
      }

      childElements.push(
        createElement(
          'ol',
          {
            'class': {
              'carousel-indicators': true
            }
          },
          olChildren
        )
      )
    }

    childElements.push(
      createElement(
        'div',
        {
          'class': {
            'container': self.bootstrap
          }
        },
        [
          createElement(
            'div',
            {
              'class': {
                'carousel-inner': true
              },
              'style': {
                'height': self.height + 'px'
              },
              'attrs': {
                'role': 'listbox'
              },
              'ref': 'inner'
            },
            self.$slots.default
          )
        ]
      )
    )

    if (self.show) {
      childElements.push(
        createElement(
          'a',
          {
            'class': {
              'left carousel-control': true
            },
            on: {
              click (event) {
                self.prevClick()
              }
            }
          },
          [
            createElement(
              'span',
              {
                'class': {
                  'glyphicon glyphicon-chevron-left': true
                },
                'attrs': {
                  'aria-hidden': 'true'
                }
              }
            ),
            createElement(
              'span',
              {
                'class': {
                  'sr-only': true
                }
              },
              'Previous'
            )
          ]
        )
      )
      childElements.push(
        createElement(
          'a',
          {
            'class': {
              'right carousel-control': true
            },
            on: {
              click (event) {
                self.nextClick()
              }
            }
          },
          [
            createElement(
              'span',
              {
                'class': {
                  'glyphicon glyphicon-chevron-right': true
                },
                'attrs': {
                  'aria-hidden': 'true'
                }
              }
            ),
            createElement(
              'span',
              {
                'class': {
                  'sr-only': true
                }
              },
              'Next'
            )
          ]
        )
      )
    }

    return createElement(
      'div',
      {
        'class': {
          'carousel slide': true,
          'animate-fast': self.fast,
          'animate-slow': self.slow
        },
        'style': {
          'height': self.height + 'px',
          'position': 'relative'
        },
        'ref': 'carousel'
      },
      childElements
    )
  },
  watch: {
    activeIndex (value) {
      this.$children.forEach(
        (child) => child.$emit('slide', value)
      )
    }
  }
}
