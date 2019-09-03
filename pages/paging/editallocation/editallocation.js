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
    zShortShow: false,
    wshortcutList: [],//作业内容快捷短语
    wShortShow: false, 
    tshortcutList :[], //技术要求快捷短语
    tShortShow:false,
    projectDetail:{},  //项目基本信息
    alloItem:{}, //项目安排信息
    workGroupsList: [], //作业组列表
    workGroupShow: false,
    headManList:[],  //项目负责人列表
    headManIndex:0     
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
    this.wxValidateInit();
    
    this.getProjectInfo();
    this.getShortCutList();
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
        let manList = [];
        if (res.statusCode == 200) {
          for(let group of res.data){
            group['checked'] = false;
            for(let rate of that.data.projectDetail.rateList){
              if (rate['group_id'] == group['id']){
                group['output_rate'] = rate['output_rate'];
                group['project_output'] = rate['project_output'];
                group['shortDate'] = rate['shortDate'];
                group['lastDate'] = rate['lastDate'];
                group['checked'] = true;
                manList.push(group['headMan']);
              }
            }
            
          }

          let index = manList.indexOf(that.data.projectDetail.projectCharge);
          that.setData({
            workGroupsList: res.data,
            headManList: manList,
            headManIndex: index
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
            projectBegunDate: res.data.projectBegunDate == null ? '' : res.data.projectBegunDate.replace(' 00:00:00','')
            
        });
          that.getWorkGroups();
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
          for(let shortcut of res.data){
            shortcut.checked = false;
          }
          that.setData({
            zshortcutList: res.data,
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
          for (let shortcut of res.data) {
            shortcut.checked = false;
          }
          that.setData({
            wshortcutList: res.data,
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
          for (let shortcut of res.data) {
            shortcut.checked = false;
          }
          that.setData({
            tshortcutList: res.data
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
    let projectDetail = this.data.projectDetail;
    projectDetail['projectOutPut'] = project_output;
    projectDetail['projectWorkDate'] = project_workDate;
    projectDetail['projectQualityDate'] = project_qualityDate;
    this.setData({
      projectDetail: projectDetail
    })

  },
  /**
   * 工作量输入
   */
  workLoadInputEvent:function(e){
    let projectDetail = this.data.projectDetail;
    projectDetail['projectWorkLoad'] = e.detail.value;
    this.setData({
      projectDetail: projectDetail
    })
  },
  /**
   * 产值预算明细
   */
  detialInputEvent:function(e){
    let projectDetail = this.data.projectDetail;
    projectDetail['projectOutPutNote'] = e.detail.value;
    this.setData({
      projectDetail: projectDetail
    })
  },
  /**
   * 执行短语输入
   */
  executeShortShowEvent:function(e){
      this.setData({
        zShortShow :true
      })
  },
  /**
   * 执行标准短语取消
   */
  returnZshortEvent:function(e){
    this.setData({
      zShortShow: false
    });
  },
  /**
   * 执行标准短语输入确定
   */
  setZshortEvent:function(e){
    let pDetail = this.data.projectDetail;
    let projectExecuteStandard = '';
    for(let execute of this.data.zshortcutList){
      if(execute.checked){
        projectExecuteStandard += execute.shortNote + ';';
      }
    }
    pDetail['projectExecuteStandard'] = projectExecuteStandard;
    this.setData({
      projectDetail: pDetail,
      zShortShow:false
    });
  },
  /**
   * 执行标准短语输入改变
   */
  zShortCheckEvent:function(e){
    let zList = this.data.zshortcutList;
    for (let zshort of zList){
      if (e.detail.value.indexOf(zshort.id.toString()) != -1){
        zshort.checked = true;
      }else{
        zshort.checked = false;
      }
    }
    this.setData({
      zshortcutList : zList
    })
  },
  /**
 * 作业内容标准短语快捷输入多选
 */
  workShortShowEvent: function (e) {
    this.setData({
      wShortShow:true
    })
  },
  /**
   * 作业内容多选改变 
   */
  wShortCheckEvent :function(e){
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
   * 作业内容快捷取消
   */
  returnWshortEvent: function(e){
    this.setData({
      wShortShow : false
    })
  },
  /**
   * 作业内容确定
   */
  setWshortEvent:function(e){
    let pDetail = this.data.projectDetail;
    let projectWorkNote = '';
    for (let execute of this.data.wshortcutList) {
      if (execute.checked) {
        projectWorkNote += execute.shortNote + ';';
      }
    }
    pDetail['projectWorkNote'] = projectWorkNote;
    this.setData({
      projectDetail: pDetail,
      wShortShow: false
    });
  },

  /**
 * 技术要求标准短语
 */
  requireShortChangeEvent: function (e) {
    this.setData({
      tShortShow : true
    })
  },
  /**
   * 技术短语快捷输入改变
   */
  tShortCheckEvent:function(e){
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
  returnTshortEvent:function(e){
    this.setData({
      
      tShortShow : false
    })
  },
  /**
   *  技术短语快捷输入确定
   */
  setTshortEvent:function(e){
    let pDetail = this.data.projectDetail;
    let projectWorkRequire = '';
    for (let execute of this.data.tshortcutList) {
      if (execute.checked) {
        projectWorkRequire += execute.shortNote + ';';
      }
    }
    pDetail['projectWorkRequire'] = projectWorkRequire;
    this.setData({
      projectDetail: pDetail,
      tShortShow: false
    });
  },
  /**
   * 选择作业组按钮事件
   */
  chooseWorkEvent:function(e){
    let projectDetail = this.data.projectDetail;
    if (projectDetail.projectOutPut == null){
      utils.TipModel('错误',"请先设置并保存项目安排信息！", 0);
      return;
    }
    this.setData({
      workGroupShow : true
    });
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
        projectExecuteStandard: e.detail.value.projectExecuteStandard,
        projectNo: pDetail['projectNo'],
        projectOutPut: e.detail.value.projectOutPut,
        projectOutPutNote: e.detail.value.projectOutPutNote,
        projectQualityDate: e.detail.value.projectQualityDate,
        projectWorkDate: e.detail.value.projectWorkDate,
        projectWorkLoad: e.detail.value.projectWorkLoad,
        projectWorkNote: e.detail.value.projectWorkNote,
        projectWorkRequire: e.detail.value.projectWorkRequire,
        projectWriter: app.globalData.userInfo.username,
        rateList: pDetail['rateList']
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.TipModel('提示',res.data.message);
          that.onShow();
        }
      }
    });
  },
  /**
   * 提交至项目作业
   */
  postWorkEvent:function(e){
    if(this.data.projectDetail.rateList.length == 0){
      utils.TipModel('错误', '请确认好作业分组再提交至作业！',0);
      return;
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
        projectExecuteStandard: pDetail.projectExecuteStandard,
        projectNo: pDetail['projectNo'],
        projectOutPut: pDetail.projectOutPut,
        projectOutPutNote: pDetail.projectOutPutNote,
        projectQualityDate: pDetail.projectQualityDate,
        projectWorkDate: pDetail.projectWorkDate,
        projectWorkLoad: pDetail.projectWorkLoad,
        projectWorkNote: pDetail.projectWorkNote,
        projectWorkRequire: pDetail.projectWorkRequire,
        projectWriter: app.globalData.userInfo.username,
        rateList: pDetail['rateList']
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.stageChange();
        }
      }
    });
  },
  /**
   * 修改项目阶段
   */
  stageChange:function(){
    var that = this;
    let pDetail = this.data.projectDetail;
    let groupsId = [];
    for(let rate of pDetail.rateList){
      groupsId.push(rate.group_id);
    }
    //提交
    wx.request({
      method: 'POST',
      url: app.globalData.WebUrl + 'project/stage/',
      header: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        groupId: "",
        groupsId: groupsId,
        projectNo: pDetail.projectNo,
        projectStage: 3
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.navigateBack({
            delta:1 
          });
        }
      }
    });
  },
  /**
   * 分组input输入变化
   */
  rateInputEvent:function(e){
    console.log(e.detail.value);
    let id = e.currentTarget.id.split('_')[1];
    let name = e.currentTarget.id.split('_')[0];
    let groupList = this.data.workGroupsList;
    let pDetail = this.data.projectDetail;
    //占比输入
    if (name =='outputRate'){
      for (let group of groupList){
        if (group['id'] == id){
          let rate = parseFloat(e.detail.value);
          let projectOutPut = (e.detail.value / 100 * pDetail.projectOutPut).toFixed(2);
          group['output_rate'] = e.detail.value;
          group['project_output'] = projectOutPut;
          group['shortDate'] = (Math.ceil(projectOutPut / 2400 * 0.7 / 0.5) * 0.5);
          group['lastDate'] = (Math.ceil(projectOutPut / 2400 * 1.3 / 0.5) * 0.5);
        }
      }
    }
    //产值输入
    if (name == 'projectOutput'){
      for (let group of groupList) {
        if (group['id'] == id) {
          group['output_rate'] = (e.detail.value / pDetail.projectOutPut * 100).toFixed(2);
          group['project_output'] = e.detail.value;
          group['shortDate'] = (Math.ceil(e.detail.value / 2400 * 0.7 / 0.5) * 0.5);
          group['lastDate'] = (Math.ceil(e.detail.value / 2400 * 1.3 / 0.5) * 0.5);
        }
      }
    }
    //最短工期输入
    if (name == 'shortDate') {
      for (let group of groupList) {
        if (group['id'] == id) {
          group['shortDate'] = e.detail.value;
        }
      }
    }
    //最迟工期输入
    if (name == 'lastDate') {
      for (let group of groupList) {
        if (group['id'] == id) {
          group['lastDate'] = e.detail.value;
        }
      }
    }

    this.setData({
      workGroupsList: groupList
    })
  },
  /**
   * 分组返回
   */
  returnGroupEvent:function(e){
    this.setData({
      workGroupShow:false
    })
  },
  /**
   * 确认分组
   */
  setGroupEvent:function(e){
    let pDetail = this.data.projectDetail;
    let rateList = [];
    var totalrate = 0; //全占比
    var totalOutput = 0; //全产值
    for(let group of this.data.workGroupsList){
      if(group['checked']){
        let g = {
          groupName: group['gName'],
          group_id: group['id'],
          lastDate: group['lastDate'],
          output_rate: group['output_rate'],
          project_output: group['project_output'],
          shortDate: group['shortDate']
        };
        rateList.push(g);
        totalOutput += parseFloat(group['project_output']);
        totalrate += parseFloat(group['output_rate']);
      }
    }
    if (totalrate > 100.01 || totalrate<99.99){
      utils.TipModel('错误','产值占比不满足100%', 0);
      return;
    }
    if (totalOutput > (pDetail.projectOutPut + 1) || totalOutput < (pDetail.projectOutPut - 1)){
      utils.TipModel('错误', '总产值不等于预计总产值', 0);
      return;
    }

    pDetail.rateList = rateList;
    pDetail.projectCharge = this.data.headManList[this.data.headManIndex];
    this.setData({
      projectDetail : pDetail,
      workGroupShow: false
    })
  },
  /**
   * 项目负责人改变
   */
  headManChangeEvent:function(e){
    // let pDetail = this.data.projectDetail;
    // pDetail.projectCharge = 
    this.setData({
      headManIndex : e.detail.value
    })
  },
  /**
   * 作业组勾选
   */
  groupCheckEvent: function(e){
    var headMenlist = this.data.headManList;
    let workGroupsList = this.data.workGroupsList;
    for (let group of workGroupsList){
      if (group['id'] == e.currentTarget.id){
        group.checked = !group.checked;
        if (group.checked){
          headMenlist.push(group['headMan']);
        }else{
          let index = headMenlist.indexOf(group['headMan']);
          headMenlist = utils.arrayRemove(headMenlist , index);
        }
      }
    }
    this.setData({
      headManList: headMenlist,
      headManIndex:0,
      workGroupsList : workGroupsList
    })
  },

  
})