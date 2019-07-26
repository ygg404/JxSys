// pages/paging/editauthorize/editauthorize.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    p_no:'',
    ptwork:{},
    ptworkSelected:false,
    examineNoteEvent: '' //审定意见
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      p_no: options.p_no
    });
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
    this.getProjectinfo();
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
   * 查看项目信息
   */
  viewPtWorkEvent:function(e){
    let selected = this.data.ptworkSelected;
    this.setData({
      ptworkSelected : !selected
    });
  },

  /**
   * 审定意见
   */
  examineNoteEvent:function(e){
    this.setData({
      examineNote : e.detail.value
    })
  },
  /**
   * 返回
   */
  returnEvnet: function(e){
    wx.navigateBack({
      detla:1
    })
  },
  /**
   * 保存
   */
  saveEvent: function(e){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "projectSetUp/",
      method: 'PUT',
      data:{
        examineNote: that.data.examineNote,
        projectNo: that.data.p_no
      },
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.TipModel('提示', res.data.message);
        }
      }
    });
  },
  /**
   * 审定完成
   */
  postEvent:function(e){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "projectSetUp/",
      method: 'PUT',
      data: {
        examineNote: that.data.examineNote,
        projectNo: that.data.p_no
      },
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.postAuthorizeStage();
        }
      }
    });

  },
  /**
   * 提交至已审定
   */
  postAuthorizeStage:function(){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/stage/",
      method: 'post',
      data: {
        projectNo: that.data.p_no,
        projectStage: 9
      },
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.TipModel('提示', res.data.message);
          wx.navigateBack({
            detla:1
          })
        }
      }
    });
  }
})