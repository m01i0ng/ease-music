// components/lyric/lyric.js
let lyricHeight = 0

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: {
      type: String,
    },
  },
  observers: {
    lyric(lrc) {
      if (lrc === '暂无歌词') {
        this.setData({
          lrcList: [
            {
              time: 0,
              lrc,
            },
          ],
          nowLyricIndex: -1,
        })
      } else {
        this._parseLyric(lrc)
      }
    },
  },
  data: {
    lrcList: [],
    nowLyricIndex: 0,
    scrollTop: 0,
  },
  lifetimes: {
    ready() {
      wx.getSystemInfo({
        complete: res => {
          lyricHeight = (res.screenWidth / 750) * 64
        },
      })
    },
  },
  methods: {
    update(currentTime) {
      const { lrcList } = this.data

      if (lrcList.length === 0) return
      if (currentTime > lrcList[lrcList.length - 1]) {
        if (this.data.nowLyricIndex !== -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight,
          })
        }
      }
      for (let i = 0; i < lrcList.length; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight,
          })
          break
        }
      }
    },
    _parseLyric(lyricStr) {
      const lines = lyricStr.split('\n')
      const lrcList = []
      lines.forEach(line => {
        const time = line.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time) {
          const lrc = line.split(time)[1]
          const timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          const sec =
            parseInt(timeReg[1]) * 60 +
            parseInt(timeReg[2]) +
            parseInt(timeReg[3]) / 1000
          lrcList.push({
            lrc,
            time: sec,
          })
        }
      })
      this.setData({
        lrcList,
      })
    },
  },
})
