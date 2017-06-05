// pages/detail/detail.js
//获取应用实例
var app = getApp();
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var orderFormat = require('../../utils/orderFormat.js'),
  util = require('../../utils/util.js');
Page({
  data:{
    url: "http://wx.qlogo.cn/mmhead/kpUbvkMbNAdpQbvZBgncDWcRg7m4Dfkvy1cpIVNhdt8/132",
    scrollX: true,
    scrollY: true,
    userInfo: {},
    order: {},
    comments: [],
    commentObj: {},
    QRCodeShowFlag: false,
    QRCodeShow: ''
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
      // 查询单个对象
    var orders = new AV.Query('orders');
    orders.get(options.objId).then(order => {
      order = orderFormat.orderFormat(order);
      that.setData({
        order: order
      });
      if( that.data.order.comments && that.data.order.comments.length > 0) {
        that.data.comments = that.data.order.comments;
      }
    }, error => console.log(error));
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
  commentInput: function(e){
    this.data.commentObj.author = this.data.userInfo;
    this.data.commentObj.commentStr = e.detail.value;
    this.data.commentObj.createAt = new Date();
    this.data.commentObj.formatDate = util.formatTime(this.data.commentObj.createAt);
  },
  commentSubmit: function(e) {
    if(!this.data.commentObj.commentStr || this.data.commentObj.commentStr === ''){
      wx.showToast({
        title: '评论为空',
        duration: 2000
      });
      return false;
    }
    this.data.comments.unshift(this.data.commentObj);

    var order = AV.Object.createWithoutData('orders', this.data.order.id);
    order.set('comments', this.data.comments);
    order.save().then(order => {
      wx.redirectTo({
        url: './detail?objId=' + this.data.order.id 
      });
    }, (error) => {
        throw error;
    });
  },
  showQRCode: function(e) {
    this.setData({
      QRCodeShow: e.target.dataset.qrcode,
      QRCodeShowFlag: true
    });
  },
  hideQRCode: function(e){
    if(e.target.id === 'QRCode-container') {
      this.setData({
        QRCodeShow: '',
        QRCodeShowFlag: false
      });
    }
  },
   onShareAppMessage:function(){
    return{
      title:"和我一起吗",
      path:"./page/user?id=123"
    }
  }
})