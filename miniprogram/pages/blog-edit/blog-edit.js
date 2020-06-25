// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140
const MAX_IMG_NUM = 9
let content = ''
let userInfo = {}
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
  },

  onInput(event) {
    const {
      detail: { value },
    } = event
    content += value
    let wordsNum = value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为 ${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum,
    })
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },
  footerBottom() {
    const { images } = this.data
    wx.chooseImage({
      count: MAX_IMG_NUM - images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      complete: res => {
        this.setData({
          images: images.concat(res.tempFilePaths),
        })
        this.setData({
          selectPhoto:
            MAX_IMG_NUM - this.data.images.length <= 0 ? false : true,
        })
      },
    })
  },
  onDeleteImage(event) {
    const { index } = event.target.dataset
    const { images } = this.data
    images.splice(index, 1)
    this.setData({
      images,
    })
    if (images.length === MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  onPreviewImage(event) {
    const { src } = event.target.dataset

    wx.previewImage({
      urls: this.data.images,
      current: src,
    })
  },
  async send() {
    if (!content.trim()) {
      wx.showModal({
        title: '请输入内容',
      })
      return
    }

    wx.showLoading({
      title: '发布中...',
      mask: true,
    })

    const { images } = this.data
    const fileIds = []
    const promises = []
    images.forEach(image => {
      const p = new Promise(async (resolve, reject) => {
        try {
          const ext = /\.\w+$/.exec(image)[0]
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath: `blog/${Date.now()}-${Math.random() * 10000000}${ext}`,
            filePath: image,
          })
          fileIds.push(uploadRes.fileID)
          resolve()
        } catch (err) {
          console.error(err)
          reject()
        }
      })
      promises.push(p)
    })

    try {
      await Promise.all(promises)
      await db.collection('blog').add({
        data: {
          content,
          img: fileIds,
          ...userInfo,
          createTime: db.serverDate(),
        },
      })
      await wx.hideLoading()
      await wx.showToast({
        title: '发布成功',
        icon: 'success',
      })
      await wx.navigateBack()
      // 数据刷新
      const pages = getCurrentPages()
      console.log(pages)
      const prevPage = pages[0]
      prevPage.onPullDownRefresh()
    } catch (err) {
      console.error(err)
      wx.hideLoading({
        complete: res => {},
      })
      wx.showToast({
        title: '发布失败',
      })
    }
  },
})
