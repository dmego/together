// pages/privilege-detail/privilege-detail.js
const AV = require('../../libs/av-weapp.js');
function ordersRefresh(that, option) {
  let order = new AV.Query('orders');
    order.equalTo('discountId', option.id);
    order.find().then(function (res){ 
      for(let i=0;i<res.length;i++){
        res[i].attributes.id = res[i].id ;
        res[i] = res[i].attributes;
      }
      that.setData({
        orders: res
      });  
    }); 
}
Page({
  data:{
    discount:{},
    orders:[],
    option: {}
  },
  onLoad:function(option){
    this.data.option = option;
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    let detail = {};
    let discount = new AV.Query('discount');   
    discount.equalTo('objectId', option.id);
    discount.find().then(function (results) {
      detail.title = results[0].get('title');
      detail.content = results[0].get('content');
      detail.praise = results[0].get('praise');
      detail.id = results[0].id; 
      detail.background_url = results[0].get('background_url');
      
      that.setData({
          discount: detail
        });
    });

    ordersRefresh(that, option);
          
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    ordersRefresh(this, this.data.option);
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  seeOrder:function(e){
     wx.navigateTo({
      url: '../detail/detail?objId='+e.currentTarget.dataset.id
    })
  },
  makeOrder:function(){
    wx.navigateTo({
      url: '../post/post?disId='+this.data.discount.id
    })
  },
  onShareAppMessage:function(){
    return{
      title:"我要拼单",
      path:"./page/user?id=123"
    }
  }
})