<template>
    <div>
        <div class="meAssetsHeader">
            <div>我的资产</div>
            <div @click="back"><span></span><span>返回</span></div>
            <div @click="jumpRresentRecord">提现记录</div>
        </div> 
        <div class="assetsCatalog">
            <p>总资产(YMB)</p>
            <p>{{assetsYmb}}</p>
            <button @click="jumpPurse">提到钱包</button>
        </div>
        <div class="accumulativeAcquisition">
            <div>发布项目累计获得</div>
            <div>{{accumulativeAcquisitionYmb}}</div>
        </div>
        <p class="otherAcquisition">其他获得记录</p>
        <ul class="recordTextUl">
            <li v-for="item in recordText">{{item}}</li>
        </ul>
        <ul class="otherUl">
            <li v-for="item in meAssetsData">
                <div>{{item.time}}</div>
                <div>+{{item.ymbNum}}</div>
                <div>
                    <span v-if="item.remark==1">投票获得</span><span v-if="item.remark==2">邀请获得</span><span v-if="item.remark==3">注册获得</span><span v-if="item.remark==4">签到获得</span><span v-if="item.remark==5">项目被投票获得</span><span v-if="item.remark==6">提现失败返还获得</span>
                </div>
            </li>
        </ul>
        <div class="allOtherRecord"><span @click="jumpAcquisitionOfRecords">查看全部记录</span><span @click="jumpAcquisitionOfRecords"></span></div>
    </div>
</template>
<script>
import {
  storeGet,
  timestampToTime,
  sesGetStorage,
  sesStorage
} from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      assetsYmb: "",
      accumulativeAcquisitionYmb: "",
      recordText: ["时间", "数量", "备注"],
      meAssetsData: ""
    };
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/me");
    },
    jumpPurse() {
      if (sesGetStorage("isCertification") == 0) {
        this.$router.push("/realName");
      } else if (sesGetStorage("isCertification") == 1) {
        this.$router.push("/purse");
      }
    },
    jumpRresentRecord() {
      this.$router.push("/rresentRecord/" + storeGet("userID"));
    },
    jumpAcquisitionOfRecords() {
      this.$router.push("/acquisitionOfRecords");
    },
    sendData() {
      //获取账户信息
      let params = {
        userId: storeGet("userID")
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = ["requestId=" + myRequestId, "userId=" + storeGet("userID")];
      let a =
        Encrypt.myFunction(myArr) + iconfig.ips.account_getuseraccountinfo;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.account.account_getuseraccountinfo(params, headers).then(res => {
        this.assetsYmb = res.data.data.ymbNum;
        this.accumulativeAcquisitionYmb = res.data.data.publishItemYmbNum;
      });
      //获取其他记录
      let imparams = {
        userId: storeGet("userID"),
        currentPage: 1,
        pageSize: 10
      };
      let imyRequestId = Encrypt.myUuid();
      let imyTimestamp = Math.round(new Date().getTime()).toString();
      let imyArr = [
        "requestId=" + imyRequestId,
        "userId=" + storeGet("userID"),
        "currentPage=" + 1,
        "pageSize=" + 10
      ];
      let ia =
        Encrypt.myFunction(imyArr) + iconfig.ips.account_queryaccountlistpage;

      let imyValues = md5(ia).toUpperCase();
      let iheaders = {
        requestId: imyRequestId,
        timestamp: imyTimestamp,
        channelType: "h5",
        sign: imyValues
      };
      api.account.account_queryaccountlistpage(imparams, iheaders).then(res => {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i]["time"] = timestampToTime(
              res.data.page.list[i].createTime
            );
          }
          this.meAssetsData = res.data.page.list;
        }
      });
    },
    sendUserData() {
      let params = {
        userId: storeGet("userID")
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = ["requestId=" + myRequestId, "userId=" + storeGet("userID")];
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
          sesStorage("isCertification", res.data.data.isCertification);
        }
      });
    }
  },
  created() {
    this.sendData();
    this.sendUserData();
  }
};
</script>
<style scoped>
.meAssetsHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.meAssetsHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.meAssetsHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.meAssetsHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.meAssetsHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.meAssetsHeader > div:nth-child(3) {
  position: absolute;
  right: 0.32rem;
  top: 0.4666666666666667rem;
  margin: auto;
  font-size: 0.32rem;
  color: #373d41;
}
.assetsCatalog {
  width: 100%;
  height: 3.5733333333333333rem;
  background: url("../../static/img/我的资产@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.assetsCatalog > p:nth-child(1) {
  padding-left: 0.32rem;
  padding-top: 0.8rem;
  font-size: 0.37333333333333335rem;
  color: rgba(255, 255, 255, 0.6);
}
.assetsCatalog > p:nth-child(2) {
  padding-left: 0.32rem;
  font-size: 0.8rem;
  color: #ffffff;
  font-weight: 300;
  margin-top: 0.5333333333333333rem;
}
.assetsCatalog > button:nth-child(3) {
  border: 0;
  padding: 0;
  padding: 0.16rem 0.32rem;
  border: 1px solid #fff;
  box-sizing: border-box;
  position: absolute;
  right: 0.32rem;
  bottom: 0.9333333333333333rem;
  background: transparent;
  font-size: 0.37333333333333335rem;
  color: #ffffff;
  border-radius: 2.6666666666666665rem;
}
.accumulativeAcquisition {
  width: 9.36rem;
  margin: auto;
  height: 1.6533333333333333rem;
  margin-top: 0.5333333333333333rem;
  border-bottom: 1px solid #f2f2f2;
}
.accumulativeAcquisition:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.accumulativeAcquisition > div:nth-child(1) {
  float: left;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.accumulativeAcquisition > div:nth-child(2) {
  float: right;
  font-size: 0.4266666666666667rem;
  color: #ff721f;
}
.accumulativeAcquisition > div {
  line-height: 1.6533333333333333rem;
}
.otherAcquisition {
  width: 9.36rem;
  margin: auto;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  padding-top: 0.56rem;
  padding-bottom: 0.5333333333333333rem;
}
.recordTextUl {
  width: 100%;
  margin-bottom: 0.32rem;
}
.recordTextUl:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.recordTextUl > li {
  float: left;
  width: 3.066666666666667rem;
  font-size: 0.3466666666666667rem;
  color: #949494;
  text-align: center;
}
.recordTextUl > li:nth-child(1) {
  width: 3.8666666666666667rem;
}
.otherUl {
  width: 100%;
  background: #fff;
  margin-top: 0.32rem;
}
.otherUl > li {
  width: 100%;
  margin: auto;
  margin-bottom: 0.32rem;
}
.otherUl > li:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.otherUl > li > div {
  float: left;
  width: 3.066666666666667rem;
}
.otherUl > li > div:nth-child(1) {
  width: 3.8666666666666667rem;
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.otherUl > li > div:nth-child(2) {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #ff721f;
}
.otherUl > li > div:nth-child(3) {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.allOtherRecord {
  width: 100%;
  text-align: center;
  padding-top: 0.32rem;
}
.allOtherRecord > span:nth-child(1) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.allOtherRecord > span:nth-child(2) {
  display: inline-block;
  width: 0.16rem;
  height: 0.32rem;
  background: url("../../static/img/YMB_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.02666666666666667rem;
  margin-left: 0.05333333333333334rem;
}
</style>


