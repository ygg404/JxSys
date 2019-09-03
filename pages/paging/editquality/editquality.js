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
    addBackShow:false,
    ptwork:{},
    backList:[],  //返修记录
    cshortcutList:[], //质量检查
    cNameList:[],
    cindex:0,
    qshortcutList: [], //质量综述
    qShortShow: false, 
    bshortcutList: [], //返修短语
    bNameList: [],
    bindex: 0,
    backNote: ''  //提交返修短语
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
    this.getBackListInfo();
    this.wxValidateInit();
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
        qualityNote: {
          required: true,
        },
        qualityScore: {
          required: true,
        }
      }
      , {
        qualityNote: {
          required: '请填写质量综述',
        },
        qualityScore: {
          required: '请填写质量评分',
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
          for (let shortcut of res.data) {
            shortcut.checked = false;
          }
          that.setData({
            qshortcutList: res.data,
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
    this.setData({
      qShortShow: true
    })
  },
  /**
  * 质量综述快捷输入多选改变
  */
  qShortCheckEvent: function (e) {
    let qList = this.data.qshortcutList;
    for (let qshort of qList) {
      if (e.detail.value.indexOf(qshort.id.toString()) != -1) {
        qshort.checked = true;
      } else {
        qshort.checked = false;
      }
    }
    this.setData({
      qshortcutList: qList
    })
  },
  /**
     * 质量综述快捷输入取消
     */
  returnQshortEvent: function (e) {
    this.setData({
      qShortShow: false
    })
  },
  /**
   *  质量综述快捷输入确定
   */
  setQshortEvent: function (e) {
    let qDetail = this.data.projectDetail;
    let qualityNote = '';
    for (let execute of this.data.qshortcutList) {
      if (execute.checked) {
        qualityNote += execute.shortNote + ';';
      }
    }
    this.setData({
      qualityNote: qualityNote,
      qShortShow: false
    });
  },


  /**
   * 获取返修记录
   */
  getBackListInfo:function(){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/back/?projectNo=" + that.data.p_no + "&groupId=" + that.data.p_group,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        console.log(res.data)
        if (res.statusCode == 201) {
          that.setData({
            backList: res.data
          })
        }
      }
    });
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
            ptwork: res.data,
            qualityScore: res.data.qualityScore,
            qualityNote: res.data.qualityNote
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
   * 查看返修记录
   */
  viewBackEvent:function(e){
    let selected = this.data.backSelected;
    this.setData({
      backSelected: !selected
    })
  },
  /**
   * 返回
   */
  returnEvent:function(e){
    wx.navigateBack({
      detla:1
    });
  },
  /**
  * 保存项目
  */
  formSubmit: function (e) {
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      wx.showToast({
        title: `${error.msg} `,
        image: '/images/warn.png',
        duration: 2000
      })
      return false;
    }
    var that = this;
    //提交
    wx.request({
      method: 'POST',
      url: app.globalData.WebUrl + 'projectQuality/update/',
      header: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        checkSuggestion: null,
        groupId: that.data.p_group,
        projectNo: that.data.p_no,
        qualityNote: e.detail.value.qualityNote,
        qualityScore: e.detail.value.qualityScore,
        userAccount: app.globalData.userInfo.username
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if(e.detail.target.id == 'post'){
            that.postToQuality()
          }else{
            utils.TipModel('提示', res.data.message);
          }
        }
      }
    });
  },

  /**
   * 提交质量核算
   */
  postToQuality:function(){
    var that = this;
    //提交
    wx.request({
      method: 'POST',
      url: app.globalData.WebUrl + 'project/stage/',
      header: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        projectNo: that.data.p_no,
        projectStage: 5
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
  },
  //质量评分
  qualityScoreLoadEvent:function(e){
    wx.navigateTo({
      url: '../addQualityScore/addQualityScore?p_no=' + this.data.p_no,
    })
  },
  /**
   * 添加退回返修
   */
  addEvent:function(e){
    this.setData({
      addBackShow:true
    });
  },
  /**
   * 返修短语更改
   */
  bshortChangeEvent:function(e){
    this.setData({
      bindex : e.detail.value
    });
    let backNote = ''
    if(e.detail.value != 0){
      backNote = this.data.bNameList[this.data.bindex];
    }
    this.setData({
      backNote: backNote
    });
  },
  /**
   * 返修短语填写
   */
  backNoteEvent:function(e){
    this.setData({
      backNote: e.detail.value
    });
  },
  /**
   * 返修回退
   */
  backReturnEvent:function(e){
    this.setData({
      addBackShow: false
    });
  },
  /**
   * 提交
   */
  postBackEvent:function(e){
    if (this.data.backNote == ''){
      utils.TipModel('错误', '请填写返修意见',0);
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/back/",
      method: 'post',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      data:{
        backNote: that.data.backNote,
        groupId: that.data.p_group,
        projectNo: that.data.p_no
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.postToWork();
        }
      }
    });
  },
  /**
   *提交至项目作业
   */
  postToWork:function(e){
    let groupsId =[];
    groupsId.push(this.data.p_group);
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/stage/",
      method: 'post',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      data: {
        groupsId: groupsId,
        projectNo: that.data.p_no,
        projectStage: 3
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