// paging/editwork/editwork.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tshortcutList: [],//技术交底内容快捷输入
    tShortShow: false,
    pshortcutList: [],//过程快捷输入
    pShortShow: false, 
    ishortcutList: [],//资料快捷输入
    iShortShow: false, 
    wshortcutList: [],//工作小结快捷输入
    wShortShow: false, 
    ashortcutList: [],//工作量快捷输入
    aShortShow: false, 
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
          for(let shortcut of res.data){
            shortcut.checked = false;
          }
          that.setData({
            tshortcutList : res.data
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
          for (let shortcut of res.data) {
            shortcut.checked = false;
          }
          that.setData({
            pshortcutList: res.data
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
          for (let shortcut of res.data) {
            shortcut.checked = false;
          }
          that.setData({
            ishortcutList: res.data
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
          for (let shortcut of res.data) {
            shortcut.checked = false;
          }
          that.setData({
            wshortcutList: res.data
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
          for (let shortcut of res.data) {
            shortcut.checked = false;
          }
          that.setData({
            ashortcutList: res.data
          })
        }
      }
    });
  },
  /**
   * 技术交底快捷输入
   */
  tshortChangeEvent:function(e){
    this.setData({
      tShortShow : true
    })
  },
  /**
   * 技术交底快捷输入多选改变
   */
  tShortCheckEvent: function(e){
    let tList = this.data.tshortcutList;
    for (let tshort of tList) {
      if (e.detail.value.indexOf(tshort.id.toString()) != -1) {
        tshort.checked = true;
      } else {
        tshort.checked = false;
      }
    }
    this.setData({
      tshortcutList: tList
    })
  },
  /**
     * 技术短语快捷输入取消
     */
  returnTshortEvent: function (e) {
    this.setData({
      tShortShow: false
    })
  },
  /**
   *  技术短语快捷输入确定
   */
  setTshortEvent: function (e) {
    let pDetail = this.data.projectDetail;
    let disclosureNote = '';
    for (let execute of this.data.tshortcutList) {
      if (execute.checked) {
        disclosureNote += execute.shortNote + ';';
      }
    }
    this.setData({
      disclosureNote: disclosureNote,
      tShortShow: false
    });
  },
  /**
   * 过程检查意见快捷输入
   */
  pshortChangeEvent: function (e) {
    this.setData({
      pShortShow : true
    })
  },
  /**
     * 过程检查快捷输入多选改变
     */
  pShortCheckEvent: function (e) {
    let pList = this.data.pshortcutList;
    for (let pshort of pList) {
      if (e.detail.value.indexOf(pshort.id.toString()) != -1) {
        pshort.checked = true;
      } else {
        pshort.checked = false;
      }
    }
    this.setData({
      pshortcutList: pList
    })
  },
  /**
     * 过程检查快捷输入取消
     */
  returnPshortEvent: function (e) {
    this.setData({
      pShortShow: false
    })
  },
  /**
   *  过程检查快捷输入确定
   */
  setPshortEvent: function (e) {
    let pDetail = this.data.projectDetail;
    let checkSuggestion = '';
    for (let execute of this.data.pshortcutList) {
      if (execute.checked) {
        checkSuggestion += execute.shortNote + ';';
      }
    }
    this.setData({
      checkSuggestion: checkSuggestion,
      pShortShow: false
    });
  },

  /**
 * 上交资料快捷输入
 */
  ishortChangeEvent: function (e) {
    this.setData({
      iShortShow : true
    })
  },
  /**
  * 上交资料快捷输入多选改变
  */
  iShortCheckEvent: function (e) {
    let iList = this.data.ishortcutList;
    for (let ishort of iList) {
      if (e.detail.value.indexOf(ishort.id.toString()) != -1) {
        ishort.checked = true;
      } else {
        ishort.checked = false;
      }
    }
    this.setData({
      ishortcutList: iList
    })
  },
  /**
     * 上交资料快捷输入取消
     */
  returnIshortEvent: function (e) {
    this.setData({
      iShortShow: false
    })
  },
  /**
   *  上交资料快捷输入确定
   */
  setIshortEvent: function (e) {
    let iDetail = this.data.projectDetail;
    let dataName = '';
    for (let execute of this.data.ishortcutList) {
      if (execute.checked) {
        dataName += execute.shortNote + ';';
      }
    }
    this.setData({
      dataName: dataName,
      iShortShow: false
    });
  },

  /**
* 工作小结快捷输入
*/
  wshortChangeEvent: function (e) {
    this.setData({
      wShortShow : true
    })
  },
  /**
  * 工作小结快捷输入多选改变
  */
  wShortCheckEvent: function (e) {
    let wList = this.data.wshortcutList;
    for (let wshort of wList) {
      if (e.detail.value.indexOf(wshort.id.toString()) != -1) {
        wshort.checked = true;
      } else {
        wshort.checked = false;
      }
    }
    this.setData({
      wshortcutList: wList
    })
  },
  /**
     * 工作小结快捷输入取消
     */
  returnWshortEvent: function (e) {
    this.setData({
      wShortShow: false
    })
  },
  /**
   *  工作小结快捷输入确定
   */
  setWshortEvent: function (e) {
    let wDetail = this.data.projectDetail;
    let briefSummary = '';
    for (let execute of this.data.wshortcutList) {
      if (execute.checked) {
        briefSummary += execute.shortNote + ';';
      }
    }
    this.setData({
      briefSummary: briefSummary,
      wShortShow: false
    });
  },

  /**
* 工作量快捷输入
*/
  ashortChangeEvent: function (e) {
    this.setData({
      aShortShow : true
    })
  },

  /**
 * 工作量快捷输入多选改变
 */
  aShortCheckEvent: function (e) {
    let aList = this.data.ashortcutList;
    for (let ashort of aList) {
      if (e.detail.value.indexOf(ashort.id.toString()) != -1) {
        ashort.checked = true;
      } else {
        ashort.checked = false;
      }
    }
    this.setData({
      ashortcutList: aList
    })
  },
  /**
     * 工作量快捷输入取消
     */
  returnAshortEvent: function (e) {
    this.setData({
      aShortShow: false
    })
  },
  /**
   *  工作量快捷输入确定
   */
  setAshortEvent: function (e) {
    let aDetail = this.data.projectDetail;
    let workLoad = '';
    for (let execute of this.data.ashortcutList) {
      if (execute.checked) {
        workLoad += execute.shortNote + ';';
      }
    }
    this.setData({
      workLoad: workLoad,
      aShortShow: false
    });
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
          res.data.projectBegunDate = res.data.projectBegunDate.replace(" 00:00:00","")
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
    if (this.data.ptwork.projectRate < 90){
      utils.TipModel('错误','当前进度未达90%，如若已完成，请添加进度并把进度值调为90',0)
      return;
    }
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