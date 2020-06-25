import { formatTime } from '../../utils/util'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type: Object,
    },
  },
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: formatTime(new Date(val)),
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event) {
      const { src, imgs } = event.target.dataset
      wx.previewImage({
        urls: imgs,
        current: src,
      })
    },
  },
})
