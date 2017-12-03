var common = require('../../../utils/common.js')
var Bmob = require("../../../utils/bmob.js");
var util = require('../../../utils/util.js');
var app = getApp()
var that;
Page({
  data: {
    postsList: [], //总的活动
    currentPage: 0, //要跳过查询的页数
    limitPage: 3,//首先显示3条数据（之后加载时都增加3条数据，直到再次加载不够3条）
    isEmpty: false, //当前查询出来的数据是否为空
    totalCount: 0, //总活动数量
    endPage: 0, //最后一页加载多少条
    totalPage: 0, //总页数
  },

  onLoad() {
    var self = this;
  },

  //数据存储
  onSetData: function (data) {
    let page = this.data.currentPage + 1;
    //设置数据
    data = data || [];
    this.setData({
      postsList: page === 1 || page === undefined ? data : this.data.postsList.concat(data),
    });
  },

  //获取总的收藏数
  getAll: function () {
    self = this;
    var Diary = Bmob.Object.extend("Favos");
    var query = new Bmob.Query(Diary);
    query.equalTo("favor",wx.getStorageSync("user_id"));
    query.count({
      success: function (count) {
        var totalPage = 0;
        var endPage = 0;
        if (count % self.data.limitPage == 0) {//如果总数的为偶数
          totalPage = parseInt(count / self.data.limitPage);
        } else {
          var lowPage = parseInt(count / self.data.limitPage);
          endPage = count - (lowPage * self.data.limitPage);
          totalPage = lowPage + 1;
        }
        self.setData({
          totalCount: count,
          endPage: endPage,
          totalPage: totalPage
        })
        if (self.data.currentPage + 1 == self.data.totalPage) {
          self.setData({
            isEmpty: true
          })
        }
        console.log("共有" + count + " 条记录");
        console.log("共有" + totalPage + "页");
        console.log("最后一页加载" + endPage + "条");
      },
    });
  },


  //获取首页列表文章
  fetchPostsData: function (data,endpage) {
    var self = this;
    //获取详询活动信息
    var molist = new Array();
    var Diary = Bmob.Object.extend("Favos");
    var query = new Bmob.Query(Diary);
    query.limit(self.data.limitPage);
    query.skip(3 * self.data.currentPage);
    query.equalTo("favor", wx.getStorageSync("user_id")); //查询出联系表中是我的记录
    query.include("event");
    query.descending("createAt");
    query.include("favor");
    query.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var publisherId = results[i].get("event").publisher.objectId;
          var title = results[i].get("event").title;
          var content = results[i].get("event").content;
          var acttype = results[i].get("event").acttype;
          var endtime = results[i].get("event").endtime;
          var address = results[i].get("event").address;
          var acttypename = results[i].get("event").acttypename;
          var peoplenum = results[i].get("event").peoplenum;
          var likenum = results[i].get("event").likenum;
          var liker = results[i].get("event").liker;
          var isLike = 0;
          var commentnum = results[i].get("event").commentnum;
          var id = results[i].get("event").objectId;
          var createdAt = results[i].createdAt;
          var pubtime = util.getDateDiff(createdAt);
          var publisherName = results[i].get("favor").nickname;
          var publisherPic = results[i].get("favor").userPic;
          var _url
          var actpic = results[i].get("event").actpic;
          if (actpic) {
            _url = results[i].get("event").actpic.url;
          } else {
            _url = "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/01/89a6eba340008dce801381c4550787e4.png";
          }
          var jsonA;
          jsonA = {
            "title": title || '',
            "content": content || '',
            "acttype": acttype || '',
            "acttypename": acttypename || '',
            "endtime": endtime || '',
            "address": address || '',
            "peoplenum": peoplenum || '',
            "id": id || '',
            "publisherPic": publisherPic || '',
            "publisherName": publisherName || '',
            "publisherId": publisherId || '',
            "pubtime": pubtime || '',
            "actPic": _url || '',
            "likenum": likenum,
            "commentnum": commentnum,
            "is_liked": isLike || ''
          }
          molist.push(jsonA);
        }
        self.onSetData(molist, self.data.currentPage);

        setTimeout(function () {
          wx.hideLoading();
        }, 900);
      },
      error: function (error) {
        console.log(error)
      }
    })
  },

  //加载下一页
  loadMore: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    //一秒后关闭加载提示框
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    var self = this;
    self.setData({
      currentPage: self.data.currentPage + 1
    });
    console.log("当前页" + self.data.currentPage);
    //先判断是不是倒数第二页
    if (self.data.currentPage + 1 == self.data.totalPage) {
      self.setData({
        isEmpty: true
      })
      if (self.data.endPage != 0) { //如果最后一页的加载不等于0
        self.setData({
          limitPage: self.data.endPage,
        })
      }
      this.fetchPostsData(self.data);
    }else{
      this.fetchPostsData(self.data);
    }
  },

  onShow: function () {
    this.getAll();
    this.fetchPostsData();
  },

  // 点击活动进入活动详情页面
  click_activity: function (e) {
    let actid = e.currentTarget.dataset.actid;
    let pubid = e.currentTarget.dataset.pubid;
    let user_key = wx.getStorageSync('user_key');
    wx.navigateTo({
      url: '/pages/detail/detail?actid=' + actid + "&pubid=" + pubid
    });
  },

})
