// pages/views/project-management/project-management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId:'project-management',
    calendarShow: false,    //日历显示
    startDate: '', //开始日期
    endDate:'' ,// 结束日期
    setStartflag: false, //设置开始日期标志
    dateInfo:'',
    stages: ['项目立项',
      '项目安排',
      '项目作业',
      '质量检查',
      '产值核算',
      '项目审定',
      '财务操作',
      '项目处理',
      '已审定  '],  //阶段选择
    stageID : 0
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

  /**
   * 设置开始时间
   */
  setStartDateEvent:function(){
    var startDate = this.data.startDate;
    this.setData({
      calendarShow:true,
      setStartflag: true,
      dateInfo: startDate
    })
  },

  /**
   * 设置结束时间
   */
  setEndDateEvent: function () {
    var endDate = this.data.endDate;
    this.setData({
      calendarShow: true,
      setStartflag: false,
      dateInfo: endDate
    })
  },
  StateChangeEvent: function(e){
    this.setData({
      stageID: e.detail.value,

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

    if (e.type == 'setEvent' && this.data.setStartflag){
      this.setData({
        startDate: e.detail.dateInfo,
        calendarShow: false
      })
    }

    if (e.type == 'setEvent' && !(this.data.setStartflag)) {
      this.setData({
        endDate: e.detail.dateInfo,
        calendarShow: false
      })
    }
  }

})