//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    year: 2019,
    userInfo: {}, //用户信息
    hasUserInfo: false //是否或取了用户信息
  },
  
  //跳转到 tabBar 首页
  goToIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  //获取用户信息
  getUserInfo: function(e){
    var that = this;
    if(!that.data.hasUserInfo){ //如果没有获取用户信息,则获取
      app.globalData.userInfo = e.detail.userInfo;
      wx.Bmob.User.upInfo(e.detail.userInfo)
      wx.setStorageSync("userInfo", e.detail.userInfo);
      wx.setStorageSync("hasUserInfo", true);
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      that.goToIndex();
    }else{
      that.goToIndex();
    }
  },

  onLoad: function(){
    var userInfo = wx.getStorageSync("userInfo");
    var hasUserInfo = wx.getStorageSync("hasUserInfo");
    this.setData({
      userInfo: userInfo,
      hasUserInfo: hasUserInfo,
      year: new Date().getFullYear()
    });
  },

  onShow:function(){
    
  },

  onReady: function(){
    var _this = this;
    setTimeout(function(){
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x*30).toFixed(1);
      if(angle>14){ angle=14; }
      else if(angle<-14){ angle=-14; }
      if(_this.data.angle !== angle){
        _this.setData({
          angle: angle
        });
      }
    });
  },
});