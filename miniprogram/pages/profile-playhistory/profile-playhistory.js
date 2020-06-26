const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { openid } = app.globalData
    const history = wx.getStorageSync(openid)

    if (history.length === 0) {
      wx.showModal({
        title: '历史为空',
      })
    } else {
      wx.setStorageSync('musiclist', history)
      this.setData({
        musiclist: history,
      })
    }
  },
})
