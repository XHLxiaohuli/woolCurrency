<template>
    <div>
        <div class="giveDetailsHeader">
            <div>提现详情</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div> 
        <div class="giveDetailsContainer" v-for="item in giveDetailsData" >
            <p><span>{{item.statusText}}</span></p>
            <div><span>数量</span><span>{{item.ymbNum}}</span></div>
            <p>地址</p>
            <p>{{item.ethAddress}}</p>
            <p>日期</p>
            <p>{{item.time}}</p>
            <p>备注</p>
            <p>{{item.remark}}</p>
            <div><img :src="item.voucherUrl" alt=""></div>
        </div>
        <div class="giveDetailsNoData" v-if="false">
            <div></div>
            <p>亲，暂时还没有出现提现订单哦</p>
        </div>
    </div>
</template>
<script>
import { storeGet, timestampToTime } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      giveDetailsData: []
    };
  },
  methods: {
    back() {
      this.$router.push("/rresentRecord/" + storeGet("userID"));
    },
    giveDetailsFun() {
      var indexDetails = parseInt(this.$route.params.myindex);
      let params = {
        userId: storeGet("userID"),
        currentPage: 1
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "currentPage=" + 1
      ];
      let a =
        Encrypt.myFunction(myArr) + iconfig.ips.account_querycashinfolistpage;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.account.account_querycashinfolistpage(params, headers).then(res => {
        if (res.data.page.list[indexDetails].status == 1) {
          res.data.page.list[indexDetails]["statusText"] = "提现中";
        } else if (res.data.page.list[indexDetails].status == 2) {
          res.data.page.list[indexDetails]["statusText"] = "提现成功";
        } else if (res.data.page.list[indexDetails].status == 3) {
          res.data.page.list[indexDetails]["statusText"] = "提现失败";
        }
        res.data.page.list[indexDetails]["time"] = timestampToTime(
          res.data.page.list[indexDetails].createTime
        );
        this.giveDetailsData.push(res.data.page.list[indexDetails]);
      });
    }
  },
  created() {
    this.giveDetailsFun();
  }
};
</script>
<style scoped>
.giveDetailsHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.giveDetailsHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.giveDetailsHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.giveDetailsHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.giveDetailsHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.giveDetailsContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.04rem;
}
.giveDetailsContainer > p:nth-child(1) {
  font-size: 0.5333333333333333rem;
  color: #373d41;
}
.giveDetailsContainer > div:nth-child(2) {
  margin-top: 0.56rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #f2f2f2;
}
.giveDetailsContainer > div:nth-child(2):after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.giveDetailsContainer > div:nth-child(2) > span:nth-child(1) {
  float: left;
  font-size: 0.3466666666666667rem;
  color: #949494;
}
.giveDetailsContainer > div:nth-child(2) > span:nth-child(2) {
  float: right;
  font-size: 0.5333333333333333rem;
  color: #373d41;
}
.giveDetailsContainer > p:nth-child(3) {
  font-size: 0.3466666666666667rem;
  color: #949494;
  margin-top: 0.5066666666666667rem;
}
.giveDetailsContainer > p:nth-child(4) {
  width: 100%;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  word-wrap: break-word;
  line-height: 0.56rem;
  padding-top: 0.26666666666666666rem;
}
.giveDetailsContainer > p:nth-child(5) {
  font-size: 0.3466666666666667;
  color: #949494;
  margin-top: 0.5333333333333333rem;
}
.giveDetailsContainer > p:nth-child(6) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  margin-top: 0.26666666666666666rem;
  line-height: 0.64rem;
}
.giveDetailsContainer > p:nth-child(7) {
  font-size: 0.3466666666666667rem;
  color: #949494;
  margin-top: 0.5333333333333333rem;
}
.giveDetailsContainer > p:nth-child(8) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  line-height: 0.64rem;
  margin-top: 0.26666666666666666rem;
}
.giveDetailsContainer > div:nth-child(9) {
  width: 100%;
  height: 5.333333333333333rem;
}
.giveDetailsContainer > div:nth-child(9) > img {
  width: 100%;
  height: 100%;
}
.giveDetailsNoData {
  width: 100%;
  margin-top: 5.386666666666667rem;
}
.giveDetailsNoData > div:nth-child(1) {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  margin: auto;
  background: url("../../static/img/images_depositno@2x.png") no-repeat;
  background-size: 100% 100%;
}
.giveDetailsNoData > p:nth-child(2) {
  font-size: 0.4266666666666667rem;
  color: #949494;
  text-align: center;
  margin-top: 0.32rem;
}
</style>


