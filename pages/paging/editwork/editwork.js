// paging/editwork/editwork.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tshortcutList:[],
    tshortcut: '',//技术底快捷短语
    tindex:0,
    tName:[],
    pshortcutList: [],
    pshortcut: [], //过程快捷短语
    pindex: 0,
    pName: [],
    ishortcutList: [],
    ishortcut: [], //资料快捷短语
    iindex: 0,
    iName: [],
    wshortcutList: [],
    wshortcut: [], //工作小结快捷短语
    windex: 0,
    wName: [],
    ashortcutList: [],
    ashortcut: [], //工作量快捷短语
    aindex: 0,
    aName: [],
    p_no:'',
    p_group:'',
    p_name:'',
    scheduleList:[], //进度列表
    schedSelected:false,
    ptwork:{},  //项目信息
    ptworkSelected:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      p_no: options.p_no,
      p_group: options.p_group,
      p_name: options.p_name
    })
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
   * 获取快捷短语
   */
  getShortCutList: function () {
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "shortcut/5/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          let nameList = [];
          for(let shortcut of res.data){
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            tshortcutList : res.data,
            tName: nameList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.WebUrl + "shortcut/6/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          let nameList = [];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            pshortcutList: res.data,
            pName: nameList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.WebUrl + "shortcut/7/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          let nameList = [];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            ishortcutList: res.data,
            iName: nameList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.WebUrl + "shortcut/8/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          let nameList = [];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            wshortcutList: res.data,
            wName: nameList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.WebUrl + "shortcut/11/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          let nameList = [];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            ashortcutList: res.data,
            aName: nameList
          })
        }
      }
    });
  },
  /**
   * 获取项目基本信息
   */
  getProjectinfo:function(){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "ptWork/?projectNo=" + that.data.p_no + "&groupId=" + that.data.p_group,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          ;
        }
      }
    });
  },
  /**
 * 获取项目进度信息
 */
  getScheduleinfo: function () {
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/schedule/" + that.data.p_no + "/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {

        }
      }
    });
  },
  /**
   *查看项目基本信息事件
   */
  viewPtWorkEvent:function(e){
    let selected = this.data.ptworkSelected;
    this.setData({
      ptworkSelected: !selected
    })
  },
  /**
 *查看进度信息事件
 */
  viewScheduleEvent: function (e) {
    let selected = this.data.schedSelected;
    this.setData({
      schedSelected: !selected
    })
  },
})