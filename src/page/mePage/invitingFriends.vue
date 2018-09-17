<template>
    <div>
        <div class="invitingFriendsHeader">
            <div>邀请好友</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="invitingFriendsTop">
            <p>邀请好友，一起抢YMB</p>
            <div class="invDiv">
                <p>我的邀请码</p>
                <div>{{meCode}}</div>
                <div><div>奖励{{meGet}}YMB</div></div>
                <div><div>奖励{{friendsGet}}YMB</div></div>
                <button @click="invHyClick" class="invDivBtn" :data-clipboard-text="invitationAddress">立即邀请好友</button>
            </div>
        </div>
        <div class="invitationRecord">邀请记录</div>
        <ul class="invitationUl">
            <li>
                <p>{{successfulInvitation}}</p>
                <p>已成功邀请</p>
            </li>
            <li>
                <p>{{getAReward}}</p>
                <p>已获得奖励</p>
            </li>
        </ul> 
        <p @click="jumpDet" class="YQMX">邀请明细</p>
        <div class="JT" @click="jumpDet"></div> 
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import Clipboard from "clipboard";
import { storeGet } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      meCode: "",
      successfulInvitation: "",
      getAReward: "",
      invitationAddress: "",
      meGet: "",
      friendsGet: "",
      HdYmb: ""
    };
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/me");
    },
    jumpDet() {
      this.$router.push("/invitingDetails");
    },
    sendYQ() {
      //可获得币数
      let imparams = {};
      let immyRequestId = Encrypt.myUuid();
      let immyTimestamp = Math.round(new Date().getTime()).toString();
      let immyArr = ["requestId=" + immyRequestId];
      let ima =
        Encrypt.myFunction(immyArr) + iconfig.ips.invite_register_Number;
      let immyValues = md5(ima).toUpperCase();
      let imheaders = {
        requestId: immyRequestId,
        timestamp: immyTimestamp,
        channelType: "h5",
        sign: immyValues
      };
      api.invite.invite_registerNumber(imparams, imheaders).then(res => {
        if (res.data.code == 200) {
          this.HdYmb = res.data.extData.registerGetNum;
          //邀请好友首页
          let params = {
            userId: storeGet("userID")
          };
          let myRequestId = Encrypt.myUuid();
          let myTimestamp = Math.round(new Date().getTime()).toString();
          let myArr = [
            "requestId=" + myRequestId,
            "userId=" + storeGet("userID")
          ];
          let a =
            Encrypt.myFunction(myArr) + iconfig.ips.invite_inviteuserindex;
          let myValues = md5(a).toUpperCase();
          let headers = {
            requestId: myRequestId,
            timestamp: myTimestamp,
            channelType: "h5",
            sign: myValues
          };
          api.invite.invite_inviteuserindex(params, headers).then(res => {
            this.meGet = res.data.data.iGetYMB;
            this.friendsGet = res.data.data.friendGetYMB;
            this.meCode = res.data.data.inviteCode;
            this.successfulInvitation = res.data.data.succeeInviteNum;
            this.getAReward = res.data.data.getAwardYmbNum;
            this.invitationAddress =
              "找新项目，人气项目，撸羊毛项目统统上新币榜，现在注册即送" +
              this.HdYmb +
              "YMB！ www.bibang.net.cn" +
              "/invitationToRegister/" +
              this.meCode;
          });
        }
      });
    },
    invHyClick() {
      var clipboard = new Clipboard(".invDivBtn");
      clipboard.on("success", e => {
        Toast("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    }
  },
  created() {
    this.sendYQ();
  }
};
</script>
<style scoped>
.invitingFriendsHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.invitingFriendsHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.invitingFriendsHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.invitingFriendsHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.invitingFriendsHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.invitingFriendsTop {
  width: 100%;
  height: 9.84rem;
  background: url("../../static/img/invite_background@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.invitingFriendsTop > p:nth-child(1) {
  padding-top: 1.3866666666666667rem;
  text-align: center;
  font-size: 0.8rem;
  color: #ffffff;
  text-shadow: 0 0.05333333333333334rem 0.10666666666666667rem #b37c0b;
}
.invDiv {
  width: 8.746666666666666rem;
  height: 9.28rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 2.986666666666667rem;
  margin: auto;
  background: #ffffff;
  box-shadow: 0 0.05333333333333334rem 0.10666666666666667rem 0
    rgba(0, 0, 0, 0.2);
  border-radius: 0.10666666666666667rem;
}
.invDiv > p:nth-child(1) {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  line-height: 0.56rem;
  padding-top: 0.48rem;
}
.invDiv > div:nth-child(2) {
  width: 5.333333333333333rem;
  height: 1.6rem;
  background: url("../../static/img/myinvite.png") no-repeat;
  background-size: 100% 100%;
  margin: auto;
  margin-top: 0.21333333333333335rem;
  text-align: center;
  line-height: 1.6rem;
  font-size: 0.8rem;
  color: #ffffff;
}
.invDiv > div:nth-child(3) {
  width: 7.44rem;
  height: 1.6rem;
  margin: auto;
  background: url("../../static/img/my_invite_two.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 0.5333333333333333rem;
  position: relative;
}
.invDiv > div:nth-child(4) {
  width: 7.44rem;
  height: 1.6rem;
  margin: auto;
  background: url("../../static/img/my_invite_one.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 0.26666666666666666rem;
  position: relative;
}
.invDiv > div:nth-child(3) > div,
.invDiv > div:nth-child(4) > div {
  width: 5.76rem;
  height: 1.6rem;
  margin-left: 1.68rem;
  text-align: center;
  font-size: 0.48rem;
  line-height: 1.6rem;
  color: #f9624d;
}
.invDivBtn {
  border: 0;
  display: block;
  background: #fff;
  width: 7.44rem;
  height: 1.3066666666666666rem;
  background: url("../../static/img/ivnite_buttom@2x.png") no-repeat;
  background-size: 100% 100%;
  margin: auto;
  margin-top: 0.5333333333333333rem;
  font-size: 0.4266666666666667rem;
  color: #ffffff;
}
.invitationRecord {
  width: 2.7733333333333334rem;
  height: 0.64rem;
  margin: auto;
  background: url("../../static/img/邀请记录@2x.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 3.066666666666667rem;
  text-align: center;
  line-height: 0.64rem;
  font: 0.4266666666666667rem;
  color: #fc5136;
}
.invitationUl {
  width: 8.746666666666666rem;
  margin: auto;
  margin-top: 0.48rem;
  background: #ffffff;
  padding-top: 0.5866666666666667rem;
  padding-bottom: 0.6933333333333334rem;
  box-shadow: 0 0.05333333333333334rem 0.10666666666666667rem 0
    rgba(0, 0, 0, 0.1);
}
.invitationUl:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.invitationUl > li {
  float: left;
  width: 50%;
  text-align: center;
  box-sizing: border-box;
}
.invitationUl > li:nth-child(1) {
  border-right: 1px solid #f2f2f2;
}
.invitationUl > li > p:nth-child(1) {
  font-size: 0.8rem;
  color: #373d41;
  margin-bottom: 0.26666666666666666rem;
}
.invitationUl > li > p:nth-child(2) {
  font-size: 0.32rem;
  color: #949494;
}
.invitationUl > li:nth-child(2) > p:nth-child(1) {
  color: #fc5136;
}
.YQMX {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  padding-top: 0.64rem;
  width: 30%;
  margin: auto;
}
.JT {
  width: 0.37333333333333335rem;
  height: 0.21333333333333335rem;
  margin: auto;
  background: url("../../static/img/yaoqingmingxi@2x.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 0.18666666666666668rem;
  margin-bottom: 0.4rem;
}
</style>


