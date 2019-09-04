// pages/views/collect-chart/collect-chart.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId: 'collect-chart',
    calendarShow: false,    //日历显示
    dateInfo: '',
    startDate:'',
    endDate:'',
    tableList:'',
    projectSum:0,
    outPutNumSum:0
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
    let curdate = new Date();
    let predate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    let endDate = utils.formatDate(curdate);
    let startDate = utils.formatDate(predate);
    
    this.setData({
      startDate : startDate,
      endDate : endDate
    });
    this.getAllOutputFromApi();
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
   * 日历事件
   */
  CalendarEvent: function (e) {
    console.log(e);
    //关闭日历控件
    if (e.type == 'showEvent') {
      this.setData({
        calendarShow: e.detail.showCalendar
      })
      return;
    }

    if (e.type == 'setEvent' && this.data.setStartflag) {
      var startDate = this.data.startDate;
      startDate = e.detail.dateInfo;
      this.setData({
        startDate: startDate,
        calendarShow: false
      })
    }

    if (e.type == 'setEvent' && !(this.data.setStartflag)) {
      var endDate = this.data.endDate;
      endDate = e.detail.dateInfo;
      this.setData({
        endDate: endDate,
        calendarShow: false
      })
    }

    this.getAllOutputFromApi();
  },

  /**
 * 设置开始时间
 */
  setStartDateEvent: function () {
    var startDate = this.data.startDate;
    this.setData({
      calendarShow: true,
      setStartflag: true,
      dateInfo: startDate
    });
    
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
    });
    
  },

  /**
 * 各部门项目产值列表
 */
  getAllOutputFromApi: function () {
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "outputs/?startDate=" + that.data.startDate + "&endDate=" + that.data.endDate,
      method: 'GET',
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          let outPutNumSum = 0;
          let projectSum = 0;
          for(let dat of res.data){
            outPutNumSum += dat.outPutNum;
            projectSum += dat.projectSum;
          }
          that.setData({
            tableList: res.data,
            outPutNumSum: outPutNumSum,
            projectSum: projectSum
          });
        }

      },
      fail: function (res) {

      }
    })
  },
})