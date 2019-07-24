// pages/paging/editquality/editquality.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ptworkSelected:false,
    backSelected:false,
    ptwork:{},
    cshortcutList:[], //质量检查
    cNameList:[],
    cindex:0,
    qshortcutList: [], //质量综述
    qNameList: [],
    qindex: 0,
    bshortcutList: [], //返修短语
    bNameList: [],
    bindex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      p_no:options.p_no,
      p_group:options.p_group
    })
    this.getProjectinfo();
    this.getShortCutList();
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
     * 表单验证的初始化函数
     */
  wxValidateInit: function () {
    this.WxValidate = app.wxValidate(
      {
        disclosureNote: {
          required: true,
        },
        checkSuggestion: {
          required: true,
        },
        dataName: {
          required: true,
        },
        briefSummary: {
          required: true,
        },
        workLoad: {
          required: true,
        }
      }
      , {
        disclosureNote: {
          required: '请填写技术交底',
        },
        checkSuggestion: {
          required: '请填写过程检查',
        },
        dataName: {
          required: '请填写上交资料',
        },
        briefSummary: {
          required: '请填写工作小结',
        },
        workLoad: {
          required: '请填写工作量',
        }
      }
    )
  },

  /**
   * 获取快捷短语
   */
  getShortCutList: function () {
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "shortcut/9/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let nameList = ['质量检查快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            cshortcutList: res.data,
            cNameList: nameList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.WebUrl + "shortcut/10/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let nameList = ['质量综述快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            qshortcutList: res.data,
            qNameList: nameList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.WebUrl + "shortcut/12/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let nameList = ['返修短语快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            bshortcutList: res.data,
            bNameList: nameList
          })
        }
      }
    });

  },

  /**
   *质量综述 
   */
  qshortChangeEvent:function(e){
    let qualityNote = e.detail.value == 0 ? '' : this.data.qNameList[e.detail.value];
    this.setData({
      qindex: e.detail.value,
      qualityNote: qualityNote
    })
  },
  /**
   * 获取项目基本信息
   */
  getProjectinfo: function () {
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "projectData/?projectNo=" + that.data.p_no ,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          that.setData({
            ptwork: res.data
            // disclosureNote: res.data.disclosureNote,
            // checkSuggestion: res.data.checkSuggestion,
            // dataName: res.data.dataName,
            // briefSummary: res.data.briefSummary,
            // workLoad: res.data.workLoad
          })
        }
      }
    });
  },
  /**
   * 质量评分
   */
  qualityScoreEvent:function(e){
    let score = e.detail.value;
    if(score > 100){
      utils.TipModel("错误", "评分不能超过100",1);
      score = 100;
    }
    this.setData({
      qualityScore:score
    })
  },
  /**
   *查看项目基本信息事件
   */
  viewPtWorkEvent: function (e) {
    let selected = this.data.ptworkSelected;
    this.setData({
      ptworkSelected: !selected
    })
  },
  /**
   * 退回返修
   */
  returnEvent:function(e){
    wx.navigateBack({
      detla:1
    });
  },
})