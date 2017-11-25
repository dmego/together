//logs.js
var app = getApp();
Page({
  data: {
    year:2017
  },
  onLoad: function () {
    this.setData({
      year: new Date().getFullYear()
    });
  }
})
