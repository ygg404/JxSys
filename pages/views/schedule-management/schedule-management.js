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
    ymCutShow:false,     //结算年月显示
    stageShow:false,     //阶段选择显示
    dateInfo: '',
    projectTypes: [],  //阶段选择
    projectTypeID: 0,
    contractDetail: {},  //当前项目详情
    currentStageId: 0,
    currentStageList: [],
    pagination: {
      'page': 1,
      'rowsPerPage': 10,
      'sortBy': 'contractNo',
      'startDate': utils.getLastMonthDate(), //开始日期
      'endDate': utils.formatDate(new Date()),// 结束日期
      'search': '',
      'p_stage': 1,
      'descending': true
    },  //分页参数
    has_next: false,  //是否有上下页
    has_pre: false,
    tableList: [],  //列表数据
    detailList: [], //进度详情
    ymIndex: [0, 0],  //年月选择
    ymArray: [],
    p_no:'',  //选择的项目编号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStagesInfo();
    this.getProjectTypesInfo();
    this.getProjectsFromApi();
    this.initMonthDatePicker();
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
        userAccount: app.globalData.permissions.indexOf('all_permission') != -1?'':wx.getStorageSync('userAccount')
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
  },
  /**
   * 修改结算时间通过后台Api
   */
  changeTimeApi() {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        method: 'POST',
        url: app.globalData.WebUrl +  'projectQuality/editcutofftime/',
        header: {
          'Authorization': "Bearer " + app.globalData.SignToken
        },
        data: {
          projectNo: that.data.p_no,
          cutOffTime: that.data.ymArray[0][that.data.ymIndex[0]] + '-' + that.data.ymArray[1][that.data.ymIndex[1]]  + '-01'
        },
        success:function(result){
          resolve(result.data);
        }
      });
    })
  },

/**
 * 编辑结算时间
 */
  editCutTimeEvent:function(e){
      this.setData({
        ymCutShow : true
      });
      for(let project of this.data.tableList){
        if(project.id == e.currentTarget.id){
          let cuttime =  project.cDateTime;
          let month = new Date(cuttime).getMonth();
          let year = new Date(cuttime).getFullYear();
          this.setData({
            ymIndex : [year-2000 , month],
            p_no : project.projectNo
          })
          break;
        }
      }
  },
  /**
   * 确定结算时间
   */
  setYMEvent:function(e){
    console.log(this.data.ymArray[0][this.data.ymIndex[0]]);
    console.log(this.data.ymArray[1][this.data.ymIndex[1]]);
    var that = this;
    this.setData({
      ymCutShow:false
    })
    this.changeTimeApi().then(value => {
      that.getProjectsFromApi();
    }).catch(error => {})
    

  },

/**
 * 结算时间 修改返回
 */
  returnYMEvent:function(e){
    this.setData({
      ymCutShow : false
    })
  },


  /**
   * 起始年月控件
   */
  yMpickerChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      ymIndex: e.detail.value
    });
    
  },

  /**
 * 初始化年月控件
 */
  initMonthDatePicker: function () {
    let yearArr = [];
    let monthArr = [];
    for (let year = 2000; year < 2100; year++)yearArr.push(year);
    for (let month = 1; month <= 12; month++) {
      let mstr = ''
      if (month < 10) {
        mstr = '0' + month.toString();
      } else {
        mstr = month.toString();
      }
      monthArr.push(mstr);
    }
    let multiArr = [];
    multiArr.push(yearArr);
    multiArr.push(monthArr);
    this.setData({
      ymArray: multiArr
    });


  },
  /**
   * 修改项目阶段
   */
  editStageEvent:function(e){
    for (let project of this.data.tableList) {
      if (project.id == e.currentTarget.id) {
        let index = this.data.currentStageList.indexOf(project['projectStage']);
        this.setData({
          p_no: project.projectNo,
          currentStageId: index
        })
        break;
      }
    }
    let permissionsList = app.globalData.permissions;
    var that = this;
    if ( permissionsList.indexOf('all_permission') < 0 && permissionsList.indexOf('edit_stage') < 0 ) {
      utils.TipModel('警告', '无权限操作', 0);
      return;
    } else {
      return new Promise((resolve, reject) => {
        wx.request({
          method: 'GET',
          url: app.globalData.WebUrl + 'project/setup/',
          header: {
            'Authorization': "Bearer " + app.globalData.SignToken
          },
          data: {
            projectNo: that.data.p_no
          },
          success:function(res){
            that.setData({
              stageShow: true ,
              contractDetail : res.data
            })
          }
        })
      })
    }
    
  },

  /**
   * 项目阶段返回
   */
  returnStageEvent:function(e){
    this.setData({
      stageShow : false
    })
  },

  /**
* 修改项目阶段
*/
  curStageChangeEvent: function (e) {
    this.setData({
      currentStageId: e.detail.value
    })
  },
  /**
   * 保存项目阶段的修改
   */
  saveStageEvent:function(e){
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
          utils.TipModel('提示', res.data.message);
          that.setData({
            stageShow: false
          })
          that.getProjectsFromApi();
        }

      }
    })
  }
})