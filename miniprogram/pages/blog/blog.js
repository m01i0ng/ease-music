let keyword = ''

Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    blogList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList: [],
    })
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  async _loadBlogList(start = 0) {
    wx.showLoading({
      title: '加载中...',
    })
    const { blogList } = this.data
    const res = await wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'list',
        start,
        count: 10,
        keyword,
      },
    })
    await wx.hideLoading()
    await wx.stopPullDownRefresh()
    this.setData({
      blogList: blogList.concat(res.result),
    })
  },

  async onPublish() {
    try {
      const settingRes = await wx.getSetting()
      if (settingRes.authSetting['scope.userInfo']) {
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
    } catch (err) {
      console.error(err)
    }
  },
  onLoginSuccess(event) {
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
  goComment(event) {
    const { blogid: blogId } = event.target.dataset
    wx.navigateTo({
      url: `../../pages/blog-comment/blog-comment?blogId=${blogId}`,
    })
  },
  onSearch(event) {
    this.setData({
      blogList: [],
    })
    keyword = event.detail.keyword
    this._loadBlogList()
  },
})
