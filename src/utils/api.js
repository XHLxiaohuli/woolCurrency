export default {
    wx_config:'share/wxShare.do',//微信配置
    //公告模块
    pagingNoticeDetails:"notice/queryNoticeDetails.do",//获取公告信息详情接口
    pagingObtainNotice:"notice/queryNoticeListPage.do",//分页获取公告信息接口

    //帖子模块
    homepagePost:"vote/forum/add.do",//主页的发帖子接口
    postCollection:"vote/forum/collection/add.do",//帖子收藏接口
    postCancelCollection:"vote/forum/collection/del.do",//帖子取消收藏
    postComment:"vote/forum/comment/add.do",//帖子评论接口
    postDeleteComment:"vote/forum/comment/del.do",//帖子删除评论接口
    postCommentListPaging:"vote/forum/comment/list.do",//帖子评论列表接口(分页)
    postCommentReply:"vote/forum/comment/replyAdd.do",//帖子评论回复接口
    postCommentDeleteReply:"vote/forum/comment/replyDel.do",//帖子评论删除回复接口
    postCommentReplyList:"vote/forum/comment/replyLits.do",//帖子评论回复列表接口(分页)
    postDetails:"vote/forum/details.do",//帖子详情接口
    homepagePostListPaging:"vote/forum/list.do",//主页的帖子列表接口(分页)
    postThumbsUp:"vote/forum/loves/add.do",//帖子点赞接口
    postCancellationThumbsUp:"vote/forum/loves/del.do",//帖子取消点赞接口
    meCollectionList:"vote/forum/myCollectionForumList.do",//我的收藏列表(分页)

    //用户模块
    forgetAndRetrievePassword:"user/forgetPassword.do",//忘记密码找回密码
    physicalAddress:"user/getAddressByIP.do",//根据用户ip地址获取地址位置
    obtainUserInformation:"user/getUserInfo.do",//获取用户信息
    exitLogon:"user/logOut.do",//退出登录
    userLogin:"user/login.do",//用户登录
    userRegistration:"user/register.do",//用户注册
    cellPhoneVerificationCode:"user/registerVerification.do",//用户注册验证-验证码手机号和邀请码接口
    feedbackFromUserOpinion:"user/saveFeedback.do",//用户意见反馈
    userRealName:"user/saveUserCertification.do",//用户实名认证接口 
    userDailyAccessInterface:"user/saveUserToken.do",//添加用户每天访问量接口
    modifyThePassword:"user/updatePassword.do",//修改密码
    modifyingUserInformation:"user/updateUserInfo.do",//修改用户信息
    replaceUserPhone:"user/updateUserPhone.do",//跟换手机号
    detectionOfCellPhonenumber:"user/verificationPhoneIsReg.do",//检测手机号是否注册
    changeThePhoneNumber:"user/verifyUserPhone.do",//跟换手机号时验证

    //用户签到模块
    saveTheSignToRecord:"vote/userSign/signin.do",//保存签到记录接口

    //用户账户模块
    applicationForPresentation:"account/applyCash.do",//申请提现
    accessToUserAccountInformation:"account/getUserAccountInfo.do",//获取用户账户信息
    paginationTogetAcountFlowRecords:"account/queryAccountListPage.do",//分页获取账户流水记录
    pagingToGetThePresentRecord:"account/queryCashInfoListPage.do",//分页获取提现记录

    //短信模块
    SMSAuthenticationCode:"user/sendSms.do",//发送短信获取验证码接口

    //邀请模块
    InvitingAFriendIsHomePage:"invite/inviteUserIndex.do",//邀请好友首页
    paginationToGetInvitationRecords:"invite/queryInviteListPage.do",//分页获取邀请记录

    //项目模块
    releaseProject:"vote/item/add.do",//发布项目接口
    projectListPagination:"vote/item/list.do",//项目列表接口(分页)
    myPublishProjectListPagination:"vote/item/myPublishItemList.do",//我发布的项目列表(分页)
    projectSearchPaging:"vote/item/searchlist.do",//项目搜索接口(分页)
    projectVoting:"vote/item/vote.do",//项目投票接口(扩展返回字段：voteAwardNum(投票可得币数，投票成功后返回))


}  