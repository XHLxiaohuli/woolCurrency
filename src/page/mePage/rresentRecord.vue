<template>
    <div>
        <div class="rresentRecordHeader">
            <div>提现记录</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <ul class="rresentRecordUl" v-if="isNoData">
            <li v-for="(item,index) in rresentRecordData" @click="jumpGiveDetails(index)">
                <div><span :class="{complete:item.status==1,fail:item.status==2,inThePresent:item.status==3}"></span><span>YMB {{item.ymbNum}}</span></div>
                <div><span v-if="item.status==1">提现中</span><span v-if="item.status==2">提现成功</span><span v-if="item.status==3">提现失败</span><span></span></div>
                <div>{{item.towCreateTime}}</div>
            </li>
        </ul> 
        <!--没数据时-->
        <div class="resentNoData" v-if="!isNoData">
          <div class="NoDataPic"></div>
          <p class="NoDataText">亲，暂时还没有出现提现订单哦</p>
        </div> 
    </div>
</template>
<script>
import { storeSet, storeGet, timestampToTime } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      rresentRecordData: "",
      isNoData: true
    };
  },
  methods: {
    back() {
      this.$router.push("/meAssets");
    },
    jumpGiveDetails(index) {
      this.$router.push("/giveDetails/" + index);
    },
    sendPutforward() {
      storeSet("userID", this.$route.params.isUserId);
      let params = {
        userId: this.$route.params.isUserId,
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
        if (res.data.code == 200) {
          this.isNoData = true;
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i]["towCreateTime"] = timestampToTime(
              res.data.page.list[i].createTime
            );
          }
          this.rresentRecordData = res.data.page.list;
        } else {
          this.isNoData = false;
        }
      });
    }
  },
  created() {
    this.sendPutforward();
  }
};
</script>
<style scoped>
.rresentRecordHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.rresentRecordHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.rresentRecordHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.rresentRecordHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.rresentRecordHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.rresentRecordUl {
  width: 100%;
  margin-top: 1.0666666666666667rem;
  background: #fff;
}
.rresentRecordUl > li {
  width: 100%;
  margin: auto;
}
.rresentRecordUl > li:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.rresentRecordUl > li > div:nth-child(1) {
  margin-left: 0.32rem;
}
.rresentRecordUl > li > div:nth-child(1) > span:nth-child(1) {
  display: inline-block;
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 50%;
  margin-right: 0.32rem;
}
.rresentRecordUl > li > div:nth-child(1) > span:nth-child(2) {
  font-size: 0.48rem;
  color: #373d41;
}
.rresentRecordUl > li > div:nth-child(2) {
  width: 100%;
  text-align: right;
}
.rresentRecordUl > li > div:nth-child(2) > span:nth-child(1) {
  font-size: 0.37333333333333335rem;
  color: #949494;
}
.rresentRecordUl > li > div:nth-child(2) > span:nth-child(2) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/return@2x.png") no-repeat;
  background-size: 100% 100%;
  margin-left: 0.18666666666666668rem;
  position: relative;
  top: 0.04rem;
  margin-right: 0.29333333333333333rem;
}
.rresentRecordUl > li > div:nth-child(3) {
  float: right;
  width: 9.093333333333334rem;
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 0.7733333333333333rem;
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-bottom: 0.7733333333333333rem;
}
.complete {
  /* background: #68d845; */
  background: #fec82f;
}
.fail {
  /* background: #fc3d39; */
  background: #68d845;
}
.inThePresent {
  /* background: #fec82f; */
  background: #fc3d39;
}
.resentNoData {
  background: #fff;
  margin-top: 5.386666666666667rem;
}
.NoDataPic {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  margin: auto;
  background: url("../../static/img/images_deposito@3x.png") no-repeat;
  background-size: 100% 100%;
}
.NoDataText {
  font-size: 0.4266666666666667rem;
  color: #949494;
  text-align: center;
  padding-top: 0.32rem;
}
</style>


