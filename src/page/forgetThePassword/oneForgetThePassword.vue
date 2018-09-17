<template>
    <div>
        <div class="oneForgetPwTop"> <div class="oneForgetPwBack"><span @click="back"></span><span>返回</span></div>忘记密码</div>
        <div class="oneForgetPwContainer">
            <p class="oneForgetPwText">手机号码</p>
            <div class="oneForgetPwDiv" :style="'border-bottom:1px solid '+oneForgetPwBor">
                <input type="tel" maxlength="11" v-model="oneForgetPwModel" @focus="oneForgetPwFocus" @blur="oneForgetPwBlur">
            </div>
            <button :disabled="oneForPasDisabled" @click="jumpTowForgetPw" :class="{oneForgetPwBtn:oneForgetPwModel=='',yesOneForgetPwBtn:oneForgetPwModel!=''}" >下一步</button>
        </div>
        <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="oneForgetPrompt" :position="position">{{('Basic Usage') }}</toast>
    </div>
</template>
<script>
import { sesStorage } from "scripts/moment";
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
      oneForgetPwBor: "#f2f2f2",
      oneForgetPwModel: "",
      showPositionValue: false,
      oneForgetPrompt: "",
      position: "",
      oneForPasDisabled: false
    };
  },
  methods: {
    back() {
      this.$router.push("/loginAndRegister");
    },
    oneForgetPwFocus() {
      this.oneForgetPwBor = "#FEC82F";
    },
    oneForgetPwBlur() {
      this.oneForgetPwBor = "#f2f2f2;";
    },
    jumpTowForgetPw() {
      var oneForgetPhone = /^[1][0,1,2,3,4,5,6,7,8,9][0-9]{9}$/;
      var oneForgetPhones = oneForgetPhone.test(this.oneForgetPwModel);
      if (this.oneForgetPwModel != "") {
        if (oneForgetPhones) {
          this.oneForPasDisabled = true;
          let params = {
            phone: this.oneForgetPwModel
          };
          let myRequestId = Encrypt.myUuid();
          let myTimestamp = Math.round(new Date().getTime()).toString();
          let myArr = [
            "requestId=" + myRequestId,
            "phone=" + this.oneForgetPwModel
          ];
          let a =
            Encrypt.myFunction(myArr) + iconfig.ips.user_verificationphoneisreg;
          let myValues = md5(a).toUpperCase();
          let headers = {
            requestId: myRequestId,
            timestamp: myTimestamp,
            channelType: "h5",
            sign: myValues
          };
          api.user.user_verificationphoneisreg(params, headers).then(res => {
            if (res.data.code == 200) {
              this.oneForgetPrompt = "该手机号未注册";
              this.position = "middle";
              this.showPositionValue = true;
            } else {
              sesStorage("forgPhone", this.oneForgetPwModel);
              this.$router.push("/towForgetThePassword");
            }
          });
          setTimeout(() => {
            this.oneForPasDisabled = false;
          }, 5000);
        }
      }
    }
  }
};
</script>
<style scoped>
.oneForgetPwTop {
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
.oneForgetPwBack {
  position: absolute;
  left: 0.29333333333333333rem;
  top: 0;
  bottom: 0;
  margin: auto;
  line-height: 1.1733333333333333rem;
  font-size: 0.37333333333333335rem;
  color: #949494;
}
.oneForgetPwBack > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.4rem;
  position: relative;
  top: 0.05333333333333334rem;
  margin-right: 0.18666666666666668rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
}
.oneForgetPwContainer {
  width: 8rem;
  margin: auto;
  margin-top: 1.3066666666666666rem;
}
.oneForgetPwText {
  font-size: 0.3466666666666667rem;
  color: #949494;
}
.oneForgetPwDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
  padding-bottom: 0.26666666666666666rem;
}
.oneForgetPwDiv > input {
  width: 100%;
  font-size: 0.4266666666666667rem;
}
.oneForgetPwBtn {
  width: 100%;
  height: 1.1733333333333333rem;
  border: 0;
  background: #b8b8b8;
  border-radius: 0.10666666666666667rem;
  margin-top: 1.04rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  pointer-events: none;
}
.yesOneForgetPwBtn {
  width: 100%;
  height: 1.1733333333333333rem;
  border: 0;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  margin-top: 1.04rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
</style>


