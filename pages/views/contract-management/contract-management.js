// pages/views/contract-management/contract-management.js
var utils = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlId:'contract-management',
    calendarShow: false,    //日历显示
    contractCalendarShow:false, //合同日历
    setStartflag: false, //设置开始日期标志
    addContractShow: false , //合同管理表单
    btnName:'',
    dateInfo: '',
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
    contractNo: '', //合同编号
    contractAddTime: '', //日期
    projectTypes: [],  //类型选择
    projectTypeID: 0 ,
    business:[], //业务负责人列表
    businessId:0,
    businessName:[],
    contractDetail: {}, //合同详情
    typeId: 0 //类型ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBusinessInfo();
    this.getProjectTypesInfo();
    this.getProjectsFromApi();
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 表单验证的初始化函数
   */
  wxValidateInit: function () {
    this.WxValidate = app.wxValidate(
      {
        contractName: {
          required: true,
        },
        contractAddTime: {
          required: true,
        },
        contractAuthorize: {
          required: true,
        },
        contractNote: {
          required: true,
        },
        contractMoney: {
          required: true,
        }
      }
      , {
        contractName: {
          required: '请输入合同名称',
        },
        contractAddTime: {
          required: '请填写签订时间',
        },
        contractAuthorize: {
          required: '请输入委托单位',
        },
        contractNote: {
          required: '请输入委托要求',
        },
        contractMoney: {
          required: '请填写合同金额',
        }
      }
    )
  },
  /**
  * 获取业务负责人列表
  */
  getBusinessInfo: function () {
    var that = this;
    //加载阶段选项
    wx.request({
      url: app.globalData.WebUrl + "user/business/",
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        let businessName = [];
        if (res.statusCode == 201) {
          for (let bInfo of res.data){
             businessName.push(bInfo['userName']);
          }
          that.setData({
            businessName: businessName,
            business: res.data
          })
        }

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
          let ptypeInfo = [];
          for (var ptype of res.data) {
            ptypeInfo.push(ptype.name);
          }
          that.setData({
            projectTypes: ptypeInfo
          })
        }

      },
      fail: function (res) {

      }
    })
  },
  /**
   * 合同管理列表
   */
  getProjectsFromApi: function () {
    var pagination = this.data.pagination;
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "contract/",
      method: 'GET',
      data: {
        page: pagination.page,
        rowsPerPage: pagination.rowsPerPage,
        sortBy: pagination.sortBy,
        descending: pagination.descending,
        search: pagination.search,
        startDate: pagination.startDate,
        endDate: pagination.endDate,
        userGroup: '',
        userAccount: ''
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
    this.setData({
      projectTypeID: e.detail.value,
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

  /***
   *添加合同 
   */
  addContract:function(e){
    var that = this;
    wx.request({
      url: app.globalData.WebUrl + "contract/getContractNumMax/",
      method: 'GET',
      // 设置请求的 header  
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      success: function (res) {
        if (res.statusCode == 200) {
          let cDetail = {};
          cDetail['contractNo'] = res.data;
          that.setData({
            contractNo: res.data,
            addContractShow: true,
            btnName:'添加',
            contractDetail: cDetail,
            contractAddTime:'',
            typeId:0,
            projectTypeID:0
          });
        }

      },
      fail: function (res) {

      }
    });
  },
  /**
   * 选择文件
   */
  chooseFile: function(e){
    wx.chooseFile({
      count: 1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    });

  },
  /**
   * 合同签订时间
   */
  contractAddTimeEvent:function(e){
    console.log(e);
    this.setData({
      contractCalendarShow:true
    })  
  },
  /**
 * 合同日历事件
 */
  contractAddCalendarEvent: function (e) {
    console.log(e);
    //关闭日历控件
    if (e.type == 'showEvent') {
      this.setData({
        contractCalendarShow: false
      })
      return;
    }

    if (e.type == 'setEvent') {
      this.setData({
        contractCalendarShow: false,
        contractAddTime: e.detail.dateInfo
      })
    }
  },
  /**
   * 合同编辑事件
   */
  editEvent:function(e){
    let cDetail = {};
    for(let contract of this.data.tableList){
      if(contract['id'] == e.currentTarget.id){
        let projectTypeID = this.data.projectTypes.indexOf(contract['projectType']);
        let businessId = this.data.businessName.indexOf(contract['contractBusiness']);
        this.setData({
          contractAddTime: contract['contractAddTime'],
          addContractShow: true,
          btnName: '修改',
          contractDetail: contract,
          projectTypeID: projectTypeID,
          businessId: businessId
        })
        break;
      }
    }

  },
  /**
   * 合同类型选择
   */
  radioChange: function(e){
    let cDetail = this.data.contractDetail;
    this.setData({
      typeId: e.detail.value
    }) 
  },
  /**
   * 删除合同事件
   */
  delEvent: function(e){
    var that = this;
    let contractNo = '';
    for (let contract of this.data.tableList) {
      if (contract['id'] == e.currentTarget.id) {
        contractNo = contract['contractNo'];
        break;
      }
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除编号为' + contractNo + '的合同吗？',
      success: function (sm) {
        if (sm.confirm) {
                wx.request({
                  url: app.globalData.WebUrl + 'contract/?contractNo=' + contractNo,
                  header: {
                    'Authorization': "Bearer " + app.globalData.SignToken
                  },
                  method: 'DELETE',
                  success: function (res) {
                    //添加修改成功
                    if (res.statusCode == 200) {
                      that.setData({
                        addContractShow: false
                      })
                      wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                      });
                      that.getProjectsFromApi();
                    }
                  }
                });
              }
            }
      
    });
  },
  /**
   *添加合同取消
   */
  returnDetail:function(e){
    this.setData({
      addContractShow: false
    })
  },
  //表单提交
  formSubmit: function (e) {
    //提交错误描述
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        image: '/images/warn.png',
        duration: 2000
      })
      return false
    }
    var that = this;
    let _url = '';
    if(that.data.btnName == '添加'){
      _url = app.globalData.WebUrl + 'contract/';
    }else{ //修改
      _url = app.globalData.WebUrl + 'contract/update/';
    }
    //提交
    wx.request({
      url: _url,
      data: {
        contractAddTime: that.data.contractAddTime,
        contractAuthorize: e.detail.value.contractAuthorize,
        contractBusiness: that.data.businessName[that.data.businessId],
        contractMoney: e.detail.value.contractMoney,
        contractName: e.detail.value.contractName,
        contractNo: that.data.contractDetail.contractNo,
        contractNote: e.detail.value.contractNote,
        contractUserName: e.detail.value.contractUserName,
        contractUserPhone: e.detail.value.contractUserPhone,
        projectType: that.data.projectTypes[that.data.projectTypeID],
        typeId: that.data.contractDetail.typeId,
      },
      header: {
        'Authorization': "Bearer " + app.globalData.SignToken
      },
      method: 'POST',
      success: function (res) {
        //添加修改成功
        if(res.statusCode == 200){
          that.setData({
            addContractShow: false
          })
          wx.showToast({
            title: res.data.message,
            icon:'success',
            duration: 2000
          });
          that.getProjectsFromApi();
        }
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  }

})