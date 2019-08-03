// pages/views/schedule-management/schedule-management.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId : 'schedule-management',
    calendarShow: false,    //日历显示
    setStartflag: false, //设置开始日期标志
    scheduleShow: false, //进度是否显示
    dateInfo: '',
    projectTypes: [],  //阶段选择
    projectTypeID: 0,
    pagination: {
      'page': 1,
      'rowsPerPage': 10,
      'sortBy': 'id',
      'startDate': '', //开始日期
      'endDate': '',// 结束日期
      'search': '',
      'p_stage': 1,
      'descending': true
    },  //分页参数
    has_next: false,  //是否有上下页
    has_pre: false,
    tableList: [],  //列表数据
    detailList: [] //进度详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProjectTypesInfo();
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
   * 获取项目类型
   */
  getProjectTypesInfo: function () {
    var that = this;
    //加载阶段选项
    wx.request({
      url: app.globalData.WebUrl + "projectTypes/",
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var stagesInfo = ['所有类型'];
          for (var stage of res.data) {
            stagesInfo.push(stage.name);
          }
          that.setData({
            projectTypes: stagesInfo
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
      url: app.globalData.WebUrl + "project/schedule/",
      method: 'GET',
      data: {
        page: pagination.page,
        rowsPerPage: pagination.rowsPerPage,
        sortBy: pagination.sortBy,
        descending: pagination.descending,
        search: pagination.search,
        startDate: pagination.startDate,
        endDate: pagination.endDate,
        userAccount: ''
      },
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          utils.tableListInit(res.data['data']);
          for(let contractInfo of res.data['data']){
            let days = contractInfo['projectWorkDate'] + contractInfo['projectQualityDate'];
            let beginDate = new Date(contractInfo['projectStartDate']);
            beginDate.setDate(beginDate.getDate() + days);
            //获取当前时间
            let now = new Date();
            let diffDay = (beginDate - new Date())/1000/60/60/24;
            contractInfo['time'] =Math.abs(Math.trunc(diffDay));
          }
          that.setData({
            has_next: res.data.has_next,  //是否有上下页
            has_pre: res.data.has_prev,
            tableList: res.data['data']
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
  searchInputEvent: function (e) {
    var pagination = this.data.pagination;
    pagination.search = e.detail.value;
    this.setData({
      pagination: pagination
    });
    this.getProjectsFromApi();
  },

  /**
   * 设置开始时间
   */
  setStartDateEvent: function () {
    var startDate = this.data.pagination.startDate;
    this.setData({
      calendarShow: true,
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
   * 类型改变
   */
  ProTypeChangeEvent: function (e) {
    var pagination = this.data.pagination;
    if(e.detail.value == 0){
      pagination.search = '';
    }else{
      pagination.search = this.data.projectTypes[e.detail.value];
    }
    this.setData({
      projectTypeID: e.detail.value,
      pagination: pagination
    })
    this.getProjectsFromApi();
  },
  /**
   * 日历事件
   */
  CalendarEvent: function (e) {
    console.log(e);
    //关闭日历控件
    if (e.type == 'showEvent') {
      this.setData({
        calendarShow: e.detail.showCalendar
      })
      return;
    }

    if (e.type == 'setEvent' && this.data.setStartflag) {
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
  detailClickEvent: function (e) {
    console.log(e.currentTarget.id);
    let tableList = this.data.tableList;
    for (let table of tableList) {
      if (table['id'] == e.currentTarget.id) {
        table['selected'] = !table['selected'];
      }
      else {
        table['selected'] = false;
      }
    }
    this.setData({
      tableList: tableList
    })
  },

  /**
   * 上一页
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
  nextPage: function (e) {
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
 * 查看项目进度
 */
  viewScheduleEvent:function(e){
    console.log(e.currentTarget.id);
    for(let info of this.data.tableList){
      if(info['id'] == e.currentTarget.id){
        console.log(info['projectNo']);
        var that = this;
        //加载项目进度
        wx.request({
          url: app.globalData.WebUrl + "project/schedule/"+ info['projectNo'] + "/",
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
          // 设置请求的 header  
          header: {
            'Authorization': "Bearer " + app.globalData.SignToken
          },
          success: function (res) {
            if (res.statusCode == 201) {
              
              that.setData({
                detailList:res.data,
                scheduleShow: true
              })
            }

          },
          fail: function (res) {

          }
        })
      }
    }

  },
  /**
   * 查看详情返回
   */
  returnDetail:function(e){
    this.setData({
      scheduleShow: false
    })
  }

})