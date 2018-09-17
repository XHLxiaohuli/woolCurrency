<template>
    <div>
        <div class="feedbackHeader">
            <div>意见反馈</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="feedbackContainer">
            <p>意见反馈</p>
            <div>
                <textarea maxlength="216" v-model="textareaModel" @input="textareaInput"></textarea>
                <div><span>{{textareaLength}}</span>/216</div>
            </div>
            <p>联系方式(选填)</p>
            <div class="feedbackValue" :style="'border-bottom:1px solid '+feedbackValueBor">
                <input type="text" v-model="feedPhoneModel">
            </div>
            <button :disabled="feedbackDisabled"  @click="feedbackSend" class="feedbackSendBtn">发送</button>
        </div>
    </div>
</template>
<script>
import { storeGet } from "scripts/moment";
import { Toast } from "mint-ui";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      textareaModel: "",
      feedPhoneModel: "",
      textareaLength: 0,
      feedbackValueBor: "#EAEAEA",
      feedbackDisabled: false
    };
  },
  methods: {
    back() {
      this.$router.push("/callCustomerService");
    },
    textareaInput() {
      this.textareaLength = this.textareaModel.length;
    },
    feedbackSend() {
      if (this.textareaModel != "") {
        this.feedbackDisabled = true;
        //用户意见反馈
        let params = {
          userId: storeGet("userID"),
          content: this.textareaModel,
          contact: this.feedPhoneModel
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "userId=" + storeGet("userID"),
          "content=" + this.textareaModel,
          "contact=" + this.feedPhoneModel
        ];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.user_savefeedback;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.user.user_savefeedback(params, headers).then(res => {
          if (res.data.code == 200) {
            Toast("发送成功");
            this.textareaModel = "";
            this.feedPhoneModel = "";
          } else {
            Toast(res.data.message);
          }
        });
        setTimeout(() => {
          this.feedbackDisabled = false;
        }, 5000);
      }
    }
  }
};
</script>
<style scoped>
.feedbackHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.feedbackHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.feedbackHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.feedbackHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.feedbackHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.feedbackContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.04rem;
}
.feedbackContainer > p:nth-child(1) {
  font-size: 0.3466666666666667rem;
  color: #949494;
}
.feedbackContainer > div:nth-child(2) {
  width: 100%;
  height: 5.226666666666667rem;
  position: relative;
  margin-top: 0.26666666666666666rem;
}
.feedbackContainer > div:nth-child(2) > textarea:nth-child(1) {
  padding: 0;
  width: 100%;
  height: 100%;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  line-height: 0.6933333333333334rem;
}
::-webkit-scrollbar {
  width: 0;
}
.feedbackContainer > div:nth-child(2) > div:nth-child(2) {
  width: 1.2rem;
  height: 0.4533333333333333rem;
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 0.32rem;
  color: #19001d;
}
.feedbackContainer > div:nth-child(2) > div:nth-child(2) > span {
  color: #949494;
}
.feedbackContainer > p:nth-child(3) {
  font-size: 0.3466666666666667rem;
  color: #949494;
  margin-top: 0.5333333333333333rem;
}
.feedbackValue {
  width: 100%;
  margin-top: 0.4266666666666667rem;
}
.feedbackValue > input {
  width: 100%;
  padding-bottom: 0.26666666666666666rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.feedbackSendBtn {
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

