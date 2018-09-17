<template>
    <div class="meContainer">
        <div class="meTopText">我的</div>
        <div class="meTopContainer">
            <div class="BasicInformation">
                <div @click="jumpUserCenter"><img :src="userHead" alt=""></div>
                <div>
                    <p>{{userName}}</p>
                    <p>ID: {{userId}}</p>
                </div>
                <div class="AccountSetting" @click="jumpUserCenter"><span>账户设置</span><span></span></div>
            </div>
            <div class="userBtcInt" @click="jumpMeAssets">
                <p>我的YMB:<span>{{userBTC}}</span></p>
                <p>每日签到领取YMB，投票奖励更丰厚！</p>
                <div></div>
            </div>
        </div>
        <ul class="meReleaseUl">
            <li v-for="(item,index) in myTextData" @click="jumpAboutMe(index)">
                <div class="meRelease">
                    <div>
                        <img :src="item.url" alt="">
                    </div>
                    <div>{{item.text}}</div>
                    <div></div>
                </div>
            </li>
        </ul>
        <button @click="signOutLogin" class="signOutBtn">安全退出</button>
        <!--确认退出弹框-->
        <div class="QRtuichu" v-show="showQRtuichu">
          <div class="onTheQRtuichu">
            <p class="QRtuichuText">确定退出当前帐号吗？</p>
            <button @click="meCancelSignout">取消</button><button @click="meConfirmSignout">退出</button>
          </div>
        </div>
        <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="mePrompt" :position="position">{{('Basic Usage') }}</toast>
    </div>
</template>
<script>
import {
  storeSet,
  storeGet,
  storeClear,
  sesStorage,
  sesGetStorage
} from "scripts/moment";
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
      userName: "",
      userId: "",
      userHead: "",
      userBTC: "",
      myTextData: [
        {
          url: require("../../static/img/my_imges_project@2x.png"),
          text: "我发布的项目"
        },
        {
          url: require("../../static/img/my_images_love@2x.png"),
          text: "我的收藏"
        },
        {
          url: require("../../static/img/my_images_invite@2x.png"),
          text: "邀请好友"
        },
        {
          url: require("../../static/img/my-images_new@2x.png"),
          text: "关于新币榜"
        },
        {
          url: require("../../static/img/my_images_contact@2x.png"),
          text: "联系客服"
        }
      ],
      showPositionValue: false,
      mePrompt: "",
      position: "",
      isLogin: "",
      showQRtuichu:false,
    };
  },
  methods: {
    jumpUserCenter() {
      this.$router.push("/userCenter");
    },
    jumpAboutMe(index) {
      if (index == 0) {
        this.$router.push("/meReleaseProject");
      } else if (index == 1) {
        this.$router.push("/meCollection");
      } else if (index == 2) {
        this.$router.push("/invitingFriends");
      } else if (index == 3) {
        this.$router.push("/newCoinList");
      } else if (index == 4) {
        this.$router.push("/callCustomerService");
      }
    },
    jumpMeAssets() {
      this.$router.push("/meAssets");
    },
    obtainUserInformation() {
      this.isLogin = storeGet("userID");
      if (this.isLogin == null || this.isLogin == undefined) {
        this.$router.push("/loginAndRegister");
      } else {
        let params = {
          userId: storeGet("userID")
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "userId=" + storeGet("userID")
        ];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.user_getuserinfo;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.user.user_getuserinfo(params, headers).then(res => {
          if (res.data.code == 200) {
            if (res.data.data.status == -1) {
              this.mePrompt = "该账号涉及违规";
              this.position = "middle";
              this.showPositionValue = true;
              setTimeout(() => {
                let params = {
                  userId: storeGet("userID")
                };
                let myRequestId = Encrypt.myUuid();
                let myTimestamp = Math.round(new Date().getTime()).toString();
                let myArr = [
                  "requestId=" + myRequestId,
                  "userId=" + storeGet("userID")
                ];
                let a = Encrypt.myFunction(myArr) + iconfig.ips.user_logout;
                let myValues = md5(a).toUpperCase();
                let headers = {
                  requestId: myRequestId,
                  timestamp: myTimestamp,
                  channelType: "h5",
                  sign: myValues
                };
                api.user.user_logout(params, headers).then(res => {
                  storeClear();
                  this.$router.push("/loginAndRegister");
                });
              }, 2000);
            } else {
              storeSet("userID", res.data.data.userId);
              storeSet("username", res.data.data.username);
              sesStorage("userphone", res.data.data.phone);
              sesStorage("userhead", res.data.data.head);
              sesStorage("isOneUpdateName", res.data.data.isOneUpdateName);
              sesStorage("serialNumber", res.data.data.serialNumber);
              sesStorage("isCertification", res.data.data.isCertification);
              this.userName = res.data.data.username;
              this.userId = res.data.data.serialNumber;
              this.userHead = res.data.data.head;
              this.userBTC = res.data.data.ymbNum;
            }
          }
        });
      }
    },
    signOutLogin() {
      this.showQRtuichu=true
    
    },
    //取消退出登录
    meCancelSignout(){
      this.showQRtuichu=false
    },
    //确认退出
    meConfirmSignout(){
      this.showQRtuichu=false
        let params = {
          userId: storeGet("userID")
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = ["requestId=" + myRequestId, "userId=" + storeGet("userID")];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.user_logout;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.user.user_logout(params, headers).then(res => {
          storeClear();
          this.$router.push("/loginAndRegister");
        });
    }
  },
  created() {
    this.obtainUserInformation();
  }
};
</script>
<style scoped>
.meContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: #f2f2f8;
  overflow: scroll;
}
::-webkit-scrollbar {
  width: 0;
}
.meTopText {
  width: 100%;
  height: 1.1733333333333333rem;
  line-height: 1.1733333333333333rem;
  text-align: center;
  font-size: 0.48rem;
  color: #373d41;
  border: 1px solid #f2f2f2;
  background: #fff;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  z-index: 100;
}
.meTopContainer:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.meTopContainer {
  width: 100%;
  margin: auto;
  margin-bottom: 0.21333333333333335rem;
  background: #fff;
  margin-top: 1.1733333333333333rem;
}
.userBtcInt {
  width: 9.36rem;
  margin: auto;
  background: url("../../static/img/userBtcPic.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 0.64rem;
  padding-bottom: 0.64rem;
  margin-bottom: 0.5066666666666667rem;
  position: relative;
}
.userBtcInt > p {
  padding-left: 0.5333333333333333rem;
}
.userBtcInt > p:nth-child(1) {
  margin-bottom: 0.3466666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.userBtcInt > p:nth-child(1) > span {
  font-size: 0.5333333333333333rem;
  color: #19001d;
}
.userBtcInt > p:nth-child(2) {
  font-size: 0.32rem;
  color: #373d41;
}
.BasicInformation {
  width: 9.36rem;
  margin: auto;
  margin-bottom: 0.7733333333333333rem;
  position: relative;
}
.BasicInformation:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.BasicInformation > div:nth-child(1),
.BasicInformation > div:nth-child(2),
.BasicInformation > div:nth-child(3) {
  float: left;
}
.BasicInformation > div:nth-child(1) {
  width: 1.6rem;
  height: 1.6266666666666667rem;
  margin-top: 0.5066666666666667rem;
  border-radius: 50%;
}
.BasicInformation > div:nth-child(1) > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.BasicInformation > div:nth-child(2) > p {
  padding-left: 0.32rem;
}
.BasicInformation > div:nth-child(2) > p:nth-child(1) {
  margin-top: 0.7733333333333333rem;
  margin-bottom: 0.21333333333333335rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.BasicInformation > div:nth-child(2) > p:nth-child(2) {
  font-size: 0.32rem;
  color: rgba(55, 61, 65, 0.5);
}
.AccountSetting {
  position: absolute;
  right: 0;
  margin-top: 1.12rem;
}
.AccountSetting > span:nth-child(1) {
  font-size: 0.32rem;
  color: #949494;
}
.AccountSetting > span:nth-child(2) {
  display: inline-block;
  width: 0.16rem;
  height: 0.32rem;
  background: url("../../static/img/YMB_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.02666666666666667rem;
  margin-left: 0.21333333333333335rem;
}
.meRelease {
  width: 9.36rem;
  margin: auto;
  position: relative;
}
.meRelease:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.meRelease > div {
  float: left;
}
.meRelease > div:nth-child(1) {
  width: 0.5333333333333333rem;
  height: 0.5333333333333333rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0.32rem;
  margin: auto;
}
.meRelease > div:nth-child(1) > img {
  width: 100%;
  height: 100%;
}
.meRelease > div:nth-child(2) {
  margin-left: 1.1733333333333333rem;
  margin-top: 0.5333333333333333rem;
  margin-bottom: 0.5333333333333333rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.meRelease > div:nth-child(3) {
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/YMB_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0.32rem;
  margin: auto;
}
.meReleaseUl {
  margin-bottom: 0.4266666666666667rem;
}
.meReleaseUl > li {
  background: #fff;
}
.meReleaseUl > li:nth-child(2) > div,
.meReleaseUl > li:nth-child(4) > div {
  border-bottom: 1px solid #f2f2f2;
}
.meReleaseUl > li:nth-child(1),
.meReleaseUl > li:nth-child(3) {
  margin-bottom: 0.21333333333333335rem;
}
.signOutBtn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fff;
  margin-bottom: 2rem;
  font-size: 0.4266666666666667rem;
}
.userBtcInt > div:nth-child(3) {
  width: 0.16rem;
  height: 0.32rem;
  position: absolute;
  right: 0.5066666666666667rem;
  top: 0;
  bottom: 0;
  margin: auto;
  background: url("../../static/img/return@2x.png") no-repeat;
  background-size: 100% 100%;
}
.QRtuichu{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0,0,0,0.50);
  z-index: 200;
}
.onTheQRtuichu{
  width: 8rem;
  height: 3.9466666666666668rem;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin:auto;
  border-radius:0.10666666666666667rem;
}
.QRtuichuText{
  font-size: 0.4266666666666667rem;
  color: #373D41;
  text-align: center;
  margin-top: 1.12rem;
}
.onTheQRtuichu>button{
  width: 50%;
  height: 1.1733333333333333rem;
  box-sizing: border-box;
  border: 0;
  border-top: 1px solid #DFDFDF; 
  background: #fff;
  font-size: 0.4266666666666667rem;
}
.onTheQRtuichu>button:nth-child(2){
  position: absolute;
  bottom: 0;
  left: 0;
  border-right: 1px solid #dfdfdf;
  color: #373D41;
}
.onTheQRtuichu>button:nth-child(3){
  position: absolute;
  bottom: 0;
  right: 0;
  color: #FC3D39;
}
</style>


