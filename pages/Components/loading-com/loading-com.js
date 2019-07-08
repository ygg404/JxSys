// pages/Components/loading-com/loading-com.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loadtxt:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadtxt:"加载中"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoadingEvent: function (e) {
      this.setData({
        loadtxt: e.detail.loadtxt
      })
    }
  }
})
