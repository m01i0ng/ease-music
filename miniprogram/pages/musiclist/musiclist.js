// pages/musiclist/musiclist.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { playlistId } = options
    try {
      const res = await wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'musiclist',
          playlistId,
        },
      })
      const { playlist } = res.result
      this.setData({
        musiclist: playlist.tracks,
        listInfo: {
          coverImgUrl: playlist.coverImgUrl,
          name: playlist.name,
        },
      })
      await this._setMusiclist()
    } catch (err) {
      wx.showToast({
        title: '加载失败',
        icon: 'none',
      })
      console.log(err)
    }
  },
  async _setMusiclist() {
    await wx.setStorage({
      data: this.data.musiclist,
      key: 'musiclist',
    })
  },
})
