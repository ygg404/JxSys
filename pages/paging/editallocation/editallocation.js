// pages/paging/editallocation/editallocation.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateShow:false,
    projectBegunDate:'',  //项目开工日期
    p_no:'', //项目编号
    zshortcutList: [],  //执行标准快捷短语
    zNameList: [],
    zIndex: 0,
    wshortcutList: [],//作业内容快捷短语
    wNameList: [],
    wIndex: 0,
    tshortcutList :[], //技术要求快捷短语
    tNameList:[],
    tIndex:0,
    projectDetail:{},  //项目基本信息
    alloItem:{}, //项目安排信息
    workGroupsList: [], //作业组列表
    workGroupShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        p_no: options.p_no
      });
      this.wxValidateInit();
      this.getWorkGroups();
      this.getProjectInfo();
      this.getShortCutList();
  },
  /**
     * 表单验证的初始化函数
     */
  wxValidateInit: function () {
    this.WxValidate = app.wxValidate(
      {
        projectBegunDate: {
          required: true,
        },
        projectExecuteStandard: {
          required: true,
        },
        projectWorkNote: {
          required: true,
        },
        projectWorkRequire: {
          required: true,
        },
        projectWorkLoad: {
          required: true,
        },

        projectOutPut: {
          required: true,
        }, projectOutputNote: {
          required: false,
        },
        projectWorkDate: {
          required: true,
        },
        projectQualityDate: {
          required: true,
        }
      }
      , {
        projectBegunDate: {
          required: '请填写开工时间',
        },
        projectExecuteStandard: {
          required: '请填写执行标准',
        },
        projectWorkNote: {
          required: '请填写作业内容',
        },
        projectWorkRequire: {
          required: '请填写技术要求',
        },
        projectWorkLoad: {
          required: '请填写工作量',
        },

        projectOutPut: {
          required: '请填写预计产值',
        },
        projectOutputNote: {
          required: '请填写预算明细',
        },
        projectWorkDate: {
          required: '请填写作业工期',
        },
        projectQualityDate: {
          required: '请填写质检工期',
        }
      }
    )
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
  * 项目启动时间设置
  */
  begunDateEvent: function (e) {
    //关闭日历控件
    if (e.type == 'showEvent') {
      this.setData({
        dateShow: false
      })
      return;
    }

    if (e.type == 'setEvent') {
      this.setData({
        dateShow: false,
        projectBegunDate: e.detail.dateInfo
      })
    }
  },
  /**
   * 项目开工日期显示
   */
  begunDateShowEvent: function () {
    this.setData({
      dateShow:true
    });
  },
  /**
 * 获取所有作业组
 */
  getWorkGroups: function () {
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "workGroups/" ,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            workGroupsList: res.data
          });
        }
      }
    });
  },
  /**
 * 通过项目编号 获取项目基本信息
 */
  getProjectInfo: function () {
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "projectPlan/?projectNo=" + that.data.p_no,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) { 
          that.setData({
            projectDetail: res.data,
            projectBegunDate: res.data['projectBegunDate']
        })
      }
      }
    });
  },

  /**
   * 获取快捷短语
   */
  getShortCutList: function () {
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "shortcut/1/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let nameList = ['执行标准快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          console.log(nameList);
          that.setData({
            zshortcutList: res.data,
            zNameList: nameList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.WebUrl + "shortcut/3/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let nameList = ['作业内容快捷输入'];
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
      url: app.globalData.WebUrl + "shortcut/4/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let nameList = ['技术要求快捷输入'];
          for (let shortcut of res.data) {
            nameList.push(shortcut.shortNote);
          }
          that.setData({
            tshortcutList: res.data,
            tNameList: nameList
          })
        }
      }
    });
  },
  /**
   * 预计产值算工期
   */
  projectOutPutInputEvent: function(e){
    var project_output = e.detail.value;
    var workNum = project_output / 2400 - parseInt(project_output / 2400);
    var project_workDate = 0; //作业工期
    var project_qualityDate = 0; //质检工期
    console.log(workNum)
    if(workNum == 0){
      var project_workDate = Math.round(project_output / 2400)
      }else if (workNum < 0.5) {
        project_workDate = parseInt(project_output / 2400) + 0.5
      } else {
        project_workDate = Math.round(project_output / 2400)
      }
    var qualityNum = project_workDate * 0.25 - parseInt(project_workDate * 0.25)
    if (qualityNum == 0) {
    project_qualityDate = Math.round(project_workDate * 0.25)
    } else if (qualityNum < 0.5) {
      project_qualityDate = parseInt(project_workDate * 0.25) + 0.5
      } else {
        project_qualityDate = Math.round(project_workDate * 0.25)
    }
    console.log(project_workDate);
    console.log(project_qualityDate);
    this.setData({
      projectOutPut: project_output,
      projectWorkDate: project_workDate,
      projectQualityDate: project_qualityDate
    })

  },
  /**
   * 执行标准短语
   */
  executeShortChangeEvent:function(e){
    let pDetail = this.data.projectDetail;
    pDetail['projectExecuteStandard'] = this.data.zNameList[e.detail.value];
    this.setData({
      projectDetail : pDetail,
      zIndex:e.detail.value
    })
  },
  /**
 * 作业内容标准短语
 */
  workShortChangeEvent: function (e) {
    let pDetail = this.data.projectDetail;
    pDetail['projectWorkNote'] = this.data.wNameList[e.detail.value];
    this.setData({
      projectDetail: pDetail,
      wIndex: e.detail.value
    })
  },
  /**
 * 技术要求标准短语
 */
  requireShortChangeEvent: function (e) {
    let pDetail = this.data.projectDetail;
    pDetail['projectWorkRequire'] = this.data.tNameList[e.detail.value];
    this.setData({
      projectDetail: pDetail,
      tIndex: e.detail.value
    })
  },
  /**
   * 选择作业组按钮事件
   */
  chooseWorkEvent:function(e){

  },
  /**
   *返回 
   */
  returnWorkEvent:function(e){
    wx.navigateBack({
      delta: 1
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
    let pDetail = this.data.projectDetail;
    //提交
    wx.request({
      method: 'POST',
      url: app.globalData.WebUrl + 'projectPlan/update/',
      header: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        projectBegunDate: that.data.projectBegunDate,
        projectCharge: pDetail['projectCharge'],
        projectExecuteStandard: pDetail['projectExecuteStandard'],
        projectNo: pDetail['projectNo'],
        projectOutPut: pDetail['projectOutPut'],
        projectOutPutNote: pDetail['projectOutPutNote'],
        projectQualityDate: pDetail['projectQualityDate'],
        projectWorkDate: pDetail['projectWorkDate'],
        projectWorkLoad: pDetail['projectWorkLoad'],
        projectWorkNote: pDetail['projectWorkNote'],
        projectWorkRequire: pDetail['projectWorkRequire'],
        projectWriter: pDetail['projectWriter'],
        rateList: pDetail['rateList']
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.TipModel('提示',res.data.message);
        }
      }
    });
  }
})