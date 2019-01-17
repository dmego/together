//app.js
import Touches from './utils/Touches.js'
var Bmob = require("utils/Bmob-1.6.6.min.js");
var common = require("utils/common.js");
const __utils = require('utils/util')
//初始化 Bmob.initialize("你的Application ID", "你的REST API Key", "你的MasterKey");
Bmob.initialize("6f7c3551fbc3fba5f037dd64d53aaa95", "a46c98dcc588d2cf4713df51cd48e1ad");
App({
  version: 'v3.0.0', //版本号
  onLaunch: function () {
    var that = this;
    
    //一键登录
    Bmob.User.auth().then(res=>{
      console.log("一键登录成功")
      console.log(res);
    })

    //调用系统API获取设备的信息
    wx.getSystemInfo({
      success: function (res) {
        var kScreenW = res.windowWidth / 375
        var kScreenH = res.windowHeight / 603
        wx.setStorageSync('kScreenW', kScreenW)
        wx.setStorageSync('kScreenH', kScreenH)
      }
    })
    
   
  },
  onShow: function () {

  },
  formate_data: function (date) {
    let month_add = date.getMonth() + 1;
    var formate_result = date.getFullYear() + '年'
      + month_add + '月'
      + date.getDate() + '日'
      + ' '
      + date.getHours() + '点'
      + date.getMinutes() + '分';
    return formate_result;
  },

  globalData: {
    userInfo: null,
  },

  onPullDownRefresh: function () {
  },
  onError: function (msg) {
  },
  Touches: new Touches(),
  util: __utils,
})