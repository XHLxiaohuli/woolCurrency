export const api={
	wx_config:'/api/share/wxShare.do',//微信配置
	/*user-account-controller*/
	account_wxinpaynotify: '/api/account/wxinpayNotify',//微信支付异步回调

	/*公告模块*/
	notice_detail:"/api/notice/queryNoticeDetails.do",//获取公告信息详情接口
	notice_list: '/api/notice/queryNoticeListPage.do',//分页获取公告信息

	/*帖子模块*/
	vote_add: '/api/vote/forum/add.do',//主页的发帖子
	vote_collection_add: '/api/vote/forum/collection/add.do',//帖子收藏
	vote_collection_del: '/api/vote/forum/collection/del.do',//帖子取消收藏
	vote_comment_add: '/api/vote/forum/comment/add.do',//帖子评论
	vote_comment_del: '/api/vote/forum/comment/del.do',//帖子删除评论
	vote_comment_list: '/api/vote/forum/comment/list.do',//帖子评论列表（分页）
	vote_comment_replyadd: '/api/vote/forum/comment/replyAdd.do',//帖子评论回复
	vote_comment_replydel: '/api/vote/forum/comment/replyDel.do',//帖子评论删除
	vote_comment_replylist: '/api/vote/forum/comment/replyList.do',//帖子评论回复列表
	vote_details: '/api/vote/forum/details.do',//帖子详情
	vote_list: '/api/vote/forum/list.do',//主页的帖子列表
	vote_loves_add: '/api/vote/forum/loves/add.do',//帖子点赞
	vote_loves_del: '/api/vote/forum/loves/del.do',//帖子取消点赞
	vote_mycollectionforumlist: '/api/vote/forum/myCollectionForumList.do',//我的收藏列表

	/*用户模块*/

	user_forgetpassword: '/api/user/forgetPassword.do',//忘记密码找回密码
	user_getaddressbyip: '/api/user/getAddressByIP.do',//根据用户ip地址获取地址位置
	user_getuserinfo: '/api/user/getUserInfo.do',//获取用户信息
	user_logout: '/api/user/logOut.do',//退出登录
	user_login: '/api/user/login.do',//用户登录
	user_register: '/api/user/register.do',//用户注册
	user_registerverification: '/api/user/registerVerification.do',//用户注册验证-验证码手机号和邀请码
	user_savefeedback: '/api/user/saveFeedback.do',//用户意见反馈
	user_saveusercertification: '/api/user/saveUserCertification.do',//用户实名认证
	user_saveusertoken: '/api/user/saveUserToken.do',//添加用户每天访问量
	user_updatepassword: '/api/user/updatePassword.do',//修改密码
	user_updateuserinfo: '/api/user/updateUserInfo.do',//修改用户信息
	user_updateuserphone: '/api/user/updateUserPhone.do',//更换手机号
	user_verificationphoneisreg: '/api/user/verificationPhoneIsReg.do',//检测手机号是否注册
	user_verifyuserphone: '/api/user/verifyUserPhone.do',//更换手机号时验证

	/*用户签到模块*/
	vote_usersign: '/api/vote/userSign/signin.do',//保存签到记录

	/*用户账户模块*/
	account_appllycash: '/api/account/applyCash.do',//申请提现
	account_getuseraccountinfo: '/api/account/getUserAccountInfo.do',//获取用户账户信息
	account_queryaccountlistpage: '/api/account/queryAccountListPage.do',//分页获取账户流水记录
	account_querycashinfolistpage:'/api/account/queryCashInfoListPage.do',//分页获取提现记录

	/*短信模块*/
	user_sendsms: '/api/user/sendSms.do',//发送短信获取验证码

	/*邀请模块*/
	invite_register_Number: '/api/invite/getInviteAward.do',//注册可得币数
	invite_inviteuserindex: '/api/invite/inviteUserIndex.do',//邀请好友首页
	invite_queryinvitelistpage: '/api/invite/queryInviteListPage.do',//分页获取邀请记录

	/*项目模块*/
	vote_item_add: '/api/vote/item/add.do',//发布项目
	vote_item_list: '/api/vote/item/list.do',//项目列表（分页）
	vote_item_mypublishitemlist: '/api/vote/item/myPublishItemList.do',//我发布的项目列表
	vote_item_searchlist: '/api/vote/item/searchlist.do',//项目搜索接口
	vote_item_vote: '/api/vote/item/vote.do',//项目投票
}