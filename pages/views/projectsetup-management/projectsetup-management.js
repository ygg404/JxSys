// pages/views/projectsetup-management/projectsetup-management.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId: 'projectsetup-management',
    calendarShow: false,    //日历显示
    projectDateShow:false , //项目日期显示
    setStartflag: false, //设置开始日期标志
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
      'descending': true,
      'stageId': 1
    },  //分页参数
    has_next: false,  //是否有上下页
    has_pre: false,
    addProjectShow: false,
    viewProjectShow: false, //查看项目
    tableList: [],  //列表数据
    userList:[],   //用户列表
    userIndex:0, 
    userNameList :[],
    contractList: [], //合同列表
    contractId :0 , 
    contractNameList:[],
    contractDetail:{}, // 合同详情 
    btnName:''  //按键名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProjectTypesInfo();
    this.getProjectsFromApi();
    this.getUserList();
    this.getContractList();
    this.wxValidateInit();
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
     * 表单验证的初始化函数
     */
  wxValidateInit: function () {
    this.WxValidate = app.wxValidate(
      {
        projectStartDateTime: {
          required: true,
        }
      }
      , {
        projectStartDateTime: {
          required: '请填写启动时间',
        }
      }
    )
  },
  /**
* 获取合同列表
*/
  getContractList: function () {
    var that = this;
    //加载阶段选项
    wx.request({
      url: app.globalData.WebUrl + "contract/",
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          that.setData({
            contractList: res.data
          });
          let contractNamelist = [];
          for (let contract of res.data) {
            contractNamelist.push(contract['contractName']);
          }
          that.setData({
            contractNameList: contractNamelist
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  /**
 * 获取负责人列表
 */
  getUserList: function () {
    var that = this;
    //加载阶段选项
    wx.request({
      url: app.globalData.WebUrl + "user/",
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          that.setData({
            userList: res.data
          });
          let userNameList = [];
          for(let user of that.data.userList){
            userNameList.push(user['userName']);
          }
          that.setData({
            userNameList: userNameList
          })
        }
      },
      fail: function (res) {

      }
    })
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
   * 项目立项列表
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
        stageId: pagination.stageId,
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
    if (e.detail.value == 0) {
      pagination.search = '';
    } else {
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
  },
  /**
   * 添加项目
   */
  addProjectEvent:function(e){
    this.setData({
      addProjectShow: true,
      projectStartDateTime:''
    });
    this.contractNoChange(0);
  },
  /**
   * 查看项目
   */
  viewProjectEvent: function(e){


  },
  /**
   *编辑事件 
   */
  editEvent:function(e){
    for(let contract of this.data.tableList){
      if(contract['id'] == e.currentTarget.id){
        this.setData({
          viewProjectShow:true,
          contractDetail: contract,
          projectStartDateTime: contract['projectStartTime']
        })
        break;
      } 
    }
  },
  /**
   * 删除事件
   */
  deleteEvent:function(e){

  },
  /**
   * 项目启动时间
   */
  projectStartDateTimeEvent: function(e){
    this.setData({
      projectDateShow: true
    })  
  },
  /**
   * 项目启动时间设置
   */
  ProjectDateEvent:function(e){
    //关闭日历控件
    if (e.type == 'showEvent') {
      this.setData({
        projectDateShow: false
      })
      return;
    }

    if (e.type == 'setEvent') {
      this.setData({
        projectDateShow: false,
        projectStartDateTime: e.detail.dateInfo
      })
    }
  },
  /**
   * 生产负责人改变事件
   */
  userChangeEvent:function(e){
    this.setData({
      userIndex: e.detail.value
    });
  },
  /**
   * 选择合同
   */
  contractNoChange:function(id){
    var that = this;
    let cDetail = this.data.contractList[id];
    wx.request({
      url: app.globalData.WebUrl + "contract/info/?contractNo=" + cDetail['contractNo'],
      method: 'GET',
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 201) {
          cDetail['contractBusiness'] = res.data['contractBusiness'] == null ? '' : res.data['contractBusiness'];
          cDetail['contractUserName'] = res.data['contractUserName'] == null ? '' : res.data['contractUserName'];
          cDetail['contractUserPhone'] = res.data['contractUserPhone'] == null ? '' : res.data['contractUserPhone'];
          cDetail['projectType'] = res.data['projectType'] == null ? '' : res.data['projectType'];
          that.setData({
            contractId: id,
            contractDetail: cDetail
          });
        }

      }
    });
  },
  /**
   * 选择合同事件改变
   */
  contractNoChangeEvent:function(e){
    let id = e.detail.value;
    this.contractNoChange(id);
  },
  /**
   * 取消事件
   */
  returnEvent:function(e){
    this.setData({
      addProjectShow:false,
      viewProjectShow:false,
      userIndex:0
    })
  },
  /**
   * 提交至项目安排
   */
  postEvent:function(e){

  },
  /**
   * 
   */
  getContract:function(){
    var that = this;
    let cDetail = this.data.contractDetail;
    //提交
    wx.request({
      method: 'POST',
      url: 'contract/project/',
      headers: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        projectNo: this.projectNo,
        contractNo: that.data.contractDetail.contractNo,
      },
      success: function (res) {
        if (res.statusCode == 201) {

        }
      }
    });
  },
  /**
   * 新增项目
   */
  formSubmit:function(e){
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        image: '/images/warn.png',
        duration: 2000
      })
      return false;
    }
    var that = this;
    let cDetail = this.data.contractDetail;
    //提交
    wx.request({
      method: 'POST',
      url: 'project/' + app.globalData.userId + '/',
      headers: {
        Authorization: "Bearer " + app.globalData.SignToken
      },
      data: {
        contractNo: cDetail.contractNo,
        projectName: cDetail.contractName,
        projectNum: '',
        projectMoney: cDetail.contractMoney,
        projectAuthorize: cDetail.contractAuthorize,
        userName: cDetail.contractUserName,
        userPhone: cDetail.contractUserPhone,
        projectNote: cDetail.contractNote,
        projectCharge: cDetail.contractBusiness,
        projectStartDateTime: that.data.projectStartDateTime,
        projectType: that.data.projectTypes[that.data.projectTypeID],
        projectStageId: that.data.stageId,
        projectProduce: that.data.userNameList[that.data.userIndex]
      },
      success: function (res) {
        if (res.statusCode == 201) {

        }
      }
    });
  }

})