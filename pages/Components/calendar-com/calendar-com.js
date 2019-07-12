// pages/Components/calendar-com/calendar-com.js
/**
 * 日历控件
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currentDate: "",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    currentClickKey: '',
    currentMonth: '', //选中的月份
    currentYear: '', //选中的年份
    nowYear: '',  //现在的年份
    nowMonth: ''  //现在的月份
  },

  /**
     * 生命周期函数--页面初始化
     */
  ready: function (options) {
    var currentObj = this.getCurrentDayString();
    var now = new Date();
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
      currentDay: currentObj.getDate(),
      currentObj: currentObj,
      currentMonth: currentObj.getMonth() + 1,
      currentYear: currentObj.getFullYear(),
      nowMonth: now.getMonth() + 1,
      nowYear: now.getFullYear()
    })
    this.setSchedule(currentObj);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    doDay: function (e) {
      var that = this
      var currentObj = that.data.currentObj
      var Y = currentObj.getFullYear();
      var m = currentObj.getMonth() + 1;
      var d = currentObj.getDate();
      var str = ''
      if (e.currentTarget.dataset.key == 'left') {
        m -= 1
        if (m <= 0) {
          str = (Y - 1) + '/' + 12 + '/' + d
        } else {
          str = Y + '/' + m + '/' + d
        }
      } else {
        m += 1
        if (m <= 12) {
          str = Y + '/' + m + '/' + d
        } else {
          str = (Y + 1) + '/' + 1 + '/' + d
        }
      }
      currentObj = new Date(str)
      this.setData({
        currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月',
        currentObj: currentObj,
        currentMonth: currentObj.getMonth() + 1,
        currentYear: currentObj.getFullYear()
      })
      this.setSchedule(currentObj);
    },
    getCurrentDayString: function () {
      var objDate = this.data.currentObj
      if (objDate != '') {
        return objDate
      } else {
        var c_obj = new Date()
        var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
        return new Date(a)
      }
    },
    setSchedule: function (currentObj) {
      var that = this
      var m = currentObj.getMonth() + 1
      var Y = currentObj.getFullYear()
      var d = currentObj.getDate();
      var dayString = Y + '/' + m + '/' + currentObj.getDate()
      var currentDayNum = new Date(Y, m, 0).getDate()
      var currentDayWeek = currentObj.getUTCDay() + 1
      var result = currentDayWeek - (d % 7 - 1);
      var firstKey = result <= 0 ? 7 + result : result;
      var currentDayList = []
      var f = 0
      for (var i = 0; i < 42; i++) {
        let data = []
        if (i < firstKey - 1) {
          currentDayList[i] = ''
        } else {
          if (f < currentDayNum) {
            currentDayList[i] = f + 1
            f = currentDayList[i]
          } else if (f >= currentDayNum) {
            currentDayList[i] = ''
          }
        }
      }
      that.setData({
        currentDayList: currentDayList
      })
    },

    PrefixInteger:function(num, n) {
      return(Array(n).join(0) + num).slice(-n);
    },

    // 设置点击事件
    onClickItem: function (e) {
      this.setData({
        currentClickKey: e.currentTarget.id
      });
      var DateInfo = this.data.currentYear + '-' + (Array(2).join(0) + this.data.currentMonth).slice(-2) 
        + '-' + (Array(2).join(0) + (e.currentTarget.id + 1 ,2) ).slice(-2) ;
      this.triggerEvent('showEvent', { dateInfo: DateInfo });
    },

    //日历控件取消事件
    cancelEvent: function (e) {
      console.log(e);
      this.triggerEvent('showEvent', { showCalendar: false });

    }
  }
})
