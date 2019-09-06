// pages/views/service-chart/service-chart.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId: 'service-chart',
    calendarShow: false,    //日历显示
    dateInfo: '',
    startDate: '',
    endDate: '',
    tableList: '',
    projectNumAll:0,         //项目合计个数
    projectMoneyAll: 0,       //项目合计应收
    projectGetMoneyAll: 0,     //项目合计实收
    projectNotReceiptsAll: 0,  //项目合计未收
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
      startDate: startDate,
      endDate: endDate
    });
    this.getBusinessFromApi();
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

    this.getBusinessFromApi();
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
 * 获取各业务员汇总统计表
 */
  getBusinessFromApi: function () {
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/business/?startDate=" + that.data.startDate + "&endDate=" + that.data.endDate,
      method: 'GET',
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {

          let projectNumAll = 0;         //项目合计个数
          let projectMoneyAll = 0;       //项目合计应收
          let projectGetMoneyAll = 0;     //项目合计实收
          let projectNotReceiptsAll = 0;  //项目合计未收
          for(let pdata of res.data){
            projectNumAll += pdata.projectNum;
            projectMoneyAll += pdata.projectMoney;
            projectGetMoneyAll += pdata.projectGetMoney;
            projectNotReceiptsAll += pdata.projectNotReceipts;
          }
          that.setData({
            tableList: res.data,
            projectNumAll: projectNumAll,
            projectMoneyAll: projectMoneyAll,
            projectGetMoneyAll: projectGetMoneyAll,
            projectNotReceiptsAll: projectNotReceiptsAll
          });
        }

      },
      fail: function (res) {

      }
    })
  },
})