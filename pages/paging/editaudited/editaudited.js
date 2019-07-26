// pages/paging/editaudited/editaudited.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p_no: '',
    ptwork:{},
    ptworkSelected:false,
    examineSelected:false,
    examineNote:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      p_no : options.p_no
    });
    this.getProjectinfo();
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
     * 获取项目基本信息
     */
  getProjectinfo: function () {
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/output/?projectNo=" + that.data.p_no,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            ptwork: res.data,
            examineNote: res.data.examineNote
          })
        }
      }
    });
  },
  /**
   * 查看项目基本信息
   */
  viewPtWorkEvent: function () {
    let selected = this.data.ptworkSelected;
    this.setData({
      ptworkSelected : !selected
    })
  },
  /**
   * 查看审定内容
   */
  viewNoteEvent:function(){
    let selected = this.data.examineSelected;
    this.setData({
      examineSelected: !selected
    })
  },
  /**
   * 返回事件
   */
  returnEvent:function(e){
    wx.navigateBack({
      detla:1
    });
  }
})