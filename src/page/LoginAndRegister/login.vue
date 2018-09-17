<template>
    <div>
        <div class="loginContainer">
            <h1 class=loginToGreet>你好，欢迎登陆新币榜</h1>
            <p class="loginPhoneText">手机号</p>
            <div class="loginPhoneDiv" :style="'border-bottom:1px solid '+loginPhoneBor">
                <input type="tel" maxlength="11" v-model="loginPhoneModel" @focus="loginPhoneFocus" @blur="loginPhoneBlur">
            </div>
            <p class="loginPwText">密码</p>
            <div class="loginPwDiv" :style="'border-bottom:1px solid '+loginPwBor">
                <input :type="passwordStyle" v-model="loginPwModel" @focus="loginPwFocus" @blur="loginPwBlur">
            </div>
            <div class="forget"><span @click="jumpForgetPw">忘记密码</span></div>
            <button :disabled="loginDisabled"  @click="loginClick" :class="{loginBut:(loginPhoneModel=='')||(loginPwModel==''),yesLoginBut:(loginPhoneModel!='')&&(loginPwModel!='')}">登录</button>
            <div class="loginMask" v-show="MaskShow">
                <div class="onTheMaskDiv">
                    <p class="maskText">手机号<span>{{unregisteredPhone}}</span>未注册，是否去注册</p>
                    <div class="maskBtn">
                        <button @click="cancel">取消</button><button @click="jumpRegister">去注册</button>
                    </div>
                </div>
            </div>
        </div> 
         <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="loginPrompt" :position="position">{{('Basic Usage') }}</toast>
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
  props: ["isJumpReg"],
  components: {
    Toast
  },
  data() {
    return {
      passwordStyle: "password",
      loginPhoneBor: "#f2f2f2",
      loginPwBor: "#f2f2f2",
      loginPhoneModel: "",
      loginPwModel: "",
      unregisteredPhone: "",
      MaskShow: false,
      showPositionValue: false,
      loginPrompt: "",
      position: "",
      loginDisabled: false
    };
  },
  methods: {
    loginPhoneFocus() {
      this.loginPhoneBor = "#FEC82F";
    },
    loginPhoneBlur() {
      this.loginPhoneBor = "#f2f2f2";
    },
    loginPwFocus() {
      this.loginPwBor = "#FEC82F";
    },
    loginPwBlur() {
      this.loginPwBor = "#f2f2f2";
    },
    jumpForgetPw() {
      this.$router.push("/oneForgetThePassword");
    },
    jumpRegister() {
      this.$emit("modify", "1");
    },
    cancel() {
      this.MaskShow = false;
    },
    loginClick() {
      var RsLoginPhone = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var RsLoginPhones = RsLoginPhone.test(this.loginPhoneModel);
      var RsLoginPas = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,}$/;
      var RsLoginPass = RsLoginPas.test(this.loginPwModel);
      if (this.loginPhoneModel != "" && this.loginPwModel != "") {
        if (RsLoginPhones && RsLoginPass) {
          this.loginDisabled = true;
          let params = {
            phone: this.loginPhoneModel,
            password: md5(this.loginPwModel)
          };
          let myRequestId = Encrypt.myUuid();
          let myTimestamp = Math.round(new Date().getTime()).toString();
          let myArr = [
            "requestId=" + myRequestId,
            "phone=" + this.loginPhoneModel,
            "password=" + md5(this.loginPwModel)
          ];
          let a = Encrypt.myFunction(myArr) + iconfig.ips.user_login;
          let myValues = md5(a).toUpperCase();
          let headers = {
            requestId: myRequestId,
            timestamp: myTimestamp,
            channelType: "h5",
            sign: myValues
          };
          api.user.user_login(params, headers).then(res => {
            if (res.data.code == 200) {
              if (res.data.data.status == -1) {
                this.loginPrompt = "该账号涉及违规";
                this.position = "middle";
                this.showPositionValue = true;
              } else {
                storeSet("userID", res.data.data.userId);
                storeSet("username", res.data.data.username);
                this.$router.push("/bottomtab/vote");
              }
            } else {
              let paramss = {
                phone: this.loginPhoneModel
              };
              let myRequestId = Encrypt.myUuid();
              let myTimestamp = Math.round(new Date().getTime()).toString();
              let myArr = [
                "requestId=" + myRequestId,
                "phone=" + this.loginPhoneModel
              ];
              let a =
                Encrypt.myFunction(myArr) +
                iconfig.ips.user_verificationphoneisreg;
              let myValues = md5(a).toUpperCase();
              let headers = {
                requestId: myRequestId,
                timestamp: myTimestamp,
                channelType: "h5",
                sign: myValues
              };
              api.user
                .user_verificationphoneisreg(paramss, headers)
                .then(res => {
                  if (res.data.code == 200) {
                    this.unregisteredPhone = this.loginPhoneModel;
                    this.MaskShow = true;
                  } else {
                    this.loginPrompt = "手机号码或者密码错误";
                    this.position = "middle";
                    this.showPositionValue = true;
                  }
                });
            }
          });
          setTimeout(() => {
            this.loginDisabled = false;
          }, 5000);
        }
      }
    }
  }
};
</script>
<style scoped>
.loginContainer {
  width: 8rem;
  margin: auto;
  margin-top: 1.3066666666666666rem;
}
.loginToGreet {
  font-size: 0.5333333333333333rem;
  color: #373d41;
  font-weight: bolder;
}
.loginPwText,
.loginPhoneText {
  font-size: 0.3466666666666667rem;
  color: #949494;
  margin-top: 0.88rem;
}
.loginPhoneDiv,
.loginPwDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
  padding-bottom: 0.18666666666666668rem;
  /* border-bottom: 1px solid #f2f2f2; */
}
.loginPhoneDiv > input,
.loginPwDiv > input {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  width: 100%;
}
.forget {
  width: 100%;
  text-align: right;
  font-size: 0.32rem;
  color: #949494;
  margin-top: 0.29333333333333333rem;
}
.loginBut {
  width: 100%;
  height: 1.1733333333333333rem;
  background: #b8b8b8;
  border-radius: 0.10666666666666667rem;
  border: 0;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  pointer-events: none;
}
.yesLoginBut {
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  border: 0;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.loginMask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
}
.onTheMaskDiv {
  width: 8rem;
  height: 4.506666666666667rem;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.maskText {
  width: 6.4rem;
  margin: auto;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  text-align: center;
  line-height: 0.5866666666666667rem;
}
.maskText > span {
  color: #fc3d39;
}
.maskBtn {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.maskBtn > button {
  width: 50%;
  height: 1.1733333333333333rem;
  border: 0;
  background: #fff;
  border-top: 1px solid #dfdfdf;
  color: #373d41;
  font-size: 0.4266666666666667rem;
}
.maskBtn > button:nth-child(1) {
  /* border-right: 1px solid #DFDFDF; */
  color: #949494;
}
</style>


