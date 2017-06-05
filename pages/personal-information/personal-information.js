//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');

Page({
  data:{
    userInfo: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  myOrders:function(){
    wx.navigateTo({
      url: '../index/index?user='+this.data.userInfo.nickName
    })    
  },
  myIdenti:function(){
    wx.showModal({
      title: '提示',
      content: '您还没有完成身份补全哦！',
      cancelText: '暂时不要',
      confirmText: '立即补全',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../identity/identity'
          })
        }
      }
    });
  },
  jumpToYN:function(){
    wx.navigateTo({
      url: '../res/aboutyn',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})