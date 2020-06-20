// miniprogram/pages/playlist/playlist.js
const MAX_LIMIT = 15

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperImageUrls: [
      {
        url:
          'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url:
          'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url:
          'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      },
    ],
    playlist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this._getPlaylist()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    this.setData({
      playlist: [],
    })
    await this._getPlaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this._getPlaylist()
  },
  // 获取歌单列表
  _getPlaylist: async function () {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      const res = await wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'playlist',
          start: this.data.playlist.length,
          count: MAX_LIMIT,
        },
      })
      wx.stopPullDownRefresh({
        complete: res => {},
      })
      wx.hideLoading({
        complete: res => {},
      })
      this.setData({
        playlist: this.data.playlist.concat(res.result.data),
      })
    } catch (err) {
      wx.stopPullDownRefresh({
        complete: res => {},
      })
      wx.hideLoading({
        complete: res => {},
      })
      wx.showToast({
        title: '加载失败',
        icon: 'none',
      })
      console.log(err)
    }
  },
})
