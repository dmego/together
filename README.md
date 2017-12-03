# TOGETHER

<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/mjIhk6LFBE.png?imageslim" width="250px" />

[![Build Status](https://travis-ci.org/dmego/together.github.io.svg)](https://travis-ci.org/dmego/together.github.io)
[![Website](https://img.shields.io/website-up-down-green-red/http/together.dmego.me.svg)](http://together.dmego.me/)
[![License](https://img.shields.io/github/license/dmego/together.github.io.svg)](/LICENSE)
[![Say Thanks](https://img.shields.io/badge/Say-Thanks!-1EAEDB.svg)](https://saythanks.io/to/dmego)

[![Watchers](https://img.shields.io/github/watchers/dmego/together.github.io.svg?style=social&label=Watch)](https://github.comdmego/together.github.io/watchers)
[![Stargazers](https://img.shields.io/github/stars/dmego/together.github.io.svg?style=social&label=Star)](https://github.com/dmego/together.github.io/stargazers)
[![Forks](https://img.shields.io/github/forks/dmego/together.github.io.svg?style=social&label=Fork)](https://github.com/dmego/together.github.io/network)

[![Closed Issues](https://img.shields.io/github/issues-closed/dmego/together.github.io.svg)](https://github.com/dmego/together.github.io/issues)
[![Closed Pull Requests](https://img.shields.io/github/issues-pr-closed/dmego/together.github.io.svg)](https://github.com/dmego/together.github.io/pulls)

“让兴趣不再孤单，让爱好不再流浪” 是微信小程序《一起》的主题，这款小程序旨在解决当代大学生在校园生活中的孤独感，让大家找到志同道合的朋友，在跑步、健身、竞赛等活动中找到伙伴。利用小程序即开即用，用完就走的特点与交友相结合，它将会是一款高效快捷、无负担的线下交友利器

本小程序由 [bmob](https://www.bmob.cn/) 后端云提供数据处理与存储支持
<center>
欢迎扫描体验
<center>

</center>
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/1fIA6jdFla.jpg?imageslim" width="250px" />
</center>

## 运行截图 & GIF
<div align="center">
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/7AgDLKB4Jc.gif" width="250" />
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/EbIGLhEbA8.gif" width="250" />
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/7al5JfHhGe.gif" width="250" />

<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/93Cb3BEj9D.gif" width="250" />
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/J3hJk2a7Gg.gif" width="250" />
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/7bJDCm0424.gif" width="250" />

<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/6DmcGmKfBK.gif" width="250" />
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/BgbjB83alh.gif" width="250" />
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/BH5fA5LF0J.gif" width="250" />
<img src="http://ovasw3yf9.bkt.clouddn.com/blog/171203/391kI6DK0m.gif" width="250" />
</div>

## Bmob 配置

### 数据库表结构设计

#### 用户表:(_User，自带表)

	|--objectId //Id
	|--userPic(String) //用户头像
	|--username(String) //用户名
	|--password(String) //密码
	|--nickname(String) //昵称
	|--sex(Number) //性别
	|--userData(Object) //微信登录用户数据
	|--eventJoin(Array) //参加的活动Id 数组Array
	|--eventFavo(Array) //收藏的活动Id 数组Array
    |--feednum(Number) //反馈次数

#### 活动信息表：(Events)

    |--objectId //活动Id
	|--publisher(Pointer-->_User) //发起人
	|--title(String) //活动主题
	|--content(String) //活动内容
	|--actpic(File) //活动宣传照片
	|--acttype(String) //活动类别
    {
        1：运动,2：游戏,3：交友,
        4：旅行,5：读书,6：竞赛,
        7：电影,8: 音乐,9: 其他
    }
    |--isShow(Number) //是否公开显示在首页
	|--endtime(String) //组队截止时间
	|--address(String) //活动地点
	|--latitude(Number)  //地址纬度
	|--longitude(Number) //地址经度
	|--peoplenum(String)//人数限制
	|--likenum(Number)  //点赞数
	|--liker(Array) //点赞人Id集合
	|--commentnum(Number) //评论数
	|--joinnumber(Number) // 现在参加的人数
	|--joinArray(Array) // 现在参加的人集合

#### 活动信息扩展表:(EventMore)

	|--objectId //活动信息扩展表Id
	|--event(Pointer-->Events) //活动
	|--Status(Number) //活动状态,(1:准备中,2:进行中,3:已结束)
	|--Statusname(String) //活动状态名称
	|--qrcode(File) //活动群聊二维码

#### 评论表：(Comments)

	|--objectId //评论Id
	|--publisher(Pointer-->_User) //评论发布者
	|--olderUsername(String) //上一条评论人昵称
	|--olderComment(Pointer-->Comments) //上一条评论
	|--event(Pointer-->Events) //评论的活动
	|--content(String)  //评论内容

#### 点赞表：(Likes)

	|--objectId //点赞的Id
	|--liker(Pointer-->_User) //点赞人
	|--event(Pointer-->Events) //点赞的活动

#### 收藏表:(Favos)

	|--objectId //收藏的Id
	|--favor(Pointer-->_User)  //收藏者
	|--event(Pointer-->Events) //收藏的活动

#### 消息通知表:(Plyre)

    |--objectId //消息通知的Id
	|--fid(String)  //活动发布者Id(被赞或者被取消赞的人的ID,或者被回复,被评论的人的ID)(被通知的人)
	|--uid(Pointer-->_User)   //消息通知人
	|--wid (String) //被赞，或者取消赞，被评论，或者被回复，加入，取消加入的活动id
	|--avatar (String) //消息通知人的头像
	|--username (String) //消息通知人的姓名
	|--is_read(Number) //这条消息是否已读（1代表已读，0代表未读）
	|--bigtype(Number) //消息通知大类(1代表消息，2代表通知)
	|--behavior(Number) //(消息提醒类型)
	{
		1：赞
		2：取消赞
		3：被评论
		4：被回复
		5：加入活动
		6：取消加入活动
		7：修改了加入信息
	}

#### 活动联系表:(Contact)

	|--objectId //联系表Id
	|--publisher(Pointer-->_User)  //活动发布者
	|--currentUser (Pointer-->_User) //当前用户
	|--event(Pointer-->Events)  //想要加入的活动
	|--realname (String) //真实姓名
	|--contactWay(String) //联系方式(微信号,手机号,QQ号)
	|--contactValue(String) //联系方式的号码

#### 反馈表:(Feedback)

	|--objectId //反馈Id
	|--feedUser(Pointer-->_User) //反馈人Id
	|--title(String) //反馈标题
	|--content(String) //反馈内容
	|--feedpic(File) //反馈图片
	|--feedinfo(String) //反馈用户的设备信息 	

### 项目配置

#### 配置小程序密钥和获取应用密钥

将`app.js` 里的这行 `Bmob.initialize("9f106xxxxxxx3fxxxx080", "3xxxwehkfsxxxxxsafxxx");` 代码替换成你的应用程序的对应配置秘钥

既`Bmob.initialize("你的Application ID", "你的REST API Key");`

#### 配置安全域名

在你的微信小程序后台配置你的服务器域名,更为具体的配置请查看 [bmob 文档](https://docs.bmob.cn/data/wechatApp/a_faststart/doc/index.html)