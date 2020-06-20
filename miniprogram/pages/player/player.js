// pages/player/player.js
let musiclist = []
let playingIndex = 0

const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { musicId, index } = options
    playingIndex = index
    musiclist = wx.getStorageSync('musiclist')
    await this._loadMusicDetail(musicId)
  },
  async _loadMusicDetail(musicId) {
    const music = musiclist[playingIndex]
    backgroundAudioManager.pause()
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
    })

    wx.showLoading({
      title: '加载中...',
    })

    const res = await wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musicUrl',
        musicId,
      },
    })
    backgroundAudioManager.src = res.result.data[0].url
    backgroundAudioManager.title = music.name
    backgroundAudioManager.coverImgUrl = music.al.picUrl
    backgroundAudioManager.singer = music.ar[0].name
    backgroundAudioManager.epname = music.al.name

    this.setData({
      isPlaying: true,
    })

    wx.hideLoading({
      complete: res => {},
    })
  },
  togglePlaying() {
    const { isPlaying } = this.data
    if (isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !isPlaying,
    })
  },
  onPrev() {
    playingIndex--
    if (playingIndex < 0) {
      playingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[playingIndex].id)
  },
  onNext() {
    playingIndex++
    if (playingIndex === musiclist.length) {
      playingIndex = 0
    }
    this._loadMusicDetail(musiclist[playingIndex].id)
  },
})
