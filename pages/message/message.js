//获取应用实例
const App = getApp()
var that;
var common = require('../template/getCode.js');
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
Page({
  data: {
    infoList: [],
    noticeList: [],
  },
  //删除通知
  deletePlyre: function (e) {
    var id = e.currentTarget.dataset.id; //消息通知的id
    var Plyre = Bmob.Object.extend("Plyre");
    var plyre = new Bmob.Query(Plyre);
    plyre.get(id, {
      success: function (result) {
        result.destroy({
          success: function (myObject) {
            common.dataLoading("删除成功", "success");
            console.log("删除消息成功");
            that.onShow();
          },
          error: function (myObject, error) {
            console.log(error);
          }
        })
      },
      error: function (result, error) {
        console.log(error);
      }
    })

  },
  //-----------滑动删除消息---------------------------
  touchSInfo: function (e) {  // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchMInfo: function (e) {  // touchmove
    let infoList = App.Touches.touchM(e, this.data.infoList, this.data.startX)
    infoList && this.setData({ infoList })
  },
  touchEInfo: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let infoList = App.Touches.touchE(e, this.data.infoList, this.data.startX, width)
    infoList && this.setData({ infoList })
  },
  infoDelete: function (e) {  // itemDelete
    let infoList = App.Touches.deleteItem(e, this.data.infoList)
    infoList && this.setData({ infoList })
    this.deletePlyre(e);
  },
  //-------------------------------------------------------
  //-----------滑动删除通知---------------------------
  touchSNotice: function (e) {  // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchMNotice: function (e) {  // touchmove
    let noticeList = App.Touches.touchM(e, this.data.noticeList, this.data.startX)
    noticeList && this.setData({ noticeList })
  },
  touchENotice: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let noticeList = App.Touches.touchE(e, this.data.noticeList, this.data.startX, width)
    noticeList && this.setData({ noticeList })
  },
  noticeDelete: function (e) {  // itemDelete
    let noticeList = App.Touches.deleteItem(e, this.data.noticeList)
    noticeList && this.setData({ noticeList })
    this.deletePlyre(e);
  },
  //-------------------------------------------------------

  //点击阅读消息通知详情
  readDetail: function (event) {
    console.log(event);
    var id = event.currentTarget.dataset.id; //消息通知的id
    var wid = event.currentTarget.dataset.wid;//活动的id
    var fid = event.currentTarget.dataset.fid;//活动发布者的Id
    console.log("消息通知的id" + id + ",活动的id=" + wid + ",活动发布者ID=" + fid);
    var Plyre = Bmob.Object.extend("Plyre");
    var plyre = new Bmob.Query(Plyre);
    plyre.get(id, {
      success: function (result) {
        result.set("is_read", 1);
        result.save();
      },
      error: function (result, error) {
        console.log(error);
      }
    })
    wx.navigateTo({
      url: '/pages/detail/detail?actid=' + wid + "&pubid=" + fid
    })
  },


  onLoad: function (options) {
    that = this;
    that.setData({
      loading: false,
    })
  },
  onReady: function () {
    wx.hideToast()
  },

  onShow: function () {
    var user_id = wx.getStorageSync('user_id')
    var me = new Bmob.User();
    me.id = user_id;
    //**********查询未读通知****************************************** */
    //先查询未读消息有多少条
    var Diary = Bmob.Object.extend("Plyre");
    var query = new Bmob.Query(Diary);
    query.equalTo("is_read", 0);
    query.equalTo("fid", user_id);
    query.equalTo("bigtype", 2); //查询通知类的动态信息
    query.count({
      success: function (count) {
        console.log("共有 " + count + " 条未读通知");
        that.setData({
          noticeCount: count
        });
      },
      error: function (error) {
      }
    });
    //再查询全部通知，包括已读
    var Plyre = Bmob.Object.extend("Plyre");
    var plyre = new Bmob.Query(Plyre);
    plyre.equalTo("fid", user_id);
    plyre.equalTo("bigtype", 2); //查询消息类的动态信息
    plyre.limit(50);
    plyre.descending("createdAt"); //按照时间降序
    var noticeList = new Array();
    plyre.find({ //查询通知的详细信息，并返回显示
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          var id = result[i].id; //消息的id
          var is_read = result[i].get("is_read");
          if (is_read == 0) {
            var status = "未读";
          } else if (is_read == 1) {
            var status = "已读";
          }
          var username = result[i].get("username");
          var avatar = result[i].get("avatar");
          var createdAt = result[i].createdAt;
          var pubtime = util.getDateDiff(createdAt);
          var behavior = result[i].get("behavior"); //消息的类型（5：参加活动，6：取消参加活动）
          if (behavior == 5) {
            var message = "加入了你的发起";
          } else if (behavior == 6) {
            var message = "取消加入了你的发起";
          } else if (behavior == 7){
            var message = "修改了联系信息";
          }
          var wid = result[i].get("wid"); //活动的id
          var fid = result[i].get("fid");//活动发布者的id
          var jsonA;
          jsonA = {
            "id": id || '',
            "is_read": is_read,
            "status": status || '',
            "username": username || '',
            "time": pubtime || '',
            "avatar": avatar || '',
            "message": message || '',
            "wid": wid || '',
            "fid": fid || '',
          }
          noticeList.push(jsonA);
        }
        console.log(noticeList);
        that.setData({
          noticeList: noticeList
        })
      }
    })
    //********************************************************** */

    //****************查询未读消息********************************** */
    //先查询未读消息有多少条
    var Diary = Bmob.Object.extend("Plyre");
    var query = new Bmob.Query(Diary);
    query.equalTo("is_read", 0);
    query.equalTo("fid", user_id);
    query.equalTo("bigtype", 1); //查询消息类的动态信息
    query.count({
      success: function (count) {
        console.log("共有 " + count + " 条未读消息");
        that.setData({
          infoCount: count
        });
      },
      error: function (error) {
      }
    });
    //再查询全部消息，包括已读
    var Plyre = Bmob.Object.extend("Plyre");
    var plyre = new Bmob.Query(Plyre);
    plyre.equalTo("fid", user_id);
    plyre.equalTo("bigtype", 1); //查询消息类的动态信息
    plyre.limit(50);
    plyre.descending("createdAt"); //按照时间降序
    var infoList = new Array();
    plyre.find({ //查询消息的详细信息，并返回显示
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          var id = result[i].id; //消息的id
          var is_read = result[i].get("is_read");
          if (is_read == 0) {
            var status = "未读";
          } else if (is_read == 1) {
            var status = "已读";
          }
          var username = result[i].get("username");
          var avatar = result[i].get("avatar");
          var createdAt = result[i].createdAt;
          var pubtime = util.getDateDiff(createdAt);
          var behavior = result[i].get("behavior"); //消息的类型（1：点赞；2：取消赞，3：被评论；4：被回复）
          if (behavior == 1) {
            var message = "赞了你的发起";
          } else if (behavior == 2) {
            var message = "取消赞了你的发起";
          } else if (behavior == 3) {
            var message = "评论了你的发起";
          } else if (behavior == 4) {
            var message = "回复了你的发起";
          }
          var wid = result[i].get("wid"); //活动的id
          var fid = result[i].get("fid");//活动发布者的id
          var jsonA;
          jsonA = {
            "id": id || '',
            "is_read": is_read,
            "status": status || '',
            "username": username || '',
            "time": pubtime || '',
            "avatar": avatar || '',
            "message": message || '',
            "wid": wid || '',
            "fid": fid || '',
          }
          infoList.push(jsonA);
        }
        console.log(infoList);
        that.setData({
          infoList: infoList,
          loading: true
        })
      }
    })
    //********************************************************** */
  },

  //下拉刷新
  onPullDownRefresh:function(){
    this.onShow()
  }
})
