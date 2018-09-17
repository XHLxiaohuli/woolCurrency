<template>
    <div>
        <div class="passwordManagementHeader">
            <div>密码管理</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="passwordMagContainer">
            <p class="oldPasWordText">原密码</p>
            <div class="oldPasWordDiv" :style="'border-bottom:1px solid '+oldPasWordBor">
                <input type="password" v-model="oldPasWordModel" @focus="oldPasWordFocus" @blur="oldPasWordBlur">
            </div>
            <p class="newOasWordText">新密码</p>
            <div class="newOasWordDiv" :style="'border-bottom:1px solid '+newOasWordBor">
                <input type="password" v-model="newOasWordModel" @focus="newOasWordFocus" @blur="newOasWordBlur">
            </div>
            <p class="repeatNewOasWordText">重复新密码</p>
            <div class="repeatNewOasWordDiv" :style="'border-bottom:1px solid '+repeatNewOasWordBor">
                <input type="password" v-model="repeatNewOasWordModel" @focus="repeatNewOasWordFocus" @blur="repeatNewOasWordBlur">
            </div>
            <button :disabled="pasManDisabled" @click="passwordMagClick" :class="{passwordManagementBtn:(oldPasWordModel=='')||(newOasWordModel=='')||(repeatNewOasWordModel==''),yesPasswordManagementBtn:(oldPasWordModel!='')&&(newOasWordModel!='')&&(repeatNewOasWordModel!='')}">确定</button>
        </div>
        <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="paswodPrompt" :position="position">{{('Basic Usage') }}</toast>
    </div>
</template>
<script>
import { sesGetStorage, storeGet, storeClear } from "scripts/moment";
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
      oldPasWordBor: "#eaeaea",
      newOasWordBor: "#eaeaea",
      repeatNewOasWordBor: "#eaeaea",
      oldPasWordModel: "",
      newOasWordModel: "",
      repeatNewOasWordModel: "",
      showPositionValue: false,
      paswodPrompt: "",
      position: "",
      pasManDisabled: false
    };
  },
  methods: {
    back() {
      this.$router.push("/userCenter");
    },
    oldPasWordFocus() {
      this.oldPasWordBor = "#FEC82F";
    },
    oldPasWordBlur() {
      this.oldPasWordBor = "#eaeaea";
    },
    newOasWordFocus() {
      this.newOasWordBor = "#FEC82F";
    },
    newOasWordBlur() {
      this.newOasWordBor = "#eaeaea";
    },
    repeatNewOasWordFocus() {
      this.repeatNewOasWordBor = "#FEC82F";
    },
    repeatNewOasWordBlur() {
      this.repeatNewOasWordBor = "#eaeaea";
    },
    passwordMagClick() {
      var poswodRs = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-z]|[A-Z]|[0-9]){6,}$/;
      var poswodRss = poswodRs.test(this.oldPasWordModel);
      var towPoswodRss = poswodRs.test(this.newOasWordModel);
      if (
        this.oldPasWordModel != "" &&
        this.newOasWordModel != "" &&
        this.repeatNewOasWordModel != ""
      ) {
        if (poswodRss && towPoswodRss) {
          if (this.newOasWordModel == this.repeatNewOasWordModel) {
            this.pasManDisabled = true;
            let params = {
              userId: storeGet("userID"),
              originalPassword: md5(this.oldPasWordModel),
              newPassword: md5(this.newOasWordModel)
            };
            let myRequestId = Encrypt.myUuid();
            let myTimestamp = Math.round(new Date().getTime()).toString();
            let myArr = [
              "requestId=" + myRequestId,
              "userId=" + storeGet("userID"),
              "originalPassword=" + md5(this.oldPasWordModel),
              "newPassword=" + md5(this.newOasWordModel)
            ];
            let a = Encrypt.myFunction(myArr) + iconfig.ips.user_updatepassword;
            let myValues = md5(a).toUpperCase();
            let headers = {
              requestId: myRequestId,
              timestamp: myTimestamp,
              channelType: "h5",
              sign: myValues
            };
            api.user.user_updatepassword(params, headers).then(res => {
              if (res.data.code == 200) {
                let paramss = {
                  userId: storeGet("userID")
                };
                let myRequestId = Encrypt.myUuid();
                let myTimestamp = Math.round(new Date().getTime()).toString();
                let myArr = [
                  "requestId=" + myRequestId,
                  "userId=" + storeGet("userID")
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
                  storeClear();
                  this.$router.push("/loginAndRegister");
                });
              } else {
                this.paswodPrompt = res.data.message;
                this.position = "middle";
                this.showPositionValue = true;
              }
            });
            setTimeout(() => {
              this.pasManDisabled = false;
            }, 5000);
          } else {
            this.paswodPrompt = "新密码和确认密码不一致";
            this.position = "middle";
            this.showPositionValue = true;
          }
        } else {
          this.paswodPrompt = "新密码或者旧密码格式不正确";
          this.position = "middle";
          this.showPositionValue = true;
        }
      }
    }
  }
};
</script>
<style scoped>
.passwordManagementHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.passwordManagementHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.passwordManagementHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.passwordManagementHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.passwordManagementHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.passwordMagContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.04rem;
}
.oldPasWordText,
.newOasWordText,
.repeatNewOasWordText {
  font-size: 0.3466666666666667rem;
  color: #949494;
  margin-top: 0.5333333333333333rem;
}
.oldPasWordText {
  margin-top: 0;
}
.oldPasWordDiv,
.newOasWordDiv,
.repeatNewOasWordDiv {
  margin-top: 0.4266666666666667rem;
  width: 100%;
}
.oldPasWordDiv > input,
.newOasWordDiv > input,
.repeatNewOasWordDiv > input {
  width: 100%;
  padding-bottom: 0.26666666666666666rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.passwordManagementBtn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #b8b8b8;
  border-radius: 0.10666666666666667rem;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  pointer-events: none;
}
.yesPasswordManagementBtn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
</style>

