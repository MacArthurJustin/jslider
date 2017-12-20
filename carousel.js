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
    let childElements = []

    if (this.indicators || this.playPause) {
      let olChildren = []

      if (this.playPause) {
        olChildren.push(
          createElement(
            'li',
            {
              'class': {
                'carousel-slideshow-control': true,
                'running': this.active
              },
              on: {
                click: this.StartSlideShow
              }
            },
            [
              createElement(
                'i',
                {
                  'class': {
                    'glyphicon': true,
                    'glyphicon-play': true
                  }
                }
              )
            ]
          )
        )
      }

      if (this.indicators) {
        this.indicator.map(
          (item, index) => {
            olChildren.push(
              createElement(
                'li',
                {
                  'class': {
                    'active': index === this.activeIndex
                  },
                  on: {
                    click (event) {
                      this.handleIndicatorClick(index)
                    }
                  }
                },
                []
              )
            )
          }
        )
      }

      if (this.playPause) {
        olChildren.push(
          createElement(
            'li',
            {
              'class': {
                'carousel-slideshow-control': true,
                'running': !this.active
              },
              on: {
                click: this.PauseSlideshow
              }
            },
            [
              createElement(
                'i',
                {
                  'class': {
                    'glyphicon': true,
                    'glyphicon-pause': true
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
            'container': this.bootstrap
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
                'height': this.height + 'px'
              },
              'attrs': {
                'role': 'listbox'
              },
              'ref': 'inner'
            },
            this.$slots.default
          )
        ]
      )
    )

    if (this.show) {
      childElements.push(
        createElement(
          'a',
          {
            'class': {
              'left carousel-control': true
            },
            on: {
              click: this.prevClick
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
              click: this.nextClick
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
          'slide': true,
          'animate-fast': this.fast,
          'animate-slow': this.slow
        },
        'style': {
          'height': this.height + 'px',
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
