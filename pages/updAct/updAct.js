//获取应用实例
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var common = require('../template/getCode.js')
var that;
var optionId;
var publisherId;
var contactId;
var eventMoreId;
var myDate = new Date();
//格式化日期
function formate_data(myDate) {
  let month_add = myDate.getMonth() + 1;
  var formate_result = myDate.getFullYear() + '-'
    + month_add + '-'
    + myDate.getDate()
  return formate_result;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    notice_status: false,
    accounts: ["微信号", "QQ号", "手机号"],
    accountIndex: 0,
    peopleHide: false,
    isAgree: false,
    date: formate_data(myDate),
    address: '点击选择位置',
    longitude: 0, //经度
    latitude: 0,//纬度
    showTopTips: false,
    TopTips: '',
    noteMaxLen: 200,//备注最多字数
    content: "",
    noteNowLen: 0,//备注当前字数
    types: ["运动", "游戏", "交友", "旅行", "读书", "竞赛", "电影", "音乐", "其他"],
    typeIndex: "0",
    showInput: false,//显示输入真实姓名,
  },

  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },


  //字数改变触发事件
  bindTextAreaChange: function (e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      content: value, noteNowLen: len
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    optionId = options.actid;
    publisherId = options.pubid;
    that.setData({//初始化数据
      src: "",
      isSrc: false,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false
    })
    var Diary = Bmob.Object.extend("Events");
    var query = new Bmob.Query(Diary);
    query.equalTo("objectId", optionId);
    query.include("publisher");
    query.find({
      success: function (result) {
        var title = result[0].get("title");
        var content = result[0].get("content");
        var acttype = result[0].get("acttype");
        var endtime = result[0].get("endtime");
        var address = result[0].get("address");
        var peoplenum = result[0].get("peoplenum");
        if (peoplenum > 0) {
          that.setData({
            switchp: true,
            peopleHide: true
          })
        }
        console.log(peoplenum);
        var url;
        if (result[0].get("actpic")) {
          url = result[0].get("actpic")._url;
          that.setData({
            isSrc: true,
          })
        }
        else {
          url = null;
        }
        that.setData({
          title: title,
          typeIndex: acttype - 1,
          address: address,
          date: endtime,
          peoplenum: peoplenum,
          content: content,
          src: url,
          actUrl: url
        })
        that.selfInfo(result[0]);
        that.eventMore(result[0]);
      },
      error: function (error) {
        console.log(error);
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var myInterval = setInterval(getReturn, 500); ////半秒定时查询
    function getReturn() {
      wx.getStorage({
        key: 'user_openid',
        success: function (ress) {
          if (ress.data) {
            clearInterval(myInterval)
            that.setData({
              loading: true
            })
          }
        }
      })
    }
  },

  //--------------查询活动扩展信息------------------
  eventMore: function (event) {
    var Diary = Bmob.Object.extend("EventMore");
    var query = new Bmob.Query(Diary);
    query.equalTo("event", event);
    query.find({
      success: function (result) {
        var id = result[0].id;
        eventMoreId = id;//活动信息扩展表数据Id
        var statusname = result[0].get("Statusname");
        var actstatus = result[0].get("Status");
        var url;
        var qrcode = result[0].get("qrcode");
        if (qrcode) {
          url = result[0].get("qrcode")._url;
          that.setData({
            isCodeSrc: true,
          })
        }
        else {
          url = null;
        }
        that.setData({
          statusname: statusname,
          actstatus: actstatus,
          codeSrc: url,
          QrUrl: url
        })
      }
    })
  },
  //获取活动的加入详情信息
  selfInfo: function (event) {
    var Contacts = Bmob.Object.extend("Contacts");
    var queryJoin = new Bmob.Query(Contacts);
    queryJoin.equalTo("event", event);
    var me = new Bmob.User();
    me.id = publisherId;
    queryJoin.include("publisher", me);
    queryJoin.find({
      success: function (result) {
        var id = result[0].id;
        contactId = id; //联系表中的数据Id
        var adminname = result[0].get("realname"); //加入的人的真实姓名
        var adcontactWay = result[0].get("contactWay"); //联系方式名称
        var adcontactValue = result[0].get("contactValue"); //联系方式
        that.setData({
          realname: adminname,
          accountIndex: getContactIndex(adcontactWay),
          contactValue: adcontactValue,
          loading: true
        })
      },
      error: function (error) {
        common.dataLoadin(error, "loading");
        console.log(error);
      }
    })
  },

  //上传活动图片
  uploadPic: function () {//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          upnew: true,//上传了新图片
          isSrc: true,
          src: tempFilePaths,
        })
      }
    })
  },

  //删除图片
  clearPic: function () {//删除图片
    that.setData({
      isSrc: false,
      src: ""
    })
  },

  //上传活动群二维码
  uploadCodePic: function () {//选择图标
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],//压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          upqrnew: true,
          isCodeSrc: true,
          codeSrc: tempFilePaths
        })
      }
    })
  },

  //删除活动群二维码
  clearCodePic: function () {
    that.setData({
      isCodeSrc: false,
      codeSrc: ""
    })
  },

  //限制人数
  switch1Change: function (e) {
    if (e.detail.value == false) {
      this.setData({
        peopleHide: false
      })
    } else if (e.detail.value == true) {
      this.setData({
        peopleHide: true
      })
    }
  },

  //改变时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //改变活动类别
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //选择地点
  addressChange: function (e) {
    this.addressChoose(e);
  },
  addressChoose: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.name,
          longitude: res.longitude, //经度
          latitude: res.latitude,//纬度
          upadnew: true, //更新了地址
        })
        if (e.detail && e.detail.value) {
          this.data.address = e.detail.value;
        }
      },
      fail: function (e) {
      },
      complete: function (e) {
      }
    })
  },

  //改变联系方式
  bindAccountChange: function (e) {
    this.setData({
      accountIndex: e.detail.value
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
    var wxReg = new RegExp("^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$");
    var qqReg = new RegExp("[1-9][0-9]{4,}");
    var phReg = new RegExp("0?(13|14|15|17|18|19)[0-9]{9}");
    var nameReg = new RegExp("^[\u4e00-\u9fa5]{2,4}$");

    var that = this;
    var title = e.detail.value.title;
    var endtime = this.data.date;
    var typeIndex = this.data.typeIndex;
    var acttype = 1 + parseInt(typeIndex);
    var acttypename = getTypeName(acttype); //获得类型名称
    var address = this.data.address;
    var longitude = this.data.longitude; //经度
    var latitude = this.data.latitude;//纬度
    var switchHide = e.detail.value.switchHide;
    var peoplenum = e.detail.value.peoplenum;
    var content = e.detail.value.content;
    //------发布者真实信息------
    var realname = e.detail.value.realname;
    var contactindex = this.data.accountIndex;

    if (contactindex == 0) {
      var contactWay = "微信号";
    } else if (contactindex == 1) {
      var contactWay = "QQ号";
    } else if (contactindex == 2) {
      var contactWay = "手机号";
    }
    var contactValue = e.detail.value.contactValue;

    //先进行表单非空验证
    if (title == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入主题'
      });
    } else if (address == '点击选择位置') {
      this.setData({
        showTopTips: true,
        TopTips: '请选择地点'
      });
    } else if (switchHide == true && peoplenum == undefined) {
      this.setData({
        showTopTips: true,
        TopTips: '请输入人数'
      });
    } else if (content == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入活动内容'
      });
    } else if (realname == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入真实姓名'
      });
    } else if (realname != "" && !nameReg.test(realname)) {
      this.setData({
        showTopTips: true,
        TopTips: '真实姓名一般为2-4位汉字'
      });
    } else if (contactValue == "") {
      this.setData({
        showTopTips: true,
        TopTips: '请输入联系方式'
      });
    } else if (contactWay == "微信号" && !wxReg.test(contactValue)) {
      this.setData({
        showTopTips: true,
        TopTips: '微信号格式不正确'
      });
    } else if (contactWay == "手机号" && !phReg.test(contactValue)) {
      this.setData({
        showTopTips: true,
        TopTips: '手机号格式不正确'
      });
    } else if (contactWay == "QQ号" && !qqReg.test(contactValue)) {
      this.setData({
        showTopTips: true,
        TopTips: 'QQ号格式不正确'
      });
    } else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })

      //修改Events 表中的数据
      wx.getStorage({
        key: 'user_id',
        success: function (ress) {
          var Diary = Bmob.Object.extend("Events");
          var query = new Bmob.Query(Diary);
          query.get(optionId, {
            success: function (result) {
              result.set("title", title);
              result.set("endtime", endtime);
              result.set("acttype", acttype + "");
              if (that.data.upadnew) { //如果改变了地点
                result.set("address", address);
                result.set("longitude", longitude);//经度
                result.set("latitude", latitude);//纬度
              }
              if (that.data.peopleHide) { //如果设置了人数
                console.log(peoplenum);
                result.set("peoplenum", peoplenum);
              } else if (!that.data.peopleHide) {
                result.set("peoplenum", "-1");
              }
              result.set("content", content);
              if (that.data.upnew == true) { //如果更新了活动图片
                if (that.data.actUrl != null) { //如果已经上传过活动图片
                  var s = new Bmob.Files.del(that.data.actUrl).then(function (res) {
                    if (res.msg == "ok") {
                      console.log('删除旧活动图片成功');
                    }
                  },
                    function (error) {
                      console.log('删除旧活动图片失败');
                      console.log(error)
                    });
                }
                var name = that.data.src; //上传图片的别名
                var file = new Bmob.File(name, that.data.src);
                file.save();
                result.set("actpic", file);
              }
              //修改操作
              result.save(null, {
                success: function (result) {
                  //再将发布者的信息更新到联系表中
                  var Contacts = Bmob.Object.extend("Contacts");
                  var contact = new Bmob.Query("Contacts");
                  contact.get(contactId, {
                    success: function (result) {
                      result.set("realname", realname);
                      result.set("contactWay", contactWay);
                      result.set("contactValue", contactValue);
                      result.save();
                    },
                  });
                  //更新群二维码
                  console.log("that.data.upqrnew=" + that.data.upqrnew);
                  if (that.data.upqrnew == true) { //如果更新了活动图片
                    if (that.data.QrUrl != null) {
                      var s = new Bmob.Files.del(that.data.QrUrl).then(function (res) {
                        if (res.msg == "ok") {
                          console.log('删除旧群二维码成功');
                        }
                      },
                        function (error) {
                          console.log('删除旧群二维码失败');
                          console.log(error)
                        });
                    }
                    var name = that.data.codeSrc; //上传图片的别名
                    var file = new Bmob.File(name, that.data.codeSrc);
                    file.save();
                    var Diary = Bmob.Object.extend("EventMore");
                    var query = new Bmob.Query(Diary);
                    query.get(eventMoreId, {
                      success: function (result) {
                        result.set("qrcode", file);
                        result.save();
                      },
                    });
                  }

                  console.log("修改成功,objectId:" + result.id);
                  that.setData({
                    isLoading: false,
                    isdisabled: false,
                    eventId: result.id,
                  })
                  //添加成功，返回成功之后的objectId(注意，返回的属性名字是id,而不是objectId)
                  common.dataLoading("修改成功", "success", function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  });
                },
                error: function (result, error) {
                  //添加失败
                  console.log("修改失败=" + error);
                  that.setData({
                    isLoading: false,
                    isdisabled: false
                  })
                }
              })
            }
          })
        },
      })
    }
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //查看发起大图
  seeActBig: function (e) {
    wx.previewImage({
      current: that.data.src, // 当前显示图片的http链接
      urls: [that.data.src] // 需要预览的图片http链接列表
    })
  },
  //查看二维码大图
  seeqrCodeBig: function (e) {
    wx.previewImage({
      current: that.data.codeSrc, // 当前显示图片的http链接
      urls: [that.data.codeSrc] // 需要预览的图片http链接列表
    })
  },
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
//根据联系方式确定序号
function getContactIndex(name) {
  var accountIndex = 0;
  if (name == "微信号") accountIndex = 0;
  else if (name == "QQ号") accountIndex = 1;
  else if (name == "手机号") accountIndex = 2;
  return accountIndex;
}