// paging/editwork/editwork.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tshortcutList:[],
    tshortcut: '',//技术交底内容快捷输入
    tindex:0,
    tNameList:[],
    pshortcutList: [],
    pshortcut: [], //过程快捷输入
    pindex: 0,
    pNameList: [],
    ishortcutList: [],
    ishortcut: [], //资料快捷输入
    iindex: 0,
    iNameList: [],
    wshortcutList: [],
    wshortcut: [], //工作小结快捷输入
    windex: 0,
    wNameList: [],
    ashortcutList: [],
    ashortcut: [], //工作量快捷输入
    aindex: 0,
    aNameList: [],
    p_no:'',
    p_group:'',
    p_name:'',
    scheduleList:[], //进度列表
    schedSelected:false,
    ptwork:{},  //项目信息
    ptworkSelected:false,
    addScheduleShow:false, //添加进度
    projectNote:'',  //进度内容
    projectRate:0    //当前进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      p_no: options.p_no,
      p_group: options.p_group,
      p_name: options.p_name
    });
    this.getProjectinfo();
    this.getShortCutList();
    this.wxValidateInit();
    this.getScheduleInfo();
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
      url: app.globalData.WebUrl + "shortcut/5/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let nameList = ['技术交底内容快捷输入'];
          for(let shortcut of res.data){
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            tshortcutList : res.data,
            tNameList: nameList
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
        if (res.statusCode == 200) {
          let nameList = ['过程检查意见快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            pshortcutList: res.data,
            pNameList: nameList
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
        if (res.statusCode == 200) {
          let nameList = ['上交资料快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            ishortcutList: res.data,
            iNameList: nameList
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
        if (res.statusCode == 200) {
          let nameList = ['工作小结快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            wshortcutList: res.data,
            wNameList: nameList
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
        if (res.statusCode == 200) {
          let nameList = ['工作量快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            ashortcutList: res.data,
            aNameList: nameList
          })
        }
      }
    });
  },
  /**
   * 技术交底快捷输入
   */
  tshortChangeEvent:function(e){
    let disclosureNote = e.detail.value==0?'':this.data.tNameList[e.detail.value];
    this.setData({
      tindex:e.detail.value,
      disclosureNote: disclosureNote
    })
  },
  /**
   * 过程检查意见快捷输入
   */
  pshortChangeEvent: function (e) {
    let checkSuggestion = e.detail.value == 0 ? '' : this.data.pNameList[e.detail.value];
    this.setData({
      pindex: e.detail.value,
      checkSuggestion: checkSuggestion
    })
  },
  /**
 * 上交资料快捷输入
 */
  ishortChangeEvent: function (e) {
    let dataName = e.detail.value == 0 ? '' : this.data.iNameList[e.detail.value];
    this.setData({
      pindex: e.detail.value,
      dataName: dataName
    })
  },
  /**
* 工作小结快捷输入
*/
  wshortChangeEvent: function (e) {
    let briefSummary = e.detail.value == 0 ? '' : this.data.wNameList[e.detail.value];
    this.setData({
      windex: e.detail.value,
      briefSummary: briefSummary
    })
  },
  /**
* 工作量快捷输入
*/
  ashortChangeEvent: function (e) {
    let workLoad = e.detail.value == 0 ? '' : this.data.aNameList[e.detail.value];
    this.setData({
      aindex: e.detail.value,
      workLoad: workLoad
    })
  },
  /**
   * 获取项目基本信息
   */
  getProjectinfo:function(){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "projectWork/?projectNo=" + that.data.p_no + "&groupId=" + that.data.p_group,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          that.setData({
            ptwork : res.data,
            disclosureNote: res.data.disclosureNote,
            checkSuggestion: res.data.checkSuggestion,
            dataName: res.data.dataName,
            briefSummary: res.data.briefSummary,
            workLoad: res.data.workLoad
          })
        }
      }
    });
  },
  /**
 * 获取项目进度信息
 */
  getScheduleInfo: function () {
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/schedule/" + that.data.p_no + "/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          that.setData({
            scheduleList: res.data
          })
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
  /**
   * 返回事件 
   */
  returnEvent:function(e){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 保存事件
   */
  formSubmit:function(e){
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
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
      url: app.globalData.WebUrl + 'projectWork/update/',
      header: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        briefSummary: e.detail.value.briefSummary,
        checkSuggestion: e.detail.value.checkSuggestion,
        dataName: e.detail.value.dataName,
        disclosureNote: e.detail.value.disclosureNote,
        workLoad: e.detail.value.workLoad,
        finishDateTime: that.data.ptwork.finishDateTime,
        groupId: that.data.p_group,
        projectNo: that.data.p_no,
        
      },
      success: function (res) {
        if (res.statusCode == 200) {
            utils.TipModel('提示',res.data.message);

        }
      }
    });
  },
  /**
   * 提交至质量检查
   */
  postEvent:function(e){
    var that = this;
    //提交
    wx.request({
      method: 'POST',
      url: app.globalData.WebUrl + 'project/stage/',
      header: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        groupId: that.data.p_group,
        projectNo: that.data.p_no,
        projectStage: 4
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.TipModel('提示', res.data.message);
          wx.navigateBack({
            delta:1
          })
        }
      }
    });        
  },
  /**
   * 添加进度
   */
  addEvent:function(e){
    let rate = this.data.ptwork.projectRate;
    this.setData({
      addScheduleShow:true,
      projectNote:'',
      projectRate:rate
    })
  },
  /**
   * 添加进度返回
   */
  schedReturnEvent:function(e){
    this.setData({
      addScheduleShow: false
    })
  },
  /**
   * 添加进度提交
   */
  schedAddEvent:function(e){
    var that = this;
    //提交
    wx.request({
      method: 'POST',
      url: app.globalData.WebUrl + 'schedule/',
      header: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        projectName: that.data.p_name,
        projectNo: that.data.p_no,
        projectNote: that.data.projectNote,
        projectRate: that.data.projectRate
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.TipModel('提示', res.data.message);
          that.setData({
            addScheduleShow:false
          });
          that.getProjectinfo();
          that.getShortCutList();
          that.getScheduleInfo();
        }
      }
    });    
  },
  /**
   *进度条事件
   */
  sliderchangeEvent:function(e){
    let projectRate = 0;
    if(e.detail.value > 90){
      projectRate = 90;
      utils.TipModel('警告','项目未完结，最高进度只可达90%，请提交质检',0);
    }else{
      projectRate = e.detail.value;
    }
    this.setData({
      projectRate: projectRate
    })
  },
  /**
   * 进度内容事件
   */
  projectNoteEvent:function(e){
    this.setData({
      projectNote:e.detail.value
    })
  }
})