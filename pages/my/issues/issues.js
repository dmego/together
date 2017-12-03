//issues.js
//获取应用实例
var common = require('../../../utils/common.js')
var Bmob = require("../../../utils/bmob.js");
var util = require('../../../utils/util.js');
var common = require('../../template/getCode.js')
var app = getApp();
var that;
var username = wx.getStorageSync("my_nick");
var openid = wx.getStorageSync("user_openid");
var userid = wx.getStorageSync("user_id");
Page({
  data: {
    list_remind: '加载中',
    status: false,  //是否显示列表
    itemopen:false,
    feednum: 0, //反馈的次数
    hasFeed: false,
    title: '',
    content: '',
    info: '',
    showTopTips: false,
    TopTips: '',
  },
  onLoad: function () {
    that = this;
    that.setData({//初始化数据
      src: "",
      isSrc: false,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false
    })

    //获取设备和用户信息
    wx.getSystemInfo({
      success: function (res) {
        var info = '---\r\n**用户信息**\r\n';
        info += '用户名：' + username;
        info += '\r\n手机型号：' + res.model;
        info += '（' + res.platform + ' - ' + res.windowWidth + 'x' + res.windowHeight + '）';
        info += '\r\n微信版本号：' + res.version;
        info += '\r\nTogether版本号：' + app.version;
        that.setData({
          info: info
        });
        console.log(info);
      }
    });
    
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    wx.hideToast()

  },
  onShow:function(){
    console.log("调用onShow")
    this.getIssue();
  },
  //获取评论信息
  getIssue: function () {
    //或取总的反馈次数
    var userQuery = new Bmob.Query(Bmob.User);
    userQuery.equalTo("objectId", userid);
    userQuery.find({
      success: function (result) {
        var feednum = result[0].get("feednum");
        console.log("feednum=" + feednum);
        if (feednum != 0) {
          that.setData({
            feednum: feednum,
            hasFeed: true,
          })
        }
      }
    })
    var self = this;
    var molist = new Array();
    var Diary = Bmob.Object.extend("Feedback");
    var query = new Bmob.Query(Diary);
    var me = new Bmob.User();
    me.id = wx.getStorageSync("user_id");
    query.equalTo("feedUser", me);
    query.include("feedUser");
    query.descending("createAt");
    query.find({
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          var feedUserId = result[i].get("feedUser").objectId;
          var title = result[i].get("title");
          var content = result[i].get("content");
          var id = result[i].id;
          var createdAt = result[i].createdAt;
          var pubtime = util.getDateDiff(createdAt);
          var _url;
          var feedpic = result[i].get("feedpic");
          if (feedpic) {
            _url = result[i].get("feedpic")._url;
          } else {
            _url = "http://ovasw3yf9.bkt.clouddn.com/blog/171126/31GdaHlkh4.jpg?imageslim";
          }
          var publisherName = result[i].get("feedUser").nickname;
          var publisherPic = result[i].get("feedUser").userPic;
          var jsonA;
          jsonA = {
            "title": title || '',
            "content": content || '',
            "publisherPic": publisherPic || '',
            "publisherName": publisherName || '',
            "pubtime": pubtime || '',
            "feedpic": _url || '',
            "feedUserId": feedUserId || '',
            "id": id || '',
          }
          molist.push(jsonA);
          that.setData({
            feedList: molist
          })
        }
      }
    })

  },

  openList: function (e) {
    that.setData({
      'status': !that.data.status
    });
  },

  openItem: function (e) {
    var index = e.currentTarget.dataset.index;
    if (index != that.data.itemopen) {
      that.setData({
        'itemopen': index
      });
    }
  },

  //上传图片
  uploadPic: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '上传图片需要消耗流量，是否继续？',
      confirmText: '继续',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              that.setData({
                isSrc: true,
                src: tempFilePaths
              })
            }
          })
        }
      }
    });
  },

  //删除图片
  clearPic: function () {//删除图片
    that.setData({
      isSrc: false,
      src: ""
    })
  },

  //表单验证
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  //提交表单
  submitForm: function (e) {
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    //先进行表单非空验证
    if (title == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入反馈标题'
      });
    } else if (content == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入反馈内容'
      });
    } else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      wx.showModal({
        title: '提示',
        content: '是否确认提交反馈',
        success: function (res) {
          if (res.confirm) {
            wx.getStorage({
              key: 'user_id',
              success: function (ress) {
                var Diary = Bmob.Object.extend("Feedback");
                var diary = new Diary();
                var me = new Bmob.User();
                me.id = ress.data;
                diary.set("feedUser", me);
                diary.set("title", title);
                diary.set("content", content);
                diary.set("feedinfo", that.data.info);
                if (that.data.isSrc == true) {
                  var name = that.data.src; //上传图片的别名
                  var file = new Bmob.File(name, that.data.src);
                  file.save();
                  diary.set("feedpic", file);
                }
                diary.save(null, {
                  success: function (result) {
                    //该用户的反馈次数加1
                    wx.getStorage({
                      key: 'my_username',
                      success: function (ress) {
                        var my_username = ress.data;
                        wx.getStorage({
                          key: 'user_openid',
                          success: function (res) { //将该文章的Id添加到我的收藏中，或者删除
                            var openid = res.data;
                            var user = Bmob.User.logIn(my_username, openid, {
                              success: function (user) {
                                var feednum = user.get("feednum");
                                user.set("feednum", feednum + 1);
                                user.save();
                              }
                            })
                          }
                        });
                      },
                    })
                    console.log("反馈成功");
                    that.setData({
                      isLoading: false,
                      isdisabled: false,
                      eventId: result.id,
                      feednum:that.data.feednum+1,
                    })
                    //添加成功，返回成功之后的objectId(注意，返回的属性名字是id,而不是objectId)
                    common.dataLoading("反馈成功", "success", function () {
                      //重置表单
                      that.setData({
                        title: '',
                        content: "",
                        src: "",
                        isSrc: false,
                      })
                    });
                  },
                  error: function (result, error) {
                    //添加失败
                    console.log("反馈失败=" + error);
                    that.setData({
                      isLoading: false,
                      isdisabled: false
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  }

});
