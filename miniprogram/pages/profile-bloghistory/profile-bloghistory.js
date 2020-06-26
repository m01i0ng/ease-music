// pages/profile-bloghistory/profile-bloghistory.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    blogList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getList()
  },

  onReachBottom: function () {
    this._getList()
  },

  onShareAppMessage: function (event) {
    const { blog } = event.target.dataset
    const { content, _id: id } = blog

    return {
      title: content,
      path: `/pages/blog-comment/blog-comment?blogId=${id}`,
    }
  },

  async _getList() {
    await wx.showLoading({
      title: '加载中',
    })

    const { blogList } = this.data

    try {
      const res = await wx.cloud.callFunction({
        name: 'blog',
        data: {
          $url: 'my',
          start: blogList.length,
          count: 10,
        },
      })

      this.setData({
        blogList: blogList.concat(res.result),
      })

      await wx.hideLoading()
    } catch (err) {
      console.error(err)
      await wx.showToast({
        title: '获取失败',
      })
      await wx.hideLoading()
    }
  },
  async goComment(event) {
    const { blogid } = event.target.dataset
    await wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${blogid}`,
    })
  },
})
