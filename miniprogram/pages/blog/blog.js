// miniprogram/pages/blog/blog.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  async onPublish() {
    wx.getSetting({
      complete: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            complete: res => {
              this.onLoginSuccess({
                detail: res.userInfo,
              })
            },
          })
        } else {
          this.setData({
            modalShow: true,
          })
        }
      },
    })
  },
  onLoginSuccess(event) {
    console.log('success')
    const {
      detail: { nickName, avatarUrl },
    } = event
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${nickName}&avatarurl=${avatarUrl}`,
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '授权失败',
    })
  },
})
