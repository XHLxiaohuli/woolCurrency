<template>
    <div>
        <div class="YqZcFlHeader">
            <div>新币榜注册领YMB福利</div>
            <div @click="back"><span></span></div>
        </div>
        <div class="YqZcFlMain">
            <p class="Gxn">恭喜您</p>
            <p class="Gxn1">{{HdYmb}}YMB领取成功</p>
            <p class="Gxn2">找项目，就上新币榜</p>
            <button class="Gxn3Btn"><a href="https://www.bibang.top/ymb/api/appDownload/appIos.do">iOS版下载</a></button>
            <button class="Gxn4Btn"><a href="https://www.bibang.top/ymb/api/appDownload/appAndroid.do">安卓版下载</a></button>
            <span class="GxnSpan1"></span>
            <span class="GxnSpan2"></span>
            <div class="GxnSpan3"></div>
        </div>
    </div>
</template>
<script>
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      HdYmb: ""
    };
  },
  created() {
    this.sendYQ();
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/vote");
    },
    sendYQ() {
      //可获得币数
      let imparams = {};
      let immyRequestId = Encrypt.myUuid();
      let immyTimestamp = Math.round(new Date().getTime()).toString();
      let immyArr = ["requestId=" + immyRequestId];
      let ima =
        Encrypt.myFunction(immyArr) + iconfig.ips.invite_register_Number;
      let immyValues = md5(ima).toUpperCase();
      let imheaders = {
        requestId: immyRequestId,
        timestamp: immyTimestamp,
        channelType: "h5",
        sign: immyValues
      };
      api.invite.invite_registerNumber(imparams, imheaders).then(res => {
        this.HdYmb = res.data.extData.registerGetNum;
      });
    }
  }
};
</script>
<style scoped>
.YqZcFlHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.YqZcFlHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.YqZcFlHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.YqZcFlHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.37333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_delete@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.YqZcFlMain {
  width: 100%;
  height: 16.08rem;
  background: url("../../static/img/下载页面@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.Gxn {
  text-align: center;
  font-size: 0.4266666666666667rem;
  color: #ffffff;
  padding-top: 2.0533333333333332rem;
}
.Gxn1 {
  text-align: center;
  font-size: 0.5333333333333333rem;
  color: #ffffff;
  padding-top: 0.32rem;
  font-weight: bolder;
}
.Gxn2 {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #ffffff;
  margin-top: 2.5866666666666664rem;
}
.Gxn3Btn {
  display: block;
  border: 0;
  width: 5.546666666666667rem;
  height: 1.3866666666666667rem;
  margin: auto;
  margin-top: 0.7466666666666667rem;
  background: url("../../static/img/Recommen2.png") no-repeat;
  background-size: 100% 100%;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  font-weight: bolder;
}
.Gxn4Btn {
  display: block;
  border: 0;
  width: 5.546666666666667rem;
  height: 1.3866666666666667rem;
  margin: auto;
  background: url("../../static/img/下载按钮@2x.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 0.5866666666666667rem;
}
.Gxn4Btn > a,
.Gxn3Btn > a {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  font-weight: bolder;
}
.GxnSpan1 {
  position: absolute;
  left: 3.066666666666667rem;
  top: 14.533333333333333rem;
  font-size: 0.32rem;
  color: #373d41;
}
.GxnSpan2 {
  position: absolute;
  right: 3.066666666666667rem;
  top: 14.533333333333333rem;
  font-size: 0.32rem;
  color: #373d41;
}
/* .GxnSpan3{
    border-left: 1px solid #949494;
    width: 1px;
    height: 0.26666666666666666rem;
    position: absolute;
    left: 4.96rem;
    top: 14.586666666666666rem;
} */
</style>


