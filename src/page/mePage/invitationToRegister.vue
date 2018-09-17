<template>
    <div>
        <div class="invFriendHeader">
            <div>新币榜注册领YMB福利</div>
            <div v-show="false" @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="topMain">
            <div class="invFriendLogin">
                <div></div>
                <div>
                    <p>新币榜</p>
                    <p>撸羊毛就用新币榜</p>
                </div>
            </div>
            <p class="topText">注册领8000YMB福利</p>
            <div class="formDiv">
                <div class="formDiv1">
                    <div :style="'border-bottom:1px solid '+formDiv2">
                        <input type="tel" v-model="formDiv2Model" placeholder="请输入手机号码" @focus="formDiv2Focus" @blur="formDiv2Blur">
                    </div>
                    <div :style="'border-bottom:1px solid '+formDiv3">
                        <input type="text" v-model="formDiv3Model" placeholder="请输入随机验证码" @focus="formDiv3Focus" @blur="formDiv3Blur">
                        <div @click="YZMclick">{{YZM}}</div>
                    </div>
                    <div :style="'border-bottom:1px solid '+formDiv4">
                        <input type="text" v-model="formDiv4Model" placeholder="短信验证码" @focus="formDiv4Focus" @blur="formDiv4Blur">
                        <button @click="sendInvRegCode" :disabled="InvRegCodeDisabled">{{InvRegCodeText}}</button> 
                    </div>
                    <div :style="'border-bottom:1px solid '+formDiv5">
                        <input type="text" v-model="codeValue"  placeholder="邀请码" @focus="formDiv5Focus" @blur="formDiv5Blur">
                        <span>邀请码</span>
                    </div>
                    <div :style="'border-bottom:1px solid '+formDiv6">
                        <input type="password" v-model="formDiv6Model" placeholder="设置登录密码" @focus="formDiv6Focus" @blur="formDiv6Blur">
                    </div>
                    <button @click="FormDiv7Click"  :class="{FormDiv7Btn:(formDiv2Model=='')||(formDiv3Model=='')||(formDiv4Model=='')||(formDiv6Model=='')||(codeValue==''),yesFormDiv7Btn:(formDiv2Model!='')&&(formDiv3Model!='')&&(formDiv4Model!='')&&(formDiv6Model!='')&&(codeValue!='')}">立即领取</button>
                    <p class="formP8"><span @click="jumpXZ">已注册，点击下载</span></p>
                </div>
            </div>
        </div>
        <p class="newXBB">新币榜YMB介绍</p>
        <p class="newXBB1">新币榜是代币驱动的代币投资者垂直社区。在新币榜，用户的付出和贡献将获得相应的回报。</p>
        <p class="newXBB2">YMB是新币榜的代币，代表新币榜及其周边生态的使用权。</p>
    </div>
</template>
<script>
import { Toast } from "mint-ui";
import { storeSet, storeGet, getCode } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      formDiv2: "#eaeaea",
      formDiv3: "#eaeaea",
      formDiv4: "#eaeaea",
      formDiv5: "#eaeaea",
      formDiv6: "#eaeaea",
      codeValue: "",
      formDiv2Model: "",
      formDiv3Model: "",
      formDiv4Model: "",
      formDiv6Model: "",
      InvRegCodeText: "获取验证码",
      InvRegCodeDisabled: false,
      YZM: "",
      myIpAddress: "",
      myUserAddress: ""
    };
  },
  methods: {
    back() {
      this.$router.push("/loginAndRegister");
    },
    sendCode() {
      this.codeValue = this.$route.params.code;
      this.YZM = getCode(4);
      this.myIpAddress = returnCitySN["cip"];
      //获取ip地址
      let params = {
        ipAddress: returnCitySN["cip"]
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "ipAddress=" + returnCitySN["cip"]
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.user_getaddressbyip;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.user.user_getaddressbyip(params, headers).then(res => {
        this.myUserAddress = res.data.data.userAddress;
      });
    },
    YZMclick() {
      this.YZM = getCode(4);
    },
    formDiv2Focus() {
      this.formDiv2 = "#FEC82F";
    },
    formDiv2Blur() {
      this.formDiv2 = "#eaeaea";
    },
    formDiv3Focus() {
      this.formDiv3 = "#FEC82F";
    },
    formDiv3Blur() {
      this.formDiv3 = "#eaeaea";
    },
    formDiv4Focus() {
      this.formDiv4 = "#FEC82F";
    },
    formDiv4Blur() {
      this.formDiv4 = "#eaeaea";
    },
    formDiv5Focus() {
      this.formDiv5 = "#FEC82F";
    },
    formDiv5Blur() {
      this.formDiv5 = "#eaeaea";
    },
    formDiv6Focus() {
      this.formDiv6 = "#FEC82F";
    },
    formDiv6Blur() {
      this.formDiv6 = "#eaeaea";
    },
    sendInvRegCode() {
      var formDivPhone = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var formDivPhones = formDivPhone.test(this.formDiv2Model);
      if (this.formDiv2Model != "") {
        if (formDivPhones) {
          if (this.InvRegCodeDisabled == false) {
            this.InvRegCodeDisabled = true;
            var formDivPhonesTime = 60;
            this.InvRegCodeText = "重新获取" + formDivPhonesTime + "s";
            //发送短信验证
            let params = {
              phone: this.formDiv2Model
            };
            let myRequestId = Encrypt.myUuid();
            let myTimestamp = Math.round(new Date().getTime()).toString();
            let myArr = [
              "requestId=" + myRequestId,
              "phone=" + this.formDiv2Model
            ];
            let a = Encrypt.myFunction(myArr) + iconfig.ips.user_sendsms;
            let myValues = md5(a).toUpperCase();
            let headers = {
              requestId: myRequestId,
              timestamp: myTimestamp,
              channelType: "h5",
              sign: myValues
            };
            api.usersend.user_sendsms(params, headers).then(res => {});

            var InvRegCodeSetTime = setInterval(() => {
              formDivPhonesTime--;
              this.InvRegCodeText = "重新获取" + formDivPhonesTime + "s";
              if (formDivPhonesTime == 1) {
                clearInterval(InvRegCodeSetTime);
                this.InvRegCodeDisabled = false;
                this.InvRegCodeText = "获取验证码";
              }
            }, 1000);
          } else {
            Toast("请稍后再获取验证码");
          }
        } else {
          Toast("手机号码格式不正确");
        }
      } else {
        Toast("手机号码不能为空");
      }
    },
    FormDiv7Click() {
      var YqPhone = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var YqPas = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,}$/;
      var YqPhones = YqPhone.test(this.formDiv2Model);
      var YqPass = YqPas.test(this.formDiv6Model);
      if (
        this.codeValue != "" &&
        this.formDiv2Model != "" &&
        this.formDiv3Model != "" &&
        this.formDiv4Model != "" &&
        this.formDiv6Model != ""
      ) {
        if (this.formDiv3Model.toUpperCase() == this.YZM.toUpperCase()) {
          if (YqPhones && YqPass) {
            //用户注册
            let params = {
              phone: this.formDiv2Model,
              password: md5(this.formDiv6Model),
              inviteCode: this.codeValue,
              userAddress: this.myUserAddress,
              ipAddress: this.myIpAddress,
              verificationCode: this.formDiv4Model
            };
            let myRequestId = Encrypt.myUuid();
            let myTimestamp = Math.round(new Date().getTime()).toString();
            let myArr = [
              "requestId=" + myRequestId,
              "phone=" + this.formDiv2Model,
              "password=" + md5(this.formDiv6Model),
              "inviteCode=" + this.codeValue,
              "userAddress=" + this.myUserAddress,
              "ipAddress=" + this.myIpAddress,
              "verificationCode=" + this.formDiv4Model
            ];
            let a = Encrypt.myFunction(myArr) + iconfig.ips.user_register;
            let myValues = md5(a).toUpperCase();
            let headers = {
              requestId: myRequestId,
              timestamp: myTimestamp,
              channelType: "h5",
              sign: myValues
            };
            api.user.user_register(params, headers).then(res => {
              if (res.data.code == 200) {
                storeSet("userID", res.data.data.userId);
                storeSet("username", res.data.data.username);
                this.$router.push("/YqZcFl");
              } else {
                Toast(res.data.message);
                this.YZM = getCode(4);
              }
            });
          } else {
            Toast("手机号码或者密码格式不正确");
          }
        } else {
          Toast("随即验证码不正确");
        }
      }
    },
    jumpXZ() {
      this.$router.push("/YqZcFl");
    }
  },
  created() {
    this.sendCode();
  }
};
</script>
<style scoped>
.invFriendHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.invFriendHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.invFriendHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.invFriendHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.invFriendHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.topMain {
  width: 100%;
  height: 16.666666666666668rem;
  background: url("../../static/img/分享1@2x.png") no-repeat;
  background-size: 100% 100%;
}
.invFriendLogin {
  margin-left: 0.32rem;
  padding-top: 0.5333333333333333rem;
}
.invFriendLogin:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.invFriendLogin > div {
  float: left;
}
.invFriendLogin > div:nth-child(1) {
  width: 0.8533333333333334rem;
  height: 0.8533333333333334rem;
  background: url("../../static/img/1-5关于新币榜@2x.png") no-repeat;
  background-size: 100% 100%;
}
.invFriendLogin > div:nth-child(2) {
  margin-left: 0.10666666666666667rem;
}
.invFriendLogin > div:nth-child(2) > p:nth-child(1) {
  font-size: 0.32rem;
  color: #373d41;
  line-height: 0.37333333333333335rem;
}
.invFriendLogin > div:nth-child(2) > p:nth-child(2) {
  opacity: 0.5;
  font-size: 0.26666666666666666rem;
  color: #373d41;
  line-height: 0.37333333333333335rem;
}
.topText {
  text-align: center;
  font-size: 0.8rem;
  color: #ffffff;
  text-shadow: 0 0.05333333333333334rem 0.10666666666666667rem
    rgba(0, 0, 0, 0.3);
  margin-top: 0.8rem;
}
.formDiv {
  width: 8.373333333333333rem;
  height: 9.333333333333334rem;
  background: #ffffff;
  box-shadow: 0 0.05333333333333334rem 0.10666666666666667rem 0
    rgba(0, 0, 0, 0.2);
  border-radius: 0.10666666666666667rem;
  margin: auto;
  margin-top: 0.48rem;
  padding-top: 0.8533333333333334rem;
}
.formDiv1 {
  width: 6.4rem;
  margin: auto;
}
.formDiv1 > div > input {
  padding-bottom: 0.18666666666666668rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  width: 100%;
}
.formDiv1 > div {
  margin-bottom: 0.5333333333333333rem;
}
.formDiv3 {
  position: relative;
}
.formDiv1 > div:nth-child(2),
.formDiv1 > div:nth-child(3),
.formDiv1 > div:nth-child(4) {
  position: relative;
}
.formDiv1 > div:nth-child(2) > div:nth-child(2) {
  position: absolute;
  right: 0;
  bottom: 0.18666666666666668rem;
  width: 1.6rem;
  height: 0.64rem;
  /* background: #FEC82F; */
  font-size: 0.64rem;
  text-align: center;
  line-height: 0.5066666666666667rem;
}
.formDiv1 > div:nth-child(3) > button:nth-child(2) {
  border: 0;
  background: #fff;
  font-size: 0.4266666666666667rem;
  color: #ff721f;
  position: absolute;
  right: 0;
  bottom: 0.18666666666666668rem;
}
.formDiv1 > div:nth-child(4) > span:nth-child(2) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  position: absolute;
  right: 0;
  bottom: 0.18666666666666668rem;
}
.yesFormDiv7Btn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fec82f;
  border-radius: 2.6666666666666665rem;
  margin-top: 0.26666666666666666rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.FormDiv7Btn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #b8b8b8;
  border-radius: 2.6666666666666665rem;
  margin-top: 0.26666666666666666rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  pointer-events: none;
}
.formP8 {
  text-align: right;
  font-size: 0.32rem;
  color: #949494;
  margin-top: 0.3rem;
}
.formP8 > span {
  border-bottom: 1px solid #949494;
}
.newXBB {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  padding-left: 0.9333333333333333rem;
  padding-bottom: 0.32rem;
}
.newXBB1,
.newXBB2 {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  line-height: 0.6933333333333334rem;
  width: 8.16rem;
  margin: auto;
}
.newXBB2 {
  padding: 0.5333333333333333rem 0;
}
</style>

