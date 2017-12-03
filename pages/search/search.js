//index.js
//获取应用实例
var WxSearch = require('../../wxSearch/wxSearch.js')
var common = require('../../utils/common.js')
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
var app = getApp()
var that;
var smoodList;
Page({
  data: {
    buttonClicked: false, //是否点击跳转
    tradeType: 0,
    moodList: [],
    isEmpty: true,
    loading: false,

  },
  //选择要查询的活动类型
  choseTradeType: function (e) {
    var tradeType = e.currentTarget.id;
    if (tradeType == 0) this.onShow();
    else if (tradeType == 1) this.setData({moodList: this.data.sportList});
    else if (tradeType == 2) this.setData({ moodList: this.data.gameList });
    else if (tradeType == 3) this.setData({ moodList: this.data.friendList });
    else if (tradeType == 4) this.setData({ moodList: this.data.travelList });
    else if (tradeType == 5) this.setData({ moodList: this.data.readList });
    else if (tradeType == 6) this.setData({ moodList: this.data.contestlist });
    else if (tradeType == 7) this.setData({ moodList: this.data.movieList });
    else if (tradeType == 8) this.setData({ moodList: this.data.musicList });
    else if (tradeType == 9) this.setData({ moodList: this.data.otherList });
    this.setData({
      tradeType: tradeType
    })
  },
  onLoad: function () {
    that = this;
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['一起', '上自习', '开黑组队', '找驴友', '晚上去嗨', '约步走起']);
    WxSearch.initMindKeys(['一起', '上自习', '开黑组队', '找驴友', '晚上去嗨','约步走起']);
  },

  onShow: function () {
    that.setData({
      loading: false
    });
    var molist = new Array();
    var Diary = Bmob.Object.extend("Events");
    var query = new Bmob.Query(Diary);
    query.equalTo("isShow", 1); //只统计公开显示的活动
    query.descending("createdAt");
    query.include("publisher");
    // 查询所有数据
    query.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var publisherId = results[i].get("publisher").objectId;
          var title = results[i].get("title");
          var content = results[i].get("content");
          var acttype = results[i].get("acttype");
          var isShow = results[i].get("isShow");
          var endtime = results[i].get("endtime");
          var address = results[i].get("address");
          var acttypename = getTypeName(acttype);
          var peoplenum = results[i].get("peoplenum");
          var likenum = results[i].get("likenum");
          var liker = results[i].get("liker");
          var isLike = 0;
          var commentnum = results[i].get("commentnum");
          var id = results[i].id;
          var createdAt = results[i].createdAt;
          var pubtime = util.getDateDiff(createdAt);
          var _url
          var actpic = results[i].get("actpic");
          if (actpic) {
            _url = results[i].get("actpic")._url;
          } else {
            _url = "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/01/89a6eba340008dce801381c4550787e4.png";
          }
          var publisherName = results[i].get("publisher").nickname;
          var publisherPic = results[i].get("publisher").userPic;
          var jsonA;
          jsonA = {
            "title": title || '',
            "content": content || '',
            "acttype": acttype || '',
            "isShow": isShow,
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
          smoodList = molist;
          var sportlist = new Array(); //运动
          var gamelist = new Array(); //游戏
          var friendlist = new Array();//交友
          var travellist = new Array();//旅行
          var readlist = new Array();//读书
          var contestlist = new Array();//竞赛
          var movielist = new Array();//电影
          var musiclist = new Array();//音乐
          var otherlist = new Array();//其他
          for (var i in molist){
            if (molist[i].acttype == 1) sportlist.push(molist[i]);
            else if (molist[i].acttype == 2) gamelist.push(molist[i]);
            else if (molist[i].acttype == 3) friendlist.push(molist[i]);
            else if (molist[i].acttype == 4) travellist.push(molist[i]);
            else if (molist[i].acttype == 5) readlist.push(molist[i]);
            else if (molist[i].acttype == 6) contestlist.push(molist[i]);
            else if (molist[i].acttype == 7) movielist.push(molist[i]);
            else if (molist[i].acttype == 8) musiclist.push(molist[i]);
            else if (molist[i].acttype == 9) otherlist.push(molist[i]);
          }
          that.setData({
            moodList: molist,
            sportList:sportlist,
            gameList:gamelist,
            friendList:friendlist,
            travelList:travellist,
            readList:readlist,
            contestlist:contestlist,
            movieList:movielist,
            musicList:musiclist,
            otherList:otherlist,
          })
        }
      },
      error: function (error) {
        common.dataLoading(error, "loading");
        console.log(error)
      }
    });
  },

  
  //js 实现模糊匹配查询
  findEach: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    var strFind = that.data.wxSearchData.value;
    console.log("strFind=" + strFind);
    if (strFind == null || strFind == "") {
      wx.showToast({
        title: '输入为空',
        icon: 'loading',
      })
    }
    if (strFind != "") {
      WxSearch.updateHotMindKeys(that, strFind); //更新热门搜索和搜索记忆提示
      var nPos;
      var resultPost = [];
      for (var i in smoodList) {
        var sTxt = smoodList[i].title || ''; //活动的标题
        nPos = sTxt.indexOf(strFind); 
        if (nPos >= 0) {//如果输入的关键字在该活动标题中出现过,则匹配该活动
          resultPost.push(smoodList[i]); //将该活动加入到搜索到的活动列表中
        }
      }
      that.setData({
        moodList: resultPost
      })
    }
  },

  // 点击活动进入活动详情页面
  click_activity: function (e) {
    console.log(getCurrentPages()) 
    if (!this.buttonClicked) {
      util.buttonClicked(this);
      let actid = e.currentTarget.dataset.actid;
      let pubid = e.currentTarget.dataset.pubid;
      let user_key = wx.getStorageSync('user_key');
      wx.navigateTo ({
        url: '/pages/detail/detail?actid=' + actid + "&pubid=" + pubid
      });
    }
  },
  //--------------------------------------------------------

  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  }
})

//根据活动类型获取活动类型名称
function getTypeName(acttype) {
  var acttypeName = "";
  if (acttype == 1) acttypeName = "运动";
  else if (acttype == 2) acttypeName = "游戏";
  else if (acttype == 3) acttypeName = "交友";
  else if (acttype == 4) acttypeName = "旅行";
  else if (acttype == 5) acttypeName = "读书";
  else if (acttype == 6) acttypeName = "竞赛";
  else if (acttype == 7) acttypeName = "电影";
  else if (acttype == 8) acttypeName = "音乐";
  else if (acttype == 9) acttypeName = "其他";
  return acttypeName;
}