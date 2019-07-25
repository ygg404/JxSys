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
            totalOutput += group.outPutNum;
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
   * 返回
   */
  returnEvent:function(e){
    wx.navigateBack({
      detla:1
    })
  },
})