<template>
    <div>
        <div class="realNameHeader">
            <div>实名认证</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <p class="realNameTopText">请完成以下实名认证，用于提币审核使用！</p>
        <div class="realNameBody">
            <p class="realName1">姓名</p>
            <div class="realName2" :style="'border-bottom:1px solid '+realName2Bor">
                <input type="text" v-model="realName2Model" maxlength="4" placeholder="请输入真实姓名" @focus="realName2Focus" @blur="realName2Blur">
            </div>
            <p class="realName3">身份证</p>
            <div class="realName4" :style="'border-bottom:1px solid '+realName4Bor">
                <input type="text" v-model="realName4Model" maxlength="18" placeholder="请输入身份证号码" @focus="realName4Focus" @blur="realName4Blur">
            </div>
            <button @click="realNameClick" :class="{realName5:(realName2Model=='')||(realName4Model==''),yesRealName5:(realName2Model!='')&&(realName4Model!='')}">完成</button>
        </div>
    </div>
</template>
<script>
import { storeSet, storeGet } from "scripts/moment";
import { Toast } from "mint-ui";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      realName2Bor: "#eaeaea",
      realName4Bor: "#eaeaea",
      realName2Model: "",
      realName4Model: ""
    };
  },
  methods: {
    back() {
      this.$router.push("/meAssets");
    },
    realName2Focus() {
      this.realName2Bor = "#FEC82F";
    },
    realName2Blur() {
      this.realName2Bor = "#eaeaea";
    },
    realName4Focus() {
      this.realName4Bor = "#FEC82F";
    },
    realName4Blur() {
      this.realName4Bor = "#eaeaea";
    },
    realNameClick() {
      var resIDcard = /\d{17}[\d|x]|\d{15}/;
      var resIDcards = resIDcard.test(this.realName4Model);
      var resName = /^[\u4E00-\u9FA5]{2,4}$/;
      var resNames = resName.test(this.realName2Model);
      if (this.realName2Model != "" && this.realName4Model != "") {
        if (resNames) {
          if (resIDcards) {
            let params = {
              userId: storeGet("userID"),
              realName: this.realName2Model,
              idNumber: this.realName4Model
            };
            let myRequestId = Encrypt.myUuid();
            let myTimestamp = Math.round(new Date().getTime()).toString();
            let myArr = [
              "requestId=" + myRequestId,
              "userId=" + storeGet("userID"),
              "realName=" + this.realName2Model,
              "idNumber=" + this.realName4Model
            ];
            let a =
              Encrypt.myFunction(myArr) +
              iconfig.ips.user_saveusercertification;
            let myValues = md5(a).toUpperCase();
            let headers = {
              requestId: myRequestId,
              timestamp: myTimestamp,
              channelType: "h5",
              sign: myValues
            };
            api.user.user_saveusercertification(params, headers).then(res => {
              if (res.data.code == 200) {
                this.$router.push("/purse");
              } else {
                Toast(res.data.message);
              }
            });
          } else {
            Toast("身份证号码格式不正确");
          }
        } else {
          Toast("姓名格式不正确");
        }
      } else {
        Toast("姓名或身份证号码不能为空");
      }
    }
  }
};
</script>
<style scoped>
.realNameHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.realNameHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.realNameHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.realNameHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.realNameHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.realNameTopText {
  background: #ff721f;
  font-size: 0.37333333333333335rem;
  color: #ffffff;
  height: 1.1733333333333333rem;
  text-align: center;
  line-height: 1.1733333333333333rem;
}
.realNameBody {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.0666666666666667rem;
}
.realName1,
.realName3 {
  font-size: 13px;
  color: #949494;
}
.realName3 {
  margin-top: 1.0133333333333334rem;
}
.realName2,
.realName4 {
  margin-top: 0.4266666666666667rem;
}
.realName2 > input,
.realName4 > input {
  width: 100%;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  padding-bottom: 0.26666666666666666rem;
}
.realName5 {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #b8b8b8;
  border-radius: 0.10666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  margin-top: 1.0666666666666667rem;
  pointer-events: none;
}
.yesRealName5 {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  margin-top: 1.0666666666666667rem;
}
</style>


