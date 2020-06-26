// miniprogram/pages/profile/profile.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  async onTapQrCode() {
    wx.showLoading({
      title: '正在生成',
    })
    try {
      const res = await wx.cloud.callFunction({
        name: 'getQrCode',
      })

      await wx.hideLoading()

      const fileId = res.result
      await wx.previewImage({
        urls: [fileId],
        current: fileId,
      })
    } catch (err) {
      await wx.hideLoading()
      await wx.showToast({
        title: '生成失败',
      })
      console.error(err)
    }
  },
})
