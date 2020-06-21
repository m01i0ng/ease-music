// components/musiclist/musiclist.js
const app = getApp()

Component({
  properties: {
    list: {
      type: Array,
    },
  },
  data: {
    playingId: -1,
  },
  pageLifetimes: {
    show() {
      this.setData({
        playingId: app.getPlayingMusicId(),
      })
    },
  },
  methods: {
    onSelect(event) {
      const { id, index } = event.currentTarget.dataset
      this.setData({
        playingId: id,
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${id}&index=${index}`,
      })
    },
  },
})
