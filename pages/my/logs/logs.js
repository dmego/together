var app = getApp();
Page({
  data: {
    version: '',
  },
  onLoad: function () {
    this.setData({
      version: app.version,
      year: new Date().getFullYear()
    });
  },
});