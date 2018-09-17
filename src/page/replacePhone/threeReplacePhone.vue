<template>
    <div>
        <div class="threeReplacePhoneHeader">
            <div>新手机号码</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div> 
        <div class="threeReplacePhoneContainer">
            <p class="threeReplacePhoneNumText">新手机号码</p>
            <div class="threeReplacePhoneNumDiv" :style="'border-bottom:1px solid '+threeReplacePhoneNumBor">
                <input type="tel" maxlength="11" v-model="threeReplacePhoneNumModel" @focus="threeReplacePhoneNumFocus" @blur="threeReplacePhoneNumBlur">
            </div>
            <p class="threeReplacePhoneCodeText">验证码</p>
            <div class="threeReplacePhoneCodeDiv" :style="'border-bottom:1px solid '+threeReplacePhoneCodeBor">
                <input type="number" v-model="threeReplacePhoneCodeModel" @focus="threeReplacePhoneCodeFocus" @blur="threeReplacePhoneCodeBlur">
                <button @click="sendThreeCodeClick" :disabled="sendThreeDisabled">{{sendThreeReplacePhoneCode}}</button>
            </div>
            <button :disabled="completeDisabled" @click="threeRepClick" :class="{threeReplacePhoneBtn:(threeReplacePhoneNumModel=='')||(threeReplacePhoneCodeModel==''),yesThreeReplacePhoneBtn:(threeReplacePhoneNumModel!='')&&(threeReplacePhoneCodeModel!='')}">完成</button>
        </div>
        <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="threeRepPrompt" :position="position">{{('Basic Usage') }}</toast>
    </div>
</template>
<script>
import { sesGetStorage, storeGet } from "scripts/moment";
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
      sendThreeReplacePhoneCode: "发送验证码",
      threeReplacePhoneNumBor: "#EAEAEA",
      threeReplacePhoneCodeBor: "#EAEAEA",
      threeReplacePhoneNumModel: "",
      threeReplacePhoneCodeModel: "",
      sendThreeDisabled: false,
      showPositionValue: false,
      threeRepPrompt: "",
      position: "",
      completeDisabled: false
    };
  },
  methods: {
    back() {
      this.$router.push("/towReplacePhone");
    },
    threeReplacePhoneNumFocus() {
      this.threeReplacePhoneNumBor = "#FEC82F";
    },
    threeReplacePhoneNumBlur() {
      this.threeReplacePhoneNumBor = "#EAEAEA";
    },
    threeReplacePhoneCodeFocus() {
      this.threeReplacePhoneCodeBor = "#FEC82F";
    },
    threeReplacePhoneCodeBlur() {
      this.threeReplacePhoneCodeBor = "#EAEAEA";
    },
    sendThreeCodeClick() {
      var sendThreeRs = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var sendThreeRss = sendThreeRs.test(this.threeReplacePhoneNumModel);
      if (this.threeReplacePhoneNumModel != "") {
        if (sendThreeRss) {
          this.sendThreeDisabled = true;
          var threeTime = 60;
          this.sendThreeReplacePhoneCode = "重新获取" + threeTime + "s";
          let params = {
            phone: this.threeReplacePhoneNumModel
          };
          let myRequestId = Encrypt.myUuid();
          let myTimestamp = Math.round(new Date().getTime()).toString();
          let myArr = [
            "requestId=" + myRequestId,
            "phone=" + this.threeReplacePhoneNumModel
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

          var codeSetTimes = setInterval(() => {
            threeTime--;
            this.sendThreeReplacePhoneCode = "重新获取" + threeTime + "s";
            if (threeTime == 1) {
              clearInterval(codeSetTimes);
              this.sendThreeDisabled = false;
              this.sendThreeReplacePhoneCode = "获取验证码";
            }
          }, 1000);
        } else {
          this.threeRepPrompt = "手机号码格式不正确";
          this.position = "middle";
          this.showPositionValue = true;
        }
      } else {
        this.threeRepPrompt = "手机号码不能为空";
        this.position = "middle";
        this.showPositionValue = true;
      }
    },
    threeRepClick() {
      var sendThreeRst = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var sendThreeRsts = sendThreeRst.test(this.threeReplacePhoneNumModel);
      if (
        this.threeReplacePhoneNumModel != "" &&
        this.threeReplacePhoneCodeModel != ""
      ) {
        if (this.threeReplacePhoneNumModel != sesGetStorage("userphone")) {
          if (sendThreeRsts) {
            this.completeDisabled = true;
            let params = {
              userId: storeGet("userID"),
              verificationCode: this.threeReplacePhoneCodeModel,
              originalPhone: sesGetStorage("userphone"),
              newPhone: this.threeReplacePhoneNumModel
            };
            let myRequestId = Encrypt.myUuid();
            let myTimestamp = Math.round(new Date().getTime()).toString();
            let myArr = [
              "requestId=" + myRequestId,
              "userId=" + storeGet("userID"),
              "verificationCode=" + this.threeReplacePhoneCodeModel,
              "originalPhone=" + sesGetStorage("userphone"),
              "newPhone=" + this.threeReplacePhoneNumModel
            ];
            let a =
              Encrypt.myFunction(myArr) + iconfig.ips.user_updateuserphone;
            let myValues = md5(a).toUpperCase();
            let headers = {
              requestId: myRequestId,
              timestamp: myTimestamp,
              channelType: "h5",
              sign: myValues
            };
            api.user.user_updateuserphone(params, headers).then(res => {
              if (res.data.code == 200) {
                this.$router.push("/bottomtab/me");
              } else {
                this.threeRepPrompt = res.data.message;
                this.position = "middle";
                this.showPositionValue = true;
              }
            });
            setTimeout(() => {
              this.completeDisabled = false;
            }, 5000);
          } else {
            this.threeRepPrompt = "手机号码格式不正确";
            this.position = "middle";
            this.showPositionValue = true;
          }
        } else {
          this.threeRepPrompt = "新号码不能和旧号码一样";
          this.position = "middle";
          this.showPositionValue = true;
        }
      }
    }
  }
};
</script>
<style scoped>
.threeReplacePhoneHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.threeReplacePhoneHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.threeReplacePhoneHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.threeReplacePhoneHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.threeReplacePhoneHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.threeReplacePhoneContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.04rem;
}
.threeReplacePhoneNumText,
.threeReplacePhoneCodeText {
  font-size: 0.3466666666666667rem;
  color: #949494;
}
.threeReplacePhoneCodeText {
  margin-top: 0.5066666666666667rem;
}
.threeReplacePhoneNumDiv,
.threeReplacePhoneCodeDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
  position: relative;
}
.threeReplacePhoneNumDiv > input,
.threeReplacePhoneCodeDiv > input {
  width: 100%;
  padding-bottom: 0.26666666666666666rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.threeReplacePhoneCodeDiv > button {
  border: 0;
  width: 2.6666666666666665rem;
  height: 0.8533333333333334rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  position: absolute;
  right: 0;
  bottom: 0.26666666666666666rem;
}
.threeReplacePhoneBtn {
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
.yesThreeReplacePhoneBtn {
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


