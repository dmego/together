const AV = require('../../libs/av-weapp.js');
var discountFormat = require('../../utils/discountFormat.js');

Page({
  data:{
    discount:[]
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参
    var that = this;
    let disc = [];
    let discount = new AV.Query('discount');
    discount.descending('createdAt').find().then(function (results) {
      
      // for (let i=0; i<results.length; i++){
      //   results[i].attributes.id = results[i].id;
      //   disc.push(results[i].attributes);
      // }
      results = results.map((curvalue) => {
        return discountFormat.discountFormat(curvalue);
      });
      
      that.setData({
        discount: results
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
  seeDetail:function(e){
    let disId = e.currentTarget.dataset.id;
    wx.navigateTo({
        url: "../privilege-detail/privilege-detail?id="+disId
    })

    //   var discount = AV.Object.extend('discount');
    //   var title = '奥妙199减100';
    //   var content = {
    //     summary: '奥妙去渍好功夫，京东特别福利 ',
    //     item1: '三重好礼等你拿',
    //     item2: '一重礼：买任意产品赢《功夫熊猫3》电影票2张',
    //     item3: '二重礼：买任意产品赢功夫熊猫官方玩偶',
    //     item4: '三重礼：满99元送定制熊猫围巾1条,满199元送定制熊猫围巾2条'
    //   };
    //   var orders = [{
    //     author:'二愣子', 
    //     status:'凑单完成完成'
    //   },{
    //     author:'三傻子', 
    //     status:'待凑单'
    //   }];
    //   var praise = '248';

    // var discount = new discount();
    // discount.set('title', title);
    // discount.set('content', content);
    // discount.set('orders', orders);
    // discount.set('praise', praise);

    // discount.save().then(function(testObject) {
    //   console.log('成功');
    // }, function(error) {
    //   console.log('失败');
    // });
  }


})