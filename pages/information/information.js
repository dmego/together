const AV = require('../../libs/av-weapp.js')
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
  },


	navigateToAboutyn: function () {
		wx.navigateTo({
      url: '../aboutyn/aboutyn'
		});
	},
	navigateTomylaunch: function (e) {
		wx.navigateTo({
      url: '../mylaunch/mylaunch'
		});
	},

	navigateToIntroduct: function () {
		wx.navigateTo({
      url: '../introduction/introduction'
		});
	},
	navigateToAlbum: function () {
		wx.navigateTo({
      url: '../album/album'
		});
	}
})