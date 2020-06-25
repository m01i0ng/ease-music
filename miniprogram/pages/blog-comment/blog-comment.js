const { formatTime } = require('../../utils/util')

// pages/blog-comment/blog-comment.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    comment: [],
    blogId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { blogId } = options

    this.setData({
      blogId,
    })
    this._getBlogDetail()
  },
  onShareAppMessage: function (event) {
    const { blog, blogId } = this.data
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogId}`,
    }
  },
  async _getBlogDetail() {
    const { blogId } = this.data
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    try {
      const res = await wx.cloud.callFunction({
        name: 'blog',
        data: {
          $url: 'detail',
          blogId,
        },
      })
      await wx.hideLoading()

      const { detail, comment } = res.result

      detail.createTime = formatTime(new Date(detail.createTime))
      const newComment = comment.map(item => {
        item.createTime = formatTime(new Date(item.createTime))
        return item
      })

      this.setData({
        blog: detail,
        comment: newComment,
      })
    } catch (err) {
      console.error(err)
      wx.hideLoading()
    }
  },
})
