// pages/paging/editoutput/editoutput.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ptworkSelected:false,
    ptwork:{},
    p_no:'',
    workTypeList:[],  //工作类型列表
    groupList:[],   //工作组
    totalOutput: 0  //总产值
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      p_no : options.p_no
    });
    this.getProjectinfo();
    this.getWorkTypeList();
    this.getGroupTypeList();
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
   * 查看项目基本信息
   */
  viewPtWorkEvent:function(e){
    let selected = this.data.ptworkSelected;
    this.setData({
      ptworkSelected: !selected
    })
  },
  /**
   * 获取项目基本信息
   */
  getProjectinfo: function () {
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/output/?projectNo=" + that.data.p_no ,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let totalOutput = 0;
          for (let group of res.data['groupList']) {
            let allput = 0;
            for (let outPutWrap of group.outPutWraps) {
                allput += outPutWrap.workLoad * outPutWrap.projectRatio * outPutWrap.typeOutput;
            }
            totalOutput += allput;
            group.allPutNum = allput;
          }
          that.setData({
            ptwork: res.data,
            totalOutput: totalOutput
          })
        }
      }
    });
  },
  /**
 * 获取工作类型信息
 */
  getWorkTypeList: function () {
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "workType/",
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          that.setData({
            workTypeList: res.data,
           
          })
        }
      }
    });
  },
  /**
* 获取工作组类型信息
*/
  getGroupTypeList: function () {
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/group/?projectNo=" + that.data.p_no,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          for(let group of res.data){
            group['checked'] = false;
          }
          that.setData({
            groupList: res.data
          })
        }
      }
    });
  },
  /**
   * 工作组改变
   */
  workGroupChangeEvent:function(e){
    let grouplist = this.data.groupList;
    for(let group of grouplist){
      if(group.id == e.detail.value){
        group['checked'] = true;
      }
      else{
        group['checked'] = false;
      }
    }
    //工作类型（勾选）
    let workTypeList = this.data.workTypeList;
    for(let group of this.data.ptwork.groupList){
      if (group.id == e.detail.value) {
        let index = 0;
        for (let outwrap of group.outPutWraps){
          if(outwrap['check']){
            workTypeList[index]['checked'] = true;
          }
          else{
            workTypeList[index]['checked'] = false;
          }
          index++;
        }
        this.setData({
          workTypeList : workTypeList
        })
        break;
      }
    }

    this.setData({
      groupList : grouplist
    })
  },
  /**
   *工作类型点击 
   */
  workCheckEvent :function(e){
    console.log(e.currentTarget.id);
    let ptwork = this.data.ptwork;
    //获取选中的组id
    let groupId;
    let grouplist = this.data.groupList;
    for (let group of grouplist) {
      if (group['checked']){
        groupId = group.id
      }
    }
    for (let group of ptwork.groupList){
      if (group.id == groupId)
      for (let outPutWrap of group.outPutWraps){
        if (outPutWrap.id == e.currentTarget.id){
          outPutWrap.check = !outPutWrap.check;
        }
      }
    }
    this.setData({
      ptwork: ptwork
    })
  },
  /**
   * 返回
   */
  returnEvent:function(e){
    wx.navigateBack({
      detla:1
    })
  },
  /**
   * 保存
   */
  saveEvent:function(e){
    let that = this;
    let ptwork = this.data.ptwork;
    let outPutWrap = [];
    for (let group of ptwork.groupList){
      let putWrap = {
        groupId: group.id,
        projectOutPut: group.allPutNum
      }
      outPutWrap.push(putWrap);
    }
    wx.request({
      url: app.globalData.WebUrl + "project/output/" ,
      method: 'Post',
      data:{
        groupList: ptwork.groupList,
        outPutWrap: outPutWrap,
        projectNo:that.data.p_no
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
   *  提交审定 
   */
  postEvent:function(e){
    if (this.data.ptwork.projectStage != '产值核算'){
      utils.TipModel('错误','该项目不在产值核算阶段，请在项目处理修改项目阶段！',0);
      return;
    }
    let that = this;
    let ptwork = this.data.ptwork;
    let outPutWrap = [];
    for (let group of ptwork.groupList) {
      let putWrap = {
        groupId: group.id,
        projectOutPut: group.allPutNum
      }
      outPutWrap.push(putWrap);
    }
    wx.request({
      url: app.globalData.WebUrl + "project/output/",
      method: 'Post',
      data: {
        groupList: ptwork.groupList,
        outPutWrap: outPutWrap,
        projectNo: that.data.p_no
      },
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.postToEdit();
        }
      }
    });
  },
  /**
   * 项目放到审定阶段
   */
  postToEdit:function(e){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/stage/",
      method: 'Post',
      data: {
        projectNo: that.data.p_no,
        projectStage: 6
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
  },
  /**
   * 难度系数输入
   */
  projectRatioEvent:function(e){
    let groupId = e.currentTarget.id.split('_')[0];
    let outPutWrapId = e.currentTarget.id.split('_')[1];
    let ptwork = this.data.ptwork;
    let allput = 0; //总产值
    for (let group of ptwork.groupList) {
      if (group.id == groupId){
        for (let outPutWrap of group.outPutWraps) {
          if (outPutWrap.id == outPutWrapId) {
            outPutWrap.projectRatio = e.detail.value;
          }
          allput += outPutWrap.workLoad * outPutWrap.projectRatio * outPutWrap.typeOutput;
        }
        group.allPutNum = allput;
      }
    }
    this.setData({
      ptwork: ptwork
    })
  },
  /**
   * 工作量输入
   */
  workLoadEvent: function (e) {
    let groupId = e.currentTarget.id.split('_')[0];
    let outPutWrapId = e.currentTarget.id.split('_')[1];
    let ptwork = this.data.ptwork;
    let allput = 0; //总产值
    for (let group of ptwork.groupList) {
      if (group.id == groupId){
        for (let outPutWrap of group.outPutWraps) {
          if (outPutWrap.id == outPutWrapId) {
            outPutWrap.workLoad = e.detail.value;
          }
          allput += outPutWrap.workLoad * outPutWrap.projectRatio * outPutWrap.typeOutput;
        }
        group.allPutNum = allput;
      }
    }
    this.setData({
      ptwork: ptwork
    })
  },
})