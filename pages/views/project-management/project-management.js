var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId:'project-management',
    calendarShow: false,    //日历显示
    setStartflag: false, //设置开始日期标志
    dateInfo:'',
    stages: [],  //阶段选择
    stageID : 0,
    pagination: {
      'page': 1,
      'rowsPerPage':10,
      'sortBy': 'id',
      'startDate': utils.getLastMonthDate(), //开始日期
      'endDate': utils.formatDate(new Date()),// 结束日期
      'search':'',
      'p_stage':1,
      'descending':true
    },  //分页参数
    has_next:false,  //是否有上下页
    has_pre:false,
    tableList:[],  //列表数据
    stageShow: false,   //修改阶段窗口
    contractDetail: {},  //当前项目详情
    currentStageId: 0,
    currentStageList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStagesInfo();
    this.getProjectsFromApi();
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
   * 获取项目阶段
   */
  getStagesInfo: function () {
    var that = this;
    //加载阶段选项
    wx.request({
      url: app.globalData.WebUrl + "stage/",
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var stagesInfo = ['所有阶段'];
          var stagesInfoModel = []
          for (var stage of res.data) {
            stagesInfo.push(stage.name);
            stagesInfoModel.push(stage.name);
          }
          that.setData({
            stages: stagesInfo,
            currentStageList: stagesInfoModel
          })
        }

      },
      fail: function (res) {

      }
    })
  },

  /**
   * 项目处理列表
   */
  getProjectsFromApi: function () {
    var pagination = this.data.pagination;
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "projectSetUp/",
      method: 'GET', 
      data: {
        page: pagination.page,
        rowsPerPage: pagination.rowsPerPage,
        sortBy: pagination.sortBy,
        descending: pagination.descending,
        search: pagination.search,
        startDate: pagination.startDate,
        endDate: pagination.endDate,
        p_stage: pagination.p_stage,
        stageId: that.data.stageID==0?'':that.data.stageID,
        account: ''
      },
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.tableListInit(res.data['data']);
          that.setData({
            has_next: res.data.has_next,  //是否有上下页
            has_pre: res.data.has_prev,
            tableList:  res.data['data']
          });
        }

      },
      fail: function (res) {

      }
    })
  },

  /**
   * 搜索关键字事件
   */
  searchInputEvent:function(e){
    var pagination = this.data.pagination;
    pagination.search = e.detail.value;
    this.setData({
      pagination : pagination
    });
    this.getProjectsFromApi();
  },

  /**
   * 设置开始时间
   */
  setStartDateEvent:function(){
    var startDate = this.data.pagination.startDate;
    this.setData({
      calendarShow:true,
      setStartflag: true,
      dateInfo: startDate
    });
  },

  /**
   * 设置结束时间
   */
  setEndDateEvent: function () {
    var endDate = this.data.pagination.endDate;
    this.setData({
      calendarShow: true,
      setStartflag: false,
      dateInfo: endDate
    });
  },
  /**
   * 阶段改变
   */
  StateChangeEvent: function(e){
    this.setData({
      stageID: e.detail.value,
    })
    this.getProjectsFromApi();
  },

  /**
   * 日历事件
   */
  CalendarEvent:function(e){
    console.log(e);
    //关闭日历控件
    if (e.type == 'showEvent'){
      this.setData({
        calendarShow: e.detail.showCalendar
      })
      return;
    }

    if (e.type == 'setEvent' && this.data.setStartflag){
      var pagination = this.data.pagination;
      pagination.startDate = e.detail.dateInfo;
      this.setData({
        pagination: pagination,
        calendarShow: false
      })
    }

    if (e.type == 'setEvent' && !(this.data.setStartflag)) {
      var pagination = this.data.pagination;
      pagination.endDate = e.detail.dateInfo;
      this.setData({
        pagination: pagination,
        calendarShow: false
      })
    }

    this.getProjectsFromApi();
  },

  /**
   * 点击选中弹出详情
   */
  detailClickEvent:function(e){
    console.log(e.currentTarget.id);
    let tableList = this.data.tableList;
    for(let table of tableList){
      if(table['id'] == e.currentTarget.id){
        table['selected'] = !table['selected'];
      }
      else{
        table['selected'] = false;
      }
    }
    this.setData({
      tableList: tableList
    })
  },

  /**
   * 下一页
   */
  prePage: function (e) {
    let pagination = this.data.pagination;
    pagination.page -= 1;
    this.setData({
      pagination: pagination
    });
    this.getProjectsFromApi();
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 下一页
   */
  nextPage:function(e){
    let pagination = this.data.pagination;
    pagination.page += 1;
    this.setData({
      pagination: pagination
    });
    this.getProjectsFromApi();
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  /**
 * 修改项目阶段
 */
  curStageChangeEvent: function (e) {
    this.setData({
      currentStageId:e.detail.value
    })
  },
  /**
   * 阶段改变
   */
  changeStageEvent:function(e){
    for (let project of this.data.tableList) {
      if (project['id'] == e.currentTarget.id) {
        let index = this.data.currentStageList.indexOf(project['projectStage'])
        this.setData({
          contractDetail: project,
          stageShow:true,
          currentStageId: index 
        });
        break;
      }
    }
  },
  /**
   * 取消
   */
  returnEvent:function(e){
    this.setData({
      stageShow:false
    })
  },
  /**
   * 保存
   */
  saveEvent:function(e){
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "project/stage/",
      method: 'POST',
      data: {
        projectNo: that.data.contractDetail.projectNo,
        projectStage: parseInt(that.data.currentStageId) + 1
      },
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.TipModel('提示',res.data.message);
          that.setData({
            stageShow: false
          })
          that.getProjectsFromApi();
        }

      }
    })
  }

})