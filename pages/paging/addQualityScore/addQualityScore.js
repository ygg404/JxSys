// pages/paging/addQualityScore/addQualityScore.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    check_type:'',//坐标系统、高程系统的正确性
    p_no:'',
    kjScore: 0 , //空间扣分
    cjScore: 0 ,   //采集扣分
    cgScore: 0,  //成果质量扣分
    allScore: 100, //总质量扣分
    scoreDetailList :[],  //评分列表
    checkcontent: ['坐标系统、高程系统的正确性',
                    '投影参数、转换参数的正确性',
                    '起算数据及选用的正确性、可靠性',
                    '控制测量成果',
                    '平面坐标精度',
                    '平面相对位置精度',
                    '高程精度',
                    '要素错误、缺漏情况',
                    '属性错误、缺漏情况',
                    '数据及结构的正确性',
                    '图面表达质量',
                    '表格表达质量',
                    '计算质量',
                    '技术文档表达质量',
                    '资料完整性、规范性'],  //检查内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      p_no : options.p_no
    })
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
    this.initScoreTypeList();
    this.getFromApi();
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
   * 初始化评分列表
   */
  initScoreTypeList: function () {
    let scoreDetailList = [];
    for(var i = 1 ; i < 16; i++){
      let scoreDetail = {
        checkcontent: this.data.checkcontent[i-1],
        check_a: "",
        check_b: "",
        check_c: "",
        check_d: "",
        check_result: "",
        check_type: "",
        project_no: this.data.p_no,
        score:0,   //扣除总分
        type_id: i
      };
      scoreDetailList.push(scoreDetail);
    }
    this.setData({
      scoreDetailList: scoreDetailList
    })
  },
  /**
   * 类别扣分
   */
  ascoreEvent:function(e){
    let scoreDetailList = this.data.scoreDetailList;
    for(let scoreDetail of scoreDetailList){
      if(e.currentTarget.id == scoreDetail.type_id){
        scoreDetail.check_a = e.detail.value;
        scoreDetail.score = scoreDetail.check_a * 42 + scoreDetail.check_b * 12 + scoreDetail.check_c * 4 + scoreDetail.check_d*1 ;
      }
    }
    this.setData({
      scoreDetailList: scoreDetailList
    });
    this.deductScore();
  },
  bscoreEvent: function (e) {
    let scoreDetailList = this.data.scoreDetailList;
    for (let scoreDetail of scoreDetailList) {
      if (e.currentTarget.id == scoreDetail.type_id) {
        scoreDetail.check_b = e.detail.value;
        scoreDetail.score = scoreDetail.check_a * 42 + scoreDetail.check_b * 12 + scoreDetail.check_c * 4 + scoreDetail.check_d*1;
      }
    }
    this.setData({
      scoreDetailList: scoreDetailList
    });
    this.deductScore();
  },
  cscoreEvent: function (e) {
    let scoreDetailList = this.data.scoreDetailList;
    for (let scoreDetail of scoreDetailList) {
      if (e.currentTarget.id == scoreDetail.type_id) {
        scoreDetail.check_c = e.detail.value;
        scoreDetail.score = scoreDetail.check_a * 42 + scoreDetail.check_b * 12 + scoreDetail.check_c * 4 + scoreDetail.check_d*1;
      }
    }
    this.setData({
      scoreDetailList: scoreDetailList
    });
    this.deductScore();
  },
  dscoreEvent: function (e) {
    let scoreDetailList = this.data.scoreDetailList;
    for (let scoreDetail of scoreDetailList) {
      if (e.currentTarget.id == scoreDetail.type_id) {
        scoreDetail.check_d = e.detail.value;
        scoreDetail.score = scoreDetail.check_a * 42 + scoreDetail.check_b * 12 + scoreDetail.check_c * 4 + scoreDetail.check_d*1;
      }
    }
    this.setData({
      scoreDetailList: scoreDetailList
    });
    this.deductScore();
  },
  /**
   * 检查类型
   */
  checkTypeEvent:function(e){
    let scoreDetailList = this.data.scoreDetailList;
    for (let scoreDetail of scoreDetailList) {
      if (e.currentTarget.id == scoreDetail.type_id) {
        scoreDetail.check_type = e.detail.value;
      }
    }
    this.setData({
      scoreDetailList: scoreDetailList
    });
  },
  /**检查结果 */
  checkResultEvent:function(e){
    let scoreDetailList = this.data.scoreDetailList;
    for (let scoreDetail of scoreDetailList) {
      if (e.currentTarget.id == scoreDetail.type_id) {
        scoreDetail.check_result = e.detail.value;
      }
    }
    this.setData({
      scoreDetailList: scoreDetailList
    });
  },
  /**
   * 获取评分明细
   */
  getFromApi:function(){
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/quality/?projectNo=" + that.data.p_no,
      method: 'GET',
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          let scoreDetailList = that.data.scoreDetailList;
          for(let data of res.data)
            for(let scoreDetail of scoreDetailList){
              if (scoreDetail.type_id == data.type_id){
                scoreDetail.check_a = data.check_a;
                scoreDetail.check_b = data.check_b;
                scoreDetail.check_c = data.check_c;
                scoreDetail.check_d = data.check_d;
                scoreDetail.check_result = data.check_result;
                scoreDetail.check_type = data.check_type;
                scoreDetail.score = scoreDetail.check_a * 42 + scoreDetail.check_b * 12 + scoreDetail.check_c * 4 + scoreDetail.check_d * 1;
            }
          }
          that.setData({
            scoreDetailList: scoreDetailList
          })
          that.deductScore();
        }
      }
    });
  },
  /**扣分统计 */
  deductScore:function(){
    let kjScore = 0; //空间扣分
    let cjScore = 0;   //采集扣分
    let cgScore = 0;  //成果质量扣分
    for(let scoreDetail of this.data.scoreDetailList){
      if(scoreDetail.type_id>0 && scoreDetail.type_id<5){
        kjScore += scoreDetail.score;
      }
      if (scoreDetail.type_id >= 5 && scoreDetail.type_id < 11) {
        cjScore += scoreDetail.score;
      }
      if (scoreDetail.type_id >= 11 && scoreDetail.type_id < 16) {
        cgScore += scoreDetail.score;
      }
    }
    this.setData({
      kjScore: kjScore, //空间扣分
      cjScore: cjScore,   //采集扣分
      cgScore: cgScore, //成果质量扣分
      allScore: 100 - kjScore - cjScore - cgScore
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
   * 提交
   */
  postEvent:function(e){
    var that = this;
    let index = 0;
    let len = this.data.scoreDetailList.length;
    for(let scoreDetail of this.data.scoreDetailList){
      if (scoreDetail.check_a != "" || scoreDetail.check_b != "" || scoreDetail.check_c != "" || scoreDetail.check_d != ""
        || scoreDetail.check_result != "" || scoreDetail.check_type != "")
      wx.request({
        url: app.globalData.WebUrl + "project/quality/" ,
        method: 'POST',
        header: {
          'Authorization': "Bearer " + app.globalData.SignToken
        },
        data:{
          check_a: scoreDetail.check_a,
          check_b: scoreDetail.check_b,
          check_c: scoreDetail.check_c,
          check_d: scoreDetail.check_d,
          check_result: scoreDetail.check_result,
          check_type: scoreDetail.check_type,
          project_no: that.data.p_no,
          type_id: scoreDetail.type_id
        },
        success: function (res) {
          if(res.statusCode== 200 && index>= len-1){

          }
        }
      });
    }
    utils.TipModel('提示', '提交完成');
    wx.navigateBack({
      detla: 1
    })
  }
})