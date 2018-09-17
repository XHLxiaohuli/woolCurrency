<template>
    <div>
        <div class="registerContainer">
            <p class="RegtPhoneText">手机号</p>
            <div class="RegtPhoneDiv" :style="'border-bottom:1px solid '+RegtPhoneBor">
                <input type="tel" maxlength="11" v-model="RegtPhoneModel" @focus="RegtPhoneFocus" @blur="RegtPhoneBlur">
            </div>
            <p class="RegtCodeText">验证码</p>
            <div class="RegtCodeDiv" :style="'border-bottom:1px solid '+RegtCodeBor">
                <input type="text" v-model="RegtCodeModel" @focus="RegtCodeFocus" @blur="RegtCodeBlur">
                <button :disabled="codeDisabled" class="ObtainCode" @click="getVerifyingCode">{{codeText}}</button>
            </div>
            <p class="RegtPwText">密码</p>
            <div class="RegtPwDiv" :style="'border-bottom:1px solid '+RegtPwBor">
                <input :type="RegtPwStyle" v-model="RegtPwModel" @focus="RegtPwFocus" @blur="RegtPwBlur">
                <div class="RegtPwIcn" @click="isEncryption">
                    <img v-show="RegtPwIcnShow" src="../../static/img/注册-点击去注册按钮@2x.png" alt="">
                    <img v-show="!RegtPwIcnShow" src="../../static/img/login_images_eye_look@2x.png" alt="">
                </div>
            </div>
            <p class="RegtInvitationText">邀请码 <span>(选填)</span> </p>
            <div class="RegtInvitationDiv" :style="'border-bottom:1px solid '+RegtInvitationBor">
                <input  type="number" v-model="RegtInvitationModel" @focus="RegtInvitationFocus" @blur="RegtInvitationBlur">
            </div>
            <div class="agreementDiv">
                <span>√</span> <span>我已阅读并同意</span><span>《新币榜用户协议》</span>
            </div>
            <button @click="sendReg" :disabled="regDisabled" :class="{registerNextStep:(RegtPhoneModel=='')||(RegtCodeModel=='')||(RegtPwModel==''),yesRegisterNextStep:(RegtPhoneModel!='')&&(RegtCodeModel!='')&&(RegtPwModel!='')}">下一步</button>
        </div>
        <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="regPrompt" :position="position">{{('Basic Usage') }}</toast>
    </div>    
</template>
<script>
import { storeSet } from "scripts/moment";
import { Toast } from "vux";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  components: {
    Toast
  },
  data() {
    return {
      RegtPhoneBor: "#f2f2f2",
      RegtCodeBor: "#f2f2f2",
      RegtPwBor: "#f2f2f2",
      RegtInvitationBor: "#f2f2f2",
      codeText: "获取验证码",
      RegtPwStyle: "password",
      RegtPwIcnShow: true,
      RegtPwStyleIndex: 0,
      RegtPhoneModel: "",
      RegtCodeModel: "",
      RegtPwModel: "",
      RegtInvitationModel: "",
      myIpAddress: "",
      myUserAddress: "",
      codeDisabled: false,
      showPositionValue: false,
      regPrompt: "",
      position: "",
      regDisabled: false
    };
  },
  methods: {
    RegtPhoneFocus() {
      this.RegtPhoneBor = "#FEC82F";
    },
    RegtPhoneBlur() {
      this.RegtPhoneBor = "#f2f2f2";
    },
    RegtCodeFocus() {
      this.RegtCodeBor = "#FEC82F";
    },
    RegtCodeBlur() {
      this.RegtCodeBor = "#f2f2f2";
    },
    RegtPwFocus() {
      this.RegtPwBor = "#FEC82F";
    },
    RegtPwBlur() {
      this.RegtPwBor = "#f2f2f2";
    },
    RegtInvitationFocus() {
      this.RegtInvitationBor = "#FEC82F";
    },
    RegtInvitationBlur() {
      this.RegtInvitationBor = "#f2f2f2";
    },
    isEncryption() {
      if (this.RegtPwStyleIndex % 2 == 0) {
        this.RegtPwStyle = "text";
        this.RegtPwIcnShow = false;
        this.RegtPwStyleIndex++;
      } else if (!this.RegtPwStyleIndex % 2 == 0) {
        this.RegtPwStyle = "password";
        this.RegtPwIcnShow = true;
        this.RegtPwStyleIndex++;
      }
    },
    //获取验证码
    getVerifyingCode() {
      var RsRegisterone = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var RsRegisterones = RsRegisterone.test(this.RegtPhoneModel);
      if (
        this.RegtPhoneModel != "" &&
        RsRegisterones &&
        this.codeDisabled != true
      ) {
        this.codeDisabled = true;
        var codeTime = 60;
        this.codeText = "重新获取" + codeTime + "s";
        let params = {
          phone: this.RegtPhoneModel
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "phone=" + this.RegtPhoneModel
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
        var codeSetTime = setInterval(() => {
          codeTime--;
          this.codeText = "重新获取" + codeTime + "s";
          if (codeTime == 1) {
            clearInterval(codeSetTime);
            this.codeDisabled = false;
            this.codeText = "获取验证码";
          }
        }, 1000);
      } else if (this.RegtPhoneModel == "") {
        this.regPrompt = "手机号码不能为空";
        this.position = "middle";
        this.showPositionValue = true;
      } else if (!RsRegisterones) {
        this.regPrompt = "手机号码格式不正确";
        this.position = "middle";
        this.showPositionValue = true;
      }
    },
    sendReg() {
      var RsRegisterone = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var RsRegisteronePas = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,}$/;
      var RsRegisterones = RsRegisterone.test(this.RegtPhoneModel);
      var RsRegisteronePass = RsRegisteronePas.test(this.RegtPwModel);
      if (
        this.RegtPhoneModel != "" &&
        this.RegtCodeModel != "" &&
        this.RegtPwModel != ""
      ) {
        if (RsRegisterones && RsRegisteronePass) {
          this.regDisabled = true;
          let params = {
            phone: this.RegtPhoneModel,
            password: md5(this.RegtPwModel),
            inviteCode: this.RegtInvitationModel,
            userAddress: this.myUserAddress,
            ipAddress: this.myIpAddress,
            verificationCode: this.RegtCodeModel
          };
          let myRequestId = Encrypt.myUuid();
          let myTimestamp = Math.round(new Date().getTime()).toString();
          let myArr = [
            "requestId=" + myRequestId,
            "phone=" + this.RegtPhoneModel,
            "password=" + md5(this.RegtPwModel),
            "inviteCode=" + this.RegtInvitationModel,
            "userAddress=" + this.myUserAddress,
            "ipAddress=" + this.myIpAddress,
            "verificationCode=" + this.RegtCodeModel
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
              this.$router.push("/bottomtab/vote");
            } else {
              this.regPrompt = res.data.message;
              this.position = "middle";
              this.showPositionValue = true;
            }
          });
          setTimeout(() => {
            this.regDisabled = false;
          }, 5000);
        } else {
          this.regPrompt = "手机号码或密码格式不正确";
          this.position = "middle";
          this.showPositionValue = true;
        }
      }
    },
    getPhysics() {
      this.myIpAddress = returnCitySN["cip"];
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
    }
  },
  created() {
    this.getPhysics();
  }
};
</script>
<style scoped>
.registerContainer {
  width: 8rem;
  margin: auto;
  margin-top: 1.3066666666666666rem;
}
.RegtPhoneText,
.RegtCodeText,
.RegtPwText,
.RegtInvitationText {
  font-size: 0.3466666666666667rem;
  color: #949494;
  margin-top: 0.5066666666666667rem;
}
.RegtInvitationText > spam {
  font-size: 0.3466666666666667rem;
  color: #949494;
}
.RegtPhoneText {
  margin-top: 0;
}
.RegtPhoneDiv,
.RegtCodeDiv,
.RegtPwDiv,
.RegtInvitationDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
  padding-bottom: 0.18666666666666668rem;
}
.RegtCodeDiv,
.RegtPwDiv {
  position: relative;
}
.RegtPhoneDiv > input,
.RegtCodeDiv > input,
.RegtPwDiv > input,
.RegtInvitationDiv > input {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  width: 100%;
}
.ObtainCode {
  position: absolute;
  right: 0;
  bottom: 0.18666666666666668rem;
  width: 2.88rem;
  height: 0.8533333333333334rem;
  background: #fec82f;
  border-radius: 0.05333333333333334rem;
  border: 0;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  box-sizing: border-box;
}
.RegtPwIcn {
  width: 0.48rem;
  height: 0.48rem;
  position: absolute;
  right: 0;
  bottom: 0.29333333333333333rem;
}
.RegtPwIcn > img {
  width: 100%;
  height: 100%;
}
.agreementDiv {
  width: 100%;
  margin-top: 0.29333333333333333rem;
}
.agreementDiv > span {
  font-size: 0.32rem;
}
.agreementDiv > span:nth-child(1) {
  display: inline-block;
  width: 0.37333333333333335rem;
  height: 0.37333333333333335rem;
  border: 1px solid #fec82f;
  color: #fec82f;
  border-radius: 50%;
  text-align: center;
  line-height: 0.37333333333333335rem;
}
.agreementDiv > span:nth-child(2) {
  color: #373d41;
}
.agreementDiv > span:nth-child(3) {
  color: #ff721f;
}
.registerNextStep {
  width: 100%;
  height: 1.1733333333333333rem;
  border: 0;
  margin-top: 1.0666666666666667rem;
  background: #b8b8b8;
  border-radius: 0.05333333333333334rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  pointer-events: none;
}
.yesRegisterNextStep {
  width: 100%;
  height: 1.1733333333333333rem;
  border: 0;
  margin-top: 1.0666666666666667rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
</style>

