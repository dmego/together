//获取应用实例
var app = getApp();
var name = '';
var password = '';
Page({
  data: {
    //button属性设置
    button: {
      primarySize: 'mini',
      plain: false
    },
    //modal属性设置
    modal: {
      modalHidden: true,
      modalContent: ''
    },
    userInfo: {},
    animationData: {}
  },
  /**********************************************
   *  native event functions                                           
   **********************************************/
  //绑定input变化
  bindChange: function (e) {
    if (e.target.id == 'name') {
      name = e.detail.value;
    } else {
      password = e.detail.value;
    }
  },
  //modal框
  modalChange: function (modal) {
    this.setData({
      modal: modal
    });
  },
  modalClose: function () {
    var modal = {
      modalHidden: true,
      modalContent: ''
    };
    this.setData({
      modal: modal
    });
  },
  /**********************************************
   *  user event functions                                           
   **********************************************/
  //登录
  submit: function () {
    if (name == '') {
      var modal = {
        modalHidden: false,
        modalContent: '请输入用户名'
      };
      this.modalChange(modal);
    } else if (password == '') {
      var modal = {
        modalHidden: false,
        modalContent: '请输入密码'
      };
      this.modalChange(modal);
    } else {
      if (name == 'go' && password == 'go') {
        wx.switchTab ({
          url: '../index/index'
        })
      } else {
        var modal = {
          modalHidden: false,
          modalContent: '用户名或密码错误'
        };
        this.modalChange(modal);
      }
    }
  },
  // 旋转、放大、平移
  animation_1: function () {
    this.animation.rotate(360).translate(0, -50).scale(1.5, 1.5).step({duration: 2000})
    this.setData({
      animationData: this.animation.export()
    })
  },
  // 旋转、缩小、平移
  animation_2: function () {
    this.animation.rotate(360).translate(0, 0).scale(1, 1).step({duration: 2000})
    this.setData({
      animationData: this.animation.export()
    })
  },
  /**********************************************
   *  life cycle functions                                           
   **********************************************/
  onShow: function () {
    var animation = wx.createAnimation({
      timingFunction: 'ease'
    })
    this.animation = animation;
    this.animation_1();
    var that = this;
    setTimeout(function(){that.animation_2();},2000);
  
    this.setData({
      animationData: animation.export()
    })

  },
});
