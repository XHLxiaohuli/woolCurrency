<template>
    <div>
        <div class="modifyUserNameHeader">
            <div>用户名</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="modifyUserNameContainer">
            <p class="modifyUserNameText">修改用户名</p>
            <div class="modifyUserNameDiv" :style="'border-bottom:1px solid '+modifyUserNameBor">
                <input type="text" maxlength="6" @input="modifyUserNameInput" v-model="modifyUserNameModel" @focus="modifyUserNameFocus" @blur="modifyUserNameBlur">
            </div>
            <p class="modifyUserNamePrompt">用户名只可修改一次且不可超过6个字符</p>
            <button @click="modUsername" :class="{modifyUserNameBtn:userNameCorrect===false,yesModifyUserNameBtn:userNameCorrect===true}">保存</button>
        </div>
    </div>
</template>
<script>
import { storeGet, storeSet } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      modifyUserNameBor: "#EAEAEA",
      modifyUserNameModel: "",
      userNameCorrect: false
    };
  },
  methods: {
    back() {
      this.$router.push("/userCenter");
    },
    modifyUserNameFocus() {
      this.modifyUserNameBor = "#FEC82F";
    },
    modifyUserNameBlur() {
      this.modifyUserNameBor = "#EAEAEA";
    },
    modifyUserNameInput() {
      if (this.modifyUserNameModel != "") {
        this.userNameCorrect = true;
      } else {
        this.userNameCorrect = false;
      }
    },
    modUsername() {
      if (this.modifyUserNameModel != "") {
        if (storeGet("userID") == null || storeGet("userID") == undefined) {
          this.$router.push("/loginAndRegister");
        } else {
          let params = {
            userId: storeGet("userID"),
            headUrl: "",
            username: this.modifyUserNameModel
          };
          let myRequestId = Encrypt.myUuid();
          let myTimestamp = Math.round(new Date().getTime()).toString();
          let myArr = [
            "requestId=" + myRequestId,
            "userId=" + storeGet("userID"),
            "headUrl=" + "",
            "username=" + this.modifyUserNameModel
          ];
          let a = Encrypt.myFunction(myArr) + iconfig.ips.user_updateuserinfo;
          let myValues = md5(a).toUpperCase();
          let headers = {
            requestId: myRequestId,
            timestamp: myTimestamp,
            channelType: "h5",
            sign: myValues
          };
          api.user.user_updateuserinfo(params, headers).then(res => {
            if (res.data.code == 200) {
              storeSet("username", this.modifyUserNameModel);
              this.$router.push("/bottomtab/me");
            }
          });
        }
      }
    }
  }
};
</script>
<style scoped>
.modifyUserNameHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.modifyUserNameHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.modifyUserNameHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.modifyUserNameHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.modifyUserNameHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.modifyUserNameContainer {
  width: 9.333333333333334rem;
  margin: auto;
  margin-top: 1.0666666666666667rem;
}
.modifyUserNameText {
  font-size: 0.3466666666666667rem;
  color: #949494;
  padding-bottom: 0.4266666666666667rem;
}
.modifyUserNameDiv {
  width: 100%;
}
.modifyUserNameDiv > input {
  width: 100%;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  padding-bottom: 0.26666666666666666rem;
}
.modifyUserNamePrompt {
  font-size: 0.32rem;
  color: #fc3d39;
  margin-top: 0.32rem;
}
.modifyUserNameBtn {
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
.yesModifyUserNameBtn {
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


