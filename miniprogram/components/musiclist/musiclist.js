// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      const { id } = event.currentTarget.dataset
      this.setData({
        playingId: id,
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${id}`,
      })
    },
  },
})
