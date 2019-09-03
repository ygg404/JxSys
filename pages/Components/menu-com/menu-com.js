// pages/Components/menu-com/menu-com.js
var utils = require('../../../utils/util.js');
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    urlId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModalStatus: false,
    //项目管理列表
    pmcate_list:[{
      id:'project-management',
      name:'项目处理',
      url:'../../views/project-management/project-management',
      selected:false,
      visiable: true
    },{
        id: 'schedule-management',
        name: '项目进度',
        url: '../../views/schedule-management/schedule-management',
        selected: false,
        visiable: true
    },{
        id: 'project-output',
        name: '项目产值',
        url: '../../views/project-output/project-output',
        selected: false,
        visiable: true
    },{
        id: 'recycle-management',
        name: '项目回收站',
        url: '../../views/recycle-management/recycle-management',
        selected: false,
        visiable: true
    }],
    //项目流程列表
    ppcate_list: [{
      id: 'contract-management',
      name: '合同管理',
      url: '../../views/contract-management/contract-management',
      selected: false,
      visiable: true
    }, {
        id: 'projectsetup-management',
        name: '项目立项',
        url: '../../views/projectsetup-management/projectsetup-management',
        selected: false,
        visiable: true
    }, {
        id: 'allocation-management',
        name: '项目安排',
        url: '../../views/allocation-management/allocation-management',
        selected: false,
        visiable: true
    }, {
        id: 'projectwork-management',
        name: '项目作业',
        url: '../../views/projectwork-management/projectwork-management',
        selected: false,
        visiable: true
      }, {
        id: 'quality-management',
        name: '质量检查',
        url: '../../views/quality-management/quality-management',
        selected: false,
        visiable: true
      }, {
        id: 'output-management',
        name: '产值核算',
        url: '../../views/output-management/output-management',
        selected: false,
        visiable: true
      }, {
        id: 'authorize-management',
        name: '项目审定',
        url: '../../views/authorize-management/authorize-management',
        selected: false,
        visiable: true
      }, {
        id: 'audited-management',
        name: '已审定',
        url: '../../views/audited-management/audited-management',
        selected: false,
        visiable: true
      }],
    //统计报表
    stcate_list:[{
        id: 'output-chart',
        name: '产值统计表',
        url: '../../views/output-chart/output-chart',
        selected: false,
        visiable: true
      },{
        id: 'collect-chart',
        name: '汇总产值统计表',
        url: '../../views/collect-chart/collect-chart',
        selected: false,
        visiable: true
      },{
        id: 'service-chart',
        name: '业务汇总统计表',
        url: '../../views/service-chart/service-chart',
        selected: false,
        visiable: true
      }
    ],

    mcontent: [],
    pcontent: [],
    scontent:[],
    //项目管理列表是否展开
    pmopen:false,
    pmImgUrl: "/images/triup.png",
    //项目流程列表是否展开
    ppopen: false,
    ppImgUrl: "/images/triup.png",
    //统计列表是否展开
    stopen:false,
    stImgUrl:"/images/triup.png",

    active: true,
    

  },

  /**
     * 生命周期函数--页面初始化
     */
  ready: function (options) {
    let pmcate_list = this.data.pmcate_list;
    let ppcate_list = this.data.ppcate_list;
    let stcate_list = this.data.stcate_list;
    let permissionsList = app.globalData.permissions;
    pmcate_list[0].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('project_stage') != -1);
    pmcate_list[1].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('project_schedule') != -1);
    pmcate_list[2].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('start_project') != -1);
    pmcate_list[3].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('get_recycler') != -1);
    ppcate_list[0].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('project_contract') != -1);
    ppcate_list[1].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('put_project') != -1);
    ppcate_list[2].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('make_project') != -1);
    ppcate_list[3].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('start_project') != -1);
    ppcate_list[4].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('inspect_quality') != -1);
    ppcate_list[5].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('adjust_output') != -1);
    ppcate_list[6].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('leader_authorize') != -1);
    ppcate_list[7].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('authorized') != -1);
    stcate_list[0].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('output_chart') != -1);
    stcate_list[1].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('all_output_chart') != -1);
    stcate_list[2].visiable = (permissionsList.indexOf('all_permission') != -1) || (permissionsList.indexOf('all_business') != -1);
    this.setData({
      pmcate_list: pmcate_list,
      ppcate_list: ppcate_list,
      stcate_list: stcate_list
    })

    var pmcatelist = this.data.pmcate_list;
    var ppcatelist = this.data.ppcate_list;
    var stcatelist = this.data.stcate_list;
    for (var pm of pmcatelist) {
      if (pm.id == this.properties.urlId){
        pm.selected = true;
        this.setData({
          pmopen: true,
          pmImgUrl: '/images/tridown.png',
        });
      }
    }
    for (var pp of ppcatelist){
      if (pp.id == this.properties.urlId){
        pp.selected = true;
        this.setData({
          ppopen: true,
          ppImgUrl: '/images/tridown.png',
        });
      }
    }
    for(var st of stcatelist){
      if (st.id == this.properties.urlId){
        st.selected = true;
        this.setData({
          stopen:true,
          stImgUrl: '/images/tridown.png'
        })
      }
    }

    this.setData({
      mcontent : pmcatelist,
      pcontent : ppcatelist,
      scontent : stcatelist
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    quitEvent:function(e){
      wx.navigateTo({
        url: '../../login/login'
      });
    },
    powerDrawer: function (e) {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu);

    },
    util: function (currentStatu) {
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 1000,  //动画时长
        timingFunction: "linear", //线性
        delay: 0  //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      this.animation = animation;

      // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
      animation.translateX(-240).step();

      // 第4步：导出动画对象赋给数据对象储存
      this.setData({
        animationData: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画
      setTimeout(function () {
        // 执行第二组动画：Y轴不偏移，停
        animation.translateX(0).step()
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        this.setData({
          animationData: animation
        })

        //关闭抽屉
        if (currentStatu == "close") {
          this.setData(
            {

              showModalStatus: false
            }
          );
        }

        // 微信小程序中是通过triggerEvent来给父组件传递信息的
        // 将showModalStatus通过参数的形式传递给父组件
        this.triggerEvent('showEvent', { showModalStatus: this.data.showModalStatus });

      }.bind(this), 200)

      // 显示抽屉
      if (currentStatu == "open") {
        this.setData(
          {

            showModalStatus: true
          }
        );
        // 微信小程序中是通过triggerEvent来给父组件传递信息的
        // 将showModalStatus通过参数的形式传递给父组件
        this.triggerEvent('showEvent', { showModalStatus: this.data.showModalStatus });
      }


    },

    closeModel: function (e) {
      this.setData(
        {
          showModalStatus: false
        });
      this.triggerEvent('showEvent', { showModalStatus: this.data.showModalStatus });
    },

    listpm: function (e) {
      var _pmopen = this.data.pmopen;
      this.setData({
        pmopen: !_pmopen,
        ppopen:false,
        stopen:false,
        pmImgUrl: !_pmopen ? '/images/tridown.png' : '/images/triup.png',
        ppImgUrl: '/images/triup.png',
        stImgUrl: '/images/triup.png'
      });
      console.log(e.target)
    },
    listpp: function (e) {
      var _ppopen = this.data.ppopen;
      this.setData({
        ppopen: !_ppopen,
        pmopen: false,
        stopen: false,
        pmImgUrl: '/images/triup.png',
        ppImgUrl: !_ppopen? '/images/tridown.png' : '/images/triup.png',
        stImgUrl: '/images/triup.png'
      });
      console.log(e.target)
    },
    listst:function(e){
      var _stopen = this.data.stopen;
      this.setData({
        ppopen: false,
        pmopen: false,
        stopen: !_stopen,
        pmImgUrl: '/images/triup.png',
        ppImgUrl: '/images/triup.png',
        stImgUrl: !_stopen ? '/images/tridown.png' : '/images/triup.png'
      })
    },
    /**
     * 跳转事件
     */
    navtoEvent:function(e){
      if(e.target.id == this.properties.urlId)return;
      else{
        this.setData({
          showModalStatus : false
        });
        wx.redirectTo({
          url: '../../views/' + e.target.id + '/' + e.target.id
        });
      }
     // console.log(e.target)
    },

  }
})
