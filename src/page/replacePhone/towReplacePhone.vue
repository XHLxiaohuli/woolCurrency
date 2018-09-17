<template>
    <div>
       <div class="towReplacePhoneHeader">
            <div>手机号码</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div> 
        <div class="towReplacePhoneContainer">
            <p class="towReplacePhoneNumText">原手机号码</p>
            <div class="towReplacePhoneNumDiv">
                <input type="text" readonly="readonly" :value="towReplacePhoneValue">
            </div>
            <p class="towReplacePhoneCodeText">验证码</p>
            <div class="towReplacePhoneCodeDiv" :style="'border-bottom:1px solid '+towReplacePhoneCodeBor">
                <input type="number" v-model="towReplacePhoneCodeModel" @focus="towReplacePhoneCodeFocus" @blur="towReplacePhoneCodeBlur">
                <button @click="sendCodeClick" :disabled="sendCodeDisabled">{{sendCode}}</button>
            </div>
            <button  @click="jumpThreeReplacePhone" :class="{towReplacePhoneBtn:towReplacePhoneCodeModel=='',yesTowReplacePhoneBtn:towReplacePhoneCodeModel!=''}">下一步</button>
        </div>
    </div>
</template>
<script>
import { sesGetStorage, storeGet } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      sendCode: "发送验证码",
      towReplacePhoneValue: "",
      towReplacePhoneCodeBor: "#EAEAEA",
      towReplacePhoneCodeModel: "",
      sendCodeDisabled: false
    };
  },
  methods: {
    back() {
      this.$router.push("/oneReplacePhone");
    },
    towReplacePhoneCodeFocus() {
      this.towReplacePhoneCodeBor = "#FEC82F";
    },
    towReplacePhoneCodeBlur() {
      this.towReplacePhoneCodeBor = "#EAEAEA";
    },
    jumpThreeReplacePhone() {
      if (this.towReplacePhoneCodeModel != "") {
        let params = {
          userId: storeGet("userID"),
          phone: this.towReplacePhoneValue,
          verificationCode: this.towReplacePhoneCodeModel
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "userId=" + storeGet("userID"),
          "phone=" + this.towReplacePhoneValue,
          "verificationCode=" + this.towReplacePhoneCodeModel
        ];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.user_verifyuserphone;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.user.user_verifyuserphone(params, headers).then(res => {
          if (res.data.code == 200) {
            this.$router.push("/ThreeReplacePhone");
          }
        });
      }
    },
    sendCodeClick() {
      this.sendCodeDisabled = true;
      var sendCodeTime = 60;
      this.sendCode = "重新获取" + sendCodeTime + "s";
      let params = {
        phone: this.towReplacePhoneValue
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "phone=" + this.towReplacePhoneValue
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
        sendCodeTime--;
        this.sendCode = "重新获取" + sendCodeTime + "s";
        if (sendCodeTime == 1) {
          clearInterval(codeSetTime);
          this.sendCodeDisabled = false;
          this.sendCode = "获取验证码";
        }
      }, 1000);
    },
    towPullPhone() {
      this.towReplacePhoneValue = sesGetStorage("userphone");
    }
  },
  created() {
    this.towPullPhone();
  }
};
</script>
<style scoped>
.towReplacePhoneHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.towReplacePhoneHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.towReplacePhoneHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.towReplacePhoneHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.towReplacePhoneHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.towReplacePhoneContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.04rem;
}
.towReplacePhoneNumText,
.towReplacePhoneCodeText {
  font-size: 0.3466666666666667rem;
  color: #949494;
}
.towReplacePhoneCodeText {
  margin-top: 0.5066666666666667rem;
}
.towReplacePhoneNumDiv,
.towReplacePhoneCodeDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
  border-bottom: 1px solid #eaeaea;
  position: relative;
}
.towReplacePhoneNumDiv > input,
.towReplacePhoneCodeDiv > input {
  width: 100%;
  padding-bottom: 0.26666666666666666rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.towReplacePhoneCodeDiv > button {
  border: 0;
  width: 2.6666666666666665rem;
  height: 0.8533333333333334rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  position: absolute;
  right: 0;
  bottom: 0.26666666666666666rem;
}
.towReplacePhoneBtn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  background: #b8b8b8;
  border-radius: 0.10666666666666667rem;
  pointer-events: none;
}
.yesTowReplacePhoneBtn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
}
</style>


