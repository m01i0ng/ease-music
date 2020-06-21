// components/pregress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
let currentSec = '0'
let duration = 0

// 进度条是否在拖拽
let isMoving = false

const backgroundAudioManager = wx.getBackgroundAudioManager()

Component({
  properties: {},
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00',
    },
    movableDistance: 0,
    progress: 0,
  },
  lifetimes: {
    ready() {
      this._getMovableDistance()
      this._bindBGMEvent()
    },
  },
  methods: {
    onChange(event) {
      if (event.detail.source === 'touch') {
        this.data.progress =
          (event.detail.x / (movableAreaWidth - movableViewWidth)) * 100
        this.data.movableDistance = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd() {
      const formattedCurrentTime = this._dateFormat(
        Math.floor(backgroundAudioManager.currentTime)
      )
      this.setData({
        progress: this.data.progress,
        movableDistance: this.data.movableDistance,
        ['showTime.currentTime']: `${formattedCurrentTime.min}:${formattedCurrentTime.sec}`,
      })
      backgroundAudioManager.seek((duration * this.data.progress) / 100)
      isMoving = false
    },
    _getMovableDistance() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false
      })

      backgroundAudioManager.onStop(() => {})

      backgroundAudioManager.onPause(() => {})

      backgroundAudioManager.onWaiting(() => {})

      backgroundAudioManager.onCanplay(() => {
        if (typeof backgroundAudioManager.duration !== 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      backgroundAudioManager.onTimeUpdate(() => {
        if (!isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const sec = currentTime.toString().split('.')[0]
          if (sec !== currentSec) {
            const formattedCurrentTime = this._dateFormat(currentTime)
            this.setData({
              movableDistance:
                ((movableAreaWidth - movableViewWidth) * currentTime) /
                duration,
              progress: (currentTime / duration) * 100,
              ['showTime.currentTime']: `${formattedCurrentTime.min}:${formattedCurrentTime.sec}`,
            })
            currentSec = sec
          }
        }
      })

      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })

      backgroundAudioManager.onError(res => {
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },
    _setTime() {
      duration = backgroundAudioManager.duration
      const formatedDuration = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${formatedDuration.min}:${formatedDuration.sec}`,
      })
    },
    _dateFormat(sec) {
      const min = Math.floor(sec / 60)
        .toString()
        .padStart(2, '0')
      sec = Math.floor(sec % 60)
        .toString()
        .padStart(2, '0')
      return {
        min,
        sec,
      }
    },
  },
})
