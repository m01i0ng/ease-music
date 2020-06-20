// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Object,
    },
  },
  // 数据监听器
  observers: {
    ['list.playCount'](count) {
      this.setData({
        count: this._tranNumber(count, 2),
      })
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tranNumber(num, point) {
      const numStr = num.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        const decimal = numStr.substring(
          numStr.length - 4,
          numStr.length - 4 + point
        )
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
      } else if (numStr.length > 8) {
        const decimal = numStr.substring(
          numStr.length - 8,
          numStr.length - 8 + point
        )
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
      }
    },
    goToMusiclist() {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.list.id}`,
      })
    },
  },
})
