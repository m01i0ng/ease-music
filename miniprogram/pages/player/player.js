// pages/player/player.js
let musiclist = []
let playingIndex = 0

const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false,
    lyric: '暂无歌词',
    isSame: false,
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
    if (Number(musicId) === app.getPlayingMusicId()) {
      this.setData({
        isSame: true,
      })
    } else {
      this.setData({
        isSame: false,
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }

    const music = musiclist[playingIndex]

    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
    })

    app.setPlayingMusicId(musicId)

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

    if (!res.result.data[0].url) {
      wx.showToast({
        title: '无法播放',
      })
      return
    }

    if (!this.data.isSame) {
      backgroundAudioManager.src = res.result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name

      this.savePlayHistory()
    }

    this.setData({
      isPlaying: true,
    })

    wx.hideLoading({
      complete: res => {},
    })

    const lyricRes = await wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'lyric',
        musicId,
      },
    })
    this.setData({
      lyric: lyricRes.result.lrc.lyric,
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
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow,
    })
  },
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  onPlay() {
    this.setData({
      isPlaying: true,
    })
  },
  onPause() {
    this.setData({
      isPlaying: false,
    })
  },
  savePlayHistory() {
    const music = musiclist[playingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)

    const exist = history.some(h => h.id === music.id)
    if (!exist) {
      history.unshift(music)
      wx.setStorageSync(openid, history)
    }
  },
})
