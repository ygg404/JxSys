//app.js
import wxValidate from 'utils/wxValidate'

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    // userId:'',
    // userAccount:'',
    userInfo: null,
    //request域名
    // WebUrl: 'https://web.gdjxch.cn/jx/api/',
    // upContractUrl : 'https://web.gdjxch.cn/jx/api/file/',  //后台上传合同路径
    // downContractUrl: 'https://web.gdjxch.cn/jx/api/download/?contractNo=', //合同下载接口
    WebUrl: 'http://192.168.0.170:8002/jx/api/',
    upContractUrl: 'http://192.168.0.170:8002/jx/api/file/',  //后台上传合同路径
    downContractUrl: 'http://192.168.0.170:8002/jx/api/download/?contractNo=', //合同下载接口
    //获取到的Token
    SignToken: '',
    //权限
    permissions:[]
  },
  wxValidate: (rules, messages) => new wxValidate(rules, messages)
})