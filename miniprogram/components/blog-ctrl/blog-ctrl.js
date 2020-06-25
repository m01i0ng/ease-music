let userInfo = {}

const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: {
      type: String,
    },
    blog: {
      type: Object,
    },
  },

  externalClasses: ['iconfont', 'icon-comment', 'icon-share'],

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modalShow: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async onComment(event) {
      try {
        const settingRes = await wx.getSetting()
        if (settingRes.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            complete: res => {
              userInfo = res.userInfo
              this.setData({
                modalShow: true,
              })
            },
          })
        } else {
          this.setData({
            loginShow: true,
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    onLoginSuccess(event) {
      userInfo = event.detail
      this.setData(
        {
          loginShow: false,
        },
        () => {
          this.setData({
            modalShow: true,
          })
        }
      )
    },
    onLoginFail() {
      wx.showModal({
        title: '授权失败',
      })
    },
    async onSend(event) {
      const { formId } = event.detail
      const { content } = event.detail.value
      const { blogId } = this.properties

      if (!content.trim()) {
        wx.showModal({
          title: '评论内容不能为空',
        })
        return
      }

      wx.showLoading({
        title: '发布中',
        mask: true,
      })

      const { nickName, avatarUrl } = userInfo

      try {
        await db.collection('comment').add({
          data: {
            content,
            createTime: db.serverDate(),
            blogId,
            nickName,
            avatarUrl,
          },
        })

        try {
          const res = await wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              content,
              formId,
              blogId,
            },
          })
          console.log(res)
        } catch (err) {
          console.error(err)
        }

        await wx.hideLoading()
        await wx.showToast({
          title: '发布成功',
        })
        this.setData({
          modalShow: false,
          content: '',
        })

        this.triggerEvent('refreshComment')
      } catch (err) {
        console.error(err)
        await wx.hideLoading()
        await wx.showToast({
          title: err.message,
        })
      }
    },
  },
})
