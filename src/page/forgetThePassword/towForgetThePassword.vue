<template>
    <div>
        <div class="towForgetPwTop"> <div class="towForgetPwBack"><span @click="back"></span><span>返回</span></div>忘记密码</div>
        <div class="towForgetPwContainer">
            <p class="towForgetPVerificationText">验证码</p>
            <div class="towForgetPVerificationDiv" :style="'border-bottom:1px solid '+towForgetPVerificationBor">  
                <input type="text" v-model="towForgetPVerificationModel" @focus="towForgetPVerificationFocus" @blur="towForgetPVerificationBlur">
                <button @click="towForgetCode"  :disabled="towForgetDisabled" class="towForgetPVerificationBtn">{{towForCodeText}}</button>
            </div>
            <p class="towForgetPwNewPwText">新密码</p>
            <div class="towForgetPwNewPwDiv" :style="'border-bottom:1px solid '+towForgetPwNewPwBor">
                <input type="password" v-model="towForgetPwNewPwModel" @focus="towForgetPwNewPwFocus" @blur="towForgetPwNewPwblur">
            </div>
            <p class="towForgetPwConfirmPwText">确认新密码</p>
            <div class="towForgetPwConfirmPwDiv" :style="'border-bottom:1px solid '+towForgetPwConfirmPwBor">
                <input type="password" v-model="towForgetPwConfirmPwModel" @focus="towForgetPwConfirmPwFocus" @blur="towForgetPwConfirmPwBlur">
            </div>
            <button :disabled="towForPsDisabled" @click="towForgetClick" :class="{towForgetPwBtn:(towForgetPVerificationModel=='')||(towForgetPwNewPwModel=='')||(towForgetPwConfirmPwModel==''),yesTowForgetPwBtn:(towForgetPVerificationModel!='')&&(towForgetPwNewPwModel!='')&&(towForgetPwConfirmPwModel!='')}">完成</button>
        </div>
        <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="towForgetPrompt" :position="position">{{('Basic Usage') }}</toast>
    </div>
</template>
<script>
import { sesGetStorage } from "scripts/moment";
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
      towForCodeText: "获取验证码",
      towForgetPVerificationBor: "#f2f2f2",
      towForgetPwNewPwBor: "#f2f2f2",
      towForgetPwConfirmPwBor: "#f2f2f2",
      towForgetPVerificationModel: "",
      towForgetPwNewPwModel: "",
      towForgetPwConfirmPwModel: "",
      towForgetDisabled: false,
      showPositionValue: false,
      towForgetPrompt: "",
      position: "",
      towForPsDisabled: false
    };
  },
  methods: {
    back() {
      this.$router.push("/oneForgetThePassword");
    },
    towForgetPVerificationFocus() {
      this.towForgetPVerificationBor = "#FEC82F";
    },
    towForgetPVerificationBlur() {
      this.towForgetPVerificationBor = "#f2f2f2";
    },
    towForgetPwNewPwFocus() {
      this.towForgetPwNewPwBor = "#FEC82F";
    },
    towForgetPwNewPwblur() {
      this.towForgetPwNewPwBor = "#f2f2f2";
    },
    towForgetPwConfirmPwFocus() {
      this.towForgetPwConfirmPwBor = "#FEC82F";
    },
    towForgetPwConfirmPwBlur() {
      this.towForgetPwConfirmPwBor = "#f2f2f2";
    },
    towForgetCode() {
      this.towForgetDisabled = true;
      var towForgetCodeTime = 60;
      this.towForCodeText = "重新获取" + towForgetCodeTime + "s";
      let params = {
        phone: sesGetStorage("forgPhone")
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "phone=" + sesGetStorage("forgPhone")
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
      var towForgetSet = setInterval(() => {
        towForgetCodeTime--;
        this.towForCodeText = "重新获取" + towForgetCodeTime + "s";
        if (towForgetCodeTime == 1) {
          clearInterval(towForgetSet);
          this.towForgetDisabled = false;
          this.towForCodeText = "获取验证码";
        }
      }, 1000);
    },
    towForgetClick() {
      var towForgetPas = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,}$/;
      var towForgetPass = towForgetPas.test(this.towForgetPwNewPwModel);
      if (
        this.towForgetPVerificationModel != "" &&
        this.towForgetPwNewPwModel != "" &&
        this.towForgetPwConfirmPwModel != ""
      ) {
        if (this.towForgetPwNewPwModel == this.towForgetPwConfirmPwModel) {
          if (towForgetPass) {
            this.towForPsDisabled = true;
            let params = {
              phone: sesGetStorage("forgPhone"),
              verificationCode: this.towForgetPVerificationModel,
              newPassword: md5(this.towForgetPwNewPwModel)
            };
            let myRequestId = Encrypt.myUuid();
            let myTimestamp = Math.round(new Date().getTime()).toString();
            let myArr = [
              "requestId=" + myRequestId,
              "phone=" + sesGetStorage("forgPhone"),
              "werifcationCode=" + this.towForgetPVerificationModel,
              "newPassword=" + md5(this.towForgetPwNewPwModel)
            ];
            let a = Encrypt.myFunction(myArr) + iconfig.ips.user_forgetpassword;
            let myValues = md5(a).toUpperCase();
            let headers = {
              requestId: myRequestId,
              timestamp: myTimestamp,
              channelType: "h5",
              sign: myValues
            };
            api.user.user_forgetpassword(params, headers).then(res => {
              if (res.data.code == 200) {
                this.$router.push("/loginAndRegister");
              } else {
                this.towForgetPrompt = res.data.message;
                this.position = "middle";
                this.showPositionValue = true;
              }
            });
            setTimeout(() => {
              this.towForPsDisabled = false;
            }, 5000);
          } else {
            this.towForgetPrompt = "密码格式不正确";
            this.position = "middle";
            this.showPositionValue = true;
          }
        } else {
          this.towForgetPrompt = "两次密码不一致";
          this.position = "middle";
          this.showPositionValue = true;
        }
      }
    }
  },
  created() {}
};
</script>
<style scoped>
.towForgetPwTop {
  width: 100%;
  height: 1.1733333333333333rem;
  border-bottom: 1px solid #f2f2f2;
  text-align: center;
  line-height: 1.1733333333333333rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  font-weight: bolder;
  position: relative;
}
.towForgetPwBack {
  position: absolute;
  left: 0.29333333333333333rem;
  top: 0;
  bottom: 0;
  margin: auto;
  line-height: 1.1733333333333333rem;
  font-size: 0.37333333333333335rem;
  color: #949494;
}
.towForgetPwBack > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.4rem;
  position: relative;
  top: 0.05333333333333334rem;
  margin-right: 0.18666666666666668rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
}
.towForgetPwContainer {
  width: 7.894736842105263rem;
  margin: auto;
  margin-top: 1.3066666666666666rem;
}
.towForgetPVerificationText,
.towForgetPwNewPwText,
.towForgetPwConfirmPwText {
  font-size: 0.3466666666666667rem;
  color: #949494;
  margin-top: 0.5066666666666667rem;
}
.towForgetPVerificationText {
  margin-top: 0;
}
.towForgetPVerificationDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
  padding-bottom: 0.26666666666666666rem;
  position: relative;
}
.towForgetPVerificationBtn {
  position: absolute;
  right: 0;
  bottom: 0.26666666666666666rem;
  width: 2.88rem;
  height: 0.8533333333333334rem;
  border: 0;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.towForgetPwNewPwDiv,
.towForgetPwConfirmPwDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
  padding-bottom: 0.26666666666666666rem;
}
.towForgetPVerificationDiv > input,
.towForgetPwNewPwDiv > input,
.towForgetPwConfirmPwDiv > input {
  width: 100%;
  font-size: 0.4266666666666667rem;
}
.towForgetPwBtn {
  width: 100%;
  height: 1.1733333333333333rem;
  margin-top: 1.04rem;
  border: 0;
  background: #b8b8b8;
  border-radius: 0.10666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  pointer-events: none;
}
.yesTowForgetPwBtn {
  width: 100%;
  height: 1.1733333333333333rem;
  margin-top: 1.04rem;
  border: 0;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
</style>


