import Vue from 'vue'
import * as config from './config'
import qs from "qs";
const baseUrl = '/ymb'
/*const baseUrl = 'https://www.yunminer.cn/'*/
const pageSize=1

export default{
	pageSize,
	baseUrl,
	/*user-account-controller*/
	wx:{
		//微信配置
		wx_config:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.wx_config,qs.stringify(params),{headers})
		},
		//微信支付异步回调
		account_wxinpaynotify:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.account_wxinpaynotify,qs.stringify(params),{headers})
		}
	},
	/*公告模块*/
	notice:{
		notice_detail:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.notice_detail,qs.stringify(params),{headers})
		},
		//分页获取公告信息
		notice_list:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.notice_list,qs.stringify(params),{headers})
		}
	},

	/*帖子模块*/
	vote:{
		//主页的发帖子
		vote_add:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_add,qs.stringify(params),{headers})
		},
		//帖子收藏
		vote_collection_add:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_collection_add,qs.stringify(params),{headers})
		},
		//帖子取消收藏
		vote_collection_del:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_collection_del,qs.stringify(params),{headers})
		},
		//帖子评论
		vote_comment_add:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_comment_add,qs.stringify(params),{headers})
		},
		//帖子删除评论
		vote_comment_del:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_comment_del,qs.stringify(params),{headers})
		},
		//帖子评论列表（分页）
		vote_comment_list:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_comment_list,qs.stringify(params),{headers})
		},
		//帖子评论回复
		vote_comment_replyadd:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_comment_replyadd,qs.stringify(params),{headers})
		},
		//帖子评论回复删除
		vote_comment_replydel:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_comment_replydel,qs.stringify(params),{headers})
		},
		//帖子评论删除
		vote_comment_replydel:(params)=>{
			return Vue.axios.post(baseUrl+config.api.vote_comment_replydel,params)

		},
		//帖子评论回复列表
		vote_comment_replylist:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_comment_replylist,qs.stringify(params),{headers})
		},
		//帖子详情
		vote_details:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_details,qs.stringify(params),{headers})
		},
		//主页的帖子列表
		vote_list:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_list,qs.stringify(params),{headers})
		},
		//帖子点赞
		vote_loves_add:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_loves_add,qs.stringify(params),{headers})
		},
		//帖子取消点赞
		vote_loves_del:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_loves_del,qs.stringify(params),{headers})
		},
		//我的收藏列表
		vote_mycollectionforumlist:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_mycollectionforumlist,qs.stringify(params),{headers})
		}
	},

	/*用户模块*/
	user:{
		//忘记密码找回密码
		user_forgetpassword:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_forgetpassword,qs.stringify(params),{headers})
		},
		//根据用户ip地址获取地址位置
		user_getaddressbyip:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_getaddressbyip,qs.stringify(params),{headers})
		},
		//获取用户信息
		user_getuserinfo:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_getuserinfo,qs.stringify(params),{headers})
		},
		//退出登录
		user_logout:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_logout,qs.stringify(params),{headers})
		},
		//用户登录
		user_login:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_login,qs.stringify(params),{headers})
		},
		//用户注册
		user_register:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_register,qs.stringify(params),{headers})
		},
		//用户注册验证-验证码手机号和邀请码
		user_registerverification:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_registerverification,qs.stringify(params),{headers})
		},
		//用户意见反馈
		user_savefeedback:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_savefeedback,qs.stringify(params),{headers})
		},
		//用户实名认证
		user_saveusercertification:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_saveusercertification,qs.stringify(params),{headers})
		},
		//添加用户每天访问量
		user_saveusertoken:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_saveusertoken,qs.stringify(params),{headers})
		},
		//修改密码
		user_updatepassword:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_updatepassword,qs.stringify(params),{headers})
		},
		//修改用户信息
		user_updateuserinfo:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_updateuserinfo,qs.stringify(params),{headers})
		},
		//更换手机号
		user_updateuserphone:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_updateuserphone,qs.stringify(params),{headers})
		},
		//检测手机号是否注册
		user_verificationphoneisreg:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_verificationphoneisreg,qs.stringify(params),{headers})
		},
		//更换手机号时验证
		user_verifyuserphone:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_verifyuserphone,qs.stringify(params),{headers})
		}
	},

	/*用户签到模块*/
	voteuser:{
		//保存签到记录
		vote_usersign:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_usersign,qs.stringify(params),{headers})
		}
	},

	/*用户账户模块*/
	account:{
		//申请提现
		account_appllycash:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.account_appllycash,qs.stringify(params),{headers})
		},
		//获取用户账户信息
		account_getuseraccountinfo:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.account_getuseraccountinfo,qs.stringify(params),{headers})
		},
		//分页获取账户流水记录
		account_queryaccountlistpage:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.account_queryaccountlistpage,qs.stringify(params),{headers})
		},
		//分页获取提现记录
		account_querycashinfolistpage:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.account_querycashinfolistpage,qs.stringify(params),{headers})
		}
	},

	/*短信模块*/
	usersend:{
		//发送短信获取验证码
		user_sendsms:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.user_sendsms,qs.stringify(params),{headers})
		}
	},

	/*邀请模块*/
	invite:{
		//邀请注册可得币数
		invite_registerNumber:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.invite_register_Number,qs.stringify(params),{headers})
		},
		//邀请好友首页
		invite_inviteuserindex:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.invite_inviteuserindex,qs.stringify(params),{headers})
		},
		//分页获取邀请记录
		invite_queryinvitelistpage:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.invite_queryinvitelistpage,qs.stringify(params),{headers})
		}
	},

	/*项目模块*/
	item:{
		//发布项目
		vote_item_add:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_item_add,qs.stringify(params),{headers})
		},
		//项目列表（分页）
		vote_item_list:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_item_list,qs.stringify(params),{headers})
		},
		//我发布的项目列表
		vote_item_mypublishitemlist:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_item_mypublishitemlist,qs.stringify(params),{headers})
		},
		//项目搜索接口
		vote_item_searchlist:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_item_searchlist,qs.stringify(params),{headers})
		},
		//项目投票
		vote_item_vote:(params,headers)=>{
			return Vue.axios.post(baseUrl+config.api.vote_item_vote,qs.stringify(params),{headers})
		}
	}
}