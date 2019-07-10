// pages/Components/menu-com/menu-com.js
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
    showModalStatus: false,
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
    }
  }
})
