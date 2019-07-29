var app = getApp();
var utils = require('../../utils/util.js');
var first = require('../../utils/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAccount:'admin',  //用户
    password:'123456',      //密码
    loadingShow:false, //是否显示
    loadtxt:'登录中'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取存放在本地的用户密码
    // this.setData({
    //   userAccount: wx.getStorageSync('userAccount'),
    //   password: wx.getStorageSync('password')
    // });

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
   * 获取用户权限
   */
  getPermissions:function(){
    wx.request({
      url: app.globalData.WebUrl + 'users/permissions/', //接口地址 
      method: 'get',
      header: {
        Authorization: 'Bearer ' + app.globalData.SignToken,
      },
      success: function (res) {
        console.log(res.data);
        //获取权限成功
        if (res.statusCode == 200) {
          app.globalData.permissions = res.data;
          //要跳转的首页
          let index = first.firstLoad()
          wx.navigateTo({
            url: '../views/' + index + '/' + index
          });
        }
        //获取失败
        else {
          utils.TipModel('错误', res.data.message, 0);
        }

      }
    })

  },
  /**
   * 获取用户ID
   */
  getUserId:function(){
    let that = this;
    wx.request({
      url: app.globalData.WebUrl + 'user/' + that.data.userAccount + "/", //接口地址 
      method: 'get',
      header: {
        Authorization: 'Bearer ' + app.globalData.SignToken,
      },
      success: function (res) {
        console.log(res.data);
        //获取权限成功
        if (res.statusCode == 201) {
          app.globalData.userId = res.data['id'];
          console.log(app.globalData.userId);
        }
        //获取失败
        else {
          utils.TipModel('错误', res.data.message, 0);
        }

      }
    })
  },
  /**
   * 登录事件
   */
  loginTap: function () {
    var that = this;
    that.setData({
      loadingShow: true
    })
    wx.request({
      url: app.globalData.WebUrl + 'auth/', //接口地址 
      method: 'post',  
      data: {
        userAccount: that.data.userAccount,
        password: that.data.password
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        //登录成功
        if (res.statusCode == 200){
          app.globalData.SignToken = res.data.token;
          //登录成功保存用户密码
          wx.setStorageSync("userAccount", that.data.userAccount);
          wx.setStorageSync("password", that.data.password);
          //获取权限
          that.getPermissions();
          that.getUserId();
          app.globalData.userAccount = that.data.userAccount;


        }
        //登录失败
        else{
          utils.TipModel('错误', res.data.message, 0);
        }
        
      },
      fail:function(){
        utils.TipModel('错误', '网络异常' , 0);
      },
      complete:function(){
        that.setData({
          loadingShow:false
        })
      }
    })
  },

  /*
  *获取用户名
  */
  userAccountInput: function (e) {
    this.setData({
      userAccount: e.detail.value
    });

  },
  /*
  *获取密码
  */
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    });

  }
})