//app.js
App({
  onLaunch: function () {
    this.checkUpdate()

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'songdon-display-71ptx',
        traceUser: true,
      })
    }

    this.getOpenid()

    this.globalData = {
      playingMusicId: -1,
      openid: '',
    }
  },
  setPlayingMusicId(musicId) {
    this.globalData.playingMusicId = Number(musicId)
  },
  getPlayingMusicId() {
    return this.globalData.playingMusicId
  },
  async getOpenid() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'login',
      })

      const { openid } = res.result
      this.globalData.openid = openid

      if (!wx.getStorageSync(openid)) {
        wx.setStorageSync(openid, [])
      }
    } catch (err) {
      console.error(err)
    }
  },
  checkUpdate() {
    const updateManager = wx.getUpdateManager()()
    updateManager.checkUpdate(res => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已下载，是否重启更新',
            success: res => {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            },
          })
        })
      }
    })
  },
})
