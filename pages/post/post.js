// pages/detail/detail.js
//获取应用实例
var app = getApp();

var warnImg = 'data:image/png;base64,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';
//查询用户信息
const AV = require('../../libs/av-weapp.js');
var pictures = [];
Page({
  data:{
      pictures: [],
      QRCode: '',
      author: {},
      title: '',
      content: '',
      date: '2016-12-20',
      time: '11:19',
      positionData: '点击选择位置',
      discountId: ''
  },
  onLoad:function(options){
    new app.WeToast();
    // 页面初始化 options为页面跳转所带来的参数
    this.data.pictures = [];
    pictures = [];//防止缓存影响
    
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.data.author = userInfo;
      that.data.discountId = options.disId;
      
      if (options.disId){
        
        let detail = {};
        let discount = new AV.Query('discount');   
        discount.equalTo('objectId', that.data.discountId);
        discount.find().then(function (results) {
            
            detail.content = results[0].attributes.content;
            detail.disForm = results[0].attributes.disForm;
            // detail.img = results[0].attributes.background_url;
            pictures.push(results[0].get('background_url'));
            
            that.data.title = detail.content.summary;
            that.data.content = detail.content.detail.join('');
            that.data.date = detail.disForm;
            that.data.time = detail.disForm;
            // that.data.contentpictures = [detail.img];
            that.setData({
                discount: detail,
                pictures: pictures
            });
            
        });
      }
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
  titleEventFunc: function(e) {
      
      if(e.detail && e.detail.value) {
          this.data.title = e.detail.value;
      }
  },
  contentEventFunc: function(e) {
      if(e.detail && e.detail.value) {
          this.data.content = e.detail.value;
      }
  },
  dateEventFunc: function(e) {
      if(e.detail && e.detail.value) {
        this.data.date = e.detail.value;
      }
  },
  timeEventFunc: function(e) {
      if(e.detail && e.detail.value) {
          this.data.time= e.detail.value;
      }
  },
  positionDataEventFunc: function (e) {
    if (e.detail && e.detail.value) {
      this.data.positionData = e.detail.value;
    }
  },
  
 //日期选择
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //时间选择
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  //位置选择
    positionSwitchChange: function(e){
    this.setData({
      position: e.detail.value,
    })
    if(e.detail.value && this.data.positionData === '点击选择位置') {
      this.positionChoose();
    }
  },
  positionChange: function(){
    this.positionChoose();
  },
  positionChoose:function(){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        that.setData({
          positionData:res.name || res.address
        })        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  formSubmit: function(e) {
      /*
      if(this.data.title === '') {
          this.wetoast.toast({
            img: warnImg,
            title: '标题不能为空',
            titleClassName: 'my_wetoast_title'
          });
          return false;
      }else if(this.data.content === ''){
          this.wetoast.toast({
            img: warnImg,
            title: '内容不能为空',
            titleClassName: 'my_wetoast_title'
          });
          return false;
      }else if(this.data.QRCode === ''){
           this.wetoast.toast({
            img: warnImg,
            title: '你的二维码未上传',
            titleClassName: 'my_wetoast_title'
          });
          return false;
      }else if(this.data.pictures.length === 0){
            this.wetoast.toast({
            img: warnImg,
            title: '至少上传一张图片',
            titleClassName: 'my_wetoast_title'
          });
          return false;
      }*/
     

          var orderObj = AV.Object.extend('orders'),
            order = new orderObj();
          order.set('title', this.data.title);
          order.set('content', this.data.content);
          order.set('date', this.data.date);
          order.set('time', this.data.time);
          order.set(' positionData',this.data.positionData);
          order.set('author', this.data.author);
          order.set('pictures', this.data.pictures);
          order.set('discountId', this.data.discountId);
          order.set('QRCode', this.data.QRCode);

          order.save().then(function (order) {
            // 成功保存之后，执行其他逻辑.
            //wx.navigateTo({
            // url: '../index/index'
            //})
            wx.navigateBack();
          }, function (error) {
            // 异常处理
            console.log(error);
          });

  },  
  chooseQRCode: function() {
      //上传图片相关
      var that = this;
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              let tempFilePaths = res.tempFilePaths;
              tempFilePaths.forEach(function(url, index){
                //   pictures.push(url);
                //   that.setData({
                //       pictures: pictures
                //   });
                let strRegex = "(.jpg|.png|.gif|.jpeg)$"; //用于验证图片扩展名的正则表达式
                let re=new RegExp(strRegex);
                if (re.test(url.toLowerCase())){
                    let name = '' + index + '.' + url.split('.')[url.split('.').length - 1],
                        localFile = url,
                        image = new AV.File(name, {
                            blob: {  
                                uri: localFile,  
                            }
                        });
                        image.save().then(function(file) {
                            // 文件保存成功
                            
                            that.setData({
                                QRCode: file.url()
                            });
                            
                        }, function(error) {
                            // 异常处理
                            console.error(error);
                        }); 
                }else {
                    throw "选择的不是图片";
                }
               
              });
          }
      });
  },  
  chooseImage: function() {
      //上传图片相关
      var that = this;
      wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              let tempFilePaths = res.tempFilePaths;
              
              tempFilePaths.forEach(function(url, index){
                //   pictures.push(url);
                //   that.setData({
                //       pictures: pictures
                //   });
                let strRegex = "(.jpg|.png|.gif|.jpeg)$"; //用于验证图片扩展名的正则表达式
                let re=new RegExp(strRegex);
                if (re.test(url.toLowerCase())){
                    let name = '' + index + '.' + url.split('.')[url.split('.').length - 1],
                        localFile = url,
                        image = new AV.File(name, {
                            blob: {  
                                uri: localFile,  
                            }
                        });
                        image.save().then(function(file) {
                            // 文件保存成功
                            
                            pictures.push(file.url());
                            that.setData({
                                pictures: pictures
                            });
                        }, function(error) {
                            // 异常处理
                            console.error(error);
                        }); 
                }else {
                    throw "选择的不是图片";
                }
               
              });
          }
      });
  }
})