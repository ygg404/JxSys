// pages/views/project-management/project-management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId:'project-management',
    calendarShow: false,    //日历显示
    startDate: '', //开始日期
    endDate:'' // 结束日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  calendarShowEvent:function(){
    this.setData({
      calendarShow:true
    })
  },

  CalendarEvent:function(e){
    console.log(e);
    //关闭日历控件
    if (e.type == 'showEvent'){
      this.setData({
        calendarShow: e.detail.showCalendar
      })
    }
  }

})