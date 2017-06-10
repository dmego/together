//index.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var orderFormat = require('../../utils/orderFormat.js');



function orderRefresh(e, that) {
  //查询多个数据，即首页数据列表查询
  var orders = new AV.Query('orders');
  if (e.hasOwnProperty('user')) {
    orders.equalTo('author.nickName', e.user);
    that.setData({
      manage: {
        user: e.user,
        display: false
      }
    });
  }
  orders.descending('createdAt').find().then(function (results) {
    results = results.map((curvalue) => {
      return orderFormat.orderFormat(curvalue);
    });
    that.setData({
      orders: results
    });
  }, function (error) {

  });
}

Page({
  data: {
    userInfo: {},
    orders: [],
    manage: {},
    QRCodeShow: '',
    QRCodeShowFlag: false
  },


  onLoad: function (e) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
    orderRefresh(e, that);
  },
  onShow: function () {
    orderRefresh({}, this);
  },
  navToDetail: function (event) {
    var objId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?objId=' + objId
    });
  },

  QRCodeTap: function (e) {
    this.setData({
      QRCodeShow: e.target.dataset.qrcode,
      QRCodeShowFlag: true
    });
  },
  hideQRCode: function (e) {
    if (e.target.id === 'QRCode-container') {
      this.setData({
        QRCodeShow: '',
        QRCodeShowFlag: false
      });
    }
  },
})
